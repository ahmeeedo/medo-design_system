import styles from './DocSection.module.css'

/**
 * DocSection — wrapper for each documentation block
 */
export function DocSection({ id, title, description, children }) {
  return (
    <section id={id} className={styles.section}>
      <h2 className={styles.title}>{title}</h2>
      {description && <p className={styles.desc}>{description}</p>}
      <div className={styles.content}>{children}</div>
    </section>
  )
}

/**
 * SubSection — nested subsection within a DocSection
 */
export function SubSection({ title, children }) {
  return (
    <div className={styles.sub}>
      <div className={styles.subTitle}>{title}</div>
      {children}
    </div>
  )
}

/**
 * Row — horizontal flex row
 */
export function Row({ children, wrap = true, align = 'flex-start', gap = 'var(--space-3)' }) {
  return (
    <div className={styles.row} style={{ flexWrap: wrap ? 'wrap' : 'nowrap', alignItems: align, gap }}>
      {children}
    </div>
  )
}

/**
 * Grid2 — 2-column responsive grid
 */
export function Grid2({ children }) {
  return <div className={styles.grid2}>{children}</div>
}

/**
 * TokenChip — displays a CSS token name
 */
export function TokenChip({ children }) {
  return <code className={styles.token}>{children}</code>
}
