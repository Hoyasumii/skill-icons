import { pageHead, type Page } from '../shared/page-meta';
import { detectLocale } from '../src/i18n/locales';

/** Tags the build wrote into index.html; each page replaces them with its own. */
const PAGE_META_TAGS =
  'title, meta[name="description"], link[rel="canonical"], meta[property^="og:"], meta[name^="twitter:"]';

/** The client's languages from Accept-Language, most preferred first. */
function acceptedLanguages(request: Request): string[] {
  return (request.headers.get('Accept-Language') ?? '')
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
 * Rewrites the SPA shell's head with `page`'s tags in the language the client asks for:
 * link-preview crawlers read the HTML without running the app.
 */
export function withPageMeta(shell: Response, request: Request, page: Page): Response {
  if (!shell.headers.get('Content-Type')?.includes('text/html')) return shell;

  const locale = detectLocale(acceptedLanguages(request));
  const head = pageHead(page, locale, new URL('/', request.url).href);

  const res = new HTMLRewriter()
    .on('html', { element: html => void html.setAttribute('lang', locale) })
    .on(PAGE_META_TAGS, { element: tag => void tag.remove() })
    .on('head', { element: el => void el.append(head, { html: true }) })
    .transform(shell);
  const headers = new Headers(res.headers);
  headers.append('Vary', 'Accept-Language');
  // The same ETag would otherwise stand for every page and language.
  headers.delete('ETag');
  return new Response(res.body, { status: res.status, headers });
}
