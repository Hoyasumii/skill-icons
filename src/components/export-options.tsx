import { useRef } from 'react';
import { flushSync } from 'react-dom';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { SectionLabel } from '@/components/section-label';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useI18n } from '@/i18n';
import { circleReveal, imagesOnScreen } from '@/lib/circle-reveal';
import { cn } from '@/lib/utils';
import { MAX_PER_LINE, MIN_PER_LINE, type Theme } from '../../shared/icons';

const THEMES: { value: Theme; swatch: string }[] = [
  { value: 'dark', swatch: 'bg-swatch-dark' },
  { value: 'light', swatch: 'bg-swatch-light' },
];

interface ExportOptionsProps {
  theme: Theme;
  perLine: number;
  onThemeChange: (theme: Theme) => void;
  onPerLineChange: (perLine: number) => void;
}

export function ExportOptions({
  theme,
  perLine,
  onThemeChange,
  onPerLineChange,
}: ExportOptionsProps) {
  const { t } = useI18n();
  const step = (offset: number) =>
    onPerLineChange(Math.min(MAX_PER_LINE, Math.max(MIN_PER_LINE, perLine + offset)));
  const stepButton = 'rounded-[9px] bg-card text-foreground hover:bg-card/70';
  const themeGroup = useRef<HTMLDivElement>(null);

  // Like the site theme switch: the icons in the new theme grow as a circle from the segment.
  const changeTheme = (next: Theme) => {
    const segment = themeGroup.current?.querySelector(`[data-value="${next}"]`);
    const apply = async () => {
      flushSync(() => onThemeChange(next));
      await imagesOnScreen();
    };
    if (segment) circleReveal(segment, apply);
    else void apply();
  };

  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex flex-[1_1_140px] flex-col gap-2">
        <SectionLabel id="theme-label">{t.options.iconTheme}</SectionLabel>
        <ToggleGroup
          type="single"
          ref={themeGroup}
          value={theme}
          onValueChange={value => value && changeTheme(value as Theme)}
          aria-labelledby="theme-label"
        >
          {THEMES.map(({ value, swatch }) => (
            <ToggleGroupItem key={value} value={value} data-value={value}>
              <span
                aria-hidden="true"
                className={cn('size-3 shrink-0 rounded-[3px] border', swatch)}
              />
              {t.options[value]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="flex flex-[1_1_140px] flex-col gap-2">
        <SectionLabel id="perline-label">{t.options.perLine}</SectionLabel>
        <div
          role="group"
          aria-labelledby="perline-label"
          className="flex items-center justify-between rounded-lg bg-muted p-[3px]"
        >
          <Button
            variant="ghost"
            size="control"
            className={stepButton}
            aria-label={t.options.fewer}
            disabled={perLine <= MIN_PER_LINE}
            onClick={() => step(-1)}
          >
            <MinusIcon strokeWidth={2.4} />
          </Button>
          <output aria-live="polite" className="font-mono text-lg font-semibold tabular-nums">
            {perLine}
          </output>
          <Button
            variant="ghost"
            size="control"
            className={stepButton}
            aria-label={t.options.more}
            disabled={perLine >= MAX_PER_LINE}
            onClick={() => step(1)}
          >
            <PlusIcon strokeWidth={2.4} />
          </Button>
        </div>
      </div>
    </div>
  );
}
