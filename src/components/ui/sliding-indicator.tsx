import { useLayoutEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const ACTIVE = ['[data-state="on"]', '[data-state="active"]', '[aria-pressed="true"]']
  .map(selector => `:scope > ${selector}`)
  .join(',');

const DURATION = 420;

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** `el`'s box in the coordinates an absolutely positioned child of `parent` uses. */
function boxIn(parent: HTMLElement, el: Element): Box {
  const outer = parent.getBoundingClientRect();
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left - outer.left - parent.clientLeft + parent.scrollLeft,
    top: rect.top - outer.top - parent.clientTop + parent.scrollTop,
    width: rect.width,
    height: rect.height,
  };
}

const frame = ({ left, top, width, height }: Box) => ({
  transform: `translate(${left}px, ${top}px)`,
  width: `${width}px`,
  height: `${height}px`,
});

function union(a: Box, b: Box): Box {
  const left = Math.min(a.left, b.left);
  const top = Math.min(a.top, b.top);
  return {
    left,
    top,
    width: Math.max(a.left + a.width, b.left + b.width) - left,
    height: Math.max(a.top + a.height, b.top + b.height) - top,
  };
}

const sameBox = (a: Box, b: Box) =>
  Math.abs(a.left - b.left) < 0.5 &&
  Math.abs(a.top - b.top) < 0.5 &&
  Math.abs(a.width - b.width) < 0.5 &&
  Math.abs(a.height - b.height) < 0.5;

/**
 * The fill behind the active item of its parent, which must be positioned. On a change the
 * leading edge runs ahead until the fill spans both items, then the trailing edge catches up.
 * Must be the parent's first child so the items paint over it.
 */
export function SlidingIndicator({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    let activeEl: Element | null = null;

    const update = () => {
      const active = parent.querySelector(ACTIVE);
      if (!active) {
        activeEl = null;
        el.style.opacity = '0';
        return;
      }
      const next = boxIn(parent, active);
      // Hidden (e.g. a closed sheet); the ResizeObserver fires again once it shows.
      if (next.width === 0) return;

      const moved = activeEl !== null && activeEl !== active && el.style.opacity === '1';
      // Taken before the jump so an interrupted slide continues from where it is.
      const from = boxIn(parent, el);
      const animations = el.getAnimations();
      const interrupted = animations.some(animation => animation.playState === 'running');
      activeEl = active;
      for (const animation of animations) animation.cancel();
      Object.assign(el.style, frame(next), { opacity: '1' });

      if (!moved || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const stretch = union(from, next);
      // Mid-slide, or when the fill already covers the target, there's nothing to stretch
      // over: restarting the stretch would hold still for its first phase and could span
      // items in between. Glide straight to the target instead.
      if (interrupted || sameBox(stretch, from)) {
        el.animate(
          [{ ...frame(from), easing: 'cubic-bezier(0.3, 1.2, 0.5, 1)' }, frame(next)],
          { duration: DURATION * 0.7 },
        );
        return;
      }
      el.animate(
        [
          { ...frame(from), easing: 'cubic-bezier(0.55, 0, 0.75, 0.5)' },
          { ...frame(stretch), offset: 0.4, easing: 'cubic-bezier(0.3, 1.35, 0.5, 1)' },
          frame(next),
        ],
        { duration: DURATION },
      );
    };

    update();
    const mutations = new MutationObserver(update);
    mutations.observe(parent, {
      subtree: true,
      attributeFilter: ['data-state', 'aria-pressed'],
    });
    const resizes = new ResizeObserver(update);
    resizes.observe(parent);
    for (const child of parent.children) if (child !== el) resizes.observe(child);
    return () => {
      mutations.disconnect();
      resizes.disconnect();
    };
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      data-slot="sliding-indicator"
      className={cn('pointer-events-none absolute top-0 left-0 opacity-0', className)}
    />
  );
}
