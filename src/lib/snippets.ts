import type { CodeLang } from '@/lib/highlight';
import { PACKAGE_NAME } from '@/lib/links';
import { API_URL, type IconsUrlOptions } from '../../shared/icons';

export const INSTALL_COMMAND = `npm i ${PACKAGE_NAME}`;

/** Safe inside a quoted attribute in HTML and in every framework template (no `{` interpolation, no template-literal escapes). */
function escapeAttr(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/[<>{}`\\]/g, char => `&#${char.charCodeAt(0)};`);
}

/** Keeps brackets in the title from closing the Markdown image early. */
const escapeMarkdownAlt = (text: string) => text.replace(/[\\[\]]/g, '\\$&');

interface LinkFormat {
  label: string;
  lang: CodeLang;
  render: (url: string, alt: string) => string;
}

/** Snippets that embed the badge image served by the API. */
export const LINK_FORMATS = {
  markdown: {
    label: 'Markdown',
    lang: 'markdown',
    render: (url, alt) => `[![${escapeMarkdownAlt(alt)}](${url})](${API_URL})`,
  },
  html: {
    label: 'HTML',
    lang: 'html',
    render: (url, alt) =>
      `<p align="center">\n  <a href="${API_URL}">\n    <img src="${url}" alt="${escapeAttr(alt)}" />\n  </a>\n</p>`,
  },
  url: { label: 'URL', lang: 'text', render: url => url },
} satisfies Record<string, LinkFormat>;

export type Format = keyof typeof LINK_FORMATS;

export const FORMATS: Format[] = ['markdown', 'html', 'url'];

interface FrameworkInput extends IconsUrlOptions {
  names: string;
  /** ` alt="…"`, already escaped. */
  alt: string;
  props: { jsx: string; vue: string; angular: string };
}

function frameworkInput({ icons, theme, perLine }: IconsUrlOptions, alt: string): FrameworkInput {
  const names = `[${icons.map(icon => `'${icon}'`).join(', ')}]`;
  const altAttr = ` alt="${escapeAttr(alt)}"`;
  return {
    icons,
    theme,
    perLine,
    names,
    alt: altAttr,
    props: {
      jsx: ` theme="${theme}" perLine={${perLine}}${altAttr}`,
      vue: ` theme="${theme}" :per-line="${perLine}"${altAttr}`,
      angular: ` theme="${theme}" [perLine]="${perLine}"${altAttr}`,
    },
  };
}

interface Framework {
  label: string;
  /** Skill icon shown on the framework's chip. */
  icon: string;
  lang: CodeLang;
  fileName: string;
  render: (input: FrameworkInput) => string;
}

/** Components from the npm package, one entry per framework it ships. */
export const FRAMEWORKS = {
  react: {
    label: 'React',
    icon: 'react',
    lang: 'tsx',
    fileName: 'Skills.tsx',
    render: ({ names, props }) =>
      `import { Icons } from '${PACKAGE_NAME}/react';\n\n<Icons names={${names}}${props.jsx} />`,
  },
  vue: {
    label: 'Vue',
    icon: 'vuejs',
    lang: 'vue',
    fileName: 'Skills.vue',
    render: ({ names, props }) =>
      `<script setup lang="ts">\nimport { Icons } from '${PACKAGE_NAME}/vue';\n</script>\n\n<template>\n  <Icons :names="${names}"${props.vue} />\n</template>`,
  },
  svelte: {
    label: 'Svelte',
    icon: 'svelte',
    lang: 'svelte',
    fileName: 'Skills.svelte',
    render: ({ names, props }) =>
      `<script lang="ts">\n  import { Icons } from '${PACKAGE_NAME}/svelte';\n</script>\n\n<Icons names={${names}}${props.jsx} />`,
  },
  solid: {
    label: 'Solid',
    icon: 'solidjs',
    lang: 'tsx',
    fileName: 'Skills.tsx',
    render: ({ names, props }) =>
      `import { Icons } from '${PACKAGE_NAME}/solid';\n\n<Icons names={${names}}${props.jsx} />`,
  },
  angular: {
    label: 'Angular',
    icon: 'angular',
    lang: 'tsx',
    fileName: 'skills.component.ts',
    render: ({ names, props }) =>
      `import { Component } from '@angular/core';\nimport { Icons } from '${PACKAGE_NAME}/angular';\n\n@Component({\n  imports: [Icons],\n  template: \`<skill-icons [names]="${names}"${props.angular} />\`,\n})\nexport class Skills {}`,
  },
  astro: {
    label: 'Astro',
    icon: 'astro',
    lang: 'astro',
    fileName: 'Skills.astro',
    render: ({ names, props }) =>
      `---\nimport { Icons } from '${PACKAGE_NAME}/astro';\n---\n\n<Icons names={${names}}${props.jsx} />`,
  },
  element: {
    label: 'Web Component',
    icon: 'html',
    lang: 'html',
    fileName: 'index.html',
    render: ({ icons, theme, perLine, alt }) =>
      `<script type="module">\n  import '${PACKAGE_NAME}/element/define';\n</script>\n\n<skill-icons names="${icons.join(',')}" theme="${theme}" per-line="${perLine}"${alt}></skill-icons>`,
  },
} satisfies Record<string, Framework>;

export type FrameworkId = keyof typeof FRAMEWORKS;

/** `alt` is the badge title, used as the image's alt text. */
export function renderFramework(
  framework: FrameworkId,
  options: IconsUrlOptions,
  alt: string,
): string {
  return FRAMEWORKS[framework].render(frameworkInput(options, alt));
}
