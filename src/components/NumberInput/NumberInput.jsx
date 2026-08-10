import { useEffect, useId, useRef, useState } from 'react'
import { Icon } from '../Icon/Icon'
import { Field } from '../Field/Field'
import './NumberInput.css'

/* medo Design System · NumberInput
   Erfasst Zahlen mit Stepper. Zwei Varianten: Chevrons rechts (Standard) und
   Minus/Plus links und rechts (Touch). Grenzwerte, Schrittweite, Halten zum Wiederholen,
   Pfeiltasten und Mausrad. Baut auf dem Feld-Gerüst aus Field.jsx auf. */

export function NumberInput({
  label,
  id,
  value,
  defaultValue,
  min,
  max,
  step = 1,
  precision,
  variant = 'chevrons',
  size = 'md',
  prefix,
  suffix,
  align,
  required = false,
  optional = false,
  disabled = false,
  readOnly = false,
  hint,
  error,
  success,
  fullWidth = false,
  width,
  name,
  onChange,
  className,
  style,
  ...rest
}) {
  const [focused, setFocused] = useState(false)
  const [internal, setInternal] = useState(
    defaultValue !== undefined ? String(defaultValue) : ''
  )
  const isControlled = value !== undefined
  const current = isControlled ? String(value) : internal

  const inputRef = useRef(null)
  const holdRef = useRef(null)

  const autoId = useId()
  const fieldId = id || autoId

  const glyph = size === 'sm' ? 18 : size === 'lg' ? 22 : 20
  const isPlusMinus = variant === 'plusminus'

  const num = parseFloat(String(current).replace(',', '.'))
  const hasNum = !isNaN(num)
  const atMax = max !== undefined && hasNum && num >= max
  const atMin = min !== undefined && hasNum && num <= min
  const locked = disabled || readOnly

  const decimals =
    precision !== undefined ? precision : (String(step).split('.')[1] || '').length

  const commit = (raw) => {
    if (!isControlled) setInternal(raw)
    if (onChange) onChange({ target: { value: raw, name } })
  }

  const bump = (dir) => {
    if (locked) return
    let next = (hasNum ? num : min !== undefined ? min - step : 0) + dir * step
    if (min !== undefined && next < min) next = min
    if (max !== undefined && next > max) next = max
    commit(decimals ? next.toFixed(decimals) : String(next))
  }

  /* Gedrückt halten zählt fortlaufend weiter */
  const startHold = (dir) => {
    bump(dir)
    clearTimeout(holdRef.current)
    holdRef.current = setTimeout(function repeat() {
      bump(dir)
      holdRef.current = setTimeout(repeat, 80)
    }, 400)
  }
  const stopHold = () => clearTimeout(holdRef.current)
  useEffect(() => () => clearTimeout(holdRef.current), [])

  const onKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      bump(1)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      bump(-1)
    }
  }

  /* Mausrad nur bei Fokus, damit das Scrollen der Seite nicht gestört wird */
  useEffect(() => {
    const el = inputRef.current
    if (!el || !focused || locked) return
    const onWheel = (e) => {
      e.preventDefault()
      bump(e.deltaY < 0 ? 1 : -1)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [focused, locked, current, min, max, step])

  const stepBtn = (dir, place) => (
    <button
      key={place === 'first' ? 'first' : dir > 0 ? 'up' : 'down'}
      type="button"
      className={[
        'medo-num__step',
        'medo-num__step--' + size,
        place === 'first' ? 'medo-num__step--first' : null,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={dir > 0 ? 'Erhöhen' : 'Verringern'}
      tabIndex={-1}
      disabled={locked || (dir > 0 ? atMax : atMin)}
      onMouseDown={(e) => {
        e.preventDefault()
        startHold(dir)
      }}
      onMouseUp={stopHold}
      onMouseLeave={stopHold}
      onTouchStart={() => startHold(dir)}
      onTouchEnd={stopHold}
    >
      <Icon
        name={
          isPlusMinus
            ? dir > 0
              ? 'add'
              : 'remove'
            : dir > 0
              ? 'keyboard_arrow_up'
              : 'keyboard_arrow_down'
        }
        size={glyph}
      />
    </button>
  )

  const boxClasses = [
    'medo-field__box',
    'medo-field__box--' + size,
    focused && !disabled ? 'medo-field__box--focus' : null,
    error ? 'medo-field__box--error' : null,
    success && !error ? 'medo-field__box--success' : null,
    disabled ? 'medo-field__box--disabled' : null,
    readOnly && !disabled ? 'medo-field__box--readonly' : null,
  ]
    .filter(Boolean)
    .join(' ')

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
      className={['medo-num', isPlusMinus ? 'medo-num--plusminus' : null, className]
        .filter(Boolean)
        .join(' ')}
      style={width ? { width, ...style } : style}
    >
      <div className={boxClasses}>
        {isPlusMinus ? stepBtn(-1, 'first') : null}
        {prefix ? (
          <span className="medo-num__unit medo-num__unit--prefix">{prefix}</span>
        ) : null}
        <input
          ref={inputRef}
          id={fieldId}
          name={name}
          type="text"
          inputMode="decimal"
          className="medo-field__control medo-num__input"
          value={current}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          role="spinbutton"
          aria-valuenow={hasNum ? num : undefined}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-invalid={error ? 'true' : undefined}
          style={{
            textAlign: align || (isPlusMinus ? 'center' : 'left'),
            ...(isPlusMinus ? { padding: '0 8px' } : null),
          }}
          onChange={(e) => commit(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
        {suffix ? <span className="medo-num__unit">{suffix}</span> : null}
        {isPlusMinus ? stepBtn(1) : [stepBtn(-1), stepBtn(1)]}
      </div>
    </Field>
  )
}
