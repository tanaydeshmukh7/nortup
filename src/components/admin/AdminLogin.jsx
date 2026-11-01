import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Mail, Eye, EyeOff, Loader2, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient'

export default function AdminLogin({ onLoginSuccess, onNavigate }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!isSupabaseConfigured || !supabase) {
      setErrorMessage(
        'Supabase client is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.'
      )
      return
    }

    const trimmedEmail = email.trim().toLowerCase()
    if (!trimmedEmail || !password) {
      setErrorMessage('Please enter both your admin email and password.')
      return
    }

    setIsSubmitting(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      })

      if (error) {
        setIsSubmitting(false)
        setErrorMessage(error.message || 'Authentication failed. Please verify your credentials.')
        return
      }

      if (data?.session) {
        // Callback triggers server-side authorization check via verifyAdminStatus
        await onLoginSuccess(data.session)
      }
    } catch (err) {
      setIsSubmitting(false)
      setErrorMessage(err.message || 'An unexpected error occurred during login.')
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#0C0C0C] text-[#F5F1EB] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden select-none font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-[#FF8A3D]/5 blur-[140px] pointer-events-none" />

      {/* Back to Site Button */}
      <div className="w-full max-w-md mb-6 flex justify-between items-center z-10 font-mono">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2 text-xs text-[#A6A09A] hover:text-[#F5F1EB] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio Website</span>
        </button>

        <span className="text-[11px] uppercase tracking-widest text-[#FF8A3D] font-bold">
          CRM Console
        </span>
      </div>

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-md bg-[#151515] border border-[#303030] rounded-2xl p-8 sm:p-10 shadow-2xl relative z-10 backdrop-blur-xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#FF8A3D]/15 border border-[#FF8A3D]/30 text-[#FF8A3D] mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="font-bold text-2xl uppercase tracking-wider text-[#F5F1EB] font-mono">
            ADMIN SIGN IN
          </h1>
          <p className="font-mono text-xs text-[#A6A09A] mt-1.5">
            Internal operations dashboard for Northup Studio client enquiries.
          </p>
        </div>

        {/* Configuration Notice if Supabase is unconfigured */}
        {!isSupabaseConfigured && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-300 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-200">Supabase Unconfigured</p>
              <p className="mt-1 text-red-300/80 leading-relaxed">
                Add <code className="text-white">VITE_SUPABASE_URL</code> and <code className="text-white">VITE_SUPABASE_ANON_KEY</code> to enable login.
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/40 text-xs font-mono text-red-200 flex items-start gap-3"
          >
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{errorMessage}</div>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 font-mono">
          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-[#A6A09A] mb-2">
              Admin Work Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                disabled={isSubmitting || !isSupabaseConfigured}
                placeholder="northup4work@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#1D1D1D] border border-[#303030] focus:border-[#FF8A3D] text-[#F5F1EB] placeholder-[#A6A09A]/50 text-sm focus:outline-none transition-colors"
              />
              <Mail className="w-4 h-4 text-[#A6A09A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-[#A6A09A] mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={isSubmitting || !isSupabaseConfigured}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-[#1D1D1D] border border-[#303030] focus:border-[#FF8A3D] text-[#F5F1EB] placeholder-[#A6A09A]/50 text-sm focus:outline-none transition-colors"
              />
              <Lock className="w-4 h-4 text-[#A6A09A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A6A09A] hover:text-[#F5F1EB] transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !isSupabaseConfigured}
              className="w-full py-3.5 rounded-xl bg-[#FF8A3D] hover:bg-[#E96D24] text-black font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Authorization...</span>
                </>
              ) : (
                <span>Access Admin Console</span>
              )}
            </button>
          </div>
        </form>

        {/* Footer info note */}
        <div className="mt-8 pt-6 border-t border-[#303030] text-center font-mono">
          <p className="text-[11px] text-[#A6A09A] leading-relaxed">
            Access restricted to authorized personnel. Row Level Security active.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
