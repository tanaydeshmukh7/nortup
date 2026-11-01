/**
 * NORTHUP STUDIO — Centralized SEO & Social Metadata Registry
 * Single Source of Truth for Canonical URLs, Titles, Descriptions, and Structured Data
 */

export const BASE_PRODUCTION_URL = 'https://northupstudio.vercel.app'

export const SEO_PAGES = {
  '/': {
    path: '/',
    canonical: `${BASE_PRODUCTION_URL}/`,
    title: 'Northup Studio | Creative Web Design & Development',
    description:
      'Northup Studio is an independent creative web design and development studio in Pune, India. We build distinctive websites, brand identities, and high-performance digital experiences. Explore our selected work.',
    ogImage: `${BASE_PRODUCTION_URL}/og-image.png`,
    ogType: 'website',
    ogImageAlt: 'Northup Studio — Creative Web Design & Development',
  },
  '/work/atelier-estates': {
    path: '/work/atelier-estates',
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
    path: '/work/arulis-dental-clinic',
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
    path: '/work/maison-de-sucre',
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
    path: '/work/aurex-performance-club',
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
    path: '/work/drop-cult',
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
  '/admin': {
    path: '/admin',
    canonical: `${BASE_PRODUCTION_URL}/admin`,
    title: 'Admin Console | Northup Studio',
    description: 'Internal administrative operations console for Northup Studio project leads.',
    ogImage: `${BASE_PRODUCTION_URL}/og-image.png`,
    ogType: 'website',
    noindex: true,
  },
}

/**
 * Generates JSON-LD structured data for a specific page.
 */
export function getPageJsonLd(routeKey) {
  const page = SEO_PAGES[routeKey] || SEO_PAGES['/']

  if (routeKey === '/') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': `${BASE_PRODUCTION_URL}/#organization`,
          name: 'Northup Studio',
          url: `${BASE_PRODUCTION_URL}/`,
          logo: {
            '@type': 'ImageObject',
            url: `${BASE_PRODUCTION_URL}/assets/logo.png`,
          },
          image: `${BASE_PRODUCTION_URL}/og-image.png`,
          description:
            'Independent creative studio specializing in bespoke website design, web development, and digital brand platforms.',
          email: 'northup4work@gmail.com',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Pune',
            addressRegion: 'Maharashtra',
            addressCountry: 'IN',
          },
          sameAs: ['https://www.instagram.com/northup.studio/'],
        },
        {
          '@type': 'WebSite',
          '@id': `${BASE_PRODUCTION_URL}/#website`,
          url: `${BASE_PRODUCTION_URL}/`,
          name: 'Northup Studio',
          description: 'Creative website design, web development, and digital experience showcase.',
          publisher: {
            '@id': `${BASE_PRODUCTION_URL}/#organization`,
          },
          inLanguage: 'en-US',
        },
      ],
    }
  }

  // Case Study Schema (CreativeWork + Breadcrumbs)
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
  }
}
