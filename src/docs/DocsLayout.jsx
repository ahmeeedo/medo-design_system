import { useState, useEffect, useRef } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from './LanguageSwitcher'
import { Icon } from '@/components/Icon/Icon'
import { headerLinks } from '@/config/headerLinks'

const NAV = [
  {
    id: 'foundations',
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
    id: 'components',
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

const DEFAULT_SIDEBAR_STATE = { foundations: true, components: true }

function loadSidebarState() {
  try {
    const raw = localStorage.getItem('medo-sidebar-state')
    return raw ? { ...DEFAULT_SIDEBAR_STATE, ...JSON.parse(raw) } : DEFAULT_SIDEBAR_STATE
  } catch {
    return DEFAULT_SIDEBAR_STATE
  }
}

const ICON_BTN = 'flex items-center justify-center w-9 h-9 rounded-[var(--radius-md)] text-[var(--color-text-primary)] cursor-pointer transition-[background] duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-[var(--color-neutral-100)] bg-transparent border-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-500)] focus-visible:ring-offset-1'

const NAV_LINK_BASE = 'block w-full px-[var(--space-5)] py-[var(--space-2)] [font-family:var(--font-sans)] text-sm text-left no-underline cursor-pointer transition-[color,background,border-color] duration-[var(--duration-fast)] ease-[var(--ease-out)] bg-transparent border-0 border-l-2 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-focus-500)]'
const NAV_LINK_ACTIVE = 'text-[var(--color-text-primary)] [font-weight:var(--weight-semibold)] bg-[var(--accent-surface_100)] border-l-[var(--color-brand-primary-500)]'
const NAV_LINK_INACTIVE = 'text-[var(--color-text-secondary)] [font-weight:var(--weight-regular)] border-l-transparent hover:text-[var(--color-text-primary)] hover:bg-[var(--surface_200)]'

export function DocsLayout({ children }) {
  const { t } = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [linksOpen, setLinksOpen] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(loadSidebarState)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const handler = (e) => { if (e.matches) setMobileOpen(false) }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 767px)').matches
    document.body.style.overflow = mobileOpen && isMobile ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => {
    if (!linksOpen) return
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setLinksOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [linksOpen])

  const close = () => setMobileOpen(false)

  const toggleSection = (id) => {
    setSidebarExpanded((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      localStorage.setItem('medo-sidebar-state', JSON.stringify(next))
      return next
    })
  }

  return (
    <div className="min-h-screen flex flex-col">

      {/* Sticky full-width header */}
      <header className="sticky top-0 z-[var(--z-sticky)] w-full flex items-center h-[var(--header-height)] px-[var(--space-4)] gap-[var(--space-2)] bg-[var(--surface_100)] border-b border-[var(--color-border)]">
        <button
          className={ICON_BTN}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? t('nav.aria.closeMenu') : t('nav.aria.openMenu')}
        >
          {mobileOpen ? <Icon name="close" /> : <Icon name="menu" />}
        </button>
        <span className="text-sm [font-weight:var(--weight-semibold)] tracking-[var(--tracking-wide)] text-[var(--color-text-primary)]">
          med.o
        </span>
        <div className="flex-1" />
        <LanguageSwitcher />
        <button className={ICON_BTN} aria-label={t('header.aria.search')}>
          <Icon name="search" />
        </button>
        <div className="relative" ref={dropdownRef}>
          <button
            className={ICON_BTN}
            onClick={() => setLinksOpen((v) => !v)}
            aria-label={t('header.aria.links')}
          >
            <Icon name="open_in_new" />
          </button>
          {linksOpen && (
            <div className="absolute right-0 top-full mt-1 min-w-[160px] bg-[var(--surface_100)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-[var(--shadow-md)] overflow-hidden z-[var(--z-dropdown)]">
              {headerLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-[var(--space-2)] px-[var(--space-3)] py-[var(--space-2)] text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--surface_200)] transition-[color,background] duration-[var(--duration-fast)] no-underline"
                >
                  <Icon name={link.icon} />
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Mobile backdrop — hidden on desktop */}
      {mobileOpen && (
        <div
          className="hidden max-md:block fixed left-0 right-0 bottom-0 top-[var(--header-height)] bg-black/40 [z-index:calc(var(--z-sticky)+1)] animate-[fadeIn_var(--duration-normal)_var(--ease-out)]"
          onClick={close}
        />
      )}

      {/* Layout body */}
      <div className="flex flex-row flex-1">

        {/* Sidebar — sticky on desktop, overlay on mobile */}
        <nav
          data-mobile-open={mobileOpen}
          className="w-[220px] shrink-0 sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] border-r border-[var(--color-border)] bg-[var(--surface_100)] overflow-y-auto py-[var(--space-4)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-md:fixed max-md:top-[var(--header-height)] max-md:left-0 max-md:h-[calc(100vh-var(--header-height))] max-md:w-[280px] max-md:-translate-x-full max-md:transition-transform max-md:duration-[var(--duration-slow)] max-md:ease-[var(--ease-out)] max-md:[z-index:calc(var(--z-sticky)+2)] max-md:shadow-[var(--shadow-xl)] max-md:data-[mobile-open=true]:translate-x-0"
        >
          {NAV.map((group) => (
            <div key={group.id}>
              <button
                className="flex items-center justify-between w-full px-[var(--space-5)] pt-[var(--space-3)] pb-[var(--space-1)] text-xs [font-weight:var(--weight-semibold)] tracking-[var(--tracking-widest)] uppercase text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-[var(--duration-fast)] cursor-pointer bg-transparent border-0 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-focus-500)]"
                onClick={() => toggleSection(group.id)}
                aria-expanded={sidebarExpanded[group.id]}
              >
                <span>{t(group.section)}</span>
                <Icon
                  name="chevron_right"
                  className={`transition-transform duration-[var(--duration-fast)] ease-[var(--ease-out)] ${sidebarExpanded[group.id] ? 'rotate-90' : ''}`}
                />
              </button>
              {sidebarExpanded[group.id] && group.items.map((item) => (
                <NavLink
                  key={item.id}
                  to={`/${item.id}`}
                  onClick={close}
                  className={({ isActive }) =>
                    `${NAV_LINK_BASE} ${isActive ? NAV_LINK_ACTIVE : NAV_LINK_INACTIVE}`
                  }
                >
                  {t(item.label)}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>

      {/* Full-width footer */}
      <footer className="w-full bg-[var(--surface_200)] border-t border-[var(--color-border)] px-[var(--space-5)] py-[var(--space-4)] flex items-center justify-between flex-wrap gap-[var(--space-3)]">
        <span className="text-sm text-[var(--color-text-secondary)]">
          © {new Date().getFullYear()} med.o
        </span>
        <div className="flex gap-[var(--space-4)]">
          <Link
            to="/impressum"
            className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] no-underline transition-colors duration-[var(--duration-fast)]"
          >
            {t('footer.impressum')}
          </Link>
          <Link
            to="/datenschutz"
            className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] no-underline transition-colors duration-[var(--duration-fast)]"
          >
            {t('footer.datenschutz')}
          </Link>
        </div>
      </footer>
    </div>
  )
}
