/**
 * NORTHUP STUDIO — Audit Service (Phase 1 / Phase 2 Architecture)
 * Handles client-side validation and dispatches to Supabase or custom backend endpoint when configured.
 */

export const AUDIT_TYPES = [
  'Website design & user experience',
  'SEO & search visibility',
  'Performance & technical issues',
  'Complete digital experience',
]

/**
 * Validates audit form input values.
 * Returns { isValid: boolean, errors: Record<string, string> }
 */
export function validateAuditForm(data) {
  const errors = {}

  // 1. Full Name — required
  const trimmedName = (data.name || '').trim()
  if (!trimmedName) {
    errors.name = 'Full name is required.'
  } else if (trimmedName.length < 2) {
    errors.name = 'Please enter your full name (minimum 2 characters).'
  } else if (trimmedName.length > 100) {
    errors.name = 'Name must be 100 characters or fewer.'
  }

  // 2. Work Email — required
  const trimmedEmail = (data.email || '').trim()
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
  if (!trimmedEmail) {
    errors.email = 'Work email is required.'
  } else if (!emailRegex.test(trimmedEmail)) {
    errors.email = 'Please enter a valid work email address.'
  } else if (trimmedEmail.length > 120) {
    errors.email = 'Email must be 120 characters or fewer.'
  }

  // 3. Website URL — required
  const trimmedUrl = (data.website || '').trim()
  if (!trimmedUrl) {
    errors.website = 'Website URL is required.'
  } else {
    let testUrl = trimmedUrl
    if (!/^https?:\/\//i.test(testUrl)) {
      testUrl = 'https://' + testUrl
    }
    try {
      const parsed = new URL(testUrl)
      if (!parsed.hostname || !parsed.hostname.includes('.')) {
        errors.website = 'Please enter a valid website URL (e.g. https://yourcompany.com).'
      } else if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        errors.website = 'URL must begin with http:// or https://'
      }
    } catch {
      errors.website = 'Please enter a valid website URL (e.g. https://yourcompany.com).'
    }
  }

  // 4. Audit Type — required selection
  if (!data.auditType || !AUDIT_TYPES.includes(data.auditType)) {
    errors.auditType = 'Please select the type of audit you need.'
  }

  // 5. Biggest Challenge — optional multiline field
  const trimmedChallenge = (data.challenge || '').trim()
  if (trimmedChallenge.length > 1000) {
    errors.challenge = 'Challenge description must be 1000 characters or fewer.'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Normalizes URL with https:// if scheme is omitted
 */
export function normalizeWebsiteUrl(rawUrl) {
  const trimmed = (rawUrl || '').trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return 'https://' + trimmed
}

/**
 * Checks whether a production backend (Supabase or API endpoint) is configured.
 */
export function isBackendConfigured() {
  const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY
  const apiEndpoint = import.meta.env?.VITE_AUDIT_API_ENDPOINT
  return Boolean((supabaseUrl && supabaseAnonKey) || apiEndpoint)
}

/**
 * Submits the audit request.
 * - If Supabase or API endpoint is configured, performs real network insertion.
 * - If no backend exists yet, returns a clear configuration error without claiming success.
 * - Does not expose service-role keys or database secrets.
 */
export async function submitAuditRequest(formData) {
  // Validate before submission
  const validation = validateAuditForm(formData)
  if (!validation.isValid) {
    return {
      success: false,
      validationErrors: validation.errors,
      message: 'Please resolve the highlighted errors.',
    }
  }

  const payload = {
    full_name: formData.name.trim(),
    work_email: formData.email.trim().toLowerCase(),
    website_url: normalizeWebsiteUrl(formData.website),
    audit_type: formData.auditType,
    biggest_challenge: (formData.challenge || '').trim(),
    submitted_at: new Date().toISOString(),
    source: 'northup_studio_hero_audit',
  }

  const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY
  const apiEndpoint = import.meta.env?.VITE_AUDIT_API_ENDPOINT

  // Phase 1: No backend configured yet
  if (!supabaseUrl && !supabaseAnonKey && !apiEndpoint) {
    // Simulate brief realistic roundtrip
    await new Promise((resolve) => setTimeout(resolve, 450))
    return {
      success: false,
      backendConfigured: false,
      code: 'BACKEND_NOT_CONFIGURED',
      message:
        'Backend lead storage is pending configuration for Phase 2. Your audit request has not been saved yet.',
    }
  }

  // Phase 2: Live Supabase endpoint
  try {
    if (supabaseUrl && supabaseAnonKey) {
      const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/audit_requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Supabase error (${response.status}): ${errorText}`)
      }

      return {
        success: true,
        data: payload,
      }
    }

    if (apiEndpoint) {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`API error (${response.status})`)
      }

      return {
        success: true,
        data: payload,
      }
    }
  } catch (err) {
    return {
      success: false,
      backendConfigured: true,
      code: 'SUBMISSION_FAILED',
      message: 'Failed to submit your request due to a network or server error. Please try again.',
      details: err.message,
    }
  }

  return {
    success: false,
    message: 'Unknown submission error.',
  }
}
