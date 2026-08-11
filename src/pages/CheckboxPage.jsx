import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Checkbox, CheckboxGroup } from '../components'

const PROSE = 'text-[var(--medo-text-muted)] [font-family:var(--medo-font-sans)] [font-size:var(--medo-text-base)] [line-height:var(--medo-leading-relaxed)]'
const CAPTION = '[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-xs)] text-[var(--medo-text-muted)]'
const COL = 'flex flex-col gap-[var(--medo-space-sm)] mt-[var(--medo-space-md)]'
const LIST = `${PROSE} list-disc pl-[var(--medo-space-lg)] space-y-[var(--medo-space-3xs)]`

const BASIC_CODE = `import { Checkbox } from '@/components'

<Checkbox label="Terminerinnerung senden" />
<Checkbox label="Befund freigeben" hint="Die Praxis sieht den Befund sofort." />
<Checkbox label="Abrechnung vorbereiten" defaultChecked />`

const GROUP_CODE = `import { Checkbox, CheckboxGroup } from '@/components'

<CheckboxGroup legend="Benachrichtigungen" direction="vertical">
  <Checkbox label="Termin bestätigt" />
  <Checkbox label="Termin verschoben" />
  <Checkbox label="Termin abgesagt" />
</CheckboxGroup>`

const INDETERMINATE_CODE = `const alle = auswahl.length === optionen.length
const einige = auswahl.length > 0 && !alle

<Checkbox
  label="Alle auswählen"
  checked={alle}
  indeterminate={einige}
  onChange={e => setAuswahl(e.target.checked ? optionen : [])}
/>`

const OPTIONS = ['confirmed', 'moved', 'cancelled']

function GroupDemo() {
  const { t } = useTranslation()
  const [selected, setSelected] = useState(['confirmed'])

  const all = selected.length === OPTIONS.length
  const some = selected.length > 0 && !all

  const toggle = id =>
    setSelected(current =>
      current.includes(id) ? current.filter(entry => entry !== id) : [...current, id]
    )

  return (
    <div className="mt-[var(--medo-space-md)]">
      <CheckboxGroup legend={t('checkbox.demo.legend')}>
        <Checkbox
          label={t('checkbox.demo.all')}
          checked={all}
          indeterminate={some}
          onChange={e => setSelected(e.target.checked ? OPTIONS : [])}
        />
        {OPTIONS.map(id => (
          <Checkbox
            key={id}
            label={t(`checkbox.demo.options.${id}`)}
            checked={selected.includes(id)}
            onChange={() => toggle(id)}
          />
        ))}
      </CheckboxGroup>
      <p className={`${CAPTION} mt-[var(--medo-space-sm)]`}>
        {t('checkbox.demo.count', { count: selected.length, total: OPTIONS.length })}
      </p>
    </div>
  )
}

export default function CheckboxPage() {
  const { t } = useTranslation()

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={values => (
              <Checkbox
                label={t('checkbox.demo.reminder')}
                hint={values.hint ? t('checkbox.demo.reminderHint') : undefined}
                size={values.size}
                indeterminate={values.indeterminate}
                error={values.error}
                disabled={values.disabled}
                defaultChecked
              />
            )}
            controls={[
              { id: 'size', type: 'dropdown', label: t('checkbox.controls.size'), options: ['sm', 'md'], default: 'md' },
              { id: 'hint', type: 'toggle', label: t('checkbox.controls.hint'), default: false },
              { id: 'indeterminate', type: 'toggle', label: t('checkbox.controls.indeterminate'), default: false },
              { id: 'error', type: 'toggle', label: t('checkbox.controls.error'), default: false },
              { id: 'disabled', type: 'toggle', label: t('checkbox.controls.disabled'), default: false },
            ]}
          />

          <Section title={t('checkbox.overview.statesTitle')}>
            <Content>
              <p className={PROSE}>{t('checkbox.overview.statesBody')}</p>
              <div className={COL}>
                <Checkbox label={t('checkbox.demo.states.unchecked')} />
                <Checkbox label={t('checkbox.demo.states.checked')} defaultChecked />
                <Checkbox label={t('checkbox.demo.states.indeterminate')} indeterminate />
                <Checkbox label={t('checkbox.demo.states.error')} error />
                <Checkbox label={t('checkbox.demo.states.disabled')} disabled />
                <Checkbox label={t('checkbox.demo.states.disabledChecked')} disabled defaultChecked />
              </div>
            </Content>
          </Section>

          <Section title={t('checkbox.overview.sizesTitle')}>
            <Content>
              <p className={PROSE}>{t('checkbox.overview.sizesBody')}</p>
              <div className={COL}>
                <Checkbox size="sm" label={t('checkbox.demo.reminder')} defaultChecked />
                <span className={CAPTION}>sm · 18px</span>
                <Checkbox size="md" label={t('checkbox.demo.reminder')} defaultChecked />
                <span className={CAPTION}>md · 20px</span>
              </div>
            </Content>
          </Section>

          <Section title={t('checkbox.overview.hintTitle')}>
            <Content>
              <p className={PROSE}>{t('checkbox.overview.hintBody')}</p>
              <div className={COL}>
                <Checkbox label={t('checkbox.demo.release')} hint={t('checkbox.demo.releaseHint')} />
              </div>
            </Content>
          </Section>

          <Section title={t('checkbox.overview.groupTitle')}>
            <Content>
              <p className={PROSE}>{t('checkbox.overview.groupBody')}</p>
              <GroupDemo />
            </Content>
          </Section>

          <Section title={t('checkbox.overview.horizontalTitle')}>
            <Content>
              <p className={PROSE}>{t('checkbox.overview.horizontalBody')}</p>
              <div className="mt-[var(--medo-space-md)]">
                <CheckboxGroup legend={t('checkbox.demo.horizontalLegend')} direction="horizontal">
                  <Checkbox label={t('checkbox.demo.days.mon')} defaultChecked />
                  <Checkbox label={t('checkbox.demo.days.tue')} />
                  <Checkbox label={t('checkbox.demo.days.wed')} defaultChecked />
                </CheckboxGroup>
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
          <Section title={t('checkbox.usage.whenTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('checkbox.usage.w1')}</li>
                <li>{t('checkbox.usage.w2')}</li>
                <li>{t('checkbox.usage.w3')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('checkbox.usage.labelTitle')}>
            <Content>
              <p className={PROSE}>{t('checkbox.usage.labelBody')}</p>
            </Content>
          </Section>

          <Section title={t('checkbox.usage.indeterminateTitle')}>
            <Content>
              <p className={PROSE}>{t('checkbox.usage.indeterminateBody')}</p>
            </Content>
          </Section>

          <Section title={t('checkbox.usage.errorTitle')}>
            <Content>
              <p className={PROSE}>{t('checkbox.usage.errorBody')}</p>
            </Content>
          </Section>

          <Section title={t('checkbox.usage.dontTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('checkbox.usage.dont1')}</li>
                <li>{t('checkbox.usage.dont2')}</li>
                <li>{t('checkbox.usage.dont3')}</li>
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
        <Section title={t('checkbox.code.title')}>
          <Content>
            <p className={PROSE}>{t('checkbox.code.basicDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{BASIC_CODE}</CodeBlock>
            </div>

            <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('checkbox.code.groupDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{GROUP_CODE}</CodeBlock>
            </div>

            <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('checkbox.code.indeterminateDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{INDETERMINATE_CODE}</CodeBlock>
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
          <Section title={t('checkbox.a11y.labelTitle')}>
            <Content>
              <p className={PROSE}>{t('checkbox.a11y.labelBody')}</p>
            </Content>
          </Section>

          <Section title={t('checkbox.a11y.keyboardTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('checkbox.a11y.k1')}</li>
                <li>{t('checkbox.a11y.k2')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('checkbox.a11y.stateTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('checkbox.a11y.s1')}</li>
                <li>{t('checkbox.a11y.s2')}</li>
                <li>{t('checkbox.a11y.s3')}</li>
              </ul>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title={t('checkbox.page.title')}
      description={t('checkbox.page.description')}
      tabs={tabs}
    />
  )
}
