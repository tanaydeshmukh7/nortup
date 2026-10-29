import React from 'react'
import { ArrowRight } from 'lucide-react'

export default function CTASection({ onOpenContact }) {
  return (
    <section className="relative py-16 sm:py-24 px-4 sm:px-8 text-center bg-white select-none">
      <div className="relative z-10 max-w-[1000px] mx-auto flex flex-col items-center">
        
        {/* Label: {WE ARE SERIOUS} */}
        <div className="font-mono text-[14px] sm:text-[16px] lg:text-[18px] text-black font-bold tracking-widest uppercase mb-3">
          {'{WE ARE SERIOUS}'}
        </div>

        {/* Headline: LET’S MAKE IT HAPPEN in bold black display font */}
        <h2 className="font-hammer text-[46px] sm:text-[68px] lg:text-[88px] font-bold text-black uppercase tracking-tight leading-[0.95] mb-8">
          LET’S MAKE<br />
          IT HAPPEN
        </h2>

        {/* REACH OUT Solid Black Pill Button */}
        <button 
          onClick={() => onOpenContact('General Project Inquiry')}
          className="group relative px-9 py-3.5 sm:py-4 rounded-full bg-black hover:bg-neutral-800 text-white font-mono text-[14px] sm:text-[16px] font-bold tracking-widest uppercase transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2.5 active:scale-95"
        >
          <span>REACH OUT</span>
          <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-200" />
        </button>

      </div>
    </section>
  )
}