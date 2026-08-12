import { useId, useRef, useState } from 'react'
import { Icon } from '../Icon/Icon'
import './Tabs.css'

/* medo Design System · Tabs
   Wechsel zwischen gleichrangigen Ansichten desselben Objekts.
   Zwei Stile: underline (Indikator, ohne Grundlinie) und contained (Fläche auf stone-100-Leiste).
   Tastatur: Pfeile wechseln direkt, Home/End springen an den Rand; deaktivierte Tabs werden
   übersprungen. Kinder werden — falls vorhanden — als Panel des aktiven Tabs gerendert. */

export function Tabs({
  items = [],
  value,
  defaultValue,
  onChange,
  variant = 'underline',
  size = 'md',
  orientation = 'horizontal',
  fullWidth = false,
  scrollable = false,
  ariaLabel,
  children,
  className,
  style,
  ...rest
}) {
  const uid = useId()
  const controlled = value !== undefined
  const first = items.find((t) => !t.disabled) || items[0] || {}
  const [inner, setInner] = useState(defaultValue !== undefined ? defaultValue : first.value)
  const active = controlled ? value : inner
  const listRef = useRef(null)
  const vertical = orientation === 'vertical'

  const select = (v) => {
    if (!controlled) setInner(v)
    if (onChange) onChange(v)
  }

  /* Pfeiltasten: nächster bedienbarer Tab, Auswahl folgt dem Fokus. */
  const onKeyDown = (e) => {
    const keys = vertical
      ? { prev: 'ArrowUp', next: 'ArrowDown' }
      : { prev: 'ArrowLeft', next: 'ArrowRight' }
    if (![keys.prev, keys.next, 'Home', 'End'].includes(e.key)) return
    e.preventDefault()
    const usable = items.filter((t) => !t.disabled)
    if (!usable.length) return
    let target
    if (e.key === 'Home') target = usable[0]
    else if (e.key === 'End') target = usable[usable.length - 1]
    else {
      const i = usable.findIndex((t) => t.value === active)
      const step = e.key === keys.next ? 1 : -1
      target = usable[(i + step + usable.length) % usable.length]
    }
    select(target.value)
    const el = listRef.current && listRef.current.querySelector('[data-val="' + target.value + '"]')
    if (el) el.focus()
  }

  return (
    <div
      className={['medo-tabs', vertical ? 'medo-tabs--vertical' : null, className]
        .filter(Boolean)
        .join(' ')}
      style={style}
      {...rest}
    >
      <div
        ref={listRef}
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation={vertical ? 'vertical' : 'horizontal'}
        onKeyDown={onKeyDown}
        className={[
          'medo-tabs__list',
          'medo-tabs__list--' + (vertical ? 'vertical' : variant),
          'medo-tabs__list--' + size,
          scrollable && !vertical ? 'medo-tabs__list--scroll' : null,
        ]
          .filter(Boolean)
          .join(' ')}
        style={fullWidth && !vertical ? { display: 'flex' } : undefined}
      >
        {items.map((t) => {
          const selected = t.value === active
          const glyph = size === 'sm' ? 17 : variant === 'contained' ? 18 : 19
          return (
            <button
              key={t.value}
              type="button"
              role="tab"
              id={uid + '-tab-' + t.value}
              data-val={t.value}
              aria-selected={selected ? 'true' : 'false'}
              aria-controls={children ? uid + '-panel' : undefined}
              tabIndex={selected ? 0 : -1}
              disabled={!!t.disabled}
              onClick={() => !t.disabled && select(t.value)}
              className={[
                'medo-tabs__tab',
                'medo-tabs__tab--' + (vertical ? 'vertical' : variant),
                fullWidth && !vertical ? 'medo-tabs__tab--full' : null,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span className="medo-tabs__inner">
                {t.icon ? <Icon name={t.icon} size={glyph} /> : null}
                <span>{t.label}</span>
                {t.badge !== undefined && t.badge !== null ? (
                  <span className="medo-tabs__badge">{t.badge}</span>
                ) : null}
              </span>
              {variant === 'underline' || vertical ? (
                <span className="medo-tabs__ind" aria-hidden="true" />
              ) : null}
            </button>
          )
        })}
      </div>
      {children ? (
        <div
          role="tabpanel"
          id={uid + '-panel'}
          aria-labelledby={uid + '-tab-' + active}
          tabIndex={0}
          className="medo-tabs__panel"
        >
          {children}
        </div>
      ) : null}
    </div>
  )
}
