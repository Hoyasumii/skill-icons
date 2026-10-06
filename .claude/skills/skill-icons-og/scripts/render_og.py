#!/usr/bin/env python3
"""Render Skill Icons Open Graph images (1200x630 PNG).

Two variants, matching the design canvas (artboards "OG · site" and "OG · pilha compartilhada"):
  site   - static image for the home page (stone background, headline, tilted icon cluster)
  stack  - image for a shared stack link (white background, title, icon grid, share URL)

Icons always use the dark variant (-Dark.svg) in both images.

Examples:
  python render_og.py site  --icons-dir ./icons --out public/og-site.png
  python render_og.py stack --icons-dir ./icons --url "https://hoyasumii.github.io/skill-icons/?i=ts,react,bun" --out og-stack.png
  python render_og.py stack --icons-dir ./icons --icons ts,react,bun --title "Stack do trabalho" --out og.png
"""
from __future__ import annotations

import argparse
import html
import re
import sys
from pathlib import Path
from urllib.parse import parse_qs, urlparse

HERE = Path(__file__).resolve().parent
ASSETS = HERE.parent / "assets"
FONTS = ASSETS / "fonts"

SITE_URL = "skill-icons.alanreisanjo.workers.dev"
DEFAULT_SITE_ICONS = [
    "ts", "react", "rust", "docker", "bun", "postgres", "figma", "python",
    "git", "tailwind", "vite", "github", "svelte", "claude", "astro", "vue",
]
# Tiles that get the yellow highlight in the site image (index in the 4x4 cluster).
SITE_HIGHLIGHTS = {1, 6, 11}
SITE_TILTS = [-6, 4, -3, 8, 5, -9, 3, -4, -7, 6, -2, 10, 4, -8, 3, -5]

MAX_STACK = 16  # 8 columns x 2 rows; the rest becomes "+N"


def load_aliases(repo: Path | None) -> dict[str, str]:
    """Reads the shortNames map from shared/icons.ts so `ts` resolves to `typescript`."""
    if not repo:
        return {}
    src = repo / "shared" / "icons.ts"
    if not src.exists():
        return {}
    block = re.search(r"shortNames[^=]*=\s*\{(.*?)\n\};", src.read_text(), re.S)
    if not block:
        return {}
    return {k: v for k, v in re.findall(r"['\"]?([\w.+-]+)['\"]?\s*:\s*['\"]([\w.+-]+)['\"]", block.group(1))}


def index_icons(icons_dir: Path) -> dict[str, Path]:
    return {p.stem.lower(): p.resolve() for p in icons_dir.glob("*.svg")}


def resolve(name: str, files: dict[str, Path], aliases: dict[str, str]) -> Path | None:
    key = name.strip().lower()
    key = aliases.get(key, key)
    return files.get(f"{key}-dark") or files.get(key)


def font_css() -> str:
    def face(family: str, file: str, weight: str) -> str:
        return (
            f"@font-face{{font-family:'{family}';src:url('{(FONTS / file).as_uri()}') format('truetype');"
            f"font-weight:{weight};font-style:normal;}}"
        )

    return "".join(
        [
            face("Familjen Grotesk", "FamiljenGrotesk-Variable.ttf", "400 700"),
            face("IBM Plex Mono", "IBMPlexMono-Regular.ttf", "400"),
            face("IBM Plex Mono", "IBMPlexMono-Medium.ttf", "500"),
            face("IBM Plex Mono", "IBMPlexMono-SemiBold.ttf", "600"),
        ]
    )


def wordmark(size: int, square: int, border: int, ink: str) -> str:
    return (
        f'<span class="wm" style="font-size:{size}px">skill'
        f'<span style="width:{square}px;height:{square}px;border:{border}px solid {ink};'
        f'margin:0 {max(2, border)}px"></span>icons</span>'
    )


def page(body: str, background: str, ink: str) -> str:
    template = (ASSETS / "template.html").read_text()
    return (
        template.replace("/*FONTS*/", font_css())
        .replace("{{BG}}", background)
        .replace("{{INK}}", ink)
        .replace("{{BODY}}", body)
    )


def build_site(icons: list[Path]) -> str:
    tiles = []
    for i, path in enumerate(icons[:16]):
        bg = "#FFD21F" if i in SITE_HIGHLIGHTS else "transparent"
        tiles.append(
            f'<span class="tile" style="background:{bg};transform:rotate({SITE_TILTS[i % len(SITE_TILTS)]}deg)">'
            f'<img src="{path.as_uri()}" alt=""></span>'
        )
    body = f"""
<div class="site">
  <div class="site-copy">
    {wordmark(40, 16, 4, '#111111')}
    <h1>Build your stack.<br>Paste it in your <mark>README</mark>.</h1>
    <div class="site-foot"><span>{SITE_URL}</span><i></i><span class="muted">371 icons · npm package</span></div>
  </div>
  <div class="cluster">{''.join(tiles)}</div>
</div>"""
    return page(body, "#EDEDE8", "#111111")


def build_stack(icons: list[Path], title: str, share: str) -> str:
    shown = icons[:MAX_STACK]
    extra = len(icons) - len(shown)
    if extra > 0:
        shown = icons[: MAX_STACK - 1]
        extra = len(icons) - len(shown)
    cells = "".join(f'<img src="{p.as_uri()}" alt="">' for p in shown)
    if extra > 0:
        cells += f'<span class="more">+{extra}</span>'
    count = len(icons)
    label = f"{count} skill" + ("" if count == 1 else "s")
    url = share if len(share) <= 64 else share[:63] + "…"
    size = 104 if len(shown) + (1 if extra else 0) <= 8 else 92
    body = f"""
<div class="stack">
  <div class="row">{wordmark(30, 12, 3, '#111111')}<span class="pill">{html.escape(label)}</span></div>
  <div class="mid">
    <h1>{html.escape(title)}</h1>
    <div class="grid" style="--s:{size}px">{cells}</div>
  </div>
  <div class="row foot"><span class="muted">{html.escape(url)}</span><span>build yours →</span></div>
</div>"""
    return page(body, "#FFFFFF", "#111111")


def screenshot(markup: str, out: Path) -> None:
    from playwright.sync_api import sync_playwright

    tmp = out.with_suffix(".og.html")
    tmp.write_text(markup)
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            pg = browser.new_page(viewport={"width": 1200, "height": 630}, device_scale_factor=1)
            pg.goto(tmp.as_uri())
            pg.evaluate("document.fonts.ready")
            pg.wait_for_function("Array.from(document.images).every(i => i.complete)")
            pg.screenshot(path=str(out), clip={"x": 0, "y": 0, "width": 1200, "height": 630})
            browser.close()
    finally:
        tmp.unlink(missing_ok=True)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("variant", choices=["site", "stack"])
    ap.add_argument("--icons-dir", required=True, type=Path, help="folder with the icon SVGs (repo icons/ or public/svg/)")
    ap.add_argument("--repo", type=Path, help="repo root, to read aliases from shared/icons.ts (default: parent of --icons-dir)")
    ap.add_argument("--url", help="share link; its i= param gives the icons")
    ap.add_argument("--icons", help="comma-separated icon names or aliases (overrides --url)")
    ap.add_argument("--title", default="My skills", help="stack title (default: My skills)")
    ap.add_argument("--out", required=True, type=Path)
    args = ap.parse_args()

    files = index_icons(args.icons_dir)
    if not files:
        print(f"No SVGs in {args.icons_dir}", file=sys.stderr)
        return 1
    aliases = load_aliases(args.repo or args.icons_dir.parent)

    if args.icons:
        names = [n for n in args.icons.split(",") if n.strip()]
    elif args.url:
        q = parse_qs(urlparse(args.url).query)
        names = [n for n in (q.get("i", [""])[0]).split(",") if n.strip()]
        if args.title == "My skills" and q.get("title"):
            args.title = q["title"][0]
    else:
        names = DEFAULT_SITE_ICONS if args.variant == "site" else []

    resolved, missing = [], []
    for n in names:
        path = resolve(n, files, aliases)
        if path is None:
            missing.append(n)
        elif path not in resolved:
            resolved.append(path)
    if missing:
        print("Unknown icons (skipped): " + ", ".join(missing), file=sys.stderr)
    if not resolved:
        print("No valid icons to draw.", file=sys.stderr)
        return 1

    if args.variant == "site":
        markup = build_site(resolved)
    else:
        share = args.url or f"{SITE_URL}/?i={','.join(names)}"
        share = re.sub(r"^https?://", "", share)
        markup = build_stack(resolved, args.title.strip()[:40] or "My skills", share)

    args.out = args.out.resolve()
    args.out.parent.mkdir(parents=True, exist_ok=True)
    screenshot(markup, args.out)
    print(f"Wrote {args.out} ({len(resolved)} icons)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
