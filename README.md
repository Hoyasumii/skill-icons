<p align="center">
  <a href="https://skill-icons.alanreisanjo.workers.dev">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="./public/og-site-dark.png">
      <img src="./public/og-site.png" alt="Skill Icons: build your stack, paste it in your README"/>
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

Skill Icons gives you 370+ icons in a few ways:

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

|     Icon ID     |                                         Icon                                         |      Icon ID       |                                            Icon                                            |
| :-------------: | :----------------------------------------------------------------------------------: | :----------------: | :----------------------------------------------------------------------------------------: |
|  `abacatepay`   |    ![abacatepay](https://skill-icons.alanreisanjo.workers.dev/icons?i=abacatepay)    |     `ableton`      |          ![ableton](https://skill-icons.alanreisanjo.workers.dev/icons?i=ableton)          |
|  `activitypub`  |   ![activitypub](https://skill-icons.alanreisanjo.workers.dev/icons?i=activitypub)   |      `actix`       |            ![actix](https://skill-icons.alanreisanjo.workers.dev/icons?i=actix)            |
|    `adonis`     |        ![adonis](https://skill-icons.alanreisanjo.workers.dev/icons?i=adonis)        |      `adyen`       |            ![adyen](https://skill-icons.alanreisanjo.workers.dev/icons?i=adyen)            |
| `aftereffects`  |  ![aftereffects](https://skill-icons.alanreisanjo.workers.dev/icons?i=aftereffects)  |     `aiscript`     |         ![aiscript](https://skill-icons.alanreisanjo.workers.dev/icons?i=aiscript)         |
|   `alpinejs`    |      ![alpinejs](https://skill-icons.alanreisanjo.workers.dev/icons?i=alpinejs)      |     `anaconda`     |         ![anaconda](https://skill-icons.alanreisanjo.workers.dev/icons?i=anaconda)         |
|    `android`    |       ![android](https://skill-icons.alanreisanjo.workers.dev/icons?i=android)       |  `androidstudio`   |    ![androidstudio](https://skill-icons.alanreisanjo.workers.dev/icons?i=androidstudio)    |
|    `angular`    |       ![angular](https://skill-icons.alanreisanjo.workers.dev/icons?i=angular)       |     `ansible`      |          ![ansible](https://skill-icons.alanreisanjo.workers.dev/icons?i=ansible)          |
|  `antigravity`  |   ![antigravity](https://skill-icons.alanreisanjo.workers.dev/icons?i=antigravity)   |      `apollo`      |           ![apollo](https://skill-icons.alanreisanjo.workers.dev/icons?i=apollo)           |
|     `apple`     |         ![apple](https://skill-icons.alanreisanjo.workers.dev/icons?i=apple)         |     `applepay`     |         ![applepay](https://skill-icons.alanreisanjo.workers.dev/icons?i=applepay)         |
|   `appwrite`    |      ![appwrite](https://skill-icons.alanreisanjo.workers.dev/icons?i=appwrite)      |       `arch`       |             ![arch](https://skill-icons.alanreisanjo.workers.dev/icons?i=arch)             |
|    `arduino`    |       ![arduino](https://skill-icons.alanreisanjo.workers.dev/icons?i=arduino)       |      `argocd`      |           ![argocd](https://skill-icons.alanreisanjo.workers.dev/icons?i=argocd)           |
|     `astro`     |         ![astro](https://skill-icons.alanreisanjo.workers.dev/icons?i=astro)         |       `atom`       |             ![atom](https://skill-icons.alanreisanjo.workers.dev/icons?i=atom)             |
|   `audition`    |      ![audition](https://skill-icons.alanreisanjo.workers.dev/icons?i=audition)      |      `auth0`       |            ![auth0](https://skill-icons.alanreisanjo.workers.dev/icons?i=auth0)            |
|    `authjs`     |        ![authjs](https://skill-icons.alanreisanjo.workers.dev/icons?i=authjs)        |     `autocad`      |          ![autocad](https://skill-icons.alanreisanjo.workers.dev/icons?i=autocad)          |
|      `aws`      |           ![aws](https://skill-icons.alanreisanjo.workers.dev/icons?i=aws)           |       `azul`       |             ![azul](https://skill-icons.alanreisanjo.workers.dev/icons?i=azul)             |
|     `azure`     |         ![azure](https://skill-icons.alanreisanjo.workers.dev/icons?i=azure)         |      `babel`       |            ![babel](https://skill-icons.alanreisanjo.workers.dev/icons?i=babel)            |
|     `bash`      |          ![bash](https://skill-icons.alanreisanjo.workers.dev/icons?i=bash)          |    `betterauth`    |       ![betterauth](https://skill-icons.alanreisanjo.workers.dev/icons?i=betterauth)       |
|     `bevy`      |          ![bevy](https://skill-icons.alanreisanjo.workers.dev/icons?i=bevy)          |      `biome`       |            ![biome](https://skill-icons.alanreisanjo.workers.dev/icons?i=biome)            |
|   `bitbucket`   |     ![bitbucket](https://skill-icons.alanreisanjo.workers.dev/icons?i=bitbucket)     |     `blender`      |          ![blender](https://skill-icons.alanreisanjo.workers.dev/icons?i=blender)          |
|    `bluesky`    |       ![bluesky](https://skill-icons.alanreisanjo.workers.dev/icons?i=bluesky)       |    `bootstrap`     |        ![bootstrap](https://skill-icons.alanreisanjo.workers.dev/icons?i=bootstrap)        |
|      `bsd`      |           ![bsd](https://skill-icons.alanreisanjo.workers.dev/icons?i=bsd)           |       `bun`        |              ![bun](https://skill-icons.alanreisanjo.workers.dev/icons?i=bun)              |
|       `c`       |             ![c](https://skill-icons.alanreisanjo.workers.dev/icons?i=c)             |      `canva`       |            ![canva](https://skill-icons.alanreisanjo.workers.dev/icons?i=canva)            |
|   `cassandra`   |     ![cassandra](https://skill-icons.alanreisanjo.workers.dev/icons?i=cassandra)     |     `chatgpt`      |          ![chatgpt](https://skill-icons.alanreisanjo.workers.dev/icons?i=chatgpt)          |
|    `claude`     |        ![claude](https://skill-icons.alanreisanjo.workers.dev/icons?i=claude)        |      `clerk`       |            ![clerk](https://skill-icons.alanreisanjo.workers.dev/icons?i=clerk)            |
|  `clickhouse`   |    ![clickhouse](https://skill-icons.alanreisanjo.workers.dev/icons?i=clickhouse)    |      `cline`       |            ![cline](https://skill-icons.alanreisanjo.workers.dev/icons?i=cline)            |
|     `clion`     |         ![clion](https://skill-icons.alanreisanjo.workers.dev/icons?i=clion)         |     `clojure`      |          ![clojure](https://skill-icons.alanreisanjo.workers.dev/icons?i=clojure)          |
|  `cloudflare`   |    ![cloudflare](https://skill-icons.alanreisanjo.workers.dev/icons?i=cloudflare)    |      `cmake`       |            ![cmake](https://skill-icons.alanreisanjo.workers.dev/icons?i=cmake)            |
|    `codepen`    |       ![codepen](https://skill-icons.alanreisanjo.workers.dev/icons?i=codepen)       |      `codex`       |            ![codex](https://skill-icons.alanreisanjo.workers.dev/icons?i=codex)            |
| `coffeescript`  |  ![coffeescript](https://skill-icons.alanreisanjo.workers.dev/icons?i=coffeescript)  |      `convex`      |           ![convex](https://skill-icons.alanreisanjo.workers.dev/icons?i=convex)           |
|    `coolify`    |       ![coolify](https://skill-icons.alanreisanjo.workers.dev/icons?i=coolify)       |       `cpp`        |              ![cpp](https://skill-icons.alanreisanjo.workers.dev/icons?i=cpp)              |
|    `crystal`    |       ![crystal](https://skill-icons.alanreisanjo.workers.dev/icons?i=crystal)       |        `cs`        |               ![cs](https://skill-icons.alanreisanjo.workers.dev/icons?i=cs)               |
|      `css`      |           ![css](https://skill-icons.alanreisanjo.workers.dev/icons?i=css)           |      `cursor`      |           ![cursor](https://skill-icons.alanreisanjo.workers.dev/icons?i=cursor)           |
|    `cypress`    |       ![cypress](https://skill-icons.alanreisanjo.workers.dev/icons?i=cypress)       |        `d3`        |               ![d3](https://skill-icons.alanreisanjo.workers.dev/icons?i=d3)               |
|    `daisyui`    |       ![daisyui](https://skill-icons.alanreisanjo.workers.dev/icons?i=daisyui)       |       `dart`       |             ![dart](https://skill-icons.alanreisanjo.workers.dev/icons?i=dart)             |
|    `datadog`    |       ![datadog](https://skill-icons.alanreisanjo.workers.dev/icons?i=datadog)       |     `datagrip`     |         ![datagrip](https://skill-icons.alanreisanjo.workers.dev/icons?i=datagrip)         |
|    `debian`     |        ![debian](https://skill-icons.alanreisanjo.workers.dev/icons?i=debian)        |     `deepseek`     |         ![deepseek](https://skill-icons.alanreisanjo.workers.dev/icons?i=deepseek)         |
|    `defold`     |        ![defold](https://skill-icons.alanreisanjo.workers.dev/icons?i=defold)        |       `deno`       |             ![deno](https://skill-icons.alanreisanjo.workers.dev/icons?i=deno)             |
|     `devto`     |         ![devto](https://skill-icons.alanreisanjo.workers.dev/icons?i=devto)         |   `digitalocean`   |     ![digitalocean](https://skill-icons.alanreisanjo.workers.dev/icons?i=digitalocean)     |
|    `discord`    |       ![discord](https://skill-icons.alanreisanjo.workers.dev/icons?i=discord)       |   `discordbots`    |      ![discordbots](https://skill-icons.alanreisanjo.workers.dev/icons?i=discordbots)      |
|   `discordjs`   |     ![discordjs](https://skill-icons.alanreisanjo.workers.dev/icons?i=discordjs)     |      `django`      |           ![django](https://skill-icons.alanreisanjo.workers.dev/icons?i=django)           |
|    `docker`     |        ![docker](https://skill-icons.alanreisanjo.workers.dev/icons?i=docker)        |    `docusaurus`    |       ![docusaurus](https://skill-icons.alanreisanjo.workers.dev/icons?i=docusaurus)       |
|    `dotnet`     |        ![dotnet](https://skill-icons.alanreisanjo.workers.dev/icons?i=dotnet)        |     `drizzle`      |          ![drizzle](https://skill-icons.alanreisanjo.workers.dev/icons?i=drizzle)          |
|    `duckdb`     |        ![duckdb](https://skill-icons.alanreisanjo.workers.dev/icons?i=duckdb)        |     `dynamodb`     |         ![dynamodb](https://skill-icons.alanreisanjo.workers.dev/icons?i=dynamodb)         |
|    `eclipse`    |       ![eclipse](https://skill-icons.alanreisanjo.workers.dev/icons?i=eclipse)       |  `elasticsearch`   |    ![elasticsearch](https://skill-icons.alanreisanjo.workers.dev/icons?i=elasticsearch)    |
|   `electron`    |      ![electron](https://skill-icons.alanreisanjo.workers.dev/icons?i=electron)      |      `elixir`      |           ![elixir](https://skill-icons.alanreisanjo.workers.dev/icons?i=elixir)           |
|    `elysia`     |        ![elysia](https://skill-icons.alanreisanjo.workers.dev/icons?i=elysia)        |      `emacs`       |            ![emacs](https://skill-icons.alanreisanjo.workers.dev/icons?i=emacs)            |
|     `ember`     |         ![ember](https://skill-icons.alanreisanjo.workers.dev/icons?i=ember)         |     `emotion`      |          ![emotion](https://skill-icons.alanreisanjo.workers.dev/icons?i=emotion)          |
|    `esbuild`    |       ![esbuild](https://skill-icons.alanreisanjo.workers.dev/icons?i=esbuild)       |      `eslint`      |           ![eslint](https://skill-icons.alanreisanjo.workers.dev/icons?i=eslint)           |
|     `expo`      |          ![expo](https://skill-icons.alanreisanjo.workers.dev/icons?i=expo)          |    `expressjs`     |        ![expressjs](https://skill-icons.alanreisanjo.workers.dev/icons?i=expressjs)        |
|    `fastapi`    |       ![fastapi](https://skill-icons.alanreisanjo.workers.dev/icons?i=fastapi)       |     `fastify`      |          ![fastify](https://skill-icons.alanreisanjo.workers.dev/icons?i=fastify)          |
|   `fediverse`   |     ![fediverse](https://skill-icons.alanreisanjo.workers.dev/icons?i=fediverse)     |      `fiber`       |            ![fiber](https://skill-icons.alanreisanjo.workers.dev/icons?i=fiber)            |
|     `figma`     |         ![figma](https://skill-icons.alanreisanjo.workers.dev/icons?i=figma)         |     `firebase`     |         ![firebase](https://skill-icons.alanreisanjo.workers.dev/icons?i=firebase)         |
|     `flask`     |         ![flask](https://skill-icons.alanreisanjo.workers.dev/icons?i=flask)         |     `flutter`      |          ![flutter](https://skill-icons.alanreisanjo.workers.dev/icons?i=flutter)          |
|      `fly`      |           ![fly](https://skill-icons.alanreisanjo.workers.dev/icons?i=fly)           |      `forth`       |            ![forth](https://skill-icons.alanreisanjo.workers.dev/icons?i=forth)            |
|    `fortran`    |       ![fortran](https://skill-icons.alanreisanjo.workers.dev/icons?i=fortran)       | `gamemakerstudio`  |  ![gamemakerstudio](https://skill-icons.alanreisanjo.workers.dev/icons?i=gamemakerstudio)  |
|    `gatsby`     |        ![gatsby](https://skill-icons.alanreisanjo.workers.dev/icons?i=gatsby)        |       `gcp`        |              ![gcp](https://skill-icons.alanreisanjo.workers.dev/icons?i=gcp)              |
|    `gemini`     |        ![gemini](https://skill-icons.alanreisanjo.workers.dev/icons?i=gemini)        |     `gherkin`      |          ![gherkin](https://skill-icons.alanreisanjo.workers.dev/icons?i=gherkin)          |
|      `gin`      |           ![gin](https://skill-icons.alanreisanjo.workers.dev/icons?i=gin)           |       `git`        |              ![git](https://skill-icons.alanreisanjo.workers.dev/icons?i=git)              |
|    `github`     |        ![github](https://skill-icons.alanreisanjo.workers.dev/icons?i=github)        |  `githubactions`   |    ![githubactions](https://skill-icons.alanreisanjo.workers.dev/icons?i=githubactions)    |
| `githubcopilot` | ![githubcopilot](https://skill-icons.alanreisanjo.workers.dev/icons?i=githubcopilot) |      `gitlab`      |           ![gitlab](https://skill-icons.alanreisanjo.workers.dev/icons?i=gitlab)           |
|     `gleam`     |         ![gleam](https://skill-icons.alanreisanjo.workers.dev/icons?i=gleam)         |      `gmail`       |            ![gmail](https://skill-icons.alanreisanjo.workers.dev/icons?i=gmail)            |
|     `godot`     |         ![godot](https://skill-icons.alanreisanjo.workers.dev/icons?i=godot)         |      `goland`      |           ![goland](https://skill-icons.alanreisanjo.workers.dev/icons?i=goland)           |
|    `golang`     |        ![golang](https://skill-icons.alanreisanjo.workers.dev/icons?i=golang)        |    `googlepay`     |        ![googlepay](https://skill-icons.alanreisanjo.workers.dev/icons?i=googlepay)        |
|    `gradle`     |        ![gradle](https://skill-icons.alanreisanjo.workers.dev/icons?i=gradle)        |     `grafana`      |          ![grafana](https://skill-icons.alanreisanjo.workers.dev/icons?i=grafana)          |
|    `graphql`    |       ![graphql](https://skill-icons.alanreisanjo.workers.dev/icons?i=graphql)       |       `grok`       |             ![grok](https://skill-icons.alanreisanjo.workers.dev/icons?i=grok)             |
|      `gtk`      |           ![gtk](https://skill-icons.alanreisanjo.workers.dev/icons?i=gtk)           |       `gulp`       |             ![gulp](https://skill-icons.alanreisanjo.workers.dev/icons?i=gulp)             |
|    `haskell`    |       ![haskell](https://skill-icons.alanreisanjo.workers.dev/icons?i=haskell)       |       `haxe`       |             ![haxe](https://skill-icons.alanreisanjo.workers.dev/icons?i=haxe)             |
|  `haxeflixel`   |    ![haxeflixel](https://skill-icons.alanreisanjo.workers.dev/icons?i=haxeflixel)    |      `helix`       |            ![helix](https://skill-icons.alanreisanjo.workers.dev/icons?i=helix)            |
|     `helm`      |          ![helm](https://skill-icons.alanreisanjo.workers.dev/icons?i=helm)          |      `heroku`      |           ![heroku](https://skill-icons.alanreisanjo.workers.dev/icons?i=heroku)           |
|   `hibernate`   |     ![hibernate](https://skill-icons.alanreisanjo.workers.dev/icons?i=hibernate)     |       `hono`       |             ![hono](https://skill-icons.alanreisanjo.workers.dev/icons?i=hono)             |
|     `html`      |          ![html](https://skill-icons.alanreisanjo.workers.dev/icons?i=html)          |       `htmx`       |             ![htmx](https://skill-icons.alanreisanjo.workers.dev/icons?i=htmx)             |
|  `huggingface`  |   ![huggingface](https://skill-icons.alanreisanjo.workers.dev/icons?i=huggingface)   |      `husky`       |            ![husky](https://skill-icons.alanreisanjo.workers.dev/icons?i=husky)            |
|     `idea`      |          ![idea](https://skill-icons.alanreisanjo.workers.dev/icons?i=idea)          |   `illustrator`    |      ![illustrator](https://skill-icons.alanreisanjo.workers.dev/icons?i=illustrator)      |
|   `inkscape`    |      ![inkscape](https://skill-icons.alanreisanjo.workers.dev/icons?i=inkscape)      |    `instagram`     |        ![instagram](https://skill-icons.alanreisanjo.workers.dev/icons?i=instagram)        |
|      `ios`      |           ![ios](https://skill-icons.alanreisanjo.workers.dev/icons?i=ios)           |       `ipfs`       |             ![ipfs](https://skill-icons.alanreisanjo.workers.dev/icons?i=ipfs)             |
|     `java`      |          ![java](https://skill-icons.alanreisanjo.workers.dev/icons?i=java)          |    `javascript`    |       ![javascript](https://skill-icons.alanreisanjo.workers.dev/icons?i=javascript)       |
|    `jenkins`    |       ![jenkins](https://skill-icons.alanreisanjo.workers.dev/icons?i=jenkins)       |       `jest`       |             ![jest](https://skill-icons.alanreisanjo.workers.dev/icons?i=jest)             |
|     `jira`      |          ![jira](https://skill-icons.alanreisanjo.workers.dev/icons?i=jira)          |      `jquery`      |           ![jquery](https://skill-icons.alanreisanjo.workers.dev/icons?i=jquery)           |
|     `json`      |          ![json](https://skill-icons.alanreisanjo.workers.dev/icons?i=json)          |      `julia`       |            ![julia](https://skill-icons.alanreisanjo.workers.dev/icons?i=julia)            |
|    `jupyter`    |       ![jupyter](https://skill-icons.alanreisanjo.workers.dev/icons?i=jupyter)       |      `kafka`       |            ![kafka](https://skill-icons.alanreisanjo.workers.dev/icons?i=kafka)            |
|     `kali`      |          ![kali](https://skill-icons.alanreisanjo.workers.dev/icons?i=kali)          |     `keycloak`     |         ![keycloak](https://skill-icons.alanreisanjo.workers.dev/icons?i=keycloak)         |
|     `knip`      |          ![knip](https://skill-icons.alanreisanjo.workers.dev/icons?i=knip)          |      `kotlin`      |           ![kotlin](https://skill-icons.alanreisanjo.workers.dev/icons?i=kotlin)           |
|     `ktor`      |          ![ktor](https://skill-icons.alanreisanjo.workers.dev/icons?i=ktor)          |    `kubernetes`    |       ![kubernetes](https://skill-icons.alanreisanjo.workers.dev/icons?i=kubernetes)       |
|   `langchain`   |     ![langchain](https://skill-icons.alanreisanjo.workers.dev/icons?i=langchain)     |     `langfuse`     |         ![langfuse](https://skill-icons.alanreisanjo.workers.dev/icons?i=langfuse)         |
|    `laravel`    |       ![laravel](https://skill-icons.alanreisanjo.workers.dev/icons?i=laravel)       |      `latex`       |            ![latex](https://skill-icons.alanreisanjo.workers.dev/icons?i=latex)            |
| `lemonsqueezy`  |  ![lemonsqueezy](https://skill-icons.alanreisanjo.workers.dev/icons?i=lemonsqueezy)  |       `less`       |             ![less](https://skill-icons.alanreisanjo.workers.dev/icons?i=less)             |
|    `linear`     |        ![linear](https://skill-icons.alanreisanjo.workers.dev/icons?i=linear)        |     `linkedin`     |         ![linkedin](https://skill-icons.alanreisanjo.workers.dev/icons?i=linkedin)         |
|     `linux`     |         ![linux](https://skill-icons.alanreisanjo.workers.dev/icons?i=linux)         |       `lit`        |              ![lit](https://skill-icons.alanreisanjo.workers.dev/icons?i=lit)              |
|      `lua`      |           ![lua](https://skill-icons.alanreisanjo.workers.dev/icons?i=lua)           |      `macos`       |            ![macos](https://skill-icons.alanreisanjo.workers.dev/icons?i=macos)            |
|    `mariadb`    |       ![mariadb](https://skill-icons.alanreisanjo.workers.dev/icons?i=mariadb)       |     `markdown`     |         ![markdown](https://skill-icons.alanreisanjo.workers.dev/icons?i=markdown)         |
|  `mastercard`   |    ![mastercard](https://skill-icons.alanreisanjo.workers.dev/icons?i=mastercard)    |     `mastodon`     |         ![mastodon](https://skill-icons.alanreisanjo.workers.dev/icons?i=mastodon)         |
|  `materialui`   |    ![materialui](https://skill-icons.alanreisanjo.workers.dev/icons?i=materialui)    |      `matlab`      |           ![matlab](https://skill-icons.alanreisanjo.workers.dev/icons?i=matlab)           |
|     `maven`     |         ![maven](https://skill-icons.alanreisanjo.workers.dev/icons?i=maven)         |       `mcp`        |              ![mcp](https://skill-icons.alanreisanjo.workers.dev/icons?i=mcp)              |
|  `mercadopago`  |   ![mercadopago](https://skill-icons.alanreisanjo.workers.dev/icons?i=mercadopago)   |       `mint`       |             ![mint](https://skill-icons.alanreisanjo.workers.dev/icons?i=mint)             |
|    `misskey`    |       ![misskey](https://skill-icons.alanreisanjo.workers.dev/icons?i=misskey)       |      `mocha`       |            ![mocha](https://skill-icons.alanreisanjo.workers.dev/icons?i=mocha)            |
|     `mojo`      |          ![mojo](https://skill-icons.alanreisanjo.workers.dev/icons?i=mojo)          |     `mongodb`      |          ![mongodb](https://skill-icons.alanreisanjo.workers.dev/icons?i=mongodb)          |
|     `mysql`     |         ![mysql](https://skill-icons.alanreisanjo.workers.dev/icons?i=mysql)         |       `n8n`        |              ![n8n](https://skill-icons.alanreisanjo.workers.dev/icons?i=n8n)              |
|     `neo4j`     |         ![neo4j](https://skill-icons.alanreisanjo.workers.dev/icons?i=neo4j)         |       `neon`       |             ![neon](https://skill-icons.alanreisanjo.workers.dev/icons?i=neon)             |
|    `neovim`     |        ![neovim](https://skill-icons.alanreisanjo.workers.dev/icons?i=neovim)        |      `nestjs`      |           ![nestjs](https://skill-icons.alanreisanjo.workers.dev/icons?i=nestjs)           |
|    `netlify`    |       ![netlify](https://skill-icons.alanreisanjo.workers.dev/icons?i=netlify)       |      `nextjs`      |           ![nextjs](https://skill-icons.alanreisanjo.workers.dev/icons?i=nextjs)           |
|     `nginx`     |         ![nginx](https://skill-icons.alanreisanjo.workers.dev/icons?i=nginx)         |       `nim`        |              ![nim](https://skill-icons.alanreisanjo.workers.dev/icons?i=nim)              |
|      `nix`      |           ![nix](https://skill-icons.alanreisanjo.workers.dev/icons?i=nix)           |      `nodejs`      |           ![nodejs](https://skill-icons.alanreisanjo.workers.dev/icons?i=nodejs)           |
|    `notion`     |        ![notion](https://skill-icons.alanreisanjo.workers.dev/icons?i=notion)        |       `npm`        |              ![npm](https://skill-icons.alanreisanjo.workers.dev/icons?i=npm)              |
|    `nubank`     |        ![nubank](https://skill-icons.alanreisanjo.workers.dev/icons?i=nubank)        |      `numpy`       |            ![numpy](https://skill-icons.alanreisanjo.workers.dev/icons?i=numpy)            |
|    `nuxtjs`     |        ![nuxtjs](https://skill-icons.alanreisanjo.workers.dev/icons?i=nuxtjs)        |        `nx`        |               ![nx](https://skill-icons.alanreisanjo.workers.dev/icons?i=nx)               |
|   `obsidian`    |      ![obsidian](https://skill-icons.alanreisanjo.workers.dev/icons?i=obsidian)      |      `ocaml`       |            ![ocaml](https://skill-icons.alanreisanjo.workers.dev/icons?i=ocaml)            |
|    `octave`     |        ![octave](https://skill-icons.alanreisanjo.workers.dev/icons?i=octave)        |      `ollama`      |           ![ollama](https://skill-icons.alanreisanjo.workers.dev/icons?i=ollama)           |
|    `openai`     |        ![openai](https://skill-icons.alanreisanjo.workers.dev/icons?i=openai)        |     `openclaw`     |         ![openclaw](https://skill-icons.alanreisanjo.workers.dev/icons?i=openclaw)         |
|   `opencode`    |      ![opencode](https://skill-icons.alanreisanjo.workers.dev/icons?i=opencode)      |      `opencv`      |           ![opencv](https://skill-icons.alanreisanjo.workers.dev/icons?i=opencv)           |
|   `openshift`   |     ![openshift](https://skill-icons.alanreisanjo.workers.dev/icons?i=openshift)     |    `openstack`     |        ![openstack](https://skill-icons.alanreisanjo.workers.dev/icons?i=openstack)        |
| `opentelemetry` | ![opentelemetry](https://skill-icons.alanreisanjo.workers.dev/icons?i=opentelemetry) |      `oxlint`      |           ![oxlint](https://skill-icons.alanreisanjo.workers.dev/icons?i=oxlint)           |
|     `p5js`      |          ![p5js](https://skill-icons.alanreisanjo.workers.dev/icons?i=p5js)          |      `paddle`      |           ![paddle](https://skill-icons.alanreisanjo.workers.dev/icons?i=paddle)           |
|   `pagseguro`   |     ![pagseguro](https://skill-icons.alanreisanjo.workers.dev/icons?i=pagseguro)     |      `pandas`      |           ![pandas](https://skill-icons.alanreisanjo.workers.dev/icons?i=pandas)           |
|    `paypal`     |        ![paypal](https://skill-icons.alanreisanjo.workers.dev/icons?i=paypal)        |       `perl`       |             ![perl](https://skill-icons.alanreisanjo.workers.dev/icons?i=perl)             |
|  `perplexity`   |    ![perplexity](https://skill-icons.alanreisanjo.workers.dev/icons?i=perplexity)    |    `photoshop`     |        ![photoshop](https://skill-icons.alanreisanjo.workers.dev/icons?i=photoshop)        |
|      `php`      |           ![php](https://skill-icons.alanreisanjo.workers.dev/icons?i=php)           |     `phpstorm`     |         ![phpstorm](https://skill-icons.alanreisanjo.workers.dev/icons?i=phpstorm)         |
|     `pinia`     |         ![pinia](https://skill-icons.alanreisanjo.workers.dev/icons?i=pinia)         |       `pix`        |              ![pix](https://skill-icons.alanreisanjo.workers.dev/icons?i=pix)              |
|      `pkl`      |           ![pkl](https://skill-icons.alanreisanjo.workers.dev/icons?i=pkl)           |      `plan9`       |            ![plan9](https://skill-icons.alanreisanjo.workers.dev/icons?i=plan9)            |
|     `plane`     |         ![plane](https://skill-icons.alanreisanjo.workers.dev/icons?i=plane)         |   `planetscale`    |      ![planetscale](https://skill-icons.alanreisanjo.workers.dev/icons?i=planetscale)      |
|  `playwright`   |    ![playwright](https://skill-icons.alanreisanjo.workers.dev/icons?i=playwright)    |       `pnpm`       |             ![pnpm](https://skill-icons.alanreisanjo.workers.dev/icons?i=pnpm)             |
|  `pocketbase`   |    ![pocketbase](https://skill-icons.alanreisanjo.workers.dev/icons?i=pocketbase)    |      `polar`       |            ![polar](https://skill-icons.alanreisanjo.workers.dev/icons?i=polar)            |
|  `postgresql`   |    ![postgresql](https://skill-icons.alanreisanjo.workers.dev/icons?i=postgresql)    |     `posthog`      |          ![posthog](https://skill-icons.alanreisanjo.workers.dev/icons?i=posthog)          |
|    `postman`    |       ![postman](https://skill-icons.alanreisanjo.workers.dev/icons?i=postman)       |    `powershell`    |       ![powershell](https://skill-icons.alanreisanjo.workers.dev/icons?i=powershell)       |
|   `premiere`    |      ![premiere](https://skill-icons.alanreisanjo.workers.dev/icons?i=premiere)      |     `prettier`     |         ![prettier](https://skill-icons.alanreisanjo.workers.dev/icons?i=prettier)         |
|    `prisma`     |        ![prisma](https://skill-icons.alanreisanjo.workers.dev/icons?i=prisma)        |    `processing`    |       ![processing](https://skill-icons.alanreisanjo.workers.dev/icons?i=processing)       |
|  `prometheus`   |    ![prometheus](https://skill-icons.alanreisanjo.workers.dev/icons?i=prometheus)    |       `pug`        |              ![pug](https://skill-icons.alanreisanjo.workers.dev/icons?i=pug)              |
|   `puppeteer`   |     ![puppeteer](https://skill-icons.alanreisanjo.workers.dev/icons?i=puppeteer)     |     `pycharm`      |          ![pycharm](https://skill-icons.alanreisanjo.workers.dev/icons?i=pycharm)          |
|    `pytest`     |        ![pytest](https://skill-icons.alanreisanjo.workers.dev/icons?i=pytest)        |      `python`      |           ![python](https://skill-icons.alanreisanjo.workers.dev/icons?i=python)           |
|    `pytorch`    |       ![pytorch](https://skill-icons.alanreisanjo.workers.dev/icons?i=pytorch)       |        `qt`        |               ![qt](https://skill-icons.alanreisanjo.workers.dev/icons?i=qt)               |
|       `r`       |             ![r](https://skill-icons.alanreisanjo.workers.dev/icons?i=r)             |     `rabbitmq`     |         ![rabbitmq](https://skill-icons.alanreisanjo.workers.dev/icons?i=rabbitmq)         |
|    `radixui`    |       ![radixui](https://skill-icons.alanreisanjo.workers.dev/icons?i=radixui)       |      `rails`       |            ![rails](https://skill-icons.alanreisanjo.workers.dev/icons?i=rails)            |
|    `railway`    |       ![railway](https://skill-icons.alanreisanjo.workers.dev/icons?i=railway)       |   `raspberrypi`    |      ![raspberrypi](https://skill-icons.alanreisanjo.workers.dev/icons?i=raspberrypi)      |
|   `razorpay`    |      ![razorpay](https://skill-icons.alanreisanjo.workers.dev/icons?i=razorpay)      |      `react`       |            ![react](https://skill-icons.alanreisanjo.workers.dev/icons?i=react)            |
|   `reactivex`   |     ![reactivex](https://skill-icons.alanreisanjo.workers.dev/icons?i=reactivex)     |   `reactnative`    |      ![reactnative](https://skill-icons.alanreisanjo.workers.dev/icons?i=reactnative)      |
|  `reactquery`   |    ![reactquery](https://skill-icons.alanreisanjo.workers.dev/icons?i=reactquery)    |      `reddit`      |           ![reddit](https://skill-icons.alanreisanjo.workers.dev/icons?i=reddit)           |
|    `redhat`     |        ![redhat](https://skill-icons.alanreisanjo.workers.dev/icons?i=redhat)        |      `redis`       |            ![redis](https://skill-icons.alanreisanjo.workers.dev/icons?i=redis)            |
|     `redux`     |         ![redux](https://skill-icons.alanreisanjo.workers.dev/icons?i=redux)         |      `regex`       |            ![regex](https://skill-icons.alanreisanjo.workers.dev/icons?i=regex)            |
|     `remix`     |         ![remix](https://skill-icons.alanreisanjo.workers.dev/icons?i=remix)         |      `replit`      |           ![replit](https://skill-icons.alanreisanjo.workers.dev/icons?i=replit)           |
|    `resend`     |        ![resend](https://skill-icons.alanreisanjo.workers.dev/icons?i=resend)        |      `rider`       |            ![rider](https://skill-icons.alanreisanjo.workers.dev/icons?i=rider)            |
| `robloxstudio`  |  ![robloxstudio](https://skill-icons.alanreisanjo.workers.dev/icons?i=robloxstudio)  |      `rocket`      |           ![rocket](https://skill-icons.alanreisanjo.workers.dev/icons?i=rocket)           |
|   `rollupjs`    |      ![rollupjs](https://skill-icons.alanreisanjo.workers.dev/icons?i=rollupjs)      |       `ros`        |              ![ros](https://skill-icons.alanreisanjo.workers.dev/icons?i=ros)              |
|    `rspack`     |        ![rspack](https://skill-icons.alanreisanjo.workers.dev/icons?i=rspack)        |       `ruby`       |             ![ruby](https://skill-icons.alanreisanjo.workers.dev/icons?i=ruby)             |
|     `rust`      |          ![rust](https://skill-icons.alanreisanjo.workers.dev/icons?i=rust)          |       `sass`       |             ![sass](https://skill-icons.alanreisanjo.workers.dev/icons?i=sass)             |
|     `scala`     |         ![scala](https://skill-icons.alanreisanjo.workers.dev/icons?i=scala)         |   `scikitlearn`    |      ![scikitlearn](https://skill-icons.alanreisanjo.workers.dev/icons?i=scikitlearn)      |
|   `selenium`    |      ![selenium](https://skill-icons.alanreisanjo.workers.dev/icons?i=selenium)      |      `sentry`      |           ![sentry](https://skill-icons.alanreisanjo.workers.dev/icons?i=sentry)           |
|   `sequelize`   |     ![sequelize](https://skill-icons.alanreisanjo.workers.dev/icons?i=sequelize)     |     `shadcnui`     |         ![shadcnui](https://skill-icons.alanreisanjo.workers.dev/icons?i=shadcnui)         |
|    `signoz`     |        ![signoz](https://skill-icons.alanreisanjo.workers.dev/icons?i=signoz)        |      `sketch`      |           ![sketch](https://skill-icons.alanreisanjo.workers.dev/icons?i=sketch)           |
|   `sketchup`    |      ![sketchup](https://skill-icons.alanreisanjo.workers.dev/icons?i=sketchup)      |      `slack`       |            ![slack](https://skill-icons.alanreisanjo.workers.dev/icons?i=slack)            |
|   `solidity`    |      ![solidity](https://skill-icons.alanreisanjo.workers.dev/icons?i=solidity)      |     `solidjs`      |          ![solidjs](https://skill-icons.alanreisanjo.workers.dev/icons?i=solidjs)          |
|    `spotify`    |       ![spotify](https://skill-icons.alanreisanjo.workers.dev/icons?i=spotify)       |      `spring`      |           ![spring](https://skill-icons.alanreisanjo.workers.dev/icons?i=spring)           |
|      `sql`      |           ![sql](https://skill-icons.alanreisanjo.workers.dev/icons?i=sql)           |      `sqlite`      |           ![sqlite](https://skill-icons.alanreisanjo.workers.dev/icons?i=sqlite)           |
|   `sqlserver`   |     ![sqlserver](https://skill-icons.alanreisanjo.workers.dev/icons?i=sqlserver)     |      `square`      |           ![square](https://skill-icons.alanreisanjo.workers.dev/icons?i=square)           |
| `stackoverflow` | ![stackoverflow](https://skill-icons.alanreisanjo.workers.dev/icons?i=stackoverflow) |    `starlight`     |        ![starlight](https://skill-icons.alanreisanjo.workers.dev/icons?i=starlight)        |
|   `storybook`   |     ![storybook](https://skill-icons.alanreisanjo.workers.dev/icons?i=storybook)     |      `strapi`      |           ![strapi](https://skill-icons.alanreisanjo.workers.dev/icons?i=strapi)           |
|    `stripe`     |        ![stripe](https://skill-icons.alanreisanjo.workers.dev/icons?i=stripe)        | `styledcomponents` | ![styledcomponents](https://skill-icons.alanreisanjo.workers.dev/icons?i=styledcomponents) |
|    `sublime`    |       ![sublime](https://skill-icons.alanreisanjo.workers.dev/icons?i=sublime)       |     `supabase`     |         ![supabase](https://skill-icons.alanreisanjo.workers.dev/icons?i=supabase)         |
|    `svelte`     |        ![svelte](https://skill-icons.alanreisanjo.workers.dev/icons?i=svelte)        |       `svg`        |              ![svg](https://skill-icons.alanreisanjo.workers.dev/icons?i=svg)              |
|      `swc`      |           ![swc](https://skill-icons.alanreisanjo.workers.dev/icons?i=swc)           |      `swift`       |            ![swift](https://skill-icons.alanreisanjo.workers.dev/icons?i=swift)            |
|    `symfony`    |       ![symfony](https://skill-icons.alanreisanjo.workers.dev/icons?i=symfony)       |   `tailwindcss`    |      ![tailwindcss](https://skill-icons.alanreisanjo.workers.dev/icons?i=tailwindcss)      |
|   `tanstack`    |      ![tanstack](https://skill-icons.alanreisanjo.workers.dev/icons?i=tanstack)      |      `tauri`       |            ![tauri](https://skill-icons.alanreisanjo.workers.dev/icons?i=tauri)            |
|   `telegram`    |      ![telegram](https://skill-icons.alanreisanjo.workers.dev/icons?i=telegram)      |    `tensorflow`    |       ![tensorflow](https://skill-icons.alanreisanjo.workers.dev/icons?i=tensorflow)       |
|   `terraform`   |     ![terraform](https://skill-icons.alanreisanjo.workers.dev/icons?i=terraform)     |  `testinglibrary`  |   ![testinglibrary](https://skill-icons.alanreisanjo.workers.dev/icons?i=testinglibrary)   |
|    `threejs`    |       ![threejs](https://skill-icons.alanreisanjo.workers.dev/icons?i=threejs)       |       `trae`       |             ![trae](https://skill-icons.alanreisanjo.workers.dev/icons?i=trae)             |
|    `traefik`    |       ![traefik](https://skill-icons.alanreisanjo.workers.dev/icons?i=traefik)       |       `trpc`       |             ![trpc](https://skill-icons.alanreisanjo.workers.dev/icons?i=trpc)             |
|   `turbopack`   |     ![turbopack](https://skill-icons.alanreisanjo.workers.dev/icons?i=turbopack)     |    `turborepo`     |        ![turborepo](https://skill-icons.alanreisanjo.workers.dev/icons?i=turborepo)        |
|     `turso`     |         ![turso](https://skill-icons.alanreisanjo.workers.dev/icons?i=turso)         |     `twitter`      |          ![twitter](https://skill-icons.alanreisanjo.workers.dev/icons?i=twitter)          |
|  `typescript`   |    ![typescript](https://skill-icons.alanreisanjo.workers.dev/icons?i=typescript)    |      `ubuntu`      |           ![ubuntu](https://skill-icons.alanreisanjo.workers.dev/icons?i=ubuntu)           |
|     `unity`     |         ![unity](https://skill-icons.alanreisanjo.workers.dev/icons?i=unity)         |   `unrealengine`   |     ![unrealengine](https://skill-icons.alanreisanjo.workers.dev/icons?i=unrealengine)     |
|    `upstash`    |       ![upstash](https://skill-icons.alanreisanjo.workers.dev/icons?i=upstash)       |        `v`         |                ![v](https://skill-icons.alanreisanjo.workers.dev/icons?i=v)                |
|     `vala`      |          ![vala](https://skill-icons.alanreisanjo.workers.dev/icons?i=vala)          |      `vercel`      |           ![vercel](https://skill-icons.alanreisanjo.workers.dev/icons?i=vercel)           |
|    `verilog`    |       ![verilog](https://skill-icons.alanreisanjo.workers.dev/icons?i=verilog)       |       `vim`        |              ![vim](https://skill-icons.alanreisanjo.workers.dev/icons?i=vim)              |
|     `visa`      |          ![visa](https://skill-icons.alanreisanjo.workers.dev/icons?i=visa)          |   `visualstudio`   |     ![visualstudio](https://skill-icons.alanreisanjo.workers.dev/icons?i=visualstudio)     |
|     `vite`      |          ![vite](https://skill-icons.alanreisanjo.workers.dev/icons?i=vite)          |      `vitest`      |           ![vitest](https://skill-icons.alanreisanjo.workers.dev/icons?i=vitest)           |
|    `vscode`     |        ![vscode](https://skill-icons.alanreisanjo.workers.dev/icons?i=vscode)        |     `vscodium`     |         ![vscodium](https://skill-icons.alanreisanjo.workers.dev/icons?i=vscodium)         |
|     `vuejs`     |         ![vuejs](https://skill-icons.alanreisanjo.workers.dev/icons?i=vuejs)         |     `vuetify`      |          ![vuetify](https://skill-icons.alanreisanjo.workers.dev/icons?i=vuetify)          |
|     `warp`      |          ![warp](https://skill-icons.alanreisanjo.workers.dev/icons?i=warp)          |   `webassembly`    |      ![webassembly](https://skill-icons.alanreisanjo.workers.dev/icons?i=webassembly)      |
|    `webflow`    |       ![webflow](https://skill-icons.alanreisanjo.workers.dev/icons?i=webflow)       |     `webpack`      |          ![webpack](https://skill-icons.alanreisanjo.workers.dev/icons?i=webpack)          |
|   `webstorm`    |      ![webstorm](https://skill-icons.alanreisanjo.workers.dev/icons?i=webstorm)      |     `whatsapp`     |         ![whatsapp](https://skill-icons.alanreisanjo.workers.dev/icons?i=whatsapp)         |
|   `windicss`    |      ![windicss](https://skill-icons.alanreisanjo.workers.dev/icons?i=windicss)      |     `windows`      |          ![windows](https://skill-icons.alanreisanjo.workers.dev/icons?i=windows)          |
|   `windsurf`    |      ![windsurf](https://skill-icons.alanreisanjo.workers.dev/icons?i=windsurf)      |    `wordpress`     |        ![wordpress](https://skill-icons.alanreisanjo.workers.dev/icons?i=wordpress)        |
|    `workers`    |       ![workers](https://skill-icons.alanreisanjo.workers.dev/icons?i=workers)       |      `xcode`       |            ![xcode](https://skill-icons.alanreisanjo.workers.dev/icons?i=xcode)            |
|      `xd`       |            ![xd](https://skill-icons.alanreisanjo.workers.dev/icons?i=xd)            |       `yaml`       |             ![yaml](https://skill-icons.alanreisanjo.workers.dev/icons?i=yaml)             |
|     `yarn`      |          ![yarn](https://skill-icons.alanreisanjo.workers.dev/icons?i=yarn)          |       `yew`        |              ![yew](https://skill-icons.alanreisanjo.workers.dev/icons?i=yew)              |
|    `youtube`    |       ![youtube](https://skill-icons.alanreisanjo.workers.dev/icons?i=youtube)       |       `zed`        |              ![zed](https://skill-icons.alanreisanjo.workers.dev/icons?i=zed)              |
|      `zig`      |           ![zig](https://skill-icons.alanreisanjo.workers.dev/icons?i=zig)           |       `zod`        |              ![zod](https://skill-icons.alanreisanjo.workers.dev/icons?i=zod)              |
|    `zustand`    |       ![zustand](https://skill-icons.alanreisanjo.workers.dev/icons?i=zustand)       |                    |                                                                                            |

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
