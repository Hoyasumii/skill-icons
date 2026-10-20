import { describe, expect, it } from 'vitest';
import {
  composeIcons,
  iconKey,
  iconsSize,
  loadIcon,
  loadIcons,
  peekIcon,
  peekIcons,
  remoteIconsUrl,
  resolveIconName,
  themeVariants,
} from '../src/core/index.js';
import { loaders } from '../src/generated/loaders.js';
import { tintIconSvg } from '../src/generated/tint.js';

describe('resolveIconName', () => {
  it('resolves names and aliases case-insensitively', () => {
    expect(resolveIconName('React')).toBe('react');
    expect(resolveIconName(' js ')).toBe('javascript');
    expect(resolveIconName('nope')).toBeUndefined();
  });
});

describe('iconKey', () => {
  it('adds the theme only to themed icons', () => {
    expect(iconKey('react', 'light')).toBe('react-light');
    expect(iconKey('adonis', 'light')).toBe('adonis');
    expect(iconKey('nope')).toBeUndefined();
  });
});

describe('loadIcon', () => {
  it('loads a bundled SVG and caches it', async () => {
    expect(peekIcon('react-dark')).toBeUndefined();
    const svg = await loadIcon('react-dark');
    expect(svg).toMatch(/^<svg/);
    expect(peekIcon('react-dark')).toBe(svg);
  });

  it('resolves unknown keys to undefined', async () => {
    expect(await loadIcon('nope')).toBeUndefined();
  });
});

describe('loadIcons', () => {
  it('drops unknown names and lays out the rest like the API', async () => {
    const svg = await loadIcons(['js', 'nope', 'react'], 'dark', 1);
    expect(svg).toContain('viewBox="0 0 256 556"');
    expect(svg).toContain('translate(0, 300)');
    expect(await loadIcons(['nope'])).toBeUndefined();
  });
});

describe('composeIcons', () => {
  it('scales to 48px per icon', () => {
    expect(composeIcons(['<svg/>', '<svg/>'])).toContain('width="104.25" height="48"');
  });
});

describe('iconsSize', () => {
  it('wraps rows at perLine', () => {
    expect(iconsSize(3, 2, 256)).toEqual({ width: 556, height: 556 });
    expect(iconsSize(1)).toEqual({ width: 48, height: 48 });
  });
});

describe('remoteIconsUrl', () => {
  it('points at the deployed API', () => {
    expect(remoteIconsUrl({ icons: ['js', 'React'] })).toBe(
      'https://skill-icons.alanreisanjo.workers.dev/icons?i=js,react&theme=dark&perline=15',
    );
    expect(
      remoteIconsUrl({ icons: ['x'], theme: 'light', perLine: 99, baseUrl: 'http://a.dev/' }),
    ).toBe('http://a.dev/icons?i=x&theme=light&perline=50');
  });
});

describe('themeVariants', () => {
  it('expands auto to dark then light', () => {
    expect(themeVariants('auto')).toEqual(['dark', 'light']);
    expect(themeVariants('light')).toEqual(['light']);
    expect(themeVariants()).toEqual(['dark']);
  });
});

describe('tinted icons', () => {
  it('normalizes short hex and ignores invalid colors', async () => {
    const expected = await loadIcons(['react'], 'light', 1, '55ffcc');
    expect(await loadIcons(['react'], 'light', 1, '#5FC')).toBe(expected);
    expect(await loadIcons(['react'], 'light', 1, '5fc')).toBe(expected);
    expect(await loadIcons(['react'], 'light', 1, 'xyz')).toBe(
      await loadIcons(['react'], 'light', 1),
    );
    expect(iconKey('react', 'light', 'xyz')).toBe('react-light');
  });

  it.each(['dark', 'light'] as const)('uses the dark SVG with the %s tint palette', async theme => {
    for (const name of ['react', 'adonis', 'astro']) {
      const original = (await loaders[iconKey(name, 'dark')!]()).raw;
      const expected = tintIconSvg(original, '5fd3c4', theme);
      const key = iconKey(name, theme, '#5FD3C4')!;
      expect(await loadIcon(key)).toBe(expected);
      expect(peekIcon(key)).toBe(expected);
      expect(await loadIcons([name], theme, 1, '5fd3c4')).toBe(composeIcons([expected], 1));
    }
  });

  it('keeps independent cache entries for colors, themes and originals', async () => {
    expect(peekIcons(['react'], 'dark', 1, '123abc')).toBeUndefined();
    const a = await loadIcons(['react'], 'dark', 1, '123abc');
    const b = await loadIcons(['react'], 'dark', 1, 'ff3b30');
    const light = await loadIcons(['react'], 'light', 1, '123abc');
    expect(a).not.toBe(b);
    expect(a).not.toBe(light);
    expect(peekIcons(['react'], 'dark', 1, '123abc')).toBe(a);
    expect(peekIcons(['react'], 'dark', 1, 'ff3b30')).toBe(b);
    expect(peekIcons(['react'], 'light', 1, '123abc')).toBe(light);
    expect(peekIcons(['react'], 'dark', 1, 'xyz')).toBe(await loadIcons(['react'], 'dark', 1));
  });

  it.each(['dark', 'light'] as const)('preserves original %s SVGs without tint', async theme => {
    for (const name of ['react', 'adonis']) {
      const key = name === 'react' ? `react-${theme}` : name;
      const original = (await loaders[key]()).default;
      const expected = composeIcons([original], 1);
      expect(await loadIcons([name], theme, 1)).toBe(expected);
      expect(peekIcons([name], theme, 1)).toBe(expected);
    }
  });

  it('only adds normalized valid tint to remote URLs', () => {
    const original = remoteIconsUrl({ icons: ['react'], theme: 'light' });
    expect(remoteIconsUrl({ icons: ['react'], theme: 'light', tint: 'xyz' })).toBe(original);
    for (const tint of ['#5FC', '5fc', '55ffcc']) {
      expect(remoteIconsUrl({ icons: ['react'], theme: 'light', tint })).toBe(
        `${original}&tint=55ffcc`,
      );
    }
  });
});
