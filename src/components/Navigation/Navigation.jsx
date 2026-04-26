import styles from './Navigation.module.css'

/**
 * Breadcrumb
 * @param {Array<{label: string, href?: string}>} items
 */
export function Breadcrumb({ items = [] }) {
  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={i} className={styles.crumbGroup}>
          {i > 0 && <span className={styles.sep} aria-hidden="true">/</span>}
          {item.href && i < items.length - 1
            ? <a href={item.href} className={styles.crumbLink}>{item.label}</a>
            : <span className={i === items.length - 1 ? styles.crumbCurrent : styles.crumbLink}>{item.label}</span>
          }
        </span>
      ))}
    </nav>
  )
}

/**
 * Pagination
 * @param {number} current — current page (1-indexed)
 * @param {number} total — total pages
 * @param {function} onChange
 */
export function Pagination({ current = 1, total = 1, onChange }) {
  const pages = buildPages(current, total)

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <button
        className={[styles.pageBtn, current === 1 ? styles.disabled : ''].join(' ')}
        onClick={() => onChange?.(current - 1)}
        disabled={current === 1}
        aria-label="Vorherige Seite"
      >
        ←
      </button>

      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} className={styles.ellipsis}>…</span>
        ) : (
          <button
            key={p}
            className={[styles.pageBtn, p === current ? styles.active : ''].join(' ')}
            onClick={() => onChange?.(p)}
            aria-current={p === current ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        className={[styles.pageBtn, current === total ? styles.disabled : ''].join(' ')}
        onClick={() => onChange?.(current + 1)}
        disabled={current === total}
        aria-label="Nächste Seite"
      >
        →
      </button>
    </nav>
  )
}

function buildPages(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, '…', total]
  if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '…', current - 1, current, current + 1, '…', total]
}

/**
 * StatCard — KPI card
 */
export function StatCard({ label, value, delta, deltaDir = 'up' }) {
  return (
    <div className={styles.stat}>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statValue}>{value}</div>
      {delta && (
        <div className={[styles.statDelta, styles[deltaDir]].join(' ')}>
          {deltaDir === 'up' ? '↑' : '↓'} {delta}
        </div>
      )}
    </div>
  )
}
