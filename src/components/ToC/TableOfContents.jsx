import { useTranslation } from 'react-i18next'

export function TableOfContents({ headings, activeId, onSelect, showTitle = true }) {
  const { t } = useTranslation()

  const scrollTo = (e, id) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    onSelect?.()
  }

  return (
    <nav>
      {showTitle && (
        <p className="[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-xs)] uppercase tracking-[0.12em] text-[var(--medo-text-muted)] mb-[var(--medo-space-sm)]">
          {t('toc.title')}
        </p>
      )}
      <ul className="flex flex-col gap-[var(--medo-space-3xs)] border-l border-[var(--medo-border-subtle)]">
        {headings.map(({ id, text }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={(e) => scrollTo(e, id)}
              className={[
                'block [font-family:var(--medo-font-sans)] text-sm [line-height:var(--medo-leading-normal)] pl-[var(--medo-space-sm)] py-[var(--medo-space-2xs)] -ml-px border-l-2 no-underline transition-colors duration-150 ease-out outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-[var(--medo-focus-ring)]',
                activeId === id
                  ? 'text-[var(--medo-action)] [font-weight:var(--medo-weight-medium)] border-l-[var(--medo-action)]'
                  : 'text-[var(--medo-text-muted)] border-l-transparent hover:text-[var(--medo-text)]',
              ].join(' ')}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
