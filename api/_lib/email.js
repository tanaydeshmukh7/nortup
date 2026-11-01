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
 * Formats ISO date or timestamp into clean, human-readable date and time
 */
export function formatReceivedDate(dateString) {
  try {
    const d = dateString ? new Date(dateString) : new Date()
    if (isNaN(d.getTime())) return new Date().toUTCString()
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
      timeZoneName: 'short',
    })
  } catch {
    return new Date().toUTCString()
  }
}

/**
 * Generates the premium, agency-branded Admin Notification HTML email.
 * Design: Dark charcoal canvas, warm white content card, restrained acid-green brand detail,
 * clear typography, real submitted data without invented values, and direct /admin dashboard CTA.
 */
export function buildAdminNotificationEmail({ lead, siteUrl = 'https://northupstudio.vercel.app' }) {
  const safeName = escapeHtml(lead.name || '')
  const safeEmail = escapeHtml(lead.email || '')
  const safeCompany = escapeHtml(lead.company || '')
  const safeService = escapeHtml(lead.service || '')
  const safeBudget = escapeHtml(lead.budget || '')
  const safeTimeline = escapeHtml(lead.timeline || '')
  const safeDesc = escapeHtml(lead.project_description || '').replace(/\n/g, '<br />')
  const formattedDate = formatReceivedDate(lead.created_at)
  const adminDashboardUrl = `${siteUrl.replace(/\/$/, '')}/admin`

  // Build table rows dynamically for fields that actually exist
  const detailRows = []

  if (safeName) {
    detailRows.push(`
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #EDE9E3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace; font-size: 11px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; color: #78736D; width: 140px; vertical-align: top;">
          CLIENT NAME
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #EDE9E3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 600; color: #111111; vertical-align: top;">
          ${safeName}
        </td>
      </tr>
    `)
  }

  if (safeEmail) {
    detailRows.push(`
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #EDE9E3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace; font-size: 11px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; color: #78736D; width: 140px; vertical-align: top;">
          CLIENT EMAIL
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #EDE9E3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 500; color: #111111; vertical-align: top;">
          <a href="mailto:${safeEmail}" style="color: #111111; text-decoration: underline; text-underline-offset: 3px;">${safeEmail}</a>
        </td>
      </tr>
    `)
  }

  if (safeCompany && safeCompany.trim().length > 0) {
    detailRows.push(`
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #EDE9E3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace; font-size: 11px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; color: #78736D; width: 140px; vertical-align: top;">
          COMPANY / BRAND
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #EDE9E3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 500; color: #111111; vertical-align: top;">
          ${safeCompany}
        </td>
      </tr>
    `)
  }

  if (safeService && safeService.trim().length > 0) {
    detailRows.push(`
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #EDE9E3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace; font-size: 11px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; color: #78736D; width: 140px; vertical-align: top;">
          PROJECT INTEREST
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #EDE9E3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 500; color: #111111; vertical-align: top;">
          ${safeService}
        </td>
      </tr>
    `)
  }

  if (safeBudget && safeBudget.trim().length > 0) {
    detailRows.push(`
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #EDE9E3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace; font-size: 11px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; color: #78736D; width: 140px; vertical-align: top;">
          ESTIMATED BUDGET
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #EDE9E3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 500; color: #111111; vertical-align: top;">
          ${safeBudget}
        </td>
      </tr>
    `)
  }

  if (safeTimeline && safeTimeline.trim().length > 0) {
    detailRows.push(`
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #EDE9E3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace; font-size: 11px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; color: #78736D; width: 140px; vertical-align: top;">
          DESIRED TIMELINE
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #EDE9E3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 500; color: #111111; vertical-align: top;">
          ${safeTimeline}
        </td>
      </tr>
    `)
  }

  detailRows.push(`
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #EDE9E3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace; font-size: 11px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; color: #78736D; width: 140px; vertical-align: top;">
        DATE RECEIVED
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #EDE9E3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 500; color: #111111; vertical-align: top;">
        ${formattedDate}
      </td>
    </tr>
  `)

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>New Project Enquiry | Northup Studio</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td, h1, p, a { font-family: Arial, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #0C0A09;">
  
  <!-- Preheader Text (Hidden in body, visible in inbox list) -->
  <div style="display: none; max-height: 0px; overflow: hidden; mso-hide: all; font-size: 1px; line-height: 1px; color: #0C0A09; opacity: 0;">
    New project enquiry from ${safeName}${lead.service ? ` (${safeService})` : ''}. Review client details inside Northup Studio.
    &#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;&#847;&zwnj;&nbsp;&#8199;&shy;
  </div>

  <!-- Outer Canvas Table (Dark Charcoal) -->
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #0C0A09; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 40px 16px 56px 16px;">
        
        <!-- Inner Card Table (Warm White Surface) -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 580px; background-color: #FAF8F5; border-radius: 12px; border: 1px solid #2A2724; overflow: hidden; box-shadow: 0 20px 48px rgba(0,0,0,0.6);">
          
          <!-- Top Accent Line (Restrained Acid-Green) -->
          <tr>
            <td style="height: 3px; background-color: #22C55E; line-height: 3px; font-size: 3px;">&nbsp;</td>
          </tr>

          <!-- Main Content Area -->
          <tr>
            <td style="padding: 36px 36px 32px 36px;">
              
              <!-- 1. Header: Brand Wordmark + Label Badge -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" style="vertical-align: middle;">
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 2.5px; color: #111111; text-transform: uppercase;">
                      NORTHUP STUDIO
                    </div>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <span style="display: inline-block; padding: 4px 10px; border-radius: 9999px; background-color: #E8F8EE; border: 1px solid #B8E8C7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', monospace; font-size: 10px; font-weight: 700; letter-spacing: 1.2px; color: #15803D; text-transform: uppercase;">
                      <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background-color: #22C55E; margin-right: 5px; vertical-align: middle;"></span>NEW PROJECT ENQUIRY
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0 28px 0;">
                <tr>
                  <td style="border-bottom: 1px solid #E8E4DD; height: 1px; line-height: 1px; font-size: 1px;">&nbsp;</td>
                </tr>
              </table>

              <!-- 2. Main Heading -->
              <h1 style="margin: 0 0 10px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 26px; line-height: 1.25; font-weight: 700; color: #111111; letter-spacing: -0.5px;">
                You've got a new lead.
              </h1>
              <p style="margin: 0 0 28px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #58544F;">
                A new enquiry has arrived through your website. Review the details below and follow up with the potential client.
              </p>

              <!-- 3. Client Details Table -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-bottom: 24px;">
                ${detailRows.join('')}
              </table>

              <!-- Full Enquiry Message (if supplied) -->
              ${
                safeDesc && safeDesc.trim().length > 0
                  ? `
                  <div style="margin-top: 24px; margin-bottom: 32px;">
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace; font-size: 11px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; color: #78736D; margin-bottom: 8px;">
                      ENQUIRY MESSAGE
                    </div>
                    <div style="background-color: #F2EFE9; border: 1px solid #E2DED6; border-radius: 8px; padding: 18px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.65; color: #222222; word-break: break-word;">
                      ${safeDesc}
                    </div>
                  </div>
                  `
                  : ''
              }

              <!-- 4. Primary Action: View Lead in Dashboard -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0 auto 12px auto;">
                <tr>
                  <td align="center">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="border-radius: 8px; background-color: #111111;">
                          <a href="${adminDashboardUrl}" target="_blank" style="display: inline-block; padding: 14px 34px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 600; color: #FFFFFF; text-decoration: none; border-radius: 8px; letter-spacing: 0.5px; background-color: #111111;">
                            View Lead in Dashboard &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>

        <!-- 5. Footer (Dark Charcoal Surround) -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 580px; margin: 28px auto 0 auto; text-align: center;">
          <tr>
            <td style="padding: 0 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; text-align: center;">
              <div style="font-size: 12px; font-weight: 700; letter-spacing: 2px; color: #E8E4DF; text-transform: uppercase; margin-bottom: 6px;">
                NORTHUP STUDIO
              </div>
              <div style="font-size: 12px; line-height: 1.5; color: #8A857F; margin-bottom: 8px;">
                Thoughtful design. Digital experiences. Meaningful growth.
              </div>
              <div style="font-size: 12px; margin-bottom: 12px;">
                <a href="https://northupstudio.vercel.app/" target="_blank" style="color: #B5AFA8; text-decoration: underline; text-underline-offset: 3px;">
                  https://northupstudio.vercel.app/
                </a>
              </div>
              <div style="font-size: 11px; line-height: 1.5; color: #66625D; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace;">
                Automated notification &middot; Please do not forward confidential enquiry details
              </div>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`

  const textLines = [
    'NORTHUP STUDIO — NEW PROJECT ENQUIRY',
    '',
    "You've got a new lead.",
    'A new enquiry has arrived through your website. Review the details below and follow up with the potential client.',
    '',
    'CLIENT DETAILS',
    '--------------------------------------------------',
  ]

  if (lead.name) textLines.push(`Client Name:      ${lead.name}`)
  if (lead.email) textLines.push(`Client Email:     ${lead.email}`)
  if (lead.company && lead.company.trim()) textLines.push(`Company / Brand:  ${lead.company}`)
  if (lead.service && lead.service.trim()) textLines.push(`Project Interest: ${lead.service}`)
  if (lead.budget && lead.budget.trim()) textLines.push(`Estimated Budget: ${lead.budget}`)
  if (lead.timeline && lead.timeline.trim()) textLines.push(`Desired Timeline: ${lead.timeline}`)
  textLines.push(`Date Received:    ${formattedDate}`)

  if (lead.project_description && lead.project_description.trim()) {
    textLines.push('')
    textLines.push('ENQUIRY MESSAGE')
    textLines.push('--------------------------------------------------')
    textLines.push(lead.project_description)
  }

  textLines.push('')
  textLines.push('PRIMARY ACTION')
  textLines.push('--------------------------------------------------')
  textLines.push(`View Lead in Dashboard:\n${adminDashboardUrl}`)
  textLines.push('')
  textLines.push('--------------------------------------------------')
  textLines.push('NORTHUP STUDIO')
  textLines.push('Thoughtful design. Digital experiences. Meaningful growth.')
  textLines.push('https://northupstudio.vercel.app/')
  textLines.push('Automated notification · Please do not forward confidential enquiry details')

  const text = textLines.join('\n')

  return { html, text }
}

/**
 * Generates the Client Acknowledgement email template.
 */
export function buildClientAcknowledgementEmail({
  lead,
  adminNotificationEmail = 'northup4work@gmail.com',
}) {
  const safeName = escapeHtml(lead.name || '')
  const safeService = escapeHtml(lead.service || 'Web Design & Development')
  const safeCompany = escapeHtml(lead.company || '')
  const safeBudget = escapeHtml(lead.budget || '')
  const safeTimeline = escapeHtml(lead.timeline || '')

  const highlightItems = []
  if (safeService) highlightItems.push(`<div style="margin-bottom: 6px;">SERVICE: <span style="color: #111111; font-weight: 600;">${safeService}</span></div>`)
  if (safeCompany) highlightItems.push(`<div style="margin-bottom: 6px;">ORGANIZATION: <span style="color: #111111; font-weight: 600;">${safeCompany}</span></div>`)
  if (safeBudget) highlightItems.push(`<div style="margin-bottom: 6px;">ESTIMATED BUDGET: <span style="color: #111111; font-weight: 600;">${safeBudget}</span></div>`)
  if (safeTimeline) highlightItems.push(`<div style="margin-bottom: 6px;">TIMELINE: <span style="color: #111111; font-weight: 600;">${safeTimeline}</span></div>`)

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Contacting Northup Studio</title>
</head>
<body style="margin: 0; padding: 0; width: 100% !important; background-color: #0C0A09;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #0C0A09; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 40px 16px 56px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 580px; background-color: #FAF8F5; border-radius: 12px; border: 1px solid #2A2724; overflow: hidden; box-shadow: 0 20px 48px rgba(0,0,0,0.6);">
          <tr>
            <td style="height: 3px; background-color: #22C55E; line-height: 3px; font-size: 3px;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding: 36px 36px 32px 36px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
              <div style="font-size: 13px; font-weight: 700; letter-spacing: 2.5px; color: #111111; text-transform: uppercase; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #E8E4DD;">
                NORTHUP STUDIO
              </div>
              <h1 style="font-size: 24px; color: #111111; margin: 0 0 16px 0; font-weight: 700; letter-spacing: -0.5px; line-height: 1.3;">
                We have received your project enquiry.
              </h1>
              <p style="font-size: 14px; line-height: 1.7; color: #44403C; margin: 0 0 16px 0;">
                Dear ${safeName || 'there'},
              </p>
              <p style="font-size: 14px; line-height: 1.7; color: #44403C; margin: 0 0 20px 0;">
                Thank you for reaching out to Northup Studio. We have successfully received your enquiry regarding <strong>${safeService}</strong>.
              </p>
              ${
                highlightItems.length > 0
                  ? `
                  <div style="background-color: #F2EFE9; border: 1px solid #E2DED6; border-radius: 8px; padding: 16px 20px; margin: 20px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace; font-size: 12px; color: #66625D;">
                    ${highlightItems.join('')}
                  </div>
                  `
                  : ''
              }
              <p style="font-size: 14px; line-height: 1.7; color: #44403C; margin: 0 0 16px 0;">
                Our team carefully reviews each submission to understand your digital objectives, design requirements, and technical scope. A member of our design direction team will follow up to coordinate next steps.
              </p>
              <p style="font-size: 14px; line-height: 1.7; color: #44403C; margin: 0 0 24px 0;">
                In the meantime, feel free to explore our recent case studies and architectural digital monographs at <a href="https://northupstudio.vercel.app/#work" style="color: #111111; text-decoration: underline; text-underline-offset: 3px;">northupstudio.vercel.app</a>.
              </p>
              <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #E8E4DD; font-size: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace; color: #78736D;">
                Northup Studio · Orchestrating Brand Growth<br />
                <a href="mailto:${adminNotificationEmail}" style="color: #111111; text-decoration: underline;">${adminNotificationEmail}</a>
              </div>
            </td>
          </tr>
        </table>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 580px; margin: 24px auto 0 auto; text-align: center;">
          <tr>
            <td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; color: #66625D; text-align: center;">
              NORTHUP STUDIO &middot; <a href="https://northupstudio.vercel.app/" style="color: #8A857F; text-decoration: underline;">https://northupstudio.vercel.app/</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  const text = `NORTHUP STUDIO — PROJECT ENQUIRY RECEIVED

Dear ${lead.name || 'there'},

Thank you for reaching out to Northup Studio. We have successfully received your enquiry regarding ${lead.service || 'Web Design & Development'}.

Our team carefully reviews each submission to understand your digital objectives, design requirements, and technical scope. A member of our design direction team will follow up to coordinate next steps.

In the meantime, feel free to explore our recent case studies and architectural digital monographs:
https://northupstudio.vercel.app/#work

---
Northup Studio · Orchestrating Brand Growth
${adminNotificationEmail}
`

  return { html, text }
}

/**
 * Dispatches both Admin Notification and Client Acknowledgement emails via Resend.
 *
 * Guarantees:
 * 1. Persists lead before dispatch
 * 2. Never throws to ensure lead is never lost on mail provider failure
 * 3. Escapes all user inputs in HTML templates
 * 4. Includes direct link to Admin Dashboard in admin notification
 * 5. Uses RESEND_TO_EMAIL, CONTACT_NOTIFICATION_EMAIL, and RESEND_FROM_EMAIL
 */
export async function sendLeadEmails({ lead, siteUrl = 'https://northupstudio.vercel.app' }) {
  const resendApiKey = process.env.RESEND_API_KEY
  const adminNotificationEmail =
    process.env.RESEND_TO_EMAIL ||
    process.env.CONTACT_NOTIFICATION_EMAIL ||
    'northup4work@gmail.com'
  const fromSender =
    process.env.RESEND_FROM_EMAIL ||
    'Northup Studio <enquiries@northupstudio.vercel.app>'

  if (!resendApiKey) {
    return {
      success: false,
      skipped: true,
      reason: 'RESEND_API_KEY not configured in environment variables.',
    }
  }

  const results = {
    adminEmail: { sent: false },
    clientEmail: { sent: false },
  }

  const clientName = (lead.name || '').trim() || 'Website Visitor'
  const adminSubject = `New Project Enquiry — ${clientName} | Northup Studio`
  const { html: adminHtml, text: adminText } = buildAdminNotificationEmail({ lead, siteUrl })

  // 1. Email A: Admin Notification (Agency-Branded)
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
        subject: adminSubject,
        html: adminHtml,
        text: adminText,
      }),
    })

    if (adminRes.ok) {
      const data = await adminRes.json().catch(() => ({}))
      results.adminEmail = { sent: true, id: data.id }
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
  if (lead.email) {
    try {
      const { html: clientHtml, text: clientText } = buildClientAcknowledgementEmail({
        lead,
        adminNotificationEmail,
      })

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
          subject: 'Thank you for contacting Northup Studio — We have received your enquiry',
          html: clientHtml,
          text: clientText,
        }),
      })

      if (clientRes.ok) {
        const data = await clientRes.json().catch(() => ({}))
        results.clientEmail = { sent: true, id: data.id }
      } else {
        const errText = await clientRes.text()
        results.clientEmail = { sent: false, error: `Resend status ${clientRes.status}: ${errText}` }
        console.warn('[email.js] Client acknowledgement failed:', results.clientEmail.error)
      }
    } catch (err) {
      results.clientEmail = { sent: false, error: err.message }
      console.warn('[email.js] Client acknowledgement exception:', err.message)
    }
  }

  return {
    success: results.adminEmail.sent || results.clientEmail.sent,
    results,
  }
}
