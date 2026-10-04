import { useMemo } from 'react';
import { ListFilterIcon } from 'lucide-react';
import { SlidingIndicator } from '@/components/ui/sliding-indicator';
import { useI18n } from '@/i18n';
import { categoryIcon } from '@/lib/category-icons';
import { CATEGORIES, countByCategory, ICONS } from '@/lib/icons';
import type { IconInfo } from '@/lib/icons';
import { cn } from '@/lib/utils';
import type { IconCategory } from '../../shared/icon-categories';

// The list of categories stays put while searching; only the numbers follow the query.
const OPTIONS = [null, ...CATEGORIES.filter(category => countByCategory(ICONS).has(category))];

interface CategoryNavProps {
  value: IconCategory | null;
  /** The icons matching the search, across every category. */
  matches: readonly IconInfo[];
  onChange: (category: IconCategory | null) => void;
}

function useLabels(matches: readonly IconInfo[]) {
  const { t } = useI18n();
  const counts = useMemo(() => countByCategory(matches), [matches]);
  return (category: IconCategory | null) => ({
    label: category ? t.categories[category] : t.picker.all,
    Icon: categoryIcon(category),
    count: category ? (counts.get(category) ?? 0) : matches.length,
  });
}

/** Compact: a horizontal rail of chips that bleeds to the screen edges. */
export function CategoryRail({ value, matches, onChange }: CategoryNavProps) {
  const { t } = useI18n();
  const describe = useLabels(matches);

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
        const { label, Icon, count } = describe(category);
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
              <Icon aria-hidden="true" className="size-[15px] shrink-0" strokeWidth={2.2} />
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
export function CategorySidebar({ value, matches, onChange }: CategoryNavProps) {
  const { t } = useI18n();
  const describe = useLabels(matches);

  return (
    <nav
      aria-labelledby="categories-label"
      className="relative isolate hidden min-h-0 flex-col gap-1 overflow-y-auto border-r py-6 pr-4 pl-6 lg:flex"
    >
      <SlidingIndicator className="rounded-sm bg-highlight" />
      <span
        id="categories-label"
        className="flex items-center gap-1.5 px-2.5 pb-2 font-mono text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase"
      >
        <ListFilterIcon aria-hidden="true" className="size-[13px] shrink-0" strokeWidth={2.2} />
        {t.picker.categoriesLabel}
      </span>
      {OPTIONS.map(category => {
        const active = value === category;
        const { label, Icon, count } = describe(category);
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
            <span className="flex min-w-0 items-center gap-2.5">
              <Icon aria-hidden="true" className="size-4 shrink-0" strokeWidth={2.1} />
              <span className="truncate">{label}</span>
            </span>
            <span className="font-mono text-xs opacity-60">{count}</span>
          </button>
        );
      })}
    </nav>
  );
}
