import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, Clock, Sparkles, ArrowUpRight, ShieldCheck, Zap } from 'lucide-react'

export default function ServiceModal({ isOpen, onClose, service, onInquire, onNavigate }) {
  // Lock body scroll while modal is active
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !service) return null

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl select-none"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-modal-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#140F0C] border border-[#FF4D0A]/30 shadow-[0_25px_70px_rgba(0,0,0,0.95)] text-white p-5 sm:p-8"
        >
          {/* Subtle Ambient Fiery Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#FF4D0A]/20 via-transparent to-transparent rounded-bl-full pointer-events-none" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close service modal"
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="pr-12 mb-6">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="font-mono text-[#FF8738] text-[13px] font-bold">
                {service.index}
              </span>
              <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase bg-[#FF4D0A]/15 text-[#FF8738] border border-[#FF4D0A]/30">
                {service.tag}
              </span>
            </div>
            <h2 id="service-modal-title" className="font-jaro text-[30px] sm:text-[38px] uppercase tracking-wide text-white leading-tight">
              {service.title}
            </h2>
          </div>

          {/* Detailed Overview */}
          <div className="mb-6">
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-white/50 mb-2">
              Overview &amp; Purpose
            </h4>
            <p className="font-mono text-[13px] sm:text-[14px] text-white/85 leading-relaxed bg-black/40 p-4 rounded-2xl border border-white/[0.06]">
              {service.fullDesc || service.desc}
            </p>
          </div>

          {/* Two-Column Specs: Deliverables & Process Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Deliverables */}
            <div className="bg-black/30 p-4 sm:p-5 rounded-2xl border border-white/[0.06]">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[#FF8738] font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#FF4D0A]" />
                <span>Scope &amp; Deliverables</span>
              </div>
              <ul className="space-y-2">
                {service.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-white/85 font-mono text-[12px] leading-snug">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF4D0A] flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Turnaround & Standard Workflow */}
            <div className="bg-black/30 p-4 sm:p-5 rounded-2xl border border-white/[0.06] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[#FF8738] font-bold mb-3">
                  <Clock className="w-3.5 h-3.5 text-[#FF4D0A]" />
                  <span>Turnaround &amp; Method</span>
                </div>
                <div className="space-y-2.5 font-mono text-[12px] text-white/75">
                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                    <span className="text-white/50">Timeline:</span>
                    <span className="font-bold text-white">{service.timeline || "1-3 Weeks"}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                    <span className="text-white/50">Revisions:</span>
                    <span className="font-bold text-white">Iterative &amp; Collaborative</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Handover:</span>
                    <span className="font-bold text-white">Full IP &amp; Assets Included</span>
                  </div>
                </div>
              </div>

              {service.outcomes && (
                <div className="mt-4 pt-3 border-t border-white/[0.06]">
                  <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider block mb-1">Impact</span>
                  <p className="font-mono text-[11px] text-white/80 leading-snug">
                    {service.outcomes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Deep-Dive Landing Page Link if Available */}
          {service.slugRoute && (
            <div className="mb-4 text-center">
              <a
                href={service.slugRoute}
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault()
                    onClose()
                    onNavigate(service.slugRoute)
                  }
                }}
                className="inline-flex items-center gap-1.5 font-mono text-xs text-[#FF8A3D] hover:underline"
              >
                <span>Read Comprehensive {service.title} Specifications &amp; FAQs</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                onClose()
                if (onInquire) onInquire(`Service Inquiry: ${service.title}`)
              }}
              className="w-full sm:flex-1 py-3 px-5 rounded-xl font-mono text-[13px] font-bold uppercase tracking-wider bg-[#FF4D0A] hover:bg-[#ff6224] text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(255,77,10,0.35)] active:scale-95"
            >
              <span>Start Project with {service.title}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto py-3 px-5 rounded-xl font-mono text-[12px] uppercase tracking-wider bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors border border-white/10"
            >
              Back to Overview
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
