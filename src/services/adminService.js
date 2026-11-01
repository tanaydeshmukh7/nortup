import { supabase } from './supabaseClient'

/**
 * Retrieves the active Supabase Auth session token.
 */
async function getAuthHeaders() {
  if (!supabase) {
    throw new Error('Supabase client is not configured.')
  }

  const { data: { session }, error } = await supabase.auth.getSession()
  if (error || !session?.access_token) {
    throw new Error('No active authentication session. Please log in.')
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session.access_token}`,
  }
}

/**
 * Validates whether the current authenticated user is an authorized admin.
 */
export async function verifyAdminStatus() {
  try {
    const headers = await getAuthHeaders()
    const res = await fetch('/api/admin/auth-check', { method: 'GET', headers })
    
    // Safely check if response is JSON
    const contentType = res.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      const rawText = await res.text()
      console.warn('[verifyAdminStatus] Non-JSON response received:', rawText.substring(0, 100))
      return {
        authorized: false,
        status: res.status || 500,
        error: 'The server returned an unformatted response instead of JSON. If running locally, restart the dev server ("npm run dev") so the API endpoints are active.',
      }
    }

    const data = await res.json()

    if (!res.ok) {
      return {
        authorized: false,
        status: res.status,
        error: data.error || 'Authorization check failed.',
      }
    }

    return {
      authorized: true,
      user: data.user,
      role: data.role,
    }
  } catch (err) {
    return {
      authorized: false,
      status: 401,
      error: err.message,
    }
  }
}

/**
 * Fetches paginated leads with filters, search, and KPI metrics.
 */
export async function getAdminLeads({
  page = 1,
  pageSize = 15,
  search = '',
  status = 'all',
  service = 'all',
  sortOrder = 'desc',
} = {}) {
  const headers = await getAuthHeaders()
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    search: search.trim(),
    status,
    service,
    sortOrder,
  })

  const res = await fetch(`/api/admin/leads?${params.toString()}`, {
    method: 'GET',
    headers,
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch leads.')
  }

  return data
}

/**
 * Updates a lead's pipeline status.
 */
export async function updateLeadStatus(leadId, newStatus) {
  const headers = await getAuthHeaders()
  const res = await fetch('/api/admin/leads', {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ leadId, status: newStatus }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update lead status.')
  }

  return data.lead
}

/**
 * Updates CRM attributes for a lead (phone, follow-up date, completed, converted).
 */
export async function updateLeadCRM(leadId, updates = {}) {
  const headers = await getAuthHeaders()
  const res = await fetch('/api/admin/leads', {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ leadId, ...updates }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update lead CRM attributes.')
  }

  return data.lead
}

/**
 * Retrieves internal notes for a specific lead.
 */
export async function getLeadNotes(leadId) {
  const headers = await getAuthHeaders()
  const res = await fetch(`/api/admin/notes?leadId=${encodeURIComponent(leadId)}`, {
    method: 'GET',
    headers,
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch notes.')
  }

  return data.notes || []
}

/**
 * Creates a new private note for a lead.
 */
export async function addLeadNote(leadId, content) {
  const headers = await getAuthHeaders()
  const res = await fetch('/api/admin/notes', {
    method: 'POST',
    headers,
    body: JSON.stringify({ leadId, content }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Failed to save internal note.')
  }

  return data.note
}

/**
 * Deletes an internal note.
 */
export async function deleteLeadNote(noteId) {
  const headers = await getAuthHeaders()
  const res = await fetch(`/api/admin/notes?noteId=${encodeURIComponent(noteId)}`, {
    method: 'DELETE',
    headers,
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Failed to delete note.')
  }

  return true
}

/**
 * Retrieves communication logs for a lead.
 */
export async function getCommunicationLogs(leadId) {
  const headers = await getAuthHeaders()
  const res = await fetch(`/api/admin/communication?leadId=${encodeURIComponent(leadId)}`, {
    method: 'GET',
    headers,
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch communication logs.')
  }

  return data.logs || []
}

/**
 * Dispatches email or WhatsApp client communications.
 */
export async function sendCommunication({
  leadId,
  channel = 'email',
  recipient,
  recipientPhone,
  subject,
  content,
  templateKey,
}) {
  const headers = await getAuthHeaders()
  const res = await fetch('/api/admin/communication', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      leadId,
      channel,
      recipient,
      recipientPhone,
      subject,
      content,
      templateKey,
    }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Communication dispatch failed.')
  }

  return data
}

/**
 * Retrieves proposals (optionally filtered by leadId).
 */
export async function getProposals(leadId = null) {
  const headers = await getAuthHeaders()
  const url = leadId
    ? `/api/admin/proposals?leadId=${encodeURIComponent(leadId)}`
    : '/api/admin/proposals'

  const res = await fetch(url, { method: 'GET', headers })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch proposals.')
  }

  return data.proposals || []
}

/**
 * Creates a new client proposal.
 */
export async function createProposal(proposalData) {
  const headers = await getAuthHeaders()
  const res = await fetch('/api/admin/proposals', {
    method: 'POST',
    headers,
    body: JSON.stringify(proposalData),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Failed to create proposal.')
  }

  return data.proposal
}

/**
 * Updates an existing proposal (status, scope, pricing).
 */
export async function updateProposal(proposalId, updates) {
  const headers = await getAuthHeaders()
  const res = await fetch('/api/admin/proposals', {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ proposalId, ...updates }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update proposal.')
  }

  return data.proposal
}

/**
 * Retrieves communication templates.
 */
export async function getMessageTemplates() {
  const headers = await getAuthHeaders()
  const res = await fetch('/api/admin/templates', { method: 'GET', headers })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch templates.')
  }

  return data.templates || []
}

/**
 * Updates a communication template.
 */
export async function updateMessageTemplate(templateData) {
  const headers = await getAuthHeaders()
  const res = await fetch('/api/admin/templates', {
    method: 'PUT',
    headers,
    body: JSON.stringify(templateData),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update template.')
  }

  return data.template
}

/**
 * Schedules a discovery consultation with Google Meet integration / manual link.
 */
export async function scheduleDiscoveryMeeting(meetingData) {
  const headers = await getAuthHeaders()
  const res = await fetch('/api/admin/schedule-meeting', {
    method: 'POST',
    headers,
    body: JSON.stringify(meetingData),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Failed to schedule meeting.')
  }

  return data
}
