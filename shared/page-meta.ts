// Routes, title, description and OpenGraph tags of each site page, in every locale.
// Each page and language has its own URL; the build writes one HTML file per pair (shared/site-pages.ts).

import { DEFAULT_LOCALE, detectLocale, isLocale, LOCALES, type Locale } from '../src/i18n/locales';
import { AUTHOR_NAME, AUTHOR_URL, REPO_URL, UPSTREAM_URL } from './links';

export const PAGES = ['home', 'mcp'] as const;

export type Page = (typeof PAGES)[number];

export interface PageMeta {
  title: string;
  description: string;
  /** Alt text of the preview image. */
  imageAlt: string;
}

/** What the builder is, in a few words: the home page's title and h1 after the site name. */
export const HOME_HEADLINE: Record<Locale, string> = {
  en: 'Tech stack icons for your GitHub README',
  'pt-BR': 'Ícones de tecnologias para o README do GitHub',
};

export const PAGE_META: Record<Locale, Record<Page, PageMeta>> = {
  en: {
    home: {
      title: `Skill Icons · ${HOME_HEADLINE.en}`,
      description:
        'Pick icons for the languages, frameworks and tools you use, build your skills badge and paste it in your GitHub README or resumé.',
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
      title: `Skill Icons · ${HOME_HEADLINE['pt-BR']}`,
      description:
        'Escolha ícones das linguagens, frameworks e ferramentas que você usa, monte seu badge de skills e cole no README do GitHub ou no currículo.',
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

const PAGE_SEGMENTS: Record<Page, string> = { home: '', mcp: 'mcp' };

/** `page`'s path in `locale`, relative to the site root: "", "mcp", "pt-BR/", "pt-BR/mcp". */
export function pagePath(page: Page, locale: Locale): string {
  const prefix = locale === DEFAULT_LOCALE ? '' : `${locale}/`;
  return prefix + PAGE_SEGMENTS[page];
}

/** The file the build writes for a page path: "index.html", "mcp.html", "pt-BR/index.html"… */
export function pageFile(path: string): string {
  return path === '' || path.endsWith('/') ? `${path}index.html` : `${path}.html`;
}

/**
 * The page and language a pathname points to. `locale` is undefined without a language prefix:
 * the unprefixed URLs are the default language's, but a visitor's own choice may take over there.
 */
export function parseSitePath(pathname: string, base: string): { page: Page; locale?: Locale } {
  const rest = pathname.startsWith(base) ? pathname.slice(base.length) : pathname.slice(1);
  const segments = rest.split('/').filter(Boolean);
  const locale = isLocale(segments[0]) && segments[0] !== DEFAULT_LOCALE ? segments[0] : undefined;
  if (locale) segments.shift();
  return { page: segments[0] === PAGE_SEGMENTS.mcp ? 'mcp' : 'home', locale };
}

/** The cookie that keeps the language picked in the app, so the server can honor it too. */
export const LOCALE_COOKIE = 'locale';

/** The language saved in a Cookie header, if any. */
export function localeFromCookie(cookie: string | null | undefined): Locale | undefined {
  const value = cookie?.match(new RegExp(`(?:^|;\\s*)${LOCALE_COOKIE}=([^;]*)`))?.[1];
  return isLocale(value) ? value : undefined;
}

/** The tags of an Accept-Language header, most preferred first. */
function acceptedLanguages(header: string): string[] {
  return header
    .split(',')
    .map(part => {
      const [tag, ...params] = part.trim().split(';');
      const q = params.map(p => p.trim()).find(p => p.startsWith('q='));
      return { tag: tag.trim(), q: q ? Number(q.slice(2)) : 1 };
    })
    .filter(({ tag, q }) => tag && tag !== '*' && q > 0)
    .sort((a, b) => b.q - a.q)
    .map(({ tag }) => tag);
}

/**
 * Where to send a visitor opening a page without a language prefix ("/", "/mcp"): the same page in
 * the language picked in the app (cookie) or, failing that, the browser's. Undefined to stay put,
 * which is also what crawlers get, as they send no Accept-Language.
 */
export function localeRedirect(
  pathname: string,
  base: string,
  headers: { cookie?: string | null; acceptLanguage?: string | null },
): string | undefined {
  const { page, locale } = parseSitePath(pathname, base);
  const unprefixed = base + pagePath(page, DEFAULT_LOCALE);
  if (locale || (pathname !== unprefixed && pathname !== `${unprefixed}/`)) return undefined;

  const preferred =
    localeFromCookie(headers.cookie) ??
    detectLocale(acceptedLanguages(headers.acceptLanguage ?? ''));
  return preferred === DEFAULT_LOCALE ? undefined : base + pagePath(page, preferred);
}

/** The site's link preview images, at the site root: the light card, and the dark one a page link with `?bg=dark` gets. */
export const OG_SITE_IMAGE = 'og-site.png';
export const OG_SITE_IMAGE_DARK = 'og-site-dark.png';

const OG_LOCALES: Record<Locale, string> = { en: 'en_US', 'pt-BR': 'pt_BR' };

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** schema.org data: the site, and what the page is (the builder app or the MCP docs). */
function structuredData(page: Page, locale: Locale, siteUrl: string): string {
  const { title, description } = PAGE_META[locale][page];
  const url = siteUrl + pagePath(page, locale);
  const author = { '@type': 'Person', name: AUTHOR_NAME, url: AUTHOR_URL };
  const website = {
    '@type': 'WebSite',
    '@id': `${siteUrl}#website`,
    url: siteUrl,
    name: 'Skill Icons',
    inLanguage: [...LOCALES],
  };
  const content =
    page === 'home'
      ? {
          '@type': 'WebApplication',
          name: 'Skill Icons',
          url,
          description,
          inLanguage: locale,
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Any',
          isAccessibleForFree: true,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          author,
          isBasedOn: UPSTREAM_URL,
          codeRepository: REPO_URL,
        }
      : {
          '@type': 'TechArticle',
          headline: title,
          url,
          description,
          inLanguage: locale,
          author,
          isPartOf: { '@id': website['@id'] },
        };
  // "<" is escaped so no text can close the script element.
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': [website, content] });
  return `<script type="application/ld+json">${json.replace(/</g, '\\u003c')}</script>`;
}

/** The <head> tags for `page` in `locale`; `siteUrl` is the canonical site's absolute URL, ending in "/". */
export function pageHead(page: Page, locale: Locale, siteUrl: string): string {
  const { title, description, imageAlt } = PAGE_META[locale][page];
  const url = siteUrl + pagePath(page, locale);
  const image = siteUrl + OG_SITE_IMAGE;

  const property = (name: string, content: string) =>
    `<meta property="${name}" content="${escapeHtml(content)}" />`;
  const name = (key: string, content: string) =>
    `<meta name="${key}" content="${escapeHtml(content)}" />`;
  const alternate = (hreflang: string, href: string) =>
    `<link rel="alternate" hreflang="${hreflang}" href="${escapeHtml(href)}" />`;

  return [
    `<title>${escapeHtml(title)}</title>`,
    name('description', description),
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    ...LOCALES.map(other => alternate(other, siteUrl + pagePath(page, other))),
    alternate('x-default', siteUrl + pagePath(page, DEFAULT_LOCALE)),
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
    structuredData(page, locale, siteUrl),
  ].join('\n    ');
}
