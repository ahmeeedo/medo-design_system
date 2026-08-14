import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { DatePicker, TimeSlots } from '../components'

const FIELD_CODE = `import { DatePicker } from '@/components'

{/* Feld mit Kalender-Popover — der Normalfall für ein einzelnes Datum */}
<DatePicker
  label="Vertragsbeginn"
  helper="Frühestens ab heute."
  value={beginn}
  onChange={setBeginn}
  min={new Date()}
  required
/>`

const RANGE_CODE = `{/* Zeitraum: erster Klick Start, zweiter Ende. Liegt der zweite davor, dreht sich der Zeitraum um */}
<DatePicker
  mode="range"
  inline
  value={zeitraum}
  onChange={setZeitraum}
  summaryLabel="Abrechnungszeitraum"
  presets={[
    { label: 'Diese Woche', value: () => ({ start: montag(), end: sonntag() }) },
    { label: 'Letzte 30 Tage', value: () => ({ start: vorTagen(30), end: new Date() }) },
  ]}
/>`

const SLOTS_CODE = `import { TimeSlots } from '@/components'

{/* Belegte Zeiten stehen deaktiviert und durchgestrichen — nie ausgeblendet */}
<TimeSlots
  value={uhrzeit}
  onChange={setUhrzeit}
  columns={3}
  ariaLabel="Uhrzeit"
  slots={['09:00', '09:30', { time: '10:00', disabled: true }, '10:30', '11:00']}
/>`

const ERROR_CODE = `{/* Die Meldung nennt Ursache und nächsten Schritt */}
<DatePicker
  label="Vertragsbeginn"
  value={beginn}
  onChange={setBeginn}
  error="Das Datum liegt vor dem Vertragsabschluss. Bitte wählen Sie den 04.08.2026 oder später."
/>`

const SLOTS = ['09:00', '09:30', { time: '10:00', disabled: true }, '10:30', '11:00', { time: '11:30', disabled: true }]

const bodyClass =
  '[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]'
const labelClass =
  '[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]'
const codeLabelClass =
  '[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)]'

function DatePickerDemo({ values, t }) {
  const presets = [
    {
      label: t('datePicker.demo.presetWeek'),
      value: () => ({ start: new Date(2026, 7, 3), end: new Date(2026, 7, 9) }),
    },
    {
      label: t('datePicker.demo.presetMonth'),
      value: () => ({ start: new Date(2026, 7, 1), end: new Date(2026, 7, 31) }),
    },
  ]

  return (
    <div className="w-full flex justify-center">
      <DatePicker
        mode={values.mode}
        inline={values.inline}
        label={values.label ? t('datePicker.demo.label') : undefined}
        helper={values.helper && !values.error ? t('datePicker.demo.helper') : undefined}
        error={values.error ? t('datePicker.demo.error') : undefined}
        clearable={values.clearable}
        required={values.required}
        disabled={values.disabled}
        presets={values.presets ? presets : undefined}
        summaryLabel={t('datePicker.demo.summary')}
      />
    </div>
  )
}

export default function DatePickerPage() {
  const { t } = useTranslation()
  const [slot, setSlot] = useState('09:30')

  const presets = [
    {
      label: t('datePicker.demo.presetWeek'),
      value: () => ({ start: new Date(2026, 7, 3), end: new Date(2026, 7, 9) }),
    },
    {
      label: t('datePicker.demo.presetMonth'),
      value: () => ({ start: new Date(2026, 7, 1), end: new Date(2026, 7, 31) }),
    },
  ]

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={(values) => <DatePickerDemo values={values} t={t} />}
            controls={[
              { id: 'mode', type: 'dropdown', label: 'Mode', options: ['single', 'range'], default: 'single' },
              { id: 'inline', type: 'toggle', label: 'Inline', default: false },
              { id: 'label', type: 'toggle', label: 'Label', default: true },
              { id: 'helper', type: 'toggle', label: 'Helper', default: true },
              { id: 'presets', type: 'toggle', label: 'Presets', default: false },
              { id: 'clearable', type: 'toggle', label: 'Clearable', default: true },
              { id: 'required', type: 'toggle', label: 'Required', default: false },
              { id: 'error', type: 'toggle', label: 'Error', default: false },
              { id: 'disabled', type: 'toggle', label: 'Disabled', default: false },
            ]}
          />

          <Section title={t('datePicker.overview.formsTitle')}>
            <Content>
              <p className={`${bodyClass} mb-[var(--medo-space-lg)]`}>{t('datePicker.overview.formsBody')}</p>
              <div className="flex flex-col gap-[var(--medo-space-xl)]">
                <div>
                  <p className={labelClass}>{t('datePicker.forms.field')}</p>
                  <DatePicker
                    label={t('datePicker.demo.label')}
                    helper={t('datePicker.demo.helper')}
                    defaultValue={new Date(2026, 7, 4)}
                  />
                </div>
                <div>
                  <p className={labelClass}>{t('datePicker.forms.inline')}</p>
                  <DatePicker inline defaultValue={new Date(2026, 7, 4)} />
                </div>
              </div>
            </Content>
          </Section>

          <Section title={t('datePicker.overview.rangeTitle')}>
            <Content>
              <p className={`${bodyClass} mb-[var(--medo-space-lg)]`}>{t('datePicker.overview.rangeBody')}</p>
              <DatePicker
                mode="range"
                inline
                presets={presets}
                summaryLabel={t('datePicker.demo.summary')}
                defaultValue={{ start: new Date(2026, 7, 4), end: new Date(2026, 7, 12) }}
              />
            </Content>
          </Section>

          <Section title={t('datePicker.overview.statesTitle')}>
            <Content>
              <p className={`${bodyClass} mb-[var(--medo-space-lg)]`}>{t('datePicker.overview.statesBody')}</p>
              <div className="flex flex-wrap gap-[var(--medo-space-xl)]">
                <div>
                  <p className={labelClass}>{t('datePicker.states.empty')}</p>
                  <DatePicker label={t('datePicker.demo.label')} />
                </div>
                <div>
                  <p className={labelClass}>{t('datePicker.states.filled')}</p>
                  <DatePicker label={t('datePicker.demo.label')} defaultValue={new Date(2026, 7, 4)} />
                </div>
                <div>
                  <p className={labelClass}>{t('datePicker.states.error')}</p>
                  <DatePicker
                    label={t('datePicker.demo.label')}
                    defaultValue={new Date(2026, 6, 20)}
                    error={t('datePicker.demo.error')}
                  />
                </div>
                <div>
                  <p className={labelClass}>{t('datePicker.states.disabled')}</p>
                  <DatePicker label={t('datePicker.demo.label')} defaultValue={new Date(2026, 7, 4)} disabled />
                </div>
                <div>
                  <p className={labelClass}>{t('datePicker.states.limited')}</p>
                  <DatePicker
                    label={t('datePicker.demo.label')}
                    helper={t('datePicker.demo.limitHelper')}
                    min={new Date(2026, 7, 10)}
                    max={new Date(2026, 7, 20)}
                  />
                </div>
              </div>
            </Content>
          </Section>

          <Section title={t('datePicker.overview.slotsTitle')}>
            <Content>
              <p className={`${bodyClass} mb-[var(--medo-space-lg)]`}>{t('datePicker.overview.slotsBody')}</p>
              <div className="max-w-[300px]">
                <TimeSlots slots={SLOTS} value={slot} onChange={setSlot} ariaLabel={t('datePicker.demo.slotsLabel')} />
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
          <Section title={t('datePicker.usage.whenTitle')}>
            <Content>
              <p className={bodyClass}>{t('datePicker.usage.whenBody')}</p>
            </Content>
          </Section>
          <Section title={t('datePicker.usage.selectTitle')}>
            <Content>
              <p className={bodyClass}>{t('datePicker.usage.selectBody')}</p>
            </Content>
          </Section>
          <Section title={t('datePicker.usage.limitsTitle')}>
            <Content>
              <p className={bodyClass}>{t('datePicker.usage.limitsBody')}</p>
            </Content>
          </Section>
          <Section title={t('datePicker.usage.presetsTitle')}>
            <Content>
              <p className={bodyClass}>{t('datePicker.usage.presetsBody')}</p>
            </Content>
          </Section>
          <Section title={t('datePicker.usage.formatTitle')}>
            <Content>
              <p className={bodyClass}>{t('datePicker.usage.formatBody')}</p>
            </Content>
          </Section>
          <Section title={t('datePicker.usage.doDontTitle')}>
            <Content>
              <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--medo-space-lg)]">
                <div className="border border-[var(--medo-border-subtle)] border-t-[3px] border-t-[var(--medo-success-solid)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-success-text)] mb-[var(--medo-space-sm)]">
                    {t('datePicker.usage.doTitle')}
                  </p>
                  <ul className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                    <li>{t('datePicker.usage.do1')}</li>
                    <li>{t('datePicker.usage.do2')}</li>
                    <li>{t('datePicker.usage.do3')}</li>
                  </ul>
                </div>
                <div className="border border-[var(--medo-border-subtle)] border-t-[3px] border-t-[var(--medo-error-solid)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-error-text)] mb-[var(--medo-space-sm)]">
                    {t('datePicker.usage.dontTitle')}
                  </p>
                  <ul className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                    <li>{t('datePicker.usage.dont1')}</li>
                    <li>{t('datePicker.usage.dont2')}</li>
                    <li>{t('datePicker.usage.dont3')}</li>
                  </ul>
                </div>
              </div>
            </Content>
          </Section>
        </>
      ),
    },
    {
      id: 'code',
      label: t('tabs.code'),
      content: (
        <Section title={t('datePicker.code.title')}>
          <Content>
            <p className={codeLabelClass}>{t('datePicker.code.fieldTitle')}</p>
            <CodeBlock language="jsx">{FIELD_CODE}</CodeBlock>

            <p className={`${codeLabelClass} mt-[var(--medo-space-lg)]`}>{t('datePicker.code.rangeTitle')}</p>
            <CodeBlock language="jsx">{RANGE_CODE}</CodeBlock>

            <p className={`${codeLabelClass} mt-[var(--medo-space-lg)]`}>{t('datePicker.code.slotsTitle')}</p>
            <CodeBlock language="jsx">{SLOTS_CODE}</CodeBlock>

            <p className={`${codeLabelClass} mt-[var(--medo-space-lg)]`}>{t('datePicker.code.errorTitle')}</p>
            <CodeBlock language="jsx">{ERROR_CODE}</CodeBlock>
          </Content>
        </Section>
      ),
    },
    {
      id: 'accessibility',
      label: t('tabs.accessibility'),
      content: (
        <>
          <Section title={t('datePicker.a11y.keyboardTitle')}>
            <Content>
              <p className={bodyClass}>{t('datePicker.a11y.keyboardBody')}</p>
            </Content>
          </Section>
          <Section title={t('datePicker.a11y.namingTitle')}>
            <Content>
              <p className={bodyClass}>{t('datePicker.a11y.namingBody')}</p>
            </Content>
          </Section>
          <Section title={t('datePicker.a11y.stateTitle')}>
            <Content>
              <p className={bodyClass}>{t('datePicker.a11y.stateBody')}</p>
            </Content>
          </Section>
          <Section title={t('datePicker.a11y.errorTitle')}>
            <Content>
              <p className={bodyClass}>{t('datePicker.a11y.errorBody')}</p>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout title={t('datePicker.page.title')} description={t('datePicker.page.description')} tabs={tabs} />
  )
}
