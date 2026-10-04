import * as React from "react"
import { cn } from "cn"
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui"

import { SlidingIndicator } from "@/components/ui/sliding-indicator"
import { toggleVariants } from "@/components/ui/toggle"

/** Segmented control: a soft track with equal-width segments. */
function ToggleGroup({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root>) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      className={cn("relative isolate flex w-full rounded-lg bg-muted p-[3px]", className)}
      {...props}
    >
      <SlidingIndicator className="rounded-[9px] bg-card shadow-[0_1px_0_var(--border)]" />
      {children}
    </ToggleGroupPrimitive.Root>
  )
}

function ToggleGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      // The sliding fill draws the "on" surface.
      className={cn(
        toggleVariants(),
        "flex-1 data-[state=on]:bg-transparent data-[state=on]:shadow-none",
        className
      )}
      {...props}
    />
  )
}

export { ToggleGroup, ToggleGroupItem }
