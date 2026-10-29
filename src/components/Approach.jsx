import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

export default function Approach({ onOpenContact }) {
  const shouldReduceMotion = useReducedMotion()

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

  return (
    <section id="services" className="relative py-10 sm:py-14 px-2 sm:px-4 lg:px-6 max-w-[1400px] mx-auto scroll-mt-24 select-none">
      
      {/* 
        ========================================================================
        Figma Frame 7: Unified Master Card [1382 x 2449 px]
        Contains Services & Expertise, IDEAS INTO IMPACT, Process Cards, Team & Toolkit
        ========================================================================
      */}
      <div className="relative rounded-[26px] sm:rounded-[32px] overflow-hidden bg-[#0A0706] border border-white/10 shadow-[0_24px_65px_rgba(0,0,0,0.85)] text-white px-6 sm:px-12 lg:px-16 py-14 sm:py-20 lg:py-24">
        
        {/* Background Atmosphere Layer using user's bg asset */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img 
            src="/assets/bg.png" 
            alt="Services background" 
            className="w-full h-full object-cover object-center select-none"
            loading="eager"
            decoding="sync"
          />
          {/* Subtle dark overlay to preserve text readability while retaining fiery atmosphere */}
          <div className="absolute inset-0 bg-[#0A0706]/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0706]/90 via-transparent to-[#0A0706]/95" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] lg:w-[1000px] h-[500px] bg-gradient-radial from-[#FF4D0A]/20 via-transparent to-transparent blur-[120px]" />
        </div>

        {/* 1. Header: [ SERVICES & EXPERTISE ] + Creative Digital Studio */}
        <div className="relative z-10 max-w-[1100px] mb-8 sm:mb-12">
          <div className="font-mono text-[#FF8738] text-[13px] sm:text-[15px] font-semibold tracking-widest uppercase mb-3">
            [ SERVICES &amp; EXPERTISE ]
          </div>
          <h2 className="font-sans font-bold text-[34px] sm:text-[48px] lg:text-[58px] text-white tracking-tight leading-tight mb-4">
            Creative Digital Studio
          </h2>
          <p className="font-mono text-white/80 text-[14px] sm:text-[16px] lg:text-[17px] max-w-[800px] leading-relaxed">
            We build bold digital experiences, distinctive brand identities, and intelligent digital solutions that help ambitious businesses stand out, connect with their audience, and grow.
          </p>
        </div>

        {/* 2. Monumental Typography Artwork: IDEAS INTO IMPACT */}
        <div className="relative z-10 my-6 sm:my-10 select-none overflow-hidden">
          <h1 className="font-anton text-[clamp(3.8rem,9.2vw,8.5rem)] leading-[0.88] uppercase tracking-wide text-white drop-shadow-[0_8px_45px_rgba(0,0,0,0.95)]">
            IDEAS<br />
            INTO IMPACT
          </h1>
        </div>

        {/* 3. Methodology & Process Grid: 3 Stats Pills + [01] OUR APPROACH + [02] HOW WE WORK */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch mb-16 sm:mb-24">
          
          {/* Left Column: 3 Stacked Badges (03, 03, ∞) */}
          <div className="lg:col-span-3 flex flex-row lg:flex-col gap-4 sm:gap-5 justify-between">
            {stats.map((s, idx) => (
              <div 
                key={idx}
                className="flex-1 p-5 sm:p-6 rounded-2xl bg-[#15100E]/90 backdrop-blur-md border border-white/[0.1] hover:border-[#FF4D0A]/40 flex flex-col justify-center items-center text-center shadow-lg transition-colors group"
              >
                <div className="font-mono text-[36px] sm:text-[44px] lg:text-[50px] font-normal text-white group-hover:text-[#FF8738] transition-colors leading-none mb-1.5">
                  {s.value}
                </div>
                <div className="font-mono text-[11px] sm:text-[13px] text-white/70 tracking-wide">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Center Card: [ 01 ] OUR APPROACH (lg:col-span-4) */}
          <div className="lg:col-span-4 relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 bg-[#15100E]/90 backdrop-blur-md border border-white/[0.1] hover:border-[#FF4D0A]/40 shadow-xl flex flex-col justify-between transition-colors">
            <div>
              <div className="inline-block px-3 py-1 rounded-md bg-[#FF4D0A]/15 text-[#FF8738] font-mono text-[11px] sm:text-[12px] tracking-wider mb-4 border border-[#FF4D0A]/25">
                [ 01 ] OUR APPROACH
              </div>

              <h3 className="font-jaro text-[28px] sm:text-[34px] leading-tight text-white mb-2">
                Your vision.<br />
                <span className="text-[#FF8738]">Our execution.</span>
              </h3>

              <div className="w-10 h-0.5 bg-[#FF4D0A] my-3 rounded-full" />

              <p className="font-mono text-[12px] sm:text-[13px] text-white/75 leading-relaxed mb-6">
                We take the time to understand your business, audience, and goals before shaping a digital experience around them.
              </p>
            </div>

            {/* Approach Pillars */}
            <div className="space-y-2">
              {approachPillars.map((pillar, i) => (
                <div 
                  key={i}
                  className="p-3 rounded-xl bg-black/40 border border-white/[0.06] hover:border-[#FF4D0A]/30 transition-all text-left"
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
          <div className="lg:col-span-5 relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 bg-[#15100E]/90 backdrop-blur-md border border-white/[0.1] hover:border-[#FF4D0A]/40 shadow-xl flex flex-col justify-between transition-colors">
            <div>
              <div className="inline-block px-3 py-1 rounded-md bg-[#FF4D0A]/15 text-[#FF8738] font-mono text-[11px] sm:text-[12px] tracking-wider mb-4 border border-[#FF4D0A]/25">
                [ 02 ] HOW WE WORK
              </div>

              <h3 className="font-jaro text-[28px] sm:text-[34px] leading-tight text-white mb-2">
                A clear process.<br />
                <span className="text-[#FF8738]">From idea to launch.</span>
              </h3>

              <div className="w-10 h-0.5 bg-[#FF4D0A] my-3 rounded-full" />

              <p className="font-mono text-[12px] sm:text-[13px] text-white/75 leading-relaxed mb-5">
                Four step, structured, iterative, and clear at every step.
              </p>
            </div>

            {/* Steps List */}
            <div className="space-y-2.5">
              {steps.map((st, i) => (
                <div 
                  key={i}
                  className="p-3 rounded-xl bg-black/40 border border-white/[0.06] hover:border-[#FF4D0A]/30 transition-all flex items-start gap-3"
                >
                  <span className="font-mono text-[#FF8738] font-bold text-[13px] pt-0.5">
                    {st.num}
                  </span>
                  <div>
                    <h5 className="font-mono text-[12px] sm:text-[13px] font-bold text-white tracking-wide">
                      {st.title}
                    </h5>
                    <p className="font-mono text-[11px] text-white/60 mt-0.5 leading-snug">
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
          4. Inner Container: Team & Everyday Toolkit (Figma Rectangle 15)
          ========================================================================
        */}
        <div id="about" className="relative z-10 rounded-[22px] sm:rounded-[28px] p-6 sm:p-10 lg:p-12 bg-[#120D0A]/90 backdrop-blur-md border border-white/10 shadow-2xl">
          
          {/* 3 Team Member Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-14">
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
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                  
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/[0.12] text-[11px] font-mono text-[#FF8738]">
                    {member.tag}
                  </div>
                </div>

                {/* Info Bottom */}
                <div className="p-5 pt-2 flex flex-col items-start bg-black/60">
                  <h4 className="font-mono text-[19px] sm:text-[21px] font-bold text-white group-hover:text-[#FF8738] transition-colors">
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
          <div className="text-center max-w-[900px] mx-auto mb-12 sm:mb-14">
            <h3 className="font-mono text-[24px] sm:text-[34px] lg:text-[40px] font-bold text-white uppercase tracking-tight leading-tight mb-3">
              WE MAKE IDEAS<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FF8738] to-[#FF4D0A]">
                IMPOSSIBLE TO IGNORE
              </span>
            </h3>
            <p className="font-mono text-[13px] sm:text-[15px] lg:text-[17px] text-white/75 font-normal leading-relaxed max-w-[760px] mx-auto">
              We build distinctive brands, immersive websites, and digital experiences for businesses ready to stand out.
            </p>
          </div>

          {/* Everyday Toolkit Bar matching Figma Group 9 */}
          <div className="relative rounded-2xl p-6 sm:p-7 bg-black/60 border border-white/[0.08] flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-lg">
            <div>
              <h4 className="font-mono text-[17px] sm:text-[20px] font-bold text-white">
                Our Everyday Toolkit
              </h4>
              <p className="font-mono text-[12px] sm:text-[13px] text-white/70 mt-1 max-w-[380px]">
                The tools behind our process, from the first sketch to the final launch.
              </p>
            </div>

            {/* Brand Tool Icons */}
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              {toolkit.map((tool, idx) => (
                <div 
                  key={idx}
                  title={tool.name}
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

    </section>
  )
}