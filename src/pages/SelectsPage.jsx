import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { useState } from 'react'
import { Select, MultiSelect, SearchSelect } from '../components'

const COUNTRY_OPTIONS  = ['Deutschland', 'Österreich', 'Schweiz', 'Frankreich', 'Italien']
const LANGUAGE_OPTIONS = [
  { value: 'de', label: 'Deutsch' },
  { value: 'en', label: 'Englisch' },
  { value: 'fr', label: 'Französisch' },
  { value: 'es', label: 'Spanisch' },
]

const BASIC_CODE = `import { Select } from '@/components'

{/* String-Array — einfachste Form */}
<Select
  label="Land"
  options={['Deutschland', 'Österreich', 'Schweiz']}
  onChange={(value) => console.log(value)}
/>`

const OBJECT_CODE = `{/* Objekt-Array: value (Datenwert) ≠ label (Anzeige) */}
<Select
  label="Sprache"
  options={[
    { value: 'de', label: 'Deutsch' },
    { value: 'en', label: 'Englisch' },
    { value: 'fr', label: 'Französisch' },
  ]}
  onChange={setLanguage}
/>`

const MULTI_CODE = `import { useState } from 'react'
import { MultiSelect } from '@/components'

function TagSelect() {
  const [tags, setTags] = useState([])
  return (
    <MultiSelect
      label="Tags"
      options={['Dringend', 'In Bearbeitung', 'Review', 'Abgeschlossen']}
      value={tags}
      onChange={setTags}
      placeholder="Tags auswählen…"
    />
  )
}`

const SEARCH_CODE = `import { useState } from 'react'
import { SearchSelect } from '@/components'

function CountrySelect() {
  const [country, setCountry] = useState('')
  return (
    <SearchSelect
      label="Land"
      options={[
        { value: 'de', label: 'Deutschland' },
        { value: 'at', label: 'Österreich' },
        { value: 'ch', label: 'Schweiz' },
      ]}
      value={country}
      onChange={setCountry}
      placeholder="Land suchen…"
    />
  )
}`

const FORM_CODE = `import { useState } from 'react'
import { Select } from '@/components'

function TimezoneSelect() {
  const [tz, setTz] = useState('')

  return (
    <Select
      label="Zeitzone"
      hint="Beeinflusst die Anzeige von Terminen."
      options={[
        { value: 'UTC+1', label: 'Mitteleuropäische Zeit (UTC+1)' },
        { value: 'UTC+2', label: 'Mitteleuropäische Sommerzeit (UTC+2)' },
        { value: 'UTC+3', label: 'Osteuropäische Zeit (UTC+3)' },
      ]}
      value={tz}
      onChange={setTz}
    />
  )
}`

export default function SelectsPage() {
  const { t } = useTranslation()
  const [multiValue, setMultiValue] = useState([])
  const [searchValue, setSearchValue] = useState('')

  const anatomy = ['an1','an2','an3','an4','an5']
  const doDont  = ['1','2','3'].map(n => ({ do: `do${n}`, dont: `dont${n}` }))

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={(values) => (
              <Select
                options={['Option A', 'Option B', 'Option C']}
                disabled={values.disabled}
              />
            )}
            controls={[
              { id: 'disabled', type: 'toggle', label: 'Disabled', default: false },
            ]}
          />
          <Section title={t('selects.overview.anatomyTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-3)]">
                {t('selects.overview.anatomyBody')}
              </p>
              <ol className="flex flex-col gap-[var(--space-2)] pl-[var(--space-5)]">
                {anatomy.map(k => (
                  <li key={k} className="text-sm text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                    {t(`selects.overview.${k}`)}
                  </li>
                ))}
              </ol>
            </Content>
          </Section>

          <Section title={t('selects.overview.statesTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('selects.overview.statesBody')}
              </p>
            </Content>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)] max-w-[560px]">
              <Select
                label="Land (Standard)"
                options={COUNTRY_OPTIONS}
              />
              <Select
                label="Land (Vorausgewählt)"
                options={COUNTRY_OPTIONS}
                defaultValue="Deutschland"
              />
              <Select
                label="Land (Disabled)"
                options={COUNTRY_OPTIONS}
                disabled
              />
            </div>
          </Section>

          <Section title={t('selects.overview.optionsTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('selects.overview.optionsBody')}
              </p>
            </Content>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)] max-w-[560px]">
              <Select label="String-Array" options={COUNTRY_OPTIONS} />
              <Select label="Objekt-Array" options={LANGUAGE_OPTIONS} />
            </div>
          </Section>

          <Section title={t('selects.overview.multiTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('selects.overview.multiBody')}
              </p>
            </Content>
            <div className="max-w-[360px]">
              <MultiSelect
                label="Tags"
                options={['Dringend', 'In Bearbeitung', 'Review', 'Abgeschlossen']}
                value={multiValue}
                onChange={setMultiValue}
                placeholder="Tags auswählen…"
              />
            </div>
          </Section>

          <Section title={t('selects.overview.searchTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('selects.overview.searchBody')}
              </p>
            </Content>
            <div className="max-w-[360px]">
              <SearchSelect
                label="Land"
                options={COUNTRY_OPTIONS}
                value={searchValue}
                onChange={setSearchValue}
                placeholder="Land suchen…"
              />
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
          <Section title={t('selects.usage.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('selects.usage.intro')}
              </p>
            </Content>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-5)]">
              {[
                { title: t('selects.usage.vsTitle'),          body: t('selects.usage.vsBody') },
                { title: t('selects.usage.placeholderTitle'), body: t('selects.usage.placeholderBody') },
              ].map(({ title, body }) => (
                <div key={title} className="bg-[var(--surface-container_100)] rounded-[var(--radius-lg)] p-[var(--space-5)] border border-[var(--border-subtle-100)]">
                  <div className="text-md [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">{title}</div>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">{body}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)]">
              <div className="bg-[var(--color-success-container-100)] border border-[var(--color-success)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('selects.usage.doTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ do: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-success)] shrink-0">✓</span>
                      <span>{t(`selects.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('selects.usage.doNote')}
                </div>
              </div>
              <div className="bg-[var(--color-error-container-100)] border border-[var(--color-error)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('selects.usage.dontTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ dont: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-error)] shrink-0">✗</span>
                      <span>{t(`selects.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('selects.usage.dontNote')}
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
          <Section title={t('selects.code.title')}>
            <Content>
              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">
                {t('selects.code.basicTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('selects.code.basicDesc')}
              </p>
              <CodeBlock language="jsx">{BASIC_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('selects.code.objectTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('selects.code.objectDesc')}
              </p>
              <CodeBlock language="jsx">{OBJECT_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('selects.code.multiTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('selects.code.multiDesc')}
              </p>
              <CodeBlock language="jsx">{MULTI_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('selects.code.searchTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('selects.code.searchDesc')}
              </p>
              <CodeBlock language="jsx">{SEARCH_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('selects.code.formTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('selects.code.formDesc')}
              </p>
              <CodeBlock language="jsx">{FORM_CODE}</CodeBlock>
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
          <Section title={t('selects.a11y.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('selects.a11y.intro')}
              </p>
            </Content>
          </Section>

          <Section title={t('selects.a11y.keyboardTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-4)]">
                {t('selects.a11y.keyboardBody')}
              </p>
            </Content>
            <div className="border border-[var(--border-subtle-100)] rounded-[var(--radius-lg)] overflow-hidden mb-[var(--space-6)]">
              {['k1','k2','k3','k4','k5'].map((k, i) => (
                <div key={k} className={`flex items-center gap-[var(--space-4)] px-[var(--space-4)] py-[var(--space-3)] ${i % 2 === 0 ? 'bg-[var(--surface_100)]' : 'bg-[var(--surface_200)]'}`}>
                  <span className="text-sm text-[var(--color-text-secondary)]">{t(`selects.a11y.${k}`)}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-6)]">
              <div className="bg-[var(--surface-container_100)] rounded-[var(--radius-lg)] p-[var(--space-5)] border border-[var(--border-subtle-100)]">
                <div className="text-md [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">
                  {t('selects.a11y.ariaTitle')}
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                  {t('selects.a11y.ariaBody')}
                </p>
              </div>
              <div className="bg-[var(--surface-container_100)] rounded-[var(--radius-lg)] p-[var(--space-5)] border border-[var(--border-subtle-100)]">
                <div className="text-md [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">
                  {t('selects.a11y.screenReaderTitle')}
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                  {t('selects.a11y.screenReaderBody')}
                </p>
              </div>
            </div>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title="Select"
      description={t('selects.page.description')}
      tabs={tabs}
    />
  )
}
