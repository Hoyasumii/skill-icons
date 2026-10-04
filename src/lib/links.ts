import type { Locale } from '@/i18n/locales';
import { pagePath, type Page } from '../../shared/page-meta';

export {
  AUTHOR_NAME,
  AUTHOR_URL,
  MCP_URL,
  NPM_URL,
  PACKAGE_NAME,
  REPO_URL,
  UPSTREAM_REPO,
  UPSTREAM_URL,
} from '../../shared/links';

/** Link to `page` in `locale` on this deploy (GitHub Pages serves the site under a subpath). */
export function pageHref(page: Page, locale: Locale): string {
  return import.meta.env.BASE_URL + pagePath(page, locale);
}
