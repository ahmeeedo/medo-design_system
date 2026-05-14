import { cn } from '@/lib/utils'

const variantClasses = {
  neutral: 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)]',
  accent:  'bg-[var(--color-brand-secondary-100)] text-[var(--color-brand-secondary-800)]',
  success: 'bg-success-container text-success',
  warning: 'bg-warning-container text-warning',
  error:   'bg-error-container text-error',
}

const dotColors = {
  neutral: 'var(--color-neutral-500)',
  accent:  'var(--color-brand-secondary-800)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  error:   'var(--color-error)',
}

export function Badge({ variant = 'neutral', size = 'sm', dot = false, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-[5px] text-xs font-medium leading-none rounded-full whitespace-nowrap',
        size === 'sm' ? 'h-5 px-2' : 'h-6 px-3 text-sm',
        variantClasses[variant]
      )}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: dotColors[variant] }}
        />
      )}
      {children}
    </span>
  )
}

export function Tag({ children, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 h-6 px-2 text-xs font-medium bg-[var(--color-neutral-100)] text-content-primary border border-border-subtle rounded-sm">
      {children}
      {onRemove && (
        <button
          className="flex items-center justify-center p-0.5 rounded-sm text-content-secondary hover:text-error transition-colors cursor-pointer"
          onClick={onRemove}
          aria-label="Remove"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </span>
  )
}
