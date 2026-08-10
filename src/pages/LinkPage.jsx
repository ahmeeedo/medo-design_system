import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Link } from '../components'

const PROSE = 'text-[var(--medo-text-muted)] [font-family:var(--medo-font-sans)] [font-size:var(--medo-text-base)] [line-height:var(--medo-leading-relaxed)]'
const CAPTION = '[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-xs)] text-[var(--medo-text-muted)]'
const ROW = 'flex flex-wrap items-center gap-[var(--medo-space-lg)] mt-[var(--medo-space-md)]'
const LIST = `${PROSE} list-disc pl-[var(--medo-space-lg)] space-y-[var(--medo-space-3xs)]`

const VARIANTS_CODE = `import { Link } from '@/components'

{/* Steht für sich — ohne Unterstreichung im Ruhezustand */}
<Link href="/tokens">Alle Tokens ansehen</Link>

{/* Im Fließtext — immer unterstrichen */}
<p>
  Alle Farben folgen den <Link variant="inline" href="/colors">Design-Tokens</Link> des Systems.
</p>`

const ICON_CODE = `<Link href="/rechnungen" icon="arrow_forward">Zu den Rechnungen</Link>
<Link href="/export" icon="download" iconPosition="leading">Export starten</Link>`

const EXTERNAL_CODE = `{/* Setzt open_in_new, target="_blank" und rel="noopener noreferrer" */}
<Link href="https://www.w3.org/TR/WCAG22/" external>
  WCAG 2.2 öffnen
</Link>`

export default function LinkPage() {
  const { t } = useTranslation()

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={values => (
              <Link
                href="/colors"
                variant={values.variant}
                size={values.size}
                icon={values.icon ? 'arrow_forward' : undefined}
                iconPosition={values.iconPosition}
                external={values.external}
                disabled={values.disabled}
              >
                {t('link.demo.label')}
              </Link>
            )}
            controls={[
              { id: 'variant', type: 'dropdown', label: t('link.controls.variant'), options: ['standalone', 'inline'], default: 'standalone' },
              { id: 'size', type: 'dropdown', label: t('link.controls.size'), options: ['sm', 'md', 'lg'], default: 'md' },
              { id: 'iconPosition', type: 'dropdown', label: t('link.controls.iconPosition'), options: ['leading', 'trailing'], default: 'trailing' },
              { id: 'icon', type: 'toggle', label: t('link.controls.icon'), default: false },
              { id: 'external', type: 'toggle', label: t('link.controls.external'), default: false },
              { id: 'disabled', type: 'toggle', label: t('link.controls.disabled'), default: false },
            ]}
          />

          <Section title={t('link.overview.variantsTitle')}>
            <Content>
              <p className={PROSE}>{t('link.overview.variantsBody')}</p>
              <div className={ROW}>
                <div className="flex flex-col items-start gap-[var(--medo-space-xs)]">
                  <Link href="/colors">{t('link.demo.standalone')}</Link>
                  <span className={CAPTION}>standalone</span>
                </div>
                <div className="flex flex-col items-start gap-[var(--medo-space-xs)]">
                  <p className={PROSE}>
                    {t('link.demo.inlineBefore')}{' '}
                    <Link variant="inline" href="/colors">{t('link.demo.inlineLink')}</Link>{' '}
                    {t('link.demo.inlineAfter')}
                  </p>
                  <span className={CAPTION}>inline</span>
                </div>
              </div>
            </Content>
          </Section>

          <Section title={t('link.overview.sizesTitle')}>
            <Content>
              <p className={PROSE}>{t('link.overview.sizesBody')}</p>
              <div className={ROW}>
                {[
                  { size: 'sm', meta: 'sm · 14' },
                  { size: 'md', meta: 'md · 16' },
                  { size: 'lg', meta: 'lg · 20' },
                ].map(item => (
                  <div key={item.size} className="flex flex-col items-start gap-[var(--medo-space-xs)]">
                    <Link href="/colors" size={item.size}>{t('link.demo.standalone')}</Link>
                    <span className={CAPTION}>{item.meta}</span>
                  </div>
                ))}
              </div>
            </Content>
          </Section>

          <Section title={t('link.overview.iconsTitle')}>
            <Content>
              <p className={PROSE}>{t('link.overview.iconsBody')}</p>
              <div className={ROW}>
                <Link href="/colors" icon="arrow_forward">{t('link.demo.next')}</Link>
                <Link href="/colors" icon="download" iconPosition="leading">{t('link.demo.export')}</Link>
              </div>
            </Content>
          </Section>

          <Section title={t('link.overview.externalTitle')}>
            <Content>
              <p className={PROSE}>{t('link.overview.externalBody')}</p>
              <div className={ROW}>
                <Link href="https://www.w3.org/TR/WCAG22/" external>{t('link.demo.external')}</Link>
              </div>
            </Content>
          </Section>

          <Section title={t('link.overview.statesTitle')}>
            <Content>
              <p className={PROSE}>{t('link.overview.statesBody')}</p>
              <div className={ROW}>
                <div className="flex flex-col items-start gap-[var(--medo-space-xs)]">
                  <Link href="/colors" disabled>{t('link.demo.standalone')}</Link>
                  <span className={CAPTION}>disabled</span>
                </div>
              </div>
            </Content>
          </Section>
        </>
      ),
    },
    {
      id: 'usage',
      label: t('tabs.usage'),
      content: (
        <>
          <Section title={t('link.usage.vsButtonTitle')}>
            <Content>
              <p className={PROSE}>{t('link.usage.vsButtonBody')}</p>
            </Content>
          </Section>

          <Section title={t('link.usage.patternsTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('link.usage.pStandalone')}</li>
                <li>{t('link.usage.pInline')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('link.usage.textTitle')}>
            <Content>
              <p className={PROSE}>{t('link.usage.textBody')}</p>
            </Content>
          </Section>

          <Section title={t('link.usage.disabledTitle')}>
            <Content>
              <p className={PROSE}>{t('link.usage.disabledBody')}</p>
            </Content>
          </Section>

          <Section title={t('link.usage.dontTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('link.usage.dont1')}</li>
                <li>{t('link.usage.dont2')}</li>
                <li>{t('link.usage.dont3')}</li>
                <li>{t('link.usage.dont4')}</li>
              </ul>
            </Content>
          </Section>
        </>
      ),
    },
    {
      id: 'code',
      label: t('tabs.code'),
      content: (
        <Section title={t('link.code.title')}>
          <Content>
            <p className={PROSE}>{t('link.code.variantsDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{VARIANTS_CODE}</CodeBlock>
            </div>

            <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('link.code.iconDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{ICON_CODE}</CodeBlock>
            </div>

            <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('link.code.externalDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{EXTERNAL_CODE}</CodeBlock>
            </div>
          </Content>
        </Section>
      ),
    },
    {
      id: 'accessibility',
      label: t('tabs.accessibility'),
      content: (
        <>
          <Section title={t('link.a11y.colorTitle')}>
            <Content>
              <p className={PROSE}>{t('link.a11y.colorBody')}</p>
            </Content>
          </Section>

          <Section title={t('link.a11y.focusTitle')}>
            <Content>
              <p className={PROSE}>{t('link.a11y.focusBody')}</p>
            </Content>
          </Section>

          <Section title={t('link.a11y.semanticsTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('link.a11y.s1')}</li>
                <li>{t('link.a11y.s2')}</li>
                <li>{t('link.a11y.s3')}</li>
              </ul>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title={t('link.page.title')}
      description={t('link.page.description')}
      tabs={tabs}
    />
  )
}
