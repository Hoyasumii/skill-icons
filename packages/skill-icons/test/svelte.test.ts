import { render } from 'svelte/server';
import type { Component } from 'svelte';
import { describe, expect, it } from 'vitest';
import { loadIcon, type ThemeOption } from '../src/core/index.js';
import { Icon, Icons } from '../src/svelte/index.js';
import Tree from './svelte-fixtures/Tree.svelte';

// biome-ignore lint/suspicious/noExplicitAny: tests pass loosely typed props.
const html = (component: Component<any>, props: Record<string, unknown> = {}) =>
  render(component, { props })
    .body.replace(/<!--[^>]*-->/g, '')
    // Svelte's event replay attributes and self-closing slashes aren't part of the contract.
    .replace(/ onload="this.__e=event" onerror="this.__e=event"/g, '')
    .replace(/\s*\/>/g, '>')
    .replace(/> </g, '><');

const remote = (query: string) => `https://skillicons.dev/icons?${query.replaceAll('&', '&amp;')}`;

describe('Icon', () => {
  it('renders a placeholder until the bundled SVG loads', async () => {
    expect(html(Icon, { name: 'svelte', size: 32 })).toBe(
      '<span aria-hidden="true" style="display:inline-block;width:32px;height:32px;"></span>',
    );
    await loadIcon('svelte');
    expect(html(Icon, { name: 'svelte', size: 32 })).toMatch(
      /^<img alt="svelte" width="32" height="32" src="data:image\/svg\+xml;charset=utf-8,%3Csvg[^"]*">$/,
    );
  });

  it('keeps class and style on the placeholder', () => {
    expect(html(Icon, { name: 'lua', class: 'c', style: 'margin:1px' })).toBe(
      '<span aria-hidden="true" class="c" style="display:inline-block;width:48px;height:48px;margin:1px"></span>',
    );
  });

  it('loads from the deploy in latest mode', () => {
    expect(html(Icon, { latest: true, name: 'brand-new', theme: 'light' })).toBe(
      `<img alt="brand-new" width="48" height="48" src="${remote('i=brand-new&theme=light&perline=1')}">`,
    );
  });

  it('renders nothing for unknown names', () => {
    expect(html(Icon, { name: 'nope' })).toBe('');
  });

  it('passes attributes to the <img>, not the <picture>', () => {
    const out = html(Icon, { latest: true, name: 'x', theme: 'auto', class: 'c', alt: 'X' });
    expect(out).toContain(
      `<picture><source media="(prefers-color-scheme: light)" srcset="${remote('i=x&theme=light&perline=1')}"`,
    );
    expect(out).toContain('alt="X"');
    expect(out).toContain('class="c"');
    expect(out).toContain(`src="${remote('i=x&theme=dark&perline=1')}"`);
    expect(out).toMatch(/<\/picture>$/);
  });

  it('switches to the light variant with the system in auto mode', async () => {
    await Promise.all([loadIcon('react-dark'), loadIcon('react-light')]);
    expect(html(Icon, { name: 'react', theme: 'auto' })).toMatch(
      /^<picture><source media="[^"]+" srcset="data:[^"]+"><img [^>]*alt="react"[^>]*><\/picture>$/,
    );
  });
});

describe('Icons', () => {
  it('composes bundled icons into one image', async () => {
    await Promise.all(['javascript', 'typescript'].map(loadIcon));
    const out = html(Icons, { names: ['js', 'ts'], alt: 'Skills' });
    expect(out).toMatch(/^<img alt="Skills" width="104.25" src="data:/);
  });

  it('loads from the deploy in latest mode', () => {
    expect(
      html(Icons, { latest: true, names: ['js', 'brand-new'], perLine: 1, baseUrl: '/x' }),
    ).toMatch(
      /^<img alt="js, brand-new" width="48" src="\/x\/icons\?i=js,brand-new&amp;theme=dark&amp;perline=1">$/,
    );
  });

  it('renders nothing for empty or unknown lists', () => {
    expect(html(Icons, { names: [] })).toBe('');
    expect(html(Icons, { names: ['nope'] })).toBe('');
  });
});

describe('SkillIconsProvider', () => {
  const tree = (outer?: ThemeOption, inner?: ThemeOption, theme?: ThemeOption) =>
    html(Tree, { outer, inner, theme });

  it('sets the default theme', () => {
    expect(tree('light')).toContain('theme=light');
  });

  it('is overridden by the theme prop', () => {
    expect(tree('light', undefined, 'dark')).toContain('theme=dark');
  });

  it('inherits from an outer provider when no theme is given', () => {
    expect(tree('auto')).toMatch(/^<picture>/);
  });

  it('lets an inner provider override the outer one', () => {
    expect(tree('auto', 'light')).toMatch(/^<img [^>]*theme=light/);
  });
});
