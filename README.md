<p align="center">
  <a href="https://skill-icons.alanreisanjo.workers.dev">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://skill-icons.alanreisanjo.workers.dev/og/site?bg=dark">
      <img src="https://skill-icons.alanreisanjo.workers.dev/og/site" alt="Skill Icons: build your stack, paste it in your README"/>
    </picture>
  </a>
</p>
<h3 align="center">Showcase your skills on your GitHub or resumé with ease!</h3>

<p align="center">
  <a href="https://www.npmjs.com/package/@hoyasumii/skill-icons"><img src="https://img.shields.io/npm/v/@hoyasumii/skill-icons?color=cb3837&logo=npm" alt="npm version"></a>
  <a href="https://github.com/Hoyasumii/skill-icons/actions/workflows/deploy.yml"><img src="https://github.com/Hoyasumii/skill-icons/actions/workflows/deploy.yml/badge.svg" alt="Deploy"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/Hoyasumii/skill-icons" alt="License"></a>
</p>

<hr>

<h3 align="center">Powered by Cloudflare Workers ⚡</h3>

> [!NOTE]
> This project is a fork of [tandpfun/skill-icons](https://github.com/tandpfun/skill-icons), the original Skill Icons by [tandpfun](https://github.com/tandpfun). This fork adds a visual builder, more icons and the [`@hoyasumii/skill-icons`](https://www.npmjs.com/package/@hoyasumii/skill-icons) npm package. All credit for the original project and icons goes to its authors.

Skill Icons gives you hundreds of icons in a few ways:

- **An image API**: paste a URL into your README and get an SVG with your skills. Shared on Discord, Slack, X and other apps, the same link unfurls into a preview card.
- **A [visual builder](https://skill-icons.alanreisanjo.workers.dev)**: search icons, start from ready-made stacks, save your own, and copy the Markdown, HTML or package code.
- **An npm package**, [`@hoyasumii/skill-icons`](https://www.npmjs.com/package/@hoyasumii/skill-icons): the same icons as components for React, Vue, Svelte, Angular, Solid, Astro and Web Components.
- **An MCP server**: let Claude and other AI assistants find icon ids and build the badge for you.

> [!IMPORTANT]
> To keep icons consistent and to ensure browser support, we don't accept pull requests for icon submissions. If you would like an icon added, please open an issue.

# Docs

- [Example](#example)
- [Builder](#builder)
- [Specifying Icons](#specifying-icons)
- [Themed Icons](#themed-icons)
- [Icons Per Line](#icons-per-line)
- [Centering Icons](#centering-icons)
- [Badge Title](#badge-title)
- [Link Previews](#link-previews)
- [npm Package](#npm-package)
- [MCP Server](#mcp-server)
- [Icons List](#icons-list)
- [Development](#development)
- [Releasing](#releasing)

# Example

<p align="center"><img align="center" src="./.github/example-dark.png#gh-dark-mode-only"/></p>
<p align="center"><img align="center" src="./.github/example-light.png#gh-light-mode-only"/></p>

# Builder

The [builder](https://skill-icons.alanreisanjo.workers.dev) is the easiest way to make a badge:

- Search icons by name or alias, or browse them by category.
- Start from a ready-made stack and combine as many as you like.
- Reorder or remove icons in your stack, pick the theme and icons per line, and give the badge a title.
- Save stacks in your browser to come back to them later.
- Export as Markdown or HTML for your README, or as code for the npm package.

The site is available in [English](https://skill-icons.alanreisanjo.workers.dev) and [Portuguese (Brazil)](https://skill-icons.alanreisanjo.workers.dev/pt-BR/); each language has its own address.

# Specifying Icons

Copy and paste the code block below into your readme to add the skills icon element!

Change the `?i=js,html,css` to a list of your skills separated by ","s! You can find a full list of icons [here](#icons-list).

```md
[![My Skills](https://skill-icons.alanreisanjo.workers.dev/icons?i=js,html,css,wasm)](https://skill-icons.alanreisanjo.workers.dev)
```

[![My Skills](https://skill-icons.alanreisanjo.workers.dev/icons?i=js,html,css,wasm)](https://skill-icons.alanreisanjo.workers.dev)

# Themed Icons

Some icons have a dark and light themed background. You can specify which theme you want as a url parameter.

This is optional. The default theme is dark.

Change the `&theme=light` to either `dark` or `light`. The theme is the background color, so light theme has a white icon background, and dark has a black-ish.

**Light Theme Example:**

```md
[![My Skills](https://skill-icons.alanreisanjo.workers.dev/icons?i=java,kotlin,nodejs,figma&theme=light)](https://skill-icons.alanreisanjo.workers.dev)
```

[![My Skills](https://skill-icons.alanreisanjo.workers.dev/icons?i=java,kotlin,nodejs,figma&theme=light)](https://skill-icons.alanreisanjo.workers.dev)

# Icons Per Line

You can specify how many icons you would like per line! It's an optional argument, and the default is 15.

Change the `&perline=3` to any number between 1 and 50.

```md
[![My Skills](https://skill-icons.alanreisanjo.workers.dev/icons?i=aws,gcp,azure,react,vue,flutter&perline=3)](https://skill-icons.alanreisanjo.workers.dev)
```

[![My Skills](https://skill-icons.alanreisanjo.workers.dev/icons?i=aws,gcp,azure,react,vue,flutter&perline=3)](https://skill-icons.alanreisanjo.workers.dev)

# Centering Icons

Want to center the icons in your readme? The SVGs are automatically resized, so you can do it the same way you'd normally center an image.

```html
<p align="center">
  <a href="https://skill-icons.alanreisanjo.workers.dev">
    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=git,kubernetes,docker,c,vim" />
  </a>
</p>
```

<p align="center">
  <a href="https://skill-icons.alanreisanjo.workers.dev">
    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=git,kubernetes,docker,c,vim" />
  </a>
</p>

# Badge Title

Add `&title=` to name your badge (up to 40 characters). The SVG looks the same; the title is used as the heading of the [link preview](#link-previews) card. The builder also uses it as the image's alt text.

```md
[![Backend](https://skill-icons.alanreisanjo.workers.dev/icons?i=go,postgres,redis,docker&title=Backend)](https://skill-icons.alanreisanjo.workers.dev)
```

# Link Previews

An `/icons` link works in more places than a README:

- **Images** (`<img>`, Markdown images, GitHub's image proxy) get the SVG.
- **Chat and social apps** (Discord, Slack, X, WhatsApp, Telegram, LinkedIn, Bluesky and others) get a preview card with your icons, the badge title and the link. The card image is also available directly at `/og?i=…`.
- **People opening the link** in a browser are sent to the builder.

Cards are light by default. Add `&bg=dark` to an `/icons` link for a dark card, or `?bg=dark` to a link to the site itself (`https://skill-icons.alanreisanjo.workers.dev/?bg=dark`) to share it with the dark cover.

# npm Package

The icons are also published as [`@hoyasumii/skill-icons`](https://www.npmjs.com/package/@hoyasumii/skill-icons), with one entry point per framework. Icons are bundled with the package and each one is loaded as its own chunk, only when rendered.

```sh
npm install @hoyasumii/skill-icons   # or: pnpm add / yarn add / bun add
```

```tsx
import { Icon, Icons } from '@hoyasumii/skill-icons/react';

<Icon name="react" />
<Icon name="ts" theme="light" size={32} />
<Icons names={['js', 'ts', 'react']} perLine={2} />
```

| Entry point                      | For                                                       |
| -------------------------------- | --------------------------------------------------------- |
| `@hoyasumii/skill-icons/react`   | React 18+                                                 |
| `@hoyasumii/skill-icons/vue`     | Vue 3.3+                                                  |
| `@hoyasumii/skill-icons/svelte`  | Svelte 5+                                                 |
| `@hoyasumii/skill-icons/angular` | Angular 17.1+ (standalone components)                     |
| `@hoyasumii/skill-icons/solid`   | Solid 1.8+                                                |
| `@hoyasumii/skill-icons/astro`   | Astro 4+ (server rendered, no client JS)                  |
| `@hoyasumii/skill-icons/element` | Framework-free custom elements (`<skill-icon>`)           |
| `@hoyasumii/skill-icons`         | `renderIcon` / `renderIcons` to HTML strings (SSR, email) |

Names are typed, `theme` accepts `'dark'`, `'light'` or `'auto'`, and `latest` mode loads icons from the API so new icons work without updating the package. See the [package README](./packages/skill-icons/README.md) for the full docs.

# MCP Server

Skill Icons is also a remote [MCP](https://modelcontextprotocol.io) server, so Claude and other AI assistants can find icon ids and build your badge for you. Open [the MCP page](https://skill-icons.alanreisanjo.workers.dev/mcp) for step-by-step instructions, or add it to Claude Code:

```bash
claude mcp add --transport http skill-icons https://skill-icons.alanreisanjo.workers.dev/mcp
```

In the Claude app, add `https://skill-icons.alanreisanjo.workers.dev/mcp` as a custom connector in Settings → Connectors. It is free and needs no API key. The tools are `skill_icons_search` (find icons by id, brand name or alias) and `skill_icons_badge` (turn a list of icons into the image URL, Markdown and HTML, with suggestions for any name that does not match).

# Icons List

Here's a list of all the icons currently supported. Feel free to open an issue to suggest icons to add!

Short aliases also work: `js`, `ts`, `py`, `k8s`, `postgres`, `tailwind`, `next` and more (see `shortNames` in [`shared/icons.ts`](./shared/icons.ts)).

|        Icon ID        |                                               Icon                                               |      Icon ID      |                                           Icon                                           |
| :-------------------: | :----------------------------------------------------------------------------------------------: | :---------------: | :--------------------------------------------------------------------------------------: |
|     `abacatepay`      |          ![abacatepay](https://skill-icons.alanreisanjo.workers.dev/icons?i=abacatepay)          |     `ableton`     |         ![ableton](https://skill-icons.alanreisanjo.workers.dev/icons?i=ableton)         |
|     `activitypub`     |         ![activitypub](https://skill-icons.alanreisanjo.workers.dev/icons?i=activitypub)         |      `actix`      |           ![actix](https://skill-icons.alanreisanjo.workers.dev/icons?i=actix)           |
|       `adonis`        |              ![adonis](https://skill-icons.alanreisanjo.workers.dev/icons?i=adonis)              |      `adyen`      |           ![adyen](https://skill-icons.alanreisanjo.workers.dev/icons?i=adyen)           |
|    `aftereffects`     |        ![aftereffects](https://skill-icons.alanreisanjo.workers.dev/icons?i=aftereffects)        |    `airtable`     |        ![airtable](https://skill-icons.alanreisanjo.workers.dev/icons?i=airtable)        |
|      `aiscript`       |            ![aiscript](https://skill-icons.alanreisanjo.workers.dev/icons?i=aiscript)            |    `alacritty`    |       ![alacritty](https://skill-icons.alanreisanjo.workers.dev/icons?i=alacritty)       |
|       `alfred`        |              ![alfred](https://skill-icons.alanreisanjo.workers.dev/icons?i=alfred)              |      `alma`       |            ![alma](https://skill-icons.alanreisanjo.workers.dev/icons?i=alma)            |
|       `alpine`        |              ![alpine](https://skill-icons.alanreisanjo.workers.dev/icons?i=alpine)              |    `alpinejs`     |        ![alpinejs](https://skill-icons.alanreisanjo.workers.dev/icons?i=alpinejs)        |
|      `anaconda`       |            ![anaconda](https://skill-icons.alanreisanjo.workers.dev/icons?i=anaconda)            |     `android`     |         ![android](https://skill-icons.alanreisanjo.workers.dev/icons?i=android)         |
|    `androidstudio`    |       ![androidstudio](https://skill-icons.alanreisanjo.workers.dev/icons?i=androidstudio)       |     `angular`     |         ![angular](https://skill-icons.alanreisanjo.workers.dev/icons?i=angular)         |
|       `animejs`       |             ![animejs](https://skill-icons.alanreisanjo.workers.dev/icons?i=animejs)             |     `ansible`     |         ![ansible](https://skill-icons.alanreisanjo.workers.dev/icons?i=ansible)         |
|      `antdesign`      |           ![antdesign](https://skill-icons.alanreisanjo.workers.dev/icons?i=antdesign)           |   `antigravity`   |     ![antigravity](https://skill-icons.alanreisanjo.workers.dev/icons?i=antigravity)     |
|       `anytype`       |             ![anytype](https://skill-icons.alanreisanjo.workers.dev/icons?i=anytype)             |     `apidog`      |          ![apidog](https://skill-icons.alanreisanjo.workers.dev/icons?i=apidog)          |
|       `apollo`        |              ![apollo](https://skill-icons.alanreisanjo.workers.dev/icons?i=apollo)              |     `appcode`     |         ![appcode](https://skill-icons.alanreisanjo.workers.dev/icons?i=appcode)         |
|        `apple`        |               ![apple](https://skill-icons.alanreisanjo.workers.dev/icons?i=apple)               |   `applemusic`    |      ![applemusic](https://skill-icons.alanreisanjo.workers.dev/icons?i=applemusic)      |
|      `applepay`       |            ![applepay](https://skill-icons.alanreisanjo.workers.dev/icons?i=applepay)            |    `appwrite`     |        ![appwrite](https://skill-icons.alanreisanjo.workers.dev/icons?i=appwrite)        |
|        `aqua`         |                ![aqua](https://skill-icons.alanreisanjo.workers.dev/icons?i=aqua)                |       `arc`       |             ![arc](https://skill-icons.alanreisanjo.workers.dev/icons?i=arc)             |
|        `arch`         |                ![arch](https://skill-icons.alanreisanjo.workers.dev/icons?i=arch)                |     `arduino`     |         ![arduino](https://skill-icons.alanreisanjo.workers.dev/icons?i=arduino)         |
|       `argocd`        |              ![argocd](https://skill-icons.alanreisanjo.workers.dev/icons?i=argocd)              |      `arkui`      |           ![arkui](https://skill-icons.alanreisanjo.workers.dev/icons?i=arkui)           |
|        `asana`        |               ![asana](https://skill-icons.alanreisanjo.workers.dev/icons?i=asana)               |      `astro`      |           ![astro](https://skill-icons.alanreisanjo.workers.dev/icons?i=astro)           |
|      `astronvim`      |           ![astronvim](https://skill-icons.alanreisanjo.workers.dev/icons?i=astronvim)           |    `asyncapi`     |        ![asyncapi](https://skill-icons.alanreisanjo.workers.dev/icons?i=asyncapi)        |
|        `atom`         |                ![atom](https://skill-icons.alanreisanjo.workers.dev/icons?i=atom)                |    `audition`     |        ![audition](https://skill-icons.alanreisanjo.workers.dev/icons?i=audition)        |
|        `auth0`        |               ![auth0](https://skill-icons.alanreisanjo.workers.dev/icons?i=auth0)               |     `authjs`      |          ![authjs](https://skill-icons.alanreisanjo.workers.dev/icons?i=authjs)          |
|       `autocad`       |             ![autocad](https://skill-icons.alanreisanjo.workers.dev/icons?i=autocad)             |    `awesomewm`    |       ![awesomewm](https://skill-icons.alanreisanjo.workers.dev/icons?i=awesomewm)       |
|         `aws`         |                 ![aws](https://skill-icons.alanreisanjo.workers.dev/icons?i=aws)                 |      `azul`       |            ![azul](https://skill-icons.alanreisanjo.workers.dev/icons?i=azul)            |
|        `azure`        |               ![azure](https://skill-icons.alanreisanjo.workers.dev/icons?i=azure)               |      `babel`      |           ![babel](https://skill-icons.alanreisanjo.workers.dev/icons?i=babel)           |
|      `babylonjs`      |           ![babylonjs](https://skill-icons.alanreisanjo.workers.dev/icons?i=babylonjs)           |    `backbone`     |        ![backbone](https://skill-icons.alanreisanjo.workers.dev/icons?i=backbone)        |
|      `bandcamp`       |            ![bandcamp](https://skill-icons.alanreisanjo.workers.dev/icons?i=bandcamp)            |    `basecamp`     |        ![basecamp](https://skill-icons.alanreisanjo.workers.dev/icons?i=basecamp)        |
|        `bash`         |                ![bash](https://skill-icons.alanreisanjo.workers.dev/icons?i=bash)                |      `bazel`      |           ![bazel](https://skill-icons.alanreisanjo.workers.dev/icons?i=bazel)           |
|        `bear`         |                ![bear](https://skill-icons.alanreisanjo.workers.dev/icons?i=bear)                |     `behance`     |         ![behance](https://skill-icons.alanreisanjo.workers.dev/icons?i=behance)         |
|     `betterauth`      |          ![betterauth](https://skill-icons.alanreisanjo.workers.dev/icons?i=betterauth)          |      `bevy`       |            ![bevy](https://skill-icons.alanreisanjo.workers.dev/icons?i=bevy)            |
|        `biome`        |               ![biome](https://skill-icons.alanreisanjo.workers.dev/icons?i=biome)               |    `bitbucket`    |       ![bitbucket](https://skill-icons.alanreisanjo.workers.dev/icons?i=bitbucket)       |
|        `black`        |               ![black](https://skill-icons.alanreisanjo.workers.dev/icons?i=black)               |     `blender`     |         ![blender](https://skill-icons.alanreisanjo.workers.dev/icons?i=blender)         |
|       `bluesky`       |             ![bluesky](https://skill-icons.alanreisanjo.workers.dev/icons?i=bluesky)             |    `bootstrap`    |       ![bootstrap](https://skill-icons.alanreisanjo.workers.dev/icons?i=bootstrap)       |
|      `brackets`       |            ![brackets](https://skill-icons.alanreisanjo.workers.dev/icons?i=brackets)            |      `bruno`      |           ![bruno](https://skill-icons.alanreisanjo.workers.dev/icons?i=bruno)           |
|         `bsd`         |                 ![bsd](https://skill-icons.alanreisanjo.workers.dev/icons?i=bsd)                 |      `bulma`      |           ![bulma](https://skill-icons.alanreisanjo.workers.dev/icons?i=bulma)           |
|         `bun`         |                 ![bun](https://skill-icons.alanreisanjo.workers.dev/icons?i=bun)                 |  `buymeacoffee`   |    ![buymeacoffee](https://skill-icons.alanreisanjo.workers.dev/icons?i=buymeacoffee)    |
|          `c`          |                   ![c](https://skill-icons.alanreisanjo.workers.dev/icons?i=c)                   |       `cal`       |             ![cal](https://skill-icons.alanreisanjo.workers.dev/icons?i=cal)             |
|      `calendly`       |            ![calendly](https://skill-icons.alanreisanjo.workers.dev/icons?i=calendly)            |      `canva`      |           ![canva](https://skill-icons.alanreisanjo.workers.dev/icons?i=canva)           |
|      `capacitor`      |           ![capacitor](https://skill-icons.alanreisanjo.workers.dev/icons?i=capacitor)           |    `cassandra`    |       ![cassandra](https://skill-icons.alanreisanjo.workers.dev/icons?i=cassandra)       |
|       `centos`        |              ![centos](https://skill-icons.alanreisanjo.workers.dev/icons?i=centos)              |     `cesium`      |          ![cesium](https://skill-icons.alanreisanjo.workers.dev/icons?i=cesium)          |
|      `chakraui`       |            ![chakraui](https://skill-icons.alanreisanjo.workers.dev/icons?i=chakraui)            |      `chalk`      |           ![chalk](https://skill-icons.alanreisanjo.workers.dev/icons?i=chalk)           |
|     `changesets`      |          ![changesets](https://skill-icons.alanreisanjo.workers.dev/icons?i=changesets)          |     `chartjs`     |         ![chartjs](https://skill-icons.alanreisanjo.workers.dev/icons?i=chartjs)         |
|       `chatgpt`       |             ![chatgpt](https://skill-icons.alanreisanjo.workers.dev/icons?i=chatgpt)             |   `chocolatey`    |      ![chocolatey](https://skill-icons.alanreisanjo.workers.dev/icons?i=chocolatey)      |
|      `chromeos`       |            ![chromeos](https://skill-icons.alanreisanjo.workers.dev/icons?i=chromeos)            |      `citty`      |           ![citty](https://skill-icons.alanreisanjo.workers.dev/icons?i=citty)           |
|       `claude`        |              ![claude](https://skill-icons.alanreisanjo.workers.dev/icons?i=claude)              |      `clerk`      |           ![clerk](https://skill-icons.alanreisanjo.workers.dev/icons?i=clerk)           |
|     `clickhouse`      |          ![clickhouse](https://skill-icons.alanreisanjo.workers.dev/icons?i=clickhouse)          |     `clickup`     |         ![clickup](https://skill-icons.alanreisanjo.workers.dev/icons?i=clickup)         |
|        `cline`        |               ![cline](https://skill-icons.alanreisanjo.workers.dev/icons?i=cline)               |      `clion`      |           ![clion](https://skill-icons.alanreisanjo.workers.dev/icons?i=clion)           |
|       `clojure`       |             ![clojure](https://skill-icons.alanreisanjo.workers.dev/icons?i=clojure)             |   `cloudflare`    |      ![cloudflare](https://skill-icons.alanreisanjo.workers.dev/icons?i=cloudflare)      |
|        `cmake`        |               ![cmake](https://skill-icons.alanreisanjo.workers.dev/icons?i=cmake)               |     `codepen`     |         ![codepen](https://skill-icons.alanreisanjo.workers.dev/icons?i=codepen)         |
|     `codesandbox`     |         ![codesandbox](https://skill-icons.alanreisanjo.workers.dev/icons?i=codesandbox)         |   `codespaces`    |      ![codespaces](https://skill-icons.alanreisanjo.workers.dev/icons?i=codespaces)      |
|        `codex`        |               ![codex](https://skill-icons.alanreisanjo.workers.dev/icons?i=codex)               |  `coffeescript`   |    ![coffeescript](https://skill-icons.alanreisanjo.workers.dev/icons?i=coffeescript)    |
|        `colab`        |               ![colab](https://skill-icons.alanreisanjo.workers.dev/icons?i=colab)               |   `commitlint`    |      ![commitlint](https://skill-icons.alanreisanjo.workers.dev/icons?i=commitlint)      |
|        `conan`        |               ![conan](https://skill-icons.alanreisanjo.workers.dev/icons?i=conan)               |      `conda`      |           ![conda](https://skill-icons.alanreisanjo.workers.dev/icons?i=conda)           |
|     `confluence`      |          ![confluence](https://skill-icons.alanreisanjo.workers.dev/icons?i=confluence)          |     `convex`      |          ![convex](https://skill-icons.alanreisanjo.workers.dev/icons?i=convex)          |
|       `coolify`       |             ![coolify](https://skill-icons.alanreisanjo.workers.dev/icons?i=coolify)             |       `cpp`       |             ![cpp](https://skill-icons.alanreisanjo.workers.dev/icons?i=cpp)             |
|       `crystal`       |             ![crystal](https://skill-icons.alanreisanjo.workers.dev/icons?i=crystal)             |       `cs`        |              ![cs](https://skill-icons.alanreisanjo.workers.dev/icons?i=cs)              |
|         `css`         |                 ![css](https://skill-icons.alanreisanjo.workers.dev/icons?i=css)                 |      `curl`       |            ![curl](https://skill-icons.alanreisanjo.workers.dev/icons?i=curl)            |
|       `cursor`        |              ![cursor](https://skill-icons.alanreisanjo.workers.dev/icons?i=cursor)              |     `cypress`     |         ![cypress](https://skill-icons.alanreisanjo.workers.dev/icons?i=cypress)         |
|         `d3`          |                  ![d3](https://skill-icons.alanreisanjo.workers.dev/icons?i=d3)                  |     `daisyui`     |         ![daisyui](https://skill-icons.alanreisanjo.workers.dev/icons?i=daisyui)         |
|        `dart`         |                ![dart](https://skill-icons.alanreisanjo.workers.dev/icons?i=dart)                |     `datadog`     |         ![datadog](https://skill-icons.alanreisanjo.workers.dev/icons?i=datadog)         |
|      `datagrip`       |            ![datagrip](https://skill-icons.alanreisanjo.workers.dev/icons?i=datagrip)            |    `dataspell`    |       ![dataspell](https://skill-icons.alanreisanjo.workers.dev/icons?i=dataspell)       |
|       `debian`        |              ![debian](https://skill-icons.alanreisanjo.workers.dev/icons?i=debian)              |    `deepseek`     |        ![deepseek](https://skill-icons.alanreisanjo.workers.dev/icons?i=deepseek)        |
|       `defold`        |              ![defold](https://skill-icons.alanreisanjo.workers.dev/icons?i=defold)              |      `deno`       |            ![deno](https://skill-icons.alanreisanjo.workers.dev/icons?i=deno)            |
|       `devbox`        |              ![devbox](https://skill-icons.alanreisanjo.workers.dev/icons?i=devbox)              |      `devto`      |           ![devto](https://skill-icons.alanreisanjo.workers.dev/icons?i=devto)           |
|    `digitalocean`     |        ![digitalocean](https://skill-icons.alanreisanjo.workers.dev/icons?i=digitalocean)        |     `discord`     |         ![discord](https://skill-icons.alanreisanjo.workers.dev/icons?i=discord)         |
|     `discordbots`     |         ![discordbots](https://skill-icons.alanreisanjo.workers.dev/icons?i=discordbots)         |    `discordjs`    |       ![discordjs](https://skill-icons.alanreisanjo.workers.dev/icons?i=discordjs)       |
|       `django`        |              ![django](https://skill-icons.alanreisanjo.workers.dev/icons?i=django)              |     `docker`      |          ![docker](https://skill-icons.alanreisanjo.workers.dev/icons?i=docker)          |
|     `docusaurus`      |          ![docusaurus](https://skill-icons.alanreisanjo.workers.dev/icons?i=docusaurus)          |     `dotnet`      |          ![dotnet](https://skill-icons.alanreisanjo.workers.dev/icons?i=dotnet)          |
|      `dribbble`       |            ![dribbble](https://skill-icons.alanreisanjo.workers.dev/icons?i=dribbble)            |     `drizzle`     |         ![drizzle](https://skill-icons.alanreisanjo.workers.dev/icons?i=drizzle)         |
|       `dropbox`       |             ![dropbox](https://skill-icons.alanreisanjo.workers.dev/icons?i=dropbox)             |     `duckdb`      |          ![duckdb](https://skill-icons.alanreisanjo.workers.dev/icons?i=duckdb)          |
|      `dynamodb`       |            ![dynamodb](https://skill-icons.alanreisanjo.workers.dev/icons?i=dynamodb)            |     `echarts`     |         ![echarts](https://skill-icons.alanreisanjo.workers.dev/icons?i=echarts)         |
|       `eclipse`       |             ![eclipse](https://skill-icons.alanreisanjo.workers.dev/icons?i=eclipse)             |  `elasticsearch`  |   ![elasticsearch](https://skill-icons.alanreisanjo.workers.dev/icons?i=elasticsearch)   |
|      `electron`       |            ![electron](https://skill-icons.alanreisanjo.workers.dev/icons?i=electron)            |     `element`     |         ![element](https://skill-icons.alanreisanjo.workers.dev/icons?i=element)         |
|     `elementary`      |          ![elementary](https://skill-icons.alanreisanjo.workers.dev/icons?i=elementary)          |     `elixir`      |          ![elixir](https://skill-icons.alanreisanjo.workers.dev/icons?i=elixir)          |
|       `elysia`        |              ![elysia](https://skill-icons.alanreisanjo.workers.dev/icons?i=elysia)              |      `emacs`      |           ![emacs](https://skill-icons.alanreisanjo.workers.dev/icons?i=emacs)           |
|        `ember`        |               ![ember](https://skill-icons.alanreisanjo.workers.dev/icons?i=ember)               |     `emotion`     |         ![emotion](https://skill-icons.alanreisanjo.workers.dev/icons?i=emotion)         |
|       `esbuild`       |             ![esbuild](https://skill-icons.alanreisanjo.workers.dev/icons?i=esbuild)             |     `eslint`      |          ![eslint](https://skill-icons.alanreisanjo.workers.dev/icons?i=eslint)          |
|      `evernote`       |            ![evernote](https://skill-icons.alanreisanjo.workers.dev/icons?i=evernote)            |      `excel`      |           ![excel](https://skill-icons.alanreisanjo.workers.dev/icons?i=excel)           |
|        `execa`        |               ![execa](https://skill-icons.alanreisanjo.workers.dev/icons?i=execa)               |      `expo`       |            ![expo](https://skill-icons.alanreisanjo.workers.dev/icons?i=expo)            |
|      `expressjs`      |           ![expressjs](https://skill-icons.alanreisanjo.workers.dev/icons?i=expressjs)           |    `facebook`     |        ![facebook](https://skill-icons.alanreisanjo.workers.dev/icons?i=facebook)        |
|      `farcaster`      |           ![farcaster](https://skill-icons.alanreisanjo.workers.dev/icons?i=farcaster)           |     `fastapi`     |         ![fastapi](https://skill-icons.alanreisanjo.workers.dev/icons?i=fastapi)         |
|       `fastify`       |             ![fastify](https://skill-icons.alanreisanjo.workers.dev/icons?i=fastify)             |    `fediverse`    |       ![fediverse](https://skill-icons.alanreisanjo.workers.dev/icons?i=fediverse)       |
|       `fedora`        |              ![fedora](https://skill-icons.alanreisanjo.workers.dev/icons?i=fedora)              |      `fiber`      |           ![fiber](https://skill-icons.alanreisanjo.workers.dev/icons?i=fiber)           |
|        `figma`        |               ![figma](https://skill-icons.alanreisanjo.workers.dev/icons?i=figma)               |    `firebase`     |        ![firebase](https://skill-icons.alanreisanjo.workers.dev/icons?i=firebase)        |
|        `fish`         |                ![fish](https://skill-icons.alanreisanjo.workers.dev/icons?i=fish)                |      `flask`      |           ![flask](https://skill-icons.alanreisanjo.workers.dev/icons?i=flask)           |
|        `fleet`        |               ![fleet](https://skill-icons.alanreisanjo.workers.dev/icons?i=fleet)               |     `flickr`      |          ![flickr](https://skill-icons.alanreisanjo.workers.dev/icons?i=flickr)          |
|      `flowbite`       |            ![flowbite](https://skill-icons.alanreisanjo.workers.dev/icons?i=flowbite)            |     `flutter`     |         ![flutter](https://skill-icons.alanreisanjo.workers.dev/icons?i=flutter)         |
|         `fly`         |                 ![fly](https://skill-icons.alanreisanjo.workers.dev/icons?i=fly)                 |     `formik`      |          ![formik](https://skill-icons.alanreisanjo.workers.dev/icons?i=formik)          |
|        `forth`        |               ![forth](https://skill-icons.alanreisanjo.workers.dev/icons?i=forth)               |     `fortran`     |         ![fortran](https://skill-icons.alanreisanjo.workers.dev/icons?i=fortran)         |
|     `foundation`      |          ![foundation](https://skill-icons.alanreisanjo.workers.dev/icons?i=foundation)          |     `freebsd`     |         ![freebsd](https://skill-icons.alanreisanjo.workers.dev/icons?i=freebsd)         |
|   `gamemakerstudio`   |     ![gamemakerstudio](https://skill-icons.alanreisanjo.workers.dev/icons?i=gamemakerstudio)     |     `gatsby`      |          ![gatsby](https://skill-icons.alanreisanjo.workers.dev/icons?i=gatsby)          |
|         `gcp`         |                 ![gcp](https://skill-icons.alanreisanjo.workers.dev/icons?i=gcp)                 |      `geany`      |           ![geany](https://skill-icons.alanreisanjo.workers.dev/icons?i=geany)           |
|        `gedit`        |               ![gedit](https://skill-icons.alanreisanjo.workers.dev/icons?i=gedit)               |     `gemini`      |          ![gemini](https://skill-icons.alanreisanjo.workers.dev/icons?i=gemini)          |
|       `gentoo`        |              ![gentoo](https://skill-icons.alanreisanjo.workers.dev/icons?i=gentoo)              |     `gherkin`     |         ![gherkin](https://skill-icons.alanreisanjo.workers.dev/icons?i=gherkin)         |
|       `ghostty`       |             ![ghostty](https://skill-icons.alanreisanjo.workers.dev/icons?i=ghostty)             |       `gin`       |             ![gin](https://skill-icons.alanreisanjo.workers.dev/icons?i=gin)             |
|         `git`         |                 ![git](https://skill-icons.alanreisanjo.workers.dev/icons?i=git)                 |     `github`      |          ![github](https://skill-icons.alanreisanjo.workers.dev/icons?i=github)          |
|    `githubactions`    |       ![githubactions](https://skill-icons.alanreisanjo.workers.dev/icons?i=githubactions)       |  `githubcopilot`  |   ![githubcopilot](https://skill-icons.alanreisanjo.workers.dev/icons?i=githubcopilot)   |
|   `githubsponsors`    |      ![githubsponsors](https://skill-icons.alanreisanjo.workers.dev/icons?i=githubsponsors)      |     `gitlab`      |          ![gitlab](https://skill-icons.alanreisanjo.workers.dev/icons?i=gitlab)          |
|       `gitpod`        |              ![gitpod](https://skill-icons.alanreisanjo.workers.dev/icons?i=gitpod)              |      `gleam`      |           ![gleam](https://skill-icons.alanreisanjo.workers.dev/icons?i=gleam)           |
|       `glitch`        |              ![glitch](https://skill-icons.alanreisanjo.workers.dev/icons?i=glitch)              |      `gmail`      |           ![gmail](https://skill-icons.alanreisanjo.workers.dev/icons?i=gmail)           |
|        `gnome`        |               ![gnome](https://skill-icons.alanreisanjo.workers.dev/icons?i=gnome)               |      `godot`      |           ![godot](https://skill-icons.alanreisanjo.workers.dev/icons?i=godot)           |
|       `goland`        |              ![goland](https://skill-icons.alanreisanjo.workers.dev/icons?i=goland)              |     `golang`      |          ![golang](https://skill-icons.alanreisanjo.workers.dev/icons?i=golang)          |
|     `googledocs`      |          ![googledocs](https://skill-icons.alanreisanjo.workers.dev/icons?i=googledocs)          |   `googledrive`   |     ![googledrive](https://skill-icons.alanreisanjo.workers.dev/icons?i=googledrive)     |
|     `googlemeet`      |          ![googlemeet](https://skill-icons.alanreisanjo.workers.dev/icons?i=googlemeet)          |    `googlepay`    |       ![googlepay](https://skill-icons.alanreisanjo.workers.dev/icons?i=googlepay)       |
|    `googlesheets`     |        ![googlesheets](https://skill-icons.alanreisanjo.workers.dev/icons?i=googlesheets)        |     `gradle`      |          ![gradle](https://skill-icons.alanreisanjo.workers.dev/icons?i=gradle)          |
|       `grafana`       |             ![grafana](https://skill-icons.alanreisanjo.workers.dev/icons?i=grafana)             |     `graphql`     |         ![graphql](https://skill-icons.alanreisanjo.workers.dev/icons?i=graphql)         |
|        `grok`         |                ![grok](https://skill-icons.alanreisanjo.workers.dev/icons?i=grok)                |      `gsap`       |            ![gsap](https://skill-icons.alanreisanjo.workers.dev/icons?i=gsap)            |
|         `gtk`         |                 ![gtk](https://skill-icons.alanreisanjo.workers.dev/icons?i=gtk)                 |     `guilded`     |         ![guilded](https://skill-icons.alanreisanjo.workers.dev/icons?i=guilded)         |
|        `gulp`         |                ![gulp](https://skill-icons.alanreisanjo.workers.dev/icons?i=gulp)                |   `hackernews`    |      ![hackernews](https://skill-icons.alanreisanjo.workers.dev/icons?i=hackernews)      |
|        `haiku`        |               ![haiku](https://skill-icons.alanreisanjo.workers.dev/icons?i=haiku)               |    `harmonyos`    |       ![harmonyos](https://skill-icons.alanreisanjo.workers.dev/icons?i=harmonyos)       |
|      `hashnode`       |            ![hashnode](https://skill-icons.alanreisanjo.workers.dev/icons?i=hashnode)            |     `haskell`     |         ![haskell](https://skill-icons.alanreisanjo.workers.dev/icons?i=haskell)         |
|        `hatch`        |               ![hatch](https://skill-icons.alanreisanjo.workers.dev/icons?i=hatch)               |      `haxe`       |            ![haxe](https://skill-icons.alanreisanjo.workers.dev/icons?i=haxe)            |
|     `haxeflixel`      |          ![haxeflixel](https://skill-icons.alanreisanjo.workers.dev/icons?i=haxeflixel)          |   `headlessui`    |      ![headlessui](https://skill-icons.alanreisanjo.workers.dev/icons?i=headlessui)      |
|        `helix`        |               ![helix](https://skill-icons.alanreisanjo.workers.dev/icons?i=helix)               |      `helm`       |            ![helm](https://skill-icons.alanreisanjo.workers.dev/icons?i=helm)            |
|       `heroku`        |              ![heroku](https://skill-icons.alanreisanjo.workers.dev/icons?i=heroku)              |    `hibernate`    |       ![hibernate](https://skill-icons.alanreisanjo.workers.dev/icons?i=hibernate)       |
|     `highcharts`      |          ![highcharts](https://skill-icons.alanreisanjo.workers.dev/icons?i=highcharts)          |    `homebrew`     |        ![homebrew](https://skill-icons.alanreisanjo.workers.dev/icons?i=homebrew)        |
|        `hono`         |                ![hono](https://skill-icons.alanreisanjo.workers.dev/icons?i=hono)                |   `hoppscotch`    |      ![hoppscotch](https://skill-icons.alanreisanjo.workers.dev/icons?i=hoppscotch)      |
|        `html`         |                ![html](https://skill-icons.alanreisanjo.workers.dev/icons?i=html)                |      `htmx`       |            ![htmx](https://skill-icons.alanreisanjo.workers.dev/icons?i=htmx)            |
|       `httpie`        |              ![httpie](https://skill-icons.alanreisanjo.workers.dev/icons?i=httpie)              |   `huggingface`   |     ![huggingface](https://skill-icons.alanreisanjo.workers.dev/icons?i=huggingface)     |
|        `husky`        |               ![husky](https://skill-icons.alanreisanjo.workers.dev/icons?i=husky)               |    `hyprland`     |        ![hyprland](https://skill-icons.alanreisanjo.workers.dev/icons?i=hyprland)        |
|         `i3`          |                  ![i3](https://skill-icons.alanreisanjo.workers.dev/icons?i=i3)                  |     `icloud`      |          ![icloud](https://skill-icons.alanreisanjo.workers.dev/icons?i=icloud)          |
|        `idea`         |                ![idea](https://skill-icons.alanreisanjo.workers.dev/icons?i=idea)                |   `illustrator`   |     ![illustrator](https://skill-icons.alanreisanjo.workers.dev/icons?i=illustrator)     |
|       `inferno`       |             ![inferno](https://skill-icons.alanreisanjo.workers.dev/icons?i=inferno)             |    `inkscape`     |        ![inkscape](https://skill-icons.alanreisanjo.workers.dev/icons?i=inkscape)        |
|      `inquirer`       |            ![inquirer](https://skill-icons.alanreisanjo.workers.dev/icons?i=inquirer)            |    `insomnia`     |        ![insomnia](https://skill-icons.alanreisanjo.workers.dev/icons?i=insomnia)        |
|      `instagram`      |           ![instagram](https://skill-icons.alanreisanjo.workers.dev/icons?i=instagram)           |      `ionic`      |           ![ionic](https://skill-icons.alanreisanjo.workers.dev/icons?i=ionic)           |
|         `ios`         |                 ![ios](https://skill-icons.alanreisanjo.workers.dev/icons?i=ios)                 |      `ipfs`       |            ![ipfs](https://skill-icons.alanreisanjo.workers.dev/icons?i=ipfs)            |
|       `iterm2`        |              ![iterm2](https://skill-icons.alanreisanjo.workers.dev/icons?i=iterm2)              |      `java`       |            ![java](https://skill-icons.alanreisanjo.workers.dev/icons?i=java)            |
|     `javascript`      |          ![javascript](https://skill-icons.alanreisanjo.workers.dev/icons?i=javascript)          |     `jenkins`     |         ![jenkins](https://skill-icons.alanreisanjo.workers.dev/icons?i=jenkins)         |
|        `jest`         |                ![jest](https://skill-icons.alanreisanjo.workers.dev/icons?i=jest)                | `jetpackcompose`  |  ![jetpackcompose](https://skill-icons.alanreisanjo.workers.dev/icons?i=jetpackcompose)  |
|        `jira`         |                ![jira](https://skill-icons.alanreisanjo.workers.dev/icons?i=jira)                |      `jotai`      |           ![jotai](https://skill-icons.alanreisanjo.workers.dev/icons?i=jotai)           |
|       `jquery`        |              ![jquery](https://skill-icons.alanreisanjo.workers.dev/icons?i=jquery)              |    `jsfiddle`     |        ![jsfiddle](https://skill-icons.alanreisanjo.workers.dev/icons?i=jsfiddle)        |
|        `json`         |                ![json](https://skill-icons.alanreisanjo.workers.dev/icons?i=json)                |       `jsr`       |             ![jsr](https://skill-icons.alanreisanjo.workers.dev/icons?i=jsr)             |
|        `julia`        |               ![julia](https://skill-icons.alanreisanjo.workers.dev/icons?i=julia)               |     `jupyter`     |         ![jupyter](https://skill-icons.alanreisanjo.workers.dev/icons?i=jupyter)         |
|        `just`         |                ![just](https://skill-icons.alanreisanjo.workers.dev/icons?i=just)                |      `kafka`      |           ![kafka](https://skill-icons.alanreisanjo.workers.dev/icons?i=kafka)           |
|       `kaggle`        |              ![kaggle](https://skill-icons.alanreisanjo.workers.dev/icons?i=kaggle)              |    `kakaotalk`    |       ![kakaotalk](https://skill-icons.alanreisanjo.workers.dev/icons?i=kakaotalk)       |
|       `kakoune`       |             ![kakoune](https://skill-icons.alanreisanjo.workers.dev/icons?i=kakoune)             |      `kali`       |            ![kali](https://skill-icons.alanreisanjo.workers.dev/icons?i=kali)            |
|        `kate`         |                ![kate](https://skill-icons.alanreisanjo.workers.dev/icons?i=kate)                |       `kde`       |             ![kde](https://skill-icons.alanreisanjo.workers.dev/icons?i=kde)             |
|      `keycloak`       |            ![keycloak](https://skill-icons.alanreisanjo.workers.dev/icons?i=keycloak)            |      `kick`       |            ![kick](https://skill-icons.alanreisanjo.workers.dev/icons?i=kick)            |
|        `kitty`        |               ![kitty](https://skill-icons.alanreisanjo.workers.dev/icons?i=kitty)               |      `knip`       |            ![knip](https://skill-icons.alanreisanjo.workers.dev/icons?i=knip)            |
|        `kofi`         |                ![kofi](https://skill-icons.alanreisanjo.workers.dev/icons?i=kofi)                |     `kotlin`      |          ![kotlin](https://skill-icons.alanreisanjo.workers.dev/icons?i=kotlin)          |
| `kotlinmultiplatform` | ![kotlinmultiplatform](https://skill-icons.alanreisanjo.workers.dev/icons?i=kotlinmultiplatform) |      `ktor`       |            ![ktor](https://skill-icons.alanreisanjo.workers.dev/icons?i=ktor)            |
|     `kubernetes`      |          ![kubernetes](https://skill-icons.alanreisanjo.workers.dev/icons?i=kubernetes)          |    `langchain`    |       ![langchain](https://skill-icons.alanreisanjo.workers.dev/icons?i=langchain)       |
|      `langfuse`       |            ![langfuse](https://skill-icons.alanreisanjo.workers.dev/icons?i=langfuse)            |      `lapce`      |           ![lapce](https://skill-icons.alanreisanjo.workers.dev/icons?i=lapce)           |
|       `laravel`       |             ![laravel](https://skill-icons.alanreisanjo.workers.dev/icons?i=laravel)             |      `latex`      |           ![latex](https://skill-icons.alanreisanjo.workers.dev/icons?i=latex)           |
|       `lazyvim`       |             ![lazyvim](https://skill-icons.alanreisanjo.workers.dev/icons?i=lazyvim)             |     `leaflet`     |         ![leaflet](https://skill-icons.alanreisanjo.workers.dev/icons?i=leaflet)         |
|      `lefthook`       |            ![lefthook](https://skill-icons.alanreisanjo.workers.dev/icons?i=lefthook)            |      `lemmy`      |           ![lemmy](https://skill-icons.alanreisanjo.workers.dev/icons?i=lemmy)           |
|    `lemonsqueezy`     |        ![lemonsqueezy](https://skill-icons.alanreisanjo.workers.dev/icons?i=lemonsqueezy)        |      `lerna`      |           ![lerna](https://skill-icons.alanreisanjo.workers.dev/icons?i=lerna)           |
|        `less`         |                ![less](https://skill-icons.alanreisanjo.workers.dev/icons?i=less)                |      `line`       |            ![line](https://skill-icons.alanreisanjo.workers.dev/icons?i=line)            |
|       `linear`        |              ![linear](https://skill-icons.alanreisanjo.workers.dev/icons?i=linear)              |    `linkedin`     |        ![linkedin](https://skill-icons.alanreisanjo.workers.dev/icons?i=linkedin)        |
|        `linux`        |               ![linux](https://skill-icons.alanreisanjo.workers.dev/icons?i=linux)               |       `lit`       |             ![lit](https://skill-icons.alanreisanjo.workers.dev/icons?i=lit)             |
|       `logseq`        |              ![logseq](https://skill-icons.alanreisanjo.workers.dev/icons?i=logseq)              |      `loom`       |            ![loom](https://skill-icons.alanreisanjo.workers.dev/icons?i=loom)            |
|       `lottie`        |              ![lottie](https://skill-icons.alanreisanjo.workers.dev/icons?i=lottie)              |       `lua`       |             ![lua](https://skill-icons.alanreisanjo.workers.dev/icons?i=lua)             |
|      `lunarvim`       |            ![lunarvim](https://skill-icons.alanreisanjo.workers.dev/icons?i=lunarvim)            |      `macos`      |           ![macos](https://skill-icons.alanreisanjo.workers.dev/icons?i=macos)           |
|        `make`         |                ![make](https://skill-icons.alanreisanjo.workers.dev/icons?i=make)                |     `manjaro`     |         ![manjaro](https://skill-icons.alanreisanjo.workers.dev/icons?i=manjaro)         |
|       `mantine`       |             ![mantine](https://skill-icons.alanreisanjo.workers.dev/icons?i=mantine)             |     `mapbox`      |          ![mapbox](https://skill-icons.alanreisanjo.workers.dev/icons?i=mapbox)          |
|       `mariadb`       |             ![mariadb](https://skill-icons.alanreisanjo.workers.dev/icons?i=mariadb)             |    `markdown`     |        ![markdown](https://skill-icons.alanreisanjo.workers.dev/icons?i=markdown)        |
|        `marko`        |               ![marko](https://skill-icons.alanreisanjo.workers.dev/icons?i=marko)               |   `mastercard`    |      ![mastercard](https://skill-icons.alanreisanjo.workers.dev/icons?i=mastercard)      |
|      `mastodon`       |            ![mastodon](https://skill-icons.alanreisanjo.workers.dev/icons?i=mastodon)            |   `materialui`    |      ![materialui](https://skill-icons.alanreisanjo.workers.dev/icons?i=materialui)      |
|       `matlab`        |              ![matlab](https://skill-icons.alanreisanjo.workers.dev/icons?i=matlab)              |     `matrix`      |          ![matrix](https://skill-icons.alanreisanjo.workers.dev/icons?i=matrix)          |
|      `matterjs`       |            ![matterjs](https://skill-icons.alanreisanjo.workers.dev/icons?i=matterjs)            |   `mattermost`    |      ![mattermost](https://skill-icons.alanreisanjo.workers.dev/icons?i=mattermost)      |
|        `maven`        |               ![maven](https://skill-icons.alanreisanjo.workers.dev/icons?i=maven)               |       `mcp`       |             ![mcp](https://skill-icons.alanreisanjo.workers.dev/icons?i=mcp)             |
|       `medium`        |              ![medium](https://skill-icons.alanreisanjo.workers.dev/icons?i=medium)              |   `mercadopago`   |     ![mercadopago](https://skill-icons.alanreisanjo.workers.dev/icons?i=mercadopago)     |
|        `meson`        |               ![meson](https://skill-icons.alanreisanjo.workers.dev/icons?i=meson)               |      `micro`      |           ![micro](https://skill-icons.alanreisanjo.workers.dev/icons?i=micro)           |
|       `million`       |             ![million](https://skill-icons.alanreisanjo.workers.dev/icons?i=million)             |      `mint`       |            ![mint](https://skill-icons.alanreisanjo.workers.dev/icons?i=mint)            |
|        `mise`         |                ![mise](https://skill-icons.alanreisanjo.workers.dev/icons?i=mise)                |     `misskey`     |         ![misskey](https://skill-icons.alanreisanjo.workers.dev/icons?i=misskey)         |
|       `mithril`       |             ![mithril](https://skill-icons.alanreisanjo.workers.dev/icons?i=mithril)             |      `mobx`       |            ![mobx](https://skill-icons.alanreisanjo.workers.dev/icons?i=mobx)            |
|        `mocha`        |               ![mocha](https://skill-icons.alanreisanjo.workers.dev/icons?i=mocha)               |     `mockoon`     |         ![mockoon](https://skill-icons.alanreisanjo.workers.dev/icons?i=mockoon)         |
|        `mojo`         |                ![mojo](https://skill-icons.alanreisanjo.workers.dev/icons?i=mojo)                |     `monday`      |          ![monday](https://skill-icons.alanreisanjo.workers.dev/icons?i=monday)          |
|       `mongodb`       |             ![mongodb](https://skill-icons.alanreisanjo.workers.dev/icons?i=mongodb)             |    `moonrepo`     |        ![moonrepo](https://skill-icons.alanreisanjo.workers.dev/icons?i=moonrepo)        |
|       `motion`        |              ![motion](https://skill-icons.alanreisanjo.workers.dev/icons?i=motion)              |      `mypy`       |            ![mypy](https://skill-icons.alanreisanjo.workers.dev/icons?i=mypy)            |
|        `mysql`        |               ![mysql](https://skill-icons.alanreisanjo.workers.dev/icons?i=mysql)               |       `n8n`       |             ![n8n](https://skill-icons.alanreisanjo.workers.dev/icons?i=n8n)             |
|        `neo4j`        |               ![neo4j](https://skill-icons.alanreisanjo.workers.dev/icons?i=neo4j)               |      `neon`       |            ![neon](https://skill-icons.alanreisanjo.workers.dev/icons?i=neon)            |
|       `neovim`        |              ![neovim](https://skill-icons.alanreisanjo.workers.dev/icons?i=neovim)              |     `nestjs`      |          ![nestjs](https://skill-icons.alanreisanjo.workers.dev/icons?i=nestjs)          |
|       `netbsd`        |              ![netbsd](https://skill-icons.alanreisanjo.workers.dev/icons?i=netbsd)              |     `netflix`     |         ![netflix](https://skill-icons.alanreisanjo.workers.dev/icons?i=netflix)         |
|       `netlify`       |             ![netlify](https://skill-icons.alanreisanjo.workers.dev/icons?i=netlify)             |     `nextjs`      |          ![nextjs](https://skill-icons.alanreisanjo.workers.dev/icons?i=nextjs)          |
|        `nginx`        |               ![nginx](https://skill-icons.alanreisanjo.workers.dev/icons?i=nginx)               |       `nim`       |             ![nim](https://skill-icons.alanreisanjo.workers.dev/icons?i=nim)             |
|         `nix`         |                 ![nix](https://skill-icons.alanreisanjo.workers.dev/icons?i=nix)                 |      `nixos`      |           ![nixos](https://skill-icons.alanreisanjo.workers.dev/icons?i=nixos)           |
|       `nodejs`        |              ![nodejs](https://skill-icons.alanreisanjo.workers.dev/icons?i=nodejs)              |     `nodemon`     |         ![nodemon](https://skill-icons.alanreisanjo.workers.dev/icons?i=nodemon)         |
|        `nostr`        |               ![nostr](https://skill-icons.alanreisanjo.workers.dev/icons?i=nostr)               | `notepadplusplus` | ![notepadplusplus](https://skill-icons.alanreisanjo.workers.dev/icons?i=notepadplusplus) |
|       `notion`        |              ![notion](https://skill-icons.alanreisanjo.workers.dev/icons?i=notion)              |      `nova`       |            ![nova](https://skill-icons.alanreisanjo.workers.dev/icons?i=nova)            |
|         `npm`         |                 ![npm](https://skill-icons.alanreisanjo.workers.dev/icons?i=npm)                 |     `nubank`      |          ![nubank](https://skill-icons.alanreisanjo.workers.dev/icons?i=nubank)          |
|        `numpy`        |               ![numpy](https://skill-icons.alanreisanjo.workers.dev/icons?i=numpy)               |     `nuxtjs`      |          ![nuxtjs](https://skill-icons.alanreisanjo.workers.dev/icons?i=nuxtjs)          |
|         `nvm`         |                 ![nvm](https://skill-icons.alanreisanjo.workers.dev/icons?i=nvm)                 |       `nx`        |              ![nx](https://skill-icons.alanreisanjo.workers.dev/icons?i=nx)              |
|     `observable`      |          ![observable](https://skill-icons.alanreisanjo.workers.dev/icons?i=observable)          |    `obsidian`     |        ![obsidian](https://skill-icons.alanreisanjo.workers.dev/icons?i=obsidian)        |
|        `ocaml`        |               ![ocaml](https://skill-icons.alanreisanjo.workers.dev/icons?i=ocaml)               |      `oclif`      |           ![oclif](https://skill-icons.alanreisanjo.workers.dev/icons?i=oclif)           |
|       `octave`        |              ![octave](https://skill-icons.alanreisanjo.workers.dev/icons?i=octave)              |     `ollama`      |          ![ollama](https://skill-icons.alanreisanjo.workers.dev/icons?i=ollama)          |
|      `onedrive`       |            ![onedrive](https://skill-icons.alanreisanjo.workers.dev/icons?i=onedrive)            |     `onenote`     |         ![onenote](https://skill-icons.alanreisanjo.workers.dev/icons?i=onenote)         |
|       `openai`        |              ![openai](https://skill-icons.alanreisanjo.workers.dev/icons?i=openai)              |     `openapi`     |         ![openapi](https://skill-icons.alanreisanjo.workers.dev/icons?i=openapi)         |
|       `openbsd`       |             ![openbsd](https://skill-icons.alanreisanjo.workers.dev/icons?i=openbsd)             |    `openclaw`     |        ![openclaw](https://skill-icons.alanreisanjo.workers.dev/icons?i=openclaw)        |
|      `opencode`       |            ![opencode](https://skill-icons.alanreisanjo.workers.dev/icons?i=opencode)            | `opencollective`  |  ![opencollective](https://skill-icons.alanreisanjo.workers.dev/icons?i=opencollective)  |
|       `opencv`        |              ![opencv](https://skill-icons.alanreisanjo.workers.dev/icons?i=opencv)              |   `openlayers`    |      ![openlayers](https://skill-icons.alanreisanjo.workers.dev/icons?i=openlayers)      |
|      `openshift`      |           ![openshift](https://skill-icons.alanreisanjo.workers.dev/icons?i=openshift)           |    `openstack`    |       ![openstack](https://skill-icons.alanreisanjo.workers.dev/icons?i=openstack)       |
|      `opensuse`       |            ![opensuse](https://skill-icons.alanreisanjo.workers.dev/icons?i=opensuse)            |  `opentelemetry`  |   ![opentelemetry](https://skill-icons.alanreisanjo.workers.dev/icons?i=opentelemetry)   |
|       `oxlint`        |              ![oxlint](https://skill-icons.alanreisanjo.workers.dev/icons?i=oxlint)              |      `p5js`       |            ![p5js](https://skill-icons.alanreisanjo.workers.dev/icons?i=p5js)            |
|       `paddle`        |              ![paddle](https://skill-icons.alanreisanjo.workers.dev/icons?i=paddle)              |    `pagseguro`    |       ![pagseguro](https://skill-icons.alanreisanjo.workers.dev/icons?i=pagseguro)       |
|       `pandas`        |              ![pandas](https://skill-icons.alanreisanjo.workers.dev/icons?i=pandas)              |     `parcel`      |          ![parcel](https://skill-icons.alanreisanjo.workers.dev/icons?i=parcel)          |
|       `parkui`        |              ![parkui](https://skill-icons.alanreisanjo.workers.dev/icons?i=parkui)              |     `patreon`     |         ![patreon](https://skill-icons.alanreisanjo.workers.dev/icons?i=patreon)         |
|       `paypal`        |              ![paypal](https://skill-icons.alanreisanjo.workers.dev/icons?i=paypal)              |       `pdm`       |             ![pdm](https://skill-icons.alanreisanjo.workers.dev/icons?i=pdm)             |
|      `peertube`       |            ![peertube](https://skill-icons.alanreisanjo.workers.dev/icons?i=peertube)            |      `perl`       |            ![perl](https://skill-icons.alanreisanjo.workers.dev/icons?i=perl)            |
|     `perplexity`      |          ![perplexity](https://skill-icons.alanreisanjo.workers.dev/icons?i=perplexity)          |    `photoshop`    |       ![photoshop](https://skill-icons.alanreisanjo.workers.dev/icons?i=photoshop)       |
|         `php`         |                 ![php](https://skill-icons.alanreisanjo.workers.dev/icons?i=php)                 |    `phpstorm`     |        ![phpstorm](https://skill-icons.alanreisanjo.workers.dev/icons?i=phpstorm)        |
|        `pinia`        |               ![pinia](https://skill-icons.alanreisanjo.workers.dev/icons?i=pinia)               |    `pinterest`    |       ![pinterest](https://skill-icons.alanreisanjo.workers.dev/icons?i=pinterest)       |
|         `pix`         |                 ![pix](https://skill-icons.alanreisanjo.workers.dev/icons?i=pix)                 |    `pixelfed`     |        ![pixelfed](https://skill-icons.alanreisanjo.workers.dev/icons?i=pixelfed)        |
|       `pixijs`        |              ![pixijs](https://skill-icons.alanreisanjo.workers.dev/icons?i=pixijs)              |       `pkl`       |             ![pkl](https://skill-icons.alanreisanjo.workers.dev/icons?i=pkl)             |
|        `plan9`        |               ![plan9](https://skill-icons.alanreisanjo.workers.dev/icons?i=plan9)               |      `plane`      |           ![plane](https://skill-icons.alanreisanjo.workers.dev/icons?i=plane)           |
|     `planetscale`     |         ![planetscale](https://skill-icons.alanreisanjo.workers.dev/icons?i=planetscale)         |   `playwright`    |      ![playwright](https://skill-icons.alanreisanjo.workers.dev/icons?i=playwright)      |
|       `plotly`        |              ![plotly](https://skill-icons.alanreisanjo.workers.dev/icons?i=plotly)              |       `pm2`       |             ![pm2](https://skill-icons.alanreisanjo.workers.dev/icons?i=pm2)             |
|        `pnpm`         |                ![pnpm](https://skill-icons.alanreisanjo.workers.dev/icons?i=pnpm)                |     `pocket`      |          ![pocket](https://skill-icons.alanreisanjo.workers.dev/icons?i=pocket)          |
|     `pocketbase`      |          ![pocketbase](https://skill-icons.alanreisanjo.workers.dev/icons?i=pocketbase)          |     `poetry`      |          ![poetry](https://skill-icons.alanreisanjo.workers.dev/icons?i=poetry)          |
|        `polar`        |               ![polar](https://skill-icons.alanreisanjo.workers.dev/icons?i=polar)               |     `polymer`     |         ![polymer](https://skill-icons.alanreisanjo.workers.dev/icons?i=polymer)         |
|        `popos`        |               ![popos](https://skill-icons.alanreisanjo.workers.dev/icons?i=popos)               |     `postcss`     |         ![postcss](https://skill-icons.alanreisanjo.workers.dev/icons?i=postcss)         |
|     `postgresql`      |          ![postgresql](https://skill-icons.alanreisanjo.workers.dev/icons?i=postgresql)          |     `posthog`     |         ![posthog](https://skill-icons.alanreisanjo.workers.dev/icons?i=posthog)         |
|       `postman`       |             ![postman](https://skill-icons.alanreisanjo.workers.dev/icons?i=postman)             |   `powerpoint`    |      ![powerpoint](https://skill-icons.alanreisanjo.workers.dev/icons?i=powerpoint)      |
|     `powershell`      |          ![powershell](https://skill-icons.alanreisanjo.workers.dev/icons?i=powershell)          |     `preact`      |          ![preact](https://skill-icons.alanreisanjo.workers.dev/icons?i=preact)          |
|      `premiere`       |            ![premiere](https://skill-icons.alanreisanjo.workers.dev/icons?i=premiere)            |    `prettier`     |        ![prettier](https://skill-icons.alanreisanjo.workers.dev/icons?i=prettier)        |
|       `prisma`        |              ![prisma](https://skill-icons.alanreisanjo.workers.dev/icons?i=prisma)              |   `processing`    |      ![processing](https://skill-icons.alanreisanjo.workers.dev/icons?i=processing)      |
|     `producthunt`     |         ![producthunt](https://skill-icons.alanreisanjo.workers.dev/icons?i=producthunt)         |   `prometheus`    |      ![prometheus](https://skill-icons.alanreisanjo.workers.dev/icons?i=prometheus)      |
|         `pug`         |                 ![pug](https://skill-icons.alanreisanjo.workers.dev/icons?i=pug)                 |    `puppeteer`    |       ![puppeteer](https://skill-icons.alanreisanjo.workers.dev/icons?i=puppeteer)       |
|       `pycharm`       |             ![pycharm](https://skill-icons.alanreisanjo.workers.dev/icons?i=pycharm)             |     `pylint`      |          ![pylint](https://skill-icons.alanreisanjo.workers.dev/icons?i=pylint)          |
|       `pytest`        |              ![pytest](https://skill-icons.alanreisanjo.workers.dev/icons?i=pytest)              |     `python`      |          ![python](https://skill-icons.alanreisanjo.workers.dev/icons?i=python)          |
|       `pytorch`       |             ![pytorch](https://skill-icons.alanreisanjo.workers.dev/icons?i=pytorch)             |       `qt`        |              ![qt](https://skill-icons.alanreisanjo.workers.dev/icons?i=qt)              |
|        `qubes`        |               ![qubes](https://skill-icons.alanreisanjo.workers.dev/icons?i=qubes)               |      `qwik`       |            ![qwik](https://skill-icons.alanreisanjo.workers.dev/icons?i=qwik)            |
|          `r`          |                   ![r](https://skill-icons.alanreisanjo.workers.dev/icons?i=r)                   |    `rabbitmq`     |        ![rabbitmq](https://skill-icons.alanreisanjo.workers.dev/icons?i=rabbitmq)        |
|       `radixui`       |             ![radixui](https://skill-icons.alanreisanjo.workers.dev/icons?i=radixui)             |      `rails`      |           ![rails](https://skill-icons.alanreisanjo.workers.dev/icons?i=rails)           |
|       `railway`       |             ![railway](https://skill-icons.alanreisanjo.workers.dev/icons?i=railway)             |   `raspberrypi`   |     ![raspberrypi](https://skill-icons.alanreisanjo.workers.dev/icons?i=raspberrypi)     |
|       `raycast`       |             ![raycast](https://skill-icons.alanreisanjo.workers.dev/icons?i=raycast)             |    `razorpay`     |        ![razorpay](https://skill-icons.alanreisanjo.workers.dev/icons?i=razorpay)        |
|        `react`        |               ![react](https://skill-icons.alanreisanjo.workers.dev/icons?i=react)               |  `reacthookform`  |   ![reacthookform](https://skill-icons.alanreisanjo.workers.dev/icons?i=reacthookform)   |
|      `reactivex`      |           ![reactivex](https://skill-icons.alanreisanjo.workers.dev/icons?i=reactivex)           |   `reactnative`   |     ![reactnative](https://skill-icons.alanreisanjo.workers.dev/icons?i=reactnative)     |
|       `reactos`       |             ![reactos](https://skill-icons.alanreisanjo.workers.dev/icons?i=reactos)             |   `reactquery`    |      ![reactquery](https://skill-icons.alanreisanjo.workers.dev/icons?i=reactquery)      |
|     `reactrouter`     |         ![reactrouter](https://skill-icons.alanreisanjo.workers.dev/icons?i=reactrouter)         |    `readwise`     |        ![readwise](https://skill-icons.alanreisanjo.workers.dev/icons?i=readwise)        |
|       `recoil`        |              ![recoil](https://skill-icons.alanreisanjo.workers.dev/icons?i=recoil)              |     `reddit`      |          ![reddit](https://skill-icons.alanreisanjo.workers.dev/icons?i=reddit)          |
|       `redhat`        |              ![redhat](https://skill-icons.alanreisanjo.workers.dev/icons?i=redhat)              |      `redis`      |           ![redis](https://skill-icons.alanreisanjo.workers.dev/icons?i=redis)           |
|        `redux`        |               ![redux](https://skill-icons.alanreisanjo.workers.dev/icons?i=redux)               |      `regex`      |           ![regex](https://skill-icons.alanreisanjo.workers.dev/icons?i=regex)           |
|        `remix`        |               ![remix](https://skill-icons.alanreisanjo.workers.dev/icons?i=remix)               |     `replit`      |          ![replit](https://skill-icons.alanreisanjo.workers.dev/icons?i=replit)          |
|       `resend`        |              ![resend](https://skill-icons.alanreisanjo.workers.dev/icons?i=resend)              |      `rider`      |           ![rider](https://skill-icons.alanreisanjo.workers.dev/icons?i=rider)           |
|        `rive`         |                ![rive](https://skill-icons.alanreisanjo.workers.dev/icons?i=rive)                |      `roam`       |            ![roam](https://skill-icons.alanreisanjo.workers.dev/icons?i=roam)            |
|    `robloxstudio`     |        ![robloxstudio](https://skill-icons.alanreisanjo.workers.dev/icons?i=robloxstudio)        |     `rocket`      |          ![rocket](https://skill-icons.alanreisanjo.workers.dev/icons?i=rocket)          |
|     `rocketchat`      |          ![rocketchat](https://skill-icons.alanreisanjo.workers.dev/icons?i=rocketchat)          |      `rocky`      |           ![rocky](https://skill-icons.alanreisanjo.workers.dev/icons?i=rocky)           |
|      `rolldown`       |            ![rolldown](https://skill-icons.alanreisanjo.workers.dev/icons?i=rolldown)            |    `rollupjs`     |        ![rollupjs](https://skill-icons.alanreisanjo.workers.dev/icons?i=rollupjs)        |
|         `ros`         |                 ![ros](https://skill-icons.alanreisanjo.workers.dev/icons?i=ros)                 |     `rspack`      |          ![rspack](https://skill-icons.alanreisanjo.workers.dev/icons?i=rspack)          |
|        `ruby`         |                ![ruby](https://skill-icons.alanreisanjo.workers.dev/icons?i=ruby)                |    `rubymine`     |        ![rubymine](https://skill-icons.alanreisanjo.workers.dev/icons?i=rubymine)        |
|        `ruff`         |                ![ruff](https://skill-icons.alanreisanjo.workers.dev/icons?i=ruff)                |      `rush`       |            ![rush](https://skill-icons.alanreisanjo.workers.dev/icons?i=rush)            |
|        `rust`         |                ![rust](https://skill-icons.alanreisanjo.workers.dev/icons?i=rust)                |    `rustrover`    |       ![rustrover](https://skill-icons.alanreisanjo.workers.dev/icons?i=rustrover)       |
|         `rye`         |                 ![rye](https://skill-icons.alanreisanjo.workers.dev/icons?i=rye)                 |      `sass`       |            ![sass](https://skill-icons.alanreisanjo.workers.dev/icons?i=sass)            |
|        `scala`        |               ![scala](https://skill-icons.alanreisanjo.workers.dev/icons?i=scala)               |     `scalar`      |          ![scalar](https://skill-icons.alanreisanjo.workers.dev/icons?i=scalar)          |
|     `scikitlearn`     |         ![scikitlearn](https://skill-icons.alanreisanjo.workers.dev/icons?i=scikitlearn)         |      `scoop`      |           ![scoop](https://skill-icons.alanreisanjo.workers.dev/icons?i=scoop)           |
|      `selenium`       |            ![selenium](https://skill-icons.alanreisanjo.workers.dev/icons?i=selenium)            |     `sentry`      |          ![sentry](https://skill-icons.alanreisanjo.workers.dev/icons?i=sentry)          |
|      `sequelize`      |           ![sequelize](https://skill-icons.alanreisanjo.workers.dev/icons?i=sequelize)           |    `shadcnui`     |        ![shadcnui](https://skill-icons.alanreisanjo.workers.dev/icons?i=shadcnui)        |
|      `shortcut`       |            ![shortcut](https://skill-icons.alanreisanjo.workers.dev/icons?i=shortcut)            |     `signal`      |          ![signal](https://skill-icons.alanreisanjo.workers.dev/icons?i=signal)          |
|       `signoz`        |              ![signoz](https://skill-icons.alanreisanjo.workers.dev/icons?i=signoz)              |    `skeleton`     |        ![skeleton](https://skill-icons.alanreisanjo.workers.dev/icons?i=skeleton)        |
|       `sketch`        |              ![sketch](https://skill-icons.alanreisanjo.workers.dev/icons?i=sketch)              |    `sketchup`     |        ![sketchup](https://skill-icons.alanreisanjo.workers.dev/icons?i=sketchup)        |
|        `slack`        |               ![slack](https://skill-icons.alanreisanjo.workers.dev/icons?i=slack)               |    `slackware`    |       ![slackware](https://skill-icons.alanreisanjo.workers.dev/icons?i=slackware)       |
|      `snapchat`       |            ![snapchat](https://skill-icons.alanreisanjo.workers.dev/icons?i=snapchat)            |    `solidity`     |        ![solidity](https://skill-icons.alanreisanjo.workers.dev/icons?i=solidity)        |
|       `solidjs`       |             ![solidjs](https://skill-icons.alanreisanjo.workers.dev/icons?i=solidjs)             |   `soundcloud`    |      ![soundcloud](https://skill-icons.alanreisanjo.workers.dev/icons?i=soundcloud)      |
|      `spacemacs`      |           ![spacemacs](https://skill-icons.alanreisanjo.workers.dev/icons?i=spacemacs)           |     `spotify`     |         ![spotify](https://skill-icons.alanreisanjo.workers.dev/icons?i=spotify)         |
|       `spring`        |              ![spring](https://skill-icons.alanreisanjo.workers.dev/icons?i=spring)              |       `sql`       |             ![sql](https://skill-icons.alanreisanjo.workers.dev/icons?i=sql)             |
|       `sqlite`        |              ![sqlite](https://skill-icons.alanreisanjo.workers.dev/icons?i=sqlite)              |    `sqlserver`    |       ![sqlserver](https://skill-icons.alanreisanjo.workers.dev/icons?i=sqlserver)       |
|       `square`        |              ![square](https://skill-icons.alanreisanjo.workers.dev/icons?i=square)              |   `stackblitz`    |      ![stackblitz](https://skill-icons.alanreisanjo.workers.dev/icons?i=stackblitz)      |
|    `stackoverflow`    |       ![stackoverflow](https://skill-icons.alanreisanjo.workers.dev/icons?i=stackoverflow)       |    `starlight`    |       ![starlight](https://skill-icons.alanreisanjo.workers.dev/icons?i=starlight)       |
|      `starship`       |            ![starship](https://skill-icons.alanreisanjo.workers.dev/icons?i=starship)            |     `stencil`     |         ![stencil](https://skill-icons.alanreisanjo.workers.dev/icons?i=stencil)         |
|      `stimulus`       |            ![stimulus](https://skill-icons.alanreisanjo.workers.dev/icons?i=stimulus)            |      `stoat`      |           ![stoat](https://skill-icons.alanreisanjo.workers.dev/icons?i=stoat)           |
|      `stoplight`      |           ![stoplight](https://skill-icons.alanreisanjo.workers.dev/icons?i=stoplight)           |    `storybook`    |       ![storybook](https://skill-icons.alanreisanjo.workers.dev/icons?i=storybook)       |
|       `strapi`        |              ![strapi](https://skill-icons.alanreisanjo.workers.dev/icons?i=strapi)              |     `stripe`      |          ![stripe](https://skill-icons.alanreisanjo.workers.dev/icons?i=stripe)          |
|  `styledcomponents`   |    ![styledcomponents](https://skill-icons.alanreisanjo.workers.dev/icons?i=styledcomponents)    |    `stylelint`    |       ![stylelint](https://skill-icons.alanreisanjo.workers.dev/icons?i=stylelint)       |
|       `sublime`       |             ![sublime](https://skill-icons.alanreisanjo.workers.dev/icons?i=sublime)             |    `substack`     |        ![substack](https://skill-icons.alanreisanjo.workers.dev/icons?i=substack)        |
|      `supabase`       |            ![supabase](https://skill-icons.alanreisanjo.workers.dev/icons?i=supabase)            |   `superhuman`    |      ![superhuman](https://skill-icons.alanreisanjo.workers.dev/icons?i=superhuman)      |
|       `svelte`        |              ![svelte](https://skill-icons.alanreisanjo.workers.dev/icons?i=svelte)              |       `svg`       |             ![svg](https://skill-icons.alanreisanjo.workers.dev/icons?i=svg)             |
|       `swagger`       |             ![swagger](https://skill-icons.alanreisanjo.workers.dev/icons?i=swagger)             |      `sway`       |            ![sway](https://skill-icons.alanreisanjo.workers.dev/icons?i=sway)            |
|         `swc`         |                 ![swc](https://skill-icons.alanreisanjo.workers.dev/icons?i=swc)                 |      `swift`      |           ![swift](https://skill-icons.alanreisanjo.workers.dev/icons?i=swift)           |
|         `swr`         |                 ![swr](https://skill-icons.alanreisanjo.workers.dev/icons?i=swr)                 |     `symfony`     |         ![symfony](https://skill-icons.alanreisanjo.workers.dev/icons?i=symfony)         |
|        `tails`        |               ![tails](https://skill-icons.alanreisanjo.workers.dev/icons?i=tails)               |   `tailwindcss`   |     ![tailwindcss](https://skill-icons.alanreisanjo.workers.dev/icons?i=tailwindcss)     |
|      `tanstack`       |            ![tanstack](https://skill-icons.alanreisanjo.workers.dev/icons?i=tanstack)            |    `taskfile`     |        ![taskfile](https://skill-icons.alanreisanjo.workers.dev/icons?i=taskfile)        |
|        `tauri`        |               ![tauri](https://skill-icons.alanreisanjo.workers.dev/icons?i=tauri)               |      `teams`      |           ![teams](https://skill-icons.alanreisanjo.workers.dev/icons?i=teams)           |
|      `telegram`       |            ![telegram](https://skill-icons.alanreisanjo.workers.dev/icons?i=telegram)            |   `tensorflow`    |      ![tensorflow](https://skill-icons.alanreisanjo.workers.dev/icons?i=tensorflow)      |
|      `terraform`      |           ![terraform](https://skill-icons.alanreisanjo.workers.dev/icons?i=terraform)           | `testinglibrary`  |  ![testinglibrary](https://skill-icons.alanreisanjo.workers.dev/icons?i=testinglibrary)  |
|       `things`        |              ![things](https://skill-icons.alanreisanjo.workers.dev/icons?i=things)              |     `threads`     |         ![threads](https://skill-icons.alanreisanjo.workers.dev/icons?i=threads)         |
|       `threejs`       |             ![threejs](https://skill-icons.alanreisanjo.workers.dev/icons?i=threejs)             |     `tiktok`      |          ![tiktok](https://skill-icons.alanreisanjo.workers.dev/icons?i=tiktok)          |
|        `tmux`         |                ![tmux](https://skill-icons.alanreisanjo.workers.dev/icons?i=tmux)                |     `todoist`     |         ![todoist](https://skill-icons.alanreisanjo.workers.dev/icons?i=todoist)         |
|        `trae`         |                ![trae](https://skill-icons.alanreisanjo.workers.dev/icons?i=trae)                |     `traefik`     |         ![traefik](https://skill-icons.alanreisanjo.workers.dev/icons?i=traefik)         |
|       `trello`        |              ![trello](https://skill-icons.alanreisanjo.workers.dev/icons?i=trello)              |      `trpc`       |            ![trpc](https://skill-icons.alanreisanjo.workers.dev/icons?i=trpc)            |
|       `tumblr`        |              ![tumblr](https://skill-icons.alanreisanjo.workers.dev/icons?i=tumblr)              |    `turbopack`    |       ![turbopack](https://skill-icons.alanreisanjo.workers.dev/icons?i=turbopack)       |
|      `turborepo`      |           ![turborepo](https://skill-icons.alanreisanjo.workers.dev/icons?i=turborepo)           |      `turso`      |           ![turso](https://skill-icons.alanreisanjo.workers.dev/icons?i=turso)           |
|       `twitch`        |              ![twitch](https://skill-icons.alanreisanjo.workers.dev/icons?i=twitch)              |     `twitter`     |         ![twitter](https://skill-icons.alanreisanjo.workers.dev/icons?i=twitter)         |
|     `typescript`      |          ![typescript](https://skill-icons.alanreisanjo.workers.dev/icons?i=typescript)          |     `ubuntu`      |          ![ubuntu](https://skill-icons.alanreisanjo.workers.dev/icons?i=ubuntu)          |
|       `unbuild`       |             ![unbuild](https://skill-icons.alanreisanjo.workers.dev/icons?i=unbuild)             |      `unity`      |           ![unity](https://skill-icons.alanreisanjo.workers.dev/icons?i=unity)           |
|       `unocss`        |              ![unocss](https://skill-icons.alanreisanjo.workers.dev/icons?i=unocss)              |  `unrealengine`   |    ![unrealengine](https://skill-icons.alanreisanjo.workers.dev/icons?i=unrealengine)    |
|       `upstash`       |             ![upstash](https://skill-icons.alanreisanjo.workers.dev/icons?i=upstash)             |       `uv`        |              ![uv](https://skill-icons.alanreisanjo.workers.dev/icons?i=uv)              |
|          `v`          |                   ![v](https://skill-icons.alanreisanjo.workers.dev/icons?i=v)                   |      `vala`       |            ![vala](https://skill-icons.alanreisanjo.workers.dev/icons?i=vala)            |
|        `vcpkg`        |               ![vcpkg](https://skill-icons.alanreisanjo.workers.dev/icons?i=vcpkg)               |     `vercel`      |          ![vercel](https://skill-icons.alanreisanjo.workers.dev/icons?i=vercel)          |
|      `verdaccio`      |           ![verdaccio](https://skill-icons.alanreisanjo.workers.dev/icons?i=verdaccio)           |     `verilog`     |         ![verilog](https://skill-icons.alanreisanjo.workers.dev/icons?i=verilog)         |
|        `viber`        |               ![viber](https://skill-icons.alanreisanjo.workers.dev/icons?i=viber)               |     `victory`     |         ![victory](https://skill-icons.alanreisanjo.workers.dev/icons?i=victory)         |
|         `vim`         |                 ![vim](https://skill-icons.alanreisanjo.workers.dev/icons?i=vim)                 |      `vimeo`      |           ![vimeo](https://skill-icons.alanreisanjo.workers.dev/icons?i=vimeo)           |
|        `visa`         |                ![visa](https://skill-icons.alanreisanjo.workers.dev/icons?i=visa)                |  `visualstudio`   |    ![visualstudio](https://skill-icons.alanreisanjo.workers.dev/icons?i=visualstudio)    |
|        `vite`         |                ![vite](https://skill-icons.alanreisanjo.workers.dev/icons?i=vite)                |     `vitest`      |          ![vitest](https://skill-icons.alanreisanjo.workers.dev/icons?i=vitest)          |
|        `void`         |                ![void](https://skill-icons.alanreisanjo.workers.dev/icons?i=void)                |      `volta`      |           ![volta](https://skill-icons.alanreisanjo.workers.dev/icons?i=volta)           |
|       `vscode`        |              ![vscode](https://skill-icons.alanreisanjo.workers.dev/icons?i=vscode)              |    `vscodium`     |        ![vscodium](https://skill-icons.alanreisanjo.workers.dev/icons?i=vscodium)        |
|        `vuejs`        |               ![vuejs](https://skill-icons.alanreisanjo.workers.dev/icons?i=vuejs)               |     `vuetify`     |         ![vuetify](https://skill-icons.alanreisanjo.workers.dev/icons?i=vuetify)         |
|        `warp`         |                ![warp](https://skill-icons.alanreisanjo.workers.dev/icons?i=warp)                |     `wayland`     |         ![wayland](https://skill-icons.alanreisanjo.workers.dev/icons?i=wayland)         |
|     `webassembly`     |         ![webassembly](https://skill-icons.alanreisanjo.workers.dev/icons?i=webassembly)         |     `webflow`     |         ![webflow](https://skill-icons.alanreisanjo.workers.dev/icons?i=webflow)         |
|       `webpack`       |             ![webpack](https://skill-icons.alanreisanjo.workers.dev/icons?i=webpack)             |    `webstorm`     |        ![webstorm](https://skill-icons.alanreisanjo.workers.dev/icons?i=webstorm)        |
|       `wechat`        |              ![wechat](https://skill-icons.alanreisanjo.workers.dev/icons?i=wechat)              |     `wezterm`     |         ![wezterm](https://skill-icons.alanreisanjo.workers.dev/icons?i=wezterm)         |
|      `whatsapp`       |            ![whatsapp](https://skill-icons.alanreisanjo.workers.dev/icons?i=whatsapp)            |    `windicss`     |        ![windicss](https://skill-icons.alanreisanjo.workers.dev/icons?i=windicss)        |
|       `windows`       |             ![windows](https://skill-icons.alanreisanjo.workers.dev/icons?i=windows)             |    `windsurf`     |        ![windsurf](https://skill-icons.alanreisanjo.workers.dev/icons?i=windsurf)        |
|      `wiremock`       |            ![wiremock](https://skill-icons.alanreisanjo.workers.dev/icons?i=wiremock)            |      `word`       |            ![word](https://skill-icons.alanreisanjo.workers.dev/icons?i=word)            |
|      `wordpress`      |           ![wordpress](https://skill-icons.alanreisanjo.workers.dev/icons?i=wordpress)           |     `workers`     |         ![workers](https://skill-icons.alanreisanjo.workers.dev/icons?i=workers)         |
|         `wsl`         |                 ![wsl](https://skill-icons.alanreisanjo.workers.dev/icons?i=wsl)                 |       `x11`       |             ![x11](https://skill-icons.alanreisanjo.workers.dev/icons?i=x11)             |
|        `xcode`        |               ![xcode](https://skill-icons.alanreisanjo.workers.dev/icons?i=xcode)               |       `xd`        |              ![xd](https://skill-icons.alanreisanjo.workers.dev/icons?i=xd)              |
|        `xfce`         |                ![xfce](https://skill-icons.alanreisanjo.workers.dev/icons?i=xfce)                |     `xstate`      |          ![xstate](https://skill-icons.alanreisanjo.workers.dev/icons?i=xstate)          |
|        `yaml`         |                ![yaml](https://skill-icons.alanreisanjo.workers.dev/icons?i=yaml)                |      `yarn`       |            ![yarn](https://skill-icons.alanreisanjo.workers.dev/icons?i=yarn)            |
|         `yew`         |                 ![yew](https://skill-icons.alanreisanjo.workers.dev/icons?i=yew)                 |     `youtube`     |         ![youtube](https://skill-icons.alanreisanjo.workers.dev/icons?i=youtube)         |
|       `zapier`        |              ![zapier](https://skill-icons.alanreisanjo.workers.dev/icons?i=zapier)              |       `zed`       |             ![zed](https://skill-icons.alanreisanjo.workers.dev/icons?i=zed)             |
|       `zellij`        |              ![zellij](https://skill-icons.alanreisanjo.workers.dev/icons?i=zellij)              |       `zig`       |             ![zig](https://skill-icons.alanreisanjo.workers.dev/icons?i=zig)             |
|         `zod`         |                 ![zod](https://skill-icons.alanreisanjo.workers.dev/icons?i=zod)                 |      `zoom`       |            ![zoom](https://skill-icons.alanreisanjo.workers.dev/icons?i=zoom)            |
|        `zorin`        |               ![zorin](https://skill-icons.alanreisanjo.workers.dev/icons?i=zorin)               |       `zsh`       |             ![zsh](https://skill-icons.alanreisanjo.workers.dev/icons?i=zsh)             |
|        `zulip`        |               ![zulip](https://skill-icons.alanreisanjo.workers.dev/icons?i=zulip)               |     `zustand`     |         ![zustand](https://skill-icons.alanreisanjo.workers.dev/icons?i=zustand)         |
|         `zx`          |                  ![zx](https://skill-icons.alanreisanjo.workers.dev/icons?i=zx)                  |                   |                                                                                          |

# Development

The site (builder) and the API run on the same Cloudflare Worker. The npm package lives in `packages/skill-icons`, a Bun workspace. Requires [Bun](https://bun.sh).

```sh
bun install
bun run dev        # site + API at http://localhost:5173
bun run test       # Worker tests, running inside workerd
bun run typecheck
bun run preview    # production build, served locally
bun run deploy
```

Package:

```sh
bun run build:lib      # builds packages/skill-icons/dist
bun run test:lib       # package tests
bun run typecheck:lib  # tsc, vue-tsc, ngc, svelte-check, astro check
bun run pack:lib       # builds and lists the files that would be published
```

### Generating an icon

`skill-icon` wraps any logo SVG in the standard 256×256 rounded container and writes it to `./icons/`:

```sh
bun skill-icon generate --name Spotify --generate ./spotify.svg --category social                       # icons/Spotify-Dark.svg + icons/Spotify-Light.svg
bun skill-icon generate --name Spotify --generate ./spotify.svg --category social --background "#1ED760" # icons/Spotify.svg
bun skill-icon category list                                                                            # available categories
```

`--name`, `--generate` and `--category` are required. The icon is also registered in `shared/icon-categories.ts`. Add `--force` to overwrite existing files. Run `bun run icons` (or `dev`/`build`) afterwards to update `public/svg/` and the package's generated icons.

### Icon Manager (macOS app)

> [!NOTE]
> **Skill Icons Manager** is a small macOS app for maintaining this repo's icons. It is a tool for contributors working on a clone, not part of the site or the package. It needs macOS 13 or newer and works on Apple silicon and Intel Macs.

What it does:

- **Icons**: browse every SVG in `icons/` and switch between the Dark and Light variants. Select icons and group them into stacks, then copy a stack as an array of paths, relative (`icons/…`) or absolute: `{ "light": "…", "dark": "…" }` for themed icons, a plain string for icons without a theme. The grid updates as soon as a file in `icons/` changes. Stacks are saved per user, outside the repo.
- **Candidates**: the shared to-do list of icons to add, read from and written to [`icon-candidates.json`](./icon-candidates.json), so it travels with git. Add a candidate by name, category and priority, change its status (pending → researched → added), and copy its `bun skill-icon generate` command.
- English or Portuguese, picked from the system language. Two appearances: the site's palette or native macOS with Liquid Glass (**View** menu).

**Install from a release:** download `Skill-Icons-Manager.dmg` from the [Icon Manager releases](https://github.com/Hoyasumii/skill-icons/releases?q=manager-v), open it and drag the app to **Applications**. On first launch it asks for your skill-icons clone. The app isn't notarized, so macOS blocks the first launch: open **System Settings → Privacy & Security** and click **Open Anyway**, or run `xattr -dr com.apple.quarantine "/Applications/Skill Icons Manager.app"`.

**Build it yourself** (needs the Xcode Command Line Tools: `xcode-select --install`):

```sh
bun run manager        # builds the app and opens the DMG: drag it to Applications
bun run manager:build  # only the app, in tools/icon-manager/build/
bun run manager:dmg    # app + tools/icon-manager/build/Skill-Icons-Manager.dmg
```

A local build already knows where your clone is. Building the DMG lays out its window through Finder, so macOS may ask to let your terminal control Finder.

| Path                    | Description                                                               |
| ----------------------- | ------------------------------------------------------------------------- |
| `icons/`                | Source SVGs                                                               |
| `scripts/`              | Generates `generated/`, `public/svg/` and the package icons from `icons/` |
| `worker/`               | API: `/icons`, `/og`, `/mcp`, `/api/icons`, `/api/svgs`                   |
| `src/`                  | Builder site (React, TypeScript, Tailwind, shadcn/ui)                     |
| `shared/`               | Code shared by both (aliases, categories, URL builder, MCP, page meta)    |
| `packages/skill-icons/` | The `@hoyasumii/skill-icons` npm package                                  |
| `tools/icon-manager/`   | Skill Icons Manager, the macOS app for maintaining icons                  |

# Releasing

The package is published to npm by [`.github/workflows/release.yml`](./.github/workflows/release.yml) when a `v*` tag is pushed. The workflow checks that the tag matches the package version, runs the package typecheck and tests, builds, publishes with provenance and creates a GitHub release.

```sh
# 1. bump "version" in packages/skill-icons/package.json, then:
git commit -am "chore: release v0.1.1"
git tag v0.1.1
git push origin main v0.1.1
```

Publishing uses [npm trusted publishing](https://docs.npmjs.com/trusted-publishers) (OIDC), so no token is stored in the repository. One-time setup:

1. Publish the first version manually: `cd packages/skill-icons && npm publish` (the `prepack` script builds it).
2. On npmjs.com, open the package settings → **Trusted Publisher** → GitHub Actions, with repository `Hoyasumii/skill-icons` and workflow `release.yml`.

### Icon Manager

[`.github/workflows/manager-release.yml`](./.github/workflows/manager-release.yml) builds the app on macOS and attaches the DMG to a GitHub release when a `manager-v*` tag is pushed. These tags don't match `v*`, so they never publish to npm. You can also run the workflow by hand from the Actions tab and download the DMG from the run's artifacts.

```sh
git tag manager-v1.0.0
git push origin manager-v1.0.0
```

---

## 💖 Support the Project

Thank you so much already for using my projects! If you want to go a step further and support my open source work, buy me a coffee:

<a href='https://ko-fi.com/Q5Q860KQ2' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://cdn.ko-fi.com/cdn/kofi1.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

To support the project directly, feel free to open issues for icon suggestions, or contribute with a pull request!

Before contributing, read [CONTRIBUTING.md](CONTRIBUTING.md). Everyone taking part is expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md), and security problems go through [SECURITY.md](SECURITY.md).
