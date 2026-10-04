import { useI18n } from '@/i18n';

/** "skill ◆ icons", drawn in text so it follows the site theme like the SVGs in /public. */
export function Wordmark() {
  const { t } = useI18n();

  return (
    <h1
      aria-label={t.header.title}
      className="inline-flex items-center gap-[3px] text-[22px] leading-none font-bold tracking-[-0.03em]"
    >
      skill
      <span
        aria-hidden="true"
        className="mx-0.5 inline-block size-[9px] rotate-12 border-2 border-foreground bg-highlight"
      />
      icons
    </h1>
  );
}
