import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { List, KeyValueList } from '../components'

const BASIC_CODE = `import { List, KeyValueList } from '@/components'

<List items={['Gewerbeversicherung', 'Betriebliche Altersvorsorge', 'Cyberrisiken']} />

{/* Reihenfolge bedeutet etwas — die Ziffern stehen in DM Mono */}
<List variant="ordered" items={['Konto anlegen', 'Praxisdaten ergänzen', 'Team einladen']} />`

const CONTENT_CODE = `{/* Inhalts-Zeilen: Icon, Titel, Erklärung, getrennt durch dünne Linien */}
<List
  variant="content"
  items={[
    { icon: 'verified', title: 'IHK-Zulassung', description: 'Seit 2014, geprüft am 12.03.2026' },
    { icon: 'place', title: 'Region', description: 'Karlsruhe und Umkreis 50 km' },
  ]}
/>

{/* flush nimmt die Trennlinien weg, wenn die Liste in einer umrandeten Karte steht */}
<List variant="content" flush size="sm" items={rows} />`

const KEYVALUE_CODE = `{/* numeric setzt den Wert in DM Mono mit Tabellenziffern */}
<KeyValueList
  items={[
    { key: 'Vertragsnummer', value: 'VN-2026-0184', numeric: true },
    { key: 'Beitrag', value: '1.234,56 €', numeric: true },
    { key: 'Status', value: 'Aktiv' },
    { key: 'Kündigungsfrist', value: '—' },
  ]}
/>

{/* In schmalen Spalten stehen Label und Wert untereinander */}
<KeyValueList layout="stacked" items={items} />`

const EMPTY_CODE = `{/* emptyText erklärt, was hier entstehen wird — nie nur „Keine Daten" */}
<List items={[]} emptyText="Noch keine Schwerpunkte hinterlegt." />`

const NESTED_ITEMS = [
  { text: 'Klarheit vor Dekoration' },
  {
    text: 'Für alle gemacht',
    items: ['Kontraste nach WCAG 2.2 AA', 'Mit Tastatur und Screenreader bedienbar'],
  },
  { text: 'Einmal entschieden, überall verlässlich' },
  { text: 'Der Inhalt führt' },
]

const ORDERED_ITEMS = [
  'Konto anlegen',
  'Praxisdaten ergänzen',
  'Team einladen',
]

export default function ListPage() {
  const { t } = useTranslation()

  const contentItems = [
    { icon: 'verified', title: t('list.demo.c1Title'), description: t('list.demo.c1Desc') },
    { icon: 'place', title: t('list.demo.c2Title'), description: t('list.demo.c2Desc') },
    { icon: 'schedule', title: t('list.demo.c3Title'), description: t('list.demo.c3Desc') },
  ]

  const kvItems = [
    { key: t('list.demo.kv1Key'), value: 'VN-2026-0184', numeric: true },
    { key: t('list.demo.kv2Key'), value: '1.234,56 €', numeric: true },
    { key: t('list.demo.kv3Key'), value: '04.08.2026', numeric: true },
    { key: t('list.demo.kv4Key'), value: t('list.demo.kv4Value') },
  ]

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={(values) => (
              <div className="w-full max-w-[520px]">
                {values.komponente === 'KeyValueList' ? (
                  <KeyValueList
                    items={kvItems}
                    layout={values.layout}
                    monoValues={values.monoValues}
                  />
                ) : (
                  <List
                    variant={values.variant}
                    size={values.size}
                    flush={values.flush}
                    items={
                      values.leer
                        ? []
                        : values.variant === 'content'
                          ? contentItems
                          : values.verschachtelt
                            ? NESTED_ITEMS
                            : ORDERED_ITEMS
                    }
                    emptyText={t('list.demo.empty')}
                  />
                )}
              </div>
            )}
            controls={[
              { id: 'komponente', type: 'dropdown', label: 'Komponente', options: ['List', 'KeyValueList'], default: 'List' },
              { id: 'variant', type: 'dropdown', label: 'Variant', options: ['unordered', 'ordered', 'content'], default: 'unordered' },
              { id: 'size', type: 'dropdown', label: 'Size', options: ['sm', 'md'], default: 'md' },
              { id: 'layout', type: 'dropdown', label: 'Layout (KeyValueList)', options: ['columns', 'stacked'], default: 'columns' },
              { id: 'verschachtelt', type: 'toggle', label: 'Verschachtelt', default: false },
              { id: 'flush', type: 'toggle', label: 'Flush', default: false },
              { id: 'monoValues', type: 'toggle', label: 'Mono Values', default: true },
              { id: 'leer', type: 'toggle', label: 'Leer', default: false },
            ]}
          />

          <Section title={t('list.overview.variantsTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('list.overview.variantsBody')}
              </p>
              <div className="grid grid-cols-3 max-[1024px]:grid-cols-1 gap-[var(--medo-space-lg)]">
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    {t('list.variants.unordered')}
                  </p>
                  <List items={[t('list.demo.u1'), t('list.demo.u2'), t('list.demo.u3')]} />
                </div>
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    {t('list.variants.ordered')}
                  </p>
                  <List variant="ordered" items={ORDERED_ITEMS} />
                </div>
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    {t('list.variants.content')}
                  </p>
                  <List variant="content" items={contentItems} />
                </div>
              </div>
            </Content>
          </Section>

          <Section title={t('list.overview.nestedTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('list.overview.nestedBody')}
              </p>
              <div className="max-w-[520px]">
                <List items={NESTED_ITEMS} />
              </div>
            </Content>
          </Section>

          <Section title={t('list.overview.flushTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('list.overview.flushBody')}
              </p>
              <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--medo-space-lg)]">
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    {t('list.flush.withLines')}
                  </p>
                  <List variant="content" items={contentItems} />
                </div>
                <div className="border border-[var(--medo-border)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)] bg-[var(--medo-surface)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    {t('list.flush.flushInCard')}
                  </p>
                  <List variant="content" flush items={contentItems} />
                </div>
              </div>
            </Content>
          </Section>

          <Section title={t('list.overview.sizesTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('list.overview.sizesBody')}
              </p>
              <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--medo-space-lg)]">
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    md · 16 px
                  </p>
                  <List items={[t('list.demo.u1'), t('list.demo.u2'), t('list.demo.u3')]} />
                </div>
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    sm · 14 px
                  </p>
                  <List size="sm" items={[t('list.demo.u1'), t('list.demo.u2'), t('list.demo.u3')]} />
                </div>
              </div>
            </Content>
          </Section>

          <Section title={t('list.overview.keyValueTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('list.overview.keyValueBody')}
              </p>
              <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--medo-space-lg)]">
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    {t('list.keyValue.columns')}
                  </p>
                  <KeyValueList items={kvItems} />
                </div>
                <div className="max-w-[240px]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    {t('list.keyValue.stacked')}
                  </p>
                  <KeyValueList layout="stacked" items={kvItems} />
                </div>
              </div>
            </Content>
          </Section>

          <Section title={t('list.overview.emptyTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('list.overview.emptyBody')}
              </p>
              <div className="max-w-[520px] border border-[var(--medo-border)] rounded-[var(--medo-radius-lg)] px-[var(--medo-space-lg)] bg-[var(--medo-surface)]">
                <List items={[]} emptyText={t('list.demo.empty')} />
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
          <Section title={t('list.usage.whenTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('list.usage.whenBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('list.usage.orderTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('list.usage.orderBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('list.usage.nestingTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('list.usage.nestingBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('list.usage.numbersTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('list.usage.numbersBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('list.usage.doDontTitle')}>
            <Content>
              <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--medo-space-lg)]">
                <div className="border border-[var(--medo-border-subtle)] border-t-[3px] border-t-[var(--medo-success-solid)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-success-text)] mb-[var(--medo-space-sm)]">
                    {t('list.usage.doTitle')}
                  </p>
                  <ul className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                    <li>{t('list.usage.do1')}</li>
                    <li>{t('list.usage.do2')}</li>
                    <li>{t('list.usage.do3')}</li>
                  </ul>
                </div>
                <div className="border border-[var(--medo-border-subtle)] border-t-[3px] border-t-[var(--medo-error-solid)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-error-text)] mb-[var(--medo-space-sm)]">
                    {t('list.usage.dontTitle')}
                  </p>
                  <ul className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                    <li>{t('list.usage.dont1')}</li>
                    <li>{t('list.usage.dont2')}</li>
                    <li>{t('list.usage.dont3')}</li>
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
        <Section title={t('list.code.title')}>
          <Content>
            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)]">
              {t('list.code.basicTitle')}
            </p>
            <CodeBlock language="jsx">{BASIC_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('list.code.contentTitle')}
            </p>
            <CodeBlock language="jsx">{CONTENT_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('list.code.keyValueTitle')}
            </p>
            <CodeBlock language="jsx">{KEYVALUE_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('list.code.emptyTitle')}
            </p>
            <CodeBlock language="jsx">{EMPTY_CODE}</CodeBlock>
          </Content>
        </Section>
      ),
    },
    {
      id: 'accessibility',
      label: t('tabs.accessibility'),
      content: (
        <>
          <Section title={t('list.a11y.semanticTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('list.a11y.semanticBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('list.a11y.staticTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('list.a11y.staticBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('list.a11y.iconTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('list.a11y.iconBody')}
              </p>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title={t('list.page.title')}
      description={t('list.page.description')}
      tabs={tabs}
    />
  )
}
