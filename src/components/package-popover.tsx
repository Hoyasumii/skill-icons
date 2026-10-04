import { useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { PackageIcon, XIcon } from 'lucide-react';
import { Popover, Tooltip } from 'radix-ui';
import { CodeBlock } from '@/components/code-block';
import { CopyButton } from '@/components/copy-button';
import { FrameworkSelect, InstallRow } from '@/components/package-options';
import { Button } from '@/components/ui/button';
import { useHydrated } from '@/hooks/use-hydrated';
import { useI18n } from '@/i18n';
import { NPM_URL, PACKAGE_NAME } from '@/lib/links';
import { FRAMEWORKS, type FrameworkId } from '@/lib/snippets';
import { cn } from '@/lib/utils';
import type { Theme } from '../../shared/icons';

interface StepProps {
  number: number;
  title: string;
  titleId?: string;
  last?: boolean;
  children: ReactNode;
}

/** A numbered badge, a connector down to the next badge, and the step's content beside them. */
function Step({ number, title, titleId, last, children }: StepProps) {
  return (
    <li className="flex gap-3">
      <div aria-hidden="true" className="flex flex-col items-center gap-1.5">
        <span
          className={cn(
            'inline-flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold',
            last ? 'bg-highlight text-highlight-foreground' : 'bg-foreground text-background',
          )}
        >
          {number}
        </span>
        {!last && <span className="w-0.5 flex-1 rounded-full bg-border" />}
      </div>
      <div className={cn('flex min-w-0 flex-1 flex-col gap-2.5', !last && 'pb-5')}>
        <h3 id={titleId} className="text-[15px] leading-6 font-bold">
          {title}
        </h3>
        {children}
      </div>
    </li>
  );
}

interface PackagePopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  framework: FrameworkId;
  onFrameworkChange: (framework: FrameworkId) => void;
  theme: Theme;
  /** The framework snippet for the current stack. */
  component: string;
  empty: boolean;
}

/**
 * The npm package in three steps, anchored under an icon button in the stack header. It sits
 * over a light scrim and keeps focus inside until it closes.
 */
export function PackagePopover({
  open,
  onOpenChange,
  framework,
  onFrameworkChange,
  theme,
  component,
  empty,
}: PackagePopoverProps) {
  const { t } = useI18n();
  const hydrated = useHydrated();
  const titleId = useId();
  const frameworkLabelId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [tooltip, setTooltip] = useState(false);
  // Focus coming back from the popover shouldn't pop the tooltip open.
  const returningFocus = useRef(false);

  return (
    <Popover.Root open={open} onOpenChange={onOpenChange} modal>
      <Tooltip.Provider delayDuration={250}>
        <Tooltip.Root
          open={tooltip && !open}
          onOpenChange={next => {
            if (next && returningFocus.current) returningFocus.current = false;
            else setTooltip(next);
          }}
        >
          <Tooltip.Trigger asChild>
            <Popover.Trigger asChild>
              <Button
                variant="hairline"
                size="icon-sm"
                aria-label={t.package.open}
                className="aria-expanded:border-foreground aria-expanded:bg-muted"
              >
                <PackageIcon className="size-[17px]" strokeWidth={2.2} />
              </Button>
            </Popover.Trigger>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              side="bottom"
              align="end"
              sideOffset={8}
              collisionPadding={8}
              className="z-50 rounded-md bg-foreground px-2.5 py-1.5 text-[13px] font-semibold whitespace-nowrap text-background data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=instant-open]:animate-in data-[state=instant-open]:fade-in-0"
            >
              {t.package.open}
              <Tooltip.Arrow width={12} height={6} className="fill-foreground" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>

      {hydrated &&
        createPortal(
          <div
            aria-hidden="true"
            className={cn(
              'fixed inset-0 z-50 bg-[rgb(17_17_17/.16)] transition-[opacity,visibility] duration-200 dark:bg-[rgb(0_0_0/.38)]',
              open ? 'visible opacity-100' : 'invisible opacity-0',
            )}
          />,
          document.body,
        )}

      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="end"
          sideOffset={12}
          collisionPadding={12}
          aria-labelledby={titleId}
          onOpenAutoFocus={event => {
            event.preventDefault();
            closeRef.current?.focus();
          }}
          onCloseAutoFocus={() => {
            // Radix focuses the trigger right after this handler.
            returningFocus.current = true;
            setTimeout(() => (returningFocus.current = false));
          }}
          className="z-50 flex max-h-(--radix-popover-content-available-height) w-[min(400px,calc(100vw-24px))] origin-(--radix-popover-content-transform-origin) flex-col rounded-[16px] border-2 border-foreground bg-card text-foreground shadow-[4px_4px_0_var(--foreground),0_24px_48px_rgb(0_0_0/.18)] outline-none data-[state=closed]:animate-out data-[state=closed]:duration-[140ms] data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:duration-300 data-[state=open]:ease-[cubic-bezier(.34,1.56,.64,1)] data-[state=open]:slide-in-from-top-2 data-[state=open]:zoom-in-96"
        >
          {/* The scroller is inside, so the arrow above the border never gets clipped. */}
          <div className="flex min-h-0 flex-col gap-5 overflow-y-auto px-5 pt-4 pb-5">
            <div className="flex items-center gap-2.5">
              <PackageIcon aria-hidden="true" className="size-5 shrink-0" strokeWidth={2.2} />
              <div className="flex min-w-0 flex-1 flex-col">
                <h2 id={titleId} className="text-lg leading-6 font-bold">
                  {t.package.label}
                </h2>
                <span className="truncate font-mono text-xs text-muted-foreground">
                  npm · {PACKAGE_NAME}
                </span>
              </div>
              <Popover.Close asChild>
                <Button ref={closeRef} variant="hairline" size="icon-sm" aria-label={t.stack.close}>
                  <XIcon />
                </Button>
              </Popover.Close>
            </div>

            <ol className="flex flex-col">
              <Step number={1} title={t.package.steps.install}>
                <InstallRow />
              </Step>
              <Step number={2} title={t.package.steps.framework} titleId={frameworkLabelId}>
                <FrameworkSelect
                  value={framework}
                  theme={theme}
                  onChange={onFrameworkChange}
                  labelledBy={frameworkLabelId}
                />
              </Step>
              <Step number={3} title={t.package.steps.copy} last>
                <CodeBlock
                  value={empty ? '—' : component}
                  lang={empty ? 'text' : FRAMEWORKS[framework].lang}
                  size="tall"
                />
                <CopyButton
                  key={component}
                  value={component}
                  label={t.output.copy(FRAMEWORKS[framework].label)}
                  disabled={empty}
                />
              </Step>
            </ol>

            <a
              href={NPM_URL}
              className="inline-flex items-center gap-1.5 self-start font-mono text-xs whitespace-nowrap underline underline-offset-3 hover:no-underline"
            >
              <PackageIcon aria-hidden="true" className="size-[13px] shrink-0" />
              {t.package.viewOnNpm}
            </a>
          </div>

          <Popover.Arrow asChild width={18} height={9}>
            <span className="relative block h-[9px] w-[18px]">
              {/* A rotated square; its two outer edges carry the border into the popover's. */}
              <span className="absolute -top-2 left-[3px] size-3 rotate-45 border-r-2 border-b-2 border-foreground bg-card" />
            </span>
          </Popover.Arrow>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
