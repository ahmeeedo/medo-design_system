import { useTranslation } from 'react-i18next'
import { PageLayout } from '@/docs/PageLayout'

export default function TogglePage() {
  const { t } = useTranslation()

  const tabs = [
    { id: 'usage',         label: t('tabs.usage'),         content: null },
    { id: 'style',         label: t('tabs.style'),         content: null },
    { id: 'code',          label: t('tabs.code'),          content: null },
    { id: 'accessibility', label: t('tabs.accessibility'), content: null },
  ]

  return <PageLayout title={t('toggle.title')} tabs={tabs} />
}
