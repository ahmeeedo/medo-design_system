import { Fragment } from 'react'
import { cn } from '@/lib/utils'
import {
  Breadcrumb as BreadcrumbRoot,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export function Breadcrumb({ items = [] }) {
  return (
    <BreadcrumbRoot>
      <BreadcrumbList className="gap-2 text-sm flex-nowrap">
        {items.map((item, i) => (
          <Fragment key={i}>
            {i > 0 && <BreadcrumbSeparator>/</BreadcrumbSeparator>}
            <BreadcrumbItem>
              {item.href && i < items.length - 1
                ? <BreadcrumbLink href={item.href} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">{item.label}</BreadcrumbLink>
                : <BreadcrumbPage className="font-medium text-[var(--color-text-primary)]">{item.label}</BreadcrumbPage>
              }
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </BreadcrumbRoot>
  )
}

export function Pagination({ current = 1, total = 1, onChange }) {
  const pages = buildPages(current, total)

  return (
    <nav className="flex gap-1 items-center" aria-label="Pagination">
      <button
        className={cn(
          'flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-neutral-100)] hover:text-[var(--color-text-primary)] transition-all duration-[100ms]',
          current === 1 && 'opacity-30 cursor-not-allowed pointer-events-none'
        )}
        onClick={() => onChange?.(current - 1)}
        disabled={current === 1}
        aria-label="Vorherige Seite"
      >
        ←
      </button>

      {pages.map((p, i) =>
        p === '…' ? (
          <span
            key={`ellipsis-${i}`}
            className="flex items-center justify-center w-8 h-8 text-sm text-[var(--color-text-secondary)]"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium transition-all duration-[100ms]',
              p === current
                ? 'bg-[var(--color-neutral-900)] text-white border border-[var(--color-neutral-900)]'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-neutral-100)] hover:text-[var(--color-text-primary)]'
            )}
            onClick={() => onChange?.(p)}
            aria-current={p === current ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        className={cn(
          'flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-neutral-100)] hover:text-[var(--color-text-primary)] transition-all duration-[100ms]',
          current === total && 'opacity-30 cursor-not-allowed pointer-events-none'
        )}
        onClick={() => onChange?.(current + 1)}
        disabled={current === total}
        aria-label="Nächste Seite"
      >
        →
      </button>
    </nav>
  )
}

function buildPages(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, '…', total]
  if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '…', current - 1, current, current + 1, '…', total]
}

const deltaIcon = { up: '↑', down: '↓', neutral: '→' }
const deltaClasses = {
  up:      'text-success',
  down:    'text-error',
  neutral: 'text-[var(--color-text-secondary)]',
}

export function StatCard({ label, value, delta, deltaDir = 'up' }) {
  return (
    <div className="bg-[var(--surface_100)] border border-border rounded-xl px-6 py-5">
      <div className="text-xs font-semibold [letter-spacing:var(--tracking-wide)] uppercase text-[var(--color-text-secondary)] mb-2">
        {label}
      </div>
      <div className="text-3xl font-semibold [letter-spacing:var(--tracking-tight)] [line-height:var(--leading-tight)] text-[var(--color-text-primary)]">
        {value}
      </div>
      {delta && (
        <div className={cn('inline-flex items-center gap-1 text-xs font-medium mt-2', deltaClasses[deltaDir])}>
          {deltaIcon[deltaDir]} {delta}
        </div>
      )}
    </div>
  )
}
