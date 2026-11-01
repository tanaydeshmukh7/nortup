const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

// Simple static server for dist
const DIST_DIR = path.join(__dirname, '..', 'dist');
const PORT = 4173;

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

      // Handle clean URL or directory fallback
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }

      if (!fs.existsSync(filePath)) {
        // Check if adding .html helps or fallback to dist/index.html (SPA)
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
      console.log(`[TEST-SERVER] Serving ${DIST_DIR} on http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

const ROUTES_TO_TEST = [
  {
    path: '/',
    expectedTitle: 'Northup Studio | Creative Web Design & Development',
    expectedH1: 'ORCHESTRATING BRAND GROWTH',
    expectedCanonical: 'https://northupstudio.vercel.app/',
    expectedType: 'website',
  },
  {
    path: '/work/atelier-estates',
    expectedTitle: 'Atelier Estates — Luxury Architectural Digital Experience | Northup Studio',
    expectedH1: 'Atelier Estates',
    expectedCanonical: 'https://northupstudio.vercel.app/work/atelier-estates',
    expectedType: 'article',
  },
  {
    path: '/work/arulis-dental-clinic',
    expectedTitle: 'Aurelis Dental Clinic — Brand Identity & Web Platform | Northup Studio',
    expectedH1: 'Aurelis Dental Clinic',
    expectedCanonical: 'https://northupstudio.vercel.app/work/arulis-dental-clinic',
    expectedType: 'article',
  },
  {
    path: '/work/maison-de-sucre',
    expectedTitle: 'Maison de Sucre — Artisan Cake Studio Web Platform | Northup Studio',
    expectedH1: 'Maison de Sucre',
    expectedCanonical: 'https://northupstudio.vercel.app/work/maison-de-sucre',
    expectedType: 'article',
  },
  {
    path: '/work/aurex-performance-club',
    expectedTitle: 'AUREX Performance Club — Kinetic Fitness Digital Experience | Northup Studio',
    expectedH1: 'AUREX Performance Club',
    expectedCanonical: 'https://northupstudio.vercel.app/work/aurex-performance-club',
    expectedType: 'article',
  },
  {
    path: '/work/drop-cult',
    expectedTitle: 'Drop Cult — Streetwear Digital Storefront & Lookbook | Northup Studio',
    expectedH1: 'DROP CULT',
    expectedCanonical: 'https://northupstudio.vercel.app/work/drop-cult',
    expectedType: 'article',
  },
];

async function runTests() {
  const server = await startServer();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  let passed = 0;
  let failed = 0;

  console.log('\n--- 1. TESTING STATIC ASSETS (robots.txt, sitemap.xml, og-image.png) ---');
  
  // Test robots.txt
  const robotsRes = await page.goto(`http://localhost:${PORT}/robots.txt`);
  const robotsText = await robotsRes.text();
  if (robotsRes.status() === 200 && robotsText.includes('Sitemap: https://northupstudio.vercel.app/sitemap.xml')) {
    console.log('✓ robots.txt exists, returns 200, and points to sitemap');
    passed++;
  } else {
    console.error('✗ robots.txt failed');
    failed++;
  }

  // Test sitemap.xml
  const sitemapRes = await page.goto(`http://localhost:${PORT}/sitemap.xml`);
  const sitemapText = await sitemapRes.text();
  const allUrlsPresent = ROUTES_TO_TEST.every((r) => sitemapText.includes(r.expectedCanonical));
  if (sitemapRes.status() === 200 && allUrlsPresent) {
    console.log('✓ sitemap.xml exists, returns 200, and contains all 6 canonical URLs');
    passed++;
  } else {
    console.error('✗ sitemap.xml missing one or more URLs');
    failed++;
  }

  // Test og-image.png
  const ogImgRes = await page.goto(`http://localhost:${PORT}/og-image.png`);
  if (ogImgRes.status() === 200 && ogImgRes.headers()['content-type'].includes('image')) {
    console.log('✓ og-image.png exists, returns 200 image');
    passed++;
  } else {
    console.error('✗ og-image.png failed');
    failed++;
  }

  console.log('\n--- 2. TESTING ROUTES & IN-PAGE METADATA ---');

  for (const route of ROUTES_TO_TEST) {
    console.log(`\nTesting: ${route.path}`);
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    const res = await page.goto(`http://localhost:${PORT}${route.path}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    if (res.status() !== 200) {
      console.error(`✗ Route ${route.path} returned status ${res.status()}`);
      failed++;
      continue;
    }

    // Title
    const title = await page.title();
    if (title === route.expectedTitle) {
      console.log(`  ✓ Title matches: "${title}"`);
      passed++;
    } else {
      console.error(`  ✗ Title mismatch! Got: "${title}", expected: "${route.expectedTitle}"`);
      failed++;
    }

    // Canonical Tag
    const canonical = await page.$eval('link[rel="canonical"]', (el) => el.getAttribute('href')).catch(() => null);
    if (canonical === route.expectedCanonical) {
      console.log(`  ✓ Canonical matches: "${canonical}"`);
      passed++;
    } else {
      console.error(`  ✗ Canonical mismatch! Got: "${canonical}", expected: "${route.expectedCanonical}"`);
      failed++;
    }

    // Meta Description
    const desc = await page.$eval('meta[name="description"]', (el) => el.getAttribute('content')).catch(() => null);
    if (desc && desc.length > 50) {
      console.log(`  ✓ Meta description present (${desc.length} chars)`);
      passed++;
    } else {
      console.error(`  ✗ Meta description missing or too short: "${desc}"`);
      failed++;
    }

    // Open Graph
    const ogTitle = await page.$eval('meta[property="og:title"]', (el) => el.getAttribute('content')).catch(() => null);
    const ogType = await page.$eval('meta[property="og:type"]', (el) => el.getAttribute('content')).catch(() => null);
    const ogImage = await page.$eval('meta[property="og:image"]', (el) => el.getAttribute('content')).catch(() => null);
    if (ogTitle && ogType === route.expectedType && ogImage) {
      console.log(`  ✓ Open Graph tags valid (type: ${ogType}, image: ${ogImage})`);
      passed++;
    } else {
      console.error(`  ✗ Open Graph issue: title=${ogTitle}, type=${ogType}, image=${ogImage}`);
      failed++;
    }

    // Heading hierarchy: Exactly ONE H1 per page
    const h1Count = await page.$$eval('h1', (els) => els.length);
    const h1Text = await page.$$eval('h1', (els) => els.map((e) => e.innerText.replace(/\s+/g, ' ').trim()).join(' | '));
    if (h1Count === 1) {
      console.log(`  ✓ Heading hierarchy: Exactly 1 <h1> found ("${h1Text}")`);
      passed++;
    } else {
      console.error(`  ✗ Heading hierarchy defect! Found ${h1Count} <h1> tags: "${h1Text}"`);
      failed++;
    }

    // Schema.org JSON-LD
    const jsonLdContent = await page.$eval('#seo-schema', (el) => el.textContent).catch(() => null);
    let parsedSchema = null;
    try {
      parsedSchema = JSON.parse(jsonLdContent);
    } catch (e) {}

    if (parsedSchema && parsedSchema['@context'] === 'https://schema.org' && parsedSchema['@graph']) {
      console.log(`  ✓ Schema.org JSON-LD valid with ${parsedSchema['@graph'].length} graph nodes`);
      passed++;
    } else {
      console.error('  ✗ Schema.org JSON-LD missing or invalid');
      failed++;
    }

    // Check for critical console errors
    const seriousErrors = consoleErrors.filter((e) => !e.includes('favicon') && !e.includes('404'));
    if (seriousErrors.length === 0) {
      console.log('  ✓ No console errors');
      passed++;
    } else {
      console.warn(`  ! Console errors: ${seriousErrors.join(', ')}`);
    }
  }

  await browser.close();
  server.close();

  console.log(`\n==========================================`);
  console.log(`VERIFICATION SUMMARY: ${passed} passed, ${failed} failed`);
  console.log(`==========================================\n`);

  if (failed > 0) process.exit(1);
}

runTests().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
