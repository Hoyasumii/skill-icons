const REVEAL = { duration: 620, easing: 'cubic-bezier(0.7, 0, 0.2, 1)' };

/**
 * Runs `apply` as a view transition where the new page grows as a circle from the center of
 * `origin` to the farthest corner. Without view transitions, or with reduced motion, it just
 * applies. The page stays frozen on the old snapshot until `apply` settles.
 */
export function circleReveal(origin: Element, apply: () => void | Promise<void>) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!document.startViewTransition || reduceMotion) {
    void apply();
    return;
  }

  const { left, top, width, height } = origin.getBoundingClientRect();
  const x = left + width / 2;
  const y = top + height / 2;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

  document
    .startViewTransition(apply)
    .ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { ...REVEAL, fill: 'both', pseudoElement: '::view-transition-new(root)' },
      );
    })
    .catch(() => {});
}

/** Waits for the images on screen to decode, so the new snapshot doesn't catch them blank. */
export function imagesOnScreen(timeout = 400) {
  const visible = [...document.images].filter(img => {
    const { top, bottom, width } = img.getBoundingClientRect();
    return width > 0 && bottom > 0 && top < innerHeight;
  });
  const decoded = Promise.all(visible.map(img => img.decode().catch(() => {})));
  return Promise.race([decoded, new Promise(resolve => setTimeout(resolve, timeout))]);
}
