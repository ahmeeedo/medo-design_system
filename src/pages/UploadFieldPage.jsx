import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { UploadField } from '../components'

const BASIC_CODE = `import { UploadField } from '@/components'

{/* Standard-Button */}
<UploadField variant="default" />

{/* Drag-and-Drop-Bereich */}
<UploadField variant="dropzone" />

{/* Mit Dateiname-Vorschau */}
<UploadField variant="preview" />`

export default function UploadFieldPage() {
  const { t } = useTranslation()

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={(values) => <UploadField variant={values.variant} />}
            controls={[
              { id: 'variant', type: 'dropdown', label: 'Variant', options: ['default', 'dropzone', 'preview'], default: 'default' },
            ]}
          />
          <Section title={t('uploadField.overview.anatomyTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('uploadField.overview.anatomyBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('uploadField.overview.variantsTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('uploadField.overview.variantsBody')}
              </p>
            </Content>
            <div className="flex flex-wrap items-start gap-[var(--space-8)] mb-[var(--space-4)]">
              {['default', 'dropzone', 'preview'].map(v => (
                <div key={v} className="flex flex-col items-start gap-[var(--space-3)]">
                  <UploadField variant={v} />
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
          <Section title={t('uploadField.usage.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('uploadField.usage.intro')}
              </p>
            </Content>
          </Section>
          <Section title={t('uploadField.usage.variantGuideTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('uploadField.usage.variantGuideBody')}
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
          <Section title={t('uploadField.code.title')}>
            <Content>
              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">
                {t('uploadField.code.basicTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('uploadField.code.basicDesc')}
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
          <Section title={t('uploadField.a11y.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('uploadField.a11y.intro')}
              </p>
            </Content>
          </Section>
          <Section title={t('uploadField.a11y.keyboardTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('uploadField.a11y.keyboardBody')}
              </p>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title={t('uploadField.page.title')}
      description={t('uploadField.page.description')}
      tabs={tabs}
    />
  )
}
