import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()
  ], 
  server: {
    port: 3000,
    hmr: {
      overlay: false,
    },
    host: true, // needed for the Docker Container port mapping to work
    strictPort: true,
  
  },
})


