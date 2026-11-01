import { useEffect } from 'react'
import { SEO_PAGES, getPageJsonLd, BASE_PRODUCTION_URL } from '../services/seoData'

/**
 * Updates runtime document head metadata (Title, Description, Canonical, OG, Twitter, and JSON-LD).
 */
export default function SEO({ route = '/' }) {
  useEffect(() => {
    const page = SEO_PAGES[route] || SEO_PAGES['/']

    // 1. Update Title
    document.title = page.title

    // Helper to set/update a meta tag
    const setMetaTag = (attribute, name, content) => {
      let tag = document.querySelector(`meta[${attribute}="${name}"]`)
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute(attribute, name)
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', content)
    }

    // 2. Primary Metadata
    setMetaTag('name', 'title', page.title)
    setMetaTag('name', 'description', page.description)
    if (page.noindex) {
      setMetaTag('name', 'robots', 'noindex, nofollow')
    } else {
      setMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
    }

    // 3. Canonical Link
    let canonicalTag = document.querySelector('link[rel="canonical"]')
    if (!canonicalTag) {
      canonicalTag = document.createElement('link')
      canonicalTag.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalTag)
    }
    canonicalTag.setAttribute('href', page.canonical)

    // 4. Open Graph Metadata
    setMetaTag('property', 'og:title', page.title)
    setMetaTag('property', 'og:description', page.description)
    setMetaTag('property', 'og:url', page.canonical)
    setMetaTag('property', 'og:image', page.ogImage)
    setMetaTag('property', 'og:type', page.ogType || 'website')
    if (page.ogImageAlt) {
      setMetaTag('property', 'og:image:alt', page.ogImageAlt)
    }

    // 5. Twitter Card Metadata
    setMetaTag('name', 'twitter:title', page.title)
    setMetaTag('name', 'twitter:description', page.description)
    setMetaTag('name', 'twitter:image', page.ogImage)
    setMetaTag('name', 'twitter:url', page.canonical)

    // 6. JSON-LD Structured Data
    const schemaData = getPageJsonLd(route)
    let schemaScript = document.getElementById('dynamic-seo-schema')
    if (!schemaScript) {
      schemaScript = document.createElement('script')
      schemaScript.id = 'dynamic-seo-schema'
      schemaScript.type = 'application/ld+json'
      document.head.appendChild(schemaScript)
    }
    schemaScript.textContent = JSON.stringify(schemaData)
  }, [route])

  return null
}
