import { verifyAdminRequest } from '../_lib/auth.js'

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Content-Type', 'application/json')

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ success: false, error: 'Method not allowed. Use GET.' })
  }

  const auth = await verifyAdminRequest(req)
  if (!auth.authorized) {
    return res.status(auth.status || 401).json({
      success: false,
      authorized: false,
      error: auth.error,
      user: auth.user || null,
    })
  }

  return res.status(200).json({
    success: true,
    authorized: true,
    user: {
      id: auth.user.id,
      email: auth.user.email,
    },
    role: auth.role || 'admin',
  })
}
