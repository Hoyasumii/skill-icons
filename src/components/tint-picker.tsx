import { useId, useState } from 'react';
import { CheckIcon, ChevronDownIcon, PipetteIcon, XIcon } from 'lucide-react';
import { Popover } from 'radix-ui';
import { Button } from '@/components/ui/button';
import { useIconSrc } from '@/hooks/use-icon-src';
import { useI18n } from '@/i18n';
import { cn } from '@/lib/utils';
import type { Theme } from '../../shared/icons';
import { parseTint, TINT_SWATCHES, type Tint } from '../../shared/tint';

/** Icons the preview shows when the stack has fewer than this. */
const PREVIEW_COUNT = 6;
const PREVIEW_FALLBACK = ['react', 'typescript', 'docker', 'figma', 'python', 'github'];

const label = 'font-mono text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase';

interface TintPickerProps {
  tint: Tint | undefined;
  theme: Theme;
  /** The stack, in order: its first icons make the preview. */
  icons: string[];
  /** `origin` is the control clicked, for discrete picks; live edits leave it out. */
  onChange: (tint: Tint | undefined, origin?: Element) => void;
  labelledBy: string;
}

/** The hex field: typing a full color applies it; anything else waits until it is one. */
function HexField({ tint, onChange }: { tint: Tint | undefined; onChange: (tint: Tint) => void }) {
  const { t } = useI18n();
  const id = useId();
  const [draft, setDraft] = useState(tint ?? '');
  // A swatch or the system picker replaces whatever was typed.
  const [shown, setShown] = useState(tint);
  if (tint !== shown) {
    setShown(tint);
    setDraft(tint ?? '');
  }

  return (
    <div className="flex h-11 min-w-0 flex-1 items-center gap-1 rounded-lg border-2 border-border bg-card px-3 focus-within:border-foreground">
      <label htmlFor={id} className="sr-only">
        {t.options.tintHex}
      </label>
      <span aria-hidden="true" className="font-mono text-[15px] text-muted-foreground">
        #
      </span>
      <input
        id={id}
        value={draft}
        onChange={e => {
          const value = e.target.value.replace(/^#/, '').slice(0, 6);
          setDraft(value);
          const parsed = value.length === 6 || value.length === 3 ? parseTint(value) : undefined;
          if (parsed) onChange(parsed);
        }}
        onBlur={() => setDraft(tint ?? '')}
        placeholder="5fd3c4"
        maxLength={7}
        spellCheck={false}
        autoComplete="off"
        className="h-full min-w-0 flex-1 bg-transparent font-mono text-base uppercase outline-hidden placeholder:text-muted-foreground placeholder:normal-case"
      />
    </div>
  );
}

/**
 * The icon tint: a trigger showing the first icon in the tint, and a popover with a live
 * preview of the stack, swatches, a hex field and the system color picker for any other color.
 */
export function TintPicker({ tint, theme, icons, onChange, labelledBy }: TintPickerProps) {
  const { t } = useI18n();
  const iconSrc = useIconSrc();
  const preview = [...icons, ...PREVIEW_FALLBACK.filter(name => !icons.includes(name))].slice(
    0,
    PREVIEW_COUNT,
  );

  return (
    <div className="flex gap-2">
      <Popover.Root>
        <Popover.Trigger
          aria-labelledby={labelledBy}
          className="group flex h-13 min-w-0 flex-1 items-center gap-3 rounded-lg border-2 border-border bg-card px-3 text-left transition-colors hover:border-foreground/40 data-[state=open]:border-foreground"
        >
          <img src={iconSrc(preview[0], theme)} alt="" className="size-7 shrink-0" />
          <span
            className={cn(
              'min-w-0 flex-1 truncate',
              tint ? 'font-mono text-[15px] font-semibold uppercase' : 'text-base font-semibold',
            )}
          >
            {tint ? `#${tint}` : t.options.tintNone}
          </span>
          <ChevronDownIcon
            aria-hidden="true"
            strokeWidth={2.4}
            className="size-4 shrink-0 transition-transform duration-[260ms] ease-spring group-data-[state=open]:rotate-180"
          />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            side="bottom"
            align="start"
            sideOffset={8}
            collisionPadding={12}
            aria-labelledby={labelledBy}
            className="z-50 flex max-h-(--radix-popover-content-available-height) w-[min(332px,calc(100vw-24px))] origin-(--radix-popover-content-transform-origin) flex-col gap-3.5 overflow-y-auto rounded-[14px] border-2 border-foreground bg-card p-3 text-foreground shadow-[4px_4px_0_var(--foreground)] data-[state=closed]:animate-out data-[state=closed]:duration-[140ms] data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:duration-[280ms] data-[state=open]:ease-spring data-[state=open]:fade-in-0 data-[state=open]:zoom-in-90"
          >
            <div className="flex flex-col gap-2">
              <span className={label}>{t.options.tintPreview}</span>
              <div className="grid grid-cols-6 gap-1.5 rounded-lg bg-muted p-2">
                {preview.map(name => (
                  <img
                    key={name}
                    src={iconSrc(name, theme)}
                    alt=""
                    className="aspect-square w-full"
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className={label}>{t.options.tintSwatches}</span>
              <div className="grid grid-cols-6 gap-1.5">
                {TINT_SWATCHES.map(swatch => {
                  const selected = swatch === tint;
                  return (
                    <button
                      key={swatch}
                      type="button"
                      aria-pressed={selected}
                      aria-label={t.options.tintSwatch(swatch)}
                      onClick={e => onChange(swatch, e.currentTarget)}
                      style={{ backgroundColor: `#${swatch}` }}
                      className={cn(
                        'flex aspect-square min-h-11 w-full items-center justify-center rounded-[10px] border border-border transition-transform duration-150 ease-spring hover:scale-105',
                        selected && 'outline-2 outline-offset-2 outline-foreground',
                      )}
                    >
                      {selected && (
                        <span className="inline-flex size-5 items-center justify-center rounded-full bg-foreground text-background">
                          <CheckIcon className="size-3.5" strokeWidth={3} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className={label}>{t.options.tintCustom}</span>
              <div className="flex gap-2">
                <HexField tint={tint} onChange={onChange} />
                {/* The system picker: any color, live while it is dragged around. */}
                <label
                  title={t.options.tintSystem}
                  className="relative inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring hover:bg-muted"
                >
                  <PipetteIcon aria-hidden="true" className="size-[18px]" strokeWidth={2.2} />
                  <input
                    type="color"
                    aria-label={t.options.tintSystem}
                    value={`#${tint ?? '5fd3c4'}`}
                    onChange={e => {
                      const parsed = parseTint(e.target.value);
                      if (parsed) onChange(parsed);
                    }}
                    className="absolute inset-0 size-full cursor-pointer opacity-0"
                  />
                </label>
              </div>
            </div>

            <Button
              variant="hairline"
              aria-pressed={!tint}
              onClick={e => onChange(undefined, e.currentTarget)}
              className={cn('w-full', !tint && 'border-foreground bg-muted')}
            >
              {!tint && <CheckIcon strokeWidth={2.6} />}
              {t.options.tintNone}
            </Button>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {tint && (
        <Button
          variant="hairline"
          size="icon"
          aria-label={t.options.tintClear}
          onClick={e => onChange(undefined, e.currentTarget)}
          className="size-13"
        >
          <XIcon />
        </Button>
      )}
    </div>
  );
}
