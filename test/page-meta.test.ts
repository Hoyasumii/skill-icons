import { describe, expect, it } from 'vitest';
import {
  localeFromCookie,
  localeRedirect,
  pageFile,
  pageHead,
  pagePath,
  parseSitePath,
} from '../shared/page-meta';
import {
  CONTENT_SLOT,
  HEAD_SLOT,
  notFoundPage,
  renderPage,
  robots,
  SITE_PAGES,
  sitemap,
} from '../shared/site-pages';

const SITE = 'https://example.com/';

describe('page routes', () => {
  it.each([
    ['home', 'en', '', 'index.html'],
    ['mcp', 'en', 'mcp', 'mcp.html'],
    ['home', 'pt-BR', 'pt-BR/', 'pt-BR/index.html'],
    ['mcp', 'pt-BR', 'pt-BR/mcp', 'pt-BR/mcp.html'],
  ] as const)('%s in %s lives at "%s" (%s)', (page, locale, path, file) => {
    expect(pagePath(page, locale)).toBe(path);
    expect(pageFile(path)).toBe(file);
  });

  it.each([
    ['/', '/', { page: 'home', locale: undefined }],
    ['/mcp', '/', { page: 'mcp', locale: undefined }],
    ['/mcp/', '/', { page: 'mcp', locale: undefined }],
    ['/pt-BR/', '/', { page: 'home', locale: 'pt-BR' }],
    ['/pt-BR/mcp', '/', { page: 'mcp', locale: 'pt-BR' }],
    ['/skill-icons/pt-BR/mcp', '/skill-icons/', { page: 'mcp', locale: 'pt-BR' }],
    ['/skill-icons/', '/skill-icons/', { page: 'home', locale: undefined }],
  ])('reads %s under base %s', (pathname, base, expected) => {
    expect(parseSitePath(pathname, base)).toEqual(expected);
  });
});

describe('localeRedirect', () => {
  it.each([
    ['/', '/', 'pt-BR,pt;q=0.9,en;q=0.8', '/pt-BR/'],
    ['/mcp', '/', 'pt-PT', '/pt-BR/mcp'],
    ['/mcp/', '/', 'pt', '/pt-BR/mcp'],
    ['/', '/', 'en;q=0.5, pt-BR;q=0.9', '/pt-BR/'],
    ['/skill-icons/', '/skill-icons/', 'pt-BR', '/skill-icons/pt-BR/'],
    ['/', '/', 'en-US,en;q=0.9', undefined],
    ['/', '/', 'fr-FR', undefined],
    ['/', '/', '', undefined],
    ['/', '/', 'pt-BR;q=0', undefined],
    ['/pt-BR/', '/', 'en-US', undefined],
    ['/pt-BR/mcp', '/', 'en-US', undefined],
    ['/unknown', '/', 'pt-BR', undefined],
  ])('sends %s (base %s, Accept-Language "%s") to %s', (pathname, base, acceptLanguage, target) => {
    expect(localeRedirect(pathname, base, { acceptLanguage })).toBe(target);
  });

  it('prefers the language picked in the app over the browser', () => {
    expect(localeRedirect('/', '/', { cookie: 'a=1; locale=en', acceptLanguage: 'pt-BR' })).toBe(
      undefined,
    );
    expect(localeRedirect('/mcp', '/', { cookie: 'locale=pt-BR', acceptLanguage: 'en' })).toBe(
      '/pt-BR/mcp',
    );
  });

  it('ignores cookies that are not a language', () => {
    expect(localeFromCookie('locale=fr')).toBe(undefined);
    expect(localeFromCookie('otherlocale=pt-BR')).toBe(undefined);
    expect(localeRedirect('/', '/', { cookie: 'locale=xx', acceptLanguage: 'pt-BR' })).toBe(
      '/pt-BR/',
    );
  });
});

describe('pageHead', () => {
  it('builds the tags of a page in a locale', () => {
    const head = pageHead('mcp', 'pt-BR', SITE);
    expect(head).toContain('<title>Servidor MCP · Skill Icons</title>');
    expect(head).toContain('<link rel="canonical" href="https://example.com/pt-BR/mcp" />');
    expect(head).toContain('<meta property="og:url" content="https://example.com/pt-BR/mcp" />');
    expect(head).toContain('<meta property="og:locale" content="pt_BR" />');
    expect(head).toContain('<meta property="og:locale:alternate" content="en_US" />');
    expect(head).toContain(
      '<meta name="twitter:image" content="https://example.com/og-site.png" />',
    );
  });

  it('links every language version, and the default for the rest', () => {
    const head = pageHead('home', 'en', SITE);
    expect(head).toContain('<link rel="alternate" hreflang="en" href="https://example.com/" />');
    expect(head).toContain(
      '<link rel="alternate" hreflang="pt-BR" href="https://example.com/pt-BR/" />',
    );
    expect(head).toContain(
      '<link rel="alternate" hreflang="x-default" href="https://example.com/" />',
    );
  });

  it('describes the page as structured data', () => {
    const head = pageHead('home', 'pt-BR', SITE);
    const json = head.match(/<script type="application\/ld\+json">(.*?)<\/script>/)?.[1];
    const data = JSON.parse(json ?? '');
    const types = data['@graph'].map((node: { '@type': string }) => node['@type']);
    expect(types).toEqual(['WebSite', 'WebApplication']);
    expect(data['@graph'][1]).toMatchObject({
      url: 'https://example.com/pt-BR/',
      inLanguage: 'pt-BR',
    });
  });
});

describe('site pages', () => {
  const template = `<!doctype html><html lang="en"><head>${HEAD_SLOT}</head><body><div id="root">${CONTENT_SLOT}</div></body></html>`;
  const urls = { siteUrl: SITE, base: '/skill-icons/' };

  it('writes one file per page and language', () => {
    const files = SITE_PAGES.map(({ page, locale }) => pageFile(pagePath(page, locale)));
    expect(files.sort()).toEqual(['index.html', 'mcp.html', 'pt-BR/index.html', 'pt-BR/mcp.html']);
  });

  it('fills in the language, head and content', () => {
    const html = renderPage(template, 'home', 'pt-BR', urls);
    expect(html).toContain('<html lang="pt-BR">');
    expect(html).toContain('<link rel="canonical" href="https://example.com/pt-BR/" />');
    expect(html).not.toContain(HEAD_SLOT);
    expect(html).not.toContain(CONTENT_SLOT);
    expect(html.match(/<h1>/g)).toHaveLength(1);
  });

  it('lists the icons on the builder page, by brand name', () => {
    const html = renderPage(template, 'home', 'en', urls);
    expect(html).toContain('<li>TypeScript</li>');
    expect(html).toContain('<li>PostgreSQL</li>');
    expect(html).toContain('<h3>Databases · ');
  });

  it('links pages within the deploy and to the other language', () => {
    const html = renderPage(template, 'mcp', 'en', urls);
    expect(html).toContain('href="/skill-icons/"');
    expect(html).toContain('href="/skill-icons/pt-BR/mcp" hreflang="pt-BR"');
  });

  it('shows the MCP install steps with code, escaped', () => {
    const html = renderPage(template, 'mcp', 'en', urls);
    expect(html).toContain('<code>.cursor/mcp.json</code>');
    expect(html).toContain('claude mcp add --transport http skill-icons');
    expect(html).toContain('&quot;mcpServers&quot;');
  });

  it('keeps the 404 page out of the index', () => {
    const html = notFoundPage(urls);
    expect(html).toContain('<meta name="robots" content="noindex" />');
    expect(html).toContain('href="/skill-icons/pt-BR/"');
    expect(html).not.toContain('<script');
  });

  it('lists every page in the sitemap, with its alternates', () => {
    const xml = sitemap(SITE);
    expect(xml.match(/<loc>/g)).toHaveLength(SITE_PAGES.length);
    expect(xml).toContain('<loc>https://example.com/pt-BR/mcp</loc>');
    expect(xml).toContain(
      '<xhtml:link rel="alternate" hreflang="pt-BR" href="https://example.com/pt-BR/"/>',
    );
  });

  it('points robots.txt at the sitemap', () => {
    expect(robots(SITE)).toContain('Sitemap: https://example.com/sitemap.xml');
  });
});
