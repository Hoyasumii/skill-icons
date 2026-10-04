import {
  type Accessor,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  type JSX,
  Match,
  mergeProps,
  onCleanup,
  Show,
  splitProps,
  Switch,
  useContext,
} from 'solid-js';
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
  type IconName,
  type Theme,
  type ThemeOption,
  themeVariants,
} from '../core/index.js';

export type { IconName, Theme, ThemeOption };

type ImgProps = Omit<
  JSX.ImgHTMLAttributes<HTMLImageElement>,
  'src' | 'srcset' | 'width' | 'height'
>;

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

// The context holds an accessor, so a provider's `theme` stays reactive.
const ThemeContext = createContext<Accessor<ThemeOption | undefined>>(() => undefined);

export interface SkillIconsProviderProps {
  /** Default theme for every Icon and Icons inside. Omit to inherit from an outer provider. */
  theme?: ThemeOption;
  children?: JSX.Element;
}

export function SkillIconsProvider(props: SkillIconsProviderProps) {
  const parent = useContext(ThemeContext);
  return (
    <ThemeContext.Provider value={() => props.theme ?? parent()}>
      {props.children}
    </ThemeContext.Provider>
  );
}

function useThemes(theme: Accessor<ThemeOption | undefined>): Accessor<Theme[]> {
  const inherited = useContext(ThemeContext);
  return createMemo(() => themeVariants(theme() ?? inherited() ?? DEFAULT_THEME), undefined, {
    equals: (a, b) => a.join() === b.join(),
  });
}

function complete(svgs: (string | undefined)[]): string[] | undefined {
  return svgs.length > 0 && svgs.every(svg => svg !== undefined) ? (svgs as string[]) : undefined;
}

/**
 * Loads one SVG per part and returns them as data URIs, or undefined while loading.
 * Starts from the cache, so already loaded icons render on the first pass (SSR included),
 * and keeps the previous SVGs while new ones load, so toggling the theme doesn't flash
 * placeholders. Loads that finish after the inputs changed are dropped.
 */
function useSources(
  id: Accessor<string>,
  parts: Accessor<string[]>,
  peek: (part: string) => string | undefined,
  load: (part: string) => Promise<string | undefined>,
): Accessor<string[] | undefined> {
  const read = () => complete(parts().map(peek));
  const [state, setState] = createSignal({ id: id(), svgs: read() });

  createEffect(() => {
    const current = id();
    if (!current) return;
    const list = parts();
    let cancelled = false;
    onCleanup(() => {
      cancelled = true;
    });
    Promise.all(list.map(load)).then(loaded => {
      if (!cancelled) setState({ id: current, svgs: complete(loaded) });
    });
  });

  return createMemo(() => {
    const s = state();
    const svgs = s.id === id() ? (s.svgs ?? read()) : (read() ?? s.svgs);
    return svgs?.map(svgDataUri);
  });
}

/** An <img>, wrapped in a <picture> that swaps to the light source when there is one. */
function ThemedImg(props: { sources: string[] } & JSX.ImgHTMLAttributes<HTMLImageElement>) {
  const [own, img] = splitProps(props, ['sources']);
  const src = () => own.sources[0];
  const light = () => own.sources[1];
  return (
    <Show when={light() && light() !== src()} fallback={<img {...img} src={src()} />}>
      <picture>
        <source media={LIGHT_MEDIA} srcset={light()} />
        <img {...img} src={src()} />
      </picture>
    </Show>
  );
}

function Placeholder(props: { width: number; height: number } & ImgProps) {
  const style = () => {
    const box = { display: 'inline-block', width: `${props.width}px`, height: `${props.height}px` };
    const extra = props.style;
    return typeof extra === 'string'
      ? `display:inline-block;width:${props.width}px;height:${props.height}px;${extra}`
      : { ...box, ...extra };
  };
  return <span aria-hidden="true" class={props.class} style={style()} />;
}

export function Icon(props: IconProps) {
  const [own, img] = splitProps(props as IconProps & { size?: number }, [
    'name',
    'latest',
    'baseUrl',
    'theme',
    'size',
  ]);
  const themes = useThemes(() => own.theme);
  const size = () => own.size ?? DEFAULT_SIZE;
  const keys = createMemo(
    () => (own.latest ? [] : themes().flatMap(t => iconKey(own.name, t) ?? [])),
    [],
    {
      equals: (a, b) => a.join() === b.join(),
    },
  );
  const sources = useSources(() => keys().join(','), keys, peekIcon, loadIcon);
  const remote = () =>
    themes().map(t =>
      remoteIconsUrl({ icons: [own.name], theme: t, perLine: 1, baseUrl: own.baseUrl }),
    );

  return (
    <Switch>
      <Match when={own.latest}>
        <ThemedImg alt={own.name} {...img} sources={remote()} width={size()} height={size()} />
      </Match>
      <Match when={keys().length > 0}>
        <Show when={sources()} fallback={<Placeholder width={size()} height={size()} {...img} />}>
          {list => (
            <ThemedImg alt={own.name} {...img} sources={list()} width={size()} height={size()} />
          )}
        </Show>
      </Match>
    </Switch>
  );
}

export function Icons(props: IconsProps) {
  const merged = mergeProps(
    { perLine: DEFAULT_PER_LINE },
    props as IconsProps & { perLine: number },
  );
  const [own, img] = splitProps(merged, ['names', 'latest', 'baseUrl', 'theme', 'size', 'perLine']);
  const themes = useThemes(() => own.theme);
  const size = () => own.size ?? DEFAULT_SIZE;
  const known = createMemo(
    () => (own.latest ? [...own.names] : own.names.filter(name => iconKey(name))),
    [],
    { equals: (a, b) => a.join() === b.join() },
  );
  const id = () => (own.latest ? '' : `${known().join(',')}|${themes().join(',')}|${own.perLine}`);
  const sources = useSources(
    id,
    themes,
    t => peekIcons(known(), t as Theme, own.perLine),
    t => loadIcons(known(), t as Theme, own.perLine),
  );
  const box = () => iconsSize(known().length, own.perLine, size());
  const alt = () => known().join(', ');
  const remote = () =>
    themes().map(t =>
      remoteIconsUrl({ icons: known(), theme: t, perLine: own.perLine, baseUrl: own.baseUrl }),
    );

  return (
    <Show when={known().length > 0}>
      <Switch>
        <Match when={own.latest}>
          <ThemedImg alt={alt()} {...img} sources={remote()} width={box().width} />
        </Match>
        <Match when={true}>
          <Show
            when={sources()}
            fallback={<Placeholder width={box().width} height={box().height} {...img} />}
          >
            {list => <ThemedImg alt={alt()} {...img} sources={list()} width={box().width} />}
          </Show>
        </Match>
      </Switch>
    </Show>
  );
}
