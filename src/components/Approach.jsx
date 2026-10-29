import React, { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, CheckCircle2, ChevronDown, Sparkles } from 'lucide-react'
import ServiceModal from './ServiceModal'

export default function Approach({ onOpenContact }) {
  const shouldReduceMotion = useReducedMotion()

  // Desktop active hovered/pinned card state
  const [hoveredCard, setHoveredCard] = useState(null)
  const [pinnedCard, setPinnedCard] = useState(null)

  // Mobile single-open accordion state (null = all collapsed, string = opened service id)
  const [mobileOpenId, setMobileOpenId] = useState(null)

  // Mobile category filter for quick, clutter-free browsing
  const [mobileCategory, setMobileCategory] = useState('ALL')

  // Service Detail Modal state
  const [detailModalService, setDetailModalService] = useState(null)

  const servicesList = [
    {
      id: "branding",
      index: "01",
      title: "Brand Identity",
      group: "BRAND & DESIGN",
      tag: "STRATEGY & DESIGN",
      desc: "Distinctive visual systems, brand guidelines, bespoke logotypes, and art direction that command attention and build lasting equity.",
      fullDesc: "We craft cohesive, high-impact brand identities that cut through market noise. From foundational brand strategy and narrative to bespoke typography, iconography, color systems, and comprehensive brand guidelines, we ensure every touchpoint feels distinct and unforgettable.",
      deliverables: [
        "Visual Identity Systems",
        "Logo & Iconography Suite",
        "Brand Style Guides & Rules",
        "Typography Curation"
      ],
      timeline: "2-3 Weeks",
      outcomes: "Enduring visual authority, unified brand language across digital and print touchpoints."
    },
    {
      id: "websites",
      index: "02",
      title: "Websites & Web Apps",
      group: "WEB & DIGITAL",
      tag: "DIGITAL EXPERIENCES",
      desc: "Immersive, motion-driven web experiences built on modern frameworks, engineered for high conversion, speed, and aesthetic excellence.",
      fullDesc: "Modern digital flagships engineered with React, Next.js, and Three.js. We blend cutting-edge creative interaction, smooth kinetic motion, and responsive performance with robust headless architecture to create unforgettable digital destinations.",
      deliverables: [
        "Custom React/Next.js Sites",
        "Motion & 3D Web Design",
        "Headless CMS Integration",
        "Performance & SEO Tuning"
      ],
      timeline: "3-5 Weeks",
      outcomes: "Lightning-fast performance, award-winning aesthetics, and seamless user conversion flows."
    },
    {
      id: "landing-pages",
      index: "03",
      title: "Landing Pages",
      group: "WEB & DIGITAL",
      tag: "CONVERSION & LAUNCH",
      desc: "High-impact storytelling pages designed to convert cold traffic into loyal clients and launch products with maximum authority.",
      fullDesc: "Targeted, conversion-focused landing experiences that combine persuasive editorial narrative, dynamic micro-interactions, and psychological friction-reduction. Engineered to maximize return on ad spend and launch new products with momentum.",
      deliverables: [
        "Product Launch Pages",
        "SaaS Landing Pages",
        "High-Conversion Funnels",
        "A/B Testing Architecture"
      ],
      timeline: "1-2 Weeks",
      outcomes: "High conversion rates, crystal-clear value propositions, and turnkey analytics integration."
    },
    {
      id: "graphic-design",
      index: "04",
      title: "Graphic & Poster Design",
      group: "BRAND & DESIGN",
      tag: "EDITORIAL & VISUAL ART",
      desc: "Bold poster series, digital illustrations, marketing collaterals, and print assets crafted with editorial precision and creative grit.",
      fullDesc: "Visually arresting print and digital collaterals that bridge contemporary brutalist typography with refined studio craft. From promotional poster series and album artwork to social campaign packs and merchandise design.",
      deliverables: [
        "Poster & Cover Art",
        "Social Campaign Assets",
        "Editorial Layouts",
        "Merchandise & Print Design"
      ],
      timeline: "1-2 Weeks",
      outcomes: "Scroll-stopping visual assets, gallery-grade artwork, and print-ready production files."
    },
    {
      id: "ecommerce",
      index: "05",
      title: "E-Commerce",
      group: "WEB & DIGITAL",
      tag: "REVENUE & SCALE",
      desc: "Frictionless direct-to-consumer online storefronts designed to elevate brand perception, streamline buying, and increase average order value.",
      fullDesc: "Bespoke e-commerce architectures tailored for modern consumer brands. We build intuitive product catalogs, storytelling product pages, optimized one-click checkout flows, and automated inventory sync that turn visitors into repeat buyers.",
      deliverables: [
        "Shopify & Custom Stores",
        "Product Showcase Pages",
        "Checkout Flow Optimization",
        "Payment & Inventory Flow"
      ],
      timeline: "3-4 Weeks",
      outcomes: "Higher checkout completion rates, elevated brand premium, and frictionless payment processing."
    },
    {
      id: "digital-solutions",
      index: "06",
      title: "Digital Solutions",
      group: "WEB & DIGITAL",
      tag: "TECHNICAL EXECUTION",
      desc: "Tailored digital infrastructure, custom interactive tools, and automated workflows built to scale your business operations effortlessly.",
      fullDesc: "Custom web utilities, interactive client portals, internal dashboards, and third-party API integrations designed to eliminate operational bottlenecks and automate client interactions with precision.",
      deliverables: [
        "Custom Web Tools & Portals",
        "Third-party API Integrations",
        "Interactive Calculators",
        "Cloud & Domain Deployment"
      ],
      timeline: "2-4 Weeks",
      outcomes: "Automated business workflows, robust data pipelines, and scalable cloud architecture."
    }
  ]

  const stats = [
    { value: "03", label: "Creative minds" },
    { value: "03", label: "Shared Vision" },
    { value: "∞", label: "Ideas to Explore" },
  ]

  const approachPillars = [
    { title: "RESEARCH & INSIGHTS", desc: "Understanding market dynamics and audience behavior." },
    { title: "DESIGN & IDENTITY", desc: "Distinctive visual systems that build lasting brand equity." },
    { title: "BUILD WITH PURPOSE", desc: "Engineered for speed, conversion, and effortless scale." }
  ]

  const steps = [
    { num: "01", title: "UNDERSTAND", desc: "Discover your business, audience, and requirements." },
    { num: "02", title: "PLAN", desc: "Define architecture, visual style, and roadmap." },
    { num: "03", title: "CREATE", desc: "Design and build, refining with your feedback." },
    { num: "04", title: "DELIVER", desc: "Launch the final asset and prepare for scale." },
  ]

  const teamMembers = [
    {
      name: "Tanay Deshmukh",
      role: "FOUNDER · Design & Technical",
      image: "/assets/tanay.png",
      tag: "Founder & Lead",
    },
    {
      name: "Vikranth Dixit",
      role: "Social Media & creative",
      image: "/assets/vikranth.png",
      tag: "Creative",
    },
    {
      name: "TANMAY SHORI",
      role: "Social Media & creative",
      image: "/assets/tanmay.png",
      tag: "Creative",
    },
  ]

  const toolkit = [
    { name: "Figma", icon: "/assets/icon-figma.png" },
    { name: "Canva", icon: "/assets/icon-canva.png" },
    { name: "Affinity", icon: "/assets/icon-affinity.png" },
    { name: "Python", icon: "/assets/icon-python.png" },
    { name: "Next.js", icon: "/assets/icon-next.png" },
    { name: "Node.js", icon: "/assets/icon-node.png" },
    { name: "TypeScript", icon: "/assets/icon-ts.png" },
    { name: "Vite", icon: "/assets/icon-vite.png" },
  ]

  // Toggle mobile accordion row (single-open accordion)
  const toggleMobileRow = (id) => {
    setMobileOpenId(prev => (prev === id ? null : id))
  }

  // Toggle desktop pinned state on click / keyboard
  const toggleDesktopCard = (index) => {
    setPinnedCard(prev => (prev === index ? null : index))
  }

  // Filtered services for mobile view
  const mobileFilteredServices = servicesList.filter(s => {
    if (mobileCategory === 'ALL') return true
    return s.group === mobileCategory
  })

  return (
    <section id="services" className="relative py-8 sm:py-12 px-2 sm:px-4 lg:px-6 max-w-[1400px] mx-auto scroll-mt-24 select-none">
      
      {/* 
        ========================================================================
        Figma Frame 7: Unified Master Card [1382 x 2449 px]
        Contains Services & Capabilities, IDEAS INTO IMPACT, Process Cards, Team & Toolkit
        ========================================================================
      */}
      <div className="relative rounded-[26px] sm:rounded-[32px] overflow-hidden bg-[#0A0706] border border-white/10 shadow-[0_24px_65px_rgba(0,0,0,0.85)] text-white px-4 sm:px-8 lg:px-14 py-8 sm:py-12 lg:py-16">
        
        {/* Background Atmosphere Layer using user's authentic bg asset */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img 
            src="/assets/bg.png" 
            alt="Services background" 
            className="w-full h-full object-cover object-center select-none"
            loading="eager"
            decoding="sync"
          />
          {/* Subtle dark overlay to preserve text readability while retaining fiery atmosphere */}
          <div className="absolute inset-0 bg-[#0A0706]/85" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0706]/95 via-transparent to-[#0A0706]/95" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] lg:w-[1000px] h-[500px] bg-gradient-radial from-[#FF4D0A]/20 via-transparent to-transparent blur-[120px]" />
        </div>

        {/* Dramatic Layered Background Typography Watermark */}
        <div 
          aria-hidden="true" 
          className="absolute top-4 right-4 sm:right-10 pointer-events-none select-none opacity-[0.03] font-anton text-[clamp(4.5rem,14vw,13rem)] tracking-tight text-white uppercase leading-none overflow-hidden z-0"
        >
          SERVICES
        </div>

        {/* 1. Header: [ SERVICES & EXPERTISE ] + Creative Digital Studio */}
        <motion.div 
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 max-w-[1100px] mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-2 font-mono text-[#FF8738] text-[11px] sm:text-[13px] font-semibold tracking-widest uppercase mb-2 px-3 py-1 rounded-full bg-[#FF4D0A]/10 border border-[#FF4D0A]/20">
            <Sparkles className="w-3.5 h-3.5 text-[#FF8738]" />
            <span>SERVICES &amp; EXPERTISE</span>
          </div>
          <h2 className="font-sans font-bold text-[30px] sm:text-[42px] lg:text-[50px] text-white tracking-tight leading-tight mb-2.5">
            Creative Digital Studio
          </h2>
          <p className="font-mono text-white/80 text-[13px] sm:text-[14px] lg:text-[15px] max-w-[760px] leading-relaxed">
            We build bold digital experiences, distinctive brand identities, and intelligent digital solutions that help ambitious businesses stand out, connect with their audience, and grow.
          </p>
        </motion.div>

        {/* 
          ========================================================================
          2. DESKTOP — COMPACT HOVER-REVEAL SERVICE CARDS (md+ screens)
          3-column on wide desktop, 2-column on medium screens.
          Default state: compact (~110-120px height) showing index, tag, title & indicator.
          Hover/Pin state: reveals short description, deliverables, and direct actions.
          ========================================================================
        */}
        <div className="relative z-10 hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 items-start mb-8 sm:mb-12">
          {servicesList.map((service, index) => {
            const isHovered = hoveredCard === index
            const isPinned = pinnedCard === index
            const isExpanded = isHovered || isPinned

            return (
              <motion.div
                key={service.id}
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                aria-controls={`service-desc-${service.id}`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => toggleDesktopCard(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    toggleDesktopCard(index)
                  }
                }}
                data-cursor="hover"
                className={`group relative rounded-2xl p-5 lg:p-6 transition-colors duration-300 text-left border cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D0A] ${
                  isExpanded
                    ? 'bg-[#18110E] border-[#FF4D0A]/70 shadow-[0_12px_36px_rgba(255,77,10,0.18)]'
                    : 'bg-[#120D0A]/85 border-white/[0.08] hover:border-[#FF4D0A]/40 hover:bg-[#150F0D]'
                }`}
              >
                {/* Compact Default Header: Index, Tag, Title & Subtle Micro Arrow */}
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[12px] lg:text-[13px] font-bold text-[#FF8738]">
                      {service.index}
                    </span>
                    <span className="font-mono text-[10px] lg:text-[11px] font-semibold tracking-wider uppercase text-white/50 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">
                      {service.tag}
                    </span>
                  </div>

                  {/* Micro Interaction Arrow Indicator */}
                  <div 
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isExpanded
                        ? 'bg-[#FF4D0A] text-white rotate-45 scale-110 shadow-[0_0_12px_rgba(255,77,10,0.5)]'
                        : 'bg-white/5 border border-white/10 text-white/60 group-hover:text-white group-hover:border-white/30'
                    }`}
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Service Title */}
                <h3 className={`font-jaro text-[22px] lg:text-[25px] uppercase tracking-wide transition-colors duration-200 leading-tight ${
                  isExpanded ? 'text-white' : 'text-white/95 group-hover:text-white'
                }`}>
                  {service.title}
                </h3>

                {/* Micro hint in compact state */}
                {!isExpanded && (
                  <div className="mt-2.5 flex items-center gap-1.5 font-mono text-[10px] text-white/40 group-hover:text-[#FF8738]/80 transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D0A]/60" />
                    <span>{service.deliverables.length} Key Deliverables · Hover to reveal</span>
                  </div>
                )}

                {/* Controlled Smooth Expansion on Hover / Pin */}
                <motion.div
                  id={`service-desc-${service.id}`}
                  initial={false}
                  animate={{
                    height: isExpanded ? 'auto' : 0,
                    opacity: isExpanded ? 1 : 0
                  }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { duration: 0.28, ease: [0.16, 1, 0.3, 1] }
                  }
                  className="overflow-hidden"
                >
                  <div className="pt-3.5 mt-3 border-t border-white/[0.08]">
                    {/* Short Description */}
                    <p className="font-mono text-[12px] lg:text-[13px] text-white/80 leading-relaxed mb-3.5">
                      {service.desc}
                    </p>

                    {/* Deliverables List */}
                    <div className="space-y-1.5 mb-4">
                      <div className="font-mono text-[10px] uppercase tracking-wider text-[#FF8738] font-bold mb-1">
                        Key Capabilities:
                      </div>
                      {service.deliverables.map((item, dIdx) => (
                        <div key={dIdx} className="flex items-center gap-2 text-white/85 font-mono text-[11px] lg:text-[12px]">
                          <CheckCircle2 className="w-3 h-3 text-[#FF4D0A] flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* Dual Action Buttons: Primary Start Project & Secondary Full Specs */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onOpenContact(`Service Inquiry: ${service.title}`)
                        }}
                        data-cursor="hover"
                        className="flex-1 py-2 px-3 rounded-xl font-mono text-[11px] lg:text-[12px] font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 bg-[#FF4D0A] hover:bg-[#ff6224] text-white shadow-md active:scale-95"
                      >
                        <span>Start a Project</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setDetailModalService(service)
                        }}
                        data-cursor="hover"
                        title="View complete specifications and turnaround"
                        className="py-2 px-3 rounded-xl font-mono text-[11px] lg:text-[12px] font-medium uppercase tracking-wider transition-colors duration-200 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10"
                      >
                        Specs
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        {/* 
          ========================================================================
          3. MOBILE — TOUCH ACCORDION (< md screens)
          Category filter pills + single-open tap-to-expand list
          ========================================================================
        */}
        <div className="relative z-10 block md:hidden mb-8">
          
          {/* Lightweight Filter Header for quick mobile categorization */}
          <div className="flex items-center gap-1.5 mb-3.5 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'ALL', label: 'ALL (6)' },
              { id: 'BRAND & DESIGN', label: 'BRAND & DESIGN (2)' },
              { id: 'WEB & DIGITAL', label: 'WEB & DIGITAL (4)' },
            ].map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setMobileCategory(cat.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full font-mono text-[10px] font-semibold tracking-wider uppercase transition-colors ${
                  mobileCategory === cat.id
                    ? 'bg-[#FF4D0A] text-white shadow-sm'
                    : 'bg-white/5 text-white/60 border border-white/10 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Accordion Rows */}
          <div className="space-y-2">
            {mobileFilteredServices.map((service) => {
              const isOpen = mobileOpenId === service.id
              return (
                <div
                  key={service.id}
                  className={`rounded-2xl transition-all duration-200 border overflow-hidden ${
                    isOpen
                      ? 'bg-[#18110E] border-[#FF4D0A]/70 shadow-lg'
                      : 'bg-[#120D0A]/90 border-white/[0.08]'
                  }`}
                >
                  {/* Full-width Touch-Target Toggle Button */}
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`mobile-desc-${service.id}`}
                    onClick={() => toggleMobileRow(service.id)}
                    className="w-full p-4 flex items-center justify-between text-left gap-3 outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D0A]"
                  >
                    <div className="flex flex-col items-start gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-[#FF8738]">
                          {service.index}
                        </span>
                        <span className="font-mono text-[10px] uppercase text-white/50 tracking-wider">
                          {service.tag}
                        </span>
                      </div>
                      <span className="font-jaro text-[20px] uppercase tracking-wide text-white leading-tight">
                        {service.title}
                      </span>
                    </div>

                    {/* Rotating Indicator */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                        isOpen
                          ? 'bg-[#FF4D0A] text-white rotate-180'
                          : 'bg-white/5 border border-white/10 text-white/60'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Animated Accordion Content */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`mobile-desc-${service.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={
                          shouldReduceMotion
                            ? { duration: 0 }
                            : { duration: 0.24, ease: [0.16, 1, 0.3, 1] }
                        }
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-1 border-t border-white/[0.08]">
                          {/* Short Description */}
                          <p className="font-mono text-[12px] text-white/80 leading-relaxed mb-3 mt-2">
                            {service.desc}
                          </p>

                          {/* Deliverables List */}
                          <div className="space-y-1.5 mb-4">
                            <div className="font-mono text-[10px] uppercase tracking-wider text-[#FF8738] font-bold mb-1">
                              Key Deliverables:
                            </div>
                            {service.deliverables.map((item, dIdx) => (
                              <div key={dIdx} className="flex items-center gap-2 text-white/85 font-mono text-[11px]">
                                <CheckCircle2 className="w-3 h-3 text-[#FF4D0A] flex-shrink-0" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col gap-2">
                            <button
                              type="button"
                              onClick={() => onOpenContact(`Service Inquiry: ${service.title}`)}
                              className="w-full py-2.5 px-4 rounded-xl font-mono text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 bg-[#FF4D0A] text-white shadow-md active:scale-95"
                            >
                              <span>Start a Project</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setDetailModalService(service)}
                              className="w-full py-2 px-3 rounded-xl font-mono text-[11px] uppercase tracking-wider text-center text-white/60 hover:text-white bg-white/5 border border-white/10"
                            >
                              View Full Specifications
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>

        {/* 3. Monumental Typography Artwork: IDEAS INTO IMPACT */}
        <div className="relative z-10 my-4 sm:my-8 select-none overflow-hidden">
          <h1 className="font-anton text-[clamp(3.6rem,8.8vw,8rem)] leading-[0.88] uppercase tracking-wide text-white drop-shadow-[0_8px_45px_rgba(0,0,0,0.95)]">
            IDEAS<br />
            INTO IMPACT
          </h1>
        </div>

        {/* 4. Methodology & Process Grid: 3 Stats Badges + [01] OUR APPROACH + [02] HOW WE WORK */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch mb-10 sm:mb-14">
          
          {/* Left Column: 3 Stacked Badges (03, 03, ∞) */}
          <div className="lg:col-span-3 flex flex-row lg:flex-col gap-3.5 sm:gap-4 justify-between">
            {stats.map((s, idx) => (
              <div 
                key={idx}
                className="flex-1 p-4 sm:p-5 rounded-2xl bg-[#15100E]/90 backdrop-blur-md border border-white/[0.1] hover:border-[#FF4D0A]/40 flex flex-col justify-center items-center text-center shadow-lg transition-colors group"
              >
                <div className="font-mono text-[32px] sm:text-[40px] lg:text-[46px] font-normal text-white group-hover:text-[#FF8738] transition-colors leading-none mb-1">
                  {s.value}
                </div>
                <div className="font-mono text-[11px] sm:text-[12px] text-white/70 tracking-wide">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Center Card: [ 01 ] OUR APPROACH (lg:col-span-4) */}
          <div className="lg:col-span-4 relative rounded-2xl sm:rounded-3xl p-5 sm:p-7 bg-[#15100E]/90 backdrop-blur-md border border-white/[0.1] hover:border-[#FF4D0A]/40 shadow-xl flex flex-col justify-between transition-colors">
            <div>
              <div className="inline-block px-3 py-1 rounded-md bg-[#FF4D0A]/15 text-[#FF8738] font-mono text-[11px] sm:text-[12px] tracking-wider mb-3.5 border border-[#FF4D0A]/25">
                [ 01 ] OUR APPROACH
              </div>

              <h3 className="font-jaro text-[26px] sm:text-[32px] leading-tight text-white mb-2">
                Your vision.<br />
                <span className="text-[#FF8738]">Our execution.</span>
              </h3>

              <div className="w-10 h-0.5 bg-[#FF4D0A] my-3 rounded-full" />

              <p className="font-mono text-[12px] sm:text-[13px] text-white/75 leading-relaxed mb-5">
                We take the time to understand your business, audience, and goals before shaping a digital experience around them.
              </p>
            </div>

            {/* Approach Pillars */}
            <div className="space-y-2">
              {approachPillars.map((pillar, i) => (
                <div 
                  key={i}
                  className="p-2.5 sm:p-3 rounded-xl bg-black/40 border border-white/[0.06] hover:border-[#FF4D0A]/30 transition-all text-left"
                >
                  <div className="flex items-center gap-2 text-white font-mono text-[11px] sm:text-[12px] font-bold tracking-wider">
                    <span className="text-[#FF4D0A]">|</span>
                    <span>{pillar.title}</span>
                  </div>
                  <p className="font-mono text-[10px] sm:text-[11px] text-white/60 mt-0.5 pl-3 leading-snug">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Card: [ 02 ] HOW WE WORK (lg:col-span-5) */}
          <div className="lg:col-span-5 relative rounded-2xl sm:rounded-3xl p-5 sm:p-7 bg-[#15100E]/90 backdrop-blur-md border border-white/[0.1] hover:border-[#FF4D0A]/40 shadow-xl flex flex-col justify-between transition-colors">
            <div>
              <div className="inline-block px-3 py-1 rounded-md bg-[#FF4D0A]/15 text-[#FF8738] font-mono text-[11px] sm:text-[12px] tracking-wider mb-3.5 border border-[#FF4D0A]/25">
                [ 02 ] HOW WE WORK
              </div>

              <h3 className="font-jaro text-[26px] sm:text-[32px] leading-tight text-white mb-2">
                A clear process.<br />
                <span className="text-[#FF8738]">From idea to launch.</span>
              </h3>

              <div className="w-10 h-0.5 bg-[#FF4D0A] my-3 rounded-full" />

              <p className="font-mono text-[12px] sm:text-[13px] text-white/75 leading-relaxed mb-4">
                Four step, structured, iterative, and clear at every step.
              </p>
            </div>

            {/* Steps List */}
            <div className="space-y-2">
              {steps.map((st, i) => (
                <div 
                  key={i}
                  className="p-2.5 sm:p-3 rounded-xl bg-black/40 border border-white/[0.06] hover:border-[#FF4D0A]/30 transition-all flex items-start gap-3"
                >
                  <span className="font-mono text-[#FF8738] font-bold text-[12px] sm:text-[13px] pt-0.5">
                    {st.num}
                  </span>
                  <div>
                    <h5 className="font-mono text-[11px] sm:text-[12px] font-bold text-white tracking-wide">
                      {st.title}
                    </h5>
                    <p className="font-mono text-[10px] sm:text-[11px] text-white/60 mt-0.5 leading-snug">
                      {st.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 
          ========================================================================
          5. Inner Container: Team & Everyday Toolkit (Figma Rectangle 15)
          ========================================================================
        */}
        <div id="about" className="relative z-10 rounded-[22px] sm:rounded-[28px] p-5 sm:p-8 lg:p-10 bg-[#120D0A]/90 backdrop-blur-md border border-white/10 shadow-2xl">
          
          {/* 3 Team Member Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-10 sm:mb-12">
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl overflow-hidden bg-black/50 border border-white/[0.08] hover:border-[#FF4D0A]/40 shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Portrait with glowing orange ambiance */}
                <div className="relative aspect-[4/5] overflow-hidden bg-black">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                  
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/[0.12] text-[11px] font-mono text-[#FF8738]">
                    {member.tag}
                  </div>
                </div>

                {/* Info Bottom */}
                <div className="p-4 sm:p-5 pt-2 flex flex-col items-start bg-black/60">
                  <h4 className="font-mono text-[18px] sm:text-[20px] font-bold text-white group-hover:text-[#FF8738] transition-colors">
                    {member.name}
                  </h4>
                  <p className="font-mono text-[11px] text-white/70 tracking-wider uppercase mt-1">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Typography Banner */}
          <div className="text-center max-w-[900px] mx-auto mb-10 sm:mb-12">
            <h3 className="font-mono text-[22px] sm:text-[30px] lg:text-[36px] font-bold text-white uppercase tracking-tight leading-tight mb-2.5">
              WE MAKE IDEAS<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FF8738] to-[#FF4D0A]">
                IMPOSSIBLE TO IGNORE
              </span>
            </h3>
            <p className="font-mono text-[12px] sm:text-[14px] lg:text-[15px] text-white/75 font-normal leading-relaxed max-w-[720px] mx-auto">
              We build distinctive brands, immersive websites, and digital experiences for businesses ready to stand out.
            </p>
          </div>

          {/* Everyday Toolkit Bar matching Figma Group 9 */}
          <div className="relative rounded-2xl p-5 sm:p-6 bg-black/60 border border-white/[0.08] flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-lg">
            <div>
              <h4 className="font-mono text-[16px] sm:text-[18px] font-bold text-white">
                Our Everyday Toolkit
              </h4>
              <p className="font-mono text-[11px] sm:text-[12px] text-white/70 mt-1 max-w-[380px]">
                The tools behind our process, from the first sketch to the final launch.
              </p>
            </div>

            {/* Brand Tool Icons */}
            <div className="flex items-center gap-3 flex-wrap">
              {toolkit.map((tool, idx) => (
                <div 
                  key={idx}
                  title={tool.name}
                  data-cursor="hover"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/[0.05] border border-white/[0.1] hover:border-[#FF4D0A]/50 hover:bg-[#FF4D0A]/15 flex items-center justify-center p-2 transition-all duration-200 cursor-default group"
                >
                  <img 
                    src={tool.icon} 
                    alt={tool.name} 
                    className="w-full h-full object-contain filter group-hover:brightness-110 transition-all"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Comprehensive Service Deep-Dive Specification Modal */}
      <ServiceModal
        isOpen={Boolean(detailModalService)}
        onClose={() => setDetailModalService(null)}
        service={detailModalService}
        onInquire={onOpenContact}
      />

    </section>
  )
}
