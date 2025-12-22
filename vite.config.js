import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })



export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://109.233.108.14',
        changeOrigin: true,
        secure: false // потому что самоподписанный сертификат
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});