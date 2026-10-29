import React, { useState } from 'react'
import { X, Check, Copy, Mail, Send, ArrowUpRight } from 'lucide-react'

export default function ContactModal({ isOpen, onClose, initialSubject = "Project Inquiry" }) {
  if (!isOpen) return null

  const [copied, setCopied] = useState(false)
  const [formSent, setFormSent] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: initialSubject,
    message: ''
  })

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('northup4work@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const mailto = `mailto:northup4work@gmail.com?subject=${encodeURIComponent(
      `[Northup Inquiry] ${formData.projectType}`
    )}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nProject: ${formData.projectType}\n\nMessage:\n${formData.message}`
    )}`
    window.location.href = mailto
    setFormSent(true)
    setTimeout(() => {
      setFormSent(false)
      onClose()
    }, 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#15100E] border border-white/[0.15] rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden">
        
        {/* Warm glow ambient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#FF4D0A]/15 to-transparent rounded-bl-full pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#F5F1ED] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="font-keania text-[#FF8738] text-sm tracking-widest uppercase mb-1">
            Let's Talk
          </div>
          <h3 className="font-mono text-2xl sm:text-3xl font-bold text-[#F5F1ED]">
            {initialSubject}
          </h3>
          <p className="font-mono text-xs sm:text-sm text-[#BDB4AE] mt-2">
            Reach out directly or send us a quick note to get your custom estimate or project audit.
          </p>
        </div>

        {/* Quick Email Pill */}
        <div className="p-3.5 rounded-2xl bg-[#1E1613] border border-white/[0.08] flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-[#FF8738]" />
            <span className="font-mono text-sm text-[#F5F1ED] font-medium select-all">
              northup4work@gmail.com
            </span>
          </div>
          <button 
            onClick={handleCopyEmail}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-[#F5F1ED] transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Instagram Link */}
        <div className="flex items-center justify-between px-1 mb-5">
          <a
            href="https://www.instagram.com/northup.studio/"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-1.5 font-mono text-xs text-white/70 hover:text-[#FF8738] transition-colors"
          >
            <span>Instagram: <span className="text-white/90 group-hover:text-[#FF8738]">@northup.studio</span></span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#FF8738] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#BDB4AE] mb-1.5">Your Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Alex Miller"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#1E1613] border border-white/[0.08] text-[#F5F1ED] placeholder-white/30 text-sm focus:outline-none focus:border-[#FF4D0A] font-mono transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#BDB4AE] mb-1.5">Your Email</label>
            <input 
              type="email" 
              required
              placeholder="alex@domain.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#1E1613] border border-white/[0.08] text-[#F5F1ED] placeholder-white/30 text-sm focus:outline-none focus:border-[#FF4D0A] font-mono transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#BDB4AE] mb-1.5">Brief Message</label>
            <textarea 
              rows={3}
              placeholder="Tell us about your brand, goals, or timeline..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#1E1613] border border-white/[0.08] text-[#F5F1ED] placeholder-white/30 text-sm focus:outline-none focus:border-[#FF4D0A] font-mono transition-colors resize-none"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FF4D0A] to-[#FF8738] text-[#F5F1ED] font-mono text-sm font-bold tracking-wider uppercase hover:opacity-95 transition-opacity flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_0_24px_rgba(255,77,10,0.4)]"
          >
            {formSent ? (
              <>
                <Check className="w-4 h-4" />
                <span>Opening Email Client...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Inquiry</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  )
}
