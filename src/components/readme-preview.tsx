import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type Ref,
  type RefObject,
} from 'react';
import {
  CheckIcon,
  EyeIcon,
  FileTextIcon,
  ImageIcon,
  LinkIcon,
  PencilIcon,
  RefreshCcwIcon,
  type LucideIcon,
} from 'lucide-react';
import { OgCover } from '@/components/og-cover';
import { SectionLabel } from '@/components/section-label';
import { Button } from '@/components/ui/button';
import { useCopy } from '@/hooks/use-copy';
import { useI18n } from '@/i18n';
import { cn } from '@/lib/utils';
import { cleanTitle, MAX_TITLE_LENGTH } from '../../shared/badge-title';
import {
  API_URL,
  buildIconsUrl,
  DEFAULT_THEME,
  type IconsUrlOptions,
  type Theme,
} from '../../shared/icons';
import { OG_DEFAULT_TITLE, OG_HEIGHT, OG_WIDTH } from '../../shared/og-layout';

const FLIP_MS = 640;

/** Each face's own height, kept current as images load, the title wraps or the stack changes. */
function useHeights(front: RefObject<HTMLElement | null>, back: RefObject<HTMLElement | null>) {
  const [heights, setHeights] = useState<{ front?: number; back?: number }>({});

  useLayoutEffect(() => {
    const faces = { front: front.current, back: back.current };
    // offsetHeight ignores the flip's transforms.
    const measure = () =>
      setHeights({ front: faces.front?.offsetHeight, back: faces.back?.offsetHeight });
    measure();
    const observer = new ResizeObserver(measure);
    for (const face of Object.values(faces)) if (face) observer.observe(face);
    return () => observer.disconnect();
  }, [front, back]);

  return heights;
}

interface FaceHeaderProps {
  children: ReactNode;
  icon: LucideIcon;
  action: string;
  onAction: () => void;
  actionRef: Ref<HTMLButtonElement>;
  disabled?: boolean;
}

function FaceHeader({
  children,
  icon: Icon,
  action,
  onAction,
  actionRef,
  disabled,
}: FaceHeaderProps) {
  return (
    <div className="flex min-h-11 items-center justify-between gap-2 border-b py-1.5 pr-1.5 pl-3">
      <span className="flex min-w-0 items-center gap-1.5 font-mono text-xs opacity-75">
        {children}
      </span>
      <Button
        ref={actionRef}
        variant="hairline"
        size="sm"
        disabled={disabled}
        onClick={onAction}
        className="h-8 gap-1.5 px-2.5 font-mono text-xs font-medium"
      >
        <Icon className="size-3.5" strokeWidth={2.2} />
        {action}
      </Button>
    </div>
  );
}

/** A secondary copy: hairline, ink once copied, never the yellow. */
function CopyCoverLink({ value }: { value: string }) {
  const { t } = useI18n();
  const { copied, copy } = useCopy();
  const Icon = copied ? CheckIcon : LinkIcon;

  return (
    <Button
      variant="hairline"
      onClick={() => copy(value)}
      className={cn(
        'h-11 w-full',
        copied && 'border-foreground bg-foreground text-background hover:bg-foreground',
      )}
    >
      <Icon className="size-4" strokeWidth={copied ? 2.6 : 2.2} />
      <span aria-live="polite">{copied ? t.preview.coverLinkCopied : t.preview.copyCoverLink}</span>
    </Button>
  );
}

interface ReadmePreviewProps {
  options: IconsUrlOptions;
  label: string;
  fileName: string;
  /** Names the front face on the back's button ("view README", "view component"). */
  frontName: string;
  /** The badge title as typed; undefined until edited, so it follows the language. */
  title: string | undefined;
  /** Undefined goes back to the default title, which follows the language. */
  onTitleChange: (title: string | undefined) => void;
  /** The title the copied link carries; undefined while it is the default. */
  linkTitle: string | undefined;
  /** The cover's background, the site theme; the badge itself ignores it. */
  bg: Theme;
}

/**
 * The real badge on a page that follows the site theme; its icons follow the icon theme. It
 * flips over to the card a shared link unfurls into, which follows both the same way.
 */
export function ReadmePreview({
  options,
  label,
  fileName,
  frontName,
  title,
  onTitleChange,
  linkTitle,
  bg,
}: ReadmePreviewProps) {
  const { t } = useI18n();
  const inputId = useId();
  const [flipped, setFlipped] = useState(false);
  const toCover = useRef<HTMLButtonElement>(null);
  const toFront = useRef<HTMLButtonElement>(null);
  const frontFace = useRef<HTMLDivElement>(null);
  const backFace = useRef<HTMLDivElement>(null);
  const heights = useHeights(frontFace, backFace);
  const [turning, setTurning] = useState(false);
  const turnTimer = useRef<number>(undefined);
  useEffect(() => () => window.clearTimeout(turnTimer.current), []);
  const empty = options.icons.length === 0;
  // Dev previews hit the local Worker; the built site (Pages is static) uses the public API.
  const src = buildIconsUrl(import.meta.env.DEV ? '' : API_URL, options);
  // The cover button copies the image itself (/og), the same query as the /icons link.
  const coverImage = buildIconsUrl(API_URL, { ...options, bg, title: linkTitle }).replace(
    '/icons?',
    '/og?',
  );

  const flip = (next: boolean) => {
    setFlipped(next);
    setTurning(true);
    window.clearTimeout(turnTimer.current);
    turnTimer.current = window.setTimeout(() => setTurning(false), FLIP_MS);
    // The face turning in is visible from the start, so its button can take focus right away.
    requestAnimationFrame(() => (next ? toFront : toCover).current?.focus({ preventScroll: true }));
  };

  // The card is as tall as the face showing. While it turns, the height changes around the
  // midpoint, when the card is edge-on; other changes (content) settle quickly.
  const height = flipped ? heights.back : heights.front;
  const inner: CSSProperties = {
    height: height ?? 'auto',
    transitionProperty: 'transform, height',
    transitionDuration: `${FLIP_MS}ms, ${turning ? 620 : 240}ms`,
    transitionTimingFunction: `cubic-bezier(.32,1.25,.5,1), ${turning ? 'cubic-bezier(.65,0,.35,1)' : 'cubic-bezier(.22,1,.36,1)'}`,
  };

  const face = (hidden: boolean) =>
    cn(
      'overflow-hidden rounded-lg border bg-background text-foreground backface-hidden',
      // The face turning away leaves the tab order and the a11y tree once it is past edge-on;
      // until then backface-visibility is what hides it.
      'transition-[visibility] duration-0',
      hidden && 'invisible delay-300',
    );

  return (
    <div className="flex flex-col gap-2">
      <SectionLabel icon={EyeIcon}>{flipped ? t.preview.cover : label}</SectionLabel>
      {/* Room for the turn above and to the sides; the bottom stays shut so the face turning
          away never paints over the format tabs while they move. */}
      <div className="perspective-[1400px] [clip-path:inset(-120px_-120px_-6px_-120px)]">
        <div style={inner} className={cn('relative transform-3d', flipped && 'rotate-y-180')}>
          <div ref={frontFace} aria-hidden={flipped} className={cn(face(flipped), 'relative')}>
            <FaceHeader
              icon={ImageIcon}
              action={t.preview.viewCover}
              onAction={() => flip(true)}
              actionRef={toCover}
              disabled={empty}
            >
              <FileTextIcon aria-hidden="true" className="size-3.5 shrink-0" />
              <span className="truncate">{fileName}</span>
            </FaceHeader>
            <div className="flex flex-col gap-3 px-3.5 pt-2 pb-5">
              <div className="flex min-h-11 items-center gap-2 border-b-2 border-dashed border-border focus-within:border-foreground">
                <label htmlFor={inputId} className="sr-only">
                  {t.preview.titleLabel}
                </label>
                <input
                  id={inputId}
                  value={title ?? t.preview.heading}
                  onChange={e => onTitleChange(e.target.value)}
                  // Left empty, it goes back to the default instead of staying blank.
                  onBlur={() => !cleanTitle(title) && onTitleChange(undefined)}
                  maxLength={MAX_TITLE_LENGTH}
                  placeholder={t.preview.heading}
                  autoComplete="off"
                  className="h-11 min-w-0 flex-1 bg-transparent text-lg font-bold tracking-[-0.01em] placeholder:text-muted-foreground"
                />
                <PencilIcon aria-hidden="true" className="size-4 shrink-0 opacity-60" />
              </div>
              {empty ? (
                <span className="text-sm opacity-70">{t.preview.empty}</span>
              ) : (
                <img src={src} alt={t.preview.alt} className="mx-auto h-auto max-w-full" />
              )}
            </div>
          </div>

          <div
            ref={backFace}
            aria-hidden={!flipped}
            className={cn(face(!flipped), 'absolute inset-x-0 top-0 rotate-y-180')}
          >
            <FaceHeader
              icon={RefreshCcwIcon}
              action={frontName}
              onAction={() => flip(false)}
              actionRef={toFront}
            >
              og:image · {OG_WIDTH}×{OG_HEIGHT}
            </FaceHeader>
            <div className="flex flex-col gap-2.5 p-3">
              <div
                role="img"
                aria-label={t.preview.coverAlt}
                className="overflow-hidden rounded-md border"
              >
                <OgCover
                  icons={options.icons}
                  theme={options.theme ?? DEFAULT_THEME}
                  title={linkTitle ?? OG_DEFAULT_TITLE}
                  link={buildIconsUrl(API_URL, { ...options, bg })}
                />
              </div>
              <CopyCoverLink key={coverImage} value={coverImage} />
              <p className="font-mono text-[11px] text-muted-foreground">{t.preview.coverHint}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
