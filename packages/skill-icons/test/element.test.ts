// @vitest-environment happy-dom
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { loadIcon } from '../src/core/index.js';
import {
  defineSkillIcons,
  SkillIconElement,
  SkillIconsElement,
  SkillIconsProviderElement,
} from '../src/element/index.js';

beforeAll(() => defineSkillIcons());
afterEach(() => {
  document.body.innerHTML = '';
});

const mount = (html: string) => {
  document.body.innerHTML = html;
  return document.body.firstElementChild as HTMLElement;
};
const tick = () => new Promise(resolve => setTimeout(resolve, 0));
const remote = (query: string) => `https://skillicons.dev/icons?${query}`;

describe('<skill-icon>', () => {
  it('is registered and reflects attributes to properties', () => {
    const el = mount(
      '<skill-icon name="react" theme="light" size="32" latest base-url="https://x.dev" alt="R" img-class="c"></skill-icon>',
    ) as SkillIconElement;
    expect(el).toBeInstanceOf(SkillIconElement);
    expect(el.name).toBe('react');
    expect(el.theme).toBe('light');
    expect(el.size).toBe(32);
    expect(el.latest).toBe(true);
    expect(el.baseUrl).toBe('https://x.dev');
    expect(el.alt).toBe('R');
    expect(el.imgClass).toBe('c');
  });

  it('renders a sized placeholder, then the SVG when it loads', async () => {
    const el = mount('<skill-icon name="vue" size="32"></skill-icon>');
    expect(el.innerHTML).toBe(
      '<span aria-hidden="true" style="display: inline-block; width: 32px; height: 32px;"></span>',
    );
    await loadIcon('vuejs-dark');
    await tick();
    const img = el.querySelector('img')!;
    expect(img.alt).toBe('vue');
    expect(img.getAttribute('width')).toBe('32');
    expect(img.getAttribute('height')).toBe('32');
    expect(img.src).toMatch(/^data:image\/svg\+xml;charset=utf-8,%3Csvg/);
    expect(el.querySelector('span')).toBeNull();
  });

  it('renders cached icons synchronously on connect', async () => {
    await loadIcon('react-dark');
    const el = mount('<skill-icon name="react"></skill-icon>');
    expect(el.querySelector('img')).not.toBeNull();
  });

  it('re-renders when attributes or properties change', async () => {
    await Promise.all([loadIcon('react-dark'), loadIcon('react-light')]);
    const el = mount('<skill-icon name="react"></skill-icon>') as SkillIconElement;
    const dark = el.querySelector('img')!.src;
    el.setAttribute('size', '20');
    expect(el.querySelector('img')!.getAttribute('width')).toBe('20');
    el.theme = 'light';
    expect(el.querySelector('img')!.src).not.toBe(dark);
    el.alt = 'Hi';
    el.imgClass = 'round';
    const img = el.querySelector('img')!;
    expect(img.alt).toBe('Hi');
    expect(img.className).toBe('round');
  });

  it('keeps the previous SVG while a new one loads, and drops stale loads', async () => {
    await loadIcon('react-dark');
    const el = mount('<skill-icon name="react"></skill-icon>') as SkillIconElement;
    const before = el.querySelector('img')!.src;
    el.name = 'typescript';
    expect(el.querySelector('img')!.src).toBe(before);
    el.name = 'angular';
    el.name = 'react';
    await loadIcon('typescript-dark');
    await loadIcon('angular-dark');
    await tick();
    expect(el.querySelector('img')!.src).toBe(before);
    expect(el.name).toBe('react');
  });

  it('uses <picture> with a light source in auto mode, only for themed icons', async () => {
    await Promise.all(['react-dark', 'react-light', 'adonis'].map(loadIcon));
    const el = mount('<skill-icon name="react" theme="auto"></skill-icon>');
    const source = el.querySelector('picture > source')!;
    expect(source.getAttribute('media')).toBe('(prefers-color-scheme: light)');
    expect(source.getAttribute('srcset')).not.toBe(el.querySelector('img')!.src);
    const plain = mount('<skill-icon name="adonis" theme="auto"></skill-icon>');
    expect(plain.querySelector('picture')).toBeNull();
    expect(plain.querySelector('img')).not.toBeNull();
  });

  it('uses the deployed API in latest mode', () => {
    const el = mount('<skill-icon latest name="brand-new" theme="light"></skill-icon>');
    const img = el.querySelector('img')!;
    expect(img.src).toBe(remote('i=brand-new&theme=light&perline=1'));
    expect(img.alt).toBe('brand-new');
    const auto = mount(
      '<skill-icon latest name="x" theme="auto" base-url="https://my.dev/"></skill-icon>',
    );
    expect(auto.querySelector('source')!.getAttribute('srcset')).toBe(
      'https://my.dev/icons?i=x&theme=light&perline=1',
    );
    expect(auto.querySelector('img')!.src).toBe('https://my.dev/icons?i=x&theme=dark&perline=1');
  });

  it('renders nothing for unknown or empty names', () => {
    expect(mount('<skill-icon name="nope"></skill-icon>').innerHTML).toBe('');
    expect(mount('<skill-icon></skill-icon>').innerHTML).toBe('');
    expect(mount('<skill-icon latest></skill-icon>').innerHTML).toBe('');
  });
});

describe('<skill-icons>', () => {
  it('parses names and reflects properties', () => {
    const el = mount(
      '<skill-icons names="js, ts,,react" per-line="2" size="24"></skill-icons>',
    ) as SkillIconsElement;
    expect(el.names).toEqual(['js', 'ts', 'react']);
    expect(el.perLine).toBe(2);
    expect(el.size).toBe(24);
    el.names = ['vue', 'go'];
    expect(el.getAttribute('names')).toBe('vue,go');
  });

  it('composes bundled icons into one sized image', async () => {
    const el = mount(
      '<skill-icons names="js,ts,nope" per-line="2"></skill-icons>',
    ) as SkillIconsElement;
    expect(el.querySelector('span')).not.toBeNull();
    await Promise.all(['javascript', 'typescript'].map(loadIcon));
    await tick();
    const img = el.querySelector('img')!;
    expect(img.alt).toBe('js, ts');
    expect(img.getAttribute('width')).toBe('104.25');
    expect(img.hasAttribute('height')).toBe(false);
    expect(decodeURIComponent(img.src)).toContain('viewBox="0 0 556 256"');
    el.perLine = 1;
    expect(el.querySelector('img')).not.toBeNull();
  });

  it('uses the deployed API in latest mode', () => {
    const el = mount(
      '<skill-icons latest names="js,brand-new" per-line="3" theme="light"></skill-icons>',
    );
    expect(el.querySelector('img')!.src).toBe(remote('i=js,brand-new&theme=light&perline=3'));
  });

  it('renders nothing when no name is known', () => {
    expect(mount('<skill-icons names="nope"></skill-icons>').innerHTML).toBe('');
    expect(mount('<skill-icons></skill-icons>').innerHTML).toBe('');
  });
});

describe('<skill-icons-provider>', () => {
  const themeOf = (el: Element) => el.querySelector('img')!.src;

  it('is registered and inherited by descendants', async () => {
    await Promise.all(['react-dark', 'react-light'].map(loadIcon));
    const el = mount(
      `<skill-icons-provider theme="light"><div><skill-icon name="react"></skill-icon></div></skill-icons-provider>`,
    );
    expect(el).toBeInstanceOf(SkillIconsProviderElement);
    const icon = el.querySelector('skill-icon') as SkillIconElement;
    expect(icon.effectiveTheme).toBe('light');
    const lone = mount('<skill-icon name="react" theme="light"></skill-icon>');
    expect(themeOf(icon)).toBe(themeOf(lone));
  });

  it('lets the icon theme win and nested providers inherit outward', async () => {
    await Promise.all(['react-dark', 'react-light'].map(loadIcon));
    const el = mount(`<skill-icons-provider theme="light">
      <skill-icons-provider><skill-icon id="a" name="react"></skill-icon></skill-icons-provider>
      <skill-icons-provider theme="dark"><skill-icon id="b" name="react"></skill-icon></skill-icons-provider>
      <skill-icon id="c" name="react" theme="dark"></skill-icon>
    </skill-icons-provider>`);
    const t = (id: string) => (el.querySelector(`#${id}`) as SkillIconElement).effectiveTheme;
    expect([t('a'), t('b'), t('c')]).toEqual(['light', 'dark', 'dark']);
  });

  it('updates descendants when its theme changes', async () => {
    await Promise.all(['react-dark', 'react-light'].map(loadIcon));
    const el = mount(
      `<skill-icons-provider theme="dark"><skill-icon name="react"></skill-icon><skill-icons names="react"></skill-icons></skill-icons-provider>`,
    ) as SkillIconsProviderElement;
    const before = Array.from(el.querySelectorAll('img')).map(i => i.src);
    el.theme = 'light';
    const after = Array.from(el.querySelectorAll('img')).map(i => i.src);
    expect(after[0]).not.toBe(before[0]);
    expect(after[1]).not.toBe(before[1]);
    el.theme = 'auto';
    expect(el.querySelectorAll('picture').length).toBe(2);
  });

  it('falls back to dark without a provider theme', () => {
    const el = mount(
      '<skill-icons-provider><skill-icon latest name="x"></skill-icon></skill-icons-provider>',
    );
    expect(el.querySelector('img')!.src).toBe(remote('i=x&theme=dark&perline=1'));
  });
});

describe('registration', () => {
  it('is idempotent', () => {
    expect(() => {
      defineSkillIcons();
      defineSkillIcons();
    }).not.toThrow();
    expect(customElements.get('skill-icon')).toBe(SkillIconElement);
  });

  it('tolerates a tag that is already taken', async () => {
    const { defineSkillIcons: define } = await import('../src/element/index.js');
    expect(() => define()).not.toThrow();
  });
});
