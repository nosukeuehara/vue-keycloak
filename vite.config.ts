import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import basicSsl from '@vitejs/plugin-basic-ssl'

// httpsを無効にする設定
export default defineConfig({
  plugins: [vue(), basicSsl()],
  server: {
    https: {
      minVersion: 'TLSv1.2'
    },
    host: '0.0.0.0',
    port: 3000,
    cors: true
  }
})