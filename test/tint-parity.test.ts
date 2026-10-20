import { exports } from 'cloudflare:workers';
import { describe, expect, it } from 'vitest';
import { iconKey, loadIcon, loadIcons } from '../packages/skill-icons/src/core';

const icons = ['react', 'adonis', 'astro', 'moonrepo', 'void'];
const encoder = new TextEncoder();

// The core and worker format their grid wrappers differently. Extract only the
// nested icon SVGs; preserve every byte inside each <svg>...</svg> boundary.
function iconSvgs(grid: string): string[] {
  const icons: string[] = [];
  let depth = 0;
  let start = 0;
  // Some tinted icons contain a nested <svg>; balance tags to include it all.
  for (const tag of grid.matchAll(/<\/?svg\b[^>]*>/g)) {
    if (tag[0].startsWith('</')) {
      if (--depth === 1) icons.push(grid.slice(start, tag.index + tag[0].length));
    } else if (!tag[0].endsWith('/>')) {
      if (++depth === 2) start = tag.index;
    }
  }
  return icons;
}

describe.each(['dark', 'light'] as const)('core × /icons parity (%s)', theme => {
  describe.each([undefined, '#5FD3C4'])('tint=%s', tint => {
    it.each(icons)('matches %s byte for byte', async name => {
      const query = new URLSearchParams({ i: name, theme });
      if (tint) query.set('tint', tint);
      const response = await exports.default.fetch(`https://example.com/icons?${query}`);
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('image/svg+xml');

      const svg = await loadIcon(iconKey(name, theme, tint)!);
      expect(svg).toBeDefined();
      const workerIcons = iconSvgs(await response.text());
      expect(workerIcons).toHaveLength(1);
      expect(encoder.encode(svg)).toEqual(encoder.encode(workerIcons[0]));
    });

    it('matches a grid with vector and embedded raster icons byte for byte', async () => {
      const query = new URLSearchParams({ i: icons.join(','), theme, perline: '2' });
      if (tint) query.set('tint', tint);
      const response = await exports.default.fetch(`https://example.com/icons?${query}`);
      expect(response.status).toBe(200);

      const svg = await loadIcons(icons, theme, 2, tint);
      expect(svg).toBeDefined();
      // Keep the raster coverage explicit if the icon fixtures ever change.
      expect(svg).toContain('<image');
      if (tint) expect(svg).toContain(`si-tint-${theme}-5fd3c4-raster`);
      const workerIcons = iconSvgs(await response.text());
      const coreIcons = iconSvgs(svg!);
      expect(coreIcons).toHaveLength(icons.length);
      expect(workerIcons).toHaveLength(icons.length);
      expect(coreIcons.map(icon => encoder.encode(icon))).toEqual(
        workerIcons.map(icon => encoder.encode(icon)),
      );
    });
  });
});
