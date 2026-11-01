/**
 * NORTHUP STUDIO — Phase 3 Production Contact System Verification Suite
 * Tests Serverless Endpoint (/api/contact) logic, validation, security, and spam defenses.
 */

const http = require('http');
const handlerModule = require('../api/contact.js');
const handler = handlerModule.default || handlerModule;

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✓ ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAILED: ${testName}`);
    failed++;
  }
}

let testIpCounter = 1;

// Mock request and response helper
function mockReqRes(method, body = {}, headers = {}) {
  const ip = headers['x-forwarded-for'] || `10.0.0.${testIpCounter++}`;
  const req = {
    method,
    body,
    headers: {
      'x-forwarded-for': ip,
      'user-agent': 'NorthupStudioTestRunner/1.0',
      ...headers,
    },
    socket: { remoteAddress: ip },
  };

  let statusCode = 200;
  let responseData = null;
  const resHeaders = {};

  const res = {
    setHeader: (k, v) => {
      resHeaders[k.toLowerCase()] = v;
    },
    status: (code) => {
      statusCode = code;
      return res;
    },
    json: (data) => {
      responseData = data;
      return res;
    },
    _get: () => ({ statusCode, responseData, headers: resHeaders }),
  };

  return { req, res };
}

async function runTests() {
  console.log('\n======================================================');
  console.log('NORTHUP STUDIO — PHASE 3 CONTACT SYSTEM VERIFICATION');
  console.log('======================================================\n');

  console.log('--- 1. HTTP METHOD & SECURITY HEADERS ---');
  {
    const { req, res } = mockReqRes('GET');
    await handler(req, res);
    const { statusCode, responseData, headers } = res._get();
    assert(statusCode === 405, 'Rejects GET method with 405 Method Not Allowed');
    assert(headers['x-content-type-options'] === 'nosniff', 'Includes X-Content-Type-Options: nosniff header');
    assert(headers['x-frame-options'] === 'DENY', 'Includes X-Frame-Options: DENY header');
    assert(responseData.success === false, 'Returns success: false for non-POST');
  }

  console.log('\n--- 2. SPAM HONEYPOT TRAP ---');
  {
    const { req, res } = mockReqRes('POST', {
      name: 'Bot Spammer',
      email: 'bot@spam.com',
      service: 'Website Design',
      project_description: 'Buy cheap watches here now http://spam.xyz',
      privacy_consent: true,
      website_hp: 'I am a spam bot', // Honeypot filled
    });
    await handler(req, res);
    const { statusCode, responseData } = res._get();
    assert(statusCode === 200, 'Silently intercepts honeypot trap with 200 OK');
    assert(responseData.success === true, 'Returns deceptive success: true to fool bot scraper');
  }

  console.log('\n--- 3. INPUT VALIDATION: MISSING REQUIRED FIELDS ---');
  {
    const { req, res } = mockReqRes('POST', {});
    await handler(req, res);
    const { statusCode, responseData } = res._get();
    assert(statusCode === 400, 'Returns 400 Bad Request on empty payload');
    assert(responseData.validationErrors?.name, 'Flags missing required field: name');
    assert(responseData.validationErrors?.email, 'Flags missing required field: email');
    assert(responseData.validationErrors?.service, 'Flags missing required field: service');
    assert(responseData.validationErrors?.project_description, 'Flags missing required field: project_description');
    assert(responseData.validationErrors?.privacy_consent, 'Flags missing privacy consent requirement');
  }

  console.log('\n--- 4. INPUT VALIDATION: INVALID EMAIL FORMAT ---');
  {
    const { req, res } = mockReqRes('POST', {
      name: 'Alex Vance',
      email: 'not-an-email@',
      service: 'Web Development',
      project_description: 'Need a custom web app for my business.',
      privacy_consent: true,
    });
    await handler(req, res);
    const { statusCode, responseData } = res._get();
    assert(statusCode === 400, 'Rejects malformed email address with 400');
    assert(responseData.validationErrors?.email?.includes('valid work email'), 'Provides informative email error message');
  }

  console.log('\n--- 5. INPUT VALIDATION: UNSUPPORTED SERVICE VALUE ---');
  {
    const { req, res } = mockReqRes('POST', {
      name: 'Alex Vance',
      email: 'alex@company.com',
      service: 'Illegal Pen Testing', // Unsupported service
      project_description: 'Need website penetration testing.',
      privacy_consent: true,
    });
    await handler(req, res);
    const { statusCode, responseData } = res._get();
    assert(statusCode === 400, 'Rejects unsupported service choice with 400');
    assert(responseData.validationErrors?.service?.includes('Invalid service choice'), 'Provides allowed service choices');
  }

  console.log('\n--- 6. INPUT VALIDATION: OVERSIZED INPUT (LENGTH LIMITS) ---');
  {
    const oversizedName = 'A'.repeat(150); // Max allowed: 100
    const oversizedDesc = 'D'.repeat(3500); // Max allowed: 3000
    const { req, res } = mockReqRes('POST', {
      name: oversizedName,
      email: 'alex@company.com',
      service: 'Website Design',
      project_description: oversizedDesc,
      privacy_consent: true,
    });
    await handler(req, res);
    const { statusCode, responseData } = res._get();
    assert(statusCode === 400, 'Rejects oversized inputs exceeding safety thresholds');
    assert(responseData.validationErrors?.name?.includes('100 characters'), 'Enforces 100-character name limit');
    assert(responseData.validationErrors?.project_description?.includes('3000 characters'), 'Enforces 3000-character description limit');
  }

  console.log('\n--- 7. GRACEFUL HANDLING WHEN SUPABASE CREDENTIALS ARE UNCONFIGURED ---');
  {
    // Temporarily clear environment variables if any
    const origUrl = process.env.SUPABASE_URL;
    const origKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    const { req, res } = mockReqRes('POST', {
      name: 'Elena Rostova',
      email: 'elena@studio.design',
      company: 'Rostova Studio',
      service: 'UI/UX Design',
      budget: '$10,000 – $25,000',
      timeline: '1 – 2 months',
      project_description: 'We are looking to design a digital archive and portfolio platform.',
      privacy_consent: true,
    });
    await handler(req, res);
    const { statusCode, responseData } = res._get();
    assert(statusCode === 503, 'Returns 503 Service Unavailable when DB is unconfigured');
    assert(responseData.code === 'DATABASE_NOT_CONFIGURED', 'Returns safe error code DATABASE_NOT_CONFIGURED');
    assert(!JSON.stringify(responseData).includes('secret'), 'Never leaks internal tokens or secrets');
    assert(responseData.message.includes('northup4work@gmail.com'), 'Provides direct contact fallback in error message');

    // Restore
    if (origUrl) process.env.SUPABASE_URL = origUrl;
    if (origKey) process.env.SUPABASE_SERVICE_ROLE_KEY = origKey;
  }

  console.log('\n--- 8. RATE LIMITING DEFENSE ---');
  {
    const testIp = '198.51.100.42';
    let rateLimited = false;

    for (let i = 0; i < 7; i++) {
      const { req, res } = mockReqRes(
        'POST',
        {
          name: 'Spam Burst',
          email: 'spam@burst.com',
          service: 'Branding',
          project_description: 'Testing burst frequency limit for DDoS prevention.',
          privacy_consent: true,
        },
        { 'x-forwarded-for': testIp }
      );
      await handler(req, res);
      const { statusCode } = res._get();
      if (statusCode === 429) {
        rateLimited = true;
        break;
      }
    }
    assert(rateLimited === true, 'Enforces in-memory rate limiting against burst spam attacks (HTTP 429)');
  }

  console.log('\n======================================================');
  console.log(`PHASE 3 TEST SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('======================================================\n');

  if (failed > 0) process.exit(1);
}

runTests().catch((err) => {
  console.error('Fatal error running Phase 3 tests:', err);
  process.exit(1);
});
