import { describe, expect, it } from 'vitest';
import {
  composeIcons,
  iconKey,
  iconsSize,
  loadIcon,
  loadIcons,
  peekIcon,
  remoteIconsUrl,
  resolveIconName,
  themeVariants,
} from '../src/core/index.js';

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
