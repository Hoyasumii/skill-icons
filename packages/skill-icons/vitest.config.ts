import { svelte } from '@sveltejs/vite-plugin-svelte';
import { getViteConfig } from 'astro/config';
import solid from 'vite-plugin-solid';
import { defineConfig } from 'vitest/config';

const svelteClient = 'test/svelte-client.test.ts';
const astroTests = 'test/astro*.test.ts';
const solidTests = 'test/solid*';

// Astro's vite plugins compile the .astro components under test.
const astro = await getViteConfig({
  test: { name: 'astro', include: [astroTests], environment: 'node' },
})({ mode: 'test', command: 'serve' });

export default defineConfig({
  test: {
    projects: [
      {
        plugins: [svelte()],
        test: {
          name: 'default',
          // Compiles src/angular with ngc, so the Angular tests run the shipped partial output.
          globalSetup: ['test/angular.setup.ts'],
          include: ['test/**/*.test.{ts,tsx}'],
          exclude: [svelteClient, astroTests, solidTests],
          environment: 'node',
        },
      },
      {
        // Svelte's `mount` only exists in its browser build.
        plugins: [svelte()],
        resolve: { conditions: ['browser'] },
        test: { name: 'svelte-client', include: [svelteClient], environment: 'node' },
      },
      {
        // Solid's JSX is compiled for the server here, so renderToString gets the SSR build.
        plugins: [solid({ ssr: true })],
        test: { name: 'solid', include: ['test/solid.test.tsx'], environment: 'node' },
      },
      {
        plugins: [solid()],
        resolve: { conditions: ['browser'] },
        test: {
          name: 'solid-client',
          include: ['test/solid-client.test.tsx'],
          environment: 'happy-dom',
        },
      },
      astro,
    ],
  },
});
