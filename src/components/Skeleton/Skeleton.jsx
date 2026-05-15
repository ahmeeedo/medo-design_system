import { cn } from '@/lib/utils'

const variantClasses = {
  text:   'rounded-sm',
  circle: 'rounded-full shrink-0',
  rect:   'rounded-md',
}

export function Skeleton({ variant = 'rect', width, height, className = '' }) {
  return (
    <div
      className={cn(
        'bg-[var(--color-neutral-200)] animate-pulse',
        variantClasses[variant],
        className
      )}
      style={{ width, height }}
      aria-hidden="true"
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3 max-w-[360px]">
      <div className="flex items-center gap-4">
        <Skeleton variant="circle" width={40} height={40} />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton variant="text" width="60%" height={14} />
          <Skeleton variant="text" width="40%" height={11} />
        </div>
      </div>
      <Skeleton variant="rect" height={120} className="rounded-lg" />
      <Skeleton variant="text" width="90%" height={14} />
      <Skeleton variant="text" width="75%" height={14} />
      <Skeleton variant="text" width="55%" height={14} />
    </div>
  )
}
