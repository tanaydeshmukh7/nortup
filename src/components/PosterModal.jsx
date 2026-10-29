import React, { useState } from 'react'
import { X } from 'lucide-react'

export default function PosterModal({ isOpen, onClose }) {
  if (!isOpen) return null

  const posters = [
    { title: "SHIVA", subtitle: "THE DESTROYER", desc: "The cosmic dancer of dissolution and eternal rebirth." },
    { title: "VISHNU", subtitle: "THE PRESERVER", desc: "Before time, beyond decay. The universal preserver descending as avatars." },
    { title: "BRAHMA", subtitle: "THE SUPREME ARTIST", desc: "First thought, all shapes. The cosmic architect of creation." },
    { title: "GOD WOMAN", subtitle: "TELEVISION AGE", desc: "Surreal fusion of divine femininity and vintage broadcasts." },
    { title: "DHARMA GUIDED BY RAMA", subtitle: "THE TIMELESS BOW", desc: "Unflinching righteousness and steadfast moral fortitude." },
    { title: "RABBIT CHOOSE LIFE", subtitle: "ALLEGORY", desc: "A contemporary monochromatic tale of perseverance and destiny." },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#15100E] border border-white/[0.15] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
          <div>
            <div className="font-keania text-[#FF8738] text-sm tracking-widest uppercase">Northup Design Studio</div>
            <h3 className="font-mono text-2xl font-bold text-[#F5F1ED]">Poster Design Collection (01 / 06)</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#F5F1ED] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative rounded-2xl overflow-hidden border border-white/[0.1] shadow-lg group">
            <img 
              src="/assets/posters.jpg" 
              alt="Poster Collection Overview" 
              className="w-full h-auto object-cover"
            />
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-xs font-mono text-[#FF8738] border border-[#FF8738]/30">
              Featured 6/6
            </div>
          </div>

          <div className="flex flex-col gap-6 text-left">
            <div>
              <span className="text-[#FF4D0A] font-mono text-xs uppercase tracking-wider font-semibold">Concept Series</span>
              <h4 className="font-jaro text-4xl text-[#F5F1ED] tracking-wide mt-1">MYTHOLOGY &amp; MODERN CULTURE</h4>
              <p className="font-mono text-sm text-[#BDB4AE] mt-3 leading-relaxed">
                A signature showcase exploring heritage, philosophy, and digital futurism. Each piece combines rich narrative textures, bold typographic hierarchy, and cinematic lighting.
              </p>
            </div>

            <div className="space-y-3">
              {posters.map((p, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded-xl bg-[#1E1613] border border-white/[0.06] hover:border-[#FF4D0A]/40 transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="font-mono text-sm font-bold text-[#F5F1ED]">{p.title}</div>
                    <div className="font-mono text-xs text-[#BDB4AE]/70">{p.subtitle}</div>
                  </div>
                  <span className="text-xs font-mono text-[#FF8738]">0{idx + 1}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={onClose}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#FF4D0A] to-[#FF8738] text-[#F5F1ED] font-keania text-sm tracking-wider hover:opacity-90 transition-opacity"
            >
              CLOSE PREVIEW
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
