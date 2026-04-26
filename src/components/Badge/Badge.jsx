import styles from './Badge.module.css'

/**
 * Badge
 * @param {'neutral'|'accent'|'success'|'warning'|'error'} variant
 * @param {'sm'|'lg'} size
 * @param {boolean} dot  — show colored dot
 */
export function Badge({ variant = 'neutral', size = 'sm', dot = false, children }) {
  return (
    <span className={[styles.badge, styles[variant], styles[size]].join(' ')}>
      {dot && <span className={styles.dot} />}
      {children}
    </span>
  )
}

/**
 * Tag — removable chip
 */
export function Tag({ children, onRemove }) {
  return (
    <span className={styles.tag}>
      {children}
      {onRemove && (
        <button className={styles.tagRemove} onClick={onRemove} aria-label="Remove">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </span>
  )
}
