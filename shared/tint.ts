// Tinted icons, like macOS's tinted app icons: the icon's tile becomes a tile in the tint and its
// glyph is redrawn in the tint, keeping the glyph's shading. Pure string work, shared by the
// Worker (/icons, /og) and the site (previews).

import type { Theme } from './icons';

/** A tint as 6 lowercase hex digits, without the `#`. */
export type Tint = string;

/** The tints offered as swatches; any other color can be typed or picked. */
export const TINT_SWATCHES: Tint[] = [
  'ff3b30',
  'ff9500',
  'ffcc00',
  '34c759',
  '00c7be',
  '30b0c7',
  '32ade6',
  '007aff',
  '5856d6',
  'af52de',
  'ff2d55',
  'a2845e',
  'ff8a80',
  'ffb86b',
  'ffe08a',
  '9be59b',
  '5fd3c4',
  '9cc9ff',
  'c3b1ff',
  'f3a6d8',
  'f5a623',
  'c084fc',
  '8e8e93',
  'e5e5ea',
];

/**
 * Reads a tint typed by a person or taken from a URL: `5fd3c4`, `#5FD3C4` or `5fc`. Returns it as
 * 6 lowercase hex digits, or undefined when it is not a color.
 */
export function parseTint(raw: string | null | undefined): Tint | undefined {
  const hex = raw?.trim().replace(/^#/, '').toLowerCase();
  if (!hex) return undefined;
  if (/^[0-9a-f]{6}$/.test(hex)) return hex;
  if (/^[0-9a-f]{3}$/.test(hex)) return [...hex].map(c => c + c).join('');
  return undefined;
}

type Rgb = [number, number, number];

function rgbOf(tint: Tint): Rgb {
  return [0, 2, 4].map(i => Number.parseInt(tint.slice(i, i + 2), 16)) as Rgb;
}

/** sRGB luminance (0–1) of a color. */
function luminance([r, g, b]: Rgb): number {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function css([r, g, b]: Rgb): string {
  return `#${[r, g, b].map(c => Math.round(c).toString(16).padStart(2, '0')).join('')}`;
}

/** `from` moved `amount` (0–1) of the way to `to`. */
function mix(from: Rgb, to: Rgb, amount: number): Rgb {
  return from.map((c, i) => c + (to[i] - c) * amount) as Rgb;
}

const BLACK: Rgb = [0, 0, 0];
const WHITE: Rgb = [255, 255, 255];

/** The named colors the icons use. */
const NAMED: Record<string, Rgb> = {
  white: WHITE,
  black: BLACK,
  red: [255, 0, 0],
  navy: [0, 0, 128],
  gold: [255, 215, 0],
  silver: [192, 192, 192],
  gray: [128, 128, 128],
  grey: [128, 128, 128],
};

/** A paint value as RGB: hex, `rgb()` or a name; undefined for none, url(), currentColor… */
function colorRgb(color: string): Rgb | undefined {
  const value = color.trim().toLowerCase();
  if (value in NAMED) return NAMED[value];
  const rgb = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/.exec(value);
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
  const hex = value.startsWith('#') ? parseTint(value) : undefined;
  return hex ? rgbOf(hex) : undefined;
}

/** Sum of the per-channel distances (0–3): how far a color stands out from the tile. */
function distance(a: Rgb, b: Rgb): number {
  return a.reduce((sum, c, i) => sum + Math.abs(c - b[i]), 0) / 255;
}

/** The icon's tile: its first full-size rect, or the rounded-square path a few icons draw. */
const TILE =
  /<rect(?=[^>]*\swidth="256")(?=[^>]*\sheight="256")[^>]*>|<path(?=[^>]*\sd="M196 0H60C)[^>]*>/;

/** Clip paths and masks paint nothing: their colors are geometry, never recolored. */
const HIDDEN = /<(clipPath|mask)\b[\s\S]*?<\/\1>/g;

/** Paint in attributes (`fill="…"`) and in CSS (`style="fill: …"`, `<style>`). */
const PAINT_ATTR = /(\s(?:fill|stroke|stop-color|flood-color)=")([^"]+)(")/g;
const PAINT_CSS = /((?:^|[\s;{"])(?:fill|stroke|stop-color|flood-color)\s*:\s*)([^;"'}]+)/g;

/** The first shape that paints, for the few icons whose tile isn't a plain full-size one. */
const FIRST_PAINT = /<(?:rect|path|circle|ellipse|polygon)\b[^>]*\sfill="(?!none")[^"]+"[^>]*>/;

/**
 * The old tile's color (a gradient's first stop) and, when it is a plain full-size shape, its
 * tag. Without one, the first shape that paints is the backdrop; failing that, the dark tile.
 */
function tileColor(svg: string): { rgb: Rgb; tile: string | undefined } {
  const visible = svg.replace(HIDDEN, '');
  const full = TILE.exec(visible)?.[0];
  const tile = full && /\sfill="/.test(full) ? full : undefined;
  const fill = /\sfill="([^"]+)"/.exec(tile ?? FIRST_PAINT.exec(visible)?.[0] ?? '')?.[1];
  const ref = fill && /^url\(#([^)]+)\)$/.exec(fill)?.[1];
  const color = ref
    ? /stop-color="([^"]+)"/.exec(svg.slice(svg.indexOf(`id="${ref}"`)))?.[1]
    : fill;
  return { rgb: (color && colorRgb(color)) || [38, 38, 38], tile };
}

/** Color distance below which a color counts as tile. */
const FLOOR = 0.06;

/**
 * Colors of a tinted tile: dark tiles are the tint deep in shadow under a glyph in the tint;
 * light tiles are the tint washed out under a deeper glyph.
 */
function tintPalette(tint: Tint, theme: Theme) {
  const rgb = rgbOf(tint);
  if (theme === 'dark')
    return {
      tileTop: mix(BLACK, rgb, 0.18),
      tileBottom: mix(BLACK, rgb, 0.1),
      glyph: luminance(rgb) < 0.25 ? mix(rgb, WHITE, 0.35) : rgb,
      edge: rgb,
    };
  return {
    tileTop: mix(WHITE, rgb, 0.11),
    tileBottom: mix(WHITE, rgb, 0.18),
    glyph: luminance(rgb) > 0.6 ? mix(rgb, BLACK, 0.45) : mix(rgb, BLACK, 0.15),
    edge: rgb,
  };
}

/** Brightness to color, from `base` (black) to `glyph` (white), for embedded pictures. */
function rasterFilter(id: string, base: Rgb, glyph: Rgb): string {
  const rows = base.map((b, i) => {
    const span = (glyph[i] - b) / 255;
    return `${[0.2126, 0.7152, 0.0722].map(w => (w * span).toFixed(4)).join(' ')} 0 ${(b / 255).toFixed(4)}`;
  });
  return `<filter id="${id}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${rows.join(' ')} 0 0 0 1 0"/></filter>`;
}

/** Runs `paint` on every color outside clip paths and masks. */
function repaint(svg: string, paint: (color: string) => string): string {
  const swap = (part: string) =>
    part
      .replace(PAINT_ATTR, (_, before, color, after) => before + paint(color) + after)
      .replace(/<style\b[\s\S]*?<\/style>|\sstyle="[^"]*"/g, css =>
        css.replace(PAINT_CSS, (_, before, color) => before + paint(color)),
      );
  let out = '';
  let last = 0;
  for (const hidden of svg.matchAll(HIDDEN)) {
    out += swap(svg.slice(last, hidden.index)) + hidden[0];
    last = hidden.index + hidden[0].length;
  }
  return out + swap(svg.slice(last));
}

/**
 * Redraws a 256×256 icon SVG in `tint`, as vectors: every color is repainted between the new
 * tile and the tint, by how far it stood out from the old tile (the farthest one gets the full
 * tint). Shapes, gradients and anti-aliasing stay the icon's own, so it is as sharp as the
 * original at any size. Pass the dark variant: its glyphs stand out the most from their tile.
 */
export function tintIconSvg(svg: string, tint: Tint, theme: Theme): string {
  const { tileTop, tileBottom, glyph, edge } = tintPalette(tint, theme);
  const old = tileColor(svg);
  const key = `si-tint-${theme}-${tint}`;

  const colors = [...svg.replace(HIDDEN, '').matchAll(PAINT_ATTR)]
    .map(([, , color]) => colorRgb(color))
    .filter(rgb => rgb !== undefined);
  // As far as the glyph gets from the tile; without readable colors, as far as any could.
  const found = Math.max(0, ...colors.map(rgb => distance(rgb, old.rgb)));
  const reach =
    found >= 0.25 ? found : distance(old.rgb.map(c => (c < 128 ? 255 : 0)) as Rgb, old.rgb);

  // Colors land between the tile's middle and the glyph; a gentle curve lifts the fainter ones.
  const base = mix(tileTop, tileBottom, 0.5);
  const paint = (color: string) => {
    const rgb = colorRgb(color);
    if (!rgb) return color;
    const amount = Math.min(1, Math.max(0, (distance(rgb, old.rgb) - FLOOR) / (reach - FLOOR)));
    return css(mix(base, glyph, amount ** 0.75));
  };

  // The old tile takes the new tile's gradient; anything else keeps its own shape.
  const tiled = old.tile
    ? svg.replace(old.tile, old.tile.replace(/\sfill="[^"]+"/, ` fill="url(#${key}-tile)"`))
    : svg;
  // Embedded pictures can't be repainted: a filter maps their brightness the same way.
  const icon = repaint(tiled, paint).replace(/<image\b/g, `<image filter="url(#${key}-raster)"`);

  const raster = svg.includes('<image') ? rasterFilter(`${key}-raster`, base, glyph) : '';

  return `<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<defs><linearGradient id="${key}-tile" x1="0" y1="0" x2="0" y2="256" gradientUnits="userSpaceOnUse"><stop stop-color="${css(tileTop)}"/><stop offset="1" stop-color="${css(tileBottom)}"/></linearGradient>${raster}</defs>
<rect width="256" height="256" rx="60" fill="url(#${key}-tile)"/>
<!-- Shapes without a fill of their own would be black: the icon inherits the tinted black. -->
<g fill="${paint('black')}">${icon}</g>
<rect x="1" y="1" width="254" height="254" rx="59" stroke="${css(edge)}" stroke-opacity="0.22" stroke-width="2"/>
</svg>`;
}
