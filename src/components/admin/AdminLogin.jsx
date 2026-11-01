import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Mail, Eye, EyeOff, Loader2, AlertCircle, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react'
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
        // Callback will trigger server-side authorization check via verifyAdminStatus
        await onLoginSuccess(data.session)
      }
    } catch (err) {
      setIsSubmitting(false)
      setErrorMessage(err.message || 'An unexpected error occurred during login.')
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#0B0908] text-[#F5F1ED] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-radial from-[#FF4D0A]/15 via-transparent to-transparent blur-[120px] pointer-events-none" />

      {/* Back to Site Button */}
      <div className="w-full max-w-md mb-6 flex justify-between items-center z-10">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2 text-xs font-mono text-white/60 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio Website</span>
        </button>

        <span className="text-[11px] font-mono uppercase tracking-widest text-[#FF8738]">
          Northup Console
        </span>
      </div>

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-[#140F0D] border border-white/[0.12] rounded-3xl p-8 sm:p-10 shadow-[0_24px_70px_rgba(0,0,0,0.85)] relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FF4D0A]/15 border border-[#FF4D0A]/30 text-[#FF8738] mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="font-jaro text-3xl uppercase tracking-wider text-white">
            Admin Sign In
          </h1>
          <p className="font-mono text-xs text-[#BDB4AE] mt-1.5">
            Internal operations dashboard for Northup Studio project leads.
          </p>
        </div>

        {/* Configuration Notice if Supabase is unconfigured */}
        {!isSupabaseConfigured && (
          <div className="mb-6 p-4 rounded-xl bg-[#2A100B] border border-red-500/30 text-xs font-mono text-red-300 flex items-start gap-3">
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
            className="mb-6 p-4 rounded-xl bg-[#2A100B] border border-red-500/40 text-xs font-mono text-red-200 flex items-start gap-3"
          >
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{errorMessage}</div>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-xs font-mono font-medium text-[#BDB4AE] mb-2">
              Admin Work Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                disabled={isSubmitting || !isSupabaseConfigured}
                placeholder="admin@northupstudio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#1B1411] border border-white/[0.08] focus:border-[#FF4D0A] text-[#F5F1ED] placeholder-white/20 text-sm font-mono focus:outline-none transition-colors"
              />
              <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-mono font-medium text-[#BDB4AE] mb-2">
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
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-[#1B1411] border border-white/[0.08] focus:border-[#FF4D0A] text-[#F5F1ED] placeholder-white/20 text-sm font-mono focus:outline-none transition-colors"
              />
              <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
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
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF4D0A] to-[#FF8738] text-white font-keania text-sm uppercase tracking-wider hover:opacity-95 transition-opacity flex items-center justify-center gap-2 shadow-[0_4px_24px_rgba(255,77,10,0.35)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
        <div className="mt-8 pt-6 border-t border-white/[0.08] text-center">
          <p className="font-mono text-[11px] text-white/40 leading-relaxed">
            Access is restricted to authorized studio personnel. All activity is logged and verified with server-side Row Level Security.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
