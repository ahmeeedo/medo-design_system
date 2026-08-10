import { forwardRef } from 'react'
import { Icon } from '../Icon/Icon'
import './Button.css'

/* medo Design System · Button
   Löst eine Aktion aus. Vier Varianten, drei Größen, alle Zustände aus Semantic-Tokens.
   Hover, Aktiv und Fokus laufen über das Stylesheet der Komponente,
   weil Inline-Styles keine Pseudoklassen abbilden können. */

const ICON_SIZE_FOR = { sm: 16, md: 18, lg: 20 }

/* forwardRef, damit der Button als Tooltip-Auslöser und als Radix-`asChild`-Kind taugt —
   beide reichen eine ref an das Kind durch. */
export const Button = forwardRef(function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'leading',
  iconOnly = false,
  loading = false,
  disabled = false,
  fullWidth = false,
  type = 'button',
  href,
  onClick,
  className,
  style,
  ...rest
}, ref) {
  const isDisabled = disabled || loading
  const iconSize = ICON_SIZE_FOR[size] || 18

  const glyph = icon ? <Icon name={icon} size={iconOnly ? iconSize + 2 : iconSize} /> : null
  const spinner = loading ? <span className="medo-btn__spinner" /> : null

  const content = iconOnly ? (
    spinner || glyph
  ) : (
    <>
      {spinner}
      {iconPosition === 'leading' ? glyph : null}
      {children != null ? <span>{children}</span> : null}
      {iconPosition === 'trailing' ? glyph : null}
    </>
  )

  const classes = [
    'medo-btn',
    'medo-btn--' + variant,
    'medo-btn--' + size,
    iconOnly ? 'medo-btn--iconOnly' : null,
    fullWidth ? 'medo-btn--fullWidth' : null,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const shared = {
    className: classes,
    style,
    'aria-disabled': isDisabled ? 'true' : undefined,
    'aria-busy': loading ? 'true' : undefined,
    onClick: isDisabled
      ? e => {
          e.preventDefault()
          e.stopPropagation()
        }
      : onClick,
    ...rest,
  }

  if (href) {
    return (
      <a
        {...shared}
        ref={ref}
        href={isDisabled ? undefined : href}
        role="button"
        tabIndex={isDisabled ? -1 : 0}
      >
        {content}
      </a>
    )
  }

  return (
    <button {...shared} ref={ref} type={type} disabled={isDisabled}>
      {content}
    </button>
  )
})
