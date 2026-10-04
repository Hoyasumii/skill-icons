---
name: skill-icons-og
description: Generate Skill Icons Open Graph images (1200x630 PNG) — the static site image or one for a shared stack link (?i=…). Use when asked for an OG image, social preview, link preview card or og:image for the site or a stack.
---

# Skill Icons · Open Graph images

Renders the two Open Graph images from the design system v3 (artboards **OG · site** and
**OG · pilha compartilhada** in the design canvas) as 1200×630 PNGs, using headless Chromium.

| Variant | When | Look |
|---|---|---|
| `site` | the home page's `og:image` (`public/og.png`) | stone `#EDEDE8` background, wordmark, headline "Build your stack. Paste it in your README." with a yellow highlight, a tilted 4×4 cluster of icons, footer with the site URL |
| `stack` | a shared link with `?i=…` | white background, ink text, yellow pill "N skills", the stack title (default "My skills"), icons in up to 8 columns × 2 rows (`+N` tile when there are more), footer with the share URL and "build yours →" |

Rules that must not drift: icons in both images always use the **dark variant** (`-Dark.svg`),
whatever the `theme` in the link; text is ink `#111111`; the only accent is `#FFD21F`.

## Requirements

- Python 3.10+ and Playwright with Chromium: `pip install playwright && python -m playwright install chromium`.
- The icon SVGs: the repo's `icons/` folder (or `public/svg/` after `bun run icons`).
- Fonts ship in `assets/fonts/` (Familjen Grotesk, IBM Plex Mono — OFL), no network needed.

## Usage

Run from the repo root (the script reads aliases such as `ts` → `typescript` from `shared/icons.ts`):

```sh
# Site image
python .claude/skills/skill-icons-og/scripts/render_og.py site --icons-dir icons --out public/og.png

# A shared link (icons and optional title come from the URL: ?i=ts,react&title=…)
python .claude/skills/skill-icons-og/scripts/render_og.py stack --icons-dir icons \
  --url "https://hoyasumii.github.io/skill-icons/?i=ts,react,bun" --out og-stack.png

# Explicit icons and title
python .claude/skills/skill-icons-og/scripts/render_og.py stack --icons-dir icons \
  --icons ts,react,bun,postgres --title "Stack do trabalho" --out og-stack.png
```

Options: `--repo` (repo root, defaults to the parent of `--icons-dir`), `--title` (max 40 chars,
default "My skills"; a `title` query param in `--url` is used when `--title` is not given).
Unknown names are skipped and listed on stderr; the command fails only if no icon resolves.

## Workflow

1. Confirm which variant is needed and where the PNG goes (`public/og.png` for the site).
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
