import crypto from 'crypto'
import { getSupabaseAdmin } from './_lib/auth.js'
import { sendAuditEmails } from './_lib/email.js'

// Allowed audit types
const ALLOWED_AUDIT_TYPES = [
  'Website design & user experience',
  'SEO & search visibility',
  'Performance & technical issues',
  'Complete digital experience',
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

// Periodic cleanup of rate limit entries
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
  return str.replace(/[\u0000-\u0008\u000B-\u001F\u007F-\u009F]/g, '').trim()
}

function normalizeUrl(rawUrl) {
  let url = (rawUrl || '').trim()
  if (!url) return ''
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url
  }
  return url
}

function hashIp(rawIp) {
  if (!rawIp) return 'unknown_ip'
  return crypto.createHash('sha256').update(rawIp).digest('hex').slice(0, 16)
}

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Content-Type', 'application/json')

  // 1. Method check: only POST is allowed
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Only POST audit requests are accepted.',
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
      error: 'Too many audit requests submitted. Please wait 15 minutes before submitting again.',
    })
  }

  // 3. Honeypot check for bots
  const body = req.body || {}
  const honeypot = body.website_hp || body.hp_audit || body.hp_field
  if (honeypot && String(honeypot).trim().length > 0) {
    return res.status(200).json({
      success: true,
      message: 'Audit request received successfully.',
    })
  }

  // 4. Input Validation
  const errors = {}

  // Name
  const rawName = sanitizeText(body.name || body.full_name)
  if (!rawName) {
    errors.name = 'Full name is required.'
  } else if (rawName.length < 2) {
    errors.name = 'Full name must be at least 2 characters.'
  } else if (rawName.length > 100) {
    errors.name = 'Full name must not exceed 100 characters.'
  }

  // Email
  const rawEmail = sanitizeText(body.email || body.work_email).toLowerCase()
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
  if (!rawEmail) {
    errors.email = 'Work email is required.'
  } else if (!emailRegex.test(rawEmail)) {
    errors.email = 'Please provide a valid work email address.'
  } else if (rawEmail.length > 120) {
    errors.email = 'Email must not exceed 120 characters.'
  }

  // Website URL
  const rawWebsite = sanitizeText(body.website || body.website_url)
  const normalizedWebsite = normalizeUrl(rawWebsite)
  if (!rawWebsite) {
    errors.website = 'Website URL is required.'
  } else {
    try {
      const parsed = new URL(normalizedWebsite)
      if (!parsed.hostname || !parsed.hostname.includes('.')) {
        errors.website = 'Please provide a valid website address with a domain (e.g. https://yourcompany.com).'
      } else if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        errors.website = 'Website URL must use http:// or https://'
      } else if (normalizedWebsite.length > 255) {
        errors.website = 'Website URL must not exceed 255 characters.'
      }
    } catch {
      errors.website = 'Please provide a valid website URL.'
    }
  }

  // Audit Type
  const rawAuditType = sanitizeText(body.auditType || body.audit_type)
  if (!rawAuditType) {
    errors.auditType = 'Please select the focus of your audit.'
  } else if (!ALLOWED_AUDIT_TYPES.includes(rawAuditType)) {
    errors.auditType = `Invalid audit type. Must be one of: ${ALLOWED_AUDIT_TYPES.join(', ')}.`
  }

  // Biggest Challenge (Optional)
  const rawChallenge = sanitizeText(body.challenge || body.biggest_challenge)
  if (rawChallenge && rawChallenge.length > 1000) {
    errors.challenge = 'Challenge description must not exceed 1000 characters.'
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      validationErrors: errors,
      message: 'Please resolve the highlighted validation errors.',
    })
  }

  // 5. Database Connection (Supabase Service Role)
  const supabase = getSupabaseAdmin()
  if (!supabase) {
    console.warn('[Server API /api/audit] Supabase credentials missing in server environment.')
    return res.status(503).json({
      success: false,
      code: 'DATABASE_NOT_CONFIGURED',
      message:
        'The Northup Studio audit storage service is currently initializing. Please email your website directly to northup4work@gmail.com.',
    })
  }

  try {
    const payload = {
      full_name: rawName,
      work_email: rawEmail,
      website_url: normalizedWebsite,
      audit_type: rawAuditType,
      biggest_challenge: rawChallenge || null,
      source: sanitizeText(body.source) || 'northup_studio_hero_audit',
      status: 'new',
      metadata: {
        ip_hash: clientIpHash,
        user_agent: (req.headers['user-agent'] || '').slice(0, 150),
        referer: (req.headers['referer'] || '').slice(0, 150),
      },
    }

    const { data, error } = await supabase
      .from('audit_requests')
      .insert([payload])
      .select('id, created_at, full_name, work_email, website_url, audit_type, biggest_challenge')
      .single()

    if (error) {
      console.error('[Server API /api/audit] Database insert error code:', error.code, error.message)

      if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
        return res.status(503).json({
          success: false,
          code: 'TABLE_MIGRATION_PENDING',
          message:
            'The audit_requests table is pending creation in Supabase. Please execute the migration supabase/migrations/20261102_create_audit_requests_table.sql in the Supabase SQL editor.',
        })
      }

      return res.status(500).json({
        success: false,
        code: 'DATABASE_INSERT_ERROR',
        message: 'Could not record your audit request due to a database error. Please try again.',
      })
    }

    // 6. Automated Email Notifications via Resend (Safe & Non-blocking)
    const siteUrl = process.env.VITE_SITE_URL || 'https://northupstudio.vercel.app'
    let emailStatus = { skipped: true }
    try {
      emailStatus = await sendAuditEmails({
        auditRequest: {
          id: data.id,
          created_at: data.created_at,
          full_name: data.full_name,
          work_email: data.work_email,
          website_url: data.website_url,
          audit_type: data.audit_type,
          biggest_challenge: data.biggest_challenge,
        },
        siteUrl,
      })
    } catch (emailErr) {
      console.warn('[Server API /api/audit] Email notification error (audit request was saved):', emailErr.message)
    }

    return res.status(200).json({
      success: true,
      auditId: data.id,
      message:
        'Thank you! Your audit request has been securely recorded. The Northup Studio team will review your website and follow up within 24–48 hours.',
      emailDelivery: emailStatus.success ? 'sent' : emailStatus.skipped ? 'skipped' : 'pending_retry',
    })
  } catch (err) {
    console.error('[Server API /api/audit] Unexpected server error:', err.message)
    return res.status(500).json({
      success: false,
      code: 'SERVER_EXCEPTION',
      message: 'An unexpected error occurred while processing your audit request. Please try again.',
    })
  }
}
