import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { config } from 'dotenv';
config();
// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy:{
      "/api":"https://de-view-backend.vercel.app/",
    }
  },
  plugins: [react()],
})
