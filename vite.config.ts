import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// httpsを無効にする設定
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    cors: true
  }
})