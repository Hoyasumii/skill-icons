import { useState } from 'react';
import { BookmarkIcon, Trash2Icon, XIcon } from 'lucide-react';
import { SectionLabel } from '@/components/section-label';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { useI18n } from '@/i18n';
import { iconSrc } from '@/lib/icons';
import { MAX_SAVED_STACKS, type SavedStack } from '@/lib/saved-stacks';
import { isStackSelected } from '@/lib/stack-selection';
import { cn } from '@/lib/utils';
import type { Theme } from '../../shared/icons';

interface SavedStacksProps {
  stacks: SavedStack[];
  /** The current stack: a saved one whose icons are all in it shows as selected. */
  selected: string[];
  theme: Theme;
  onToggle: (icons: string[]) => void;
  onRemove: (index: number) => void;
  onClear: () => void;
}

/** Same layout as the ready-made stacks; only rendered once something is saved. */
export function SavedStacks({
  stacks,
  selected,
  theme,
  onToggle,
  onRemove,
  onClear,
}: SavedStacksProps) {
  const { t } = useI18n();
  const [confirmOpen, setConfirmOpen] = useState(false);
  if (!stacks.length) return null;

  return (
    <section aria-labelledby="saved-title" className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-2">
        <SectionLabel id="saved-title" icon={BookmarkIcon}>
          {t.saved.label} · {t.saved.count(stacks.length, MAX_SAVED_STACKS)}
        </SectionLabel>
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className="relative font-mono text-xs underline underline-offset-3 after:absolute after:-inset-3 after:content-['']"
        >
          {t.saved.removeAll}
        </button>
      </div>
      <ul className="-mx-4 flex gap-2.5 overflow-x-auto px-4 pb-0.5 scrollbar-none lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
        {stacks.map((stack, index) => {
          const current = isStackSelected(stack.icons, selected);
          return (
            <li
              key={`${index}-${stack.name}`}
              className="relative w-[200px] min-w-0 shrink-0 lg:w-auto"
            >
              <button
                type="button"
                aria-label={t.saved.toggle(stack.name)}
                aria-pressed={current}
                onClick={() => onToggle(stack.icons)}
                className={cn(
                  'flex size-full flex-col gap-2.5 rounded-lg border-2 p-3 pr-12 text-left transition-colors',
                  current
                    ? 'border-foreground bg-highlight text-highlight-foreground'
                    : 'border-border bg-card hover:border-foreground/40',
                )}
              >
                <span className="max-w-full truncate text-base font-semibold">{stack.name}</span>
                <span className="flex flex-wrap gap-1">
                  {stack.icons.map(name => (
                    <img key={name} src={iconSrc(name, theme)} alt="" className="size-6" />
                  ))}
                </span>
              </button>
              <button
                type="button"
                aria-label={t.saved.remove(stack.name)}
                onClick={() => onRemove(index)}
                className={cn(
                  'absolute top-1 right-1 inline-flex size-10 items-center justify-center rounded-md transition-colors',
                  current
                    ? 'text-highlight-foreground hover:bg-highlight-foreground/10'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <XIcon className="size-4" strokeWidth={2.2} />
              </button>
            </li>
          );
        })}
      </ul>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogTitle className="flex items-center gap-2.5">
            <Trash2Icon aria-hidden="true" className="size-[22px] shrink-0 text-destructive" />
            {t.saved.clearTitle}
          </DialogTitle>
          <DialogDescription>{t.saved.clearText(stacks.length)}</DialogDescription>
          <div className="flex flex-wrap justify-end gap-2.5">
            <DialogClose asChild>
              <Button variant="outline" size="lg" className="font-semibold">
                {t.saved.cancel}
              </Button>
            </DialogClose>
            <Button
              size="lg"
              className="border-destructive bg-destructive text-white hover:bg-destructive/90"
              onClick={() => {
                onClear();
                setConfirmOpen(false);
              }}
            >
              {t.saved.clearConfirm}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
