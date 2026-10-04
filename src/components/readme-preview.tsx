import { SectionLabel } from '@/components/section-label';
import { useI18n } from '@/i18n';
import { cn } from '@/lib/utils';
import { API_URL, buildIconsUrl, type IconsUrlOptions } from '../../shared/icons';

interface ReadmePreviewProps {
  options: IconsUrlOptions;
  label: string;
  fileName: string;
}

/** The real badge on a page that follows the icon theme, not the site theme. */
export function ReadmePreview({ options, label, fileName }: ReadmePreviewProps) {
  const { t } = useI18n();
  // Dev previews hit the local Worker; the built site (Pages is static) uses the public API.
  const src = buildIconsUrl(import.meta.env.DEV ? '' : API_URL, options);
  const light = options.theme === 'light';

  return (
    <div className="flex flex-col gap-2">
      <SectionLabel>{label}</SectionLabel>
      <div
        className={cn(
          'overflow-hidden rounded-lg border',
          light
            ? 'bg-readme-light text-readme-light-foreground'
            : 'bg-readme-dark text-readme-dark-foreground',
        )}
      >
        <div className="border-b px-3 py-2 font-mono text-xs opacity-75">{fileName}</div>
        <div className="flex flex-col gap-3 px-3.5 pt-4 pb-5">
          <span className="text-lg font-bold tracking-[-0.01em]">{t.preview.heading}</span>
          {options.icons.length > 0 ? (
            <img src={src} alt={t.preview.alt} className="mx-auto h-auto max-w-full" />
          ) : (
            <span className="text-sm opacity-70">{t.preview.empty}</span>
          )}
        </div>
      </div>
    </div>
  );
}
