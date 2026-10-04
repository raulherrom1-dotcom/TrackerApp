import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/postcss'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/TrackerApp/',
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        id: '/TrackerApp/',
        lang: 'es',
        name: 'Entreno',
        short_name: 'Entreno',
        description: 'Registro personal de entrenamientos de gimnasio',
        start_url: '/TrackerApp/',
        scope: '/TrackerApp/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0D0D0D',
        theme_color: '#0D0D0D',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Solo woff2: iOS Safari (único objetivo de esta app) lo soporta
        // desde iOS 10, así que el .woff de respaldo no hace falta precachear.
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
      },
    }),
  ],
})
