import { describe, expect, it } from 'vitest';

describe('element in node', () => {
  it('imports and defines without DOM globals', async () => {
    expect(typeof HTMLElement).toBe('undefined');
    const mod = await import('../src/element/index.js');
    expect(() => mod.defineSkillIcons()).not.toThrow();
    await expect(import('../src/element/define.js')).resolves.toBeDefined();
  });
});
