import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ⚠️ 注意：这里必须是你 GitHub 仓库的名字，两边都要有斜杠
  // 根据你的日志，你的仓库名应该是 'salary-flow'
  base: '/salary-flow/', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
});