import * as React from "react"
import { cn } from "cn"
import { Dialog as DialogPrimitive } from "radix-ui"

/**
 * Bottom sheet on top of Radix Dialog: focus trap, Escape, scrim click and
 * focus restore on close come from the primitive.
 */
function Sheet(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="sheet" {...props} />
}

function SheetClose(props: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetTitle(props: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title data-slot="sheet-title" {...props} />
}

function SheetContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        data-slot="sheet-overlay"
        className="fixed inset-0 z-40 bg-scrim duration-[380ms] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
      />
      <DialogPrimitive.Content
        data-slot="sheet-content"
        aria-describedby={undefined}
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 flex max-h-[88dvh] flex-col overflow-y-auto rounded-t-2xl bg-card px-4 pt-5 pb-[calc(28px+env(safe-area-inset-bottom))] text-foreground shadow-[0_-1px_0_var(--border)] outline-none duration-[380ms] ease-sheet data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-[105%] data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-[105%]",
          className
        )}
        {...props}
      >
        <span
          aria-hidden="true"
          className="mx-auto -mt-2 mb-5 h-[5px] w-11 shrink-0 rounded-full bg-border"
        />
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

export { Sheet, SheetClose, SheetContent, SheetTitle }
