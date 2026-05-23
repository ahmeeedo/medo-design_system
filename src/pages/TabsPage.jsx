import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Tabs } from '../components'

const UNCONTROLLED_CODE = `import { Tabs } from '@/components'

{/* Uncontrolled — defaultTab setzt den initialen Tab */}
<Tabs
  variant="underline"
  defaultTab="overview"
  tabs={[
    { id: 'overview',  label: 'Übersicht',  content: <div>Inhalt Übersicht</div> },
    { id: 'details',   label: 'Details',    content: <div>Inhalt Details</div> },
    { id: 'activity',  label: 'Aktivität',  content: <div>Inhalt Aktivität</div> },
  ]}
/>`

const CONTROLLED_CODE = `import { useState } from 'react'
import { Tabs } from '@/components'

function ProfileTabs() {
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <>
      <Tabs
        variant="underline"
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={[
          { id: 'profile',   label: 'Profil',       content: <ProfileForm /> },
          { id: 'security',  label: 'Sicherheit',   content: <SecurityForm /> },
          { id: 'billing',   label: 'Abrechnung',   content: <BillingForm /> },
        ]}
      />
      {activeTab === 'billing' && <BillingBanner />}
    </>
  )
}`

const PILL_CODE = `{/* variant="pill" — für Filter, Kategorien */}
<Tabs
  variant="pill"
  tabs={[
    { id: 'all',      label: 'Alle' },
    { id: 'active',   label: 'Aktiv' },
    { id: 'archived', label: 'Archiviert' },
  ]}
/>`

const DEMO_UNDERLINE_TABS = [
  { id: 'u-overview', label: 'Übersicht',  content: <p className="text-sm text-[var(--color-text-secondary)] py-4">Hier steht der Übersichtsinhalt der Komponente.</p> },
  { id: 'u-details',  label: 'Details',    content: <p className="text-sm text-[var(--color-text-secondary)] py-4">Detaillierte technische Informationen und Spezifikationen.</p> },
  { id: 'u-activity', label: 'Aktivität',  content: <p className="text-sm text-[var(--color-text-secondary)] py-4">Änderungshistorie und Aktivitäts-Log.</p> },
]

const DEMO_PILL_TABS = [
  { id: 'p-all',      label: 'Alle',        content: <p className="text-sm text-[var(--color-text-secondary)] py-4">Alle Einträge werden angezeigt.</p> },
  { id: 'p-active',   label: 'Aktiv',       content: <p className="text-sm text-[var(--color-text-secondary)] py-4">Nur aktive Einträge.</p> },
  { id: 'p-archived', label: 'Archiviert',  content: <p className="text-sm text-[var(--color-text-secondary)] py-4">Archivierte Einträge.</p> },
]

export default function TabsPage() {
  const { t } = useTranslation()

  const [activeTab, setActiveTab] = useState('controlled-a')
  const doDont = ['1', '2', '3'].map(n => ({ do: `do${n}`, dont: `dont${n}` }))

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={(values) => (
              <Tabs
                variant={values.variant}
                tabs={[
                  { id: 'tab1', label: 'Tab 1', content: <span className="text-sm text-[var(--color-text-secondary)]">Content 1</span> },
                  { id: 'tab2', label: 'Tab 2', content: <span className="text-sm text-[var(--color-text-secondary)]">Content 2</span> },
                  { id: 'tab3', label: 'Tab 3', content: <span className="text-sm text-[var(--color-text-secondary)]">Content 3</span> },
                ]}
              />
            )}
            controls={[
              { id: 'variant', type: 'dropdown', label: 'Variant', options: ['underline', 'pill'], default: 'underline' },
            ]}
          />
          <Section title={t('tabsPage.overview.anatomyTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-3)]">
                {t('tabsPage.overview.anatomyBody')}
              </p>
              <ol className="flex flex-col gap-[var(--space-2)] pl-[var(--space-5)]">
                {['an1', 'an2', 'an3'].map(k => (
                  <li key={k} className="text-sm text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                    {t(`tabsPage.overview.${k}`)}
                  </li>
                ))}
              </ol>
            </Content>
          </Section>

          <Section title={t('tabsPage.overview.variantsTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('tabsPage.overview.variantsBody')}
              </p>
            </Content>

            <div className="flex flex-col gap-[var(--space-6)]">
              <div>
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('tabsPage.overview.underlineLabel')}
                </div>
                <Tabs variant="underline" tabs={DEMO_UNDERLINE_TABS} />
              </div>

              <div>
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('tabsPage.overview.pillLabel')}
                </div>
                <Tabs variant="pill" tabs={DEMO_PILL_TABS} />
              </div>
            </div>
          </Section>

          <Section title={t('tabsPage.overview.stateTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('tabsPage.overview.stateBody')}
              </p>
            </Content>
            <div className="flex flex-col gap-[var(--space-1)] border border-[var(--border-subtle-100)] rounded-[var(--radius-lg)] overflow-hidden">
              {[
                { key: 'stateUncontrolled', label: 'uncontrolled' },
                { key: 'stateControlled',   label: 'controlled' },
              ].map(({ key, label }, i) => (
                <div key={key} className={`flex items-start gap-[var(--space-4)] px-[var(--space-4)] py-[var(--space-3)] ${i % 2 === 0 ? 'bg-[var(--surface_100)]' : 'bg-[var(--surface_200)]'}`}>
                  <code className="text-xs [font-family:var(--font-mono)] text-[var(--color-text-primary)] shrink-0 min-w-[96px] pt-[2px]">{label}</code>
                  <span className="text-sm text-[var(--color-text-secondary)]">{t(`tabsPage.overview.${key}`)}</span>
                </div>
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
          <Section title={t('tabsPage.usage.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('tabsPage.usage.intro')}
              </p>
            </Content>
          </Section>

          <Section title={t('tabsPage.usage.whenTitle')}>
            <div className="flex flex-col gap-[var(--space-1)] border border-[var(--border-subtle-100)] rounded-[var(--radius-lg)] overflow-hidden mb-[var(--space-6)]">
              {['when1', 'when2', 'when3'].map((k, i) => (
                <div key={k} className={`flex items-start gap-[var(--space-4)] px-[var(--space-4)] py-[var(--space-3)] ${i % 2 === 0 ? 'bg-[var(--surface_100)]' : 'bg-[var(--surface_200)]'}`}>
                  <span className="text-sm text-[var(--color-text-secondary)]">{t(`tabsPage.usage.${k}`)}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title={t('tabsPage.usage.whenNotTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('tabsPage.usage.whenNotBody')}
              </p>
            </Content>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)]">
              <div className="bg-[var(--color-success-container-100)] border border-[var(--color-success)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('tabsPage.usage.doTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ do: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-success)] shrink-0">✓</span>
                      <span>{t(`tabsPage.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('tabsPage.usage.doNote')}
                </div>
              </div>
              <div className="bg-[var(--color-error-container-100)] border border-[var(--color-error)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('tabsPage.usage.dontTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ dont: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-error)] shrink-0">✗</span>
                      <span>{t(`tabsPage.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('tabsPage.usage.dontNote')}
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
          <Section title={t('tabsPage.code.title')}>
            <Content>
              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">
                {t('tabsPage.code.uncontrolledTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('tabsPage.code.uncontrolledDesc')}
              </p>
              <CodeBlock language="jsx">{UNCONTROLLED_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('tabsPage.code.controlledTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('tabsPage.code.controlledDesc')}
              </p>
              <div className="mb-[var(--space-4)]">
                <Tabs
                  variant="underline"
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  tabs={[
                    { id: 'controlled-a', label: 'Profil',     content: <p className="text-sm text-[var(--color-text-secondary)] py-4">{t('tabsPage.code.controlledDemoA')}</p> },
                    { id: 'controlled-b', label: 'Sicherheit', content: <p className="text-sm text-[var(--color-text-secondary)] py-4">{t('tabsPage.code.controlledDemoB')}</p> },
                    { id: 'controlled-c', label: 'Abrechnung', content: <p className="text-sm text-[var(--color-text-secondary)] py-4">{t('tabsPage.code.controlledDemoC')}</p> },
                  ]}
                />
              </div>
              <CodeBlock language="jsx">{CONTROLLED_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('tabsPage.code.pillTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('tabsPage.code.pillDesc')}
              </p>
              <CodeBlock language="jsx">{PILL_CODE}</CodeBlock>
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
          <Section title={t('tabsPage.a11y.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('tabsPage.a11y.intro')}
              </p>
            </Content>
          </Section>

          <Section title={t('tabsPage.a11y.keyboardTitle')}>
            <div className="border border-[var(--border-subtle-100)] rounded-[var(--radius-lg)] overflow-hidden mb-[var(--space-6)]">
              {['k1', 'k2', 'k3', 'k4'].map((k, i) => (
                <div key={k} className={`flex items-center gap-[var(--space-4)] px-[var(--space-4)] py-[var(--space-3)] ${i % 2 === 0 ? 'bg-[var(--surface_100)]' : 'bg-[var(--surface_200)]'}`}>
                  <span className="text-sm text-[var(--color-text-secondary)]">{t(`tabsPage.a11y.${k}`)}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)]">
              {[
                { title: t('tabsPage.a11y.rolesTitle'),  body: t('tabsPage.a11y.rolesBody') },
                { title: t('tabsPage.a11y.ariaTitle'),   body: t('tabsPage.a11y.ariaBody') },
                { title: t('tabsPage.a11y.focusTitle'),  body: t('tabsPage.a11y.focusBody') },
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
      title="Tabs"
      description={t('tabsPage.page.description')}
      tabs={tabs}
    />
  )
}
