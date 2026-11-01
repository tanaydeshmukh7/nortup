import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { chromium } from 'playwright'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST_DIR = path.join(__dirname, '..', 'dist')
const PORT = 4175

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase()
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
  }
  return map[ext] || 'application/octet-stream'
}

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let reqPath = decodeURI(req.url.split('?')[0])
      if (reqPath.endsWith('/')) reqPath += 'index.html'

      let filePath = path.join(DIST_DIR, reqPath)

      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html')
      }

      if (!fs.existsSync(filePath)) {
        if (fs.existsSync(filePath + '.html')) {
          filePath = filePath + '.html'
        } else {
          filePath = path.join(DIST_DIR, 'index.html')
        }
      }

      try {
        const data = fs.readFileSync(filePath)
        res.writeHead(200, { 'Content-Type': getMimeType(filePath) })
        res.end(data)
      } catch (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' })
        res.end('Not Found')
      }
    })

    server.listen(PORT, () => {
      resolve(server)
    })
  })
}

let passed = 0
let failed = 0

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`)
    passed++
  } else {
    console.error(`  ✗ FAILED: ${message}`)
    failed++
  }
}

async function runBrowserTests() {
  const server = await startServer()
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  })
  const page = await context.newPage()

  console.log('\n--- 1. ADMIN ROUTE ISOLATION & SEO SECURITY ---')
  await page.goto(`http://localhost:${PORT}/admin`, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1000)

  // Verify Title
  const pageTitle = await page.title()
  assert(pageTitle.includes('Admin Console'), `Page title contains "Admin Console" ("${pageTitle}")`)

  // Verify noindex, nofollow
  const robotsMeta = await page.$eval('meta[name="robots"]', (el) => el.getAttribute('content')).catch(() => null)
  assert(robotsMeta?.includes('noindex'), `Admin route has robots meta set to noindex (${robotsMeta})`)

  // Verify public Navbar is hidden on /admin
  const publicNavCount = await page.locator('nav a:has-text("ABOUT US")').count()
  assert(publicNavCount === 0, 'Public floating navbar is excluded from admin route')

  console.log('\n--- 2. ADMIN LOGIN INTERACTION & VALIDATION ---')
  // Verify Admin Sign In card
  const headingText = await page.locator('h1').innerText()
  assert(headingText.includes('ADMIN SIGN IN'), `Admin Sign In heading is present ("${headingText}")`)

  // Check inputs
  assert(await page.locator('input[type="email"]').isVisible(), 'Admin Work Email input is present')
  assert(await page.locator('input[placeholder="••••••••••••"]').isVisible(), 'Admin Password input is present')
  assert(await page.locator('button:has-text("Access Admin Console")').isVisible(), 'Access button is present')

  // Check Back to Portfolio button
  const backBtn = page.locator('button:has-text("Back to Portfolio Website")')
  assert(await backBtn.isVisible(), 'Back to Portfolio Website button is present')
  await backBtn.click()
  await page.waitForTimeout(600)

  // Verify return to public homepage
  const heroHeading = (await page.locator('h1').innerText()).replace(/\s+/g, ' ')
  assert(heroHeading.includes('ORCHESTRATING BRAND GROWTH'), `Returned to public homepage successfully ("${heroHeading}")`)

  // Verify public Navbar restored
  assert(await page.locator('nav a:has-text("ABOUT US")').isVisible(), 'Public navbar restored upon returning to homepage')

  await browser.close()
  server.close()

  console.log('\n======================================================')
  console.log(`ADMIN BROWSER TEST SUMMARY: ${passed} passed, ${failed} failed`)
  console.log('======================================================\n')

  if (failed > 0) process.exit(1)
}

runBrowserTests().catch((err) => {
  console.error('Fatal admin browser test error:', err)
  process.exit(1)
})
