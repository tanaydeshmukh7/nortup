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

export default function App() {
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [contactSubject, setContactSubject] = useState('Project Inquiry')
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

    // Smooth navigation for all in-page hash links
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

  // Pause Lenis when modal is open to prevent background scrolling
  useEffect(() => {
    if (!lenisRef.current) return
    if (contactModalOpen) {
      lenisRef.current.stop()
    } else {
      lenisRef.current.start()
    }
  }, [contactModalOpen])

  const handleOpenContact = (subject = 'Project Inquiry') => {
    setContactSubject(subject)
    setContactModalOpen(true)
  }

  return (
    <div className="relative min-h-screen bg-white text-black selection:bg-[#FF4D0A] selection:text-white">
      {/* Desktop Custom Cursor */}
      <CustomCursor />

      {/* Fixed Viewport Floating Navbar (Persistent across entire website) */}
      <Navbar onOpenContact={handleOpenContact} />

      {/* Main Content Sections */}
      <main className="w-full">
        {/* Hero Section */}
        <Hero onOpenContact={handleOpenContact} />

        {/* Ticker / Moving Forward Section */}
        <Ticker />

        {/* Featured Work Grid with Interactive Filters & Hover Cards */}
        <FeaturedWork onOpenContact={handleOpenContact} />

        {/* Unified Frame 7: Services, IDEAS INTO IMPACT, Methodology, Team & Everyday Toolkit */}
        <Approach onOpenContact={handleOpenContact} />

        {/* Let's Make It Happen CTA */}
        <CTASection onOpenContact={handleOpenContact} />
      </main>

      {/* Footer */}
      <Footer onOpenContact={handleOpenContact} />

      {/* Interactive Contact / Audit Modal */}
      <ContactModal 
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        initialSubject={contactSubject}
      />
    </div>
  )
}
