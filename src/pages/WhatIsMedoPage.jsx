import { useTranslation } from 'react-i18next'

export default function WhatIsMedoPage() {
  const { t } = useTranslation()

  return (
    <div className="px-[var(--medo-space-xl)] py-[var(--medo-space-xl)] max-w-[760px]">
      <h1 className="[font-size:var(--medo-text-3xl)] [font-weight:var(--medo-weight-bold)] tracking-[var(--medo-tracking-tight)] text-[var(--medo-text)] mb-[var(--medo-space-md)]">
        {t('about.page.title')}
      </h1>
      <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-md)]">
        {t('about.page.intro')}
      </p>
      <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-md)]">
        {t('about.page.body1')}
      </p>
      <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
        {t('about.page.body2')}
      </p>
    </div>
  )
}
