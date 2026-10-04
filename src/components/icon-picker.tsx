import { useMemo, useState, type PointerEvent } from 'react';
import { CheckIcon, SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCursorTooltip } from '@/hooks/use-cursor-tooltip';
import { useI18n } from '@/i18n';
import { CATEGORIES, ICONS, iconSrc, type IconInfo } from '@/lib/icons';
import { cn } from '@/lib/utils';
import type { IconCategory } from '../../shared/icon-categories';
import type { Theme } from '../../shared/icons';

const rand = (min: number, max: number) => min + Math.random() * (max - min);

// Each hover picks a fresh tilt (either direction), offset and scale so it never feels scripted.
function randomizeHover(img: HTMLElement) {
  const sign = Math.random() < 0.5 ? -1 : 1;
  img.style.setProperty('--hover-rotate', `${sign * rand(6, 22)}deg`);
  img.style.setProperty('--hover-x', `${rand(-6, 6)}px`);
  img.style.setProperty('--hover-y', `${rand(-10, -2)}px`);
  img.style.setProperty('--hover-scale', `${rand(1.15, 1.4)}`);
}

function TooltipLabel({ icon }: { icon: IconInfo }) {
  return (
    <>
      <span className="font-medium">{icon.displayName}</span>
      {icon.aliases.length > 0 && (
        <span className="text-muted-foreground"> · {icon.aliases.join(', ')}</span>
      )}
    </>
  );
}

interface IconPickerProps {
  selected: string[];
  theme: Theme;
  onToggle: (name: string) => void;
}

export function IconPicker({ selected, theme, onToggle }: IconPickerProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<IconCategory | null>(null);
  const { bind, hide, tooltip } = useCursorTooltip();
  const { t } = useI18n();

  const counts = useMemo(() => {
    const result = new Map<IconCategory, number>();
    for (const icon of ICONS) result.set(icon.category, (result.get(icon.category) ?? 0) + 1);
    return result;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ICONS.filter(
      icon =>
        (!category || icon.category === category) &&
        (!q ||
          icon.name.includes(q) ||
          icon.displayName.toLowerCase().includes(q) ||
          icon.aliases.some(alias => alias.includes(q))),
    );
  }, [query, category]);

  const selectCategory = (next: IconCategory | null) => {
    // The hovered icon may be filtered out, which never fires pointerleave.
    hide();
    setCategory(next);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={e => {
            // The hovered icon may be filtered out, which never fires pointerleave.
            hide();
            setQuery(e.target.value);
          }}
          placeholder={
            category
              ? t.picker.searchPlaceholder(counts.get(category) ?? 0, t.categories[category])
              : t.picker.searchPlaceholder(ICONS.length)
          }
          className="pl-8"
          aria-label={t.picker.searchLabel}
        />
      </div>

      <div role="group" aria-label={t.picker.filterLabel} className="flex flex-wrap gap-1.5">
        {[null, ...CATEGORIES].map(value => {
          const active = category === value;
          return (
            <button
              key={value ?? 'all'}
              type="button"
              aria-pressed={active}
              onClick={() => selectCategory(value)}
              className={cn(
                'rounded-full border px-2.5 py-1 text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring',
                active
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              {value ? t.categories[value] : t.picker.all}
              <span className="ml-1 opacity-60">{value ? counts.get(value) : ICONS.length}</span>
            </button>
          );
        })}
      </div>

      <ScrollArea className="h-[420px] rounded-lg border" onScrollCapture={hide}>
        {filtered.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">
            {query ? t.picker.noResultsFor(query) : t.picker.noResults}
          </p>
        ) : (
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(3.5rem,1fr))] gap-2 p-3">
            {filtered.map(icon => {
              const tooltipProps = (icon: IconInfo) => {
                const props = bind(<TooltipLabel icon={icon} />);
                return {
                  ...props,
                  onPointerEnter: (e: PointerEvent<HTMLButtonElement>) => {
                    const img = e.currentTarget.firstElementChild;
                    if (img instanceof HTMLElement) randomizeHover(img);
                    props.onPointerEnter(e);
                  },
                };
              };
              const isSelected = selected.includes(icon.name);
              return (
                <li key={icon.name}>
                  <button
                    type="button"
                    onClick={() => onToggle(icon.name)}
                    aria-pressed={isSelected}
                    aria-label={icon.name}
                    {...tooltipProps(icon)}
                    className={cn(
                      'group relative block w-full rounded-lg p-1.5 outline-none hover:z-10 focus-visible:ring-2 focus-visible:ring-ring',
                      isSelected && 'bg-accent ring-2 ring-primary',
                    )}
                  >
                    <img
                      src={iconSrc(icon.name, theme)}
                      alt=""
                      width={48}
                      height={48}
                      loading="lazy"
                      className="block aspect-square h-auto w-full transition-[scale,rotate,translate,filter] duration-300 ease-[cubic-bezier(0.34,1.8,0.64,1)] group-hover:translate-x-(--hover-x,0px) group-hover:translate-y-(--hover-y,-4px) group-hover:scale-(--hover-scale,1.25) group-hover:rotate-(--hover-rotate,-6deg) group-hover:drop-shadow-[0_8px_12px_rgb(0_0_0/0.35)] group-active:scale-95 group-active:rotate-0 group-active:duration-100 motion-reduce:transition-none"
                    />
                    {isSelected && (
                      <CheckIcon className="absolute -top-1 -right-1 size-4 rounded-full bg-primary p-0.5 text-primary-foreground" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </ScrollArea>
      {tooltip}
    </div>
  );
}
