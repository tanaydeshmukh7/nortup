import React, { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { 
  ArrowLeft, 
  ArrowUpRight, 
  Sparkles, 
  Shield, 
  Layers, 
  CheckCircle2, 
  Compass, 
  Palette, 
  Type, 
  Monitor, 
  Smartphone, 
  Share2,
  ExternalLink
} from 'lucide-react'
import ArulisIdCardSection from '../components/ArulisIdCardSection'
import Footer from '../components/Footer'

export default function ArulisCaseStudy({ onNavigate, onOpenContact }) {
  const shouldReduceMotion = useReducedMotion()
  const [selectedColorIndex, setSelectedColorIndex] = useState(0)

  // Scroll to top when arriving at the case study
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const colorPalette = [
    {
      name: 'Deep Forest',
      hex: '#0F3D2E',
      role: 'Primary Brand Color',
      bgClass: 'bg-[#0F3D2E]',
      textClass: 'text-white',
      desc: 'Evokes medical authority, clinical hygiene, and the grounded serenity of a private wellness retreat.',
    },
    {
      name: 'Sage Green',
      hex: '#6B8F71',
      role: 'Secondary Color',
      bgClass: 'bg-[#6B8F71]',
      textClass: 'text-white',
      desc: 'Brings organic warmth and gentle reassurance to patient communications and digital touches.',
    },
    {
      name: 'Crisp Ivory',
      hex: '#FDFBF7',
      role: 'Background & Spatial Tone',
      bgClass: 'bg-[#FDFBF7]',
      textClass: 'text-[#1A1D1A]',
      desc: 'Replaces cold clinical white with a warm, museum-grade architectural off-white.',
    },
    {
      name: 'Platinum Gold',
      hex: '#D4AF37',
      role: 'Prestige Accent & Foil',
      bgClass: 'bg-[#D4AF37]',
      textClass: 'text-white',
      desc: 'Debossed foil and illuminated brass finishes reflecting precision craftsmanship and aesthetic mastery.',
    },
    {
      name: 'Soft Charcoal',
      hex: '#1A1D1A',
      role: 'Editorial Typographic Tone',
      bgClass: 'bg-[#1A1D1A]',
      textClass: 'text-white',
      desc: 'Ensures effortless legibility without the harshness of pure black.',
    },
  ]

  const deliverables = [
    'Comprehensive Brand Identity & Logo Mark',
    'Custom Typography & Editorial Layout System',
    'Tactile Stationery, Staff Credentials & Signage',
    'Physical Packaging & Patient Care Amenities',
    'Motion Graphics & Animated Brand Identity Reel',
    'Responsive Digital Flagship & Booking Experience',
  ]

  return (
    <div 
      data-cursor-theme="arulis"
      className="relative min-h-screen bg-[#FDFBF7] text-[#1A1D1A] overflow-x-hidden pt-20 sm:pt-28"
    >
      
      {/* 
        ========================================================================
        TOP STICKY BREADCRUMB / BACK-TO-WORK NAVIGATION BAR
        ========================================================================
      */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-b border-black/10">
          
          {/* Back button */}
          <button
            type="button"
            onClick={() => onNavigate('/#work')}
            data-cursor="hover"
            className="group inline-flex items-center gap-2 font-mono text-[12px] sm:text-[13px] font-semibold text-[#1A1D1A] hover:text-[#0F3D2E] transition-colors py-1 px-3 rounded-full hover:bg-black/5"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1 text-[#0F3D2E]" />
            <span>BACK TO FEATURED WORK</span>
          </button>

          {/* Breadcrumb path & Case Study Number */}
          <div className="flex items-center gap-3 font-mono text-[11px] sm:text-[12px] text-[#718096]">
            <span className="hidden sm:inline">NORTHUP STUDIO</span>
            <span className="hidden sm:inline">&middot;</span>
            <span className="text-[#0F3D2E] font-semibold">ARULIS DENTAL CLINIC</span>
            <span>&middot;</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#0F3D2E]/10 text-[#0F3D2E] font-bold">02 / 06</span>
          </div>

        </div>
      </div>

      {/* 
        ========================================================================
        CASE STUDY INTRODUCTION & HERO TITLE
        ========================================================================
      */}
      <header className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* Title & Tagline (lg:col-span-8) */}
          <motion.div 
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-8"
          >
            <div className="inline-flex items-center gap-2 font-mono text-[#0F3D2E] text-[11px] sm:text-[12px] font-semibold tracking-widest uppercase mb-4 px-3.5 py-1 rounded-full bg-[#0F3D2E]/5 border border-[#0F3D2E]/15">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>BRAND IDENTITY · SPATIAL &amp; DIGITAL FLAGSHIP</span>
            </div>

            <h1 className="font-playfair text-[44px] sm:text-[68px] lg:text-[84px] font-normal text-[#1A1D1A] tracking-tight leading-[0.96] mb-6">
              Arulis <span className="italic font-normal text-[#0F3D2E]">Dental Clinic</span>
            </h1>

            <p className="font-playfair text-[20px] sm:text-[26px] lg:text-[30px] italic text-[#4A5568] max-w-[760px] leading-snug mb-8">
              "The Ultimate Shield for Your Teeth"
            </p>

            <p className="font-montserrat text-[#4A5568] text-[15px] sm:text-[17px] leading-relaxed max-w-[720px]">
              Arulis Dental Clinic approached Northup Studio to construct a holistic brand ecosystem that transcends typical medical steriles. 
              Situated in Koregaon Park, Pune, Arulis required an aesthetic identity that harmonizes surgical excellence with the serene hospitality of a private architectural sanctuary.
            </p>
          </motion.div>

          {/* Project Metadata Grid (lg:col-span-4) */}
          <motion.div 
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-white border border-black/10 shadow-sm"
          >
            <h3 className="font-mono text-[11px] font-bold text-[#0F3D2E] tracking-widest uppercase mb-6 pb-2 border-b border-black/10">
              PROJECT SPECIFICATIONS
            </h3>

            <dl className="space-y-4 font-mono text-[12px]">
              <div>
                <dt className="text-[#A0AEC0] uppercase tracking-wider text-[10px]">Client</dt>
                <dd className="font-semibold text-[#1A1D1A] text-[13px] mt-0.5">Arulis Dental Clinic</dd>
              </div>

              <div>
                <dt className="text-[#A0AEC0] uppercase tracking-wider text-[10px]">Location</dt>
                <dd className="font-semibold text-[#1A1D1A] text-[13px] mt-0.5">Koregaon Park, Pune, India</dd>
              </div>

              <div>
                <dt className="text-[#A0AEC0] uppercase tracking-wider text-[10px]">Year / Timeline</dt>
                <dd className="font-semibold text-[#1A1D1A] text-[13px] mt-0.5">2024 — 2025</dd>
              </div>

              <div>
                <dt className="text-[#A0AEC0] uppercase tracking-wider text-[10px]">Northup Studio Scope</dt>
                <dd className="font-semibold text-[#1A1D1A] text-[13px] mt-0.5">
                  Brand Identity, Motion Graphics, Physical Stationery, UI Architecture &amp; Front-End Development
                </dd>
              </div>

              <div>
                <dt className="text-[#A0AEC0] uppercase tracking-wider text-[10px]">Art Direction</dt>
                <dd className="font-semibold text-[#0F3D2E] text-[13px] mt-0.5">Northup Studio</dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={() => onOpenContact('Project Inquiry: Inspired by Arulis Dental Clinic')}
              data-cursor="hover"
              className="mt-6 w-full py-3 rounded-full bg-[#0F3D2E] hover:bg-[#155440] text-white font-mono text-[12px] font-semibold tracking-wider uppercase transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm"
            >
              <span>INQUIRE ABOUT THIS WORK</span>
              <ArrowUpRight className="w-4 h-4 text-[#D4AF37]" />
            </button>
          </motion.div>

        </div>
      </header>

      {/* 
        ========================================================================
        SECTION 1: THE FLAGSHIP SPATIAL RECEPTION SHOWCASE
        ========================================================================
      */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
        <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden bg-[#0A241B] border border-black/10 shadow-[0_20px_60px_rgba(15,61,46,0.18)]">
          <img
            src="/assets/arulis/aurelis-reception.png"
            alt="Arulis Dental Clinic Architectural Reception with Illuminated Brass Logo"
            className="w-full h-auto object-cover max-h-[780px]"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />

          {/* Floating Caption Overlay */}
          <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 sm:right-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[#D4AF37] font-mono text-[11px] font-semibold tracking-wider uppercase mb-2">
                <span>SPATIAL APPLICATION · KOREGAON PARK</span>
              </div>
              <h3 className="font-playfair text-[24px] sm:text-[34px] leading-tight">
                Architectural Serenity &amp; Backlit Brass Identity
              </h3>
            </div>
            <p className="font-mono text-[11px] sm:text-[12px] text-white/70 max-w-[340px] text-left sm:text-right">
              FIG. 01 — The primary clinic reception wall combines bookmatched Italian marble with warm halo-lit brass letterforms.
            </p>
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        SECTION 2: BRAND IDENTITY RATIONALE & CHROMATIC SYSTEM
        ========================================================================
      */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
        
        {/* Header */}
        <div className="max-w-[800px] mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 font-mono text-[#0F3D2E] text-[11px] sm:text-[12px] font-semibold tracking-widest uppercase mb-3 px-3.5 py-1 rounded-full bg-[#0F3D2E]/5 border border-[#0F3D2E]/15">
            <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>[ 02 · BRAND SYSTEM &amp; GEOMETRIC ANATOMY ]</span>
          </div>
          <h2 className="font-playfair text-[32px] sm:text-[46px] lg:text-[54px] font-normal text-[#1A1D1A] tracking-tight leading-[1.08] mb-4">
            The Geometry of <span className="italic text-[#0F3D2E]">Protection</span>
          </h2>
          <p className="font-montserrat text-[#4A5568] text-[15px] sm:text-[16px] leading-relaxed">
            The Arulis emblem fuses the organic anatomical contours of tooth enamel with the resilient profile of a heraldic shield. 
            A continuous golden ribbon arcs gracefully across the molar valley, communicating clinical safeguarding and aesthetic elevation.
          </p>
        </div>

        {/* Dual Card Showcase: Light vs Dark Contrast */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-16">
          
          {/* Dark Mode Variant */}
          <div className="group relative rounded-3xl p-8 sm:p-12 bg-[#0F3D2E] text-white border border-[#0F3D2E] shadow-xl flex flex-col justify-between aspect-[16/11] overflow-hidden">
            <div className="relative z-10 flex items-center justify-between">
              <span className="font-mono text-[11px] tracking-widest text-[#D4AF37] uppercase">PRIMARY VARIANT · DEEP FOREST</span>
              <span className="font-mono text-[11px] text-white/50">#0F3D2E</span>
            </div>

            <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center py-6">
              <img
                src="/assets/arulis/aurelis-dark-card.png"
                alt="Arulis Dental Clinic Dark Emblem"
                className="w-40 sm:w-52 h-auto object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)] transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="relative z-10 flex items-center justify-between font-mono text-[11px] text-white/60">
              <span>METALLIC GOLD EMBLEM</span>
              <span>RECEPTION &amp; CREDENTIALS</span>
            </div>

            {/* Subtle background glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-[#D4AF37]/10 pointer-events-none" />
          </div>

          {/* Light Mode Variant */}
          <div className="group relative rounded-3xl p-8 sm:p-12 bg-white text-[#1A1D1A] border border-black/10 shadow-sm flex flex-col justify-between aspect-[16/11] overflow-hidden">
            <div className="relative z-10 flex items-center justify-between">
              <span className="font-mono text-[11px] tracking-widest text-[#0F3D2E] uppercase">SECONDARY VARIANT · CRISP IVORY</span>
              <span className="font-mono text-[11px] text-[#A0AEC0]">#FDFBF7</span>
            </div>

            <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center py-6">
              <img
                src="/assets/arulis/aurelis-light-card.png"
                alt="Arulis Dental Clinic Light Emblem"
                className="w-40 sm:w-52 h-auto object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.08)] transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="relative z-10 flex items-center justify-between font-mono text-[11px] text-[#718096]">
              <span>EMERALD &amp; GOLD LOCKUP</span>
              <span>EDITORIAL &amp; CORRESPONDENCE</span>
            </div>
          </div>

        </div>

        {/* Chromatic Palette Interactive Strip */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-black/10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="font-mono text-[12px] font-bold text-[#0F3D2E] tracking-widest uppercase flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#D4AF37]" />
                COLOR SPECTRUM ARCHITECTURE
              </h3>
              <p className="font-montserrat text-[#718096] text-[13px] mt-1">
                A restrained healthcare palette rooted in tranquility, natural restoration, and architectural dignity.
              </p>
            </div>
            <span className="font-mono text-[11px] text-[#A0AEC0]">5 COHESIVE SWATCHES</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {colorPalette.map((swatch, idx) => {
              const isSelected = selectedColorIndex === idx
              return (
                <div
                  key={swatch.hex}
                  onClick={() => setSelectedColorIndex(idx)}
                  data-cursor="hover"
                  className={`group rounded-2xl p-4 sm:p-5 flex flex-col justify-between aspect-[3/4] cursor-pointer transition-all duration-300 ${swatch.bgClass} ${swatch.textClass} ${
                    isSelected ? 'ring-4 ring-[#0F3D2E]/30 scale-[1.02] shadow-lg' : 'hover:scale-[1.01] border border-black/10'
                  }`}
                >
                  <div className="font-mono text-[10px] tracking-wider uppercase opacity-75">
                    {swatch.role}
                  </div>

                  <div>
                    <h4 className="font-playfair text-[18px] sm:text-[20px] font-medium leading-tight mb-1">
                      {swatch.name}
                    </h4>
                    <div className="font-mono text-[12px] font-semibold opacity-90">
                      {swatch.hex}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Active Color Description */}
          <div className="mt-6 p-4 rounded-xl bg-[#FDFBF7] border border-black/5 flex items-center gap-3 font-mono text-[12px] text-[#4A5568]">
            <span className="font-bold text-[#0F3D2E] uppercase">
              {colorPalette[selectedColorIndex].name} ({colorPalette[selectedColorIndex].hex}):
            </span>
            <span>{colorPalette[selectedColorIndex].desc}</span>
          </div>
        </div>

      </section>

      {/* 
        ========================================================================
        SECTION 3: THE INTERACTIVE ID CARD & VIDEO MOTION SECTION
        ========================================================================
      */}
      <ArulisIdCardSection />

      {/* 
        ========================================================================
        SECTION 4: TACTILE STATIONERY, SPATIAL & MERCHANDISE APPLICATIONS
        ========================================================================
      */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
        
        {/* Header */}
        <div className="max-w-[800px] mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 font-mono text-[#0F3D2E] text-[11px] sm:text-[12px] font-semibold tracking-widest uppercase mb-3 px-3.5 py-1 rounded-full bg-[#0F3D2E]/5 border border-[#0F3D2E]/15">
            <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>[ 04 · PHYSICAL TOUCHPOINTS &amp; SPATIAL PRESENCE ]</span>
          </div>
          <h2 className="font-playfair text-[32px] sm:text-[46px] lg:text-[54px] font-normal text-[#1A1D1A] tracking-tight leading-[1.08] mb-4">
            Tactile Continuity <span className="italic text-[#0F3D2E]">&amp; Print Architecture</span>
          </h2>
          <p className="font-montserrat text-[#4A5568] text-[15px] sm:text-[16px] leading-relaxed">
            Every patient interaction was intentionally choreographed — from the street-facing signage to the appointment cards and post-operative home hygiene kit.
          </p>
        </div>

        {/* Asymmetric Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Card 1: Outdoor Signboard (md:col-span-5) */}
          <div className="md:col-span-5 group relative rounded-3xl overflow-hidden bg-[#E2E8F0] border border-black/10 shadow-sm aspect-[4/5]">
            <img
              src="/assets/arulis/aurelis-signboard.png"
              alt="Arulis Dental Signboard Mockup"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#D4AF37]">EXTERIOR SIGNAGE</span>
              <h3 className="font-playfair text-[22px] sm:text-[26px] mt-1">Wrought Iron &amp; Warm Stone</h3>
              <p className="font-mono text-[11px] text-white/70 mt-1">Custom double-sided hanging clinic entrance sign.</p>
            </div>
          </div>

          {/* Card 2: City Kiosk Totem (md:col-span-7) */}
          <div className="md:col-span-7 group relative rounded-3xl overflow-hidden bg-[#E2E8F0] border border-black/10 shadow-sm aspect-[16/11]">
            <img
              src="/assets/arulis/aurelis-kiosk-mockup.png"
              alt="Arulis Urban Kiosk Display"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#D4AF37]">URBAN BRAND PRESENCE</span>
              <h3 className="font-playfair text-[24px] sm:text-[28px] mt-1">High-Impact Minimalist Kiosk</h3>
              <p className="font-mono text-[11px] text-white/70 mt-1">Uncluttered branding asserting clarity within vibrant Pune thoroughfares.</p>
            </div>
          </div>

          {/* Card 3: Business Cards & Appointment Cards (md:col-span-7) */}
          <div className="md:col-span-7 group relative rounded-3xl overflow-hidden bg-[#E2E8F0] border border-black/10 shadow-sm aspect-[16/11]">
            <img
              src="/assets/arulis/aurelis-business-cards.png"
              alt="Arulis Dental Consultant Business Cards"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#D4AF37]">PATIENT COLLATERAL</span>
              <h3 className="font-playfair text-[24px] sm:text-[28px] mt-1">Cotton Stock &amp; Foil Debossing</h3>
              <p className="font-mono text-[11px] text-white/70 mt-1">450gsm textured stock with gold-edge gilding and quick-scan appointment QR.</p>
            </div>
          </div>

          {/* Card 4: Toothbrush & Ceramic Rinse Cup (md:col-span-5) */}
          <div className="md:col-span-5 group relative rounded-3xl overflow-hidden bg-[#E2E8F0] border border-black/10 shadow-sm aspect-[4/5]">
            <img
              src="/assets/arulis/aurelis-cup.png"
              alt="Arulis Dental Branded Toothbrush and Rinse Cup"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#D4AF37]">CLINIC AMENITIES</span>
              <h3 className="font-playfair text-[22px] sm:text-[26px] mt-1">Sustainable Care Vessels</h3>
              <p className="font-mono text-[11px] text-white/70 mt-1">Custom matte ceramic cup and brass-tipped oral hygiene tools.</p>
            </div>
          </div>

        </div>

      </section>

      {/* 
        ========================================================================
        SECTION 5: DIGITAL PLATFORM & UI ARCHITECTURE
        ========================================================================
      */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
        
        {/* Header */}
        <div className="max-w-[800px] mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 font-mono text-[#0F3D2E] text-[11px] sm:text-[12px] font-semibold tracking-widest uppercase mb-3 px-3.5 py-1 rounded-full bg-[#0F3D2E]/5 border border-[#0F3D2E]/15">
            <Monitor className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>[ 05 · DIGITAL FLAGSHIP &amp; FRONT-END ARCHITECTURE ]</span>
          </div>
          <h2 className="font-playfair text-[32px] sm:text-[46px] lg:text-[54px] font-normal text-[#1A1D1A] tracking-tight leading-[1.08] mb-4">
            The Digital <span className="italic text-[#0F3D2E]">Sanctuary</span>
          </h2>
          <p className="font-montserrat text-[#4A5568] text-[15px] sm:text-[16px] leading-relaxed">
            The online presence mirrors the clinic's architectural calm. Engineered with unhurried typography, transparent treatment pricing, and a streamlined one-touch appointment booking engine.
          </p>
        </div>

        {/* Flagship Desktop Screen Showcase on iMac */}
        <div className="group relative rounded-3xl overflow-hidden bg-white border border-black/10 shadow-xl mb-10">
          <img
            src="/assets/arulis/aurelis-desktop-screen.png"
            alt="Arulis Dental Clinic Desktop Flagship Interface"
            className="w-full h-auto object-cover max-h-[750px]"
            loading="lazy"
          />
          <div className="p-6 sm:p-8 bg-white border-t border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="font-mono text-[11px] font-bold text-[#0F3D2E] uppercase tracking-wider">
                FLAGSHIP WEB EXPERIENCE
              </div>
              <h3 className="font-playfair text-[20px] sm:text-[24px] text-[#1A1D1A] mt-0.5">
                "The Art of a Healthier, More Confident Smile"
              </h3>
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px] text-[#718096]">
              <span>Next.js 14</span>
              <span>&middot;</span>
              <span>Tailwind CSS</span>
              <span>&middot;</span>
              <span>Framer Motion</span>
            </div>
          </div>
        </div>

        {/* Handheld Responsive Duo: Mobile on Marble & Mobile in Hand */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          <div className="group relative rounded-3xl overflow-hidden bg-white border border-black/10 shadow-sm aspect-[4/5]">
            <img
              src="/assets/arulis/aurelis-mobile-marble.png"
              alt="Arulis Mobile Web Experience on Marble Table"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#D4AF37]">RESPONSIVE FIDELITY</span>
              <h3 className="font-playfair text-[22px] sm:text-[26px] mt-1">Fluid Mobile Appointment Flow</h3>
              <p className="font-mono text-[11px] text-white/70 mt-1">Frictionless 3-step booking designed for busy Pune professionals.</p>
            </div>
          </div>

          <div className="group relative rounded-3xl overflow-hidden bg-white border border-black/10 shadow-sm aspect-[4/5]">
            <img
              src="/assets/arulis/aurelis-tablet-mockup.png"
              alt="Arulis Tablet Digital Experience"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#D4AF37]">IN-CLINIC TABLET SYSTEM</span>
              <h3 className="font-playfair text-[22px] sm:text-[26px] mt-1">Digital Patient Consultations</h3>
              <p className="font-mono text-[11px] text-white/70 mt-1">Interactive 3D diagnostics and transparent treatment timelines on iPad.</p>
            </div>
          </div>

        </div>

      </section>

      {/* 
        ========================================================================
        SECTION 6: COMPREHENSIVE BRAND IDENTITY GUIDELINES
        ========================================================================
      */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
        <div className="p-8 sm:p-14 rounded-3xl bg-white border border-black/10 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-black/10">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-[#0F3D2E] text-[11px] font-semibold tracking-widest uppercase mb-2">
                <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>COMPLETE DESIGN SYSTEM DELIVERABLE</span>
              </div>
              <h2 className="font-playfair text-[28px] sm:text-[40px] text-[#1A1D1A]">
                Brand Identity Guidelines 1.0
              </h2>
            </div>
            <p className="font-mono text-[12px] text-[#718096] max-w-[420px]">
              Full documentation delivering exact rules for logo spacing, chromatic ratios, typography scales, and tactile materials.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden border border-black/10 shadow-inner bg-[#FDFBF7]">
            <img
              src="/assets/arulis/aurelis-brand-guide.jpg"
              alt="Arulis Dental Clinic Full Brand Identity Guidelines System"
              className="w-full h-auto object-contain"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        SECTION 7: CLOSING EDITORIAL REFLECTION & NEXT PROJECT LINK
        ========================================================================
      */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24">
        <div className="p-8 sm:p-16 rounded-[28px] sm:rounded-[36px] bg-[#15100E] text-white border border-white/10 shadow-2xl relative overflow-hidden">
          
          {/* Ambient burnt orange aura */}
          <div 
            className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(255,77,10,0.2) 0%, transparent 70%)'
            }}
          />

          <div className="relative z-10 max-w-[800px]">
            <div className="inline-flex items-center gap-2 font-mono text-[#FF8738] text-[11px] tracking-widest uppercase mb-4 px-3 py-1 rounded-full bg-[#FF4D0A]/10 border border-[#FF4D0A]/20">
              <Sparkles className="w-3 h-3 text-[#FF8738]" />
              <span>OUTCOME &amp; IMPACT</span>
            </div>

            <blockquote className="font-playfair text-[24px] sm:text-[34px] lg:text-[40px] italic font-normal text-white/95 leading-snug mb-8">
              "In clinical healthcare, trust is not merely communicated — it is felt at every touchpoint. For Arulis, we engineered a visual language where surgical excellence meets tactile serenity."
            </blockquote>

            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => onNavigate('/#work')}
                data-cursor="hover"
                className="px-6 py-3.5 rounded-full bg-white hover:bg-[#FF8738] text-black hover:text-white font-mono text-[12px] font-bold tracking-wider uppercase transition-all duration-300 shadow-md active:scale-95"
              >
                ← BACK TO ALL WORK
              </button>

              <button
                type="button"
                onClick={() => onOpenContact('Project Inquiry: Creative Studio Retainer')}
                data-cursor="hover"
                className="px-6 py-3.5 rounded-full bg-[#FF4D0A] hover:bg-[#ff6426] text-white font-mono text-[12px] font-bold tracking-wider uppercase transition-all duration-300 shadow-md active:scale-95 flex items-center gap-2"
              >
                <span>COMMISSION A CASE STUDY</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 
        ========================================================================
        GLOBAL NORTHUP STUDIO FOOTER (WITH COMPASS LANDING ANIMATION INTACT)
        ========================================================================
      */}
      <Footer onOpenContact={onOpenContact} />

    </div>
  )
}
