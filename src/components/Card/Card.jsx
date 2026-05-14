import { cn } from '@/lib/utils'

export function Card({ variant = 'flat', className = '', children, ...props }) {
  return (
    <div
      className={cn(
        'bg-surface border border-border-subtle rounded-xl overflow-hidden',
        variant === 'raised' && 'shadow-md border-transparent',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

Card.Header = function CardHeader({ title, subtitle, children, className = '' }) {
  return (
    <div className={cn('py-5 px-6 border-b border-border-subtle flex items-start justify-between gap-4', className)}>
      {(title || subtitle) ? (
        <>
          <div>
            {title && <div className="text-base font-semibold text-content-primary">{title}</div>}
            {subtitle && <div className="text-sm text-content-secondary mt-0.5">{subtitle}</div>}
          </div>
          {children}
        </>
      ) : children}
    </div>
  )
}

Card.Body = function CardBody({ children, className = '' }) {
  return (
    <div className={cn('py-5 px-6', className)}>
      {children}
    </div>
  )
}

Card.Footer = function CardFooter({ children, className = '' }) {
  return (
    <div className={cn('py-4 px-6 bg-surface-alt border-t border-border-subtle flex justify-end gap-2', className)}>
      {children}
    </div>
  )
}
