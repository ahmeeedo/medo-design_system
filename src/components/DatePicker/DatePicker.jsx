import { useEffect, useId, useRef, useState } from 'react'
import { Icon } from '../Icon/Icon'
import './DatePicker.css'

/* medo Design System · DatePicker (+ TimeSlots)
   Feld mit Kalender-Popover oder inline. Einzeldatum und Bereich, Monats-/Jahreswahl,
   Schnellauswahl, Zusammenfassung. Woche ab Montag, deutsche Monatsnamen.
   Klick wählt direkt — kein Bestätigen. Beim Bereich: erster Klick Start, zweiter Ende. */

const MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
const MONTHS_SHORT = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

const fmt = (d) =>
  d ? String(d.getDate()).padStart(2, '0') + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + d.getFullYear() : ''
const sameDay = (a, b) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
const startOfDay = (d) => {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}
const daysBetween = (a, b) => Math.round((startOfDay(b) - startOfDay(a)) / 86400000) + 1

export function DatePicker({
  mode = 'single',
  value,
  defaultValue,
  onChange,
  label,
  helper,
  error,
  placeholder = 'Datum wählen',
  min,
  max,
  presets,
  inline = false,
  clearable = true,
  required = false,
  disabled = false,
  fullWidth = false,
  summaryLabel = 'Ausgewählt',
  id,
  className,
  style,
  ...rest
}) {
  const range = mode === 'range'
  const autoId = useId()
  const uid = id || autoId
  const controlled = value !== undefined
  const empty = range ? { start: null, end: null } : null
  const [inner, setInner] = useState(defaultValue !== undefined ? defaultValue : empty)
  const sel = controlled ? value : inner

  const anchor = range ? (sel && sel.start) || new Date() : sel || new Date()
  const [view, setView] = useState(anchor)
  const [open, setOpen] = useState(false)
  const [pick, setPick] = useState(false)
  const [pickYear, setPickYear] = useState(anchor.getFullYear())
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const away = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    const esc = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', away)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', away)
      document.removeEventListener('keydown', esc)
    }
  }, [open])

  const emit = (next) => {
    if (!controlled) setInner(next)
    if (onChange) onChange(next)
  }

  const blocked = (d) => (min && startOfDay(d) < startOfDay(min)) || (max && startOfDay(d) > startOfDay(max))

  const choose = (d) => {
    if (!range) {
      emit(new Date(d))
      setOpen(false)
      return
    }
    const cur = sel || empty
    if (!cur.start || (cur.start && cur.end)) emit({ start: new Date(d), end: null })
    else if (d < cur.start) emit({ start: new Date(d), end: cur.start })
    else emit({ start: cur.start, end: new Date(d) })
  }

  const today = new Date()
  const first = new Date(view.getFullYear(), view.getMonth(), 1)
  const gridStart = new Date(first)
  gridStart.setDate(1 - ((first.getDay() + 6) % 7))
  const cells = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart)
    d.setDate(gridStart.getDate() + i)
    return d
  })

  const onDayKey = (e) => {
    const map = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }
    if (map[e.key] === undefined) return
    e.preventDefault()
    const btns = Array.prototype.slice.call(e.currentTarget.parentNode.querySelectorAll('button'))
    const i = btns.indexOf(e.currentTarget)
    const next = btns[i + map[e.key]]
    if (next) next.focus()
  }

  const dayClass = (d) => {
    const out = d.getMonth() !== view.getMonth()
    const list = ['medo-dp__day']
    if (out) list.push('medo-dp__day--out')
    if (range) {
      const s = sel && sel.start
      const e2 = sel && sel.end
      if (sameDay(d, s) && e2) list.push('medo-dp__day--rstart')
      else if (sameDay(d, e2)) list.push('medo-dp__day--rend')
      else if (sameDay(d, s)) list.push('medo-dp__day--sel')
      else if (s && e2 && d > s && d < e2) list.push('medo-dp__day--inrange')
      else if (sameDay(d, today)) list.push('medo-dp__day--today')
    } else {
      if (sameDay(d, sel)) list.push('medo-dp__day--sel')
      else if (sameDay(d, today)) list.push('medo-dp__day--today')
    }
    return list.join(' ')
  }

  const calendar = (
    <div
      className={['medo-dp__cal', inline ? 'medo-dp__cal--inline' : 'medo-dp__cal--pop'].join(' ')}
      role={inline ? undefined : 'dialog'}
      aria-label="Kalender"
    >
      <div className="medo-dp__head">
        <button
          type="button"
          className="medo-dp__nav"
          aria-label="Vorheriger Monat"
          onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}
        >
          <Icon name="chevron_left" size={20} />
        </button>
        <button
          type="button"
          className="medo-dp__monthbtn"
          aria-label="Monat und Jahr wählen"
          aria-expanded={pick ? 'true' : 'false'}
          onClick={() => {
            setPickYear(view.getFullYear())
            setPick(!pick)
          }}
        >
          {MONTHS[view.getMonth()] + ' ' + view.getFullYear()}
          <Icon name={pick ? 'expand_less' : 'expand_more'} size={18} />
        </button>
        <button
          type="button"
          className="medo-dp__nav"
          aria-label="Nächster Monat"
          onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}
        >
          <Icon name="chevron_right" size={20} />
        </button>
      </div>

      {pick ? (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '2px 0 10px' }}>
            <button type="button" className="medo-dp__nav" aria-label="Vorheriges Jahr" onClick={() => setPickYear(pickYear - 1)}>
              <Icon name="chevron_left" size={20} />
            </button>
            <div className="medo-dp__year">{pickYear}</div>
            <button type="button" className="medo-dp__nav" aria-label="Nächstes Jahr" onClick={() => setPickYear(pickYear + 1)}>
              <Icon name="chevron_right" size={20} />
            </button>
          </div>
          <div className="medo-dp__months">
            {MONTHS_SHORT.map((m, i) => (
              <button
                key={m}
                type="button"
                className={['medo-dp__mo', i === view.getMonth() && pickYear === view.getFullYear() ? 'medo-dp__mo--on' : null]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => {
                  setView(new Date(pickYear, i, 1))
                  setPick(false)
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="medo-dp__grid">
          {WEEKDAYS.map((w) => (
            <div key={w} className="medo-dp__dow" aria-hidden="true">
              {w}
            </div>
          ))}
          {cells.map((d, i) => (
            <button
              key={i}
              type="button"
              className={dayClass(d)}
              disabled={blocked(d)}
              aria-label={d.getDate() + '. ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear()}
              aria-pressed={
                range
                  ? sameDay(d, sel && sel.start) || sameDay(d, sel && sel.end)
                    ? 'true'
                    : 'false'
                  : sameDay(d, sel)
                    ? 'true'
                    : 'false'
              }
              aria-current={sameDay(d, today) ? 'date' : undefined}
              onClick={() => choose(d)}
              onKeyDown={onDayKey}
            >
              {d.getDate()}
            </button>
          ))}
        </div>
      )}
    </div>
  )

  const hasSel = range ? !!(sel && sel.start) : !!sel
  const fieldText = range
    ? sel && sel.start
      ? fmt(sel.start) + ' – ' + (sel.end ? fmt(sel.end) : '…')
      : placeholder
    : sel
      ? fmt(sel)
      : placeholder

  const side =
    presets || range ? (
      <div className="medo-dp__side">
        {presets && presets.length ? (
          <>
            <div className="medo-dp__sidelbl">Schnellauswahl</div>
            {presets.map((p, i) => (
              <button key={i} type="button" className="medo-dp__chip" onClick={() => emit(p.value())}>
                {p.label}
              </button>
            ))}
          </>
        ) : null}
        {hasSel && clearable ? (
          <button type="button" className="medo-dp__reset" onClick={() => emit(empty)}>
            Zurücksetzen
          </button>
        ) : null}
        {range ? (
          <div style={{ marginTop: '16px' }}>
            <div className="medo-dp__sidelbl">{summaryLabel}</div>
            <div className="medo-dp__sum">
              <div
                className="medo-dp__sumval"
                style={{ color: hasSel ? 'var(--medo-text)' : 'var(--medo-text-muted)' }}
              >
                {sel && sel.start ? fmt(sel.start) + (sel.end ? ' – ' + fmt(sel.end) : ' – …') : 'Kein Zeitraum'}
              </div>
              {sel && sel.start && sel.end ? (
                <div className="medo-dp__sumsub">{daysBetween(sel.start, sel.end) + ' Tage'}</div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    ) : null

  if (inline)
    return (
      <div
        className={['medo-dp', className].filter(Boolean).join(' ')}
        style={{ display: 'flex', gap: '28px', flexWrap: 'wrap', alignItems: 'flex-start', ...style }}
        {...rest}
      >
        {calendar}
        {side}
      </div>
    )

  return (
    <div
      ref={rootRef}
      className={['medo-dp', fullWidth ? 'medo-dp--full' : null, error ? 'medo-dp--error' : null, className]
        .filter(Boolean)
        .join(' ')}
      style={style}
      {...rest}
    >
      {label ? (
        <label className="medo-dp__label" htmlFor={uid}>
          {label}
          {required ? <span className="medo-dp__req">*</span> : null}
        </label>
      ) : null}

      <button
        id={uid}
        type="button"
        className={['medo-dp__field', open ? 'medo-dp__field--on' : null].filter(Boolean).join(' ')}
        aria-haspopup="dialog"
        aria-expanded={open ? 'true' : 'false'}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? uid + '-err' : helper ? uid + '-help' : undefined}
        disabled={disabled}
        onClick={() => setOpen(!open)}
      >
        <Icon name="calendar_month" size={19} color="var(--medo-icon-muted)" />
        <span className={['medo-dp__value', hasSel ? null : 'medo-dp__value--empty'].filter(Boolean).join(' ')}>
          {fieldText}
        </span>
        {hasSel && clearable && !disabled ? (
          <span
            className="medo-dp__clear"
            role="button"
            tabIndex={-1}
            aria-label="Datum zurücksetzen"
            onClick={(e) => {
              e.stopPropagation()
              emit(empty)
            }}
          >
            <Icon name="close" size={18} />
          </span>
        ) : (
          <Icon name="expand_more" size={19} color="var(--medo-icon-muted)" />
        )}
      </button>

      {error ? (
        <div className="medo-dp__err" id={uid + '-err'}>
          <Icon name="error" size={15} />
          <span>{error}</span>
        </div>
      ) : helper ? (
        <div className="medo-dp__helper" id={uid + '-help'}>
          {helper}
        </div>
      ) : null}

      {open ? calendar : null}
    </div>
  )
}

/* Zeitfenster neben dem Kalender — Termin-Buchung. */
export function TimeSlots({ slots = [], value, onChange, columns = 3, ariaLabel = 'Uhrzeit', className, style, ...rest }) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={['medo-dp__slots', className].filter(Boolean).join(' ')}
      style={{ gridTemplateColumns: 'repeat(' + columns + ', 1fr)', ...style }}
      {...rest}
    >
      {slots.map((s) => {
        const item = typeof s === 'string' ? { time: s } : s
        return (
          <button
            key={item.time}
            type="button"
            className={['medo-dp__slot', item.time === value ? 'medo-dp__slot--on' : null].filter(Boolean).join(' ')}
            aria-pressed={item.time === value ? 'true' : 'false'}
            disabled={!!item.disabled}
            onClick={() => onChange && onChange(item.time)}
          >
            {item.time}
          </button>
        )
      })}
    </div>
  )
}
