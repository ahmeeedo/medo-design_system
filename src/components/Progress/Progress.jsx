import { Progress as ProgressPrimitive } from 'radix-ui'
import { cn } from '@/lib/utils'

const variantClasses = {
  neutral: 'bg-[var(--color-neutral-900)]',
  accent:  'bg-[var(--color-brand-accent)]',
  success: 'bg-success',
  warning: 'bg-warning',
  error:   'bg-error',
}

const sizeClasses = {
  sm: 'h-1',
  md: 'h-1.5',
  lg: 'h-2.5',
}

export function Progress({ value = 0, variant = 'neutral', size = 'md', label, showValue = false }) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div className="flex flex-col gap-2 w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center">
          {label && <span className="text-xs text-[var(--color-text-secondary)]">{label}</span>}
          {showValue && <span className="text-xs text-[var(--color-text-secondary)] font-mono">{clamped}%</span>}
        </div>
      )}
      <ProgressPrimitive.Root
        className={cn(
          'relative w-full bg-[var(--color-neutral-200)] rounded-full overflow-hidden',
          sizeClasses[size]
        )}
        value={clamped}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            'size-full transition-transform duration-[400ms] ease-out',
            variantClasses[variant]
          )}
          style={{ transform: `translateX(-${100 - clamped}%)` }}
        />
      </ProgressPrimitive.Root>
    </div>
  )
}
