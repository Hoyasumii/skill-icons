import { useSyncExternalStore } from 'react';

// Matches Tailwind's `lg` breakpoint, the only one the layout uses.
const WIDE = '(min-width: 1024px)';

function subscribe(onChange: () => void) {
  const query = window.matchMedia(WIDE);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

/**
 * True at 1024px and up, where the export panel is a column instead of a bottom sheet. The
 * prerendered HTML is the compact layout, so hydration starts compact and widens right after.
 */
export function useIsWide() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(WIDE).matches,
    () => false,
  );
}
