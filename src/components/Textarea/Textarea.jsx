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
  required = false,
  optional = false,
  disabled = false,
  readOnly = false,
  hint,
  error,
  success,
  maxLength,
  showCounter = false,
  onChange,
  onFocus,
  onBlur,
  fullWidth = false,
  name,
  className,
  style,
  ...rest
}) {
  /* A default of the number 0 is a valid value. `defaultValue || ''` swallowed
     it, because 0 is falsy. */
  const [internal, setInternal] = useState(defaultValue != null ? String(defaultValue) : '')
  const [focused, setFocused] = useState(false)

  const isControlled = value !== undefined
  const current = isControlled ? value : internal
  const autoId = useId()
  const fieldId = id || autoId

  const handleChange = (e) => {
    if (!isControlled) setInternal(e.target.value)
    if (onChange) onChange(e)
  }
  /* The caller's own handler does not displace the built-in one — otherwise the
     focus ring would silently disappear as soon as anyone passes onFocus. */
  const handleFocus = (e) => {
    setFocused(true)
    if (onFocus) onFocus(e)
  }
  const handleBlur = (e) => {
    setFocused(false)
    if (onBlur) onBlur(e)
  }

  const msgId = error || success || hint ? fieldId + '-msg' : null
  /* A description the caller supplies joins the one pointing at the message
     instead of replacing it. aria-describedby takes several space-separated
     references; that is exactly the intended route. */
  const describedBy = [rest['aria-describedby'], msgId].filter(Boolean).join(' ') || undefined
  /* The built-in error marking stands: a field with a red message under it is
     invalid, whatever the caller passes. Without an error the caller decides. */
  const invalid = error ? 'true' : rest['aria-invalid']

  const boxClasses = [
    'medo-field__box',
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
          {...rest}
          id={fieldId}
          className="medo-field__control medo-ta__control"
          rows={rows}
          value={current}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          maxLength={maxLength}
          name={name}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
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
