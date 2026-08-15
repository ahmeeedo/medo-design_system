import { useId, useState } from 'react'
import { Field } from '../Field/Field'
import './Textarea.css'

/* medo Design System · Textarea
   Mehrzeiliges Eingabefeld auf dem gemeinsamen Feld-Gerüst aus Field.jsx.
   Zustände: Ruhe, Hover, Fokus, gesperrt, schreibgeschützt, Fehler, Erfolg. */

export function Textarea({
  label,
  id,
  value,
  defaultValue,
  placeholder,
  rows = 3,
  size = 'md',
  required = false,
  optional = false,
  disabled = false,
  readOnly = false,
  hint,
  error,
  success,
  maxLength,
  showCounter = false,
  resize = 'vertical',
  onChange,
  fullWidth = false,
  name,
  className,
  style,
  ...rest
}) {
  const [focused, setFocused] = useState(false)
  const [internal, setInternal] = useState(defaultValue || '')

  const isControlled = value !== undefined
  const current = isControlled ? value : internal
  const autoId = useId()
  const fieldId = id || autoId

  const handleChange = (e) => {
    if (!isControlled) setInternal(e.target.value)
    if (onChange) onChange(e)
  }

  const boxClasses = [
    'medo-field__box',
    'medo-field__box--' + size,
    'medo-ta__box',
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
      className={className}
      style={style}
    >
      <div className={boxClasses}>
        <textarea
          id={fieldId}
          className={'medo-field__control medo-ta__control medo-ta__control--' + resize}
          rows={rows}
          value={current}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          maxLength={maxLength}
          name={name}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error || success || hint ? fieldId + '-msg' : undefined}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
        {showCounter && maxLength ? (
          <span className="medo-field__counter medo-ta__counter">
            {String(current || '').length + '/' + maxLength}
          </span>
        ) : null}
      </div>
    </Field>
  )
}
