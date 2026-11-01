import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

function vercelApiDevPlugin() {
  return {
    name: 'vercel-api-dev',
    configureServer(server) {
      // Load environment variables into process.env so dev API has access
      const env = loadEnv('development', process.cwd(), '')
      Object.assign(process.env, env)

      // Fallback defaults for admin email if not provided
      if (!process.env.ADMIN_EMAILS) {
        process.env.ADMIN_EMAILS = 'northup4work@gmail.com'
      }

      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) {
          return next()
        }

        try {
          const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost:5173'}`)
          const pathname = parsedUrl.pathname.replace(/\/+$/, '')

          let handlerModule = null
          if (pathname === '/api/contact' || pathname === '/api/contact.js') {
            handlerModule = await import('./api/contact.js')
          } else if (pathname === '/api/admin/auth-check' || pathname === '/api/admin/auth-check.js') {
            handlerModule = await import('./api/admin/auth-check.js')
          } else if (pathname === '/api/admin/leads' || pathname === '/api/admin/leads.js') {
            handlerModule = await import('./api/admin/leads.js')
          } else if (pathname === '/api/admin/notes' || pathname === '/api/admin/notes.js') {
            handlerModule = await import('./api/admin/notes.js')
          } else if (pathname === '/api/admin/communication' || pathname === '/api/admin/communication.js') {
            handlerModule = await import('./api/admin/communication.js')
          } else if (pathname === '/api/admin/proposals' || pathname === '/api/admin/proposals.js') {
            handlerModule = await import('./api/admin/proposals.js')
          } else if (pathname === '/api/admin/templates' || pathname === '/api/admin/templates.js') {
            handlerModule = await import('./api/admin/templates.js')
          } else if (pathname === '/api/admin/schedule-meeting' || pathname === '/api/admin/schedule-meeting.js') {
            handlerModule = await import('./api/admin/schedule-meeting.js')
          } else {
            return next()
          }

          // Parse query parameters
          req.query = Object.fromEntries(parsedUrl.searchParams.entries())

          // Parse body for mutations
          if (['POST', 'PATCH', 'PUT'].includes(req.method)) {
            const chunks = []
            for await (const chunk of req) {
              chunks.push(chunk)
            }
            const bodyStr = Buffer.concat(chunks).toString('utf-8')
            try {
              req.body = bodyStr ? JSON.parse(bodyStr) : {}
            } catch {
              req.body = bodyStr
            }
          } else {
            req.body = req.body || {}
          }

          // Provide Vercel / Express style helpers on res
          res.status = (code) => {
            res.statusCode = code
            return res
          }
          res.json = (data) => {
            if (!res.getHeader('Content-Type')) {
              res.setHeader('Content-Type', 'application/json')
            }
            res.end(JSON.stringify(data))
            return res
          }

          const handler = handlerModule.default || handlerModule
          await handler(req, res)
        } catch (err) {
          console.error('[Vite API Middleware Error]:', err)
          if (!res.headersSent) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: false, error: err.message }))
          }
        }
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), vercelApiDevPlugin()],
  assetsInclude: ['**/*.glb', '**/*.gltf'],
  server: {
    port: 5173,
    host: true
  }
})
