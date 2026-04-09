import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// GitHub Pages 项目页使用仓库名作为路径，构建时传入：VITE_BASE=/carshow/ npm run build
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.VITE_BASE ?? "/",
  // 默认 5173 常被其它进程占用且错误返回 404，固定端口避免「打不开 / invalid response」
  server: {
    port: 5190,
    strictPort: true,
    host: true,
  },
})
