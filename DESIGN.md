# Skill Icons — Design System v3 (“Marca-texto”)

Spec for replacing the current shadcn neutral look with the new mobile-first builder.
Source of truth: the Design canvas “Skill Icons Design System” (artboards **Nova · Mobile / Tablet / Desktop** and **Novo system design**).

> For Claude Code: apply this to the existing app in `src/`. Keep the current architecture
> (React 19, Tailwind v4, shadcn primitives in `src/components/ui`, `useBuilderState`, i18n in
> `src/i18n`). Restyle the primitives through the CSS variables below first, then rebuild the
> feature components (`icon-picker`, `selected-icons`, `options`, `output`, header) following
> the component specs. All UI copy goes through i18n (`en` + `pt-BR`).

---

## 1. Principles

1. **The icons are the color.** The UI is stone gray + ink. One loud accent (highlighter yellow) marks _your_ things: selected icons, active nav, the primary action.
2. **Mobile first, thumb first.** Every interactive target is ≥ 44 × 44 px. The primary action lives in a bottom dock on small screens.
3. **Firm, not soft.** 2 px ink borders for emphasis, 1 px hairlines for structure. No gradients, no glass, no blur, no emoji, no glow. Hard offset shadows only on the primary CTA and the language popover.
4. **Playful in motion, calm at rest.** Springy micro-interactions on add / reorder / copy; nothing moves on its own.
5. **Mono for machine things.** Labels, counts, positions, hints and code use the mono face.

---

## 2. Tokens

### 2.1 Color

| Token                              | Light                 | Dark                     | Use                                                                       |
| ---------------------------------- | --------------------- | ------------------------ | ------------------------------------------------------------------------- |
| `--background`                     | `#EDEDE8`             | `#141414`                | Page (stone / near-black)                                                 |
| `--foreground` (ink)               | `#111111`             | `#F1F1EC`                | Text, 2 px borders, active segment, order badge                           |
| `--card` (surface)                 | `#FFFFFF`             | `#1E1E1E`                | Tiles, inputs, panels, sheet                                              |
| `--muted` (soft)                   | `#E3E3DD`             | `#262626`                | Segmented-control track, stack tray, code block                           |
| `--muted-foreground`               | `#5C5C56`             | `#A6A69F`                | Secondary text, mono labels (≥ 4.5:1 on bg)                               |
| `--border` (hair)                  | `rgb(17 17 17 / .14)` | `rgb(241 241 236 / .16)` | 1 px dividers, idle tile borders, dashed empty states                     |
| `--input`                          | = foreground          | = foreground             | Search input border (2 px)                                                |
| `--ring`                           | = foreground          | = foreground             | Focus ring                                                                |
| `--primary`                        | `#111111`             | `#F1F1EC`                | Active segment / active chip fill                                         |
| `--primary-foreground`             | `#EDEDE8`             | `#141414`                | Text on primary                                                           |
| `--highlight`                      | `#FFD21F`             | `#FFD21F`                | Selected tile, active sidebar item, selected language, CTA, logo square   |
| `--highlight-foreground`           | `#111111`             | `#111111`                | Text/icons on highlight (always ink, both themes)                         |
| `--accent` / `--secondary`         | = muted               | = muted                  | shadcn hover surfaces (keep yellow OUT of these)                          |
| `--destructive`                    | `#C40C0C`             | `#FF6B6B`                | Errors only                                                               |
| `--scrim`                          | `rgb(17 17 17 / .45)` | `rgb(0 0 0 / .6)`        | Behind the bottom sheet                                                   |
| `--swatch-dark` / `--swatch-light` | `#262626` / `#E3E3DD` | same                     | The icons' own tile colors: active icon-theme tile (fixed in both themes) |

The README preview has no tokens of its own: it sits on `--background` and follows the _site_ theme
(only its icons follow the icon theme). The package popover's scrim is lighter than `--scrim`:
`rgb(17 17 17 / .16)` light, `rgb(0 0 0 / .38)` dark. The OpenGraph cover is fixed white + ink in
both themes, like the PNG it reproduces.

The **dock** inverts the theme: background `--foreground`, text `--background`.

### 2.2 Typography

- **Sans:** Familjen Grotesk (variable 400–700) — `@fontsource-variable/familjen-grotesk`
- **Mono:** IBM Plex Mono 400 / 500 / 600 — `@fontsource/ibm-plex-mono`
- Remove `@fontsource-variable/geist`.

| Role                       | Face | Size / line | Weight    | Tracking                                |
| -------------------------- | ---- | ----------- | --------- | --------------------------------------- |
| Wordmark                   | sans | 22 / 1      | 700       | −0.03em                                 |
| Panel title (“Sua pilha”)  | sans | 24 / 1.2    | 700       | −0.02em                                 |
| README heading             | sans | 18          | 700       | −0.01em                                 |
| CTA                        | sans | 17          | 700       | —                                       |
| Card / preset title, input | sans | 16          | 600 / 400 | — (input stays 16 px to avoid iOS zoom) |
| Body, buttons, chips       | sans | 15 / 20     | 400–600   | —                                       |
| Section label              | mono | 11          | 500       | 0.08em, UPPERCASE                       |
| Hint, count                | mono | 12          | 400–500   | —                                       |
| Code                       | mono | 13 / 19     | 400       | —                                       |
| Order badge                | mono | 11          | 600       | tabular-nums                            |

### 2.3 Radius

`--radius: 0.75rem` (12 px) is the default for inputs, tiles, cards, CTA, segmented tracks.
Inner segments / small buttons 9–10 px · sidebar item 8 px · chips & badges full ·
dock top corners 18 px · sheet top corners 22 px.

### 2.4 Space & layout

- 4 px base. Common gaps: 6, 8, 10, 12, 16, 20, 24.
- Page gutter: **16 px** compact, **24 px** wide. Header height **64 px**.
- **Breakpoint: 1024 px** (`lg`). Below = _compact_, at/above = _wide_.
  - Compact: header → scrolling main (search, category rail, presets rail, grid) → **sticky dock** at the bottom → export lives in a **bottom sheet** (max-height 88%).
  - Wide: `grid-template-columns: 232px minmax(0,1fr) 400px` — category sidebar / picker / sticky export panel. Each column scrolls independently; page height = 100dvh.
- Icon grid: `repeat(auto-fill, minmax(62px, 1fr))` compact, `minmax(76px, 1fr)` wide; gap 10.
- Presets: horizontal rail (compact, bleeds to screen edge) → 4-column grid (wide).

### 2.5 Borders, elevation, focus

- Emphasis border: **2 px solid ink** (search input, preset “in stack”, CTA, lifted controls, language popover). Icons themselves never get a border.
- Structure: 1 px hair. Empty states: 2 px dashed hair.
- Hard shadows only: CTA `3px 3px 0 var(--foreground)`, language popover and framework list `4px 4px 0 var(--foreground)`. The package popover adds a soft drop under the hard one: `4px 4px 0 var(--foreground), 0 24px 48px rgb(0 0 0 / .18)`. Pressed / copied: `translate(3px,3px)` + shadow `0`.
- Focus-visible: `outline: 2px solid var(--ring); outline-offset: 2px` on every control.

### 2.6 Motion

| Name                     | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Where                                               |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `--ease-spring`          | `cubic-bezier(0.34, 1.8, 0.64, 1)`                                                                                                                                                                                                                                                                                                                                                                                                                                                          | icon pop, theme toggle                              |
| `--ease-sheet`           | `cubic-bezier(0.32, 1.25, 0.5, 1)`                                                                                                                                                                                                                                                                                                                                                                                                                                                          | bottom sheet                                        |
| Pop                      | 340 ms; on add: `rotate(θ) scale(1.22)` held 260 ms, then back. θ cycles `[-12, 9, -7, 14, -16, 6]°` by index                                                                                                                                                                                                                                                                                                                                                                               | grid tile, stack item, presets (all), shuffle (all) |
| Selected rest            | `scale(0.9)` on the tile image                                                                                                                                                                                                                                                                                                                                                                                                                                                              | grid tile                                           |
| Lifted                   | `translateY(-3px)`                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | stack item                                          |
| Theme switch             | **circular reveal**: View Transitions API (`document.startViewTransition`), new theme grows as `clip-path: circle()` from the toggle button's center to the farthest corner, 620 ms `cubic-bezier(0.7,0,0.2,1)`; old/new snapshots keep opacity 1 (override the default cross-fade). Icon also rotates +180° (520 ms spring). Fallback without the API or with reduced motion: instant swap. Never animate `background` with CSS transitions on the root (it would leak into the snapshot). | header                                              |
| Sheet                    | `translateY(105%) → 0`, 380 ms                                                                                                                                                                                                                                                                                                                                                                                                                                                              | compact export                                      |
| Package popover          | `translateY(-8px) scale(.96)` → none, 300 ms `cubic-bezier(.34,1.56,.64,1)`, `transform-origin` on the arrow; exit 140 ms fade                                                                                                                                                                                                                                                                                                                                                              | stack header                                        |
| Preview flip             | `perspective: 1400px`; inner `rotateY(180deg)`, 640 ms `--ease-sheet`. Card height follows the visible face: 620 ms `cubic-bezier(.65,0,.35,1)` during the turn (changes near edge-on), 240 ms `cubic-bezier(.22,1,.36,1)` for content changes                                                                                                                                                                                                                                              | preview                                             |
| Copy press               | 120 ms                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | CTA                                                 |
| `prefers-reduced-motion` | disable transforms/transitions (keep color changes)                                                                                                                                                                                                                                                                                                                                                                                                                                         | everywhere                                          |

---

## 3. `src/index.css` (replace tokens)

```css
@import 'tailwindcss';
@import 'tw-animate-css';
@import 'shadcn/tailwind.css';
@import '@fontsource-variable/familjen-grotesk';
@import '@fontsource/ibm-plex-mono/400.css';
@import '@fontsource/ibm-plex-mono/500.css';
@import '@fontsource/ibm-plex-mono/600.css';

@custom-variant dark (&:is(.dark *));

@theme inline {
  --font-sans: 'Familjen Grotesk Variable', system-ui, sans-serif;
  --font-heading: var(--font-sans);
  --font-mono: 'IBM Plex Mono', ui-monospace, monospace;

  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--foreground);
  --color-popover: var(--card);
  --color-popover-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--muted);
  --color-secondary-foreground: var(--foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--muted);
  --color-accent-foreground: var(--foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-highlight: var(--highlight);
  --color-highlight-foreground: var(--highlight-foreground);
  --color-scrim: var(--scrim);

  --radius-sm: 8px;
  --radius-md: 10px;
  --radius-lg: var(--radius);
  --radius-xl: 18px;
  --radius-2xl: 22px;

  --ease-spring: cubic-bezier(0.34, 1.8, 0.64, 1);
  --ease-sheet: cubic-bezier(0.32, 1.25, 0.5, 1);
  --shadow-cta: 3px 3px 0 var(--foreground);
}

:root {
  --radius: 0.75rem;
  --background: #edede8;
  --foreground: #111111;
  --card: #ffffff;
  --primary: #111111;
  --primary-foreground: #edede8;
  --muted: #e3e3dd;
  --muted-foreground: #5c5c56;
  --border: rgb(17 17 17 / 0.14);
  --input: #111111;
  --ring: #111111;
  --highlight: #ffd21f;
  --highlight-foreground: #111111;
  --destructive: #c40c0c;
  --scrim: rgb(17 17 17 / 0.45);
}

.dark {
  --background: #141414;
  --foreground: #f1f1ec;
  --card: #1e1e1e;
  --primary: #f1f1ec;
  --primary-foreground: #141414;
  --muted: #262626;
  --muted-foreground: #a6a69f;
  --border: rgb(241 241 236 / 0.16);
  --input: #f1f1ec;
  --ring: #f1f1ec;
  --destructive: #ff6b6b;
  --scrim: rgb(0 0 0 / 0.6);
}

@layer base {
  * {
    @apply border-border;
  }
  html {
    @apply font-sans;
  }
  body {
    @apply bg-background text-foreground antialiased;
  }
  :focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 2px;
  }
  button:not(:disabled),
  [role='button']:not(:disabled) {
    cursor: pointer;
  }
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation: none;
    mix-blend-mode: normal;
  }
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      transition-duration: 0ms !important;
      animation: none !important;
    }
  }
}
```

---

## 4. Components

Sizes are px. “ink” = `foreground`, “hair” = `border`, “soft” = `muted`, “yellow” = `highlight`.

**Wordmark** — `skill` + square + `icons`, sans 22/700, −0.03em. Square: 9×9 yellow, 2 px ink border, `rotate(12deg)`, 3 px gap + 2 px margin each side. Use the SVGs in `public/` (`skill-icons-logo.svg`, `skill-icons-logo-dark.svg`) or render inline. Favicon: `public/skill-icons-favicon.svg`.

**LanguageMenu** (combobox) — trigger: 44 high ghost button with Lucide `Languages` 18, mono 13/600 code (`PT`/`EN`) and a chevron that rotates 180° (spring) when open; `aria-haspopup="listbox"`, `aria-expanded`; soft bg while open. Popover: `role="listbox"`, 248 wide, anchored bottom-end with 8 px offset, surface bg, **2 px ink border, radius 14, hard shadow `4px 4px 0 ink`**, padding 6. Mono 11 caps label (“IDIOMA”/“LANGUAGE”), then one `role="option"` row per locale: 48 high, radius 10, a 40×26 code chip (2 px currentColor border, mono 11/600), name 15/600 + BCP-47 tag in mono 11, check icon on the selected one. Selected row = yellow fill + ink text. Enter: `scale(.9) rotate(-2deg)` + opacity 0 → `scale(1)` in 280 ms spring; exit 140 ms fade. Closes on outside click, Escape and selection; arrow keys move between options (use Radix `DropdownMenu` RadioGroup or `Select`, restyled). Selecting switches the whole UI copy immediately.

**Header** — 64 high, 1 px hair bottom border, gutter padding. Left: wordmark (+ on wide, mono 12 muted tagline “monte sua pilha → cole no README”). Right: (wide) mono 13 “github” link · language button (mono 13/600 “PT”/“EN”, 44 hit area, opens existing dropdown) · theme toggle (44×44 ghost, 20 px Lucide Sun/Moon, triggers the circular reveal in §2.6).

**SearchInput** — 48 high, 2 px ink border, radius 12, surface bg, 16 px text, Lucide Search 20 at left 14 (padding-left 44). `type="search"`. Matches id, display name and aliases (existing logic). Placeholder: “Buscar ícone, ex.: react, ts, postgres”.

**Category icons** — every category has a Lucide glyph before its name (map in `src/lib/category-icons.ts`): all LayoutGrid · language Code · frontend Monitor · backend Server · database Database · cloud Cloud · devops Infinity · tooling Wrench · testing FlaskConical · observability Activity · auth Lock · ide SquareTerminal · ai Sparkles · design PenTool · game Gamepad2 · payments CreditCard · os Cpu · social MessageCircle · productivity SquareKanban. The grid title uses the current category's glyph.

**SectionLabel** — mono 11/500 caps, optional 13 px icon with a 6 px gap, kept beside the first line when the label wraps: Categories ListFilter · Ready-made stacks Layers · My stacks Bookmark · grid title (category glyph) · Icon theme Palette · Icons per line Columns3 · Preview Eye · Format Braces (a visible label above the format tabs, which it names).

**Icons on actions** — Lucide, 15–16 px in buttons: Remove Trash2 · Export Upload · Shuffle Shuffle · Save Bookmark. “Your stack” title SquareStack 22. Preview file name FileText. Dialog titles: Save stack Bookmark, Remove all Trash2 in `--destructive`. Hints: “tap to add” MousePointerClick 12, tray hint MoveHorizontal inline, link hint Link inline. Empty states: no search results SearchX 28 muted above the text; empty tray MousePointerClick 22 left of the text. Format tabs: Markdown Hash · HTML CodeXml · URL Link (15 px, gap 6; the three still fit at 320 px).

**CategoryChip (rail, compact)** — 40 high, pill, px 14, 15 px, 2 px border, 15 px category icon. Idle: hair border + surface. Active: ink fill + bg-colored text. Count in mono 12 at 70% opacity. Rail scrolls horizontally, bleeds to screen edges, scrollbar hidden.

**CategoryItem (sidebar, wide)** — 36 high, radius 8, full width, 16 px category icon + label (gap 10) left / mono count right. Active: yellow fill, ink text, 600. Section label “CATEGORIAS” in mono.

**PresetCard** — new feature. Button, padding 12, radius 12, 2 px border. Row of 28 px icons with a 4 px gap (no overlap, no ring), then name (16/600) + mono hint (“+3” missing / “na pilha ✓”). Tap appends missing icons in preset order and pops the whole stack. When all icons are present: yellow fill + ink border. Presets live in a new `src/lib/presets.ts`: Web moderno, Back-end, Ferramentas, IA (any list; ids must exist).

**IconTile** — square button (`aspect-ratio: 1`), padding 8, radius 14, **no border and no background when idle** (the icon's own rounded square is the shape). Selected: yellow background behind the icon, image `scale(0.86)`, **order badge** top-right (−6,−6): 22 px pill, ink bg, bg-colored mono 11/600 number = position in stack. `aria-pressed`, `aria-label` = display name, `title` on wide. Pop animation on add (see Motion). Same rule everywhere an icon appears (presets, dock, tray): no frames or rings around icons; state is shown with a yellow background only.

**Dock (compact only)** — `position: sticky; bottom: 0` inside the main scroller. Inverted colors, radius 18 18 0 0, padding 10 12 + safe-area. Contains: horizontally scrolling stack (44×44 buttons, 4 px padding) + **Export button** (48 high, yellow, 2 px border in bg color, 16/700, count pill: ink bg + yellow mono 12). Empty: “Toque nos ícones para montar sua pilha.” and Export disabled at 50%.

**Lift & controls** — tapping an item in the stack (dock or tray) _lifts_ it (`aria-pressed`, yellow background in both dock and tray, image `translateY(-3px) rotate(-6deg)`). A control row appears: name + mono `#n`, ← (44×40), → (44×40), “Remover”. Arrows disabled at the ends (35% opacity). Uses existing `moveIcon` / `toggleIcon`; lifted id is local UI state.

**StackTray (export panel/sheet)** — two header rows, in DOM order = visual order. Row 1: heading “Sua pilha” + mono zero-padded count (`05`), then at the end (`margin-left: auto`) the package icon button and, on compact, the close X. Row 2: “Salvar” and “Embaralhar” (36 high, 1 px hair; shuffle needs ≥ 2 icons). Tray: soft bg, radius 12, padding 8, wrap of 48×48 surface buttons with mono 10 position number. Below: control row when lifted, otherwise mono hint + “limpar tudo” text button. Empty: dashed box “Vazia por enquanto. Escolha ícones ou use uma pilha pronta.”

**SegmentedControl** (icon theme, format) — soft track, padding 3, radius 12; segments 40 high, radius 9, 15/600; the active one sits on a sliding surface. Use `ToggleGroup` / `Tabs` primitives restyled.

- **Icon theme** — no swatch square. Each segment is a 24 px tile (radius 7) with Moon / Sun 15 px, then the label; padding `0 8px 0 6px`, gap 7, no wrapping. Active tile: `--swatch-dark` with a `#F1F1EC` icon, or `--swatch-light` with an ink icon. Inactive tile: transparent.
- **Options layout** — icon theme and icons-per-line share a grid: `grid-template-columns: minmax(0,1fr) auto; grid-template-rows: auto auto; grid-auto-flow: column; column-gap 16; row-gap 8; align-items: end`. Both wrappers are `display: contents`, so the labels form the first row right above their controls and the controls sit side by side on the second. The per-line label has `width: 0; min-width: 100%; line-height: 15px`: it wraps inside the stepper's column without widening it, its icon on the first line. The stepper group has `min-width: 132px`, gap 8.

**Package popover** (the npm library) — opened from a 36×36 hairline icon button (Package 17) on the stack header's first row. `aria-label` = its tooltip, “Usar como pacote npm” / “Use as an npm package”, `aria-haspopup="dialog"`, `aria-expanded`; open = muted fill + ink border. The tooltip is an ink balloon below the button, aligned to its end, with an arrow; it shows on hover after 250 ms and on keyboard focus, never while the popover is open.

- **Popover** — Radix Popover, modal, anchored on the button: bottom / end, 12 px offset, arrow drawn as a rotated square whose two outer edges carry the 2 px ink border. Surface bg, 2 px ink border, radius 16, shadow `4px 4px 0 ink, 0 24px 48px rgb(0 0 0 / .18)`, width `min(400px, 100vw − 24px)`, max-height = available space with its own scroll. On wide it reaches past the panel's left edge, over the grid. A scrim covers the page behind it (see §2.1); clicking it, Escape or the X closes it. Focus goes to the X on open and back to the button on close. Emptying the stack closes it.
- **Header** — Package 20 + “Pacote” 18/700 + mono 12 muted `npm · @hoyasumii/skill-icons` (ellipsis), and the 36 px X.
- **Steps** — an `<ol>`: 24 px numbered badges (ink circle, mono 12/600; the third is yellow) joined by a 2 px `--border` connector; step titles 15/700.
  1. “Instale a lib” → **InstallRow**: mono 13 command `npm i @hoyasumii/skill-icons` in a soft box (1 px hair, radius 12, muted `$` prompt) + 48×48 icon button (Copy → Check; ink fill + bg-colored icon for 1.6 s; `aria-label` “Copiar comando de instalação”). A secondary copy: never yellow.
  2. “Escolha o framework” → **FrameworkSelect**, a combobox (Radix Select, `role="combobox"`, named by the step title). Trigger: 52 high, 2 px border (hair; ink while open), the framework's 28 px skill icon, name 16/600, file name mono 12 muted, a ChevronDown that turns 180°. ↑/↓ on the closed trigger step through the frameworks without opening it. List: styled like the language menu (surface, 2 px ink border, radius 14, hard 4 px shadow); options 44 high with a 24 px icon, name 15/600, file name mono 11, Check on the selected one, which is yellow. Escape closes the list before the popover.
  3. “Copie o código” → CodeBlock (`tall`) with the framework snippet + the primary CTA “Copiar React / Vue / …”.
- **Footer** — one line: Package 13 + “ver no npm ↗” linking to npmjs.
- Frameworks: React · Vue · Svelte · Solid · Angular · Astro · Web Component, files `Skills.tsx`, `Skills.vue`, `Skills.svelte`, `Skills.tsx`, `skills.component.ts`, `Skills.astro`, `index.html`. While the popover is open, the preview label reads “Prévia do componente” and its strip shows that file name.
- The open state lives in the export panel; framework is local UI state. The format tabs (Markdown · HTML · URL) and their CTA are unchanged, and the hint under the CTA (“o link desta página também guarda sua pilha”) always shows.

**Stepper** (icons per line, replaces the Slider) — soft track, − and + buttons 44×40 on surface, value mono 18/600 tabular, `aria-live="polite"`. Range 1–50 (existing `MIN_PER_LINE` / `MAX_PER_LINE`).

**ReadmePreview** — a card that flips. 1 px hair, radius 12, `--background` (follows the site theme; the icons follow the icon theme).

- **Front** — header 44 min-height: FileText + mono 12 file name (“README.md”, or the framework's file) left; right, a 32 high hairline button “ver capa” / “view cover” (Image 14, mono 12). Body: the editable title (18/700, dashed underline, pencil), then the real badge image (`buildIconsUrl`). Empty text when no icons.
- **Back** — header “og:image · 1200×630” + button “ver README” / “ver componente” (RefreshCcw). The section label becomes “Capa do link · OpenGraph”. Body: the **OpenGraph cover**, then a secondary button “Copiar link com esta capa” (hairline, Link, 44 high; copied: ink fill, Check, “Link copiado!” for 1.6 s) that copies the `/icons` link with `title`, and a mono 11 note “é o que aparece ao colar o link no Discord, Slack, X ou WhatsApp”.
- **OpenGraph cover** — the Worker's `/og` card in HTML: `container-type: inline-size`, `aspect-ratio: 1200/630`, every measure in `cqw` (1 cqw = 12 px of the PNG). Wordmark, yellow “N skills” pill, title, up to 8×2 dark icons with a dashed “+N” tile, the rule, and the footer (the `/icons` link without `title` or protocol, “build yours →”). Fixed white + ink. Title = the edited title, cleaned, or “My skills”. The geometry comes from `shared/og-layout.ts`, which `worker/og.ts` also uses, so the two never drift.
- **Flip** — wrapper `perspective: 1400px`, `clip-path: inset(-120px -120px -6px -120px)` (the turn has room above and to the sides; the face turning away never covers the format tabs). Inner `transform-style: preserve-3d`, `rotateY(180deg)` in 640 ms `--ease-sheet`. Faces `backface-visibility: hidden`; the back is `rotateY(180deg)`, absolutely placed over the front. The face turning away gets `aria-hidden` and, after 300 ms (edge-on), `visibility: hidden`, which takes it out of the tab order; the face turning in is visible at once and its button takes focus. The inner's height is the visible face's, measured with a ResizeObserver (images loading, title wrapping, stack changes); `auto` before the first measure.

**CodeBlock** — soft bg, 1 px hair, radius 12, padding 12, mono 13/19, `pre-wrap` + `break-all`, max-height 132 with scroll.

**CopyButton (primary CTA)** — full width, 52 high, 2 px ink border, radius 12, yellow, 17/700, `shadow-cta`. Label names the format: “Copiar Markdown / HTML / URL”. On success: ink fill, bg-colored text, Check icon, “Copiado!”, `translate(3px,3px)` + no shadow, reverts after 1.6 s. Keep the sonner toast for errors only. Under it: mono 12 hint “o link desta página também guarda sua pilha”.

**BottomSheet (compact)** — `position: absolute/fixed`, bottom 0, radius 22 22 0 0, surface, max-height 88%, padding 20 16 28, 44×5 grab handle, scrim behind (tap closes). Hidden with `visibility: hidden` when closed. Must trap focus and close on Escape (use Radix Dialog for this).

**EmptyState** — 2 px dashed hair, radius 12, centered text 16 px, optional bordered button (44 high, 2 px ink).

---

## 5. Behavior changes vs. current app

- Breakpoint switch at 1024 px (compact ↔ wide) — see §2.4.
- New: presets, lift-to-reorder, shuffle, format-aware copy label, sticky dock + sheet, README preview.
- The library section (install + framework below the output) moves into the **Package popover**, opened from the stack header (see §4). The success toast goes away with it.
- The preview flips to the link's OpenGraph cover and copies the link that unfurls into it.
- `useBuilderState`: add `addIcons(names: string[])` (append missing, keep order) and `setIcons(names: string[])` (for shuffle). Keep URL sync.
- Slider → Stepper. Category pills → rail (compact) / sidebar (wide).
- Grid tile shows order number instead of a check, and loses its border/ring.
- Language picker becomes the themed LanguageMenu combobox.
- Theme toggle uses the circular reveal (View Transitions).
- Header: GitHub link only on wide (move it into the language menu or footer on compact).

## 6. Copy (pt-BR → en)

| Key                        | pt-BR                                                            | en                                                                          |
| -------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------- |
| tagline                    | monte sua pilha → cole no README                                 | build your stack → paste in your README                                     |
| search placeholder         | Buscar ícone, ex.: react, ts, postgres                           | Search icons, e.g. react, ts, postgres                                      |
| presets label              | Pilhas prontas · um toque adiciona tudo                          | Ready-made stacks · one tap adds them all                                   |
| grid hint                  | toque para adicionar                                             | tap to add                                                                  |
| dock empty                 | Toque nos ícones para montar sua pilha.                          | Tap icons to build your stack.                                              |
| export                     | Exportar                                                         | Export                                                                      |
| stack title                | Sua pilha                                                        | Your stack                                                                  |
| shuffle                    | Embaralhar                                                       | Shuffle                                                                     |
| clear                      | limpar tudo                                                      | clear all                                                                   |
| move left / right / remove | Mover para a esquerda / direita · Remover                        | Move left / right · Remove                                                  |
| icon theme                 | Tema dos ícones · Escuro / Claro                                 | Icon theme · Dark / Light                                                   |
| per line                   | Ícones por linha                                                 | Icons per line                                                              |
| preview                    | Prévia no README · Minhas skills                                 | README preview · My skills                                                  |
| copy                       | Copiar {format} · Copiado!                                       | Copy {format} · Copied!                                                     |
| no results                 | Nada encontrado para “{q}”. · Limpar busca                       | Nothing found for “{q}”. · Clear search                                     |
| package                    | Pacote · Usar como pacote npm                                    | Package · Use as an npm package                                             |
| package steps              | Instale a lib · Escolha o framework · Copie o código             | Install the library · Pick your framework · Copy the code                   |
| package footer             | ver no npm ↗                                                     | view on npm ↗                                                               |
| package preview            | Prévia do componente                                             | Component preview                                                           |
| install copy               | Copiar comando de instalação · Comando copiado                   | Copy install command · Command copied                                       |
| format                     | Formato                                                          | Format                                                                      |
| cover                      | ver capa · ver README · ver componente                           | view cover · view README · view component                                   |
| cover label                | Capa do link · OpenGraph                                         | Link cover · OpenGraph                                                      |
| cover copy                 | Copiar link com esta capa · Link copiado!                        | Copy link with this cover · Link copied!                                    |
| cover note                 | é o que aparece ao colar o link no Discord, Slack, X ou WhatsApp | it’s what shows up when you paste the link in Discord, Slack, X or WhatsApp |

## 7. Accessibility checklist

- Targets ≥ 44 px; real `<button>` / `<a>` / `<input>` with labels; icon-only buttons have `aria-label`.
- `aria-pressed` on tiles, chips, segments, stack items; `role="tablist"` for formats, named by the visible “Format” label.
- Package button: `aria-haspopup="dialog"` + `aria-expanded`; the popover traps focus, starts on its X and returns to the button. The framework picker is a `role="combobox"` with `aria-expanded` / `aria-controls`.
- The preview's hidden face is `aria-hidden` and `visibility: hidden` (out of the tab order).
- Muted text ≥ 4.5:1 on background and surface in both themes. Text on yellow is always `#111111`.
- Sheet traps focus and restores it to the Export button on close.
- Respect `prefers-reduced-motion`.
