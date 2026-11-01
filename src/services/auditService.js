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
 * Checks whether the production backend is configured.
 * Returns true as /api/audit endpoint is active.
 */
export function isBackendConfigured() {
  return true
}

/**
 * Submits the audit request to the production /api/audit serverless endpoint.
 * - Validates input fields client-side before sending.
 * - Dispatches payload to /api/audit which safely saves to Supabase and sends email notifications.
 * - Prevents exposing private database keys to the browser.
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
    name: formData.name.trim(),
    email: formData.email.trim().toLowerCase(),
    website: normalizeWebsiteUrl(formData.website),
    auditType: formData.auditType,
    challenge: (formData.challenge || '').trim(),
    source: 'northup_studio_hero_audit',
  }

  try {
    const response = await fetch('/api/audit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const contentType = response.headers.get('content-type') || ''
    let resData = {}
    if (contentType.includes('application/json')) {
      resData = await response.json()
    } else {
      const text = await response.text()
      throw new Error(`Unexpected server response: ${text.substring(0, 100)}`)
    }

    if (!response.ok) {
      return {
        success: false,
        code: resData.code || 'SUBMISSION_FAILED',
        message:
          resData.message ||
          resData.error ||
          'Failed to submit your request due to a server error. Please try again.',
        validationErrors: resData.validationErrors || null,
      }
    }

    return {
      success: true,
      auditId: resData.auditId,
      message: resData.message || 'Audit request received successfully.',
      emailDelivery: resData.emailDelivery,
      data: payload,
    }
  } catch (err) {
    return {
      success: false,
      code: 'NETWORK_ERROR',
      message:
        'Unable to complete submission due to a connection or server error. Your entered details remain preserved below. Please try again.',
      details: err.message,
    }
  }
}
