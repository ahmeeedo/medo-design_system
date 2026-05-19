import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Radio, RadioGroup } from '../components'

const RADIO_CODE = `import { Radio, RadioGroup } from '@/components'

{/* Single */}
<Radio label="Zahlungsart" text="Kreditkarte" name="payment" value="card" checked onChange={...} />
<Radio label="Zahlungsart" text="Kreditkarte" name="payment" value="card" checked helperText="Visa und Mastercard akzeptiert." onChange={...} />
<Radio label="Zahlungsart" text="Kreditkarte" name="payment" value="card" checked error="Bitte eine Zahlungsart wählen." onChange={...} />

{/* Gruppe */}
function PaymentMethod() {
  const [method, setMethod] = useState('card')
  const options = [
    { value: 'card',   label: 'Kreditkarte' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'sepa',   label: 'Lastschrift (SEPA)' },
  ]

  return (
    <RadioGroup label="Zahlungsart" helperText="Wähle eine Option.">
      {options.map(({ value, label }) => (
        <Radio
          key={value}
          name="payment"
          value={value}
          text={label}
          checked={method === value}
          onChange={() => setMethod(value)}
        />
      ))}
    </RadioGroup>
  )
}`

const OPTIONS = ['Option A', 'Option B', 'Option C']

function RadioGroupPreview({ helperText, error }) {
  const [selected, setSelected] = useState('Option A')
  return (
    <RadioGroup label="Label" helperText={helperText} error={error}>
      {OPTIONS.map(opt => (
        <Radio
          key={opt}
          name="demo-group"
          value={opt}
          text={opt}
          checked={selected === opt}
          onChange={() => setSelected(opt)}
        />
      ))}
    </RadioGroup>
  )
}

export default function RadioPage() {
  const { t } = useTranslation()

  const doDont = ['1', '2', '3', '4'].map(n => ({ do: `do${n}`, dont: `dont${n}` }))

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={(values) => {
              const helper = values.helper && !values.error ? 'Helper text' : undefined
              const err = values.error ? 'Error text' : undefined
              return values.variant === 'Group' ? (
                <RadioGroupPreview helperText={helper} error={err} />
              ) : (
                <Radio
                  label="Label"
                  text="Option A"
                  name="demo-single"
                  value="a"
                  checked
                  helperText={helper}
                  error={err}
                  onChange={() => {}}
                />
              )
            }}
            controls={[
              { id: 'variant', type: 'dropdown', label: 'Variant',     options: ['Single', 'Group'], default: 'Single' },
              { id: 'helper',  type: 'toggle',   label: 'Helper Text', default: false },
              { id: 'error',   type: 'toggle',   label: 'Error',       default: false },
            ]}
          />
          <Section title={t('radio.overview.anatomyTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-3)]">
                {t('radio.overview.anatomyBody')}
              </p>
              <ol className="flex flex-col gap-[var(--space-2)] pl-[var(--space-5)]">
                {['an1', 'an2', 'an3'].map(k => (
                  <li key={k} className="text-sm text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                    {t(`radio.overview.${k}`)}
                  </li>
                ))}
              </ol>
            </Content>
          </Section>

          <Section title={t('radio.overview.statesTitle')}>
            <div className="flex flex-col gap-[var(--space-3)]">
              <Radio name="states" value="unselected" text={t('radio.overview.stateUnselected')} checked={false} onChange={() => {}} />
              <Radio name="states" value="selected"   text={t('radio.overview.stateSelected')}   checked={true}  onChange={() => {}} />
              <Radio name="states" value="disabled"   text={t('radio.overview.stateDisabled')}   checked={false} onChange={() => {}} disabled />
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
          <Section title={t('radio.usage.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('radio.usage.intro')}
              </p>
            </Content>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)]">
              <div className="bg-[var(--color-success-container-100)] border border-[var(--color-success)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('radio.usage.doTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ do: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-success)] shrink-0">✓</span>
                      <span>{t(`radio.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('radio.usage.doNote')}
                </div>
              </div>
              <div className="bg-[var(--color-error-container-100)] border border-[var(--color-error)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('radio.usage.dontTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ dont: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-error)] shrink-0">✗</span>
                      <span>{t(`radio.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('radio.usage.dontNote')}
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
          <Section title={t('radio.code.title')}>
            <Content>
              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">
                {t('radio.code.radioTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('radio.code.radioDesc')}
              </p>
              <CodeBlock language="jsx">{RADIO_CODE}</CodeBlock>
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
          <Section title={t('radio.a11y.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('radio.a11y.intro')}
              </p>
            </Content>
          </Section>

          <Section title={t('radio.a11y.keyboardTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-4)]">
                {t('radio.a11y.keyboardBody')}
              </p>
            </Content>
            <div className="border border-[var(--border-subtle-100)] rounded-[var(--radius-lg)] overflow-hidden mb-[var(--space-6)]">
              {['k1', 'k2', 'k3', 'k4'].map((k, i) => (
                <div key={k} className={`flex items-center gap-[var(--space-4)] px-[var(--space-4)] py-[var(--space-3)] ${i % 2 === 0 ? 'bg-[var(--surface_100)]' : 'bg-[var(--surface_200)]'}`}>
                  <span className="text-sm text-[var(--color-text-secondary)]">{t(`radio.a11y.${k}`)}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-6)]">
              {[
                { title: t('radio.a11y.ariaTitle'),  body: t('radio.a11y.ariaBody') },
                { title: t('radio.a11y.labelTitle'), body: t('radio.a11y.labelBody') },
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
      title={t('radio.page.title')}
      description={t('radio.page.description')}
      tabs={tabs}
    />
  )
}
