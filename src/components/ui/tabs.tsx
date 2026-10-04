import * as React from "react"
import { cn } from "cn"
import { Tabs as TabsPrimitive } from "radix-ui"

import { SlidingIndicator } from "@/components/ui/sliding-indicator"
import { toggleVariants } from "@/components/ui/toggle"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2.5", className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn("relative isolate flex w-full rounded-lg bg-muted p-[3px]", className)}
      {...props}
    >
      <SlidingIndicator className="rounded-[9px] bg-card shadow-[0_1px_0_var(--border)]" />
      {children}
    </TabsPrimitive.List>
  )
}

// Styled like a toggle segment: the active tab lifts onto the surface (drawn by the sliding
// indicator).
function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        toggleVariants(),
        "min-w-0 flex-1 px-1 data-[state=active]:text-foreground",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex flex-col gap-2.5", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
