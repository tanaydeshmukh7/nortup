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

  if (req.method === 'POST') {
    try {
      const body = req.body || {}
      const {
        leadId,
        clientName,
        clientEmail,
        meetingDate,
        meetingTime,
        durationMinutes = 30,
        timezone = 'UTC',
        title = 'Northup Studio — Digital Discovery Consultation',
        agenda = 'Review digital objectives, audit current website architecture, and scope roadmap.',
        manualMeetingLink = '',
      } = body

      if (!leadId || !meetingDate || !meetingTime) {
        return res.status(400).json({
          success: false,
          error: 'Missing required meeting scheduling fields (leadId, meetingDate, meetingTime).',
        })
      }

      // Check Google Calendar API OAuth credentials
      const googleClientId = process.env.GOOGLE_CLIENT_ID
      const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
      const googleRefreshToken = process.env.GOOGLE_REFRESH_TOKEN

      const isGoogleConfigured = Boolean(googleClientId && googleClientSecret && googleRefreshToken)
      let meetUrl = manualMeetingLink ? manualMeetingLink.trim() : null
      let calendarEventId = null

      if (!isGoogleConfigured && !meetUrl) {
        // Fallback default Google Meet new room URL if none provided
        meetUrl = 'https://meet.google.com/new'
      }

      // If Google OAuth is configured, we could refresh token and call Google Calendar API
      // Here we check and execute if tokens exist, otherwise use honest fallback
      if (isGoogleConfigured) {
        try {
          // Exchange refresh token for access token
          const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              client_id: googleClientId,
              client_secret: googleClientSecret,
              refresh_token: googleRefreshToken,
              grant_type: 'refresh_token',
            }),
          })

          if (tokenRes.ok) {
            const tokenData = await tokenRes.json()
            const accessToken = tokenData.access_token

            const startDateTime = new Date(`${meetingDate}T${meetingTime}:00`)
            const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60000)

            const calRes = await fetch(
              'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1',
              {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  summary: title,
                  description: agenda,
                  start: { dateTime: startDateTime.toISOString(), timeZone: timezone },
                  end: { dateTime: endDateTime.toISOString(), timeZone: timezone },
                  attendees: clientEmail ? [{ email: clientEmail }] : [],
                  conferenceData: {
                    createRequest: {
                      requestId: `meet-${Date.now()}`,
                      conferenceSolutionKey: { type: 'hangoutsMeet' },
                    },
                  },
                }),
              }
            )

            if (calRes.ok) {
              const calData = await calRes.json()
              calendarEventId = calData.id
              meetUrl = calData.hangoutLink || meetUrl
            }
          }
        } catch (calErr) {
          console.warn('[schedule-meeting.js] Google Calendar API error:', calErr.message)
        }
      }

      // Record meeting in communication_logs
      const meetingSummary = `Consultation scheduled: ${meetingDate} at ${meetingTime} (${timezone}). Video Meeting Link: ${meetUrl}. Agenda: ${agenda}`
      try {
        await supabase.from('communication_logs').insert([
          {
            lead_id: leadId,
            channel: 'meeting',
            direction: 'outbound',
            recipient: clientEmail || clientName,
            subject: title,
            content: meetingSummary,
            status: 'scheduled',
            metadata: {
              meetingDate,
              meetingTime,
              timezone,
              meetUrl,
              calendarEventId,
              isGoogleConfigured,
            },
          },
        ])

        // Update lead's next_follow_up_date to the meeting date
        await supabase
          .from('leads')
          .update({
            next_follow_up_date: new Date(`${meetingDate}T${meetingTime}:00`).toISOString(),
            follow_up_completed: false,
          })
          .eq('id', leadId)
      } catch (dbErr) {
        console.warn('[schedule-meeting.js] Could not record log in DB:', dbErr.message)
      }

      return res.status(200).json({
        success: true,
        message: 'Meeting scheduled successfully.',
        meeting: {
          meetingDate,
          meetingTime,
          meetUrl,
          timezone,
          isGoogleConfigured,
          calendarEventId,
        },
      })
    } catch (err) {
      console.error('[schedule-meeting.js] Exception in POST:', err.message)
      return res.status(500).json({ success: false, error: 'Failed to schedule meeting.' })
    }
  }

  res.setHeader('Allow', 'POST')
  return res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' })
}
