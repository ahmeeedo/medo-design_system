import { useEffect, useRef } from 'react'
import { Icon } from '../Icon/Icon'
import './Checkbox.css'

/* medo Design System · Checkbox
   Mehrfachauswahl. Eigene Grafik statt Systemhäkchen, damit Farbe, Radius und Fokusring
   aus den Tokens kommen. Unterstützt den unbestimmten Zwischenzustand. */

export function Checkbox({
  label,
  hint,
  checked,
  defaultChecked,
  indeterminate = false,
  disabled = false,
  error = false,
  size = 'md',
  name,
  value,
  onChange,
  id,
  className,
  style,
  ...rest
}) {
  const ref = useRef(null)
  const glyphSize = size === 'sm' ? 15 : 16

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate
  }, [indeterminate])

  return (
    <label
      className={['medo-cb', disabled ? 'medo-cb--disabled' : null, error ? 'medo-cb--error' : null, className]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      <input
        ref={ref}
        id={id}
        type="checkbox"
        className="medo-cb__native"
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        name={name}
        value={value}
        onChange={onChange}
        aria-invalid={error ? 'true' : undefined}
        {...rest}
      />
      <span className={'medo-cb__box medo-cb__box--' + size} aria-hidden="true">
        <Icon name={indeterminate ? 'remove' : 'check'} size={glyphSize} />
      </span>
      {label || hint ? (
        <span className="medo-cb__text">
          {label ? <span>{label}</span> : null}
          {hint ? <span className="medo-cb__hint">{hint}</span> : null}
        </span>
      ) : null}
    </label>
  )
}

export function CheckboxGroup({ legend, direction = 'vertical', children, className, style }) {
  return (
    <fieldset style={{ border: 'none', margin: 0, padding: 0, ...style }} className={className}>
      {legend ? (
        <legend
          style={{
            fontFamily: 'var(--medo-font-sans)',
            fontSize: 'var(--medo-text-sm)',
            fontWeight: 500,
            color: 'var(--medo-text)',
            padding: 0,
            marginBottom: '10px',
          }}
        >
          {legend}
        </legend>
      ) : null}
      <div className={'medo-cb-group' + (direction === 'horizontal' ? ' medo-cb-group--horizontal' : '')}>
        {children}
      </div>
    </fieldset>
  )
}
