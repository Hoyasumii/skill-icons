import { useEffect, type PointerEvent } from 'react';
import { SectionLabel } from '@/components/section-label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCursorTooltip } from '@/hooks/use-cursor-tooltip';
import { useI18n } from '@/i18n';
import { iconSrc, type IconInfo } from '@/lib/icons';
import { popClass } from '@/lib/motion';
import { cn } from '@/lib/utils';
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

const HOVER =
  'motion-safe:group-hover:translate-x-(--hover-x,0px) motion-safe:group-hover:translate-y-(--hover-y,-4px) motion-safe:group-hover:scale-(--hover-scale,1.25) motion-safe:group-hover:rotate-(--hover-rotate,-6deg) motion-safe:group-active:scale-95 motion-safe:group-active:rotate-0 group-active:duration-100';

function TooltipLabel({ icon }: { icon: IconInfo }) {
  return (
    <>
      <span className="font-semibold">{icon.displayName}</span>
      {icon.aliases.length > 0 && (
        <span className="font-mono text-muted-foreground"> · {icon.aliases.join(', ')}</span>
      )}
    </>
  );
}

interface IconGridProps {
  icons: IconInfo[];
  title: string;
  query: string;
  selected: string[];
  theme: Theme;
  isPopping: (name: string) => boolean;
  onToggle: (name: string) => void;
  onClearSearch: () => void;
}

export function IconGrid({
  icons,
  title,
  query,
  selected,
  theme,
  isPopping,
  onToggle,
  onClearSearch,
}: IconGridProps) {
  const { bind, hide, tooltip } = useCursorTooltip();
  const { t } = useI18n();

  // The hovered icon may be filtered or scrolled away, which never fires pointerleave.
  useEffect(hide, [icons]);
  useEffect(() => {
    document.addEventListener('scroll', hide, { capture: true, passive: true });
    return () => document.removeEventListener('scroll', hide, { capture: true });
  }, []);

  return (
    <section aria-labelledby="grid-title" className="flex flex-col gap-2.5">
      <div className="flex items-baseline justify-between gap-2">
        <SectionLabel id="grid-title">{title}</SectionLabel>
        <span className="font-mono text-[11px] text-muted-foreground">{t.picker.hint}</span>
      </div>

      {icons.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border-2 border-dashed px-4 py-8 text-center">
          <p className="text-base">{t.picker.noResultsFor(query)}</p>
          <Button variant="outline" onClick={onClearSearch}>
            {t.picker.clearSearch}
          </Button>
        </div>
      ) : (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(62px,1fr))] gap-2.5 lg:grid-cols-[repeat(auto-fill,minmax(76px,1fr))]">
          {icons.map((icon, index) => {
            const order = selected.indexOf(icon.name) + 1;
            const popping = isPopping(icon.name);
            const tooltipProps = bind(<TooltipLabel icon={icon} />);
            return (
              <li key={icon.name}>
                <button
                  type="button"
                  onClick={() => onToggle(icon.name)}
                  aria-pressed={order > 0}
                  aria-label={icon.displayName}
                  {...tooltipProps}
                  onPointerEnter={(e: PointerEvent<HTMLButtonElement>) => {
                    const img = e.currentTarget.firstElementChild;
                    if (img instanceof HTMLElement) randomizeHover(img);
                    tooltipProps.onPointerEnter(e);
                  }}
                  className={cn(
                    'group relative block aspect-square w-full rounded-[14px] p-2 transition-colors duration-150 hover:z-10',
                    order > 0 && 'bg-highlight',
                  )}
                >
                  <img
                    src={iconSrc(icon.name, theme)}
                    alt=""
                    width={48}
                    height={48}
                    loading="lazy"
                    className={cn(
                      'block aspect-square h-auto w-full transition-[scale,rotate,translate] duration-[340ms] ease-spring',
                      popping ? popClass(index) : [order > 0 && 'scale-[.86]', HOVER],
                    )}
                  />
                  {order > 0 && <Badge className="absolute -top-1.5 -right-1.5">{order}</Badge>}
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {tooltip}
    </section>
  );
}
