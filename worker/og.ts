import { initWasm, Resvg } from '@resvg/resvg-wasm';
import resvgWasm from '@resvg/resvg-wasm/index_bg.wasm?module';
// Static, Latin-subset fonts: resvg reads neither WOFF2 nor variable axes.
import groteskBold from './fonts/familjen-grotesk-bold.bin';
import monoRegular from './fonts/ibm-plex-mono-regular.bin';
import monoSemiBold from './fonts/ibm-plex-mono-semibold.bin';

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const PAD_X = 72;
const PAD_Y = 56;
const INK = '#111111';
const MUTED = '#5C5C56';
const ACCENT = '#FFD21F';
const SANS = 'Familjen Grotesk';
const MONO = 'IBM Plex Mono';
/** IBM Plex Mono advance width, in em. */
const MONO_ADVANCE = 0.6;

const COLUMNS = 8;
const MAX_TILES = COLUMNS * 2;
const GAP = 18;
const TITLE = 'My skills';
const TITLE_SIZE = 64;
const TITLE_GAP = 28;
const HEADER_BOTTOM = PAD_Y + 44;
const FOOTER_TOP = 524;
const MAX_URL_CHARS = 64;

/** Link-preview crawlers. Only these get the HTML page; everything else (GitHub camo included) keeps the SVG. */
const PREVIEW_BOTS =
  /discordbot|twitterbot|facebookexternalhit|facebookcatalog|slackbot|whatsapp|telegrambot|linkedinbot|skypeuripreview|redditbot|mastodon|bluesky|embedly|iframely|vkshare|pinterest/i;

export function isPreviewBot(request: Request): boolean {
  return PREVIEW_BOTS.test(request.headers.get('User-Agent') ?? '');
}

/** "skill ◇ icons" at 30px, vertically centered on the header row. */
function wordmark(centerY: number): string {
  // Familjen Grotesk: "skill" is 1.8067em wide; letter-spacing -0.03em; the square sits 4px gap + 3px margin away.
  const skillWidth = 1.8067 * 30 - 5 * 0.9;
  const squareX = PAD_X + skillWidth + 7;
  const iconsX = squareX + 12 + 7;
  const baseline = centerY + 12;
  const text = (x: number, value: string) =>
    `<text x="${x}" y="${baseline}" font-family="${SANS}" font-weight="700" font-size="30" letter-spacing="-0.9" fill="${INK}">${value}</text>`;
  return `${text(PAD_X, 'skill')}<rect x="${squareX + 1.5}" y="${centerY - 4.5}" width="9" height="9" fill="${ACCENT}" stroke="${INK}" stroke-width="3" transform="rotate(12 ${squareX + 6} ${centerY})"/>${text(iconsX, 'icons')}`;
}

/** Yellow "N skills" pill, right-aligned on the header row. */
function countPill(count: number, centerY: number): string {
  const label = `${count} skill${count === 1 ? '' : 's'}`;
  const width = label.length * MONO_ADVANCE * 20 + 36;
  const x = OG_WIDTH - PAD_X - width;
  return `<rect x="${x}" y="${centerY - 22}" width="${width}" height="44" rx="22" fill="${ACCENT}"/><text x="${x + 18}" y="${centerY + 7.5}" font-family="${MONO}" font-weight="600" font-size="20" fill="${INK}">${label}</text>`;
}

function moreTile(extra: number, x: number, y: number, size: number): string {
  return `<rect x="${x + 1.5}" y="${y + 1.5}" width="${size - 3}" height="${size - 3}" rx="${size * 0.234}" fill="none" stroke="${INK}" stroke-opacity="0.2" stroke-width="3" stroke-dasharray="9 6"/><text x="${x + size / 2}" y="${y + size / 2 + 10.5}" text-anchor="middle" font-family="${MONO}" font-weight="600" font-size="28" fill="${INK}">+${extra}</text>`;
}

let wasmReady: Promise<void> | undefined;

/**
 * The "shared stack" card from the design system: wordmark and skill count, title, icons in up
 * to 8 columns × 2 rows (a "+N" tile takes the last slot when there are more) and the link.
 * `iconSvgs` are full 256×256 icon SVGs; `link` is shown without its protocol.
 */
export async function renderOgPng(iconSvgs: string[], link: URL): Promise<Uint8Array> {
  wasmReady ??= initWasm(resvgWasm);
  await wasmReady;

  const overflow = iconSvgs.length > MAX_TILES;
  const shown = overflow ? iconSvgs.slice(0, MAX_TILES - 1) : iconSvgs;
  const extra = iconSvgs.length - shown.length;
  const tiles = shown.length + (extra > 0 ? 1 : 0);
  const size = tiles <= COLUMNS ? 104 : 92;
  const rows = Math.ceil(tiles / COLUMNS);
  const gridHeight = rows * size + (rows - 1) * GAP;

  // The title and grid are centered between the header row and the footer rule.
  const middleHeight = TITLE_SIZE + TITLE_GAP + gridHeight;
  const titleTop = HEADER_BOTTOM + (FOOTER_TOP - HEADER_BOTTOM - middleHeight) / 2;
  const gridTop = titleTop + TITLE_SIZE + TITLE_GAP;
  const cell = (index: number) => [
    PAD_X + (index % COLUMNS) * (size + GAP),
    gridTop + Math.floor(index / COLUMNS) * (size + GAP),
  ];

  const icons = shown
    .map((svg, index) => {
      const [x, y] = cell(index);
      return `<g transform="translate(${x} ${y}) scale(${size / 256})">${svg}</g>`;
    })
    .join('');
  const more = extra > 0 ? moreTile(extra, ...(cell(shown.length) as [number, number]), size) : '';

  const href = decodeURI(link.href.replace(/^https?:\/\//, ''));
  const shownHref = href.length <= MAX_URL_CHARS ? href : `${href.slice(0, MAX_URL_CHARS - 1)}…`;
  const footerBaseline = FOOTER_TOP + 2 + 22 + 20.5;
  const headerCenter = PAD_Y + 22;

  const canvas = `<svg width="${OG_WIDTH}" height="${OG_HEIGHT}" viewBox="0 0 ${OG_WIDTH} ${OG_HEIGHT}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  ${wordmark(headerCenter)}
  ${countPill(iconSvgs.length, headerCenter)}
  <text x="${PAD_X}" y="${titleTop + 57.6}" font-family="${SANS}" font-weight="700" font-size="${TITLE_SIZE}" letter-spacing="${-0.035 * TITLE_SIZE}" fill="${INK}">${TITLE}</text>
  ${icons}${more}
  <rect x="${PAD_X}" y="${FOOTER_TOP}" width="${OG_WIDTH - PAD_X * 2}" height="2" fill="${INK}" fill-opacity="0.14"/>
  <text x="${PAD_X}" y="${footerBaseline}" font-family="${MONO}" font-size="20" fill="${MUTED}">${escapeHtml(shownHref)}</text>
  <text x="${OG_WIDTH - PAD_X}" y="${footerBaseline}" text-anchor="end" font-family="${MONO}" font-size="20" fill="${INK}">build yours →</text>
</svg>`;

  return new Resvg(canvas, {
    background: '#ffffff',
    font: {
      fontBuffers: [groteskBold, monoRegular, monoSemiBold].map(font => new Uint8Array(font)),
      defaultFontFamily: MONO,
    },
  })
    .render()
    .asPng();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Minimal page carrying the OpenGraph tags for an /icons link. */
export function ogPage(url: URL, iconNames: string[]): Response {
  const image = new URL('/og', url);
  image.search = url.search;
  const names = [...new Set(iconNames.map(i => i.replace(/-(dark|light)$/, '')))];
  const title = 'Skill Icons';
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
