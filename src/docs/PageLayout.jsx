import { useSearchParams } from 'react-router-dom'
import { Children } from 'react'

const GRID_CLASSES = {
  1: 'grid-cols-1',
  2: 'grid-cols-2 max-[640px]:grid-cols-1',
  3: 'grid-cols-3 max-[1024px]:grid-cols-2 max-[640px]:grid-cols-1',
  4: 'grid-cols-4 max-[1024px]:grid-cols-2 max-[640px]:grid-cols-1',
  5: 'grid-cols-5 max-[1024px]:grid-cols-3 max-[640px]:grid-cols-1',
  6: 'grid-cols-6 max-[1024px]:grid-cols-3 max-[640px]:grid-cols-1',
}

export function PageLayout({ title, description, tabs = [] }) {
  const [searchParams, setSearchParams] = useSearchParams()

  const activeFromUrl = searchParams.get('tab')
  const validTab = tabs.find(t => t.id === activeFromUrl)
  const active = validTab ? activeFromUrl : tabs[0]?.id

  const handleTabClick = (id) => {
    setSearchParams({ tab: id })
  }

  const activeContent = tabs.find(t => t.id === active)?.content

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

      <div className="flex border-b border-[var(--color-border)] mb-[var(--space-10)]">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`px-[var(--space-6)] py-[var(--space-3)] text-md [font-weight:var(--weight-medium)] bg-transparent border-none border-b-2 -mb-px cursor-pointer transition-[color,border-color] duration-[var(--duration-normal)] ease-[var(--ease-out)] ${
              active === tab.id
                ? 'text-[var(--color-link-primary)] border-b-[var(--border-brand-primary)] bg-[var(--surface-container_hover-100)]'
                : 'text-[var(--color-text-secondary)] border-b-transparent hover:text-[var(--color-text-primary)] hover:bg-[var(--surface-container_hover-100)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mb-[var(--space-8)]">
        {activeContent}
      </div>
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
