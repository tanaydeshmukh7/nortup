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
  Tablet,
  Share2,
  ExternalLink,
  Code2,
  Cpu,
  Clock,
  Eye,
  Globe,
  Radio
} from 'lucide-react'
import ArulisIdCardSection from '../components/ArulisIdCardSection'
import ArulisResponsiveMarquee from '../components/ArulisResponsiveMarquee'
import Footer from '../components/Footer'

/**
 * =============================================================================
 * CENTRAL LIVE WEBSITE CONFIGURATION
 * Provide the live production URL here once available.
 * If left empty (""), the UI automatically renders an elegant "COMING SOON" placeholder.
 * =============================================================================
 */
const ARULIS_LIVE_URL = ""

export default function ArulisCaseStudy({ onNavigate, onOpenContact }) {
  const shouldReduceMotion = useReducedMotion()
  const [selectedColorIndex, setSelectedColorIndex] = useState(0)

  // Scroll to top upon entering case study
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  // Brand Color Architecture
  const colorPalette = [
    {
      name: 'Deep Forest',
      hex: '#0F3D2E',
      role: 'Primary Brand Color',
      bgClass: 'bg-[#0F3D2E]',
      textClass: 'text-white',
      borderClass: 'border-[#0F3D2E]',
      desc: 'Evoking medical authority, clinical hygiene, and the grounded serenity of a private architectural wellness sanctuary.',
    },
    {
      name: 'Sage Green',
      hex: '#6B8F71',
      role: 'Secondary Color',
      bgClass: 'bg-[#6B8F71]',
      textClass: 'text-white',
      borderClass: 'border-[#6B8F71]',
      desc: 'Brings organic warmth and gentle reassurance to patient communications, digital touchpoints, and spatial accents.',
    },
    {
      name: 'Crisp Ivory',
      hex: '#FDFBF7',
      role: 'Background & Spatial Tone',
      bgClass: 'bg-[#FDFBF7]',
      textClass: 'text-[#1A1D1A]',
      borderClass: 'border-black/10',
      desc: 'Replaces cold sterile white with a warm, museum-grade architectural off-white that softens ocular strain.',
    },
    {
      name: 'Platinum Gold',
      hex: '#D4AF37',
      role: 'Prestige Accent & Foil',
      bgClass: 'bg-[#D4AF37]',
      textClass: 'text-white',
      borderClass: 'border-[#D4AF37]',
      desc: 'Debossed foil and illuminated brass letterforms reflecting precision craftsmanship, restoration, and aesthetic elevation.',
    },
    {
      name: 'Soft Charcoal',
      hex: '#1A1D1A',
      role: 'Editorial Typographic Tone',
      bgClass: 'bg-[#1A1D1A]',
      textClass: 'text-white',
      borderClass: 'border-[#1A1D1A]',
      desc: 'Ensures effortless editorial legibility across patient care documentation without the harshness of pure black.',
    },
  ]

  // Editorial Pillars of the Digital Flagship
  const clinicalPillars = [
    {
      title: 'Trustworthy',
      subtitle: 'Clinical Reassurance',
      desc: 'Transparent treatment timelines and evidence-backed diagnostics building deep confidence.',
      num: '01',
    },
    {
      title: 'Premium',
      subtitle: 'Architectural Sanctum',
      desc: 'A calm, unhurried atmosphere bridging hospitality aesthetics with surgical excellence.',
      num: '02',
    },
    {
      title: 'Patient-First',
      subtitle: 'Compassionate Care',
      desc: 'Dedicated private time with specialists and frictionless digital communication.',
      num: '03',
    },
    {
      title: 'Professional',
      subtitle: 'Advanced Technology',
      desc: 'Precision 3D imaging, digital enamel mapping, and modern conservative preservation.',
      num: '04',
    },
  ]

  // Validate live URL helper
  const isLiveUrlValid = Boolean(
    ARULIS_LIVE_URL && 
    typeof ARULIS_LIVE_URL === 'string' && 
    ARULIS_LIVE_URL.trim().length > 0 && 
    /^https?:\/\//i.test(ARULIS_LIVE_URL.trim())
  )

  return (
    <div 
      data-cursor-theme="arulis"
      className="relative min-h-screen bg-[#FDFBF7] text-[#1A1D1A] overflow-x-hidden pt-20 sm:pt-28 select-none"
    >
      
      {/* 
        ========================================================================
        TOP STICKY BREADCRUMB / BACK-TO-WORK NAVIGATION BAR
        ========================================================================
      */}
      <nav aria-label="Breadcrumb" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
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
      </nav>

      {/* 
        ========================================================================
        SECTION 01 — CINEMATIC HERO: DUAL DISCIPLINE FLAGSHIP
        ========================================================================
      */}
      <header className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24">
        
        {/* Editorial Eyebrow & Hero Title */}
        <div className="max-w-[1100px] mb-8 sm:mb-12">
          
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 font-mono text-[#0F3D2E] text-[11px] sm:text-[12px] font-semibold tracking-widest uppercase mb-4 px-3.5 py-1 rounded-full bg-[#0F3D2E]/5 border border-[#0F3D2E]/15"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>BRAND IDENTITY / WEBSITE DESIGN &amp; DEVELOPMENT</span>
          </motion.div>

          <motion.h1 
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-playfair text-[44px] sm:text-[68px] lg:text-[88px] font-normal text-[#1A1D1A] tracking-tight leading-[0.96] mb-6"
          >
            Arulis <span className="italic font-normal text-[#0F3D2E]">Dental Clinic</span>
          </motion.h1>

          <motion.p
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="font-playfair text-[20px] sm:text-[28px] lg:text-[34px] italic text-[#4A5568] max-w-[860px] leading-snug mb-6"
          >
            "The Art of a Healthier, More Confident Smile."
          </motion.p>

          <motion.p
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="font-montserrat text-[#4A5568] text-[15px] sm:text-[18px] leading-relaxed max-w-[820px]"
          >
            A comprehensive brand identity and digital flagship conceived as an architectural sanctuary in Koregaon Park, Pune. 
            Northup Studio designed and engineered the complete ecosystem — bridging classical heraldic safeguarding with a responsive, high-performance web experience.
          </motion.p>

        </div>

        {/* 
          MONUMENTAL HERO VISUAL:
          The Flagship Digital Sanctuary on Apple Studio Display 5K in Warm Architectural Interior
        */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.28, ease: "easeOut" }}
          className="relative rounded-[28px] sm:rounded-[40px] overflow-hidden bg-[#181413] border border-black/15 shadow-[0_24px_70px_rgba(15,61,46,0.18)]"
        >
          <img
            src="/assets/aurelis.jpg"
            alt="Arulis Dental Clinic Flagship Website Experience on Studio Display"
            className="w-full h-auto object-cover max-h-[820px]"
            loading="eager"
          />

          {/* Vignette Layer */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />

          {/* Architectural HUD Overlay */}
          <div className="absolute top-4 sm:top-8 left-4 sm:left-8 right-4 sm:right-8 flex items-center justify-between pointer-events-none text-white z-10">
            <span className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[#D4AF37]">
              FLAGSHIP DIGITAL SANCTUARY
            </span>
            <span className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white/80 hidden sm:inline-block">
              5K STUDIO DISPLAY · NEXT.JS / REACT
            </span>
          </div>

          {/* Bottom Caption */}
          <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 sm:right-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[#D4AF37] font-mono text-[11px] font-semibold tracking-wider uppercase mb-2">
                <span>DIGITAL ARCHITECTURE · KOREGAON PARK</span>
              </div>
              <h3 className="font-playfair text-[24px] sm:text-[36px] leading-tight">
                Confidence Begins with Your Smile.
              </h3>
            </div>
            <p className="font-mono text-[11px] sm:text-[12px] text-white/70 max-w-[360px] text-left sm:text-right">
              FIG. 01 — The digital flagship mirrors the serene, unhurried atmosphere of the clinic with generous whitespace and clear clinical hierarchy.
            </p>
          </div>
        </motion.div>

      </header>

      {/* 
        ========================================================================
        SECTION 02 — PROJECT OVERVIEW & SCOPE ARCHITECTURE
        ========================================================================
      */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* Strategic Narrative (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-[#0F3D2E] text-[11px] sm:text-[12px] font-semibold tracking-widest uppercase mb-3 px-3.5 py-1 rounded-full bg-[#0F3D2E]/5 border border-[#0F3D2E]/15">
                <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>[ 01 · STRATEGIC DIRECTION ]</span>
              </div>
              <h2 className="font-playfair text-[32px] sm:text-[46px] lg:text-[52px] font-normal text-[#1A1D1A] tracking-tight leading-[1.08] mb-6">
                Bridging Architectural Serenity <span className="italic text-[#0F3D2E]">&amp; Digital Precision</span>
              </h2>
              <p className="font-montserrat text-[#4A5568] text-[16px] sm:text-[17px] leading-relaxed">
                Most clinical dental practices communicate through harsh blue steriles, stock photography, and chaotic booking forms. 
                Situated in Koregaon Park, Pune, Arulis required an aesthetic universe that treats patient dental care with the reverence of a luxury architectural sanctuary.
              </p>
              <p className="font-montserrat text-[#4A5568] text-[15px] sm:text-[16px] leading-relaxed mt-4">
                Northup Studio was commissioned to build both the visual identity and the digital experience from the ground up. 
                Rather than treating the website as an afterthought, the digital flagship was designed alongside the physical interior — ensuring the transition from screen to physical reception feels completely effortless.
              </p>
            </div>

            {/* The Three Project Scope Disciplines */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
              
              {/* Discipline 1 */}
              <div className="p-6 rounded-2xl bg-white border border-black/10 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-[#0F3D2E]/10 flex items-center justify-center text-[#0F3D2E] mb-4">
                    <Shield className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <span className="font-mono text-[10px] text-[#A0AEC0] tracking-widest uppercase">DISCIPLINE 01</span>
                  <h3 className="font-playfair text-[20px] text-[#1A1D1A] mt-1 mb-2">Brand Identity</h3>
                  <p className="font-montserrat text-[13px] text-[#718096] leading-relaxed">
                    Emblem geometry fusing tooth enamel with a protective heraldic crest, tactile stationery, staff badges, and exterior signage.
                  </p>
                </div>
              </div>

              {/* Discipline 2 */}
              <div className="p-6 rounded-2xl bg-white border border-black/10 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-[#0F3D2E]/10 flex items-center justify-center text-[#0F3D2E] mb-4">
                    <Monitor className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <span className="font-mono text-[10px] text-[#A0AEC0] tracking-widest uppercase">DISCIPLINE 02</span>
                  <h3 className="font-playfair text-[20px] text-[#1A1D1A] mt-1 mb-2">Website Design</h3>
                  <p className="font-montserrat text-[13px] text-[#718096] leading-relaxed">
                    Custom digital flagship with unhurried typography, transparent treatment pricing, specialist profiles, and patient guide.
                  </p>
                </div>
              </div>

              {/* Discipline 3 */}
              <div className="p-6 rounded-2xl bg-white border border-black/10 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-[#0F3D2E]/10 flex items-center justify-center text-[#0F3D2E] mb-4">
                    <Code2 className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <span className="font-mono text-[10px] text-[#A0AEC0] tracking-widest uppercase">DISCIPLINE 03</span>
                  <h3 className="font-playfair text-[20px] text-[#1A1D1A] mt-1 mb-2">Web Development</h3>
                  <p className="font-montserrat text-[13px] text-[#718096] leading-relaxed">
                    Front-end engineering built on Next.js / React with responsive parity across desktop, tablet, and mobile with fluid touch micro-interactions.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Project Specifications Metadata Card (lg:col-span-4) */}
          <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-white border border-black/10 shadow-sm">
            <h3 className="font-mono text-[11px] font-bold text-[#0F3D2E] tracking-widest uppercase mb-6 pb-2 border-b border-black/10 flex items-center justify-between">
              <span>PROJECT SPECIFICATIONS</span>
              <span className="text-[#D4AF37]">PUNE, IN</span>
            </h3>

            <dl className="space-y-4 font-mono text-[12px]">
              <div>
                <dt className="text-[#A0AEC0] uppercase tracking-wider text-[10px]">Client</dt>
                <dd className="font-semibold text-[#1A1D1A] text-[13px] mt-0.5">Arulis Dental Clinic</dd>
              </div>

              <div>
                <dt className="text-[#A0AEC0] uppercase tracking-wider text-[10px]">Location</dt>
                <dd className="font-semibold text-[#1A1D1A] text-[13px] mt-0.5">Koregaon Park, Pune, Maharashtra</dd>
              </div>

              <div>
                <dt className="text-[#A0AEC0] uppercase tracking-wider text-[10px]">Timeline</dt>
                <dd className="font-semibold text-[#1A1D1A] text-[13px] mt-0.5">2024 — 2025</dd>
              </div>

              <div>
                <dt className="text-[#A0AEC0] uppercase tracking-wider text-[10px]">Scope of Deliverables</dt>
                <dd className="font-semibold text-[#1A1D1A] text-[13px] mt-0.5 leading-snug">
                  Brand Identity, Motion Graphics, Physical Stationery, Staff Badges, Signage, UI/UX Architecture &amp; Front-End Web Development
                </dd>
              </div>

              <div>
                <dt className="text-[#A0AEC0] uppercase tracking-wider text-[10px]">Studio Credits</dt>
                <dd className="font-semibold text-[#0F3D2E] text-[13px] mt-0.5">
                  Northup Studio (Design &amp; Development)
                </dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={() => onOpenContact('Project Inquiry: Inspired by Arulis Dental Clinic')}
              data-cursor="hover"
              className="mt-6 w-full py-3.5 rounded-full bg-[#0F3D2E] hover:bg-[#155440] text-white font-mono text-[12px] font-semibold tracking-wider uppercase transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm"
            >
              <span>INQUIRE ABOUT THIS WORK</span>
              <ArrowUpRight className="w-4 h-4 text-[#D4AF37]" />
            </button>
          </div>

        </div>
      </section>

      {/* 
        ========================================================================
        SECTION 03 — BRAND IDENTITY & ARCHITECTURAL PRESENCE
        ========================================================================
      */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
        
        {/* Section Header */}
        <div className="max-w-[800px] mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 font-mono text-[#0F3D2E] text-[11px] sm:text-[12px] font-semibold tracking-widest uppercase mb-3 px-3.5 py-1 rounded-full bg-[#0F3D2E]/5 border border-[#0F3D2E]/15">
            <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
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

        {/* 
          SPATIAL RECEPTION WALL SHOWCASE
          Italian marble wall with halo-lit brass letterforms
        */}
        <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden bg-[#0A241B] border border-black/10 shadow-[0_20px_60px_rgba(15,61,46,0.18)] mb-14">
          <img
            src="/assets/arulis/aurelis-reception.png"
            alt="Arulis Dental Clinic Architectural Reception with Illuminated Brass Logo"
            className="w-full h-auto object-cover max-h-[760px]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

          {/* Floating Caption Overlay */}
          <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 sm:right-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[#D4AF37] font-mono text-[11px] font-semibold tracking-wider uppercase mb-2">
                <span>SPATIAL APPLICATION · KOREGAON PARK CLINIC</span>
              </div>
              <h3 className="font-playfair text-[24px] sm:text-[34px] leading-tight">
                Architectural Serenity &amp; Backlit Brass Identity
              </h3>
            </div>
            <p className="font-mono text-[11px] sm:text-[12px] text-white/70 max-w-[340px] text-left sm:text-right">
              FIG. 02 — The primary reception wall combines bookmatched Italian marble with warm halo-lit brass letterforms, setting an immediate tone of calm authority.
            </p>
          </div>
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
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-black/10 shadow-sm mb-16">
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

        {/* 
          TACTILE STATIONERY & SPATIAL TOUCHPOINTS
          Wrought Iron Signboard, City Kiosk, Business Cards & Clinic Amenities
        */}
        <div className="mb-16">
          <div className="max-w-[700px] mb-8">
            <h3 className="font-playfair text-[26px] sm:text-[34px] font-normal text-[#1A1D1A]">
              Tactile Continuity <span className="italic text-[#0F3D2E]">&amp; Print Architecture</span>
            </h3>
            <p className="font-montserrat text-[#718096] text-[14px] mt-1">
              Every patient touchpoint was intentionally choreographed — from the street-facing wrought iron entrance to foil-debossed business cards and custom ceramic oral care vessels.
            </p>
          </div>

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
                <h4 className="font-playfair text-[22px] sm:text-[26px] mt-1">Wrought Iron &amp; Warm Stone</h4>
                <p className="font-mono text-[11px] text-white/70 mt-1">Double-sided hanging entrance sign marking the Koregaon Park sanctuary.</p>
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
                <h4 className="font-playfair text-[24px] sm:text-[28px] mt-1">High-Impact Minimalist Kiosk</h4>
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
                <h4 className="font-playfair text-[24px] sm:text-[28px] mt-1">Cotton Stock &amp; Foil Debossing</h4>
                <p className="font-mono text-[11px] text-white/70 mt-1">450gsm textured cotton stock with gold-edge gilding and appointment QR.</p>
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
                <h4 className="font-playfair text-[22px] sm:text-[26px] mt-1">Sustainable Care Vessels</h4>
                <p className="font-mono text-[11px] text-white/70 mt-1">Custom matte ceramic cup and brass-tipped oral hygiene tools.</p>
              </div>
            </div>

          </div>
        </div>

        {/* 
          COMPREHENSIVE BRAND IDENTITY GUIDELINES 1.0 SYSTEM
          Full presentation board showcasing rules, clear space, and patterns
        */}
        <div className="p-8 sm:p-14 rounded-3xl bg-white border border-black/10 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-black/10">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-[#0F3D2E] text-[11px] font-semibold tracking-widest uppercase mb-2">
                <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>COMPLETE DESIGN SYSTEM DELIVERABLE</span>
              </div>
              <h3 className="font-playfair text-[28px] sm:text-[40px] text-[#1A1D1A]">
                Brand Identity Guidelines 1.0
              </h3>
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
        SECTION 04 — INTERACTIVE ID-CARD FILM: LUXURY CINEMATIC REEL
        Hover on desktop / tap on mobile reveals the accelerated vector motion film
        ========================================================================
      */}
      <ArulisIdCardSection />

      {/* 
        ========================================================================
        SECTION 05 — THE BRIDGE: FROM BRAND IDENTITY TO DIGITAL EXPERIENCE
        A deliberate editorial bridge connecting physical luxury to web precision
        ========================================================================
      */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 my-20 sm:my-28">
        <div className="relative rounded-[28px] sm:rounded-[36px] bg-[#0A241B] text-white p-8 sm:p-16 lg:p-20 overflow-hidden border border-[#0F3D2E]/30 shadow-2xl">
          
          {/* Subtle champagne radial aura */}
          <div 
            className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)'
            }}
          />

          <div className="relative z-10 max-w-[820px]">
            <div className="inline-flex items-center gap-2 font-mono text-[#D4AF37] text-[11px] sm:text-[12px] font-semibold tracking-widest uppercase mb-4 px-3.5 py-1 rounded-full bg-white/10 border border-[#D4AF37]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>[ 04 · THE DIGITAL TRANSLATION ]</span>
            </div>

            <h2 className="font-playfair text-[34px] sm:text-[48px] lg:text-[58px] font-normal tracking-tight leading-[1.05] mb-6">
              From Physical Sanctuary to <span className="italic text-[#D4AF37]">Digital Flagship</span>
            </h2>

            <p className="font-montserrat text-white/80 text-[15px] sm:text-[17px] leading-relaxed mb-6">
              A dental clinic's digital presence must inspire the same quiet reassurance as stepping through its front doors. 
              We extended the architectural calm, tactile materials, and restrained typographic proportions of the Arulis identity into a custom-engineered web platform.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/15 font-mono text-[12px]">
              <div>
                <div className="text-[#D4AF37] font-bold text-[14px]">UNHURRIED PACING</div>
                <p className="text-white/60 text-[11px] mt-1">Generous whitespace mirroring private consultation rooms.</p>
              </div>
              <div>
                <div className="text-[#D4AF37] font-bold text-[14px]">CLINICAL CLARITY</div>
                <p className="text-white/60 text-[11px] mt-1">Transparent treatment scopes without confusing medical jargon.</p>
              </div>
              <div>
                <div className="text-[#D4AF37] font-bold text-[14px]">FLUID CONTINUITY</div>
                <p className="text-white/60 text-[11px] mt-1">One continuous brand voice from first search to in-chair treatment.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        SECTION 06 — WEBSITE DESIGN & DEVELOPMENT: DESKTOP & INTERFACE SYSTEM
        Showcasing Northup Studio's end-to-end design and code execution
        ========================================================================
      */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
        
        {/* Section Header */}
        <div className="max-w-[800px] mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 font-mono text-[#0F3D2E] text-[11px] sm:text-[12px] font-semibold tracking-widest uppercase mb-3 px-3.5 py-1 rounded-full bg-[#0F3D2E]/5 border border-[#0F3D2E]/15">
            <Monitor className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>[ 05 · WEBSITE DESIGN &amp; DEVELOPMENT ]</span>
          </div>
          <h2 className="font-playfair text-[32px] sm:text-[46px] lg:text-[54px] font-normal text-[#1A1D1A] tracking-tight leading-[1.08] mb-4">
            The Digital <span className="italic text-[#0F3D2E]">Sanctuary</span>
          </h2>
          <p className="font-montserrat text-[#4A5568] text-[15px] sm:text-[16px] leading-relaxed">
            The online presence mirrors the clinic's architectural calm. Engineered with unhurried typography, transparent treatment pricing, and a streamlined one-touch appointment booking engine.
          </p>
        </div>

        {/* 
          A. DESKTOP WEBSITE PRESENTATION:
          Minimalist Studio Desk Screen (aurelis-desktop-screen.png)
        */}
        <div className="group relative rounded-3xl overflow-hidden bg-white border border-black/10 shadow-xl mb-12">
          <img
            src="/assets/arulis/aurelis-desktop-screen.png"
            alt="Arulis Dental Clinic Desktop Flagship Interface"
            className="w-full h-auto object-cover max-h-[760px]"
            loading="lazy"
          />
          <div className="p-6 sm:p-8 bg-white border-t border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="font-mono text-[11px] font-bold text-[#0F3D2E] uppercase tracking-wider">
                FLAGSHIP WEB EXPERIENCE · DESKTOP BREAKPOINT
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
              <span>&middot;</span>
              <span className="text-[#0F3D2E] font-semibold">Northup Studio Code</span>
            </div>
          </div>
        </div>

        {/* 
          B. PURE ISOLATED DESKTOP INTERFACE & ARCHITECTURAL ANATOMY:
          Crisp high-resolution crop of the actual designed & developed web UI
        */}
        <div className="rounded-3xl p-6 sm:p-10 bg-white border border-black/10 shadow-sm mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-black/10">
            <div>
              <span className="font-mono text-[10px] text-[#0F3D2E] uppercase tracking-widest font-bold">
                INTERFACE ANATOMY &amp; TYPOGRAPHIC LAYOUT
              </span>
              <h4 className="font-playfair text-[22px] sm:text-[26px] text-[#1A1D1A]">
                Harmonizing Editorial Pacing with Clinical Logic
              </h4>
            </div>
            <span className="font-mono text-[11px] text-[#A0AEC0]">1440PX FLUID GRID</span>
          </div>

          {/* Clean UI Screenshot */}
          <div className="rounded-2xl overflow-hidden border border-black/10 shadow-md bg-[#FDFBF7]">
            <img
              src="/assets/arulis/aurelis-desktop-ui.png"
              alt="Arulis Dental Clinic Pure Desktop Interface"
              className="w-full h-auto object-contain"
              loading="lazy"
            />
          </div>
        </div>

        {/* 
          C. THE FOUR EDITORIAL TREATMENT PILLARS:
          Demonstrating the exact responsive modules engineered for Arulis
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {clinicalPillars.map((pillar) => (
            <div 
              key={pillar.title}
              className="p-6 rounded-2xl bg-white border border-black/10 shadow-sm flex flex-col justify-between hover:border-[#0F3D2E]/30 transition-colors"
            >
              <div>
                <span className="font-mono text-[11px] font-bold text-[#D4AF37] tracking-wider">
                  {pillar.num} /
                </span>
                <h4 className="font-playfair text-[20px] font-normal text-[#1A1D1A] mt-2 mb-1">
                  {pillar.title}
                </h4>
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#0F3D2E] font-medium mb-2">
                  {pillar.subtitle}
                </div>
                <p className="font-montserrat text-[12px] text-[#718096] leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 
          D. FRONT-END DEVELOPMENT NARRATIVE:
          Code architecture, performance metrics, and responsive integrity
        */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0F3D2E] text-white border border-[#0F3D2E] shadow-xl relative overflow-hidden">
          {/* Subtle gold glow */}
          <div 
            className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)'
            }}
          />

          <div className="relative z-10 max-w-[800px]">
            <div className="inline-flex items-center gap-2 font-mono text-[#D4AF37] text-[11px] tracking-widest uppercase mb-3">
              <Code2 className="w-4 h-4 text-[#D4AF37]" />
              <span>FRONT-END ENGINEERING STANDARDS</span>
            </div>

            <h3 className="font-playfair text-[28px] sm:text-[38px] text-white mb-4">
              Real Code. End-to-End Implementation.
            </h3>

            <p className="font-montserrat text-white/80 text-[14px] sm:text-[15px] leading-relaxed mb-6">
              This project represents a complete design-to-production delivery. 
              Northup Studio engineered the full responsive codebase with zero compromise on visual fidelity:
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px] text-white/90">
              <li className="flex items-center gap-2 bg-white/5 p-2.5 rounded-lg border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
                <span>Next.js 14 App Router + React 18</span>
              </li>
              <li className="flex items-center gap-2 bg-white/5 p-2.5 rounded-lg border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
                <span>Tailwind CSS Utility Architecture</span>
              </li>
              <li className="flex items-center gap-2 bg-white/5 p-2.5 rounded-lg border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
                <span>Framer Motion Physics &amp; Easing</span>
              </li>
              <li className="flex items-center gap-2 bg-white/5 p-2.5 rounded-lg border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
                <span>Lenis Inertial Kinetic Smooth Scrolling</span>
              </li>
              <li className="flex items-center gap-2 bg-white/5 p-2.5 rounded-lg border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
                <span>Sub-Second First Contentful Paint</span>
              </li>
              <li className="flex items-center gap-2 bg-white/5 p-2.5 rounded-lg border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
                <span>WAI-ARIA Accessibility Standards</span>
              </li>
            </ul>
          </div>
        </div>

      </section>

      {/* 
        ========================================================================
        SECTION 07 — SIGNATURE FEATURE: RESPONSIVE WEBSITE MARQUEE
        Continuous, seamless moving showcase of real mobile and tablet viewports
        ========================================================================
      */}
      <ArulisResponsiveMarquee />

      {/* 
        ========================================================================
        SECTION 08 — LIVE WEBSITE EXPERIENCE
        Central configuration driven via ARULIS_LIVE_URL constant
        ========================================================================
      */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 my-20 sm:my-28">
        <div className="p-8 sm:p-14 lg:p-16 rounded-[28px] sm:rounded-[36px] bg-white border border-black/10 shadow-lg relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            
            <div className="max-w-[700px]">
              <div className="inline-flex items-center gap-2 font-mono text-[#0F3D2E] text-[11px] sm:text-[12px] font-semibold tracking-widest uppercase mb-3 px-3.5 py-1 rounded-full bg-[#0F3D2E]/5 border border-[#0F3D2E]/15">
                <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>[ 06 · LIVE DEPLOYMENT ]</span>
              </div>

              <h2 className="font-playfair text-[32px] sm:text-[44px] text-[#1A1D1A] tracking-tight leading-tight mb-4">
                Experience the Digital Flagship
              </h2>

              <p className="font-montserrat text-[#4A5568] text-[14px] sm:text-[16px] leading-relaxed">
                Explore the responsive Arulis platform in real time. Interact with the fluid typography, the transparent treatment guide, and the one-touch booking engine directly on the web.
              </p>
            </div>

            {/* Live Link Button / Coming Soon Placeholder */}
            <div className="flex flex-col items-start md:items-end gap-3">
              {isLiveUrlValid ? (
                /* Active Live Website CTA */
                <a
                  href={ARULIS_LIVE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  className="px-8 py-4 rounded-full bg-[#0F3D2E] hover:bg-[#155440] text-white font-mono text-[13px] font-semibold tracking-wider uppercase transition-all duration-300 flex items-center gap-3 shadow-md hover:shadow-xl active:scale-95"
                >
                  <span>EXPLORE LIVE WEBSITE</span>
                  <ExternalLink className="w-4 h-4 text-[#D4AF37]" />
                </a>
              ) : (
                /* Tasteful Coming Soon Placeholder */
                <div className="inline-flex flex-col items-start md:items-end gap-2">
                  <div className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#1A1D1A]/5 border border-[#0F3D2E]/20 text-[#0F3D2E] font-mono text-[12px] font-semibold tracking-wider uppercase">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D4AF37]" />
                    </span>
                    <span>LIVE WEBSITE — COMING SOON</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#A0AEC0] tracking-wider">
                    PRODUCTION URL PENDING CLIENT LAUNCH
                  </span>
                </div>
              )}
            </div>

          </div>

          {/* Quick Preview Thumbnail Strip */}
          <div className="mt-10 pt-8 border-t border-black/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 font-mono text-[11px] text-[#718096]">
              <span className="w-2 h-2 rounded-full bg-[#0F3D2E]" />
              <span>Full Desktop Experience (1440px)</span>
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px] text-[#718096]">
              <span className="w-2 h-2 rounded-full bg-[#6B8F71]" />
              <span>Fluid Tablet Consultation UI (768px)</span>
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px] text-[#718096]">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              <span>Ergonomic Mobile Booking (375px)</span>
            </div>
          </div>

        </div>
      </section>

      {/* 
        ========================================================================
        SECTION 09 — FINAL PROJECT GALLERY: CURATED MULTI-DISCIPLINE EXHIBIT
        Combining the strongest assets from brand identity, collateral, and web
        ========================================================================
      */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
        
        {/* Gallery Header */}
        <div className="max-w-[800px] mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 font-mono text-[#0F3D2E] text-[11px] sm:text-[12px] font-semibold tracking-widest uppercase mb-3 px-3.5 py-1 rounded-full bg-[#0F3D2E]/5 border border-[#0F3D2E]/15">
            <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>[ 07 · CURATED PROJECT EXHIBITION ]</span>
          </div>
          <h2 className="font-playfair text-[32px] sm:text-[46px] lg:text-[54px] font-normal text-[#1A1D1A] tracking-tight leading-[1.08] mb-4">
            A Cohesive <span className="italic text-[#0F3D2E]">Ecosystem</span>
          </h2>
          <p className="font-montserrat text-[#4A5568] text-[15px] sm:text-[16px] leading-relaxed">
            The complete journey from raw mark exploration to architectural signage and the finished digital platform.
          </p>
        </div>

        {/* Asymmetrical Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Item 1: Doctor Staff Credential Badge (md:col-span-6) */}
          <div className="md:col-span-6 group relative rounded-3xl overflow-hidden bg-white border border-black/10 shadow-sm aspect-[4/3]">
            <img
              src="/assets/arulis/aurelis-badge-mockup.png"
              alt="Arulis Dental Clinic Doctor Badge Mockup"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#D4AF37]">CLINIC STAFF CREDENTIAL</span>
              <h3 className="font-playfair text-[20px] sm:text-[24px] mt-0.5">Dr. Riya Sharma Badge &amp; Lanyard</h3>
            </div>
          </div>

          {/* Item 2: Sustainable Clinic Bag (md:col-span-6) */}
          <div className="md:col-span-6 group relative rounded-3xl overflow-hidden bg-white border border-black/10 shadow-sm aspect-[4/3]">
            <img
              src="/assets/arulis/aurelis-bag.png"
              alt="Arulis Dental Branded Tote Bag"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#D4AF37]">PATIENT CARE PACKAGING</span>
              <h3 className="font-playfair text-[20px] sm:text-[24px] mt-0.5">Architectural Gift &amp; Aftercare Bag</h3>
            </div>
          </div>

          {/* Item 3: Appointment Cards on Cotton Paper (md:col-span-4) */}
          <div className="md:col-span-4 group relative rounded-3xl overflow-hidden bg-white border border-black/10 shadow-sm aspect-[4/3]">
            <img
              src="/assets/arulis/aurelis-appointment-cards.jpg"
              alt="Arulis Dental Appointment Cards"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#D4AF37]">STATIONERY</span>
              <h3 className="font-playfair text-[18px] sm:text-[20px] mt-0.5">Appointment Schedule Cards</h3>
            </div>
          </div>

          {/* Item 4: Primary Emblem Vector Lockup (md:col-span-4) */}
          <div className="md:col-span-4 group relative rounded-3xl overflow-hidden bg-[#0F3D2E] text-white border border-[#0F3D2E] shadow-sm aspect-[4/3] flex flex-col items-center justify-center p-8">
            <img
              src="/assets/arulis/aurelis-logo-primary.png"
              alt="Arulis Dental Primary Logo Vector"
              className="w-36 sm:w-44 h-auto object-contain transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <span className="font-mono text-[10px] tracking-widest text-[#D4AF37] uppercase mt-4">
              PRIMARY VECTOR EMBLEM
            </span>
          </div>

          {/* Item 5: Wave Pattern Geometry (md:col-span-4) */}
          <div className="md:col-span-4 group relative rounded-3xl overflow-hidden bg-white border border-black/10 shadow-sm aspect-[4/3] flex flex-col items-center justify-center p-8">
            <img
              src="/assets/arulis/aurelis-wave-pattern.png"
              alt="Arulis Wave Curve Pattern"
              className="w-48 sm:w-56 h-auto object-contain transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <span className="font-mono text-[10px] tracking-widest text-[#0F3D2E] uppercase mt-4">
              DYNAMIC WAVE PATTERN
            </span>
          </div>

        </div>

      </section>

      {/* 
        ========================================================================
        SECTION 10 — CLOSING EDITORIAL & NEXT PROJECT ROUTING
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

          <div className="relative z-10 max-w-[840px]">
            <div className="inline-flex items-center gap-2 font-mono text-[#FF8738] text-[11px] tracking-widest uppercase mb-4 px-3 py-1 rounded-full bg-[#FF4D0A]/10 border border-[#FF4D0A]/20">
              <Sparkles className="w-3 h-3 text-[#FF8738]" />
              <span>OUTCOME &amp; IMPACT · NORTHUP STUDIO</span>
            </div>

            <blockquote className="font-playfair text-[24px] sm:text-[34px] lg:text-[40px] italic font-normal text-white/95 leading-snug mb-8">
              "In clinical healthcare, trust is not merely communicated — it is felt at every touchpoint. For Arulis, we engineered a visual language where surgical excellence meets tactile serenity."
            </blockquote>

            <p className="font-montserrat text-white/70 text-[14px] sm:text-[15px] leading-relaxed mb-8 max-w-[680px]">
              From the initial heraldic sketch to the live responsive web architecture, Northup Studio partnered with Arulis Dental Clinic to deliver an enduring creative benchmark.
            </p>

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
