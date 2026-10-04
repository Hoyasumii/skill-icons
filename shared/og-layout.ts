// Geometry of the "shared stack" OpenGraph card, in px of the 1200×630 image. The Worker draws it
// as an SVG (worker/og.ts) and the builder as HTML (the preview's back face), from these numbers.

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;
export const OG_PAD_X = 72;
export const OG_PAD_Y = 56;
/** The header row (wordmark and count pill) is this tall, from OG_PAD_Y. */
export const OG_HEADER_HEIGHT = 44;
/** The 2px rule over the footer. */
export const OG_FOOTER_TOP = 524;
/** Baseline of the footer's 20px mono text. */
export const OG_FOOTER_BASELINE = OG_FOOTER_TOP + 44.5;
export const OG_DEFAULT_TITLE = 'My skills';
export const OG_TITLE_SIZE = 64;

const COLUMNS = 8;
const MAX_TILES = COLUMNS * 2;
const GAP = 18;
/** Familjen Grotesk bold, average advance per character in em (a little generous). */
const TITLE_ADVANCE = 0.56;
const TITLE_GAP = 28;
const HEADER_BOTTOM = OG_PAD_Y + OG_HEADER_HEIGHT;
const MAX_URL_CHARS = 64;

export interface OgLayout {
  /** How many icons get a tile; when there are more, a "+extra" tile takes the next cell. */
  shown: number;
  extra: number;
  /** Tile size. */
  size: number;
  rows: number;
  /** Top of the title row, which is OG_TITLE_SIZE tall whatever the title's size. */
  titleTop: number;
  titleSize: number;
  gridTop: number;
  /** Top-left corner of the tile at `index`. */
  cell: (index: number) => [x: number, y: number];
  /** The link without its protocol, cut to fit the footer. */
  href: string;
}

/**
 * Icons in up to 8 columns × 2 rows, the title above them, both centered between the header row
 * and the footer rule. A long title shrinks to fit the width; its row keeps its height.
 */
export function ogLayout(iconCount: number, title: string, link: string): OgLayout {
  const overflow = iconCount > MAX_TILES;
  const shown = overflow ? MAX_TILES - 1 : iconCount;
  const extra = iconCount - shown;
  const tiles = shown + (extra > 0 ? 1 : 0);
  const size = tiles <= COLUMNS ? 104 : 92;
  const rows = Math.ceil(tiles / COLUMNS);
  const gridHeight = rows * size + (rows - 1) * GAP;

  const middleHeight = OG_TITLE_SIZE + TITLE_GAP + gridHeight;
  const titleTop = HEADER_BOTTOM + (OG_FOOTER_TOP - HEADER_BOTTOM - middleHeight) / 2;
  const gridTop = titleTop + OG_TITLE_SIZE + TITLE_GAP;
  const titleSize = Math.min(
    OG_TITLE_SIZE,
    Math.floor((OG_WIDTH - OG_PAD_X * 2) / (title.length * TITLE_ADVANCE)),
  );

  const href = decodeURI(link.replace(/^https?:\/\//, ''));

  return {
    shown,
    extra,
    size,
    rows,
    titleTop,
    titleSize,
    gridTop,
    cell: index => [
      OG_PAD_X + (index % COLUMNS) * (size + GAP),
      gridTop + Math.floor(index / COLUMNS) * (size + GAP),
    ],
    href: href.length <= MAX_URL_CHARS ? href : `${href.slice(0, MAX_URL_CHARS - 1)}…`,
  };
}
