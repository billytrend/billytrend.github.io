import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';
import type { IncomingMessage } from 'node:http';

function dirIndexPlugin(): Plugin {
  // Cache lookups to avoid repeated fs.statSync on every request
  const cache = new Map<string, string | null>();
  const rewrite = (req: IncomingMessage & { url?: string; method?: string }, root: string) => {
    try {
      if (!req.url) return;
      if (req.method && req.method !== 'GET' && req.method !== 'HEAD') return;
      const url = new URL(req.url, 'http://localhost');
      const pathname = decodeURIComponent(url.pathname);
      if (pathname === '/' || path.extname(pathname)) return; // skip files/ root
      // Serve previously computed rewrites from cache
      const cached = cache.get(pathname);
      if (cached !== undefined) {
        if (cached) req.url = cached + (url.search || '');
        return;
      }
      const candidates = [path.join(root, pathname), path.join(root, 'public', pathname)];
      for (const base of candidates) {
        const target = path.join(base, 'index.html');
        if (fs.existsSync(target) && fs.statSync(target).isFile()) {
          const rewritten = (pathname.endsWith('/') ? pathname : pathname + '/') + 'index.html';
          cache.set(pathname, rewritten);
          req.url = rewritten + (url.search || '');
          break;
        }
      }
      // Negative cache to avoid repeated fs checks for misses
      if (!cache.has(pathname)) cache.set(pathname, null);
    } catch {
      // ignore
    }
  };
  return {
    name: 'dir-index-serve',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        rewrite(req, server.config.root);
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        rewrite(req, server.config.root);
        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  appType: 'spa',
  // Keep Vite cache in monorepo root for faster multi-package workflows
  cacheDir: '../../.vite/billytrend.com',
  plugins: [react(), mdx(), tailwindcss(), dirIndexPlugin()],
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    esbuildOptions: { target: 'es2022' },
  },
  server: {
    // Ensure that unknown routes fall back to index.html during dev
    fs: { strict: true },
  },
  preview: {
    // Vite preview respects appType: 'spa' and serves index.html fallback
  },
  build: {
    // Let static hosting serve 404s to index.html; Cloudflare Worker already handles SPA fallback
    target: 'es2022',
    minify: 'esbuild',
    cssCodeSplit: true,
    modulePreload: { polyfill: false },
    reportCompressedSize: true,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (/react|react-dom|scheduler|use-sync-external-store/.test(id)) return 'react-vendor';
            if (/react-router/.test(id)) return 'router';
            return 'vendor';
          }
        },
      },
    },
  },
  esbuild: {
    // Smaller prod bundles; no effect in dev
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
});
