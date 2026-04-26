import styles from './Progress.module.css'

/**
 * Progress bar
 * @param {number} value — 0 to 100
 * @param {'neutral'|'accent'|'success'|'warning'|'error'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {string} label
 */
export function Progress({ value = 0, variant = 'neutral', size = 'md', label, showValue = false }) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div className={styles.wrap}>
      {(label || showValue) && (
        <div className={styles.labelRow}>
          {label && <span className={styles.label}>{label}</span>}
          {showValue && <span className={styles.value}>{clamped}%</span>}
        </div>
      )}
      <div className={[styles.track, styles[size]].join(' ')} role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
        <div className={[styles.bar, styles[variant]].join(' ')} style={{ width: `${clamped}%` }} />
      </div>
    </div>
  )
}
