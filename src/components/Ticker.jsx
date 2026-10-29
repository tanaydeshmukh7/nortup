import React from 'react'

export default function Ticker() {
  const items = [
    "Branding",
    "Design",
    "Websites",
    "Landing Pages",
    "E-commerce",
    "SaaS",
    "WhatsApp Bots",
    "Digital Marketing",
    "AI & Automation",
    "Web Security",
    "Content"
  ]

  const marqueeString = items.join(" · ") + " · "

  return (
    <section className="relative py-8 sm:py-10 bg-white overflow-hidden select-none">
      {/* Subhead: {Moving forward} */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 mb-3 sm:mb-4">
        <h3 className="font-mono text-[24px] sm:text-[30px] lg:text-[34px] font-bold text-black tracking-tight">
          {'{Moving forward}'}
        </h3>
      </div>

      {/* Infinite Scrolling Marquee */}
      <div className="relative w-full overflow-hidden no-scrollbar py-2">
        {/* Subtle edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] cursor-default whitespace-nowrap">
          <div className="flex items-center text-[#15100E] font-mono text-[20px] sm:text-[26px] lg:text-[32px] font-medium tracking-wide pr-8">
            {marqueeString}
          </div>
          <div className="flex items-center text-[#15100E] font-mono text-[20px] sm:text-[26px] lg:text-[32px] font-medium tracking-wide pr-8" aria-hidden="true">
            {marqueeString}
          </div>
          <div className="flex items-center text-[#15100E] font-mono text-[20px] sm:text-[26px] lg:text-[32px] font-medium tracking-wide pr-8" aria-hidden="true">
            {marqueeString}
          </div>
        </div>
      </div>
    </section>
  )
}
