import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel, GridWrapper } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Select } from '../components'

const BASIC_CODE = `import { Select } from '@/components'

const fachrichtungen = [
  { value: 'allgemein', label: 'Allgemeinmedizin' },
  { value: 'innere',    label: 'Innere Medizin' },
  { value: 'ortho',     label: 'Orthopädie', icon: 'orthopedics' },
]

<Select label="Fachrichtung" options={fachrichtungen} placeholder="Bitte wählen" />`

const MULTI_CODE = `{/* Chips: was in eine Zeile passt, der Rest als „+N" */}
<Select label="Leistungen" multiple options={leistungen} />

{/* Zähler statt Chips, wenn das Feld schmal ist */}
<Select label="Leistungen" multiple multipleDisplay="count" options={leistungen} />

{/* Harte Obergrenze sichtbarer Chips */}
<Select label="Leistungen" multiple maxChips={2} options={leistungen} />`

const GROUP_CODE = `const optionen = [
  { label: 'Häufig', options: [
    { value: 'allgemein', label: 'Allgemeinmedizin' },
    { value: 'innere',    label: 'Innere Medizin' },
  ]},
  { label: 'Weitere', options: [
    { value: 'derma', label: 'Dermatologie' },
    { value: 'neuro', label: 'Neurologie', disabled: true },
  ]},
]

<Select label="Fachrichtung" options={optionen} />`

const NATIVE_CODE = `{/* Betriebssystem-Auswahlrad: sehr lange Listen, Formulare ohne JavaScript */}
<Select label="Land" native options={laender} />`

const OPTIONS = [
  { value: 'allgemein', label: 'Allgemeinmedizin' },
  { value: 'innere', label: 'Innere Medizin' },
  { value: 'derma', label: 'Dermatologie' },
  { value: 'neuro', label: 'Neurologie' },
]

const GROUPED = [
  {
    label: 'Häufig',
    options: [
      { value: 'allgemein', label: 'Allgemeinmedizin' },
      { value: 'innere', label: 'Innere Medizin' },
    ],
  },
  {
    label: 'Weitere',
    options: [
      { value: 'derma', label: 'Dermatologie' },
      { value: 'neuro', label: 'Neurologie', disabled: true },
    ],
  },
]

const ICON_OPTIONS = [
  { value: 'termin', label: 'Terminvergabe', icon: 'event' },
  { value: 'labor', label: 'Laborbefund', icon: 'science' },
  { value: 'rezept', label: 'Rezeptanforderung', icon: 'prescriptions' },
]

export default function SelectPage() {
  const { t } = useTranslation()

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={(values) => (
              <Select
                label={t('select.demo.label')}
                options={values.grouped ? GROUPED : OPTIONS}
                size={values.size}
                multiple={values.multiple}
                multipleDisplay={values.multipleDisplay}
                maxChips={values.maxChips ? 2 : 0}
                native={values.native}
                icon={values.icon ? 'stethoscope' : undefined}
                required={values.required}
                optional={values.optional}
                disabled={values.disabled}
                hint={values.message === 'hint' ? t('select.demo.hint') : undefined}
                error={values.message === 'error' ? t('select.demo.error') : undefined}
                success={values.message === 'success' ? t('select.demo.success') : undefined}
                fullWidth={values.fullWidth}
                defaultValue={values.multiple ? ['allgemein', 'innere'] : 'allgemein'}
                style={{ minWidth: '280px' }}
              />
            )}
            controls={[
              { id: 'size', type: 'dropdown', label: 'Size', options: ['sm', 'md', 'lg'], default: 'md' },
              { id: 'multipleDisplay', type: 'dropdown', label: 'Multiple Display', options: ['chips', 'count'], default: 'chips' },
              { id: 'message', type: 'dropdown', label: 'Message', options: ['keine', 'hint', 'error', 'success'], default: 'hint' },
              { id: 'multiple', type: 'toggle', label: 'Multiple', default: false },
              { id: 'maxChips', type: 'toggle', label: 'Max Chips (2)', default: false },
              { id: 'grouped', type: 'toggle', label: 'Gruppen', default: false },
              { id: 'native', type: 'toggle', label: 'Native', default: false },
              { id: 'icon', type: 'toggle', label: 'Icon', default: false },
              { id: 'required', type: 'toggle', label: 'Required', default: false },
              { id: 'optional', type: 'toggle', label: 'Optional', default: false },
              { id: 'disabled', type: 'toggle', label: 'Disabled', default: false },
              { id: 'fullWidth', type: 'toggle', label: 'Full Width', default: false },
            ]}
          />

          <Section title={t('select.overview.singleTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('select.overview.singleBody')}
              </p>
              <GridWrapper>
                <Select label={t('select.single.empty')} options={OPTIONS} />
                <Select label={t('select.single.chosen')} options={OPTIONS} defaultValue="innere" />
                <Select label={t('select.single.icons')} options={ICON_OPTIONS} icon="folder" defaultValue="labor" />
                <Select label={t('select.single.open')} options={OPTIONS} defaultOpen />
              </GridWrapper>
            </Content>
          </Section>

          <Section title={t('select.overview.multiTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('select.overview.multiBody')}
              </p>
              <GridWrapper>
                <Select label={t('select.multi.chips')} multiple options={OPTIONS} defaultValue={['allgemein', 'innere']} />
                <Select label={t('select.multi.count')} multiple multipleDisplay="count" options={OPTIONS} defaultValue={['allgemein', 'innere', 'derma']} />
                <Select label={t('select.multi.max')} multiple maxChips={2} options={OPTIONS} defaultValue={['allgemein', 'innere', 'derma', 'neuro']} />
                <Select label={t('select.multi.empty')} multiple options={OPTIONS} />
              </GridWrapper>
            </Content>
          </Section>

          <Section title={t('select.overview.groupTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('select.overview.groupBody')}
              </p>
              <div className="max-w-[320px]">
                <Select label={t('select.group.label')} options={GROUPED} defaultValue="innere" />
              </div>
            </Content>
          </Section>

          <Section title={t('select.overview.sizesTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('select.overview.sizesBody')}
              </p>
              <div className="flex flex-col gap-[var(--medo-space-md)] max-w-[320px]">
                <Select size="sm" label="sm · 36 px" options={OPTIONS} defaultValue="allgemein" />
                <Select size="md" label="md · 40 px" options={OPTIONS} defaultValue="allgemein" />
                <Select size="lg" label="lg · 48 px" options={OPTIONS} defaultValue="allgemein" />
              </div>
            </Content>
          </Section>

          <Section title={t('select.overview.statesTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('select.overview.statesBody')}
              </p>
              <GridWrapper>
                <Select label={t('select.states.error')} options={OPTIONS} error={t('select.demo.error')} />
                <Select label={t('select.states.success')} options={OPTIONS} defaultValue="innere" success={t('select.demo.success')} />
                <Select label={t('select.states.disabled')} options={OPTIONS} defaultValue="innere" disabled />
                <Select label={t('select.states.empty')} options={[]} />
              </GridWrapper>
            </Content>
          </Section>

          <Section title={t('select.overview.nativeTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('select.overview.nativeBody')}
              </p>
              <div className="max-w-[320px]">
                <Select label={t('select.native.label')} native options={GROUPED} hint={t('select.native.hint')} />
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
          <Section title={t('select.usage.whenTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('select.usage.whenBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('select.usage.orderTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('select.usage.orderBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('select.usage.multiTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('select.usage.multiBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('select.usage.nativeTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('select.usage.nativeBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('select.usage.doDontTitle')}>
            <Content>
              <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--medo-space-lg)]">
                <div className="border border-[var(--medo-border-subtle)] border-t-[3px] border-t-[var(--medo-success-solid)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-success-text)] mb-[var(--medo-space-sm)]">
                    {t('select.usage.doTitle')}
                  </p>
                  <ul className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                    <li>{t('select.usage.do1')}</li>
                    <li>{t('select.usage.do2')}</li>
                    <li>{t('select.usage.do3')}</li>
                  </ul>
                </div>
                <div className="border border-[var(--medo-border-subtle)] border-t-[3px] border-t-[var(--medo-error-solid)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-error-text)] mb-[var(--medo-space-sm)]">
                    {t('select.usage.dontTitle')}
                  </p>
                  <ul className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                    <li>{t('select.usage.dont1')}</li>
                    <li>{t('select.usage.dont2')}</li>
                    <li>{t('select.usage.dont3')}</li>
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
        <Section title={t('select.code.title')}>
          <Content>
            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)]">
              {t('select.code.basicTitle')}
            </p>
            <CodeBlock language="jsx">{BASIC_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('select.code.multiTitle')}
            </p>
            <CodeBlock language="jsx">{MULTI_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('select.code.groupTitle')}
            </p>
            <CodeBlock language="jsx">{GROUP_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('select.code.nativeTitle')}
            </p>
            <CodeBlock language="jsx">{NATIVE_CODE}</CodeBlock>
          </Content>
        </Section>
      ),
    },
    {
      id: 'accessibility',
      label: t('tabs.accessibility'),
      content: (
        <>
          <Section title={t('select.a11y.roleTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('select.a11y.roleBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('select.a11y.keyboardTitle')}>
            <Content>
              <ul className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                <li>{t('select.a11y.key1')}</li>
                <li>{t('select.a11y.key2')}</li>
                <li>{t('select.a11y.key3')}</li>
                <li>{t('select.a11y.key4')}</li>
                <li>{t('select.a11y.key5')}</li>
              </ul>
            </Content>
          </Section>
          <Section title={t('select.a11y.chipTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('select.a11y.chipBody')}
              </p>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title={t('select.page.title')}
      description={t('select.page.description')}
      tabs={tabs}
    />
  )
}
