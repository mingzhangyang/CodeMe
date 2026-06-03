import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Static files (not produced by the bundler) to precache for offline use.
      includeAssets: ['logo.svg', 'apple-touch-icon-180.png', 'robots.txt'],
      manifest: {
        name: 'CodeMe — Personalized QR Code Generator',
        short_name: 'CodeMe',
        description:
          'Create beautiful, personalized QR codes for your social profiles, websites, and contact cards. Export to PNG, SVG, or PDF — free and in your browser.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#f9fafb',
        theme_color: '#2563eb',
        lang: 'en',
        categories: ['productivity', 'utilities', 'design'],
        icons: [
          { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          },
          { src: '/logo.svg', sizes: 'any', type: 'image/svg+xml' }
        ]
      },
      workbox: {
        // SPA: serve the cached app shell for client-side routes when offline.
        navigateFallback: '/index.html',
        globPatterns: ['**/*.{js,css,html,svg,woff,woff2}'],
        // Cache the PWA icons but skip the large social-share image.
        globIgnores: ['**/og-image.png'],
        cleanupOutdatedCaches: true,
        // Allow precaching the (lazy-loaded) PDF libraries so export works offline.
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.endsWith('.png'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          }
        ]
      },
      devOptions: {
        enabled: false
      }
    })
  ]
})
