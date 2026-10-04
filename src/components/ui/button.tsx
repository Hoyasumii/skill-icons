import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

// Sizes below 44px keep a 44px hit area through the ::after overlay.
const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center gap-2 rounded-md border-2 border-transparent text-[15px] font-semibold whitespace-nowrap transition-[background-color,color,border-color,box-shadow,translate,opacity] duration-150 select-none disabled:pointer-events-none disabled:opacity-35 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[18px]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/85",
        outline: "border-foreground bg-transparent hover:bg-muted",
        hairline: "border-1 border-border bg-transparent hover:bg-muted",
        ghost: "hover:bg-muted aria-expanded:bg-muted",
        highlight:
          "border-foreground bg-highlight text-highlight-foreground shadow-cta active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
        link: "h-auto! px-0! font-normal underline underline-offset-3 hover:text-foreground",
      },
      size: {
        default: "h-11 px-4",
        sm: "h-9 px-3 text-sm after:absolute after:-inset-1 after:content-['']",
        lg: "h-12 px-4 text-base font-bold",
        cta: "h-13 w-full rounded-lg px-4 text-[17px] font-bold [&_svg:not([class*='size-'])]:size-5",
        icon: "size-11",
        "icon-sm": "size-9 after:absolute after:-inset-1 after:content-['']",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
