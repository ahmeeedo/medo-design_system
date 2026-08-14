import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { DataTable, Tag, Pagination, Search, Button } from '../components'

const BASIC_CODE = `import { DataTable } from '@/components'

<DataTable
  ariaLabel="Verträge"
  rowKey="nr"
  columns={[
    { key: 'nr', label: 'Nummer', numeric: true, sortable: true },
    { key: 'kunde', label: 'Kunde', sortable: true },
    { key: 'abschluss', label: 'Abschluss', muted: true },
    { key: 'beitrag', label: 'Beitrag', numeric: true, sortable: true },
  ]}
  rows={vertraege}
  emptyText="Keine Verträge gefunden. Filter zurücksetzen?"
/>`

const RENDER_CODE = `{/* render setzt echte Bausteine in die Zelle — höchstens ein interaktives je Zelle */}
{
  key: 'status',
  label: 'Status',
  render: (v) => <Tag color={v === 'Aktiv' ? 'success' : 'neutral'}>{v}</Tag>,
}`

const SORT_CODE = `{/* Ungesteuert: die Komponente sortiert selbst — Zahlen numerisch, Text nach deutscher Locale */}
<DataTable columns={spalten} rows={vertraege} defaultSort={{ key: 'beitrag', direction: 'desc' }} />

{/* Gesteuert: onSortChange übernimmt der Aufrufer, etwa für serverseitige Sortierung */}
<DataTable
  columns={spalten}
  rows={vertraege}
  sort={sortierung}
  onSortChange={(s) => { setSortierung(s); ladeSeite(s) }}
/>`

const SELECTION_CODE = `{/* Sobald etwas ausgewählt ist, ersetzt bulkActions die toolbar */}
<DataTable
  title="Verträge"
  selectable
  selected={auswahl}
  onSelectionChange={setAuswahl}
  toolbar={<Search size="sm" placeholder="Suchen" />}
  bulkActions={<Button size="sm" variant="secondary">Exportieren</Button>}
  columns={spalten}
  rows={vertraege}
  rowKey="nr"
/>`

const FRAME_CODE = `{/* maxHeight begrenzt die Höhe; der Kopf bleibt beim Scrollen stehen */}
<DataTable
  maxHeight={420}
  loading={laedt}
  loadingRows={5}
  footer={
    <Pagination variant="bar" page={seite} pageSize={20} totalItems={312} onPageChange={setSeite} />
  }
  columns={spalten}
  rows={vertraege}
  rowKey="nr"
/>`

const ROWS = [
  { nr: '2026-0041', kunde: 'Bäckerei Hoffmann', status: 'Aktiv', abschluss: '04.08.2026', beitrag: '1.284,00 €' },
  { nr: '2026-0038', kunde: 'Zahnarztpraxis Dr. Ulrich', status: 'Aktiv', abschluss: '21.07.2026', beitrag: '2.940,50 €' },
  { nr: '2026-0035', kunde: 'Schreinerei Albrecht', status: 'In Prüfung', abschluss: '19.07.2026', beitrag: '860,00 €' },
  { nr: '2026-0029', kunde: 'Autohaus Zimmermann', status: 'Gekündigt', abschluss: '02.06.2026', beitrag: '4.115,20 €' },
  { nr: '2026-0024', kunde: 'Apotheke am Markt', status: 'Aktiv', abschluss: '15.05.2026', beitrag: '1.740,00 €' },
]

const TONES = { Aktiv: 'success', 'In Prüfung': 'warning', Gekündigt: 'neutral' }

function useColumns(t) {
  return [
    { key: 'nr', label: t('dataTable.demo.colNr'), numeric: true, sortable: true, width: 130 },
    { key: 'kunde', label: t('dataTable.demo.colKunde'), sortable: true },
    {
      key: 'status',
      label: t('dataTable.demo.colStatus'),
      render: (v) => <Tag color={TONES[v]}>{v}</Tag>,
    },
    { key: 'abschluss', label: t('dataTable.demo.colAbschluss'), muted: true },
    { key: 'beitrag', label: t('dataTable.demo.colBeitrag'), numeric: true, sortable: true },
  ]
}

function DataTableDemo({ values, t }) {
  const [page, setPage] = useState(1)
  const columns = useColumns(t)

  return (
    <div className="w-full">
      <DataTable
        size={values.size}
        selectable={values.selectable}
        loading={values.loading}
        onRowClick={values.rowClick ? () => {} : undefined}
        maxHeight={values.sticky ? 260 : undefined}
        title={t('dataTable.demo.title')}
        ariaLabel={t('dataTable.demo.title')}
        toolbar={<Search size="sm" placeholder={t('dataTable.demo.search')} />}
        bulkActions={
          <Button size="sm" variant="secondary" icon="download">
            {t('dataTable.demo.export')}
          </Button>
        }
        columns={columns}
        rows={values.empty ? [] : ROWS}
        rowKey="nr"
        emptyText={t('dataTable.demo.empty')}
        footer={
          values.footer ? (
            <Pagination
              variant="bar"
              page={page}
              pageSize={20}
              totalItems={312}
              onPageChange={setPage}
              ariaLabel={t('dataTable.demo.title')}
            />
          ) : undefined
        }
      />
    </div>
  )
}

const bodyClass =
  '[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]'
const labelClass =
  '[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]'
const codeLabelClass =
  '[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)]'

export default function DataTablePage() {
  const { t } = useTranslation()
  const columns = useColumns(t)
  const [page, setPage] = useState(2)

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={(values) => <DataTableDemo values={values} t={t} />}
            controls={[
              { id: 'size', type: 'dropdown', label: 'Size', options: ['sm', 'md'], default: 'md' },
              { id: 'selectable', type: 'toggle', label: 'Selectable', default: true },
              { id: 'footer', type: 'toggle', label: 'Pagination', default: true },
              { id: 'sticky', type: 'toggle', label: 'Max height', default: false },
              { id: 'loading', type: 'toggle', label: 'Loading', default: false },
              { id: 'empty', type: 'toggle', label: 'Leer', default: false },
              { id: 'rowClick', type: 'toggle', label: 'Zeilen klickbar', default: false },
            ]}
          />

          <Section title={t('dataTable.overview.columnsTitle')}>
            <Content>
              <p className={`${bodyClass} mb-[var(--medo-space-lg)]`}>{t('dataTable.overview.columnsBody')}</p>
              <DataTable columns={columns} rows={ROWS} rowKey="nr" ariaLabel={t('dataTable.demo.title')} />
            </Content>
          </Section>

          <Section title={t('dataTable.overview.sortTitle')}>
            <Content>
              <p className={`${bodyClass} mb-[var(--medo-space-lg)]`}>{t('dataTable.overview.sortBody')}</p>
              <DataTable
                columns={columns}
                rows={ROWS}
                rowKey="nr"
                defaultSort={{ key: 'kunde', direction: 'asc' }}
                ariaLabel={t('dataTable.demo.title')}
              />
            </Content>
          </Section>

          <Section title={t('dataTable.overview.selectTitle')}>
            <Content>
              <p className={`${bodyClass} mb-[var(--medo-space-lg)]`}>{t('dataTable.overview.selectBody')}</p>
              <DataTable
                columns={columns}
                rows={ROWS}
                rowKey="nr"
                selectable
                title={t('dataTable.demo.title')}
                toolbar={<Search size="sm" placeholder={t('dataTable.demo.search')} />}
                bulkActions={
                  <>
                    <Button size="sm" variant="secondary" icon="download">
                      {t('dataTable.demo.export')}
                    </Button>
                    <Button size="sm" variant="danger" icon="delete">
                      {t('dataTable.demo.delete')}
                    </Button>
                  </>
                }
                ariaLabel={t('dataTable.demo.title')}
              />
            </Content>
          </Section>

          <Section title={t('dataTable.overview.statesTitle')}>
            <Content>
              <p className={`${bodyClass} mb-[var(--medo-space-lg)]`}>{t('dataTable.overview.statesBody')}</p>
              <div className="flex flex-col gap-[var(--medo-space-xl)]">
                <div>
                  <p className={labelClass}>{t('dataTable.states.loading')}</p>
                  <DataTable columns={columns} rows={[]} loading loadingRows={4} ariaLabel={t('dataTable.demo.title')} />
                </div>
                <div>
                  <p className={labelClass}>{t('dataTable.states.empty')}</p>
                  <DataTable columns={columns} rows={[]} emptyText={t('dataTable.demo.empty')} ariaLabel={t('dataTable.demo.title')} />
                </div>
              </div>
            </Content>
          </Section>

          <Section title={t('dataTable.overview.frameTitle')}>
            <Content>
              <p className={`${bodyClass} mb-[var(--medo-space-lg)]`}>{t('dataTable.overview.frameBody')}</p>
              <DataTable
                columns={columns}
                rows={ROWS}
                rowKey="nr"
                size="sm"
                maxHeight={220}
                ariaLabel={t('dataTable.demo.title')}
                footer={
                  <Pagination
                    variant="bar"
                    page={page}
                    pageSize={20}
                    totalItems={312}
                    onPageChange={setPage}
                    ariaLabel={t('dataTable.demo.title')}
                  />
                }
              />
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
          <Section title={t('dataTable.usage.whenTitle')}>
            <Content>
              <p className={bodyClass}>{t('dataTable.usage.whenBody')}</p>
            </Content>
          </Section>
          <Section title={t('dataTable.usage.columnsTitle')}>
            <Content>
              <p className={bodyClass}>{t('dataTable.usage.columnsBody')}</p>
            </Content>
          </Section>
          <Section title={t('dataTable.usage.sortTitle')}>
            <Content>
              <p className={bodyClass}>{t('dataTable.usage.sortBody')}</p>
            </Content>
          </Section>
          <Section title={t('dataTable.usage.bulkTitle')}>
            <Content>
              <p className={bodyClass}>{t('dataTable.usage.bulkBody')}</p>
            </Content>
          </Section>
          <Section title={t('dataTable.usage.emptyTitle')}>
            <Content>
              <p className={bodyClass}>{t('dataTable.usage.emptyBody')}</p>
            </Content>
          </Section>
          <Section title={t('dataTable.usage.doDontTitle')}>
            <Content>
              <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--medo-space-lg)]">
                <div className="border border-[var(--medo-border-subtle)] border-t-[3px] border-t-[var(--medo-success-solid)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-success-text)] mb-[var(--medo-space-sm)]">
                    {t('dataTable.usage.doTitle')}
                  </p>
                  <ul className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                    <li>{t('dataTable.usage.do1')}</li>
                    <li>{t('dataTable.usage.do2')}</li>
                    <li>{t('dataTable.usage.do3')}</li>
                  </ul>
                </div>
                <div className="border border-[var(--medo-border-subtle)] border-t-[3px] border-t-[var(--medo-error-solid)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-error-text)] mb-[var(--medo-space-sm)]">
                    {t('dataTable.usage.dontTitle')}
                  </p>
                  <ul className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                    <li>{t('dataTable.usage.dont1')}</li>
                    <li>{t('dataTable.usage.dont2')}</li>
                    <li>{t('dataTable.usage.dont3')}</li>
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
        <Section title={t('dataTable.code.title')}>
          <Content>
            <p className={codeLabelClass}>{t('dataTable.code.basicTitle')}</p>
            <CodeBlock language="jsx">{BASIC_CODE}</CodeBlock>

            <p className={`${codeLabelClass} mt-[var(--medo-space-lg)]`}>{t('dataTable.code.renderTitle')}</p>
            <CodeBlock language="jsx">{RENDER_CODE}</CodeBlock>

            <p className={`${codeLabelClass} mt-[var(--medo-space-lg)]`}>{t('dataTable.code.sortTitle')}</p>
            <CodeBlock language="jsx">{SORT_CODE}</CodeBlock>

            <p className={`${codeLabelClass} mt-[var(--medo-space-lg)]`}>{t('dataTable.code.selectionTitle')}</p>
            <CodeBlock language="jsx">{SELECTION_CODE}</CodeBlock>

            <p className={`${codeLabelClass} mt-[var(--medo-space-lg)]`}>{t('dataTable.code.frameTitle')}</p>
            <CodeBlock language="jsx">{FRAME_CODE}</CodeBlock>
          </Content>
        </Section>
      ),
    },
    {
      id: 'accessibility',
      label: t('tabs.accessibility'),
      content: (
        <>
          <Section title={t('dataTable.a11y.structureTitle')}>
            <Content>
              <p className={bodyClass}>{t('dataTable.a11y.structureBody')}</p>
            </Content>
          </Section>
          <Section title={t('dataTable.a11y.sortTitle')}>
            <Content>
              <p className={bodyClass}>{t('dataTable.a11y.sortBody')}</p>
            </Content>
          </Section>
          <Section title={t('dataTable.a11y.selectTitle')}>
            <Content>
              <p className={bodyClass}>{t('dataTable.a11y.selectBody')}</p>
            </Content>
          </Section>
          <Section title={t('dataTable.a11y.colorTitle')}>
            <Content>
              <p className={bodyClass}>{t('dataTable.a11y.colorBody')}</p>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout title={t('dataTable.page.title')} description={t('dataTable.page.description')} tabs={tabs} />
  )
}
