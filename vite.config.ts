import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const vercelCleanUrlsPlugin = () => ({
  name: 'vercel-clean-urls',
  configureServer(server: any) {
    server.middlewares.use((req: any, _res: any, next: any) => {
      if (!req.url) return next()
      const [pathname, query] = req.url.split('?')
      const qs = query ? `?${query}` : ''
      if (pathname === '/news' || pathname === '/news/') {
        req.url = `/news.html${qs}`
      } else if (/^\/news\/\d+\/?$/.test(pathname)) {
        req.url = `/news-detail.html${qs}`
      } else if (pathname === '/news-detail') {
        req.url = `/news-detail.html${qs}`
      } else if (pathname === '/admin') {
        req.url = `/admin.html${qs}`
      } else if (pathname === '/write') {
        req.url = `/write.html${qs}`
      }
      next()
    })
  }
})

export default defineConfig({
  plugins: [react(), vercelCleanUrlsPlugin()],
  build: {
    emptyOutDir: false
  }
})
