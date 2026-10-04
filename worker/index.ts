import iconsJson from '../generated/icons.json';
import {
  DEFAULT_PER_LINE,
  DEFAULT_THEME,
  MAX_PER_LINE,
  MIN_PER_LINE,
  shortNames,
  type Theme,
} from '../shared/icons';
import { cleanTitle } from '../shared/badge-title';
import { localeRedirect } from '../shared/page-meta';
import { handleMcp } from './mcp';
import { isPreviewBot, ogPage, renderOgPng } from './og';

const icons: Record<string, string> = iconsJson;
const iconNameList = [...new Set(Object.keys(icons).map(i => i.split('-')[0]))];
const themedIcons = new Set(
  Object.keys(icons)
    .filter(i => i.endsWith('-light') || i.endsWith('-dark'))
    .map(i => i.split('-')[0]),
);

const ONE_ICON = 48;
const SCALE = ONE_ICON / (300 - 44);

const CACHE_HEADERS = { 'Cache-Control': 'public, max-age=86400' };
/** Images and data, not pages: crawlers may fetch them (link previews need to) but not list them in search. */
const NOINDEX = { 'X-Robots-Tag': 'noindex' };

function generateSvg(iconNames: string[], perLine: number): string {
  const iconSvgList = iconNames.map(i => icons[i]);

  const length = Math.min(perLine * 300, iconNames.length * 300) - 44;
  const height = Math.ceil(iconSvgList.length / perLine) * 300 - 44;
  const scaledHeight = height * SCALE;
  const scaledWidth = length * SCALE;

  return `
  <svg width="${scaledWidth}" height="${scaledHeight}" viewBox="0 0 ${length} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
    ${iconSvgList
      .map(
        (i, index) =>
          `
        <g transform="translate(${(index % perLine) * 300}, ${Math.floor(index / perLine) * 300})">
          ${i}
        </g>
        `,
      )
      .join(' ')}
  </svg>
  `;
}

/** Resolves short names and themes to icon keys, dropping unknown names. */
function parseShortNames(names: string[], theme: Theme): string[] {
  return names.flatMap(rawName => {
    const lower = rawName.trim().toLowerCase();
    const name = iconNameList.includes(lower) ? lower : shortNames[lower];
    if (!name) return [];
    return [name + (themedIcons.has(name) ? `-${theme}` : '')];
  });
}

function badRequest(message: string): Response {
  return new Response(message, { status: 400 });
}

function json(data: unknown): Response {
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json;charset=UTF-8', ...CACHE_HEADERS, ...NOINDEX },
  });
}

interface IconsRequest {
  iconNames: string[];
  theme: Theme;
  perLine: number;
}

/** Validates the /icons query; returns a 400 response when it is invalid. */
function parseIconsRequest(searchParams: URLSearchParams): IconsRequest | Response {
  const iconParam = searchParams.get('i') || searchParams.get('icons');
  if (!iconParam) return badRequest("You didn't specify any icons!");

  const themeParam = searchParams.get('t') || searchParams.get('theme') || DEFAULT_THEME;
  if (themeParam !== 'dark' && themeParam !== 'light')
    return badRequest('Theme must be either "light" or "dark"');
  const theme: Theme = themeParam;

  const perLineParam = searchParams.get('perline');
  const perLine = perLineParam ? Number(perLineParam) : DEFAULT_PER_LINE;
  if (!Number.isInteger(perLine) || perLine < MIN_PER_LINE || perLine > MAX_PER_LINE)
    return badRequest(
      `Icons per line must be a number between ${MIN_PER_LINE} and ${MAX_PER_LINE}`,
    );

  const iconShortNames = iconParam === 'all' ? iconNameList : iconParam.split(',');
  const iconNames = parseShortNames(iconShortNames, theme);
  if (iconNames.length === 0) return badRequest("You didn't format the icons param correctly!");

  return { iconNames, theme, perLine };
}

/** A person opening the link in a tab, as opposed to an <img>, GitHub camo or a crawler. */
function isBrowserNavigation(request: Request): boolean {
  const dest = request.headers.get('Sec-Fetch-Dest');
  if (dest) return dest === 'document';
  // Browsers without Fetch Metadata still ask for HTML first when navigating.
  return request.headers.get('Accept')?.includes('text/html') ?? false;
}

function handleIcons(request: Request, url: URL): Response {
  // People opening the link get the site's home page instead of a bare SVG.
  if (isBrowserNavigation(request) && !isPreviewBot(request))
    return new Response(null, {
      status: 302,
      headers: { Location: new URL('/', url).href, 'Cache-Control': 'no-store' },
    });

  const parsed = parseIconsRequest(url.searchParams);
  if (parsed instanceof Response) return parsed;

  // Link previews get a page with OpenGraph tags; README embeds keep getting the SVG.
  if (isPreviewBot(request))
    return ogPage(url, parsed.iconNames, cleanTitle(url.searchParams.get('title')));

  return new Response(generateSvg(parsed.iconNames, parsed.perLine), {
    // A cached SVG must not answer a later navigation to the same URL.
    headers: {
      'Content-Type': 'image/svg+xml',
      Vary: 'Sec-Fetch-Dest, Accept',
      ...CACHE_HEADERS,
      ...NOINDEX,
    },
  });
}

async function handleOg(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const parsed = parseIconsRequest(url.searchParams);
  if (parsed instanceof Response) return parsed;

  // Rasterizing is the expensive part, so each URL is rendered once per colo.
  const cache = caches.default;
  const cached = await cache.match(request.url);
  if (cached) return cached;

  // The card always shows the dark icons, whatever the link's theme; its footer shows the /icons link.
  const iconSvgs = parsed.iconNames.map(i => icons[i.replace(/-light$/, '-dark')]);
  // `title` comes from the builder (its page link or a copied /icons link); the footer leaves it out.
  const title = cleanTitle(url.searchParams.get('title'));
  const linkParams = new URLSearchParams(url.search);
  linkParams.delete('title');
  const link = new URL('/icons', url);
  link.search = linkParams.toString().replaceAll('%2C', ',');
  const png = await renderOgPng(iconSvgs, link, title);
  const res = new Response(png, {
    headers: { 'Content-Type': 'image/png', ...CACHE_HEADERS, ...NOINDEX },
  });
  await cache.put(request.url, res.clone());
  return res;
}

/**
 * A page without a language prefix ("/", "/mcp"): visitors whose language isn't the default one
 * go to theirs; everyone else gets the page (the build writes "/mcp" as mcp.html).
 */
async function handlePage(request: Request, env: Env, url: URL, path: string): Promise<Response> {
  // The answer depends on the visitor's language, so no shared cache may keep one for everybody.
  const vary = { Vary: 'Accept-Language, Cookie' };
  const target = localeRedirect(url.pathname, '/', {
    cookie: request.headers.get('Cookie'),
    acceptLanguage: request.headers.get('Accept-Language'),
  });
  if (target)
    return new Response(null, {
      status: 302,
      headers: {
        Location: new URL(target + url.search, url).href,
        'Cache-Control': 'private, no-store',
        ...vary,
      },
    });

  const res = await env.ASSETS.fetch(new Request(new URL(`/${path}`, url), request));
  const page = new Response(res.body, res);
  page.headers.append('Vary', vary.Vary);
  return page;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/|\/$/g, '');

    try {
      if (path === 'icons') return handleIcons(request, url);
      if (path === 'og') return await handleOg(request);
      if (path === 'mcp') {
        // A browser opening the server URL gets the page that explains how to install it.
        const wantsPage =
          request.method === 'GET' && request.headers.get('Accept')?.includes('text/html');
        if (wantsPage) return await handlePage(request, env, url, path);
        return handleMcp(request);
      }
      if (path === '') return await handlePage(request, env, url, path);
      if (path === 'api/icons') return json(iconNameList);
      if (path === 'api/svgs') return json(icons);
      if (path.startsWith('api/')) return new Response('Not found', { status: 404 });
      return env.ASSETS.fetch(request);
    } catch (err) {
      return new Response(err instanceof Error ? err.stack : String(err), { status: 500 });
    }
  },
} satisfies ExportedHandler<Env>;
