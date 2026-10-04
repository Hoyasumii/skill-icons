import { fileURLToPath, URL } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { cloudflare } from '@cloudflare/vite-plugin';
import { API_URL, PAGES_URL } from './shared/icons';

// GitHub Pages serves the static menu only; the Worker (/icons, /api) stays on the Cloudflare deploy.
const isPages = process.env.DEPLOY_TARGET === 'pages';
const base = isPages ? '/skill-icons/' : '/';
/** Absolute site URL; OpenGraph crawlers need absolute links for og:url and og:image. */
const siteUrl = isPages ? PAGES_URL : `${API_URL}${base}`;

/** Fills %SITE_URL% in index.html with the deploy's absolute URL. */
function siteUrlPlugin(): Plugin {
  return {
    name: 'site-url',
    transformIndexHtml: html => html.replaceAll('%SITE_URL%', siteUrl),
  };
}

export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), siteUrlPlugin(), ...(isPages ? [] : [cloudflare()])],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
});
