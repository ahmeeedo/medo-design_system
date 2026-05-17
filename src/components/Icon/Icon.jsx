import { cn } from '@/lib/utils'

export function Icon({ name, size, className }) {
  return (
    <span
      className={cn('material-symbols-rounded select-none leading-none shrink-0 no-underline', !size && 'text-[1.5rem]', className)}
      style={{ ...(size ? { fontSize: size } : {}), fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
      aria-hidden="true"
    >
      {name}
    </span>
  )
}
