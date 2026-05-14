import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from './LanguageSwitcher'
import styles from './DocsLayout.module.css'

const NAV = [
  {
    section: 'nav.sections.foundations',
    items: [
      { id: 'colors',     label: 'nav.items.colors' },
      { id: 'typography', label: 'nav.items.typography' },
      { id: 'spacing',    label: 'nav.items.spacing' },
      { id: 'radius',     label: 'nav.items.radius' },
      { id: 'shadows',    label: 'nav.items.shadows' },
      { id: 'motion',     label: 'nav.items.motion' },
    ],
  },
  {
    section: 'nav.sections.components',
    items: [
      { id: 'buttons',    label: 'nav.items.buttons' },
      { id: 'inputs',     label: 'nav.items.inputs' },
      { id: 'select',     label: 'nav.items.select' },
      { id: 'toggle',     label: 'nav.items.toggle' },
      { id: 'badges',     label: 'nav.items.badges' },
      { id: 'alerts',     label: 'nav.items.alerts' },
      { id: 'cards',      label: 'nav.items.cards' },
      { id: 'tables',     label: 'nav.items.tables' },
      { id: 'tabs',       label: 'nav.items.tabs' },
      { id: 'navigation', label: 'nav.items.navigation' },
      { id: 'overlays',   label: 'nav.items.overlays' },
      { id: 'accordion',  label: 'nav.items.accordion' },
      { id: 'menus',      label: 'nav.items.menus' },
      { id: 'lists',      label: 'nav.items.lists' },
      { id: 'stats',      label: 'nav.items.stats' },
      { id: 'feedback',   label: 'nav.items.feedback' },
      { id: 'avatar',     label: 'nav.items.avatar' },
      { id: 'skeleton',   label: 'nav.items.skeleton' },
    ],
  },
]

export function DocsLayout({ children }) {
  const { t } = useTranslation()
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
        <span className={styles.mobileLogo}>{t('nav.title')}</span>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button
            className={styles.hamburger}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? t('nav.aria.closeMenu') : t('nav.aria.openMenu')}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className={styles.overlay} onClick={close} />
      )}

      <nav className={[styles.nav, mobileOpen ? styles.navOpen : ''].join(' ')}>
        <div className={styles.navLogo}>
          <span>{t('nav.title')}</span>
          <LanguageSwitcher />
        </div>
        {NAV.map((group) => (
          <div key={group.section}>
            <div className={styles.navSection}>{t(group.section)}</div>
            {group.items.map((item) => (
              <NavLink
                key={item.id}
                to={`/${item.id}`}
                onClick={close}
                className={({ isActive }) =>
                  [styles.navLink, isActive ? styles.navLinkActive : ''].join(' ')
                }
              >
                {t(item.label)}
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
