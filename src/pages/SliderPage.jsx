import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Slider } from '../components'

const BASIC_CODE = `import { Slider } from '@/components'

function MyForm() {
  const [volume, setVolume] = useState(50)
  return <Slider value={volume} onChange={setVolume} />
}`

const RANGE_CODE = `{/* Benutzerdefinierter Bereich */}
<Slider value={val} onChange={setVal} min={0} max={200} step={10} />`

const DISABLED_CODE = `<Slider value={50} onChange={() => {}} disabled />`

export default function SliderPage() {
  const { t } = useTranslation()

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={(values) => {
              const SliderDemo = () => {
                const [val, setVal] = useState(50)
                return (
                  <div className="flex flex-col items-center gap-[var(--space-4)] w-full max-w-[320px]">
                    <Slider value={val} onChange={setVal} disabled={values.disabled} />
                    <span className="text-sm text-[var(--color-text-secondary)]">{val}</span>
                  </div>
                )
              }
              return <SliderDemo />
            }}
            controls={[
              { id: 'disabled', type: 'toggle', label: 'Disabled', default: false },
            ]}
          />
          <Section title={t('slider.overview.anatomyTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('slider.overview.anatomyBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('slider.overview.rangeTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('slider.overview.rangeBody')}
              </p>
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
          <Section title={t('slider.usage.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('slider.usage.intro')}
              </p>
            </Content>
          </Section>
          <Section title={t('slider.usage.stateTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('slider.usage.stateBody')}
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
          <Section title={t('slider.code.title')}>
            <Content>
              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">
                {t('slider.code.basicTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('slider.code.basicDesc')}
              </p>
              <CodeBlock language="jsx">{BASIC_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('slider.code.rangeTitle')}
              </p>
              <CodeBlock language="jsx">{RANGE_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('slider.code.disabledTitle')}
              </p>
              <CodeBlock language="jsx">{DISABLED_CODE}</CodeBlock>
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
          <Section title={t('slider.a11y.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('slider.a11y.intro')}
              </p>
            </Content>
          </Section>
          <Section title={t('slider.a11y.keyboardTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('slider.a11y.keyboardBody')}
              </p>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title={t('slider.page.title')}
      description={t('slider.page.description')}
      tabs={tabs}
    />
  )
}
