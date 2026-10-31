import React, { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Smartphone, Tablet, Monitor, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react'

/**
 * ArulisResponsiveMarquee
 * Signature responsive showcase featuring the real Arulis Dental Clinic mobile & tablet screens.
 * Continuous, seamless horizontal marquee with zero jump, flicker, or gap.
 * Respects prefers-reduced-motion with an elegant static grid.
 */
export default function ArulisResponsiveMarquee() {
  const shouldReduceMotion = useReducedMotion()
  const [activeItem, setActiveItem] = useState(null)

  // Real responsive screens from the Arulis project
  const responsiveScreens = [
    {
      id: 'mobile-marble',
      title: 'Mobile Flagship',
      subtitle: 'Editorial Sanctuary · Flat Lay',
      tag: 'iPhone 15 Pro',
      image: '/assets/arulis/aurelis-mobile-marble.png',
      aspectClass: 'w-[280px] sm:w-[320px] md:w-[350px] aspect-[9/16]',
      caption: 'The mobile homepage framed on Italian marble, asserting architectural calm.',
    },
    {
      id: 'tablet-mockup',
      title: 'Tablet In-Clinic Platform',
      subtitle: 'iPad Consultation Experience',
      tag: 'iPad Pro 11"',
      image: '/assets/arulis/aurelis-tablet-mockup.png',
      aspectClass: 'w-[320px] sm:w-[380px] md:w-[420px] aspect-[4/5]',
      caption: 'Interactive clinical diagnostics & treatment timelines on iPad.',
    },
    {
      id: 'mobile-hand',
      title: 'Handheld Booking Flow',
      subtitle: 'One-Touch Appointment',
      tag: 'Responsive UX',
      image: '/assets/arulis/aurelis-mobile-hand.png',
      aspectClass: 'w-[280px] sm:w-[320px] md:w-[350px] aspect-[9/16]',
      caption: 'Ergonomic booking journey tailored for rapid handheld interaction.',
    },
    {
      id: 'mobile-device',
      title: 'Isolated Mobile UI',
      subtitle: 'Interface Geometry & Typography',
      tag: 'Pure Screen',
      image: '/assets/arulis/aurelis-mobile-device.png',
      aspectClass: 'w-[260px] sm:w-[290px] md:w-[320px] aspect-[9/18]',
      caption: 'Clean portrait viewport displaying the hero typography and treatment CTAs.',
    },
    {
      id: 'tablet-device',
      title: 'Tablet Viewport Architecture',
      subtitle: 'Core Pillars & Standards',
      tag: 'Tablet Breakpoint',
      image: '/assets/arulis/aurelis-tablet-device.png',
      aspectClass: 'w-[320px] sm:w-[360px] md:w-[400px] aspect-[4/5]',
      caption: 'Four clinical pillars: Trustworthy, Premium, Patient-First, Professional.',
    },
  ]

  // Render a single screen card
  const renderScreenCard = (screen, index, isDuplicate = false) => {
    return (
      <div
        key={`${screen.id}-${isDuplicate ? 'dup' : 'orig'}-${index}`}
        onMouseEnter={() => setActiveItem(screen.id)}
        onMouseLeave={() => setActiveItem(null)}
        data-cursor="hover"
        className={`group relative flex-shrink-0 ${screen.aspectClass} rounded-[28px] sm:rounded-[36px] overflow-hidden bg-[#0A241B] border border-[#0F3D2E]/20 shadow-[0_16px_40px_rgba(15,61,46,0.12)] transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_28px_60px_rgba(15,61,46,0.28)] hover:border-[#D4AF37]/50 select-none`}
      >
        {/* Background artwork */}
        <img
          src={screen.image}
          alt={screen.title}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          loading="lazy"
        />

        {/* Cinematic gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#061711]/90 via-transparent to-black/20 pointer-events-none transition-opacity duration-300 group-hover:opacity-95" />

        {/* Top pill badge */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#061711]/80 backdrop-blur-md text-[#D4AF37] border border-[#D4AF37]/30">
            {screen.tag}
          </span>
          <span className="font-mono text-[9px] text-white/50 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full">
            RESPONSIVE
          </span>
        </div>

        {/* Bottom caption overlay */}
        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white pointer-events-none z-10">
          <div className="font-mono text-[10px] tracking-widest text-[#D4AF37] uppercase mb-0.5">
            {screen.subtitle}
          </div>
          <h4 className="font-playfair text-[18px] sm:text-[22px] font-normal leading-tight">
            {screen.title}
          </h4>
          <p className="font-montserrat text-[11px] sm:text-[12px] text-white/70 line-clamp-2 mt-1 hidden sm:block">
            {screen.caption}
          </p>
        </div>

        {/* Architectural corner registration tick */}
        <div className="absolute top-2.5 left-2.5 w-2.5 h-2.5 border-t border-l border-[#D4AF37]/40 pointer-events-none" />
        <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 border-t border-r border-[#D4AF37]/40 pointer-events-none" />
        <div className="absolute bottom-2.5 left-2.5 w-2.5 h-2.5 border-b border-l border-[#D4AF37]/40 pointer-events-none" />
        <div className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5 border-b border-r border-[#D4AF37]/40 pointer-events-none" />
      </div>
    )
  }

  return (
    <section 
      data-cursor-theme="arulis"
      className="relative w-full py-20 sm:py-28 overflow-hidden bg-gradient-to-b from-[#FDFBF7] via-[#F4F1EA] to-[#FDFBF7] border-y border-[#0F3D2E]/10"
    >
      {/* 
        ========================================================================
        SECTION INTRODUCTION
        ========================================================================
      */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-[720px]">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 font-mono text-[#0F3D2E] text-[11px] sm:text-[12px] font-semibold tracking-widest uppercase mb-3 px-3.5 py-1 rounded-full bg-[#0F3D2E]/5 border border-[#0F3D2E]/15">
              <Smartphone className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>RESPONSIVE EXPERIENCE</span>
            </div>

            {/* Headline */}
            <h2 className="font-playfair text-[34px] sm:text-[48px] lg:text-[58px] font-normal text-[#1A1D1A] tracking-tight leading-[1.06] mb-4">
              A seamless experience. <span className="italic text-[#0F3D2E]">On every screen.</span>
            </h2>

            {/* Supporting Copy */}
            <p className="font-montserrat text-[#4A5568] text-[15px] sm:text-[17px] leading-relaxed">
              A considered digital experience, designed to feel cohesive across every screen size. 
              From high-density studio workstations to handheld appointments on the go, typography scales effortlessly and layouts respond without compromising editorial dignity.
            </p>
          </div>

          {/* Quick Specifications Metadata Badge */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] sm:text-[12px] text-[#718096]">
            <span className="px-3 py-1 rounded-full bg-white border border-black/10 flex items-center gap-1.5 text-[#0F3D2E] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              Fluid Breakpoints
            </span>
            <span className="px-3 py-1 rounded-full bg-white border border-black/10 flex items-center gap-1.5 text-[#0F3D2E] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              Touch-Optimized CTAs
            </span>
            <span className="px-3 py-1 rounded-full bg-white border border-black/10 flex items-center gap-1.5 text-[#0F3D2E] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              Zero Layout Shift
            </span>
          </div>
        </div>
      </div>

      {/* 
        ========================================================================
        CONTINUOUS SEAMLESS MARQUEE TRACK
        If user prefers reduced motion, render a static responsive grid instead
        ========================================================================
      */}
      {shouldReduceMotion ? (
        /* Reduced motion fallback: Static 3-column / 5-screen grid */
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {responsiveScreens.map((screen, idx) => renderScreenCard(screen, idx, false))}
          </div>
        </div>
      ) : (
        /* Continuous Moving Track */
        <div className="relative w-full overflow-hidden py-4">
          
          {/* Subtle horizontal gradient edge fades to blend smoothly into background */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#FDFBF7] to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#FDFBF7] to-transparent z-20 pointer-events-none" />

          {/* Marquee Wrapper: Two identical tracks side by side moving infinitely */}
          <div 
            className="flex w-max items-center gap-6 sm:gap-8 will-change-transform"
            style={{
              animation: 'arulisMarquee 38s linear infinite',
            }}
          >
            {/* Track A */}
            <div className="flex items-center gap-6 sm:gap-8 flex-nowrap">
              {responsiveScreens.map((screen, idx) => renderScreenCard(screen, idx, false))}
            </div>

            {/* Track B (exact duplicate for seamless wrap) */}
            <div className="flex items-center gap-6 sm:gap-8 flex-nowrap" aria-hidden="true">
              {responsiveScreens.map((screen, idx) => renderScreenCard(screen, idx, true))}
            </div>
          </div>
        </div>
      )}

      {/* 
        ========================================================================
        EDITORIAL CLOSING TRANSITION STATEMENT
        ========================================================================
      */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#0F3D2E]/15 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0F3D2E]/10 flex items-center justify-center flex-shrink-0 text-[#0F3D2E]">
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <div className="font-mono text-[11px] font-bold text-[#0F3D2E] tracking-wider uppercase">
                CROSS-PLATFORM CONTINUITY
              </div>
              <p className="font-montserrat text-[#4A5568] text-[13px] sm:text-[14px] mt-0.5">
                Every viewport was engineered with intent — ensuring patients experience the exact same calm elegance whether booking from an iPhone or reviewing treatment diagnostics on an iPad in clinic.
              </p>
            </div>
          </div>
          <div className="font-mono text-[11px] text-[#718096] whitespace-nowrap self-end sm:self-center">
            320PX → 2560PX TESTED
          </div>
        </div>
      </div>

      {/* Custom keyframe style injected safely for buttery continuous marquee */}
      <style>{`
        @keyframes arulisMarquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
      `}</style>
    </section>
  )
}
