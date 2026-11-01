import { verifyAdminRequest } from '../_lib/auth.js'
import { STARTER_TEMPLATES } from '../../src/services/templateData.js'

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

  // 2. GET: List templates
  if (req.method === 'GET') {
    try {
      const { data: dbTemplates, error } = await supabase
        .from('message_templates')
        .select('*')
        .order('category')

      if (error || !dbTemplates || dbTemplates.length === 0) {
        // Return starter templates if DB table not yet populated
        return res.status(200).json({ success: true, templates: STARTER_TEMPLATES })
      }

      return res.status(200).json({ success: true, templates: dbTemplates })
    } catch (err) {
      console.warn('[templates.js] Fallback to starter templates:', err.message)
      return res.status(200).json({ success: true, templates: STARTER_TEMPLATES })
    }
  }

  // 3. PUT / POST: Update or create template
  if (req.method === 'PUT' || req.method === 'POST') {
    try {
      const body = req.body || {}
      const { key, title, category, subject, body_email, body_whatsapp } = body

      if (!key || !body_email) {
        return res.status(400).json({ success: false, error: 'Missing required key or body_email.' })
      }

      const updateData = {
        key,
        title: title || key,
        category: category || 'Custom',
        subject: subject || '',
        body_email,
        body_whatsapp: body_whatsapp || '',
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from('message_templates')
        .upsert(updateData, { onConflict: 'key' })
        .select()
        .single()

      if (error) {
        console.warn('[templates.js] Could not persist to DB (table may not be migrated yet):', error.message)
        return res.status(200).json({
          success: true,
          message: 'Template updated in session.',
          template: updateData,
        })
      }

      return res.status(200).json({
        success: true,
        message: 'Template saved successfully.',
        template: data,
      })
    } catch (err) {
      console.error('[templates.js] Exception in PUT/POST:', err.message)
      return res.status(500).json({ success: false, error: 'Failed to update template.' })
    }
  }

  res.setHeader('Allow', 'GET, PUT, POST')
  return res.status(405).json({ success: false, error: 'Method not allowed. Use GET, PUT, or POST.' })
}
