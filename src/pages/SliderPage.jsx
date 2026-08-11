import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Slider } from '../components'

const PROSE = 'text-[var(--medo-text-muted)] [font-family:var(--medo-font-sans)] [font-size:var(--medo-text-base)] [line-height:var(--medo-leading-relaxed)]'
const CAPTION = '[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-xs)] text-[var(--medo-text-muted)]'
const FIELD = 'mt-[var(--medo-space-md)] max-w-[420px]'
const LIST = `${PROSE} list-disc pl-[var(--medo-space-lg)] space-y-[var(--medo-space-3xs)]`

const BASIC_CODE = `import { Slider } from '@/components'

<Slider label="Terminlänge" defaultValue={30} min={15} max={90} step={15} showValue />`

const DISCRETE_CODE = `{/* Diskreter Modus: Ticks auf der Bahn, Beschriftung je Stufe */}
<Slider
  label="Dringlichkeit"
  min={0}
  max={3}
  step={1}
  showTicks
  stepLabels={['Routine', 'Erhöht', 'Dringend', 'Sofort']}
/>`

const FORMAT_CODE = `{/* formatValue steuert Bubble, aria-valuetext und die Wertanzeige */}
<Slider
  label="Eigenanteil"
  defaultValue={20}
  showValue
  formatValue={v => v.toLocaleString('de-DE') + ' %'}
/>`

const VERTICAL_CODE = `<Slider
  orientation="vertical"
  ariaLabel="Lautstärke"
  defaultValue={60}
  startIcon="volume_up"
  endIcon="volume_mute"
/>`

function ControlledDemo() {
  const { t } = useTranslation()
  const [value, setValue] = useState(30)
  const [committed, setCommitted] = useState(30)

  return (
    <div className={FIELD}>
      <Slider
        label={t('slider.demo.duration')}
        value={value}
        onChange={setValue}
        onChangeEnd={setCommitted}
        min={15}
        max={90}
        step={15}
        showValue
        showMinMax
        showTicks
        formatValue={v => v + ' min'}
      />
      <p className={`${CAPTION} mt-[var(--medo-space-sm)]`}>
        {t('slider.demo.committed', { value: committed })}
      </p>
    </div>
  )
}

export default function SliderPage() {
  const { t } = useTranslation()

  const stepLabels = [
    t('slider.demo.urgency.routine'),
    t('slider.demo.urgency.raised'),
    t('slider.demo.urgency.urgent'),
    t('slider.demo.urgency.immediate'),
  ]

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={values => (
              <div className={values.orientation === 'vertical' ? undefined : 'w-full max-w-[420px]'}>
                <Slider
                  label={values.label ? t('slider.demo.share') : undefined}
                  ariaLabel={values.label ? undefined : t('slider.demo.share')}
                  defaultValue={40}
                  step={values.showTicks ? 10 : 1}
                  size={values.size}
                  orientation={values.orientation}
                  showValue={values.showValue}
                  showMinMax={values.showMinMax}
                  showTicks={values.showTicks}
                  startIcon={values.icons ? 'remove' : undefined}
                  endIcon={values.icons ? 'add' : undefined}
                  disabled={values.disabled}
                />
              </div>
            )}
            controls={[
              { id: 'size', type: 'dropdown', label: t('slider.controls.size'), options: ['sm', 'md'], default: 'md' },
              { id: 'orientation', type: 'dropdown', label: t('slider.controls.orientation'), options: ['horizontal', 'vertical'], default: 'horizontal' },
              { id: 'label', type: 'toggle', label: t('slider.controls.label'), default: true },
              { id: 'showValue', type: 'toggle', label: t('slider.controls.showValue'), default: true },
              { id: 'showMinMax', type: 'toggle', label: t('slider.controls.showMinMax'), default: false },
              { id: 'showTicks', type: 'toggle', label: t('slider.controls.showTicks'), default: false },
              { id: 'icons', type: 'toggle', label: t('slider.controls.icons'), default: false },
              { id: 'disabled', type: 'toggle', label: t('slider.controls.disabled'), default: false },
            ]}
          />

          <Section title={t('slider.overview.basicTitle')}>
            <Content>
              <p className={PROSE}>{t('slider.overview.basicBody')}</p>
              <div className={FIELD}>
                <Slider label={t('slider.demo.share')} defaultValue={40} showValue formatValue={v => v + ' %'} />
              </div>
            </Content>
          </Section>

          <Section title={t('slider.overview.sizesTitle')}>
            <Content>
              <p className={PROSE}>{t('slider.overview.sizesBody')}</p>
              <div className={FIELD}>
                <Slider size="sm" label={t('slider.demo.share')} defaultValue={40} showValue />
                <span className={CAPTION}>sm · Bahn 4px · Griff 16px</span>
              </div>
              <div className={FIELD}>
                <Slider size="md" label={t('slider.demo.share')} defaultValue={40} showValue />
                <span className={CAPTION}>md · Bahn 6px · Griff 20px</span>
              </div>
            </Content>
          </Section>

          <Section title={t('slider.overview.discreteTitle')}>
            <Content>
              <p className={PROSE}>{t('slider.overview.discreteBody')}</p>
              <div className={FIELD}>
                <Slider
                  label={t('slider.demo.urgencyLabel')}
                  defaultValue={1}
                  min={0}
                  max={3}
                  step={1}
                  showTicks
                  stepLabels={stepLabels}
                />
              </div>
            </Content>
          </Section>

          <Section title={t('slider.overview.minMaxTitle')}>
            <Content>
              <p className={PROSE}>{t('slider.overview.minMaxBody')}</p>
              <div className={FIELD}>
                <Slider
                  label={t('slider.demo.duration')}
                  defaultValue={30}
                  min={15}
                  max={90}
                  step={15}
                  showValue
                  showMinMax
                  showTicks
                  formatValue={v => v + ' min'}
                />
              </div>
            </Content>
          </Section>

          <Section title={t('slider.overview.iconsTitle')}>
            <Content>
              <p className={PROSE}>{t('slider.overview.iconsBody')}</p>
              <div className={FIELD}>
                <Slider
                  ariaLabel={t('slider.demo.volume')}
                  defaultValue={60}
                  startIcon="volume_mute"
                  endIcon="volume_up"
                  showMinMax
                />
              </div>
            </Content>
          </Section>

          <Section title={t('slider.overview.controlledTitle')}>
            <Content>
              <p className={PROSE}>{t('slider.overview.controlledBody')}</p>
              <ControlledDemo />
            </Content>
          </Section>

          <Section title={t('slider.overview.verticalTitle')}>
            <Content>
              <p className={PROSE}>{t('slider.overview.verticalBody')}</p>
              <div className="mt-[var(--medo-space-md)] flex items-start gap-[var(--medo-space-2xl)]">
                <Slider
                  orientation="vertical"
                  ariaLabel={t('slider.demo.volume')}
                  defaultValue={60}
                  startIcon="volume_up"
                  endIcon="volume_mute"
                />
                <Slider
                  orientation="vertical"
                  ariaLabel={t('slider.demo.volume')}
                  defaultValue={30}
                  size="sm"
                  disabled
                />
              </div>
            </Content>
          </Section>

          <Section title={t('slider.overview.disabledTitle')}>
            <Content>
              <p className={PROSE}>{t('slider.overview.disabledBody')}</p>
              <div className={FIELD}>
                <Slider label={t('slider.demo.share')} defaultValue={40} showValue disabled />
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
          <Section title={t('slider.usage.whenTitle')}>
            <Content>
              <p className={PROSE}>{t('slider.usage.whenBody')}</p>
            </Content>
          </Section>

          <Section title={t('slider.usage.valueTitle')}>
            <Content>
              <p className={PROSE}>{t('slider.usage.valueBody')}</p>
            </Content>
          </Section>

          <Section title={t('slider.usage.stepTitle')}>
            <Content>
              <p className={PROSE}>{t('slider.usage.stepBody')}</p>
            </Content>
          </Section>

          <Section title={t('slider.usage.changeEndTitle')}>
            <Content>
              <p className={PROSE}>{t('slider.usage.changeEndBody')}</p>
            </Content>
          </Section>

          <Section title={t('slider.usage.dontTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('slider.usage.dont1')}</li>
                <li>{t('slider.usage.dont2')}</li>
                <li>{t('slider.usage.dont3')}</li>
                <li>{t('slider.usage.dont4')}</li>
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
        <Section title={t('slider.code.title')}>
          <Content>
            <p className={PROSE}>{t('slider.code.basicDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{BASIC_CODE}</CodeBlock>
            </div>

            <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('slider.code.discreteDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{DISCRETE_CODE}</CodeBlock>
            </div>

            <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('slider.code.formatDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{FORMAT_CODE}</CodeBlock>
            </div>

            <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('slider.code.verticalDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{VERTICAL_CODE}</CodeBlock>
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
          <Section title={t('slider.a11y.keyboardTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('slider.a11y.k1')}</li>
                <li>{t('slider.a11y.k2')}</li>
                <li>{t('slider.a11y.k3')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('slider.a11y.ariaTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('slider.a11y.a1')}</li>
                <li>{t('slider.a11y.a2')}</li>
                <li>{t('slider.a11y.a3')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('slider.a11y.targetTitle')}>
            <Content>
              <p className={PROSE}>{t('slider.a11y.targetBody')}</p>
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
