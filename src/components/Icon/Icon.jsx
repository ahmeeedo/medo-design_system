import { cn } from '@/lib/utils'

/**
 * Renders a Material Symbols SVG icon using CSS mask.
 * SVG files must be available at /icons/{name}.svg (public/icons/ directory).
 * The icon inherits the current text color via `bg-current`.
 */
export function Icon({ name, size = 16, className }) {
  return (
    <span
      className={cn("inline-block shrink-0 bg-current", className)}
      style={{
        width: size,
        height: size,
        maskImage: `url(/icons/${name}.svg)`,
        WebkitMaskImage: `url(/icons/${name}.svg)`,
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
      }}
      aria-hidden="true"
    />
  )
}
