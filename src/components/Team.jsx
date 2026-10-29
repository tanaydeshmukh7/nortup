import React from 'react'

export default function Team() {
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
    <section id="about" className="relative py-20 lg:py-28 px-4 sm:px-8 lg:px-12 max-w-[1400px] mx-auto scroll-mt-24">
      {/* Container Frame matching Figma Rectangle 15 with warm studio styling */}
      <div className="relative rounded-3xl p-6 sm:p-12 lg:p-16 bg-[#15100E] border border-white/[0.1] shadow-2xl overflow-hidden">
        
        {/* Subtle Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-56 bg-gradient-to-b from-[#26130E] via-[#FF4D0A]/10 to-transparent blur-3xl pointer-events-none opacity-50" />

        {/* 3 Team Member Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16 relative z-10">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl overflow-hidden bg-[#1E1613] border border-white/[0.08] hover:border-[#FF4D0A]/40 shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Portrait Image with warm rim lighting */}
              <div className="relative aspect-[4/5] overflow-hidden bg-black">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                />
                {/* Subtle vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1613] via-transparent to-transparent opacity-90" />
                
                {/* Floating tag */}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/[0.12] text-[11px] font-mono text-[#FF8738]">
                  {member.tag}
                </div>
              </div>

              {/* Info Bottom */}
              <div className="p-6 pt-2 flex flex-col items-start bg-[#1E1613]">
                <h4 className="font-mono text-[20px] sm:text-[22px] lg:text-[24px] font-bold text-[#F5F1ED] group-hover:text-[#FF8738] transition-colors">
                  {member.name}
                </h4>
                <p className="font-mono text-[12px] text-[#BDB4AE] tracking-wider uppercase mt-1">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Middle Typography Banner */}
        <div className="text-center max-w-[960px] mx-auto mb-16 relative z-10">
          <h3 className="font-mono text-[26px] sm:text-[36px] lg:text-[44px] font-bold text-[#F5F1ED] uppercase tracking-tight leading-tight mb-4">
            WE MAKE IDEAS<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5F1ED] via-[#FF8738] to-[#FF4D0A]">
              IMPOSSIBLE TO IGNORE
            </span>
          </h3>
          <p className="font-mono text-[14px] sm:text-[17px] lg:text-[19px] text-[#BDB4AE] font-normal leading-relaxed max-w-[800px] mx-auto">
            We build distinctive brands, immersive websites, and digital experiences for businesses ready to stand out.
          </p>
        </div>

        {/* Everyday Toolkit Bar matching Figma Group 9 */}
        <div className="relative rounded-2xl p-6 sm:p-8 bg-[#1E1613] border border-white/[0.08] flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-lg">
          <div>
            <h4 className="font-mono text-[18px] sm:text-[22px] font-bold text-[#F5F1ED]">
              Our Everyday Toolkit
            </h4>
            <p className="font-mono text-[13px] sm:text-[14px] text-[#BDB4AE] mt-1 max-w-[400px]">
              The tools behind our process, from the first sketch to the final launch.
            </p>
          </div>

          {/* Software Icons with subtle restrained hover */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-3.5">
            {toolkit.map((tool, i) => (
              <div 
                key={i}
                title={tool.name}
                className="group relative w-12 h-12 sm:w-13 sm:h-13 rounded-xl bg-[#15100E] border border-white/[0.08] hover:border-[#FF4D0A]/40 flex items-center justify-center p-2.5 transition-all duration-200 hover:scale-105 shadow-sm"
              >
                <img 
                  src={tool.icon} 
                  alt={tool.name}
                  className="w-full h-full object-contain filter group-hover:brightness-110 transition-all"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement.innerText = tool.name.slice(0, 2);
                  }}
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
