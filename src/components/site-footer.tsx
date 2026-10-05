import { SiteLinks, type SitePage } from '@/components/site-links';
import { Wordmark } from '@/components/wordmark';
import { useI18n } from '@/i18n';
import { AUTHOR_NAME, AUTHOR_URL, PACKAGE_NAME, UPSTREAM_REPO, UPSTREAM_URL } from '@/lib/links';
import { version as PACKAGE_VERSION } from '../../packages/skill-icons/package.json';

interface SiteFooterProps {
  page: SitePage;
  /** Full on content pages; compact closes the builder's scroller below 1024px (the header has the links on wide). */
  variant: 'full' | 'compact';
}

export function SiteFooter({ page, variant }: SiteFooterProps) {
  const { t } = useI18n();
  const credit = (
    <span>
      {t.footer.madeBy}{' '}
      <a
        href={AUTHOR_URL}
        className="text-muted-foreground underline underline-offset-3 hover:text-foreground"
      >
        {AUTHOR_NAME}
      </a>{' '}
      · {t.footer.credit}{' '}
      <a
        href={UPSTREAM_URL}
        className="text-muted-foreground underline underline-offset-3 hover:text-foreground"
      >
        {UPSTREAM_REPO}
      </a>
    </span>
  );

  if (variant === 'compact') {
    return (
      <footer className="mt-auto flex flex-col gap-1 border-t pt-4 font-mono text-xs leading-[18px] text-muted-foreground lg:hidden">
        <SiteLinks page={page} tone="ink" className="-mx-2.5" />
        {credit}
      </footer>
    );
  }

  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-[1152px] flex-wrap items-start justify-between gap-x-12 gap-y-6 px-4 pt-8 pb-10">
        <div className="flex min-w-0 flex-col gap-2.5">
          <Wordmark className="self-start" />
          <span className="font-mono text-xs text-muted-foreground">{t.header.tagline}</span>
        </div>
        <SiteLinks page={page} tone="ink" className="-mx-2.5 -mt-3" />
        <div className="flex basis-full flex-wrap justify-between gap-x-6 gap-y-2 border-t pt-4 font-mono text-xs leading-[18px] text-muted-foreground">
          {credit}
          {page === 'mcp' && (
            <span>
              {PACKAGE_NAME} {PACKAGE_VERSION}
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}
