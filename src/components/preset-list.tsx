import { LayersIcon } from 'lucide-react';
import { SectionLabel } from '@/components/section-label';
import { useI18n } from '@/i18n';
import { iconSrc } from '@/lib/icons';
import { PRESETS } from '@/lib/presets';
import { isStackSelected } from '@/lib/stack-selection';
import { cn } from '@/lib/utils';
import type { Theme } from '../../shared/icons';

interface PresetListProps {
  selected: string[];
  theme: Theme;
  onToggle: (names: readonly string[]) => void;
}

/** A rail that bleeds to the screen edges on compact, four columns on wide. */
export function PresetList({ selected, theme, onToggle }: PresetListProps) {
  const { t } = useI18n();

  return (
    <section aria-labelledby="presets-title" className="flex flex-col gap-2.5">
      <SectionLabel id="presets-title" icon={LayersIcon}>
        {t.presets.label}
      </SectionLabel>
      <div className="-mx-4 flex gap-2.5 overflow-x-auto px-4 pb-0.5 scrollbar-none lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
        {PRESETS.map(preset => {
          const missing = preset.icons.filter(name => !selected.includes(name));
          const complete = isStackSelected(preset.icons, selected);
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onToggle(preset.icons)}
              aria-pressed={complete}
              className={cn(
                'flex min-w-0 shrink-0 flex-col gap-2.5 rounded-lg border-2 p-3 text-left transition-colors',
                complete
                  ? 'border-foreground bg-highlight text-highlight-foreground'
                  : 'border-border bg-card hover:border-foreground/40',
              )}
            >
              <span className="flex gap-1">
                {preset.icons.map(name => (
                  <img key={name} src={iconSrc(name, theme)} alt="" className="size-7" />
                ))}
              </span>
              <span className="flex items-baseline justify-between gap-2">
                <span className="text-base font-semibold whitespace-nowrap">
                  {t.presets.names[preset.id]}
                </span>
                <span className="font-mono text-[11px] whitespace-nowrap opacity-75">
                  {complete ? t.presets.complete : t.presets.missing(missing.length)}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
