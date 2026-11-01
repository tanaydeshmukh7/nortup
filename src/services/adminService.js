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
