import { LanguageMenu } from '@/components/language-menu';
import { SiteLinks, type SitePage } from '@/components/site-links';
import { ThemeToggle } from '@/components/theme-toggle';
import { Wordmark } from '@/components/wordmark';
import { useI18n } from '@/i18n';
import { cn } from '@/lib/utils';

interface SiteHeaderProps {
  /** The page being shown; its link is marked as current. */
  page?: SitePage;
  className?: string;
}

export function SiteHeader({ page = 'builder', className }: SiteHeaderProps) {
  const { t } = useI18n();
  // The builder has no heading of its own; on the other pages the h1 is the page title.
  const Brand = page === 'builder' ? 'h1' : 'div';

  return (
    <header
      className={cn(
        'relative z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b bg-background px-4 lg:px-6',
        className,
      )}
    >
      <div className="flex min-w-0 items-baseline gap-4">
        <Brand className="flex">
          <Wordmark />
        </Brand>
        <span className="hidden font-mono text-xs whitespace-nowrap text-muted-foreground lg:inline">
          {t.header.tagline}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <SiteLinks page={page} className="hidden lg:flex" />
        <LanguageMenu />
        <ThemeToggle />
      </div>
    </header>
  );
}
