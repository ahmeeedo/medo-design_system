import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Icon } from '../Icon/Icon'
import { Field } from '../Field/Field'
import './Select.css'

/* medo Design System · Select
   Auswahl aus einer bekannten, geschlossenen Liste.

   Zwei Betriebsarten:
   - Standard: eigene Liste, damit das Aufklappmenü im medo-Stil erscheint (Panel wie Dropdown:
     Radius lg, Rahmen border-subtle, shadow-lg, Auswahl in primary-50). Vollständig per Tastatur
     bedienbar, mit role="listbox" und aria-activedescendant.
   - `native`: das Betriebssystem-Auswahlrad. Richtig für sehr lange Listen und für Formulare,
     die ohne JavaScript funktionieren müssen. Das Aufklappmenü ist dann nicht gestaltbar. */

function flattenOptions(options) {
  const flat = []
  ;(options || []).forEach((o) => {
    if (o.options) {
      flat.push({ group: o.label })
      o.options.forEach((c) => flat.push(c))
    } else {
      flat.push(o)
    }
  })
  return flat
}

export function Select({
  label,
  id,
  value,
  defaultValue,
  placeholder = 'Bitte wählen',
  options = [],
  size = 'md',
  required = false,
  optional = false,
  disabled = false,
  hint,
  error,
  success,
  icon,
  onChange,
  fullWidth = false,
  name,
  native = false,
  multiple = false,
  multipleDisplay = 'chips',
  maxChips = 0,
  defaultOpen = false,
  className,
  style,
  children,
  ...rest
}) {
  const [open, setOpen] = useState(defaultOpen)
  const [focused, setFocused] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [dropUp, setDropUp] = useState(false)
  const [internal, setInternal] = useState(
    defaultValue !== undefined ? defaultValue : multiple ? [] : ''
  )

  const isControlled = value !== undefined
  const current = isControlled ? value : internal

  const wrapRef = useRef(null)
  const panelRef = useRef(null)

  const autoId = useId()
  const fieldId = id || autoId

  const iconSize = size === 'sm' ? 18 : size === 'lg' ? 22 : 20

  const flat = useMemo(() => flattenOptions(options), [options])
  const selectable = flat.filter((o) => !o.group && !o.disabled)
  const selected = flat.find((o) => !o.group && o.value === current)
  const many = multiple ? (Array.isArray(current) ? current : []) : []
  const isOn = (v) => (multiple ? many.indexOf(v) !== -1 : v === current)
  const chosen = multiple ? flat.filter((o) => !o.group && isOn(o.value)) : []

  /* Einzeilige Chips: messen, wie viele in eine Zeile passen. Der Spiegel-Container hält alle
     Chips in voller Breite (unsichtbar), damit die Breiten auch dann bekannt bleiben, wenn im
     sichtbaren Feld schon gekürzt wird. */
  const chipsRef = useRef(null)
  const mirrorRef = useRef(null)
  const [visibleChips, setVisibleChips] = useState(chosen.length)
  const chipKey = chosen.map((o) => o.value).join('\u0000')

  useLayoutEffect(() => {
    if (!multiple || multipleDisplay === 'count') return
    const cont = chipsRef.current
    const mirror = mirrorRef.current
    if (!cont || !mirror) return
    const GAP = 7
    const measure = () => {
      const kids = Array.prototype.slice.call(mirror.children)
      const badge = kids.pop()
      const widths = kids.map((k) => k.getBoundingClientRect().width)
      const badgeW = badge ? badge.getBoundingClientRect().width : 34
      const avail = cont.clientWidth
      const cap = maxChips > 0 ? Math.min(maxChips, widths.length) : widths.length
      let used = 0
      let n = 0
      for (let i = 0; i < cap; i++) {
        const need = used + (i ? GAP : 0) + widths[i]
        if (need > avail) break
        used = need
        n++
      }
      /* Platz für den Zähler freiräumen, falls etwas übrig bleibt */
      while (n < widths.length && n > 1 && used + GAP + badgeW > avail) {
        used -= widths[n - 1] + GAP
        n--
      }
      setVisibleChips(Math.max(widths.length ? 1 : 0, n))
    }
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(measure)
    ro.observe(cont)
    return () => ro.disconnect()
  }, [multiple, multipleDisplay, maxChips, chipKey, size])

  const toggle = (val) => {
    const next = many.indexOf(val) === -1 ? many.concat([val]) : many.filter((v) => v !== val)
    if (!isControlled) setInternal(next)
    if (onChange) onChange({ target: { value: next, name } })
  }

  const commit = (val) => {
    if (!isControlled) setInternal(val)
    if (onChange) onChange({ target: { value: val, name } })
  }

  /* Klick außerhalb schließt */
  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  /* Nach unten oder oben aufklappen, je nach Platz */
  useEffect(() => {
    if (!open || !wrapRef.current) return
    const r = wrapRef.current.getBoundingClientRect()
    setDropUp(window.innerHeight - r.bottom < 280 && r.top > 280)
  }, [open])

  /* Aktiven Eintrag in Sicht halten */
  useEffect(() => {
    if (!open || !panelRef.current || activeIndex < 0) return
    const el = panelRef.current.querySelector('[data-idx="' + activeIndex + '"]')
    if (!el) return
    const p = panelRef.current
    if (el.offsetTop < p.scrollTop) p.scrollTop = el.offsetTop - 6
    else if (el.offsetTop + el.offsetHeight > p.scrollTop + p.clientHeight)
      p.scrollTop = el.offsetTop + el.offsetHeight - p.clientHeight + 6
  }, [open, activeIndex])

  const openPanel = () => {
    const i = selected ? flat.indexOf(selected) : flat.findIndex((o) => !o.group && !o.disabled)
    setActiveIndex(i)
    setOpen(true)
  }

  const step = (dir) => {
    let i = activeIndex
    for (let n = 0; n < flat.length; n++) {
      i += dir
      if (i < 0) i = flat.length - 1
      if (i >= flat.length) i = 0
      const o = flat[i]
      if (o && !o.group && !o.disabled) break
    }
    setActiveIndex(i)
  }

  const onKeyDown = (e) => {
    if (disabled) return
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault()
        openPanel()
      }
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      step(1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      step(-1)
    } else if (e.key === 'Home') {
      e.preventDefault()
      setActiveIndex(flat.findIndex((o) => !o.group && !o.disabled))
    } else if (e.key === 'End') {
      e.preventDefault()
      for (let i = flat.length - 1; i >= 0; i--) {
        if (!flat[i].group && !flat[i].disabled) {
          setActiveIndex(i)
          break
        }
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      const o = flat[activeIndex]
      if (o && !o.group && !o.disabled) {
        if (multiple) toggle(o.value)
        else {
          commit(o.value)
          setOpen(false)
        }
      }
    } else if (e.key === 'Escape' || e.key === 'Tab') setOpen(false)
    else if (e.key.length === 1) {
      const q = e.key.toLowerCase()
      const hit = selectable.find((o) => String(o.label).toLowerCase().startsWith(q))
      if (hit) setActiveIndex(flat.indexOf(hit))
    }
  }

  const renderChip = (o, clip) => (
    <span
      key={o.value}
      className={'medo-select__chip' + (clip ? ' medo-select__chip--clip' : '')}
    >
      <span className="medo-select__chiplabel">{o.label}</span>
      <span
        className="medo-select__chipx"
        role="button"
        aria-label={'Auswahl entfernen: ' + o.label}
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => {
          e.stopPropagation()
          toggle(o.value)
        }}
      >
        <Icon name="close" size={16} />
      </span>
    </span>
  )

  const boxClasses = [
    'medo-field__box',
    'medo-field__box--' + size,
    (focused || open) && !disabled ? 'medo-field__box--focus' : null,
    error ? 'medo-field__box--error' : null,
    success && !error ? 'medo-field__box--success' : null,
    disabled ? 'medo-field__box--disabled' : null,
    multiple ? 'medo-select__box--multi' : null,
  ]
    .filter(Boolean)
    .join(' ')

  const leadIcon = icon ? (
    <Icon name={icon} size={iconSize} color="var(--medo-icon-muted)" />
  ) : null

  /* ---------- native Betriebsart ---------- */
  if (native) {
    const renderedOptions = children
      ? children
      : (options || []).map((o, i) =>
          o.options ? (
            <optgroup key={o.label || i} label={o.label}>
              {o.options.map((c, j) => (
                <option key={c.value != null ? c.value : j} value={c.value} disabled={c.disabled}>
                  {c.label}
                </option>
              ))}
            </optgroup>
          ) : (
            <option key={o.value != null ? o.value : i} value={o.value} disabled={o.disabled}>
              {o.label}
            </option>
          )
        )

    return (
      <Field
        label={label}
        htmlFor={fieldId}
        required={required}
        optional={optional}
        hint={hint}
        error={error}
        success={success}
        fullWidth={fullWidth}
        className={className}
        style={style}
      >
        <div className={boxClasses}>
          {leadIcon}
          <select
            id={fieldId}
            name={name}
            className={
              'medo-select__nativectl' + (!current ? ' medo-select__nativectl--placeholder' : '')
            }
            value={current}
            disabled={disabled}
            required={required}
            aria-invalid={error ? 'true' : undefined}
            onChange={(e) => commit(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...rest}
          >
            {placeholder ? <option value="">{placeholder}</option> : null}
            {renderedOptions}
          </select>
          <Icon
            name="expand_more"
            size={iconSize}
            color={disabled ? 'var(--medo-icon-disabled)' : 'var(--medo-icon-muted)'}
          />
        </div>
      </Field>
    )
  }

  /* ---------- gestaltete Betriebsart ---------- */
  const Trigger = multiple ? 'div' : 'button'

  const panel = open ? (
    <div
      ref={panelRef}
      className={'medo-select__panel' + (dropUp ? ' medo-select__panel--up' : '')}
      role="listbox"
      id={fieldId + '-list'}
      aria-labelledby={fieldId}
    >
      {flat.length === 0 ? (
        <div className="medo-select__empty">Keine Einträge</div>
      ) : (
        flat.map((o, i) =>
          o.group ? (
            <div key={'g' + i} className="medo-select__group">
              {o.group}
            </div>
          ) : (
            <div
              key={o.value != null ? o.value : i}
              data-idx={i}
              id={fieldId + '-opt-' + i}
              role="option"
              aria-selected={isOn(o.value) ? 'true' : 'false'}
              aria-disabled={o.disabled ? 'true' : undefined}
              className={[
                'medo-select__opt',
                i === activeIndex ? 'medo-select__opt--active' : null,
                isOn(o.value) ? 'medo-select__opt--selected' : null,
                o.disabled ? 'medo-select__opt--disabled' : null,
              ]
                .filter(Boolean)
                .join(' ')}
              onMouseEnter={() => !o.disabled && setActiveIndex(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                if (o.disabled) return
                if (multiple) {
                  toggle(o.value)
                  return
                }
                commit(o.value)
                setOpen(false)
              }}
            >
              {o.icon ? <Icon name={o.icon} size={18} color="var(--medo-icon-muted)" /> : null}
              <span className="medo-select__opt-label">{o.label}</span>
              {isOn(o.value) ? <Icon name="check" size={18} color="var(--medo-action)" /> : null}
            </div>
          )
        )
      )}
    </div>
  ) : null

  return (
    <Field
      label={label}
      htmlFor={fieldId}
      required={required}
      optional={optional}
      hint={hint}
      error={error}
      success={success}
      fullWidth={fullWidth}
      className={className}
      style={style}
    >
      <div className="medo-select" ref={wrapRef}>
        <div className={boxClasses}>
          {leadIcon}
          <Trigger
            id={fieldId}
            type={multiple ? undefined : 'button'}
            tabIndex={multiple ? (disabled ? -1 : 0) : undefined}
            className="medo-select__trigger"
            disabled={multiple ? undefined : disabled}
            aria-disabled={multiple && disabled ? 'true' : undefined}
            role="combobox"
            aria-expanded={open ? 'true' : 'false'}
            aria-haspopup="listbox"
            aria-multiselectable={multiple ? 'true' : undefined}
            aria-controls={open ? fieldId + '-list' : undefined}
            aria-activedescendant={
              open && activeIndex >= 0 ? fieldId + '-opt-' + activeIndex : undefined
            }
            aria-invalid={error ? 'true' : undefined}
            aria-required={required ? 'true' : undefined}
            onClick={() => (disabled ? null : open ? setOpen(false) : openPanel())}
            onKeyDown={onKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...rest}
          >
            {multiple ? (
              chosen.length ? (
                multipleDisplay === 'count' ? (
                  <span className="medo-select__value">{chosen.length + ' ausgewählt'}</span>
                ) : (
                  <span className="medo-select__chips medo-select__chips--single" ref={chipsRef}>
                    {chosen
                      .slice(0, visibleChips)
                      .map((o, i) => renderChip(o, i === visibleChips - 1 && visibleChips === 1))}
                    {chosen.length > visibleChips ? (
                      <span
                        className="medo-select__more"
                        title={chosen
                          .slice(visibleChips)
                          .map((o) => o.label)
                          .join(', ')}
                      >
                        {'+' + (chosen.length - visibleChips)}
                      </span>
                    ) : null}
                    <span className="medo-select__mirror" aria-hidden="true" ref={mirrorRef}>
                      {chosen.map((o) => (
                        <span key={'m-' + o.value} className="medo-select__chip">
                          <span className="medo-select__chiplabel">{o.label}</span>
                          <span className="medo-select__chipx">
                            <Icon name="close" size={16} />
                          </span>
                        </span>
                      ))}
                      <span className="medo-select__more">{'+' + chosen.length}</span>
                    </span>
                  </span>
                )
              ) : (
                <span className="medo-select__value medo-select__value--placeholder">
                  {placeholder}
                </span>
              )
            ) : (
              <span
                className={
                  'medo-select__value' + (selected ? '' : ' medo-select__value--placeholder')
                }
              >
                {selected ? selected.label : placeholder}
              </span>
            )}
            <Icon
              name="expand_more"
              size={iconSize}
              className={'medo-select__chevron' + (open ? ' medo-select__chevron--open' : '')}
              color={disabled ? 'var(--medo-icon-disabled)' : 'var(--medo-icon-muted)'}
            />
          </Trigger>
          {name ? <input type="hidden" name={name} value={current || ''} /> : null}
        </div>
        {panel}
      </div>
    </Field>
  )
}
