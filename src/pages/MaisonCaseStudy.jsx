import React, { useEffect, useState, useRef } from 'react'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  ArrowUpRight, 
  Sparkles, 
  ExternalLink, 
  Layers, 
  Compass, 
  Monitor, 
  Smartphone, 
  Tablet,
  CheckCircle2, 
  Cake, 
  Heart,
  Lock, 
  Globe, 
  RefreshCw,
  Code2,
  Palette,
  Eye,
  Coffee,
  Clock,
  ChevronRight
} from 'lucide-react'
import Footer from '../components/Footer'

// Centralized Live Project URL (Single Source of Truth)
const MAISON_LIVE_URL = 'https://maison-de-sucre.vercel.app/'

export default function MaisonCaseStudy({ onNavigate, onOpenContact }) {
  const shouldReduceMotion = useReducedMotion()
  
  // Hero Preview Mode: 'render' (Editorial Mockup) or 'interactive' (Live iframe)
  const [heroMode, setHeroMode] = useState('render')
  const [iframeLoading, setIframeLoading] = useState(true)
  const [iframeKey, setIframeKey] = useState(0)

  // Marquee pause state on hover or keyboard focus
  const [marqueePaused, setMarqueePaused] = useState(false)

  // Active cake flavour tab for the culinary craft section
  const [activeFlavour, setActiveFlavour] = useState('bourbon-vanilla')

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const reloadIframe = () => {
    setIframeLoading(true)
    setIframeKey(prev => prev + 1)
  }

  // Signature cakes curated from the real Maison de Sucre atelier
  const signatureCakes = [
    {
      id: 'lambeth-04',
      name: 'Lambeth No. 04',
      category: 'Vintage Tiers',
      description: 'Intricate over-piped royal shell garlands, hand-sculpted buttercream ruffles, and maraschino cherries.',
      palette: 'Powder Ivory & Rose',
      image: '/assets/cake-studio.jpg',
    },
    {
      id: 'rose-velvet',
      name: 'Rose Velvet & Raspberry',
      category: 'Celebration Collection',
      description: 'A soft architecture of whipped ivory buttercream, dried Persian rosewater petals, and tart raspberry coulis.',
      palette: 'Blush & Buttercream',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=85',
    },
    {
      id: 'botanical-whisper',
      name: 'Botanical Whisper',
      category: 'Bespoke Wedding',
      description: 'Three structural tiers finished with organic edible botanicals, pressed pansies, and gold leaf accents.',
      palette: 'Wild Flora & Gold',
      image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=1200&q=85',
    },
    {
      id: 'pistachio-rococo',
      name: 'Pistachio Rococo',
      category: 'Atelier Signature',
      description: 'Bronte pistachio dacquoise with silken Swiss meringue, cardamom cream, and delicate piped scrolls.',
      palette: 'Sage & Cocoa',
      image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=1200&q=85',
    },
  ]

  // Flavour Profiles from the actual Maison de Sucre website
  const flavourProfiles = [
    {
      id: 'bourbon-vanilla',
      title: 'Madagascar Bourbon Vanilla',
      tag: 'CORE BOTANICAL',
      notes: 'Whole cured vanilla pods aged slowly in-house, folded into airy sponge and whipped Swiss meringue.',
      pairings: 'Wild raspberry compote · Salted caramel crunch',
    },
    {
      id: 'swiss-meringue',
      title: 'Silk Swiss Meringue Buttercream',
      tag: 'TECHNIQUE',
      notes: 'Whipped egg whites and heated organic sugar spun into an ultra-velvety, low-sweetness gloss that melts cleanly.',
      pairings: 'Fresh passionfruit curd · Earl Grey infusion',
    },
    {
      id: 'valrhona-cocoa',
      title: 'Valrhona Dark Chocolate Ganache',
      tag: 'SINGLE ORIGIN',
      notes: '70% Guanaja chocolate ganache layered with espresso-soaked sponge and Maldon sea salt flakes.',
      pairings: 'Morello cherry reduction · Roasted hazelnut praline',
    },
  ]

  // Real verified technologies used in the project
  const verifiedTechStack = [
    {
      name: 'React 18',
      category: 'FRONTEND RUNTIME',
      role: 'Modular component architecture, custom hooks, and reactive UI states.',
    },
    {
      name: 'Vite 6',
      category: 'BUILD TOOLING',
      role: 'Next-generation ES module bundler ensuring blazing fast page speed and optimal bundle splitting.',
    },
    {
      name: 'Tailwind CSS 3',
      category: 'DESIGN SYSTEM',
      role: 'Bespoke editorial color palette, custom typographic scale, and fluid layout primitives.',
    },
    {
      name: 'Lucide React',
      category: 'ICONOGRAPHY',
      role: 'Restrained, lightweight vector icons matching the refined studio aesthetic.',
    },
    {
      name: 'Playfair & Manrope',
      category: 'TYPOGRAPHY',
      role: 'Expressive transitional serif paired with a clean geometric sans-serif for editorial balance.',
    },
    {
      name: 'Vercel Edge Network',
      category: 'HOSTING & CI/CD',
      role: 'High-availability global CDN caching, instant deploys, and automated asset compression.',
    },
  ]

  // 5 Responsive Mockup items for the Continuous Marquee
  const marqueeItems = [
    {
      type: 'desktop',
      label: 'DESKTOP · 1440PX BREAKPOINT',
      title: 'Homepage Hero & Monograph Header',
      image: '/assets/maison/desktop-hero.png',
      aspect: 'w-[580px] sm:w-[680px] lg:w-[760px] aspect-[16/10]',
      elevation: 'translate-y-0',
    },
    {
      type: 'tablet',
      label: 'TABLET · 768PX BREAKPOINT',
      title: 'Editorial Grid & Tier Selection',
      image: '/assets/maison/tablet-view.png',
      aspect: 'w-[320px] sm:w-[380px] lg:w-[420px] aspect-[3/4]',
      elevation: 'translate-y-4 sm:translate-y-6',
    },
    {
      type: 'mobile',
      label: 'MOBILE · 390PX VIEWPORT',
      title: 'Mobile Navigation & Hero Typography',
      image: '/assets/maison/mobile-view.png',
      aspect: 'w-[220px] sm:w-[260px] lg:w-[290px] aspect-[9/19.5]',
      elevation: '-translate-y-3 sm:-translate-y-5',
    },
    {
      type: 'desktop-detail',
      label: 'DESKTOP DETAIL · COLLECTION',
      title: 'Bespoke Wedding & Vintage Lambeth Grid',
      image: '/assets/maison/desktop-collection.png',
      aspect: 'w-[580px] sm:w-[680px] lg:w-[760px] aspect-[16/10]',
      elevation: 'translate-y-1 sm:translate-y-2',
    },
    {
      type: 'mobile-detail',
      label: 'MOBILE DETAIL · CONSULTATION',
      title: 'Commission Enquiry & Booking Intake',
      image: '/assets/maison/mobile-detail.png',
      aspect: 'w-[220px] sm:w-[260px] lg:w-[290px] aspect-[9/19.5]',
      elevation: 'translate-y-3 sm:translate-y-5',
    },
  ]

  return (
    <div 
      data-cursor-theme="maison"
      className="relative min-h-screen bg-[#F7F3EC] text-[#252321] overflow-x-hidden pt-20 sm:pt-28 select-none"
    >
      
      {/* 
        ========================================================================
        TOP BREADCRUMB & DIRECT LIVE SITE BAR
        ========================================================================
      */}
      <nav aria-label="Breadcrumb" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-b border-[#252321]/10">
          
          {/* Back to work */}
          <button
            type="button"
            onClick={() => onNavigate('/#work')}
            data-cursor="hover"
            className="group inline-flex items-center gap-2 font-mono text-[12px] sm:text-[13px] font-semibold text-[#252321] hover:text-[#B87F83] transition-colors py-1 px-3 rounded-full hover:bg-black/5"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1 text-[#B87F83]" />
            <span>BACK TO FEATURED WORK</span>
          </button>

          {/* Breadcrumb path & Direct Live Link pill */}
          <div className="flex items-center gap-3 sm:gap-4 font-mono text-[11px] sm:text-[12px]">
            <div className="hidden sm:flex items-center gap-2 text-[#7A6E6A]">
              <span>NORTHUP STUDIO</span>
              <span>&middot;</span>
              <span className="text-[#B87F83] font-semibold">MAISON DE SUCRE</span>
              <span>&middot;</span>
              <span className="px-2 py-0.5 rounded-full bg-[#B87F83]/10 text-[#B87F83] font-bold">04 / 06</span>
            </div>

            {/* Quick Live Website Pill */}
            <a
              href={MAISON_LIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Explore live Maison de Sucre website (opens in a new tab)"
              data-cursor="hover"
              className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#392A27] hover:bg-[#B87F83] text-[#F7F3EC] text-[11px] font-bold tracking-wider transition-all duration-200 shadow-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8C9C8] animate-pulse" />
              <span>LIVE SITE</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#E8C9C8] group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

        </div>
      </nav>

      {/* 
        ========================================================================
        SECTION ONE — THE CINEMATIC INTRO
        - Eyebrow: NORTHUP STUDIO / SELECTED WORK
        - Title: MAISON DE SUCRE
        - Category: ARTISAN CAKE STUDIO / DIGITAL EXPERIENCE
        - Headline: “A little sweetness. A lasting impression.”
        - Supporting copy: “An editorial digital experience created to celebrate...”
        - Prominent Primary Live Website CTA (within first viewport)
        ========================================================================
      */}
      <header className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24">
        
        <div className="max-w-[1100px] mb-8 sm:mb-12">
          
          {/* Eyebrow badge */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 font-mono text-[#B87F83] text-[11px] sm:text-[12px] font-semibold tracking-widest uppercase mb-4 px-3.5 py-1.5 rounded-full bg-[#B87F83]/10 border border-[#B87F83]/20"
          >
            <Cake className="w-3.5 h-3.5 text-[#B87F83]" />
            <span>NORTHUP STUDIO / SELECTED WORK · ARTISAN CAKE STUDIO</span>
          </motion.div>

          {/* Project Title */}
          <motion.h1 
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-playfair text-[44px] sm:text-[68px] lg:text-[88px] font-normal text-[#252321] tracking-tight leading-[0.96] mb-5"
          >
            Maison de <span className="italic font-normal text-[#B87F83]">Sucre</span>
          </motion.h1>

          {/* Project Category Tag */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14 }}
            className="font-mono text-[11px] sm:text-[13px] text-[#7A6E6A] uppercase tracking-widest font-semibold mb-6"
          >
            ARTISAN CAKE STUDIO / DIGITAL EXPERIENCE
          </motion.div>

          {/* Headline */}
          <motion.p
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="font-playfair text-[22px] sm:text-[30px] lg:text-[36px] italic text-[#392A27] max-w-[860px] leading-snug mb-5"
          >
            “A little sweetness. A lasting impression.”
          </motion.p>

          {/* Supporting Copy */}
          <motion.p
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="font-montserrat text-[#574B47] text-[15px] sm:text-[18px] leading-relaxed max-w-[820px] mb-8"
          >
            An editorial digital experience created to celebrate the artistry behind every creation, bringing beautiful imagery, thoughtful composition, and a refined browsing experience together.
          </motion.p>

          {/* 
            ====================================================================
            PRIMARY LIVE WEBSITE CTA (INITIAL VIEWPORT — HIGHEST PRIORITY)
            - Exact CTA text: EXPLORE LIVE WEBSITE ↗
            - Supporting microcopy: “Experience the project in its entirety.”
            - Working link: https://maison-de-sucre.vercel.app/
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
              
              {/* High-Contrast Outlined/Solid Button */}
              <a
                href={MAISON_LIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Explore live Maison de Sucre website (opens in a new tab)"
                data-cursor="hover"
                className="group relative inline-flex items-center justify-between sm:justify-start gap-4 px-8 py-4 sm:py-4.5 rounded-full bg-[#392A27] text-[#F7F3EC] hover:bg-[#B87F83] shadow-[0_12px_32px_rgba(57,42,39,0.22)] hover:shadow-[0_16px_40px_rgba(184,127,131,0.35)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B87F83] focus-visible:ring-offset-2 active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  {/* Live pulsating beacon */}
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E8C9C8] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E8C9C8]"></span>
                  </span>
                  
                  {/* Exact CTA Text */}
                  <span className="font-mono text-[12px] sm:text-[13px] font-bold tracking-widest uppercase text-white">
                    EXPLORE LIVE WEBSITE ↗
                  </span>
                </div>

                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 text-[#E8C9C8] group-hover:text-white" />
              </a>

              {/* Supporting Microcopy */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-[#7A6E6A] font-mono text-[11px] sm:text-[12px]">
                <span className="italic text-[#392A27] font-medium">“Experience the project in its entirety.”</span>
                <span className="hidden sm:inline text-black/20">&middot;</span>
                <span className="text-[#B87F83] font-medium tracking-tight">maison-de-sucre.vercel.app</span>
              </div>

            </div>
          </motion.div>

        </div>

        {/* 
          ======================================================================
          HERO DIGITAL SHOWCASE
          Interactive Dual-Mode Canvas (Studio Mockup / Live Web Embed)
          ======================================================================
        */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.32, ease: "easeOut" }}
          className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden bg-[#252321] border border-black/15 shadow-[0_24px_70px_rgba(57,42,39,0.2)] flex flex-col"
        >
          
          {/* Browser Chrome Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-[#302B29] border-b border-white/10 z-20">
            
            {/* Window Controls & Live Indicator */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#E8C9C8]/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#E9DDCA]/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#B87F83]/80 inline-block" />
              </div>

              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-white/10">
                <span className="w-2 h-2 rounded-full bg-[#E8C9C8] animate-pulse" />
                <span className="font-mono text-[10px] text-white/70 uppercase tracking-widest font-semibold">
                  VERCEL PRODUCTION
                </span>
              </div>
            </div>

            {/* Address Bar Pill */}
            <a
              href={MAISON_LIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open maison-de-sucre.vercel.app in new window"
              data-cursor="hover"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 hover:border-white/20 text-[#E9DDCA] hover:text-white transition-all text-[11px] font-mono group"
            >
              <Lock className="w-3 h-3 text-[#E8C9C8]" />
              <span className="tracking-tight">https://maison-de-sucre.vercel.app/</span>
              <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
            </a>

            {/* View Mode Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-black/50 p-1 rounded-full border border-white/10 text-[10px] font-mono">
                <button
                  type="button"
                  onClick={() => setHeroMode('render')}
                  className={`px-3 py-1 rounded-full font-semibold transition-all ${
                    heroMode === 'render'
                      ? 'bg-[#B87F83] text-white shadow-sm'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  STUDIO VIEW
                </button>
                <button
                  type="button"
                  onClick={() => setHeroMode('interactive')}
                  className={`px-3 py-1 rounded-full font-semibold transition-all ${
                    heroMode === 'interactive'
                      ? 'bg-[#B87F83] text-white shadow-sm'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  LIVE PREVIEW
                </button>
              </div>

              {heroMode === 'interactive' && (
                <button
                  type="button"
                  onClick={reloadIframe}
                  title="Reload Live View"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>

          {/* Main Visual Viewport */}
          <div className="relative w-full bg-[#1F1C1B] min-h-[480px] sm:min-h-[620px] lg:min-h-[720px] flex items-center justify-center overflow-hidden">
            
            {heroMode === 'interactive' ? (
              /* Real Interactive Iframe */
              <div className="relative w-full h-[520px] sm:h-[680px] lg:h-[760px] bg-[#FAF6F0]">
                {iframeLoading && (
                  <div className="absolute inset-0 bg-[#252321] flex flex-col items-center justify-center text-white z-10 space-y-3">
                    <div className="w-8 h-8 rounded-full border-2 border-[#B87F83] border-t-transparent animate-spin" />
                    <p className="font-mono text-[11px] text-[#E8C9C8] tracking-widest uppercase">
                      CONNECTING TO MAISON DE SUCRE...
                    </p>
                  </div>
                )}

                <iframe
                  key={iframeKey}
                  src={MAISON_LIVE_URL}
                  title="Maison de Sucre Live Website"
                  onLoad={() => setIframeLoading(false)}
                  className="w-full h-full border-0"
                  loading="lazy"
                />

                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none hidden sm:flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-white font-mono text-[10px] tracking-wider uppercase shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8C9C8] animate-pulse" />
                  <span>INTERACTIVE WINDOW · SCROLL &amp; EXPLORE</span>
                </div>
              </div>
            ) : (
              /* Studio Mockup Visual */
              <div className="relative w-full h-full">
                <img
                  src="/assets/cake-studio.jpg"
                  alt="Maison de Sucre Bespoke Artisan Cake Studio Website"
                  className="w-full h-auto object-cover max-h-[780px]"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25 pointer-events-none" />

                {/* Overlaid Badges */}
                <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 sm:right-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white z-10">
                  <div>
                    <span className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[#E8C9C8] inline-block mb-2">
                      EDIBLE ART · WEDDINGS &amp; CELEBRATIONS
                    </span>
                    <h2 className="font-playfair text-[24px] sm:text-[34px] leading-tight text-[#F7F3EC]">
                      Maison de Sucre Atelier
                    </h2>
                  </div>

                  <a
                    href={MAISON_LIVE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="hover"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#B87F83] hover:bg-[#A36D71] text-white font-mono text-[11px] font-bold tracking-wider uppercase transition-all shadow-md active:scale-95"
                  >
                    <span>OPEN LIVE SITE</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

          </div>

          {/* Project Details Strip (4 Meta Fields from prompt) */}
          <div className="px-6 sm:px-10 py-5 sm:py-6 bg-[#2B2725] border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#A69792] block">
                PROJECT
              </span>
              <span className="font-playfair text-[15px] sm:text-[16px] text-[#F7F3EC] mt-0.5 block">
                Maison de Sucre
              </span>
            </div>

            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#A69792] block">
                INDUSTRY
              </span>
              <span className="font-playfair text-[15px] sm:text-[16px] text-[#F7F3EC] mt-0.5 block">
                Artisan Cakes &amp; Patisserie
              </span>
            </div>

            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#A69792] block">
                SERVICES
              </span>
              <span className="font-playfair text-[15px] sm:text-[16px] text-[#F7F3EC] mt-0.5 block">
                Website Design &amp; Development
              </span>
            </div>

            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#A69792] block">
                STUDIO
              </span>
              <span className="font-playfair text-[15px] sm:text-[16px] text-[#E8C9C8] mt-0.5 block">
                Northup Studio
              </span>
            </div>
          </div>

        </motion.div>

      </header>

      {/* 
        ========================================================================
        SECTION TWO — TECH STACK
        - Heading: “Thoughtfully designed. Beautifully built.”
        - Show verified technologies in a restrained editorial layout
        - Compact labels, typography, fine dividers
        ========================================================================
      */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
        <div className="p-8 sm:p-14 lg:p-16 rounded-[28px] sm:rounded-[36px] bg-[#EFE9DF] border border-[#252321]/10 shadow-sm">
          
          <div className="max-w-[800px] mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 font-mono text-[#B87F83] text-[11px] sm:text-[12px] font-semibold tracking-widest uppercase mb-3 px-3.5 py-1 rounded-full bg-[#B87F83]/10 border border-[#B87F83]/20">
              <Code2 className="w-3.5 h-3.5 text-[#B87F83]" />
              <span>02 / TECHNICAL FOUNDATION</span>
            </div>
            <h2 className="font-playfair text-[32px] sm:text-[46px] lg:text-[52px] font-normal text-[#252321] tracking-tight leading-[1.06] mb-4">
              “Thoughtfully designed. Beautifully built.”
            </h2>
            <p className="font-montserrat text-[#574B47] text-[15px] sm:text-[17px] leading-relaxed">
              Every layer of the Maison de Sucre codebase was engineered for fluid editorial pacing, instantaneous load times, and effortless content updates.
            </p>
          </div>

          {/* Restrained Editorial Technology List with Fine Dividers */}
          <div className="divide-y divide-[#252321]/15 border-y border-[#252321]/15">
            {verifiedTechStack.map((tech, index) => (
              <div 
                key={tech.name}
                className="py-6 sm:py-7 grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline group hover:bg-[#F7F3EC]/50 transition-colors px-4 -mx-4 rounded-xl"
              >
                {/* Index & Category */}
                <div className="md:col-span-3 flex items-center gap-3">
                  <span className="font-mono text-[11px] text-[#A69792] font-semibold">
                    0{index + 1}
                  </span>
                  <span className="font-mono text-[10px] tracking-widest uppercase text-[#B87F83] font-bold">
                    {tech.category}
                  </span>
                </div>

                {/* Tech Name */}
                <div className="md:col-span-4">
                  <h3 className="font-playfair text-[22px] sm:text-[24px] font-normal text-[#252321] group-hover:text-[#B87F83] transition-colors">
                    {tech.name}
                  </h3>
                </div>

                {/* Architectural Role */}
                <div className="md:col-span-5">
                  <p className="font-montserrat text-[13px] sm:text-[14px] text-[#574B47] leading-relaxed">
                    {tech.role}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Live Deployment Proof Strip */}
          <div className="mt-10 p-5 rounded-2xl bg-[#FAF7F2] border border-[#252321]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-[12px]">
            <div className="flex items-center gap-2.5 text-[#392A27]">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              <span className="font-bold">PRODUCTION STATUS:</span>
              <span className="text-[#574B47]">Global Edge Active (maison-de-sucre.vercel.app)</span>
            </div>

            <a
              href={MAISON_LIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="inline-flex items-center gap-1.5 text-[#B87F83] hover:underline font-bold"
            >
              <span>INSPECT LIVE CODEBASE</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </section>

      {/* 
        ========================================================================
        SECTION THREE — THE VISION
        - Heading: “Where craftsmanship meets digital storytelling.”
        - Supporting narrative: “Every detail was considered to let the creations...”
        - Editorial composition: Large website image, text block, detail image
        - Prioritizes real cake photography and website interface details
        ========================================================================
      */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
        
        {/* Editorial Top Heading */}
        <div className="max-w-[880px] mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 font-mono text-[#B87F83] text-[11px] sm:text-[12px] font-semibold tracking-widest uppercase mb-3 px-3.5 py-1 rounded-full bg-[#B87F83]/10 border border-[#B87F83]/20">
            <Heart className="w-3.5 h-3.5 text-[#B87F83]" />
            <span>03 / CURATORIAL VISION</span>
          </div>
          <h2 className="font-playfair text-[34px] sm:text-[50px] lg:text-[58px] font-normal text-[#252321] tracking-tight leading-[1.04] mb-6">
            “Where craftsmanship meets digital storytelling.”
          </h2>
          <p className="font-playfair text-[18px] sm:text-[22px] italic text-[#574B47] leading-relaxed">
            “Every detail was considered to let the creations take centre stage. A refined visual rhythm, expressive typography, and immersive imagery create an experience that feels as carefully made as the cakes themselves.”
          </p>
        </div>

        {/* Editorial Asymmetric Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Large Website Feature Image (lg:col-span-7) */}
          <div className="lg:col-span-7 rounded-[28px] overflow-hidden bg-white border border-[#252321]/10 shadow-lg">
            <img
              src="/assets/maison/desktop-story.png"
              alt="Maison de Sucre Inside the Atelier"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
            <div className="p-6 bg-[#FAF7F2] border-t border-[#252321]/10 flex items-center justify-between font-mono text-[11px] text-[#7A6E6A]">
              <span>FIG. 01 — INSIDE THE ATELIER MONOGRAPH</span>
              <span className="text-[#B87F83] font-bold">ORGANIC BOTANICALS &amp; PIPING</span>
            </div>
          </div>

          {/* Right Column: Narrative & Cake Detail (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Curatorial Narrative Card */}
            <div className="p-8 rounded-[28px] bg-white border border-[#252321]/10 shadow-sm space-y-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#B87F83] font-bold block">
                THE SENSORY CANVAS
              </span>
              <h3 className="font-playfair text-[24px] text-[#252321] leading-snug">
                Edible Sculpture &amp; Vintage Royal Piping
              </h3>
              <p className="font-montserrat text-[14px] text-[#574B47] leading-relaxed">
                Unlike mass-market confectioneries, Maison de Sucre approaches each bespoke cake as an ephemeral sculpture. 
                We mirrored this deliberate pacing through generous whitespace, warm buttercream hues, and micro-interactions that never distract from the pastry craft.
              </p>
            </div>

            {/* Smaller Detail Image */}
            <div className="rounded-[28px] overflow-hidden bg-[#FAF7F2] border border-[#252321]/10 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=85"
                alt="Vintage Lambeth piping detail"
                className="w-full h-[320px] object-cover"
                loading="lazy"
              />
              <div className="p-4 bg-white border-t border-[#252321]/10 font-mono text-[11px] text-[#7A6E6A] flex justify-between">
                <span>VINTAGE LAMBETH DETAIL</span>
                <span className="text-[#392A27] font-semibold">SWISS MERINGUE TIERS</span>
              </div>
            </div>

          </div>

        </div>

        {/* Culinary Flavour Study Module */}
        <div className="p-8 sm:p-12 rounded-[28px] sm:rounded-[36px] bg-[#E9DDCA]/40 border border-[#252321]/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#252321]/10">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#B87F83] font-bold">
                GASTRONOMY ARCHITECTURE
              </span>
              <h3 className="font-playfair text-[26px] text-[#252321] mt-0.5">
                Botanicals, Vanilla &amp; Natural Flavours
              </h3>
            </div>
            <span className="font-mono text-[11px] text-[#7A6E6A]">
              SOURCED ETHICALLY &middot; BATCH MADE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {flavourProfiles.map((flavour) => (
              <div 
                key={flavour.id}
                className="p-6 rounded-2xl bg-white border border-[#252321]/10 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#B87F83] font-bold px-2.5 py-1 rounded-full bg-[#B87F83]/10 inline-block mb-3">
                    {flavour.tag}
                  </span>
                  <h4 className="font-playfair text-[20px] text-[#252321] mb-2">
                    {flavour.title}
                  </h4>
                  <p className="font-montserrat text-[13px] text-[#574B47] leading-relaxed mb-4">
                    {flavour.notes}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#252321]/10 font-mono text-[11px] text-[#7A6E6A]">
                  <span className="text-[#392A27] font-semibold">PAIRINGS: </span>
                  {flavour.pairings}
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* 
        ========================================================================
        SECTION FOUR — RESPONSIVENESS (THE SIGNATURE FEATURE)
        - Heading: “Beautifully composed. On every screen.”
        - Supporting copy: “From expansive desktop layouts to the intimacy of mobile...”
        - CONTINUOUSLY MOVING RESPONSIVE WEBSITE MARQUEE:
          1. DESKTOP — monitor / browser frame (desktop-hero.png)
          2. TABLET — tablet device (tablet-view.png)
          3. MOBILE — tall smartphone mockup (mobile-view.png)
          4. DESKTOP DETAIL — collection section (desktop-collection.png)
          5. MOBILE DETAIL — custom order / consultation (mobile-detail.png)
        - Seamless infinite horizontal loop
        - Pause on hover & keyboard focus
        - Respects prefers-reduced-motion
        ========================================================================
      */}
      <section 
        id="responsiveness"
        className="relative py-20 sm:py-28 bg-[#FAF6F0] border-y border-[#252321]/10 overflow-hidden"
      >
        
        {/* Section Heading & Context */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-[800px]">
              <div className="inline-flex items-center gap-2 font-mono text-[#B87F83] text-[11px] sm:text-[12px] font-semibold tracking-widest uppercase mb-3 px-3.5 py-1 rounded-full bg-[#B87F83]/10 border border-[#B87F83]/20">
                <Smartphone className="w-3.5 h-3.5 text-[#B87F83]" />
                <span>04 / MULTI-DEVICE ARCHITECTURE</span>
              </div>
              <h2 className="font-playfair text-[34px] sm:text-[48px] lg:text-[56px] font-normal text-[#252321] tracking-tight leading-[1.04] mb-4">
                “Beautifully composed. On every screen.”
              </h2>
              <p className="font-montserrat text-[#574B47] text-[15px] sm:text-[17px] leading-relaxed">
                From expansive desktop layouts to the intimacy of mobile, the experience adapts while preserving its visual character.
              </p>
            </div>

            {/* Marquee Status & Interactive Controls */}
            <div className="flex items-center gap-3 font-mono text-[11px] text-[#7A6E6A] self-start lg:self-end">
              <span className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#252321]/10 shadow-sm">
                <span className={`w-2 h-2 rounded-full ${marqueePaused ? 'bg-[#D97706]' : 'bg-[#10B981] animate-pulse'}`} />
                <span>{marqueePaused ? 'MARQUEE PAUSED' : 'CONTINUOUS SHOWCASE'}</span>
              </span>
              <span className="hidden sm:inline text-[#A69792]">&middot; HOVER TO PAUSE</span>
            </div>
          </div>
        </div>

        {/* 
          ======================================================================
          THE CONTINUOUS RESPONSIVE WEBSITE MARQUEE TRACK
          Dual duplicated sets of 5 devices for seamless infinite loop
          ======================================================================
        */}
        <div 
          className="relative w-full overflow-hidden py-6"
          onMouseEnter={() => setMarqueePaused(true)}
          onMouseLeave={() => setMarqueePaused(false)}
          onFocus={() => setMarqueePaused(true)}
          onBlur={() => setMarqueePaused(false)}
        >
          
          {shouldReduceMotion ? (
            /* Reduced Motion Fallback: Accessible Horizontal Scrollable Track */
            <div className="flex items-center gap-8 overflow-x-auto px-6 py-4 scrollbar-thin">
              {marqueeItems.map((item, idx) => (
                <div key={`static-${idx}`} className="flex-shrink-0">
                  <DeviceMockup item={item} />
                </div>
              ))}
            </div>
          ) : (
            /* Animated Infinite Marquee */
            <div 
              className="flex items-center gap-8 sm:gap-12 w-max"
              style={{
                animation: `maisonMarquee 48s linear infinite`,
                animationPlayState: marqueePaused ? 'paused' : 'running',
              }}
            >
              {/* Set 1 */}
              {marqueeItems.map((item, idx) => (
                <div key={`m1-${idx}`} className="flex-shrink-0">
                  <DeviceMockup item={item} />
                </div>
              ))}

              {/* Set 2 (Identical Duplicate for Seamless Infinite Loop) */}
              {marqueeItems.map((item, idx) => (
                <div key={`m2-${idx}`} className="flex-shrink-0" aria-hidden="true">
                  <DeviceMockup item={item} />
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Marquee Footer Navigation Hint */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-[11px] text-[#7A6E6A]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#392A27]">VERIFIED BREAKPOINTS:</span>
            <span>Desktop (1440px) &middot; Tablet (768px) &middot; Mobile (390px)</span>
          </div>

          <a
            href={MAISON_LIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="inline-flex items-center gap-1.5 text-[#B87F83] hover:text-[#392A27] font-bold transition-colors"
          >
            <span>RESIZE WINDOW ON LIVE SITE</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </section>

      {/* 
        ========================================================================
        SECTION FIVE — GALLERY
        - Heading: “Every detail, made memorable.”
        - Editorial image gallery showcasing actual website:
          1. Homepage hero
          2. Signature cake imagery / collection
          3. Typography and layout details
          4. Custom order / consultation enquiry
          5. Mobile website screen
          6. Distinctive interface section (Flavours & ingredients)
        - Restrained reveals, minimal captions
        ========================================================================
      */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        
        {/* Section Header */}
        <div className="max-w-[800px] mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 font-mono text-[#B87F83] text-[11px] sm:text-[12px] font-semibold tracking-widest uppercase mb-3 px-3.5 py-1 rounded-full bg-[#B87F83]/10 border border-[#B87F83]/20">
            <Palette className="w-3.5 h-3.5 text-[#B87F83]" />
            <span>05 / CURATED GALLERY</span>
          </div>
          <h2 className="font-playfair text-[34px] sm:text-[48px] lg:text-[56px] font-normal text-[#252321] tracking-tight leading-[1.04] mb-4">
            “Every detail, made memorable.”
          </h2>
          <p className="font-montserrat text-[#574B47] text-[15px] sm:text-[17px] leading-relaxed">
            An editorial inspection of key interfaces, custom collection grids, and culinary storytelling touchpoints.
          </p>
        </div>

        {/* Gallery Dynamic Layout */}
        <div className="space-y-8 sm:space-y-12">
          
          {/* Row 1: Full-Width Signature Cake Showcase */}
          <div className="rounded-[28px] sm:rounded-[36px] overflow-hidden bg-white border border-[#252321]/10 shadow-lg group">
            <img
              src="/assets/maison/desktop-collection.png"
              alt="Maison de Sucre Curated Cake Collection Interface"
              className="w-full h-auto object-cover max-h-[720px] transition-transform duration-700 ease-out group-hover:scale-[1.01]"
              loading="lazy"
            />
            <div className="p-6 sm:p-8 bg-white border-t border-[#252321]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#B87F83] font-bold block mb-1">
                  GALLERY ARTIFACT 01 · COLLECTION ARCHITECTURE
                </span>
                <h3 className="font-playfair text-[20px] sm:text-[24px] text-[#252321]">
                  Signature Tiers, Vintage Lambeth &amp; Botanical Commissions
                </h3>
              </div>
              <span className="font-mono text-[11px] text-[#7A6E6A]">
                DESKTOP FLUID BREAKPOINT
              </span>
            </div>
          </div>

          {/* Row 2: Two-Column Split (Interface Anatomy & Mobile Experience) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left: Flavours & Culinary Typography (lg:col-span-7) */}
            <div className="lg:col-span-7 rounded-[28px] overflow-hidden bg-white border border-[#252321]/10 shadow-lg flex flex-col justify-between">
              <div>
                <img
                  src="/assets/maison/desktop-flavours.png"
                  alt="Maison de Sucre Flavours and Ingredients Interface"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6 bg-[#FAF7F2] border-t border-[#252321]/10">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#B87F83] font-bold block mb-1">
                  GALLERY ARTIFACT 02 · BOTANICAL TAXONOMY
                </span>
                <h4 className="font-playfair text-[18px] sm:text-[20px] text-[#252321]">
                  Madagascar Bourbon Vanilla &amp; Silk Swiss Meringue
                </h4>
              </div>
            </div>

            {/* Right: Mobile Viewport & Consultation Flow (lg:col-span-5) */}
            <div className="lg:col-span-5 rounded-[28px] overflow-hidden bg-white border border-[#252321]/10 shadow-lg flex flex-col justify-between">
              <div className="p-8 bg-[#FAF6F0] flex items-center justify-center">
                <div className="w-full max-w-[280px] rounded-[32px] overflow-hidden bg-black p-2 shadow-2xl border border-black/20">
                  <img
                    src="/assets/maison/mobile-booking.png"
                    alt="Maison de Sucre Mobile Booking Interface"
                    className="w-full h-auto rounded-[24px] object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="p-6 bg-[#FAF7F2] border-t border-[#252321]/10">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#B87F83] font-bold block mb-1">
                  GALLERY ARTIFACT 03 · INTIMATE MOBILE UI
                </span>
                <h4 className="font-playfair text-[18px] sm:text-[20px] text-[#252321]">
                  Custom Consultation &amp; Booking Intake Form
                </h4>
              </div>
            </div>

          </div>

          {/* Row 3: Signature 4-Cake Monograph Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {signatureCakes.map((cake, i) => (
              <div
                key={cake.id}
                className="rounded-2xl overflow-hidden bg-white border border-[#252321]/10 shadow-sm flex flex-col justify-between group hover:border-[#B87F83]/40 transition-colors"
              >
                <div className="relative aspect-square overflow-hidden bg-[#FAF6F0]">
                  <img
                    src={cake.image}
                    alt={cake.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-mono text-[10px] font-bold">
                    0{i + 1}
                  </div>
                </div>

                <div className="p-5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#B87F83] font-bold block mb-1">
                    {cake.category}
                  </span>
                  <h4 className="font-playfair text-[18px] text-[#252321] mb-2 leading-snug">
                    {cake.name}
                  </h4>
                  <p className="font-montserrat text-[12px] text-[#574B47] leading-relaxed mb-3">
                    {cake.description}
                  </p>
                  <div className="pt-2 border-t border-[#252321]/10 font-mono text-[10px] text-[#7A6E6A]">
                    PALETTE: {cake.palette}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </section>

      {/* 
        ========================================================================
        SECTION SIX — CLOSING SECTION
        - Closing statement: “Made with care. Designed to be remembered.”
        - Refined final CTA: VISIT MAISON DE SUCRE ↗ (https://maison-de-sucre.vercel.app/)
        - Subtle navigation link back to selected work & next projects
        ========================================================================
      */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24">
        <div className="p-8 sm:p-16 lg:p-20 rounded-[28px] sm:rounded-[40px] bg-[#392A27] text-white border border-white/10 shadow-2xl relative overflow-hidden">
          
          {/* Subtle rose ambient glow */}
          <div 
            className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(184,127,131,0.25) 0%, transparent 70%)'
            }}
          />

          <div className="relative z-10 max-w-[880px] space-y-8">
            
            <div className="inline-flex items-center gap-2 font-mono text-[#E8C9C8] text-[11px] tracking-widest uppercase px-3.5 py-1 rounded-full bg-white/10 border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-[#E8C9C8]" />
              <span>OUTCOME &middot; NORTHUP STUDIO</span>
            </div>

            <blockquote className="font-playfair text-[28px] sm:text-[42px] lg:text-[48px] italic font-normal text-white/95 leading-tight">
              “Made with care. Designed to be remembered.”
            </blockquote>

            <p className="font-montserrat text-white/75 text-[15px] sm:text-[17px] leading-relaxed max-w-[720px]">
              Maison de Sucre stands as proof that culinary artisans deserve the same calibre of digital curation as haute couture houses and architecture practices.
            </p>

            {/* Refined Final CTA */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <a
                href={MAISON_LIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit live Maison de Sucre website (opens in a new tab)"
                data-cursor="hover"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4.5 rounded-full bg-[#E8C9C8] hover:bg-white text-[#392A27] font-mono text-[12px] sm:text-[13px] font-bold tracking-widest uppercase transition-all duration-300 shadow-xl active:scale-95"
              >
                <span>VISIT MAISON DE SUCRE ↗</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>

              <span className="font-mono text-[11px] text-white/60 italic">
                “Experience the project in its entirety.”
              </span>
            </div>

            {/* Navigation links back to selected work & next projects */}
            <div className="pt-8 border-t border-white/15 flex flex-wrap items-center gap-4">
              <a
                href="/#work"
                onClick={(e) => {
                  e.preventDefault()
                  onNavigate('/#work')
                }}
                data-cursor="hover"
                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#392A27] font-mono text-[11px] font-bold tracking-wider uppercase transition-all shadow-sm inline-flex items-center"
              >
                &larr; BACK TO ALL WORK
              </a>

              <a
                href="/work/aurex-performance-club"
                onClick={(e) => {
                  e.preventDefault()
                  onNavigate('/work/aurex-performance-club')
                }}
                data-cursor="hover"
                className="px-6 py-3 rounded-full bg-[#181918] hover:bg-[#C6FF00] text-white hover:text-[#090A09] border border-white/20 font-mono text-[11px] font-bold tracking-wider uppercase transition-all shadow-sm flex items-center gap-2"
              >
                <span>NEXT: AUREX CLUB</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <a
                href="/work/atelier-estates"
                onClick={(e) => {
                  e.preventDefault()
                  onNavigate('/work/atelier-estates')
                }}
                data-cursor="hover"
                className="px-6 py-3 rounded-full bg-[#9B5D3E] hover:bg-[#B36E49] text-white font-mono text-[11px] font-bold tracking-wider uppercase transition-all shadow-sm flex items-center gap-2"
              >
                <span>ATELIER ESTATES</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#D8CDBC]" />
              </a>

              <button
                type="button"
                onClick={() => onOpenContact('Project Inquiry: Inspired by Maison de Sucre')}
                data-cursor="hover"
                className="px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 text-white font-mono text-[11px] font-bold tracking-wider uppercase transition-all"
              >
                <span>COMMISSION WORK</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 
        ========================================================================
        GLOBAL NORTHUP STUDIO FOOTER
        ========================================================================
      */}
      <Footer onOpenContact={onOpenContact} onNavigate={onNavigate} />

      {/* Embedded Marquee Animation CSS Keyframe */}
      <style>{`
        @keyframes maisonMarquee {
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
 * Helper Sub-Component: Device Mockup Chassis for Marquee
 */
function DeviceMockup({ item }) {
  if (item.type === 'desktop' || item.type === 'desktop-detail') {
    return (
      <div className={`relative ${item.aspect} ${item.elevation} transition-transform duration-300 hover:scale-[1.015] group`}>
        <div className="w-full h-full rounded-[20px] sm:rounded-[24px] overflow-hidden bg-[#252321] border border-black/20 shadow-[0_20px_50px_rgba(57,42,39,0.22)] flex flex-col">
          {/* Browser Header Bar */}
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 bg-[#302B29] border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E8C9C8]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#E9DDCA]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#B87F83]/80" />
            </div>

            <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/40 text-[9px] font-mono text-[#E9DDCA]">
              <Lock className="w-2.5 h-2.5 text-[#E8C9C8]" />
              <span className="tracking-tight">maison-de-sucre.vercel.app</span>
            </div>

            <div className="font-mono text-[9px] text-white/50 uppercase">
              1440PX
            </div>
          </div>

          {/* Screenshot Viewport */}
          <div className="relative w-full flex-1 overflow-hidden bg-[#FAF6F0]">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover object-top"
              loading="lazy"
            />
          </div>
        </div>

        {/* Caption Tag */}
        <div className="mt-3 text-center">
          <span className="font-mono text-[10px] text-[#7A6E6A] uppercase tracking-wider block">
            {item.label}
          </span>
          <span className="font-playfair text-[13px] text-[#392A27] font-medium">
            {item.title}
          </span>
        </div>
      </div>
    )
  }

  if (item.type === 'tablet') {
    return (
      <div className={`relative ${item.aspect} ${item.elevation} transition-transform duration-300 hover:scale-[1.015] group`}>
        <div className="w-full h-full rounded-[26px] sm:rounded-[30px] p-2 sm:p-2.5 bg-[#252321] border border-black/25 shadow-[0_20px_50px_rgba(57,42,39,0.22)] flex flex-col">
          {/* Front camera bezel indicator */}
          <div className="w-2 h-2 rounded-full bg-black/60 mx-auto mb-1.5 flex-shrink-0" />

          {/* Screenshot Viewport */}
          <div className="relative w-full flex-1 rounded-[18px] sm:rounded-[22px] overflow-hidden bg-[#FAF6F0]">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover object-top"
              loading="lazy"
            />
          </div>
        </div>

        {/* Caption Tag */}
        <div className="mt-3 text-center">
          <span className="font-mono text-[10px] text-[#7A6E6A] uppercase tracking-wider block">
            {item.label}
          </span>
          <span className="font-playfair text-[13px] text-[#392A27] font-medium">
            {item.title}
          </span>
        </div>
      </div>
    )
  }

  // Smartphone Mockup (Mobile / Mobile Detail)
  return (
    <div className={`relative ${item.aspect} ${item.elevation} transition-transform duration-300 hover:scale-[1.02] group`}>
      <div className="w-full h-full rounded-[30px] sm:rounded-[36px] p-2 bg-[#252321] border-2 border-[#392A27] shadow-[0_20px_50px_rgba(57,42,39,0.24)] flex flex-col">
        {/* Dynamic Island pill */}
        <div className="w-16 h-3 rounded-full bg-black mx-auto mb-1 flex-shrink-0" />

        {/* Screenshot Viewport */}
        <div className="relative w-full flex-1 rounded-[22px] sm:rounded-[28px] overflow-hidden bg-[#FAF6F0]">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover object-top"
            loading="lazy"
          />
        </div>
      </div>

      {/* Caption Tag */}
      <div className="mt-3 text-center">
        <span className="font-mono text-[10px] text-[#7A6E6A] uppercase tracking-wider block">
          {item.label}
        </span>
        <span className="font-playfair text-[13px] text-[#392A27] font-medium">
          {item.title}
        </span>
      </div>
    </div>
  )
}
