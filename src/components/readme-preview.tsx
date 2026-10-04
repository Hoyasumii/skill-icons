import { PencilIcon } from 'lucide-react';
import { useId } from 'react';
import { SectionLabel } from '@/components/section-label';
import { useI18n } from '@/i18n';
import { cleanTitle, MAX_TITLE_LENGTH } from '../../shared/badge-title';
import { API_URL, buildIconsUrl, type IconsUrlOptions } from '../../shared/icons';

interface ReadmePreviewProps {
  options: IconsUrlOptions;
  label: string;
  fileName: string;
  /** The badge title as typed; undefined until edited, so it follows the language. */
  title: string | undefined;
  /** Undefined goes back to the default title, which follows the language. */
  onTitleChange: (title: string | undefined) => void;
}

/** The real badge on a page that follows the site theme; the icon theme only changes the badge. */
export function ReadmePreview({
  options,
  label,
  fileName,
  title,
  onTitleChange,
}: ReadmePreviewProps) {
  const { t } = useI18n();
  const inputId = useId();
  // Dev previews hit the local Worker; the built site (Pages is static) uses the public API.
  const src = buildIconsUrl(import.meta.env.DEV ? '' : API_URL, options);

  return (
    <div className="flex flex-col gap-2">
      <SectionLabel>{label}</SectionLabel>
      <div className="overflow-hidden rounded-lg border bg-background text-foreground">
        <div className="border-b px-3 py-2 font-mono text-xs opacity-75">{fileName}</div>
        <div className="flex flex-col gap-3 px-3.5 pt-2 pb-5">
          <div className="flex min-h-11 items-center gap-2 border-b-2 border-dashed border-border">
            <label htmlFor={inputId} className="sr-only">
              {t.preview.titleLabel}
            </label>
            <input
              id={inputId}
              value={title ?? t.preview.heading}
              onChange={e => onTitleChange(e.target.value)}
              // Left empty, it goes back to the default instead of staying blank.
              onBlur={() => !cleanTitle(title) && onTitleChange(undefined)}
              maxLength={MAX_TITLE_LENGTH}
              placeholder={t.preview.heading}
              autoComplete="off"
              className="h-11 min-w-0 flex-1 bg-transparent text-lg font-bold tracking-[-0.01em] placeholder:text-muted-foreground"
            />
            <PencilIcon aria-hidden="true" className="size-4 shrink-0 opacity-60" />
          </div>
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
