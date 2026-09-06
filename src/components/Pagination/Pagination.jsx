import { Fragment, useState } from 'react'
import { Icon } from '../Icon/Icon'
import './Pagination.css'

/* medo Design System · Pagination
   Seitenweises Blättern. Drei Formen: Nummern, kompakt (Seite X von Y) und die volle Leiste
   mit Einträgen pro Seite, Bereichsangabe und Direktsprung.
   Aktive Seite ist primary-600 gefüllt und trägt aria-current="page". */

/* Fensterlogik: erste und letzte Seite immer, um die aktuelle je `siblings` Nachbarn, dazwischen … */
function pageWindow(page, count, siblings) {
  if (count <= 5 + siblings * 2) {
    const all = []
    for (let i = 1; i <= count; i++) all.push(i)
    return all
  }
  const out = [1]
  const from = Math.max(2, page - siblings)
  const to = Math.min(count - 1, page + siblings)
  if (from > 2) out.push('start-ell')
  for (let i = from; i <= to; i++) out.push(i)
  if (to < count - 1) out.push('end-ell')
  out.push(count)
  return out
}

export function Pagination({
  page,
  defaultPage = 1,
  pageCount,
  totalItems,
  pageSize = 20,
  pageSizeOptions = [10, 20, 50, 100],
  onPageChange,
  onPageSizeChange,
  variant = 'numbers',
  size = 'md',
  siblings = 1,
  showFirstLast = false,
  showJump = false,
  ariaLabel = 'Seitennummerierung',
  pageLabel = (page) => 'Seite ' + page,
  firstLabel = 'Erste Seite',
  previousLabel = 'Vorherige Seite',
  nextLabel = 'Nächste Seite',
  lastLabel = 'Letzte Seite',
  backLabel = 'Zurück',
  forwardLabel = 'Weiter',
  pageOfLabel = (page, pageCount) => (
    <>
      Seite <b>{page}</b> von {pageCount}
    </>
  ),
  pageSizeLabel = 'Einträge pro Seite',
  rangeLabel = (from, to, totalItems) => from + '–' + to + ' von ' + totalItems,
  jumpLabel = 'Gehe zu',
  jumpAriaLabel = 'Zu Seite springen',
  className,
  style,
  ...rest
}) {
  const controlled = page !== undefined
  const [inner, setInner] = useState(defaultPage)
  const current = controlled ? page : inner
  const count = pageCount || Math.max(1, Math.ceil((totalItems || 0) / pageSize))
  const [jump, setJump] = useState('')
  const glyph = size === 'sm' ? 19 : 22

  const go = (p) => {
    const next = Math.min(Math.max(1, p), count)
    if (next === current) return
    if (!controlled) setInner(next)
    if (onPageChange) onPageChange(next)
  }

  const atStart = current <= 1
  const atEnd = current >= count

  const iconBtn = (glyphName, label, disabled, onClick, key) => (
    <button
      key={key || glyphName}
      type="button"
      className="medo-pag__btn medo-pag__btn--icon"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon name={glyphName} size={glyph} />
    </button>
  )

  const numbers = pageWindow(current, count, siblings).map((p, i) =>
    typeof p === 'string' ? (
      <span key={p + i} className="medo-pag__ell" aria-hidden="true">
        …
      </span>
    ) : (
      <button
        key={p}
        type="button"
        className={['medo-pag__btn', p === current ? 'medo-pag__btn--active' : null]
          .filter(Boolean)
          .join(' ')}
        aria-label={pageLabel(p)}
        aria-current={p === current ? 'page' : undefined}
        onClick={() => go(p)}
      >
        {p}
      </button>
    )
  )

  const nav = (extra) => (
    <nav
      aria-label={ariaLabel}
      className={['medo-pag', 'medo-pag--' + size, className].filter(Boolean).join(' ')}
      style={extra ? undefined : style}
      {...(extra ? {} : rest)}
    >
      {showFirstLast ? iconBtn('first_page', firstLabel, atStart, () => go(1)) : null}
      {iconBtn('chevron_left', previousLabel, atStart, () => go(current - 1))}
      {numbers}
      {iconBtn('chevron_right', nextLabel, atEnd, () => go(current + 1))}
      {showFirstLast ? iconBtn('last_page', lastLabel, atEnd, () => go(count)) : null}
    </nav>
  )

  if (variant === 'compact') {
    return (
      <nav
        aria-label={ariaLabel}
        className={['medo-pag', 'medo-pag--' + size, className].filter(Boolean).join(' ')}
        style={{ gap: '14px', ...style }}
        {...rest}
      >
        <button
          type="button"
          className="medo-pag__btn medo-pag__btn--wide"
          disabled={atStart}
          onClick={() => go(current - 1)}
        >
          <Icon name="chevron_left" size={20} />
          {backLabel}
        </button>
        <span className="medo-pag__info">{pageOfLabel(current, count)}</span>
        <button
          type="button"
          className="medo-pag__btn medo-pag__btn--wide"
          disabled={atEnd}
          onClick={() => go(current + 1)}
        >
          {forwardLabel}
          <Icon name="chevron_right" size={20} />
        </button>
      </nav>
    )
  }

  if (variant === 'bar') {
    const from = totalItems ? (current - 1) * pageSize + 1 : null
    const to = totalItems ? Math.min(current * pageSize, totalItems) : null
    return (
      <div
        className={['medo-pag__bar', 'medo-pag__bar--' + size, className].filter(Boolean).join(' ')}
        style={style}
        {...rest}
      >
        <div className="medo-pag__side">
          {onPageSizeChange ? (
            <Fragment>
              <span className="medo-pag__label">{pageSizeLabel}</span>
              <select
                className="medo-pag__select"
                value={pageSize}
                aria-label={pageSizeLabel}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
              >
                {pageSizeOptions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </Fragment>
          ) : null}
          {totalItems ? (
            <span
              className="medo-pag__info"
              style={{ marginLeft: onPageSizeChange ? '8px' : 0 }}
            >
              {rangeLabel(from, to, totalItems)}
            </span>
          ) : null}
        </div>
        <div className="medo-pag__side">
          {nav(true)}
          {showJump ? (
            <div className="medo-pag__side" style={{ marginLeft: '8px' }}>
              <span className="medo-pag__label">{jumpLabel}</span>
              <input
                className="medo-pag__jump"
                type="text"
                inputMode="numeric"
                aria-label={jumpAriaLabel}
                value={jump}
                onChange={(e) => setJump(e.target.value.replace(/[^0-9]/g, ''))}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' || !jump) return
                  go(Number(jump))
                  setJump('')
                }}
              />
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  return nav(false)
}
