import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Table, Badge } from '../components'

const DEMO_COLUMNS = [
  { key: 'name',   label: 'Name' },
  { key: 'role',   label: 'Rolle' },
  { key: 'status', label: 'Status', render: (row) => (
    <Badge variant={row.statusVariant} dot>{row.status}</Badge>
  )},
  { key: 'joined', label: 'Beigetreten' },
]

const DEMO_ROWS = [
  { id: 1, name: 'Anna Müller',    role: 'Designer',    status: 'Aktiv',       statusVariant: 'success', joined: '12.01.2024' },
  { id: 2, name: 'Ben Schmidt',    role: 'Developer',   status: 'Ausstehend',  statusVariant: 'warning', joined: '05.03.2024' },
  { id: 3, name: 'Clara Wagner',   role: 'PM',          status: 'Aktiv',       statusVariant: 'success', joined: '20.06.2023' },
  { id: 4, name: 'David Hoffmann', role: 'QA Engineer', status: 'Inaktiv',     statusVariant: 'neutral', joined: '14.09.2022' },
  { id: 5, name: 'Eva Fischer',    role: 'Designer',    status: 'Abgelaufen',  statusVariant: 'error',   joined: '01.11.2023' },
]

const BASE_CODE = `import { Table } from '@/components'

const columns = [
  { key: 'name',  label: 'Name' },
  { key: 'email', label: 'E-Mail' },
  { key: 'role',  label: 'Rolle' },
]

const rows = [
  { id: 1, name: 'Anna Müller',  email: 'anna@example.com',  role: 'Designer' },
  { id: 2, name: 'Ben Schmidt',  email: 'ben@example.com',   role: 'Developer' },
]

<Table columns={columns} rows={rows} rowKey="id" />`

const RENDER_CODE = `import { Table, Badge, Button } from '@/components'

const columns = [
  { key: 'name', label: 'Name' },
  {
    key: 'status',
    label: 'Status',
    render: (row) => (
      <Badge variant={row.statusVariant} dot>{row.status}</Badge>
    ),
  },
  {
    key: 'actions',
    label: '',
    render: (row) => (
      <Button variant="ghost" size="xs" onClick={() => handleEdit(row.id)}>
        Bearbeiten
      </Button>
    ),
  },
]`

const ROWKEY_CODE = `{/* rowKey — welches Feld als React-Key verwendet wird */}
{/* Standard: "id" — bei anderen Primärschlüsseln explizit angeben */}
<Table columns={columns} rows={rows} rowKey="userId" />
<Table columns={columns} rows={rows} rowKey="slug" />`

export default function TablesPage() {
  const { t } = useTranslation()

  const doDont = ['1', '2', '3'].map(n => ({ do: `do${n}`, dont: `dont${n}` }))

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={() => (
              <Table
                columns={[{ key: 'name', label: 'Name' }, { key: 'status', label: 'Status' }]}
                rows={[
                  { id: 1, name: 'Alice', status: 'Active' },
                  { id: 2, name: 'Bob',   status: 'Inactive' },
                  { id: 3, name: 'Carol', status: 'Active' },
                ]}
                rowKey="id"
              />
            )}
            controls={[]}
          />
          <Section title={t('tables.overview.anatomyTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-3)]">
                {t('tables.overview.anatomyBody')}
              </p>
              <ol className="flex flex-col gap-[var(--space-2)] pl-[var(--space-5)]">
                {['an1', 'an2', 'an3', 'an4'].map(k => (
                  <li key={k} className="text-sm text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                    {t(`tables.overview.${k}`)}
                  </li>
                ))}
              </ol>
            </Content>
          </Section>

          <Section title={t('tables.overview.demoTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('tables.overview.demoBody')}
              </p>
            </Content>
            <Table columns={DEMO_COLUMNS} rows={DEMO_ROWS} rowKey="id" />
          </Section>

          <Section title={t('tables.overview.hoverTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('tables.overview.hoverBody')}
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
          <Section title={t('tables.usage.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('tables.usage.intro')}
              </p>
            </Content>
          </Section>

          <Section title={t('tables.usage.whenTitle')}>
            <div className="flex flex-col gap-[var(--space-1)] border border-[var(--border-subtle-100)] rounded-[var(--radius-lg)] overflow-hidden mb-[var(--space-6)]">
              {['when1', 'when2', 'when3'].map((k, i) => (
                <div key={k} className={`flex items-start gap-[var(--space-4)] px-[var(--space-4)] py-[var(--space-3)] ${i % 2 === 0 ? 'bg-[var(--surface_100)]' : 'bg-[var(--surface_200)]'}`}>
                  <span className="text-sm text-[var(--color-text-secondary)]">{t(`tables.usage.${k}`)}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title={t('tables.usage.renderTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('tables.usage.renderBody')}
              </p>
            </Content>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)]">
              <div className="bg-[var(--color-success-container-100)] border border-[var(--color-success)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('tables.usage.doTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ do: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-success)] shrink-0">✓</span>
                      <span>{t(`tables.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('tables.usage.doNote')}
                </div>
              </div>
              <div className="bg-[var(--color-error-container-100)] border border-[var(--color-error)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('tables.usage.dontTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ dont: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-error)] shrink-0">✗</span>
                      <span>{t(`tables.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('tables.usage.dontNote')}
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
          <Section title={t('tables.code.title')}>
            <Content>
              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">
                {t('tables.code.baseTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('tables.code.baseDesc')}
              </p>
              <CodeBlock language="jsx">{BASE_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('tables.code.renderTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('tables.code.renderDesc')}
              </p>
              <CodeBlock language="jsx">{RENDER_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('tables.code.rowKeyTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('tables.code.rowKeyDesc')}
              </p>
              <CodeBlock language="jsx">{ROWKEY_CODE}</CodeBlock>
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
          <Section title={t('tables.a11y.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('tables.a11y.intro')}
              </p>
            </Content>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)]">
              {[
                { title: t('tables.a11y.roleTitle'),     body: t('tables.a11y.roleBody') },
                { title: t('tables.a11y.scopeTitle'),    body: t('tables.a11y.scopeBody') },
                { title: t('tables.a11y.keyboardTitle'), body: t('tables.a11y.keyboardBody') },
                { title: t('tables.a11y.srTitle'),       body: t('tables.a11y.srBody') },
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
      title="Tables"
      description={t('tables.page.description')}
      tabs={tabs}
    />
  )
}
