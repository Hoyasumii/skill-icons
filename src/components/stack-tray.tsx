import { useState, type ReactNode } from 'react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookmarkIcon,
  MousePointerClickIcon,
  MoveHorizontalIcon,
  ShuffleIcon,
  SquareStackIcon,
  Trash2Icon,
} from 'lucide-react';
import { SaveStackDialog } from '@/components/save-stack-dialog';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { SheetTitle } from '@/components/ui/sheet';
import { useI18n } from '@/i18n';
import { displayNameOf, iconSrc } from '@/lib/icons';
import { popClass } from '@/lib/motion';
import { MAX_SAVED_STACKS } from '@/lib/saved-stacks';
import { cn } from '@/lib/utils';
import type { Theme } from '../../shared/icons';

/** The stack as the dock and the tray see it. `lifted` is the item whose controls are open. */
export interface StackProps {
  icons: string[];
  theme: Theme;
  lifted: string | null;
  isPopping: (name: string) => boolean;
  onLift: (name: string) => void;
  onMove: (offset: -1 | 1) => void;
  onRemove: () => void;
}

interface StackItemProps {
  stack: StackProps;
  name: string;
  index: number;
  className?: string;
  children?: ReactNode;
}

/** Tapping an item lifts it; the yellow fill marks it in both the dock and the tray. */
export function StackItem({ stack, name, index, className, children }: StackItemProps) {
  const { t } = useI18n();
  const lifted = stack.lifted === name;

  return (
    <li className="shrink-0">
      <button
        type="button"
        aria-pressed={lifted}
        aria-label={t.stack.position(displayNameOf(name), index + 1)}
        onClick={() => stack.onLift(name)}
        className={cn(
          'relative block rounded-md transition-colors',
          lifted && 'bg-highlight',
          className,
        )}
      >
        <img
          src={iconSrc(name, stack.theme)}
          alt=""
          className={cn(
            'block size-full transition-[scale,rotate,translate] duration-[340ms] ease-spring',
            stack.isPopping(name) ? popClass(index) : lifted && '-translate-y-[3px] -rotate-6',
          )}
        />
        {children}
      </button>
    </li>
  );
}

/** Move and remove controls for the lifted item. `inverted` matches the dock's ink background. */
export function LiftControls({ stack, inverted }: { stack: StackProps; inverted?: boolean }) {
  const { t } = useI18n();
  if (!stack.lifted) return null;

  const index = stack.icons.indexOf(stack.lifted);
  const name = displayNameOf(stack.lifted);
  const control = cn(inverted && 'border-background/25 hover:bg-background/10');

  return (
    <div
      className={cn(
        'flex items-center gap-1.5',
        !inverted && 'rounded-lg border-2 border-foreground py-2 pr-2 pl-3',
      )}
    >
      <span className="min-w-0 flex-1 truncate text-[15px] font-semibold">
        {name}{' '}
        <span
          className={cn(
            'font-mono text-xs font-normal',
            inverted ? 'opacity-70' : 'text-muted-foreground',
          )}
        >
          #{index + 1}
        </span>
      </span>
      <Button
        variant="hairline"
        size="control"
        className={control}
        aria-label={t.stack.moveLeft(name)}
        disabled={index === 0}
        onClick={() => stack.onMove(-1)}
      >
        <ArrowLeftIcon />
      </Button>
      <Button
        variant="hairline"
        size="control"
        className={control}
        aria-label={t.stack.moveRight(name)}
        disabled={index === stack.icons.length - 1}
        onClick={() => stack.onMove(1)}
      >
        <ArrowRightIcon />
      </Button>
      <Button variant="hairline" size="control" className={control} onClick={stack.onRemove}>
        <Trash2Icon className="size-4" />
        {t.stack.remove}
      </Button>
    </div>
  );
}

interface StackTrayProps {
  stack: StackProps;
  /** In the sheet, the heading also names the dialog. */
  compact: boolean;
  actions?: ReactNode;
  /** How many stacks are already saved; at the limit, saving is off. */
  savedCount: number;
  onSave: (name: string) => void;
  onShuffle: () => void;
  onClear: () => void;
}

export function StackTray({
  stack,
  compact,
  actions,
  savedCount,
  onSave,
  onShuffle,
  onClear,
}: StackTrayProps) {
  const { t } = useI18n();
  const [saveOpen, setSaveOpen] = useState(false);
  const count = stack.icons.length;
  const full = savedCount >= MAX_SAVED_STACKS;

  const heading = (
    <h2 className="flex items-center gap-2 text-2xl leading-[1.2] font-bold tracking-[-0.02em]">
      <SquareStackIcon aria-hidden="true" className="size-[22px] shrink-0" strokeWidth={2.2} />
      {t.stack.title}
      <span className="font-mono text-sm font-medium text-muted-foreground">
        {String(count).padStart(2, '0')}
      </span>
    </h2>
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {compact ? <SheetTitle asChild>{heading}</SheetTitle> : heading}
        <div className="flex gap-1.5">
          <Button
            variant="hairline"
            size="sm"
            disabled={count === 0 || full}
            onClick={() => setSaveOpen(true)}
          >
            <BookmarkIcon className="size-4" strokeWidth={2.2} />
            {t.saved.save}
          </Button>
          <Button variant="hairline" size="sm" disabled={count < 2} onClick={onShuffle}>
            <ShuffleIcon className="size-4" strokeWidth={2.2} />
            {t.stack.shuffle}
          </Button>
          {actions}
        </div>
      </div>

      {count === 0 ? (
        <p className="flex items-center gap-3 rounded-lg border-2 border-dashed px-4 py-5 text-[15px] text-muted-foreground">
          <MousePointerClickIcon aria-hidden="true" className="size-[22px] shrink-0" />
          {t.stack.empty}
        </p>
      ) : (
        <>
          <ol
            aria-label={t.stack.title}
            className="flex flex-wrap gap-1.5 rounded-lg bg-background p-2"
          >
            {stack.icons.map((name, index) => (
              <StackItem
                key={name}
                stack={stack}
                name={name}
                index={index}
                className="size-12 p-[5px]"
              >
                <span className="absolute -bottom-[3px] left-[3px] font-mono text-[10px] font-semibold text-muted-foreground">
                  {index + 1}
                </span>
              </StackItem>
            ))}
          </ol>
          <Reveal>
            {stack.lifted ? (
              <LiftControls key="lift" stack={stack} />
            ) : (
              <p key="hint" className="font-mono text-xs text-muted-foreground">
                <MoveHorizontalIcon
                  aria-hidden="true"
                  className="mr-1 inline size-3.5 align-[-3px]"
                />
                {t.stack.hint} ·{' '}
                <button
                  type="button"
                  onClick={onClear}
                  className="relative text-foreground underline underline-offset-3 after:absolute after:-inset-3 after:content-['']"
                >
                  {t.stack.clearAll}
                </button>
              </p>
            )}
          </Reveal>
          {full && (
            <p className="font-mono text-xs text-muted-foreground">
              {t.saved.full(MAX_SAVED_STACKS)}
            </p>
          )}
        </>
      )}

      <SaveStackDialog
        open={saveOpen}
        onOpenChange={setSaveOpen}
        icons={stack.icons}
        theme={stack.theme}
        savedCount={savedCount}
        onSave={onSave}
      />
    </div>
  );
}
