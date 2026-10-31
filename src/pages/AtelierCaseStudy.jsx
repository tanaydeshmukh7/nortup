import React, { useEffect, useState, useRef } from 'react'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  ArrowUpRight, 
  Sparkles, 
  Menu, 
  X, 
  CheckCircle2, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink, 
  Send, 
  Layers, 
  Compass, 
  Monitor, 
  Smartphone,
  ChevronDown,
  Building2,
  Clock,
  Lock,
  Globe,
  RefreshCw,
  Eye,
  Maximize2
} from 'lucide-react'
import Footer from '../components/Footer'

// Centralized Live Project URL (Single Source of Truth)
const ATELIER_LIVE_URL = 'https://atelier-estates-alpha.vercel.app/'

export default function AtelierCaseStudy({ onNavigate, onOpenContact }) {
  const shouldReduceMotion = useReducedMotion()
  
  // Navigation drawer state
  const [menuOpen, setMenuOpen] = useState(false)
  
  // Active material study layer
  const [activeMaterial, setActiveMaterial] = useState('travertine')

  // Website preview mode: 'interactive' (live iframe) or 'studio' (5K visual render)
  const [previewMode, setPreviewMode] = useState('interactive')
  const [iframeKey, setIframeKey] = useState(0)
  const [iframeLoading, setIframeLoading] = useState(true)

  // Advisory form state
  const [formState, setFormState] = useState({
    fullName: '',
    email: '',
    phone: '',
    enquiryType: 'General advisory enquiry',
    message: ''
  })
  const [formSubmitted, setFormSubmitted] = useState(false)

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  // Material Study Layers data (Matching Figma Screen 2/3)
  const materialLayers = [
    {
      id: 'travertine',
      name: '01 / Honed Travertine',
      origin: 'Tivoli Quarry, Rome',
      desc: 'Monolithic slabs with unfilled pores, reflecting warm low-sun angular illumination.',
      colorClass: 'bg-[#D8CDBC]',
    },
    {
      id: 'timber',
      name: '02 / Vertical Cedar Louvers',
      origin: 'Western Red Cedar, Kiln-Dried',
      desc: 'Precision brise-soleil battens providing solar mitigation and filtered privacy.',
      colorClass: 'bg-[#9C603D]',
    },
    {
      id: 'glazing',
      name: '03 / Low-Iron Glass',
      origin: 'Saint-Gobain Acoustic Laminate',
      desc: 'Optically clear structural glass walls dissolving the threshold between interior and water.',
      colorClass: 'bg-[#899B99]',
    },
    {
      id: 'water',
      name: '04 / Reflection Pool',
      origin: 'Natural Basalt Basin',
      desc: 'Calm surface water cooling ambient courtyard temperatures and animating ceiling planes.',
      colorClass: 'bg-[#3A5D6B]',
    },
  ]

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormState(prev => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (!formState.fullName || !formState.email) return
    setFormSubmitted(true)
    setTimeout(() => {
      setFormSubmitted(false)
      setFormState({
        fullName: '',
        email: '',
        phone: '',
        enquiryType: 'General advisory enquiry',
        message: ''
      })
    }, 4500)
  }

  const scrollToAdvisory = () => {
    setMenuOpen(false)
    const el = document.getElementById('advisory-desk')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const reloadIframe = () => {
    setIframeLoading(true)
    setIframeKey(prev => prev + 1)
  }

  return (
    <div 
      data-cursor-theme="atelier"
      className="relative min-h-screen bg-[#F6F2EA] text-[#1E1B18] overflow-x-hidden pt-20 sm:pt-28 select-none"
    >
      
      {/* 
        ========================================================================
        TOP BREADCRUMB & DIRECT LIVE SITE BAR
        ========================================================================
      */}
      <nav aria-label="Breadcrumb" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-b border-black/10">
          
          {/* Back to work */}
          <button
            type="button"
            onClick={() => onNavigate('/#work')}
            data-cursor="hover"
            className="group inline-flex items-center gap-2 font-mono text-[12px] sm:text-[13px] font-semibold text-[#1E1B18] hover:text-[#9B5D3E] transition-colors py-1 px-3 rounded-full hover:bg-black/5"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1 text-[#9B5D3E]" />
            <span>BACK TO FEATURED WORK</span>
          </button>

          {/* Breadcrumb path & Direct Live Link pill */}
          <div className="flex items-center gap-3 sm:gap-4 font-mono text-[11px] sm:text-[12px]">
            <div className="hidden sm:flex items-center gap-2 text-[#718096]">
              <span>NORTHUP STUDIO</span>
              <span>&middot;</span>
              <span className="text-[#9B5D3E] font-semibold">ATELIER ESTATES</span>
              <span>&middot;</span>
              <span className="px-2 py-0.5 rounded-full bg-[#9B5D3E]/10 text-[#9B5D3E] font-bold">01 / 06</span>
            </div>

            {/* Quick Live Website Pill */}
            <a
              href={ATELIER_LIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Explore live Atelier Estates website (opens in a new tab)"
              data-cursor="hover"
              className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1E1B18] hover:bg-[#9B5D3E] text-[#F6F2EA] text-[11px] font-bold tracking-wider transition-all duration-200 shadow-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <span>LIVE SITE</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#D8CDBC] group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

        </div>
      </nav>

      {/* 
        ========================================================================
        SECTION 01 — THE FLAGSHIP CINEMATIC HERO: ATELIER ESTATES
        Includes High-Priority Primary Live Website CTA in Initial Viewport
        ========================================================================
      */}
      <header className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24">
        
        {/* Editorial Eyebrow & Hero Title */}
        <div className="max-w-[1100px] mb-8 sm:mb-12">
          
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 font-mono text-[#9B5D3E] text-[11px] sm:text-[12px] font-semibold tracking-widest uppercase mb-4 px-3.5 py-1.5 rounded-full bg-[#9B5D3E]/10 border border-[#9B5D3E]/20"
          >
            <Building2 className="w-3.5 h-3.5 text-[#9B5D3E]" />
            <span>WEBSITE DESIGN &amp; DEVELOPMENT · ARCHITECTURAL RESIDENCES</span>
          </motion.div>

          <motion.h1 
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-playfair text-[44px] sm:text-[68px] lg:text-[88px] font-normal text-[#1E1B18] tracking-tight leading-[0.96] mb-5"
          >
            Atelier <span className="italic font-normal text-[#9B5D3E]">Estates</span>
          </motion.h1>

          <motion.p
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="font-playfair text-[20px] sm:text-[28px] lg:text-[34px] italic text-[#554D47] max-w-[860px] leading-snug mb-5"
          >
            "Find a place that feels like yours."
          </motion.p>

          <motion.p
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="font-montserrat text-[#554D47] text-[15px] sm:text-[18px] leading-relaxed max-w-[820px] mb-8"
          >
            A considered digital collection of homes shaped by light, material, and landscape. 
            Northup Studio crafted Atelier Estates as an architectural monograph in motion — marrying bespoke editorial typography with private advisory infrastructure across Mayfair, Enge, and Chelsea.
          </motion.p>

          {/* 
            ====================================================================
            PROMINENT PRIMARY LIVE WEBSITE CTA BLOCK (INITIAL VIEWPORT)
            - Exact CTA text: EXPLORE LIVE WEBSITE ↗
            - Supporting microcopy: “Experience the project in its entirety.”
            - Working link: https://atelier-estates-alpha.vercel.app/
            - target="_blank" rel="noopener noreferrer"
            ====================================================================
          */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="pt-2 pb-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 flex-wrap">
              
              {/* Distinctive Outlined/High-Contrast Button */}
              <a
                href={ATELIER_LIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Explore live Atelier Estates website (opens in a new tab)"
                data-cursor="hover"
                className="group relative inline-flex items-center justify-between sm:justify-start gap-4 px-8 py-4 sm:py-4.5 rounded-full bg-[#1E1B18] text-[#F6F2EA] hover:bg-[#9B5D3E] shadow-[0_12px_32px_rgba(30,27,24,0.22)] hover:shadow-[0_16px_40px_rgba(155,93,62,0.35)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9B5D3E] focus-visible:ring-offset-2 active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  {/* Live pulsating green beacon */}
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]"></span>
                  </span>
                  
                  {/* Exact CTA Text */}
                  <span className="font-mono text-[12px] sm:text-[13px] font-bold tracking-widest uppercase text-white">
                    EXPLORE LIVE WEBSITE ↗
                  </span>
                </div>

                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 text-[#D8CDBC] group-hover:text-white" />
              </a>

              {/* Supporting Microcopy */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-[#718096] font-mono text-[11px] sm:text-[12px]">
                <span className="italic text-[#554D47] font-medium">“Experience the project in its entirety.”</span>
                <span className="hidden sm:inline text-black/25">&middot;</span>
                <span className="text-[#9B5D3E] font-medium tracking-tight">atelier-estates-alpha.vercel.app</span>
              </div>

            </div>
          </motion.div>

        </div>

        {/* 
          ======================================================================
          DUAL-MODE WEBSITE PREVIEW CHASSIS
          Mode 1: Interactive Live Embedded Website (Real Next.js app via iframe)
          Mode 2: 5K Studio iMac Capture (Monograph render)
          ======================================================================
        */}
        <motion.div
          id="hero-preview"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.32, ease: "easeOut" }}
          className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden bg-[#181615] border border-black/15 shadow-[0_24px_70px_rgba(26,23,21,0.22)] flex flex-col"
        >
          
          {/* Top Browser Chassis Chrome */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-[#23201D] border-b border-white/10 z-20">
            
            {/* macOS Style Window Dots & Live Status */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#E06C75]/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#E5C07B]/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#98C379]/80 inline-block" />
              </div>

              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-white/10">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="font-mono text-[10px] text-white/70 uppercase tracking-widest font-semibold">
                  VERCEL EDGE
                </span>
              </div>
            </div>

            {/* Browser Address Bar Pill (Opens Live Site Directly) */}
            <a
              href={ATELIER_LIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open atelier-estates-alpha.vercel.app in new window"
              data-cursor="hover"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 hover:border-white/20 text-[#D8CDBC] hover:text-white transition-all text-[11px] font-mono group"
            >
              <Lock className="w-3 h-3 text-[#10B981]" />
              <span className="tracking-tight">https://atelier-estates-alpha.vercel.app/</span>
              <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
            </a>

            {/* Mode Switcher & Direct Controls */}
            <div className="flex items-center gap-2">
              
              {/* Mode Toggle Buttons */}
              <div className="flex items-center bg-black/50 p-1 rounded-full border border-white/10 text-[10px] font-mono">
                <button
                  type="button"
                  onClick={() => setPreviewMode('interactive')}
                  className={`px-3 py-1 rounded-full font-semibold transition-all ${
                    previewMode === 'interactive'
                      ? 'bg-[#9B5D3E] text-white shadow-sm'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  LIVE PREVIEW
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('studio')}
                  className={`px-3 py-1 rounded-full font-semibold transition-all ${
                    previewMode === 'studio'
                      ? 'bg-[#9B5D3E] text-white shadow-sm'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  STUDIO RENDER
                </button>
              </div>

              {/* Refresh / Menu Drawer Action */}
              {previewMode === 'interactive' ? (
                <button
                  type="button"
                  onClick={reloadIframe}
                  title="Reload Live View"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setMenuOpen(true)}
                  data-cursor="hover"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-mono text-[10px] font-semibold tracking-wider uppercase transition-colors"
                >
                  <Menu className="w-3.5 h-3.5 text-[#D8CDBC]" />
                  <span className="hidden sm:inline">DRAWER</span>
                </button>
              )}

            </div>

          </div>

          {/* Preview Viewport Canvas */}
          <div className="relative w-full bg-[#12100F] min-h-[500px] sm:min-h-[660px] lg:min-h-[760px] flex items-center justify-center overflow-hidden">
            
            {previewMode === 'interactive' ? (
              /* REAL INTERACTIVE EMBEDDED IFRAME */
              <div className="relative w-full h-[520px] sm:h-[680px] lg:h-[780px] bg-white">
                
                {iframeLoading && (
                  <div className="absolute inset-0 bg-[#171514] flex flex-col items-center justify-center text-white z-10 space-y-3">
                    <div className="w-8 h-8 rounded-full border-2 border-[#9B5D3E] border-t-transparent animate-spin" />
                    <p className="font-mono text-[11px] text-[#D8CDBC] tracking-widest uppercase">
                      CONNECTING TO ATELIER ESTATES LIVE...
                    </p>
                  </div>
                )}

                <iframe
                  key={iframeKey}
                  src={ATELIER_LIVE_URL}
                  title="Atelier Estates Live Project Website"
                  onLoad={() => setIframeLoading(false)}
                  className="w-full h-full border-0"
                  loading="lazy"
                />

                {/* Subtle Interactive Instruction Bar */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none hidden sm:flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-white font-mono text-[10px] tracking-wider uppercase shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  <span>INTERACTIVE WINDOW · SCROLL &amp; EXPLORE FREELY</span>
                </div>
              </div>
            ) : (
              /* HIGH-RESOLUTION 5K STUDIO RENDER */
              <div className="relative w-full h-full">
                <img
                  src="/assets/atelier.jpg"
                  alt="Atelier Estates Flagship Digital Experience on iMac"
                  className="w-full h-auto object-cover max-h-[820px]"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />

                {/* Interactive Menu Trigger Overlay */}
                <div className="absolute top-4 sm:top-8 left-4 sm:left-8 right-4 sm:right-8 flex items-center justify-between text-white z-10">
                  <span className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[#D8CDBC]">
                    5K MONOGRAPH ARCHIVE
                  </span>

                  <button
                    type="button"
                    onClick={() => setMenuOpen(true)}
                    data-cursor="hover"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white font-mono text-[11px] font-semibold tracking-wider uppercase transition-all duration-200"
                  >
                    <Menu className="w-4 h-4 text-[#D8CDBC]" />
                    <span>PREVIEW DRAWER</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Chassis HUD Bar with Direct CTA */}
          <div className="px-5 sm:px-8 py-4 sm:py-5 bg-[#1F1C1A] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white z-10">
            <div>
              <div className="inline-flex items-center gap-2 text-[#D8CDBC] font-mono text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                <span>ATELIER ESTATES / NORTHUP STUDIO PRODUCTION</span>
              </div>
              <h3 className="font-playfair text-[20px] sm:text-[24px] leading-tight text-white">
                Find a place that feels like yours.
              </h3>
            </div>

            {/* Quick Action Button to open in new tab */}
            <div className="flex items-center gap-4">
              <a
                href={ATELIER_LIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open live website in full window"
                data-cursor="hover"
                className="group inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-[#9B5D3E] hover:bg-[#B36E49] text-white font-mono text-[11px] sm:text-[12px] font-bold tracking-wider uppercase transition-all shadow-md active:scale-95"
              >
                <span>OPEN FULL WINDOW</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>

        </motion.div>

      </header>

      {/* 
        ========================================================================
        INTERACTIVE NAVIGATION DRAWER MODAL (MATCHING FIGMA SCREENSHOT 210250)
        ========================================================================
      */}
      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-[99999] flex justify-end select-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Slide-over Drawer (Matching Screenshot 2026-10-31 210250.png) */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 240 }}
              className="relative w-full max-w-[420px] h-full bg-[#F6F2EA] border-l border-black/10 shadow-2xl flex flex-col justify-between p-6 sm:p-8 z-10 overflow-y-auto"
            >
              <div>
                {/* Drawer Top Bar */}
                <div className="flex items-center justify-between pb-6 border-b border-black/10">
                  <div>
                    <h3 className="font-playfair text-[20px] font-normal text-[#1E1B18]">
                      Atelier Estates
                    </h3>
                    <div className="font-mono text-[10px] text-[#718096] uppercase tracking-widest">
                      NORTHUP STUDIO
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    data-cursor="hover"
                    className="w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#1E1B18] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Nav Links (01 Properties, 02 Architecture, 03 About, 04 Contact) */}
                <nav className="divide-y divide-black/10 my-6">
                  {[
                    { num: '01', title: 'Properties', target: '#hero-preview' },
                    { num: '02', title: 'Architecture', target: '#material-study' },
                    { num: '03', title: 'About', target: '#point-of-view' },
                    { num: '04', title: 'Contact', target: '#advisory-desk' },
                  ].map((item) => (
                    <a
                      key={item.num}
                      href={item.target}
                      onClick={(e) => {
                        e.preventDefault()
                        setMenuOpen(false)
                        const el = document.querySelector(item.target)
                        if (el) el.scrollIntoView({ behavior: 'smooth' })
                      }}
                      data-cursor="hover"
                      className="group py-4 flex items-center justify-between text-[#1E1B18] hover:text-[#9B5D3E] transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-[12px] text-[#A0AEC0] group-hover:text-[#9B5D3E]">
                          {item.num}
                        </span>
                        <span className="font-playfair text-[24px] font-normal">
                          {item.title}
                        </span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-[#A0AEC0] group-hover:text-[#9B5D3E] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  ))}
                </nav>

                {/* Direct Live Website Link Inside Drawer */}
                <div className="p-4 rounded-2xl bg-white border border-black/10 shadow-sm mb-4">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#9B5D3E] font-bold block mb-1">
                    PRODUCTION LINK
                  </span>
                  <a
                    href={ATELIER_LIVE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="hover"
                    className="font-mono text-[12px] font-semibold text-[#1E1B18] hover:text-[#9B5D3E] flex items-center justify-between"
                  >
                    <span>EXPLORE LIVE WEBSITE</span>
                    <ArrowUpRight className="w-4 h-4 text-[#9B5D3E]" />
                  </a>
                </div>
              </div>

              {/* Bottom Actions & Desks */}
              <div className="space-y-4 pt-6 border-t border-black/10">
                <button
                  type="button"
                  onClick={scrollToAdvisory}
                  data-cursor="hover"
                  className="w-full py-4 rounded-xl bg-[#1E1B18] hover:bg-[#9B5D3E] text-white font-mono text-[12px] font-semibold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-md active:scale-95"
                >
                  <span>PRIVATE ADVISORY DESK</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-white border border-black/5">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#A0AEC0] block">
                      DIRECT LINE
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-[#1E1B18] mt-0.5 block">
                      +44 (0) 20 7946 0880
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-black/5">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#A0AEC0] block">
                      CONCIERGE
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-[#1E1B18] mt-0.5 block truncate">
                      inquiries@atelierestates.com
                    </span>
                  </div>
                </div>

                <div className="text-center font-mono text-[10px] text-[#A0AEC0] tracking-widest uppercase pt-2">
                  MAYFAIR · ENGE · CHELSEA
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 
        ========================================================================
        SECTION 02 — PROJECT OVERVIEW & ARCHITECTURAL SCOPE
        ========================================================================
      */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* Strategic Narrative (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-[#9B5D3E] text-[11px] sm:text-[12px] font-semibold tracking-widest uppercase mb-3 px-3.5 py-1 rounded-full bg-[#9B5D3E]/10 border border-[#9B5D3E]/20">
                <Layers className="w-3.5 h-3.5 text-[#9B5D3E]" />
                <span>[ 01 · STRATEGIC CONVICTION ]</span>
              </div>
              <h2 className="font-playfair text-[32px] sm:text-[46px] lg:text-[52px] font-normal text-[#1E1B18] tracking-tight leading-[1.08] mb-6">
                Curating Significant Residences <span className="italic text-[#9B5D3E]">with Editorial Restraint</span>
              </h2>
              <p className="font-montserrat text-[#554D47] text-[16px] sm:text-[17px] leading-relaxed">
                Most luxury real estate websites bombard prospective buyers with noisy mortgage calculators, aggressive agent headshots, and cluttered grids. 
                Atelier Estates was conceived with an editorial ethos: treating architecturally significant residences with the unhurried curatorial reverence of a private monograph.
              </p>
              <p className="font-montserrat text-[#554D47] text-[15px] sm:text-[16px] leading-relaxed mt-4">
                Northup Studio engineered the digital flagship as an interactive monograph — allowing prospective buyers to explore spatial layers, analyze travertine and cedar materiality, and initiate discrete inquiries across private desks in London, Zurich, and New York.
              </p>
            </div>

            {/* Three Scope Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
              
              <div className="p-6 rounded-2xl bg-white border border-black/10 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-[#9B5D3E]/10 flex items-center justify-center text-[#9B5D3E] mb-4">
                    <Building2 className="w-4 h-4 text-[#9B5D3E]" />
                  </div>
                  <span className="font-mono text-[10px] text-[#A0AEC0] tracking-widest uppercase">DISCIPLINE 01</span>
                  <h3 className="font-playfair text-[20px] text-[#1E1B18] mt-1 mb-2">Editorial Identity</h3>
                  <p className="font-montserrat text-[13px] text-[#718096] leading-relaxed">
                    Bespoke typographic rhythm, warm travertine tones, and restrained bronze accents creating spatial serenity.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-black/10 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-[#9B5D3E]/10 flex items-center justify-center text-[#9B5D3E] mb-4">
                    <Monitor className="w-4 h-4 text-[#9B5D3E]" />
                  </div>
                  <span className="font-mono text-[10px] text-[#A0AEC0] tracking-widest uppercase">DISCIPLINE 02</span>
                  <h3 className="font-playfair text-[20px] text-[#1E1B18] mt-1 mb-2">Web Design &amp; UI</h3>
                  <p className="font-montserrat text-[13px] text-[#718096] leading-relaxed">
                    Procedural material studies, architectural layering, and full-bleed high-definition photography.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-black/10 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-[#9B5D3E]/10 flex items-center justify-center text-[#9B5D3E] mb-4">
                    <Compass className="w-4 h-4 text-[#9B5D3E]" />
                  </div>
                  <span className="font-mono text-[10px] text-[#A0AEC0] tracking-widest uppercase">DISCIPLINE 03</span>
                  <h3 className="font-playfair text-[20px] text-[#1E1B18] mt-1 mb-2">Private Advisory</h3>
                  <p className="font-montserrat text-[13px] text-[#718096] leading-relaxed">
                    High-security advisory enquiry workflow with discrete multi-timezone desks in London, Zurich, and New York.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Project Specifications Card (lg:col-span-4) */}
          <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-white border border-black/10 shadow-sm">
            <h3 className="font-mono text-[11px] font-bold text-[#9B5D3E] tracking-widest uppercase mb-6 pb-2 border-b border-black/10 flex items-center justify-between">
              <span>PROJECT SPECIFICATIONS</span>
              <span className="text-[#9B5D3E]">GLOBAL</span>
            </h3>

            <dl className="space-y-4 font-mono text-[12px]">
              <div>
                <dt className="text-[#A0AEC0] uppercase tracking-wider text-[10px]">Client</dt>
                <dd className="font-semibold text-[#1E1B18] text-[13px] mt-0.5">Atelier Estates Private Office</dd>
              </div>

              <div>
                <dt className="text-[#A0AEC0] uppercase tracking-wider text-[10px]">Live Project URL</dt>
                <dd className="mt-0.5">
                  <a
                    href={ATELIER_LIVE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-semibold text-[#9B5D3E] hover:underline text-[12px]"
                  >
                    <span>atelier-estates-alpha.vercel.app</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </dd>
              </div>

              <div>
                <dt className="text-[#A0AEC0] uppercase tracking-wider text-[10px]">Advisory Hubs</dt>
                <dd className="font-semibold text-[#1E1B18] text-[13px] mt-0.5">Mayfair (London) · Enge (Zurich) · Chelsea (NYC)</dd>
              </div>

              <div>
                <dt className="text-[#A0AEC0] uppercase tracking-wider text-[10px]">Year / Timeline</dt>
                <dd className="font-semibold text-[#1E1B18] text-[13px] mt-0.5">2024 — 2025</dd>
              </div>

              <div>
                <dt className="text-[#A0AEC0] uppercase tracking-wider text-[10px]">Stack &amp; Frameworks</dt>
                <dd className="font-semibold text-[#1E1B18] text-[13px] mt-0.5 leading-snug">
                  Next.js App Router, Tailwind CSS, Framer Motion, Vercel Edge
                </dd>
              </div>

              <div>
                <dt className="text-[#A0AEC0] uppercase tracking-wider text-[10px]">Studio Credits</dt>
                <dd className="font-semibold text-[#9B5D3E] text-[13px] mt-0.5">
                  Northup Studio (Design &amp; Development)
                </dd>
              </div>
            </dl>

            <div className="mt-6 pt-4 border-t border-black/10 space-y-3">
              <a
                href={ATELIER_LIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="w-full py-3.5 rounded-full bg-[#1E1B18] hover:bg-[#9B5D3E] text-white font-mono text-[12px] font-semibold tracking-wider uppercase transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm"
              >
                <span>EXPLORE LIVE WEBSITE ↗</span>
              </a>

              <button
                type="button"
                onClick={() => onOpenContact('Project Inquiry: Inspired by Atelier Estates')}
                data-cursor="hover"
                className="w-full py-3 rounded-full border border-black/15 hover:bg-black/5 text-[#1E1B18] font-mono text-[11px] font-semibold tracking-wider uppercase transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <span>INQUIRE ABOUT THIS WORK</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#9B5D3E]" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 
        ========================================================================
        SECTION 03 — THE ATELIER / OUR POINT OF VIEW (FIGMA SCREENSHOT 210309)
        ========================================================================
      */}
      <section id="point-of-view" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
        <div className="p-8 sm:p-14 lg:p-16 rounded-[28px] sm:rounded-[36px] bg-[#FAF8F5] border border-black/10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            
            {/* Left Column: Authentic Text from Figma Screen 2 */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 font-mono text-[#9B5D3E] text-[11px] font-semibold tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-[#9B5D3E]" />
                <span>THE ATELIER</span>
              </div>

              <h2 className="font-playfair text-[36px] sm:text-[50px] lg:text-[60px] font-normal text-[#1E1B18] tracking-tight leading-[1.04]">
                A slower, more considered way to find home.
              </h2>

              <div className="pt-4 border-t border-black/10">
                <span className="font-mono text-[10px] text-[#A0AEC0] uppercase tracking-widest block mb-4">
                  OUR POINT OF VIEW
                </span>

                <p className="font-playfair text-[18px] sm:text-[22px] italic text-[#1E1B18] leading-relaxed mb-6">
                  "We represent architecturally significant residences where craft, light, and landscape converge. Atelier Estates curates private acquisitions for discerning collectors, architects, and design patrons worldwide."
                </p>

                <p className="font-montserrat text-[#554D47] text-[14px] sm:text-[15px] leading-relaxed">
                  Atelier Estates began with a simple conviction: the most meaningful homes deserve more than a listing. 
                  They deserve context, careful stewardship, and a conversation that begins long before a viewing.
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 font-mono text-[12px] text-[#9B5D3E] font-bold">
                <span>01 / CONVICTION</span>
                <span>&middot;</span>
                <span className="text-[#A0AEC0]">PRIVATE MONOGRAPH</span>
              </div>
            </div>

            {/* Right Column: Figma Mobile Screen Specimen (Screenshot 2026-10-31 210309) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[340px] rounded-[32px] overflow-hidden bg-white border border-black/10 shadow-xl p-2">
                <img
                  src="/assets/atelier/point-of-view.png"
                  alt="Atelier Estates Point of View Figma Mobile View"
                  className="w-full h-auto rounded-[24px] object-cover"
                  loading="lazy"
                />
                <div className="p-3 text-center font-mono text-[10px] text-[#718096] uppercase tracking-wider">
                  FIG. 02 — POINT OF VIEW MOBILE SPECIMEN
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        SECTION 04 — MATERIAL STUDY: ARCHITECTURE IN MOTION (FIGMA SCREENSHOT 210450)
        ========================================================================
      */}
      <section id="material-study" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
        
        {/* Section Header */}
        <div className="max-w-[800px] mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 font-mono text-[#9B5D3E] text-[11px] sm:text-[12px] font-semibold tracking-widest uppercase mb-3 px-3.5 py-1 rounded-full bg-[#9B5D3E]/10 border border-[#9B5D3E]/20">
            <Compass className="w-3.5 h-3.5 text-[#9B5D3E]" />
            <span>02 / MATERIAL STUDY</span>
          </div>
          <h2 className="font-playfair text-[34px] sm:text-[48px] lg:text-[56px] font-normal text-[#1E1B18] tracking-tight leading-[1.06] mb-4">
            Architecture in <span className="italic text-[#9B5D3E]">motion.</span>
          </h2>
          <p className="font-montserrat text-[#554D47] text-[15px] sm:text-[17px] leading-relaxed">
            A procedural study of stone, glass, timber, and water. Scroll through the layers of a residence designed around its landscape.
          </p>
        </div>

        {/* Monograph Feature Card */}
        <div className="rounded-[28px] sm:rounded-[36px] bg-[#FAF8F5] border border-black/10 shadow-lg p-6 sm:p-12 overflow-hidden">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-black/10">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-[10px] text-[#9B5D3E] uppercase tracking-widest font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#9B5D3E]" />
                <span>INTERACTIVE ARCHITECTURAL MONOGRAPH</span>
              </div>
              <h3 className="font-playfair text-[24px] sm:text-[32px] text-[#1E1B18] mt-1">
                The Geometry of Sanctuary
              </h3>
              <p className="font-mono text-[12px] text-[#718096]">
                A procedural spatial study in travertine, timber &amp; light
              </p>
            </div>

            <div className="font-mono text-[11px] text-[#A0AEC0] self-start sm:self-center">
              4 MATERIAL EXPLORATIONS
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Architectural Render Viewport (lg:col-span-7) */}
            <div className="lg:col-span-7 rounded-2xl overflow-hidden bg-[#ECE7DE] border border-black/10 shadow-inner">
              <img
                src="/assets/atelier/material-study.png"
                alt="The Geometry of Sanctuary - Procedural Study in Travertine and Timber"
                className="w-full h-auto object-cover max-h-[640px]"
                loading="lazy"
              />
            </div>

            {/* Interactive Material Layer Switcher (lg:col-span-5) */}
            <div className="lg:col-span-5 space-y-4">
              <h4 className="font-mono text-[11px] font-bold text-[#1E1B18] uppercase tracking-widest mb-2">
                ACTIVE MATERIAL MONOGRAPH:
              </h4>

              {materialLayers.map((mat) => {
                const isActive = activeMaterial === mat.id
                return (
                  <div
                    key={mat.id}
                    onClick={() => setActiveMaterial(mat.id)}
                    data-cursor="hover"
                    className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
                      isActive 
                        ? 'bg-white border-[#9B5D3E] shadow-md scale-[1.01]' 
                        : 'bg-white/60 border-black/5 hover:bg-white hover:border-black/15'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[11px] font-semibold text-[#9B5D3E]">
                        {mat.name}
                      </span>
                      <span className={`w-3.5 h-3.5 rounded-full ${mat.colorClass} border border-black/10`} />
                    </div>
                    <div className="font-mono text-[10px] text-[#A0AEC0] uppercase tracking-wider mb-1">
                      {mat.origin}
                    </div>
                    <p className="font-montserrat text-[12px] text-[#554D47] leading-relaxed">
                      {mat.desc}
                    </p>
                  </div>
                )
              })}
            </div>

          </div>

        </div>

      </section>

      {/* 
        ========================================================================
        SECTION 05 — PRIVATE ADVISORY DESK & ENQUIRY FORM (FIGMA SCREENSHOT 210348)
        ========================================================================
      */}
      <section id="advisory-desk" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
        
        {/* Section Header */}
        <div className="max-w-[800px] mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 font-mono text-[#9B5D3E] text-[11px] sm:text-[12px] font-semibold tracking-widest uppercase mb-3 px-3.5 py-1 rounded-full bg-[#9B5D3E]/10 border border-[#9B5D3E]/20">
            <Mail className="w-3.5 h-3.5 text-[#9B5D3E]" />
            <span>03 / PRIVATE ADVISORY DESK</span>
          </div>
          <h2 className="font-playfair text-[34px] sm:text-[48px] lg:text-[56px] font-normal text-[#1E1B18] tracking-tight leading-[1.06] mb-4">
            Tell us what you are <span className="italic text-[#9B5D3E]">looking for.</span>
          </h2>
          <p className="font-montserrat text-[#554D47] text-[15px] sm:text-[17px] leading-relaxed">
            Directly connect with our private acquisition desks in Mayfair, Enge, or Chelsea. All inquiries are received with absolute discretion.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* Interactive Form Component (lg:col-span-7) */}
          <div className="lg:col-span-7 p-8 sm:p-12 rounded-[28px] sm:rounded-[36px] bg-white border border-black/10 shadow-lg">
            
            {formSubmitted ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#9B5D3E]/10 flex items-center justify-center text-[#9B5D3E] mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-[#9B5D3E]" />
                </div>
                <h3 className="font-playfair text-[26px] text-[#1E1B18]">
                  Enquiry Discretely Received
                </h3>
                <p className="font-montserrat text-[14px] text-[#718096] max-w-[420px] mx-auto">
                  A senior partner at your designated international desk will respond within 4 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                
                {/* Full Name */}
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-[#718096] mb-2 font-semibold">
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formState.fullName}
                    onChange={handleFormChange}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full px-4 py-3.5 rounded-xl bg-[#FAF8F5] border border-black/10 text-[#1E1B18] font-mono text-[13px] placeholder:text-[#A0AEC0] focus:outline-none focus:border-[#9B5D3E] focus:ring-1 focus:ring-[#9B5D3E]"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-[#718096] mb-2 font-semibold">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formState.email}
                    onChange={handleFormChange}
                    placeholder="e.g. eleanor@vancestudio.com"
                    className="w-full px-4 py-3.5 rounded-xl bg-[#FAF8F5] border border-black/10 text-[#1E1B18] font-mono text-[13px] placeholder:text-[#A0AEC0] focus:outline-none focus:border-[#9B5D3E] focus:ring-1 focus:ring-[#9B5D3E]"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-[#718096] mb-2 font-semibold">
                    PHONE NUMBER (OPTIONAL)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formState.phone}
                    onChange={handleFormChange}
                    placeholder="e.g. +44 20 7946 0880"
                    className="w-full px-4 py-3.5 rounded-xl bg-[#FAF8F5] border border-black/10 text-[#1E1B18] font-mono text-[13px] placeholder:text-[#A0AEC0] focus:outline-none focus:border-[#9B5D3E] focus:ring-1 focus:ring-[#9B5D3E]"
                  />
                </div>

                {/* Enquiry Type Dropdown */}
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-[#718096] mb-2 font-semibold">
                    ENQUIRY TYPE *
                  </label>
                  <div className="relative">
                    <select
                      name="enquiryType"
                      value={formState.enquiryType}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3.5 rounded-xl bg-[#FAF8F5] border border-black/10 text-[#1E1B18] font-mono text-[13px] appearance-none focus:outline-none focus:border-[#9B5D3E] focus:ring-1 focus:ring-[#9B5D3E]"
                    >
                      <option value="General advisory enquiry">General advisory enquiry</option>
                      <option value="Private acquisition">Private acquisition</option>
                      <option value="Architectural monograph commission">Architectural monograph commission</option>
                      <option value="Discrete valuation">Discrete valuation</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#A0AEC0] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-[#718096] font-semibold">
                      MESSAGE *
                    </label>
                    <span className="font-mono text-[10px] text-[#A0AEC0]">
                      {formState.message.length}/2,000
                    </span>
                  </div>
                  <textarea
                    name="message"
                    rows={4}
                    maxLength={2000}
                    value={formState.message}
                    onChange={handleFormChange}
                    placeholder="Please share your timeline, architectural preferences, or specific questions..."
                    className="w-full px-4 py-3.5 rounded-xl bg-[#FAF8F5] border border-black/10 text-[#1E1B18] font-mono text-[13px] placeholder:text-[#A0AEC0] focus:outline-none focus:border-[#9B5D3E] focus:ring-1 focus:ring-[#9B5D3E] resize-none"
                  />
                </div>

                {/* Discretion statement */}
                <p className="font-montserrat text-[12px] text-[#718096] leading-relaxed">
                  Discretion assured. We protect your privacy with exacting confidentiality and never disclose your enquiry details to third parties.
                </p>

                {/* Submit button */}
                <button
                  type="submit"
                  data-cursor="hover"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#1E1B18] hover:bg-[#9B5D3E] text-white font-mono text-[12px] font-semibold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-md active:scale-95"
                >
                  <span>SEND ENQUIRY</span>
                  <Send className="w-3.5 h-3.5" />
                </button>

              </form>
            )}

          </div>

          {/* Right Column: Original Figma Mockup Comparison (Screenshot 2026-10-31 210348) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[340px] rounded-[32px] overflow-hidden bg-white border border-black/10 shadow-xl p-2">
              <img
                src="/assets/atelier/advisory-form.png"
                alt="Atelier Estates Enquiry Form Figma Specimen"
                className="w-full h-auto rounded-[24px] object-cover"
                loading="lazy"
              />
              <div className="p-3 text-center font-mono text-[10px] text-[#718096] uppercase tracking-wider">
                FIG. 03 — FORM ARCHITECTURE SPECIMEN
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* 
        ========================================================================
        SECTION 06 — INTERNATIONAL DESKS & PRIVATE ENQUIRIES (FIGMA SCREENSHOT 210322)
        ========================================================================
      */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
        <div className="p-8 sm:p-16 lg:p-20 rounded-[28px] sm:rounded-[40px] bg-[#171514] text-white border border-white/10 shadow-2xl relative overflow-hidden">
          
          {/* Subtle bronze radial glow */}
          <div 
            className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(155,93,62,0.2) 0%, transparent 70%)'
            }}
          />

          <div className="relative z-10 max-w-[900px] space-y-10">
            
            {/* Atelier Brand Intro */}
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-[#D8CDBC] text-[11px] tracking-widest uppercase mb-3">
                <Globe className="w-3.5 h-3.5 text-[#9B5D3E]" />
                <span>GLOBAL ADVISORY PORTFOLIO</span>
              </div>
              <h2 className="font-playfair text-[38px] sm:text-[54px] font-normal text-white tracking-tight mb-4">
                Atelier Estates
              </h2>
              <p className="font-montserrat text-white/80 text-[15px] sm:text-[17px] leading-relaxed max-w-[760px]">
                A private real estate atelier curated by Northup Studio. We represent exceptional private residences, historic bastides, and modern architectural masterpieces across Europe, North America, and Japan.
              </p>
            </div>

            {/* International Desks Grid */}
            <div className="pt-8 border-t border-white/15">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#D8CDBC] block mb-6">
                INTERNATIONAL DESKS
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* London */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <h4 className="font-playfair text-[20px] text-white mb-1">London</h4>
                  <p className="font-mono text-[11px] text-white/70">14 Berkeley Square, Mayfair</p>
                  <p className="font-mono text-[10px] text-[#D8CDBC] mt-2">Mon – Fri: 09:00 – 18:00 GMT</p>
                </div>

                {/* Zurich */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <h4 className="font-playfair text-[20px] text-white mb-1">Zurich</h4>
                  <p className="font-mono text-[11px] text-white/70">Bahnhofstrasse 28, Enge</p>
                  <p className="font-mono text-[10px] text-[#D8CDBC] mt-2">By Private Appointment</p>
                </div>

                {/* New York */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <h4 className="font-playfair text-[20px] text-white mb-1">New York</h4>
                  <p className="font-mono text-[11px] text-white/70">520 West 28th St, Chelsea</p>
                  <p className="font-mono text-[10px] text-[#D8CDBC] mt-2">By Private Appointment</p>
                </div>

              </div>
            </div>

            {/* Private Enquiries Lines */}
            <div className="pt-8 border-t border-white/15 space-y-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#D8CDBC] block">
                PRIVATE ENQUIRIES &amp; DIRECT DIGITAL DESK
              </span>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-white/10">
                <a 
                  href="mailto:private@atelierestates.com" 
                  data-cursor="hover"
                  className="font-mono text-[14px] sm:text-[16px] text-white hover:text-[#D8CDBC] transition-colors flex items-center gap-2"
                >
                  <span>private@atelierestates.com</span>
                  <ArrowUpRight className="w-4 h-4 text-[#D8CDBC]" />
                </a>

                <a 
                  href="tel:+442079460880" 
                  data-cursor="hover"
                  className="font-mono text-[14px] sm:text-[16px] text-white hover:text-[#D8CDBC] transition-colors flex items-center gap-2"
                >
                  <span>+44 (0) 20 7946 0880</span>
                  <ArrowUpRight className="w-4 h-4 text-[#D8CDBC]" />
                </a>
              </div>
            </div>

            {/* Schedule Private Viewing & Live Website CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={ATELIER_LIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="px-8 py-4 rounded-xl bg-white hover:bg-[#D8CDBC] text-[#171514] font-mono text-[12px] font-bold tracking-wider uppercase transition-all duration-300 shadow-md active:scale-95 inline-flex items-center gap-2"
              >
                <span>EXPLORE LIVE WEBSITE ↗</span>
              </a>

              <button
                type="button"
                onClick={scrollToAdvisory}
                data-cursor="hover"
                className="px-8 py-4 rounded-xl bg-[#9B5D3E] hover:bg-[#854F34] text-white font-mono text-[12px] font-semibold tracking-wider uppercase transition-all duration-300 shadow-md active:scale-95"
              >
                SCHEDULE PRIVATE VIEWING
              </button>
            </div>

            {/* Atelier Copyright & Disclaimer */}
            <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-[11px] text-white/50">
              <div>
                &copy; 2026 Atelier Estates. Curated and coded by Northup Studio.
              </div>
              <div className="flex items-center gap-4">
                <a href={ATELIER_LIVE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  atelier-estates-alpha.vercel.app ↗
                </a>
                <span>&middot;</span>
                <span>Philosophy</span>
                <span>&middot;</span>
                <span>Advisory</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 
        ========================================================================
        SECTION 07 — CLOSING & NEXT PROJECT LINKING
        ========================================================================
      */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24">
        <div className="p-8 sm:p-16 rounded-[28px] sm:rounded-[36px] bg-[#15100E] text-white border border-white/10 shadow-2xl relative overflow-hidden">
          
          {/* Ambient burnt bronze aura */}
          <div 
            className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(155,93,62,0.25) 0%, transparent 70%)'
            }}
          />

          <div className="relative z-10 max-w-[840px]">
            <div className="inline-flex items-center gap-2 font-mono text-[#D8CDBC] text-[11px] tracking-widest uppercase mb-4 px-3 py-1 rounded-full bg-white/10 border border-white/15">
              <Sparkles className="w-3 h-3 text-[#9B5D3E]" />
              <span>OUTCOME &amp; IMPACT · NORTHUP STUDIO</span>
            </div>

            <blockquote className="font-playfair text-[24px] sm:text-[34px] lg:text-[40px] italic font-normal text-white/95 leading-snug mb-8">
              "When architecture meets considered digital pacing, the website becomes more than a portfolio — it becomes a tactile prelude to stepping inside."
            </blockquote>

            <div className="mb-8">
              <p className="font-montserrat text-white/70 text-[14px] sm:text-[15px] leading-relaxed max-w-[680px] mb-4">
                Experience the real deployed web application or commission a bespoke digital flagship for your architecture practice.
              </p>
              
              {/* Closing Live CTA Banner */}
              <div className="inline-flex items-center gap-3 p-3 px-4 rounded-xl bg-white/5 border border-white/10 font-mono text-[12px]">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-[#D8CDBC] italic">“Experience the project in its entirety.”</span>
                <span className="text-white/40">&middot;</span>
                <a 
                  href={ATELIER_LIVE_URL} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white font-bold hover:text-[#9B5D3E] underline decoration-[#9B5D3E] underline-offset-4 transition-colors"
                >
                  EXPLORE LIVE WEBSITE ↗
                </a>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => onNavigate('/#work')}
                data-cursor="hover"
                className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black font-mono text-[12px] font-bold tracking-wider uppercase transition-all duration-300 shadow-md active:scale-95"
              >
                &larr; BACK TO ALL WORK
              </button>

              <a
                href={ATELIER_LIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="px-7 py-3.5 rounded-full bg-[#9B5D3E] hover:bg-[#B36E49] text-white font-mono text-[12px] font-bold tracking-wider uppercase transition-all duration-300 shadow-md active:scale-95 flex items-center gap-2"
              >
                <span>EXPLORE LIVE WEBSITE ↗</span>
              </a>

              <button
                type="button"
                onClick={() => onNavigate('/work/arulis-dental-clinic')}
                data-cursor="hover"
                className="px-6 py-3.5 rounded-full bg-[#0F3D2E] hover:bg-[#155440] text-white font-mono text-[12px] font-bold tracking-wider uppercase transition-all duration-300 shadow-md active:scale-95 flex items-center gap-2"
              >
                <span>NEXT: ARULIS DENTAL CLINIC</span>
                <ArrowUpRight className="w-4 h-4 text-[#D4AF37]" />
              </button>

              <button
                type="button"
                onClick={() => onOpenContact('Project Inquiry: Architectural Flagship')}
                data-cursor="hover"
                className="px-6 py-3.5 rounded-full bg-white hover:bg-[#9B5D3E] text-black hover:text-white font-mono text-[12px] font-bold tracking-wider uppercase transition-all duration-300 shadow-md active:scale-95 flex items-center gap-2"
              >
                <span>COMMISSION WORK</span>
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
