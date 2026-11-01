/**
 * NORTHUP STUDIO — Client Communication Templates (Phase C)
 * Contains the 14 starter templates with variable interpolation and channel formats.
 */

export const DEFAULT_VARIABLES = {
  agency_name: 'NORTHUP STUDIO',
  sender_name: 'Northup Studio Design Team',
  proposal_url: 'https://northupstudio.vercel.app/#work',
  invoice_url: 'https://northupstudio.vercel.app/',
  meeting_link: 'https://meet.google.com/new',
  next_step: 'Schedule a 20-minute discovery consultation',
}

export const STARTER_TEMPLATES = [
  {
    key: 'initial_acknowledgement',
    title: 'Initial Enquiry Acknowledgement',
    category: 'Intake',
    subject: 'We have received your enquiry — {{agency_name}}',
    body_email: `Dear {{client_name}},

Thank you for reaching out to {{agency_name}} regarding {{service_name}}.

We have received your project details and our design direction team is reviewing your requirements. We evaluate every submission to ensure our digital architecture aligns with your objectives.

Next step: {{next_step}}.

Warm regards,
{{sender_name}}
{{agency_name}}`,
    body_whatsapp: `Hello {{client_name}}, thank you for reaching out to {{agency_name}} regarding {{service_name}}. We've received your enquiry and our design team is reviewing your project details. We'll be in touch shortly with next steps.`,
    variables: ['client_name', 'agency_name', 'service_name', 'next_step', 'sender_name'],
  },
  {
    key: 'personal_welcome',
    title: 'Personal Welcome Message',
    category: 'Intake',
    subject: 'Welcome to {{agency_name}} — Project Discussion',
    body_email: `Hi {{client_name}},

I'm personally reaching out from {{agency_name}} following your enquiry for {{service_name}}.

We're excited by your vision and would love to learn more about your brand milestones and timeline. You can explore some of our recent architectural monographs and digital experiences here: https://northupstudio.vercel.app/#work

Looking forward to our conversation.

Best,
{{sender_name}}`,
    body_whatsapp: `Hi {{client_name}}, I'm personally reaching out from {{agency_name}} regarding your {{service_name}} enquiry. We'd love to learn more about your brand and discuss how we can partner together.`,
    variables: ['client_name', 'agency_name', 'service_name', 'sender_name'],
  },
  {
    key: 'discovery_invitation',
    title: 'Discovery Call Invitation',
    category: 'Consultation',
    subject: 'Invitation: Digital Discovery Session with {{agency_name}}',
    body_email: `Hi {{client_name}},

We would love to invite you to a 25-minute Discovery Consultation to dive deeper into your scope for {{service_name}}.

During this session, we will audit your current digital footprint, discuss your aesthetic preferences, and outline an architectural roadmap.

Please let us know your preferred availability or book directly through our discovery link.

Warm regards,
{{sender_name}}
{{agency_name}}`,
    body_whatsapp: `Hi {{client_name}}, we'd love to invite you to a 25-minute Discovery Session with {{agency_name}} to discuss your scope for {{service_name}}. When is a convenient time for a brief Google Meet this week?`,
    variables: ['client_name', 'agency_name', 'service_name', 'sender_name'],
  },
  {
    key: 'meeting_confirmation',
    title: 'Google Meet Confirmation',
    category: 'Consultation',
    subject: 'Confirmed: Discovery Session with {{agency_name}} — {{meeting_date}}',
    body_email: `Hi {{client_name}},

Your consultation session with {{agency_name}} is confirmed.

Session Details:
- Date: {{meeting_date}}
- Time: {{meeting_time}}
- Video Link: {{meeting_link}}
- Topic: {{service_name}} Strategy & Architectural Scope

We look forward to speaking with you.

Best,
{{sender_name}}`,
    body_whatsapp: `Confirmed: Your discovery consultation with {{agency_name}} is set for {{meeting_date}} at {{meeting_time}}. Video meeting link: {{meeting_link}}. Looking forward to speaking!`,
    variables: ['client_name', 'agency_name', 'meeting_date', 'meeting_time', 'meeting_link', 'service_name', 'sender_name'],
  },
  {
    key: 'proposal_ready',
    title: 'Proposal Ready / Proposal Sent',
    category: 'Proposals',
    subject: 'Project Proposal: {{service_name}} — {{agency_name}}',
    body_email: `Dear {{client_name}},

Following our discussions, we have finalized your bespoke project proposal for {{service_name}}.

You can review the deliverables, milestone schedule, and itemized investment here:
{{proposal_url}}

Please review the scope at your convenience. We are available to answer any questions or refine specific milestones.

Warm regards,
{{sender_name}}
{{agency_name}}`,
    body_whatsapp: `Hi {{client_name}}, your bespoke project proposal for {{service_name}} is ready for your review: {{proposal_url}}. Please take a look and let us know your thoughts!`,
    variables: ['client_name', 'agency_name', 'service_name', 'proposal_url', 'sender_name'],
  },
  {
    key: 'proposal_followup',
    title: 'Proposal Follow-up',
    category: 'Proposals',
    subject: 'Following up: Project Proposal for {{service_name}}',
    body_email: `Hi {{client_name}},

I'm following up on the proposal we prepared for {{service_name}}.

Have you had a chance to review the scope and milestones? If you have any questions or would like to adjust any deliverables, we're happy to jump on a quick call.

Review proposal: {{proposal_url}}

Best regards,
{{sender_name}}`,
    body_whatsapp: `Hi {{client_name}}, just following up on the {{service_name}} proposal we shared recently ({{proposal_url}}). Do you have any questions or items you'd like to adjust?`,
    variables: ['client_name', 'service_name', 'proposal_url', 'sender_name'],
  },
  {
    key: 'project_accepted',
    title: 'Project Accepted / Onboarding',
    category: 'Onboarding',
    subject: 'Welcome Aboard! Next steps for {{project_name}} — {{agency_name}}',
    body_email: `Dear {{client_name}},

We are thrilled to welcome you as an active client of {{agency_name}}.

Your project {{project_name}} has officially entered our design engineering pipeline. Next step: {{next_step}}.

Our production team will initiate brand discovery and architectural wireframing. We'll be sharing our collaborative workspace invite shortly.

Warm regards,
{{sender_name}}
{{agency_name}}`,
    body_whatsapp: `Welcome aboard, {{client_name}}! We're excited to partner with you on {{project_name}}. Next step: {{next_step}}. We'll share our project board invite shortly.`,
    variables: ['client_name', 'agency_name', 'project_name', 'next_step', 'sender_name'],
  },
  {
    key: 'payment_reminder',
    title: 'Invoice / Payment Reminder',
    category: 'Billing',
    subject: 'Invoice Notice: {{project_name}} milestone payment',
    body_email: `Hi {{client_name}},

This is a gentle reminder regarding the invoice for {{project_name}}.

You can view invoice details and settlement instructions here:
{{invoice_url}}

If you have already processed this transaction, please disregard this note. Thank you for your continued partnership.

Warm regards,
{{sender_name}}`,
    body_whatsapp: `Hi {{client_name}}, this is a friendly reminder regarding the invoice for {{project_name}}. You can view details here: {{invoice_url}}. Thank you!`,
    variables: ['client_name', 'project_name', 'invoice_url', 'sender_name'],
  },
  {
    key: 'progress_update',
    title: 'Project Progress Update',
    category: 'Production',
    subject: 'Progress Update: {{project_name}} — {{agency_name}}',
    body_email: `Hi {{client_name}},

Here is a quick milestone update on {{project_name}}.

Our team has completed the latest design phase and we are currently working on {{next_step}}. The work is tracking right on schedule.

We will share the staging preview link as soon as the review build is ready.

Best regards,
{{sender_name}}`,
    body_whatsapp: `Hi {{client_name}}, quick progress update on {{project_name}}: our latest milestone is complete, and we are now moving forward with {{next_step}}. Looking great so far!`,
    variables: ['client_name', 'agency_name', 'project_name', 'next_step', 'sender_name'],
  },
  {
    key: 'feedback_request',
    title: 'Feedback / Revision Request',
    category: 'Production',
    subject: 'Review Ready: Please provide feedback on {{project_name}}',
    body_email: `Hi {{client_name}},

The latest build for {{project_name}} is ready for your review and feedback.

Please take a look and let us know your thoughts or specific revision points:
{{proposal_url}}

To keep our launch timeline on track, we kindly request your feedback by the end of this week.

Warm regards,
{{sender_name}}`,
    body_whatsapp: `Hi {{client_name}}, the latest review build for {{project_name}} is ready for your input! Please review when convenient and share your thoughts so we can finalize adjustments.`,
    variables: ['client_name', 'project_name', 'proposal_url', 'sender_name'],
  },
  {
    key: 'project_handover',
    title: 'Project Completion / Handover',
    category: 'Delivery',
    subject: 'Project Handover Complete: {{project_name}} is Live! 🚀',
    body_email: `Dear {{client_name}},

Congratulations! {{project_name}} is officially completed and delivered.

All production assets, credentials, and documentation have been handed over. It has been a pleasure collaborating with your team to bring this digital experience to life.

If you ever need future enhancements or technical maintenance, our team is always here for you.

Warmest regards,
{{sender_name}}
{{agency_name}}`,
    body_whatsapp: `Congratulations {{client_name}}! {{project_name}} is officially live and delivered. Thank you for being such a wonderful partner throughout this journey.`,
    variables: ['client_name', 'agency_name', 'project_name', 'sender_name'],
  },
  {
    key: 'testimonial_request',
    title: 'Testimonial & Referral Request',
    category: 'Advocacy',
    subject: 'Reflections on working together — {{agency_name}}',
    body_email: `Hi {{client_name}},

Now that {{project_name}} has successfully launched, we would be deeply grateful if you could share a brief testimonial about your experience working with {{agency_name}}.

Your feedback helps other ambitious brands discover our studio and craftsmanship.

Thank you once again for your trust and collaboration.

Best regards,
{{sender_name}}`,
    body_whatsapp: `Hi {{client_name}}, now that {{project_name}} has launched, would you mind sharing a quick 2-sentence testimonial about working with {{agency_name}}? We'd be deeply grateful!`,
    variables: ['client_name', 'agency_name', 'project_name', 'sender_name'],
  },
  {
    key: 'polite_followup',
    title: 'Polite Follow-up (No Response)',
    category: 'Follow-up',
    subject: 'Checking in: {{service_name}} inquiry with {{agency_name}}',
    body_email: `Hi {{client_name}},

I wanted to quickly check in regarding your inquiry for {{service_name}}.

We understand you may be busy or your project timeline may have shifted. Whenever you are ready to pick things up, our team is here to assist.

Wishing you all the best.

Sincerely,
{{sender_name}}
{{agency_name}}`,
    body_whatsapp: `Hi {{client_name}}, just checking in regarding your {{service_name}} inquiry with {{agency_name}}. Let us know whenever you'd like to reconnect—no rush at all!`,
    variables: ['client_name', 'agency_name', 'service_name', 'sender_name'],
  },
  {
    key: 'custom_message',
    title: 'Custom Message',
    category: 'Custom',
    subject: 'Update regarding {{service_name}} — {{agency_name}}',
    body_email: `Dear {{client_name}},

{{next_step}}

Please let us know if you have any questions.

Best regards,
{{sender_name}}
{{agency_name}}`,
    body_whatsapp: `Hi {{client_name}}, {{next_step}}. Let us know if you have any questions! — {{agency_name}}`,
    variables: ['client_name', 'agency_name', 'service_name', 'next_step', 'sender_name'],
  },
]

/**
 * Safely replaces {{variable}} patterns in text.
 * Flags missing variables if required.
 */
export function interpolateTemplate(text = '', variables = {}) {
  const mergedVars = { ...DEFAULT_VARIABLES, ...variables }
  const missingVars = []

  const result = text.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (match, varName) => {
    const val = mergedVars[varName]
    if (val !== undefined && val !== null && String(val).trim().length > 0) {
      return String(val)
    }
    missingVars.push(varName)
    return `[${varName}]`
  })

  return {
    text: result,
    missingVars: Array.from(new Set(missingVars)),
  }
}
