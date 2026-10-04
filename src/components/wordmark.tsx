import { useI18n } from '@/i18n';
import { cn } from '@/lib/utils';

/** "skill ◆ icons", drawn in text so it follows the site theme like the SVGs in /public. Always links to the builder. */
export function Wordmark({ className }: { className?: string }) {
  const { t } = useI18n();

  return (
    <a
      href={import.meta.env.BASE_URL}
      aria-label={t.header.title}
      className={cn(
        'inline-flex items-center gap-[3px] text-[22px] leading-none font-bold tracking-[-0.03em] text-foreground no-underline',
        className,
      )}
    >
      skill
      <span
        aria-hidden="true"
        className="mx-0.5 inline-block size-[9px] rotate-12 border-2 border-foreground bg-highlight"
      />
      icons
    </a>
  );
}
