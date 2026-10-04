import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { useHydrated } from '@/hooks/use-hydrated';
import { I18nProvider, type Locale } from '@/i18n';
import type { Page } from '../shared/page-meta';
import { App } from './App';

/** The whole app for one page in one language: what the build prerenders and the browser hydrates. */
export function Root({ page, locale }: { page: Page; locale: Locale }) {
  // The toaster follows the stored theme, which the prerender can't know.
  const hydrated = useHydrated();
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <I18nProvider locale={locale}>
        <App page={page} />
        {hydrated && <Toaster />}
      </I18nProvider>
    </ThemeProvider>
  );
}
