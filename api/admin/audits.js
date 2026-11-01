import { verifyAdminRequest } from '../_lib/auth.js'

const VALID_AUDIT_STATUSES = ['new', 'in_progress', 'completed', 'rejected', 'archived']

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Content-Type', 'application/json')

  // 1. Verify admin authentication & authorization
  const auth = await verifyAdminRequest(req)
  if (!auth.authorized) {
    return res.status(auth.status || 401).json({
      success: false,
      error: auth.error || 'Unauthorized access.',
    })
  }

  const supabase = auth.supabase

  // 2. GET: Retrieve paginated audit requests & KPIs
  if (req.method === 'GET') {
    try {
      const page = Math.max(1, parseInt(req.query.page, 10) || 1)
      const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize, 10) || 15))
      const status = req.query.status || 'all'
      const search = (req.query.search || '').trim()
      const sortOrder = req.query.sortOrder === 'asc' ? 'asc' : 'desc'

      let query = supabase
        .from('audit_requests')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: sortOrder === 'asc' })

      if (status !== 'all' && VALID_AUDIT_STATUSES.includes(status)) {
        query = query.eq('status', status)
      }

      if (search) {
        query = query.or(
          `full_name.ilike.%${search}%,work_email.ilike.%${search}%,website_url.ilike.%${search}%,audit_type.ilike.%${search}%`
        )
      }

      const offset = (page - 1) * pageSize
      query = query.range(offset, offset + pageSize - 1)

      const { data: audits, error, count } = await query

      if (error) {
        if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
          return res.status(200).json({
            success: true,
            audits: [],
            pagination: { page: 1, pageSize, totalItems: 0, totalPages: 0 },
            metrics: { total: 0, new: 0, in_progress: 0, completed: 0, rejected: 0 },
            migrationPending: true,
          })
        }
        throw error
      }

      // Compute KPI counts across all audit requests
      const { data: allStatuses, error: metricError } = await supabase
        .from('audit_requests')
        .select('status')

      const metrics = {
        total: allStatuses ? allStatuses.length : 0,
        new: 0,
        in_progress: 0,
        completed: 0,
        rejected: 0,
      }

      if (allStatuses && !metricError) {
        for (const item of allStatuses) {
          if (metrics[item.status] !== undefined) {
            metrics[item.status]++
          }
        }
      }

      const totalItems = count || 0
      const totalPages = Math.ceil(totalItems / pageSize)

      return res.status(200).json({
        success: true,
        audits: audits || [],
        pagination: {
          page,
          pageSize,
          totalItems,
          totalPages,
        },
        metrics,
      })
    } catch (err) {
      console.error('[API /api/admin/audits GET Error]:', err.message)
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve audit requests from database.',
      })
    }
  }

  // 3. PATCH: Update status, admin notes, or convert to lead
  if (req.method === 'PATCH') {
    try {
      const { auditId, status, admin_notes, convertToLead } = req.body || {}

      if (!auditId) {
        return res.status(400).json({ success: false, error: 'Missing required auditId.' })
      }

      // Conversion Workflow: Convert audit request to qualified lead
      if (convertToLead === true) {
        const { data: audit, error: fetchErr } = await supabase
          .from('audit_requests')
          .select('*')
          .eq('id', auditId)
          .single()

        if (fetchErr || !audit) {
          return res.status(404).json({ success: false, error: 'Audit request not found.' })
        }

        if (audit.converted_lead_id) {
          return res.status(400).json({
            success: false,
            error: 'This audit request has already been converted to a client lead.',
            leadId: audit.converted_lead_id,
          })
        }

        // Map audit focus to a valid service in leads table
        let targetService = 'Website Design'
        if (audit.audit_type?.includes('SEO')) targetService = 'Web Development'
        if (audit.audit_type?.includes('Performance')) targetService = 'Web Development'
        if (audit.audit_type?.includes('user experience')) targetService = 'UI/UX Design'

        const leadPayload = {
          name: audit.full_name,
          email: audit.work_email,
          service: targetService,
          project_description: `CONVERTED FROM FREE AUDIT REQUEST:\nWebsite: ${audit.website_url}\nFocus: ${audit.audit_type}\nChallenge: ${audit.biggest_challenge || 'None noted'}`,
          source: 'audit_conversion',
          status: 'qualified',
          metadata: {
            converted_from_audit_id: audit.id,
            original_website: audit.website_url,
            original_created_at: audit.created_at,
          },
        }

        const { data: newLead, error: insertLeadErr } = await supabase
          .from('leads')
          .insert([leadPayload])
          .select('id, name, email')
          .single()

        if (insertLeadErr) {
          throw new Error(`Failed to create lead: ${insertLeadErr.message}`)
        }

        // Update the audit request with conversion link & status
        await supabase
          .from('audit_requests')
          .update({
            status: 'completed',
            converted_lead_id: newLead.id,
            admin_notes: audit.admin_notes
              ? `${audit.admin_notes}\n[Converted to Lead ID: ${newLead.id}]`
              : `[Converted to Lead ID: ${newLead.id}]`,
          })
          .eq('id', auditId)

        return res.status(200).json({
          success: true,
          message: 'Audit request successfully converted into a qualified lead.',
          leadId: newLead.id,
        })
      }

      // Standard status and note updates
      const updates = {}
      if (status !== undefined) {
        if (!VALID_AUDIT_STATUSES.includes(status)) {
          return res.status(400).json({
            success: false,
            error: `Invalid status. Must be one of: ${VALID_AUDIT_STATUSES.join(', ')}.`,
          })
        }
        updates.status = status
      }

      if (admin_notes !== undefined) {
        if (typeof admin_notes === 'string' && admin_notes.length > 3000) {
          return res.status(400).json({
            success: false,
            error: 'Admin notes must not exceed 3000 characters.',
          })
        }
        updates.admin_notes = admin_notes
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ success: false, error: 'No valid updates provided.' })
      }

      const { data: updatedAudit, error: updateErr } = await supabase
        .from('audit_requests')
        .update(updates)
        .eq('id', auditId)
        .select()
        .single()

      if (updateErr) {
        throw updateErr
      }

      return res.status(200).json({
        success: true,
        audit: updatedAudit,
        message: 'Audit request updated successfully.',
      })
    } catch (err) {
      console.error('[API /api/admin/audits PATCH Error]:', err.message)
      return res.status(500).json({
        success: false,
        error: err.message || 'Failed to update audit request.',
      })
    }
  }

  res.setHeader('Allow', 'GET, PATCH')
  return res.status(405).json({ success: false, error: 'Method not allowed. Use GET or PATCH.' })
}
