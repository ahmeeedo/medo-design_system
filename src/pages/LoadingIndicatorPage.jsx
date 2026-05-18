import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { LoadingIndicator } from '../components'

const BASIC_CODE = `import { LoadingIndicator } from '@/components'

<LoadingIndicator variant="spinner" />
<LoadingIndicator variant="bar" />
<LoadingIndicator variant="dots" />`

export default function LoadingIndicatorPage() {
  const { t } = useTranslation()

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={(values) => <LoadingIndicator variant={values.variant} />}
            controls={[
              { id: 'variant', type: 'dropdown', label: 'Variant', options: ['spinner', 'bar', 'dots'], default: 'spinner' },
            ]}
          />
          <Section title={t('loadingIndicator.overview.anatomyTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('loadingIndicator.overview.anatomyBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('loadingIndicator.overview.variantsTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('loadingIndicator.overview.variantsBody')}
              </p>
            </Content>
            <div className="flex flex-wrap items-center gap-[var(--space-10)] mb-[var(--space-4)]">
              {['spinner', 'bar', 'dots'].map(v => (
                <div key={v} className="flex flex-col items-center gap-[var(--space-3)]">
                  <LoadingIndicator variant={v} />
                  <code className="text-xs [font-family:var(--font-mono)] text-[var(--color-text-secondary)]">{v}</code>
                </div>
              ))}
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
          <Section title={t('loadingIndicator.usage.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('loadingIndicator.usage.intro')}
              </p>
            </Content>
          </Section>
          <Section title={t('loadingIndicator.usage.variantGuideTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('loadingIndicator.usage.variantGuideBody')}
              </p>
            </Content>
          </Section>
        </>
      ),
    },
    {
      id: 'code',
      label: t('tabs.code'),
      content: (
        <>
          <Section title={t('loadingIndicator.code.title')}>
            <Content>
              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">
                {t('loadingIndicator.code.basicTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('loadingIndicator.code.basicDesc')}
              </p>
              <CodeBlock language="jsx">{BASIC_CODE}</CodeBlock>
            </Content>
          </Section>
        </>
      ),
    },
    {
      id: 'accessibility',
      label: t('tabs.accessibility'),
      content: (
        <>
          <Section title={t('loadingIndicator.a11y.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('loadingIndicator.a11y.intro')}
              </p>
            </Content>
          </Section>
          <Section title={t('loadingIndicator.a11y.motionTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('loadingIndicator.a11y.motionBody')}
              </p>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title={t('loadingIndicator.page.title')}
      description={t('loadingIndicator.page.description')}
      tabs={tabs}
    />
  )
}
