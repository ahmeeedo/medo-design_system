import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from './LanguageSwitcher'

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
    <div className="flex min-h-screen">

      <header className="hidden max-md:flex max-md:items-center max-md:justify-between max-md:fixed max-md:top-0 max-md:left-0 max-md:right-0 max-md:h-[56px] max-md:px-[var(--space-5)] max-md:bg-[var(--surface_100)] max-md:border-b max-md:border-[var(--color-border)] max-md:z-[var(--z-sticky)]">
        <span className="text-sm [font-weight:var(--weight-semibold)] tracking-[var(--tracking-wide)] uppercase text-[var(--color-text-primary)]">
          {t('nav.title')}
        </span>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button
            className="flex items-center justify-center w-9 h-9 rounded-[var(--radius-md)] text-[var(--color-text-primary)] cursor-pointer transition-[background] duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-[var(--color-neutral-100)] bg-transparent border-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-500)] focus-visible:ring-offset-1"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? t('nav.aria.closeMenu') : t('nav.aria.openMenu')}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div
          className="hidden max-md:block fixed inset-0 bg-black/40 [z-index:calc(var(--z-sticky)+1)] animate-[fadeIn_var(--duration-normal)_var(--ease-out)]"
          onClick={close}
        />
      )}

      <nav
        data-mobile-open={mobileOpen}
        className="fixed top-0 left-0 w-[220px] h-screen border-r border-[var(--color-border)] bg-[var(--surface_100)] overflow-y-auto py-[var(--space-6)] z-[var(--z-sticky)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-md:w-[280px] max-md:-translate-x-full max-md:transition-transform max-md:duration-[var(--duration-slow)] max-md:ease-[var(--ease-out)] max-md:[z-index:calc(var(--z-sticky)+2)] max-md:pt-[var(--space-14)] max-md:shadow-[var(--shadow-xl)] max-md:data-[mobile-open=true]:translate-x-0"
      >
        <div className="flex items-center justify-between px-[var(--space-5)] pb-[var(--space-6)] text-sm [font-weight:var(--weight-semibold)] tracking-[var(--tracking-wide)] uppercase text-[var(--color-text-primary)] border-b border-[var(--color-border)] mb-[var(--space-4)] max-md:hidden">
          <span>{t('nav.title')}</span>
          <LanguageSwitcher />
        </div>

        {NAV.map((group) => (
          <div key={group.section}>
            <div className="px-[var(--space-5)] pt-[var(--space-3)] pb-[var(--space-1)] text-xs [font-weight:var(--weight-semibold)] tracking-[var(--tracking-widest)] uppercase text-[var(--color-text-secondary)]">
              {t(group.section)}
            </div>
            {group.items.map((item) => (
              <NavLink
                key={item.id}
                to={`/${item.id}`}
                onClick={close}
                className={({ isActive }) =>
                  `block w-full px-[var(--space-5)] py-[var(--space-2)] [font-family:var(--font-sans)] text-sm text-left no-underline cursor-pointer transition-[color,background,border-color] duration-[var(--duration-fast)] ease-[var(--ease-out)] bg-transparent border-0 border-l-2 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-focus-500)] ${
                    isActive
                      ? 'text-[var(--color-text-primary)] [font-weight:var(--weight-semibold)] bg-[var(--accent-surface_100)] border-l-[var(--color-brand-primary-500)]'
                      : 'text-[var(--color-text-secondary)] [font-weight:var(--weight-regular)] border-l-transparent hover:text-[var(--color-text-primary)] hover:bg-[var(--surface_200)]'
                  }`
                }
              >
                {t(item.label)}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <main className="ml-[220px] flex-1 max-md:ml-0 max-md:pt-[56px] max-md:max-w-full">
        {children}
      </main>
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
