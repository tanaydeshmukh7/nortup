import { verifyAdminRequest } from '../_lib/auth.js'
import { escapeHtml } from '../_lib/email.js'

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

  // 2. GET: Retrieve communication history for a lead
  if (req.method === 'GET') {
    try {
      const { leadId } = req.query || {}
      if (!leadId) {
        return res.status(400).json({ success: false, error: 'Missing required leadId parameter.' })
      }

      const { data: logs, error } = await supabase
        .from('communication_logs')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false })

      if (error) {
        console.warn('[communication.js] Error querying communication_logs table:', error.message)
        // If table does not exist yet before migration is applied, return empty list safely
        return res.status(200).json({ success: true, logs: [] })
      }

      return res.status(200).json({ success: true, logs: logs || [] })
    } catch (err) {
      console.error('[communication.js] Exception in GET:', err.message)
      return res.status(500).json({ success: false, error: 'Failed to retrieve communication logs.' })
    }
  }

  // 3. POST: Dispatch communication (Email / WhatsApp / Meeting Note)
  if (req.method === 'POST') {
    try {
      const body = req.body || {}
      const {
        leadId,
        channel = 'email', // 'email' | 'whatsapp' | 'both' | 'manual_whatsapp' | 'meeting'
        recipient,
        recipientPhone,
        subject = 'Message from Northup Studio',
        content,
        templateKey = 'custom_message',
      } = body

      if (!leadId || !content) {
        return res.status(400).json({
          success: false,
          error: 'Missing required leadId or content parameters.',
        })
      }

      const cleanContent = String(content).trim()
      const channelResults = {
        email: { sent: false },
        whatsapp: { sent: false },
      }

      // --- CHANNEL A: EMAIL VIA RESEND ---
      if (channel === 'email' || channel === 'both') {
        const resendApiKey = process.env.RESEND_API_KEY
        const fromSender = process.env.RESEND_FROM_EMAIL || 'Northup Studio <onboarding@resend.dev>'
        const adminEmail = process.env.RESEND_TO_EMAIL || 'northup4work@gmail.com'

        if (!recipient || !recipient.includes('@')) {
          channelResults.email = { sent: false, error: 'Valid client email address required.' }
        } else if (!resendApiKey) {
          channelResults.email = { sent: false, error: 'RESEND_API_KEY is not configured in server environment.' }
        } else {
          try {
            const safeHtmlContent = escapeHtml(cleanContent).replace(/\n/g, '<br />')
            const emailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0C0C0C; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #F5F1EB;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #0C0C0C; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 580px; background-color: #151515; border: 1px solid #303030; border-radius: 12px; overflow: hidden; box-shadow: 0 16px 40px rgba(0,0,0,0.6);">
          <tr>
            <td style="height: 3px; background-color: #FF8A3D; line-height: 3px; font-size: 3px;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding: 36px 32px;">
              <div style="font-size: 13px; font-weight: 700; letter-spacing: 2px; color: #F5F1EB; text-transform: uppercase; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #303030;">
                NORTHUP STUDIO
              </div>
              <div style="font-size: 14px; line-height: 1.7; color: #D6D0C7; margin-bottom: 28px;">
                ${safeHtmlContent}
              </div>
              <div style="padding-top: 20px; border-top: 1px solid #303030; font-size: 11px; color: #A6A09A; font-family: monospace;">
                Northup Studio · Orchestrating Brand Growth<br />
                <a href="https://northupstudio.vercel.app/" style="color: #FF8A3D; text-decoration: underline;">northupstudio.vercel.app</a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

            const resendRes = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                from: fromSender,
                to: [recipient],
                reply_to: adminEmail,
                subject: subject,
                html: emailHtml,
                text: cleanContent,
              }),
            })

            if (resendRes.ok) {
              const resendData = await resendRes.json().catch(() => ({}))
              channelResults.email = { sent: true, id: resendData.id }
            } else {
              const errText = await resendRes.text()
              channelResults.email = { sent: false, error: `Resend HTTP ${resendRes.status}: ${errText}` }
            }
          } catch (mailErr) {
            channelResults.email = { sent: false, error: mailErr.message }
          }
        }
      }

      // --- CHANNEL B: WHATSAPP CLOUD API / CLICK-TO-CHAT FALLBACK ---
      let waStatus = 'draft'
      let waLink = null

      if (recipientPhone) {
        const cleanPhone = recipientPhone.replace(/[^0-9]/g, '')
        waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(cleanContent)}`
      }

      if (channel === 'whatsapp' || channel === 'both') {
        const waToken = process.env.WHATSAPP_ACCESS_TOKEN
        const waPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID

        if (!recipientPhone) {
          channelResults.whatsapp = { sent: false, error: 'Recipient phone number is required for WhatsApp.' }
        } else if (!waToken || !waPhoneId) {
          // Cloud API unconfigured: provide honest manual click-to-chat fallback!
          channelResults.whatsapp = {
            sent: false,
            manualFallback: true,
            waLink,
            reason: 'WhatsApp Business Cloud API credentials not configured in environment. Use 1-click manual WhatsApp fallback below.',
          }
          waStatus = 'manual_opened'
        } else {
          try {
            const cleanPhone = recipientPhone.replace(/[^0-9]/g, '')
            const waRes = await fetch(`https://graph.facebook.com/v20.0/${waPhoneId}/messages`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${waToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: cleanPhone,
                type: 'text',
                text: { body: cleanContent },
              }),
            })

            if (waRes.ok) {
              const waData = await waRes.json().catch(() => ({}))
              channelResults.whatsapp = { sent: true, id: waData?.messages?.[0]?.id }
              waStatus = 'sent'
            } else {
              const errText = await waRes.text()
              channelResults.whatsapp = {
                sent: false,
                manualFallback: true,
                waLink,
                error: `WhatsApp API error: ${errText}`,
              }
              waStatus = 'failed'
            }
          } catch (waErr) {
            channelResults.whatsapp = {
              sent: false,
              manualFallback: true,
              waLink,
              error: waErr.message,
            }
            waStatus = 'failed'
          }
        }
      }

      // Determine overall log status
      let overallStatus = 'sent'
      if (channel === 'email' && !channelResults.email.sent) overallStatus = 'failed'
      if (channel === 'whatsapp' && !channelResults.whatsapp.sent) {
        overallStatus = channelResults.whatsapp.manualFallback ? 'manual_opened' : 'failed'
      }
      if (channel === 'both' && !channelResults.email.sent && !channelResults.whatsapp.sent) {
        overallStatus = 'failed'
      }

      // --- 4. RECORD IN COMMUNICATION LOGS ---
      let savedLog = null
      try {
        const { data: logData, error: logError } = await supabase
          .from('communication_logs')
          .insert([
            {
              lead_id: leadId,
              channel: channel,
              direction: 'outbound',
              recipient: recipient || recipientPhone || 'Client',
              subject: subject,
              template_key: templateKey,
              content: cleanContent,
              status: overallStatus,
              provider_id: channelResults.email.id || channelResults.whatsapp.id || null,
              error_message: channelResults.email.error || channelResults.whatsapp.error || null,
              metadata: {
                channelResults,
                waLink,
              },
            },
          ])
          .select()
          .single()

        if (!logError && logData) {
          savedLog = logData
        }
      } catch (logDbErr) {
        console.warn('[communication.js] Could not save log to DB (table may not be migrated yet):', logDbErr.message)
      }

      return res.status(200).json({
        success: overallStatus === 'sent' || overallStatus === 'manual_opened',
        status: overallStatus,
        results: channelResults,
        waLink,
        log: savedLog || {
          id: 'temp-' + Date.now(),
          lead_id: leadId,
          channel,
          subject,
          content: cleanContent,
          status: overallStatus,
          created_at: new Date().toISOString(),
        },
      })
    } catch (err) {
      console.error('[communication.js] Exception in POST:', err.message)
      return res.status(500).json({
        success: false,
        error: 'An internal server error occurred while sending communication.',
      })
    }
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).json({ success: false, error: 'Method not allowed. Use GET or POST.' })
}
