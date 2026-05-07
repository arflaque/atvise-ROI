import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// GitHub repo: arflaque/atvise-ROI  →  https://arflaque.github.io/atvise-ROI/
// Case-sensitive: match the repo name exactly. If you switch to a custom domain (CNAME), set this to '/'.
const REPO_BASE = '/atvise-ROI/';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? REPO_BASE : '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
          pdf: ['jspdf', 'html2canvas-pro'],
        },
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
}));
