import { defineConfig } from 'vitest/config';
import { cloudflareTest } from '@cloudflare/vitest-pool-workers';

export default defineConfig({
  plugins: [cloudflareTest({ wrangler: { configPath: './wrangler.jsonc' } })],
  // The first request pays the Worker's cold start (resvg wasm, MCP SDK), which is slow on CI.
  test: { include: ['test/**/*.test.ts'], testTimeout: 20_000 },
});
