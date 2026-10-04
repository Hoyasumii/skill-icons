import { SlidingIndicator } from '@/components/ui/sliding-indicator';
import { useI18n } from '@/i18n';
import { CATEGORIES, ICONS } from '@/lib/icons';
import { cn } from '@/lib/utils';
import type { IconCategory } from '../../shared/icon-categories';

const COUNTS = new Map<IconCategory, number>();
for (const icon of ICONS) COUNTS.set(icon.category, (COUNTS.get(icon.category) ?? 0) + 1);

const OPTIONS = [null, ...CATEGORIES.filter(category => COUNTS.has(category))];

interface CategoryNavProps {
  value: IconCategory | null;
  onChange: (category: IconCategory | null) => void;
}

function useLabels() {
  const { t } = useI18n();
  return (category: IconCategory | null) => ({
    label: category ? t.categories[category] : t.picker.all,
    count: category ? COUNTS.get(category) : ICONS.length,
  });
}

/** Compact: a horizontal rail of chips that bleeds to the screen edges. */
export function CategoryRail({ value, onChange }: CategoryNavProps) {
  const { t } = useI18n();
  const describe = useLabels();

  return (
    <div
      role="group"
      aria-label={t.picker.filterLabel}
      className="relative isolate -mx-4 flex gap-2 overflow-x-auto px-4 py-0.5 scrollbar-none lg:hidden"
    >
      {/* Over the chips' own fill, under their text (z-2). */}
      <SlidingIndicator className="z-1 rounded-full bg-foreground" />
      {OPTIONS.map(category => {
        const active = value === category;
        const { label, count } = describe(category);
        return (
          <button
            key={category ?? 'all'}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(category)}
            className={cn(
              'relative inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border-2 px-3.5 text-[15px] whitespace-nowrap transition-colors after:absolute after:-inset-y-[4px] after:inset-x-0 after:content-[""]',
              active
                ? 'border-foreground bg-card text-background'
                : 'border-border bg-card hover:border-foreground/40',
            )}
          >
            <span className="relative z-2 inline-flex items-center gap-1.5">
              {label}
              <span className="font-mono text-xs opacity-70">{count}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** Wide: the left column, scrolling on its own. */
export function CategorySidebar({ value, onChange }: CategoryNavProps) {
  const { t } = useI18n();
  const describe = useLabels();

  return (
    <nav
      aria-labelledby="categories-label"
      className="relative isolate hidden min-h-0 flex-col gap-1 overflow-y-auto border-r py-6 pr-4 pl-6 lg:flex"
    >
      <SlidingIndicator className="rounded-sm bg-highlight" />
      <span
        id="categories-label"
        className="px-2.5 pb-2 font-mono text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase"
      >
        {t.picker.categoriesLabel}
      </span>
      {OPTIONS.map(category => {
        const active = value === category;
        const { label, count } = describe(category);
        return (
          <button
            key={category ?? 'all'}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(category)}
            className={cn(
              'relative flex h-9 shrink-0 items-center justify-between gap-2 rounded-sm px-2.5 text-left text-[15px] transition-colors',
              active ? 'font-semibold text-highlight-foreground' : 'hover:bg-muted',
            )}
          >
            <span className="truncate">{label}</span>
            <span className="font-mono text-xs opacity-60">{count}</span>
          </button>
        );
      })}
    </nav>
  );
}
