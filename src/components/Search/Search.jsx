import { useEffect, useId, useRef, useState } from 'react'
import { Icon } from '../Icon/Icon'
import { Field } from '../Field/Field'
import './Search.css'

/* medo Design System · Search
   Sucht live während der Eingabe. Baut auf dem Feld-Gerüst aus Field.jsx auf:
   führende Lupe, Leeren-Schaltfläche, optionales Vorschlags-Panel mit letzten Suchen.
   Die Eingabe wird entprellt (debounce), damit nicht jeder Tastendruck eine Suche auslöst. */

export function Search({
  label,
  id,
  value,
  defaultValue = '',
  placeholder = 'Suchen …',
  size = 'md',
  loading = false,
  disabled = false,
  compact = false,
  suggestions = [],
  recent = [],
  emptyText,
  showPanel = true,
  defaultOpen = false,
  debounce = 250,
  hint,
  error,
  fullWidth = false,
  name,
  onChange,
  onSearch,
  onSelect,
  onRemoveRecent,
  className,
  style,
  ...rest
}) {
  const [focused, setFocused] = useState(false)
  const [open, setOpen] = useState(defaultOpen)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [internal, setInternal] = useState(defaultValue)

  const isControlled = value !== undefined
  const current = isControlled ? value : internal

  const wrapRef = useRef(null)
  const inputRef = useRef(null)
  const timerRef = useRef(null)

  const autoId = useId()
  const fieldId = id || autoId

  const iconSize = size === 'sm' ? 18 : size === 'lg' ? 22 : 20

  const norm = (list) => (list || []).map((o) => (typeof o === 'string' ? { label: o } : o))
  const recentItems = norm(recent)
  const suggestItems = norm(suggestions)

  const rows = []
  if (recentItems.length && !current) {
    rows.push({ group: 'Letzte Suchen' })
    recentItems.forEach((r) => rows.push({ ...r, kind: 'recent' }))
  }
  if (suggestItems.length) {
    rows.push({ group: 'Vorschläge' })
    suggestItems.forEach((s) => rows.push({ ...s, kind: 'suggest' }))
  }
  const pickable = rows.filter((r) => !r.group)
  const isEmpty = !!current && suggestItems.length === 0
  const panelVisible = showPanel && open && !disabled && (rows.length > 0 || isEmpty)

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const fire = (val) => {
    if (!onSearch) return
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => onSearch(val), debounce)
  }

  const setVal = (val) => {
    if (!isControlled) setInternal(val)
    if (onChange) onChange({ target: { value: val, name } })
  }

  const handleChange = (e) => {
    setVal(e.target.value)
    setActiveIndex(-1)
    setOpen(true)
    fire(e.target.value)
  }

  const choose = (item) => {
    setVal(item.label)
    setOpen(false)
    clearTimeout(timerRef.current)
    if (onSelect) onSelect(item)
    if (onSearch) onSearch(item.label)
  }

  const clear = () => {
    setVal('')
    setActiveIndex(-1)
    clearTimeout(timerRef.current)
    if (onSearch) onSearch('')
    if (inputRef.current) inputRef.current.focus()
  }

  const step = (dir) => {
    if (!pickable.length) return
    let i = activeIndex + dir
    if (i < 0) i = pickable.length - 1
    if (i >= pickable.length) i = 0
    setActiveIndex(i)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      step(1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setOpen(true)
      step(-1)
    } else if (e.key === 'Enter') {
      if (open && activeIndex >= 0 && pickable[activeIndex]) {
        e.preventDefault()
        choose(pickable[activeIndex])
      } else {
        clearTimeout(timerRef.current)
        if (onSearch) onSearch(current)
        setOpen(false)
      }
    } else if (e.key === 'Escape') {
      if (current) clear()
      else setOpen(false)
    }
  }

  /* Treffer im Vorschlag hervorheben */
  const highlight = (text) => {
    const q = String(current || '')
    if (!q) return text
    const i = String(text).toLowerCase().indexOf(q.toLowerCase())
    if (i < 0) return text
    return (
      <>
        {String(text).slice(0, i)}
        <strong>{String(text).slice(i, i + q.length)}</strong>
        {String(text).slice(i + q.length)}
      </>
    )
  }

  const boxClasses = compact
    ? ['medo-search__box--compact', focused ? 'medo-field__box--focus' : null]
        .filter(Boolean)
        .join(' ')
    : [
        'medo-field__box',
        'medo-field__box--' + size,
        focused && !disabled ? 'medo-field__box--focus' : null,
        error ? 'medo-field__box--error' : null,
        disabled ? 'medo-field__box--disabled' : null,
      ]
        .filter(Boolean)
        .join(' ')

  const box = (
    <div className={boxClasses}>
      {loading ? (
        <span className="medo-search__spinner" aria-hidden="true" />
      ) : (
        <Icon name="search" size={compact ? 18 : iconSize} color="var(--medo-icon-muted)" />
      )}
      <input
        ref={inputRef}
        id={fieldId}
        name={name}
        type="search"
        role="combobox"
        className="medo-field__control"
        value={current}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        aria-expanded={panelVisible ? 'true' : 'false'}
        aria-controls={panelVisible ? fieldId + '-list' : undefined}
        aria-autocomplete="list"
        aria-invalid={error ? 'true' : undefined}
        style={compact ? { fontSize: 'var(--medo-text-sm)' } : undefined}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        onFocus={() => {
          setFocused(true)
          setOpen(true)
        }}
        onBlur={() => setFocused(false)}
        {...rest}
      />
      {current && !disabled ? (
        <button
          type="button"
          className={compact ? 'medo-search__drop' : 'medo-field__iconbtn'}
          aria-label="Suche leeren"
          onMouseDown={(e) => e.preventDefault()}
          onClick={clear}
        >
          <Icon name="close" size={compact ? 16 : 19} />
        </button>
      ) : null}
    </div>
  )

  const panel = panelVisible ? (
    <div className="medo-search__panel" id={fieldId + '-list'} role="listbox">
      {isEmpty ? (
        <div className="medo-search__empty">
          <Icon name="search_off" size={32} color="var(--medo-icon-disabled)" />
          <div className="medo-search__empty-title">Keine Treffer</div>
          <div className="medo-search__empty-text">
            {emptyText || 'Für „' + current + '“ wurde nichts gefunden.'}
          </div>
        </div>
      ) : (
        rows.map((r, i) => {
          if (r.group) {
            return (
              <div key={'g' + i} className="medo-search__group">
                {r.group}
              </div>
            )
          }
          const pi = pickable.indexOf(r)
          return (
            <div
              key={r.kind + '-' + r.label}
              role="option"
              aria-selected={pi === activeIndex ? 'true' : 'false'}
              className={
                'medo-search__opt' + (pi === activeIndex ? ' medo-search__opt--active' : '')
              }
              onMouseEnter={() => setActiveIndex(pi)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(r)}
            >
              <Icon
                name={r.icon || (r.kind === 'recent' ? 'history' : 'search')}
                size={18}
                color="var(--medo-icon-muted)"
              />
              <span className="medo-search__opt-label">
                {r.kind === 'suggest' ? highlight(r.label) : r.label}
              </span>
              {r.kind === 'recent' && onRemoveRecent ? (
                <button
                  type="button"
                  className="medo-search__drop"
                  aria-label="Aus dem Verlauf entfernen"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemoveRecent(r)
                  }}
                >
                  <Icon name="close" size={16} />
                </button>
              ) : (
                <Icon name="north_west" size={17} color="var(--medo-icon-muted)" />
              )}
            </div>
          )
        })
      )}
    </div>
  ) : null

  const inner = (
    <div className="medo-search" ref={wrapRef} style={compact ? style : undefined}>
      {box}
      {panel}
    </div>
  )

  if (compact && !label) return inner

  return (
    <Field
      label={label}
      htmlFor={fieldId}
      hint={hint}
      error={error}
      fullWidth={fullWidth}
      className={className}
      style={style}
    >
      {inner}
    </Field>
  )
}
