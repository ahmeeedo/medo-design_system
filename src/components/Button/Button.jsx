import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap rounded-md border border-transparent transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-ring disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:   "bg-btn-primary text-primary-foreground hover:bg-btn-primary-hover",
        accent:    "bg-btn-accent text-primary-foreground hover:bg-btn-accent-hover",
        secondary: "bg-background text-foreground border-border hover:bg-muted",
        ghost:     "bg-transparent text-foreground hover:bg-muted",
        danger:    "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
        link:      "bg-transparent text-primary underline-offset-4 hover:underline",
      },
      size: {
        xs: "h-6 px-3 text-xs rounded-sm",
        sm: "h-8 px-4 text-sm",
        md: "h-10 px-5 text-sm",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-7 text-lg",
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  leadingIcon,
  trailingIcon,
  onClick,
  type = 'button',
  className = '',
  children,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  )
}
