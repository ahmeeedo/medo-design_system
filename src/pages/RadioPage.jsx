import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Radio, RadioGroup } from '../components'

const PROSE = 'text-[var(--medo-text-muted)] [font-family:var(--medo-font-sans)] [font-size:var(--medo-text-base)] [line-height:var(--medo-leading-relaxed)]'
const CAPTION = '[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-xs)] text-[var(--medo-text-muted)]'
const COL = 'flex flex-col gap-[var(--medo-space-sm)] mt-[var(--medo-space-md)]'
const LIST = `${PROSE} list-disc pl-[var(--medo-space-lg)] space-y-[var(--medo-space-3xs)]`

const GROUP_CODE = `import { RadioGroup } from '@/components'

<RadioGroup
  legend="Terminart"
  name="terminart"
  defaultValue="praxis"
  options={[
    { value: 'praxis',  label: 'In der Praxis' },
    { value: 'video',   label: 'Videosprechstunde' },
    { value: 'telefon', label: 'Telefonisch', disabled: true },
  ]}
/>`

const CARD_CODE = `<RadioGroup
  variant="card"
  legend="Abrechnungsweg"
  value={weg}
  onChange={e => setWeg(e.target.value)}
  options={[
    { value: 'kasse',  label: 'Gesetzlich', hint: 'Abrechnung über die Kassenärztliche Vereinigung.' },
    { value: 'privat', label: 'Privat',     hint: 'Rechnung direkt an die Patientin oder den Patienten.' },
  ]}
/>`

const CHILDREN_CODE = `{/* Statt options lassen sich einzelne Radios als Kinder übergeben */}
<RadioGroup legend="Terminart" name="terminart">
  <Radio value="praxis" label="In der Praxis" defaultChecked />
  <Radio value="video"  label="Videosprechstunde" hint="Der Link kommt per E-Mail." />
</RadioGroup>`

const LIST_OPTIONS = t => [
  { value: 'praxis', label: t('radio.demo.options.praxis') },
  { value: 'video', label: t('radio.demo.options.video') },
  { value: 'phone', label: t('radio.demo.options.phone'), disabled: true },
]

const CARD_OPTIONS = t => [
  { value: 'statutory', label: t('radio.demo.billing.statutory'), hint: t('radio.demo.billing.statutoryHint') },
  { value: 'private', label: t('radio.demo.billing.private'), hint: t('radio.demo.billing.privateHint') },
]

function CardDemo() {
  const { t } = useTranslation()
  const [way, setWay] = useState('statutory')

  return (
    <div className="mt-[var(--medo-space-md)]">
      <RadioGroup
        variant="card"
        legend={t('radio.demo.billingLegend')}
        value={way}
        onChange={e => setWay(e.target.value)}
        options={CARD_OPTIONS(t)}
      />
      <p className={`${CAPTION} mt-[var(--medo-space-sm)]`}>
        {t('radio.demo.selected', { value: way })}
      </p>
    </div>
  )
}

export default function RadioPage() {
  const { t } = useTranslation()

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={values => (
              <RadioGroup
                legend={t('radio.demo.legend')}
                variant={values.variant}
                direction={values.direction}
                size={values.size}
                disabled={values.disabled}
                defaultValue="praxis"
                options={values.variant === 'card' ? CARD_OPTIONS(t) : LIST_OPTIONS(t)}
              />
            )}
            controls={[
              { id: 'variant', type: 'dropdown', label: t('radio.controls.variant'), options: ['list', 'card'], default: 'list' },
              { id: 'direction', type: 'dropdown', label: t('radio.controls.direction'), options: ['vertical', 'horizontal'], default: 'vertical' },
              { id: 'size', type: 'dropdown', label: t('radio.controls.size'), options: ['sm', 'md'], default: 'md' },
              { id: 'disabled', type: 'toggle', label: t('radio.controls.disabled'), default: false },
            ]}
          />

          <Section title={t('radio.overview.statesTitle')}>
            <Content>
              <p className={PROSE}>{t('radio.overview.statesBody')}</p>
              <div className={COL}>
                <Radio name="demo-states" label={t('radio.demo.states.unselected')} />
                <Radio name="demo-states" label={t('radio.demo.states.selected')} defaultChecked />
                <Radio name="demo-states-2" label={t('radio.demo.states.error')} error />
                <Radio name="demo-states-3" label={t('radio.demo.states.disabled')} disabled />
                <Radio name="demo-states-4" label={t('radio.demo.states.disabledSelected')} disabled defaultChecked />
              </div>
            </Content>
          </Section>

          <Section title={t('radio.overview.sizesTitle')}>
            <Content>
              <p className={PROSE}>{t('radio.overview.sizesBody')}</p>
              <div className={COL}>
                <Radio name="demo-sm" size="sm" label={t('radio.demo.options.praxis')} defaultChecked />
                <span className={CAPTION}>sm · 18px · Punkt 9px</span>
                <Radio name="demo-md" size="md" label={t('radio.demo.options.praxis')} defaultChecked />
                <span className={CAPTION}>md · 20px · Punkt 10px</span>
              </div>
            </Content>
          </Section>

          <Section title={t('radio.overview.groupTitle')}>
            <Content>
              <p className={PROSE}>{t('radio.overview.groupBody')}</p>
              <div className="mt-[var(--medo-space-md)]">
                <RadioGroup legend={t('radio.demo.legend')} defaultValue="praxis" options={LIST_OPTIONS(t)} />
              </div>
            </Content>
          </Section>

          <Section title={t('radio.overview.hintTitle')}>
            <Content>
              <p className={PROSE}>{t('radio.overview.hintBody')}</p>
              <div className="mt-[var(--medo-space-md)]">
                <RadioGroup legend={t('radio.demo.legend')} name="demo-hint">
                  <Radio value="praxis" label={t('radio.demo.options.praxis')} defaultChecked />
                  <Radio value="video" label={t('radio.demo.options.video')} hint={t('radio.demo.videoHint')} />
                </RadioGroup>
              </div>
            </Content>
          </Section>

          <Section title={t('radio.overview.horizontalTitle')}>
            <Content>
              <p className={PROSE}>{t('radio.overview.horizontalBody')}</p>
              <div className="mt-[var(--medo-space-md)]">
                <RadioGroup
                  legend={t('radio.demo.durationLegend')}
                  direction="horizontal"
                  defaultValue="15"
                  options={[
                    { value: '15', label: t('radio.demo.durations.min15') },
                    { value: '30', label: t('radio.demo.durations.min30') },
                    { value: '60', label: t('radio.demo.durations.min60') },
                  ]}
                />
              </div>
            </Content>
          </Section>

          <Section title={t('radio.overview.cardTitle')}>
            <Content>
              <p className={PROSE}>{t('radio.overview.cardBody')}</p>
              <CardDemo />
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
          <Section title={t('radio.usage.whenTitle')}>
            <Content>
              <p className={PROSE}>{t('radio.usage.whenBody')}</p>
            </Content>
          </Section>

          <Section title={t('radio.usage.groupTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('radio.usage.g1')}</li>
                <li>{t('radio.usage.g2')}</li>
                <li>{t('radio.usage.g3')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('radio.usage.cardTitle')}>
            <Content>
              <p className={PROSE}>{t('radio.usage.cardBody')}</p>
            </Content>
          </Section>

          <Section title={t('radio.usage.dontTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('radio.usage.dont1')}</li>
                <li>{t('radio.usage.dont2')}</li>
                <li>{t('radio.usage.dont3')}</li>
                <li>{t('radio.usage.dont4')}</li>
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
        <Section title={t('radio.code.title')}>
          <Content>
            <p className={PROSE}>{t('radio.code.groupDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{GROUP_CODE}</CodeBlock>
            </div>

            <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('radio.code.cardDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{CARD_CODE}</CodeBlock>
            </div>

            <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('radio.code.childrenDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{CHILDREN_CODE}</CodeBlock>
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
          <Section title={t('radio.a11y.groupTitle')}>
            <Content>
              <p className={PROSE}>{t('radio.a11y.groupBody')}</p>
            </Content>
          </Section>

          <Section title={t('radio.a11y.keyboardTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('radio.a11y.k1')}</li>
                <li>{t('radio.a11y.k2')}</li>
                <li>{t('radio.a11y.k3')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('radio.a11y.stateTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('radio.a11y.s1')}</li>
                <li>{t('radio.a11y.s2')}</li>
              </ul>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title={t('radio.page.title')}
      description={t('radio.page.description')}
      tabs={tabs}
    />
  )
}
