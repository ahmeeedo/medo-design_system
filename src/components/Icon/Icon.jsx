import { cn } from '@/lib/utils'

export function Icon({ name, size = '1.25rem', className }) {
  return (
    <span
      className={cn('material-symbols-rounded select-none leading-none shrink-0 no-underline', className)}
      style={{ fontSize: size, fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}
      aria-hidden="true"
    >
      {name}
    </span>
  )
}
