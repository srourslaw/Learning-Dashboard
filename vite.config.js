import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],

          // Chart libraries (heavy dependency)
          'charts': ['recharts'],

          // Math rendering libraries (includes large fonts)
          'math': ['katex', 'react-katex'],

          // Icons library
          'icons': ['lucide-react']
        }
      }
    },
    // Increase chunk size warning limit to 1000kb (we're code splitting now)
    chunkSizeWarningLimit: 1000
  }
})
