#!/usr/bin/env tsx
/*
 Scrape https://billytrend.github.io/st-andrews-algol-compiler into public/st-andrews-algol-compiler/
 - Downloads the main HTML and rewrites local links to relative paths
 - Fetches linked CSS/JS/IMG and stores alongside
*/

import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load as loadHtml } from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const OUT_DIR = path.join(PUBLIC_DIR, 'st-andrews-algol-compiler');
const BASE_URL = 'https://billytrend.github.io/st-andrews-algol-compiler/';

async function ensureDir(p: string) {
  await fsp.mkdir(p, { recursive: true });
}

async function fetchBuffer(url: string): Promise<{ buf: Buffer; contentType: string | null }> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  const ab = await res.arrayBuffer();
  const ct = res.headers.get('content-type');
  return { buf: Buffer.from(ab), contentType: ct };
}

function urlToLocalPath(resourceUrl: string): string {
  // Keep only path after BASE_URL
  if (resourceUrl.startsWith(BASE_URL)) {
    const rel = resourceUrl.substring(BASE_URL.length);
    return path.join(OUT_DIR, rel);
  }
  try {
    const u = new URL(resourceUrl);
    if (u.origin === new URL(BASE_URL).origin && resourceUrl.startsWith(new URL(BASE_URL).origin + '/st-andrews-algol-compiler/')) {
      const rel = u.pathname.replace(/^\/st-andrews-algol-compiler\//, '');
      return path.join(OUT_DIR, rel);
    }
  } catch {
    // relative URL
    return path.join(OUT_DIR, resourceUrl);
  }
  // External - place in vendor and preserve path
  const safe = resourceUrl.replace(/^[a-z]+:\/\//i, '').replace(/[^a-zA-Z0-9._\-/]/g, '_');
  return path.join(OUT_DIR, 'vendor', safe);
}

async function writeFileSafe(dest: string, data: Buffer | string) {
  await ensureDir(path.dirname(dest));
  await fsp.writeFile(dest, data);
}

async function scrape() {
  console.log('Scraping', BASE_URL);
  await ensureDir(OUT_DIR);

  // We'll BFS crawl only within BASE_URL.
  const base = new URL(BASE_URL);
  const toVisit: string[] = [BASE_URL];
  const visited = new Set<string>();
  let processed = 0;
  const MAX_PAGES = 200;

  function normalize(u: string): string {
    const x = new URL(u, base);
    x.hash = '';
    // normalize directory URLs to trailing slash
    if (!x.pathname || x.pathname.endsWith('/')) return x.toString();
    return x.toString();
  }

  while (toVisit.length && processed < MAX_PAGES) {
    const url = normalize(toVisit.shift()!);
    if (visited.has(url)) continue;
    if (!url.startsWith(BASE_URL)) continue;
    visited.add(url);
    processed++;

    try {
      const { buf, contentType } = await fetchBuffer(url);
      const isHtml = (contentType || '').includes('text/html') || url.endsWith('.html') || url.endsWith('/');
      const destPath = urlToLocalPath(url.endsWith('/') ? url + 'index.html' : url);
      if (isHtml) {
        const html = buf.toString('utf-8');
        const $ = loadHtml(html);

        // collect assets and internal links
        const addAsset = (u: string) => {
          const abs = new URL(u, url).toString();
          if (abs.startsWith(BASE_URL)) {
            // enqueue internal pages for crawling
            if (abs.endsWith('/') || abs.endsWith('.html')) {
              toVisit.push(abs);
            }
          }
          // Always download any resource under the same base (css/js/img, etc)
          if (abs.startsWith(BASE_URL)) toVisit.push(abs);
        };

        $('link[href]').each((_, el) => {
          const href = $(el).attr('href');
          if (href) addAsset(href);
        });
        $('script[src]').each((_, el) => {
          const src = $(el).attr('src');
          if (src) addAsset(src);
        });
        $('img[src]').each((_, el) => {
          const src = $(el).attr('src');
          if (src) addAsset(src);
        });
        $('a[href]').each((_, el) => {
          const href = $(el).attr('href');
          if (!href) return;
          const abs = new URL(href, url).toString();
          if (abs.startsWith(BASE_URL)) toVisit.push(abs);
        });

        // rewrite attributes to relative paths
        const rewrite = (sel: string, attr: string) => {
          $(sel).each((_, el) => {
            const val = $(el).attr(attr);
            if (!val) return;
            const abs = new URL(val, url).toString();
            if (!abs.startsWith(base.origin)) return; // leave externals
            const local = urlToLocalPath(abs.endsWith('/') ? abs + 'index.html' : abs);
            const rel = path.relative(path.dirname(destPath), local).split(path.sep).join('/');
            $(el).attr(attr, rel.startsWith('.') ? rel : `./${rel}`);
          });
        };
        rewrite('link[href]', 'href');
        rewrite('script[src]', 'src');
        rewrite('img[src]', 'src');
        rewrite('a[href]', 'href');

        await writeFileSafe(destPath, Buffer.from($.html(), 'utf-8'));
        console.log('Saved page', url, '->', destPath);
      } else {
        await writeFileSafe(destPath, buf);
        console.log('Saved asset', url, '->', destPath);
      }
    } catch (e) {
      console.warn('Warn: failed to fetch', url, e);
    }
  }

  console.log(`Crawl finished. Pages/assets processed: ${processed}, output at ${OUT_DIR}`);
}

scrape().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
