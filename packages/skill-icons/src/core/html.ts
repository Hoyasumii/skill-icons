// HTML string rendering for SSR without a framework, emails and static site generators.
import {
  DEFAULT_PER_LINE,
  DEFAULT_SIZE,
  DEFAULT_THEME,
  iconKey,
  iconsSize,
  LIGHT_MEDIA,
  loadIcon,
  loadIcons,
  remoteIconsUrl,
  svgDataUri,
  themeVariants,
  type IconName,
  type Theme,
  type ThemeOption,
} from './index.js';

/** Extra attributes for the <img>. `true` renders a bare attribute, `false`/null/undefined skip it. */
export type HtmlAttrs = Readonly<Record<string, string | number | boolean | null | undefined>>;

interface CommonHtmlOptions {
  /** 'dark', 'light' or 'auto' to emit a <picture> following the system. Defaults to 'dark'. */
  theme?: ThemeOption;
  /** Size of one icon in pixels. Defaults to 48. */
  size?: number;
  /** Extra <img> attributes (class, style, loading, ...). Values are escaped, invalid names skipped. */
  attrs?: HtmlAttrs;
}

interface LocalHtmlMode {
  latest?: false;
  baseUrl?: never;
}

interface LatestHtmlMode {
  latest: true;
  /** Deployment to reference icons from. Defaults to https://skillicons.dev. */
  baseUrl?: string;
}

export type RenderIconOptions = CommonHtmlOptions & (LocalHtmlMode | LatestHtmlMode);

export type RenderIconsOptions = CommonHtmlOptions & {
  /** Icons per line, between 1 and 50. Defaults to 15. */
  perLine?: number;
} & (LocalHtmlMode | LatestHtmlMode);

const ATTR_NAME = /^[A-Za-z_:][A-Za-z0-9_:.-]*$/;
const RESERVED = new Set(['src', 'srcset', 'width', 'height']);

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderAttrs(attrs: HtmlAttrs | undefined): string {
  if (!attrs) return '';
  let out = '';
  for (const [key, value] of Object.entries(attrs)) {
    if (value === undefined || value === null || value === false) continue;
    if (!ATTR_NAME.test(key) || RESERVED.has(key.toLowerCase())) continue;
    out += value === true ? ` ${key}` : ` ${key}="${escapeAttr(String(value))}"`;
  }
  return out;
}

function renderImg(
  sources: string[],
  alt: string,
  width: number,
  height: number | undefined,
  attrs: HtmlAttrs | undefined,
): string {
  const [src, lightSrc] = sources;
  const hasAlt = attrs && Object.keys(attrs).some(key => key.toLowerCase() === 'alt');
  const altAttr = hasAlt ? '' : ` alt="${escapeAttr(alt)}"`;
  const heightAttr = height === undefined ? '' : ` height="${height}"`;
  const img = `<img${altAttr}${renderAttrs(attrs)} src="${escapeAttr(src as string)}" width="${width}"${heightAttr}>`;
  if (!lightSrc || lightSrc === src) return img;
  return `<picture><source media="${escapeAttr(LIGHT_MEDIA)}" srcset="${escapeAttr(lightSrc)}">${img}</picture>`;
}

/** Renders one icon as an HTML string. Unknown names give '' in local mode. */
export async function renderIcon(
  name: IconName,
  options?: RenderIconOptions & LocalHtmlMode,
): Promise<string>;
export async function renderIcon(
  name: string,
  options: RenderIconOptions & LatestHtmlMode,
): Promise<string>;
export async function renderIcon(name: string, options: RenderIconOptions = {}): Promise<string> {
  const { theme, size = DEFAULT_SIZE, attrs, latest, baseUrl } = options;
  const themes = themeVariants(theme ?? DEFAULT_THEME);
  if (latest) {
    const sources = themes.map(t =>
      remoteIconsUrl({ icons: [name], theme: t, perLine: 1, baseUrl }),
    );
    return renderImg(sources, name, size, size, attrs);
  }
  const keys = themes.flatMap(t => iconKey(name, t) ?? []);
  if (keys.length === 0) return '';
  const svgs = await Promise.all(keys.map(loadIcon));
  if (svgs.some(svg => svg === undefined)) return '';
  return renderImg((svgs as string[]).map(svgDataUri), name, size, size, attrs);
}

/** Renders several icons as one HTML string, laid out like the /icons API. */
export async function renderIcons(
  names: readonly IconName[],
  options?: RenderIconsOptions & LocalHtmlMode,
): Promise<string>;
export async function renderIcons(
  names: readonly string[],
  options: RenderIconsOptions & LatestHtmlMode,
): Promise<string>;
export async function renderIcons(
  names: readonly string[],
  options: RenderIconsOptions = {},
): Promise<string> {
  const {
    theme,
    size = DEFAULT_SIZE,
    perLine = DEFAULT_PER_LINE,
    attrs,
    latest,
    baseUrl,
  } = options;
  const themes = themeVariants(theme ?? DEFAULT_THEME);
  const known = latest ? names : names.filter(name => iconKey(name));
  if (known.length === 0) return '';
  const { width } = iconsSize(known.length, perLine, size);
  const alt = known.join(', ');
  if (latest) {
    const sources = themes.map(t => remoteIconsUrl({ icons: known, theme: t, perLine, baseUrl }));
    return renderImg(sources, alt, width, undefined, attrs);
  }
  const svgs = await Promise.all(themes.map((t: Theme) => loadIcons(known, t, perLine)));
  if (svgs.some(svg => svg === undefined)) return '';
  return renderImg((svgs as string[]).map(svgDataUri), alt, width, undefined, attrs);
}
