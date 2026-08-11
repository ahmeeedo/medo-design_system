import { useState } from 'react'
import { Icon } from '../Icon/Icon'
import './Toggle.css'

/* medo Design System · Toggle
   Schaltet eine Einstellung sofort um — kein Speichern-Schritt. Als role="switch" gerendert.
   Aus = Bahn stone-300, An = Bahn primary-600. Griff immer weiß, Icon im Griff. */

const MEDO_TOGGLE_SIZES = {
  sm: { w: 36, h: 20, thumb: 16, icon: 12, spin: 10 },
  md: { w: 44, h: 24, thumb: 20, icon: 14, spin: 12 },
  lg: { w: 52, h: 30, thumb: 26, icon: 16, spin: 14 },
}

export function Toggle({
  checked,
  defaultChecked = false,
  onChange,
  label,
  description,
  size = 'md',
  labelPosition = 'right',
  icons = true,
  loading = false,
  disabled = false,
  id,
  className,
  style,
  ...rest
}) {
  const controlled = checked !== undefined
  const [inner, setInner] = useState(defaultChecked)
  const on = controlled ? checked : inner
  const s = MEDO_TOGGLE_SIZES[size] || MEDO_TOGGLE_SIZES.md
  const blocked = disabled || loading

  const toggle = () => {
    if (blocked) return
    if (!controlled) setInner(!on)
    if (onChange) onChange(!on)
  }

  const iconColor = on ? 'var(--medo-action)' : 'var(--medo-color-stone-600)'

  const control = (
    <span
      className="medo-tg__track"
      style={{ width: s.w + 'px', height: s.h + 'px', justifyContent: on ? 'flex-end' : 'flex-start' }}
    >
      <span className="medo-tg__thumb" style={{ width: s.thumb + 'px', height: s.thumb + 'px' }}>
        {loading ? (
          <span
            className="medo-tg__spin"
            style={{
              width: s.spin + 'px',
              height: s.spin + 'px',
              borderWidth: '2px',
              borderColor: disabled ? 'var(--medo-color-stone-400)' : iconColor,
            }}
          />
        ) : icons ? (
          <Icon
            name={on ? 'check' : 'close'}
            size={s.icon}
            color={disabled ? 'var(--medo-color-stone-400)' : iconColor}
          />
        ) : null}
      </span>
    </span>
  )

  const text =
    label || description ? (
      <span className="medo-tg__text">
        {label ? <span className="medo-tg__label">{label}</span> : null}
        {description ? <span className="medo-tg__desc">{description}</span> : null}
      </span>
    ) : null

  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={on ? 'true' : 'false'}
      aria-busy={loading ? 'true' : undefined}
      disabled={blocked}
      onClick={toggle}
      className={[
        'medo-tg',
        'medo-tg--' + size,
        on ? 'medo-tg--on' : null,
        loading ? 'medo-tg--loading' : null,
        labelPosition === 'left' ? 'medo-tg--block' : null,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
      {...rest}
    >
      {labelPosition === 'left' ? text : control}
      {labelPosition === 'left' ? control : text}
    </button>
  )
}
