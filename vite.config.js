import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages で公開するときはサブパス配信になるため base を設定する
export default defineConfig({
  plugins: [react()],
  base: './',
})
