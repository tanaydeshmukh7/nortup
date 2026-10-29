import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

export default function Navbar({ onOpenContact }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const navRef = useRef(null)

  // Close mobile menu on Escape key or click outside
  useEffect(() => {
    if (!mobileMenuOpen) return

    const handleKey = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }

    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKey)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [mobileMenuOpen])

  return (
    <motion.header 
      ref={navRef}
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
      className="relative w-full flex justify-center px-3 sm:px-6 pt-3 sm:pt-5 pb-1 sm:pb-2 select-none z-30"
    >
      <nav className="relative w-full max-w-[1333px] h-[56px] sm:h-[72px] rounded-full bg-[#272424]/90 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
        
        {/* Left: Northup Studio Brand Logo (Enlarged & Clearly Legible) */}
        <a 
          href="#" 
          data-cursor="hover"
          className="flex items-center gap-2 transition-opacity duration-200 hover:opacity-90 flex-shrink-0 py-1"
        >
          <img 
            src="/assets/logo.png" 
            alt="Northup Studio" 
            className="h-8 sm:h-10 lg:h-11 w-auto object-contain transition-all"
          />
        </a>

        {/* Center: Desktop Nav Links (Keania One 22px) */}
        <div className="hidden md:flex items-center gap-8 lg:gap-14">
          <a 
            href="#work" 
            data-cursor="hover"
            className="font-keania text-[18px] lg:text-[22px] text-white hover:text-[#ff7c00] tracking-wider transition-colors duration-200 uppercase"
          >
            WORK
          </a>
          <a 
            href="#services" 
            data-cursor="hover"
            className="font-keania text-[18px] lg:text-[22px] text-white hover:text-[#ff7c00] tracking-wider transition-colors duration-200 uppercase"
          >
            SERVICES
          </a>
          <a 
            href="#about" 
            data-cursor="hover"
            className="font-keania text-[18px] lg:text-[22px] text-white hover:text-[#ff7c00] tracking-wider transition-colors duration-200 uppercase"
          >
            ABOUT US
          </a>
        </div>

        {/* Right: Language Pill + Get An Estimate Button */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Language Selector Pill */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c1818] border border-white/15 text-white font-keania text-[13px] tracking-wider">
            <img 
              src="/assets/icon-mini-compass.png" 
              alt="Globe / Compass" 
              className="w-4 h-4 object-contain"
            />
            <span>ENG</span>
          </div>

          {/* White Get An Estimate Button with double arrow >> */}
          <button 
            type="button"
            onClick={() => onOpenContact('Get An Estimate')}
            data-cursor="hover"
            className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-white text-black font-keania text-[13px] tracking-wider hover:bg-[#ff7c00] hover:text-white transition-all duration-300 shadow-md active:scale-95"
          >
            <span>Get An Estimate</span>
            <span className="font-mono text-xs font-bold leading-none tracking-tighter">»</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => onOpenContact('Get An Estimate')}
            className="px-3.5 py-1.5 rounded-full bg-white text-black font-keania text-[12px] tracking-wider hover:bg-neutral-200 active:scale-95 shadow-sm"
          >
            Estimate
          </button>
          <button 
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white focus:outline-none transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu (Positioned relative to navbar pill, scrolls naturally) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="sm:hidden absolute top-[calc(100%+6px)] left-3 right-3 bg-[#1c1818]/95 backdrop-blur-2xl border border-white/15 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 z-50"
          >
            <a 
              href="#work" 
              onClick={() => setMobileMenuOpen(false)}
              className="font-keania text-[20px] text-white hover:text-[#ff7c00] tracking-wider py-1"
            >
              WORK
            </a>
            <a 
              href="#services" 
              onClick={() => setMobileMenuOpen(false)}
              className="font-keania text-[20px] text-white hover:text-[#ff7c00] tracking-wider py-1"
            >
              SERVICES
            </a>
            <a 
              href="#about" 
              onClick={() => setMobileMenuOpen(false)}
              className="font-keania text-[20px] text-white hover:text-[#ff7c00] tracking-wider py-1"
            >
              ABOUT US
            </a>
            <hr className="border-white/10 my-1" />
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2 text-white/80 font-keania text-sm">
                <img src="/assets/icon-mini-compass.png" alt="Compass" className="w-4 h-4 object-contain" />
                <span>ENG</span>
              </div>
              <button 
                type="button"
                onClick={() => { setMobileMenuOpen(false); onOpenContact('Get An Estimate'); }}
                className="px-4 py-2 rounded-full bg-white text-black font-keania text-sm active:scale-95 transition-transform"
              >
                Get An Estimate »
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
