import { useSearchParams } from 'react-router-dom'
import { Children, useRef, useState, useEffect, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { TableOfContents } from './TableOfContents'
import { generateId } from './anchors'
import { Tabs } from '../components/Tabs/Tabs'
import { Drawer } from './Drawer'

const GRID_CLASSES = {
  1: 'grid-cols-1',
  2: 'grid-cols-2 max-[640px]:grid-cols-1',
  3: 'grid-cols-3 max-[1024px]:grid-cols-2 max-[640px]:grid-cols-1',
  4: 'grid-cols-4 max-[1024px]:grid-cols-2 max-[640px]:grid-cols-1',
  5: 'grid-cols-5 max-[1024px]:grid-cols-3 max-[640px]:grid-cols-1',
  6: 'grid-cols-6 max-[1024px]:grid-cols-3 max-[640px]:grid-cols-1',
}

/* Same global definition the header in DocsLayout uses. */
const HEADER_H = 'var(--docs-header-height)'

/* The tab bar sticks to the header while the panel sits further down beside the
   table of contents, so Tabs renders the bar only and the panel is wired back
   to it by hand over this prefix. The search index generator uses it to tell
   the docs tab bar apart from Tabs instances demoed inside page content. */
export const TAB_ID_PREFIX = 'docs-tabs'

export function PageLayout({ title, description, tabs = [] }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { t, i18n } = useTranslation()
  const contentRef = useRef(null)
  const tabBarRef = useRef(null)
  const [headings, setHeadings] = useState([])
  const [activeId, setActiveId] = useState('')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [tabBarHeight, setTabBarHeight] = useState(0)

  useEffect(() => {
    if (!tabBarRef.current) return
    const observer = new ResizeObserver(([entry]) => setTabBarHeight(entry.contentRect.height))
    observer.observe(tabBarRef.current)
    return () => observer.disconnect()
  }, [])

  const activeFromUrl = searchParams.get('tab')
  const validTab = tabs.find(tab => tab.id === activeFromUrl)
  const active = validTab ? activeFromUrl : tabs[0]?.id

  const handleTabClick = (id) => {
    setSearchParams({ tab: id })
  }

  const closeSheet = useCallback(() => setSheetOpen(false), [])

  const tabItems = useMemo(
    () => tabs.map(tab => ({ value: tab.id, label: tab.label })),
    [tabs],
  )

  useEffect(() => {
    if (!tabBarRef.current || !active) return
    const btn = tabBarRef.current.querySelector(`[data-val="${active}"]`)
    btn?.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' })
  }, [active])

  useEffect(() => {
    setHeadings([])
    setActiveId('')
    const timer = setTimeout(() => {
      if (!contentRef.current) return
      const elements = contentRef.current.querySelectorAll('h2')
      const extracted = Array.from(elements).map(el => {
        // The Section wrapper div has the id; apply scroll offset there so anchor navigation clears sticky header+tabs
        const section = el.closest('[id]')
        if (section) {
          section.style.scrollMarginTop = `calc(${HEADER_H} + ${tabBarHeight}px + 1rem)`
        }
        if (!el.id) {
          el.id = generateId(el.textContent)
        }
        return { id: el.closest('[id]')?.id || el.id, text: el.textContent }
      })
      setHeadings(extracted)
    }, 50)
    return () => clearTimeout(timer)
  }, [active, i18n.language, tabBarHeight])

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-10% 0px -80% 0px' }
    )
    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    const handleScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80
      if (nearBottom) setActiveId(headings[headings.length - 1].id)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [headings])

  return (
    <div>
      <div className="px-[var(--medo-space-xl)] pt-[var(--medo-space-2xl)] pb-[var(--medo-space-xl)] bg-[var(--medo-surface)] border-b border-[var(--medo-border-subtle)]">
        <h1 className="[font-size:var(--medo-text-4xl)] [font-weight:var(--medo-weight-bold)] tracking-[var(--medo-tracking-tight)] [line-height:var(--medo-leading-tight)] text-[var(--medo-text)] mb-[var(--medo-space-xs)] max-md:[font-size:var(--medo-text-2xl)]">
          {title}
        </h1>
        {description && (
          <p className="[font-size:var(--medo-text-lg)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] max-w-[60ch] max-[1024px]:max-w-[100%]">
            {description}
          </p>
        )}
      </div>

      <div
        ref={tabBarRef}
        className="sticky z-20 bg-[var(--medo-surface)] border-b border-[var(--medo-border)] mb-[var(--medo-space-2xl)]"
        style={{ top: HEADER_H }}
      >
        <Tabs
          items={tabItems}
          value={active}
          onChange={handleTabClick}
          variant="underline"
          scrollable
          idPrefix={TAB_ID_PREFIX}
          ariaLabel={title}
        />
      </div>

      <div className="flex flex-row mb-[var(--medo-space-xl)]">
        <div
          ref={contentRef}
          role="tabpanel"
          id={`${TAB_ID_PREFIX}-panel`}
          aria-labelledby={`${TAB_ID_PREFIX}-tab-${active}`}
          className="flex-1 min-w-0"
        >
          {tabs.find(tab => tab.id === active)?.content}
        </div>
        {headings.length > 0 && (
          <div className="w-[240px] flex-shrink-0 hidden md:block pr-[var(--medo-space-xl)]">
            <div
              className="sticky overflow-y-auto pt-[var(--medo-space-lg)] pb-[var(--medo-space-lg)]"
              style={{ top: `calc(${HEADER_H} + ${tabBarHeight}px)`, maxHeight: `calc(100vh - ${HEADER_H} - ${tabBarHeight}px)` }}
            >
              <TableOfContents headings={headings} activeId={activeId} />
            </div>
          </div>
        )}
      </div>

      {headings.length > 0 && !sheetOpen && (
        <div className="block md:hidden fixed bottom-0 left-0 right-0 z-30 px-[var(--medo-space-md)] pb-[var(--medo-space-md)]">
          <button
            onClick={() => setSheetOpen(true)}
            className="w-full min-h-[var(--docs-hit-target)] py-[var(--medo-space-sm)] bg-[var(--medo-action)] text-[var(--medo-action-text)] rounded-[var(--medo-radius-md)] text-sm [font-family:var(--medo-font-sans)] [font-weight:var(--medo-weight-medium)] shadow-[var(--medo-shadow-md)] cursor-pointer transition-colors duration-150 ease-out hover:bg-[var(--medo-action-hover)] active:bg-[var(--medo-action-active)] outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--medo-focus-ring)]"
          >
            {t('toc.openButton')}
          </button>
        </div>
      )}

      <Drawer
        open={sheetOpen}
        onClose={closeSheet}
        title={t('toc.title')}
        closeLabel={t('toc.close')}
      >
        <TableOfContents
          headings={headings}
          activeId={activeId}
          onSelect={closeSheet}
          showTitle={false}
        />
      </Drawer>
    </div>
  )
}

export function Section({ title, children }) {
  const id = title ? generateId(title) : undefined

  return (
    <div id={id} className="mb-[var(--medo-space-2xl)] px-[var(--medo-space-xl)] max-w-[980px]">
      {title && (
        <h2 className="[font-size:var(--medo-text-2xl)] [font-family:var(--medo-font-sans)] [font-weight:var(--medo-weight-semibold)] tracking-[var(--medo-tracking-tight)] text-[var(--medo-text)] mb-[var(--medo-space-md)] pb-[var(--medo-space-xs)] border-b border-[var(--medo-divider)]">
          {title}
        </h2>
      )}
      {children}
    </div>
  )
}

export function GridWrapper({ children, gap }) {
  const count = Children.count(children)
  const colClass = GRID_CLASSES[count] ?? GRID_CLASSES[2]

  return (
    <div
      className={`grid gap-[var(--medo-space-lg)] ${colClass}`}
      style={gap ? { gap } : undefined}
    >
      {children}
    </div>
  )
}

export function Grid({ children, gap }) {
  return (
    <div className="grid" style={gap ? { gap } : undefined}>
      {children}
    </div>
  )
}

Grid.Header = function GridHeader({ children, className }) {
  if (!children) return null
  return <div className={className}>{children}</div>
}

Grid.Body = function GridBody({ children, className }) {
  if (!children) return null
  return <div className={className}>{children}</div>
}

Grid.Footer = function GridFooter({ children, className }) {
  if (!children) return null
  return <div className={className}>{children}</div>
}

export function Content({ children, className }) {
  if (!children) return null
  return (
    <div
      className={[
        'mb-[var(--medo-space-xl)] text-[var(--medo-text)] [&_ul]:pl-[var(--medo-space-lg)] [&_ol]:pl-[var(--medo-space-lg)] [&_li]:pl-[var(--medo-space-xs)] [&_ul]:list-disc [&_ol]:list-decimal [&_strong]:[font-weight:var(--medo-weight-semibold)] [&_strong]:text-[var(--medo-text)] [&_a]:text-[var(--medo-text-link)] [&_a]:underline [&_a]:[text-underline-offset:3px] [&_a:hover]:text-[var(--medo-text-link-hover)]',
        className,
      ].filter(Boolean).join(' ')}
    >
      {children}
    </div>
  )
}

export { DemoPanel } from './DemoPanel'
