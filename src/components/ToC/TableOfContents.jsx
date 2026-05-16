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
        <p className="text-xs [font-weight:var(--weight-semibold)] uppercase tracking-[var(--tracking-wide)] text-[var(--color-text-tertiary)] mb-[var(--space-3)]">
          {t('toc.title')}
        </p>
      )}
      <ul className="flex flex-col gap-[var(--space-1)]">
        {headings.map(({ id, text }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={(e) => scrollTo(e, id)}
              className={[
                'block text-md leading-[var(--leading-normal)] py-[var(--space-1)] transition-colors duration-[var(--duration-fast)]',
                activeId === id
                  ? 'text-[var(--color-link-primary)] [font-weight:var(--weight-semibold)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
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
