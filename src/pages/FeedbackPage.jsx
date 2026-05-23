import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Progress } from '../components'

const VARIANTS = ['neutral', 'accent', 'success', 'warning', 'error']

const BASE_CODE = `import { Progress } from '@/components'

<Progress value={75} />`

const VARIANTS_CODE = `<Progress value={65} variant="neutral" label="Neutral" />
<Progress value={65} variant="accent"  label="Accent" />
<Progress value={65} variant="success" label="Success" />
<Progress value={65} variant="warning" label="Warning" />
<Progress value={65} variant="error"   label="Error" />`

const SIZES_CODE = `<Progress value={60} size="sm" label="Small (sm)" />
<Progress value={60} size="md" label="Medium (md)" />
<Progress value={60} size="lg" label="Large (lg)" />`

const SHOW_VALUE_CODE = `{/* showValue zeigt Prozentzahl rechts über dem Balken */}
<Progress value={42} label="Upload läuft..." showValue />

{/* Ohne label, nur Prozentzahl */}
<Progress value={80} showValue />`

export default function FeedbackPage() {
  const { t } = useTranslation()

  const doDont = ['1', '2', '3'].map(n => ({ do: `do${n}`, dont: `dont${n}` }))

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={(values) => (
              <div className="w-full max-w-[400px]">
                <Progress value={65} variant={values.variant} size={values.size} />
              </div>
            )}
            controls={[
              { id: 'variant', type: 'dropdown', label: 'Variant', options: ['neutral', 'accent', 'success', 'warning', 'error'], default: 'accent' },
              { id: 'size', type: 'dropdown', label: 'Size', options: ['sm', 'md', 'lg'], default: 'md' },
            ]}
          />
          <Section title={t('feedback.overview.anatomyTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-3)]">
                {t('feedback.overview.anatomyBody')}
              </p>
              <ol className="flex flex-col gap-[var(--space-2)] pl-[var(--space-5)]">
                {['an1', 'an2', 'an3', 'an4', 'an5'].map(k => (
                  <li key={k} className="text-sm text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                    {t(`feedback.overview.${k}`)}
                  </li>
                ))}
              </ol>
            </Content>
          </Section>

          <Section title={t('feedback.overview.variantsTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('feedback.overview.variantsBody')}
              </p>
            </Content>
            <div className="flex flex-col gap-[var(--space-4)]">
              {VARIANTS.map(v => (
                <Progress
                  key={v}
                  value={65}
                  variant={v}
                  label={t(`feedback.overview.variant_${v}`)}
                />
              ))}
            </div>
          </Section>

          <Section title={t('feedback.overview.sizesTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('feedback.overview.sizesBody')}
              </p>
            </Content>
            <div className="flex flex-col gap-[var(--space-5)]">
              {['sm', 'md', 'lg'].map(s => (
                <Progress key={s} value={60} size={s} label={t(`feedback.overview.size_${s}`)} />
              ))}
            </div>
          </Section>

          <Section title={t('feedback.overview.showValueTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('feedback.overview.showValueBody')}
              </p>
            </Content>
            <div className="flex flex-col gap-[var(--space-5)]">
              <Progress value={42} label={t('feedback.overview.showValueLabel')} showValue />
              <Progress value={80} showValue />
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
          <Section title={t('feedback.usage.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('feedback.usage.intro')}
              </p>
            </Content>
          </Section>

          <Section title={t('feedback.usage.whenNotTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('feedback.usage.whenNotBody')}
              </p>
            </Content>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)]">
              <div className="bg-[var(--color-success-container-100)] border border-[var(--color-success)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('feedback.usage.doTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ do: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-success)] shrink-0">✓</span>
                      <span>{t(`feedback.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('feedback.usage.doNote')}
                </div>
              </div>
              <div className="bg-[var(--color-error-container-100)] border border-[var(--color-error)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('feedback.usage.dontTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ dont: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-error)] shrink-0">✗</span>
                      <span>{t(`feedback.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('feedback.usage.dontNote')}
                </div>
              </div>
            </div>
          </Section>
        </>
      ),
    },
    {
      id: 'code',
      label: t('tabs.code'),
      content: (
        <>
          <Section title={t('feedback.code.title')}>
            <Content>
              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">
                {t('feedback.code.baseTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('feedback.code.baseDesc')}
              </p>
              <CodeBlock language="jsx">{BASE_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('feedback.code.variantsTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('feedback.code.variantsDesc')}
              </p>
              <CodeBlock language="jsx">{VARIANTS_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('feedback.code.sizesTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('feedback.code.sizesDesc')}
              </p>
              <CodeBlock language="jsx">{SIZES_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('feedback.code.showValueTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('feedback.code.showValueDesc')}
              </p>
              <CodeBlock language="jsx">{SHOW_VALUE_CODE}</CodeBlock>
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
          <Section title={t('feedback.a11y.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('feedback.a11y.intro')}
              </p>
            </Content>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)]">
              {[
                { title: t('feedback.a11y.roleTitle'),  body: t('feedback.a11y.roleBody') },
                { title: t('feedback.a11y.ariaTitle'),  body: t('feedback.a11y.ariaBody') },
                { title: t('feedback.a11y.labelTitle'), body: t('feedback.a11y.labelBody') },
                { title: t('feedback.a11y.colorTitle'), body: t('feedback.a11y.colorBody') },
              ].map(({ title, body }) => (
                <div key={title} className="bg-[var(--surface-container_100)] rounded-[var(--radius-lg)] p-[var(--space-5)] border border-[var(--border-subtle-100)]">
                  <div className="text-md [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">{title}</div>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">{body}</p>
                </div>
              ))}
            </div>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title="Feedback / Progress"
      description={t('feedback.page.description')}
      tabs={tabs}
    />
  )
}
