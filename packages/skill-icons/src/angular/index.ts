import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  InjectionToken,
  inject,
  input,
  isSignal,
  numberAttribute,
  signal,
  untracked,
  booleanAttribute,
  type Provider,
  type Signal,
} from '@angular/core';
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

/**
 * Icon name. In local mode (the default) use an `IconName`; with `latest` any string is
 * accepted. Angular inputs cannot express that union per mode, so both are allowed here:
 * `IconName` still autocompletes, and an unknown name in local mode renders nothing.
 */
export type IconNameInput = IconName | (string & {});

/** Style or class value forwarded to the inner element, in any form Angular's bindings accept. */
export type ImgClass = string | string[] | Set<string> | Record<string, unknown>;
export type ImgStyle = string | Record<string, string | number | null | undefined>;

const THEME = new InjectionToken<Signal<ThemeOption | undefined>>('SKILL_ICONS_THEME');

type ThemeSource = ThemeOption | Signal<ThemeOption | undefined> | undefined;

/**
 * Sets the default theme for every Icon and Icons below, e.g. in `bootstrapApplication`,
 * a route's `providers` or a component's `providers`. `theme` may be a signal, which keeps
 * the icons reactive. Omit it to inherit from an outer provider.
 */
export function provideSkillIcons(options: { theme?: ThemeSource } = {}): Provider {
  return {
    provide: THEME,
    useFactory: () => {
      const parent = inject(THEME, { skipSelf: true, optional: true });
      const { theme } = options;
      return computed(() => (isSignal(theme) ? theme() : theme) ?? parent?.());
    },
  };
}

/** Same as `provideSkillIcons`, as a component: `<skill-icons-provider theme="auto">...</...>`. */
@Component({
  selector: 'skill-icons-provider',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  providers: [
    {
      provide: THEME,
      useFactory: () => {
        const self = inject(SkillIconsProvider);
        const parent = inject(THEME, { skipSelf: true, optional: true });
        return computed(() => self.theme() ?? parent?.());
      },
    },
  ],
})
export class SkillIconsProvider {
  /** Default theme for every Icon and Icons inside. Omit to inherit from an outer provider. */
  readonly theme = input<ThemeOption | undefined>();
}

function injectThemes(theme: Signal<ThemeOption | undefined>): Signal<Theme[]> {
  const inherited = inject(THEME, { optional: true });
  return computed(() => themeVariants(theme() ?? inherited?.() ?? DEFAULT_THEME));
}

function complete(svgs: (string | undefined)[]): string[] | undefined {
  return svgs.length > 0 && svgs.every(svg => svg !== undefined) ? (svgs as string[]) : undefined;
}

/**
 * Loads one SVG per part and exposes them as data URIs, or undefined while loading.
 * Reads the cache while rendering, so already loaded icons show on the first pass (SSR too),
 * and keeps the previous SVGs while new ones load, so toggling the theme doesn't flash.
 * Must be called in an injection context.
 */
function injectSources(
  id: Signal<string>,
  parts: Signal<string[]>,
  peek: (part: string) => string | undefined,
  load: (part: string) => Promise<string | undefined>,
): Signal<string[] | undefined> {
  const state = signal<{ id: string; svgs: string[] | undefined } | undefined>(undefined);

  effect(() => {
    const current = id();
    const list = parts();
    if (!current || complete(list.map(peek))) return;
    Promise.all(list.map(load)).then(loaded => {
      // Ignore stale loads: only the latest id may write.
      if (untracked(id) === current) state.set({ id: current, svgs: complete(loaded) });
    });
  });

  // The last SVGs shown, kept while new ones load. Written during render on purpose: it is
  // derived state that never feeds back into the graph.
  let previous: string[] | undefined;
  return computed(() => {
    const loaded = state();
    const svgs =
      complete(parts().map(peek)) ?? (loaded?.id === id() ? loaded.svgs : undefined) ?? previous;
    previous = svgs;
    return svgs?.map(svgDataUri);
  });
}

const sizeAttribute = (value: unknown) => numberAttribute(value, DEFAULT_SIZE);
const perLineAttribute = (value: unknown) => numberAttribute(value, DEFAULT_PER_LINE);

/** The template shared by both components: a placeholder, an <img>, or a <picture>. */
const TEMPLATE = `
  @if (view(); as v) {
    @if (v.kind === 'placeholder') {
      <span
        aria-hidden="true"
        style="display: inline-block"
        [class]="imgClass()"
        [style]="imgStyle()"
        [style.width.px]="v.width"
        [style.height.px]="v.height"
      ></span>
    } @else if (v.sources[1] && v.sources[1] !== v.sources[0]) {
      <picture>
        <source [attr.media]="lightMedia" [attr.srcset]="v.sources[1]" />
        <img
          [alt]="alt() ?? v.alt"
          [class]="imgClass()"
          [style]="imgStyle()"
          [attr.width]="v.width"
          [attr.height]="v.height"
          [src]="v.sources[0]"
        />
      </picture>
    } @else {
      <img
        [alt]="alt() ?? v.alt"
        [class]="imgClass()"
        [style]="imgStyle()"
        [attr.width]="v.width"
        [attr.height]="v.height"
        [src]="v.sources[0]"
      />
    }
  }
`;

type View =
  | { kind: 'placeholder'; width: number; height: number }
  | { kind: 'img'; sources: string[]; alt: string; width: number; height?: number };

/**
 * A single skill icon: `<skill-icon name="react" theme="auto" [size]="32" />`.
 * Class and style on the element itself land on the host; use `imgClass` and `imgStyle`
 * to style the inner `<img>`.
 */
@Component({
  selector: 'skill-icon',
  template: TEMPLATE,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icon {
  /** Icon name or alias. Any string with `latest`. */
  readonly name = input.required<IconNameInput>();
  /** 'dark', 'light' or 'auto' to follow the system. Defaults to the provider's theme, then 'dark'. */
  readonly theme = input<ThemeOption | undefined>();
  /** Size of one icon in pixels. Defaults to 48. */
  readonly size = input(DEFAULT_SIZE, { transform: sizeAttribute });
  /** Load from the deployed API instead of the bundle. */
  readonly latest = input(false, { transform: booleanAttribute });
  /** Deployment to load icons from, in `latest` mode only. Defaults to https://skillicons.dev. */
  readonly baseUrl = input<string | undefined>();
  /** Alt text. Defaults to the icon name. */
  readonly alt = input<string | undefined>();
  readonly imgClass = input<ImgClass | undefined>();
  readonly imgStyle = input<ImgStyle | undefined>();

  protected readonly lightMedia = LIGHT_MEDIA;
  private readonly themes = injectThemes(this.theme);
  private readonly keys = computed(() =>
    this.latest() ? [] : this.themes().flatMap(t => iconKey(this.name(), t) ?? []),
  );
  private readonly local = injectSources(
    computed(() => this.keys().join(',')),
    this.keys,
    peekIcon,
    loadIcon,
  );

  protected readonly view = computed((): View | undefined => {
    const size = this.size();
    const name = this.name();
    if (this.latest()) {
      const baseUrl = this.baseUrl();
      const sources = this.themes().map(t =>
        remoteIconsUrl({ icons: [name], theme: t, perLine: 1, baseUrl }),
      );
      return { kind: 'img', sources, alt: name, width: size, height: size };
    }
    if (this.keys().length === 0) return undefined;
    const sources = this.local();
    if (!sources) return { kind: 'placeholder', width: size, height: size };
    return { kind: 'img', sources, alt: name, width: size, height: size };
  });
}

/**
 * Several icons composed into one image:
 * `<skill-icons [names]="['js', 'ts']" [perLine]="2" />`.
 */
@Component({
  selector: 'skill-icons',
  template: TEMPLATE,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icons {
  /** Icon names or aliases. Any strings with `latest`. */
  readonly names = input.required<readonly IconNameInput[]>();
  readonly theme = input<ThemeOption | undefined>();
  /** Size of one icon in pixels. Defaults to 48. */
  readonly size = input(DEFAULT_SIZE, { transform: sizeAttribute });
  /** Icons per line, between 1 and 50. Defaults to 15. */
  readonly perLine = input(DEFAULT_PER_LINE, { transform: perLineAttribute });
  readonly latest = input(false, { transform: booleanAttribute });
  readonly baseUrl = input<string | undefined>();
  /** Alt text. Defaults to the icon names, joined by ", ". */
  readonly alt = input<string | undefined>();
  readonly imgClass = input<ImgClass | undefined>();
  readonly imgStyle = input<ImgStyle | undefined>();

  protected readonly lightMedia = LIGHT_MEDIA;
  private readonly themes = injectThemes(this.theme);
  private readonly known = computed(() =>
    this.latest() ? this.names() : this.names().filter(name => iconKey(name)),
  );
  private readonly local = injectSources(
    computed(() =>
      this.latest() ? '' : `${this.known().join(',')}|${this.themes().join(',')}|${this.perLine()}`,
    ),
    this.themes,
    t => peekIcons(this.known(), t as Theme, this.perLine()),
    t => loadIcons(this.known(), t as Theme, this.perLine()),
  );

  protected readonly view = computed((): View | undefined => {
    const icons = this.known();
    if (icons.length === 0) return undefined;
    const perLine = this.perLine();
    const { width, height } = iconsSize(icons.length, perLine, this.size());
    const alt = icons.join(', ');
    if (this.latest()) {
      const baseUrl = this.baseUrl();
      const sources = this.themes().map(t => remoteIconsUrl({ icons, theme: t, perLine, baseUrl }));
      return { kind: 'img', sources, alt, width };
    }
    const sources = this.local();
    if (!sources) return { kind: 'placeholder', width, height };
    return { kind: 'img', sources, alt, width };
  });
}

/** Everything needed in a standalone component's `imports`. */
export const SKILL_ICONS = [Icon, Icons, SkillIconsProvider] as const;
