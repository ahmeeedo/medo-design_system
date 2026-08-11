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

const SEARCH_CODE = `{/* Ab etwa zehn Einträgen die Suche einblenden.
    flag nimmt einen CSS-Hintergrundwert: Farbe oder Bild.
    description steht als zweite Zeile unter der Bezeichnung. */}
const laender = [
  { value: 'de', label: 'Deutschland', description: 'DE · +49',
    flag: 'linear-gradient(180deg, #000 33%, #dd0000 33% 66%, #ffce00 66%)' },
  { value: 'at', label: 'Österreich',  description: 'AT · +43',
    flag: 'linear-gradient(180deg, #ed2939 33%, #fff 33% 66%, #ed2939 66%)' },
  { value: 'ch', label: 'Schweiz',     description: 'CH · +41',
    flag: 'url(/flags/ch.svg)' },
]

<Select label="Land" searchable options={laender} placeholder="Land wählen" />`

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

const stripes = (...c) =>
  `linear-gradient(180deg, ${c[0]} 33%, ${c[1]} 33% 66%, ${c[2]} 66%)`
const bars = (...c) =>
  `linear-gradient(90deg, ${c[0]} 33%, ${c[1]} 33% 66%, ${c[2]} 66%)`

const LAENDER = [
  { value: 'de', label: 'Deutschland', description: 'DE · +49', flag: stripes('#000000', '#dd0000', '#ffce00') },
  { value: 'at', label: 'Österreich', description: 'AT · +43', flag: stripes('#ed2939', '#ffffff', '#ed2939') },
  { value: 'ch', label: 'Schweiz', description: 'CH · +41', flag: '#d52b1e' },
  { value: 'fr', label: 'Frankreich', description: 'FR · +33', flag: bars('#002395', '#ffffff', '#ed2939') },
  { value: 'it', label: 'Italien', description: 'IT · +39', flag: bars('#008c45', '#f4f5f0', '#cd212a') },
  { value: 'nl', label: 'Niederlande', description: 'NL · +31', flag: stripes('#ae1c28', '#ffffff', '#21468b') },
  { value: 'be', label: 'Belgien', description: 'BE · +32', flag: bars('#000000', '#fdda24', '#ef3340') },
  { value: 'dk', label: 'Dänemark', description: 'DK · +45', flag: '#c8102e' },
  { value: 'pl', label: 'Polen', description: 'PL · +48', flag: 'linear-gradient(180deg, #ffffff 50%, #dc143c 50%)' },
  { value: 'cz', label: 'Tschechien', description: 'CZ · +420', flag: 'linear-gradient(180deg, #ffffff 50%, #d7141a 50%)' },
  { value: 'es', label: 'Spanien', description: 'ES · +34', flag: stripes('#aa151b', '#f1bf00', '#aa151b') },
  { value: 'se', label: 'Schweden', description: 'SE · +46', flag: '#006aa7' },
]

const ORTE = [
  { value: 'b', label: 'Berlin', description: 'Berlin · 10115' },
  { value: 'hh', label: 'Hamburg', description: 'Hamburg · 20095' },
  { value: 'm', label: 'München', description: 'Bayern · 80331' },
  { value: 'k', label: 'Köln', description: 'Nordrhein-Westfalen · 50667' },
  { value: 'f', label: 'Frankfurt am Main', description: 'Hessen · 60311' },
  { value: 's', label: 'Stuttgart', description: 'Baden-Württemberg · 70173' },
  { value: 'd', label: 'Düsseldorf', description: 'Nordrhein-Westfalen · 40213' },
  { value: 'l', label: 'Leipzig', description: 'Sachsen · 04109' },
  { value: 'dd', label: 'Dresden', description: 'Sachsen · 01067' },
  { value: 'h', label: 'Hannover', description: 'Niedersachsen · 30159' },
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
            component={(values) => {
              const data =
                values.data === 'gruppen' ? GROUPED
                : values.data === 'laender' ? LAENDER
                : values.data === 'orte' ? ORTE
                : OPTIONS
              const first = values.data === 'gruppen' ? 'allgemein'
                : values.data === 'laender' ? 'de'
                : values.data === 'orte' ? 'b'
                : 'allgemein'
              const second = values.data === 'gruppen' ? 'innere'
                : values.data === 'laender' ? 'at'
                : values.data === 'orte' ? 'hh'
                : 'innere'
              return (
              <Select
                key={values.data}
                label={values.data === 'laender' ? t('select.search.countryLabel')
                  : values.data === 'orte' ? t('select.search.placeLabel')
                  : t('select.demo.label')}
                options={data}
                searchable={values.searchable}
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
                defaultValue={values.multiple ? [first, second] : first}
                style={{ minWidth: '280px' }}
              />
              )
            }}
            controls={[
              { id: 'data', type: 'dropdown', label: 'Daten', options: ['einfach', 'gruppen', 'laender', 'orte'], default: 'einfach' },
              { id: 'size', type: 'dropdown', label: 'Size', options: ['sm', 'md', 'lg'], default: 'md' },
              { id: 'multipleDisplay', type: 'dropdown', label: 'Multiple Display', options: ['chips', 'count'], default: 'chips' },
              { id: 'message', type: 'dropdown', label: 'Message', options: ['keine', 'hint', 'error', 'success'], default: 'hint' },
              { id: 'searchable', type: 'toggle', label: 'Searchable', default: false },
              { id: 'multiple', type: 'toggle', label: 'Multiple', default: false },
              { id: 'maxChips', type: 'toggle', label: 'Max Chips (2)', default: false },
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

          <Section title={t('select.overview.searchTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('select.overview.searchBody')}
              </p>
              <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--medo-space-lg)] pb-[var(--medo-space-2xl)]">
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    {t('select.search.countries')}
                  </p>
                  <Select label={t('select.search.countryLabel')} searchable options={LAENDER} placeholder={t('select.search.countryPlaceholder')} />
                </div>
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    {t('select.search.places')}
                  </p>
                  <Select label={t('select.search.placeLabel')} searchable options={ORTE} placeholder={t('select.search.placePlaceholder')} />
                </div>
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    {t('select.search.multi')}
                  </p>
                  <Select label={t('select.search.countryLabel')} searchable multiple options={LAENDER} defaultValue={['de', 'at']} />
                </div>
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    {t('select.search.open')}
                  </p>
                  <Select label={t('select.search.countryLabel')} searchable options={LAENDER} defaultOpen />
                </div>
              </div>
              <p className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)]">
                {t('select.overview.flagNote')}
              </p>
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
          <Section title={t('select.usage.searchTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('select.usage.searchBody')}
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
              {t('select.code.searchTitle')}
            </p>
            <CodeBlock language="jsx">{SEARCH_CODE}</CodeBlock>

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
                <li>{t('select.a11y.key6')}</li>
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
