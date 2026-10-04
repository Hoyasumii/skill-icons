import { useLayoutEffect, useRef, useState, type ComponentProps } from 'react';

// The sheet's spring on the way in, the SlidingIndicator's acceleration on the way out.
const ENTER = 'cubic-bezier(0.32, 1.25, 0.5, 1)';
const LEAVE = 'cubic-bezier(0.55, 0, 0.75, 0.5)';

const OFFSCREEN = {
  bottom: 'translateY(105%)',
  right: 'translateX(105%)',
};

interface SlideProps extends ComponentProps<'div'> {
  open: boolean;
  /** The edge it slides in from and back out to. */
  from: keyof typeof OFFSCREEN;
}

/**
 * Slides in from an edge when `open` turns on, and back out when it turns off, showing what it
 * last showed while open until it is gone. Already open on mount: no entrance.
 */
export function Slide({ open, from, children, ...props }: SlideProps) {
  const ref = useRef<HTMLDivElement>(null);
  const lastOpen = useRef(children);
  const [present, setPresent] = useState(open);
  if (open && !present) setPresent(true);
  const wasOpen = useRef(open);

  useLayoutEffect(() => {
    if (open) lastOpen.current = children;
  });

  useLayoutEffect(() => {
    if (wasOpen.current === open) return;
    wasOpen.current = open;
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (!open) setPresent(false);
      return;
    }

    // Taken before cancelling so a reversal starts from where it is.
    const current = getComputedStyle(el).transform;
    for (const animation of el.getAnimations()) animation.cancel();
    if (open) {
      const start = current === 'none' ? OFFSCREEN[from] : current;
      el.animate([{ transform: start }, { transform: 'none' }], { duration: 380, easing: ENTER });
      return;
    }
    el.animate([{ transform: current }, { transform: OFFSCREEN[from] }], {
      duration: 260,
      easing: LEAVE,
      fill: 'forwards',
    }).finished.then(
      () => setPresent(false),
      () => {}, // Reopened mid-way; the entrance takes over.
    );
  }, [open, from]);

  if (!present) return null;
  return (
    <div ref={ref} inert={!open} {...props}>
      {open ? children : lastOpen.current}
    </div>
  );
}
