// @vitest-environment happy-dom
// Client-side behavior: loading after mount and reacting to prop changes.
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { createApp, nextTick, reactive, h as vh } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { peekIcon, type IconName, type ThemeOption } from '../src/core/index.js';
import { Icon as ReactIcon, Icons as ReactIcons } from '../src/react/index.js';
import { Icon as VueIcon, Icons as VueIcons } from '../src/vue/index.js';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const containers: HTMLElement[] = [];
function container() {
  const el = document.createElement('div');
  document.body.append(el);
  containers.push(el);
  return el;
}
afterEach(() => {
  for (const el of containers.splice(0)) el.remove();
});

const altOf = (el: HTMLElement) => el.querySelector('img')?.getAttribute('alt');
const srcOf = (el: HTMLElement) => el.querySelector('img')?.getAttribute('src') ?? '';

describe('React', () => {
  it('loads the icon after mount, then follows name changes', async () => {
    const el = container();
    const root = createRoot(el);
    expect(peekIcon('rust')).toBeUndefined();

    await act(async () => root.render(<ReactIcon name="rust" />));
    expect(el.querySelector('span[aria-hidden]')).not.toBeNull();

    await vi.waitFor(() => expect(altOf(el)).toBe('rust'));
    const rust = srcOf(el);
    expect(rust).toMatch(/^data:image\/svg\+xml/);

    await act(async () => root.render(<ReactIcon name="go" />));
    // The previous image stays up until the new one loads.
    await vi.waitFor(() => expect(srcOf(el)).not.toBe(rust));
    expect(altOf(el)).toBe('go');
    await act(async () => root.unmount());
  });

  it('reloads the composed image when the theme changes', async () => {
    const el = container();
    const root = createRoot(el);
    await act(async () => root.render(<ReactIcons names={['kotlin', 'swift']} theme="dark" />));
    await vi.waitFor(() => expect(srcOf(el)).toMatch(/^data:/));
    const dark = srcOf(el);

    await act(async () => root.render(<ReactIcons names={['kotlin', 'swift']} theme="light" />));
    // The dark image stays up while the light variant loads, instead of a placeholder.
    expect(srcOf(el)).toBe(dark);
    await vi.waitFor(() => expect(srcOf(el)).not.toBe(dark));
    expect(srcOf(el)).toMatch(/^data:/);
    await act(async () => root.unmount());
  });
});

describe('Vue', () => {
  it('loads the icon after mount, then follows name changes', async () => {
    const el = container();
    const props = reactive<{ name: IconName }>({ name: 'haskell' });
    expect(peekIcon('haskell-dark')).toBeUndefined();

    const app = createApp({ render: () => vh(VueIcon, props) });
    app.mount(el);
    expect(el.querySelector('span[aria-hidden]')).not.toBeNull();

    await vi.waitFor(() => expect(altOf(el)).toBe('haskell'));
    const haskell = srcOf(el);

    props.name = 'elixir';
    // The previous image stays up until the new one loads.
    await vi.waitFor(() => expect(srcOf(el)).not.toBe(haskell));
    expect(altOf(el)).toBe('elixir');
    app.unmount();
  });

  it('reloads the composed image when the theme changes', async () => {
    const el = container();
    const props = reactive<{ names: IconName[]; theme: ThemeOption }>({
      names: ['scala', 'clojure'],
      theme: 'dark',
    });
    const app = createApp({ render: () => vh(VueIcons, props) });
    app.mount(el);
    await vi.waitFor(() => expect(srcOf(el)).toMatch(/^data:/));
    const dark = srcOf(el);

    props.theme = 'light';
    await nextTick();
    // The dark image stays up while the light variant loads, instead of a placeholder.
    expect(srcOf(el)).toBe(dark);
    await vi.waitFor(() => expect(srcOf(el)).not.toBe(dark));
    expect(srcOf(el)).toMatch(/^data:/);
    app.unmount();
  });
});
