import { useSearchParams } from 'react-router-dom'
import styles from './PageLayout.module.css'

export function PageLayout({ title, description, tabs = [] }) {
  const [searchParams, setSearchParams] = useSearchParams()

  // Lese aktiven Tab aus URL — fallback auf ersten Tab
  const activeFromUrl = searchParams.get('tab')
  const validTab = tabs.find(t => t.id === activeFromUrl)
  const active = validTab ? activeFromUrl : tabs[0]?.id

  const handleTabClick = (id) => {
    setSearchParams({ tab: id })
  }

  const activeContent = tabs.find(t => t.id === active)?.content

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.desc}>{description}</p>}
      </div>

      <div className={styles.tabBar}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={[styles.tab, active === tab.id ? styles.active : ''].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {activeContent}
      </div>
    </div>
  )
}

/* ── Usage Helpers ── */
export function SubSection({ title, children }) {
  return (
    <div className={styles.SubSection}>
      {title && <h3 className={styles.usageTitle}>{title}</h3>}
      {children}
    </div>
  )
}

export function GridContainer({ children }) {
  return <div className={styles.GridContainer}>{children}</div>
}

export function Do({ children }) {
  return (
    <div className={styles.do}>
      <div className={styles.doHeader}>✓ Do</div>
      <div className={styles.doBody}>{children}</div>
    </div>
  )
}

export function Dont({ children }) {
  return (
    <div className={styles.dont}>
      <div className={styles.dontHeader}>✕ Don't</div>
      <div className={styles.dontBody}>{children}</div>
    </div>
  )
}