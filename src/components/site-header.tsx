import { LanguageMenu } from '@/components/language-menu';
import { ThemeToggle } from '@/components/theme-toggle';
import { Wordmark } from '@/components/wordmark';
import { useI18n } from '@/i18n';
import { REPO_URL } from '@/lib/links';

export function SiteHeader() {
  const { t } = useI18n();

  return (
    <header className="relative z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b px-4 lg:px-6">
      <div className="flex min-w-0 items-baseline gap-4">
        <Wordmark />
        <span className="hidden font-mono text-xs whitespace-nowrap text-muted-foreground lg:inline">
          {t.header.tagline}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <a
          href={REPO_URL}
          className="hidden h-11 items-center px-2.5 font-mono text-[13px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline lg:inline-flex"
        >
          {t.header.github}
        </a>
        <LanguageMenu />
        <ThemeToggle />
      </div>
    </header>
  );
}
