import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs';
import path from 'node:path';
import type { IncomingMessage } from 'node:http';

function dirIndexPlugin(): Plugin {
  const rewrite = (req: IncomingMessage & { url?: string }, root: string) => {
    try {
      if (!req.url) return;
      const url = new URL(req.url, 'http://localhost');
      const pathname = decodeURIComponent(url.pathname);
      if (pathname === '/' || path.extname(pathname)) return; // skip files/ root
      const candidates = [
        path.join(root, pathname),
        path.join(root, 'public', pathname),
      ];
      for (const base of candidates) {
        const target = path.join(base, 'index.html');
        if (fs.existsSync(target) && fs.statSync(target).isFile()) {
          const rewritten = (pathname.endsWith('/') ? pathname : pathname + '/') + 'index.html' + (url.search || '');
          req.url = rewritten;
          break;
        }
      }
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
  plugins: [react(), mdx(), tailwindcss(), dirIndexPlugin()],
  server: {
    // Ensure that unknown routes fall back to index.html during dev
    fs: { strict: true },
  },
  preview: {
    // Vite preview respects appType: 'spa' and serves index.html fallback
  },
  build: {
    // Let static hosting serve 404s to index.html; Cloudflare Worker already handles SPA fallback
  },
});
