import { useRef } from 'react';
import { flushSync } from 'react-dom';
import {
  Columns3Icon,
  MinusIcon,
  MoonIcon,
  PaletteIcon,
  PlusIcon,
  SunIcon,
  type LucideIcon,
} from 'lucide-react';
import { SectionLabel } from '@/components/section-label';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useI18n } from '@/i18n';
import { circleReveal, imagesOnScreen } from '@/lib/circle-reveal';
import { cn } from '@/lib/utils';
import { MAX_PER_LINE, MIN_PER_LINE, type Theme } from '../../shared/icons';

// The active segment's tile takes the color the icons' own tiles get in that theme.
const THEMES: { value: Theme; Icon: LucideIcon; tile: string }[] = [
  { value: 'dark', Icon: MoonIcon, tile: 'bg-swatch-dark text-[#f1f1ec]' },
  { value: 'light', Icon: SunIcon, tile: 'bg-swatch-light text-highlight-foreground' },
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
    // Labels on the first row, controls side by side on the second; each wrapper is `contents`
    // so its label and control land in the same column.
    <div className="grid grid-flow-col grid-cols-[minmax(0,1fr)_auto] grid-rows-[auto_auto] items-end gap-x-4 gap-y-2">
      <div className="contents">
        <SectionLabel id="theme-label" icon={PaletteIcon}>
          {t.options.iconTheme}
        </SectionLabel>
        <ToggleGroup
          type="single"
          ref={themeGroup}
          value={theme}
          onValueChange={value => value && changeTheme(value as Theme)}
          aria-labelledby="theme-label"
        >
          {THEMES.map(({ value, Icon, tile }) => (
            <ToggleGroupItem
              key={value}
              value={value}
              data-value={value}
              className="gap-[7px] pr-2 pl-1.5"
            >
              <span
                aria-hidden="true"
                className={cn(
                  'inline-flex size-6 shrink-0 items-center justify-center rounded-[7px] transition-colors',
                  theme === value && tile,
                )}
              >
                <Icon className="size-[15px]" strokeWidth={2.2} />
              </span>
              {t.options[value]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="contents">
        {/* Zero width of its own: it wraps inside the column the stepper sets. */}
        <SectionLabel
          id="perline-label"
          icon={Columns3Icon}
          className="w-0 min-w-full leading-[15px] [&>svg]:h-[15px]"
        >
          {t.options.perLine}
        </SectionLabel>
        <div
          role="group"
          aria-labelledby="perline-label"
          className="flex min-w-[132px] items-center justify-between gap-2 rounded-lg bg-muted p-[3px]"
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
