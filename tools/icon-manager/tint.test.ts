import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { parseTint, tintIconSvg, TINT_SWATCHES } from '../../shared/tint';

const html = readFileSync(`${import.meta.dir}/index.html`, 'utf8');
const previewCode = html.slice(
  html.indexOf('      const filePath ='),
  html.indexOf('      async function copyBases'),
);
const themed = { themed: true, dark: 'React-Dark.svg', light: 'React-Light.svg' };
const plain = { themed: false, plain: 'Astro.svg' };
const darkSvg = readFileSync(`${import.meta.dir}/../../icons/React-Dark.svg`, 'utf8');
const plainSvg = readFileSync(`${import.meta.dir}/../../icons/Astro.svg`, 'utf8');

function harness() {
  const reads: string[] = [];
  const state = { theme: 'dark', tint: '', pathMode: 'relative' };
  const api = runInNewContext(
    `${previewCode}; ({src, shownFile, entry, previewImage, tintPreviews})`,
    {
      state,
      repo: '/test repo',
      version: 42,
      IconTint: { parseTint, tintIconSvg, TINT_SWATCHES },
      esc: (s: string) => s,
      bridge: (_cmd: string, { file }: { file: string }) => {
        reads.push(file);
        return Promise.resolve(file === 'Astro.svg' ? plainSvg : darkSvg);
      },
    },
  );
  return { state, reads, api };
}

async function preview(h: ReturnType<typeof harness>, icon: typeof themed | typeof plain) {
  const markup = h.api.previewImage(icon);
  const file = markup.match(/data-tint-file="([^"]+)"/)?.[1];
  const img = {
    dataset: { tintFile: file },
    isConnected: true,
    src: markup.match(/src="([^"]+)"/)[1],
  };
  h.api.tintPreviews({ querySelectorAll: () => (file ? [img] : []) });
  await Promise.resolve();
  return img.src;
}

describe('icon-manager tint preview', () => {
  test('no tint keeps the original file URL, selected variant, and copy payload', async () => {
    const h = harness();
    for (const theme of ['dark', 'light']) {
      h.state.theme = theme;
      expect(await preview(h, themed)).toBe(
        `file:///test%20repo/icons/React-${theme === 'dark' ? 'Dark' : 'Light'}.svg?v=42`,
      );
      expect(await preview(h, plain)).toBe('file:///test%20repo/icons/Astro.svg?v=42');
    }
    expect(h.reads).toEqual([]);
    const before = JSON.stringify([h.api.entry(themed), h.api.entry(plain)]);
    h.state.tint = '#5FC';
    expect(JSON.stringify([h.api.entry(themed), h.api.entry(plain)])).toBe(before);
    expect(h.api.shownFile(themed)).toBe('React-Light.svg');
  });

  test('uses dark SVG + selected theme, or the single SVG, with byte parity', async () => {
    const h = harness();
    h.state.tint = '#5FC';
    for (const theme of ['dark', 'light'] as const) {
      h.state.theme = theme;
      for (const [icon, svg] of [
        [themed, darkSvg],
        [plain, plainSvg],
      ] as const) {
        const url = await preview(h, icon);
        expect(url.startsWith('data:image/svg+xml,')).toBe(true);
        expect(decodeURIComponent(url.split(',')[1])).toBe(tintIconSvg(svg, '55ffcc', theme));
      }
    }
    expect(h.reads).toEqual(['React-Dark.svg', 'Astro.svg']);
    for (const tint of ['xyz', '']) {
      h.state.tint = tint;
      expect(await preview(h, themed)).toBe('file:///test%20repo/icons/React-Light.svg?v=42');
    }
  });

  test('discarded async reads cannot repaint a new tint', async () => {
    const h = harness();
    h.state.tint = '5fc';
    const img = { dataset: { tintFile: 'React-Dark.svg' }, isConnected: true, src: 'original' };
    h.api.tintPreviews({ querySelectorAll: () => [img] });
    h.state.tint = '';
    await Promise.resolve();
    expect(img.src).toBe('original');
  });

  test('bundle is loaded, swatches are shared, and both dictionaries have the same tint keys', () => {
    expect(html).toContain('<script src="tint.js"></script>');
    expect(html).toContain('IconTint.TINT_SWATCHES.map');
    expect(html).not.toMatch(/tintPalette|rasterFilter/);
    const [en, pt] = html
      .slice(html.indexOf('const messages ='), html.indexOf('const lang ='))
      .split('pt: {');
    const keys = (block: string) => [...block.matchAll(/^\s+(tint\w*):/gm)].map(m => m[1]).sort();
    expect(keys(en)).toEqual(keys(pt));
    expect(keys(en).length).toBe(7);
  });
});
