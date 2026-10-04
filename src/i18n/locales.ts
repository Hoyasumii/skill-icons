// Kept free of DOM and React so the worker test suite can import it.

export const LOCALES = ['en', 'pt-BR'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

/** Native names, shown in the language picker. */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  'pt-BR': 'Português (Brasil)',
};

const languageOf = (tag: string) => tag.split('-')[0].toLowerCase();

function canonicalize(tag: string): string | undefined {
  try {
    return Intl.getCanonicalLocales(tag)[0];
  } catch {
    return undefined;
  }
}

export function isLocale(value: unknown): value is Locale {
  return LOCALES.includes(value as Locale);
}

/**
 * Picks the best supported locale for the user's preferred languages, in order.
 * Each preference first tries an exact language + region match (pt-BR → pt-BR),
 * then any supported region of the same language (pt-PT → pt-BR), before moving
 * on to the next preference.
 */
export function detectLocale(preferred: readonly string[]): Locale {
  for (const raw of preferred) {
    const tag = canonicalize(raw);
    if (!tag) continue;

    const exact = LOCALES.find(locale => locale.toLowerCase() === tag.toLowerCase());
    if (exact) return exact;

    const sameLanguage = LOCALES.find(locale => languageOf(locale) === languageOf(tag));
    if (sameLanguage) return sameLanguage;
  }
  return DEFAULT_LOCALE;
}
