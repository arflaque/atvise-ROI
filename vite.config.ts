import { defineConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

// GitHub repo: arflaque/atvise-ROI  →  https://arflaque.github.io/atvise-ROI/
// Case-sensitive: must match the repo name exactly. If you switch to a custom
// domain via CNAME, set this to '/'.
const REPO_BASE = '/atvise-ROI/';

/**
 * In dev mode, the root `index.html` is the prebuilt artifact (committed to
 * the repo so GitHub Pages branch-deploy can serve a working SPA without
 * needing a custom workflow). That built HTML references hashed bundles that
 * don't exist on the dev server. This plugin redirects the dev request for
 * `/` and `/index.html` to `index.dev.html`, which still has the original
 * `<script src="/src/main.tsx">` entry that Vite expects.
 */
function serveDevHtml(): PluginOption {
  return {
    name: 'vester:serve-dev-html',
    apply: 'serve',
    configureServer(server) {
      return () => {
        server.middlewares.use((req, res, next) => {
          const url = (req.url || '/').split('?')[0];
          if (url !== '/' && url !== '/index.html') return next();
          const file = path.resolve(server.config.root, 'index.dev.html');
          if (!fs.existsSync(file)) return next();
          const raw = fs.readFileSync(file, 'utf-8');
          server.transformIndexHtml(url, raw, req.originalUrl).then((html) => {
            res.setHeader('Content-Type', 'text/html');
            res.end(html);
          }).catch(next);
        });
      };
    },
  };
}

export default defineConfig(({ command }) => ({
  plugins: [react(), serveDevHtml()],
  base: command === 'build' ? REPO_BASE : '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      // Use the always-source HTML as the entry. Root `index.html` is the
      // committed built artifact (so branch-deploy can serve it directly),
      // and using it as a build entry would create a circular reference.
      input: path.resolve(__dirname, 'index.dev.html'),
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
