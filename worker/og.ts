import { initWasm, Resvg } from '@resvg/resvg-wasm';
import resvgWasm from '@resvg/resvg-wasm/index_bg.wasm?module';
// Static, Latin-subset fonts: resvg reads neither WOFF2 nor variable axes.
import groteskBold from './fonts/familjen-grotesk-bold.bin';
import monoRegular from './fonts/ibm-plex-mono-regular.bin';
import monoSemiBold from './fonts/ibm-plex-mono-semibold.bin';
import {
  OG_ACCENT as ACCENT,
  OG_DEFAULT_TITLE,
  OG_FOOTER_BASELINE as footerBaseline,
  OG_FOOTER_TOP as FOOTER_TOP,
  OG_HEADER_HEIGHT,
  OG_HEIGHT,
  OG_INK as INK,
  OG_PAD_X as PAD_X,
  OG_PALETTE,
  OG_PAD_Y as PAD_Y,
  OG_TILE_RADIUS as TILE_RADIUS,
  OG_TITLE_SIZE as TITLE_SIZE,
  OG_WIDTH,
  ogLayout,
  ogNeedsOutline,
  ogOutline,
} from '../shared/og-layout';
import { DEFAULT_THEME, type Theme } from '../shared/icons';
import { OG_SITE_IMAGE, OG_SITE_IMAGE_DARK } from '../shared/page-meta';

const SANS = 'Familjen Grotesk';
const MONO = 'IBM Plex Mono';
/** IBM Plex Mono advance width, in em. */
const MONO_ADVANCE = 0.6;

/** Link-preview crawlers. Only these get the HTML page; everything else (GitHub camo included) keeps the SVG. */
const PREVIEW_BOTS =
  /discordbot|twitterbot|facebookexternalhit|facebookcatalog|slackbot|whatsapp|telegrambot|linkedinbot|skypeuripreview|redditbot|mastodon|bluesky|embedly|iframely|vkshare|pinterest/i;

export function isPreviewBot(request: Request): boolean {
  return PREVIEW_BOTS.test(request.headers.get('User-Agent') ?? '');
}

/** "skill ◇ icons" at `size` px (30 on the stack card), vertically centered on `centerY`. The square is yellow and INK on both backgrounds. */
function wordmark(centerY: number, ink: string, size = 30): string {
  // Familjen Grotesk: "skill" is 1.8067em wide; letter-spacing -0.03em; the square (0.4em, with a
  // 0.1em border) sits a 4px gap plus a 0.1em margin away.
  const skillWidth = 1.8067 * size - 5 * 0.03 * size;
  const square = 0.4 * size;
  const border = 0.1 * size;
  const squareX = PAD_X + skillWidth + 4 + border;
  const iconsX = squareX + square + border + 4;
  const baseline = centerY + 0.4 * size;
  const text = (x: number, value: string) =>
    `<text x="${x}" y="${baseline}" font-family="${SANS}" font-weight="700" font-size="${size}" letter-spacing="${-0.03 * size}" fill="${ink}">${value}</text>`;
  return `${text(PAD_X, 'skill')}<rect x="${squareX + border / 2}" y="${centerY - square / 2 + border / 2}" width="${square - border}" height="${square - border}" fill="${ACCENT}" stroke="${INK}" stroke-width="${border}" transform="rotate(12 ${squareX + square / 2} ${centerY})"/>${text(iconsX, 'icons')}`;
}

/** Yellow "N skills" pill, right-aligned on the header row. */
function countPill(count: number, centerY: number): string {
  const label = `${count} skill${count === 1 ? '' : 's'}`;
  const width = label.length * MONO_ADVANCE * 20 + 36;
  const x = OG_WIDTH - PAD_X - width;
  return `<rect x="${x}" y="${centerY - 22}" width="${width}" height="44" rx="22" fill="${ACCENT}"/><text x="${x + 18}" y="${centerY + 7.5}" font-family="${MONO}" font-weight="600" font-size="20" fill="${INK}">${label}</text>`;
}

function moreTile(
  extra: number,
  x: number,
  y: number,
  size: number,
  ink: string,
  dash: number,
): string {
  return `<rect x="${x + 1.5}" y="${y + 1.5}" width="${size - 3}" height="${size - 3}" rx="${size * TILE_RADIUS}" fill="none" stroke="${ink}" stroke-opacity="${dash}" stroke-width="3" stroke-dasharray="9 6"/><text x="${x + size / 2}" y="${y + size / 2 + 10.5}" text-anchor="middle" font-family="${MONO}" font-weight="600" font-size="28" fill="${ink}">+${extra}</text>`;
}

/** A tile's 2px outline, for when it shares the card's tone (ogNeedsOutline). */
function outline(x: number, y: number, size: number, ink: string, opacity: number): string {
  const o = ogOutline(x, y, size);
  return `<rect x="${o.x}" y="${o.y}" width="${o.size}" height="${o.size}" rx="${o.radius}" fill="none" stroke="${ink}" stroke-opacity="${opacity}" stroke-width="${o.width}"/>`;
}

/**
 * The "shared stack" card from the design system: wordmark and skill count, title, icons in up
 * to 8 columns × 2 rows (a "+N" tile takes the last slot when there are more) and the link.
 * `iconSvgs` are full 256×256 icon SVGs in the link's `theme`; `link` is shown without its
 * protocol; `title` is the link's own badge title, if it has one; `bg` picks the card's colors.
 * When the icon tiles share the card's tone (`bg` = `theme`), each one gets an outline.
 */
export function buildOgSvg(
  iconSvgs: string[],
  link: URL,
  title = OG_DEFAULT_TITLE,
  bg: Theme = 'light',
  theme: Theme = DEFAULT_THEME,
): string {
  const {
    shown: shownCount,
    extra,
    size,
    titleTop,
    titleSize,
    cell,
    href,
  } = ogLayout(iconSvgs.length, title, link.href);
  const { ink, muted, line, dash, cta, ctaWeight } = OG_PALETTE[bg];
  const outlined = ogNeedsOutline(bg, theme);
  const shown = iconSvgs.slice(0, shownCount);

  const icons = shown
    .map((svg, index) => {
      const [x, y] = cell(index);
      const icon = `<g transform="translate(${x} ${y}) scale(${size / 256})">${svg}</g>`;
      return outlined ? icon + outline(x, y, size, ink, line) : icon;
    })
    .join('');
  const more = extra > 0 ? moreTile(extra, ...cell(shown.length), size, ink, dash) : '';

  const titleBaseline = titleTop + TITLE_SIZE / 2 + titleSize * 0.4;

  const headerCenter = PAD_Y + OG_HEADER_HEIGHT / 2;

  return `<svg width="${OG_WIDTH}" height="${OG_HEIGHT}" viewBox="0 0 ${OG_WIDTH} ${OG_HEIGHT}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  ${wordmark(headerCenter, ink)}
  ${countPill(iconSvgs.length, headerCenter)}
  <text x="${PAD_X}" y="${titleBaseline}" font-family="${SANS}" font-weight="700" font-size="${titleSize}" letter-spacing="${-0.035 * titleSize}" fill="${ink}">${escapeHtml(title)}</text>
  ${icons}${more}
  <rect x="${PAD_X}" y="${FOOTER_TOP}" width="${OG_WIDTH - PAD_X * 2}" height="2" fill="${ink}" fill-opacity="${line}"/>
  <text x="${PAD_X}" y="${footerBaseline}" font-family="${MONO}" font-size="20" fill="${muted}">${escapeHtml(href)}</text>
  <text x="${OG_WIDTH - PAD_X}" y="${footerBaseline}" text-anchor="end" font-family="${MONO}" font-weight="${ctaWeight}" font-size="20" fill="${cta}">build yours →</text>
</svg>`;
}

let wasmReady: Promise<void> | undefined;

async function rasterize(svg: string, background: string): Promise<Uint8Array> {
  wasmReady ??= initWasm(resvgWasm);
  await wasmReady;

  return new Resvg(svg, {
    background,
    font: {
      fontBuffers: [groteskBold, monoRegular, monoSemiBold].map(font => new Uint8Array(font)),
      defaultFontFamily: MONO,
    },
  })
    .render()
    .asPng();
}

/** buildOgSvg, rasterized to a PNG on the card's background. */
export function renderOgPng(
  iconSvgs: string[],
  link: URL,
  title = OG_DEFAULT_TITLE,
  bg: Theme = 'light',
  theme: Theme = DEFAULT_THEME,
): Promise<Uint8Array> {
  return rasterize(buildOgSvg(iconSvgs, link, title, bg, theme), OG_PALETTE[bg].background);
}

/** Icons of the site cover's tilted 4×4 cluster, drawn in their dark variant. */
export const SITE_OG_ICONS = [
  'ts',
  'react',
  'rust',
  'docker',
  'bun',
  'postgres',
  'figma',
  'python',
  'git',
  'tailwind',
  'vite',
  'github',
  'svelte',
  'claude',
  'astro',
  'vue',
];
/** Tiles of the cluster that get the yellow highlight. */
const SITE_HIGHLIGHTS = new Set([1, 6, 11]);
const SITE_TILTS = [-6, 4, -3, 8, 5, -9, 3, -4, -7, 6, -2, 10, 4, -8, 3, -5];

const SITE_PALETTE: Record<Theme, { background: string; ink: string; muted: string; dot: string }> =
  {
    light: { background: '#EDEDE8', ink: '#111111', muted: '#5C5C56', dot: '#111111' },
    dark: { background: '#141414', ink: '#F1F1EC', muted: '#A6A69F', dot: ACCENT },
  };

/**
 * The site cover from the design system ("OG · site" and "OG · site · escuro"): wordmark,
 * "Build your stack. Paste it in your README.", the tilted icon cluster and a footer with the
 * site's `host` and the live icon `count`. Measured from the skill-icons-og skill's template.
 */
export function buildSiteOgSvg(
  iconSvgs: string[],
  count: number,
  host: string,
  bg: Theme = 'light',
): string {
  const { ink, muted, dot } = SITE_PALETTE[bg];
  const headline = (y: number, body: string) =>
    `<text x="${PAD_X}" y="${y}" font-family="${SANS}" font-weight="700" font-size="76" letter-spacing="-3.04" fill="${ink}">${body}</text>`;

  // A 4×4 grid of 108px tiles, 12px apart, turned -4° about the cluster's center and pushed 30px along it.
  const tiles = iconSvgs
    .slice(0, 16)
    .map((svg, i) => {
      const x = 666 + (i % 4) * 120;
      const y = 85 + Math.floor(i / 4) * 120;
      const highlighted = SITE_HIGHLIGHTS.has(i);
      const plate = highlighted
        ? `<rect x="${x}" y="${y}" width="108" height="108" rx="27" fill="${ACCENT}"/>`
        : '';
      // On the dark ground the loose tiles get a 2px ring, or they sink into it.
      const ring =
        bg === 'dark' && !highlighted
          ? `<rect x="${x + 11}" y="${y + 11}" width="86" height="86" rx="20.7" fill="none" stroke="#F1F1EC" stroke-opacity="0.16" stroke-width="2"/>`
          : '';
      const icon = `<g transform="translate(${x + 12} ${y + 12}) scale(${84 / 256})">${svg}</g>`;
      return `<g transform="rotate(${SITE_TILTS[i]} ${x + 54} ${y + 54})">${plate}${icon}${ring}</g>`;
    })
    .join('');

  // IBM Plex Mono is 12px a character at 20px; the dot sits 14px after the host.
  const dotX = PAD_X + host.length * MONO_ADVANCE * 20 + 14;

  return `<svg width="${OG_WIDTH}" height="${OG_HEIGHT}" viewBox="0 0 ${OG_WIDTH} ${OG_HEIGHT}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  ${wordmark(84, ink, 40)}
  ${headline(281.8, 'Build your stack.')}
  ${headline(356.27, 'Paste it in your')}
  <rect x="${PAD_X}" y="352.73" width="284.27" height="95" fill="${ACCENT}"/>
  ${headline(430.74, `<tspan x="${PAD_X + 4}" fill="${INK}">README</tspan><tspan x="356.27">.</tspan>`)}
  <text x="${PAD_X}" y="569" font-family="${MONO}" font-size="20" fill="${ink}">${escapeHtml(host)}</text>
  <circle cx="${dotX + 3}" cy="561.5" r="3" fill="${dot}"/>
  <text x="${dotX + 20}" y="569" font-family="${MONO}" font-size="20" fill="${muted}">${count} icons · npm package</text>
  <g transform="rotate(-4 901 319) translate(30 0)">${tiles}</g>
</svg>`;
}

/** buildSiteOgSvg, rasterized to a PNG on the cover's background. */
export function renderSiteOgPng(
  iconSvgs: string[],
  count: number,
  host: string,
  bg: Theme = 'light',
): Promise<Uint8Array> {
  return rasterize(buildSiteOgSvg(iconSvgs, count, host, bg), SITE_PALETTE[bg].background);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** A site page asked for with `?bg=dark` gets the dark link preview card; anything else passes through. */
export function withSiteOgBg(res: Response, url: URL): Response {
  if (url.searchParams.get('bg') !== 'dark') return res;
  if (!res.headers.get('Content-Type')?.includes('text/html')) return res;
  const swap = {
    element(meta: Element) {
      const image = meta.getAttribute('content');
      if (image?.endsWith(`/${OG_SITE_IMAGE}`))
        meta.setAttribute('content', image.slice(0, -OG_SITE_IMAGE.length) + OG_SITE_IMAGE_DARK);
    },
  };
  return new HTMLRewriter()
    .on('meta[property="og:image"]', swap)
    .on('meta[name="twitter:image"]', swap)
    .transform(res);
}

/** Minimal page carrying the OpenGraph tags for an /icons link. */
export function ogPage(url: URL, iconNames: string[], badgeTitle?: string): Response {
  const image = new URL('/og', url);
  image.search = url.search;
  const names = [...new Set(iconNames.map(i => i.replace(/-(dark|light)$/, '')))];
  const title = badgeTitle ? `${badgeTitle} · Skill Icons` : 'Skill Icons';
  const description = names.join(', ');

  const meta = [
    ['og:type', 'website'],
    ['og:site_name', 'Skill Icons'],
    ['og:title', title],
    ['og:description', description],
    ['og:url', url.href],
    ['og:image', image.href],
    ['og:image:type', 'image/png'],
    ['og:image:width', String(OG_WIDTH)],
    ['og:image:height', String(OG_HEIGHT)],
  ]
    .map(
      ([property, content]) => `<meta property="${property}" content="${escapeHtml(content)}" />`,
    )
    .join('\n    ');

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    ${meta}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="${escapeHtml(image.href)}" />
  </head>
  <body>
    <img src="${escapeHtml(url.href)}" alt="${escapeHtml(description)}" />
  </body>
</html>`;

  // Same URL as the SVG, so this must never land in a shared cache.
  return new Response(html, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8', 'Cache-Control': 'no-store' },
  });
}
