import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { StatCard } from '../components'

const BASE_CODE = `import { StatCard } from '@/components'

<StatCard
  label="Aktive Nutzer"
  value="12.847"
  delta="↑ 4.2 % vs. Vormonat"
  deltaDir="up"
/>`

const NO_DELTA_CODE = `{/* Ohne delta — nur Label und Wert */}
<StatCard label="Gesamtbestellungen" value="5.230" />

{/* deltaDir="neutral" — grau, kein Trend */}
<StatCard
  label="Durchschnittlicher Bestellwert"
  value="€64,50"
  delta="→ Stabil"
  deltaDir="neutral"
/>`

const GRID_CODE = `import { StatCard } from '@/components'

<div className="grid grid-cols-4 gap-4">
  <StatCard label="Umsatz"     value="€84.2k"  delta="↑ 12.4 %"    deltaDir="up" />
  <StatCard label="Nutzer"     value="12.841"  delta="↑ 8.1 %"     deltaDir="up" />
  <StatCard label="Conversion" value="3.6 %"   delta="↓ 0.4 %"     deltaDir="down" />
  <StatCard label="Offene Tickets" value="47"  delta="↓ 5 weniger" deltaDir="down" />
</div>`

const FORMAT_CODE = `{/* Werte als vorformatierte Strings — keine Berechnung in der Komponente */}

{/* ✓ Korrekt: fertig formatierter String */}
<StatCard label="Umsatz" value="€84.2k" delta="↑ 12.4 %" deltaDir="up" />

{/* ✗ Falsch: rohe Zahl ohne Formatierung */}
<StatCard label="Umsatz" value={84200} delta={0.124} />

{/* Empfehlung: Formatierung in der aufrufenden Komponente */}
const formatted = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })
  .format(revenue)
<StatCard label="Umsatz" value={formatted} />`

const STAT_CARDS = [
  { label: 'statsCardRevenue',  value: '€84.2k',  delta: '↑ 12.4 %',    deltaDir: 'up' },
  { label: 'statsCardUsers',    value: '12.841',  delta: '↑ 8.1 %',     deltaDir: 'up' },
  { label: 'statsCardConv',     value: '3.6 %',   delta: '↓ 0.4 %',     deltaDir: 'down' },
  { label: 'statsCardTickets',  value: '47',      deltaDir: 'neutral' },
]

export default function StatsPage() {
  const { t } = useTranslation()

  const doDont = ['1', '2', '3'].map(n => ({ do: `do${n}`, dont: `dont${n}` }))

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={(values) => (
              <StatCard
                label="Active Users"
                value="1,284"
                delta="12%"
                deltaDir={values.deltaDir}
              />
            )}
            controls={[
              { id: 'deltaDir', type: 'dropdown', label: 'Delta Dir', options: ['up', 'down', 'neutral'], default: 'up' },
            ]}
          />
          <Section title={t('stats.overview.anatomyTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-3)]">
                {t('stats.overview.anatomyBody')}
              </p>
              <ol className="flex flex-col gap-[var(--space-2)] pl-[var(--space-5)]">
                {['an1', 'an2', 'an3', 'an4'].map(k => (
                  <li key={k} className="text-sm text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                    {t(`stats.overview.${k}`)}
                  </li>
                ))}
              </ol>
            </Content>
          </Section>

          <Section title={t('stats.overview.demoTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('stats.overview.demoBody')}
              </p>
            </Content>
            <div className="grid grid-cols-4 max-[900px]:grid-cols-2 max-[480px]:grid-cols-1 gap-[var(--space-4)]">
              {STAT_CARDS.map(({ label, value, delta, deltaDir }) => (
                <StatCard
                  key={label}
                  label={t(`stats.overview.${label}`)}
                  value={value}
                  delta={delta}
                  deltaDir={deltaDir}
                />
              ))}
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
          <Section title={t('stats.usage.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('stats.usage.intro')}
              </p>
            </Content>
          </Section>

          <Section title={t('stats.usage.formatTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('stats.usage.formatBody')}
              </p>
            </Content>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)]">
              <div className="bg-[var(--color-success-container-100)] border border-[var(--color-success)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('stats.usage.doTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ do: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-success)] shrink-0">✓</span>
                      <span>{t(`stats.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('stats.usage.doNote')}
                </div>
              </div>
              <div className="bg-[var(--color-error-container-100)] border border-[var(--color-error)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('stats.usage.dontTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ dont: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-error)] shrink-0">✗</span>
                      <span>{t(`stats.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('stats.usage.dontNote')}
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
          <Section title={t('stats.code.title')}>
            <Content>
              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">
                {t('stats.code.baseTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('stats.code.baseDesc')}
              </p>
              <CodeBlock language="jsx">{BASE_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('stats.code.noDeltaTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('stats.code.noDeltaDesc')}
              </p>
              <CodeBlock language="jsx">{NO_DELTA_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('stats.code.gridTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('stats.code.gridDesc')}
              </p>
              <CodeBlock language="jsx">{GRID_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('stats.code.formatTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('stats.code.formatDesc')}
              </p>
              <CodeBlock language="jsx">{FORMAT_CODE}</CodeBlock>
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
          <Section title={t('stats.a11y.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('stats.a11y.intro')}
              </p>
            </Content>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)]">
              {[
                { title: t('stats.a11y.iconTitle'),  body: t('stats.a11y.iconBody') },
                { title: t('stats.a11y.ariaTitle'),  body: t('stats.a11y.ariaBody') },
                { title: t('stats.a11y.colorTitle'), body: t('stats.a11y.colorBody') },
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
      title="Stats / KPI"
      description={t('stats.page.description')}
      tabs={tabs}
    />
  )
}
