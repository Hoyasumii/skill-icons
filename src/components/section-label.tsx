import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

/** Mono, uppercase label that names a section or a control group. */
export function SectionLabel({ className, ...props }: ComponentProps<'h2'>) {
  return (
    <h2
      className={cn(
        'font-mono text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase',
        className,
      )}
      {...props}
    />
  );
}
