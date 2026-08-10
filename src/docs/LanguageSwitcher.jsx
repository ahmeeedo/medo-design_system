import { useTranslation } from 'react-i18next'

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const toggle = () => i18n.changeLanguage(i18n.language === 'de' ? 'en' : 'de')

  return (
    <button
      onClick={toggle}
      className="px-[var(--medo-space-sm)] h-[var(--docs-hit-target)] text-sm [font-weight:var(--medo-weight-medium)] [font-family:var(--medo-font-sans)] rounded-[var(--medo-radius-md)] border border-[var(--medo-border)] bg-[var(--medo-surface)] text-[var(--medo-text-subtle)] cursor-pointer transition-colors duration-150 ease-out hover:bg-[var(--medo-state-hover)] hover:text-[var(--medo-text)] outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--medo-focus-ring)]"
    >
      {i18n.language === 'de' ? t('lang.en') : t('lang.de')}
    </button>
  )
}
