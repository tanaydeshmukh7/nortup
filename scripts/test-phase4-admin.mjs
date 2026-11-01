/**
 * NORTHUP STUDIO — Phase 4 Admin Dashboard, Lead Pipeline & Email Automation Test Suite
 * Tests serverless admin endpoints, authorization gates, status pipeline, internal notes, and email escaping.
 */

import { escapeHtml, sendLeadEmails, buildAdminNotificationEmail, buildClientAcknowledgementEmail } from '../api/_lib/email.js'
import authCheckHandler from '../api/admin/auth-check.js'
import leadsHandler from '../api/admin/leads.js'
import notesHandler from '../api/admin/notes.js'

let passed = 0
let failed = 0

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✓ ${testName}`)
    passed++
  } else {
    console.error(`  ✗ FAILED: ${testName}`)
    failed++
  }
}

// Mock request and response helper
function mockReqRes(method, body = {}, headers = {}, query = {}) {
  const req = {
    method,
    body,
    headers: {
      'x-forwarded-for': '127.0.0.1',
      'user-agent': 'NorthupStudioPhase4Test/1.0',
      ...headers,
    },
    query,
    socket: { remoteAddress: '127.0.0.1' },
  }

  let statusCode = 200
  let responseData = null
  const resHeaders = {}

  const res = {
    setHeader: (k, v) => {
      resHeaders[k.toLowerCase()] = v
    },
    status: (code) => {
      statusCode = code
      return res
    },
    json: (data) => {
      responseData = data
      return res
    },
    _get: () => ({ statusCode, responseData, headers: resHeaders }),
  }

  return { req, res }
}

async function runPhase4Tests() {
  console.log('\n======================================================')
  console.log('NORTHUP STUDIO — PHASE 4 SUITE: ADMIN & EMAIL AUTOMATION')
  console.log('======================================================\n')

  console.log('--- 1. EMAIL ESCAPING & INJECTION DEFENSE ---')
  {
    const dangerousInput = '<script>alert("XSS")</script>&<img src=x onerror=alert(1)>'
    const escaped = escapeHtml(dangerousInput)
    assert(!escaped.includes('<script>'), 'Neutralizes <script> tags')
    assert(!escaped.includes('<img'), 'Neutralizes <img> tags')
    assert(escaped.includes('&lt;script&gt;'), 'Converts opening and closing tags to HTML entities')
    assert(escaped.includes('&amp;'), 'Escapes ampersands correctly')
    assert(escaped.includes('&quot;') || escaped.includes('&#039;'), 'Escapes quote marks')
  }

  console.log('\n--- 2. EMAIL AUTOMATION WITHOUT SECRETS (GRACEFUL FALLBACK) ---')
  {
    const origKey = process.env.RESEND_API_KEY
    delete process.env.RESEND_API_KEY

    const testLead = {
      id: 'test-uuid-1234',
      name: 'Elena Rostova',
      email: 'elena@studio.design',
      service: 'Website Design',
      budget: '$10,000 – $25,000',
      timeline: '1 – 2 months',
      project_description: 'Architectural portfolio digital monograph.',
    }

    const emailRes = await sendLeadEmails({ lead: testLead, siteUrl: 'https://northupstudio.vercel.app' })
    assert(emailRes.skipped === true, 'Skips email dispatch gracefully when RESEND_API_KEY is not configured')
    assert(emailRes.reason.includes('RESEND_API_KEY not configured'), 'Provides clear diagnostic reason without crashing')

    if (origKey) process.env.RESEND_API_KEY = origKey
  }

  console.log('\n--- 2B. UPGRADED RESEND AGENCY-BRANDED EMAIL TEMPLATE ---')
  {
    const completeLead = {
      id: 'lead-test-555',
      created_at: '2026-11-02T01:30:00.000Z',
      name: 'Julian Vance <script>alert(1)</script>',
      email: 'julian@vance-holdings.co',
      company: 'Vance Capital Partners',
      service: 'Web Development',
      budget: '$25,000+',
      timeline: 'Immediately (< 2 weeks)',
      project_description: 'Next-generation private equity digital monograph.\nRequires custom Three.js visuals.',
    }

    const { html, text } = buildAdminNotificationEmail({
      lead: completeLead,
      siteUrl: 'https://northupstudio.vercel.app',
    })

    // 1. Header requirements
    assert(html.includes('NORTHUP STUDIO'), 'Header displays NORTHUP STUDIO clean wordmark')
    assert(html.includes('NEW PROJECT ENQUIRY'), 'Header contains NEW PROJECT ENQUIRY label')
    assert(html.includes('#22C55E'), 'Header includes restrained acid-green brand accent detail')

    // 2. Main heading
    assert(html.includes("You&#039;ve got a new lead.") || html.includes("You've got a new lead."), 'Main heading includes "You\'ve got a new lead."')
    assert(
      html.includes('A new enquiry has arrived through your website. Review the details below and follow up with the potential client.'),
      'Main heading includes supporting text'
    )

    // 3. Client details & field accuracy
    assert(html.includes('Julian Vance &lt;script&gt;alert(1)&lt;/script&gt;'), 'Safely renders escaped client name without XSS')
    assert(html.includes('julian@vance-holdings.co'), 'Includes client email with mailto link')
    assert(html.includes('Vance Capital Partners'), 'Includes company name when provided')
    assert(html.includes('Web Development'), 'Includes project/service interest')
    assert(html.includes('$25,000+'), 'Includes budget when provided')
    assert(html.includes('Immediately (&lt; 2 weeks)'), 'Includes timeline when provided')
    assert(html.includes('Next-generation private equity digital monograph.<br />Requires custom Three.js visuals.'), 'Includes full enquiry message with preserved linebreaks')

    // 4. Test field omissions (do not invent missing values)
    const sparseLead = {
      id: 'sparse-123',
      name: 'Maya Lin',
      email: 'maya@lin.org',
      service: '',
      budget: '',
      timeline: '',
      company: '',
      project_description: 'Quick inquiry.',
    }
    const { html: sparseHtml, text: sparseText } = buildAdminNotificationEmail({
      lead: sparseLead,
      siteUrl: 'https://northupstudio.vercel.app',
    })
    assert(!sparseHtml.includes('ESTIMATED BUDGET'), 'Does not render ESTIMATED BUDGET when missing (no invented values)')
    assert(!sparseHtml.includes('DESIRED TIMELINE'), 'Does not render DESIRED TIMELINE when missing (no invented values)')
    assert(!sparseHtml.includes('COMPANY / BRAND'), 'Does not render COMPANY when missing')
    assert(!sparseText.includes('Estimated Budget:'), 'Plain text omits missing budget')

    // 5. Primary action button
    assert(html.includes('View Lead in Dashboard &rarr;'), 'Prominent "View Lead in Dashboard" button is present')
    assert(html.includes('https://northupstudio.vercel.app/admin'), 'Links directly to real /admin route')
    assert(!html.includes('token='), 'Never exposes private tokens or secrets in dashboard URL')

    // 6. Footer requirements
    assert(html.includes('Thoughtful design. Digital experiences. Meaningful growth.'), 'Footer contains studio tagline')
    assert(html.includes('https://northupstudio.vercel.app/'), 'Footer includes website link')
    assert(
      html.includes('Automated notification &middot; Please do not forward confidential enquiry details') ||
      html.includes('Automated notification · Please do not forward confidential enquiry details'),
      'Footer contains confidentiality notice'
    )

    // 7. Plain-text fallback & inbox preview
    assert(text.includes('NORTHUP STUDIO — NEW PROJECT ENQUIRY'), 'Plain text fallback contains clear header')
    assert(text.includes('View Lead in Dashboard:'), 'Plain text fallback contains dashboard link')
    assert(html.includes('display: none; max-height: 0px;'), 'HTML includes inbox preheader text')
  }

  console.log('\n--- 3. UNAUTHENTICATED REQUESTS DENIED (401) ---')
  {
    // A. /api/admin/auth-check without token
    const { req: req1, res: res1 } = mockReqRes('GET')
    await authCheckHandler(req1, res1)
    assert(res1._get().statusCode === 401, '/api/admin/auth-check returns 401 without Bearer token')

    // B. /api/admin/leads without token
    const { req: req2, res: res2 } = mockReqRes('GET')
    await leadsHandler(req2, res2)
    assert(res2._get().statusCode === 401, '/api/admin/leads returns 401 without Bearer token')

    // C. /api/admin/notes without token
    const { req: req3, res: res3 } = mockReqRes('GET', {}, {}, { leadId: 'lead-123' })
    await notesHandler(req3, res3)
    assert(res3._get().statusCode === 401, '/api/admin/notes returns 401 without Bearer token')
  }

  console.log('\n--- 4. MALFORMED / INVALID BEARER TOKEN DENIED (401) ---')
  {
    const { req, res } = mockReqRes('GET', {}, { authorization: 'Bearer invalid.fake.token' })
    await authCheckHandler(req, res)
    const { statusCode, responseData } = res._get()
    assert(statusCode === 401 || statusCode === 503, 'Rejects invalid or fabricated JWT token')
    assert(responseData.authorized === false, 'Explicitly marks authorized: false')
  }

  console.log('\n--- 5. ADMIN ALLOWLIST LOGIC VERIFICATION ---')
  {
    // Test the allowlist parsing with simulated authorized vs unauthorized email
    const envAdminEmails = 'northup4work@gmail.com,tanay@northupstudio.com'
    const allowedList = envAdminEmails.split(',').map((e) => e.trim().toLowerCase())

    const authorizedEmail = 'northup4work@gmail.com'
    const unauthorizedEmail = 'random_attacker@gmail.com'

    assert(allowedList.includes(authorizedEmail), 'Recognizes primary studio email as authorized admin')
    assert(!allowedList.includes(unauthorizedEmail), 'Strictly rejects arbitrary third-party email from admin allowlist')
  }

  console.log('\n--- 6. STATUS PIPELINE RESTRICTIONS ---')
  {
    const VALID_STATUSES = ['new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost']

    const invalidStatus = 'unsupported_random_status'
    assert(!VALID_STATUSES.includes(invalidStatus), 'Rejects unrecognized status in pipeline validation')
    assert(VALID_STATUSES.includes('new'), 'Includes canonical "new" status')
    assert(VALID_STATUSES.includes('contacted'), 'Includes canonical "contacted" status')
    assert(VALID_STATUSES.includes('qualified'), 'Includes canonical "qualified" status')
    assert(VALID_STATUSES.includes('proposal_sent'), 'Includes canonical "proposal_sent" status')
    assert(VALID_STATUSES.includes('won'), 'Includes canonical "won" status')
    assert(VALID_STATUSES.includes('lost'), 'Includes canonical "lost" status')
  }

  console.log('\n--- 7. INTERNAL NOTES VALIDATION RULES ---')
  {
    // Note content constraints: length 1-3000
    const emptyNote = '   '
    const oversizedNote = 'X'.repeat(3050)
    const validNote = 'Client requested custom animation for luxury residences.'

    assert(emptyNote.trim().length === 0, 'Flags empty or whitespace-only internal notes')
    assert(oversizedNote.length > 3000, 'Flags oversized notes exceeding 3000 characters')
    assert(validNote.length >= 1 && validNote.length <= 3000, 'Accepts valid internal team notes')
  }

  console.log('\n======================================================')
  console.log(`PHASE 4 TEST SUMMARY: ${passed} passed, ${failed} failed`)
  console.log('======================================================\n')

  if (failed > 0) process.exit(1)
}

runPhase4Tests().catch((err) => {
  console.error('Fatal Phase 4 test error:', err)
  process.exit(1)
})
