import { describe, expect, it } from 'vitest';
import { parseTint, TINT_SWATCHES, tintIconSvg } from '../shared/tint';

const icon = (body: string) =>
  `<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="256" height="256" rx="60" fill="#262626"/>${body}</svg>`;

describe('parseTint', () => {
  it.each([
    ['5fd3c4', '5fd3c4'],
    ['#5FD3C4', '5fd3c4'],
    [' 5fc ', '55ffcc'],
  ])('reads %s', (raw, tint) => {
    expect(parseTint(raw)).toBe(tint);
  });

  it.each([null, undefined, '', '#', 'red', '12345', '5fd3c4ff', 'xyz'])('rejects %s', raw => {
    expect(parseTint(raw)).toBeUndefined();
  });
});

describe('tintIconSvg', () => {
  it('repaints as vectors: the old tile takes the new one, the farthest color the tint', () => {
    const svg = tintIconSvg(icon('<path fill="#fff" d="M0 0h1v1z"/>'), '5fd3c4', 'dark');
    expect(svg).not.toContain('<filter');
    expect(svg).toContain(
      '<rect width="256" height="256" rx="60" fill="url(#si-tint-dark-5fd3c4-tile)"/>',
    );
    expect(svg).toContain('<path fill="#5fd3c4" d="M0 0h1v1z"/>');
  });

  it('puts colors near the tile near the new tile, and lifts a too-dark tint', () => {
    const svg = tintIconSvg(
      icon('<path fill="#FFFFFF" d="M0 0h1"/><path fill="#282828" d="M0 0h2"/>'),
      '101010',
      'dark',
    );
    // The lifted tint, then the middle of the new tile (2% of the way, under the floor).
    expect(svg).toContain('<path fill="#646464" d="M0 0h1"/>');
    expect(svg).toContain('<path fill="#020202" d="M0 0h2"/>');
  });

  it('repaints styles and gradients but leaves masks and clip paths alone', () => {
    const svg = tintIconSvg(
      icon(
        '<mask id="m"><rect fill="white"/></mask><linearGradient id="g"><stop stop-color="white"/></linearGradient><path style="fill: #ffffff;stroke:none"/>',
      ),
      '5fd3c4',
      'light',
    );
    expect(svg).toContain('<mask id="m"><rect fill="white"/></mask>');
    expect(svg).not.toContain('stop-color="white"');
    expect(svg).toMatch(/style="fill: #[0-9a-f]{6};stroke:none"/);
  });

  it('reads a gradient tile from its first stop', () => {
    const svg = tintIconSvg(
      '<svg viewBox="0 0 256 256"><rect width="256" height="256" rx="60" fill="url(#bg)"/><defs><linearGradient id="bg"><stop stop-color="#FFFFFF"/></linearGradient></defs><path fill="#000" d="M0 0"/></svg>',
      '5fd3c4',
      'dark',
    );
    // Black is now the color farthest from the (white) tile: it gets the tint.
    expect(svg).toContain('<path fill="#5fd3c4" d="M0 0"/>');
  });

  it('maps an embedded picture through a brightness filter', () => {
    const svg = tintIconSvg(icon('<image href="data:image/png;base64,AA"/>'), '5fd3c4', 'dark');
    expect(svg).toContain('<image filter="url(#si-tint-dark-5fd3c4-raster)" href=');
    expect(svg).toContain('<filter id="si-tint-dark-5fd3c4-raster"');
  });
});

describe('TINT_SWATCHES', () => {
  it('is a non-empty list of distinct, already-normalized tints', () => {
    expect(TINT_SWATCHES.length).toBeGreaterThan(0);
    expect(new Set(TINT_SWATCHES).size).toBe(TINT_SWATCHES.length);
    for (const swatch of TINT_SWATCHES) expect(parseTint(swatch)).toBe(swatch);
  });
});
