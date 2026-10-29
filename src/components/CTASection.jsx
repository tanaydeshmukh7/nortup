import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function CTASection({ onOpenContact }) {
  return (
    <section className="relative py-16 sm:py-28 px-4 sm:px-8 text-center bg-white select-none overflow-hidden">
      
      {/* Background warm subtle ambient radial light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-radial from-[#FF4D0A]/10 via-transparent to-transparent blur-[90px] pointer-events-none" />

      <div className="relative z-10 max-w-[1000px] mx-auto flex flex-col items-center">
        
        {/* Label: {WE ARE SERIOUS} */}
        <div className="font-mono text-[14px] sm:text-[16px] lg:text-[18px] text-black/80 font-bold tracking-widest uppercase mb-3 flex items-center gap-2">
          <span>{'{WE ARE SERIOUS}'}</span>
        </div>

        {/* Headline: LET’S MAKE IT HAPPEN in bold black display font */}
        <h2 className="font-hammer text-[46px] sm:text-[68px] lg:text-[88px] font-bold text-black uppercase tracking-tight leading-[0.95] mb-8">
          LET’S MAKE<br />
          IT HAPPEN
        </h2>

        {/* REACH OUT Solid Black Pill Button with Magnetic Hover Feel */}
        <motion.button 
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onOpenContact('General Project Inquiry')}
          data-cursor="hover"
          className="group relative px-9 py-3.5 sm:py-4 rounded-full bg-black hover:bg-neutral-900 text-white font-mono text-[14px] sm:text-[16px] font-bold tracking-widest uppercase transition-all duration-300 shadow-xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)] flex items-center gap-2.5 border border-black"
        >
          <span>REACH OUT</span>
          <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-200" />
        </motion.button>

      </div>
    </section>
  )
}
