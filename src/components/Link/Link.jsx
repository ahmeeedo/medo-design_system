import { forwardRef } from 'react'
import { Icon } from '../Icon/Icon'
import './Link.css'

/* medo Design System · Link
   Führt zu einem anderen Ort. Zwei Muster: standalone (eigenständig, ohne Unterstreichung im
   Ruhezustand) und inline (im Fließtext, immer unterstrichen). */

const LINK_ICON_SIZE = { sm: 16, md: 18, lg: 20 }

export const Link = forwardRef(function Link({
  children,
  href,
  variant = 'standalone',
  size = 'md',
  icon,
  iconPosition = 'trailing',
  external = false,
  disabled = false,
  onClick,
  target,
  rel,
  className,
  style,
  ...rest
}, ref) {
  const glyphName = icon || (external ? 'open_in_new' : null)
  const glyph = glyphName ? <Icon name={glyphName} size={LINK_ICON_SIZE[size] || 18} /> : null

  const classes = ['medo-link', 'medo-link--' + variant, 'medo-link--' + size, className]
    .filter(Boolean)
    .join(' ')

  return (
    <a
      ref={ref}
      className={classes}
      href={disabled ? undefined : href}
      target={external ? target || '_blank' : target}
      rel={external ? rel || 'noopener noreferrer' : rel}
      aria-disabled={disabled ? 'true' : undefined}
      tabIndex={disabled ? -1 : undefined}
      onClick={disabled ? e => e.preventDefault() : onClick}
      style={style}
      {...rest}
    >
      {iconPosition === 'leading' ? glyph : null}
      {children}
      {iconPosition === 'trailing' ? glyph : null}
    </a>
  )
})
