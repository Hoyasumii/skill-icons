import {
  computed,
  defineComponent,
  h,
  inject,
  onMounted,
  provide,
  shallowRef,
  watch,
  type ComputedRef,
  type InjectionKey,
  type PropType,
  type VNode,
} from 'vue';
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

interface CommonProps {
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

const THEME_KEY: InjectionKey<ComputedRef<ThemeOption | undefined>> = Symbol('skill-icons-theme');

/** Sets the default theme for every Icon and Icons inside. Omit `theme` to inherit. */
export const SkillIconsProvider = defineComponent(
  (props: { theme?: ThemeOption }, { slots }) => {
    const parent = inject(THEME_KEY, undefined);
    provide(
      THEME_KEY,
      computed(() => props.theme ?? parent?.value),
    );
    return () => slots.default?.();
  },
  { name: 'SkillIconsProvider', props: { theme: String as PropType<ThemeOption> } },
);

function useThemes(theme: () => ThemeOption | undefined): ComputedRef<Theme[]> {
  const inherited = inject(THEME_KEY, undefined);
  return computed(() => themeVariants(theme() ?? inherited?.value ?? DEFAULT_THEME));
}

/**
 * Loads one SVG per part and exposes them as data URIs, or undefined while loading.
 * Starts from the cache, so already loaded icons render on the first pass, including SSR, and
 * keeps the previous SVGs while new ones load, so toggling the theme doesn't flash placeholders.
 */
function useSources(
  id: () => string,
  parts: () => string[],
  peek: (part: string) => string | undefined,
  load: (part: string) => Promise<string | undefined>,
): ComputedRef<string[] | undefined> {
  const svgs = shallowRef(complete(parts().map(peek)));

  const update = (current: string) => {
    const list = parts();
    const cached = complete(list.map(peek));
    if (cached) svgs.value = cached;
    if (!current || cached) return;
    Promise.all(list.map(load)).then(loaded => {
      if (id() === current) svgs.value = complete(loaded);
    });
  };
  watch(id, update);
  onMounted(() => update(id()));

  return computed(() => svgs.value?.map(svgDataUri));
}

function complete(svgs: (string | undefined)[]): string[] | undefined {
  return svgs.length > 0 && svgs.every(svg => svg !== undefined) ? (svgs as string[]) : undefined;
}

/** An <img>, wrapped in a <picture> that swaps to the light source when there is one. */
function themedImg([src, lightSrc]: string[], attrs: Record<string, unknown>): VNode {
  const image = h('img', { ...attrs, src });
  if (!lightSrc || lightSrc === src) return image;
  return h('picture', [h('source', { media: LIGHT_MEDIA, srcset: lightSrc }), image]);
}

function placeholder(width: number, height: number, attrs: Record<string, unknown>): VNode {
  const { class: className, style } = attrs;
  return h('span', {
    'aria-hidden': 'true',
    ...(className ? { class: className } : {}),
    style: [{ display: 'inline-block', width: `${width}px`, height: `${height}px` }, style],
  });
}

/**
 * Runtime props only make Vue cast `latest` to a boolean and apply defaults. Public types come
 * from the setup signature: Vue checks prop options against each member of the props union
 * separately, so no single options object can satisfy both modes.
 */
function runtimeProps(props: Record<string, unknown>): never {
  return props as never;
}

const commonProps = {
  latest: Boolean,
  baseUrl: String,
  theme: String as PropType<ThemeOption>,
  size: { type: Number, default: DEFAULT_SIZE },
};

export const Icon = defineComponent(
  (props: IconProps, { attrs }) => {
    const themes = useThemes(() => props.theme);
    const keys = computed(() =>
      props.latest ? [] : themes.value.flatMap(t => iconKey(props.name, t) ?? []),
    );
    const local = useSources(
      () => keys.value.join(','),
      () => keys.value,
      peekIcon,
      loadIcon,
    );

    return () => {
      const { name, baseUrl, size = DEFAULT_SIZE } = props;
      const img = { alt: name, ...attrs, width: size, height: size };
      if (props.latest) {
        const remote = themes.value.map(t =>
          remoteIconsUrl({ icons: [name], theme: t, perLine: 1, baseUrl }),
        );
        return themedImg(remote, img);
      }
      if (keys.value.length === 0) return null;
      if (!local.value) return placeholder(size, size, attrs);
      return themedImg(local.value, img);
    };
  },
  {
    name: 'SkillIcon',
    inheritAttrs: false,
    props: runtimeProps({ ...commonProps, name: { type: String, required: true } }),
  },
);

export const Icons = defineComponent(
  (props: IconsProps, { attrs }) => {
    const themes = useThemes(() => props.theme);
    const perLine = () => props.perLine ?? DEFAULT_PER_LINE;
    const known = computed(() =>
      props.latest ? props.names : props.names.filter(name => iconKey(name)),
    );
    const local = useSources(
      () => (props.latest ? '' : `${known.value.join(',')}|${themes.value.join(',')}|${perLine()}`),
      () => themes.value,
      t => peekIcons(known.value, t as Theme, perLine()),
      t => loadIcons(known.value, t as Theme, perLine()),
    );

    return () => {
      const { baseUrl, size = DEFAULT_SIZE } = props;
      const icons = known.value;
      if (icons.length === 0) return null;
      const { width, height } = iconsSize(icons.length, perLine(), size);
      const img = { alt: icons.join(', '), ...attrs, width };
      if (props.latest) {
        const remote = themes.value.map(t =>
          remoteIconsUrl({ icons, theme: t, perLine: perLine(), baseUrl }),
        );
        return themedImg(remote, img);
      }
      if (!local.value) return placeholder(width, height, attrs);
      return themedImg(local.value, img);
    };
  },
  {
    name: 'SkillIcons',
    inheritAttrs: false,
    props: runtimeProps({
      ...commonProps,
      perLine: Number,
      names: { type: Array, required: true },
    }),
  },
);
