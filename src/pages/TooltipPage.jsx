import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Tooltip } from '../components'

const BASIC_CODE = `import { Tooltip } from '@/components'

<Tooltip content="Hilfetext" side="top">
  <button>Hover me</button>
</Tooltip>`

const SIDES_CODE = `<Tooltip content="Oben" side="top">
  <button>Top</button>
</Tooltip>
<Tooltip content="Unten" side="bottom">
  <button>Bottom</button>
</Tooltip>
<Tooltip content="Links" side="left">
  <button>Left</button>
</Tooltip>
<Tooltip content="Rechts" side="right">
  <button>Right</button>
</Tooltip>`

const DELAY_CODE = `{/* Kein Delay */}
<Tooltip content="Sofort sichtbar" delay={0}>
  <button>Sofort</button>
</Tooltip>

{/* Langer Delay */}
<Tooltip content="Erscheint nach 800ms" delay={800}>
  <button>Langsam</button>
</Tooltip>`

export default function TooltipPage() {
  const { t } = useTranslation()

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={(values) => (
              <Tooltip content="This is a tooltip" side={values.side}>
                <button className="px-[var(--space-4)] py-[var(--space-2)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm">
                  Hover me
                </button>
              </Tooltip>
            )}
            controls={[
              { id: 'side', type: 'dropdown', label: 'Side', options: ['top', 'bottom', 'left', 'right'], default: 'top' },
            ]}
          />
          <Section title={t('tooltip.overview.anatomyTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('tooltip.overview.anatomyBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('tooltip.overview.sidesTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('tooltip.overview.sidesBody')}
              </p>
            </Content>
            <div className="flex flex-wrap gap-[var(--space-6)] mb-[var(--space-4)]">
              {['top', 'bottom', 'left', 'right'].map(side => (
                <Tooltip key={side} content={`Side: ${side}`} side={side}>
                  <button className="px-[var(--space-4)] py-[var(--space-2)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm capitalize">
                    {side}
                  </button>
                </Tooltip>
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
          <Section title={t('tooltip.usage.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('tooltip.usage.intro')}
              </p>
            </Content>
          </Section>
          <Section title={t('tooltip.usage.delayTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('tooltip.usage.delayBody')}
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
          <Section title={t('tooltip.code.title')}>
            <Content>
              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">
                {t('tooltip.code.basicTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('tooltip.code.basicDesc')}
              </p>
              <CodeBlock language="jsx">{BASIC_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('tooltip.code.sidesTitle')}
              </p>
              <CodeBlock language="jsx">{SIDES_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('tooltip.code.delayTitle')}
              </p>
              <CodeBlock language="jsx">{DELAY_CODE}</CodeBlock>
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
          <Section title={t('tooltip.a11y.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('tooltip.a11y.intro')}
              </p>
            </Content>
          </Section>
          <Section title={t('tooltip.a11y.keyboardTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('tooltip.a11y.keyboardBody')}
              </p>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title={t('tooltip.page.title')}
      description={t('tooltip.page.description')}
      tabs={tabs}
    />
  )
}
