
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-center break-words hyphens-auto",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-servie to-servie-600 text-servie-foreground hover:shadow-lg hover:-translate-y-0.5 shadow-md",
        servie: "bg-gradient-to-r from-servie to-servie-600 text-servie-foreground hover:shadow-lg hover:-translate-y-0.5 shadow-md",
        primary: "bg-gradient-to-r from-primary to-servie text-primary-foreground hover:shadow-lg hover:-translate-y-0.5 shadow-md",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-servie bg-transparent text-servie hover:bg-servie hover:text-servie-foreground hover:shadow-md hover:-translate-y-0.5",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:-translate-y-0.5",
        link: "text-servie underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-servie via-primary to-servie-600 text-white hover:shadow-xl hover:-translate-y-1 shadow-lg",
      },
      size: {
        default: "h-11 min-h-[44px] px-3 py-2 text-sm sm:px-4 sm:text-sm",
        sm: "h-10 min-h-[44px] rounded-md px-2 text-xs sm:h-10 sm:px-3 sm:text-sm",
        lg: "h-12 min-h-[48px] rounded-md px-4 text-sm sm:h-12 sm:px-8 sm:text-base",
        xl: "h-14 min-h-[56px] rounded-lg px-6 text-base sm:h-14 sm:px-10 sm:text-lg",
        icon: "h-11 w-11 min-h-[44px] min-w-[44px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
