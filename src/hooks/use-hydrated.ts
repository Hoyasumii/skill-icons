import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * False while the prerendered HTML is being hydrated (and on the server), true from the next
 * render on. Lets what depends on the browser (theme, portals) render after hydration, so the
 * first client render matches the HTML the build wrote.
 */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
