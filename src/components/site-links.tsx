import { PackageIcon } from 'lucide-react';
import { GithubMarkIcon, McpMarkIcon } from '@/components/brand-icons';
import { useI18n } from '@/i18n';
import { NPM_URL, PACKAGE_NAME, pageHref, REPO_URL } from '@/lib/links';
import { cn } from '@/lib/utils';

export type SitePage = 'builder' | 'mcp';

interface SiteLinksProps {
  /** The page being shown; its link is marked as the current one. */
  page: SitePage;
  /** Muted in the header, ink in the footer. */
  tone?: 'muted' | 'ink';
  className?: string;
}

/** github · npm library · mcp, shared by the header (wide) and the footer. */
export function SiteLinks({ page, tone = 'muted', className }: SiteLinksProps) {
  const { locale, t } = useI18n();
  const links = [
    { href: REPO_URL, label: t.header.github, Icon: GithubMarkIcon },
    { href: NPM_URL, label: t.header.npm, title: PACKAGE_NAME, Icon: PackageIcon },
    { href: pageHref('mcp', locale), label: t.header.mcp, current: page === 'mcp', Icon: McpMarkIcon },
  ];

  return (
    <nav aria-label={t.header.links} className={cn('flex flex-wrap items-center', className)}>
      {links.map(link => (
        <a
          key={link.href}
          href={link.href}
          title={link.title}
          aria-current={link.current ? 'page' : undefined}
          className={cn(
            'inline-flex h-11 items-center gap-1.5 px-2.5 font-mono text-[13px] underline-offset-4 hover:text-foreground hover:underline',
            tone === 'muted' ? 'text-muted-foreground' : 'text-foreground',
            link.current &&
              'font-semibold text-foreground underline decoration-highlight decoration-2 hover:decoration-foreground',
          )}
        >
          <link.Icon aria-hidden="true" className="size-3.5 shrink-0" />
          {link.label}
        </a>
      ))}
    </nav>
  );
}
