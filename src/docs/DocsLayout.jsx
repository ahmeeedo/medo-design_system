import { useState, useEffect, useRef } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ThemeSwitcher } from './ThemeSwitcher'
import { MedoLogo } from './MedoLogo'
import { ICON_BTN } from './chromeStyles'
import { Icon } from '@/components/Icon/Icon'
import { headerLinks } from '@/config/headerLinks'
import { DocsSearch } from './DocsSearch'

export const NAV = [
  {
    id: 'about',
    icon: 'info',
    section: 'nav.sections.about',
    items: [
      { id: 'about',    label: 'nav.items.whatIsMedo' },
      { id: 'releases', label: 'nav.items.releases' },
    ],
  },
  {
    id: 'foundations',
    icon: 'palette',
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
    icon: 'widgets',
    section: 'nav.sections.components',
    /* Sorted by the English component name, not by the label on screen: the
       order is then the same in every language and a test can hold it. The
       route id already carries that name — dropping its hyphens gives the
       sort key, so `text-input` sorts as `TextInput` and lands after
       `textarea`. In the German interface the order therefore departs from
       the visible text in a few places. That is accepted, not a defect. */
    items: [
      { id: 'accordion',          label: 'nav.items.accordion' },
      { id: 'avatar',             label: 'nav.items.avatar' },
      { id: 'breadcrumb',         label: 'nav.items.breadcrumb' },
      { id: 'button',             label: 'nav.items.button' },
      { id: 'checkbox',           label: 'nav.items.checkbox' },
      { id: 'code-snippet',       label: 'nav.items.codeSnippet' },
      { id: 'contained-list',     label: 'nav.items.containedList' },
      { id: 'content-switcher',   label: 'nav.items.contentSwitcher' },
      { id: 'data-table',         label: 'nav.items.dataTable' },
      { id: 'date-picker',        label: 'nav.items.datePicker' },
      { id: 'dropdown',           label: 'nav.items.dropdown' },
      { id: 'file-uploader',      label: 'nav.items.fileUploader' },
      { id: 'inline-loading',     label: 'nav.items.inlineLoading' },
      { id: 'link',               label: 'nav.items.link' },
      { id: 'list',               label: 'nav.items.list' },
      { id: 'loading',            label: 'nav.items.loading' },
      { id: 'menu',               label: 'nav.items.menu' },
      { id: 'menu-buttons',       label: 'nav.items.menuButtons' },
      { id: 'modal',              label: 'nav.items.modal' },
      { id: 'notification',       label: 'nav.items.notification' },
      { id: 'number-input',       label: 'nav.items.numberInput' },
      { id: 'pagination',         label: 'nav.items.pagination' },
      { id: 'popover',            label: 'nav.items.popover' },
      { id: 'progress-bar',       label: 'nav.items.progressBar' },
      { id: 'progress-indicator', label: 'nav.items.progressIndicator' },
      { id: 'radio',              label: 'nav.items.radio' },
      { id: 'search',             label: 'nav.items.searchField' },
      { id: 'select',             label: 'nav.items.select' },
      { id: 'slider',             label: 'nav.items.slider' },
      { id: 'tabs',               label: 'nav.items.tabs' },
      { id: 'tag',                label: 'nav.items.tag' },
      { id: 'textarea',           label: 'nav.items.textarea' },
      { id: 'text-input',         label: 'nav.items.textInput' },
      { id: 'toggle',             label: 'nav.items.toggle' },
      { id: 'tooltip',            label: 'nav.items.tooltip' },
    ],
  },
]

const SIDEBAR_KEY = 'medo-sidebar-state'

/* Exactly one group stands open, and About is the one a visitor starts on.
   `null` is a real state: it means the visitor folded the open group away. */
const DEFAULT_OPEN_GROUP = 'about'

/* Reads the group a visitor left open. The stored value used to be a map of
   group id to boolean with several of them possibly true; that shape is
   carried over by taking the first group it had open, so nobody lands on a
   reset sidebar. Note the order of the checks: `typeof null` is 'object'.
   Runs as a lazy initializer, or the default would flash before the stored
   value arrives. */
function loadOpenGroup() {
  try {
    const raw = localStorage.getItem(SIDEBAR_KEY)
    if (!raw) return DEFAULT_OPEN_GROUP
    const stored = JSON.parse(raw)
    if (stored === null) return null
    if (typeof stored === 'string') return stored
    if (typeof stored === 'object') {
      return NAV.map((group) => group.id).find((id) => stored[id]) || null
    }
    return DEFAULT_OPEN_GROUP
  } catch {
    return DEFAULT_OPEN_GROUP
  }
}

/* Defined once in global.css as calc() over medo tokens; sticky offsets below
   refer back to it. */
const HEADER_H = 'var(--docs-header-height)'

/* The group heading reads as a heading again. The first pass took it down to
   text-xs muted and it disappeared; it now sits at the size of the entries
   with semibold weight and an icon of its own, so it leads the block instead
   of hiding above it. No capitals and no mono — those were what made the old
   one shout. radius-md, not the full radius: that one is the system's mark
   for chips and tags and does not belong on a navigation row. */
const NAV_SECTION = 'flex items-center justify-between gap-[var(--medo-space-xs)] w-full min-h-[var(--docs-hit-target)] px-[var(--medo-space-md)] [font-family:var(--medo-font-sans)] [font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-left cursor-pointer border-0 rounded-[var(--medo-radius-md)] transition-colors duration-150 ease-out outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-[var(--medo-focus-ring)]'

/* The open group is the one being read, so its heading carries a surface of
   its own and the full text colour; the folded ones step back to
   text-subtle. The surface is the pressed step, not the hover step: hover
   sits at 1.18:1 against the rail and reads as no surface at all, pressed
   reaches 1.4:1 light and 1.76:1 dark. It stays neutral on purpose — the
   teal tint belongs to the selected entry and would compete here. The open
   heading keeps that surface while hovered; its remaining feedback is the
   pointer and the focus ring. */
const NAV_SECTION_OPEN = 'text-[var(--medo-text)] bg-[var(--medo-state-pressed)]'
const NAV_SECTION_SHUT = 'text-[var(--medo-text-subtle)] hover:text-[var(--medo-text)] hover:bg-[var(--medo-state-hover)]'

/* A hairline between the groups, so the three blocks read apart without a
   second heading level. The first group needs none — nothing stands above it. */
const NAV_GROUP = 'border-t border-[var(--medo-divider)] pt-[var(--medo-space-2xs)] mt-[var(--medo-space-2xs)] first:border-t-0 first:pt-0 first:mt-0'

/* Every row sits on the 44px target, on the desktop as well as on touch, and
   carries radius-md. The rail holds the horizontal padding, so the row
   floats inside it instead of running into the edge. The vertical margin
   keeps two hovered rows from touching; adjacent margins collapse, so the
   gap between rows is one space-3xs, not two. */
const NAV_LINK_BASE = 'flex items-center w-full min-h-[var(--docs-hit-target)] my-[var(--medo-space-3xs)] px-[var(--medo-space-md)] [font-family:var(--medo-font-sans)] [font-size:var(--medo-text-sm)] text-left no-underline cursor-pointer rounded-[var(--medo-radius-md)] transition-colors duration-150 ease-out border-0 outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-[var(--medo-focus-ring)]'

/* The tinted surface sits at 1.18:1 against the rail and cannot carry the state
   on its own. It does not have to: the text goes from muted to full colour
   and from regular to semibold, and NavLink sets aria-current="page". Fill,
   colour and weight together, measured, not guessed. */
const NAV_LINK_ACTIVE = 'text-[var(--medo-text)] [font-weight:var(--medo-weight-semibold)] bg-[var(--medo-state-selected)]'
const NAV_LINK_INACTIVE = 'text-[var(--medo-text-muted)] [font-weight:var(--medo-weight-regular)] hover:text-[var(--medo-text)] hover:bg-[var(--medo-state-hover)]'

export function DocsLayout({ children }) {
  const { t } = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [linksOpen, setLinksOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState(loadOpenGroup)
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

  /* Opening one group folds the one that was open. Clicking the open group
     folds it too, so all three can be shut. The write stays outside the state
     updater: React may run an updater twice, and storage is not a place for
     that. */
  const toggleSection = (id) => {
    const next = openGroup === id ? null : id
    setOpenGroup(next)
    try {
      localStorage.setItem(SIDEBAR_KEY, JSON.stringify(next))
    } catch {
      /* A browser that refuses storage still gets a working sidebar. */
    }
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
          <MedoLogo className="h-[var(--medo-space-lg)] w-auto" />
        </Link>
        <div className="flex-1" />
        <ThemeSwitcher />
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
          className="w-[220px] shrink-0 sticky border-r border-[var(--medo-border)] bg-[var(--medo-surface)] overflow-y-auto px-[var(--medo-space-sm)] py-[var(--medo-space-md)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-md:fixed max-md:left-0 max-md:w-[280px] max-md:-translate-x-full max-md:transition-transform max-md:duration-200 max-md:ease-out max-md:z-50 max-md:shadow-[var(--medo-shadow-xl)] max-md:data-[mobile-open=true]:translate-x-0"
          style={{ top: HEADER_H, height: `calc(100vh - ${HEADER_H})` }}
        >
          {NAV.map((group) => (
            <div key={group.id} className={NAV_GROUP}>
              <button
                className={`${NAV_SECTION} ${openGroup === group.id ? NAV_SECTION_OPEN : NAV_SECTION_SHUT}`}
                onClick={() => toggleSection(group.id)}
                aria-expanded={openGroup === group.id}
              >
                <span className="flex items-center gap-[var(--medo-space-xs)] min-w-0">
                  <Icon name={group.icon} size={20} />
                  <span className="truncate">{t(group.section)}</span>
                </span>
                <Icon
                  name="chevron_right"
                  size={20}
                  className={`transition-transform duration-150 ease-out ${openGroup === group.id ? 'rotate-90' : ''}`}
                />
              </button>
              {openGroup === group.id && group.items.map((item) => (
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
