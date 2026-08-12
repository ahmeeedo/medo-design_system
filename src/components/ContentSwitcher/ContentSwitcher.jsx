import { useRef, useState } from 'react'
import { Icon } from '../Icon/Icon'
import './ContentSwitcher.css'

/* medo Design System · ContentSwitcher
   Wechselt die Darstellung desselben Inhalts — Liste, Raster, Kanban; Monat, Jahr.
   Zwei Stile: neutral (Leiste stone-100, aktives Segment weiß) und outline (gemeinsamer Rahmen,
   aktives Segment gefüllt). Segmente sind gleich breit, damit die Leiste beim Wechsel stillsteht. */

export function ContentSwitcher({
  items = [],
  value,
  defaultValue,
  onChange,
  variant = 'neutral',
  size = 'md',
  iconOnly = false,
  equalWidth = true,
  fullWidth = false,
  ariaLabel,
  className,
  style,
  ...rest
}) {
  const controlled = value !== undefined
  const first = items.find((s) => !s.disabled) || items[0] || {}
  const [inner, setInner] = useState(defaultValue !== undefined ? defaultValue : first.value)
  const active = controlled ? value : inner
  const ref = useRef(null)
  const glyph = size === 'sm' ? 19 : 21

  const select = (v) => {
    if (!controlled) setInner(v)
    if (onChange) onChange(v)
  }

  /* Pfeiltasten wechseln direkt, Home/End an den Rand; deaktivierte Segmente überspringen. */
  const onKeyDown = (e) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return
    e.preventDefault()
    const usable = items.filter((s) => !s.disabled)
    if (!usable.length) return
    let target
    if (e.key === 'Home') target = usable[0]
    else if (e.key === 'End') target = usable[usable.length - 1]
    else {
      const i = usable.findIndex((s) => s.value === active)
      const step = e.key === 'ArrowRight' ? 1 : -1
      target = usable[(i + step + usable.length) % usable.length]
    }
    select(target.value)
    const el = ref.current && ref.current.querySelector('[data-val="' + target.value + '"]')
    if (el) el.focus()
  }

  return (
    <div
      ref={ref}
      role="tablist"
      aria-label={ariaLabel}
      aria-orientation="horizontal"
      onKeyDown={onKeyDown}
      className={[
        'medo-ctsw',
        'medo-ctsw--' + variant,
        'medo-ctsw--' + size,
        fullWidth ? 'medo-ctsw--full' : null,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
      {...rest}
    >
      {items.map((s) => {
        const selected = s.value === active
        return (
          <button
            key={s.value}
            type="button"
            role="tab"
            data-val={s.value}
            aria-selected={selected ? 'true' : 'false'}
            aria-label={iconOnly ? s.label : undefined}
            tabIndex={selected ? 0 : -1}
            disabled={!!s.disabled}
            onClick={() => !s.disabled && select(s.value)}
            className={[
              'medo-ctsw__seg',
              equalWidth || fullWidth ? 'medo-ctsw__seg--equal' : null,
              iconOnly ? 'medo-ctsw__seg--iconOnly' : null,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {s.icon ? <Icon name={s.icon} size={iconOnly ? glyph : glyph - 3} /> : null}
            {iconOnly ? null : <span>{s.label}</span>}
            {iconOnly ? (
              <span className="medo-ctsw__tip" aria-hidden="true">
                {s.label}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
