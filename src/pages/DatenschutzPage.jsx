import { useTranslation } from 'react-i18next'

export default function DatenschutzPage() {
  const { t } = useTranslation()

  return (
    <div className="max-w-[980px] mx-auto px-8 py-12">
      <h1 className="text-3xl [font-weight:var(--weight-bold)] text-[var(--color-text-primary)] mb-[var(--space-4)]">
        {t('datenschutz.page.title')}
      </h1>
      <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
        {t('datenschutz.page.content')}
      </p>
    </div>
  )
}
