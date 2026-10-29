import React from 'react'

export default function Footer() {
  return (
    <footer className="w-full px-2 sm:px-4 lg:px-6 pt-4 pb-8 select-none bg-white">
      {/* 
        Footer Card Container matching Figma [1381x740, cornerRadius: 20]
        Cinematic Dark-to-Orange Gradient
      */}
      <div className="relative w-full max-w-[1400px] mx-auto rounded-[24px] sm:rounded-[28px] overflow-hidden border border-black/10 shadow-2xl bg-[#0B0908] px-6 sm:px-12 lg:px-16 py-14 sm:py-20 text-white">
        
        {/* Background Layer: Cinematic Dark-to-Orange Gradient */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 85% 70%, #ff4d00 0%, #a81200 35%, #300600 65%, #080302 100%)'
            }}
          />
          <img 
            src="/assets/hero-bg-figma.png" 
            alt="Footer Gradient" 
            className="w-full h-full object-cover mix-blend-screen opacity-85 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          
          {/* Column 1: Northup Studio Brand (lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col items-start gap-2.5">
            <h3 className="font-inter text-[26px] sm:text-[32px] font-semibold text-white tracking-tight">
              northup.studio
            </h3>
            <p className="font-inter text-[15px] sm:text-[17px] text-white/70 font-normal">
              Pune city- INDIA
            </p>
            <a 
              href="mailto:northup4work@gmail.com" 
              className="font-inter text-[15px] sm:text-[17px] text-white/90 hover:text-[#FF8738] transition-colors underline-offset-4 hover:underline"
            >
              northup4work@gmail.com
            </a>
          </div>

          {/* Column 2: INDEX (lg:col-span-3) */}
          <div className="lg:col-span-3 flex flex-col items-start gap-3">
            <h4 className="font-inter text-[19px] sm:text-[22px] font-semibold text-white">
              INDEX
            </h4>
            <ul className="space-y-2 font-inter text-[14px] sm:text-[16px] text-white/70">
              <li>
                <a href="#" className="hover:text-white transition-colors">HOME</a>
              </li>
              <li>
                <a href="#work" className="hover:text-white transition-colors">WORK</a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">SERVICES</a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">ABOUT US</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Terms & policies (lg:col-span-3) */}
          <div className="lg:col-span-3 flex flex-col items-start gap-3">
            <h4 className="font-inter text-[19px] sm:text-[22px] font-semibold text-white">
              Terms &amp; policies
            </h4>
            <ul className="space-y-2 font-inter text-[14px] sm:text-[16px] text-white/70">
              <li>
                <a href="#" className="hover:text-white transition-colors">Licenses and agreement</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Privacy policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Cookie setting</a>
              </li>
            </ul>
          </div>

          {/* Column 4: Socials (lg:col-span-2) */}
          <div className="lg:col-span-2 flex flex-col items-start gap-3">
            <h4 className="font-inter text-[19px] sm:text-[22px] font-semibold text-white">
              Socials
            </h4>
            <ul className="space-y-2 font-inter text-[14px] sm:text-[16px] text-white/70">
              <li>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-white transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-white transition-colors"
                >
                  Linked In
                </a>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </footer>
  )
}