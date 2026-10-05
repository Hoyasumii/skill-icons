import { describe, expect, it } from 'vitest';
import { ogNeedsOutline, ogOutline } from '../shared/og-layout';

describe('ogNeedsOutline', () => {
  it.each([
    ['light', 'light', true],
    ['light', 'dark', false],
    ['dark', 'light', false],
    ['dark', 'dark', true],
  ] as const)('bg=%s, theme=%s → %s', (bg, theme, expected) => {
    expect(ogNeedsOutline(bg, theme)).toBe(expected);
  });
});

describe('ogOutline', () => {
  it('sits 2px outside the tile, with its corner radius', () => {
    expect(ogOutline(72, 300, 104)).toEqual({
      x: 71,
      y: 299,
      size: 106,
      radius: 104 * 0.234 + 1,
      width: 2,
    });
  });
});
