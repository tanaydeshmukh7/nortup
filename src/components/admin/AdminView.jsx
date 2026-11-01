import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShieldAlert, LogOut, ArrowLeft, Loader2, Sparkles, AlertTriangle } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient'
import { verifyAdminStatus } from '../../services/adminService'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'

export default function AdminView({ onNavigate }) {
  const [authState, setAuthState] = useState('checking') // 'checking' | 'unauthenticated' | 'unauthorized' | 'authorized'
  const [adminUser, setAdminUser] = useState(null)
  const [unauthorizedEmail, setUnauthorizedEmail] = useState(null)
  const [authErrorMessage, setAuthErrorMessage] = useState(null)

  const checkAuth = async () => {
    setAuthState('checking')
    setAuthErrorMessage(null)

    if (!isSupabaseConfigured || !supabase) {
      setAuthState('unauthenticated')
      return
    }

    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error || !session) {
        setAuthState('unauthenticated')
        return
      }

      // Verify authorization on the server
      const verification = await verifyAdminStatus()
      if (verification.authorized) {
        setAdminUser(verification.user)
        setAuthState('authorized')
      } else if (verification.status === 403) {
        setUnauthorizedEmail(session.user?.email || 'Unknown')
        setAuthErrorMessage(verification.error)
        setAuthState('unauthorized')
      } else {
        setAuthState('unauthenticated')
      }
    } catch (err) {
      console.warn('[AdminView] Session validation error:', err.message)
      setAuthState('unauthenticated')
    }
  }

  useEffect(() => {
    checkAuth()

    if (supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_OUT') {
          setAuthState('unauthenticated')
          setAdminUser(null)
        }
      })
      return () => {
        authListener?.subscription?.unsubscribe()
      }
    }
  }, [])

  const handleLoginSuccess = async (session) => {
    setAuthState('checking')
    const verification = await verifyAdminStatus()
    if (verification.authorized) {
      setAdminUser(verification.user)
      setAuthState('authorized')
    } else {
      setUnauthorizedEmail(session.user?.email || 'Unknown')
      setAuthErrorMessage(verification.error || 'Account is not authorized as an administrator.')
      setAuthState('unauthorized')
    }
  }

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    setAdminUser(null)
    setAuthState('unauthenticated')
  }

  // 1. Loading State
  if (authState === 'checking') {
    return (
      <div className="min-h-screen w-full bg-[#0B0908] text-[#F5F1ED] flex flex-col items-center justify-center font-mono text-xs select-none">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF4D0A] mb-3" />
        <span className="text-white/60">Verifying Northup Studio admin credentials...</span>
      </div>
    )
  }

  // 2. Unauthorized State (Authenticated user, but not on admin allowlist)
  if (authState === 'unauthorized') {
    return (
      <div className="min-h-screen w-full bg-[#0B0908] text-[#F5F1ED] flex flex-col justify-center items-center px-4 py-12 select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-[#140F0D] border border-red-500/30 rounded-3xl p-8 sm:p-10 text-center shadow-2xl font-mono"
        >
          <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 mx-auto flex items-center justify-center mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <h2 className="font-jaro text-2xl uppercase tracking-wider text-white mb-2">
            Unauthorized Access
          </h2>

          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 leading-relaxed mb-6 text-left">
            <p className="font-bold mb-1">Account Denied: {unauthorizedEmail}</p>
            <p className="text-red-300/80">
              {authErrorMessage ||
                'This account is authenticated, but is not listed in the Northup Studio administrator allowlist.'}
            </p>
          </div>

          <p className="text-xs text-white/50 mb-6 leading-relaxed">
            To grant access to this account, add this email to the <code className="text-white">ADMIN_EMAILS</code> environment variable or insert it into the <code className="text-white">public.admin_users</code> Supabase table.
          </p>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out / Switch Account</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="w-full py-3 rounded-xl bg-transparent hover:bg-white/[0.04] text-white/60 hover:text-white font-mono text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Portfolio</span>
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // 3. Unauthenticated State (Show Login Form)
  if (authState === 'unauthenticated') {
    return (
      <AdminLogin
        onLoginSuccess={handleLoginSuccess}
        onNavigate={onNavigate}
      />
    )
  }

  // 4. Authorized State (Show Dashboard)
  return (
    <AdminDashboard
      adminUser={adminUser}
      onLogout={handleLogout}
      onNavigate={onNavigate}
    />
  )
}
