import * as React from "react"
import { cn } from "cn"

// Text stays at 16px so iOS doesn't zoom in on focus.
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-lg border-2 border-input bg-card px-4 text-base text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive [&::-webkit-search-cancel-button]:hidden",
        className
      )}
      {...props}
    />
  )
}

export { Input }
