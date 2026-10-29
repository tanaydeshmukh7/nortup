import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Navbar from './Navbar'
import CompassCanvas from './CompassCanvas'
import { ArrowUpRight } from 'lucide-react'

export default function Hero({ onOpenContact }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="hero" className="w-full flex justify-center items-start px-2 sm:px-4 xl:px-0 pt-2 xl:pt-0 pb-6 xl:pb-0 select-none">
      
      {/* 
        Hero Frame Container matching Figma Group 10 [1405x753, cornerRadius: 20]
        Strictly locked to 753px on desktop at 1405x753 viewport - ZERO vertical scroll
      */}
      <div className="relative w-full max-w-[1405px] h-auto lg:h-[730px] xl:h-[753px] rounded-[20px] sm:rounded-[24px] overflow-hidden border border-white/15 shadow-[0_16px_50px_rgba(0,0,0,0.85)] flex flex-col justify-between">
        
        {/* Background Layer: Dramatic Cinematic Crimson-to-Golden Gradient */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Base Layered CSS Gradients for rich saturation */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 74% 58%, #ff4d00 0%, #d41600 30%, #760900 58%, #140503 85%, #080302 100%)'
            }}
          />

          {/* Exact Figma Background Gradient Asset */}
          <img 
            src="/assets/hero-bg-figma.png" 
            alt="Cinematic Background Gradient" 
            className="w-full h-full object-cover mix-blend-screen opacity-95 scale-105"
          />

          {/* Soft dark vignette on the far left to keep text contrast razor sharp */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/30 to-transparent w-full lg:w-1/2" />
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        {/* 1. Navbar positioned at top of Hero frame with exact Figma margins */}
        <div className="relative z-30 w-full pt-1">
          <Navbar onOpenContact={onOpenContact} />
        </div>

        {/* 2. Main Hero Body */}
        <div className="relative z-20 w-full px-5 sm:px-10 lg:px-14 flex-1 flex flex-col items-start justify-center pt-3 sm:pt-6 lg:pt-0 lg:my-auto">
          
          {/* Left Column (Desktop) / Top Group (Mobile): Text & CTA Group */}
          <div className="w-full lg:w-[48%] xl:w-[45%] max-w-[540px] flex flex-col items-start text-left z-20 flex-shrink-0">
            
            {/* Eyebrow: {WE ARE NORTH UP} */}
            <div className="text-white/95 font-mono text-[14px] sm:text-[18px] lg:text-[20px] font-normal tracking-wide mb-2 sm:mb-2.5">
              {'{WE ARE NORTH UP}'}
            </div>

            {/* Headline: ORCHESTRATING BRAND GROWTH */}
            <div className="font-jaro text-[38px] sm:text-[54px] md:text-[62px] lg:text-[66px] xl:text-[68px] leading-[0.92] text-white tracking-wider uppercase mb-3.5 sm:mb-4 select-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
              <span className="block whitespace-nowrap">ORCHESTRATING</span>
              <span className="block whitespace-nowrap">BRAND GROWTH</span>
            </div>

            {/* Supporting Copy */}
            <p className="font-mono text-[13px] sm:text-[14px] lg:text-[15px] font-bold text-white/90 max-w-[460px] leading-relaxed mb-5 sm:mb-6">
              We build bold brands, digital experiences, and{' '}
              <br className="hidden sm:inline" />
              creative solutions that move businesses forward.
            </p>

            {/* 
              CTA Buttons: Restored Two-Row Arrangement
              Row 1: [ VIEW PROJECTS ] [ Get an Audit ]
              Row 2: [ START PROJECT ↗ ] in vivid bright orange
            */}
            <div className="flex flex-col items-start gap-2.5 sm:gap-3 w-full">
              {/* Row 1: VIEW PROJECTS + Get an Audit */}
              <div className="flex items-center gap-2.5 sm:gap-4 flex-wrap">
                <a 
                  href="#work"
                  className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-white text-black font-keania text-[13px] sm:text-[14px] tracking-wider hover:bg-neutral-200 transition-all duration-200 shadow-md active:scale-95"
                >
                  VIEW PROJECTS
                </a>

                <button 
                  onClick={() => onOpenContact('Get an Audit')}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#191818]/90 text-white border border-white/20 font-keania text-[13px] sm:text-[14px] tracking-wider hover:border-white/50 hover:bg-[#272424] transition-all duration-200 shadow-md active:scale-95"
                >
                  Get an Audit
                </button>
              </div>

              {/* Row 2: START PROJECT ↗ */}
              <div>
                <button 
                  onClick={() => onOpenContact('Start Project')}
                  className="group flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#ff4500] to-[#ff7c00] text-white font-keania text-[13px] sm:text-[14px] tracking-wider hover:brightness-110 transition-all duration-200 shadow-lg shadow-[#ff4500]/30 active:scale-95"
                >
                  <span>START PROJECT</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* 
          Single Brand Compass:
          - Desktop (lg+): Anchored to bottom right of hero container, touching the bottom edge (bottom: 0)
          - Mobile (<lg): Centered in lower portion of hero, dramatic scale, extending to bottom edge
        */}
        <div 
          className="pointer-events-none select-none z-10
            relative w-[105%] max-w-[460px] aspect-[1024/776] mx-auto mt-2 -mb-4 sm:-mb-6
            lg:mt-0 lg:mb-0 lg:w-[58%] lg:h-[685px] lg:aspect-auto lg:max-w-none
            lg:absolute lg:right-0 lg:bottom-0
            xl:left-[562px] xl:right-auto xl:bottom-0 xl:w-[834px] xl:h-[685px]
            flex items-end justify-center overflow-hidden"
        >
          <CompassCanvas />
        </div>

        {/* Bottom edge padding */}
        <div className="relative z-10 w-full pb-2" />

      </div>

    </section>
  )
}