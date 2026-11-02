import React, { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowUpRight,
  Sparkles,
  ChevronDown,
  Layers,
  Palette,
  Type,
  FileCheck2,
  BookOpen,
  Compass,
  Check,
  Eye,
  ArrowRight,
  ShieldCheck,
  Sparkle
} from 'lucide-react'
import Footer from '../components/Footer'

export default function BrandIdentityService({ onNavigate, onOpenContact, onOpenAudit }) {
  const shouldReduceMotion = useReducedMotion()
  const [openFaqIndex, setOpenFaqIndex] = useState(0)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const capabilities = [
    {
      index: '01',
      title: 'Strategic Positioning & Brand Archetype',
      tag: 'FOUNDATIONAL STRATEGY',
      desc: 'We analyze competitive differentiation, audience psychology, and industry conventions before drawing a single vector. We define your brand’s core visual tone, personality archetypes, and market posture.',
      highlights: ['Competitive visual audit', 'Market gap identification', 'Archetype & narrative framing', 'Strategic moodboard territories']
    },
    {
      index: '02',
      title: 'Bespoke Logotype & Responsive Symbol Suite',
      tag: 'MARK & SYMBOL CRAFT',
      desc: 'Crafted with optical balance, geometric harmony, and memorable silhouette distinctiveness. We provide responsive lockups engineered to scale seamlessly from 16px favicons to building signage.',
      highlights: ['Primary wordmark & symbol', 'Responsive secondary lockups', 'Monograms & social icons', 'Minimum clearspace specifications']
    },
    {
      index: '03',
      title: 'Curated Typography & Typographic Architecture',
      tag: 'TYPOGRAPHIC SYSTEMS',
      desc: 'Typography is the voice of your brand. We pair monumental display typefaces with highly readable, utilitarian body fonts, specifying optical tracking, line-height ratios, and digital styling hierarchies.',
      highlights: ['Display & body font pairings', 'Responsive scale hierarchies', 'Letterspacing & tracking guides', 'Commercial licensing guidance']
    },
    {
      index: '04',
      title: 'Chromatic Color Systems & Contrast Calibration',
      tag: 'COLOR SCIENCE',
      desc: 'Color palettes engineered for psychological resonance and high digital contrast. We calibrate full breakdowns across digital Hex/RGB and print CMYK/Pantone, adhering to WCAG 2.1 AA accessibility ratios.',
      highlights: ['Primary & accent palettes', 'WCAG contrast compliance (AA/AAA)', 'Dark and light interface modes', 'Print CMYK & Pantone formulas']
    },
    {
      index: '05',
      title: 'Digital Art Direction & Editorial Visual Rules',
      tag: 'VISUAL ASSETS',
      desc: 'Principles governing photography tone, graphic framing, lighting temperature, texture application, and digital presentation. We ensure marketing teams maintain flawless visual coherence.',
      highlights: ['Photography style guides', 'Lighting & texture treatments', 'Social media framing rules', 'Graphic layout grid systems']
    },
    {
      index: '06',
      title: 'Exhaustive Master Brand Guidelines Manual',
      tag: 'THE BRAND BOOK',
      desc: 'A comprehensive, beautifully formatted 40+ page brand manual that serves as the single source of truth for your internal team, external partners, marketing agencies, and print vendors.',
      highlights: ['Complete rulebook PDF', 'Correct & incorrect usage examples', 'Print & packaging specifications', 'Organized vector asset kit']
    }
  ]

  const processPhases = [
    {
      phase: 'PHASE 01',
      title: 'Immersion, Strategic Audit & Archetype Exploration',
      duration: 'Week 1',
      desc: 'Deep immersion into your commercial objectives, customer perceptions, and category benchmarks. We curate 2 distinct visual mood territories to align on aesthetic tone and emotional resonance.',
      deliverables: ['Brand positioning deck', 'Competitor visual audit', 'Curated aesthetic moodboards', 'Strategic direction alignment']
    },
    {
      phase: 'PHASE 02',
      title: 'Concept Exploration & Real-World Application Mockups',
      duration: 'Weeks 2–3',
      desc: 'We translate the agreed strategy into 2–3 rigorously developed brand identity concepts. Rather than presenting flat logos, we mock up each identity across websites, packaging, physical collateral, and mobile devices.',
      deliverables: ['2–3 distinct identity concepts', 'Contextual application mockups', 'Preliminary typographic pairings', 'Interactive concept review']
    },
    {
      phase: 'PHASE 03',
      title: 'System Refinement & Typographic Hardening',
      duration: 'Weeks 3–4',
      desc: 'Iterating on the selected conceptual direction. We refine vector bezier curves, calibrate color values across devices, build out secondary marks, and define comprehensive typographic scales.',
      deliverables: ['Refined vector master assets', 'Complete color architecture', 'Typographic hierarchy specs', 'Social & web asset kit']
    },
    {
      phase: 'PHASE 04',
      title: 'Brand Guidelines Production & Asset Handover',
      duration: 'Weeks 4–5',
      desc: 'We compile the exhaustive 40+ page Master Brand Guidelines book and organize all production files in EPS, SVG, PNG, and PDF formats, with full commercial copyright assigned to your company.',
      deliverables: ['Master Brand Book PDF', 'Full vector & raster asset archive', 'Font license documentation', 'Complete copyright transfer']
    }
  ]

  const portfolioProjects = [
    {
      slug: 'arulis-dental-clinic',
      route: '/work/arulis-dental-clinic',
      name: 'Aurelis Dental Clinic',
      category: 'Medical Aesthetics & Clinic',
      desc: 'Transforming clinical aesthetic medicine into a warm, modern digital patient portal and brand identity.',
      metric: 'Bespoke Medical Identity System',
      bgImg: '/assets/aurelis.jpg'
    },
    {
      slug: 'maison-de-sucre',
      route: '/work/maison-de-sucre',
      name: 'Maison de Sucre',
      category: 'Luxury Artisan Cake Studio',
      desc: 'Parisian editorial visual identity, bespoke packaging aesthetics, and artisanal cake showcase.',
      metric: 'Editorial Luxury Identity',
      bgImg: '/assets/cake-studio.jpg'
    },
    {
      slug: 'drop-cult',
      route: '/work/drop-cult',
      name: 'Drop Cult',
      category: 'Streetwear Apparel Label',
      desc: 'Underground streetwear brand identity, bold typography, lookbook aesthetics, and limited drop mechanism.',
      metric: 'Subversive Streetwear Branding',
      bgImg: '/assets/drop-cult.jpg'
    },
    {
      slug: 'atelier-estates',
      route: '/work/atelier-estates',
      name: 'Atelier Estates',
      category: 'Luxury Architecture Advisory',
      desc: 'Monolithic luxury brand identity, private architectural advisory aesthetic, and material studies.',
      metric: 'Architectural Monolith Identity',
      bgImg: '/assets/atelier.jpg'
    }
  ]

  const faqs = [
    {
      q: 'What is included in a complete Northup Studio brand identity engagement?',
      a: 'A full engagement delivers: Primary wordmark and logotype, secondary marks and responsive lockups, monograms and favicons, complete typographic pairing hierarchy, digital and print color systems with WCAG contrast specs, brand application mockups, social media avatar and banner kit, and a comprehensive 40+ page Master Brand Guidelines PDF.'
    },
    {
      q: 'How long does a brand identity project take from kickoff to delivery?',
      a: 'A comprehensive brand identity engagement typically spans 4 to 5 weeks. This allows sufficient time for rigorous research, multiple conceptual explorations, real-world mockup testing, refinement cycles, and asset production.'
    },
    {
      q: 'Do you design for both digital and print applications?',
      a: 'Yes. Every brand system we build is calibrated for dual fidelity: RGB and Hex values optimized for OLED displays and web platforms, alongside CMYK and Pantone matching codes for luxury print, architectural signage, and packaging.'
    },
    {
      q: 'How many initial visual concepts will we explore?',
      a: 'We present 2 to 3 thoroughly developed conceptual directions during Phase 2. Each direction represents a distinct strategic viewpoint and is demonstrated across real-world collateral (such as website heroes, stationery, mobile apps, and packaging) so you can evaluate the identity in practice.'
    },
    {
      q: 'Can Northup Studio design and build our website following the brand identity?',
      a: 'Yes. In fact, many of our most successful client engagements begin with brand identity and transition directly into digital engineering. Because we already understand the brand archetype and typographic rules intimately, the web design and development phase proceeds with exceptional speed and coherence.'
    },
    {
      q: 'Who owns the copyright and trademarks for the brand assets?',
      a: 'Upon completion and settlement of the final invoice, 100% full, exclusive, worldwide commercial copyright and trademark ownership rights transfer to your organization. We deliver all open vector source files (AI, EPS, SVG, PDF).'
    }
  ]

  return (
    <article className="w-full bg-[#0C0C0C] text-[#F5F1EB] selection:bg-[#FF4D0A] selection:text-white pt-24 sm:pt-28 font-sans">
      
      {/* 
        ========================================================================
        1. BREADCRUMBS & HERO SECTION
        ========================================================================
      */}
      <section className="relative px-4 sm:px-8 lg:px-12 pt-6 pb-16 sm:pb-24 border-b border-white/10 overflow-hidden">
        {/* Ambient Warm Atmosphere Glow */}
        <div 
          className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-[#FF4D0A]/10 blur-[150px] rounded-full pointer-events-none" 
          aria-hidden="true" 
        />
        
        <div className="max-w-6xl mx-auto">
          
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumbs" className="mb-6 font-mono text-[11px] sm:text-xs text-[#A6A09A] tracking-wider uppercase flex items-center gap-2 flex-wrap">
            <a 
              href="/" 
              onClick={(e) => { e.preventDefault(); onNavigate('/'); }}
              className="hover:text-white transition-colors"
            >
              HOME
            </a>
            <span className="text-white/30">/</span>
            <a 
              href="/#services" 
              onClick={(e) => { e.preventDefault(); onNavigate('/#services'); }}
              className="hover:text-white transition-colors"
            >
              SERVICES
            </a>
            <span className="text-white/30">/</span>
            <span className="text-[#FF8A3D] font-bold">BRAND IDENTITY DESIGN</span>
          </nav>

          {/* Kicker Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF4D0A]/10 border border-[#FF4D0A]/30 text-[#FF8A3D] font-mono text-[11px] uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#FF8A3D]" />
            <span>[ CORE SERVICE SPECIFICATION 02 ]</span>
          </div>

          {/* Single Main H1 */}
          <h1 className="font-anton text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight text-white leading-[0.98] max-w-5xl mb-6">
            STRATEGIC BRAND IDENTITY &amp; DIGITAL VISUAL SYSTEMS
          </h1>

          {/* Lead Paragraph */}
          <p className="text-base sm:text-xl text-[#A6A09A] max-w-3xl leading-relaxed font-sans mb-8">
            Northup Studio creates enduring visual identities for brands that refuse to blend into category convention. 
            From foundational strategic positioning and typographic hierarchies to bespoke logotypes and comprehensive brand manuals, we forge visual authority that commands prestige.
          </p>

          {/* Action Button Row */}
          <div className="flex flex-wrap items-center gap-3.5 font-mono text-xs font-bold uppercase tracking-wider">
            <button
              type="button"
              onClick={() => onOpenContact('Brand Identity Inquiry')}
              data-cursor="hover"
              className="px-6 sm:px-8 py-3.5 rounded-xl bg-[#FF4D0A] hover:bg-[#ff6426] text-white transition-all shadow-[0_4px_24px_rgba(255,77,10,0.35)] flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>COMMISSION BRAND IDENTITY</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <a
              href="#capabilities"
              data-cursor="hover"
              className="px-5 sm:px-7 py-3.5 rounded-xl bg-[#1D1D1D] hover:bg-[#252525] border border-white/15 text-white transition-all flex items-center gap-2"
            >
              <Palette className="w-4 h-4 text-[#FF8A3D]" />
              <span>EXPLORE CAPABILITIES &darr;</span>
            </a>

            <a
              href="/services/web-design-development"
              onClick={(e) => {
                e.preventDefault()
                onNavigate('/services/web-design-development')
              }}
              data-cursor="hover"
              className="px-4 py-3.5 text-[#A6A09A] hover:text-white transition-colors"
            >
              WEB DESIGN SERVICE &rarr;
            </a>
          </div>

          {/* Brand Standards Benchmark Strip */}
          <div className="mt-12 sm:mt-16 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-[#151515] border border-white/10">
              <span className="text-[10px] text-[#A6A09A] uppercase tracking-wider block mb-1">Deliverable Suite</span>
              <span className="text-sm font-bold text-white block">Full Vector Kit</span>
              <span className="text-[11px] text-[#777B61] mt-0.5 block">SVG, EPS, AI, PNG, PDF</span>
            </div>
            <div className="p-4 rounded-xl bg-[#151515] border border-white/10">
              <span className="text-[10px] text-[#A6A09A] uppercase tracking-wider block mb-1">Typographic Systems</span>
              <span className="text-sm font-bold text-[#FF8A3D] block">Curated Type Pairs</span>
              <span className="text-[11px] text-[#777B61] mt-0.5 block">Display, Body &amp; Monospace Scale</span>
            </div>
            <div className="p-4 rounded-xl bg-[#151515] border border-white/10">
              <span className="text-[10px] text-[#A6A09A] uppercase tracking-wider block mb-1">Color Architecture</span>
              <span className="text-sm font-bold text-white block">WCAG AA Certified</span>
              <span className="text-[11px] text-[#777B61] mt-0.5 block">Hex, RGB, CMYK &amp; Pantone</span>
            </div>
            <div className="p-4 rounded-xl bg-[#151515] border border-white/10">
              <span className="text-[10px] text-[#A6A09A] uppercase tracking-wider block mb-1">Documentation</span>
              <span className="text-sm font-bold text-white block">40+ Page Brand Book</span>
              <span className="text-[11px] text-[#777B61] mt-0.5 block">Single Source of Visual Truth</span>
            </div>
          </div>

        </div>
      </section>

      {/* 
        ========================================================================
        2. CORE CAPABILITIES (H2)
        ========================================================================
      */}
      <section id="capabilities" className="px-4 sm:px-8 lg:px-12 py-16 sm:py-24 border-b border-white/10">
        <div className="max-w-6xl mx-auto">
          
          <div className="max-w-2xl mb-12 sm:mb-16">
            <span className="font-mono text-xs font-bold text-[#FF8A3D] uppercase tracking-widest block mb-2">
              DISCIPLINED VISUAL ARCHITECTURE
            </span>
            <h2 className="font-anton text-3xl sm:text-5xl uppercase tracking-tight text-white leading-tight">
              BRAND STRATEGY &amp; VISUAL SYSTEM CAPABILITIES
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#A6A09A] mt-3 leading-relaxed">
              We design cohesive identities engineered to thrive in digital environments while holding monumental presence across physical print, packaging, and spatial touchpoints.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {capabilities.map((cap) => (
              <div 
                key={cap.index}
                className="p-6 sm:p-7 rounded-2xl bg-[#151515] border border-white/10 hover:border-[#FF8A3D]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-[#FF8A3D]">{cap.index}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-white/5 text-[#A6A09A] border border-white/10">
                      {cap.tag}
                    </span>
                  </div>
                  <h3 className="font-anton text-xl uppercase tracking-wide text-white mb-3">
                    {cap.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A6A09A] leading-relaxed mb-6">
                    {cap.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-1.5 font-mono text-[11px] text-white/80">
                  {cap.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-[#FF8A3D]">›</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 
        ========================================================================
        3. PROCESS & METHODOLOGY (H2)
        ========================================================================
      */}
      <section className="px-4 sm:px-8 lg:px-12 py-16 sm:py-24 border-b border-white/10 bg-[#090A09]">
        <div className="max-w-6xl mx-auto">
          
          <div className="max-w-2xl mb-12 sm:mb-16">
            <span className="font-mono text-xs font-bold text-[#FF8A3D] uppercase tracking-widest block mb-2">
              METHODOLOGY
            </span>
            <h2 className="font-anton text-3xl sm:text-5xl uppercase tracking-tight text-white leading-tight">
              OUR 4-PHASE BRAND CRAFTING PROCESS
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#A6A09A] mt-3 leading-relaxed">
              From market immersion and conceptual exploration to vector precision and production handover.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {processPhases.map((phase, idx) => (
              <div 
                key={idx}
                className="p-7 sm:p-8 rounded-2xl bg-[#151515] border border-white/10 relative overflow-hidden"
              >
                <div className="flex items-center justify-between font-mono text-xs mb-3">
                  <span className="text-[#FF8A3D] font-bold tracking-wider">{phase.phase}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#A6A09A]">
                    {phase.duration}
                  </span>
                </div>

                <h3 className="font-anton text-xl sm:text-2xl uppercase tracking-wide text-white mb-3">
                  {phase.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#A6A09A] leading-relaxed mb-6 font-sans">
                  {phase.desc}
                </p>

                <div className="p-4 rounded-xl bg-[#0F0F0F] border border-white/5 space-y-2">
                  <span className="font-mono text-[10px] text-[#777B61] uppercase tracking-widest block font-bold">
                    DELIVERABLES SUMMARY:
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-mono text-xs text-[#F5F1EB]">
                    {phase.deliverables.map((item, dIdx) => (
                      <li key={dIdx} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#FF8A3D] flex-shrink-0" />
                        <span className="truncate">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 
        ========================================================================
        4. FEATURED BRAND IDENTITY CASE STUDIES (H2)
        ========================================================================
      */}
      <section className="px-4 sm:px-8 lg:px-12 py-16 sm:py-24 border-b border-white/10">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-4">
            <div>
              <span className="font-mono text-xs font-bold text-[#FF8A3D] uppercase tracking-widest block mb-2">
                VERIFIED CASE STUDIES
              </span>
              <h2 className="font-anton text-3xl sm:text-5xl uppercase tracking-tight text-white leading-tight">
                SELECTED BRAND IDENTITY WORK
              </h2>
            </div>
            <a 
              href="/#work" 
              onClick={(e) => { e.preventDefault(); onNavigate('/#work'); }}
              data-cursor="hover"
              className="font-mono text-xs text-[#FF8A3D] hover:underline flex items-center gap-1.5 uppercase font-bold"
            >
              <span>EXPLORE ALL STUDIO WORK</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolioProjects.map((project) => (
              <a
                key={project.slug}
                href={project.route}
                onClick={(e) => {
                  e.preventDefault()
                  onNavigate(project.route)
                }}
                data-cursor="hover"
                className="group relative rounded-2xl overflow-hidden bg-[#151515] border border-white/10 hover:border-[#FF8A3D]/50 transition-all flex flex-col justify-between min-h-[360px] p-6 sm:p-8"
              >
                {/* Background Artwork */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={project.bgImg} 
                    alt={project.name} 
                    className="w-full h-full object-cover opacity-25 group-hover:scale-105 group-hover:opacity-35 transition-all duration-700" 
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/80 to-transparent" />
                </div>

                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider px-3 py-1 rounded-full bg-black/60 border border-white/15 text-[#A6A09A]">
                    {project.category}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#FF4D0A] flex items-center justify-center text-white transition-colors">
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>

                {/* Bottom Details */}
                <div className="relative z-10 mt-20">
                  <span className="font-mono text-[11px] font-bold text-[#FF8A3D] uppercase tracking-widest block mb-1">
                    {project.metric}
                  </span>
                  <h3 className="font-anton text-2xl sm:text-3xl uppercase tracking-wide text-white mb-2">
                    {project.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A6A09A] leading-relaxed max-w-md font-sans">
                    {project.desc}
                  </p>
                </div>
              </a>
            ))}
          </div>

        </div>
      </section>

      {/* 
        ========================================================================
        5. FREQUENTLY ASKED QUESTIONS (H2)
        ========================================================================
      */}
      <section className="px-4 sm:px-8 lg:px-12 py-16 sm:py-24 border-b border-white/10 bg-[#090A09]">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-12 sm:mb-16">
            <span className="font-mono text-xs font-bold text-[#FF8A3D] uppercase tracking-widest block mb-2">
              CLARITY &amp; DETAILS
            </span>
            <h2 className="font-anton text-3xl sm:text-5xl uppercase tracking-tight text-white leading-tight">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#A6A09A] mt-3">
              Direct information on deliverables, ownership rights, and branding methodology.
            </p>
          </div>

          <div className="space-y-3 font-mono">
            {faqs.map((faq, fIdx) => {
              const isOpen = openFaqIndex === fIdx
              return (
                <div 
                  key={fIdx}
                  className="rounded-xl bg-[#151515] border border-white/10 overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : fIdx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02]"
                  >
                    <span className="text-sm sm:text-base font-bold text-white tracking-wide">
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-[#FF8A3D] flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#A6A09A] leading-relaxed font-sans border-t border-white/5">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* 
        ========================================================================
        6. PROMINENT ENQUIRY CTA & CROSS-SERVICE NAVIGATION
        ========================================================================
      */}
      <section className="px-4 sm:px-8 lg:px-12 py-16 sm:py-24 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          
          <span className="font-mono text-xs font-bold text-[#FF8A3D] uppercase tracking-widest block mb-3">
            [ BEGIN YOUR ENGAGEMENT ]
          </span>

          <h2 className="font-anton text-4xl sm:text-6xl uppercase tracking-tight text-white leading-tight max-w-3xl mx-auto mb-6">
            READY TO ESTABLISH ENDURING BRAND AUTHORITY?
          </h2>

          <p className="font-sans text-sm sm:text-base text-[#A6A09A] max-w-xl mx-auto leading-relaxed mb-8">
            Tell us about your company, market aspirations, and timeline. 
            We review every brief directly and schedule a discovery consultation within 24 hours.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 font-mono text-xs font-bold uppercase tracking-wider">
            <button
              type="button"
              onClick={() => onOpenContact('Brand Identity Inquiry')}
              data-cursor="hover"
              className="px-8 py-4 rounded-xl bg-[#FF4D0A] hover:bg-[#ff6426] text-white transition-all shadow-[0_4px_30px_rgba(255,77,10,0.4)] flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>COMMISSION BRAND IDENTITY</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <a
              href="/services/web-design-development"
              onClick={(e) => {
                e.preventDefault()
                onNavigate('/services/web-design-development')
              }}
              data-cursor="hover"
              className="px-6 py-4 rounded-xl bg-[#1D1D1D] hover:bg-[#252525] border border-white/15 text-white transition-all flex items-center gap-2"
            >
              <span>EXPLORE WEB DESIGN SERVICE &rarr;</span>
            </a>
          </div>

        </div>
      </section>

      {/* Shared Persistent Footer */}
      <Footer onOpenContact={onOpenContact} onNavigate={onNavigate} />

    </article>
  )
}
