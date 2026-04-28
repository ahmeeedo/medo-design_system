import { useSearchParams } from 'react-router-dom'
import { Children } from 'react'
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

/* ── Sektionen & Container ── */
export function Section({ title, children }) {
  return (
    <div className={styles.Section}>
      {title && <h2 className={styles.sectionTitle}>{title}</h2>}
      {children}
    </div>
  )
}

export function GridWrapper({ children, gap }) {
  const count = Children.count(children)
  const colClass = styles[`grid-${count}`] ?? styles['grid-2']

  return (
    <div
      className={[styles.gridWrapper, colClass].join(' ')}
      style={gap ? { gap } : undefined}
    >
      {children}
    </div>
  )
}

export function Grid({ children, gap }) {
  return (
    <div className={styles.grid} style={gap ? { gap } : undefined}>
      {children}
    </div>
  )
}

Grid.Header = function GridHeader({ children, className }) {
  if (!children) return null
  return (
    <div className={[styles.gridHeader, className].filter(Boolean).join(' ')}>
      {children}
    </div>
  )
}

Grid.Body = function GridBody({ children, className }) {
  if (!children) return null
  return (
    <div className={[styles.gridBody, className].filter(Boolean).join(' ')}>
      {children}
    </div>
  )
}

Grid.Footer = function GridFooter({ children, className }) {
  if (!children) return null
  return (
    <div className={[styles.gridFooter, className].filter(Boolean).join(' ')}>
      {children}
    </div>
  )
}

export function Content({ children, className }) {
  if (!children) return null
  return (
    <div className={[styles.content, className].filter(Boolean).join(' ')}>
      {children}
    </div>
  )
}