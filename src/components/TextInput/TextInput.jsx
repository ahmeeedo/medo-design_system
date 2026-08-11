import { useId, useState } from 'react'
import { Icon } from '../Icon/Icon'
import { Field } from '../Field/Field'
import './TextInput.css'

/* medo Design System · TextInput
   Einzeiliges Eingabefeld. Nutzt das gemeinsame Feld-Gerüst aus Field.jsx.
   Zustände: Ruhe, Hover, Fokus, ausgefüllt, gesperrt, schreibgeschützt, Fehler, Erfolg. */

export function TextInput({
  label,
  floatingLabel = false,
  id,
  value,
  defaultValue,
  placeholder,
  type = 'text',
  size = 'md',
  required = false,
  optional = false,
  disabled = false,
  readOnly = false,
  hint,
  error,
  success,
  icon,
  prefix,
  suffix,
  maxLength,
  showCounter = false,
  clearable = false,
  onChange,
  onClear,
  fullWidth = false,
  inputMode,
  autoComplete,
  name,
  className,
  style,
  ...rest
}) {
  const [focused, setFocused] = useState(false)
  const [internal, setInternal] = useState(defaultValue || '')
  const [revealed, setRevealed] = useState(false)

  const isControlled = value !== undefined
  const current = isControlled ? value : internal
  const autoId = useId()
  const fieldId = id || autoId

  const iconSize = size === 'sm' ? 18 : size === 'lg' ? 21 : 19

  const handleChange = (e) => {
    if (!isControlled) setInternal(e.target.value)
    if (onChange) onChange(e)
  }

  const handleClear = () => {
    if (!isControlled) setInternal('')
    if (onClear) onClear()
  }

  const isPassword = type === 'password'
  const effectiveType = isPassword && revealed ? 'text' : type

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

  const box = (
    <div className={boxClasses}>
      {prefix ? <span className="medo-field__affix">{prefix}</span> : null}
      {icon ? <Icon name={icon} size={iconSize} color="var(--medo-icon-muted)" /> : null}
      <input
        id={fieldId}
        className="medo-field__control"
        type={effectiveType}
        value={current}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        maxLength={maxLength}
        inputMode={inputMode}
        autoComplete={autoComplete}
        name={name}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error || success || hint ? fieldId + '-msg' : undefined}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...rest}
      />
      {suffix ? <span className="medo-field__affix">{suffix}</span> : null}
      {showCounter && maxLength ? (
        <span className="medo-field__counter">
          {String(current || '').length + '/' + maxLength}
        </span>
      ) : null}
      {readOnly && !disabled ? (
        <Icon name="lock" size={iconSize} color="var(--medo-icon-muted)" />
      ) : null}
      {isPassword && !disabled && !readOnly ? (
        <button
          type="button"
          className="medo-field__iconbtn"
          aria-label={revealed ? 'Passwort verbergen' : 'Passwort anzeigen'}
          onClick={() => setRevealed((v) => !v)}
        >
          <Icon name={revealed ? 'visibility_off' : 'visibility'} size={19} />
        </button>
      ) : null}
      {clearable && current && !disabled && !readOnly ? (
        <button
          type="button"
          className="medo-field__iconbtn"
          aria-label="Feld leeren"
          onClick={handleClear}
        >
          <Icon name="cancel" size={19} />
        </button>
      ) : null}
      {error && !clearable && !isPassword ? (
        <Icon name="error" size={iconSize} color="var(--medo-error-solid)" />
      ) : null}
      {success && !error && !clearable && !isPassword ? (
        <Icon name="check_circle" size={iconSize} color="var(--medo-success-solid)" />
      ) : null}
    </div>
  )

  if (floatingLabel) {
    const up = focused || String(current || '').length > 0 || !!placeholder
    return (
      <Field
        htmlFor={fieldId}
        hint={hint}
        error={error}
        success={success}
        fullWidth={fullWidth}
        className={className}
        style={style}
      >
        <div
          className={[
            'medo-ti-float',
            up ? 'medo-ti-float--up' : null,
            focused ? 'medo-ti-float--focus' : null,
            error ? 'medo-ti-float--error' : null,
            disabled ? 'medo-ti-float--disabled' : null,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {box}
          <label className="medo-ti-float__label" htmlFor={fieldId}>
            {label}
            {required ? <span className="medo-ti-float__req">*</span> : null}
          </label>
        </div>
      </Field>
    )
  }

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
      {box}
    </Field>
  )
}
