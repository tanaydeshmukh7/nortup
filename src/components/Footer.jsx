import React, { useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, ArrowUp, Sparkles } from 'lucide-react'
import FooterCompass from './FooterCompass'

export default function Footer({ onOpenContact, onOpenPrivacy }) {
  const footerContainerRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const currentYear = new Date().getFullYear()

  const handleBackToTop = (e) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleStartProject = () => {
    if (onOpenContact) {
      onOpenContact('Project Inquiry: Footer CTA')
    } else {
      window.location.href = 'mailto:northup4work@gmail.com?subject=[Northup%20Inquiry]%20Start%20a%20Project'
    }
  }

  return (
    <footer className="w-full px-2 sm:px-4 lg:px-6 pt-4 pb-8 select-none bg-white">
      {/* 
        ========================================================================
        Northup Studio Premium Master Footer
        Cinematic Dark-Burgundy-to-Orange Atmosphere, Editorial Typography,
        Organized Link Columns, and Monumental NORTHUP® Signature
        ========================================================================
      */}
      <div 
        ref={footerContainerRef}
        className="relative w-full max-w-[1400px] mx-auto rounded-[24px] sm:rounded-[32px] overflow-hidden border border-white/10 shadow-[0_24px_65px_rgba(0,0,0,0.85)] bg-[#090504] px-5 sm:px-10 lg:px-16 pt-10 sm:pt-16 lg:pt-20 pb-8 sm:pb-12 lg:pb-14 text-white"
      >
        
        {/* Background Atmospheric Layers: Cinematic Dark-Burgundy-to-Orange Gradient */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Rich Radial Aura from bottom-right */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 82% 65%, #ff4d00 0%, #ab1400 32%, #380702 62%, #080302 100%)'
            }}
          />
          {/* Authentic studio texture overlay */}
          <img 
            src="/assets/hero-bg-figma.png" 
            alt="" 
            aria-hidden="true" 
            className="w-full h-full object-cover mix-blend-screen opacity-75 scale-105"
            loading="lazy"
          />
          {/* Deep dark vignettes ensuring flawless typographic legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#090504]/95 via-[#090504]/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090504]/90 via-transparent to-[#090504]/60" />
        </div>

        {/* 
          ========================================================================
          1. TOP SECTION — CONTACT AND BRAND (Spacious Two-Column Editorial Grid)
          ========================================================================
        */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-10 sm:mb-14">
          
          {/* LEFT COLUMN: Project Enquiry Headline & CTA (lg:col-span-7) */}
          <motion.div 
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Small uppercase label */}
            <div className="inline-flex items-center gap-2 font-mono text-[#FF8738] text-[11px] sm:text-[12px] font-semibold tracking-widest uppercase mb-3 px-3 py-1 rounded-full bg-[#FF4D0A]/10 border border-[#FF4D0A]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#FF8738]" />
              <span>[ LET'S BUILD SOMETHING ]</span>
            </div>

            {/* Large editorial headline */}
            <h2 className="font-anton text-[34px] sm:text-[50px] lg:text-[62px] font-normal text-white uppercase tracking-tight leading-[0.95] mb-3.5">
              HAVE A PROJECT<br className="hidden sm:block" /> IN MIND?
            </h2>

            {/* Short supporting copy */}
            <p className="font-mono text-white/75 text-[13px] sm:text-[15px] lg:text-[16px] max-w-[520px] leading-relaxed mb-6 sm:mb-8">
              Let's turn your next big idea into something people remember.
            </p>

            {/* Prominent CTA button */}
            <button
              type="button"
              onClick={handleStartProject}
              data-cursor="hover"
              className="group relative inline-flex items-center justify-center gap-2.5 px-7 sm:px-9 py-3.5 sm:py-4 rounded-full bg-[#FF4D0A] hover:bg-[#ff6426] text-white font-mono text-[12px] sm:text-[13px] font-bold tracking-wider uppercase transition-all duration-300 shadow-[0_4px_24px_rgba(255,77,10,0.38)] hover:shadow-[0_8px_36px_rgba(255,77,10,0.58)] active:scale-95 border border-[#FF8738]/30"
            >
              <span>START A PROJECT</span>
              <ArrowUpRight className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </button>
          </motion.div>

          {/* RIGHT COLUMN: Brand, Location & Direct Contact (lg:col-span-5) */}
          <motion.div 
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="lg:col-span-5 flex flex-col items-start lg:items-end text-left lg:text-right gap-3 pt-2 lg:pt-3"
          >
            {/* Brand name */}
            <h3 className="font-jaro text-[32px] sm:text-[42px] lg:text-[48px] uppercase text-white tracking-wide leading-none">
              northup.studio
            </h3>

            {/* Location */}
            <div className="font-mono text-[12px] sm:text-[14px] text-white/60 tracking-wider uppercase">
              Pune, India
            </div>

            {/* Functional Email Contact Link */}
            <a 
              href="mailto:northup4work@gmail.com" 
              data-cursor="hover"
              className="group inline-flex items-center gap-2 font-mono text-[13px] sm:text-[15px] text-white/90 hover:text-[#FF8738] transition-colors py-1 outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D0A] rounded-lg"
            >
              <span className="underline decoration-white/30 underline-offset-4 group-hover:decoration-[#FF8738] transition-all">
                northup4work@gmail.com
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#FF8738] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* Official Instagram Handle Link */}
            <a 
              href="https://www.instagram.com/northup.studio/" 
              target="_blank" 
              rel="noreferrer" 
              data-cursor="hover"
              className="group inline-flex items-center gap-2 font-mono text-[12px] sm:text-[14px] text-white/75 hover:text-[#FF8738] transition-colors py-0.5 outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D0A] rounded-lg"
            >
              <span className="underline decoration-white/30 underline-offset-4 group-hover:decoration-[#FF8738] transition-all">
                @northup.studio
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#FF8738] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* Availability Pill */}
            <div className="mt-1 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] sm:text-[11px] tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available for New Projects</span>
            </div>
          </motion.div>

        </div>

        {/* Thin Divider Line between Top & Middle Sections */}
        <div className="relative z-10 w-full h-px bg-white/10 my-8 sm:my-12" />

        {/* 
          ========================================================================
          2. MIDDLE SECTION — ORGANIZED LINK COLUMNS (Index, Information, Follow Us)
          ========================================================================
        */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 mb-10 sm:mb-14">
          
          {/* Column 1: INDEX */}
          <div className="flex flex-col items-start gap-3">
            <h4 className="font-mono text-[11px] sm:text-[12px] font-bold text-[#FF8738] tracking-widest uppercase mb-1">
              INDEX
            </h4>
            <ul className="space-y-2">
              {[
                { name: 'Home', href: '#' },
                { name: 'Work', href: '#work' },
                { name: 'Services', href: '#services' },
                { name: 'About Us', href: '#about' },
              ].map((item, idx) => (
                <li key={idx}>
                  <a 
                    href={item.href} 
                    data-cursor="hover" 
                    className="group inline-flex items-center gap-1.5 font-mono text-[13px] sm:text-[14px] text-white/70 hover:text-white transition-all duration-200"
                  >
                    <span className="text-[#FF4D0A] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
                      ›
                    </span>
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                      {item.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: INFORMATION */}
          <div className="flex flex-col items-start gap-3">
            <h4 className="font-mono text-[11px] sm:text-[12px] font-bold text-[#FF8738] tracking-widest uppercase mb-1">
              INFORMATION
            </h4>
            <ul className="space-y-2">
              {[
                { name: 'Licenses and Agreement', href: '#' },
                { name: 'Privacy Policy', href: '#' },
                { name: 'Cookie Settings', href: '#' },
              ].map((item, idx) => (
                <li key={idx}>
                  <a 
                    href={item.href} 
                    onClick={(e) => {
                      if (item.name === 'Privacy Policy' && onOpenPrivacy) {
                        e.preventDefault()
                        onOpenPrivacy()
                      }
                    }}
                    data-cursor="hover" 
                    className="group inline-flex items-center gap-1.5 font-mono text-[13px] sm:text-[14px] text-white/70 hover:text-white transition-all duration-200"
                  >
                    <span className="text-[#FF4D0A] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
                      ›
                    </span>
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                      {item.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: FOLLOW US */}
          <div className="col-span-2 md:col-span-1 flex flex-col items-start gap-3 pt-2 md:pt-0">
            <h4 className="font-mono text-[11px] sm:text-[12px] font-bold text-[#FF8738] tracking-widest uppercase mb-1">
              FOLLOW US
            </h4>
            <ul className="flex flex-row md:flex-col items-center md:items-start gap-5 md:gap-2">
              {[
                { name: 'Instagram', handle: '@northup.studio', href: 'https://www.instagram.com/northup.studio/' },
                { name: 'LinkedIn', handle: '', href: 'https://linkedin.com' },
              ].map((item, idx) => (
                <li key={idx}>
                  <a 
                    href={item.href} 
                    target="_blank" 
                    rel="noreferrer" 
                    data-cursor="hover" 
                    className="group inline-flex items-center gap-1.5 font-mono text-[13px] sm:text-[14px] text-white/70 hover:text-white transition-all duration-200"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                      {item.name} {item.handle && <span className="text-[#FF8738] text-[12px] opacity-90">({item.handle})</span>}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-white/40 group-hover:text-[#FF8738] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* 
          ========================================================================
          3. BOTTOM SECTION — THE NORTHUP SIGNATURE (Typographic Brand Wordmark)
          ========================================================================
        */}
        <motion.div 
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0.2, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "200px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 w-full overflow-hidden my-4 sm:my-8 select-none"
        >
          <div className="font-anton text-[clamp(3.3rem,16.5vw,13.8rem)] uppercase leading-[0.82] tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-[#F5F1ED] to-white/30 whitespace-nowrap drop-shadow-[0_12px_40px_rgba(0,0,0,0.85)] flex items-start justify-center sm:justify-start">
            <span>NORTHUP</span>
            <span className="font-mono text-[0.32em] text-[#FF8738] ml-1.5 sm:ml-3 pt-1 sm:pt-2 font-bold tracking-normal select-none">
              ®
            </span>
          </div>
        </motion.div>

        {/* 
          ========================================================================
          4. DEDICATED COMPASS LANDING STAGE (Scroll-Scrubbed Bottom Ground Plane)
          ========================================================================
        */}
        <FooterCompass containerRef={footerContainerRef} />

        {/* Thin Divider Line above the bottom meta bar */}
        <div className="relative z-10 w-full h-px bg-white/10 mt-6 sm:mt-8 mb-5 sm:mb-6" />

        {/* 
          ========================================================================
          5. MINIMAL BOTTOM BAR (Copyright, Pune, India, and Back to Top)
          ========================================================================
        */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] sm:text-[12px] text-white/60 tracking-wider">
          {/* Copyright with dynamic year and location */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-center sm:text-left">
            <span>&copy; {currentYear} NORTHUP STUDIO.</span>
            <span className="text-white/30 hidden sm:inline">&middot;</span>
            <span className="uppercase text-white/50">PUNE, INDIA</span>
          </div>

          {/* Smooth Back to Top Action */}
          <button
            type="button"
            onClick={handleBackToTop}
            data-cursor="hover"
            className="group inline-flex items-center gap-1.5 text-white/70 hover:text-[#FF8738] transition-colors py-1 px-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D0A]"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-1 transition-transform duration-200 text-[#FF8738]" />
          </button>
        </div>

      </div>
    </footer>
  )
}
