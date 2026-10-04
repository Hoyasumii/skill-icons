// Framework-agnostic core shared by every component entry point.
import {
  API_URL,
  DEFAULT_PER_LINE,
  DEFAULT_THEME,
  iconNames,
  MAX_PER_LINE,
  MIN_PER_LINE,
  SITE_URL,
  shortNames,
  themedIconNames,
} from '../generated/catalog.js';
import { loaders } from '../generated/loaders.js';

export { API_URL, DEFAULT_PER_LINE, DEFAULT_THEME, iconNames, MAX_PER_LINE, MIN_PER_LINE, SITE_URL };

export type Theme = 'dark' | 'light';

/** A theme, or 'auto' to follow the system's color scheme. */
export type ThemeOption = Theme | 'auto';

/** Media query that selects the light variant in 'auto' mode. */
export const LIGHT_MEDIA = '(prefers-color-scheme: light)';

/** Themes to render: both for 'auto', dark first as the fallback. */
export function themeVariants(theme: ThemeOption = DEFAULT_THEME): Theme[] {
  return theme === 'auto' ? ['dark', 'light'] : [theme];
}

/** Every icon name and alias bundled with this version of the package. */
export type IconName = (typeof iconNames)[number] | keyof typeof shortNames;

/** Size of one icon, in pixels, when no size is given. Matches the API output. */
export const DEFAULT_SIZE = 48;

const ICON_BOX = 256;
const CELL = 300;
const GAP = CELL - ICON_BOX;

const names: ReadonlySet<string> = new Set(iconNames);
const aliases: Record<string, string> = shortNames;

/** Resolves a name or alias (e.g. "js") to its canonical icon name. */
export function resolveIconName(name: string): string | undefined {
  const lower = name.trim().toLowerCase();
  return names.has(lower) ? lower : aliases[lower];
}

export function isIconName(name: string): name is IconName {
  return resolveIconName(name) !== undefined;
}

/** The SVG key for a name and theme, e.g. "react-dark", or undefined if unknown. */
export function iconKey(name: string, theme: Theme = DEFAULT_THEME): string | undefined {
  const resolved = resolveIconName(name);
  if (!resolved) return undefined;
  return themedIconNames.has(resolved) ? `${resolved}-${theme}` : resolved;
}

const cache = new Map<string, string>();
const pending = new Map<string, Promise<string>>();

/** Returns an already loaded SVG synchronously, so components can skip a loading state. */
export function peekIcon(key: string): string | undefined {
  return cache.get(key);
}

/** Loads one bundled SVG. Each icon is a separate chunk, fetched only when used. */
export function loadIcon(key: string): Promise<string | undefined> {
  const cached = cache.get(key);
  if (cached !== undefined) return Promise.resolve(cached);
  const loader = loaders[key];
  if (!loader) return Promise.resolve(undefined);
  let promise = pending.get(key);
  if (!promise) {
    promise = loader().then(mod => {
      cache.set(key, mod.default);
      pending.delete(key);
      return mod.default;
    });
    pending.set(key, promise);
  }
  return promise;
}

export function clampPerLine(perLine: number = DEFAULT_PER_LINE): number {
  if (!Number.isFinite(perLine)) return DEFAULT_PER_LINE;
  return Math.min(MAX_PER_LINE, Math.max(MIN_PER_LINE, Math.round(perLine)));
}

/** Rendered size of a grid of icons, matching the /icons API layout. */
export function iconsSize(
  count: number,
  perLine: number = DEFAULT_PER_LINE,
  size: number = DEFAULT_SIZE,
): { width: number; height: number } {
  const columns = Math.min(clampPerLine(perLine), count);
  const rows = Math.ceil(count / clampPerLine(perLine));
  return {
    width: ((columns * CELL - GAP) * size) / ICON_BOX,
    height: ((rows * CELL - GAP) * size) / ICON_BOX,
  };
}

/** Lays out SVGs in a grid, the same way the /icons API does. */
export function composeIcons(svgs: string[], perLine: number = DEFAULT_PER_LINE): string {
  const columns = clampPerLine(perLine);
  const width = Math.min(columns, svgs.length) * CELL - GAP;
  const height = Math.ceil(svgs.length / columns) * CELL - GAP;
  const cells = svgs
    .map(
      (svg, index) =>
        `<g transform="translate(${(index % columns) * CELL}, ${Math.floor(index / columns) * CELL})">${svg}</g>`,
    )
    .join('');
  return `<svg width="${(width * DEFAULT_SIZE) / ICON_BOX}" height="${(height * DEFAULT_SIZE) / ICON_BOX}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">${cells}</svg>`;
}

/** Loads and composes several bundled icons, dropping unknown names like the API does. */
export async function loadIcons(
  iconList: readonly string[],
  theme: Theme = DEFAULT_THEME,
  perLine: number = DEFAULT_PER_LINE,
): Promise<string | undefined> {
  const keys = iconList.flatMap(name => iconKey(name, theme) ?? []);
  const svgs = (await Promise.all(keys.map(loadIcon))).filter(svg => svg !== undefined);
  return svgs.length > 0 ? composeIcons(svgs, perLine) : undefined;
}

/** Same as loadIcons, but synchronous and only when every icon is already loaded. */
export function peekIcons(
  iconList: readonly string[],
  theme: Theme = DEFAULT_THEME,
  perLine: number = DEFAULT_PER_LINE,
): string | undefined {
  const keys = iconList.flatMap(name => iconKey(name, theme) ?? []);
  const svgs = keys.map(peekIcon);
  if (svgs.length === 0 || svgs.some(svg => svg === undefined)) return undefined;
  return composeIcons(svgs as string[], perLine);
}

/** Lets an SVG string be used as an <img> src, which also isolates its ids and scripts. */
export function svgDataUri(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export interface RemoteIconsOptions {
  icons: readonly string[];
  theme?: Theme;
  perLine?: number;
  baseUrl?: string;
}

/** URL of the deployed /icons API, used by components in `latest` mode. */
export function remoteIconsUrl({
  icons,
  theme = DEFAULT_THEME,
  perLine = DEFAULT_PER_LINE,
  baseUrl = API_URL,
}: RemoteIconsOptions): string {
  const list = icons.map(name => encodeURIComponent(name.trim().toLowerCase())).join(',');
  return `${baseUrl.replace(/\/+$/, '')}/icons?i=${list}&theme=${theme}&perline=${clampPerLine(perLine)}`;
}

export {
  renderIcon,
  renderIcons,
  type HtmlAttrs,
  type RenderIconOptions,
  type RenderIconsOptions,
} from './html.js';
