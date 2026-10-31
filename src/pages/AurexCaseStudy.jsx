import React, { useEffect, useState, useRef } from 'react'
import { motion, useReducedMotion, useInView, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  ArrowUpRight, 
  ExternalLink, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Layers, 
  Activity, 
  Zap, 
  Crosshair, 
  Compass, 
  Maximize2,
  Check,
  ChevronRight
} from 'lucide-react'
import Footer from '../components/Footer'

// ─────────────────────────────────────────────────────────────────────────────
// NORTHUP STUDIO — AUREX CASE STUDY
// Creative Direction: Raw Performance / Brutalist Athletic Editorial
// Palette: Obsidian #090A09 · Carbon #151715 · Acid Lime #C6FF00 · Chalk #F2F2EC · Graphite #30332E
// ─────────────────────────────────────────────────────────────────────────────

const AUREX_LIVE_URL = 'https://aurex-gym.vercel.app/'

// ─── Micro reveal wrapper ───────────────────────────────────────────────────
function RevealBlock({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Main Case Study Component ───────────────────────────────────────────────
export default function AurexCaseStudy({ onNavigate, onOpenContact }) {
  const shouldReduceMotion = useReducedMotion()
  const [marqueePaused, setMarqueePaused] = useState(false)
  const [activeTab, setActiveTab] = useState('hero')
  const [selectedSpec, setSelectedSpec] = useState(0)

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  // ── Marquee Multi-Device Track Items (Real Captured Breakpoints) ───────────
  const marqueeItems = [
    {
      id: 'm-desktop-1',
      type: 'desktop',
      label: 'DESKTOP · 1440PX',
      spec: 'HERO INTERFACE',
      image: '/assets/aurex/desktop-hero.png',
      width: 'w-[580px] sm:w-[680px] lg:w-[760px]',
      elevation: 'translate-y-0',
    },
    {
      id: 'm-mobile-1',
      type: 'mobile',
      label: 'MOBILE · 390PX',
      spec: 'DYNAMIC VIEWPORT',
      image: '/assets/aurex/mobile-hero.png',
      width: 'w-[200px] sm:w-[240px] lg:w-[270px]',
      elevation: '-translate-y-5 sm:-translate-y-8',
    },
    {
      id: 'm-tablet-1',
      type: 'tablet',
      label: 'TABLET · 768PX',
      spec: 'ADAPTIVE ROSTER',
      image: '/assets/aurex/tablet-view.png',
      width: 'w-[320px] sm:w-[380px] lg:w-[420px]',
      elevation: 'translate-y-4 sm:translate-y-6',
    },
    {
      id: 'm-desktop-2',
      type: 'desktop',
      label: 'DESKTOP · 1440PX',
      spec: 'PROGRAM MATRIX',
      image: '/assets/aurex/desktop-programs.png',
      width: 'w-[580px] sm:w-[680px] lg:w-[760px]',
      elevation: 'translate-y-1',
    },
    {
      id: 'm-mobile-2',
      type: 'mobile',
      label: 'MOBILE · 390PX',
      spec: 'ACTION TRIGGER',
      image: '/assets/aurex/mobile-detail.png',
      width: 'w-[200px] sm:w-[240px] lg:w-[270px]',
      elevation: 'translate-y-3 sm:translate-y-5',
    },
    {
      id: 'm-tablet-2',
      type: 'tablet',
      label: 'TABLET · 768PX',
      spec: 'FACILITY ARCHITECTURE',
      image: '/assets/aurex/tablet-detail.png',
      width: 'w-[320px] sm:w-[380px] lg:w-[420px]',
      elevation: '-translate-y-2',
    },
    {
      id: 'm-mobile-3',
      type: 'mobile',
      label: 'MOBILE · 390PX',
      spec: 'PROGRAM FEED',
      image: '/assets/aurex/mobile-programs.png',
      width: 'w-[200px] sm:w-[240px] lg:w-[270px]',
      elevation: 'translate-y-6',
    },
  ]

  // ── Detail Lab Items (Editorial Process Board) ──────────────────────────────
  const detailLabItems = [
    {
      index: '01',
      code: 'NAV // CHASSIS',
      title: 'High-Contrast Kinetic Navigation',
      description: 'Zero-clutter industrial header architecture with acid lime beacons, direct program routing, and brutalist uppercase typography.',
      image: '/assets/aurex/detail-nav.png',
      gridClass: 'lg:col-span-8',
      aspectClass: 'aspect-[16/7]',
      tag: 'INTERFACE CHASSIS',
    },
    {
      index: '02',
      code: 'TYPE // SYSTEM',
      title: 'Athletic Typographic Scale',
      description: 'Syne and Oswald display type paired with technical JetBrains Mono metadata for high-tension hierarchy.',
      image: '/assets/aurex/detail-type.png',
      gridClass: 'lg:col-span-4',
      aspectClass: 'aspect-[4/3] lg:aspect-auto lg:h-full',
      tag: 'KINETIC TYPE',
    },
    {
      index: '03',
      code: 'PROG // MATRIX',
      title: 'Discipline Training Grid',
      description: 'Structured program cards designed for instantaneous cognitive recognition across high-intensity training modalities.',
      image: '/assets/aurex/desktop-programs.png',
      gridClass: 'lg:col-span-5',
      aspectClass: 'aspect-[4/3]',
      tag: 'CURATED WORKLOAD',
    },
    {
      index: '04',
      code: 'SPACE // COLD',
      title: 'Spatial Facility Monograph',
      description: 'Cinematic low-key sports photography showcasing elite Olympic lifting platforms, recovery zones, and brutalist gym architecture.',
      image: '/assets/aurex/desktop-facility.png',
      gridClass: 'lg:col-span-7',
      aspectClass: 'aspect-[16/9]',
      tag: 'FACILITY ENV',
    },
    {
      index: '05',
      code: 'MEMBERSHIP // ACCESS',
      title: 'Performance Tiers & Commitment',
      description: 'Unapologetic, transparent membership architecture engineered with prominent acid lime action triggers.',
      image: '/assets/aurex/desktop-membership.png',
      gridClass: 'lg:col-span-12',
      aspectClass: 'aspect-[21/9]',
      tag: 'CONVERSION SYSTEM',
    },
  ]

  return (
    <div 
      data-cursor-theme="aurex"
      className="relative min-h-screen bg-[#090A09] text-[#F2F2EC] selection:bg-[#C6FF00] selection:text-[#090A09] overflow-x-hidden pt-20 sm:pt-28 select-none"
    >

      {/* 
        ========================================================================
        TOP BREADCRUMB & DIRECT ACCESS BAR
        ========================================================================
      */}
      <nav aria-label="Breadcrumb" className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 mb-8 sm:mb-12">
        <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-b border-white/10">
          
          {/* Back to featured work */}
          <button
            type="button"
            onClick={() => onNavigate('/#work')}
            data-cursor="hover"
            className="group inline-flex items-center gap-2 font-mono text-[11px] sm:text-[12px] font-semibold text-[#F2F2EC] hover:text-[#C6FF00] transition-colors py-1 px-3 border border-white/10 hover:border-[#C6FF00]/40 bg-[#151715]"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1 text-[#C6FF00]" />
            <span>BACK TO FEATURED WORK</span>
          </button>

          {/* Breadcrumb path & Direct Live Link pill */}
          <div className="flex items-center gap-3 sm:gap-4 font-mono text-[11px] sm:text-[12px]">
            <div className="hidden sm:flex items-center gap-2 text-white/40">
              <span>NORTHUP STUDIO</span>
              <span>/</span>
              <span className="text-[#C6FF00] font-bold">AUREX</span>
              <span>/</span>
              <span className="px-1.5 py-0.5 bg-[#C6FF00] text-[#090A09] font-bold text-[10px]">03 OF 06</span>
            </div>

            {/* Live Website Quick Pill */}
            <a
              href={AUREX_LIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Explore live AUREX website (opens in a new tab)"
              data-cursor="hover"
              className="group inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#151715] hover:bg-[#C6FF00] text-[#C6FF00] hover:text-[#090A09] border border-[#C6FF00]/30 hover:border-[#C6FF00] text-[11px] font-bold font-mono tracking-wider transition-all duration-200"
            >
              <span className="w-1.5 h-1.5 bg-[#C6FF00] group-hover:bg-[#090A09] animate-pulse" />
              <span>LIVE SITE ↗</span>
            </a>
          </div>

        </div>
      </nav>

      {/* 
        ========================================================================
        SECTION 01 — THE IMPACT
        Oversized Typographic Brutalism + Real Website Stage + Prominent Live CTA
        ========================================================================
      */}
      <header className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 mb-20 sm:mb-32">
        
        {/* Eyebrow and Metadata Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8 sm:mb-12 border-b border-white/10 pb-8 sm:pb-12">
          
          <div className="lg:col-span-8">
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 font-mono text-[11px] sm:text-[12px] text-[#C6FF00] uppercase tracking-widest font-bold mb-3 px-3 py-1 bg-[#151715] border border-[#C6FF00]/30"
            >
              <Crosshair className="w-3.5 h-3.5 text-[#C6FF00]" />
              <span>NORTHUP STUDIO / SELECTED WORK 03</span>
            </motion.div>

            {/* Giant Brutalist Project Name */}
            <motion.h1 
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-anton text-[70px] sm:text-[120px] md:text-[160px] lg:text-[210px] xl:text-[250px] font-normal text-[#F2F2EC] tracking-[-0.04em] leading-[0.82] uppercase mb-4"
            >
              AUREX
            </motion.h1>

            {/* Category */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="font-mono text-[13px] sm:text-[15px] text-[#C6FF00] uppercase tracking-[0.2em] font-bold mb-6"
            >
              PERFORMANCE CLUB / DIGITAL EXPERIENCE
            </motion.div>
          </div>

          {/* Project Metadata Specs Card */}
          <div className="lg:col-span-4 bg-[#151715] border border-white/10 p-6 sm:p-8 space-y-4 font-mono text-[11px] sm:text-[12px]">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-white/40 text-[10px] tracking-widest uppercase">
              <span>PROJECT CODE</span>
              <span className="text-[#C6FF00] font-bold">NS-03-ARX</span>
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="text-white/40 block text-[10px] tracking-wider uppercase">PROJECT</span>
                <span className="text-[#F2F2EC] font-bold text-[13px]">AUREX PERFORMANCE CLUB</span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px] tracking-wider uppercase">DISCIPLINE</span>
                <span className="text-[#F2F2EC] font-bold text-[13px]">WEBSITE DESIGN &amp; DEVELOPMENT</span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px] tracking-wider uppercase">STUDIO</span>
                <span className="text-[#C6FF00] font-bold text-[13px]">NORTHUP STUDIO</span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px] tracking-wider uppercase">DEPLOYMENT</span>
                <span className="text-[#F2F2EC] font-bold text-[13px]">VERCEL GLOBAL EDGE NETWORK</span>
              </div>
            </div>
          </div>

        </div>

        {/* Headline + Narrative + CRITICAL LIVE WEBSITE CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-end mb-12 sm:mb-16">
          
          <div className="lg:col-span-8 space-y-5">
            <motion.h2 
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-anton text-[34px] sm:text-[54px] lg:text-[68px] leading-[0.98] uppercase tracking-[-0.01em] text-[#F2F2EC]"
            >
              “BUILT BEYOND LIMITS.”
            </motion.h2>

            <motion.p
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.26 }}
              className="font-inter text-[16px] sm:text-[19px] text-white/70 max-w-[780px] leading-relaxed font-normal"
            >
              “A high-impact digital experience shaped around movement, discipline, and performance — engineered to make every interaction feel intentional.”
            </motion.p>
          </div>

          {/* CRITICAL LIVE WEBSITE CTA BUTTON */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-4 flex flex-col items-start lg:items-end gap-3"
          >
            <a
              href={AUREX_LIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Explore live AUREX website (opens in a new tab)"
              data-cursor="hover"
              className="group relative w-full sm:w-auto inline-flex items-center justify-between sm:justify-start gap-4 px-8 py-5 bg-[#C6FF00] hover:bg-[#d8ff33] text-[#090A09] font-mono text-[13px] sm:text-[14px] font-black tracking-widest uppercase shadow-[0_0_35px_rgba(198,255,0,0.3)] hover:shadow-[0_0_55px_rgba(198,255,0,0.5)] transition-all duration-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C6FF00] focus-visible:ring-offset-4 focus-visible:ring-offset-[#090A09]"
            >
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-[#090A09] animate-pulse" />
                <span>EXPLORE LIVE WEBSITE ↗</span>
              </div>
              <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 text-[#090A09]" />
            </a>

            <div className="font-mono text-[11px] text-white/40 tracking-tight">
              aurex-gym.vercel.app &middot; VERIFIED LIVE PRODUCTION
            </div>
          </motion.div>

        </div>

        {/* SECTION 01 HERO VISUAL STAGE: Genuine AUREX Website Presentation */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-[#151715] border border-[#C6FF00]/30 shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden"
        >
          {/* Technical Stage Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 bg-[#090A09] border-b border-white/10 font-mono text-[11px]">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-[#C6FF00]" />
              <span className="font-bold text-[#F2F2EC] tracking-wider uppercase">AUREX — ATHLETIC REPOSITORY</span>
              <span className="text-white/30 hidden sm:inline">&middot; 1440 × 900PX CANV</span>
            </div>

            <div className="flex items-center gap-3 text-white/50">
              <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-[10px]">HTTPS / TLS 1.3</span>
              <a 
                href={AUREX_LIVE_URL} 
                target="_blank" 
                rel="noopener noreferrer"
                data-cursor="hover"
                className="text-[#C6FF00] hover:underline flex items-center gap-1 font-bold"
              >
                <span>OPEN WINDOW</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Genuine Website Screen Image */}
          <div className="relative w-full aspect-[16/9] overflow-hidden bg-black">
            <img
              src="/assets/aurex/desktop-hero.png"
              alt="AUREX Performance Club Live Website Hero Composition"
              className="w-full h-full object-cover object-top"
              loading="eager"
            />
            {/* Fine Technical Gridlines */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#090A09]/80 via-transparent to-transparent pointer-events-none" />

            {/* Overlaid Editorial Watermark */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pointer-events-none">
              <div className="space-y-1">
                <span className="font-mono text-[10px] text-[#C6FF00] tracking-widest uppercase font-bold bg-[#090A09]/80 px-2.5 py-1 inline-block">
                  LIVE ARTIFACT // RUNTIME CAPTURE
                </span>
                <div className="font-anton text-[24px] sm:text-[36px] text-[#F2F2EC] uppercase tracking-wide drop-shadow-md">
                  STRENGTH &amp; PERFORMANCE TRAINING
                </div>
              </div>

              <div className="font-mono text-[11px] text-white/60 bg-[#090A09]/90 px-3 py-1.5 border border-white/10 pointer-events-auto">
                <span className="text-[#C6FF00] font-bold">100% VERIFIED</span> &middot; ZERO MOCKUP FABRICATION
              </div>
            </div>
          </div>
        </motion.div>

      </header>


      {/* 
        ========================================================================
        SECTION 02 — THE DIGITAL EXPERIENCE
        Cinematic Full-Width Presentation of the Actual AUREX Website
        Integrated oversized display with UI details & lime annotations
        ========================================================================
      */}
      <section className="relative py-20 sm:py-32 bg-[#151715] border-y border-white/10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
          
          {/* Section Header */}
          <RevealBlock className="mb-12 sm:mb-16">
            <div className="flex items-center gap-3 font-mono text-[11px] text-[#C6FF00] tracking-[0.25em] uppercase font-bold mb-3">
              <span className="px-2 py-0.5 bg-[#C6FF00] text-[#090A09]">02</span>
              <span>THE DIGITAL EXPERIENCE</span>
            </div>
            
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <h2 className="font-anton text-[42px] sm:text-[68px] lg:text-[88px] text-[#F2F2EC] uppercase leading-[0.92] tracking-[-0.02em]">
                “DESIGNED TO MOVE.”
              </h2>
              
              <p className="font-inter text-[15px] sm:text-[17px] text-white/60 max-w-[540px] leading-relaxed">
                An oversized digital stage capturing the tactile speed, dark obsidian atmosphere, and cinematic athletic rhythm of AUREX.
              </p>
            </div>
          </RevealBlock>

          {/* Cinematic Browser / Stage Composition */}
          <RevealBlock delay={0.15}>
            <div className="relative bg-[#090A09] border border-white/15 shadow-[0_30px_100px_rgba(0,0,0,0.95)]">
              
              {/* Browser Chassis Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 px-4 sm:px-6 py-3.5 bg-[#111311] border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-[#30332E]" />
                    <span className="w-3 h-3 bg-[#30332E]" />
                    <span className="w-3 h-3 bg-[#C6FF00]" />
                  </div>
                  <div className="font-mono text-[10px] text-white/50 pl-2 border-l border-white/10 uppercase tracking-widest">
                    AUREX DIGITAL APPARATUS
                  </div>
                </div>

                {/* Address Bar */}
                <a
                  href={AUREX_LIVE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  className="flex items-center gap-2 px-4 py-1.5 bg-black/60 border border-white/10 hover:border-[#C6FF00]/50 text-white/70 hover:text-[#C6FF00] transition-colors font-mono text-[11px]"
                >
                  <span className="w-1.5 h-1.5 bg-[#C6FF00] rounded-full animate-ping" />
                  <span>https://aurex-gym.vercel.app/</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {/* View Switcher Tabs */}
                <div className="flex items-center gap-1 font-mono text-[11px]">
                  {[
                    { id: 'hero', label: '01 / HERO STAGE' },
                    { id: 'programs', label: '02 / TRAINING MATRIX' },
                    { id: 'facility', label: '03 / SPATIAL' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      data-cursor="hover"
                      className={`px-3 py-1 font-bold tracking-wider uppercase transition-colors ${
                        activeTab === tab.id
                          ? 'bg-[#C6FF00] text-[#090A09]'
                          : 'bg-[#151715] text-white/50 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Viewport Canvas with Lime UI Annotations */}
              <div className="relative w-full aspect-[16/9] sm:aspect-[16/9.5] overflow-hidden bg-black group">
                <AnimatePresence mode="wait">
                  {activeTab === 'hero' && (
                    <motion.img
                      key="hero-img"
                      src="/assets/aurex/desktop-hero.png"
                      alt="AUREX Hero Digital Experience"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="w-full h-full object-cover object-top"
                    />
                  )}
                  {activeTab === 'programs' && (
                    <motion.img
                      key="prog-img"
                      src="/assets/aurex/desktop-programs.png"
                      alt="AUREX Training Programs"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="w-full h-full object-cover object-top"
                    />
                  )}
                  {activeTab === 'facility' && (
                    <motion.img
                      key="facility-img"
                      src="/assets/aurex/desktop-facility.png"
                      alt="AUREX Spatial Facility"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="w-full h-full object-cover object-top"
                    />
                  )}
                </AnimatePresence>

                {/* Subtle Interactive Lime Callout Annotations */}
                <div className="absolute top-6 left-6 hidden sm:flex items-center gap-2 bg-[#090A09]/90 border border-[#C6FF00]/40 px-3 py-1.5 font-mono text-[10px] text-[#C6FF00] tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 bg-[#C6FF00] animate-pulse" />
                  <span>ANNOTATION 01 // BRUTALIST RUNTIME</span>
                </div>

                <div className="absolute bottom-6 right-6 hidden sm:flex items-center gap-2 bg-[#090A09]/90 border border-[#C6FF00]/40 px-3 py-1.5 font-mono text-[10px] text-[#C6FF00] tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 bg-[#C6FF00] animate-pulse" />
                  <span>ANNOTATION 02 // 60FPS KINETIC ENGINE</span>
                </div>
              </div>

              {/* Technical Metadata Strip Beneath Stage */}
              <div className="p-4 sm:p-6 bg-[#111311] border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-[11px] text-white/50">
                <div>
                  <span className="text-white/30 block text-[9px] uppercase tracking-wider">FRAMEWORK</span>
                  <span className="text-[#F2F2EC] font-bold">React 18 + Vite 6</span>
                </div>
                <div>
                  <span className="text-white/30 block text-[9px] uppercase tracking-wider">COLOR TOKENS</span>
                  <span className="text-[#C6FF00] font-bold">Obsidian / Acid Lime</span>
                </div>
                <div>
                  <span className="text-white/30 block text-[9px] uppercase tracking-wider">TYPOGRAPHY</span>
                  <span className="text-[#F2F2EC] font-bold">Syne / Oswald / JB Mono</span>
                </div>
                <div>
                  <span className="text-white/30 block text-[9px] uppercase tracking-wider">INTERACTION</span>
                  <span className="text-[#C6FF00] font-bold">Kinetic Transitions</span>
                </div>
              </div>

            </div>
          </RevealBlock>

        </div>
      </section>


      {/* 
        ========================================================================
        SECTION 03 — THE DESIGN PHILOSOPHY
        Asymmetrical Split-Screen: Athletic Image & Tension vs Design Rationale
        ========================================================================
      */}
      <section className="relative py-20 sm:py-32 bg-[#090A09]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
          
          <RevealBlock className="mb-12 sm:mb-16">
            <div className="flex items-center gap-3 font-mono text-[11px] text-[#C6FF00] tracking-[0.25em] uppercase font-bold mb-3">
              <span className="px-2 py-0.5 bg-[#C6FF00] text-[#090A09]">03</span>
              <span>THE DESIGN PHILOSOPHY</span>
            </div>
            
            <h2 className="font-anton text-[42px] sm:text-[68px] lg:text-[88px] text-[#F2F2EC] uppercase leading-[0.92] tracking-[-0.02em]">
              “PRECISION IN EVERY PIXEL.”
            </h2>
          </RevealBlock>

          {/* Asymmetrical Split Screen Composition */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Side: Striking Athletic Imagery with Brutalist Cropping */}
            <RevealBlock className="lg:col-span-7 flex flex-col justify-between" delay={0.1}>
              <div className="relative h-full min-h-[460px] sm:min-h-[580px] bg-[#151715] border border-white/10 overflow-hidden group">
                <img
                  src="/assets/aurex/desktop-hero.png"
                  alt="AUREX Athletic Visual Tension"
                  className="w-full h-full object-cover object-center grayscale contrast-125 transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090A09] via-transparent to-black/30 pointer-events-none" />

                {/* Acid Lime Crosshair Overlay Elements */}
                <div className="absolute top-6 left-6 font-mono text-[10px] text-[#C6FF00] tracking-widest uppercase bg-[#090A09]/90 px-3 py-1 border border-[#C6FF00]/40">
                  FIG. 03.A // VISUAL TENSION
                </div>

                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between font-mono text-[11px]">
                  <div>
                    <span className="text-[#C6FF00] text-[48px] sm:text-[64px] font-anton leading-none block">
                      RAW
                    </span>
                    <span className="text-white/60 uppercase tracking-widest block">
                      HIGH-CONTRAST ATHLETIC MINIMALISM
                    </span>
                  </div>

                  <div className="text-right text-white/40 hidden sm:block">
                    <span>COORDINATE // 51.5074° N, 0.1278° W</span>
                  </div>
                </div>
              </div>
            </RevealBlock>

            {/* Right Side: Design Rationale & Verified Identity Specs */}
            <RevealBlock className="lg:col-span-5 flex flex-col justify-between space-y-6" delay={0.2}>
              
              {/* Exact Narrative block from prompt */}
              <div className="p-8 sm:p-10 bg-[#151715] border border-white/10 space-y-6">
                <span className="font-mono text-[10px] text-[#C6FF00] uppercase tracking-widest font-bold block">
                  DESIGN RATIONALE
                </span>

                <blockquote className="font-anton text-[26px] sm:text-[34px] leading-tight text-[#F2F2EC] uppercase tracking-tight">
                  “Every visual decision is designed to reinforce the same idea: performance is built through precision.”
                </blockquote>

                <p className="font-inter text-[15px] sm:text-[16px] text-white/70 leading-relaxed font-normal">
                  Strong hierarchy, purposeful contrast, and deliberate motion create an experience that feels direct, focused, and unmistakably AUREX.
                </p>

                <p className="font-inter text-[14px] text-white/50 leading-relaxed font-normal border-t border-white/10 pt-4">
                  Rejecting soft luxury gradients and pastel ornament, the identity relies on obsidian foundations, brutalist rectangular framing, and controlled acid lime focus points.
                </p>
              </div>

              {/* Real Design Tokens & Typographic Observations */}
              <div className="p-8 bg-[#111311] border border-white/10 space-y-5 font-mono text-[11px]">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-white/40 uppercase tracking-wider text-[10px]">VERIFIED PALETTE</span>
                  <span className="text-[#C6FF00] font-bold text-[10px]">05 COLOR CHANNELS</span>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {[
                    { name: 'Obsidian', hex: '#090A09', bg: 'bg-[#090A09]', border: 'border-white/20' },
                    { name: 'Carbon', hex: '#151715', bg: 'bg-[#151715]', border: 'border-white/15' },
                    { name: 'Acid Lime', hex: '#C6FF00', bg: 'bg-[#C6FF00]', border: 'border-transparent text-black' },
                    { name: 'Chalk', hex: '#F2F2EC', bg: 'bg-[#F2F2EC]', border: 'border-transparent text-black' },
                    { name: 'Graphite', hex: '#30332E', bg: 'bg-[#30332E]', border: 'border-white/15' },
                  ].map((color) => (
                    <div key={color.hex} className="space-y-1 text-center">
                      <div className={`h-12 w-full ${color.bg} ${color.border} border`} />
                      <span className="text-[9px] text-white/40 block truncate">{color.name}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-2 border-t border-white/10 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-white/40">PRIMARY DISPLAY</span>
                    <span className="text-[#F2F2EC] font-bold">Syne / Oswald Heavy</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/40">METADATA ENGINE</span>
                    <span className="text-[#C6FF00] font-bold">JetBrains Mono / IBM Plex</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/40">GRID ARCHITECTURE</span>
                    <span className="text-[#F2F2EC] font-bold">Sharp Rectangular Primitives</span>
                  </div>
                </div>

              </div>

            </RevealBlock>

          </div>

        </div>
      </section>


      {/* 
        ========================================================================
        SECTION 04 — RESPONSIVE IN MOTION
        Signature Moment: Continuous Horizontal Marquee of Real Device Screenshots
        Desktop, Tablet, Mobile with Staggered Heights and Controlled Pacing
        ========================================================================
      */}
      <section 
        id="responsive-in-motion" 
        className="relative py-24 sm:py-36 bg-[#111311] border-y border-white/10 overflow-hidden"
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 mb-12 sm:mb-16">
          
          <RevealBlock>
            <div className="flex items-center gap-3 font-mono text-[11px] text-[#C6FF00] tracking-[0.25em] uppercase font-bold mb-3">
              <span className="px-2 py-0.5 bg-[#C6FF00] text-[#090A09]">04</span>
              <span>RESPONSIVE IN MOTION</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <h2 className="font-anton text-[42px] sm:text-[68px] lg:text-[88px] text-[#F2F2EC] uppercase leading-[0.92] tracking-[-0.02em]">
                  “ONE EXPERIENCE.<br className="hidden sm:inline" /> EVERY SCREEN.”
                </h2>
              </div>

              {/* Status and Pause control info */}
              <div className="flex items-center gap-3 font-mono text-[11px] text-white/50 self-start lg:self-end">
                <span className="flex items-center gap-2 px-3.5 py-1.5 bg-[#151715] border border-white/10">
                  <span className={`w-2 h-2 ${marqueePaused ? 'bg-amber-400' : 'bg-[#C6FF00] animate-pulse'}`} />
                  <span>{marqueePaused ? 'MARQUEE PAUSED' : 'CONTINUOUS HORIZONTAL RUNTIME'}</span>
                </span>
                <span className="hidden sm:inline text-white/30">&middot; HOVER TO PAUSE</span>
              </div>
            </div>
          </RevealBlock>

        </div>

        {/* 
          CONTINUOUS RESPONSIVE MARQUEE TRACK
          Seamless Infinite Loop with 2 Sets of Genuine Mockup Devices
        */}
        <div
          className="relative w-full overflow-hidden py-8"
          onMouseEnter={() => setMarqueePaused(true)}
          onMouseLeave={() => setMarqueePaused(false)}
          onFocus={() => setMarqueePaused(true)}
          onBlur={() => setMarqueePaused(false)}
        >
          {shouldReduceMotion ? (
            /* Reduced Motion Fallback: Accessible Horizontal Track */
            <div className="flex items-end gap-8 overflow-x-auto px-6 py-4 no-scrollbar">
              {marqueeItems.map((item, idx) => (
                <div key={`static-${idx}`} className="flex-shrink-0">
                  <AurexDeviceMockup item={item} />
                </div>
              ))}
            </div>
          ) : (
            /* Animated Infinite Loop */
            <div
              className="flex items-end gap-8 sm:gap-12 w-max"
              style={{
                animation: 'aurexMarquee 50s linear infinite',
                animationPlayState: marqueePaused ? 'paused' : 'running',
              }}
            >
              {/* Set 1 */}
              {marqueeItems.map((item, idx) => (
                <div key={`m1-${idx}`} className="flex-shrink-0">
                  <AurexDeviceMockup item={item} />
                </div>
              ))}

              {/* Set 2 (Identical Duplicate for Seamless Infinite Loop) */}
              {marqueeItems.map((item, idx) => (
                <div key={`m2-${idx}`} className="flex-shrink-0" aria-hidden="true">
                  <AurexDeviceMockup item={item} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Marquee Footer Subtext & Verified Breakpoints */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 mt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-[11px] text-white/40">
          <div className="flex items-center gap-2">
            <span className="text-[#C6FF00] font-bold">VERIFIED BREAKPOINTS:</span>
            <span>Desktop (1440px) &middot; Tablet (768px) &middot; Mobile (390px)</span>
          </div>

          <a
            href={AUREX_LIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="inline-flex items-center gap-1.5 text-[#C6FF00] hover:underline font-bold transition-colors"
          >
            <span>TEST LIVE RESPONSIVENESS IN NEW TAB</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </section>


      {/* 
        ========================================================================
        SECTION 05 — THE DETAIL LAB
        Experimental Visual Collage Inspired by an Editorial Design Process Board
        Mixture of wide, narrow, cropped, and annotated interface artifacts
        ========================================================================
      */}
      <section className="relative py-20 sm:py-32 bg-[#090A09]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
          
          <RevealBlock className="mb-12 sm:mb-16">
            <div className="flex items-center gap-3 font-mono text-[11px] text-[#C6FF00] tracking-[0.25em] uppercase font-bold mb-3">
              <span className="px-2 py-0.5 bg-[#C6FF00] text-[#090A09]">05</span>
              <span>THE DETAIL LAB</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <h2 className="font-anton text-[42px] sm:text-[68px] lg:text-[88px] text-[#F2F2EC] uppercase leading-[0.92] tracking-[-0.02em]">
                “BUILT IN THE DETAILS.”
              </h2>

              <p className="font-inter text-[15px] sm:text-[17px] text-white/60 max-w-[540px] leading-relaxed">
                An editorial dissection of genuine UI modules, technical navigation nodes, and athletic image compositions.
              </p>
            </div>
          </RevealBlock>

          {/* Asymmetrical Editorial Collage Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
            {detailLabItems.map((item, idx) => (
              <RevealBlock 
                key={item.index} 
                className={`${item.gridClass} flex flex-col justify-between`}
                delay={idx * 0.08}
              >
                <div className="group relative bg-[#151715] border border-white/10 hover:border-[#C6FF00]/40 transition-all duration-300 flex flex-col justify-between h-full overflow-hidden">
                  
                  {/* Top Technical Metadata Banner */}
                  <div className="p-3.5 sm:p-4 bg-[#111311] border-b border-white/10 flex items-center justify-between font-mono text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="text-[#C6FF00] font-bold">{item.index}</span>
                      <span className="text-white/40">/</span>
                      <span className="text-[#F2F2EC] font-bold">{item.code}</span>
                    </div>

                    <span className="px-2 py-0.5 bg-white/5 text-white/50 text-[10px] tracking-wider uppercase font-semibold">
                      {item.tag}
                    </span>
                  </div>

                  {/* Image Viewport */}
                  <div className={`relative ${item.aspectClass} overflow-hidden bg-black flex-1`}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090A09]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>

                  {/* Caption & Annotation */}
                  <div className="p-5 sm:p-6 bg-[#151715] border-t border-white/10 space-y-2">
                    <h3 className="font-anton text-[20px] sm:text-[24px] text-[#F2F2EC] uppercase tracking-wide">
                      {item.title}
                    </h3>
                    <p className="font-inter text-[13px] sm:text-[14px] text-white/60 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>

                </div>
              </RevealBlock>
            ))}
          </div>

        </div>
      </section>


      {/* 
        ========================================================================
        SECTION 06 — THE FINAL REP
        Bold Closing Screen with Oversized Typography & Primary Live CTA
        ========================================================================
      */}
      <section className="relative py-24 sm:py-36 lg:py-48 bg-[#090A09] border-t border-white/10 overflow-hidden">
        
        {/* Acid Lime Ambient Field */}
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(ellipse at center bottom, #C6FF00 0%, transparent 70%)'
          }}
        />

        <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 text-center space-y-8 sm:space-y-12">
          
          <RevealBlock>
            <div className="inline-flex items-center gap-2 font-mono text-[11px] text-[#C6FF00] tracking-[0.3em] uppercase font-bold mb-6 px-3.5 py-1 bg-[#151715] border border-[#C6FF00]/30">
              <Zap className="w-3.5 h-3.5 text-[#C6FF00]" />
              <span>06 / THE FINAL REP</span>
            </div>

            {/* Giant Headline from Prompt */}
            <h2 className="font-anton text-[48px] sm:text-[80px] md:text-[110px] lg:text-[140px] xl:text-[170px] font-normal text-[#F2F2EC] uppercase tracking-[-0.03em] leading-[0.84] mb-6">
              YOUR NEXT LEVEL<br />
              <span className="text-[#C6FF00]">STARTS HERE.</span>
            </h2>

            {/* Supporting Line */}
            <p className="font-inter text-[17px] sm:text-[22px] text-white/60 max-w-[700px] mx-auto leading-relaxed mb-10 font-normal">
              “Explore the digital experience created by NORTHUP STUDIO.”
            </p>

            {/* Primary Final CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <a
                href={AUREX_LIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit AUREX live website (opens in a new tab)"
                data-cursor="hover"
                className="group relative inline-flex items-center justify-center gap-4 px-12 sm:px-16 py-6 bg-[#C6FF00] hover:bg-[#d8ff33] text-[#090A09] font-mono text-[14px] sm:text-[16px] font-black tracking-widest uppercase shadow-[0_0_50px_rgba(198,255,0,0.35)] hover:shadow-[0_0_80px_rgba(198,255,0,0.6)] transition-all duration-300 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C6FF00]"
              >
                <span>VISIT AUREX ↗</span>
                <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 text-[#090A09]" />
              </a>
            </div>
          </RevealBlock>

          {/* Navigation Links Back to Work & Other Projects */}
          <RevealBlock delay={0.15}>
            <div className="pt-12 sm:pt-16 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 font-mono text-[11px] font-bold">
              
              <button
                type="button"
                onClick={() => onNavigate('/#work')}
                data-cursor="hover"
                className="px-6 py-3.5 bg-[#151715] hover:bg-white text-white hover:text-black border border-white/15 uppercase tracking-wider transition-all"
              >
                &larr; BACK TO FEATURED WORK
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/work/atelier-estates')}
                data-cursor="hover"
                className="px-6 py-3.5 bg-[#151715] hover:bg-[#9B5D3E] text-white hover:text-white border border-white/15 uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <span>NEXT: ATELIER ESTATES</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/work/maison-de-sucre')}
                data-cursor="hover"
                className="px-6 py-3.5 bg-[#151715] hover:bg-[#B87F83] text-white hover:text-white border border-white/15 uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <span>MAISON DE SUCRE</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/work/arulis-dental-clinic')}
                data-cursor="hover"
                className="px-6 py-3.5 bg-[#151715] hover:bg-[#0F3D2E] text-white hover:text-white border border-white/15 uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <span>ARULIS DENTAL</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onOpenContact('Project Inquiry: Inspired by AUREX')}
                data-cursor="hover"
                className="px-6 py-3.5 bg-[#C6FF00]/10 hover:bg-[#C6FF00] text-[#C6FF00] hover:text-[#090A09] border border-[#C6FF00]/40 uppercase tracking-wider transition-all"
              >
                COMMISSION WORK
              </button>

            </div>
          </RevealBlock>

        </div>
      </section>

      {/* 
        ========================================================================
        SHARED NORTHUP STUDIO FOOTER
        ========================================================================
      */}
      <Footer onOpenContact={onOpenContact} />

      {/* Marquee Animation CSS Keyframe */}
      <style>{`
        @keyframes aurexMarquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>

    </div>
  )
}

/**
 * Helper Sub-Component: Industrial Device Mockup Chassis for Marquee
 */
function AurexDeviceMockup({ item }) {
  if (item.type === 'desktop') {
    return (
      <div className={`relative ${item.width} ${item.elevation} transition-transform duration-300 hover:scale-[1.01] group`}>
        <div className="w-full bg-[#151715] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-[#0d0e0d] border-b border-white/10 font-mono text-[9px] sm:text-[10px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#30332E]" />
              <span className="w-2 h-2 bg-[#30332E]" />
              <span className="w-2 h-2 bg-[#C6FF00]" />
            </div>

            <span className="text-white/40 tracking-wider">aurex-gym.vercel.app</span>
            <span className="text-[#C6FF00] font-bold">1440PX</span>
          </div>

          {/* Screenshot */}
          <div className="relative w-full aspect-[16/10] overflow-hidden bg-black">
            <img
              src={item.image}
              alt={item.label}
              className="w-full h-full object-cover object-top"
              loading="lazy"
            />
          </div>
        </div>

        {/* Caption */}
        <div className="mt-3 flex items-center justify-between font-mono text-[10px]">
          <span className="text-[#C6FF00] font-bold tracking-wider">{item.label}</span>
          <span className="text-white/40 uppercase">{item.spec}</span>
        </div>
      </div>
    )
  }

  if (item.type === 'tablet') {
    return (
      <div className={`relative ${item.width} ${item.elevation} transition-transform duration-300 hover:scale-[1.015] group`}>
        <div className="w-full bg-[#151715] p-2 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col">
          {/* Bezel indicator */}
          <div className="w-2 h-2 bg-[#30332E] mx-auto mb-1.5" />

          {/* Screenshot */}
          <div className="relative w-full aspect-[3/4] overflow-hidden bg-black">
            <img
              src={item.image}
              alt={item.label}
              className="w-full h-full object-cover object-top"
              loading="lazy"
            />
          </div>
        </div>

        {/* Caption */}
        <div className="mt-3 flex items-center justify-between font-mono text-[10px]">
          <span className="text-[#C6FF00] font-bold tracking-wider">{item.label}</span>
          <span className="text-white/40 uppercase">{item.spec}</span>
        </div>
      </div>
    )
  }

  // Smartphone
  return (
    <div className={`relative ${item.width} ${item.elevation} transition-transform duration-300 hover:scale-[1.02] group`}>
      <div className="w-full bg-[#151715] p-2 border-2 border-[#30332E] shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col">
        {/* Dynamic Notch */}
        <div className="w-12 h-2 bg-black mx-auto mb-1" />

        {/* Screenshot */}
        <div className="relative w-full aspect-[9/19.5] overflow-hidden bg-black">
          <img
            src={item.image}
            alt={item.label}
            className="w-full h-full object-cover object-top"
            loading="lazy"
          />
        </div>
      </div>

      {/* Caption */}
      <div className="mt-3 flex items-center justify-between font-mono text-[10px]">
        <span className="text-[#C6FF00] font-bold tracking-wider">{item.label}</span>
        <span className="text-white/40 uppercase">{item.spec}</span>
      </div>
    </div>
  )
}
