import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { readStacks } from '@/hooks/use-saved-stacks';
import { initialLocale } from '@/i18n';
import { installSixSeven } from '@/lib/easter-egg';
import { installScrollbarAutoHide } from '@/lib/scrollbars';
import { parseSitePath } from '../shared/page-meta';
import { Root } from './root';
import './index.css';

installSixSeven();
installScrollbarAutoHide();

const container = document.getElementById('root')!;
const { page } = parseSitePath(window.location.pathname, import.meta.env.BASE_URL);
const locale = initialLocale();
const app = (
  <StrictMode>
    <Root page={page} locale={locale} />
  </StrictMode>
);

// The build prerenders each page as an empty builder in its URL's language (see prerender.tsx).
// A link with a stack, saved stacks or another language would render differently, so those
// visits replace the prerendered HTML instead of hydrating it.
const matchesPrerender =
  container.dataset.prerender === `${page} ${locale}` &&
  !window.location.search &&
  readStacks().length === 0;

if (matchesPrerender) hydrateRoot(container, app);
else createRoot(container).render(app);
