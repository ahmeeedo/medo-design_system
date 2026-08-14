import { useTranslation } from 'react-i18next'

export default function ImpressumPage() {
  const { t } = useTranslation()

  return (
    <div className="max-w-[980px] mx-auto px-[var(--medo-space-xl)] py-[var(--medo-space-2xl)]">
      <h1 className="[font-size:var(--medo-text-3xl)] [font-weight:var(--medo-weight-bold)] tracking-[var(--medo-tracking-tight)] text-[var(--medo-text)] mb-[var(--medo-space-md)]">
        {t('impressum.page.title')}
      </h1>
      <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
        {t('impressum.page.content')}
      </p>
    </div>
  )
}
