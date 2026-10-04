import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

// Mono pills for machine things: positions and counts.
const badgeVariants = cva(
  "inline-flex h-[22px] min-w-[22px] shrink-0 items-center justify-center rounded-full px-[5px] font-mono text-[11px] font-semibold whitespace-nowrap tabular-nums",
  {
    variants: {
      variant: {
        default: "bg-foreground text-background",
        // Stays dark in both themes: it sits on the yellow export button.
        ink: "bg-highlight-foreground px-2 text-xs text-highlight",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge }
