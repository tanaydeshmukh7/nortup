const fs = require('fs');
const path = require('path');

function checkDir(dir) {
  const files = fs.readdirSync(dir, { recursive: true }).filter(f => f.endsWith('.jsx'));
  let count = 0;
  let missingAlt = 0;

  files.forEach(f => {
    const filePath = path.join(dir, f);
    const content = fs.readFileSync(filePath, 'utf8');
    const imgMatches = content.match(/<img[^>]*>/gs) || [];
    imgMatches.forEach(img => {
      count++;
      if (!img.includes('alt=')) {
        console.log(`[MISSING ALT] in ${f}: ${img.replace(/\s+/g, ' ').substring(0, 80)}`);
        missingAlt++;
      }
    });
  });

  console.log(`Audited ${count} <img> tags in ${dir}. Missing alt: ${missingAlt}`);
}

checkDir('src');
