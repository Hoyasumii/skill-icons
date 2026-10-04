import { readFile } from 'node:fs/promises';
import { fileURLToPath, URL } from 'node:url';
import { createServer, defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { cloudflare } from '@cloudflare/vite-plugin';
import type { Locale } from './src/i18n/locales';
import { SITE_URL } from './shared/links';
import { localeRedirect, pageFile, pagePath, parseSitePath, type Page } from './shared/page-meta';
import {
  notFoundPage,
  renderPage,
  robots,
  SITE_PAGES,
  sitemap,
  type SiteUrls,
} from './shared/site-pages';

// GitHub Pages serves the static menu only; the Worker (/icons, /api) stays on the Cloudflare deploy.
const isPages = process.env.DEPLOY_TARGET === 'pages';
const base = isPages ? '/skill-icons/' : '/';
// Both deploys point canonical, hreflang and OpenGraph links at the Worker's: it is the one indexed.
const urls: SiteUrls = { siteUrl: SITE_URL, base };

/** Where index.html takes the prerendered app: inside #root, which main.tsx hydrates. */
const APP_SLOT = '<div id="root"><!-- page-app --></div>';

type Prerender = (page: Page, locale: Locale) => string;

/**
 * Downloads the entry script right away but runs it only after the prerendered page has painted.
 * Otherwise, when the script arrives with the HTML, Chrome runs it (and hydrates) before the first
 * paint, and the page shows no sooner than without prerendering. Hidden tabs never paint, so they
 * run it at once.
 */
function deferEntryToPaint(html: string): string {
  return html.replace(
    /<script type="module" crossorigin src="([^"]+)"><\/script>/,
    (_, src: string) =>
      `<link rel="modulepreload" crossorigin href="${src}">` +
      `<script type="module">const run = () => import(${JSON.stringify(src)}); ` +
      `document.hidden ? run() : requestAnimationFrame(() => setTimeout(run));</script>`,
  );
}

/**
 * Loads src/prerender.tsx through a throwaway SSR server, so the build can render the app the
 * way the browser would. Only the build does this; the dev server renders in the browser.
 */
async function loadPrerender(): Promise<{ prerender: Prerender; close: () => Promise<void> }> {
  const server = await createServer({
    configFile: false,
    base,
    logLevel: 'error',
    plugins: [react()],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    server: { middlewareMode: true, hmr: false, ws: false },
    appType: 'custom',
  });
  const mod = await server.ssrLoadModule('/src/prerender.tsx');
  return { prerender: mod.prerender as Prerender, close: () => server.close() };
}

/**
 * Writes one HTML file per page and language (index.html, mcp.html, pt-BR/index.html…), each with
 * its own head, content and prerendered app, plus 404.html; the Worker deploy also gets sitemap.xml and robots.txt.
 * The dev server fills index.html in for the page being opened.
 */
function sitePagesPlugin(): Plugin {
  return {
    name: 'site-pages',
    enforce: 'post',
    transformIndexHtml(html, ctx) {
      if (!ctx.server) return html;
      const { page, locale = 'en' } = parseSitePath(
        (ctx.originalUrl ?? ctx.path).split('?')[0],
        base,
      );
      return renderPage(html, page, locale, urls);
    },
    async generateBundle(_, bundle) {
      const index = bundle['index.html'];
      if (index?.type !== 'asset') return;
      const template = deferEntryToPaint(String(index.source));

      const { prerender, close } = await loadPrerender();
      try {
        for (const { page, locale } of SITE_PAGES) {
          const fileName = pageFile(pagePath(page, locale));
          const app = `<div id="root" data-prerender="${page} ${locale}">${prerender(page, locale)}</div>`;
          const source = renderPage(template, page, locale, urls).replace(APP_SLOT, () => app);
          if (fileName === 'index.html') index.source = source;
          else this.emitFile({ type: 'asset', fileName, source });
        }
      } finally {
        await close();
      }
      this.emitFile({ type: 'asset', fileName: '404.html', source: notFoundPage(urls) });
      // robots.txt only counts at a host's root, and a sitemap only lists its own host's pages.
      if (!isPages) {
        this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap(urls.siteUrl) });
        this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots(urls.siteUrl) });
      }
    },
  };
}

/**
 * The dev server's side of the routing the build and the Worker do: each page's URL gets index.html
 * (filled in by sitePagesPlugin), and "/" and "/mcp" send visitors to their language. It runs ahead
 * of the Cloudflare plugin, which would answer the pages it has no file for with a 404.
 */
function devPagesPlugin(): Plugin {
  const pagePaths = new Set(SITE_PAGES.map(({ page, locale }) => base + pagePath(page, locale)));
  return {
    name: 'dev-pages',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const [pathname, search = ''] = (req.url ?? '/').split(/(?=\?)/);
        const path = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
        const isPage = pagePaths.has(path) || pagePaths.has(`${path}/`);
        // MCP clients POST to /mcp; only a browser opening a page is answered here.
        if (!isPage || req.method !== 'GET' || !req.headers.accept?.includes('text/html'))
          return next();

        const target = localeRedirect(pathname, base, {
          cookie: req.headers.cookie,
          acceptLanguage: req.headers['accept-language'],
        });
        if (target) {
          res.writeHead(302, { Location: target + search, 'Cache-Control': 'no-store' });
          return res.end();
        }
        try {
          const template = await readFile(new URL('./index.html', import.meta.url), 'utf8');
          const html = await server.transformIndexHtml(
            req.url ?? pathname,
            template,
            req.originalUrl,
          );
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(html);
        } catch (err) {
          next(err);
        }
      });
    },
  };
}

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    devPagesPlugin(),
    sitePagesPlugin(),
    ...(isPages ? [] : [cloudflare()]),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
});
