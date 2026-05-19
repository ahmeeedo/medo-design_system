import { useTranslation } from 'react-i18next'

export default function WhatIsMedoPage() {
  const { t } = useTranslation()

  return (
    <div className="px-[var(--space-8)] py-[var(--space-8)] max-w-[760px]">
      <h1 className="text-3xl [font-weight:var(--weight-bold)] text-[var(--color-text-primary)] mb-[var(--space-4)]">
        {t('about.page.title')}
      </h1>
      <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-4)]">
        {t('about.page.intro')}
      </p>
      <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-4)]">
        {t('about.page.body1')}
      </p>
      <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
        {t('about.page.body2')}
      </p>
    </div>
  )
}
