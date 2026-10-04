// @vitest-environment happy-dom
// Client-side Svelte behavior: loading after mount and reacting to prop changes.
import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { peekIcon, type IconName, type ThemeOption } from '../src/core/index.js';
import { Icon, Icons } from '../src/svelte/index.js';
import Tree from './svelte-fixtures/Tree.svelte';
import { reactiveProps } from './svelte-state.svelte.js';

const targets: HTMLElement[] = [];
function container() {
  const el = document.createElement('div');
  document.body.append(el);
  targets.push(el);
  return el;
}
afterEach(() => {
  for (const el of targets.splice(0)) el.remove();
});

const altOf = (el: HTMLElement) => el.querySelector('img')?.getAttribute('alt');
const srcOf = (el: HTMLElement) => el.querySelector('img')?.getAttribute('src') ?? '';

describe('Svelte', () => {
  it('loads the icon after mount, then follows name changes', async () => {
    const el = container();
    const props = reactiveProps<{ name: IconName }>({ name: 'haskell' });
    expect(peekIcon('haskell-dark')).toBeUndefined();

    const app = mount(Icon, { target: el, props });
    flushSync();
    expect(el.querySelector('span[aria-hidden]')).not.toBeNull();

    await vi.waitFor(() => expect(altOf(el)).toBe('haskell'));
    const haskell = srcOf(el);

    props.name = 'elixir';
    flushSync();
    // The previous image stays up until the new one loads.
    await vi.waitFor(() => expect(srcOf(el)).not.toBe(haskell));
    expect(altOf(el)).toBe('elixir');
    unmount(app);
  });

  it('reloads the composed image when the theme changes', async () => {
    const el = container();
    const props = reactiveProps<{ names: IconName[]; theme: ThemeOption }>({
      names: ['scala', 'clojure'],
      theme: 'dark',
    });
    const app = mount(Icons, { target: el, props });
    flushSync();
    await vi.waitFor(() => expect(srcOf(el)).toMatch(/^data:/));
    const dark = srcOf(el);

    props.theme = 'light';
    flushSync();
    // The dark image stays up while the light variant loads, instead of a placeholder.
    expect(srcOf(el)).toBe(dark);
    await vi.waitFor(() => expect(srcOf(el)).not.toBe(dark));
    expect(srcOf(el)).toMatch(/^data:/);
    unmount(app);
  });

  it('ignores a stale load that finishes after a newer one', async () => {
    const el = container();
    const props = reactiveProps<{ name: IconName }>({ name: 'perl' });
    const app = mount(Icon, { target: el, props });
    flushSync();
    props.name = 'ruby';
    flushSync();
    await vi.waitFor(() => expect(altOf(el)).toBe('ruby'));
    await new Promise(resolve => setTimeout(resolve, 20));
    expect(altOf(el)).toBe('ruby');
    unmount(app);
  });

  it('follows the provider theme reactively', () => {
    const el = container();
    const props = reactiveProps<{ outer: ThemeOption }>({ outer: 'light' });
    const app = mount(Tree, { target: el, props });
    flushSync();
    expect(srcOf(el)).toContain('theme=light');

    props.outer = 'dark';
    flushSync();
    expect(srcOf(el)).toContain('theme=dark');
    unmount(app);
  });
});
