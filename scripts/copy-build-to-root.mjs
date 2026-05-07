#!/usr/bin/env node
/**
 * Copy dist/ build output to the repo root so GitHub Pages branch-deploy
 * (which serves files directly from main branch root) picks up the latest
 * production bundle. The source dev HTML stays at `index.dev.html`.
 *
 * Files copied:
 *   dist/index.html          → ./index.html       (overwrites the prev built one)
 *   dist/404.html            → ./404.html         (SPA fallback for deep links)
 *   dist/assets/             → ./assets/          (hashed bundles & css)
 *   dist/*.svg, *.png, *.ico → ./<file>           (public assets)
 */
import { cpSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname ?? '.', '..');
const dist = join(root, 'dist');

if (!existsSync(dist)) {
  console.error('[copy-build-to-root] dist/ not found — run `vite build` first.');
  process.exit(1);
}

// Wipe stale assets/ at root so removed chunks don't accumulate.
const rootAssets = join(root, 'assets');
if (existsSync(rootAssets)) {
  rmSync(rootAssets, { recursive: true, force: true });
}

let copied = 0;
for (const entry of readdirSync(dist)) {
  const src = join(dist, entry);
  // Vite produced index.dev.html (since that's our build entry); the served
  // file at the GH Pages URL should be index.html.
  const dst = entry === 'index.dev.html' ? join(root, 'index.html') : join(root, entry);
  cpSync(src, dst, { recursive: true });
  copied++;
}

console.log(`[copy-build-to-root] Copied ${copied} top-level entries from dist/ → root.`);
