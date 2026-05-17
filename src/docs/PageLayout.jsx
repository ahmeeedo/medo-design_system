import { useSearchParams } from 'react-router-dom'
import { Children, useRef, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { TableOfContents } from '../components'
import { Sheet, SheetContent, SheetClose, SheetTitle } from '../components/ui/sheet'
import { Tabs as TabsPrimitive, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs'

const GRID_CLASSES = {
  1: 'grid-cols-1',
  2: 'grid-cols-2 max-[640px]:grid-cols-1',
  3: 'grid-cols-3 max-[1024px]:grid-cols-2 max-[640px]:grid-cols-1',
  4: 'grid-cols-4 max-[1024px]:grid-cols-2 max-[640px]:grid-cols-1',
  5: 'grid-cols-5 max-[1024px]:grid-cols-3 max-[640px]:grid-cols-1',
  6: 'grid-cols-6 max-[1024px]:grid-cols-3 max-[640px]:grid-cols-1',
}

const generateId = (text) =>
  text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

export function PageLayout({ title, description, tabs = [] }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { t, i18n } = useTranslation()
  const contentRef = useRef(null)
  const tabBarRef = useRef(null)
  const [headings, setHeadings] = useState([])
  const [activeId, setActiveId] = useState('')
  const [sheetOpen, setSheetOpen] = useState(false)

  const activeFromUrl = searchParams.get('tab')
  const validTab = tabs.find(tab => tab.id === activeFromUrl)
  const active = validTab ? activeFromUrl : tabs[0]?.id

  const handleTabClick = (id) => {
    setSearchParams({ tab: id })
  }

  useEffect(() => {
    if (!tabBarRef.current || !active) return
    const btn = tabBarRef.current.querySelector(`[data-tab-id="${active}"]`)
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
          section.style.scrollMarginTop = 'calc(var(--header-height) + var(--tab-bar-height) + 1rem)'
        }
        if (!el.id) {
          el.id = generateId(el.textContent)
        }
        return { id: el.closest('[id]')?.id || el.id, text: el.textContent }
      })
      setHeadings(extracted)
    }, 50)
    return () => clearTimeout(timer)
  }, [active, i18n.language])

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
      <div className="px-[var(--space-8)] py-[var(--space-8)] bg-[var(--surface_brand)]">
        <h1 className="text-5xl [font-weight:var(--weight-semibold)] tracking-[var(--tracking-tight)] leading-[var(--leading-tight)] text-[var(--color-text-on-color)] mb-[var(--space-2)] max-md:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="text-lg text-[var(--color-text-on-color)] leading-[var(--leading-relaxed)] max-w-[50%] [font-weight:var(--weight-light)]">
            {description}
          </p>
        )}
      </div>

      <TabsPrimitive value={active} onValueChange={handleTabClick} className="block">
        <div
          ref={tabBarRef}
          className="sticky top-[var(--header-height)] [z-index:calc(var(--z-sticky)-1)] bg-[var(--surface_100)] border-b border-[var(--color-border)] overflow-x-auto min-h-[var(--tab-bar-height)] mb-[var(--space-10)]"
        >
          <TabsList variant="line" className="w-full h-[var(--tab-bar-height)] rounded-none p-0">
            {tabs.map(tab => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                data-tab-id={tab.id}
                className="flex-none h-full rounded-none px-[var(--space-6)] text-md text-[var(--color-text-secondary)] data-active:text-[var(--color-link-primary)] data-active:[font-weight:var(--weight-semibold)] after:bg-[var(--border-brand-primary)]"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="flex flex-row mb-[var(--space-8)]">
          <div ref={contentRef} className="flex-1 min-w-0">
            {tabs.map(tab =>
              tab.content ? (
                <TabsContent key={tab.id} value={tab.id}>
                  {tab.content}
                </TabsContent>
              ) : null
            )}
          </div>
          {headings.length > 0 && (
            <div className="w-[240px] flex-shrink-0 hidden md:block pr-[var(--space-8)]">
              <div className="sticky top-[calc(var(--header-height)+var(--tab-bar-height))] max-h-[calc(100vh-var(--header-height)-var(--tab-bar-height))] overflow-y-auto pt-[var(--space-6)] pb-[var(--space-6)]">
                <TableOfContents headings={headings} activeId={activeId} />
              </div>
            </div>
          )}
        </div>
      </TabsPrimitive>

      {headings.length > 0 && !sheetOpen && (
        <div className="block md:hidden fixed bottom-0 left-0 right-0 [z-index:var(--z-sticky)] px-[var(--space-4)] pb-[var(--space-4)]">
          <button
            onClick={() => setSheetOpen(true)}
            className="w-full py-[var(--space-3)] bg-[var(--color-brand-primary-500)] text-white rounded-[var(--radius-md)] text-sm [font-weight:var(--weight-semibold)] shadow-[var(--shadow-md)]"
          >
            {t('toc.openButton')}
          </button>
        </div>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" showCloseButton={false} className="max-h-[60vh] overflow-y-auto p-[var(--space-6)] rounded-t-[var(--radius-2xl)]">
          <div className="flex items-center justify-between mb-[var(--space-5)]">
            <SheetTitle className="text-md [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)]">
              {t('toc.title')}
            </SheetTitle>
            <SheetClose asChild>
              <button className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-[var(--duration-fast)]">
                <span className="material-symbols-rounded" style={{ fontSize: '1.5rem' }}>close</span>
                <span className="sr-only">Close</span>
              </button>
            </SheetClose>
          </div>
          <TableOfContents
            headings={headings}
            activeId={activeId}
            onSelect={() => setSheetOpen(false)}
            showTitle={false}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}

export function Section({ title, children }) {
  const id = title
    ? title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    : undefined

  return (
    <div id={id} className="mb-[var(--space-10)] px-[var(--space-8)] max-w-[980px]">
      {title && (
        <h2 className="text-3xl [font-weight:var(--weight-semibold)] text-[var(--color-text-tertiary)] mb-[var(--space-4)] pb-[var(--space-2)] border-b border-[var(--border-subtle-100)]">
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
      className={`grid gap-[var(--space-6)] ${colClass}`}
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
        'mb-[var(--space-8)] [&_ul]:pl-[var(--space-5)] [&_ol]:pl-[var(--space-5)] [&_li]:pl-[var(--space-2)] [&_strong]:[font-weight:var(--weight-semibold)] [&_strong]:text-[var(--color-text-primary)] [&_a]:text-[var(--color-link-primary)] [&_a]:underline [&_a]:[text-underline-offset:3px] [&_a:hover]:text-[var(--color-link-primary-hover)]',
        className,
      ].filter(Boolean).join(' ')}
    >
      {children}
    </div>
  )
}
