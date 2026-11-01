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

  // 2. GET: List proposals
  if (req.method === 'GET') {
    try {
      const { leadId } = req.query || {}
      let query = supabase.from('proposals').select('*').order('created_at', { ascending: false })

      if (leadId) {
        query = query.eq('lead_id', leadId)
      }

      const { data: proposals, error } = await query

      if (error) {
        console.warn('[proposals.js] Error querying proposals table:', error.message)
        return res.status(200).json({ success: true, proposals: [] })
      }

      return res.status(200).json({ success: true, proposals: proposals || [] })
    } catch (err) {
      console.error('[proposals.js] Exception in GET:', err.message)
      return res.status(500).json({ success: false, error: 'Failed to retrieve proposals.' })
    }
  }

  // 3. POST: Create a new proposal
  if (req.method === 'POST') {
    try {
      const body = req.body || {}
      const {
        lead_id,
        title,
        client_name,
        client_email,
        client_company = '',
        project_overview = '',
        deliverables = [],
        milestones = [],
        line_items = [],
        currency = 'USD',
        subtotal = 0,
        tax_rate = 0,
        total_amount = 0,
        payment_terms = '50% upon commencement, 50% upon production deployment',
        valid_until,
        exclusions = 'Domain registration, third-party licensing fees, ongoing content copywriting.',
        notes = 'All intellectual property transfers to client upon final milestone settlement.',
      } = body

      if (!lead_id || !title || !client_name || !client_email) {
        return res.status(400).json({
          success: false,
          error: 'Missing required proposal fields (lead_id, title, client_name, client_email).',
        })
      }

      // Generate proposal reference number: NS-PROP-YEAR-RANDOM
      const randomSuffix = Math.floor(1000 + Math.random() * 9000)
      const proposal_number = `NS-PROP-${new Date().getFullYear()}-${randomSuffix}`

      const payload = {
        lead_id,
        proposal_number,
        title: title.trim(),
        client_name: client_name.trim(),
        client_email: client_email.trim(),
        client_company: client_company ? client_company.trim() : null,
        project_overview: project_overview.trim(),
        deliverables,
        milestones,
        line_items,
        currency,
        subtotal: Number(subtotal) || 0,
        tax_rate: Number(tax_rate) || 0,
        total_amount: Number(total_amount) || 0,
        payment_terms,
        valid_until: valid_until || null,
        exclusions,
        notes,
        status: 'draft',
      }

      const { data, error } = await supabase
        .from('proposals')
        .insert([payload])
        .select()
        .single()

      if (error) {
        console.error('[proposals.js] Error inserting proposal:', error.message)
        return res.status(500).json({
          success: false,
          error: 'Failed to record proposal in database.',
        })
      }

      return res.status(201).json({
        success: true,
        message: 'Proposal created successfully.',
        proposal: data,
      })
    } catch (err) {
      console.error('[proposals.js] Exception in POST:', err.message)
      return res.status(500).json({
        success: false,
        error: 'An internal server error occurred while creating proposal.',
      })
    }
  }

  // 4. PATCH: Update proposal status or contents
  if (req.method === 'PATCH') {
    try {
      const body = req.body || {}
      const { proposalId, status, ...otherUpdates } = body

      if (!proposalId) {
        return res.status(400).json({ success: false, error: 'Missing required proposalId.' })
      }

      const updateData = { ...otherUpdates, updated_at: new Date().toISOString() }
      if (status) {
        updateData.status = status
        if (status === 'sent') updateData.sent_at = new Date().toISOString()
        if (status === 'accepted') updateData.accepted_at = new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('proposals')
        .update(updateData)
        .eq('id', proposalId)
        .select()
        .single()

      if (error) {
        console.error('[proposals.js] Error updating proposal:', error.message)
        return res.status(500).json({ success: false, error: 'Failed to update proposal.' })
      }

      return res.status(200).json({
        success: true,
        message: 'Proposal updated successfully.',
        proposal: data,
      })
    } catch (err) {
      console.error('[proposals.js] Exception in PATCH:', err.message)
      return res.status(500).json({ success: false, error: 'Failed to update proposal.' })
    }
  }

  res.setHeader('Allow', 'GET, POST, PATCH')
  return res.status(405).json({ success: false, error: 'Method not allowed. Use GET, POST, or PATCH.' })
}
