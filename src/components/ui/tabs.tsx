import * as React from "react"
import { cn } from "cn"
import { Tabs as TabsPrimitive } from "radix-ui"

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
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn("flex w-full rounded-lg bg-muted p-[3px]", className)}
      {...props}
    />
  )
}

// The active tab takes the ink fill, unlike toggle segments which lift onto the surface.
function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-10 min-w-0 flex-1 items-center justify-center rounded-[9px] px-1 text-[15px] font-semibold whitespace-nowrap text-foreground transition-colors hover:bg-background/60 disabled:pointer-events-none disabled:opacity-35 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground after:absolute after:inset-x-0 after:-inset-y-[3px] after:content-['']",
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
