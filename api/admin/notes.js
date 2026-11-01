import { verifyAdminRequest } from '../_lib/auth.js'

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')

  // 1. Verify Admin Authentication & Authorization
  const auth = await verifyAdminRequest(req)
  if (!auth.authorized) {
    return res.status(auth.status || 401).json({
      success: false,
      authorized: false,
      error: auth.error,
    })
  }

  const supabase = auth.supabase

  // 2. GET: Retrieve internal notes for a specific lead
  if (req.method === 'GET') {
    try {
      const { leadId } = req.query || {}
      if (!leadId) {
        return res.status(400).json({ success: false, error: 'Missing leadId query parameter.' })
      }

      const { data: notes, error } = await supabase
        .from('lead_notes')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('[notes.js] Error fetching notes:', error.message)
        return res.status(500).json({ success: false, error: 'Failed to retrieve notes from database.' })
      }

      return res.status(200).json({
        success: true,
        notes: notes || [],
      })
    } catch (err) {
      console.error('[notes.js] Exception in GET handler:', err.message)
      return res.status(500).json({ success: false, error: 'Internal server error while fetching notes.' })
    }
  }

  // 3. POST: Add a new internal note
  if (req.method === 'POST') {
    try {
      const body = req.body || {}
      const { leadId, content } = body

      if (!leadId) {
        return res.status(400).json({ success: false, error: 'Missing required leadId parameter.' })
      }

      const trimmedContent = (content || '').trim()
      if (!trimmedContent) {
        return res.status(400).json({ success: false, error: 'Note content cannot be empty.' })
      }

      if (trimmedContent.length > 3000) {
        return res.status(400).json({ success: false, error: 'Note content cannot exceed 3000 characters.' })
      }

      const newNote = {
        lead_id: leadId,
        author_email: auth.user.email,
        content: trimmedContent,
      }

      const { data, error } = await supabase
        .from('lead_notes')
        .insert([newNote])
        .select()
        .single()

      if (error) {
        console.error('[notes.js] Error creating note:', error.message)
        return res.status(500).json({ success: false, error: 'Failed to save note to database.' })
      }

      return res.status(201).json({
        success: true,
        message: 'Internal note saved successfully.',
        note: data,
      })
    } catch (err) {
      console.error('[notes.js] Exception in POST handler:', err.message)
      return res.status(500).json({ success: false, error: 'Internal server error while saving note.' })
    }
  }

  // 4. DELETE: Remove an internal note
  if (req.method === 'DELETE') {
    try {
      const { noteId } = req.query || {}
      if (!noteId) {
        return res.status(400).json({ success: false, error: 'Missing noteId parameter.' })
      }

      const { error } = await supabase
        .from('lead_notes')
        .delete()
        .eq('id', noteId)

      if (error) {
        console.error('[notes.js] Error deleting note:', error.message)
        return res.status(500).json({ success: false, error: 'Failed to delete note from database.' })
      }

      return res.status(200).json({
        success: true,
        message: 'Note deleted successfully.',
      })
    } catch (err) {
      console.error('[notes.js] Exception in DELETE handler:', err.message)
      return res.status(500).json({ success: false, error: 'Internal server error while deleting note.' })
    }
  }

  res.setHeader('Allow', 'GET, POST, DELETE')
  return res.status(405).json({ success: false, error: 'Method not allowed. Use GET, POST, or DELETE.' })
}
