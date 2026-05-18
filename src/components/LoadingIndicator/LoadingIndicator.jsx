export function LoadingIndicator({ variant = 'spinner' }) {
  if (variant === 'spinner') {
    return (
      <div className="animate-spin rounded-full border-2 border-[var(--surface_200)] border-t-[var(--color-brand-primary-500)] w-8 h-8" />
    )
  }

  if (variant === 'bar') {
    return (
      <div className="w-48 h-1.5 rounded-full bg-[var(--surface_200)] overflow-hidden">
        <div className="h-full w-1/3 rounded-full bg-[var(--color-brand-primary-500)] animate-pulse" />
      </div>
    )
  }

  // dots
  return (
    <div className="flex items-center gap-[var(--space-2)]">
      {[0, 150, 300].map((delay) => (
        <div
          key={delay}
          className="w-2 h-2 rounded-full bg-[var(--color-brand-primary-500)] animate-bounce"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  )
}
