import { useId, useRef, useState } from 'react'
import { Icon } from '../Icon/Icon'
import './Accordion.css'

/* medo Design System · Accordion
   Faltet Abschnitte auf und zu. Kopfzeile ist eine Schaltfläche, der Inhalt wächst über
   grid-template-rows 0fr → 1fr (weich, ohne feste Höhe).
   Tastatur: Enter/Leertaste schaltet, Pfeile wechseln zwischen Kopfzeilen, Home/End an die Ränder. */

export function Accordion({
  items = [],
  multiple = true,
  value,
  defaultValue,
  onChange,
  variant = 'card',
  size = 'md',
  marker = 'plusminus',
  showToggleAll = false,
  className,
  style,
  ...rest
}) {
  const uid = useId()
  const controlled = value !== undefined
  const norm = (v) => (v === undefined || v === null ? [] : Array.isArray(v) ? v : [v])
  const [inner, setInner] = useState(norm(defaultValue))
  const open = controlled ? norm(value) : inner
  const rootRef = useRef(null)
  const glyph = size === 'sm' ? 20 : 22

  const emit = (next) => {
    if (!controlled) setInner(next)
    if (onChange) onChange(multiple ? next : next[0] || null)
  }

  const toggle = (v) => {
    const isOpen = open.indexOf(v) !== -1
    if (!multiple) return emit(isOpen ? [] : [v])
    const next = open.slice()
    if (isOpen) next.splice(next.indexOf(v), 1)
    else next.push(v)
    emit(next)
  }

  const allOpen =
    items.length > 0 && items.every((it) => it.disabled || open.indexOf(it.value) !== -1)

  const onKeyDown = (e) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return
    e.preventDefault()
    const heads = Array.prototype.slice.call(
      rootRef.current.querySelectorAll('.medo-acc__head:not(:disabled)')
    )
    if (!heads.length) return
    const i = heads.indexOf(document.activeElement)
    let next
    if (e.key === 'Home') next = heads[0]
    else if (e.key === 'End') next = heads[heads.length - 1]
    else if (i === -1) next = heads[0]
    else next = heads[(i + (e.key === 'ArrowDown' ? 1 : -1) + heads.length) % heads.length]
    next.focus()
  }

  return (
    <div style={style} {...rest}>
      {showToggleAll && multiple ? (
        <div className="medo-acc__bar">
          <button
            type="button"
            className="medo-acc__all"
            onClick={() =>
              emit(allOpen ? [] : items.filter((it) => !it.disabled).map((it) => it.value))
            }
          >
            {allOpen ? 'Alle zuklappen' : 'Alle aufklappen'}
          </button>
        </div>
      ) : null}
      <div
        ref={rootRef}
        onKeyDown={onKeyDown}
        className={['medo-acc', 'medo-acc--' + variant, 'medo-acc--' + size, className]
          .filter(Boolean)
          .join(' ')}
      >
        {items.map((it) => {
          const isOpen = open.indexOf(it.value) !== -1 && !it.disabled
          return (
            <div key={it.value} className="medo-acc__item">
              <button
                type="button"
                id={uid + '-h-' + it.value}
                className="medo-acc__head"
                aria-expanded={isOpen ? 'true' : 'false'}
                aria-controls={uid + '-p-' + it.value}
                disabled={!!it.disabled}
                onClick={() => toggle(it.value)}
              >
                {it.icon ? (
                  <span className="medo-acc__lead">
                    <Icon name={it.icon} size={glyph - 2} />
                  </span>
                ) : null}
                <span className="medo-acc__body">
                  <span className="medo-acc__title" style={{ display: 'block' }}>
                    {it.title}
                  </span>
                  {it.subtitle ? (
                    <span className="medo-acc__sub" style={{ display: 'block' }}>
                      {it.subtitle}
                    </span>
                  ) : null}
                </span>
                {it.meta ? <span className="medo-acc__sub">{it.meta}</span> : null}
                <span
                  className={[
                    'medo-acc__mark',
                    marker === 'chevron' ? 'medo-acc__mark--chevron' : null,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-hidden="true"
                >
                  <Icon
                    name={marker === 'chevron' ? 'expand_more' : isOpen ? 'remove' : 'add'}
                    size={glyph}
                  />
                </span>
              </button>
              <div
                id={uid + '-p-' + it.value}
                role="region"
                aria-labelledby={uid + '-h-' + it.value}
                className={['medo-acc__panel', isOpen ? 'medo-acc__panel--open' : null]
                  .filter(Boolean)
                  .join(' ')}
              >
                <div className="medo-acc__clip">
                  <div className="medo-acc__content">{it.content}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
