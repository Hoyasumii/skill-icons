import type { CSSProperties } from 'react';
import { iconSrc } from '@/lib/icons';
import type { Theme } from '../../shared/icons';
import {
  OG_ACCENT,
  OG_DOT_RADIUS,
  OG_DOT_SPACING,
  OG_FOOTER_BASELINE,
  OG_FOOTER_TOP,
  OG_HEADER_HEIGHT,
  OG_HEIGHT,
  OG_INK,
  OG_PAD_X,
  OG_PAD_Y,
  OG_PALETTE,
  OG_TILE_RADIUS,
  OG_TITLE_SIZE,
  OG_WIDTH,
  ogLayout,
  ogNeedsOutline,
} from '../../shared/og-layout';

/** px of the 1200px-wide image → container units, so the card scales with its box. */
const u = (px: number) => `${(px / OG_WIDTH) * 100}cqw`;
/** `color` at `opacity`, like an SVG fill-opacity. */
const alpha = (color: string, opacity: number) =>
  `color-mix(in srgb, ${color} ${opacity * 100}%, transparent)`;

interface OgCoverProps {
  icons: string[];
  /** The icon theme. */
  theme: Theme;
  /** The card's background: the site theme, as the PNG's `bg`. */
  bg: Theme;
  title: string;
  /** The /icons link the footer shows. */
  link: string;
}

/**
 * The card the Worker renders at /og, drawn in HTML from the same geometry (shared/og-layout.ts).
 * Its colors are OG_PALETTE[bg], as in the PNG, and `bg` follows the site theme, so it changes with
 * the page; its icons are in the icon theme, outlined when they share the card's tone.
 */
export function OgCover({ icons, theme, bg, title, link }: OgCoverProps) {
  const { shown, extra, size, titleTop, titleSize, cell, href } = ogLayout(
    icons.length,
    title,
    link,
  );
  const { background, ink, muted, line, dash, cta, ctaWeight, dots } = OG_PALETTE[bg];
  const outlined = ogNeedsOutline(bg, theme);
  const headerCenter = OG_PAD_Y + OG_HEADER_HEIGHT / 2;
  const at = (x: number, y: number): CSSProperties => ({
    position: 'absolute',
    left: u(x),
    top: u(y),
  });
  const tile = (index: number): CSSProperties => ({
    ...at(...cell(index)),
    width: u(size),
    height: u(size),
  });

  return (
    <div className="@container">
      <div
        className="relative overflow-hidden leading-none"
        style={{
          aspectRatio: `${OG_WIDTH} / ${OG_HEIGHT}`,
          backgroundColor: background,
          color: ink,
          // Dots centered on multiples of OG_DOT_SPACING, as in the PNG's pattern.
          ...(dots > 0 && {
            backgroundImage: `radial-gradient(circle, ${alpha(ink, dots)} ${u(OG_DOT_RADIUS)}, transparent ${u(OG_DOT_RADIUS + 0.1)})`,
            backgroundSize: `${u(OG_DOT_SPACING)} ${u(OG_DOT_SPACING)}`,
            backgroundPosition: `${u(-OG_DOT_SPACING / 2)} ${u(-OG_DOT_SPACING / 2)}`,
          }),
        }}
      >
        {/* Wordmark: "skill", a 12px square 7px either side, "icons". */}
        <span
          className="flex items-center font-bold tracking-[-0.03em]"
          style={{
            ...at(OG_PAD_X, OG_PAD_Y),
            height: u(OG_HEADER_HEIGHT),
            fontSize: u(30),
          }}
        >
          skill
          <span
            className="inline-block rotate-12"
            style={{
              width: u(12),
              height: u(12),
              margin: `0 ${u(7)}`,
              background: OG_ACCENT,
              border: `${u(3)} solid ${OG_INK}`,
            }}
          />
          icons
        </span>

        <span
          className="absolute flex items-center font-mono font-semibold"
          style={{
            background: OG_ACCENT,
            color: OG_INK,
            right: u(OG_PAD_X),
            top: u(headerCenter - 22),
            height: u(44),
            padding: `0 ${u(18)}`,
            borderRadius: u(22),
            fontSize: u(20),
          }}
        >
          {icons.length} skill{icons.length === 1 ? '' : 's'}
        </span>

        <span
          className="flex items-center font-bold whitespace-nowrap"
          style={{
            ...at(OG_PAD_X, titleTop),
            right: u(OG_PAD_X),
            height: u(OG_TITLE_SIZE),
            fontSize: u(titleSize),
            letterSpacing: '-0.035em',
          }}
        >
          {title}
        </span>

        {icons.slice(0, shown).map((name, index) => (
          <img
            key={name}
            src={iconSrc(name, theme)}
            alt=""
            style={{
              ...tile(index),
              // The worker's 2px outline <rect>, just outside the tile.
              ...(outlined && {
                borderRadius: u(size * OG_TILE_RADIUS),
                boxShadow: `0 0 0 ${u(2)} ${alpha(ink, line)}`,
              }),
            }}
          />
        ))}
        {extra > 0 && (
          <span
            className="flex items-center justify-center font-mono font-semibold"
            style={{
              ...tile(shown),
              border: `${u(3)} dashed ${alpha(ink, dash)}`,
              borderRadius: u(size * OG_TILE_RADIUS),
              fontSize: u(28),
            }}
          >
            +{extra}
          </span>
        )}

        <span
          style={{
            background: alpha(ink, line),
            ...at(OG_PAD_X, OG_FOOTER_TOP),
            right: u(OG_PAD_X),
            height: u(2),
          }}
        />
        {/* A 40px row whose text sits on the PNG's baseline (lowercase centers ~0.3em above it). */}
        <span
          className="flex items-center justify-between gap-[2cqw] font-mono whitespace-nowrap"
          style={{
            ...at(OG_PAD_X, OG_FOOTER_BASELINE - 6 - 20),
            right: u(OG_PAD_X),
            height: u(40),
            fontSize: u(20),
          }}
        >
          <span className="min-w-0 truncate" style={{ color: muted }}>
            {href}
          </span>
          <span style={{ color: cta, fontWeight: ctaWeight }}>build yours →</span>
        </span>
      </div>
    </div>
  );
}
