import styles from './Input.module.css'

/**
 * Input
 * @param {'default'|'error'} state
 * @param {'sm'|'md'|'lg'} size
 */
export function Input({
  label,
  hint,
  error,
  size = 'md',
  className = '',
  ...props
}) {
  const state = error ? 'error' : 'default'
  return (
    <div className={styles.wrap}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        className={[styles.input, styles[size], styles[state], className].filter(Boolean).join(' ')}
        {...props}
      />
      {error && <span className={styles.errorMsg}>{error}</span>}
      {hint && !error && <span className={styles.hint}>{hint}</span>}
    </div>
  )
}

/**
 * Textarea
 */
export function Textarea({
  label,
  hint,
  error,
  rows = 3,
  className = '',
  ...props
}) {
  const state = error ? 'error' : 'default'
  return (
    <div className={styles.wrap}>
      {label && <label className={styles.label}>{label}</label>}
      <textarea
        rows={rows}
        className={[styles.input, styles.textarea, styles[state], className].filter(Boolean).join(' ')}
        {...props}
      />
      {error && <span className={styles.errorMsg}>{error}</span>}
      {hint && !error && <span className={styles.hint}>{hint}</span>}
    </div>
  )
}

/**
 * Select
 */
export function Select({
  label,
  hint,
  options = [],
  className = '',
  ...props
}) {
  return (
    <div className={styles.wrap}>
      {label && <label className={styles.label}>{label}</label>}
      <select className={[styles.select, className].filter(Boolean).join(' ')} {...props}>
        {options.map((opt) =>
          typeof opt === 'string'
            ? <option key={opt} value={opt}>{opt}</option>
            : <option key={opt.value} value={opt.value}>{opt.label}</option>
        )}
      </select>
      {hint && <span className={styles.hint}>{hint}</span>}
    </div>
  )
}

/**
 * InputWithAddon — right-side addon (e.g. ".de")
 */
export function InputWithAddon({ addon, className = '', ...props }) {
  return (
    <div className={styles.addonWrap}>
      <input className={[styles.input, styles.addonInput, className].filter(Boolean).join(' ')} {...props} />
      <div className={styles.addon}>{addon}</div>
    </div>
  )
}
