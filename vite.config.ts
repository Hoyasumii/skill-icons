import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { cloudflare } from '@cloudflare/vite-plugin';

// GitHub Pages serves the static menu only; the Worker (/icons, /api) stays on the Cloudflare deploy.
const isPages = process.env.DEPLOY_TARGET === 'pages';

export default defineConfig({
  base: isPages ? '/skill-icons/' : '/',
  plugins: [react(), tailwindcss(), ...(isPages ? [] : [cloudflare()])],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
});
