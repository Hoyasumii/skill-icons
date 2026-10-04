import { useEffect, useState } from 'react';
import {
  DEFAULT_PER_LINE,
  DEFAULT_THEME,
  MAX_PER_LINE,
  MIN_PER_LINE,
  type Theme,
} from '../../shared/icons';
import { useI18n } from '@/i18n';
import { resolveIconName } from '@/lib/icons';
import { cleanTitle } from '../../shared/badge-title';

export interface BuilderState {
  icons: string[];
  theme: Theme;
  perLine: number;
  /** Badge title as typed; undefined until edited, so the default follows the language. */
  title?: string;
}

/** Reads the builder state from the page's query string (same params as /icons, plus the page-only `title`). */
function readStateFromUrl(): BuilderState {
  // The prerender has no URL: it is the empty builder.
  const params = new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search);

  const iconParam = params.get('i') ?? params.get('icons') ?? '';
  const icons = [
    ...new Set(
      iconParam
        .split(',')
        .map(resolveIconName)
        .filter((name): name is string => !!name),
    ),
  ];

  const themeParam = params.get('t') ?? params.get('theme');
  const theme: Theme = themeParam === 'light' ? 'light' : DEFAULT_THEME;

  const perLineParam = Number(params.get('perline'));
  const perLine =
    Number.isInteger(perLineParam) && perLineParam >= MIN_PER_LINE && perLineParam <= MAX_PER_LINE
      ? perLineParam
      : DEFAULT_PER_LINE;

  // Not `t`: that one is already short for theme.
  const title = cleanTitle(params.get('title'));

  return { icons, theme, perLine, title };
}

function writeStateToUrl({ icons, theme, perLine, title }: BuilderState, defaultTitle: string) {
  const params = new URLSearchParams();
  if (icons.length) params.set('i', icons.join(','));
  if (theme !== DEFAULT_THEME) params.set('theme', theme);
  if (perLine !== DEFAULT_PER_LINE) params.set('perline', String(perLine));
  const cleanedTitle = cleanTitle(title);
  if (cleanedTitle && cleanedTitle !== defaultTitle) params.set('title', cleanedTitle);

  const query = params.toString().replaceAll('%2C', ',');
  window.history.replaceState(null, '', query ? `?${query}` : window.location.pathname);
}

/** Builder state kept in sync with the URL, so a configuration can be shared by link. */
export function useBuilderState() {
  const [state, setState] = useState(readStateFromUrl);
  const defaultTitle = useI18n().t.preview.heading;

  useEffect(() => writeStateToUrl(state, defaultTitle), [state, defaultTitle]);

  const toggleIcon = (name: string) =>
    setState(s => ({
      ...s,
      icons: s.icons.includes(name) ? s.icons.filter(i => i !== name) : [...s.icons, name],
    }));

  const moveIcon = (from: number, to: number) =>
    setState(s => {
      if (to < 0 || to >= s.icons.length) return s;
      const icons = [...s.icons];
      const [moved] = icons.splice(from, 1);
      icons.splice(to, 0, moved);
      return { ...s, icons };
    });

  return {
    state,
    toggleIcon,
    moveIcon,
    /** Replaces the whole stack: a shuffled copy or a stack (de)selected. */
    setIcons: (icons: string[]) => setState(s => ({ ...s, icons })),
    clearIcons: () => setState(s => ({ ...s, icons: [] })),
    setTheme: (theme: Theme) => setState(s => ({ ...s, theme })),
    setPerLine: (perLine: number) => setState(s => ({ ...s, perLine })),
    /** Undefined goes back to the default title. */
    setTitle: (title: string | undefined) => setState(s => ({ ...s, title })),
  };
}
