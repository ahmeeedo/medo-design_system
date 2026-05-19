import { useTranslation } from 'react-i18next'

export default function ReleasesPage() {
  const { t } = useTranslation()

  return (
    <div className="px-[var(--space-8)] py-[var(--space-8)] max-w-[760px]">
      <h1 className="text-3xl [font-weight:var(--weight-bold)] text-[var(--color-text-primary)] mb-[var(--space-6)]">
        {t('releases.page.title')}
      </h1>

      <div className="mb-[var(--space-8)]">
        <h2 className="text-xl [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-1)]">
          {t('releases.v030.version')}
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
          {t('releases.v030.date')}
        </p>
        <ul className="flex flex-col gap-[var(--space-2)] pl-[var(--space-5)]">
          {['item1', 'item2', 'item3', 'item4'].map(k => (
            <li key={k} className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] list-disc">
              {t(`releases.v030.${k}`)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
