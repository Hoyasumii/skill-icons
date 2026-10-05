import { createSSRApp, defineComponent, h, type Component } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { describe, expect, it } from 'vitest';
import { loadIcon, type ThemeOption } from '../src/core/index.js';
import { Icon, Icons, SkillIconsProvider } from '../src/vue/index.js';

const render = (component: Component, props: Record<string, unknown> = {}) =>
  renderToString(createSSRApp(component, props)).then(html =>
    html.replace(/<!--\[-->|<!--]-->/g, ''),
  );

const remote = (query: string) =>
  `https://skill-icons.alanreisanjo.workers.dev/icons?${query.replaceAll('&', '&amp;')}`;

describe('Icon', () => {
  it('renders a placeholder until the bundled SVG loads', async () => {
    expect(await render(Icon, { name: 'svelte', size: 32 })).toBe(
      '<span aria-hidden="true" style="display:inline-block;width:32px;height:32px;"></span>',
    );
    await loadIcon('svelte');
    expect(await render(Icon, { name: 'svelte', size: 32 })).toMatch(
      /^<img alt="svelte" width="32" height="32" src="data:image\/svg\+xml;charset=utf-8,%3Csvg[^"]*">$/,
    );
  });

  it('loads from the deploy in latest mode', async () => {
    expect(await render(Icon, { latest: true, name: 'brand-new', theme: 'light' })).toBe(
      `<img alt="brand-new" width="48" height="48" src="${remote('i=brand-new&theme=light&perline=1')}">`,
    );
  });

  it('casts a bare `latest` attribute to true', async () => {
    // A template's `<Icon latest>` passes an empty string.
    expect(await render(Icon, { latest: '', name: 'x' })).toContain(
      'src="https://skill-icons.alanreisanjo.workers.dev',
    );
  });

  it('renders nothing for unknown names', async () => {
    expect(await render(Icon, { name: 'nope' })).toBe('<!---->');
  });

  it('passes attributes to the <img>, not the <picture>', async () => {
    expect(
      await render(Icon, { latest: true, name: 'x', theme: 'auto', class: 'c', alt: 'X' }),
    ).toBe(
      `<picture><source media="(prefers-color-scheme: light)" srcset="${remote('i=x&theme=light&perline=1')}">` +
        `<img alt="X" class="c" width="48" height="48" src="${remote('i=x&theme=dark&perline=1')}"></picture>`,
    );
  });

  it('switches to the light variant with the system in auto mode', async () => {
    await Promise.all([loadIcon('react-dark'), loadIcon('react-light')]);
    expect(await render(Icon, { name: 'react', theme: 'auto' })).toMatch(
      /^<picture><source media="[^"]+" srcset="data:[^"]+"><img alt="react" [^>]+><\/picture>$/,
    );
  });
});

describe('Icons', () => {
  it('composes bundled icons into one image', async () => {
    await Promise.all(['javascript', 'typescript'].map(loadIcon));
    const html = await render(Icons, { names: ['js', 'ts'], alt: 'Skills' });
    expect(html).toMatch(/^<img alt="Skills" width="104.25" src="data:/);
  });

  it('loads from the deploy in latest mode', async () => {
    expect(
      await render(Icons, { latest: true, names: ['js', 'brand-new'], perLine: 1, baseUrl: '/x' }),
    ).toBe(
      '<img alt="js, brand-new" width="48" src="/x/icons?i=js,brand-new&amp;theme=dark&amp;perline=1">',
    );
  });
});

describe('SkillIconsProvider', () => {
  const tree = (outer?: ThemeOption, inner?: ThemeOption, theme?: ThemeOption) =>
    defineComponent(
      () => () =>
        h(SkillIconsProvider, { theme: outer }, () =>
          h(SkillIconsProvider, { theme: inner }, () =>
            h(Icon, { latest: true, name: 'x', theme }),
          ),
        ),
    );

  it('sets the default theme', async () => {
    expect(await render(tree('light', undefined))).toContain('theme=light');
  });

  it('is overridden by the theme prop', async () => {
    expect(await render(tree('light', undefined, 'dark'))).toContain('theme=dark');
  });

  it('inherits from an outer provider when no theme is given', async () => {
    expect(await render(tree('auto', undefined))).toMatch(/^<picture>/);
  });

  it('lets an inner provider override the outer one', async () => {
    expect(await render(tree('auto', 'light'))).toMatch(/^<img [^>]*theme=light/);
  });
});
