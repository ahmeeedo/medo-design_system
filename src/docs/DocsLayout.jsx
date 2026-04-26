import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import styles from './DocsLayout.module.css'

const NAV = [
  {
    section: 'Foundations',
    items: [
      { id: 'colors',     label: 'Colors' },
      { id: 'typography', label: 'Typography' },
      { id: 'spacing',    label: 'Spacing' },
      { id: 'radius',     label: 'Border Radius' },
      { id: 'shadows',    label: 'Shadows' },
      { id: 'motion',     label: 'Motion' },
    ],
  },
  {
    section: 'Components',
    items: [
      { id: 'buttons',    label: 'Buttons' },
      { id: 'inputs',     label: 'Inputs' },
      { id: 'selects',    label: 'Select & Toggle' },
      { id: 'badges',     label: 'Badges & Tags' },
      { id: 'alerts',     label: 'Alerts' },
      { id: 'cards',      label: 'Cards' },
      { id: 'tables',     label: 'Tables' },
      { id: 'tabs',       label: 'Tabs' },
      { id: 'navigation', label: 'Navigation' },
      { id: 'overlays',   label: 'Modal' },
      { id: 'accordion',  label: 'Accordion' },
      { id: 'menus',      label: 'Menus' },
      { id: 'lists',      label: 'Lists' },
      { id: 'stats',      label: 'Stats / KPI' },
      { id: 'feedback',   label: 'Feedback' },
      { id: 'avatar',     label: 'Avatar' },
      { id: 'skeleton',   label: 'Skeleton' },
    ],
  },
]

export function DocsLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const handler = (e) => { if (e.matches) setMobileOpen(false) }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const close = () => setMobileOpen(false)

  return (
    <div className={styles.layout}>

      <header className={styles.mobileHeader}>
        <span className={styles.mobileLogo}>Design System</span>
        <button
          className={styles.hamburger}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Menü schließen' : 'Menü öffnen'}
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </header>

      {mobileOpen && (
        <div className={styles.overlay} onClick={close} />
      )}

      <nav className={[styles.nav, mobileOpen ? styles.navOpen : ''].join(' ')}>
        <div className={styles.navLogo}>Design System</div>
        {NAV.map((group) => (
          <div key={group.section}>
            <div className={styles.navSection}>{group.section}</div>
            {group.items.map((item) => (
              <NavLink
                key={item.id}
                to={`/${item.id}`}
                onClick={close}
                className={({ isActive }) =>
                  [styles.navLink, isActive ? styles.navLinkActive : ''].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <main className={styles.main}>{children}</main>
    </div>
  )
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}