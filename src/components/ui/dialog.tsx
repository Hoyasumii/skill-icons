import * as React from "react"
import { cn } from "cn"
import { Dialog as DialogPrimitive } from "radix-ui"

/**
 * Centered modal on top of Radix Dialog: focus trap, Escape, scrim click and
 * focus restore on close come from the primitive.
 */
function Dialog(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogClose(props: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-2xl leading-[1.2] font-bold tracking-[-0.02em]", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-base leading-[23px] text-muted-foreground", className)}
      {...props}
    />
  )
}

/** Surface with a 2px ink border and a hard shadow; it springs in with a slight tilt. */
function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        data-slot="dialog-overlay"
        className="fixed inset-0 z-50 bg-scrim data-[state=closed]:animate-out data-[state=closed]:duration-[140ms] data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:duration-200 data-[state=open]:fade-in-0"
      />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 flex w-[calc(100%-32px)] max-w-[420px] -translate-1/2 flex-col gap-4 rounded-[16px] border-2 border-foreground bg-card px-5 pt-[22px] pb-5 text-foreground shadow-[4px_4px_0_var(--foreground)] outline-none data-[state=closed]:animate-out data-[state=closed]:duration-[140ms] data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:duration-300 data-[state=open]:ease-spring data-[state=open]:fade-in-0 data-[state=open]:zoom-in-92 data-[state=open]:spin-in-[-1.5deg]",
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

export { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle }
