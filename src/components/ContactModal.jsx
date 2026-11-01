import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Copy, Mail, Send, ArrowUpRight, AlertCircle, Loader2, Sparkles } from 'lucide-react'
import {
  CONTACT_SERVICES,
  CONTACT_BUDGETS,
  CONTACT_TIMELINES,
  validateContactForm,
  submitContactEnquiry,
} from '../services/contactService'

export default function ContactModal({
  isOpen,
  onClose,
  initialSubject = 'Project Inquiry',
  onOpenPrivacy,
}) {
  // Map initialSubject to a known service if applicable
  const resolveInitialService = (subj) => {
    if (!subj) return 'Website Design'
    const lower = subj.toLowerCase()
    if (lower.includes('brand') || lower.includes('arulis') || lower.includes('aurelis')) return 'Branding'
    if (lower.includes('development') || lower.includes('aurex')) return 'Web Development'
    if (lower.includes('ui') || lower.includes('ux')) return 'UI/UX Design'
    if (lower.includes('drop') || lower.includes('maison') || lower.includes('atelier')) return 'Website Design'
    return 'Website Design'
  }

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: resolveInitialService(initialSubject),
    budget: '$10,000 – $25,000',
    timeline: '1 – 2 months',
    project_description: '',
    privacy_consent: false,
    website_hp: '', // Honeypot field
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState(null)
  const [copied, setCopied] = useState(false)
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

  // Update pre-selected service when initialSubject changes
  useEffect(() => {
    if (initialSubject) {
      setFormData((prev) => ({
        ...prev,
        service: resolveInitialService(initialSubject),
      }))
    }
  }, [initialSubject])

  // Manage focus, Escape key, and background scroll locking
  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = document.activeElement

      // Clear previous success state if reopening
      if (submitResult?.success) {
        setSubmitResult(null)
        setFormData({
          name: '',
          email: '',
          company: '',
          service: resolveInitialService(initialSubject),
          budget: '$10,000 – $25,000',
          timeline: '1 – 2 months',
          project_description: '',
          privacy_consent: false,
          website_hp: '',
        })
        setErrors({})
        setTouched({})
      }

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
            'button:not([disabled]), [href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
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
        if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === 'function') {
          previousActiveElementRef.current.focus()
        }
      }
    }
  }, [isOpen, onClose])

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('northup4work@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
    const validation = validateContactForm(formData)
    if (validation.errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: validation.errors[field] }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return

    // Mark all as touched
    setTouched({
      name: true,
      email: true,
      company: true,
      service: true,
      project_description: true,
      privacy_consent: true,
    })

    const validation = validateContactForm(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      // Focus first errored field
      const firstErrorKey = Object.keys(validation.errors)[0]
      const errorEl = modalRef.current?.querySelector(`[name="${firstErrorKey}"]`)
      errorEl?.focus()
      return
    }

    setIsSubmitting(true)
    setSubmitResult(null)

    const payload = {
      ...formData,
      source: initialSubject ? `contact_modal_${initialSubject.toLowerCase().replace(/[^a-z0-9]+/g, '_')}` : 'contact_modal',
    }

    const response = await submitContactEnquiry(payload)
    setIsSubmitting(false)
    setSubmitResult(response)

    if (response.success) {
      // Clear form data on verified success
      setFormData({
        name: '',
        email: '',
        company: '',
        service: resolveInitialService(initialSubject),
        budget: '$10,000 – $25,000',
        timeline: '1 – 2 months',
        project_description: '',
        privacy_consent: false,
        website_hp: '',
      })
      setErrors({})
      setTouched({})
    } else if (response.validationErrors) {
      setErrors(response.validationErrors)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            tabIndex={-1}
            initial={isReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={isReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-[#140F0D] border border-white/[0.15] rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden text-[#F5F1ED] my-auto max-h-[92vh] flex flex-col z-10"
          >
            {/* Top Warm Glow Accent */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#FF4D0A]/20 via-[#FF4D0A]/5 to-transparent rounded-bl-full pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 px-6 sm:px-10 pt-7 pb-4 border-b border-white/[0.08] flex items-start justify-between flex-shrink-0">
              <div>
                <div className="inline-flex items-center gap-2 font-mono text-[11px] sm:text-[12px] font-semibold text-[#FF8738] tracking-widest uppercase mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF4D0A]" />
                  <span>{'{LET\'S TALK}'}</span>
                </div>
                <h3
                  id="contact-modal-title"
                  className="font-jaro text-[28px] sm:text-[36px] uppercase tracking-wide text-white leading-tight"
                >
                  {initialSubject || 'Start a Project'}
                </h3>
                <p className="font-mono text-xs sm:text-sm text-[#BDB4AE] mt-1 max-w-lg">
                  Tell us about your brand, goals, and scope. We'll review your enquiry and get back to you within 24–48 hours.
                </p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close Enquiry Modal"
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-[#F5F1ED] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D0A] flex-shrink-0 ml-4"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="relative z-10 px-6 sm:px-10 py-6 overflow-y-auto flex-1 space-y-6">
              {/* Quick Direct Contacts Bar */}
              <div className="p-3.5 rounded-2xl bg-[#1B1411] border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#FF8738] flex-shrink-0" />
                  <span className="text-[#F5F1ED] font-medium select-all">northup4work@gmail.com</span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#F5F1ED] transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-green-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Email</span>
                      </>
                    )}
                  </button>
                  <a
                    href="https://www.instagram.com/northup.studio/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 hover:text-[#FF8738] transition-colors"
                  >
                    <span>@northup.studio</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Success Notification Banner */}
              {submitResult?.success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-2xl bg-[#0D2418] border border-green-500/40 text-green-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-green-500/20 text-green-400 flex-shrink-0">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-keania text-lg text-white mb-1">Enquiry Successfully Received!</h4>
                      <p className="font-mono text-xs text-green-300/90 leading-relaxed mb-3">
                        {submitResult.message}
                      </p>
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl bg-green-500 text-black font-keania text-xs tracking-wider uppercase hover:bg-green-400 transition-colors shadow-md"
                      >
                        Done &amp; Close Window
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Error Notification Banner */}
              {submitResult && !submitResult.success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-[#2A100B] border border-red-500/40 text-red-200"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs font-mono">
                      <p className="font-bold text-red-300 mb-0.5">Submission Notice</p>
                      <p className="text-red-200/90 leading-relaxed">{submitResult.message}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Main Contact Form */}
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Honeypot field (hidden from real users, lures spam bots) */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website_hp">Leave this empty</label>
                  <input
                    type="text"
                    id="website_hp"
                    name="website_hp"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.website_hp}
                    onChange={(e) => handleChange('website_hp', e.target.value)}
                  />
                </div>

                {/* Row 1: Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-mono font-medium text-[#BDB4AE] mb-1.5">
                      Full Name <span className="text-[#FF4D0A]">*</span>
                    </label>
                    <input
                      ref={firstInputRef}
                      type="text"
                      id="contact-name"
                      name="name"
                      required
                      disabled={isSubmitting}
                      placeholder="e.g. Alex Vance"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      onBlur={() => handleBlur('name')}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'contact-name-error' : undefined}
                      className={`w-full px-4 py-3 rounded-xl bg-[#1B1411] border text-[#F5F1ED] placeholder-white/25 text-sm focus:outline-none font-mono transition-colors ${
                        errors.name
                          ? 'border-red-500/80 focus:border-red-500'
                          : 'border-white/[0.08] focus:border-[#FF4D0A]'
                      }`}
                    />
                    {errors.name && (
                      <p id="contact-name-error" className="mt-1 text-[11px] font-mono text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Work Email */}
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-mono font-medium text-[#BDB4AE] mb-1.5">
                      Work Email <span className="text-[#FF4D0A]">*</span>
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      required
                      disabled={isSubmitting}
                      placeholder="alex@company.com"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      onBlur={() => handleBlur('email')}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'contact-email-error' : undefined}
                      className={`w-full px-4 py-3 rounded-xl bg-[#1B1411] border text-[#F5F1ED] placeholder-white/25 text-sm focus:outline-none font-mono transition-colors ${
                        errors.email
                          ? 'border-red-500/80 focus:border-red-500'
                          : 'border-white/[0.08] focus:border-[#FF4D0A]'
                      }`}
                    />
                    {errors.email && (
                      <p id="contact-email-error" className="mt-1 text-[11px] font-mono text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Company or Brand (Optional) */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="contact-company" className="block text-xs font-mono font-medium text-[#BDB4AE]">
                      Company or Brand
                    </label>
                    <span className="text-[11px] font-mono text-white/40">Optional</span>
                  </div>
                  <input
                    type="text"
                    id="contact-company"
                    name="company"
                    disabled={isSubmitting}
                    placeholder="e.g. Acme Corp or Studio Studio"
                    value={formData.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    onBlur={() => handleBlur('company')}
                    className="w-full px-4 py-3 rounded-xl bg-[#1B1411] border border-white/[0.08] text-[#F5F1ED] placeholder-white/25 text-sm focus:outline-none focus:border-[#FF4D0A] font-mono transition-colors"
                  />
                </div>

                {/* Service Required */}
                <div>
                  <label className="block text-xs font-mono font-medium text-[#BDB4AE] mb-2">
                    Service Required <span className="text-[#FF4D0A]">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CONTACT_SERVICES.map((srv) => {
                      const isSelected = formData.service === srv
                      return (
                        <button
                          key={srv}
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => handleChange('service', srv)}
                          className={`px-3.5 py-2 rounded-xl font-mono text-xs transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#FF4D0A] text-white font-bold border border-[#FF8738]/60 shadow-[0_0_15px_rgba(255,77,10,0.35)]'
                              : 'bg-[#1B1411] text-[#D3CBC4] border border-white/[0.08] hover:border-white/25'
                          }`}
                        >
                          {srv}
                        </button>
                      )
                    })}
                  </div>
                  {errors.service && (
                    <p className="mt-1.5 text-[11px] font-mono text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      <span>{errors.service}</span>
                    </p>
                  )}
                </div>

                {/* Estimated Budget & Timeline Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Budget */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label htmlFor="contact-budget" className="block text-xs font-mono font-medium text-[#BDB4AE]">
                        Estimated Budget
                      </label>
                      <span className="text-[11px] font-mono text-white/40">Optional</span>
                    </div>
                    <select
                      id="contact-budget"
                      name="budget"
                      disabled={isSubmitting}
                      value={formData.budget}
                      onChange={(e) => handleChange('budget', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#1B1411] border border-white/[0.08] text-[#F5F1ED] text-xs font-mono focus:outline-none focus:border-[#FF4D0A] transition-colors cursor-pointer"
                    >
                      {CONTACT_BUDGETS.map((b) => (
                        <option key={b} value={b} className="bg-[#140F0D] text-white">
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Timeline */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label htmlFor="contact-timeline" className="block text-xs font-mono font-medium text-[#BDB4AE]">
                        Desired Timeline
                      </label>
                      <span className="text-[11px] font-mono text-white/40">Optional</span>
                    </div>
                    <select
                      id="contact-timeline"
                      name="timeline"
                      disabled={isSubmitting}
                      value={formData.timeline}
                      onChange={(e) => handleChange('timeline', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#1B1411] border border-white/[0.08] text-[#F5F1ED] text-xs font-mono focus:outline-none focus:border-[#FF4D0A] transition-colors cursor-pointer"
                    >
                      {CONTACT_TIMELINES.map((t) => (
                        <option key={t} value={t} className="bg-[#140F0D] text-white">
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Project Description */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="contact-desc" className="block text-xs font-mono font-medium text-[#BDB4AE]">
                      Project Description <span className="text-[#FF4D0A]">*</span>
                    </label>
                    <span className="text-[11px] font-mono text-white/40">
                      {formData.project_description.length} / 3000
                    </span>
                  </div>
                  <textarea
                    id="contact-desc"
                    name="project_description"
                    rows={4}
                    required
                    disabled={isSubmitting}
                    placeholder="Briefly describe your project, key challenges, objectives, and any reference links..."
                    value={formData.project_description}
                    onChange={(e) => handleChange('project_description', e.target.value)}
                    onBlur={() => handleBlur('project_description')}
                    aria-invalid={Boolean(errors.project_description)}
                    aria-describedby={errors.project_description ? 'contact-desc-error' : undefined}
                    className={`w-full px-4 py-3 rounded-xl bg-[#1B1411] border text-[#F5F1ED] placeholder-white/25 text-sm focus:outline-none font-mono transition-colors resize-none leading-relaxed ${
                      errors.project_description
                        ? 'border-red-500/80 focus:border-red-500'
                        : 'border-white/[0.08] focus:border-[#FF4D0A]'
                    }`}
                  />
                  {errors.project_description && (
                    <p id="contact-desc-error" className="mt-1 text-[11px] font-mono text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      <span>{errors.project_description}</span>
                    </p>
                  )}
                </div>

                {/* Privacy Consent Checkbox */}
                <div>
                  <label className="flex items-start gap-3 cursor-pointer select-none group">
                    <input
                      type="checkbox"
                      name="privacy_consent"
                      disabled={isSubmitting}
                      checked={formData.privacy_consent}
                      onChange={(e) => handleChange('privacy_consent', e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-white/20 bg-[#1B1411] text-[#FF4D0A] focus:ring-[#FF4D0A] focus:ring-offset-0 cursor-pointer accent-[#FF4D0A]"
                    />
                    <span className="font-mono text-xs text-[#BDB4AE] group-hover:text-white transition-colors leading-snug">
                      I agree to the processing of my enquiry details in accordance with Northup Studio's{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          if (onOpenPrivacy) onOpenPrivacy()
                        }}
                        className="text-[#FF8738] underline hover:text-[#FF4D0A] transition-colors font-medium inline cursor-pointer"
                      >
                        Privacy Policy
                      </button>
                      . <span className="text-[#FF4D0A]">*</span>
                    </span>
                  </label>
                  {errors.privacy_consent && (
                    <p className="mt-1.5 text-[11px] font-mono text-red-400 flex items-center gap-1 pl-7">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      <span>{errors.privacy_consent}</span>
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FF4D0A] via-[#FF5F1E] to-[#FF8738] text-white font-keania text-sm sm:text-base tracking-wider uppercase hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-[0_4px_24px_rgba(255,77,10,0.35)] hover:shadow-[0_6px_32px_rgba(255,77,10,0.55)] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Enquiry...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Project Enquiry</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
