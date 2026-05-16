import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Toggle, Checkbox, Radio } from '../components'

const TOGGLE_CODE = `import { Toggle } from '@/components'

{/* Uncontrolled — verwaltet State intern */}
<Toggle label="Benachrichtigungen" defaultChecked />

{/* Controlled — State extern verwaltet */}
function NotificationSetting() {
  const [enabled, setEnabled] = useState(true)
  return (
    <Toggle
      label="Benachrichtigungen"
      checked={enabled}
      onChange={setEnabled}
    />
  )
}`

const CHECKBOX_CODE = `import { Checkbox } from '@/components'

function PermissionsForm() {
  const [read,  setRead]  = useState(true)
  const [write, setWrite] = useState(false)
  const [admin, setAdmin] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Checkbox label="Lesen"        checked={read}  onChange={setRead}  />
      <Checkbox label="Schreiben"    checked={write} onChange={setWrite} />
      <Checkbox label="Administrieren" checked={admin} onChange={setAdmin} disabled />
    </div>
  )
}`

const RADIO_CODE = `import { Radio } from '@/components'

function PaymentMethod() {
  const [method, setMethod] = useState('card')

  const options = [
    { value: 'card',   label: 'Kreditkarte' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'sepa',   label: 'Lastschrift (SEPA)' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {options.map(({ value, label }) => (
        <Radio
          key={value}
          name="payment"
          value={value}
          label={label}
          checked={method === value}
          onChange={() => setMethod(value)}
        />
      ))}
    </div>
  )
}`

export default function TogglePage() {
  const { t } = useTranslation()

  const [radioVal, setRadioVal] = useState('option1')
  const doDont = ['1', '2', '3', '4'].map(n => ({ do: `do${n}`, dont: `dont${n}` }))

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <Section title={t('toggle.overview.toggleTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-3)]">
                {t('toggle.overview.toggleBody')}
              </p>
              <ol className="flex flex-col gap-[var(--space-2)] pl-[var(--space-5)]">
                {['an1', 'an2', 'an3'].map(k => (
                  <li key={k} className="text-sm text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                    {t(`toggle.overview.${k}`)}
                  </li>
                ))}
              </ol>
            </Content>
          </Section>

          <Section title={t('toggle.overview.checkboxTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-3)]">
                {t('toggle.overview.checkboxBody')}
              </p>
              <ol className="flex flex-col gap-[var(--space-2)] pl-[var(--space-5)]">
                {['can1', 'can2', 'can3'].map(k => (
                  <li key={k} className="text-sm text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                    {t(`toggle.overview.${k}`)}
                  </li>
                ))}
              </ol>
            </Content>
          </Section>

          <Section title={t('toggle.overview.radioTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-3)]">
                {t('toggle.overview.radioBody')}
              </p>
              <ol className="flex flex-col gap-[var(--space-2)] pl-[var(--space-5)]">
                {['ran1', 'ran2', 'ran3'].map(k => (
                  <li key={k} className="text-sm text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                    {t(`toggle.overview.${k}`)}
                  </li>
                ))}
              </ol>
            </Content>
          </Section>

          <Section title={t('toggle.overview.demoTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('toggle.overview.demoBody')}
              </p>
            </Content>
            <div className="grid grid-cols-3 max-[640px]:grid-cols-1 gap-[var(--space-4)]">
              <div className="bg-[var(--surface-container_100)] rounded-[var(--radius-lg)] p-[var(--space-5)] border border-[var(--border-subtle-100)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-4)]">Toggle</div>
                <div className="flex flex-col gap-[var(--space-3)]">
                  <Toggle label="Default (aus)" />
                  <Toggle label="Checked (ein)" defaultChecked />
                  <Toggle label="Disabled" defaultChecked />
                </div>
              </div>
              <div className="bg-[var(--surface-container_100)] rounded-[var(--radius-lg)] p-[var(--space-5)] border border-[var(--border-subtle-100)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-4)]">Checkbox</div>
                <div className="flex flex-col gap-[var(--space-3)]">
                  <Checkbox label="Default (unchecked)" />
                  <Checkbox label="Checked" defaultChecked />
                  <Checkbox label="Disabled" disabled />
                </div>
              </div>
              <div className="bg-[var(--surface-container_100)] rounded-[var(--radius-lg)] p-[var(--space-5)] border border-[var(--border-subtle-100)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-4)]">Radio</div>
                <div className="flex flex-col gap-[var(--space-3)]">
                  <Radio name="demo" value="option1" label="Option A" checked={radioVal === 'option1'} onChange={() => setRadioVal('option1')} />
                  <Radio name="demo" value="option2" label="Option B" checked={radioVal === 'option2'} onChange={() => setRadioVal('option2')} />
                  <Radio name="demo" value="option3" label="Disabled" checked={false} onChange={() => {}} disabled />
                </div>
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
          <Section title={t('toggle.usage.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('toggle.usage.intro')}
              </p>
            </Content>
          </Section>

          <Section title={t('toggle.usage.whenTitle')}>
            <div className="flex flex-col gap-[var(--space-1)] border border-[var(--border-subtle-100)] rounded-[var(--radius-lg)] overflow-hidden mb-[var(--space-6)]">
              {[
                { key: 'toggleWhen',   label: 'Toggle' },
                { key: 'checkboxWhen', label: 'Checkbox' },
                { key: 'radioWhen',    label: 'Radio' },
              ].map(({ key, label }, i) => (
                <div key={key} className={`flex items-start gap-[var(--space-4)] px-[var(--space-4)] py-[var(--space-3)] ${i % 2 === 0 ? 'bg-[var(--surface_100)]' : 'bg-[var(--surface_200)]'}`}>
                  <span className="text-xs [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] shrink-0 min-w-[70px] pt-[2px]">{label}</span>
                  <span className="text-sm text-[var(--color-text-secondary)]">{t(`toggle.usage.${key}`)}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)]">
              <div className="bg-[var(--color-success-container-100)] border border-[var(--color-success)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('toggle.usage.doTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ do: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-success)] shrink-0">✓</span>
                      <span>{t(`toggle.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('toggle.usage.doNote')}
                </div>
              </div>
              <div className="bg-[var(--color-error-container-100)] border border-[var(--color-error)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('toggle.usage.dontTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ dont: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-error)] shrink-0">✗</span>
                      <span>{t(`toggle.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('toggle.usage.dontNote')}
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
          <Section title={t('toggle.code.title')}>
            <Content>
              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">
                {t('toggle.code.toggleTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('toggle.code.toggleDesc')}
              </p>
              <CodeBlock language="jsx">{TOGGLE_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('toggle.code.checkboxTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('toggle.code.checkboxDesc')}
              </p>
              <CodeBlock language="jsx">{CHECKBOX_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('toggle.code.radioTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('toggle.code.radioDesc')}
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
          <Section title={t('toggle.a11y.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('toggle.a11y.intro')}
              </p>
            </Content>
          </Section>

          <Section title={t('toggle.a11y.keyboardTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-4)]">
                {t('toggle.a11y.keyboardBody')}
              </p>
            </Content>
            <div className="border border-[var(--border-subtle-100)] rounded-[var(--radius-lg)] overflow-hidden mb-[var(--space-6)]">
              {['k1', 'k2', 'k3', 'k4'].map((k, i) => (
                <div key={k} className={`flex items-center gap-[var(--space-4)] px-[var(--space-4)] py-[var(--space-3)] ${i % 2 === 0 ? 'bg-[var(--surface_100)]' : 'bg-[var(--surface_200)]'}`}>
                  <span className="text-sm text-[var(--color-text-secondary)]">{t(`toggle.a11y.${k}`)}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-6)]">
              {[
                { title: t('toggle.a11y.ariaTitle'),  body: t('toggle.a11y.ariaBody') },
                { title: t('toggle.a11y.labelTitle'), body: t('toggle.a11y.labelBody') },
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
      title="Toggle, Checkbox & Radio"
      description={t('toggle.page.description')}
      tabs={tabs}
    />
  )
}
