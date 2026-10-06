---
name: skill-icons-og
description: Generate Skill Icons Open Graph images (1200x630 PNG) — the static site image or one for a shared stack link (?i=…). Use when asked for an OG image, social preview, link preview card or og:image for the site or a stack.
---

# Skill Icons · Open Graph images

Renders the two Open Graph images from the design system v3 (artboards **OG · site** and
**OG · pilha compartilhada** in the design canvas) as 1200×630 PNGs, using headless Chromium.

| Variant | When | Look |
|---|---|---|
| `site` | the home page's `og:image` (`public/og-site.png`) | stone `#EDEDE8` background, wordmark, headline "Build your stack. Paste it in your README." with a yellow highlight, a tilted 4×4 cluster of icons, footer with the site URL |
| `site --bg dark` | `public/og-site-dark.png`, the `og:image` of any page link with `?bg=dark` (the Worker swaps it in) and the README cover in dark mode | the artboard **OG · site · escuro**: same layout on `#141414` with a 24px dot grid, `#F1F1EC` text, a yellow footer dot, and a 2px `rgb(241 241 236 / .16)` ring on the tiles without the yellow highlight |
| `stack` | a shared link with `?i=…` | white background and ink text (`#1E1E1E` / `#F1F1EC` with `bg=dark`), yellow pill "N skills", the stack title (default "My skills"), icons in up to 8 columns × 2 rows (`+N` tile when there are more), footer with the share URL and "build yours →" |

Rules that must not drift: this script draws the defaults, icons in the **dark variant**
(`-Dark.svg`) and ink `#111111` text; the only accent is `#FFD21F`. The Worker's `/og` follows the
link instead: icons in its `theme`, colors from `bg` (`OG_PALETTE` in `shared/og-layout.ts`).

## Requirements

- Python 3.10+ and Playwright with Chromium: `pip install playwright && python -m playwright install chromium`.
- The icon SVGs: the repo's `icons/` folder (or `public/svg/` after `bun run icons`).
- Fonts ship in `assets/fonts/` (Familjen Grotesk, IBM Plex Mono — OFL), no network needed.

## Usage

Run from the repo root (the script reads aliases such as `ts` → `typescript` from `shared/icons.ts`):

```sh
# Both site images (light and dark), the same as `bun run og`
python .claude/skills/skill-icons-og/scripts/render_og.py site --icons-dir icons --out public/og-site.png
python .claude/skills/skill-icons-og/scripts/render_og.py site --icons-dir icons --bg dark --out public/og-site-dark.png

# A shared link (icons and optional title come from the URL: ?i=ts,react&title=…)
python .claude/skills/skill-icons-og/scripts/render_og.py stack --icons-dir icons \
  --url "https://hoyasumii.github.io/skill-icons/?i=ts,react,bun" --out og-stack.png

# Explicit icons and title
python .claude/skills/skill-icons-og/scripts/render_og.py stack --icons-dir icons \
  --icons ts,react,bun,postgres --title "Stack do trabalho" --out og-stack.png
```

The site images' footer shows "N icons", counted from `--icons-dir` with each icon's `-Dark`/`-Light`
variants counted once (the same count as `/api/icons`). Run `bun run og` again whenever icons are added
or removed, so both covers keep the right number.

Options: `--bg` (`light` or `dark`, site image only), `--repo` (repo root, defaults to the parent of `--icons-dir`), `--title` (max 40 chars,
default "My skills"; a `title` query param in `--url` is used when `--title` is not given).
Unknown names are skipped and listed on stderr; the command fails only if no icon resolves.

## Workflow

1. Confirm which variant is needed and where the PNG goes (`public/og-site.png` and
   `public/og-site-dark.png` for the site: always render both).
2. Run the script. Open the PNG and look at it before reporting: the title must not be cut,
   icons must all load (no empty squares), the footer must stay on one line.
3. For the site image, make sure `index.html` has `og:image` (absolute URL),
   `og:image:width` 1200, `og:image:height` 630, `twitter:card` `summary_large_image`.
4. For per-link images on the Worker, reuse `assets/template.html` as the visual reference
   (Satori/`workers-og` there); this script is for static or batch generation.

## Changing the look

All layout lives in `assets/template.html` (one `<style>` block; `.site*` and `.stack*` classes).
Default site icons, highlighted tiles and tilts are constants at the top of `scripts/render_og.py`.
Keep both in sync with the design canvas.
