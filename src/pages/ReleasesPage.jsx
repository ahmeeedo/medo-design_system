import { useTranslation } from 'react-i18next'

export default function ReleasesPage() {
  const { t } = useTranslation()

  return (
    <div className="px-[var(--medo-space-xl)] py-[var(--medo-space-xl)] max-w-[760px]">
      <h1 className="[font-size:var(--medo-text-3xl)] [font-weight:var(--medo-weight-bold)] tracking-[var(--medo-tracking-tight)] text-[var(--medo-text)] mb-[var(--medo-space-lg)]">
        {t('releases.page.title')}
      </h1>

      <div className="mb-[var(--medo-space-xl)]">
        <h2 className="[font-size:var(--medo-text-xl)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)]">
          {t('releases.v030.version')}
        </h2>
        <p className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] mb-[var(--medo-space-sm)]">
          {t('releases.v030.date')}
        </p>
        <ul className="flex flex-col gap-[var(--medo-space-xs)] pl-[var(--medo-space-lg)]">
          {['item1', 'item2', 'item3', 'item4'].map(k => (
            <li key={k} className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] list-disc">
              {t(`releases.v030.${k}`)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
