const fs = require('fs');
const path = require('path');

const BASE_PRODUCTION_URL = 'https://northupstudio.vercel.app';

const SEO_PAGES = {
  '/work/atelier-estates': {
    canonical: `${BASE_PRODUCTION_URL}/work/atelier-estates`,
    title: 'Atelier Estates — Luxury Architectural Digital Experience | Northup Studio',
    description:
      'Explore the Atelier Estates case study by Northup Studio. Editorial web design, private architectural advisory digital experience, and responsive craftsmanship.',
    ogImage: `${BASE_PRODUCTION_URL}/assets/atelier.jpg`,
    ogType: 'article',
    ogImageAlt: 'Atelier Estates Digital Experience by Northup Studio',
    projectName: 'Atelier Estates',
    category: 'Web Design & Development',
    caseStudyDate: '2026-10-31',
  },
  '/work/arulis-dental-clinic': {
    canonical: `${BASE_PRODUCTION_URL}/work/arulis-dental-clinic`,
    title: 'Aurelis Dental Clinic — Brand Identity & Web Platform | Northup Studio',
    description:
      'Aurelis case study by Northup Studio. Transforming high-end clinical aesthetic medicine into a warm, modern digital patient portal and brand identity.',
    ogImage: `${BASE_PRODUCTION_URL}/assets/aurelis.jpg`,
    ogType: 'article',
    ogImageAlt: 'Aurelis Dental Clinic Brand Platform by Northup Studio',
    projectName: 'Aurelis Dental Clinic',
    category: 'Brand Identity & Web Development',
    caseStudyDate: '2026-10-30',
  },
  '/work/maison-de-sucre': {
    canonical: `${BASE_PRODUCTION_URL}/work/maison-de-sucre`,
    title: 'Maison de Sucre — Artisan Cake Studio Web Platform | Northup Studio',
    description:
      'Maison de Sucre case study by Northup Studio. Parisian editorial aesthetics, artisanal cake showcase, and high-conversion ordering platform design.',
    ogImage: `${BASE_PRODUCTION_URL}/assets/cake-studio.jpg`,
    ogType: 'article',
    ogImageAlt: 'Maison de Sucre Artisan Cake Studio by Northup Studio',
    projectName: 'Maison de Sucre',
    category: 'Web Design & Development',
    caseStudyDate: '2026-10-31',
  },
  '/work/aurex-performance-club': {
    canonical: `${BASE_PRODUCTION_URL}/work/aurex-performance-club`,
    title: 'AUREX Performance Club — Kinetic Fitness Digital Experience | Northup Studio',
    description:
      'AUREX case study by Northup Studio. Kinetic typography, brutalist dark aesthetics, and high-intensity performance club digital storefront.',
    ogImage: `${BASE_PRODUCTION_URL}/assets/aurex.jpg`,
    ogType: 'article',
    ogImageAlt: 'AUREX Performance Club Digital Experience by Northup Studio',
    projectName: 'AUREX Performance Club',
    category: 'Kinetic Web Experience & Development',
    caseStudyDate: '2026-11-01',
  },
  '/work/drop-cult': {
    canonical: `${BASE_PRODUCTION_URL}/work/drop-cult`,
    title: 'Drop Cult — Streetwear Digital Storefront & Lookbook | Northup Studio',
    description:
      'Drop Cult case study by Northup Studio. Underground streetwear digital experience featuring limited edition drops, responsive lookbook, and bold typography.',
    ogImage: `${BASE_PRODUCTION_URL}/assets/drop-cult.jpg`,
    ogType: 'article',
    ogImageAlt: 'Drop Cult Digital Storefront & Lookbook by Northup Studio',
    projectName: 'Drop Cult',
    category: 'Streetwear Digital Storefront & Lookbook',
    caseStudyDate: '2026-11-01',
  },
};

function getJsonLd(page) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CreativeWork',
        '@id': `${page.canonical}#work`,
        name: page.projectName,
        headline: page.title,
        description: page.description,
        url: page.canonical,
        image: page.ogImage,
        datePublished: page.caseStudyDate || '2026-10-31',
        inLanguage: 'en-US',
        creator: {
          '@type': 'Organization',
          name: 'Northup Studio',
          url: `${BASE_PRODUCTION_URL}/`,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Northup Studio',
          url: `${BASE_PRODUCTION_URL}/`,
          logo: {
            '@type': 'ImageObject',
            url: `${BASE_PRODUCTION_URL}/assets/logo.png`,
          },
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${page.canonical}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${BASE_PRODUCTION_URL}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Work',
            item: `${BASE_PRODUCTION_URL}/#work`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: page.projectName,
            item: page.canonical,
          },
        ],
      },
    ],
  };
}

const distPath = path.join(__dirname, '..', 'dist');
const templatePath = path.join(distPath, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error('[prerender-seo] Error: dist/index.html not found! Run vite build first.');
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf8');

for (const [route, page] of Object.entries(SEO_PAGES)) {
  let html = template;

  // Title
  html = html.replace(/<title>.*?<\/title>/i, `<title>${page.title}</title>`);

  // Canonical
  html = html.replace(
    /<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i,
    `<link rel="canonical" href="${page.canonical}" />`
  );

  // Meta description
  html = html.replace(
    /<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta name="description" content="${page.description}" />`
  );

  // Open Graph
  html = html.replace(
    /<meta\s+property=["']og:title["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:title" content="${page.title}" />`
  );
  html = html.replace(
    /<meta\s+property=["']og:description["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:description" content="${page.description}" />`
  );
  html = html.replace(
    /<meta\s+property=["']og:url["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:url" content="${page.canonical}" />`
  );
  html = html.replace(
    /<meta\s+property=["']og:image["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:image" content="${page.ogImage}" />`
  );
  html = html.replace(
    /<meta\s+property=["']og:type["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:type" content="${page.ogType}" />`
  );
  html = html.replace(
    /<meta\s+property=["']og:image:alt["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:image:alt" content="${page.ogImageAlt}" />`
  );

  // Twitter Cards
  html = html.replace(
    /<meta\s+name=["']twitter:url["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta name="twitter:url" content="${page.canonical}" />`
  );
  html = html.replace(
    /<meta\s+name=["']twitter:title["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta name="twitter:title" content="${page.title}" />`
  );
  html = html.replace(
    /<meta\s+name=["']twitter:description["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta name="twitter:description" content="${page.description}" />`
  );
  html = html.replace(
    /<meta\s+name=["']twitter:image["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta name="twitter:image" content="${page.ogImage}" />`
  );

  // JSON-LD
  const jsonLdString = JSON.stringify(getJsonLd(page), null, 2);
  html = html.replace(
    /<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/i,
    `<script type="application/ld+json" id="seo-schema">\n${jsonLdString}\n    </script>`
  );

  // Relative directory in dist
  const relativeDir = route.replace(/^\//, '');
  const targetDir = path.join(distPath, relativeDir);
  fs.mkdirSync(targetDir, { recursive: true });

  const targetFile = path.join(targetDir, 'index.html');
  fs.writeFileSync(targetFile, html, 'utf8');
  console.log(`[prerender-seo] Generated ${targetFile}`);
}

console.log('[prerender-seo] Successfully pre-rendered static SEO HTML for all case study routes!');
