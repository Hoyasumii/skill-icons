// Framework-free custom elements: <skill-icon>, <skill-icons> and <skill-icons-provider>.
//
// Rendering happens in the light DOM, so the generated <img> can be styled and queried like
// any other image, and `img-class` / `alt` are forwarded to it. The hosts stay `display: inline`
// (the default for custom elements), which is what an <img> inside a line of text wants; the
// loading placeholder is an inline-block <span> with the final size. No global CSS is needed.
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

export const ICON_TAG = 'skill-icon';
export const ICONS_TAG = 'skill-icons';
export const PROVIDER_TAG = 'skill-icons-provider';

// Importing this module on the server must not throw, so the classes extend a stand-in there.
const Base: typeof HTMLElement =
  typeof HTMLElement === 'undefined' ? (class {} as unknown as typeof HTMLElement) : HTMLElement;

function parseTheme(value: string | null): ThemeOption | undefined {
  return value === 'dark' || value === 'light' || value === 'auto' ? value : undefined;
}

function parseNumber(value: string | null, fallback: number): number {
  const n = value === null || value.trim() === '' ? Number.NaN : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function complete(svgs: (string | undefined)[]): string[] | undefined {
  return svgs.length > 0 && svgs.every(svg => svg !== undefined) ? (svgs as string[]) : undefined;
}

/** The element or shadow host that contains `node`, so lookups cross shadow roots. */
function parentOf(node: Element): Element | null {
  if (node.parentElement) return node.parentElement;
  const root = node.getRootNode();
  return root instanceof ShadowRoot ? root.host : null;
}

function findProvider(from: Element): SkillIconsProviderElement | null {
  for (let node = parentOf(from); node; node = parentOf(node)) {
    if (node.localName === PROVIDER_TAG) return node as SkillIconsProviderElement;
  }
  return null;
}

/** What to draw for the current attributes, computed by the concrete element. */
interface Plan {
  /** Nothing to draw: unknown or empty names. */
  empty: boolean;
  width: number;
  height: number;
  /** Only `width` is set on the <img> when false (grids keep their aspect ratio). */
  squareImg: boolean;
  alt: string;
  /** In `latest` mode, one URL per theme variant. */
  remote?: string[];
  /** Local mode: identifies the inputs of `load`. */
  id: string;
  parts: string[];
  peek: (part: string) => string | undefined;
  load: (part: string) => Promise<string | undefined>;
}

abstract class SkillBaseElement extends Base {
  static get observedAttributes(): string[] {
    return ['theme', 'size', 'latest', 'base-url', 'alt', 'img-class'];
  }

  #state: { id: string; svgs: string[] | undefined } | undefined;
  #loading = '';
  #drawn: string | undefined;

  protected abstract plan(themes: Theme[]): Plan;

  /** The theme set on this element, if any. */
  get theme(): ThemeOption | undefined {
    return parseTheme(this.getAttribute('theme'));
  }
  set theme(value: ThemeOption | undefined) {
    this.#setAttr('theme', value);
  }

  /** The theme actually used: own theme, else the nearest provider's, else 'dark'. */
  get effectiveTheme(): ThemeOption {
    if (this.theme) return this.theme;
    let provider = findProvider(this);
    while (provider && !provider.theme) provider = findProvider(provider);
    return provider?.theme ?? DEFAULT_THEME;
  }

  /** Size of one icon in pixels. */
  get size(): number {
    return parseNumber(this.getAttribute('size'), DEFAULT_SIZE);
  }
  set size(value: number | undefined) {
    this.#setAttr('size', value === undefined ? undefined : String(value));
  }

  /** Load from the deployed API instead of the bundle. */
  get latest(): boolean {
    const value = this.getAttribute('latest');
    return value !== null && value !== 'false';
  }
  set latest(value: boolean) {
    this.#setAttr('latest', value ? '' : undefined);
  }

  get baseUrl(): string | undefined {
    return this.getAttribute('base-url') ?? undefined;
  }
  set baseUrl(value: string | undefined) {
    this.#setAttr('base-url', value);
  }

  /** Alt text for the <img>. Defaults to the icon names. */
  get alt(): string | undefined {
    return this.getAttribute('alt') ?? undefined;
  }
  set alt(value: string | undefined) {
    this.#setAttr('alt', value);
  }

  /** Class for the generated <img> (and the placeholder). */
  get imgClass(): string | undefined {
    return this.getAttribute('img-class') ?? undefined;
  }
  set imgClass(value: string | undefined) {
    this.#setAttr('img-class', value);
  }

  #setAttr(name: string, value: string | undefined): void {
    if (value === undefined) this.removeAttribute(name);
    else this.setAttribute(name, value);
  }

  connectedCallback(): void {
    this.refresh();
  }

  disconnectedCallback(): void {
    // Drop any in-flight load; the next connect starts over from the cache.
    this.#loading = '';
  }

  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue !== newValue) this.refresh();
  }

  /** Re-renders. Called on attribute changes and when an enclosing provider's theme changes. */
  refresh(): void {
    if (!this.isConnected) return;
    const themes = themeVariants(this.effectiveTheme);
    const plan = this.plan(themes);
    if (plan.empty) {
      this.#loading = '';
      this.#draw('empty', () => []);
      return;
    }

    let sources: string[] | undefined;
    if (plan.remote) {
      this.#loading = '';
      sources = plan.remote;
    } else {
      const read = () => complete(plan.parts.map(plan.peek));
      const cached = read();
      if (cached) {
        this.#state = { id: plan.id, svgs: cached };
        this.#loading = '';
      } else if (this.#loading !== plan.id) {
        this.#loading = plan.id;
        const id = plan.id;
        Promise.all(plan.parts.map(plan.load))
          .then(loaded => {
            // Stale: inputs changed (or the element left the page) while loading.
            if (this.#loading !== id) return;
            this.#loading = '';
            this.#state = { id, svgs: complete(loaded) };
            this.refresh();
          })
          .catch(() => {
            if (this.#loading === id) this.#loading = '';
          });
      }
      // Keep the previous SVGs while the new ones load, so changes don't flash a placeholder.
      sources = (cached ?? this.#state?.svgs)?.map(svgDataUri);
    }

    const cls = this.imgClass ?? '';
    const key = JSON.stringify([
      sources ?? null,
      plan.width,
      plan.height,
      plan.squareImg,
      this.alt ?? plan.alt,
      cls,
    ]);
    this.#draw(key, () => this.#build(plan, sources, cls));
  }

  #draw(key: string, build: () => Node[]): void {
    if (this.#drawn === key) return;
    this.#drawn = key;
    this.replaceChildren(...build());
  }

  #build(plan: Plan, sources: string[] | undefined, cls: string): Node[] {
    const doc = this.ownerDocument;
    if (!sources) {
      const span = doc.createElement('span');
      span.setAttribute('aria-hidden', 'true');
      if (cls) span.className = cls;
      span.style.display = 'inline-block';
      span.style.width = `${plan.width}px`;
      span.style.height = `${plan.height}px`;
      return [span];
    }
    const [src, lightSrc] = sources;
    const img = doc.createElement('img');
    img.alt = this.alt ?? plan.alt;
    img.setAttribute('width', String(plan.width));
    if (plan.squareImg) img.setAttribute('height', String(plan.height));
    if (cls) img.className = cls;
    img.src = src as string;
    if (!lightSrc || lightSrc === src) return [img];
    const picture = doc.createElement('picture');
    const source = doc.createElement('source');
    source.media = LIGHT_MEDIA;
    source.srcset = lightSrc;
    picture.append(source, img);
    return [picture];
  }
}

export class SkillIconElement extends SkillBaseElement {
  /** Icon name or alias, e.g. "react" or "js". */
  get name(): string {
    return this.getAttribute('name') ?? '';
  }
  set name(value: string | IconName) {
    this.setAttribute('name', value);
  }

  static override get observedAttributes(): string[] {
    return [...SkillBaseElement.observedAttributes, 'name'];
  }

  protected plan(themes: Theme[]): Plan {
    const { name, size } = this;
    const base = {
      width: size,
      height: size,
      squareImg: true,
      alt: name,
      parts: [] as string[],
      peek: peekIcon,
      load: loadIcon,
    };
    if (this.latest) {
      const remote = themes.map(t =>
        remoteIconsUrl({ icons: [name], theme: t, perLine: 1, baseUrl: this.baseUrl }),
      );
      return { ...base, empty: name.trim() === '', remote, id: '' };
    }
    const keys = themes.flatMap(t => iconKey(name, t) ?? []);
    return { ...base, empty: keys.length === 0, parts: keys, id: keys.join(',') };
  }
}

export class SkillIconsElement extends SkillBaseElement {
  static override get observedAttributes(): string[] {
    return [...SkillBaseElement.observedAttributes, 'names', 'per-line'];
  }

  /** Icon names or aliases. The attribute is a comma separated list. */
  get names(): string[] {
    return (this.getAttribute('names') ?? '')
      .split(',')
      .map(n => n.trim())
      .filter(Boolean);
  }
  set names(value: readonly string[] | string) {
    this.setAttribute('names', typeof value === 'string' ? value : value.join(','));
  }

  /** Icons per line, between 1 and 50. */
  get perLine(): number {
    return parseNumber(this.getAttribute('per-line'), DEFAULT_PER_LINE);
  }
  set perLine(value: number | undefined) {
    if (value === undefined) this.removeAttribute('per-line');
    else this.setAttribute('per-line', String(value));
  }

  protected plan(themes: Theme[]): Plan {
    const { perLine, latest } = this;
    const known = latest ? this.names : this.names.filter(name => iconKey(name));
    const { width, height } = iconsSize(known.length, perLine, this.size);
    const base = {
      empty: known.length === 0,
      width,
      height,
      squareImg: false,
      alt: known.join(', '),
    };
    if (latest) {
      const remote = themes.map(t =>
        remoteIconsUrl({ icons: known, theme: t, perLine, baseUrl: this.baseUrl }),
      );
      return { ...base, remote, id: '', parts: [], peek: peekIcon, load: loadIcon };
    }
    return {
      ...base,
      id: `${known.join(',')}|${themes.join(',')}|${perLine}`,
      parts: themes,
      peek: t => peekIcons(known, t as Theme, perLine),
      load: t => loadIcons(known, t as Theme, perLine),
    };
  }
}

/**
 * Sets the default theme for the icons inside it. Icons look their provider up with `closest`
 * (crossing shadow roots), so there is no registration step. When `theme` changes, the provider
 * calls `refresh()` on every icon below it; a provider without `theme` is skipped, which makes
 * it inherit from the next one out. Takes no layout space of its own.
 */
export class SkillIconsProviderElement extends Base {
  static get observedAttributes(): string[] {
    return ['theme'];
  }

  get theme(): ThemeOption | undefined {
    return parseTheme(this.getAttribute('theme'));
  }
  set theme(value: ThemeOption | undefined) {
    if (value === undefined) this.removeAttribute('theme');
    else this.setAttribute('theme', value);
  }

  connectedCallback(): void {
    if (!this.style.display) this.style.display = 'contents';
    // Icons upgraded before this provider was defined resolved their theme without it.
    this.#notify();
  }

  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue !== newValue) this.#notify();
  }

  #notify(): void {
    if (!this.isConnected) return;
    for (const el of Array.from(this.querySelectorAll(`${ICON_TAG}, ${ICONS_TAG}`))) {
      (el as SkillBaseElement).refresh();
    }
  }
}

/** Registers the three elements. Safe to call repeatedly and on the server (no-op there). */
export function defineSkillIcons(): void {
  if (typeof customElements === 'undefined') return;
  const entries: [string, CustomElementConstructor][] = [
    [ICON_TAG, SkillIconElement],
    [ICONS_TAG, SkillIconsElement],
    [PROVIDER_TAG, SkillIconsProviderElement],
  ];
  for (const [tag, ctor] of entries) {
    if (!customElements.get(tag)) customElements.define(tag, ctor);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'skill-icon': SkillIconElement;
    'skill-icons': SkillIconsElement;
    'skill-icons-provider': SkillIconsProviderElement;
  }
}
