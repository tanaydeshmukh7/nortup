import React, { useState, useEffect, useRef } from 'react'
import Lenis from 'lenis'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Ticker from './components/Ticker'
import FeaturedWork from './components/FeaturedWork'
import Approach from './components/Approach'
import CTASection from './components/CTASection'
import Footer from './components/Footer'
import ContactModal from './components/ContactModal'
import CustomCursor from './components/CustomCursor'
import ArulisCaseStudy from './pages/ArulisCaseStudy'
import AtelierCaseStudy from './pages/AtelierCaseStudy'
import MaisonCaseStudy from './pages/MaisonCaseStudy'
import AurexCaseStudy from './pages/AurexCaseStudy'

export default function App() {
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [contactSubject, setContactSubject] = useState('Project Inquiry')
  const [currentRoute, setCurrentRoute] = useState(() => {
    if (typeof window !== 'undefined') {
      // Check for path or hash-based routing fallback
      const path = window.location.pathname.replace(/\/$/, '') || '/'
      if (path === '/work/arulis-dental-clinic') return path
      if (path === '/work/atelier-estates') return path
      if (path === '/work/maison-de-sucre') return path
      if (path === '/work/aurex-performance-club') return path
      if (window.location.hash.includes('work/arulis-dental-clinic')) return '/work/arulis-dental-clinic'
      if (window.location.hash.includes('work/atelier-estates')) return '/work/atelier-estates'
      if (window.location.hash.includes('work/maison-de-sucre')) return '/work/maison-de-sucre'
      if (window.location.hash.includes('work/aurex-performance-club')) return '/work/aurex-performance-club'
      return path
    }
    return '/'
  })
  
  const lenisRef = useRef(null)

  // Initialize smooth inertia scrolling with Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.25,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
    })
    lenisRef.current = lenis

    let animationFrameId
    function raf(time) {
      lenis.raf(time)
      animationFrameId = requestAnimationFrame(raf)
    }
    animationFrameId = requestAnimationFrame(raf)

    // Smooth navigation for all in-page hash links (when on homepage)
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]')
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (href === '#' || !href) {
        e.preventDefault()
        lenis.scrollTo(0, { duration: 1.2 })
        return
      }
      const targetElement = document.querySelector(href)
      if (targetElement) {
        e.preventDefault()
        lenis.scrollTo(targetElement, { offset: -96, duration: 1.2 })
      }
    }

    document.addEventListener('click', handleAnchorClick)

    return () => {
      cancelAnimationFrame(animationFrameId)
      document.removeEventListener('click', handleAnchorClick)
      lenis.destroy()
    }
  }, [])

  // Listen to browser Back / Forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/\/$/, '') || '/'
      let nextRoute = path
      if (window.location.hash.includes('work/arulis-dental-clinic')) {
        nextRoute = '/work/arulis-dental-clinic'
      } else if (window.location.hash.includes('work/atelier-estates')) {
        nextRoute = '/work/atelier-estates'
      } else if (window.location.hash.includes('work/maison-de-sucre')) {
        nextRoute = '/work/maison-de-sucre'
      } else if (window.location.hash.includes('work/aurex-performance-club')) {
        nextRoute = '/work/aurex-performance-club'
      }
      setCurrentRoute(nextRoute)

      if (window.location.hash && nextRoute === '/') {
        setTimeout(() => {
          const target = document.querySelector(window.location.hash)
          if (target && lenisRef.current) {
            lenisRef.current.scrollTo(target, { offset: -96, duration: 1.2 })
          }
        }, 80)
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' })
        if (lenisRef.current) {
          lenisRef.current.scrollTo(0, { immediate: true })
        }
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Pause Lenis when modal is open to prevent background scrolling
  useEffect(() => {
    if (!lenisRef.current) return
    if (contactModalOpen) {
      lenisRef.current.stop()
    } else {
      lenisRef.current.start()
    }
  }, [contactModalOpen])

  // Central Navigation Handler
  const handleNavigate = (to) => {
    if (typeof window === 'undefined') return

    // Hash navigation (e.g. "/#work" or "#work")
    if (to.startsWith('/#') || to.startsWith('#')) {
      const hash = to.replace(/^\//, '')
      if (currentRoute !== '/') {
        window.history.pushState(null, '', '/' + hash)
        setCurrentRoute('/')
        setTimeout(() => {
          const target = document.querySelector(hash)
          if (target && lenisRef.current) {
            lenisRef.current.scrollTo(target, { offset: -96, duration: 1.2 })
          } else if (target) {
            target.scrollIntoView({ behavior: 'smooth' })
          }
        }, 120)
      } else {
        window.history.pushState(null, '', hash)
        const target = document.querySelector(hash)
        if (target && lenisRef.current) {
          lenisRef.current.scrollTo(target, { offset: -96, duration: 1.2 })
        }
      }
      return
    }

    // Direct path navigation (e.g. "/work/arulis-dental-clinic" or "/")
    const normalized = to.replace(/\/$/, '') || '/'
    window.history.pushState(null, '', normalized)
    setCurrentRoute(normalized)

    window.scrollTo({ top: 0, behavior: 'instant' })
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true })
    }
  }

  const handleOpenContact = (subject = 'Project Inquiry') => {
    setContactSubject(subject)
    setContactModalOpen(true)
  }

  const isArulisCaseStudy = 
    currentRoute === '/work/arulis-dental-clinic' || 
    currentRoute.startsWith('/work/arulis-dental-clinic')

  const isAtelierCaseStudy = 
    currentRoute === '/work/atelier-estates' || 
    currentRoute.startsWith('/work/atelier-estates')

  const isMaisonCaseStudy = 
    currentRoute === '/work/maison-de-sucre' || 
    currentRoute.startsWith('/work/maison-de-sucre')

  const isAurexCaseStudy = 
    currentRoute === '/work/aurex-performance-club' || 
    currentRoute.startsWith('/work/aurex-performance-club')

  return (
    <div className="relative min-h-screen bg-white text-black selection:bg-[#FF4D0A] selection:text-white">
      {/* Desktop Custom Cursor */}
      <CustomCursor />

      {/* Fixed Viewport Floating Navbar (Persistent across entire website) */}
      <Navbar 
        onOpenContact={handleOpenContact} 
        onNavigate={handleNavigate}
        currentRoute={currentRoute}
      />

      {/* Conditional Rendering between Homepage and Dedicated Case Study */}
      {isArulisCaseStudy ? (
        <main className="w-full">
          <ArulisCaseStudy 
            onNavigate={handleNavigate}
            onOpenContact={handleOpenContact}
          />
        </main>
      ) : isAtelierCaseStudy ? (
        <main className="w-full">
          <AtelierCaseStudy 
            onNavigate={handleNavigate}
            onOpenContact={handleOpenContact}
          />
        </main>
      ) : isMaisonCaseStudy ? (
        <main className="w-full">
          <MaisonCaseStudy 
            onNavigate={handleNavigate}
            onOpenContact={handleOpenContact}
          />
        </main>
      ) : isAurexCaseStudy ? (
        <main className="w-full">
          <AurexCaseStudy 
            onNavigate={handleNavigate}
            onOpenContact={handleOpenContact}
          />
        </main>
      ) : (
        <>
          {/* Main Content Sections */}
          <main className="w-full">
            {/* Hero Section */}
            <Hero onOpenContact={handleOpenContact} />

            {/* Ticker / Moving Forward Section */}
            <Ticker />

            {/* Featured Work Grid with Interactive Filters & Case Study Routing */}
            <FeaturedWork 
              onOpenContact={handleOpenContact} 
              onNavigate={handleNavigate}
            />

            {/* Unified Frame 7: Services, IDEAS INTO IMPACT, Methodology, Team & Everyday Toolkit */}
            <Approach onOpenContact={handleOpenContact} />

            {/* Let's Make It Happen CTA */}
            <CTASection onOpenContact={handleOpenContact} />
          </main>

          {/* Homepage Footer */}
          <Footer onOpenContact={handleOpenContact} />
        </>
      )}

      {/* Interactive Contact / Audit Modal */}
      <ContactModal 
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        initialSubject={contactSubject}
      />
    </div>
  )
}
