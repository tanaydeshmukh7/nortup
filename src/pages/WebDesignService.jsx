import React, { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  Layers,
  Monitor,
  Smartphone,
  Cpu,
  Zap,
  Globe,
  Gauge,
  Code2,
  FileCode2,
  ShieldCheck,
  Search,
  Check,
  Eye,
  ArrowRight
} from 'lucide-react'
import Footer from '../components/Footer'

export default function WebDesignService({ onNavigate, onOpenContact, onOpenAudit }) {
  const shouldReduceMotion = useReducedMotion()
  const [openFaqIndex, setOpenFaqIndex] = useState(0)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const capabilities = [
    {
      index: '01',
      title: 'Bespoke Visual Design & Editorial UI/UX',
      tag: 'CRAFT & ART DIRECTION',
      desc: 'We reject generic templates and cookie-cutter page builders. Every layout, typographic scale, and visual threshold is custom-crafted to communicate your brand’s prestige and command premium client fees.',
      highlights: ['Custom Figma design systems', 'Editorial grid architectures', 'Tailored design tokens', 'High-fidelity visual prototypes']
    },
    {
      index: '02',
      title: 'Responsive & Touch-Ergonomic Engineering',
      tag: 'CROSS-DEVICE PRECISION',
      desc: 'Tested obsessively across viewports from 360px mobile displays to 4K ultra-wide monitors. We ensure touch targets, typographic hierarchy, and navigation patterns feel natural on every device.',
      highlights: ['Fluid viewport typography', 'Thumb-zone navigation patterns', 'Zero horizontal layout shifts', 'Retina-sharp visual rendering']
    },
    {
      index: '03',
      title: 'Kinetic Motion & WebGL Interactive 3D',
      tag: 'INTERACTIVE EXPERIENCES',
      desc: 'Purposeful, 60fps GPU-accelerated motion that elevates user engagement without compromising speed. We build smooth inertia scrolling, interactive Three.js canvases, and elegant micro-interactions.',
      highlights: ['Three.js & WebGL integrations', 'Lenis smooth scroll architecture', 'Framer Motion page transitions', 'Optimized GPU rendering loops']
    },
    {
      index: '04',
      title: 'High-Performance Frontend Architecture',
      tag: 'SPEED & OPTIMIZATION',
      desc: 'Engineered with React 18, Next.js, and modern build pipelines. We ruthlessly minimize bundle sizes, optimize asset loading with modern WebP compression, and target sub-second initial loads.',
      highlights: ['Sub-second First Contentful Paint', 'Tree-shaken CSS & JS bundles', 'Automated image optimization', '95+ Lighthouse benchmark goal']
    },
    {
      index: '05',
      title: 'Headless CMS & Scalable Content Workflows',
      tag: 'INDEPENDENT MANAGEMENT',
      desc: 'Give your marketing team full freedom to publish articles, update case studies, and launch landing pages without touching code or relying on slow, vulnerable legacy CMS plugins.',
      highlights: ['Intuitive editorial dashboards', 'Structured data models', 'Zero database lock-in', 'Instant edge cache invalidation']
    },
    {
      index: '06',
      title: 'Technical SEO & Social Graph Meta Infrastructure',
      tag: 'ORGANIC VISIBILITY',
      desc: 'Search visibility baked into the architecture from day one. Valid Schema.org JSON-LD structured data, dynamic Open Graph cards, crawlable internal linking, and semantic HTML5 throughout.',
      highlights: ['Valid Schema.org markup', 'Automated sitemap.xml & robots.txt', 'Canonical URL management', 'Pre-rendered static HTML routes']
    }
  ]

  const processPhases = [
    {
      phase: 'PHASE 01',
      title: 'Discovery, Strategic Architecture & Sitemapping',
      duration: 'Week 1',
      desc: 'We analyze your commercial goals, audience search intent, competitive landscape, and conversion pathways. We define the user journey, core conversion triggers, and precise technical stack before writing a single line of code.',
      deliverables: ['Information architecture blueprint', 'User journey mapping', 'Technical stack definition', 'Wireframe structure']
    },
    {
      phase: 'PHASE 02',
      title: 'Editorial UI/UX Design & Interactive Prototyping',
      duration: 'Weeks 2–3',
      desc: 'We translate your brand identity into monumental web layouts. You receive fully interactive Figma prototypes covering desktop and mobile viewports, typography styling, color contrast, and planned motion behaviors.',
      deliverables: ['Desktop & mobile Figma designs', 'Interactive click-through prototype', 'Component design system', 'Client review & refinement cycle']
    },
    {
      phase: 'PHASE 03',
      title: 'Component Engineering & Full-Stack Development',
      duration: 'Weeks 3–5',
      desc: 'Our engineers transform approved designs into production React / Next.js code. We implement responsive layouts, kinetic micro-interactions, API integrations, and secure lead forms with email alerts.',
      deliverables: ['Modular React component code', 'Responsive CSS implementation', 'API & form integration (Resend/Supabase)', 'Staging preview environment']
    },
    {
      phase: 'PHASE 04',
      title: 'Core Web Vitals Tuning, Cross-Device QA & Deployment',
      duration: 'Week 5–6',
      desc: 'Exhaustive cross-browser and cross-device testing. We audit Core Web Vitals, verify Schema.org markup, configure production DNS and SSL on Vercel Edge, and provide complete documentation.',
      deliverables: ['Lighthouse performance report', 'Cross-browser compatibility pass', 'Live production Vercel deployment', '30-day post-launch warranty']
    }
  ]

  const portfolioProjects = [
    {
      slug: 'atelier-estates',
      route: '/work/atelier-estates',
      name: 'Atelier Estates',
      category: 'Luxury Architecture Advisory',
      desc: 'Editorial web design, architectural material studies, and responsive digital advisory experience.',
      metric: 'Monolithic Minimalist Layout',
      bgImg: '/assets/atelier.jpg'
    },
    {
      slug: 'aurex-performance-club',
      route: '/work/aurex-performance-club',
      name: 'AUREX Performance Club',
      category: 'Athletic Conditioning & Apparel',
      desc: 'Brutalist dark aesthetics, kinetic typography, and high-intensity digital storefront engineering.',
      metric: 'High-Impact Kinetic Storefront',
      bgImg: '/assets/aurex.jpg'
    },
    {
      slug: 'maison-de-sucre',
      route: '/work/maison-de-sucre',
      name: 'Maison de Sucre',
      category: 'Artisanal Parisian Cake Studio',
      desc: 'Parisian editorial aesthetics, artisanal cake showcase, and high-conversion ordering platform.',
      metric: 'Bespoke Direct Ordering Flow',
      bgImg: '/assets/cake-studio.jpg'
    },
    {
      slug: 'drop-cult',
      route: '/work/drop-cult',
      name: 'Drop Cult',
      category: 'Streetwear Apparel & Lookbook',
      desc: 'Underground streetwear digital experience featuring limited edition drops and lookbook.',
      metric: 'Exclusive Drop Mechanism',
      bgImg: '/assets/drop-cult.jpg'
    }
  ]

  const faqs = [
    {
      q: 'What frameworks and modern web technologies do you build with?',
      a: 'We engineer websites primarily with React 18, Next.js, and Vite, paired with modern Tailwind CSS for maintainable styling, Framer Motion for kinetic micro-interactions, Three.js for interactive WebGL 3D elements, and Lenis for smooth inertia scrolling. For serverless operations, lead storage, and transactional notifications, we integrate Supabase and Resend, deployed globally across Vercel’s Edge Network.'
    },
    {
      q: 'How long does a bespoke web design and development project take?',
      a: 'A typical custom studio engagement spans 3 to 6 weeks depending on project scope. A targeted conversion landing page typically takes 1 to 2 weeks, while a comprehensive multi-page digital platform with custom CMS integration and complex kinetic animations spans 4 to 6 weeks. We adhere strictly to scheduled milestone dates.'
    },
    {
      q: 'Can our internal team edit text, case studies, and imagery after launch?',
      a: 'Yes. Where requested, we integrate clean headless CMS architectures (such as Sanity, Strapi, or Supabase Content Tables) allowing non-technical marketing and operations teams to publish blog articles, edit project copy, and upload imagery without risking layout shifts or broken code.'
    },
    {
      q: 'How do you guarantee high performance and sub-second page loads?',
      a: 'We avoid bloated page builders and unnecessary third-party scripts. Every component is hand-coded with modern standards: responsive WebP image pipelines with explicit layout dimensions to prevent layout shifts (CLS), tree-shaken CSS, deferred JavaScript execution, and static pre-rendering (SSG) so pages load instantly from edge server caches.'
    },
    {
      q: 'Who owns the intellectual property and code upon project completion?',
      a: 'You do. Upon receipt of final payment, full intellectual property rights, source code repositories, design assets, and production deployment credentials transfer entirely to you. We do not enforce proprietary vendor lock-in or recurring platform licensing fees.'
    },
    {
      q: 'How do you approach Technical SEO during the build?',
      a: 'Technical SEO is baked into the codebase from the first commit: single clear H1 headings with logical H2/H3 nesting, semantic HTML5 tags (<nav>, <article>, <main>, <section>, <footer>), pre-rendered static HTML routes, Schema.org JSON-LD structured data, dynamic Open Graph social cards, XML sitemaps, and strict canonical tags.'
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
          className="absolute -top-32 right-1/4 w-[500px] h-[500px] bg-[#FF4D0A]/10 blur-[150px] rounded-full pointer-events-none" 
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
            <span className="text-[#FF8A3D] font-bold">WEB DESIGN &amp; DEVELOPMENT</span>
          </nav>

          {/* Kicker Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF4D0A]/10 border border-[#FF4D0A]/30 text-[#FF8A3D] font-mono text-[11px] uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#FF8A3D]" />
            <span>[ CORE SERVICE SPECIFICATION 01 ]</span>
          </div>

          {/* Single Main H1 */}
          <h1 className="font-anton text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight text-white leading-[0.98] max-w-5xl mb-6">
            BESPOKE WEB DESIGN &amp; HIGH-PERFORMANCE DIGITAL ENGINEERING
          </h1>

          {/* Lead Paragraph */}
          <p className="text-base sm:text-xl text-[#A6A09A] max-w-3xl leading-relaxed font-sans mb-8">
            Northup Studio designs and engineers distinctive web flagships for visionary brands. 
            We unify editorial art direction, kinetic micro-interactions, and robust modern frontend architecture—crafting websites that load in sub-seconds and convert qualified visitors into loyal clients.
          </p>

          {/* Action Button Row */}
          <div className="flex flex-wrap items-center gap-3.5 font-mono text-xs font-bold uppercase tracking-wider">
            <button
              type="button"
              onClick={() => onOpenContact('Web Design & Development Inquiry')}
              data-cursor="hover"
              className="px-6 sm:px-8 py-3.5 rounded-xl bg-[#FF4D0A] hover:bg-[#ff6426] text-white transition-all shadow-[0_4px_24px_rgba(255,77,10,0.35)] flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>COMMISSION A WEBSITE</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            {onOpenAudit && (
              <button
                type="button"
                onClick={onOpenAudit}
                data-cursor="hover"
                className="px-5 sm:px-7 py-3.5 rounded-xl bg-[#1D1D1D] hover:bg-[#252525] border border-white/15 text-white transition-all flex items-center gap-2 cursor-pointer"
              >
                <Gauge className="w-4 h-4 text-[#FF8A3D]" />
                <span>REQUEST FREE DIGITAL AUDIT</span>
              </button>
            )}

            <a
              href="#capabilities"
              data-cursor="hover"
              className="px-4 py-3.5 text-[#A6A09A] hover:text-white transition-colors"
            >
              VIEW SPECIFICATIONS &darr;
            </a>
          </div>

          {/* Technical Standards Benchmark Strip */}
          <div className="mt-12 sm:mt-16 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-[#151515] border border-white/10">
              <span className="text-[10px] text-[#A6A09A] uppercase tracking-wider block mb-1">Modern Stack</span>
              <span className="text-sm font-bold text-white block">React 18 &amp; Next.js</span>
              <span className="text-[11px] text-[#777B61] mt-0.5 block">Vite, Tailwind CSS, Three.js</span>
            </div>
            <div className="p-4 rounded-xl bg-[#151515] border border-white/10">
              <span className="text-[10px] text-[#A6A09A] uppercase tracking-wider block mb-1">Performance Standard</span>
              <span className="text-sm font-bold text-[#FF8A3D] block">&lt;0.9s FCP Speed</span>
              <span className="text-[11px] text-[#777B61] mt-0.5 block">Sub-second First Contentful Paint</span>
            </div>
            <div className="p-4 rounded-xl bg-[#151515] border border-white/10">
              <span className="text-[10px] text-[#A6A09A] uppercase tracking-wider block mb-1">Ergonomics</span>
              <span className="text-sm font-bold text-white block">100% Mobile Fluid</span>
              <span className="text-[11px] text-[#777B61] mt-0.5 block">Zero Layout Shifts (CLS &lt; 0.05)</span>
            </div>
            <div className="p-4 rounded-xl bg-[#151515] border border-white/10">
              <span className="text-[10px] text-[#A6A09A] uppercase tracking-wider block mb-1">Edge Infrastructure</span>
              <span className="text-sm font-bold text-white block">Vercel Global Edge</span>
              <span className="text-[11px] text-[#777B61] mt-0.5 block">Supabase + SSL + Resend APIs</span>
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
              ENGINEERING STANDARDS
            </span>
            <h2 className="font-anton text-3xl sm:text-5xl uppercase tracking-tight text-white leading-tight">
              CORE WEB DESIGN &amp; DEVELOPMENT CAPABILITIES
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#A6A09A] mt-3 leading-relaxed">
              Every website we deliver is built from raw code to client specifications. We do not recycle bloated commercial templates or lock your business into proprietary page builders.
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
              DISCIPLINED EXECUTION
            </span>
            <h2 className="font-anton text-3xl sm:text-5xl uppercase tracking-tight text-white leading-tight">
              OUR 4-PHASE WEB DELIVERY LIFECYCLE
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#A6A09A] mt-3 leading-relaxed">
              Structured sprints, transparent staging deployments, and rigorous quality assurance at every touchpoint.
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
                    KEY PHASE DELIVERABLES:
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
        4. FEATURED WEB DESIGN CASE STUDIES (H2)
        ========================================================================
      */}
      <section className="px-4 sm:px-8 lg:px-12 py-16 sm:py-24 border-b border-white/10">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-4">
            <div>
              <span className="font-mono text-xs font-bold text-[#FF8A3D] uppercase tracking-widest block mb-2">
                VERIFIED OUTCOMES
              </span>
              <h2 className="font-anton text-3xl sm:text-5xl uppercase tracking-tight text-white leading-tight">
                SELECTED WEB DEVELOPMENT WORK
              </h2>
            </div>
            <a 
              href="/#work" 
              onClick={(e) => { e.preventDefault(); onNavigate('/#work'); }}
              data-cursor="hover"
              className="font-mono text-xs text-[#FF8A3D] hover:underline flex items-center gap-1.5 uppercase font-bold"
            >
              <span>VIEW ALL 5 PORTFOLIO MONOGRAPHS</span>
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
              TRANSPARENT ANSWERS
            </span>
            <h2 className="font-anton text-3xl sm:text-5xl uppercase tracking-tight text-white leading-tight">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#A6A09A] mt-3">
              Clear specifics regarding our engineering stack, ownership, and studio methodology.
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
            [ COMMENCE YOUR PROJECT ]
          </span>

          <h2 className="font-anton text-4xl sm:text-6xl uppercase tracking-tight text-white leading-tight max-w-3xl mx-auto mb-6">
            READY TO ENGINEER A HIGH-IMPACT WEB FLAGSHIP?
          </h2>

          <p className="font-sans text-sm sm:text-base text-[#A6A09A] max-w-xl mx-auto leading-relaxed mb-8">
            Tell us about your brand vision, target launch timeline, and key requirements. 
            We review every brief directly and respond within 24 hours.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 font-mono text-xs font-bold uppercase tracking-wider">
            <button
              type="button"
              onClick={() => onOpenContact('Web Design & Development Inquiry')}
              data-cursor="hover"
              className="px-8 py-4 rounded-xl bg-[#FF4D0A] hover:bg-[#ff6426] text-white transition-all shadow-[0_4px_30px_rgba(255,77,10,0.4)] flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>START A WEB DESIGN PROJECT</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <a
              href="/services/brand-identity-design"
              onClick={(e) => {
                e.preventDefault()
                onNavigate('/services/brand-identity-design')
              }}
              data-cursor="hover"
              className="px-6 py-4 rounded-xl bg-[#1D1D1D] hover:bg-[#252525] border border-white/15 text-white transition-all flex items-center gap-2"
            >
              <span>EXPLORE BRAND IDENTITY SERVICE &rarr;</span>
            </a>
          </div>

        </div>
      </section>

      {/* Shared Persistent Footer */}
      <Footer onOpenContact={onOpenContact} onNavigate={onNavigate} />

    </article>
  )
}
