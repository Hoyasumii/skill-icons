#!/usr/bin/env python3
"""Swap the theme background of the themed icons (*-Dark.svg / *-Light.svg).

The background color is replaced everywhere it is used as a color in the file, so
logo cutouts painted with the background (e.g. Pnpm) follow the new theme. Each
color is only touched in files of its own theme: #242938 is also a logo color in
some Light icons. Single-file icons use a brand background and are ignored.

Usage:
  python3 scripts/retheme-icons.py --dark '#1B1F2A' --light '#FAFAF7' [--keep-named] [--dry-run]
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

DEFAULT_FROM = {'dark': '#242938', 'light': '#F4F2ED'}
# Off-by-a-bit backgrounds found in the current icons; normalized to the new color.
KNOWN_VARIANTS = {'dark': {'black'}, 'light': {'#F4F4ED', '#F4F2EE', 'white'}}

HEX = re.compile(r'^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$', re.I)
# Clip paths and masks hold full-size white rects that are not the background.
HIDDEN = re.compile(r'<(defs|clipPath|mask)\b.*?</\1>', re.S | re.I)
BG_RECT = re.compile(r'<rect\b(?=[^>]*\bwidth="256")(?=[^>]*\bheight="256")(?![^>]*\s[xy]=")[^>]*>', re.I)
BG_PATH = re.compile(r'<path\b(?=[^>]*\bd="M196 0H60C26\.86)[^>]*>', re.I)
FILL = re.compile(r'\bfill="([^"]*)"', re.I)


def hex_color(value: str) -> str:
    if not HEX.match(value):
        raise argparse.ArgumentTypeError(f'not a hex color: {value}')
    return value.upper()


def find_background(svg: str) -> tuple[str, str] | None:
    """Return (tag, fill) of the element painting the canvas background."""
    visible = HIDDEN.sub('', svg)
    matches = [m for m in (BG_RECT.search(visible), BG_PATH.search(visible)) if m]
    if not matches:
        return None
    tag = min(matches, key=lambda m: m.start()).group(0)
    fill = FILL.search(tag)
    return (tag, fill.group(1)) if fill else None


def replace_color(svg: str, old: str, new: str) -> tuple[str, int]:
    """Replace a hex color in color attributes and style declarations."""
    color = re.escape(old) + r'(?![0-9a-f])'
    attr = re.compile(r'(\b(?:fill|stroke|stop-color|flood-color)\s*=\s*["\'])' + color, re.I)
    style = re.compile(r'(\b(?:fill|stroke|stop-color|flood-color)\s*:\s*)' + color, re.I)
    svg, a = attr.subn(lambda m: m.group(1) + new, svg)
    svg, b = style.subn(lambda m: m.group(1) + new, svg)
    return svg, a + b


def retheme(svg: str, theme: str, old: str, new: str, keep_named: bool = False) -> tuple[str, int, str | None, str | None]:
    """Return (new svg, number of swaps, warning, skip note)."""
    background = find_background(svg)
    if not background:
        return svg, 0, 'no background found', None
    tag, fill = background
    detected = fill.upper() if HEX.match(fill) else fill.lower()

    variants = KNOWN_VARIANTS[theme] if old == DEFAULT_FROM[theme] else set()
    if detected not in {old, new} | {v.upper() if HEX.match(v) else v for v in variants}:
        return svg, 0, f'unexpected background {fill}, skipped', None
    if keep_named and not HEX.match(detected):
        return svg, 0, None, f'brand background {fill}, kept'

    count = 0
    if not HEX.match(detected):
        # Named colors (black) also appear in logos: only swap them on the background.
        svg = svg.replace(tag, FILL.sub(f'fill="{new}"', tag, count=1), 1)
        count += 1
    for color in {old, detected} - {new}:
        if HEX.match(color):
            svg, n = replace_color(svg, color, new)
            count += n
    return svg, count, None, None


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--dark', type=hex_color, help='new dark background')
    parser.add_argument('--light', type=hex_color, help='new light background')
    parser.add_argument('--from-dark', type=hex_color, default=DEFAULT_FROM['dark'], help='current dark background')
    parser.add_argument('--from-light', type=hex_color, default=DEFAULT_FROM['light'], help='current light background')
    parser.add_argument('--icons-dir', type=Path, default=Path(__file__).resolve().parent.parent / 'icons')
    parser.add_argument('--keep-named', action='store_true', help='keep named-color brand backgrounds (white, black)')
    parser.add_argument('--dry-run', action='store_true', help='show what would change without writing')
    args = parser.parse_args()

    targets = {t: (old, new) for t, old, new in (
        ('dark', args.from_dark, args.dark),
        ('light', args.from_light, args.light),
    ) if new}
    if not targets:
        parser.error('pass --dark and/or --light')

    exit_code = 0
    for theme, (old, new) in targets.items():
        suffix = f'-{theme.capitalize()}.svg'
        changed = swaps = 0
        for path in sorted(args.icons_dir.glob(f'*{suffix}')):
            svg = path.read_text(encoding='utf-8')
            result, count, warning, note = retheme(svg, theme, old, new, args.keep_named)
            if warning:
                print(f'  warning: {path.name}: {warning}', file=sys.stderr)
                exit_code = 1
                continue
            if note:
                print(f'  skipped: {path.name}: {note}', file=sys.stderr)
                continue
            if result == svg:
                continue
            changed += 1
            swaps += count
            if args.dry_run:
                print(f'  {path.name}: {count} swap(s)')
            else:
                path.write_text(result, encoding='utf-8')
        verb = 'would change' if args.dry_run else 'changed'
        print(f'{theme}: {old} -> {new}: {verb} {changed} file(s), {swaps} swap(s)')
    return exit_code


if __name__ == '__main__':
    sys.exit(main())
