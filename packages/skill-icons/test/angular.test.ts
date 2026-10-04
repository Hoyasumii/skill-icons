// @vitest-environment happy-dom
import '@angular/compiler';
import { ChangeDetectionStrategy, Component, signal, type Type } from '@angular/core';
import { getTestBed, TestBed, type ComponentFixture } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
// The compiled output (see angular.setup.ts), with its own copy of the core and its cache.
import {
  loadIcon,
  peekIcon,
  type ThemeOption,
} from '../node_modules/.cache/angular-test/core/index.js';
import {
  Icon,
  Icons,
  provideSkillIcons,
  SkillIconsProvider,
} from '../node_modules/.cache/angular-test/angular/index.js';

beforeAll(() => {
  getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting(), {
    teardown: { destroyAfterEach: true },
  });
});
afterEach(() => TestBed.resetTestingModule());

const remote = (query: string) => `https://skill-icons.alanreisanjo.workers.dev/icons?${query}`;

/** Renders a template using the components, with `ctx` signals available as `ctx.x()`. */
async function mount<T extends Record<string, unknown>>(
  template: string,
  ctx: T = {} as T,
  providers: unknown[] = [],
): Promise<{ el: HTMLElement; fixture: ComponentFixture<unknown>; ctx: T }> {
  // Called as a function: vitest's transform doesn't emit the decorator syntax Angular expects.
  class Host {
    ctx = ctx;
  }
  Component({
    template,
    imports: [Icon, Icons, SkillIconsProvider],
    changeDetection: ChangeDetectionStrategy.OnPush,
  })(Host);
  TestBed.configureTestingModule({
    providers: providers as never[],
  });
  const fixture = TestBed.createComponent(Host as Type<unknown>);
  await fixture.whenStable();
  return { el: fixture.nativeElement as HTMLElement, fixture, ctx };
}

const settle = async (fixture: ComponentFixture<unknown>, ms = 20) => {
  await new Promise(resolve => setTimeout(resolve, ms));
  await fixture.whenStable();
};

const img = (el: HTMLElement) => el.querySelector('img');

describe('Icon', () => {
  it('renders a placeholder, then the bundled SVG once loaded', async () => {
    expect(peekIcon('svelte')).toBeUndefined();
    const { el, fixture } = await mount('<skill-icon name="svelte" [size]="32" />');
    const span = el.querySelector('span');
    expect(span?.getAttribute('aria-hidden')).toBe('true');
    expect(span?.style.width).toBe('32px');
    expect(span?.style.height).toBe('32px');
    expect(img(el)).toBeNull();

    await settle(fixture);
    const image = img(el);
    expect(el.querySelector('span')).toBeNull();
    expect(image?.getAttribute('alt')).toBe('svelte');
    expect(image?.getAttribute('width')).toBe('32');
    expect(image?.getAttribute('height')).toBe('32');
    expect(image?.getAttribute('src')).toMatch(/^data:image\/svg\+xml;charset=utf-8,%3Csvg/);
  });

  it('renders cached icons on the first pass', async () => {
    await loadIcon('react-dark');
    const { el } = await mount('<skill-icon name="react" />');
    expect(img(el)?.getAttribute('src')).toMatch(/^data:/);
  });

  it('loads from the deploy in latest mode', async () => {
    const { el } = await mount('<skill-icon latest name="brand-new" theme="light" />');
    expect(img(el)?.getAttribute('src')).toBe(remote('i=brand-new&theme=light&perline=1'));
    expect(img(el)?.getAttribute('alt')).toBe('brand-new');
    expect(img(el)?.getAttribute('width')).toBe('48');
  });

  it('uses baseUrl in latest mode', async () => {
    const { el } = await mount('<skill-icon [latest]="true" name="x" baseUrl="/x/" />');
    expect(img(el)?.getAttribute('src')).toBe('/x/icons?i=x&theme=dark&perline=1');
  });

  it('renders nothing for unknown names', async () => {
    const { el } = await mount('<skill-icon name="nope" />');
    expect(el.querySelector('skill-icon')?.innerHTML.replace(/<!--.*?-->/g, '')).toBe('');
  });

  it('puts class, style and alt on the <img>', async () => {
    const { el } = await mount(
      `<skill-icon latest name="x" theme="auto" alt="X" imgClass="c" [imgStyle]="{ margin: '2px' }" />`,
    );
    expect(el.querySelector('picture source')?.getAttribute('media')).toBe(
      '(prefers-color-scheme: light)',
    );
    expect(el.querySelector('picture source')?.getAttribute('srcset')).toBe(
      remote('i=x&theme=light&perline=1'),
    );
    const image = img(el);
    expect(image?.getAttribute('src')).toBe(remote('i=x&theme=dark&perline=1'));
    expect(image?.getAttribute('alt')).toBe('X');
    expect(image?.className).toBe('c');
    expect(image?.style.margin).toBe('2px');
  });

  it('switches to the light variant with the system in auto mode', async () => {
    await Promise.all([loadIcon('react-dark'), loadIcon('react-light')]);
    const { el } = await mount('<skill-icon name="react" theme="auto" />');
    expect(el.querySelector('picture source')?.getAttribute('srcset')).toMatch(/^data:/);
    expect(img(el)?.getAttribute('alt')).toBe('react');
  });

  it('keeps the previous SVG while a new theme loads, and ignores stale loads', async () => {
    await loadIcon('bun-dark');
    expect(peekIcon('bun-light')).toBeUndefined();
    const theme = signal<ThemeOption>('dark');
    const { el, fixture } = await mount('<skill-icon name="bun" [theme]="ctx.theme()" />', {
      theme,
    });
    const dark = img(el)?.getAttribute('src');
    expect(dark).toMatch(/^data:/);

    theme.set('light');
    await fixture.whenStable();
    expect(img(el)?.getAttribute('src')).toBe(dark);
    expect(el.querySelector('span')).toBeNull();

    await settle(fixture);
    const light = img(el)?.getAttribute('src');
    expect(light).toMatch(/^data:/);
    expect(light).not.toBe(dark);
  });
});

describe('Icons', () => {
  it('composes bundled icons into one image', async () => {
    const { el, fixture } = await mount(`<skill-icons [names]="['js', 'ts']" alt="Skills" />`);
    expect(el.querySelector('span')?.getAttribute('aria-hidden')).toBe('true');
    await settle(fixture);
    expect(img(el)?.getAttribute('alt')).toBe('Skills');
    expect(img(el)?.getAttribute('width')).toBe('104.25');
    expect(img(el)?.getAttribute('src')).toMatch(/^data:/);
  });

  it('defaults alt to the names, dropping unknown ones', async () => {
    await Promise.all(['javascript', 'typescript'].map(loadIcon));
    const { el } = await mount(`<skill-icons [names]="['js', 'nope', 'ts']" />`);
    expect(img(el)?.getAttribute('alt')).toBe('js, ts');
  });

  it('loads from the deploy in latest mode', async () => {
    const { el } = await mount(
      `<skill-icons latest [names]="['js', 'brand-new']" [perLine]="1" baseUrl="/x" />`,
    );
    expect(img(el)?.getAttribute('src')).toBe('/x/icons?i=js,brand-new&theme=dark&perline=1');
    expect(img(el)?.getAttribute('alt')).toBe('js, brand-new');
    expect(img(el)?.getAttribute('width')).toBe('48');
  });

  it('renders nothing for empty or unknown lists', async () => {
    const { el } = await mount(`<skill-icons [names]="[]" /><skill-icons [names]="['nope']" />`);
    expect(el.querySelector('img, span, picture')).toBeNull();
  });
});

describe('SkillIconsProvider', () => {
  const src = (el: HTMLElement) => el.querySelector('img')?.getAttribute('src') ?? '';

  it('sets the default theme', async () => {
    const { el } = await mount(
      '<skill-icons-provider theme="light"><skill-icon latest name="x" /></skill-icons-provider>',
    );
    expect(src(el)).toContain('theme=light');
  });

  it('is overridden by the theme input', async () => {
    const { el } = await mount(
      '<skill-icons-provider theme="light"><skill-icon latest name="x" theme="dark" /></skill-icons-provider>',
    );
    expect(src(el)).toContain('theme=dark');
  });

  it('inherits from an outer provider when no theme is given', async () => {
    const { el } = await mount(
      `<skill-icons-provider theme="auto"><skill-icons-provider>
        <skill-icon latest name="x" /></skill-icons-provider></skill-icons-provider>`,
    );
    expect(el.querySelector('picture')).not.toBeNull();
  });

  it('lets an inner provider override the outer one', async () => {
    const { el } = await mount(
      `<skill-icons-provider theme="auto"><skill-icons-provider theme="light">
        <skill-icon latest name="x" /></skill-icons-provider></skill-icons-provider>`,
    );
    expect(el.querySelector('picture')).toBeNull();
    expect(src(el)).toContain('theme=light');
  });

  it('follows a changing theme', async () => {
    const theme = signal<ThemeOption>('light');
    const { el, fixture } = await mount(
      '<skill-icons-provider [theme]="ctx.theme()"><skill-icon latest name="x" /></skill-icons-provider>',
      { theme },
    );
    expect(src(el)).toContain('theme=light');
    theme.set('dark');
    await fixture.whenStable();
    expect(src(el)).toContain('theme=dark');
  });
});

describe('provideSkillIcons', () => {
  it('sets the default theme for the whole app', async () => {
    const { el } = await mount('<skill-icon latest name="x" />', {}, [
      provideSkillIcons({ theme: 'light' }),
    ]);
    expect(img(el)?.getAttribute('src')).toContain('theme=light');
  });

  it('accepts a signal and stays reactive', async () => {
    const theme = signal<ThemeOption>('light');
    const { el, fixture } = await mount('<skill-icon latest name="x" />', {}, [
      provideSkillIcons({ theme }),
    ]);
    theme.set('auto');
    await fixture.whenStable();
    expect(el.querySelector('picture')).not.toBeNull();
  });

  it('is overridden by a component provider', async () => {
    const { el } = await mount(
      '<skill-icons-provider theme="dark"><skill-icon latest name="x" /></skill-icons-provider>',
      {},
      [provideSkillIcons({ theme: 'light' })],
    );
    expect(img(el)?.getAttribute('src')).toContain('theme=dark');
  });
});
