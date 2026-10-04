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

| Token                              | Light                 | Dark                     | Use                                                                     |
| ---------------------------------- | --------------------- | ------------------------ | ----------------------------------------------------------------------- |
| `--background`                     | `#EDEDE8`             | `#141414`                | Page (stone / near-black)                                               |
| `--foreground` (ink)               | `#111111`             | `#F1F1EC`                | Text, 2 px borders, active segment, order badge                         |
| `--card` (surface)                 | `#FFFFFF`             | `#1E1E1E`                | Tiles, inputs, panels, sheet                                            |
| `--muted` (soft)                   | `#E3E3DD`             | `#262626`                | Segmented-control track, stack tray, code block                         |
| `--muted-foreground`               | `#5C5C56`             | `#A6A69F`                | Secondary text, mono labels (≥ 4.5:1 on bg)                             |
| `--border` (hair)                  | `rgb(17 17 17 / .14)` | `rgb(241 241 236 / .16)` | 1 px dividers, idle tile borders, dashed empty states                   |
| `--input`                          | = foreground          | = foreground             | Search input border (2 px)                                              |
| `--ring`                           | = foreground          | = foreground             | Focus ring                                                              |
| `--primary`                        | `#111111`             | `#F1F1EC`                | Active segment / active chip fill                                       |
| `--primary-foreground`             | `#EDEDE8`             | `#141414`                | Text on primary                                                         |
| `--highlight`                      | `#FFD21F`             | `#FFD21F`                | Selected tile, active sidebar item, selected language, CTA, logo square |
| `--highlight-foreground`           | `#111111`             | `#111111`                | Text/icons on highlight (always ink, both themes)                       |
| `--accent` / `--secondary`         | = muted               | = muted                  | shadcn hover surfaces (keep yellow OUT of these)                        |
| `--destructive`                    | `#C40C0C`             | `#FF6B6B`                | Errors only                                                             |
| `--scrim`                          | `rgb(17 17 17 / .45)` | `rgb(0 0 0 / .6)`        | Behind the bottom sheet                                                 |
| `--readme-dark` / `--readme-light` | `#0E1116` / `#FFFFFF` | same                     | README preview background (follows _icon_ theme)                        |

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
- Hard shadows only: CTA `3px 3px 0 var(--foreground)`, language popover `4px 4px 0 var(--foreground)`. Pressed / copied: `translate(3px,3px)` + shadow `0`.
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

**CategoryChip (rail, compact)** — 40 high, pill, px 14, 15 px, 2 px border. Idle: hair border + surface. Active: ink fill + bg-colored text. Count in mono 12 at 70% opacity. Rail scrolls horizontally, bleeds to screen edges, scrollbar hidden.

**CategoryItem (sidebar, wide)** — 36 high, radius 8, full width, label left / mono count right. Active: yellow fill, ink text, 600. Section label “CATEGORIAS” in mono.

**PresetCard** — new feature. Button, padding 12, radius 12, 2 px border. Row of 28 px icons with a 4 px gap (no overlap, no ring), then name (16/600) + mono hint (“+3” missing / “na pilha ✓”). Tap appends missing icons in preset order and pops the whole stack. When all icons are present: yellow fill + ink border. Presets live in a new `src/lib/presets.ts`: Web moderno, Back-end, Ferramentas, IA (any list; ids must exist).

**IconTile** — square button (`aspect-ratio: 1`), padding 8, radius 14, **no border and no background when idle** (the icon's own rounded square is the shape). Selected: yellow background behind the icon, image `scale(0.86)`, **order badge** top-right (−6,−6): 22 px pill, ink bg, bg-colored mono 11/600 number = position in stack. `aria-pressed`, `aria-label` = display name, `title` on wide. Pop animation on add (see Motion). Same rule everywhere an icon appears (presets, dock, tray): no frames or rings around icons; state is shown with a yellow background only.

**Dock (compact only)** — `position: sticky; bottom: 0` inside the main scroller. Inverted colors, radius 18 18 0 0, padding 10 12 + safe-area. Contains: horizontally scrolling stack (44×44 buttons, 4 px padding) + **Export button** (48 high, yellow, 2 px border in bg color, 16/700, count pill: ink bg + yellow mono 12). Empty: “Toque nos ícones para montar sua pilha.” and Export disabled at 50%.

**Lift & controls** — tapping an item in the stack (dock or tray) _lifts_ it (`aria-pressed`, yellow background in both dock and tray, image `translateY(-3px) rotate(-6deg)`). A control row appears: name + mono `#n`, ← (44×40), → (44×40), “Remover”. Arrows disabled at the ends (35% opacity). Uses existing `moveIcon` / `toggleIcon`; lifted id is local UI state.

**StackTray (export panel/sheet)** — heading “Sua pilha” + mono zero-padded count (`05`). Actions: “Embaralhar” (36 high, 1 px hair, needs ≥ 2 icons) and, on compact, a close button. Tray: soft bg, radius 12, padding 8, wrap of 48×48 surface buttons with mono 10 position number. Below: control row when lifted, otherwise mono hint + “limpar tudo” text button. Empty: dashed box “Vazia por enquanto. Escolha ícones ou use uma pilha pronta.”

**SegmentedControl** (icon theme, format) — soft track, padding 3, radius 12; segments 40 high, radius 9, 15/600. Icon theme: active = surface bg + ink, with a 12 px swatch (`#242938` dark, `#F4F2ED` light). Format: active = ink fill + bg-colored text. Use `ToggleGroup` / `Tabs` primitives restyled.

**Package format** (the npm library; replaces the old "Use it as a library" section) — a 4th segment in the format tablist: Markdown · HTML · URL · **Pacote/Package**. It sits in the same place as the other formats because it is the same job (copy something that shows your stack), so the export keeps a single CTA and the sheet doesn't grow a second scroll section below it. When active, two rows appear between the tablist and the CodeBlock:

- **FrameworkChip rail** — `role="group"`, `aria-pressed` chips: React · Vue · Svelte · Solid · Angular · Astro · Web Component. Same spec as CategoryChip, but 44 high, padding 0 14 0 8, with the framework's own 26 px skill icon at left (dark variant; `html` for Web Component) and 15/600 label. Rail scrolls horizontally and bleeds to the panel edge (−16 compact, −24 wide). Default React; remember the last pick in local UI state.
- **InstallRow** — mono 13 command `npm i @hoyasumii/skill-icons` in a 44 high soft box (1 px hair, radius 12, muted `$` prompt, scrolls horizontally, never wraps) + 44×44 icon button (1 px hair, radius 10, Lucide Copy → Check; ink fill + bg-colored icon for 1.6 s; `aria-label` "Copiar comando de instalação"). It is a secondary copy and never gets the yellow.
- CodeBlock shows the framework snippet (existing `LIBRARIES` renderers in `output.tsx`, shiki-highlighted). CTA reads “Copiar React / Vue / …”. ReadmePreview label becomes “Prévia do componente” and its strip shows the file name (`Skills.tsx`, `Skills.vue`, `Skills.svelte`, `Skills.tsx`, `skills.component.ts`, `Skills.astro`, `index.html`). The hint under the CTA becomes “componentes prontos no npm: @hoyasumii/skill-icons ↗” (link to npmjs).
- Format and framework are local UI state; the URL format is unchanged.

**Stepper** (icons per line, replaces the Slider) — soft track, − and + buttons 44×40 on surface, value mono 18/600 tabular, `aria-live="polite"`. Range 1–50 (existing `MIN_PER_LINE` / `MAX_PER_LINE`).

**ReadmePreview** — 1 px hair, radius 12, bg `#0E1116` when icon theme is dark, `#FFFFFF` when light. Top strip mono 12 “README.md”. Body: “Minhas skills” 18/700, then the real badge image (`buildIconsUrl`) — prototype draws a grid of `min(perLine, count)` columns, max 48 px each, gap 6, centered. Empty text when no icons.

**CodeBlock** — soft bg, 1 px hair, radius 12, padding 12, mono 13/19, `pre-wrap` + `break-all`, max-height 132 with scroll.

**CopyButton (primary CTA)** — full width, 52 high, 2 px ink border, radius 12, yellow, 17/700, `shadow-cta`. Label names the format: “Copiar Markdown / HTML / URL”. On success: ink fill, bg-colored text, Check icon, “Copiado!”, `translate(3px,3px)` + no shadow, reverts after 1.6 s. Keep the sonner toast for errors only. Under it: mono 12 hint “o link desta página também guarda sua pilha”.

**BottomSheet (compact)** — `position: absolute/fixed`, bottom 0, radius 22 22 0 0, surface, max-height 88%, padding 20 16 28, 44×5 grab handle, scrim behind (tap closes). Hidden with `visibility: hidden` when closed. Must trap focus and close on Escape (use Radix Dialog for this).

**EmptyState** — 2 px dashed hair, radius 12, centered text 16 px, optional bordered button (44 high, 2 px ink).

---

## 5. Behavior changes vs. current app

- Breakpoint switch at 1024 px (compact ↔ wide) — see §2.4.
- New: presets, lift-to-reorder, shuffle, format-aware copy label, sticky dock + sheet, README preview.
- The library section (install + framework tabs below the output) moves into the format tablist as the **Package** format (see Package format in §4). The success toast goes away with it.
- `useBuilderState`: add `addIcons(names: string[])` (append missing, keep order) and `setIcons(names: string[])` (for shuffle). Keep URL sync.
- Slider → Stepper. Category pills → rail (compact) / sidebar (wide).
- Grid tile shows order number instead of a check, and loses its border/ring.
- Language picker becomes the themed LanguageMenu combobox.
- Theme toggle uses the circular reveal (View Transitions).
- Header: GitHub link only on wide (move it into the language menu or footer on compact).

## 6. Copy (pt-BR → en)

| Key                        | pt-BR                                          | en                                        |
| -------------------------- | ---------------------------------------------- | ----------------------------------------- |
| tagline                    | monte sua pilha → cole no README               | build your stack → paste in your README   |
| search placeholder         | Buscar ícone, ex.: react, ts, postgres         | Search icons, e.g. react, ts, postgres    |
| presets label              | Pilhas prontas · um toque adiciona tudo        | Ready-made stacks · one tap adds them all |
| grid hint                  | toque para adicionar                           | tap to add                                |
| dock empty                 | Toque nos ícones para montar sua pilha.        | Tap icons to build your stack.            |
| export                     | Exportar                                       | Export                                    |
| stack title                | Sua pilha                                      | Your stack                                |
| shuffle                    | Embaralhar                                     | Shuffle                                   |
| clear                      | limpar tudo                                    | clear all                                 |
| move left / right / remove | Mover para a esquerda / direita · Remover      | Move left / right · Remove                |
| icon theme                 | Tema dos ícones · Escuro / Claro               | Icon theme · Dark / Light                 |
| per line                   | Ícones por linha                               | Icons per line                            |
| preview                    | Prévia no README · Minhas skills               | README preview · My skills                |
| copy                       | Copiar {format} · Copiado!                     | Copy {format} · Copied!                   |
| no results                 | Nada encontrado para “{q}”. · Limpar busca     | Nothing found for “{q}”. · Clear search   |
| package format             | Pacote · Framework                             | Package · Framework                       |
| package preview            | Prévia do componente                           | Component preview                         |
| install copy               | Copiar comando de instalação · Comando copiado | Copy install command · Command copied     |
| package hint               | componentes prontos no npm:                    | ready-made components on npm:             |

## 7. Accessibility checklist

- Targets ≥ 44 px; real `<button>` / `<a>` / `<input>` with labels; icon-only buttons have `aria-label`.
- `aria-pressed` on tiles, chips, segments, stack items; `role="tablist"` for formats.
- Muted text ≥ 4.5:1 on background and surface in both themes. Text on yellow is always `#111111`.
- Sheet traps focus and restores it to the Export button on close.
- Respect `prefers-reduced-motion`.
