import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { detectLocale, isLocale, type Locale } from './locales';
import { en, type Messages } from './messages/en';
import { ptBR } from './messages/pt-BR';
import { LOCALE_COOKIE, localeFromCookie, pagePath, parseSitePath } from '../../shared/page-meta';

export { LOCALE_CODES, LOCALE_NAMES, LOCALES, type Locale } from './locales';

const MESSAGES: Record<Locale, Messages> = { en, 'pt-BR': ptBR };

const STORAGE_KEY = 'locale';

const BASE = import.meta.env.BASE_URL;

/**
 * A language in the URL (/pt-BR/…) wins: it is what a shared link or a search result points to.
 * Without one, an explicit choice from the picker wins over the browser's language and region.
 * The Worker already redirects "/" the same way; this covers deploys without it (GitHub Pages).
 */
export function initialLocale(): Locale {
  const fromUrl = parseSitePath(window.location.pathname, BASE).locale;
  if (fromUrl) return fromUrl;
  const fromCookie = localeFromCookie(document.cookie);
  if (fromCookie) return fromCookie;
  try {
    // Choices made before the cookie existed.
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    // Storage can be unavailable (private mode, blocked cookies).
  }
  return detectLocale(navigator.languages?.length ? navigator.languages : [navigator.language]);
}

interface I18nContextValue {
  locale: Locale;
  t: Messages;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

/** `locale` is the language to start in; the browser's choice (initialLocale) when left out. */
export function I18nProvider({
  locale: initial,
  children,
}: {
  locale?: Locale;
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState(() => initial ?? initialLocale());
  const t = MESSAGES[locale];

  // Each page sets its own title and description (useDocumentMeta).
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  // Each language has its own URL, so the address follows the language shown.
  useEffect(() => {
    const { pathname, search, hash } = window.location;
    const path = BASE + pagePath(parseSitePath(pathname, BASE).page, locale);
    if (path !== pathname) window.history.replaceState(null, '', path + search + hash);
  }, [locale]);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    // A cookie, not just storage, so the Worker can send "/" straight to this language next time.
    document.cookie = `${LOCALE_COOKIE}=${next}; path=${BASE}; max-age=31536000; samesite=lax`;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Not persisted; the choice still applies for this visit.
    }
  };

  return <I18nContext value={{ locale, t, setLocale }}>{children}</I18nContext>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used inside <I18nProvider>');
  return context;
}
