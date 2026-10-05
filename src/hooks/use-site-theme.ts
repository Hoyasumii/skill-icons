import { useTheme } from 'next-themes';
import { useHydrated } from '@/hooks/use-hydrated';
import type { Theme } from '../../shared/icons';

/** The site theme in effect; light until hydration, since the prerendered HTML can't know it. */
export function useSiteTheme(): Theme {
  const { resolvedTheme } = useTheme();
  const hydrated = useHydrated();
  return hydrated && resolvedTheme === 'dark' ? 'dark' : 'light';
}
