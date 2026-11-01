const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const PORT = 4174;

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain',
    '.xml': 'application/xml',
  };
  return map[ext] || 'application/octet-stream';
}

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let reqPath = decodeURI(req.url.split('?')[0]);
      if (reqPath.endsWith('/')) reqPath += 'index.html';

      let filePath = path.join(DIST_DIR, reqPath);

      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }

      if (!fs.existsSync(filePath)) {
        if (fs.existsSync(filePath + '.html')) {
          filePath = filePath + '.html';
        } else {
          filePath = path.join(DIST_DIR, 'index.html');
        }
      }

      try {
        const data = fs.readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': getMimeType(filePath) });
        res.end(data);
      } catch (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      }
    });

    server.listen(PORT, () => {
      resolve(server);
    });
  });
}

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAILED: ${message}`);
    failed++;
  }
}

async function runBrowserTests() {
  const server = await startServer();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  console.log('\n--- 1. CONTACT MODAL TRIGGER & ACCESSIBILITY ---');
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // Click "START PROJECT ↗" button in Hero
  const startProjectBtn = await page.locator('button:has-text("START PROJECT")').first();
  await startProjectBtn.click();
  await page.waitForTimeout(400);

  // Verify Contact modal is open
  const contactModal = page.locator('[role="dialog"][aria-labelledby="contact-modal-title"]');
  const isModalVisible = await contactModal.isVisible();
  assert(isModalVisible, 'Contact Modal opens when clicking START PROJECT');

  // Verify header title
  const modalTitle = await page.locator('#contact-modal-title').innerText();
  assert(modalTitle.toLowerCase().includes('start project') || modalTitle.toLowerCase().includes('inquiry'), `Modal title rendered correctly ("${modalTitle}")`);

  console.log('\n--- 2. FORM FIELDS & ACCESSIBILITY AUDIT ---');
  // Check required inputs exist
  assert(await page.locator('input[name="name"]').isVisible(), 'Full Name input is present');
  assert(await page.locator('input[name="email"]').isVisible(), 'Work Email input is present');
  assert(await page.locator('input[name="company"]').isVisible(), 'Company input is present');
  assert(await page.locator('button:has-text("Website Design")').isVisible(), 'Service choice buttons are present');
  assert(await page.locator('select[name="budget"]').isVisible(), 'Budget selector is present');
  assert(await page.locator('select[name="timeline"]').isVisible(), 'Timeline selector is present');
  assert(await page.locator('textarea[name="project_description"]').isVisible(), 'Project description textarea is present');
  assert(await page.locator('input[name="privacy_consent"]').isVisible(), 'Privacy consent checkbox is present');

  // Verify honeypot field is hidden from real users
  const honeypotHidden = await page.locator('input[name="website_hp"]').evaluate((el) => {
    return el.parentElement.getAttribute('aria-hidden') === 'true' || el.offsetParent === null;
  });
  assert(honeypotHidden, 'Honeypot field is hidden from visual flow and screen readers');

  console.log('\n--- 3. CLIENT VALIDATION & ERROR MESSAGES ---');
  // Click submit without filling form
  const submitBtn = page.locator('button[type="submit"]:has-text("Submit Project Enquiry")');
  await submitBtn.click();
  await page.waitForTimeout(200);

  // Check validation errors are displayed beside fields
  const nameError = await page.locator('#contact-name-error').isVisible();
  const emailError = await page.locator('#contact-email-error').isVisible();
  const descError = await page.locator('#contact-desc-error').isVisible();
  assert(nameError, 'Name validation error is displayed beside field');
  assert(emailError, 'Email validation error is displayed beside field');
  assert(descError, 'Description validation error is displayed beside field');

  console.log('\n--- 4. PRIVACY POLICY MODAL TRIGGER & CONTENTS ---');
  // Click "Privacy Policy" button inside consent notice
  const privacyLink = page.locator('button:has-text("Privacy Policy")').first();
  await privacyLink.click();
  await page.waitForTimeout(400);

  const privacyModal = page.locator('[role="dialog"][aria-labelledby="privacy-modal-title"]');
  assert(await privacyModal.isVisible(), 'Privacy Policy Modal opens when clicking Privacy Policy link');

  const privacyTitle = await page.locator('#privacy-modal-title').innerText();
  assert(privacyTitle.toLowerCase().includes('privacy policy'), `Privacy Policy title is verified ("${privacyTitle}")`);

  // Close Privacy Policy modal
  await page.locator('button:has-text("Close Policy")').click();
  await page.waitForTimeout(600);
  assert(!(await privacyModal.isVisible()), 'Privacy Policy Modal closes cleanly');

  console.log('\n--- 5. KEYBOARD ACCESSIBILITY (ESCAPE KEY) ---');
  // Press Escape to close Contact Modal
  await page.keyboard.press('Escape');
  await page.waitForTimeout(600);
  assert(!(await contactModal.isVisible()), 'Contact Modal closes on Escape key press');

  console.log('\n--- 6. GET AN AUDIT MODAL PRESERVATION (PHASE 1 INTEGRITY) ---');
  const auditBtn = page.locator('button:has-text("Get an Audit")').first();
  await auditBtn.click();
  await page.waitForTimeout(600);

  const auditModal = page.locator('[role="dialog"][aria-labelledby="audit-modal-title"]');
  assert(await auditModal.isVisible(), 'Phase 1 Get an Audit Modal still opens reliably');
  
  // Test close button
  const auditCloseBtn = page.locator('button[aria-label="Close audit request modal"]').first();
  await auditCloseBtn.click();
  await page.waitForTimeout(600);
  assert(!(await auditModal.isVisible()), 'Audit Modal closes cleanly');

  console.log('\n--- 7. MOBILE RESPONSIVENESS (VIEWPORT: 375x667) ---');
  await page.setViewportSize({ width: 375, height: 667 });
  await page.locator('button:has-text("START PROJECT")').first().click();
  await page.waitForTimeout(400);

  const mobileModalBox = await contactModal.boundingBox();
  assert(mobileModalBox.width <= 375, `Contact Modal fits mobile width without overflow (${mobileModalBox.width}px <= 375px)`);

  await browser.close();
  server.close();

  console.log('\n======================================================');
  console.log(`BROWSER UI TEST SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('======================================================\n');

  if (failed > 0) process.exit(1);
}

runBrowserTests().catch((err) => {
  console.error('Fatal browser test error:', err);
  process.exit(1);
});
