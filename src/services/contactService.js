/**
 * NORTHUP STUDIO — Contact Service (Phase 3)
 * Handles client-side validation and secure submission to /api/contact.
 */

export const CONTACT_SERVICES = [
  'Website Design',
  'Web Development',
  'UI/UX Design',
  'Branding',
  'Other',
]

export const CONTACT_BUDGETS = [
  '< $5,000',
  '$5,000 – $10,000',
  '$10,000 – $25,000',
  '$25,000+',
  'Flexible / Undisclosed',
]

export const CONTACT_TIMELINES = [
  'Immediately (< 2 weeks)',
  '1 – 2 months',
  '2 – 3 months',
  'Flexible',
]

/**
 * Validates the contact form fields.
 */
export function validateContactForm(data) {
  const errors = {}

  // Full name — required
  const trimmedName = (data.name || '').trim()
  if (!trimmedName) {
    errors.name = 'Full name is required.'
  } else if (trimmedName.length < 2) {
    errors.name = 'Please enter your full name (minimum 2 characters).'
  } else if (trimmedName.length > 100) {
    errors.name = 'Name must be 100 characters or fewer.'
  }

  // Work email — required
  const trimmedEmail = (data.email || '').trim().toLowerCase()
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
  if (!trimmedEmail) {
    errors.email = 'Work email is required.'
  } else if (!emailRegex.test(trimmedEmail)) {
    errors.email = 'Please provide a valid work email address.'
  } else if (trimmedEmail.length > 120) {
    errors.email = 'Email must be 120 characters or fewer.'
  }

  // Company — optional
  const trimmedCompany = (data.company || '').trim()
  if (trimmedCompany.length > 120) {
    errors.company = 'Company name must be 120 characters or fewer.'
  }

  // Service — required
  if (!data.service || !CONTACT_SERVICES.includes(data.service)) {
    errors.service = 'Please select a service.'
  }

  // Budget — optional
  if (data.budget && !CONTACT_BUDGETS.includes(data.budget)) {
    errors.budget = 'Please select a valid budget range.'
  }

  // Timeline — optional
  if (data.timeline && !CONTACT_TIMELINES.includes(data.timeline)) {
    errors.timeline = 'Please select a valid timeline.'
  }

  // Project description — required
  const trimmedDesc = (data.project_description || '').trim()
  if (!trimmedDesc) {
    errors.project_description = 'Project description is required.'
  } else if (trimmedDesc.length < 10) {
    errors.project_description = 'Please tell us a bit more about your project (at least 10 characters).'
  } else if (trimmedDesc.length > 3000) {
    errors.project_description = 'Description must be 3000 characters or fewer.'
  }

  // Privacy consent — required
  if (!data.privacy_consent) {
    errors.privacy_consent = 'Please accept the privacy policy to submit your enquiry.'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Dispatches the contact enquiry to the server-side endpoint.
 */
export async function submitContactEnquiry(formData) {
  // 1. Client-side validation check
  const validation = validateContactForm(formData)
  if (!validation.isValid) {
    return {
      success: false,
      validationErrors: validation.errors,
      message: 'Please review and resolve the highlighted fields.',
    }
  }

  const payload = {
    name: formData.name.trim(),
    email: formData.email.trim(),
    company: (formData.company || '').trim() || null,
    service: formData.service,
    budget: formData.budget || null,
    timeline: formData.timeline || null,
    project_description: formData.project_description.trim(),
    privacy_consent: Boolean(formData.privacy_consent),
    website_hp: formData.website_hp || '', // bot honeypot
    source: formData.source || 'website_contact_form',
  }

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok) {
      if (response.status === 400 && result?.validationErrors) {
        return {
          success: false,
          validationErrors: result.validationErrors,
          message: result.message || 'Validation error on submission.',
        }
      }

      if (response.status === 429) {
        return {
          success: false,
          message: result?.error || 'Rate limit reached. Please wait a few moments before trying again.',
        }
      }

      if (response.status === 503) {
        return {
          success: false,
          code: 'DATABASE_NOT_CONFIGURED',
          message:
            result?.message ||
            'Lead intake is currently being configured on the server. Please contact northup4work@gmail.com directly.',
        }
      }

      return {
        success: false,
        message:
          result?.message ||
          result?.error ||
          'Unable to submit your enquiry at this time. Please try again or reach out directly.',
      }
    }

    return {
      success: true,
      leadId: result?.leadId,
      message:
        result?.message ||
        'Thank you! Your project enquiry has been securely received. We will respond within 24–48 hours.',
    }
  } catch (networkError) {
    return {
      success: false,
      message:
        'A network error occurred while submitting your enquiry. Please check your internet connection and try again.',
      details: networkError.message,
    }
  }
}
