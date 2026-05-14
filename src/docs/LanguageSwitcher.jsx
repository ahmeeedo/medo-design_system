import { useTranslation } from 'react-i18next'

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const toggle = () => i18n.changeLanguage(i18n.language === 'de' ? 'en' : 'de')

  return (
    <button
      onClick={toggle}
      className="px-3 py-1 text-sm font-medium rounded-sm border border-[var(--border-subtle-100)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--surface_200)] transition-colors cursor-pointer"
    >
      {i18n.language === 'de' ? t('lang.en') : t('lang.de')}
    </button>
  )
}
