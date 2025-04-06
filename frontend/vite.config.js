import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { config } from 'dotenv';
config();
// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy:{
      "/api":"http://localhost:3000",
    }
  },
  plugins: [react()],
})
