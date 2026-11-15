/** Ready-made stacks: one tap appends whichever of these icons are missing, in this order. */
export const PRESETS = [
  { id: 'web', icons: ['typescript', 'nextjs', 'react', 'tailwindcss', 'shadcnui'] },
  { id: 'backend', icons: ['bun', 'hono', 'drizzle', 'postgresql', 'docker'] },
  { id: 'tooling', icons: ['git', 'github', 'vscode', 'biome', 'pnpm'] },
  { id: 'ai', icons: ['python', 'pytorch', 'huggingface', 'langchain', 'claude'] },
] as const;

export type PresetId = (typeof PRESETS)[number]['id'];
