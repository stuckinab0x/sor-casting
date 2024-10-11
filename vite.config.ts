import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    include: /\.(js|jsx|ts|tsx)$/,
  })],
  server: {
    host: true,
    port: 5173,
    hmr: { port: 5173 },
  }
})
