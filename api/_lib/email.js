/**
 * HTML entity escaper to neutralize any potential XSS or HTML injection in emails
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Dispatches both Admin Notification and Client Acknowledgement emails via Resend.
 *
 * Guarantees:
 * 1. Persists lead before dispatch
 * 2. Never throws to ensure lead is never lost on mail provider failure
 * 3. Escapes all user inputs in HTML templates
 * 4. Includes direct link to Admin Dashboard in admin notification
 */
export async function sendLeadEmails({ lead, siteUrl = 'https://northupstudio.vercel.app' }) {
  const resendApiKey = process.env.RESEND_API_KEY
  const adminNotificationEmail = process.env.CONTACT_NOTIFICATION_EMAIL || 'northup4work@gmail.com'
  const fromSender = process.env.RESEND_FROM_EMAIL || 'Northup Studio <enquiries@northupstudio.vercel.app>'

  if (!resendApiKey) {
    return {
      success: false,
      skipped: true,
      reason: 'RESEND_API_KEY not configured in environment variables.',
    }
  }

  const safeName = escapeHtml(lead.name)
  const safeEmail = escapeHtml(lead.email)
  const safeCompany = escapeHtml(lead.company || '')
  const safeService = escapeHtml(lead.service)
  const safeBudget = escapeHtml(lead.budget || 'Not specified')
  const safeTimeline = escapeHtml(lead.timeline || 'Not specified')
  const safeDesc = escapeHtml(lead.project_description || '').replace(/\n/g, '<br />')
  const adminDashboardUrl = `${siteUrl.replace(/\/$/, '')}/admin`

  const results = {
    adminEmail: { sent: false },
    clientEmail: { sent: false },
  }

  // 1. Email A: Admin Notification
  try {
    const adminRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromSender,
        to: [adminNotificationEmail],
        reply_to: lead.email,
        subject: `[New Lead] ${lead.service}: ${lead.name} (${lead.company || 'Individual'})`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0908; color: #f5f1ed; margin: 0; padding: 24px; }
                .card { max-width: 580px; margin: 0 auto; background-color: #15100e; border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; padding: 32px; box-shadow: 0 16px 40px rgba(0,0,0,0.6); }
                .eyebrow { color: #ff8738; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold; margin-bottom: 8px; font-family: monospace; }
                h1 { font-size: 24px; margin-top: 0; color: #ffffff; margin-bottom: 20px; }
                .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px; font-family: monospace; }
                .meta-table td { padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); }
                .meta-table td.label { color: #8e8681; width: 140px; }
                .meta-table td.val { color: #f5f1ed; font-weight: 500; }
                .desc-box { background-color: #0d0a09; border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 16px; font-size: 13px; line-height: 1.6; color: #d3cbc4; margin-bottom: 28px; }
                .cta-btn { display: inline-block; background: linear-gradient(135deg, #ff4d0a, #ff8738); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 999px; font-weight: bold; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; }
                .footer { margin-top: 28px; font-size: 11px; color: #6e6762; font-family: monospace; }
              </style>
            </head>
            <body>
              <div class="card">
                <div class="eyebrow">{NORTHUP STUDIO · CLIENT INTAKE}</div>
                <h1>New Project Enquiry</h1>
                
                <table class="meta-table">
                  <tr><td class="label">CLIENT NAME</td><td class="val">${safeName}</td></tr>
                  <tr><td class="label">WORK EMAIL</td><td class="val"><a href="mailto:${safeEmail}" style="color: #ff8738; text-decoration: none;">${safeEmail}</a></td></tr>
                  <tr><td class="label">COMPANY</td><td class="val">${safeCompany || 'Not specified'}</td></tr>
                  <tr><td class="label">SERVICE</td><td class="val">${safeService}</td></tr>
                  <tr><td class="label">EST. BUDGET</td><td class="val">${safeBudget}</td></tr>
                  <tr><td class="label">TIMELINE</td><td class="val">${safeTimeline}</td></tr>
                  <tr><td class="label">SOURCE</td><td class="val">${escapeHtml(lead.source || 'website_contact_form')}</td></tr>
                </table>

                <div style="font-size: 11px; font-family: monospace; color: #8e8681; margin-bottom: 6px; text-transform: uppercase;">Project Description:</div>
                <div class="desc-box">
                  ${safeDesc}
                </div>

                <div style="text-align: center; margin-top: 10px;">
                  <a href="${adminDashboardUrl}" class="cta-btn">View in Admin Dashboard ↗</a>
                </div>

                <div class="footer">
                  Lead ID: ${lead.id} · Timestamp: ${lead.created_at || new Date().toISOString()}
                </div>
              </div>
            </body>
          </html>
        `,
      }),
    })

    if (adminRes.ok) {
      results.adminEmail = { sent: true }
    } else {
      const errText = await adminRes.text()
      results.adminEmail = { sent: false, error: `Resend status ${adminRes.status}: ${errText}` }
      console.warn('[email.js] Admin notification failed:', results.adminEmail.error)
    }
  } catch (err) {
    results.adminEmail = { sent: false, error: err.message }
    console.warn('[email.js] Admin notification exception:', err.message)
  }

  // 2. Email B: Client Acknowledgement
  try {
    const clientRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromSender,
        to: [lead.email],
        reply_to: adminNotificationEmail,
        subject: `Thank you for contacting Northup Studio — We have received your enquiry`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0908; color: #f5f1ed; margin: 0; padding: 24px; }
                .card { max-width: 560px; margin: 0 auto; background-color: #140f0d; border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; padding: 36px 32px; box-shadow: 0 16px 40px rgba(0,0,0,0.6); }
                .logo { font-size: 16px; font-weight: bold; letter-spacing: 3px; color: #ffffff; text-transform: uppercase; margin-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 16px; }
                h1 { font-size: 22px; color: #ffffff; margin-top: 0; margin-bottom: 16px; font-weight: 600; line-height: 1.3; }
                p { font-size: 14px; line-height: 1.7; color: #d3cbc4; margin: 0 0 16px 0; }
                .highlight-box { background-color: #1b1411; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 18px; margin: 20px 0; }
                .highlight-item { font-size: 12px; font-family: monospace; color: #bdb4ae; margin-bottom: 6px; }
                .highlight-item:last-child { margin-bottom: 0; }
                .highlight-item span { color: #f5f1ed; font-weight: 500; }
                .signature { margin-top: 32px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 12px; font-family: monospace; color: #8e8681; }
              </style>
            </head>
            <body>
              <div class="card">
                <div class="logo">NORTHUP STUDIO</div>
                <h1>We have received your project enquiry.</h1>
                
                <p>Dear ${safeName},</p>
                
                <p>
                  Thank you for reaching out to Northup Studio. We have successfully received your enquiry regarding <strong>${safeService}</strong>.
                </p>
                
                <div class="highlight-box">
                  <div class="highlight-item">SERVICE: <span>${safeService}</span></div>
                  ${safeCompany ? `<div class="highlight-item">ORGANIZATION: <span>${safeCompany}</span></div>` : ''}
                  <div class="highlight-item">ESTIMATED BUDGET: <span>${safeBudget}</span></div>
                  <div class="highlight-item">TIMELINE: <span>${safeTimeline}</span></div>
                </div>

                <p>
                  Our team carefully reviews each submission to understand your digital objectives, design requirements, and technical scope. A member of our design direction team will follow up to coordinate next steps or schedule a consultation.
                </p>

                <p>
                  In the meantime, feel free to explore our recent case studies and architectural digital monographs at <a href="https://northupstudio.vercel.app/#work" style="color: #ff8738; text-decoration: none;">northupstudio.vercel.app</a>.
                </p>

                <div class="signature">
                  Northup Studio · Orchestrating Brand Growth<br />
                  <a href="mailto:${adminNotificationEmail}" style="color: #ff8738; text-decoration: none;">${adminNotificationEmail}</a>
                </div>
              </div>
            </body>
          </html>
        `,
      }),
    })

    if (clientRes.ok) {
      results.clientEmail = { sent: true }
    } else {
      const errText = await clientRes.text()
      results.clientEmail = { sent: false, error: `Resend status ${clientRes.status}: ${errText}` }
      console.warn('[email.js] Client acknowledgement failed:', results.clientEmail.error)
    }
  } catch (err) {
    results.clientEmail = { sent: false, error: err.message }
    console.warn('[email.js] Client acknowledgement exception:', err.message)
  }

  return {
    success: results.adminEmail.sent || results.clientEmail.sent,
    results,
  }
}
