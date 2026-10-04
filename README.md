<p align="center"><img align="center" width="280" src="./.github/text-logo.svg#gh-dark-mode-only"/></p>
<p align="center"><img align="center" width="280" src="./.github/text-logo-light.svg#gh-light-mode-only"/></p>
<h3 align="center">Showcase your skills on your GitHub or resumé with ease!</h3>

<p align="center">
  <a href="https://www.npmjs.com/package/@hoyasumii/skill-icons"><img src="https://img.shields.io/npm/v/@hoyasumii/skill-icons?color=cb3837&logo=npm" alt="npm version"></a>
  <a href="https://github.com/Hoyasumii/skill-icons/actions/workflows/deploy.yml"><img src="https://github.com/Hoyasumii/skill-icons/actions/workflows/deploy.yml/badge.svg" alt="Deploy"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/Hoyasumii/skill-icons" alt="License"></a>
</p>

<hr>

<h3 align="center">Powered by Cloudflare Workers ⚡</h3>

Skill Icons comes in two flavors:

- **An image API**: paste a URL into your README and get an SVG with your skills. Use the [builder](https://skill-icons.alanreisanjo.workers.dev) to pick icons visually.
- **An npm package**, [`@hoyasumii/skill-icons`](https://www.npmjs.com/package/@hoyasumii/skill-icons): the same icons as components for React, Vue, Svelte, Angular, Solid, Astro and Web Components.

<h3>NOTE: To keep icons consistent and to ensure browser support, we don't accept pull requests for icon submissions. If you would like an icon added, please open an issue.<h3>

# Docs

- [Example](#example)
- [Specifying Icons](#specifying-icons)
- [Themed Icons](#themed-icons)
- [Icons Per Line](#icons-per-line)
- [Centering Icons](#centering-icons)
- [npm Package](#npm-package)
- [Icons List](#icons-list)
- [Development](#development)
- [Releasing](#releasing)

# Example

<p align="center"><img align="center" src="./.github/example-dark.png#gh-dark-mode-only"/></p>
<p align="center"><img align="center" src="./.github/example-light.png#gh-light-mode-only"/></p>

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

# Icons List

Here's a list of all the icons currently supported. Feel free to open an issue to suggest icons to add!

Short aliases also work: `js`, `ts`, `py`, `k8s`, `postgres`, `tailwind`, `next` and more (see `shortNames` in [`shared/icons.ts`](./shared/icons.ts)).

|      Icon ID       |                                             Icon                                             |
| :----------------: | :------------------------------------------------------------------------------------------: |
|    `abacatepay`    |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=abacatepay" width="48">    |
|     `ableton`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=ableton" width="48">      |
|   `activitypub`    |   <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=activitypub" width="48">    |
|      `actix`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=actix" width="48">       |
|      `adonis`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=adonis" width="48">      |
|      `adyen`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=adyen" width="48">       |
|   `aftereffects`   |   <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=aftereffects" width="48">   |
|     `aiscript`     |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=aiscript" width="48">     |
|     `alpinejs`     |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=alpinejs" width="48">     |
|     `anaconda`     |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=anaconda" width="48">     |
|     `android`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=android" width="48">      |
|  `androidstudio`   |  <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=androidstudio" width="48">   |
|     `angular`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=angular" width="48">      |
|     `ansible`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=ansible" width="48">      |
|   `antigravity`    |   <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=antigravity" width="48">    |
|      `apollo`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=apollo" width="48">      |
|      `apple`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=apple" width="48">       |
|     `applepay`     |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=applepay" width="48">     |
|     `appwrite`     |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=appwrite" width="48">     |
|       `arch`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=arch" width="48">       |
|     `arduino`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=arduino" width="48">      |
|      `argocd`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=argocd" width="48">      |
|      `astro`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=astro" width="48">       |
|       `atom`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=atom" width="48">       |
|     `audition`     |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=audition" width="48">     |
|      `auth0`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=auth0" width="48">       |
|      `authjs`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=authjs" width="48">      |
|     `autocad`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=autocad" width="48">      |
|       `aws`        |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=aws" width="48">        |
|       `azul`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=azul" width="48">       |
|      `azure`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=azure" width="48">       |
|      `babel`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=babel" width="48">       |
|       `bash`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=bash" width="48">       |
|    `betterauth`    |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=betterauth" width="48">    |
|       `bevy`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=bevy" width="48">       |
|      `biome`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=biome" width="48">       |
|    `bitbucket`     |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=bitbucket" width="48">     |
|     `blender`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=blender" width="48">      |
|     `bluesky`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=bluesky" width="48">      |
|    `bootstrap`     |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=bootstrap" width="48">     |
|       `bsd`        |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=bsd" width="48">        |
|       `bun`        |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=bun" width="48">        |
|        `c`         |        <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=c" width="48">         |
|      `canva`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=canva" width="48">       |
|    `cassandra`     |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=cassandra" width="48">     |
|     `chatgpt`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=chatgpt" width="48">      |
|      `claude`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=claude" width="48">      |
|      `clerk`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=clerk" width="48">       |
|    `clickhouse`    |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=clickhouse" width="48">    |
|      `cline`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=cline" width="48">       |
|      `clion`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=clion" width="48">       |
|     `clojure`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=clojure" width="48">      |
|    `cloudflare`    |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=cloudflare" width="48">    |
|      `cmake`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=cmake" width="48">       |
|     `codepen`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=codepen" width="48">      |
|      `codex`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=codex" width="48">       |
|   `coffeescript`   |   <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=coffeescript" width="48">   |
|      `convex`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=convex" width="48">      |
|     `coolify`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=coolify" width="48">      |
|       `cpp`        |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=cpp" width="48">        |
|     `crystal`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=crystal" width="48">      |
|        `cs`        |        <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=cs" width="48">        |
|       `css`        |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=css" width="48">        |
|      `cursor`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=cursor" width="48">      |
|     `cypress`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=cypress" width="48">      |
|        `d3`        |        <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=d3" width="48">        |
|     `daisyui`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=daisyui" width="48">      |
|       `dart`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=dart" width="48">       |
|     `datadog`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=datadog" width="48">      |
|     `datagrip`     |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=datagrip" width="48">     |
|      `debian`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=debian" width="48">      |
|     `deepseek`     |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=deepseek" width="48">     |
|      `defold`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=defold" width="48">      |
|       `deno`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=deno" width="48">       |
|      `devto`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=devto" width="48">       |
|   `digitalocean`   |   <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=digitalocean" width="48">   |
|     `discord`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=discord" width="48">      |
|   `discordbots`    |   <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=discordbots" width="48">    |
|    `discordjs`     |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=discordjs" width="48">     |
|      `django`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=django" width="48">      |
|      `docker`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=docker" width="48">      |
|    `docusaurus`    |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=docusaurus" width="48">    |
|      `dotnet`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=dotnet" width="48">      |
|     `drizzle`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=drizzle" width="48">      |
|      `duckdb`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=duckdb" width="48">      |
|     `dynamodb`     |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=dynamodb" width="48">     |
|     `eclipse`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=eclipse" width="48">      |
|  `elasticsearch`   |  <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=elasticsearch" width="48">   |
|     `electron`     |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=electron" width="48">     |
|      `elixir`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=elixir" width="48">      |
|      `elysia`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=elysia" width="48">      |
|      `emacs`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=emacs" width="48">       |
|      `ember`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=ember" width="48">       |
|     `emotion`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=emotion" width="48">      |
|     `esbuild`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=esbuild" width="48">      |
|      `eslint`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=eslint" width="48">      |
|       `expo`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=expo" width="48">       |
|    `expressjs`     |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=expressjs" width="48">     |
|     `fastapi`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=fastapi" width="48">      |
|     `fastify`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=fastify" width="48">      |
|    `fediverse`     |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=fediverse" width="48">     |
|      `fiber`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=fiber" width="48">       |
|      `figma`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=figma" width="48">       |
|     `firebase`     |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=firebase" width="48">     |
|      `flask`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=flask" width="48">       |
|     `flutter`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=flutter" width="48">      |
|       `fly`        |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=fly" width="48">        |
|      `forth`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=forth" width="48">       |
|     `fortran`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=fortran" width="48">      |
| `gamemakerstudio`  | <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=gamemakerstudio" width="48">  |
|      `gatsby`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=gatsby" width="48">      |
|       `gcp`        |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=gcp" width="48">        |
|      `gemini`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=gemini" width="48">      |
|     `gherkin`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=gherkin" width="48">      |
|       `gin`        |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=gin" width="48">        |
|       `git`        |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=git" width="48">        |
|      `github`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=github" width="48">      |
|  `githubactions`   |  <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=githubactions" width="48">   |
|  `githubcopilot`   |  <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=githubcopilot" width="48">   |
|      `gitlab`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=gitlab" width="48">      |
|      `gleam`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=gleam" width="48">       |
|      `gmail`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=gmail" width="48">       |
|      `godot`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=godot" width="48">       |
|      `goland`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=goland" width="48">      |
|      `golang`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=golang" width="48">      |
|    `googlepay`     |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=googlepay" width="48">     |
|      `gradle`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=gradle" width="48">      |
|     `grafana`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=grafana" width="48">      |
|     `graphql`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=graphql" width="48">      |
|       `grok`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=grok" width="48">       |
|       `gtk`        |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=gtk" width="48">        |
|       `gulp`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=gulp" width="48">       |
|     `haskell`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=haskell" width="48">      |
|       `haxe`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=haxe" width="48">       |
|    `haxeflixel`    |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=haxeflixel" width="48">    |
|      `helix`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=helix" width="48">       |
|       `helm`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=helm" width="48">       |
|      `heroku`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=heroku" width="48">      |
|    `hibernate`     |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=hibernate" width="48">     |
|       `hono`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=hono" width="48">       |
|       `html`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=html" width="48">       |
|       `htmx`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=htmx" width="48">       |
|   `huggingface`    |   <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=huggingface" width="48">    |
|      `husky`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=husky" width="48">       |
|       `idea`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=idea" width="48">       |
|   `illustrator`    |   <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=illustrator" width="48">    |
|     `inkscape`     |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=inkscape" width="48">     |
|    `instagram`     |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=instagram" width="48">     |
|       `ios`        |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=ios" width="48">        |
|       `ipfs`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=ipfs" width="48">       |
|       `java`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=java" width="48">       |
|    `javascript`    |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=javascript" width="48">    |
|     `jenkins`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=jenkins" width="48">      |
|       `jest`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=jest" width="48">       |
|       `jira`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=jira" width="48">       |
|      `jquery`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=jquery" width="48">      |
|       `json`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=json" width="48">       |
|      `julia`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=julia" width="48">       |
|     `jupyter`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=jupyter" width="48">      |
|      `kafka`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=kafka" width="48">       |
|       `kali`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=kali" width="48">       |
|     `keycloak`     |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=keycloak" width="48">     |
|       `knip`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=knip" width="48">       |
|      `kotlin`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=kotlin" width="48">      |
|       `ktor`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=ktor" width="48">       |
|    `kubernetes`    |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=kubernetes" width="48">    |
|    `langchain`     |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=langchain" width="48">     |
|     `langfuse`     |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=langfuse" width="48">     |
|     `laravel`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=laravel" width="48">      |
|      `latex`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=latex" width="48">       |
|   `lemonsqueezy`   |   <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=lemonsqueezy" width="48">   |
|       `less`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=less" width="48">       |
|      `linear`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=linear" width="48">      |
|     `linkedin`     |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=linkedin" width="48">     |
|      `linux`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=linux" width="48">       |
|       `lit`        |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=lit" width="48">        |
|       `lua`        |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=lua" width="48">        |
|      `macos`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=macos" width="48">       |
|     `mariadb`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=mariadb" width="48">      |
|     `markdown`     |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=markdown" width="48">     |
|    `mastercard`    |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=mastercard" width="48">    |
|     `mastodon`     |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=mastodon" width="48">     |
|    `materialui`    |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=materialui" width="48">    |
|      `matlab`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=matlab" width="48">      |
|      `maven`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=maven" width="48">       |
|       `mcp`        |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=mcp" width="48">        |
|   `mercadopago`    |   <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=mercadopago" width="48">    |
|       `mint`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=mint" width="48">       |
|     `misskey`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=misskey" width="48">      |
|      `mocha`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=mocha" width="48">       |
|       `mojo`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=mojo" width="48">       |
|     `mongodb`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=mongodb" width="48">      |
|      `mysql`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=mysql" width="48">       |
|       `n8n`        |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=n8n" width="48">        |
|      `neo4j`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=neo4j" width="48">       |
|       `neon`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=neon" width="48">       |
|      `neovim`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=neovim" width="48">      |
|      `nestjs`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=nestjs" width="48">      |
|     `netlify`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=netlify" width="48">      |
|      `nextjs`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=nextjs" width="48">      |
|      `nginx`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=nginx" width="48">       |
|       `nim`        |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=nim" width="48">        |
|       `nix`        |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=nix" width="48">        |
|      `nodejs`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=nodejs" width="48">      |
|      `notion`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=notion" width="48">      |
|       `npm`        |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=npm" width="48">        |
|      `nubank`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=nubank" width="48">      |
|      `numpy`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=numpy" width="48">       |
|      `nuxtjs`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=nuxtjs" width="48">      |
|        `nx`        |        <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=nx" width="48">        |
|     `obsidian`     |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=obsidian" width="48">     |
|      `ocaml`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=ocaml" width="48">       |
|      `octave`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=octave" width="48">      |
|      `ollama`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=ollama" width="48">      |
|      `openai`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=openai" width="48">      |
|     `openclaw`     |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=openclaw" width="48">     |
|     `opencode`     |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=opencode" width="48">     |
|      `opencv`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=opencv" width="48">      |
|    `openshift`     |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=openshift" width="48">     |
|    `openstack`     |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=openstack" width="48">     |
|  `opentelemetry`   |  <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=opentelemetry" width="48">   |
|      `oxlint`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=oxlint" width="48">      |
|       `p5js`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=p5js" width="48">       |
|      `paddle`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=paddle" width="48">      |
|    `pagseguro`     |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=pagseguro" width="48">     |
|      `pandas`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=pandas" width="48">      |
|      `paypal`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=paypal" width="48">      |
|       `perl`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=perl" width="48">       |
|    `perplexity`    |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=perplexity" width="48">    |
|    `photoshop`     |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=photoshop" width="48">     |
|       `php`        |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=php" width="48">        |
|     `phpstorm`     |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=phpstorm" width="48">     |
|      `pinia`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=pinia" width="48">       |
|       `pix`        |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=pix" width="48">        |
|       `pkl`        |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=pkl" width="48">        |
|      `plan9`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=plan9" width="48">       |
|      `plane`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=plane" width="48">       |
|   `planetscale`    |   <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=planetscale" width="48">    |
|    `playwright`    |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=playwright" width="48">    |
|       `pnpm`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=pnpm" width="48">       |
|    `pocketbase`    |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=pocketbase" width="48">    |
|      `polar`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=polar" width="48">       |
|    `postgresql`    |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=postgresql" width="48">    |
|     `posthog`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=posthog" width="48">      |
|     `postman`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=postman" width="48">      |
|    `powershell`    |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=powershell" width="48">    |
|     `premiere`     |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=premiere" width="48">     |
|     `prettier`     |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=prettier" width="48">     |
|      `prisma`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=prisma" width="48">      |
|    `processing`    |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=processing" width="48">    |
|    `prometheus`    |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=prometheus" width="48">    |
|       `pug`        |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=pug" width="48">        |
|    `puppeteer`     |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=puppeteer" width="48">     |
|     `pycharm`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=pycharm" width="48">      |
|      `pytest`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=pytest" width="48">      |
|      `python`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=python" width="48">      |
|     `pytorch`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=pytorch" width="48">      |
|        `qt`        |        <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=qt" width="48">        |
|        `r`         |        <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=r" width="48">         |
|     `rabbitmq`     |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=rabbitmq" width="48">     |
|     `radixui`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=radixui" width="48">      |
|      `rails`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=rails" width="48">       |
|     `railway`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=railway" width="48">      |
|   `raspberrypi`    |   <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=raspberrypi" width="48">    |
|     `razorpay`     |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=razorpay" width="48">     |
|      `react`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=react" width="48">       |
|    `reactivex`     |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=reactivex" width="48">     |
|   `reactnative`    |   <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=reactnative" width="48">    |
|    `reactquery`    |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=reactquery" width="48">    |
|      `reddit`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=reddit" width="48">      |
|      `redhat`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=redhat" width="48">      |
|      `redis`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=redis" width="48">       |
|      `redux`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=redux" width="48">       |
|      `regex`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=regex" width="48">       |
|      `remix`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=remix" width="48">       |
|      `replit`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=replit" width="48">      |
|      `resend`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=resend" width="48">      |
|      `rider`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=rider" width="48">       |
|   `robloxstudio`   |   <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=robloxstudio" width="48">   |
|      `rocket`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=rocket" width="48">      |
|     `rollupjs`     |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=rollupjs" width="48">     |
|       `ros`        |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=ros" width="48">        |
|      `rspack`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=rspack" width="48">      |
|       `ruby`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=ruby" width="48">       |
|       `rust`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=rust" width="48">       |
|       `sass`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=sass" width="48">       |
|      `scala`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=scala" width="48">       |
|   `scikitlearn`    |   <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=scikitlearn" width="48">    |
|     `selenium`     |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=selenium" width="48">     |
|      `sentry`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=sentry" width="48">      |
|    `sequelize`     |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=sequelize" width="48">     |
|     `shadcnui`     |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=shadcnui" width="48">     |
|      `signoz`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=signoz" width="48">      |
|      `sketch`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=sketch" width="48">      |
|     `sketchup`     |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=sketchup" width="48">     |
|      `slack`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=slack" width="48">       |
|     `solidity`     |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=solidity" width="48">     |
|     `solidjs`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=solidjs" width="48">      |
|     `spotify`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=spotify" width="48">      |
|      `spring`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=spring" width="48">      |
|       `sql`        |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=sql" width="48">        |
|      `sqlite`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=sqlite" width="48">      |
|    `sqlserver`     |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=sqlserver" width="48">     |
|      `square`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=square" width="48">      |
|  `stackoverflow`   |  <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=stackoverflow" width="48">   |
|    `starlight`     |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=starlight" width="48">     |
|    `storybook`     |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=storybook" width="48">     |
|      `strapi`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=strapi" width="48">      |
|      `stripe`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=stripe" width="48">      |
| `styledcomponents` | <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=styledcomponents" width="48"> |
|     `sublime`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=sublime" width="48">      |
|     `supabase`     |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=supabase" width="48">     |
|      `svelte`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=svelte" width="48">      |
|       `svg`        |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=svg" width="48">        |
|       `swc`        |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=swc" width="48">        |
|      `swift`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=swift" width="48">       |
|     `symfony`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=symfony" width="48">      |
|   `tailwindcss`    |   <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=tailwindcss" width="48">    |
|     `tanstack`     |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=tanstack" width="48">     |
|      `tauri`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=tauri" width="48">       |
|     `telegram`     |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=telegram" width="48">     |
|    `tensorflow`    |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=tensorflow" width="48">    |
|    `terraform`     |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=terraform" width="48">     |
|  `testinglibrary`  |  <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=testinglibrary" width="48">  |
|     `threejs`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=threejs" width="48">      |
|       `trae`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=trae" width="48">       |
|     `traefik`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=traefik" width="48">      |
|       `trpc`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=trpc" width="48">       |
|    `turbopack`     |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=turbopack" width="48">     |
|    `turborepo`     |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=turborepo" width="48">     |
|      `turso`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=turso" width="48">       |
|     `twitter`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=twitter" width="48">      |
|    `typescript`    |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=typescript" width="48">    |
|      `ubuntu`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=ubuntu" width="48">      |
|      `unity`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=unity" width="48">       |
|   `unrealengine`   |   <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=unrealengine" width="48">   |
|     `upstash`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=upstash" width="48">      |
|        `v`         |        <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=v" width="48">         |
|       `vala`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=vala" width="48">       |
|      `vercel`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=vercel" width="48">      |
|     `verilog`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=verilog" width="48">      |
|       `vim`        |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=vim" width="48">        |
|       `visa`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=visa" width="48">       |
|   `visualstudio`   |   <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=visualstudio" width="48">   |
|       `vite`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=vite" width="48">       |
|      `vitest`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=vitest" width="48">      |
|      `vscode`      |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=vscode" width="48">      |
|     `vscodium`     |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=vscodium" width="48">     |
|      `vuejs`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=vuejs" width="48">       |
|     `vuetify`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=vuetify" width="48">      |
|       `warp`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=warp" width="48">       |
|   `webassembly`    |   <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=webassembly" width="48">    |
|     `webflow`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=webflow" width="48">      |
|     `webpack`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=webpack" width="48">      |
|     `webstorm`     |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=webstorm" width="48">     |
|     `whatsapp`     |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=whatsapp" width="48">     |
|     `windicss`     |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=windicss" width="48">     |
|     `windows`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=windows" width="48">      |
|     `windsurf`     |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=windsurf" width="48">     |
|    `wordpress`     |    <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=wordpress" width="48">     |
|     `workers`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=workers" width="48">      |
|      `xcode`       |      <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=xcode" width="48">       |
|        `xd`        |        <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=xd" width="48">        |
|       `yaml`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=yaml" width="48">       |
|       `yarn`       |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=yarn" width="48">       |
|       `yew`        |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=yew" width="48">        |
|     `youtube`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=youtube" width="48">      |
|       `zed`        |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=zed" width="48">        |
|       `zig`        |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=zig" width="48">        |
|       `zod`        |       <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=zod" width="48">        |
|     `zustand`      |     <img src="https://skill-icons.alanreisanjo.workers.dev/icons?i=zustand" width="48">      |

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

| Path                    | Description                                                               |
| ----------------------- | ------------------------------------------------------------------------- |
| `icons/`                | Source SVGs                                                               |
| `scripts/`              | Generates `generated/`, `public/svg/` and the package icons from `icons/` |
| `worker/`               | API: `/icons`, `/api/icons`, `/api/svgs`                                  |
| `src/`                  | Builder site (React, TypeScript, Tailwind, shadcn/ui)                     |
| `shared/`               | Code shared by both (aliases, defaults, URL builder)                      |
| `packages/skill-icons/` | The `@hoyasumii/skill-icons` npm package                                  |

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

---

## 💖 Support the Project

Thank you so much already for using my projects! If you want to go a step further and support my open source work, buy me a coffee:

<a href='https://ko-fi.com/Q5Q860KQ2' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://cdn.ko-fi.com/cdn/kofi1.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

To support the project directly, feel free to open issues for icon suggestions, or contribute with a pull request!

Before contributing, read [CONTRIBUTING.md](CONTRIBUTING.md). Everyone taking part is expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md), and security problems go through [SECURITY.md](SECURITY.md).
