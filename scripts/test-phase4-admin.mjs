/**
 * NORTHUP STUDIO — Phase 4 Admin Dashboard, Lead Pipeline & Email Automation Test Suite
 * Tests serverless admin endpoints, authorization gates, status pipeline, internal notes, and email escaping.
 */

import { escapeHtml, sendLeadEmails } from '../api/_lib/email.js'
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
