// Loaded by the build (vite.config.ts) to write each page's app into its HTML file, so the page
// shows before the script has loaded; main.tsx then hydrates it.

import { renderToString } from 'react-dom/server';
import type { Locale } from '@/i18n';
import type { Page } from '../shared/page-meta';
import { Root } from './root';

export function prerender(page: Page, locale: Locale): string {
  return renderToString(<Root page={page} locale={locale} />);
}
