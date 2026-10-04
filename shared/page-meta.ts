// Title, description and OpenGraph tags of each site page, in every locale.
// The build writes the home page's into index.html; the Worker rewrites them per page and language.

import { LOCALES, type Locale } from '../src/i18n/locales';

export type Page = 'home' | 'mcp';

export interface PageMeta {
  title: string;
  description: string;
  /** Alt text of the preview image. */
  imageAlt: string;
}

export const PAGE_META: Record<Locale, Record<Page, PageMeta>> = {
  en: {
    home: {
      title: 'Skill Icons',
      description: 'Showcase your skills on your GitHub or resumé with ease!',
      imageAlt: 'Skill Icons: build your stack and paste it in your README',
    },
    mcp: {
      title: 'MCP server · Skill Icons',
      description:
        'Connect the Skill Icons MCP server to Claude Code, Cursor or VS Code and ask for your skills badge in plain language.',
      imageAlt: 'Skill Icons: build your stack and paste it in your README',
    },
  },
  'pt-BR': {
    home: {
      title: 'Skill Icons',
      description: 'Mostre suas habilidades no seu GitHub ou currículo com facilidade!',
      imageAlt: 'Skill Icons: monte sua stack e cole no seu README',
    },
    mcp: {
      title: 'Servidor MCP · Skill Icons',
      description:
        'Conecte o servidor MCP do Skill Icons ao Claude Code, Cursor ou VS Code e peça seu badge de skills em linguagem natural.',
      imageAlt: 'Skill Icons: monte sua stack e cole no seu README',
    },
  },
};

/** Each page's path under the site URL. */
const PAGE_PATHS: Record<Page, string> = { home: '', mcp: 'mcp' };

const OG_LOCALES: Record<Locale, string> = { en: 'en_US', 'pt-BR': 'pt_BR' };

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** The <head> tags for `page` in `locale`; `siteUrl` is the deploy's absolute URL, ending in "/". */
export function pageHead(page: Page, locale: Locale, siteUrl: string): string {
  const { title, description, imageAlt } = PAGE_META[locale][page];
  const url = siteUrl + PAGE_PATHS[page];
  const image = `${siteUrl}og-site.png`;

  const property = (name: string, content: string) =>
    `<meta property="${name}" content="${escapeAttr(content)}" />`;
  const name = (key: string, content: string) =>
    `<meta name="${key}" content="${escapeAttr(content)}" />`;

  return [
    `<title>${escapeAttr(title)}</title>`,
    name('description', description),
    `<link rel="canonical" href="${escapeAttr(url)}" />`,
    property('og:type', 'website'),
    property('og:site_name', 'Skill Icons'),
    property('og:title', title),
    property('og:description', description),
    property('og:url', url),
    property('og:locale', OG_LOCALES[locale]),
    ...LOCALES.filter(other => other !== locale).map(other =>
      property('og:locale:alternate', OG_LOCALES[other]),
    ),
    property('og:image', image),
    property('og:image:type', 'image/png'),
    property('og:image:width', '1200'),
    property('og:image:height', '630'),
    property('og:image:alt', imageAlt),
    name('twitter:card', 'summary_large_image'),
    name('twitter:title', title),
    name('twitter:description', description),
    name('twitter:image', image),
    name('twitter:image:alt', imageAlt),
  ].join('\n    ');
}
