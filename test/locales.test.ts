import { describe, expect, it } from 'vitest';
import { DEFAULT_LOCALE, detectLocale } from '../src/i18n/locales';

describe('detectLocale', () => {
  it('matches language and region exactly', () => {
    expect(detectLocale(['pt-BR'])).toBe('pt-BR');
    expect(detectLocale(['en-US'])).toBe('en');
  });

  it('ignores the case of the tag', () => {
    expect(detectLocale(['pt-br'])).toBe('pt-BR');
  });

  it('falls back to another region of the same language', () => {
    expect(detectLocale(['pt-PT'])).toBe('pt-BR');
    expect(detectLocale(['pt'])).toBe('pt-BR');
    expect(detectLocale(['en-GB'])).toBe('en');
  });

  it('follows the order of preferences', () => {
    expect(detectLocale(['fr-FR', 'pt-BR', 'en-US'])).toBe('pt-BR');
    expect(detectLocale(['en-US', 'pt-BR'])).toBe('en');
  });

  it('uses the default for unsupported or invalid tags', () => {
    expect(detectLocale(['de-DE', 'ja'])).toBe(DEFAULT_LOCALE);
    expect(detectLocale(['not a locale!'])).toBe(DEFAULT_LOCALE);
    expect(detectLocale([])).toBe(DEFAULT_LOCALE);
  });
});
