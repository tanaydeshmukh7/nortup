import { verifyAdminRequest } from '../_lib/auth.js'

const VALID_STATUSES = [
  'new',
  'contacted',
  'qualified',
  'proposal_sent',
  'negotiation',
  'won',
  'lost',
]

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

  // 2. GET: List leads, filter, paginate, and calculate metrics
  if (req.method === 'GET') {
    try {
      const {
        page = '1',
        pageSize = '15',
        search = '',
        status = 'all',
        service = 'all',
        sortOrder = 'desc',
      } = req.query || {}

      const numPage = Math.max(1, parseInt(page, 10) || 1)
      const numPageSize = Math.min(100, Math.max(1, parseInt(pageSize, 10) || 15))
      const from = (numPage - 1) * numPageSize
      const to = from + numPageSize - 1

      // A. Calculate Pipeline KPI Metrics across all records
      const { data: allLeadsForMetrics, error: metricsError } = await supabase
        .from('leads')
        .select('id, status, created_at')

      if (metricsError) {
        console.error('[leads.js] Error fetching metrics:', metricsError.message)
        return res.status(500).json({
          success: false,
          error: 'Failed to retrieve metrics from database.',
        })
      }

      const metrics = {
        total: allLeadsForMetrics.length,
        new: allLeadsForMetrics.filter((l) => l.status === 'new').length,
        contacted: allLeadsForMetrics.filter((l) => l.status === 'contacted').length,
        qualified: allLeadsForMetrics.filter((l) => l.status === 'qualified').length,
        proposal_sent: allLeadsForMetrics.filter((l) => l.status === 'proposal_sent').length,
        negotiation: allLeadsForMetrics.filter((l) => l.status === 'negotiation').length,
        won: allLeadsForMetrics.filter((l) => l.status === 'won' || l.status === 'closed_won').length,
        lost: allLeadsForMetrics.filter((l) => l.status === 'lost' || l.status === 'closed_lost').length,
      }

      // B. Build Filtered & Paginated Query
      let query = supabase
        .from('leads')
        .select('*', { count: 'exact' })

      // Status filter
      if (status && status !== 'all') {
        if (status === 'won') {
          query = query.in('status', ['won', 'closed_won'])
        } else if (status === 'lost') {
          query = query.in('status', ['lost', 'closed_lost'])
        } else {
          query = query.eq('status', status)
        }
      }

      // Service filter
      if (service && service !== 'all') {
        query = query.eq('service', service)
      }

      // Search filter across name, email, company
      const cleanSearch = (search || '').trim()
      if (cleanSearch) {
        query = query.or(
          `name.ilike.%${cleanSearch}%,email.ilike.%${cleanSearch}%,company.ilike.%${cleanSearch}%`
        )
      }

      // Sorting & Pagination
      const isAsc = sortOrder.toLowerCase() === 'asc'
      query = query
        .order('created_at', { ascending: isAsc })
        .range(from, to)

      const { data: leads, error: queryError, count: totalCount } = await query

      if (queryError) {
        console.error('[leads.js] Error fetching leads:', queryError.message)
        return res.status(500).json({
          success: false,
          error: 'Failed to retrieve lead records from database.',
        })
      }

      const totalRecords = totalCount || 0
      const totalPages = Math.ceil(totalRecords / numPageSize)

      return res.status(200).json({
        success: true,
        leads: leads || [],
        pagination: {
          page: numPage,
          pageSize: numPageSize,
          totalCount: totalRecords,
          totalPages: totalPages === 0 ? 1 : totalPages,
        },
        metrics,
      })
    } catch (err) {
      console.error('[leads.js] Exception in GET handler:', err.message)
      return res.status(500).json({
        success: false,
        error: 'An internal server error occurred while retrieving leads.',
      })
    }
  }

  // 3. PATCH: Update lead status & CRM attributes
  if (req.method === 'PATCH') {
    try {
      const body = req.body || {}
      const {
        leadId,
        status,
        phone,
        next_follow_up_date,
        follow_up_completed,
        converted_at,
        converted_client_id,
      } = body

      if (!leadId) {
        return res.status(400).json({ success: false, error: 'Missing required leadId parameter.' })
      }

      const updateData = {}

      if (status !== undefined) {
        if (!VALID_STATUSES.includes(status)) {
          return res.status(400).json({
            success: false,
            error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}.`,
          })
        }
        updateData.status = status
      }

      if (phone !== undefined) updateData.phone = phone ? String(phone).trim() : null
      if (next_follow_up_date !== undefined) updateData.next_follow_up_date = next_follow_up_date
      if (follow_up_completed !== undefined) updateData.follow_up_completed = Boolean(follow_up_completed)
      if (converted_at !== undefined) updateData.converted_at = converted_at
      if (converted_client_id !== undefined) updateData.converted_client_id = converted_client_id

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ success: false, error: 'No update parameters provided.' })
      }

      const { data, error } = await supabase
        .from('leads')
        .update(updateData)
        .eq('id', leadId)
        .select()
        .single()

      if (error) {
        console.error('[leads.js] Error updating lead:', error.message)
        return res.status(500).json({
          success: false,
          error: 'Failed to update lead record in database.',
        })
      }

      return res.status(200).json({
        success: true,
        message: 'Lead updated successfully.',
        lead: data,
      })
    } catch (err) {
      console.error('[leads.js] Exception in PATCH handler:', err.message)
      return res.status(500).json({
        success: false,
        error: 'An internal server error occurred while updating lead.',
      })
    }
  }

  res.setHeader('Allow', 'GET, PATCH')
  return res.status(405).json({ success: false, error: 'Method not allowed. Use GET or PATCH.' })
}
