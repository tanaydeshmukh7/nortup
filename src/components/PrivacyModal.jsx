import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShieldCheck, Mail, ArrowUpRight } from 'lucide-react'

export default function PrivacyModal({ isOpen, onClose }) {
  const modalRef = useRef(null)
  const previousActiveElementRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = document.activeElement

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          e.preventDefault()
          onClose()
        }
      }

      window.addEventListener('keydown', handleKeyDown)
      return () => {
        window.removeEventListener('keydown', handleKeyDown)
        if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === 'function') {
          previousActiveElementRef.current.focus()
        }
      }
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="privacy-modal-title"
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl max-h-[85vh] bg-[#120E0D] border border-white/[0.15] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden text-[#F5F1ED] z-10"
          >
            {/* Header */}
            <div className="px-6 sm:px-8 py-5 border-b border-white/[0.08] flex items-center justify-between bg-[#171210]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FF4D0A]/15 border border-[#FF4D0A]/30 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-[#FF8738]" />
                </div>
                <div>
                  <h3 id="privacy-modal-title" className="font-keania text-lg sm:text-xl text-white tracking-wide uppercase">
                    Privacy Policy
                  </h3>
                  <p className="font-mono text-[11px] text-[#A69E98]">
                    Northup Studio · Last updated: November 2026
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close Privacy Policy"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#F5F1ED] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D0A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="px-6 sm:px-8 py-6 overflow-y-auto space-y-6 font-mono text-xs sm:text-sm text-[#D3CBC4] leading-relaxed">
              <section>
                <h4 className="font-bold text-white text-sm sm:text-base mb-2">1. Overview</h4>
                <p>
                  At Northup Studio, we respect your privacy and take data confidentiality seriously. This Privacy Policy describes how we handle information collected through our official website and project enquiry forms.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-white text-sm sm:text-base mb-2">2. Information We Collect</h4>
                <p className="mb-2">
                  When you submit a project enquiry or audit request, we collect only the details you deliberately provide:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-[#BDB4AE]">
                  <li>Full name and work email address</li>
                  <li>Company, brand, or project affiliation</li>
                  <li>Requested services, estimated budget, and timeline</li>
                  <li>Project descriptions and website URLs for audits</li>
                </ul>
              </section>

              <section>
                <h4 className="font-bold text-white text-sm sm:text-base mb-2">3. How We Use Your Data</h4>
                <p>
                  We strictly use your information to evaluate your project scope, prepare bespoke proposals, communicate during advisory consultations, and deliver our design and engineering services. We never sell, rent, or trade your personal or business data to advertisers or third parties.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-white text-sm sm:text-base mb-2">4. Data Security &amp; Storage</h4>
                <p>
                  All client submissions are transmitted using encrypted HTTPS transport and stored in isolated production databases equipped with Row-Level Security (RLS). Access is restricted solely to authorized Northup Studio project leads.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-white text-sm sm:text-base mb-2">5. Your Rights &amp; Contact</h4>
                <p className="mb-2">
                  You have the right to request access to, rectification of, or deletion of your contact information at any time. For questions regarding our privacy practices, please contact us directly:
                </p>
                <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-[#FF8738]" />
                    <span className="text-white font-medium">northup4work@gmail.com</span>
                  </div>
                  <span className="text-[11px] text-[#A69E98]">Pune, Maharashtra, IN</span>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="px-6 sm:px-8 py-4 border-t border-white/[0.08] bg-[#171210] flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-full bg-white text-black font-keania text-sm hover:bg-[#FF4D0A] hover:text-white transition-all shadow-md active:scale-95"
              >
                Close Policy
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
