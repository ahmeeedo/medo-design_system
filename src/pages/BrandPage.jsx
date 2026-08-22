import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content } from '../docs/PageLayout'
import { TokensTable } from '../docs/TokensTable'
import { Icon } from '../components/Icon/Icon'
import { PROSE, LIST, CAPTION, CARD, SUBHEAD } from '../docs/pageStyles'
import { MedoLogo } from '../docs/MedoLogo'

const ICON_SAMPLES = [
  'search', 'check_circle', 'info', 'warning', 'delete',
  'settings', 'calendar_month', 'person', 'arrow_forward', 'close',
]

const ICON_SIZES = [18, 20, 24]

const ICON_TOKENS = [
  { token: '--medo-icon', ref: 'stone-900' },
  { token: '--medo-icon-muted', ref: 'stone-1000 @ 55 %' },
  { token: '--medo-icon-on-primary', ref: 'white' },
  { token: '--medo-icon-disabled', ref: 'stone-500' },
  { token: '--medo-action', ref: 'teal-600' },
  { token: '--medo-surface', ref: 'white' },
  { token: '--medo-text', ref: 'stone-1000' },
]

export default function BrandPage() {
  const { t } = useTranslation()

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <Section title={t('brand.wordmark.title')}>
            <Content>
              <p className={PROSE}>{t('brand.wordmark.body')}</p>
            </Content>
            <div className="flex flex-wrap items-center gap-[var(--medo-space-lg)]">
              <div className={`${CARD} flex items-center justify-center min-w-[var(--medo-space-4xl)]`}>
                <MedoLogo className="h-[var(--medo-space-xl)] w-auto" />
              </div>
              <div className="bg-[var(--medo-color-stone-1000)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)] flex items-center justify-center">
                <MedoLogo inverted className="h-[var(--medo-space-xl)] w-auto" />
              </div>
              <div className="flex flex-col gap-[var(--medo-space-2xs)] max-w-[40ch]">
                <span className={CAPTION}>{t('brand.wordmark.minHeight')}</span>
                <span className={CAPTION}>{t('brand.wordmark.inverted')}</span>
              </div>
            </div>
          </Section>

          <Section title={t('brand.icons.title')}>
            <Content>
              <p className={PROSE}>{t('brand.icons.body')}</p>
            </Content>

            <div className={`${CARD} flex flex-wrap gap-[var(--medo-space-lg)] items-center`}>
              {ICON_SAMPLES.map((name) => (
                <div key={name} className="flex flex-col items-center gap-[var(--medo-space-2xs)]">
                  <Icon name={name} size={24} className="text-[var(--medo-icon)]" />
                  <span className={CAPTION}>{name}</span>
                </div>
              ))}
            </div>

            <h3 className={SUBHEAD}>{t('brand.icons.sizesTitle')}</h3>
            <Content>
              <p className={PROSE}>{t('brand.icons.sizesBody')}</p>
            </Content>
            <div className={`${CARD} flex items-end gap-[var(--medo-space-xl)]`}>
              {ICON_SIZES.map((size) => (
                <div key={size} className="flex flex-col items-center gap-[var(--medo-space-2xs)]">
                  <Icon name="favorite" size={size} className="text-[var(--medo-icon)]" />
                  <span className={CAPTION}>{size} px</span>
                </div>
              ))}
            </div>

            <h3 className={SUBHEAD}>{t('brand.icons.colorsTitle')}</h3>
            <div className={`${CARD} flex flex-wrap gap-[var(--medo-space-xl)] items-center`}>
              <div className="flex flex-col items-center gap-[var(--medo-space-2xs)]">
                <Icon name="search" size={24} className="text-[var(--medo-icon)]" />
                <span className={CAPTION}>icon</span>
              </div>
              <div className="flex flex-col items-center gap-[var(--medo-space-2xs)]">
                <Icon name="info" size={24} className="text-[var(--medo-icon-muted)]" />
                <span className={CAPTION}>icon-muted</span>
              </div>
              <div className="flex flex-col items-center gap-[var(--medo-space-2xs)]">
                <Icon name="lock" size={24} className="text-[var(--medo-icon-disabled)]" />
                <span className={CAPTION}>icon-disabled</span>
              </div>
              <div className="flex flex-col items-center gap-[var(--medo-space-2xs)]">
                <span className="flex items-center justify-center w-[var(--medo-space-2xl)] h-[var(--medo-space-2xl)] rounded-[var(--medo-radius-md)] bg-[var(--medo-action)]">
                  <Icon name="check" size={24} className="text-[var(--medo-icon-on-primary)]" />
                </span>
                <span className={CAPTION}>icon-on-primary</span>
              </div>
            </div>
          </Section>
        </>
      ),
    },
    {
      id: 'usage',
      label: t('tabs.usage'),
      content: (
        <>
          <Section title={t('brand.usage.logoTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('brand.usage.logo1')}</li>
                <li>{t('brand.usage.logo2')}</li>
                <li>{t('brand.usage.logo3')}</li>
                <li>{t('brand.usage.logo4')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('brand.usage.iconsTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('brand.usage.icons1')}</li>
                <li>{t('brand.usage.icons2')}</li>
                <li>{t('brand.usage.icons3')}</li>
                <li>{t('brand.usage.icons4')}</li>
                <li>{t('brand.usage.icons5')}</li>
              </ul>
            </Content>
          </Section>
        </>
      ),
    },
    {
      id: 'tokens',
      label: t('tabs.tokens'),
      content: (
        <Section title={t('brand.tokens.title')}>
          <Content>
            <p className={PROSE}>{t('brand.tokens.body')}</p>
          </Content>
          <TokensTable tokens={ICON_TOKENS} />
        </Section>
      ),
    },
    {
      id: 'accessibility',
      label: t('tabs.accessibility'),
      content: (
        <Section title={t('brand.a11y.title')}>
          <Content>
            <ul className={LIST}>
              <li>{t('brand.a11y.1')}</li>
              <li>{t('brand.a11y.2')}</li>
              <li>{t('brand.a11y.3')}</li>
              <li>{t('brand.a11y.4')}</li>
            </ul>
          </Content>
        </Section>
      ),
    },
  ]

  return <PageLayout title={t('brand.title')} description={t('brand.description')} tabs={tabs} />
}
