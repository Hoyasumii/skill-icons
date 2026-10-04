import type { Ref } from 'react';
import { UploadIcon } from 'lucide-react';
import { LiftControls, StackItem, type StackProps } from '@/components/stack-tray';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { Slide } from '@/components/ui/slide';
import { useI18n } from '@/i18n';

interface DockProps {
  stack: StackProps;
  onExport: () => void;
  /** The sheet hands focus back here when it closes. */
  exportRef: Ref<HTMLButtonElement>;
}

/**
 * Compact only: its icons and the export button, inverted, stuck to the bottom of the scroller.
 * It rises when the stack gets its first icon and sinks away, still showing the last one, when
 * the stack empties.
 */
export function Dock({ stack, onExport, exportRef }: DockProps) {
  const { t } = useI18n();
  const count = stack.icons.length;

  return (
    <Slide
      open={count > 0}
      from="bottom"
      className="sticky bottom-0 z-10 flex flex-col rounded-t-xl bg-foreground px-3 pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom))] text-background lg:hidden"
    >
      <Reveal>
        {stack.lifted && (
          <div key="lift" className="pb-2.5">
            <LiftControls stack={stack} inverted />
          </div>
        )}
      </Reveal>
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
          <UploadIcon strokeWidth={2.4} className="size-4" />
          {t.stack.export}
          <Badge variant="ink" className="h-6">
            {count}
          </Badge>
        </Button>
      </div>
    </Slide>
  );
}
