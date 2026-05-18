import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { DatePicker } from '../components'

const BASIC_CODE = `import { DatePicker } from '@/components'

function MyForm() {
  const [date, setDate] = useState(null)
  return <DatePicker value={date} onChange={setDate} />
}`

const RANGE_CODE = `const [range, setRange] = useState({ from: null, to: null })

<DatePicker
  variant="range"
  value={range}
  onChange={setRange}
/>`

const WITH_TIME_CODE = `const [datetime, setDatetime] = useState(null)

<DatePicker
  variant="withTime"
  value={datetime}
  onChange={setDatetime}
/>`

const INLINE_CODE = `const [date, setDate] = useState(null)

<DatePicker
  variant="inline"
  value={date}
  onChange={setDate}
/>`

const INPUT_CODE = `const [date, setDate] = useState(null)

<DatePicker variant="input" value={date} onChange={setDate} />`

const DISABLED_CODE = `const holidays = [new Date('2025-12-25'), new Date('2025-01-01')]

<DatePicker
  value={date}
  onChange={setDate}
  disabledDates={holidays}
/>`

export default function DatePickerPage() {
  const { t } = useTranslation()

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={(values) => {
              const DatePickerDemo = () => {
                const [date, setDate] = useState(null)
                const [range, setRange] = useState({ from: null, to: null })
                const isRange = values.variant === 'range'
                return (
                  <DatePicker
                    variant={values.variant}
                    value={isRange ? range : date}
                    onChange={isRange ? setRange : setDate}
                  />
                )
              }
              return <DatePickerDemo />
            }}
            controls={[
              { id: 'variant', type: 'dropdown', label: 'Variant', options: ['default', 'range', 'withTime', 'inline', 'input'], default: 'default' },
            ]}
          />
          <Section title={t('datePicker.overview.anatomyTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('datePicker.overview.anatomyBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('datePicker.overview.variantsTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('datePicker.overview.variantsBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('datePicker.overview.localeTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('datePicker.overview.localeBody')}
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
          <Section title={t('datePicker.usage.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('datePicker.usage.intro')}
              </p>
            </Content>
          </Section>
          <Section title={t('datePicker.usage.rangeTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('datePicker.usage.rangeBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('datePicker.usage.withTimeTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('datePicker.usage.withTimeBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('datePicker.usage.inlineTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('datePicker.usage.inlineBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('datePicker.usage.inputTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('datePicker.usage.inputBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('datePicker.usage.disabledTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('datePicker.usage.disabledBody')}
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
          <Section title={t('datePicker.code.title')}>
            <Content>
              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">{t('datePicker.code.basicTitle')}</p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">{t('datePicker.code.basicDesc')}</p>
              <CodeBlock language="jsx">{BASIC_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">{t('datePicker.code.rangeTitle')}</p>
              <CodeBlock language="jsx">{RANGE_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">{t('datePicker.code.withTimeTitle')}</p>
              <CodeBlock language="jsx">{WITH_TIME_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">{t('datePicker.code.inlineTitle')}</p>
              <CodeBlock language="jsx">{INLINE_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">{t('datePicker.code.inputTitle')}</p>
              <CodeBlock language="jsx">{INPUT_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">{t('datePicker.code.disabledTitle')}</p>
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
          <Section title={t('datePicker.a11y.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('datePicker.a11y.intro')}
              </p>
            </Content>
          </Section>
          <Section title={t('datePicker.a11y.keyboardTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('datePicker.a11y.keyboardBody')}
              </p>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title={t('datePicker.page.title')}
      description={t('datePicker.page.description')}
      tabs={tabs}
    />
  )
}
