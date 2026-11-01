const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function generateOGImage() {
  console.log('Generating high-res 1200x630 Open Graph banner...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });

  const compassPath = path.resolve(__dirname, '../public/assets/hero-compass.png');
  const compassBase64 = fs.existsSync(compassPath)
    ? `data:image/png;base64,${fs.readFileSync(compassPath).toString('base64')}`
    : '';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Anton&family=IBM+Plex+Mono:wght@400;600;700&family=Inter:wght@400;600;800&family=Jaro:opsz@6..72&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1200px;
      height: 630px;
      background: #0B0908;
      color: #F5F1ED;
      font-family: 'IBM Plex Mono', monospace;
      overflow: hidden;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 64px 72px;
    }
    .ambient-glow {
      position: absolute;
      top: -100px;
      right: -80px;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(255, 77, 10, 0.28) 0%, rgba(255, 135, 56, 0.12) 40%, transparent 70%);
      pointer-events-none;
    }
    .compass-emblem {
      position: absolute;
      right: 48px;
      top: 50%;
      transform: translateY(-50%);
      width: 440px;
      height: 440px;
      object-fit: contain;
      opacity: 0.88;
      filter: drop-shadow(0 0 35px rgba(255, 77, 10, 0.35));
    }
    .grid-lines {
      position: absolute;
      inset: 0;
      background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 60px 60px;
      pointer-events-none;
    }
    .top-bar {
      display: flex;
      align-items: center;
      gap: 16px;
      z-index: 10;
    }
    .tag {
      background: rgba(255, 77, 10, 0.15);
      border: 1px solid rgba(255, 77, 10, 0.4);
      color: #FF8738;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }
    .tag-location {
      color: #BDB4AE;
      font-size: 13px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .content {
      z-index: 10;
      max-width: 720px;
    }
    .title {
      font-family: 'Jaro', sans-serif;
      font-size: 68px;
      line-height: 0.94;
      text-transform: uppercase;
      letter-spacing: 0.02em;
      color: #FFFFFF;
      margin-bottom: 20px;
      text-shadow: 0 4px 24px rgba(0,0,0,0.8);
    }
    .title span {
      color: #FF8738;
    }
    .subtitle {
      font-size: 18px;
      color: #D6CEC7;
      line-height: 1.45;
      font-family: 'Inter', sans-serif;
      max-width: 640px;
    }
    .footer-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 10;
      padding-top: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.12);
      font-size: 14px;
      color: #8E8681;
    }
    .domain {
      color: #FF8738;
      font-weight: 700;
      letter-spacing: 0.08em;
    }
  </style>
</head>
<body>
  <div class="grid-lines"></div>
  <div class="ambient-glow"></div>
  ${compassBase64 ? `<img src="${compassBase64}" class="compass-emblem" alt="Northup Emblem" />` : ''}

  <div class="top-bar">
    <div class="tag">CREATIVE STUDIO</div>
    <div class="tag-location">PUNE, INDIA • WORLDWIDE</div>
  </div>

  <div class="content">
    <div class="title">
      ORCHESTRATING<br />
      <span>BRAND GROWTH</span>
    </div>
    <div class="subtitle">
      Distinctive website design, full-stack development, and digital flagship experiences. Explore selected case studies.
    </div>
  </div>

  <div class="footer-bar">
    <div>NORTHUP STUDIO • SELECTED WORK & DIGITAL ARCHITECTURE</div>
    <div class="domain">northupstudio.vercel.app ↗</div>
  </div>
</body>
</html>
  `;

  await page.setContent(html);
  await page.waitForTimeout(1000);

  const outputPath = path.resolve(__dirname, '../public/og-image.png');
  await page.screenshot({ path: outputPath });
  console.log('Saved:', outputPath);

  await browser.close();
}

generateOGImage().catch(console.error);
