// Wraps an arbitrary logo SVG in the standard skill icon container.
export const SIZE = 256;
export const RADIUS = 60;
export const PADDING = 28;
export const DARK_BG = '#242938';
export const LIGHT_BG = '#F4F2ED';
export const DARK_FG = '#FFFFFF';
export const LIGHT_FG = '#000000';

const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

export function isHexColor(color: string): boolean {
  return HEX_COLOR.test(color);
}

function attr(tag: string, name: string): string | undefined {
  return tag.match(new RegExp(`\\s${name}\\s*=\\s*["']([^"']*)["']`, 'i'))?.[1];
}

export function parseSvg(source: string): { viewBox: string; inner: string } {
  const svg = source
    .replace(/<\?xml[\s\S]*?\?>/gi, '')
    .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');

  const open = svg.match(/<svg\b[^>]*>/i);
  const close = svg.lastIndexOf('</svg>');
  if (!open || open.index === undefined || close < 0) throw new Error('Input is not a valid SVG.');

  let viewBox = attr(open[0], 'viewBox')?.trim();
  if (!viewBox) {
    const width = Number.parseFloat(attr(open[0], 'width') ?? '');
    const height = Number.parseFloat(attr(open[0], 'height') ?? '');
    if (!(width > 0 && height > 0)) throw new Error('SVG needs a viewBox or width/height.');
    viewBox = `0 0 ${width} ${height}`;
  }

  const inner = svg.slice(open.index + open[0].length, close).trim();
  return { viewBox, inner };
}

// `foreground` is the default fill for logo shapes that don't set their own (e.g. simple-icons
// paths); without it they inherit the outer `fill="none"` and render invisible.
export function wrapIcon(source: string, background: string, foreground = DARK_FG): string {
  const { viewBox, inner } = parseSvg(source);
  const box = SIZE - PADDING * 2;
  return `<svg width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="${SIZE}" height="${SIZE}" rx="${RADIUS}" fill="${background}"/>
<svg x="${PADDING}" y="${PADDING}" width="${box}" height="${box}" viewBox="${viewBox}" fill="${foreground}" preserveAspectRatio="xMidYMid meet">
${inner}
</svg>
</svg>
`;
}
