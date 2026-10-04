import { XIcon } from 'lucide-react';
import { Options } from '@/components/options';
import { Output } from '@/components/output';
import { StackTray, type StackProps } from '@/components/stack-tray';
import { Button } from '@/components/ui/button';
import { SheetClose } from '@/components/ui/sheet';
import { useI18n } from '@/i18n';
import type { Theme } from '../../shared/icons';

interface ExportPanelProps {
  /** Rendered inside the bottom sheet instead of the wide column. */
  compact: boolean;
  stack: StackProps;
  perLine: number;
  onShuffle: () => void;
  onClear: () => void;
  onThemeChange: (theme: Theme) => void;
  onPerLineChange: (perLine: number) => void;
}

export function ExportPanel({
  compact,
  stack,
  perLine,
  onShuffle,
  onClear,
  onThemeChange,
  onPerLineChange,
}: ExportPanelProps) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-[22px]">
      <StackTray
        stack={stack}
        compact={compact}
        onShuffle={onShuffle}
        onClear={onClear}
        actions={
          compact && (
            <SheetClose asChild>
              <Button variant="hairline" size="icon-sm" aria-label={t.stack.close}>
                <XIcon />
              </Button>
            </SheetClose>
          )
        }
      />
      <Options
        theme={stack.theme}
        perLine={perLine}
        onThemeChange={onThemeChange}
        onPerLineChange={onPerLineChange}
      />
      {stack.icons.length > 0 && (
        <Output icons={stack.icons} theme={stack.theme} perLine={perLine} />
      )}
    </div>
  );
}
