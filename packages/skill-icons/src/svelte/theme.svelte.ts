import { getContext, setContext } from 'svelte';
import {
  DEFAULT_THEME,
  svgDataUri,
  themeVariants,
  type Theme,
  type ThemeOption,
} from '../core/index.js';

type ThemeGetter = () => ThemeOption | undefined;

const THEME_KEY = Symbol('skill-icons-theme');

/** Provides a getter, so consumers stay reactive when the provider's theme changes. */
export function provideTheme(theme: ThemeGetter): void {
  const parent = getContext<ThemeGetter | undefined>(THEME_KEY);
  setContext<ThemeGetter>(THEME_KEY, () => theme() ?? parent?.());
}

/** Themes to render: the explicit one, else the provider's, else the default. */
export function useThemes(theme: ThemeGetter): () => Theme[] {
  const inherited = getContext<ThemeGetter | undefined>(THEME_KEY);
  return () => themeVariants(theme() ?? inherited?.() ?? DEFAULT_THEME);
}

function complete(svgs: (string | undefined)[]): string[] | undefined {
  return svgs.length > 0 && svgs.every(svg => svg !== undefined) ? (svgs as string[]) : undefined;
}

/**
 * Loads one SVG per part and returns a getter for them as data URIs, or undefined while loading.
 * Reads the cache on every access, so already loaded icons render on the first pass, including
 * SSR, and keeps the previous SVGs while new ones load, so toggling the theme doesn't flash.
 */
export function useSources(
  id: () => string,
  parts: () => string[],
  peek: (part: string) => string | undefined,
  load: (part: string) => Promise<string | undefined>,
): () => string[] | undefined {
  let loaded = $state.raw<string[] | undefined>(undefined);

  $effect(() => {
    const current = id();
    const list = parts();
    if (!current || complete(list.map(peek))) return;
    Promise.all(list.map(load)).then(svgs => {
      if (id() === current) loaded = complete(svgs);
    });
  });

  return () => {
    const cached = complete(parts().map(peek));
    return (cached ?? loaded)?.map(svgDataUri);
  };
}
