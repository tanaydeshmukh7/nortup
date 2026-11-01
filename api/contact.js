import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

// Allowed choices
const ALLOWED_SERVICES = [
  'Website Design',
  'Web Development',
  'UI/UX Design',
  'Branding',
  'Other',
]

const ALLOWED_BUDGETS = [
  '< $5,000',
  '$5,000 – $10,000',
  '$10,000 – $25,000',
  '$25,000+',
  'Flexible / Undisclosed',
]

const ALLOWED_TIMELINES = [
  'Immediately (< 2 weeks)',
  '1 – 2 months',
  '2 – 3 months',
  'Flexible',
]

// Simple in-memory rate limiting per serverless container
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 5
const ipRequestHistory = new Map()

function isRateLimited(ipHash) {
  const now = Date.now()
  const history = ipRequestHistory.get(ipHash) || []
  const recent = history.filter((time) => now - time < RATE_LIMIT_WINDOW_MS)

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    return true
  }

  recent.push(now)
  ipRequestHistory.set(ipHash, recent)
  return false
}

// Cleanup stale rate limit entries periodically without holding event loop open
if (typeof setInterval !== 'undefined') {
  const cleanupTimer = setInterval(() => {
    const now = Date.now()
    for (const [ip, timestamps] of ipRequestHistory.entries()) {
      const valid = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
      if (valid.length === 0) {
        ipRequestHistory.delete(ip)
      } else {
        ipRequestHistory.set(ip, valid)
      }
    }
  }, 10 * 60 * 1000)
  if (cleanupTimer.unref) cleanupTimer.unref()
}

function sanitizeText(str) {
  if (typeof str !== 'string') return ''
  // Strip control characters, trim whitespace
  return str.replace(/[\u0000-\u0008\u000B-\u001F\u007F-\u009F]/g, '').trim()
}

function hashIp(rawIp) {
  if (!rawIp) return 'unknown_ip'
  return crypto.createHash('sha256').update(rawIp).digest('hex').slice(0, 16)
}

export default async function handler(req, res) {
  // CORS & Security Headers
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')

  // 1. Method check: only POST is allowed
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Only POST enquiries are accepted.',
    })
  }

  // 2. Client IP & Rate Limiting
  const forwardedFor = req.headers['x-forwarded-for']
  const rawIp = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : typeof forwardedFor === 'string'
    ? forwardedFor.split(',')[0].trim()
    : req.socket?.remoteAddress || '127.0.0.1'

  const clientIpHash = hashIp(rawIp)

  if (isRateLimited(clientIpHash)) {
    return res.status(429).json({
      success: false,
      error: 'Too many enquiry submissions. Please wait 15 minutes before submitting again.',
    })
  }

  // 3. Honeypot check for bots
  const body = req.body || {}
  const honeypot = body.website_hp || body.hp_field
  if (honeypot && String(honeypot).trim().length > 0) {
    // Silently acknowledge bots to defeat them without logging or saving
    return res.status(200).json({
      success: true,
      message: 'Enquiry received successfully.',
    })
  }

  // 4. Input Validation
  const errors = {}

  // Name
  const rawName = sanitizeText(body.name)
  if (!rawName) {
    errors.name = 'Full name is required.'
  } else if (rawName.length < 2) {
    errors.name = 'Full name must be at least 2 characters.'
  } else if (rawName.length > 100) {
    errors.name = 'Full name must not exceed 100 characters.'
  }

  // Email
  const rawEmail = sanitizeText(body.email).toLowerCase()
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
  if (!rawEmail) {
    errors.email = 'Work email is required.'
  } else if (!emailRegex.test(rawEmail)) {
    errors.email = 'Please provide a valid work email address.'
  } else if (rawEmail.length > 120) {
    errors.email = 'Email must not exceed 120 characters.'
  }

  // Company (Optional)
  const rawCompany = sanitizeText(body.company)
  if (rawCompany.length > 120) {
    errors.company = 'Company name must not exceed 120 characters.'
  }

  // Service (Required)
  const rawService = sanitizeText(body.service)
  if (!rawService) {
    errors.service = 'Please select a required service.'
  } else if (!ALLOWED_SERVICES.includes(rawService)) {
    errors.service = `Invalid service choice. Must be one of: ${ALLOWED_SERVICES.join(', ')}.`
  }

  // Budget (Optional)
  const rawBudget = sanitizeText(body.budget)
  if (rawBudget && rawBudget.length > 60) {
    errors.budget = 'Budget range format is invalid.'
  }

  // Timeline (Optional)
  const rawTimeline = sanitizeText(body.timeline)
  if (rawTimeline && rawTimeline.length > 60) {
    errors.timeline = 'Timeline format is invalid.'
  }

  // Project Description (Required)
  const rawDescription = sanitizeText(body.project_description)
  if (!rawDescription) {
    errors.project_description = 'Project description is required.'
  } else if (rawDescription.length < 10) {
    errors.project_description = 'Please provide a bit more detail (minimum 10 characters).'
  } else if (rawDescription.length > 3000) {
    errors.project_description = 'Project description must not exceed 3000 characters.'
  }

  // Privacy Consent (Required)
  if (body.privacy_consent !== true && body.privacy_consent !== 'true') {
    errors.privacy_consent = 'You must agree to the privacy policy to submit an enquiry.'
  }

  // If any validation errors exist, return 400 Bad Request
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      validationErrors: errors,
      message: 'Please resolve the highlighted validation errors.',
    })
  }

  // 5. Database Connection (Supabase Service Role)
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_KEY

  if (!supabaseUrl || !supabaseKey) {
    // Production diagnostic log without leaking private values
    console.warn('[Server API /api/contact] Database credentials missing in environment.');
    return res.status(503).json({
      success: false,
      code: 'DATABASE_NOT_CONFIGURED',
      message:
        'The Northup Studio lead storage service is currently being initialized. Please email your enquiry directly to northup4work@gmail.com.',
    })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    const payload = {
      name: rawName,
      email: rawEmail,
      company: rawCompany || null,
      service: rawService,
      budget: rawBudget || null,
      timeline: rawTimeline || null,
      project_description: rawDescription,
      source: sanitizeText(body.source) || 'website_contact_form',
      status: 'new',
      metadata: {
        ip_hash: clientIpHash,
        user_agent: (req.headers['user-agent'] || '').slice(0, 150),
        referer: (req.headers['referer'] || '').slice(0, 150),
      },
    }

    const { data, error } = await supabase
      .from('leads')
      .insert([payload])
      .select('id, created_at')
      .single()

    if (error) {
      console.error('[Server API /api/contact] Database error code:', error.code)
      return res.status(500).json({
        success: false,
        code: 'DATABASE_INSERT_ERROR',
        message: 'Could not record your enquiry due to a database error. Please try again.',
      })
    }

    // 6. Optional Email Notification via Resend (Safe & Non-blocking)
    const resendApiKey = process.env.RESEND_API_KEY
    const notificationEmail = process.env.CONTACT_NOTIFICATION_EMAIL || 'northup4work@gmail.com'

    if (resendApiKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Northup Studio <enquiries@northupstudio.vercel.app>',
            to: [notificationEmail],
            reply_to: rawEmail,
            subject: `[New Lead] ${rawService}: ${rawName} (${rawCompany || 'Individual'})`,
            html: `
              <h2>New Project Enquiry via Northup Studio</h2>
              <p><strong>Name:</strong> ${rawName}</p>
              <p><strong>Email:</strong> ${rawEmail}</p>
              <p><strong>Company:</strong> ${rawCompany || 'Not specified'}</p>
              <p><strong>Service:</strong> ${rawService}</p>
              <p><strong>Budget:</strong> ${rawBudget || 'Not specified'}</p>
              <p><strong>Timeline:</strong> ${rawTimeline || 'Not specified'}</p>
              <hr />
              <p><strong>Project Description:</strong></p>
              <p>${rawDescription.replace(/\n/g, '<br />')}</p>
              <hr />
              <p><small>Lead ID: ${data.id} | Timestamp: ${data.created_at}</small></p>
            `,
          }),
        })
      } catch (emailErr) {
        // Log safe warning; never fail the user's saved lead
        console.warn('[Server API /api/contact] Email notification error (lead was saved).')
      }
    }

    return res.status(200).json({
      success: true,
      leadId: data.id,
      message:
        'Thank you! Your project enquiry has been securely received. The Northup Studio team will review and respond within 24–48 hours.',
    })
  } catch (err) {
    console.error('[Server API /api/contact] Unexpected server error')
    return res.status(500).json({
      success: false,
      code: 'SERVER_EXCEPTION',
      message: 'An unexpected error occurred while processing your enquiry. Please try again.',
    })
  }
}
