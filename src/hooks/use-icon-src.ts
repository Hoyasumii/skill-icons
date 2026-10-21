import { createContext, useCallback, useContext, useSyncExternalStore } from 'react';
import type { Theme } from '../../shared/icons';
import type { Tint } from '../../shared/tint';
import { iconSrc } from '@/lib/icons';
import { subscribeTinted, tintedIconSrc, tintedVersion } from '@/lib/tinted-icons';

/** The builder's tint, for every picture of the icons in the icon theme. */
export const IconTintContext = createContext<Tint | undefined>(undefined);

/**
 * `(name, theme) => src` for the icons as the builder shows them: the static thumbnail, or its
 * tinted copy when a tint is set (`tint` overrides the builder's, e.g. for a preview).
 */
export function useIconSrc(tint?: Tint | null): (name: string, theme: Theme) => string {
  const builderTint = useContext(IconTintContext);
  const active = tint === undefined ? builderTint : (tint ?? undefined);
  // Re-renders as tinted copies finish loading; the prerender never has a tint.
  const version = useSyncExternalStore(subscribeTinted, tintedVersion, () => 0);

  // `version` is a dependency only so the copies that finished loading get picked up.
  return useCallback(
    (name: string, theme: Theme) =>
      active ? tintedIconSrc(name, theme, active) : iconSrc(name, theme),
    [active, version],
  );
}
