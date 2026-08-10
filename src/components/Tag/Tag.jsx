import { forwardRef } from 'react'
import { Icon } from '../Icon/Icon'
import './Tag.css'

/* medo Design System · Tag
   Kennzeichnet, kategorisiert oder filtert. Drei Typen — anzeigend, entfernbar, auswählbar —
   in sechs Farbrollen und zwei Stilen. Immer vollrund (feste Systemregel). */

/* Farbrollen: soft = Fläche 50 mit Text 1000, solid = Fläche 600 mit Text auf Volltonfarbe */
const MEDO_TAG_COLORS = {
  neutral: { soft: ['--medo-color-stone-100', '--medo-color-stone-1000'], solid: ['--medo-color-stone-700', '--medo-color-white'], dot: '--medo-color-stone-600' },
  primary: { soft: ['--medo-primary-50', '--medo-primary-1000'], solid: ['--medo-primary-600', '--medo-color-white'], dot: '--medo-primary-600' },
  success: { soft: ['--medo-success-surface', '--medo-success-text'], solid: ['--medo-success-solid', '--medo-success-on-solid'], dot: '--medo-success-solid' },
  warning: { soft: ['--medo-warning-surface', '--medo-warning-text'], solid: ['--medo-warning-solid', '--medo-warning-on-solid'], dot: '--medo-warning-solid' },
  error:   { soft: ['--medo-error-surface', '--medo-error-text'], solid: ['--medo-error-solid', '--medo-error-on-solid'], dot: '--medo-error-solid' },
  info:    { soft: ['--medo-info-surface', '--medo-info-text'], solid: ['--medo-info-solid', '--medo-info-on-solid'], dot: '--medo-info-solid' },
}

export const Tag = forwardRef(function Tag({
  children,
  color = 'neutral',
  emphasis = 'soft',
  size = 'md',
  dot = false,
  icon,
  onRemove,
  removeLabel,
  selectable = false,
  selected = false,
  disabled = false,
  onClick,
  className,
  style,
  ...rest
}, ref) {
  const glyphSize = size === 'sm' ? 14 : 16
  const role = MEDO_TAG_COLORS[color] || MEDO_TAG_COLORS.neutral
  const pair = emphasis === 'solid' ? role.solid : role.soft

  const label = <span className="medo-tag__label">{children}</span>

  /* Auswählbar: eigene Farbgebung über die Zustandsklassen, kein Farbrollen-Style */
  if (selectable) {
    return (
      <button
        ref={ref}
        type="button"
        className={[
          'medo-tag',
          'medo-tag--' + size,
          'medo-tag--selectable',
          selected ? 'medo-tag--selected' : null,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        aria-pressed={selected ? 'true' : 'false'}
        disabled={disabled}
        onClick={onClick}
        style={style}
        {...rest}
      >
        {selected ? (
          <Icon name="check" size={glyphSize} />
        ) : icon ? (
          <Icon name={icon} size={glyphSize} />
        ) : null}
        {label}
      </button>
    )
  }

  return (
    <span
      ref={ref}
      className={[
        'medo-tag',
        'medo-tag--' + size,
        onRemove ? 'medo-tag--removable' : null,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ background: 'var(' + pair[0] + ')', color: 'var(' + pair[1] + ')', ...style }}
      {...rest}
    >
      {dot ? (
        <span
          className="medo-tag__dot"
          style={{ background: emphasis === 'solid' ? 'currentColor' : 'var(' + role.dot + ')' }}
        />
      ) : null}
      {icon ? <Icon name={icon} size={glyphSize} /> : null}
      {label}
      {onRemove ? (
        <button
          type="button"
          className="medo-tag__x"
          aria-label={removeLabel || 'Entfernen'}
          onClick={onRemove}
        >
          <Icon name="close" size={glyphSize} />
        </button>
      ) : null}
    </span>
  )
})
