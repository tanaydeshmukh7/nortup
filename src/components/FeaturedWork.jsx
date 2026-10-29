import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDown } from 'lucide-react'
import PosterModal from './PosterModal'

export default function FeaturedWork({ onOpenContact }) {
  const [posterModalOpen, setPosterModalOpen] = useState(false)

  return (
    <section id="work" className="relative py-12 sm:py-16 px-2 sm:px-4 lg:px-6 max-w-[1400px] mx-auto scroll-mt-24 select-none">
      {/* Section Header: Featured Work ︾ in Black display font */}
      <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-12">
        <h2 className="font-hammer text-[38px] sm:text-[50px] lg:text-[62px] font-bold text-black tracking-tight leading-none">
          Featured Work
        </h2>
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-black/20 flex items-center justify-center text-black">
          <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
        </div>
      </div>

      <div className="space-y-6 sm:space-y-8">
        
        {/* Row 1: Atelier (Wide) + Poster Design (Vertical) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Atelier Card (lg:col-span-8) */}
          <div 
            className="lg:col-span-8 relative rounded-3xl overflow-hidden bg-[#15100E] border border-white/[0.1] hover:border-[#FF4D0A]/30 transition-all duration-300 group cursor-pointer aspect-[16/11] lg:aspect-auto lg:h-[632px] shadow-xl"
            onClick={() => onOpenContact('Project Inquiry: Atelier')}
          >
            <img 
              src="/assets/atelier.jpg" 
              alt="Atelier Estates" 
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
            />
            {/* Subtle bottom gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0908]/90 via-[#0B0908]/25 to-transparent pointer-events-none" />

            {/* Bottom-left Title & Badge */}
            <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 flex flex-col items-start gap-3">
              <h3 className="font-hammer text-[38px] sm:text-[50px] lg:text-[55px] text-[#F5F1ED] tracking-tight leading-none drop-shadow-md">
                Atelier
              </h3>
              <div className="px-5 py-2 rounded-full bg-[#15100E]/80 backdrop-blur-md border border-white/[0.15] text-[#F5F1ED] font-hammer text-[14px] sm:text-[18px] lg:text-[21px] tracking-wide">
                Webdesign &amp; development
              </div>
            </div>

            {/* Hover top-right action badge with subtle transition */}
            <div className="absolute top-6 right-6 w-11 h-11 rounded-full bg-[#15100E]/80 backdrop-blur-md border border-white/[0.15] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <ArrowUpRight className="w-5 h-5 text-[#F5F1ED] group-hover:text-[#FF8738] transition-colors" />
            </div>
          </div>

          {/* Poster Design Card (lg:col-span-4) */}
          <div 
            onClick={() => setPosterModalOpen(true)}
            className="lg:col-span-4 relative rounded-3xl overflow-hidden bg-[#15100E] border border-white/[0.1] hover:border-[#FF4D0A]/30 transition-all duration-300 group cursor-pointer aspect-[3/4] lg:aspect-auto lg:h-[632px] shadow-xl"
          >
            <img 
              src="/assets/posters.jpg" 
              alt="Poster Design Collection" 
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0908]/95 via-transparent to-transparent pointer-events-none" />

            {/* Top-right index counter */}
            <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-[#0B0908]/80 backdrop-blur-md border border-white/[0.15] text-[#FF8738] font-mono text-[13px]">
              01 / 06
            </div>

            {/* Bottom Content Area */}
            <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 sm:right-8 flex items-end justify-between">
              <div>
                <h3 className="font-jaro text-[32px] sm:text-[42px] leading-tight text-[#F5F1ED] uppercase tracking-wider">
                  POSTER<br />
                  <span className="text-[#FF8738]">DESIGN</span>
                </h3>
              </div>

              <div className="flex items-center gap-2 group/btn">
                <span className="text-right font-mono text-[10px] sm:text-[11px] text-[#BDB4AE] leading-tight uppercase hidden sm:block">
                  EXPLORE<br />THE<br />COLLECTION
                </span>
                <div className="w-12 h-12 rounded-full border border-white/[0.2] group-hover/btn:border-[#FF4D0A] group-hover/btn:bg-[#FF4D0A] flex items-center justify-center transition-all duration-300 shadow-lg">
                  <ArrowUpRight className="w-5 h-5 text-[#F5F1ED] group-hover/btn:rotate-45 transition-transform" />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Row 2: Aurelis (Full Width 1382x632) */}
        <div 
          className="relative rounded-3xl overflow-hidden bg-[#15100E] border border-white/[0.1] hover:border-[#FF4D0A]/30 transition-all duration-300 group cursor-pointer aspect-[16/9] lg:aspect-auto lg:h-[632px] shadow-xl"
          onClick={() => onOpenContact('Project Inquiry: Aurelis')}
        >
          <img 
            src="/assets/aurelis.jpg" 
            alt="Aurelis Dental Brand Identity & Web Development" 
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0908]/90 via-[#0B0908]/20 to-transparent pointer-events-none" />

          {/* Bottom-right Title & Pill Badge (as per Figma layout) */}
          <div className="absolute bottom-6 sm:bottom-10 right-6 sm:right-10 flex flex-col items-end gap-3 text-right">
            <h3 className="font-hammer text-[38px] sm:text-[50px] lg:text-[55px] text-[#F5F1ED] tracking-tight leading-none drop-shadow-md">
              Aurelis
            </h3>
            <div className="px-6 py-2.5 rounded-full bg-[#15100E]/80 backdrop-blur-md border border-white/[0.15] text-[#F5F1ED] font-hammer text-[14px] sm:text-[20px] lg:text-[24px] tracking-wide">
              Brand identity &amp; web development
            </div>
          </div>

          <div className="absolute top-6 right-6 w-11 h-11 rounded-full bg-[#15100E]/80 backdrop-blur-md border border-white/[0.15] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <ArrowUpRight className="w-5 h-5 text-[#F5F1ED] group-hover:text-[#FF8738] transition-colors" />
          </div>
        </div>

        {/* Row 3: 3-Card Grid (Cake Studio, Drop Cult, AUREX) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Card 1: Cake Studio */}
          <div 
            onClick={() => onOpenContact('Project Inquiry: Cake Studio')}
            className="relative rounded-3xl overflow-hidden bg-[#15100E] border border-white/[0.1] hover:border-[#FF4D0A]/30 transition-all duration-300 group cursor-pointer aspect-[452/481] shadow-xl"
          >
            <img 
              src="/assets/cake-studio.jpg" 
              alt="Cake Studio" 
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0908]/90 via-transparent to-transparent pointer-events-none" />

            <div className="absolute bottom-6 left-6 flex flex-col items-start gap-2">
              <h4 className="font-hammer text-[18px] sm:text-[20px] text-[#F5F1ED] tracking-wide">
                Cake Studio
              </h4>
              <div className="px-4 py-1.5 rounded-full bg-[#15100E]/85 backdrop-blur-md border border-white/[0.15] text-[#BDB4AE] font-mono text-[12px]">
                Web design &amp; development
              </div>
            </div>

            <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#15100E]/80 backdrop-blur-md border border-white/[0.15] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight className="w-4 h-4 text-[#F5F1ED]" />
            </div>
          </div>

          {/* Card 2: Drop Cult */}
          <div 
            onClick={() => onOpenContact('Project Inquiry: Drop Cult')}
            className="relative rounded-3xl overflow-hidden bg-[#15100E] border border-white/[0.1] hover:border-[#FF4D0A]/30 transition-all duration-300 group cursor-pointer aspect-[452/481] shadow-xl"
          >
            <img 
              src="/assets/drop-cult.jpg" 
              alt="Drop Cult" 
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0908]/90 via-transparent to-transparent pointer-events-none" />

            <div className="absolute bottom-6 left-6 flex flex-col items-start gap-2">
              <h4 className="font-hammer text-[18px] sm:text-[20px] text-[#F5F1ED] tracking-wide">
                Drop Cult
              </h4>
              <div className="px-4 py-1.5 rounded-full bg-[#15100E]/85 backdrop-blur-md border border-white/[0.15] text-[#BDB4AE] font-mono text-[12px]">
                Web design &amp; development
              </div>
            </div>

            <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#15100E]/80 backdrop-blur-md border border-white/[0.15] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight className="w-4 h-4 text-[#F5F1ED]" />
            </div>
          </div>

          {/* Card 3: AUREX */}
          <div 
            onClick={() => onOpenContact('Project Inquiry: AUREX')}
            className="relative rounded-3xl overflow-hidden bg-[#15100E] border border-white/[0.1] hover:border-[#FF4D0A]/30 transition-all duration-300 group cursor-pointer aspect-[452/481] shadow-xl"
          >
            <img 
              src="/assets/aurex.jpg" 
              alt="AUREX" 
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0908]/90 via-transparent to-transparent pointer-events-none" />

            <div className="absolute bottom-6 left-6 flex flex-col items-start gap-2">
              <h4 className="font-hammer text-[18px] sm:text-[20px] text-[#F5F1ED] tracking-wide">
                AUREX
              </h4>
              <div className="px-4 py-1.5 rounded-full bg-[#15100E]/85 backdrop-blur-md border border-white/[0.15] text-[#BDB4AE] font-mono text-[12px]">
                Web design &amp; development
              </div>
            </div>

            <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#15100E]/80 backdrop-blur-md border border-white/[0.15] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight className="w-4 h-4 text-[#F5F1ED]" />
            </div>
          </div>

        </div>

      </div>

      {/* Poster Detail Lightbox Modal */}
      <PosterModal 
        isOpen={posterModalOpen} 
        onClose={() => setPosterModalOpen(false)} 
      />
    </section>
  )
}
