import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShieldAlert, LogOut, ArrowLeft, Loader2, RefreshCw } from 'lucide-react'
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
      } else if (verification.status === 403 || verification.status === 401 || verification.status === 500) {
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
      <div className="min-h-screen w-full bg-[#0C0C0C] text-[#F5F1EB] flex flex-col items-center justify-center font-mono text-xs select-none">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF8A3D] mb-3" />
        <span className="text-[#A6A09A]">Verifying Northup Studio admin credentials...</span>
      </div>
    )
  }

  // 2. Unauthorized State (Authenticated user, but not on admin allowlist)
  if (authState === 'unauthorized') {
    return (
      <div className="min-h-screen w-full bg-[#0C0C0C] text-[#F5F1EB] flex flex-col justify-center items-center px-4 py-12 select-none font-mono">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-[#151515] border border-red-500/30 rounded-2xl p-8 sm:p-10 text-center shadow-2xl backdrop-blur-xl"
        >
          <div className="w-12 h-12 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 mx-auto flex items-center justify-center mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <h2 className="text-xl font-bold uppercase tracking-wider text-[#F5F1EB] mb-2 font-mono">
            Unauthorized Access
          </h2>

          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 leading-relaxed mb-6 text-left">
            <p className="font-bold mb-1">Account: {unauthorizedEmail}</p>
            <p className="text-red-300/80">
              {authErrorMessage ||
                'This account is authenticated, but is not listed in the Northup Studio administrator allowlist.'}
            </p>
          </div>

          <p className="text-xs text-[#A6A09A] mb-6 leading-relaxed">
            To grant access to this account, ensure this email is listed in <code className="text-[#FF8A3D]">ADMIN_EMAILS</code> or in the <code className="text-[#FF8A3D]">public.admin_users</code> Supabase table.
          </p>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={checkAuth}
              className="w-full py-2.5 rounded-xl bg-[#FF8A3D] hover:bg-[#E96D24] text-black font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Authorization Check</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-2.5 rounded-xl bg-[#1D1D1D] hover:bg-[#252525] border border-[#303030] text-[#F5F1EB] text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out / Switch Account</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="w-full py-2.5 rounded-xl bg-transparent hover:bg-[#1D1D1D] text-[#A6A09A] hover:text-[#F5F1EB] text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
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
