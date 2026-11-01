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
  Sparkles, 
  Crosshair, 
  Compass, 
  Maximize2,
  Check,
  ChevronRight,
  Shield,
  Flame,
  Camera,
  ShoppingBag,
  Info,
  Sliders,
  Tag
} from 'lucide-react'
import Footer from '../components/Footer'

// ─────────────────────────────────────────────────────────────────────────────
// NORTHUP STUDIO × DROP CULT CASE STUDY
// Creative Direction: Independent Streetwear Magazine / Underground Fashion Editorial
// Palette: Washed Black #242522 · Warm Off-White #F1EFE8 · Concrete Grey #C9C7BF
//          Muted Olive #777B61 · Deep Charcoal #343531 · Signal Orange #D95B40
//          Drop Cult Acid Accent #D8FF00
// ─────────────────────────────────────────────────────────────────────────────

const DROP_CULT_LIVE_URL = 'https://drop-cult-zeta.vercel.app/'

// Micro reveal wrapper with smooth easing
function RevealBlock({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function DropCultCaseStudy({ onNavigate, onOpenContact }) {
  const shouldReduceMotion = useReducedMotion()
  const [marqueePaused, setMarqueePaused] = useState(false)
  const [activeLook, setActiveLook] = useState('look-01')
  const [responsiveMode, setResponsiveMode] = useState('all') // 'all' | 'desktop' | 'tablet' | 'mobile'

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  // ── Authentic Drop Cult Products for Moving Lookbook ───────────────────────
  const collectionPieces = [
    {
      id: 'dc-01',
      number: 'ITEM 01',
      title: 'HYPER-VOID ACID WASH HEAVY TEE',
      fabric: '300 GSM COMBED COTTON',
      fit: 'OVERSIZED BOXY FIT',
      price: '₹2,499',
      edition: 'EDITION 001 // CORE',
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80',
      badge: 'NEW DROP'
    },
    {
      id: 'dc-02',
      number: 'ITEM 02',
      title: 'SUB-ZERO 450 GSM HEAVY FLEECE HOODIE',
      fabric: '450 GSM FRENCH TERRY',
      fit: 'BALLOON SLEEVE HOODIE',
      price: '₹4,299',
      edition: 'EDITION 002 // ARCTIC',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=80',
      badge: 'BESTSELLER'
    },
    {
      id: 'dc-03',
      number: 'ITEM 03',
      title: 'TACTICAL PARACHUTE CARGO TROUSERS',
      fabric: '240 GSM RIPSTOP NYLON-COTTON',
      fit: 'WIDE LEG CONVERTIBLE BAGGIE',
      price: '₹3,899',
      edition: 'EDITION 003 // TECH',
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80',
      badge: 'NEW DROP'
    },
    {
      id: 'dc-04',
      number: 'ITEM 04',
      title: 'DISTRICT RAW-HEM OVERSHIRT',
      fabric: '340 GSM RAW COTTON TWILL',
      fit: 'SQUARE CUT BOX OVERSHIRT',
      price: '₹3,499',
      edition: 'EDITION 005 // ATELIER',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80',
      badge: 'STAFF PICK'
    },
    {
      id: 'dc-05',
      number: 'ITEM 05',
      title: 'CULT EMBROIDERED BALACLAVA BEANIE',
      fabric: 'HEAVY ACRYLIC RIB KNIT',
      fit: 'DUAL WEAR CONVERTIBLE',
      price: '₹1,299',
      edition: 'EDITION 006 // COLD HARBOR',
      image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=900&q=80',
      badge: 'NEW DROP'
    },
    {
      id: 'dc-06',
      number: 'ITEM 06',
      title: 'NEO-CYBER GLITCH BOXY CREW',
      fabric: '280 GSM BIO-WASHED COTTON',
      fit: 'BOXY RELAXED FIT',
      price: '₹2,199',
      edition: 'EDITION 004 // CYBER CULT',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
      badge: 'LIMITED RUN'
    },
    {
      id: 'dc-07',
      number: 'ITEM 07',
      title: 'SUB-LEVEL THERMAL LAYERED LONGSLEEVE',
      fabric: '320 GSM WAFFLE THERMAL + JERSEY',
      fit: 'DOUBLE SLEEVE MOCK LAYER',
      price: '₹2,799',
      edition: 'EDITION 007 // MODULAR',
      image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=80',
      badge: 'NEW DROP'
    },
    {
      id: 'dc-08',
      number: 'ITEM 08',
      title: 'UTILITY HARDWARE CROSSBODY BAG',
      fabric: '1000D BALLISTIC CORDURA',
      fit: 'ERGONOMIC CHEST SLING',
      price: '₹1,899',
      edition: 'EDITION 008 // HARDWARE',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
      badge: 'BESTSELLER'
    }
  ]

  // ── Authentic Drop Cult Lookbook Editorial Spreads ──────────────────────────
  const lookbookSpreads = [
    {
      id: 'look-01',
      lookNumber: '01',
      title: 'DAILY UNIFORM',
      theme: 'BRUTALIST MONOCHROME',
      subtitle: 'CONCRETE MONOLITHS & OVERSIZED PROPORTIONS',
      description: 'When the city is relentless, your fit has to speak without apology. Hyper-void 300 GSM acid wash tee dropped over tactical cargo trousers with drawstring hems locked tight.',
      shutter: '35MM LEICA M6 · 1/500s · f/2.0',
      location: 'UNDERPASS PIER 9, METRO NORTH',
      featuredItems: [
        'HYPER-VOID ACID WASH HEAVY TEE (₹2,499)',
        'TACTICAL PARACHUTE CARGO (₹3,899)',
        'UTILITY CROSSBODY BAG (₹1,899)'
      ],
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
    },
    {
      id: 'look-02',
      lookNumber: '02',
      title: 'AFTER HOURS',
      theme: 'NIGHT VISIBILITY',
      subtitle: 'FLASH PHOTOGRAPHY & ACID HIGHLIGHTS',
      description: 'Engineered for 2 AM subway platforms and underground warehouse sessions. 450 GSM heavyweight French Terry fleece with electric lime structural safety stitches that catch halogen beams.',
      shutter: 'CONTRAST FLASH · 50MM · 1/250s · f/1.8',
      location: 'INDUSTRIAL ROOFTOP LOT 4, DISTRICT 3',
      featuredItems: [
        'SUB-ZERO 450 GSM FLEECE HOODIE (₹4,299)',
        'CULT CONVERTIBLE BALACLAVA (₹1,299)',
        'RAW TWILL OVERSHIRT (₹3,499)'
      ],
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
    },
    {
      id: 'look-03',
      lookNumber: '03',
      title: 'OWN THE STREET',
      theme: 'RAW ATELIER CUT',
      subtitle: 'TEXTURE CLASH & UNAPOLOGETIC ATTITUDE',
      description: 'Break the mold. Distressed raw-hem canvas overshirt combined with reflective neo-cyber graphics and modular technical accessories for those who reject fast-fashion calendars.',
      shutter: 'MEDIUM FORMAT RAW · 1/160s · f/1.4',
      location: 'ALLEYWAY STUDIO 12, SUB-LEVEL',
      featuredItems: [
        'DISTRICT RAW-HEM OVERSHIRT (₹3,499)',
        'NEO-CYBER GLITCH BOXY CREW (₹2,199)',
        'UTILITY HARDWARE CROSSBODY (₹1,899)'
      ],
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85',
    }
  ]

  const activeLookData = lookbookSpreads.find(l => l.id === activeLook) || lookbookSpreads[0]

  return (
    <article className="min-h-screen bg-[#242522] text-[#F1EFE8] font-inter selection:bg-[#D8FF00] selection:text-[#242522] overflow-x-hidden pt-20 sm:pt-28">
      
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SECTION 01 — COVER STORY                                            */}
      {/* Editorial Fashion-Magazine Opening with Prominent Viewport CTA      */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section className="relative px-3 sm:px-6 lg:px-12 pb-16 sm:pb-24 max-w-[1440px] mx-auto border-b border-white/10">
        
        {/* Top Editorial Index Bar & Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-b border-white/15 text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-[#C9C7BF]">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('/#work')}
              data-cursor="hover"
              className="inline-flex items-center gap-2 text-[#F1EFE8] hover:text-[#D8FF00] transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              <span>NORTHUP STUDIO / SELECTED WORK</span>
            </button>
            <span className="hidden sm:inline text-white/30">|</span>
            <span className="hidden sm:inline text-[#777B61]">VOL. 04 // STREET EDITORIAL</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="bg-[#343531] text-[#D8FF00] px-2.5 py-0.5 rounded-none font-bold tracking-wider">
              ISSUE № 04
            </span>
            <span>EDITION 2026</span>
          </div>
        </div>

        {/* Masthead & Title Composition */}
        <div className="pt-8 sm:pt-14 pb-8 sm:pb-12">
          
          {/* Small Category Label */}
          <RevealBlock delay={0.05}>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 bg-[#D8FF00]" />
              <p className="font-mono text-[11px] sm:text-[13px] tracking-[0.25em] text-[#C9C7BF] uppercase">
                STREETWEAR / DIGITAL EXPERIENCE
              </p>
            </div>
          </RevealBlock>

          {/* Massive Editorial Project Title */}
          <RevealBlock delay={0.1}>
            <div className="relative">
              <h1 className="font-anton text-[68px] sm:text-[110px] md:text-[150px] lg:text-[195px] leading-[0.88] tracking-tight text-[#F1EFE8] uppercase select-none">
                DROP CULT
              </h1>
              {/* Offset Print Mark Overlay */}
              <div className="hidden lg:flex absolute right-0 top-3 flex-col items-end text-right font-mono text-[10px] text-[#C9C7BF] leading-relaxed">
                <span>SPEC: 280–450 GSM HEAVYWEIGHT</span>
                <span>GRID: ASYMMETRIC / EDITORIAL</span>
                <span>STATUS: LIVE IN PRODUCTION</span>
                <span className="text-[#D8FF00] font-bold">100% UNAPOLOGETIC</span>
              </div>
            </div>
          </RevealBlock>

          {/* Main Headline & Supporting Manifesto in Two-Column Asymmetric Spread */}
          <div className="mt-6 sm:mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Bold Headline & Copy */}
            <div className="lg:col-span-7">
              <RevealBlock delay={0.15}>
                <h2 className="font-syne text-[28px] sm:text-[42px] lg:text-[50px] font-extrabold leading-[1.05] tracking-tight text-[#F1EFE8] uppercase mb-5">
                  “NOT MADE TO BLEND IN.”
                </h2>
                <p className="text-[16px] sm:text-[18px] lg:text-[20px] text-[#C9C7BF] font-normal leading-relaxed max-w-[580px]">
                  A streetwear digital experience built around attitude, visual culture, and a sharper way to explore the collection. Designed for the ones who treat getting dressed like personal armor.
                </p>
              </RevealBlock>

              {/* PRIMARY CTA — IMPOSSIBLE TO MISS IN THE INITIAL VIEWPORT */}
              <RevealBlock delay={0.2} className="mt-8 sm:mt-10">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <a
                    href={DROP_CULT_LIVE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="hover"
                    aria-label="Explore live DROP CULT website (opens in a new tab)"
                    className="group relative inline-flex items-center justify-between sm:justify-center gap-4 px-8 py-4 sm:py-5 bg-[#D8FF00] text-[#242522] font-mono font-bold text-[13px] sm:text-[15px] uppercase tracking-wider transition-all duration-300 hover:bg-[#F1EFE8] hover:shadow-[0_0_30px_rgba(216,255,0,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#242522]"
                  >
                    <span className="tracking-widest">EXPLORE LIVE WEBSITE</span>
                    <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    
                    {/* Corner Accent Marks */}
                    <span className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-[#D8FF00]" />
                    <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-[#D8FF00]" />
                  </a>

                  <div className="flex items-center gap-2 text-white/50 font-mono text-[11px] px-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D8FF00] animate-pulse" />
                    <span>VERIFIED LIVE PRODUCTION · DROP-CULT-ZETA.VERCEL.APP</span>
                  </div>
                </div>
              </RevealBlock>
            </div>

            {/* Right Column: Authentic Project Metadata Box */}
            <div className="lg:col-span-5 bg-[#343531]/80 backdrop-blur-sm border border-white/15 p-6 sm:p-8">
              <RevealBlock delay={0.22}>
                <div className="border-b border-white/15 pb-4 mb-5 flex items-center justify-between">
                  <span className="font-mono text-[11px] tracking-widest text-[#D8FF00] uppercase">
                    PROJECT DOSSIER // № 04
                  </span>
                  <span className="font-mono text-[10px] text-[#C9C7BF]">
                    INDEX / FW-26
                  </span>
                </div>

                <div className="space-y-4 font-mono text-[12px] sm:text-[13px]">
                  <div className="flex items-baseline justify-between py-1.5 border-b border-white/5">
                    <span className="text-[#C9C7BF] uppercase tracking-wider">PROJECT</span>
                    <span className="text-[#F1EFE8] font-bold">DROP CULT</span>
                  </div>
                  <div className="flex items-baseline justify-between py-1.5 border-b border-white/5">
                    <span className="text-[#C9C7BF] uppercase tracking-wider">CATEGORY</span>
                    <span className="text-[#F1EFE8]">STREETWEAR</span>
                  </div>
                  <div className="flex items-baseline justify-between py-1.5 border-b border-white/5">
                    <span className="text-[#C9C7BF] uppercase tracking-wider">SERVICES</span>
                    <span className="text-[#F1EFE8] text-right">WEBSITE DESIGN & DEVELOPMENT</span>
                  </div>
                  <div className="flex items-baseline justify-between py-1.5 border-b border-white/5">
                    <span className="text-[#C9C7BF] uppercase tracking-wider">STUDIO</span>
                    <span className="text-[#D8FF00] font-bold">NORTHUP STUDIO</span>
                  </div>
                  <div className="flex items-baseline justify-between py-1.5">
                    <span className="text-[#C9C7BF] uppercase tracking-wider">SEASON</span>
                    <span className="text-[#F1EFE8]">WINTER-SPRING 2026 ARCHIVE</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-dashed border-white/20 flex items-center justify-between text-[10px] font-mono text-[#C9C7BF]">
                  <span>FABRIC: 280–450 GSM</span>
                  <span>CUT: OVERSIZED BOXY</span>
                  <span>ORIGIN: ATELIER IND</span>
                </div>
              </RevealBlock>
            </div>

          </div>

        </div>

        {/* Hero Magazine Cover Display (Desktop Captured Hero with tactile print elements) */}
        <RevealBlock delay={0.25} className="mt-4 sm:mt-8">
          <div className="relative border border-white/20 bg-[#1F201D] overflow-hidden group shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            
            {/* Magazine Header Bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#181917] border-b border-white/10 font-mono text-[11px] text-[#C9C7BF]">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D95B40]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#C9C7BF]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#777B61]" />
                <span className="ml-2 text-white font-bold hidden sm:inline">DROP CULT STOREFRONT VIEWPORT</span>
              </div>
              <div className="flex items-center gap-4 text-[10px] sm:text-[11px]">
                <span className="hidden md:inline text-[#777B61]">1440 × 900 REFERENCE DESKTOP</span>
                <a
                  href={DROP_CULT_LIVE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D8FF00] hover:underline flex items-center gap-1 font-bold"
                >
                  <span>LIVE TAB ↗</span>
                </a>
              </div>
            </div>

            {/* Real Desktop Screenshot */}
            <div className="relative aspect-[16/9] sm:aspect-[16/10] w-full overflow-hidden bg-black">
              <img
                src="/assets/dropcult/desktop-hero.png"
                alt="DROP CULT Website Desktop Hero - Not Made To Blend In"
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.01]"
              />

              {/* Editorial Stamp Overlay */}
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-[#242522]/90 backdrop-blur-md border border-white/20 px-4 py-3 font-mono text-[11px] text-[#F1EFE8] max-w-[280px] sm:max-w-[340px]">
                <div className="flex items-center justify-between text-[#D8FF00] font-bold mb-1">
                  <span>FIG. 01 — HERO SPREAD</span>
                  <span>100% LIVE</span>
                </div>
                <p className="text-[11px] text-[#C9C7BF] leading-snug">
                  High-contrast typography, interactive cart slide-over, and heavyweight catalog navigation.
                </p>
              </div>

              {/* Barcode Graphic on Right */}
              <div className="hidden sm:flex absolute bottom-6 right-6 flex-col items-end gap-1 bg-[#242522]/90 backdrop-blur-md border border-white/20 px-3 py-2 font-mono text-[9px] text-[#C9C7BF]">
                <div className="h-6 w-24 flex items-stretch gap-[2px]">
                  <span className="w-1 bg-white" />
                  <span className="w-[1px] bg-white" />
                  <span className="w-2 bg-white" />
                  <span className="w-[1px] bg-transparent" />
                  <span className="w-1 bg-white" />
                  <span className="w-[3px] bg-white" />
                  <span className="w-[1px] bg-white" />
                  <span className="w-2 bg-white" />
                  <span className="w-[1px] bg-white" />
                  <span className="w-[2px] bg-white" />
                </div>
                <span>DC-ARCHIVE-2026</span>
              </div>
            </div>

          </div>
        </RevealBlock>

      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SECTION 02 — THE CULTURE                                            */}
      {/* Editorial Spread: Warm Off-White Surface with Deep Charcoal Type    */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#F1EFE8] text-[#242522] py-20 sm:py-28 px-3 sm:px-6 lg:px-12 border-b border-[#242522]/15">
        <div className="max-w-[1440px] mx-auto">
          
          {/* Section Marker */}
          <RevealBlock delay={0.05}>
            <div className="flex items-center justify-between pb-6 mb-12 border-b border-[#242522]/20 font-mono text-[11px] tracking-widest text-[#777B61] uppercase">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-[#242522]" />
                <span>02 // THE CULTURE</span>
              </div>
              <span>EDITORIAL MANIFESTO & ATTITUDE</span>
            </div>
          </RevealBlock>

          {/* Section Heading */}
          <RevealBlock delay={0.1}>
            <div className="max-w-[960px] mb-12 sm:mb-16">
              <h2 className="font-anton text-[42px] sm:text-[68px] lg:text-[88px] leading-[0.95] tracking-tight uppercase text-[#242522]">
                “MORE THAN A FIT. A POINT OF VIEW.”
              </h2>
            </div>
          </RevealBlock>

          {/* Asymmetric Magazine Spread: Large Photography on Left, Manifesto on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Left: Striking 35mm Campaign Image + Tactile Editorial Caption */}
            <div className="lg:col-span-5">
              <RevealBlock delay={0.15}>
                <div className="relative border border-[#242522]/30 bg-[#242522] p-2.5 shadow-xl">
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#242522]">
                    <img
                      src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85"
                      alt="Drop Cult Street Campaign Photography - Brutalist Monochrome"
                      className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
                    />
                    {/* Badge */}
                    <div className="absolute top-4 left-4 bg-[#D8FF00] text-[#242522] font-mono text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                      PLATE № 04 / LEICA M6
                    </div>
                  </div>

                  {/* Editorial Caption Below Image */}
                  <div className="pt-3 pb-1 px-1 font-mono text-[11px] text-[#777B61] flex items-center justify-between border-t border-[#242522]/15 mt-2">
                    <span>UNDERPASS PIER 9 // METRO NORTH</span>
                    <span className="text-[#242522] font-bold">300 GSM ACID WASH</span>
                  </div>
                </div>
              </RevealBlock>

              {/* Secondary Authentic Crop: Manifesto detail from real website */}
              <RevealBlock delay={0.2} className="mt-8">
                <div className="border border-[#242522]/20 p-5 bg-white/60">
                  <span className="font-mono text-[10px] text-[#777B61] uppercase tracking-wider block mb-2">
                    WEBSITE VERIFIED MANIFESTO INTERACTION
                  </span>
                  <img
                    src="/assets/dropcult/desktop-manifesto.png"
                    alt="Authentic Drop Cult Manifesto section capture"
                    className="w-full h-auto border border-[#242522]/15 shadow-sm"
                  />
                  <p className="mt-3 font-mono text-[10px] text-[#777B61] leading-relaxed">
                    Fig 2.1 — Direct screen capture from live Drop Cult website demonstrating raw typographic rhythm and heavyweight brand philosophy.
                  </p>
                </div>
              </RevealBlock>
            </div>

            {/* Right: Authentic Manifesto, Typography & Atelier Notes */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              
              <RevealBlock delay={0.15}>
                <div className="font-mono text-[12px] sm:text-[13px] tracking-wider text-[#777B61] uppercase mb-4">
                  DROP CULT WAS FOUNDED ON A SIMPLE REJECTION:
                </div>

                <h3 className="font-syne text-[32px] sm:text-[46px] lg:text-[56px] font-extrabold leading-[1.02] tracking-tight uppercase text-[#242522] mb-8">
                  YOUR FIT.<br />YOUR RULES.<br />YOUR WORLD.
                </h3>
              </RevealBlock>

              {/* Authentic Paragraphs from Live Site */}
              <RevealBlock delay={0.2} className="space-y-6 text-[16px] sm:text-[18px] leading-relaxed text-[#343531]">
                <p>
                  We were tired of fast-fashion racks flooded with fragile polyester, copied Pinterest graphics, and clothes designed to disintegrate after three washes.
                </p>
                <p>
                  <strong className="text-[#242522] font-semibold">DROP CULT</strong> is built for the kids standing on the pavement outside midnight gigs, the creators editing videos at 3 AM in dimly lit rooms, and everyone who treats getting dressed like personal armor.
                </p>
                <p>
                  Every drop is crafted with <span className="underline decoration-[#777B61] decoration-2 underline-offset-4 font-semibold">280 to 450 GSM pure combed cotton</span>, hard-wearing reinforced seams, custom raw dyes, and exaggerated boxy silhouettes made to take over any room you walk into.
                </p>
              </RevealBlock>

              {/* Bold Fashion Manifesto Pull Quote */}
              <RevealBlock delay={0.25} className="mt-10 sm:mt-12 pt-8 border-t-2 border-[#242522]">
                <blockquote className="font-anton text-[26px] sm:text-[36px] lg:text-[44px] uppercase leading-[1.1] text-[#242522]">
                  “IF YOU DON'T FEEL BULLETPROOF IN YOUR CLOTHES, YOU'RE WEARING THE WRONG SHIT.”
                </blockquote>
                <cite className="font-mono text-[12px] sm:text-[13px] tracking-widest text-[#777B61] uppercase mt-4 block not-italic">
                  — DROP CULT ATELIER NOTES / PRODUCTION LOG
                </cite>
              </RevealBlock>

              {/* Specification Grid */}
              <RevealBlock delay={0.3} className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-[#242522]/20">
                <div className="p-3 bg-[#E5E3DC] border border-[#242522]/15">
                  <span className="block font-mono text-[10px] text-[#777B61] uppercase">WEIGHT CLASS</span>
                  <span className="font-mono text-[15px] font-bold text-[#242522]">280–450 GSM</span>
                </div>
                <div className="p-3 bg-[#E5E3DC] border border-[#242522]/15">
                  <span className="block font-mono text-[10px] text-[#777B61] uppercase">SILHOUETTE</span>
                  <span className="font-mono text-[15px] font-bold text-[#242522]">BOXY & DROPPED</span>
                </div>
                <div className="col-span-2 sm:col-span-1 p-3 bg-[#E5E3DC] border border-[#242522]/15">
                  <span className="block font-mono text-[10px] text-[#777B61] uppercase">FABRIC</span>
                  <span className="font-mono text-[15px] font-bold text-[#242522]">100% COMBED COTTON</span>
                </div>
              </RevealBlock>

            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SECTION 03 — THE DIGITAL LOOKBOOK                                   */}
      {/* Moving Horizontal Contact Sheet + Interactive Look Inspector        */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#1F201D] text-[#F1EFE8] py-20 sm:py-28 border-b border-white/10">
        
        {/* Section Header */}
        <div className="px-3 sm:px-6 lg:px-12 max-w-[1440px] mx-auto mb-10 sm:mb-14">
          <RevealBlock delay={0.05}>
            <div className="flex items-center justify-between pb-6 border-b border-white/15 font-mono text-[11px] tracking-widest text-[#C9C7BF] uppercase">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-[#D8FF00]" />
                <span>03 // THE DIGITAL LOOKBOOK</span>
              </div>
              <span>CONTINUOUS RUNWAY TRACK & ARCHIVE</span>
            </div>
          </RevealBlock>

          <RevealBlock delay={0.1} className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="font-anton text-[42px] sm:text-[68px] lg:text-[88px] leading-[0.95] tracking-tight uppercase text-[#F1EFE8]">
                “THE COLLECTION, IN ITS ELEMENT.”
              </h2>
              <p className="mt-3 text-[#C9C7BF] font-mono text-[13px] sm:text-[15px] max-w-[620px]">
                A continuous fashion contact sheet capturing authentic drops, heavyweight textures, and oversized cuts from the DROP CULT collection.
              </p>
            </div>

            {/* Marquee Motion Controls & Notice */}
            <div className="flex items-center gap-3 font-mono text-[11px] text-[#C9C7BF]">
              <span className="hidden sm:inline">HOVER TO PAUSE TRACK</span>
              <button
                type="button"
                onClick={() => setMarqueePaused(!marqueePaused)}
                data-cursor="hover"
                className="px-3 py-1.5 bg-[#343531] hover:bg-[#D8FF00] hover:text-[#242522] border border-white/15 text-[10px] uppercase font-bold tracking-wider transition-colors"
              >
                {marqueePaused ? 'RESUME MOTION ▶' : 'PAUSE MOTION ⏸'}
              </button>
            </div>
          </RevealBlock>
        </div>

        {/* ── MOVING HORIZONTAL MARQUEE CONTACT SHEET ──────────────────────── */}
        <div 
          className="relative w-full overflow-hidden py-4 border-y border-white/10 select-none"
          onMouseEnter={() => setMarqueePaused(true)}
          onMouseLeave={() => setMarqueePaused(false)}
        >
          {/* Subtle Side Vignettes */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-[#1F201D] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-[#1F201D] to-transparent z-10" />

          {/* Marquee Track (Smooth Infinite CSS Marquee with Framer fallback) */}
          <div className="flex gap-5 sm:gap-7 w-max">
            <motion.div
              animate={shouldReduceMotion || marqueePaused ? { x: 0 } : { x: ['0%', '-50%'] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: 48,
                  ease: 'linear',
                }
              }}
              className="flex gap-5 sm:gap-7 flex-shrink-0"
            >
              {/* Double items for seamless infinite loop */}
              {[...collectionPieces, ...collectionPieces].map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="w-[280px] sm:w-[320px] lg:w-[360px] flex-shrink-0 bg-[#242522] border border-white/15 group relative transition-all duration-300 hover:border-[#D8FF00]"
                >
                  {/* Card Header Tag */}
                  <div className="px-3 py-2 bg-[#181917] border-b border-white/10 flex items-center justify-between font-mono text-[10px] text-[#C9C7BF]">
                    <span className="text-[#D8FF00] font-bold">{item.number}</span>
                    <span>{item.edition}</span>
                    <span className="bg-[#D95B40]/20 text-[#D95B40] px-1.5 py-0.2 rounded-none text-[9px] font-bold">
                      {item.badge}
                    </span>
                  </div>

                  {/* Product Visual */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-black">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Quick spec overlay on hover */}
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-90 transition-opacity">
                      <span className="inline-block bg-[#D8FF00] text-[#242522] font-mono text-[10px] font-extrabold px-2 py-0.5 mb-1">
                        {item.fabric}
                      </span>
                      <p className="font-anton text-[16px] text-white tracking-wide uppercase line-clamp-1">
                        {item.title}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer Info */}
                  <div className="p-3 bg-[#242522] flex items-center justify-between font-mono text-[11px]">
                    <span className="text-[#C9C7BF]">{item.fit}</span>
                    <span className="text-[#F1EFE8] font-bold text-[13px]">{item.price}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ── INTERACTIVE LOOKBOOK EDITORIAL INSPECTOR ────────────────────── */}
        <div className="px-3 sm:px-6 lg:px-12 max-w-[1440px] mx-auto mt-16 sm:mt-24">
          <RevealBlock delay={0.1}>
            <div className="border border-white/20 bg-[#242522] p-4 sm:p-8">
              
              {/* Header with Look Selector Buttons */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/15">
                <div>
                  <span className="font-mono text-[10px] text-[#D8FF00] tracking-widest uppercase block mb-1">
                    ATELIER CAMPAIGN EDITORIAL
                  </span>
                  <h3 className="font-syne text-[24px] sm:text-[32px] font-bold uppercase text-[#F1EFE8]">
                    STREET SPREAD SERIES // ISSUE 04
                  </h3>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap items-center gap-2">
                  {lookbookSpreads.map(look => (
                    <button
                      key={look.id}
                      type="button"
                      onClick={() => setActiveLook(look.id)}
                      data-cursor="hover"
                      className={`px-4 py-2 font-mono text-[11px] font-bold tracking-wider uppercase transition-all ${
                        activeLook === look.id
                          ? 'bg-[#D8FF00] text-[#242522]'
                          : 'bg-[#343531] text-[#C9C7BF] hover:bg-white/10'
                      }`}
                    >
                      LOOK {look.lookNumber} : {look.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Look Content Display */}
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Look Photo */}
                <div className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden border border-white/15 bg-black">
                  <img
                    src={activeLookData.image}
                    alt={activeLookData.title}
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                  
                  {/* Camera Shutter Stamp */}
                  <div className="absolute top-4 left-4 bg-[#242522]/90 backdrop-blur-md border border-white/20 px-3 py-1 font-mono text-[10px] text-[#D8FF00] uppercase">
                    {activeLookData.shutter}
                  </div>
                  
                  <div className="absolute bottom-4 right-4 bg-[#242522]/90 backdrop-blur-md border border-white/20 px-3 py-1 font-mono text-[10px] text-[#F1EFE8] uppercase">
                    {activeLookData.location}
                  </div>
                </div>

                {/* Look Breakdown & Garment Specs */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                  <div>
                    <span className="font-mono text-[11px] text-[#777B61] tracking-widest uppercase block mb-1">
                      LOOK {activeLookData.lookNumber} // {activeLookData.theme}
                    </span>
                    <h4 className="font-anton text-[32px] sm:text-[44px] uppercase text-[#F1EFE8] leading-tight">
                      {activeLookData.title}
                    </h4>
                    <p className="font-mono text-[12px] text-[#D8FF00] uppercase tracking-wider mt-1 mb-4">
                      {activeLookData.subtitle}
                    </p>
                    <p className="text-[14px] sm:text-[15px] text-[#C9C7BF] leading-relaxed">
                      {activeLookData.description}
                    </p>
                  </div>

                  {/* Featured garments list */}
                  <div className="p-4 bg-[#181917] border border-white/10">
                    <span className="font-mono text-[10px] text-[#C9C7BF] uppercase tracking-wider block mb-2">
                      FEATURED RUNWAY PIECES:
                    </span>
                    <ul className="space-y-1.5 font-mono text-[12px] text-[#F1EFE8]">
                      {activeLookData.featuredItems.map((garment, gIdx) => (
                        <li key={gIdx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-[#D8FF00]" />
                          <span>{garment}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Real screenshot from lookbook section */}
                  <div className="border border-white/10 p-2 bg-[#181917]">
                    <span className="font-mono text-[9px] text-[#C9C7BF] uppercase block mb-1">
                      LIVE WEBSITE LOOKBOOK SECTION CAPTURE:
                    </span>
                    <img
                      src="/assets/dropcult/desktop-lookbook.png"
                      alt="Drop Cult Lookbook desktop capture"
                      className="w-full h-auto opacity-80 hover:opacity-100 transition-opacity"
                    />
                  </div>

                </div>

              </div>

            </div>
          </RevealBlock>
        </div>

      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SECTION 04 — RESPONSIVE STREET                                      */}
      {/* Editorial Device Composition: Desktop 1440 · Tablet 768 · Mobile 390 */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#E5E3DC] text-[#242522] py-20 sm:py-28 px-3 sm:px-6 lg:px-12 border-b border-[#242522]/15">
        <div className="max-w-[1440px] mx-auto">
          
          {/* Section Marker */}
          <RevealBlock delay={0.05}>
            <div className="flex items-center justify-between pb-6 mb-12 border-b border-[#242522]/20 font-mono text-[11px] tracking-widest text-[#777B61] uppercase">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-[#242522]" />
                <span>04 // RESPONSIVE STREET</span>
              </div>
              <span>GENUINE VIEWPORT BREAKPOINTS</span>
            </div>
          </RevealBlock>

          {/* Section Heading & Interactive Filter */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
            <RevealBlock delay={0.1}>
              <h2 className="font-anton text-[42px] sm:text-[68px] lg:text-[88px] leading-[0.95] tracking-tight uppercase text-[#242522]">
                “THE CULTURE FITS EVERY SCREEN.”
              </h2>
              <p className="mt-3 font-mono text-[13px] sm:text-[15px] text-[#777B61] max-w-[620px]">
                Engineered to maintain brutalist typographic tension, tactile imagery, and rapid e-commerce navigation across desktop, tablet, and mobile without compromises.
              </p>
            </RevealBlock>

            {/* Viewport Inspector Switcher */}
            <RevealBlock delay={0.15}>
              <div className="flex items-center gap-2 bg-[#DCDAD2] p-1.5 border border-[#242522]/20">
                <button
                  type="button"
                  onClick={() => setResponsiveMode('all')}
                  className={`px-3 py-1.5 font-mono text-[10px] sm:text-[11px] font-bold uppercase transition-all ${
                    responsiveMode === 'all'
                      ? 'bg-[#242522] text-[#F1EFE8]'
                      : 'text-[#242522] hover:bg-black/10'
                  }`}
                >
                  ALL VIEWPORTS
                </button>
                <button
                  type="button"
                  onClick={() => setResponsiveMode('desktop')}
                  className={`px-3 py-1.5 font-mono text-[10px] sm:text-[11px] font-bold uppercase transition-all ${
                    responsiveMode === 'desktop'
                      ? 'bg-[#242522] text-[#F1EFE8]'
                      : 'text-[#242522] hover:bg-black/10'
                  }`}
                >
                  DESKTOP 1440PX
                </button>
                <button
                  type="button"
                  onClick={() => setResponsiveMode('tablet')}
                  className={`px-3 py-1.5 font-mono text-[10px] sm:text-[11px] font-bold uppercase transition-all ${
                    responsiveMode === 'tablet'
                      ? 'bg-[#242522] text-[#F1EFE8]'
                      : 'text-[#242522] hover:bg-black/10'
                  }`}
                >
                  TABLET 768PX
                </button>
                <button
                  type="button"
                  onClick={() => setResponsiveMode('mobile')}
                  className={`px-3 py-1.5 font-mono text-[10px] sm:text-[11px] font-bold uppercase transition-all ${
                    responsiveMode === 'mobile'
                      ? 'bg-[#242522] text-[#F1EFE8]'
                      : 'text-[#242522] hover:bg-black/10'
                  }`}
                >
                  MOBILE 390PX
                </button>
              </div>
            </RevealBlock>
          </div>

          {/* ── EDITORIAL MULTI-DEVICE COMPOSITION ─────────────────────────── */}
          {responsiveMode === 'all' ? (
            <div className="relative pt-6 sm:pt-10">
              
              {/* Device Stagger Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* 1. Large Desktop (1440px Viewport) — Left 7 Cols */}
                <div className="lg:col-span-7">
                  <RevealBlock delay={0.15}>
                    <div className="border border-[#242522]/30 bg-[#242522] shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
                      {/* Browser Chrome */}
                      <div className="flex items-center justify-between px-4 py-2.5 bg-[#181917] border-b border-white/10 font-mono text-[10px] text-[#C9C7BF]">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#D95B40]" />
                          <span className="w-2 h-2 rounded-full bg-[#C9C7BF]" />
                          <span className="w-2 h-2 rounded-full bg-[#777B61]" />
                          <span className="ml-2 font-bold text-white">DESKTOP // 1440 × 900PX</span>
                        </div>
                        <span className="text-[#D8FF00]">drop-cult-zeta.vercel.app</span>
                      </div>

                      {/* Screen Content: Real Collection Viewport */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-black">
                        <img
                          src="/assets/dropcult/desktop-collection.png"
                          alt="Drop Cult 1440px Desktop Collection Viewport"
                          className="w-full h-full object-cover object-top"
                        />
                      </div>

                      {/* Caption */}
                      <div className="p-3 bg-[#181917] border-t border-white/10 flex items-center justify-between font-mono text-[10px] text-[#C9C7BF]">
                        <span>REFERENCE BREAKPOINT: 1440PX</span>
                        <span className="text-white">FULL-WIDTH PRODUCT GRID & GSM SPECS</span>
                      </div>
                    </div>
                  </RevealBlock>

                  {/* Technical annotation box */}
                  <RevealBlock delay={0.25} className="mt-6 p-4 bg-[#DCDAD2] border border-[#242522]/20 font-mono text-[11px] text-[#343531]">
                    <div className="flex items-center gap-2 font-bold text-[#242522] mb-1">
                      <span className="w-1.5 h-1.5 bg-[#242522]" />
                      <span>DESKTOP ERGONOMICS:</span>
                    </div>
                    <p className="leading-relaxed">
                      Instant hover quick-views, sticky navigation with live marquee announcement bar, and seamless slide-over checkout with real-time Indian Rupee (₹) cart recalculation.
                    </p>
                  </RevealBlock>
                </div>

                {/* Right Stagger Column: Tablet (768px) and Mobile (390px) — Right 5 Cols */}
                <div className="lg:col-span-5 space-y-8">
                  
                  {/* 2. Tablet 768px Viewport */}
                  <RevealBlock delay={0.2}>
                    <div className="border border-[#242522]/30 bg-[#242522] shadow-[0_16px_40px_rgba(0,0,0,0.2)]">
                      {/* Tablet Header */}
                      <div className="flex items-center justify-between px-3.5 py-2 bg-[#181917] border-b border-white/10 font-mono text-[10px] text-[#C9C7BF]">
                        <span className="font-bold text-white">TABLET // 768 × 1024PX</span>
                        <span className="text-[#D8FF00]">ADAPTIVE 2-COL</span>
                      </div>

                      <div className="relative aspect-[4/3] overflow-hidden bg-black">
                        <img
                          src="/assets/dropcult/tablet-collection.png"
                          alt="Drop Cult Tablet Viewport 768px"
                          className="w-full h-full object-cover object-top"
                        />
                      </div>

                      <div className="p-2.5 bg-[#181917] border-t border-white/10 flex items-center justify-between font-mono text-[10px] text-[#C9C7BF]">
                        <span>REFERENCE BREAKPOINT: 768PX</span>
                        <span className="text-white">TOUCH-OPTIMIZED TAP TARGETS</span>
                      </div>
                    </div>
                  </RevealBlock>

                  {/* 3. Mobile 390px Mockup */}
                  <RevealBlock delay={0.25}>
                    <div className="flex items-start gap-6">
                      
                      {/* Realistic Smartphone Frame */}
                      <div className="w-[220px] sm:w-[260px] flex-shrink-0 border-4 border-[#242522] rounded-[36px] bg-[#181917] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                        {/* Dynamic Island / Speaker */}
                        <div className="w-20 h-4 bg-black rounded-full mx-auto mb-2" />
                        
                        {/* Screen */}
                        <div className="relative aspect-[9/19.5] rounded-[24px] overflow-hidden bg-black border border-white/10">
                          <img
                            src="/assets/dropcult/mobile-hero.png"
                            alt="Drop Cult Mobile Hero Viewport 390px"
                            className="w-full h-full object-cover object-top"
                          />
                        </div>

                        {/* Home indicator bar */}
                        <div className="w-24 h-1 bg-white/30 rounded-full mx-auto mt-2" />
                      </div>

                      {/* Mobile Editorial Annotation */}
                      <div className="flex-1 space-y-4 pt-4">
                        <div className="p-3 bg-white/70 border border-[#242522]/20">
                          <span className="font-mono text-[10px] font-bold text-[#242522] uppercase block mb-1">
                            MOBILE VIEWPORT: 390PX
                          </span>
                          <p className="font-mono text-[11px] text-[#777B61] leading-snug">
                            Single-thumb checkout, collapsible menu drawer, and zero horizontal overflow with tactile streetwear badges.
                          </p>
                        </div>

                        <div className="border border-[#242522]/20 overflow-hidden">
                          <span className="block px-2 py-1 bg-[#242522] text-[#D8FF00] font-mono text-[9px] uppercase font-bold">
                            MOBILE DETAIL CROP:
                          </span>
                          <img
                            src="/assets/dropcult/mobile-detail.png"
                            alt="Drop Cult Mobile Detail"
                            className="w-full h-auto"
                          />
                        </div>
                      </div>

                    </div>
                  </RevealBlock>

                </div>

              </div>

            </div>
          ) : responsiveMode === 'desktop' ? (
            /* Dedicated Desktop Full View */
            <RevealBlock delay={0.1}>
              <div className="border border-[#242522]/30 bg-[#242522] shadow-2xl">
                <div className="flex items-center justify-between px-4 py-3 bg-[#181917] border-b border-white/10 font-mono text-[11px] text-[#C9C7BF]">
                  <span className="text-white font-bold">DESKTOP VIEWPORT // 1440PX WIDTH REFERENCE</span>
                  <span className="text-[#D8FF00]">DROP-CULT-ZETA.VERCEL.APP</span>
                </div>
                <div className="aspect-[16/9] w-full overflow-hidden bg-black">
                  <img
                    src="/assets/dropcult/desktop-hero.png"
                    alt="Drop Cult Desktop 1440px"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            </RevealBlock>
          ) : responsiveMode === 'tablet' ? (
            /* Dedicated Tablet View */
            <RevealBlock delay={0.1}>
              <div className="max-w-[768px] mx-auto border border-[#242522]/30 bg-[#242522] shadow-2xl">
                <div className="flex items-center justify-between px-4 py-3 bg-[#181917] border-b border-white/10 font-mono text-[11px] text-[#C9C7BF]">
                  <span className="text-white font-bold">TABLET VIEWPORT // 768PX WIDTH REFERENCE</span>
                  <span className="text-[#D8FF00]">ADAPTIVE 2-COLUMN LAYOUT</span>
                </div>
                <div className="aspect-[3/4] w-full overflow-hidden bg-black">
                  <img
                    src="/assets/dropcult/tablet-hero.png"
                    alt="Drop Cult Tablet 768px"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            </RevealBlock>
          ) : (
            /* Dedicated Mobile View */
            <RevealBlock delay={0.1}>
              <div className="max-w-[390px] mx-auto border-4 border-[#242522] rounded-[40px] bg-[#181917] p-3 shadow-2xl">
                <div className="w-24 h-4 bg-black rounded-full mx-auto mb-2" />
                <div className="aspect-[9/19.5] rounded-[28px] overflow-hidden bg-black">
                  <img
                    src="/assets/dropcult/mobile-collection.png"
                    alt="Drop Cult Mobile 390px"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="w-28 h-1 bg-white/30 rounded-full mx-auto mt-2" />
              </div>
            </RevealBlock>
          )}

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SECTION 05 — DETAILS & INTERACTIONS                                 */}
      {/* Asymmetric Collage of Real Interface Details & Micro-Interactions   */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#242522] text-[#F1EFE8] py-20 sm:py-28 px-3 sm:px-6 lg:px-12 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto">
          
          {/* Section Marker */}
          <RevealBlock delay={0.05}>
            <div className="flex items-center justify-between pb-6 mb-12 border-b border-white/15 font-mono text-[11px] tracking-widest text-[#C9C7BF] uppercase">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-[#D8FF00]" />
                <span>05 // DETAILS & INTERACTIONS</span>
              </div>
              <span>MICRO-ERGONOMICS & INTERFACE ARCHITECTURE</span>
            </div>
          </RevealBlock>

          {/* Section Heading */}
          <RevealBlock delay={0.1}>
            <div className="max-w-[960px] mb-12 sm:mb-16">
              <h2 className="font-anton text-[42px] sm:text-[68px] lg:text-[88px] leading-[0.95] tracking-tight uppercase text-[#F1EFE8]">
                “EVERY DETAIL HAS AN ATTITUDE.”
              </h2>
              <p className="mt-3 font-mono text-[13px] sm:text-[15px] text-[#C9C7BF] max-w-[620px]">
                Streetwear e-commerce stripped of corporate bloat. Pure typography, tactile fabric specifications, and rapid checkout ergonomics.
              </p>
            </div>
          </RevealBlock>

          {/* ── ASYMMETRIC COLLAGE OF REAL INTERFACE DETAILS ───────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start">
            
            {/* Detail 01: Dynamic Navigation & Live Ticker Bar (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <RevealBlock delay={0.15}>
                <div className="border border-white/15 bg-[#1F201D] p-4 sm:p-6 group hover:border-[#D8FF00] transition-colors">
                  <div className="flex items-center justify-between font-mono text-[11px] pb-3 mb-4 border-b border-white/10">
                    <span className="text-[#D8FF00] font-bold">01 // HEADER & TICKER ARCHITECTURE</span>
                    <span className="text-[#C9C7BF]">STICKY GLASS BLUR</span>
                  </div>

                  {/* Real Navigation Screenshot */}
                  <div className="border border-white/10 overflow-hidden bg-black mb-4">
                    <img
                      src="/assets/dropcult/detail-nav.png"
                      alt="Drop Cult Header Navigation and Live Announcement Bar"
                      className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.01]"
                    />
                  </div>

                  <p className="text-[14px] text-[#C9C7BF] leading-relaxed">
                    A dual-level header featuring a moving announcement ticker (<code className="text-[#D8FF00] text-[12px]">"⚡ NEW DROP / NO BASIC FITS / 100% COMBED COTTON"</code>) paired with a high-contrast brutalist wordmark, quick currency switcher, and instant cart badge.
                  </p>
                </div>
              </RevealBlock>

              {/* Detail 02: Street Community & 35mm Shutter Tags (7 Cols Lower) */}
              <RevealBlock delay={0.2}>
                <div className="border border-white/15 bg-[#1F201D] p-4 sm:p-6 group hover:border-[#D8FF00] transition-colors">
                  <div className="flex items-center justify-between font-mono text-[11px] pb-3 mb-4 border-b border-white/10">
                    <span className="text-[#D8FF00] font-bold">02 // STREET COMMUNITY GRID & EXPOSURE METRICS</span>
                    <span className="text-[#C9C7BF]">REAL COMMUNITY SHOTS</span>
                  </div>

                  {/* 3-Col mini grid of genuine community posts */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="relative aspect-[3/4] bg-black overflow-hidden border border-white/10">
                      <img
                        src="https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=600&q=80"
                        alt="Community Shot Delhi"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-1 left-1 bg-black/80 px-1 font-mono text-[8px] text-[#D8FF00]">
                        1/500s · DELHI
                      </div>
                    </div>
                    <div className="relative aspect-[3/4] bg-black overflow-hidden border border-white/10">
                      <img
                        src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80"
                        alt="Community Shot Mumbai"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-1 left-1 bg-black/80 px-1 font-mono text-[8px] text-[#D8FF00]">
                        1/250s · MUMBAI
                      </div>
                    </div>
                    <div className="relative aspect-[3/4] bg-black overflow-hidden border border-white/10">
                      <img
                        src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80"
                        alt="Community Shot Bengaluru"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-1 left-1 bg-black/80 px-1 font-mono text-[8px] text-[#D8FF00]">
                        1/1000s · BLR
                      </div>
                    </div>
                  </div>

                  <p className="text-[14px] text-[#C9C7BF] leading-relaxed">
                    Authentic streetwear photography tagged with Leica/Contax shutter metadata, city origins (<code className="text-[#D8FF00] text-[12px]">DELHI · MUMBAI · BENGALURU</code>), and unfiltered local community fits.
                  </p>
                </div>
              </RevealBlock>
            </div>

            {/* Detail 03: Product Specification Card & GSM Badges (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <RevealBlock delay={0.18}>
                <div className="border border-white/15 bg-[#1F201D] p-4 sm:p-6 group hover:border-[#D8FF00] transition-colors">
                  <div className="flex items-center justify-between font-mono text-[11px] pb-3 mb-4 border-b border-white/10">
                    <span className="text-[#D8FF00] font-bold">03 // PRODUCT ARCHITECTURE & GSM SPECS</span>
                    <span className="text-[#C9C7BF]">TACTILE METRICS</span>
                  </div>

                  {/* Real Product Card Capture */}
                  <div className="border border-white/10 overflow-hidden bg-black mb-4">
                    <img
                      src="/assets/dropcult/detail-product.png"
                      alt="Drop Cult Product Card Detail with Price and GSM specs"
                      className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.01]"
                    />
                  </div>

                  <div className="space-y-2 font-mono text-[12px] text-[#C9C7BF]">
                    <div className="flex items-center justify-between p-2 bg-[#242522] border border-white/5">
                      <span>FABRIC DENSITY</span>
                      <span className="text-[#D8FF00] font-bold">300 GSM COMBED SINGLE-JERSEY</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-[#242522] border border-white/5">
                      <span>FINISH</span>
                      <span className="text-white">MINERAL ACID STONE WASH</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-[#242522] border border-white/5">
                      <span>SILHOUETTE</span>
                      <span className="text-white">DROPPED BOXY SHOULDER</span>
                    </div>
                  </div>

                  <p className="mt-4 text-[14px] text-[#C9C7BF] leading-relaxed">
                    Clear typographic hierarchy prioritizing fabric weight and construction specs over marketing jargon.
                  </p>
                </div>
              </RevealBlock>

              {/* Detail 04: Local Flagship & Neighborhood Studio Information */}
              <RevealBlock delay={0.22}>
                <div className="border border-white/15 bg-[#1F201D] p-4 sm:p-6 group hover:border-[#D8FF00] transition-colors">
                  <div className="flex items-center justify-between font-mono text-[11px] pb-3 mb-3 border-b border-white/10">
                    <span className="text-[#D8FF00] font-bold">04 // NEIGHBOURHOOD FLAGSHIP INTEGRATION</span>
                    <span className="text-[#C9C7BF]">PHYSICAL × DIGITAL</span>
                  </div>

                  <div className="p-3 bg-[#242522] border border-white/10 font-mono text-[11px] space-y-2">
                    <div className="flex items-center justify-between text-[#F1EFE8]">
                      <span>TRY-BEFORE-YOU-BUY</span>
                      <span className="text-[#D8FF00]">IN-STORE ARCHIVE</span>
                    </div>
                    <p className="text-[#C9C7BF] text-[11px] leading-relaxed">
                      "Experience the weight of our fabrics in person. Local neighbourhood studio features private fitting booths and in-store exclusive archival drops."
                    </p>
                  </div>
                </div>
              </RevealBlock>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SECTION 06 — THE LAST WORD                                          */}
      {/* Bold Closing Spread with High-Contrast Background & Direct CTAs     */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#181917] text-[#F1EFE8] py-24 sm:py-36 px-3 sm:px-6 lg:px-12 border-b border-white/10 overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="pointer-events-none absolute -bottom-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#D8FF00]/10 blur-[130px] rounded-full" />

        <div className="max-w-[1200px] mx-auto text-center relative z-10">
          
          <RevealBlock delay={0.05}>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#242522] border border-white/15 font-mono text-[11px] text-[#D8FF00] uppercase tracking-widest mb-8">
              <span>06 // THE LAST WORD</span>
              <span>•</span>
              <span>NORTHUP STUDIO EDITORIAL</span>
            </div>
          </RevealBlock>

          {/* Huge Bold Closing Headline */}
          <RevealBlock delay={0.1}>
            <h2 className="font-anton text-[56px] sm:text-[96px] md:text-[130px] lg:text-[160px] leading-[0.88] tracking-tight text-[#F1EFE8] uppercase select-none mb-8">
              “WEAR YOUR OWN FREQUENCY.”
            </h2>
          </RevealBlock>

          <RevealBlock delay={0.15}>
            <p className="text-[18px] sm:text-[22px] lg:text-[26px] text-[#C9C7BF] font-normal leading-relaxed max-w-[720px] mx-auto mb-12">
              A digital expression of streetwear culture, created by NORTHUP STUDIO.
            </p>
          </RevealBlock>

          {/* Primary & Secondary Call to Action */}
          <RevealBlock delay={0.2}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              
              {/* PRIMARY CTA: VISIT DROP CULT ↗ */}
              <a
                href={DROP_CULT_LIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                aria-label="Visit DROP CULT live website (opens in a new window)"
                className="group relative inline-flex items-center justify-center gap-4 px-10 py-5 bg-[#D8FF00] text-[#242522] font-mono font-bold text-[15px] uppercase tracking-wider transition-all duration-300 hover:bg-[#F1EFE8] hover:shadow-[0_0_35px_rgba(216,255,0,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#181917]"
              >
                <span className="tracking-widest">VISIT DROP CULT ↗</span>
                <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>

              {/* Back to Work Link */}
              <button
                type="button"
                onClick={() => onNavigate('/#work')}
                data-cursor="hover"
                className="px-8 py-5 bg-[#242522] hover:bg-white text-white hover:text-black border border-white/20 font-mono font-bold text-[14px] uppercase tracking-wider transition-all"
              >
                &larr; BACK TO FEATURED WORK
              </button>

            </div>
          </RevealBlock>

          {/* Navigation to Other Case Studies */}
          <RevealBlock delay={0.25}>
            <div className="mt-16 sm:mt-24 pt-12 border-t border-white/10">
              <span className="font-mono text-[10px] sm:text-[11px] text-[#777B61] uppercase tracking-widest block mb-6">
                EXPLORE OTHER CASE STUDIES:
              </span>

              <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => onNavigate('/work/atelier-estates')}
                  data-cursor="hover"
                  className="px-5 py-3 bg-[#242522] hover:bg-[#9B5D3E] text-white border border-white/15 uppercase tracking-wider transition-all flex items-center gap-2"
                >
                  <span>ATELIER ESTATES</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('/work/maison-de-sucre')}
                  data-cursor="hover"
                  className="px-5 py-3 bg-[#242522] hover:bg-[#B87F83] text-white border border-white/15 uppercase tracking-wider transition-all flex items-center gap-2"
                >
                  <span>MAISON DE SUCRE</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('/work/aurex-performance-club')}
                  data-cursor="hover"
                  className="px-5 py-3 bg-[#242522] hover:bg-[#C6FF00] hover:text-[#090A09] text-white border border-white/15 uppercase tracking-wider transition-all flex items-center gap-2"
                >
                  <span>AUREX PERFORMANCE</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('/work/arulis-dental-clinic')}
                  data-cursor="hover"
                  className="px-5 py-3 bg-[#242522] hover:bg-[#0F3D2E] text-white border border-white/15 uppercase tracking-wider transition-all flex items-center gap-2"
                >
                  <span>ARULIS DENTAL</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onOpenContact('Project Inquiry: Inspired by DROP CULT')}
                  data-cursor="hover"
                  className="px-5 py-3 bg-[#D8FF00]/10 hover:bg-[#D8FF00] text-[#D8FF00] hover:text-[#242522] border border-[#D8FF00]/40 uppercase tracking-wider transition-all"
                >
                  COMMISSION NORTHUP
                </button>
              </div>
            </div>
          </RevealBlock>

        </div>
      </section>

      {/* Shared Persistent Footer */}
      <Footer onOpenContact={onOpenContact} />

    </article>
  )
}
