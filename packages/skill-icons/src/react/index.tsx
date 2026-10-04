'use client';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ImgHTMLAttributes,
  type ReactNode,
} from 'react';
import {
  DEFAULT_PER_LINE,
  DEFAULT_SIZE,
  DEFAULT_THEME,
  iconKey,
  iconsSize,
  LIGHT_MEDIA,
  loadIcon,
  loadIcons,
  peekIcon,
  peekIcons,
  remoteIconsUrl,
  svgDataUri,
  themeVariants,
  type IconName,
  type Theme,
  type ThemeOption,
} from '../core/index.js';

export type { IconName, Theme, ThemeOption };

type ImgProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'width' | 'height'>;

interface CommonProps extends ImgProps {
  /** 'dark', 'light' or 'auto' to follow the system. Defaults to the provider's theme, then 'dark'. */
  theme?: ThemeOption;
  /** Size of one icon in pixels. Defaults to 48. */
  size?: number;
}

/** Local mode: only icons bundled with this version, fully typed. */
interface LocalMode {
  latest?: false;
  baseUrl?: never;
}

/** Latest mode: any name, loaded from the deployed API at runtime. */
interface LatestMode {
  latest: true;
  /** Deployment to load icons from. Defaults to https://skill-icons.alanreisanjo.workers.dev. */
  baseUrl?: string;
}

export type IconProps = CommonProps &
  ((LocalMode & { name: IconName }) | (LatestMode & { name: string }));

export type IconsProps = CommonProps & {
  /** Icons per line, between 1 and 50. Defaults to 15. */
  perLine?: number;
} & ((LocalMode & { names: readonly IconName[] }) | (LatestMode & { names: readonly string[] }));

const ThemeContext = createContext<ThemeOption | undefined>(undefined);

export interface SkillIconsProviderProps {
  /** Default theme for every Icon and Icons inside. Omit to inherit from an outer provider. */
  theme?: ThemeOption;
  children?: ReactNode;
}

export function SkillIconsProvider({ theme, children }: SkillIconsProviderProps) {
  const parent = useContext(ThemeContext);
  return <ThemeContext.Provider value={theme ?? parent}>{children}</ThemeContext.Provider>;
}

function useThemes(theme: ThemeOption | undefined): Theme[] {
  const inherited = useContext(ThemeContext);
  return themeVariants(theme ?? inherited ?? DEFAULT_THEME);
}

/**
 * Loads one SVG per part and returns them as data URIs, or undefined while loading.
 * Starts from the cache, so already loaded icons render on the first pass, and keeps the
 * previous SVGs while new ones load, so toggling the theme doesn't flash placeholders.
 */
function useSources(
  id: string,
  parts: string[],
  peek: (part: string) => string | undefined,
  load: (part: string) => Promise<string | undefined>,
): string[] | undefined {
  const read = () => complete(parts.map(peek));
  const [state, setState] = useState(() => ({ id, svgs: read() }));
  const svgs = state.id === id ? (state.svgs ?? read()) : (read() ?? state.svgs);

  // biome-ignore lint/correctness/useExhaustiveDependencies: `id` captures every input of `load`.
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    Promise.all(parts.map(load)).then(loaded => {
      if (!cancelled) setState({ id, svgs: complete(loaded) });
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return svgs?.map(svgDataUri);
}

function complete(svgs: (string | undefined)[]): string[] | undefined {
  return svgs.length > 0 && svgs.every(svg => svg !== undefined) ? (svgs as string[]) : undefined;
}

/** An <img>, wrapped in a <picture> that swaps to the light source when there is one. */
function ThemedImg({
  sources: [src, lightSrc],
  ...img
}: { sources: string[] } & ImgHTMLAttributes<HTMLImageElement>) {
  const image = <img {...img} src={src} />;
  if (!lightSrc || lightSrc === src) return image;
  return (
    <picture>
      <source media={LIGHT_MEDIA} srcSet={lightSrc} />
      {image}
    </picture>
  );
}

function Placeholder({
  width,
  height,
  style,
  className,
}: { width: number; height: number } & ImgProps) {
  return (
    <span
      aria-hidden
      className={className}
      style={{ display: 'inline-block', width, height, ...style }}
    />
  );
}

export function Icon(props: IconProps) {
  const { name, latest, baseUrl, theme, size = DEFAULT_SIZE, ...img } = props;
  const themes = useThemes(theme);
  const keys = latest ? [] : themes.flatMap(t => iconKey(name, t) ?? []);
  const local = useSources(keys.join(','), keys, peekIcon, loadIcon);

  if (latest) {
    const remote = themes.map(t =>
      remoteIconsUrl({ icons: [name], theme: t, perLine: 1, baseUrl }),
    );
    return <ThemedImg alt={name} {...img} sources={remote} width={size} height={size} />;
  }
  if (keys.length === 0) return null;
  if (!local) return <Placeholder width={size} height={size} {...img} />;
  return <ThemedImg alt={name} {...img} sources={local} width={size} height={size} />;
}

export function Icons(props: IconsProps) {
  const {
    names,
    latest,
    baseUrl,
    theme,
    size = DEFAULT_SIZE,
    perLine = DEFAULT_PER_LINE,
    ...img
  } = props;
  const themes = useThemes(theme);
  const known = latest ? names : names.filter(name => iconKey(name));
  const id = latest ? '' : `${known.join(',')}|${themes.join(',')}|${perLine}`;
  const local = useSources(
    id,
    themes,
    t => peekIcons(known, t as Theme, perLine),
    t => loadIcons(known, t as Theme, perLine),
  );

  if (known.length === 0) return null;
  const { width, height } = iconsSize(known.length, perLine, size);
  const alt = known.join(', ');

  if (latest) {
    const remote = themes.map(t => remoteIconsUrl({ icons: known, theme: t, perLine, baseUrl }));
    return <ThemedImg alt={alt} {...img} sources={remote} width={width} />;
  }
  if (!local) return <Placeholder width={width} height={height} {...img} />;
  return <ThemedImg alt={alt} {...img} sources={local} width={width} />;
}
