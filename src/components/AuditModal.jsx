import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, ArrowUpRight, AlertCircle, Loader2, Sparkles, Globe } from 'lucide-react'
import { AUDIT_TYPES, validateAuditForm, submitAuditRequest, isBackendConfigured } from '../services/auditService'

export default function AuditModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    auditType: 'Complete digital experience',
    challenge: '',
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState(null)
  const [isReducedMotion, setIsReducedMotion] = useState(false)

  const modalRef = useRef(null)
  const firstInputRef = useRef(null)
  const previousActiveElementRef = useRef(null)

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsReducedMotion(mediaQuery.matches)
    const handler = (e) => setIsReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Manage focus and Escape key when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = document.activeElement

      // Reset submission notification when opened fresh (unless user just closed error)
      if (submitResult?.success) {
        setSubmitResult(null)
        setFormData({
          name: '',
          email: '',
          website: '',
          auditType: 'Complete digital experience',
          challenge: '',
        })
        setErrors({})
        setTouched({})
      }

      // Autofocus first input with slight delay for animation
      const timer = setTimeout(() => {
        firstInputRef.current?.focus()
      }, 50)

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          e.preventDefault()
          onClose()
        }

        // Focus trap inside modal
        if (e.key === 'Tab' && modalRef.current) {
          const focusable = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
          if (focusable.length === 0) return

          const firstElement = focusable[0]
          const lastElement = focusable[focusable.length - 1]

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault()
              lastElement.focus()
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault()
              firstElement.focus()
            }
          }
        }
      }

      window.addEventListener('keydown', handleKeyDown)
      return () => {
        clearTimeout(timer)
        window.removeEventListener('keydown', handleKeyDown)
        // Restore focus to original trigger element
        if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === 'function') {
          previousActiveElementRef.current.focus()
        }
      }
    }
  }, [isOpen, onClose])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for field once user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const validation = validateAuditForm(formData)
    if (validation.errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: validation.errors[field] }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitResult(null)

    // Mark all required fields touched
    setTouched({
      name: true,
      email: true,
      website: true,
      auditType: true,
      challenge: true,
    })

    const validation = validateAuditForm(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      // Focus first errored field
      const firstErrorField = Object.keys(validation.errors)[0]
      const el = modalRef.current?.querySelector(`[name="${firstErrorField}"]`)
      el?.focus()
      return
    }

    setIsSubmitting(true)
    try {
      const result = await submitAuditRequest(formData)
      setSubmitResult(result)
    } catch (err) {
      setSubmitResult({
        success: false,
        message: 'An unexpected error occurred. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetForm = () => {
    setFormData({
      name: '',
      email: '',
      website: '',
      auditType: 'Complete digital experience',
      challenge: '',
    })
    setErrors({})
    setTouched({})
    setSubmitResult(null)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl select-none"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="audit-modal-title"
          aria-describedby="audit-modal-desc"
        >
          {/* Animated Modal Container */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: isReducedMotion ? 1 : 0.94, y: isReducedMotion ? 0 : 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: isReducedMotion ? 1 : 0.96, y: isReducedMotion ? 0 : 12 }}
            transition={{
              duration: isReducedMotion ? 0.05 : 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative w-full max-w-xl bg-[#14100E] border border-white/[0.14] rounded-3xl p-6 sm:p-9 shadow-2xl overflow-hidden my-auto select-text"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Warm Gradient Rim */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#FF4D0A]/20 via-[#FF8738]/05 to-transparent rounded-bl-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#FF4D0A]/10 to-transparent rounded-tr-full pointer-events-none" />

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              data-cursor="hover"
              className="absolute top-5 right-5 sm:top-6 sm:right-6 p-2 rounded-full bg-white/[0.08] hover:bg-white/[0.18] text-[#F5F1ED] transition-colors focus-visible:ring-2 focus-visible:ring-[#FF4D0A] outline-none z-10"
              aria-label="Close audit request modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* State A: Confirmation Screen (after successful backend confirmation) */}
            {submitResult?.success ? (
              <div className="py-8 sm:py-12 flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-[#FF4D0A]/15 border border-[#FF4D0A]/50 flex items-center justify-center text-[#FF4D0A] shadow-lg shadow-[#FF4D0A]/20">
                  <Check className="w-8 h-8 stroke-[2.5]" />
                </div>

                <div className="space-y-2">
                  <div className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#FF8738]">
                    CONFIRMED
                  </div>
                  <h3
                    id="audit-modal-title"
                    className="font-hammer text-3xl sm:text-4xl text-[#F5F1ED] tracking-tight uppercase"
                  >
                    REQUEST RECEIVED.
                  </h3>
                  <p
                    id="audit-modal-desc"
                    className="font-mono text-sm text-[#BDB4AE] max-w-md mx-auto leading-relaxed pt-1"
                  >
                    Thanks for reaching out. Your audit request has been received.
                  </p>
                </div>

                {/* Summary of submitted site */}
                <div className="w-full max-w-md p-4 rounded-2xl bg-[#1E1613] border border-white/[0.08] text-left font-mono text-xs space-y-1.5 text-[#BDB4AE]">
                  <div className="flex justify-between items-center text-[#F5F1ED]">
                    <span className="text-[#8E8681]">Website:</span>
                    <span className="font-semibold">{formData.website}</span>
                  </div>
                  <div className="flex justify-between items-center text-[#F5F1ED]">
                    <span className="text-[#8E8681]">Focus:</span>
                    <span className="font-semibold">{formData.auditType}</span>
                  </div>
                  <div className="flex justify-between items-center text-[#F5F1ED]">
                    <span className="text-[#8E8681]">Contact:</span>
                    <span>{formData.email}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  data-cursor="hover"
                  className="px-8 py-3 rounded-xl bg-white text-black font-mono text-xs font-bold tracking-wider uppercase hover:bg-neutral-200 transition-colors shadow-md active:scale-95"
                >
                  Done
                </button>
              </div>
            ) : (
              /* State B: Active Lead Capture Form */
              <div>
                {/* Eyebrow & Header */}
                <div className="mb-6 sm:mb-7 pr-8">
                  <div className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[#FF8738] mb-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF4D0A] animate-pulse" />
                    <span>Free Digital Audit</span>
                  </div>
                  <h3
                    id="audit-modal-title"
                    className="font-hammer text-[26px] sm:text-[34px] font-bold text-[#F5F1ED] leading-[1.12] tracking-tight mb-2"
                  >
                    Let's find what's holding your website back.
                  </h3>
                  <p
                    id="audit-modal-desc"
                    className="font-mono text-xs sm:text-[13px] text-[#BDB4AE] leading-relaxed"
                  >
                    Tell us about your website. We'll review your digital presence and identify opportunities to improve
                    its design, user experience, search visibility, and performance.
                  </p>
                </div>

                {/* Temporary Configuration / Error Notice when backend is pending or submission fails */}
                {submitResult && !submitResult.success && (
                  <div
                    role="alert"
                    className="mb-6 p-4 rounded-2xl bg-[#2A1612] border border-[#FF4D0A]/50 text-[#F5F1ED] text-xs font-mono space-y-1.5 animate-in fade-in duration-200"
                  >
                    <div className="flex items-center gap-2 text-[#FF8738] font-bold text-[13px]">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>
                        {submitResult.code === 'BACKEND_NOT_CONFIGURED'
                          ? 'Backend Storage Pending (Phase 2)'
                          : 'Submission Error'}
                      </span>
                    </div>
                    <p className="text-[#F5F1ED]/90 leading-relaxed pl-6">
                      {submitResult.message}
                    </p>
                    <p className="text-[#8E8681] text-[11px] pl-6 pt-0.5">
                      Your entered details remain preserved below. You can also reach our team directly at{' '}
                      <a
                        href="mailto:northup4work@gmail.com"
                        className="text-[#FF8738] underline hover:text-white"
                      >
                        northup4work@gmail.com
                      </a>
                      .
                    </p>
                  </div>
                )}

                {/* Intake Form */}
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {/* Row: Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* 1. Full Name */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label
                          htmlFor="audit-name"
                          className="block text-xs font-mono text-[#F5F1ED] font-medium"
                        >
                          Full name <span className="text-[#FF4D0A]">*</span>
                        </label>
                        {errors.name && (
                          <span id="name-error" className="text-[11px] font-mono text-[#FF6B6B] truncate">
                            {errors.name}
                          </span>
                        )}
                      </div>
                      <input
                        ref={firstInputRef}
                        id="audit-name"
                        name="name"
                        type="text"
                        maxLength={100}
                        required
                        disabled={isSubmitting}
                        placeholder="e.g. Alex Miller"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        onBlur={() => handleBlur('name')}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        className={`w-full px-4 py-3 rounded-xl bg-[#1E1613] border text-[#F5F1ED] placeholder-white/30 text-xs sm:text-sm font-mono focus:outline-none transition-all ${
                          errors.name
                            ? 'border-[#FF4D0A] focus:ring-1 focus:ring-[#FF4D0A]'
                            : 'border-white/[0.12] focus:border-[#FF4D0A] focus:ring-1 focus:ring-[#FF4D0A]/50'
                        }`}
                      />
                    </div>

                    {/* 2. Work Email */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label
                          htmlFor="audit-email"
                          className="block text-xs font-mono text-[#F5F1ED] font-medium"
                        >
                          Work email <span className="text-[#FF4D0A]">*</span>
                        </label>
                        {errors.email && (
                          <span id="email-error" className="text-[11px] font-mono text-[#FF6B6B] truncate">
                            {errors.email}
                          </span>
                        )}
                      </div>
                      <input
                        id="audit-email"
                        name="email"
                        type="email"
                        maxLength={120}
                        required
                        disabled={isSubmitting}
                        placeholder="alex@company.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        onBlur={() => handleBlur('email')}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        className={`w-full px-4 py-3 rounded-xl bg-[#1E1613] border text-[#F5F1ED] placeholder-white/30 text-xs sm:text-sm font-mono focus:outline-none transition-all ${
                          errors.email
                            ? 'border-[#FF4D0A] focus:ring-1 focus:ring-[#FF4D0A]'
                            : 'border-white/[0.12] focus:border-[#FF4D0A] focus:ring-1 focus:ring-[#FF4D0A]/50'
                        }`}
                      />
                    </div>
                  </div>

                  {/* 3. Website URL */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label
                        htmlFor="audit-website"
                        className="block text-xs font-mono text-[#F5F1ED] font-medium"
                      >
                        Website URL <span className="text-[#FF4D0A]">*</span>
                      </label>
                      {errors.website && (
                        <span id="website-error" className="text-[11px] font-mono text-[#FF6B6B]">
                          {errors.website}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        id="audit-website"
                        name="website"
                        type="url"
                        required
                        disabled={isSubmitting}
                        placeholder="https://yourcompany.com"
                        value={formData.website}
                        onChange={(e) => handleChange('website', e.target.value)}
                        onBlur={() => handleBlur('website')}
                        aria-invalid={!!errors.website}
                        aria-describedby={errors.website ? 'website-error' : undefined}
                        className={`w-full pl-4 pr-10 py-3 rounded-xl bg-[#1E1613] border text-[#F5F1ED] placeholder-white/30 text-xs sm:text-sm font-mono focus:outline-none transition-all ${
                          errors.website
                            ? 'border-[#FF4D0A] focus:ring-1 focus:ring-[#FF4D0A]'
                            : 'border-white/[0.12] focus:border-[#FF4D0A] focus:ring-1 focus:ring-[#FF4D0A]/50'
                        }`}
                      />
                      <Globe className="w-4 h-4 text-white/30 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* 4. Audit Type — Required Selection */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="block text-xs font-mono text-[#F5F1ED] font-medium">
                        Audit focus <span className="text-[#FF4D0A]">*</span>
                      </span>
                      {errors.auditType && (
                        <span id="auditType-error" className="text-[11px] font-mono text-[#FF6B6B]">
                          {errors.auditType}
                        </span>
                      )}
                    </div>

                    <div
                      role="radiogroup"
                      aria-label="Select audit focus"
                      aria-describedby={errors.auditType ? 'auditType-error' : undefined}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                    >
                      {AUDIT_TYPES.map((type) => {
                        const isSelected = formData.auditType === type
                        return (
                          <button
                            key={type}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            disabled={isSubmitting}
                            onClick={() => handleChange('auditType', type)}
                            data-cursor="hover"
                            className={`p-3 rounded-xl text-left font-mono text-xs transition-all border flex items-center justify-between gap-2 ${
                              isSelected
                                ? 'bg-[#FF4D0A]/15 border-[#FF4D0A] text-[#F5F1ED] shadow-sm'
                                : 'bg-[#1E1613] border-white/[0.08] text-[#BDB4AE] hover:border-white/25 hover:text-[#F5F1ED]'
                            }`}
                          >
                            <span className="leading-snug">{type}</span>
                            <div
                              className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                                isSelected ? 'border-[#FF4D0A] bg-[#FF4D0A]' : 'border-white/30'
                              }`}
                            >
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* 5. Biggest Challenge — Optional Multiline Field */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label
                        htmlFor="audit-challenge"
                        className="block text-xs font-mono text-[#F5F1ED] font-medium"
                      >
                        Biggest challenge <span className="text-[#8E8681] text-[11px] font-normal">(Optional)</span>
                      </label>
                      <span className="text-[10px] font-mono text-[#8E8681]">
                        {formData.challenge.length} / 1000
                      </span>
                    </div>
                    <textarea
                      id="audit-challenge"
                      name="challenge"
                      rows={3}
                      maxLength={1000}
                      disabled={isSubmitting}
                      placeholder="What specific areas or goals are most important to you? E.g., low mobile conversions, outdated visual design, high bounce rate..."
                      value={formData.challenge}
                      onChange={(e) => handleChange('challenge', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#1E1613] border border-white/[0.12] text-[#F5F1ED] placeholder-white/30 text-xs sm:text-sm font-mono focus:outline-none focus:border-[#FF4D0A] focus:ring-1 focus:ring-[#FF4D0A]/50 transition-all resize-none"
                    />
                  </div>

                  {/* Privacy Notice (Strictly no invented URL) */}
                  <div className="pt-1">
                    <p className="text-[11px] font-mono text-[#8E8681] leading-relaxed">
                      We respect your privacy. Your website details are kept strictly confidential and will only be used
                      to evaluate your digital presence.
                    </p>
                  </div>

                  {/* Primary Action Button: "REQUEST MY AUDIT ↗" */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      data-cursor="hover"
                      className="w-full py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-[#FF4D0A] to-[#FF8738] text-white font-mono text-xs sm:text-sm font-bold tracking-wider uppercase hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF4D0A]/25 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>ANALYZING REQUEST...</span>
                        </>
                      ) : (
                        <>
                          <span>REQUEST MY AUDIT</span>
                          <span className="text-base font-light leading-none -mt-0.5">↗</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
