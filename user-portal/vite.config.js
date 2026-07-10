import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Walmart',
        short_name: 'Walmart',
        description: 'Walmart Premium Earning Platform',
        theme_color: '#0071ce',
        background_color: '#f3f4f6',
        display: 'standalone',
        icons: [
          {
            src: 'https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/app_icon.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'https://zxamlpfvggvoynhssbzd.supabase.co/storage/v1/object/public/cb_storage/app_icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
