import { cn } from '@/lib/utils'

const ICONS = {
  info:    'ℹ',
  success: '✓',
  warning: '⚠',
  error:   '✕',
}

const variantClasses = {
  info:    'bg-info-container border-info/20 text-content-info',
  success: 'bg-success-container border-success/20 text-content-success',
  warning: 'bg-warning-container border-warning/30 text-content-warning',
  error:   'bg-error-container border-error/20 text-content-error',
}

export function LegacyAlert({ variant = 'info', title, children }) {
  return (
    <div
      className={cn('flex gap-4 px-5 py-4 rounded-lg border', variantClasses[variant])}
      role="alert"
    >
      <div className="text-base leading-normal shrink-0" aria-hidden="true">
        {ICONS[variant]}
      </div>
      <div>
        {title && <div className="text-sm font-semibold mb-0.5">{title}</div>}
        {children && <div className="text-sm leading-relaxed">{children}</div>}
      </div>
    </div>
  )
}

export function LegacyToast({ children, action, onAction }) {
  return (
    <div
      className="inline-flex items-center gap-3 px-4 py-3 bg-surface-inverse text-content-inverse rounded-lg text-sm shadow-lg max-w-[360px]"
      role="status"
    >
      <span className="text-[var(--color-success-400)] shrink-0" aria-hidden="true">✓</span>
      <span className="flex-1">{children}</span>
      {action && (
        <button
          className="text-sm font-medium text-[var(--color-brand-blue-400)] hover:text-[var(--color-brand-blue-300)] cursor-pointer whitespace-nowrap ml-2 transition-colors"
          onClick={onAction}
        >
          {action}
        </button>
      )}
    </div>
  )
}
