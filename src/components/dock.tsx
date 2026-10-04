import type { Ref } from 'react';
import { LiftControls, StackItem, type StackProps } from '@/components/stack-tray';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n';

interface DockProps {
  stack: StackProps;
  onExport: () => void;
  /** The sheet hands focus back here when it closes. */
  exportRef: Ref<HTMLButtonElement>;
}

/** Compact only, and only with a stack: its icons and the export button, inverted, stuck to the bottom of the scroller. */
export function Dock({ stack, onExport, exportRef }: DockProps) {
  const { t } = useI18n();
  const count = stack.icons.length;

  return (
    <div className="sticky bottom-0 z-10 flex flex-col gap-2.5 rounded-t-xl bg-foreground px-3 pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom))] text-background lg:hidden">
      <LiftControls stack={stack} inverted />
      <div className="flex items-center gap-2.5">
        <ol
          aria-label={t.stack.title}
          className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto px-0.5 py-1 scrollbar-none"
        >
          {stack.icons.map((name, index) => (
            <StackItem key={name} stack={stack} name={name} index={index} className="size-11 p-1" />
          ))}
        </ol>
        <Button
          ref={exportRef}
          variant="highlight"
          size="lg"
          onClick={onExport}
          className="border-background shadow-none active:translate-0"
        >
          {t.stack.export}
          <Badge variant="ink" className="h-6">
            {count}
          </Badge>
        </Button>
      </div>
    </div>
  );
}
