// @vitest-environment happy-dom
// Client-side behavior: loading after mount and reacting to prop and provider changes.
import { createSignal } from 'solid-js';
import { render } from 'solid-js/web';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadIcon, peekIcon, type IconName, type ThemeOption } from '../src/core/index.js';
import { Icon, Icons, SkillIconsProvider } from '../src/solid/index.js';

const disposers: (() => void)[] = [];
function mount(code: () => any) {
  const el = document.createElement('div');
  document.body.append(el);
  disposers.push(render(code, el), () => el.remove());
  return el;
}
afterEach(() => {
  for (const dispose of disposers.splice(0)) dispose();
});

const settle = () => new Promise(resolve => setTimeout(resolve, 20));
const srcOf = (el: HTMLElement) => el.querySelector('img')?.getAttribute('src') ?? '';
const altOf = (el: HTMLElement) => el.querySelector('img')?.getAttribute('alt');

describe('Solid', () => {
  it('shows a placeholder, then the loaded icon', async () => {
    expect(peekIcon('jest')).toBeUndefined();
    const el = mount(() => <Icon name="jest" size={24} class="a" />);
    const span = el.querySelector('span[aria-hidden]');
    expect(span?.getAttribute('class')).toContain('a');
    expect(span?.getAttribute('style')).toContain('width: 24px');
    await settle();
    expect(el.querySelector('span')).toBeNull();
    expect(altOf(el)).toBe('jest');
    expect(srcOf(el)).toMatch(/^data:image\/svg\+xml/);
    expect(el.querySelector('img')?.getAttribute('class')).toContain('a');
  });

  it('renders cached icons on the first pass', async () => {
    await loadIcon('react-dark');
    const el = mount(() => <Icon name="react" />);
    expect(el.querySelector('img')).not.toBeNull();
  });

  it('follows name changes and keeps the previous icon while loading', async () => {
    await loadIcon('react-dark');
    const [name, setName] = createSignal<IconName>('react');
    const el = mount(() => <Icon name={name()} />);
    const before = srcOf(el);
    expect(peekIcon('bun')).toBeUndefined();
    setName('bun');
    expect(srcOf(el)).toBe(before);
    await settle();
    expect(srcOf(el)).not.toBe(before);
    expect(srcOf(el)).toMatch(/^data:/);
  });

  it('drops stale loads', async () => {
    const [name, setName] = createSignal<IconName>('graphql');
    const el = mount(() => <Icon name={name()} />);
    setName('astro');
    await settle();
    const astro = srcOf(el);
    await loadIcon('graphql-dark');
    await settle();
    expect(srcOf(el)).toBe(astro);
  });

  it('reacts to theme and renders a <picture> in auto mode', async () => {
    await Promise.all([loadIcon('react-dark'), loadIcon('react-light')]);
    const [theme, setTheme] = createSignal<ThemeOption>('dark');
    const el = mount(() => <Icon name="react" theme={theme()} />);
    const dark = srcOf(el);
    expect(el.querySelector('picture')).toBeNull();
    setTheme('light');
    expect(srcOf(el)).not.toBe(dark);
    setTheme('auto');
    const source = el.querySelector('picture > source');
    expect(source?.getAttribute('media')).toBe('(prefers-color-scheme: light)');
    expect(source?.getAttribute('srcset')).not.toBe(srcOf(el));
  });

  it('inherits provider themes reactively; own theme wins', () => {
    const [theme, setTheme] = createSignal<ThemeOption>('light');
    const el = mount(() => (
      <SkillIconsProvider theme={theme()}>
        <SkillIconsProvider>
          <Icon latest name="inherit" />
        </SkillIconsProvider>
        <Icon latest name="own" theme="dark" />
      </SkillIconsProvider>
    ));
    const imgs = () => Array.from(el.querySelectorAll('img')).map(i => i.getAttribute('src'));
    expect(imgs()[0]).toContain('theme=light');
    expect(imgs()[1]).toContain('theme=dark');
    setTheme('dark');
    expect(imgs()[0]).toContain('theme=dark');
  });

  it('builds latest URLs and updates them', () => {
    const [name, setName] = createSignal('a');
    const el = mount(() => <Icon latest name={name()} baseUrl="https://example.com" size={20} />);
    expect(srcOf(el)).toBe('https://example.com/icons?i=a&theme=dark&perline=1');
    expect(el.querySelector('img')?.getAttribute('width')).toBe('20');
    setName('b');
    expect(srcOf(el)).toContain('i=b');
  });

  it('renders nothing for unknown names and empty lists', async () => {
    const el = mount(() => (
      <>
        {/* @ts-expect-error: unknown names are rejected outside latest mode */}
        <Icon name="nope" />
        <Icons names={[]} />
      </>
    ));
    await settle();
    expect(el.querySelector('img, span')).toBeNull();
  });

  it('composes several icons', async () => {
    const [names, setNames] = createSignal<IconName[]>(['js']);
    const el = mount(() => <Icons names={names()} alt="Skills" />);
    await settle();
    expect(altOf(el)).toBe('Skills');
    const one = srcOf(el);
    setNames(['js', 'ts']);
    await vi.waitFor(() => expect(srcOf(el)).not.toBe(one));
  });
});
