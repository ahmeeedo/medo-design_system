import styles from './Skeleton.module.css'

/**
 * Skeleton
 * @param {'text'|'circle'|'rect'} variant
 * @param {string|number} width
 * @param {string|number} height
 */
export function Skeleton({ variant = 'rect', width, height, className = '' }) {
  return (
    <div
      className={[styles.skeleton, styles[variant], className].filter(Boolean).join(' ')}
      style={{ width, height }}
      aria-hidden="true"
    />
  )
}

/**
 * SkeletonCard — ready-made card skeleton
 */
export function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <Skeleton variant="circle" width={40} height={40} />
        <div className={styles.cardHeaderText}>
          <Skeleton variant="text" width="60%" height={14} />
          <Skeleton variant="text" width="40%" height={11} />
        </div>
      </div>
      <Skeleton variant="rect" height={120} style={{ borderRadius: 'var(--radius-lg)' }} />
      <Skeleton variant="text" width="90%" height={14} />
      <Skeleton variant="text" width="75%" height={14} />
      <Skeleton variant="text" width="55%" height={14} />
    </div>
  )
}
