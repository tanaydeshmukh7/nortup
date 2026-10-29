import React, { useState } from 'react'
import Hero from './components/Hero'
import Ticker from './components/Ticker'
import FeaturedWork from './components/FeaturedWork'
import Approach from './components/Approach'
import CTASection from './components/CTASection'
import Footer from './components/Footer'
import ContactModal from './components/ContactModal'

export default function App() {
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [contactSubject, setContactSubject] = useState('Project Inquiry')

  const handleOpenContact = (subject = 'Project Inquiry') => {
    setContactSubject(subject)
    setContactModalOpen(true)
  }

  return (
    <div className="relative min-h-screen bg-white text-black selection:bg-[#FF4D0A] selection:text-white">
      {/* Main Content Sections */}
      <main className="w-full">
        {/* Hero Section (Contains Integrated Navbar & Exact Figma Frame) */}
        <Hero onOpenContact={handleOpenContact} />

        {/* Ticker / Moving Forward Section */}
        <Ticker />

        {/* Featured Work Grid */}
        <FeaturedWork onOpenContact={handleOpenContact} />

        {/* Unified Frame 7: Services, IDEAS INTO IMPACT, Methodology, Team & Everyday Toolkit */}
        <Approach onOpenContact={handleOpenContact} />

        {/* Let's Make It Happen CTA */}
        <CTASection onOpenContact={handleOpenContact} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Contact / Audit Modal */}
      <ContactModal 
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        initialSubject={contactSubject}
      />
    </div>
  )
}