import { Fragment, useRef, useState } from 'react'
import { Icon } from '../Icon/Icon'
import './ContainedList.css'

/* medo Design System · ContainedList
   Interaktive Zeilen in einer umrandeten Karte — navigieren, einfach oder mehrfach auswählen.
   Zeile: Auswahlfeld, Avatar oder Icon, Titel, Erklärung, Meta rechts, Chevron oder Aktion.
   Tastatur: Pfeile bewegen den Fokus, Enter/Leertaste löst aus, Home/End an die Ränder. */

export function ContainedList({
  items = [],
  groups,
  mode = 'navigation',
  value,
  defaultValue,
  onChange,
  onSelect,
  onAction,
  size = 'md',
  title,
  count,
  emptyText,
  ariaLabel,
  className,
  style,
  ...rest
}) {
  const multiple = mode === 'multiple'
  const selectable = multiple || mode === 'single'
  const controlled = value !== undefined
  const fallback = defaultValue !== undefined ? defaultValue : multiple ? [] : null
  const [inner, setInner] = useState(fallback)
  const current = controlled ? value : inner
  const rootRef = useRef(null)
  const glyph = size === 'sm' ? 20 : 22

  const isSelected = (v) => (multiple ? (current || []).indexOf(v) !== -1 : current === v)

  const activate = (it) => {
    if (it.disabled) return
    if (!selectable) {
      if (onSelect) onSelect(it.value, it)
      return
    }
    let next
    if (multiple) {
      const list = (current || []).slice()
      const i = list.indexOf(it.value)
      if (i === -1) list.push(it.value)
      else list.splice(i, 1)
      next = list
    } else {
      next = it.value
    }
    if (!controlled) setInner(next)
    if (onChange) onChange(next)
  }

  /* Pfeile bewegen nur den Fokus — ausgewählt wird erst mit Enter oder Leertaste. */
  const onKeyDown = (e) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return
    e.preventDefault()
    const rows = Array.prototype.slice.call(
      rootRef.current.querySelectorAll('.medo-clist__row:not(:disabled)')
    )
    if (!rows.length) return
    const i = rows.indexOf(document.activeElement)
    let next
    if (e.key === 'Home') next = rows[0]
    else if (e.key === 'End') next = rows[rows.length - 1]
    else if (i === -1) next = rows[0]
    else next = rows[(i + (e.key === 'ArrowDown' ? 1 : -1) + rows.length) % rows.length]
    next.focus()
  }

  const renderRow = (it, key) => {
    const selected = selectable ? isSelected(it.value) : undefined
    return (
      <button
        key={key}
        type="button"
        role={selectable ? 'option' : undefined}
        aria-selected={selectable ? (selected ? 'true' : 'false') : undefined}
        disabled={!!it.disabled}
        onClick={() => activate(it)}
        className="medo-clist__row"
      >
        {selectable ? (
          <span
            className={['medo-clist__box', multiple ? null : 'medo-clist__box--radio']
              .filter(Boolean)
              .join(' ')}
            aria-hidden="true"
          >
            {selected && multiple ? (
              <Icon name="check" size={16} />
            ) : selected && !multiple ? (
              <span className="medo-clist__dot" />
            ) : null}
          </span>
        ) : null}
        {it.avatar ? (
          <span className="medo-clist__avatar" aria-hidden="true">
            {it.avatar}
          </span>
        ) : it.icon ? (
          <span className="medo-clist__iconbox" aria-hidden="true">
            <Icon name={it.icon} size={size === 'sm' ? 19 : 21} />
          </span>
        ) : null}
        <span className="medo-clist__body">
          <span className="medo-clist__t" style={{ display: 'block' }}>
            {it.label}
          </span>
          {it.description ? (
            <span className="medo-clist__d" style={{ display: 'block' }}>
              {it.description}
            </span>
          ) : null}
        </span>
        {it.meta ? <span className="medo-clist__meta">{it.meta}</span> : null}
        {it.action ? (
          <span
            className="medo-clist__act"
            role="button"
            tabIndex={-1}
            aria-label={it.actionLabel || 'Weitere Aktionen'}
            onClick={(e) => {
              e.stopPropagation()
              if (onAction) onAction(it.value, it)
            }}
          >
            <Icon name={it.action} size={20} />
          </span>
        ) : !selectable && it.chevron !== false ? (
          <Icon name="chevron_right" size={glyph} className="medo-clist__chev" />
        ) : null}
      </button>
    )
  }

  const empty = !items.length && (!groups || !groups.length)

  return (
    <div
      ref={rootRef}
      className={['medo-clist', 'medo-clist--' + size, className].filter(Boolean).join(' ')}
      style={style}
      {...rest}
    >
      {title || count !== undefined ? (
        <div className="medo-clist__head">
          <span className="medo-clist__title">{title}</span>
          {count !== undefined ? <span className="medo-clist__count">{count}</span> : null}
        </div>
      ) : null}
      <div
        role={selectable ? 'listbox' : 'list'}
        aria-multiselectable={multiple ? 'true' : undefined}
        aria-label={ariaLabel}
        onKeyDown={onKeyDown}
      >
        {empty ? (
          <div className="medo-clist__empty">{emptyText}</div>
        ) : groups && groups.length ? (
          groups.map((g, gi) => (
            <Fragment key={'g' + gi}>
              <div className="medo-clist__group">{g.label}</div>
              {(g.items || []).map((it, ii) => renderRow(it, 'g' + gi + '-' + ii))}
            </Fragment>
          ))
        ) : (
          items.map((it, i) => renderRow(it, i))
        )}
      </div>
    </div>
  )
}
