import { useLayoutEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

// Gaps between the cursor hotspot and the tooltip. Below needs more room to clear the arrow.
const GAP_ABOVE = 4;
const GAP_BELOW = 24;

/**
 * A tooltip that follows the mouse while it is inside the bound element and
 * fades out as soon as it leaves. Only reacts to mouse pointers, so it never
 * gets stuck on touch devices.
 */
export function useCursorTooltip() {
  // The content outlives `open` so the tooltip can animate out instead of unmounting.
  const [content, setContent] = useState<ReactNode>(null);
  const [open, setOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });

  // Positioned imperatively so moving the mouse doesn't re-render the bound elements.
  const position = () => {
    const el = tooltipRef.current;
    if (!el) return;
    const { x, y } = pointer.current;
    // Above the cursor, horizontally centered on it; flips below near the top edge.
    const left = Math.min(Math.max(x - el.offsetWidth / 2, 0), window.innerWidth - el.offsetWidth);
    const side = y - GAP_ABOVE - el.offsetHeight < 0 ? 'bottom' : 'top';
    const top = side === 'bottom' ? y + GAP_BELOW : y - GAP_ABOVE - el.offsetHeight;
    el.dataset.side = side;
    el.style.transform = `translate3d(${left}px, ${top}px, 0)`;
  };

  useLayoutEffect(position, [content, open]);

  const track = (e: PointerEvent) => {
    pointer.current = { x: e.clientX, y: e.clientY };
    position();
  };

  const hide = () => setOpen(false);

  const bind = (label: ReactNode) => ({
    onPointerEnter: (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      pointer.current = { x: e.clientX, y: e.clientY };
      setContent(label);
      setOpen(true);
    },
    onPointerMove: track,
    onPointerLeave: hide,
  });

  // Always mounted (closed and invisible until first use) so entering animates from the
  // closed state too. The outer element is positioned; the inner one animates, so their
  // transforms don't clash.
  const tooltip = createPortal(
    <div
      ref={tooltipRef}
      role="tooltip"
      aria-hidden={!open}
      data-state={open ? 'open' : 'closed'}
      className="group pointer-events-none fixed top-0 left-0 z-50"
    >
      <div className="origin-bottom rounded-sm border bg-popover px-2 py-1 text-[13px] text-popover-foreground transition-[opacity,scale,translate] duration-150 ease-out group-data-[side=bottom]:origin-top group-data-[state=closed]:translate-y-1 group-data-[state=closed]:scale-90 group-data-[state=closed]:opacity-0 group-data-[side=bottom]:group-data-[state=closed]:-translate-y-1 motion-reduce:transition-none">
        {content}
      </div>
    </div>,
    document.body,
  );

  return { bind, hide, tooltip };
}
