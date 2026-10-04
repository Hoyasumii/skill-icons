import { describe, expect, it } from 'vitest';
import { LIGHT_MEDIA, remoteIconsUrl, renderIcon, renderIcons } from '../src/core/index.js';

const DATA = 'src="data:image/svg+xml;charset=utf-8,';

describe('renderIcon', () => {
  it('renders a plain img with a data URI', async () => {
    const html = await renderIcon('react');
    expect(html).toMatch(/^<img alt="react" src="data:image\/svg\+xml/);
    expect(html).toContain(DATA);
    expect(html).toContain('width="48" height="48"');
    expect(html).not.toContain('<picture>');
  });

  it('applies size', async () => {
    expect(await renderIcon('react', { size: 64 })).toContain('width="64" height="64"');
  });

  it('differs between dark and light', async () => {
    const dark = await renderIcon('react', { theme: 'dark' });
    const light = await renderIcon('react', { theme: 'light' });
    expect(dark).not.toBe(light);
    expect(light).not.toContain('<picture>');
  });

  it('wraps auto in a picture with a light source', async () => {
    const html = await renderIcon('react', { theme: 'auto' });
    expect(html).toMatch(/^<picture><source media="\(prefers-color-scheme: light\)" srcset="data:/);
    expect(html).toContain(LIGHT_MEDIA);
    expect(html.endsWith('></picture>')).toBe(true);
  });

  it('skips the picture when variants are identical', async () => {
    expect(await renderIcon('adonis', { theme: 'auto' })).not.toContain('<picture>');
  });

  it('resolves aliases and keeps the given name as alt', async () => {
    const html = await renderIcon('js');
    expect(html).toContain('alt="js"');
    expect(html).toContain(DATA);
  });

  it('returns an empty string for unknown names', async () => {
    expect(await renderIcon('nope' as never)).toBe('');
  });

  it('references remote URLs in latest mode', async () => {
    const html = await renderIcon('some-new-icon', { latest: true, theme: 'auto' });
    const dark = remoteIconsUrl({ icons: ['some-new-icon'], theme: 'dark', perLine: 1 });
    const light = remoteIconsUrl({ icons: ['some-new-icon'], theme: 'light', perLine: 1 });
    expect(html).toContain(`src="${dark.replace(/&/g, '&amp;')}"`);
    expect(html).toContain(`srcset="${light.replace(/&/g, '&amp;')}"`);
    expect(html).toContain('alt="some-new-icon"');
  });

  it('honors baseUrl', async () => {
    const html = await renderIcon('x', { latest: true, baseUrl: 'https://my.dev/' });
    expect(html).toContain('src="https://my.dev/icons?i=x&amp;theme=dark&amp;perline=1"');
  });
});

describe('renderIcons', () => {
  it('lays out width like Icons and drops unknown names', async () => {
    const html = await renderIcons(['js', 'nope' as never, 'react'], { perLine: 1 });
    expect(html).toContain('alt="js, react"');
    expect(html).toContain('width="48"');
    expect(html).not.toContain('height=');
    const wide = await renderIcons(['js', 'react', 'ts'], { size: 256, perLine: 2 });
    expect(wide).toContain('width="556"');
  });

  it('returns empty for no known names', async () => {
    expect(await renderIcons(['nope' as never])).toBe('');
    expect(await renderIcons([])).toBe('');
  });

  it('supports auto', async () => {
    expect(await renderIcons(['react', 'js'], { theme: 'auto' })).toContain('<picture>');
  });

  it('builds latest URLs with perLine', async () => {
    const html = await renderIcons(['A b', 'new'], {
      latest: true,
      perLine: 5,
      baseUrl: 'https://x.dev',
    });
    expect(html).toContain('src="https://x.dev/icons?i=a%20b,new&amp;theme=dark&amp;perline=5"');
    expect(html).toContain('alt="A b, new"');
  });
});

describe('escaping', () => {
  it('escapes names in latest mode', async () => {
    const html = await renderIcon('"><script>alert(1)</script>', { latest: true });
    expect(html).not.toContain('<script');
    expect(html).toContain('alt="&quot;&gt;&lt;script&gt;');
  });

  it('escapes attr values', async () => {
    const html = await renderIcon('react', {
      attrs: { class: 'a"b', title: `<i>'&` },
    });
    expect(html).toContain('class="a&quot;b"');
    expect(html).toContain('title="&lt;i&gt;&#39;&amp;"');
  });

  it('lets attrs override alt, and renders booleans', async () => {
    const html = await renderIcon('react', {
      attrs: { alt: '', loading: 'lazy', hidden: true, nope: false },
    });
    expect(html.match(/alt=/g)).toHaveLength(1);
    expect(html).toContain('alt=""');
    expect(html).toContain(' loading="lazy" hidden src=');
    expect(html).not.toContain('nope');
  });

  it('rejects invalid attribute names and reserved ones', async () => {
    const html = await renderIcon('react', {
      attrs: {
        'x" onerror="alert(1)': 'v',
        'a b': 'v',
        '': 'v',
        '>': 'v',
        src: 'evil',
        width: 1,
        'data-ok': 'yes',
      },
    });
    expect(html).not.toContain('onerror');
    expect(html).not.toContain('evil');
    expect(html).not.toContain('a b');
    expect(html).toContain('data-ok="yes"');
    expect(html.match(/ src=/g)).toHaveLength(1);
  });
});
