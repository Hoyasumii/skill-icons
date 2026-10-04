import type { CSSProperties } from 'react';
import { iconSrc } from '@/lib/icons';
import {
  OG_FOOTER_BASELINE,
  OG_FOOTER_TOP,
  OG_HEADER_HEIGHT,
  OG_HEIGHT,
  OG_PAD_X,
  OG_PAD_Y,
  OG_TITLE_SIZE,
  OG_WIDTH,
  ogLayout,
} from '../../shared/og-layout';

/** px of the 1200px-wide image → container units, so the card scales with its box. */
const u = (px: number) => `${(px / OG_WIDTH) * 100}cqw`;

const INK = '#111111';
const MUTED = '#5c5c56';

interface OgCoverProps {
  icons: string[];
  title: string;
  /** The /icons link the footer shows. */
  link: string;
}

/**
 * The card the Worker renders at /og, drawn in HTML from the same geometry (shared/og-layout.ts).
 * Fixed white and ink like the PNG; the icons are always the dark ones.
 */
export function OgCover({ icons, title, link }: OgCoverProps) {
  const { shown, extra, size, titleTop, titleSize, cell, href } = ogLayout(
    icons.length,
    title,
    link,
  );
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
        className="relative overflow-hidden bg-white leading-none"
        style={{ aspectRatio: `${OG_WIDTH} / ${OG_HEIGHT}`, color: INK }}
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
            className="inline-block rotate-12 bg-highlight"
            style={{
              width: u(12),
              height: u(12),
              margin: `0 ${u(7)}`,
              border: `${u(3)} solid ${INK}`,
            }}
          />
          icons
        </span>

        <span
          className="absolute flex items-center bg-highlight font-mono font-semibold"
          style={{
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
          <img key={name} src={iconSrc(name, 'dark')} alt="" style={tile(index)} />
        ))}
        {extra > 0 && (
          <span
            className="flex items-center justify-center font-mono font-semibold"
            style={{
              ...tile(shown),
              border: `${u(3)} dashed rgb(17 17 17 / 0.2)`,
              borderRadius: u(size * 0.234),
              fontSize: u(28),
            }}
          >
            +{extra}
          </span>
        )}

        <span
          style={{
            ...at(OG_PAD_X, OG_FOOTER_TOP),
            right: u(OG_PAD_X),
            height: u(2),
            background: 'rgb(17 17 17 / 0.14)',
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
          <span className="min-w-0 truncate" style={{ color: MUTED }}>
            {href}
          </span>
          <span>build yours →</span>
        </span>
      </div>
    </div>
  );
}
