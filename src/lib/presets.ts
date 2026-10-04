/** Ready-made stacks: one tap appends whichever of these icons are missing, in this order. */
export const PRESETS = [
  { id: 'web', icons: ['typescript', 'react', 'tailwindcss', 'vite', 'vitest'] },
  { id: 'backend', icons: ['nodejs', 'bun', 'postgresql', 'docker', 'aws'] },
  { id: 'tooling', icons: ['git', 'github', 'figma', 'bash', 'biome'] },
  { id: 'ai', icons: ['python', 'chatgpt', 'claude', 'anaconda'] },
] as const;

export type PresetId = (typeof PRESETS)[number]['id'];
