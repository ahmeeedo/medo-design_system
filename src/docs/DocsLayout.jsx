import { useState, useEffect, useRef } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from './LanguageSwitcher'
import { Icon } from '@/components/Icon/Icon'
import { headerLinks } from '@/config/headerLinks'
import { DocsSearch } from './DocsSearch'

const NAV = [
  {
    id: 'about',
    section: 'nav.sections.about',
    items: [
      { id: 'about',    label: 'nav.items.whatIsMedo' },
      { id: 'releases', label: 'nav.items.releases' },
    ],
  },
  {
    id: 'foundations',
    section: 'nav.sections.foundations',
    items: [
      { id: 'brand',           label: 'nav.items.brand' },
      { id: 'brand-colors',    label: 'nav.items.brandColors' },
      { id: 'alias-colors',    label: 'nav.items.aliasColors' },
      { id: 'semantic-colors', label: 'nav.items.semanticColors' },
      { id: 'typography',      label: 'nav.items.typography' },
      { id: 'foundations',     label: 'nav.items.foundations' },
    ],
  },
  {
    id: 'components',
    section: 'nav.sections.components',
    items: [
      { id: 'button',       label: 'nav.items.button' },
      { id: 'link',         label: 'nav.items.link' },
      { id: 'text-input',   label: 'nav.items.textInput' },
      { id: 'number-input', label: 'nav.items.numberInput' },
      { id: 'select',     label: 'nav.items.select' },
      { id: 'search',       label: 'nav.items.searchField' },
      { id: 'toggle',     label: 'nav.items.toggle' },
      { id: 'checkbox',   label: 'nav.items.checkbox' },
      { id: 'radio',      label: 'nav.items.radio' },
      { id: 'tag',        label: 'nav.items.tag' },
      { id: 'alerts',     label: 'nav.items.alerts' },
      { id: 'cards',      label: 'nav.items.cards' },
      { id: 'tables',     label: 'nav.items.tables' },
      { id: 'tabs',       label: 'nav.items.tabs' },
      { id: 'navigation', label: 'nav.items.navigation' },
      { id: 'overlays',   label: 'nav.items.overlays' },
      { id: 'accordion',  label: 'nav.items.accordion' },
      { id: 'menus',      label: 'nav.items.menus' },
      { id: 'list',           label: 'nav.items.list' },
      { id: 'contained-list', label: 'nav.items.containedList' },
      { id: 'pagination',     label: 'nav.items.pagination' },
      { id: 'stats',      label: 'nav.items.stats' },
      { id: 'feedback',   label: 'nav.items.feedback' },
      { id: 'avatar',     label: 'nav.items.avatar' },
      { id: 'skeleton',   label: 'nav.items.skeleton' },
      { id: 'date-picker',       label: 'nav.items.datePicker' },
      { id: 'loading-indicator', label: 'nav.items.loadingIndicator' },
      { id: 'slider',            label: 'nav.items.slider' },
      { id: 'tooltip',           label: 'nav.items.tooltip' },
      { id: 'upload-field',      label: 'nav.items.uploadField' },
    ],
  },
]

const DEFAULT_SIDEBAR_STATE = { about: true, foundations: true, components: true }

function loadSidebarState() {
  try {
    const raw = localStorage.getItem('medo-sidebar-state')
    return raw ? { ...DEFAULT_SIDEBAR_STATE, ...JSON.parse(raw) } : DEFAULT_SIDEBAR_STATE
  } catch {
    return DEFAULT_SIDEBAR_STATE
  }
}

/* Defined once in global.css as calc() over medo tokens; sticky offsets below
   refer back to it. */
const HEADER_H = 'var(--docs-header-height)'

const ICON_BTN = 'flex items-center justify-center w-[var(--docs-hit-target)] h-[var(--docs-hit-target)] rounded-[var(--medo-radius-md)] text-[var(--medo-icon)] cursor-pointer bg-transparent border-0 transition-colors duration-150 ease-out hover:bg-[var(--medo-state-hover)] active:bg-[var(--medo-state-pressed)] outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--medo-focus-ring)]'

const NAV_LINK_BASE = 'block w-full px-[var(--medo-space-lg)] py-[var(--medo-space-xs)] [font-family:var(--medo-font-sans)] text-sm text-left no-underline cursor-pointer transition-colors duration-150 ease-out border-0 border-l-2 outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-[var(--medo-focus-ring)]'
const NAV_LINK_ACTIVE = 'text-[var(--medo-text)] [font-weight:var(--medo-weight-semibold)] bg-[var(--medo-state-selected)] border-l-[var(--medo-action)]'
const NAV_LINK_INACTIVE = 'text-[var(--medo-text-muted)] [font-weight:var(--medo-weight-regular)] border-l-transparent hover:text-[var(--medo-text)] hover:bg-[var(--medo-state-hover)]'

export function DocsLayout({ children }) {
  const { t } = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [linksOpen, setLinksOpen] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(loadSidebarState)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
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

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const close = () => setMobileOpen(false)

  const toggleSection = (id) => {
    setSidebarExpanded((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      localStorage.setItem('medo-sidebar-state', JSON.stringify(next))
      return next
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--medo-surface-container)] [font-family:var(--medo-font-sans)] text-[var(--medo-text)]">

      {/* Sticky full-width header */}
      <header
        className="sticky top-0 z-30 w-full flex items-center px-[var(--medo-space-md)] gap-[var(--medo-space-2xs)] bg-[var(--medo-surface)] border-b border-[var(--medo-border)]"
        style={{ height: HEADER_H }}
      >
        <button
          className={`${ICON_BTN} hidden max-md:flex`}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? t('nav.aria.closeMenu') : t('nav.aria.openMenu')}
        >
          {mobileOpen ? <Icon name="close" size={24} /> : <Icon name="menu" size={24} />}
        </button>
        <Link to="/" className="flex items-center ml-[var(--medo-space-2xs)] outline-none rounded-[var(--medo-radius-sm)] focus-visible:ring-[3px] focus-visible:ring-[var(--medo-focus-ring)]">
          <img src="/logo-medo.svg" alt="medo" className="h-[var(--medo-space-lg)] w-auto" />
        </Link>
        <div className="flex-1" />
        <LanguageSwitcher />
        <button className={ICON_BTN} aria-label={t('header.aria.search')} onClick={() => setIsSearchOpen(true)}>
          <Icon name="search" size={24} />
        </button>
        <div className="relative" ref={dropdownRef}>
          <button
            className={ICON_BTN}
            onClick={() => setLinksOpen((v) => !v)}
            aria-label={t('header.aria.links')}
          >
            <Icon name="open_in_new" size={24} />
          </button>
          {linksOpen && (
            <div className="absolute right-0 top-full mt-[var(--medo-space-2xs)] min-w-[180px] bg-[var(--medo-overlay)] border border-[var(--medo-border)] rounded-[var(--medo-radius-md)] shadow-[var(--medo-shadow-md)] overflow-hidden z-40">
              {headerLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-[var(--medo-space-xs)] px-[var(--medo-space-sm)] py-[var(--medo-space-xs)] text-sm text-[var(--medo-text-subtle)] no-underline transition-colors duration-150 ease-out hover:text-[var(--medo-text)] hover:bg-[var(--medo-state-hover)] outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-[var(--medo-focus-ring)]"
                >
                  <Icon name={link.icon} size={18} />
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
          className="hidden max-md:block fixed left-0 right-0 bottom-0 z-40 bg-[var(--medo-scrim)] animate-[fadeIn_200ms_ease-out]"
          style={{ top: HEADER_H }}
          onClick={close}
        />
      )}

      {/* Layout body */}
      <div className="flex flex-row flex-1">

        {/* Sidebar — sticky on desktop, overlay on mobile */}
        <nav
          data-mobile-open={mobileOpen}
          className="w-[220px] shrink-0 sticky border-r border-[var(--medo-border)] bg-[var(--medo-surface)] overflow-y-auto py-[var(--medo-space-md)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-md:fixed max-md:left-0 max-md:w-[280px] max-md:-translate-x-full max-md:transition-transform max-md:duration-200 max-md:ease-out max-md:z-50 max-md:shadow-[var(--medo-shadow-xl)] max-md:data-[mobile-open=true]:translate-x-0"
          style={{ top: HEADER_H, height: `calc(100vh - ${HEADER_H})` }}
        >
          {NAV.map((group) => (
            <div key={group.id}>
              <button
                className="flex items-center justify-between w-full px-[var(--medo-space-lg)] pt-[var(--medo-space-sm)] pb-[var(--medo-space-2xs)] [font-family:var(--medo-font-mono)] [font-size:var(--medo-text-xs)] uppercase tracking-[0.12em] text-[var(--medo-text-muted)] cursor-pointer bg-transparent border-0 transition-colors duration-150 ease-out hover:text-[var(--medo-text)] outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-[var(--medo-focus-ring)]"
                onClick={() => toggleSection(group.id)}
                aria-expanded={sidebarExpanded[group.id]}
              >
                <span>{t(group.section)}</span>
                <Icon
                  name="chevron_right"
                  size={18}
                  className={`transition-transform duration-150 ease-out ${sidebarExpanded[group.id] ? 'rotate-90' : ''}`}
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

      <DocsSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Full-width footer */}
      <footer className="w-full bg-[var(--medo-surface-container)] border-t border-[var(--medo-border)] px-[var(--medo-space-lg)] py-[var(--medo-space-md)] flex items-center justify-between flex-wrap gap-[var(--medo-space-sm)]">
        <span className="text-sm text-[var(--medo-text-muted)]">
          © {new Date().getFullYear()} medo
        </span>
        <div className="flex gap-[var(--medo-space-md)]">
          <Link
            to="/impressum"
            className="text-sm text-[var(--medo-text-muted)] no-underline transition-colors duration-150 ease-out hover:text-[var(--medo-text)] outline-none rounded-[var(--medo-radius-sm)] focus-visible:ring-[3px] focus-visible:ring-[var(--medo-focus-ring)]"
          >
            {t('footer.impressum')}
          </Link>
          <Link
            to="/datenschutz"
            className="text-sm text-[var(--medo-text-muted)] no-underline transition-colors duration-150 ease-out hover:text-[var(--medo-text)] outline-none rounded-[var(--medo-radius-sm)] focus-visible:ring-[3px] focus-visible:ring-[var(--medo-focus-ring)]"
          >
            {t('footer.datenschutz')}
          </Link>
        </div>
      </footer>
    </div>
  )
}
