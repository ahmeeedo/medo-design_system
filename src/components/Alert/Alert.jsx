import styles from './Alert.module.css'

const ICONS = {
  info: 'ℹ',
  success: '✓',
  warning: '⚠',
  error: '✕',
}

/**
 * Alert
 * @param {'info'|'success'|'warning'|'error'} variant
 */
export function Alert({ variant = 'info', title, children }) {
  return (
    <div className={[styles.alert, styles[variant]].join(' ')} role="alert">
      <div className={styles.icon} aria-hidden="true">{ICONS[variant]}</div>
      <div className={styles.content}>
        {title && <div className={styles.title}>{title}</div>}
        {children && <div className={styles.desc}>{children}</div>}
      </div>
    </div>
  )
}

/**
 * Toast
 */
export function Toast({ children, action, onAction }) {
  return (
    <div className={styles.toast} role="status">
      <span className={styles.toastIcon}>✓</span>
      <span className={styles.toastMsg}>{children}</span>
      {action && (
        <button className={styles.toastAction} onClick={onAction}>
          {action}
        </button>
      )}
    </div>
  )
}
