import { createClient } from '@supabase/supabase-js'

/**
 * Returns a Supabase client initialized with the server-side service role key.
 */
export function getSupabaseAdmin() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_KEY

  if (!supabaseUrl || !supabaseKey) {
    return null
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

/**
 * Verifies that the incoming request contains a valid Supabase Auth Bearer token
 * and that the authenticated user is an authorized Northup Studio admin.
 *
 * Checks:
 * 1. Bearer token presence & validity via supabase.auth.getUser(token)
 * 2. ADMIN_EMAILS environment variable allowlist
 * 3. public.admin_users database allowlist table
 *
 * Returns: { authorized: boolean, user?: object, supabase?: object, status?: number, error?: string }
 */
export async function verifyAdminRequest(req) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization']
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      authorized: false,
      status: 401,
      error: 'Authentication required. Missing Bearer token.',
    }
  }

  const token = authHeader.split(' ')[1]?.trim()
  if (!token) {
    return {
      authorized: false,
      status: 401,
      error: 'Authentication required. Token is empty.',
    }
  }

  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return {
      authorized: false,
      status: 503,
      error: 'Database credentials not configured in server environment.',
    }
  }

  // 1. Verify token with Supabase Auth
  const { data: userData, error: authError } = await supabase.auth.getUser(token)
  if (authError || !userData?.user) {
    return {
      authorized: false,
      status: 401,
      error: 'Invalid, revoked, or expired authentication token.',
    }
  }

  const user = userData.user
  const userEmail = (user.email || '').trim().toLowerCase()

  if (!userEmail) {
    return {
      authorized: false,
      status: 403,
      error: 'Authenticated user has no verified email address.',
    }
  }

  // 2. Check environment variable allowlist (ADMIN_EMAILS)
  const envAdminEmails = (process.env.ADMIN_EMAILS || 'northup4work@gmail.com')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)

  if (envAdminEmails.includes(userEmail)) {
    return {
      authorized: true,
      user,
      supabase,
      role: 'super_admin',
    }
  }

  // 3. Check database allowlist table (admin_users)
  try {
    const { data: dbAdmin, error: dbError } = await supabase
      .from('admin_users')
      .select('id, email, role')
      .eq('email', userEmail)
      .maybeSingle()

    if (!dbError && dbAdmin) {
      return {
        authorized: true,
        user,
        supabase,
        role: dbAdmin.role || 'admin',
      }
    }
  } catch (err) {
    console.warn('[auth.js] Error querying admin_users table:', err.message)
  }

  // 4. Denied: Authenticated, but not in any admin allowlist
  return {
    authorized: false,
    status: 403,
    error: `Access denied. Account ${userEmail} is not authorized as a Northup Studio administrator.`,
    user: { id: user.id, email: user.email },
  }
}
