import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Toggle as TogglePrimitive } from "radix-ui"

// A segment: sits on a soft track and lifts onto the surface when on.
const toggleVariants = cva(
  "group/toggle relative inline-flex items-center justify-center gap-2 rounded-[9px] font-semibold whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-35 data-[state=on]:bg-card data-[state=on]:text-foreground data-[state=on]:shadow-[0_1px_0_var(--border)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[18px]",
  {
    variants: {
      size: {
        // The ::after reaches over the track padding: a 46px target for a 40px segment.
        default:
          "h-10 min-w-11 px-3 text-[15px] after:absolute after:inset-x-0 after:-inset-y-[3px] after:content-['']",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

function Toggle({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
