import { useState } from 'react';
import { BookmarkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/i18n';
import { displayNameOf, iconSrc } from '@/lib/icons';
import { MAX_SAVED_STACKS, MAX_STACK_NAME } from '@/lib/saved-stacks';
import type { Theme } from '../../shared/icons';

interface SaveStackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  icons: string[];
  theme: Theme;
  savedCount: number;
  onSave: (name: string) => void;
}

/** Names the current stack before it goes to "My stacks". Enter saves, Escape cancels. */
export function SaveStackDialog({
  open,
  onOpenChange,
  icons,
  theme,
  savedCount,
  onSave,
}: SaveStackDialogProps) {
  const { t } = useI18n();
  const [name, setName] = useState('');
  const valid = name.trim().length > 0;

  return (
    <Dialog
      open={open}
      onOpenChange={next => {
        if (next) setName('');
        onOpenChange(next);
      }}
    >
      <DialogContent aria-describedby={undefined}>
        <form
          className="flex flex-col gap-4"
          onSubmit={event => {
            event.preventDefault();
            if (!valid) return;
            onSave(name);
            onOpenChange(false);
          }}
        >
          <DialogTitle className="flex items-center gap-2.5">
            <BookmarkIcon aria-hidden="true" className="size-[22px] shrink-0" />
            {t.saved.saveTitle}
          </DialogTitle>
          <div className="flex flex-wrap gap-1 rounded-lg bg-background p-2.5">
            {icons.map(icon => (
              <img
                key={icon}
                src={iconSrc(icon, theme)}
                alt={displayNameOf(icon)}
                className="size-8"
              />
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <label htmlFor="stack-name" className="text-[15px] font-semibold">
                {t.saved.name}
              </label>
              <span aria-hidden="true" className="font-mono text-xs text-muted-foreground">
                {name.length}/{MAX_STACK_NAME}
              </span>
            </div>
            <Input
              id="stack-name"
              autoFocus
              autoComplete="off"
              maxLength={MAX_STACK_NAME}
              value={name}
              onChange={event => setName(event.target.value)}
              placeholder={t.saved.namePlaceholder}
              className="border-foreground px-3.5"
            />
            <span className="font-mono text-xs text-muted-foreground">
              {t.saved.slots(MAX_SAVED_STACKS - savedCount, MAX_SAVED_STACKS)}
            </span>
          </div>
          <div className="flex flex-wrap justify-end gap-2.5">
            <DialogClose asChild>
              <Button type="button" variant="outline" size="lg" className="font-semibold">
                {t.saved.cancel}
              </Button>
            </DialogClose>
            <Button
              type="submit"
              variant="highlight"
              size="lg"
              disabled={!valid}
              className="px-[22px] disabled:opacity-50"
            >
              {t.saved.save}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
