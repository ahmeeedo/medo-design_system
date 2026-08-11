import { useId, useState } from 'react'
import './Radio.css'

/* medo Design System · Radio
   Einfachauswahl aus einer überschaubaren Menge. Eigene Grafik, damit Farbe und Fokusring
   aus den Tokens kommen. RadioGroup übernimmt Name, Wert und Beschriftung der Gruppe. */

export function Radio({
  label,
  hint,
  checked,
  defaultChecked,
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
  return (
    <label
      className={['medo-rb', disabled ? 'medo-rb--disabled' : null, error ? 'medo-rb--error' : null, className]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      <input
        id={id}
        type="radio"
        className="medo-rb__native"
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        name={name}
        value={value}
        onChange={onChange}
        aria-invalid={error ? 'true' : undefined}
        {...rest}
      />
      <span className={'medo-rb__circle medo-rb__circle--' + size} aria-hidden="true">
        <span className="medo-rb__dot" />
      </span>
      {label || hint ? (
        <span className="medo-rb__text">
          {label ? <span>{label}</span> : null}
          {hint ? <span className="medo-rb__hint">{hint}</span> : null}
        </span>
      ) : null}
    </label>
  )
}

export function RadioGroup({
  legend,
  name,
  value,
  defaultValue,
  onChange,
  direction = 'vertical',
  variant = 'list',
  disabled = false,
  size = 'md',
  options,
  children,
  className,
  style,
}) {
  // The reference calls its hook behind `name || …`, which breaks the rules of hooks as soon as
  // `name` switches between set and unset. Generating unconditionally keeps the identity stable.
  const fallbackName = useId()
  const groupName = name || fallbackName

  const [internal, setInternal] = useState(defaultValue)
  const isControlled = value !== undefined
  const current = isControlled ? value : internal

  const handleChange = e => {
    if (!isControlled) setInternal(e.target.value)
    if (onChange) onChange(e)
  }

  const items =
    variant === 'card' && options
      ? options.map((o, i) => {
          const on = current === o.value
          const dis = disabled || o.disabled
          return (
            <label
              key={o.value != null ? o.value : i}
              className={['medo-rb-card', on ? 'medo-rb-card--on' : null, dis ? 'medo-rb-card--disabled' : null]
                .filter(Boolean)
                .join(' ')}
              style={{ position: 'relative' }}
            >
              <input
                type="radio"
                className="medo-rb-card__native"
                name={groupName}
                value={o.value}
                checked={current !== undefined ? on : undefined}
                disabled={dis}
                onChange={handleChange}
              />
              <span className="medo-rb-card__head">
                <span className="medo-rb-card__name">{o.label}</span>
                <span className="medo-rb-card__ring" aria-hidden="true">
                  {on ? <span className="medo-rb-card__dot" /> : null}
                </span>
              </span>
              {o.hint ? <span className="medo-rb-card__desc">{o.hint}</span> : null}
            </label>
          )
        })
      : options
        ? options.map((o, i) => (
            <Radio
              key={o.value != null ? o.value : i}
              name={groupName}
              value={o.value}
              label={o.label}
              hint={o.hint}
              size={size}
              disabled={disabled || o.disabled}
              checked={current !== undefined ? current === o.value : undefined}
              onChange={handleChange}
            />
          ))
        : children

  return (
    <fieldset style={{ border: 'none', margin: 0, padding: 0, ...style }} className={className} role="radiogroup">
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
      <div
        className={
          'medo-rb-group' +
          (variant === 'card'
            ? ' medo-rb-group--card'
            : direction === 'horizontal'
              ? ' medo-rb-group--horizontal'
              : '')
        }
      >
        {items}
      </div>
    </fieldset>
  )
}
