# @hoyasumii/skill-icons

[Skill icons](https://hoyasumii.github.io/skill-icons) as components. One package, one entry point per framework.

```sh
npm install @hoyasumii/skill-icons
```

## React

```tsx
import { Icon, Icons } from '@hoyasumii/skill-icons/react';

<Icon name="react" />
<Icon name="ts" theme="light" size={32} />
<Icons names={['js', 'ts', 'react']} perLine={2} />
```

## Solid

```tsx
import { Icon, Icons, SkillIconsProvider } from '@hoyasumii/skill-icons/solid';

<Icon name="solidjs" />
<Icons names={['js', 'ts', 'solidjs']} perLine={2} />
```

Requires `solid-js` 1.8 or newer. The package ships the `solid` export condition (preserved JSX, compiled by your Solid plugin) plus compiled DOM and SSR builds as fallback. Props are read reactively, so signals work as usual.

## Vue

```vue
<script setup lang="ts">
import { Icon, Icons } from '@hoyasumii/skill-icons/vue';
</script>

<template>
  <Icon name="react" />
  <Icon name="ts" theme="light" :size="32" />
  <Icons :names="['js', 'ts', 'react']" :per-line="2" />
</template>
```

Names are checked in templates by `vue-tsc` and Volar.

## Svelte

Svelte 5 or later. Components ship as `.svelte` source, so your Svelte toolchain compiles them.

```svelte
<script lang="ts">
  import { Icon, Icons } from '@hoyasumii/skill-icons/svelte';
</script>

<Icon name="react" />
<Icon name="ts" theme="light" size={32} />
<Icons names={['js', 'ts', 'react']} perLine={2} />
```

Names are checked in templates by `svelte-check`.

## Angular

Standalone components with signal inputs. Requires `@angular/core` 17.1 or newer (the first version with `input()`).

```ts
import { Component } from '@angular/core';
import { Icon, Icons } from '@hoyasumii/skill-icons/angular';

@Component({
  imports: [Icon, Icons],
  template: `
    <skill-icon name="react" />
    <skill-icon name="ts" theme="light" [size]="32" />
    <skill-icons [names]="['js', 'ts', 'react']" [perLine]="2" />
  `,
})
export class Skills {}
```

`SKILL_ICONS` bundles `Icon`, `Icons` and `SkillIconsProvider` for a single `imports` entry.

Angular inputs can't express "typed names in local mode, any string with `latest`", so `name` and `names` accept `IconName | (string & {})`: known names still autocomplete, but a typo is not a compile error. In local mode an unknown name renders nothing.

Class and style set on the element itself (`<skill-icon class="x">`) apply to the host element, not the `<img>`. To style the image use `imgClass` and `imgStyle` (any value Angular's `[class]` and `[style]` bindings accept), and `alt` to override the alt text:

```html
<skill-icon name="react" imgClass="rounded" [imgStyle]="{ opacity: 0.8 }" alt="React" />
```

## Astro

Astro 4 or later. Components ship as `.astro` source and render fully on the server: the SVGs are inlined as data URIs, with no client JavaScript and no loading state.

```astro
---
import { Icon, Icons } from '@hoyasumii/skill-icons/astro';
---

<Icon name="react" />
<Icon name="ts" theme="light" size={32} />
<Icons names={['js', 'ts', 'react']} perLine={2} />
```

Props match React's, and extra attributes (`class`, `style`, `alt`, ...) are passed to the `<img>`. Names are checked in `.astro` files by `astro check`. `theme="auto"` renders a `<picture>` that follows the visitor's color scheme.

Astro has no context, so there is no provider. Pass `theme` to each component, or wrap them in your own component with a default:

```astro
---
// components/TechIcon.astro
import { Icon } from '@hoyasumii/skill-icons/astro';
import type { ComponentProps } from 'astro/types';

const { theme = 'auto', ...props } = Astro.props as ComponentProps<typeof Icon>;
---

<Icon {...props} theme={theme} />
```

## Web Component

Framework-free custom elements, with no dependencies. Register them once, then use the tags anywhere (plain HTML, Astro, Lit, ...):

```html
<script type="module">
  import '@hoyasumii/skill-icons/element/define'; // or: import { defineSkillIcons } from '@hoyasumii/skill-icons/element'
</script>

<skill-icon name="react" theme="light" size="32"></skill-icon>
<skill-icons names="js,ts,react" per-line="2" theme="auto"></skill-icons>
```

Attributes are `name`, `names` (comma separated), `theme`, `size`, `per-line`, `latest`, `base-url`, plus `alt` and `img-class` for the generated `<img>`. Each one has a matching property (`el.names = ['js', 'ts']`, `el.perLine = 2`, `el.latest = true`) and changing either re-renders. Behavior matches the other entries: cached icons render synchronously, the previous icon stays while a new one loads, `'auto'` uses a `<picture>`, and unknown names render nothing.

The elements render into the light DOM, so style the `<img>` with your own CSS or `img-class`. They are `display: inline` hosts, and the loading placeholder is a sized inline-block `<span>`; no global CSS is injected. `defineSkillIcons()` is idempotent and does nothing on the server, and importing the module never touches the DOM. Only `element/define` has side effects, so the rest stays tree-shakable.

Use `<skill-icons-provider theme="auto">` to set the theme for everything inside. Icons find the nearest provider with a `theme` by walking up their ancestors (across shadow roots), so a provider without `theme` inherits from the outer one and an icon's own `theme` wins. When a provider's `theme` changes, it calls `refresh()` on the icons below it. Icons inside a different shadow root than the provider are found at connect time only.

## Props

Each icon is bundled as its own chunk and only downloaded when rendered.

| Prop                | Default                  | Description                                      |
| ------------------- | ------------------------ | ------------------------------------------------ |
| `name` / `names`    |                          | Icon names or aliases (`js`, `ts`, `k8s`, ...)   |
| `theme`             | `'dark'`                 | `'dark'`, `'light'` or `'auto'`                  |
| `size`              | `48`                     | Size of one icon, in pixels                      |
| `perLine` (`Icons`) | `15`                     | Icons per line, from 1 to 50                     |
| `latest`            | `false`                  | Load from the deployed API instead of the bundle |
| `baseUrl`           | `https://skill-icons.alanreisanjo.workers.dev` | API to load from, in `latest` mode only          |

Any other prop or attribute is passed to the underlying `<img>` (in Angular, through `imgClass`, `imgStyle` and `alt`).

## Themes

`theme` applies to icons that have dark and light variants. `'auto'` follows the system's color scheme through a `<picture>`, so it works without JavaScript and during SSR:

```tsx
<Icon name="react" theme="auto" />
```

To set the theme for a whole tree, use the provider. A `theme` prop still wins, and a provider without `theme` inherits from the outer one:

```tsx
import { SkillIconsProvider } from '@hoyasumii/skill-icons/react'; // or /solid, /vue, /svelte, /element (as <skill-icons-provider>)

<SkillIconsProvider theme="auto">
  <App />
</SkillIconsProvider>;
```

In Angular, use the `<skill-icons-provider theme="auto">` component, or `provideSkillIcons({ theme })` in `bootstrapApplication`, a route or a component's `providers`. `theme` may be a signal, so a theme toggle updates every icon:

```ts
bootstrapApplication(App, {
  providers: [provideSkillIcons({ theme: 'auto' })], // or a Signal<ThemeOption>
});
```

When the theme changes, icons keep showing the previous variant until the new one loads, so toggling doesn't flash placeholders.

If your site has its own theme toggle, pass its current value instead of `'auto'`:

```tsx
const { resolvedTheme } = useTheme(); // e.g. next-themes

<SkillIconsProvider theme={resolvedTheme === 'light' ? 'light' : 'dark'}>
```

## `latest` mode

By default, names are typed against the icons bundled with the installed version. With `latest`, any string is accepted and icons load from the deployed API at runtime, so new icons work without updating the package:

```tsx
<Icon latest name="some-new-icon" />
<Icons latest names={['js', 'some-new-icon']} baseUrl="https://my-deploy.dev" />
```

## HTML string

For SSR without a framework, emails or static site generators, the core (`@hoyasumii/skill-icons`) renders the same markup as the components:

```ts
import { renderIcon, renderIcons } from '@hoyasumii/skill-icons';

await renderIcon('react', { theme: 'auto', size: 32, attrs: { class: 'icon', loading: 'lazy' } });
await renderIcons(['js', 'ts', 'react'], { perLine: 3 });
await renderIcon('some-new-icon', { latest: true, baseUrl: 'https://my-deploy.dev' }); // remote URL
```

Both return a `Promise<string>`: an `<img>` with an inlined data URI (wrapped in a `<picture>` for `theme: 'auto'`), or `''` for unknown names in local mode. Attribute values are escaped and invalid attribute names are skipped.
