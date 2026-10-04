import type { ComponentProps } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionLabelProps extends ComponentProps<'h2'> {
  icon?: LucideIcon;
}

/** Mono, uppercase label that names a section or a control group. */
export function SectionLabel({ icon: Icon, className, children, ...props }: SectionLabelProps) {
  return (
    <h2
      className={cn(
        'font-mono text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase',
        Icon && 'flex items-start gap-1.5',
        className,
      )}
      {...props}
    >
      {/* As tall as a line of text, so a label that wraps keeps it beside the first line. */}
      {Icon && (
        <Icon aria-hidden="true" className="h-[1.5em] w-[13px] shrink-0" strokeWidth={2.2} />
      )}
      {children}
    </h2>
  );
}
