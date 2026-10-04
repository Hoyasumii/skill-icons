import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { detectLocale, isLocale, type Locale } from './locales';
import { en, type Messages } from './messages/en';
import { ptBR } from './messages/pt-BR';

export { LOCALE_CODES, LOCALE_NAMES, LOCALES, type Locale } from './locales';

const MESSAGES: Record<Locale, Messages> = { en, 'pt-BR': ptBR };

const STORAGE_KEY = 'locale';

/** An explicit choice from the picker wins over the browser's language and region. */
function initialLocale(): Locale {
  try {
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

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState(initialLocale);
  const t = MESSAGES[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = t.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description);
  }, [locale, t]);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
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
