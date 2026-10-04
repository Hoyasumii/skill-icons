import { fileURLToPath, URL } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { cloudflare } from '@cloudflare/vite-plugin';
import { API_URL, PAGES_URL } from './shared/icons';
import { pageHead } from './shared/page-meta';

// GitHub Pages serves the static menu only; the Worker (/icons, /api) stays on the Cloudflare deploy.
const isPages = process.env.DEPLOY_TARGET === 'pages';
const base = isPages ? '/skill-icons/' : '/';
/** Absolute site URL; OpenGraph crawlers need absolute links for og:url and og:image. */
const siteUrl = isPages ? PAGES_URL : `${API_URL}${base}`;

/** Writes the home page's title, description and OpenGraph tags into index.html, with absolute URLs. */
function pageMetaPlugin(): Plugin {
  return {
    name: 'page-meta',
    transformIndexHtml: html => html.replace('<!-- page-meta -->', pageHead('home', 'en', siteUrl)),
  };
}

export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), pageMetaPlugin(), ...(isPages ? [] : [cloudflare()])],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
});
