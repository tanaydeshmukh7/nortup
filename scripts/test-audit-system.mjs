/**
 * NORTHUP STUDIO — Audit System & Serverless API Test Suite
 * Tests /api/audit, /api/admin/audits, validation, email escaping, security, and conversion workflows.
 */

import fs from 'fs'
import auditHandler from '../api/audit.js'
import adminAuditsHandler from '../api/admin/audits.js'
import {
  escapeHtml,
  buildAuditNotificationEmail,
  buildAuditClientAcknowledgementEmail,
  sendAuditEmails,
} from '../api/_lib/email.js'

// Load .env.local if present
if (fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf-8')
  for (const line of envContent.split(/\r?\n/)) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
    if (match) {
      let key = match[1]
      let val = match[2] || ''
      val = val.replace(/^['"](.*)['"]$/, '$1')
      process.env[key] = val
    }
  }
}

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
  let ipCounter = Math.floor(Math.random() * 100000)
  const ip = headers['x-forwarded-for'] || `192.168.1.${ipCounter}`
  const req = {
    method,
    body,
    headers: {
      'x-forwarded-for': ip,
      'user-agent': 'NorthupStudioAuditTestRunner/1.0',
      ...headers,
    },
    query,
    socket: { remoteAddress: ip },
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

async function runAuditTests() {
  console.log('\n======================================================')
  console.log('NORTHUP STUDIO — AUDIT SYSTEM VERIFICATION SUITE')
  console.log('======================================================\n')

  // 1. Validation & Input Sanitization
  console.log('--- 1. INPUT VALIDATION & CONSTRAINTS ---')

  // Method check
  {
    const { req, res } = mockReqRes('GET')
    await auditHandler(req, res)
    const { statusCode, responseData } = res._get()
    assert(statusCode === 405, 'Rejects GET requests with 405 Method Not Allowed')
    assert(responseData.success === false, 'Explicitly marks success: false on rejected method')
  }

  // Missing required fields
  {
    const { req, res } = mockReqRes('POST', {})
    await auditHandler(req, res)
    const { statusCode, responseData } = res._get()
    assert(statusCode === 400, 'Rejects empty payload with 400 Bad Request')
    assert(responseData.validationErrors?.name, 'Flags missing name')
    assert(responseData.validationErrors?.email, 'Flags missing email')
    assert(responseData.validationErrors?.website, 'Flags missing website')
    assert(responseData.validationErrors?.auditType, 'Flags missing audit focus')
  }

  // Invalid email format
  {
    const { req, res } = mockReqRes('POST', {
      name: 'Elena Rostova',
      email: 'not-an-email',
      website: 'https://rostova-interiors.com',
      auditType: 'Complete digital experience',
    })
    await auditHandler(req, res)
    const { statusCode, responseData } = res._get()
    assert(statusCode === 400, 'Rejects invalid email format with 400')
    assert(responseData.validationErrors?.email, 'Provides email validation error')
  }

  // Invalid website URL (no dot or invalid protocol)
  {
    const { req, res } = mockReqRes('POST', {
      name: 'Elena Rostova',
      email: 'elena@rostova.com',
      website: 'invalid-url-no-dot',
      auditType: 'Complete digital experience',
    })
    await auditHandler(req, res)
    const { statusCode, responseData } = res._get()
    assert(statusCode === 400, 'Rejects invalid website without domain')
  }

  // Invalid audit type selection
  {
    const { req, res } = mockReqRes('POST', {
      name: 'Elena Rostova',
      email: 'elena@rostova.com',
      website: 'https://rostova-interiors.com',
      auditType: 'Invented Fake Audit Type',
    })
    await auditHandler(req, res)
    const { statusCode, responseData } = res._get()
    assert(statusCode === 400, 'Rejects unapproved audit type')
  }

  // 2. Honeypot Defense
  console.log('\n--- 2. BOT DEFENSE & HONEYPOT TRAPS ---')
  {
    const { req, res } = mockReqRes('POST', {
      name: 'Spam Bot',
      email: 'bot@spam.com',
      website: 'https://spam.com',
      auditType: 'Complete digital experience',
      website_hp: 'http://spam-link.ru',
    })
    await auditHandler(req, res)
    const { statusCode, responseData } = res._get()
    assert(statusCode === 200, 'Silently acknowledges honeypot bot with 200 OK')
    assert(responseData.message?.includes('received'), 'Returns success message to discard bot without processing')
  }

  // 3. Email Templates & Escaping
  console.log('\n--- 3. EMAIL GENERATION & XSS DEFENSE ---')
  {
    const maliciousPayload = {
      full_name: 'Test <script>alert("hack")</script>',
      work_email: 'safe@test.com',
      website_url: 'https://example.com"><img src=x onerror=alert(1)>',
      audit_type: 'Website design & user experience',
      biggest_challenge: 'Goals with <style>body{display:none}</style> injection',
      created_at: new Date().toISOString(),
    }

    const { html, text } = buildAuditNotificationEmail({ auditRequest: maliciousPayload })
    assert(!html.includes('<script>'), 'Neutralizes <script> in notification email')
    assert(!html.includes('<img src=x onerror=alert(1)>'), 'Neutralizes HTML injection in website link')
    assert(html.includes('&lt;script&gt;'), 'Properly encodes script tags to safe HTML entities')
    assert(html.includes('FREE AUDIT REQUEST'), 'Header includes agency-branded FREE AUDIT REQUEST badge')
    assert(html.includes('You&#039;ve got an audit request.') || html.includes("You've got an audit request."), 'Main heading is present')
    assert(text.includes('Client Name:     Test <script>alert("hack")</script>'), 'Plain text contains readable client details')
    assert(html.includes('/admin'), 'Includes direct link to real /admin console')
  }

  // Client acknowledgement email
  {
    const auditRequest = {
      full_name: 'Sophia Laurent',
      work_email: 'sophia@laurent.co',
      website_url: 'https://laurent.co',
      audit_type: 'Complete digital experience',
    }

    const { html, text } = buildAuditClientAcknowledgementEmail({ auditRequest })
    assert(html.includes('Sophia Laurent'), 'Client acknowledgement includes client name')
    assert(html.includes('https://laurent.co'), 'Client acknowledgement includes website URL')
    assert(html.includes('24 to 48 hours'), 'Includes standard 24–48 hours turnaround timeline')
    assert(text.includes('NORTHUP STUDIO — AUDIT REQUEST RECEIVED'), 'Plain text fallback contains clear header')
  }

  // 4. Admin API Authorization
  console.log('\n--- 4. ADMIN ENDPOINT SECURITY ---')
  {
    const { req, res } = mockReqRes('GET')
    await adminAuditsHandler(req, res)
    const { statusCode, responseData } = res._get()
    assert(statusCode === 401, '/api/admin/audits returns 401 Unauthorized without Bearer token')
    assert(responseData.success === false, 'Authorized flag is false')
  }

  {
    const { req, res } = mockReqRes('GET', {}, { authorization: 'Bearer invalid.fake.token' })
    await adminAuditsHandler(req, res)
    const { statusCode, responseData } = res._get()
    assert(statusCode === 401 || statusCode === 503, '/api/admin/audits rejects fabricated Bearer token')
    assert(responseData.authorized === false || responseData.success === false, 'Explicitly marks request as unauthorized')
  }

  {
    const { req, res } = mockReqRes('PATCH')
    await adminAuditsHandler(req, res)
    const { statusCode } = res._get()
    assert(statusCode === 401, 'PATCH /api/admin/audits rejects unauthenticated mutation')
  }

  console.log('\n======================================================')
  console.log(`TEST SUMMARY: ${passed} passed, ${failed} failed`)
  console.log('======================================================\n')

  if (failed > 0) {
    process.exit(1)
  }
}

runAuditTests().catch((err) => {
  console.error('Test execution failed:', err)
  process.exit(1)
})
