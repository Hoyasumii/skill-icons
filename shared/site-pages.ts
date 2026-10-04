// The HTML files the build writes: one per page and language, the 404 page, the sitemap and robots.txt.
// Each page carries its own head and a plain-HTML copy of its content, for crawlers that don't run
// JavaScript; the app replaces that copy when it mounts.

import iconList from '../generated/icon-list.json';
import { en, type Code, type Messages } from '../src/i18n/messages/en';
import { ptBR } from '../src/i18n/messages/pt-BR';
import { DEFAULT_LOCALE, LOCALE_NAMES, LOCALES, type Locale } from '../src/i18n/locales';
import { categories, type IconCategory } from './icon-categories';
import {
  AUTHOR_NAME,
  AUTHOR_URL,
  MCP_URL,
  NPM_URL,
  REPO_URL,
  UPSTREAM_REPO,
  UPSTREAM_URL,
} from './links';
import { BADGE_TOOL, ICON_COUNT, MCP_CLIENTS, SEARCH_TOOL } from './mcp';
import { escapeHtml, PAGE_META, pageHead, pagePath, PAGES, type Page } from './page-meta';

const MESSAGES: Record<Locale, Messages> = { en, 'pt-BR': ptBR };

/** Where the build's index.html takes each page's head and content. */
export const HEAD_SLOT = '<!-- page-meta -->';
export const CONTENT_SLOT = '<!-- page-content -->';

export interface SiteUrls {
  /** The canonical site's absolute URL, ending in "/": canonical, hreflang and OpenGraph links. */
  siteUrl: string;
  /** This deploy's base path, ending in "/": links between pages. */
  base: string;
}

/** Turns a translated sentence with bits of code into HTML, escaping everything else. */
function rich(sentence: (code: Code) => unknown[]): string {
  const code: Code = text => `\u0002${text}\u0003`;
  return escapeHtml(sentence(code).join('')).replace(/\u0002(.*?)\u0003/g, '<code>$1</code>');
}

const link = (href: string, text: string, attrs = '') =>
  `<a href="${escapeHtml(href)}"${attrs}>${escapeHtml(text)}</a>`;

function nav(page: Page, locale: Locale, { base }: SiteUrls): string {
  const t = MESSAGES[locale];
  const others = LOCALES.filter(other => other !== locale).map(other =>
    link(base + pagePath(page, other), LOCALE_NAMES[other], ` hreflang="${other}" lang="${other}"`),
  );
  const links = [
    link(base + pagePath('home', locale), t.header.title),
    link(base + pagePath('mcp', locale), t.mcp.meta.title),
    link(REPO_URL, 'GitHub'),
    link(NPM_URL, t.header.npm),
    ...others,
  ];
  return `<nav aria-label="${escapeHtml(t.header.links)}"><ul>${links.map(l => `<li>${l}</li>`).join('')}</ul></nav>`;
}

function footer(locale: Locale): string {
  const t = MESSAGES[locale];
  return `<footer><p>${escapeHtml(t.footer.madeBy)} ${link(AUTHOR_URL, AUTHOR_NAME)} · ${escapeHtml(t.footer.credit)} ${link(UPSTREAM_URL, UPSTREAM_REPO)}</p></footer>`;
}

/** Every icon by category, under the builder's own category names. */
function homeContent(locale: Locale): string {
  const t = MESSAGES[locale];
  const sections = (Object.keys(categories) as IconCategory[]).map(category => {
    const names = iconList.filter(icon => icon.category === category).map(icon => icon.displayName);
    return `<section><h3>${escapeHtml(`${t.categories[category]} · ${names.length}`)}</h3><ul>${names
      .map(name => `<li>${escapeHtml(name)}</li>`)
      .join('')}</ul></section>`;
  });
  return [
    `<h1>${escapeHtml(t.header.title)}</h1>`,
    `<p>${escapeHtml(PAGE_META[locale].home.description)}</p>`,
    `<p>${escapeHtml(t.header.tagline)}</p>`,
    `<h2>${escapeHtml(t.picker.gridTitle(t.picker.allIcons, ICON_COUNT))}</h2>`,
    ...sections,
  ].join('');
}

function mcpContent(locale: Locale, { base }: SiteUrls): string {
  const { mcp } = MESSAGES[locale];
  const clients = (Object.keys(MCP_CLIENTS) as (keyof typeof MCP_CLIENTS)[]).map(
    id =>
      `<h3>${escapeHtml(mcp.install.clients[id])}</h3><p>${rich(mcp.install.hints[id])}</p><pre><code>${escapeHtml(MCP_CLIENTS[id].config)}</code></pre>`,
  );
  return [
    `<h1>${escapeHtml(mcp.heading.before + mcp.heading.highlight + mcp.heading.after)}</h1>`,
    `<p>${escapeHtml(mcp.lead(ICON_COUNT))}</p>`,
    `<p>${escapeHtml(mcp.endpoint)}: <code>${escapeHtml(MCP_URL)}</code></p>`,
    `<h2>${escapeHtml(mcp.install.title)}</h2>`,
    `<p>${escapeHtml(mcp.install.intro)}</p>`,
    ...clients,
    `<h2>${SEARCH_TOOL}</h2>`,
    `<p>${rich(code => mcp.search.summary(code, ICON_COUNT))}</p>`,
    `<h2>${BADGE_TOOL}</h2>`,
    `<p>${escapeHtml(mcp.badge.summary)}</p>`,
    `<h2>${escapeHtml(mcp.why.title)}</h2>`,
    `<p>${rich(mcp.why.text)}</p>`,
    `<p>${link(base + pagePath('home', locale), mcp.why.cta)}</p>`,
  ].join('');
}

/** The page's content as plain HTML, hidden once scripts run (see index.html). */
function pageContent(page: Page, locale: Locale, urls: SiteUrls): string {
  const main = page === 'home' ? homeContent(locale) : mcpContent(locale, urls);
  return `<div class="static-page">${nav(page, locale, urls)}<main>${main}</main>${footer(locale)}</div>`;
}

/** index.html filled in for `page` in `locale`. */
export function renderPage(template: string, page: Page, locale: Locale, urls: SiteUrls): string {
  return template
    .replace(/<html lang="[^"]*"/, `<html lang="${locale}"`)
    .replace(HEAD_SLOT, pageHead(page, locale, urls.siteUrl))
    .replace(CONTENT_SLOT, pageContent(page, locale, urls));
}

/** Every page in every language. */
export const SITE_PAGES = PAGES.flatMap(page => LOCALES.map(locale => ({ page, locale })));

const NOT_FOUND: Record<Locale, { text: string; back: string }> = {
  en: { text: 'Page not found.', back: 'Back to Skill Icons' },
  'pt-BR': { text: 'Página não encontrada.', back: 'Voltar para o Skill Icons' },
};

/** Served with a 404 status for any path that isn't a page, so it carries noindex and no app. */
export function notFoundPage({ base }: SiteUrls): string {
  const lines = LOCALES.map(locale => {
    const { text, back } = NOT_FOUND[locale];
    return `<p lang="${locale}">${escapeHtml(text)} ${link(base + pagePath('home', locale), back)}</p>`;
  });
  return `<!doctype html>
<html lang="${DEFAULT_LOCALE}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex" />
    <title>404 · Skill Icons</title>
    <link rel="icon" type="image/svg+xml" href="${base}skill-icons-favicon.svg" />
    <style>
      :root { color-scheme: light dark; font-family: system-ui, sans-serif; }
      body { margin: 0; min-height: 100dvh; display: grid; place-content: center; gap: 4px; padding: 16px; text-align: center; }
      h1 { margin: 0 0 8px; font-size: 64px; letter-spacing: -0.04em; }
      p { margin: 0; }
    </style>
  </head>
  <body>
    <h1>404</h1>
    ${lines.join('\n    ')}
  </body>
</html>
`;
}

/** Every page with its other languages as alternates. */
export function sitemap(siteUrl: string): string {
  const urls = SITE_PAGES.map(({ page, locale }) => {
    const alternates = LOCALES.map(
      other =>
        `    <xhtml:link rel="alternate" hreflang="${other}" href="${siteUrl + pagePath(page, other)}"/>`,
    );
    return [
      `  <url>`,
      `    <loc>${siteUrl + pagePath(page, locale)}</loc>`,
      ...alternates,
      `  </url>`,
    ].join('\n');
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
}

export function robots(siteUrl: string): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n`;
}
