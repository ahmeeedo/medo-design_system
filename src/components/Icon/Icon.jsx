import { cn } from '@/lib/utils'

export function Icon({ name, size = 24, className }) {
  return (
    <span
      className={cn('material-symbols-outlined select-none', className)}
      style={{ fontSize: size }}
      aria-hidden="true"
    >
      {name}
    </span>
  )
}
