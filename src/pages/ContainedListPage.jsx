import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { ContainedList } from '../components'

const NAV_CODE = `import { ContainedList } from '@/components'

{/* navigation führt weiter — rechts steht ein Chevron */}
<ContainedList
  title="Einstellungen"
  ariaLabel="Einstellungen"
  onSelect={(value) => oeffne(value)}
  items={[
    { value: 'profil', icon: 'badge', label: 'Profil', description: 'Name, Foto, Schwerpunkte' },
    { value: 'sicherheit', icon: 'lock', label: 'Sicherheit', meta: '2FA aktiv' },
    { value: 'export', icon: 'download', label: 'Daten exportieren', disabled: true },
  ]}
/>`

const SELECT_CODE = `{/* multiple wählt aus — links steht ein Kontrollkästchen */}
<ContainedList
  mode="multiple"
  ariaLabel="Mitglieder"
  value={gewaehlt}
  onChange={setGewaehlt}
  count={gewaehlt.length}
  items={[
    { value: 'mh', avatar: 'MH', label: 'Dr. Marie Hoffmann', description: 'Gewerbe · Karlsruhe', meta: '12' },
    { value: 'ts', avatar: 'TS', label: 'Tobias Schuster', description: 'Vorsorge · Bruchsal', meta: '8' },
  ]}
/>

{/* single setzt ein Radio-Feld und meldet einen einzelnen Wert */}
<ContainedList mode="single" defaultValue="standard" onChange={(v) => setModus(v)} items={items} />`

const GROUPS_CODE = `{/* groups statt items — die Überschriften bleiben beim Scrollen oben stehen */}
<ContainedList
  ariaLabel="Kontakte"
  onSelect={(value) => oeffne(value)}
  groups={[
    { label: 'A', items: [{ value: 'ab', avatar: 'AB', label: 'Anna Berg' }] },
    { label: 'H', items: [{ value: 'mh', avatar: 'MH', label: 'Dr. Marie Hoffmann' }] },
  ]}
/>`

const ACTION_CODE = `{/* Eine Zeilenaktion ersetzt das Chevron und öffnet die Zeile nicht */}
<ContainedList
  ariaLabel="Dokumente"
  onSelect={(value) => oeffne(value)}
  onAction={(value) => zeigeMenue(value)}
  items={[
    { value: 'q1', icon: 'description', label: 'Quartalsbericht.pdf', meta: '2,4 MB',
      action: 'more_vert', actionLabel: 'Weitere Aktionen' },
  ]}
/>

{/* Leere Liste: emptyText erklärt, was hier entstehen wird */}
<ContainedList items={[]} emptyText="Noch keine Dokumente abgelegt." />`

export default function ContainedListPage() {
  const { t } = useTranslation()

  const navItems = [
    { value: 'profil', icon: 'badge', label: t('containedList.demo.n1'), description: t('containedList.demo.n1Desc') },
    { value: 'sicherheit', icon: 'lock', label: t('containedList.demo.n2'), description: t('containedList.demo.n2Desc'), meta: '2FA' },
    { value: 'benachrichtigungen', icon: 'notifications', label: t('containedList.demo.n3'), description: t('containedList.demo.n3Desc') },
    { value: 'export', icon: 'download', label: t('containedList.demo.n4'), description: t('containedList.demo.n4Desc'), disabled: true },
  ]

  const peopleItems = [
    { value: 'mh', avatar: 'MH', label: 'Dr. Marie Hoffmann', description: t('containedList.demo.p1Desc'), meta: '12' },
    { value: 'ts', avatar: 'TS', label: 'Tobias Schuster', description: t('containedList.demo.p2Desc'), meta: '8' },
    { value: 'lk', avatar: 'LK', label: 'Lena Krüger', description: t('containedList.demo.p3Desc'), meta: '5' },
  ]

  const modeItems = [
    { value: 'standard', icon: 'schedule', label: t('containedList.demo.m1'), description: t('containedList.demo.m1Desc') },
    { value: 'express', icon: 'bolt', label: t('containedList.demo.m2'), description: t('containedList.demo.m2Desc') },
    { value: 'termin', icon: 'event', label: t('containedList.demo.m3'), description: t('containedList.demo.m3Desc') },
  ]

  const groups = [
    { label: 'B', items: [{ value: 'ab', avatar: 'AB', label: 'Anna Berg', meta: '04.08.2026' }] },
    {
      label: 'H',
      items: [
        { value: 'mh', avatar: 'MH', label: 'Dr. Marie Hoffmann', meta: '02.08.2026' },
        { value: 'jh', avatar: 'JH', label: 'Jonas Held', meta: '28.07.2026' },
      ],
    },
    { label: 'K', items: [{ value: 'lk', avatar: 'LK', label: 'Lena Krüger', meta: '21.07.2026' }] },
  ]

  const docItems = [
    { value: 'q1', icon: 'description', label: t('containedList.demo.d1'), meta: '2,4 MB', action: 'more_vert', actionLabel: t('containedList.demo.actionLabel') },
    { value: 'bild', icon: 'image', label: t('containedList.demo.d2'), meta: '840 KB', action: 'more_vert', actionLabel: t('containedList.demo.actionLabel') },
    { value: 'umsatz', icon: 'table_chart', label: t('containedList.demo.d3'), meta: '1,1 MB', action: 'more_vert', actionLabel: t('containedList.demo.actionLabel') },
  ]

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={(values) => {
              const source = values.avatare ? peopleItems : navItems
              const items = source.map((it) => ({
                ...it,
                description: values.beschreibung ? it.description : undefined,
                meta: values.meta ? it.meta : undefined,
                action: values.aktion ? 'more_vert' : undefined,
                actionLabel: values.aktion ? t('containedList.demo.actionLabel') : undefined,
                chevron: values.chevron,
              }))
              const shown = values.leer
                ? 0
                : values.gruppen
                  ? groups.reduce((sum, g) => sum + g.items.length, 0)
                  : items.length
              return (
                <div className="w-full max-w-[520px]">
                  {/* key resets the internal selection when the mode switches between
                      a single value and an array */}
                  <ContainedList
                    key={values.mode}
                    mode={values.mode}
                    size={values.size}
                    items={values.gruppen || values.leer ? [] : items}
                    groups={values.gruppen && !values.leer ? groups : undefined}
                    title={values.kopfzeile ? t('containedList.demo.title') : undefined}
                    count={values.kopfzeile ? shown : undefined}
                    emptyText={t('containedList.demo.empty')}
                    ariaLabel={t('containedList.demo.title')}
                    defaultValue={values.mode === 'multiple' ? ['sicherheit'] : 'sicherheit'}
                  />
                </div>
              )
            }}
            controls={[
              { id: 'mode', type: 'dropdown', label: 'Mode', options: ['navigation', 'single', 'multiple'], default: 'navigation' },
              { id: 'size', type: 'dropdown', label: 'Size', options: ['sm', 'md'], default: 'md' },
              { id: 'kopfzeile', type: 'toggle', label: 'Kopfzeile', default: true },
              { id: 'avatare', type: 'toggle', label: 'Avatare', default: false },
              { id: 'beschreibung', type: 'toggle', label: 'Beschreibung', default: true },
              { id: 'meta', type: 'toggle', label: 'Meta', default: true },
              { id: 'aktion', type: 'toggle', label: 'Zeilenaktion', default: false },
              { id: 'chevron', type: 'toggle', label: 'Chevron', default: true },
              { id: 'gruppen', type: 'toggle', label: 'Gruppen', default: false },
              { id: 'leer', type: 'toggle', label: 'Leer', default: false },
            ]}
          />

          <Section title={t('containedList.overview.modesTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('containedList.overview.modesBody')}
              </p>
              <div className="grid grid-cols-3 max-[1024px]:grid-cols-1 gap-[var(--medo-space-lg)]">
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    {t('containedList.modes.navigation')}
                  </p>
                  <ContainedList ariaLabel={t('containedList.demo.title')} items={navItems} />
                </div>
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    {t('containedList.modes.single')}
                  </p>
                  <ContainedList mode="single" defaultValue="standard" ariaLabel={t('containedList.demo.modeLabel')} items={modeItems} />
                </div>
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    {t('containedList.modes.multiple')}
                  </p>
                  <ContainedList mode="multiple" defaultValue={['mh', 'lk']} ariaLabel={t('containedList.demo.membersLabel')} items={peopleItems} />
                </div>
              </div>
            </Content>
          </Section>

          <Section title={t('containedList.overview.rowTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-md)]">
                {t('containedList.overview.rowBody')}
              </p>
              <ul className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                <li>{t('containedList.overview.row1')}</li>
                <li>{t('containedList.overview.row2')}</li>
                <li>{t('containedList.overview.row3')}</li>
                <li>{t('containedList.overview.row4')}</li>
              </ul>
              <div className="max-w-[520px]">
                <ContainedList
                  title={t('containedList.demo.docsTitle')}
                  count={docItems.length}
                  ariaLabel={t('containedList.demo.docsTitle')}
                  items={docItems}
                />
              </div>
            </Content>
          </Section>

          <Section title={t('containedList.overview.groupsTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('containedList.overview.groupsBody')}
              </p>
              <div className="max-w-[520px] max-h-[280px] overflow-y-auto">
                <ContainedList ariaLabel={t('containedList.demo.contactsLabel')} groups={groups} />
              </div>
            </Content>
          </Section>

          <Section title={t('containedList.overview.sizesTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('containedList.overview.sizesBody')}
              </p>
              <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--medo-space-lg)]">
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    sm
                  </p>
                  <ContainedList size="sm" ariaLabel={t('containedList.demo.title')} items={navItems} />
                </div>
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    md
                  </p>
                  <ContainedList ariaLabel={t('containedList.demo.title')} items={navItems} />
                </div>
              </div>
            </Content>
          </Section>

          <Section title={t('containedList.overview.emptyTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('containedList.overview.emptyBody')}
              </p>
              <div className="max-w-[520px]">
                <ContainedList
                  title={t('containedList.demo.docsTitle')}
                  count={0}
                  items={[]}
                  emptyText={t('containedList.demo.empty')}
                />
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
          <Section title={t('containedList.usage.whenTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('containedList.usage.whenBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('containedList.usage.oneModeTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('containedList.usage.oneModeBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('containedList.usage.actionTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('containedList.usage.actionBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('containedList.usage.emptyTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('containedList.usage.emptyBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('containedList.usage.doDontTitle')}>
            <Content>
              <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--medo-space-lg)]">
                <div className="border border-[var(--medo-border-subtle)] border-t-[3px] border-t-[var(--medo-success-solid)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-success-text)] mb-[var(--medo-space-sm)]">
                    {t('containedList.usage.doTitle')}
                  </p>
                  <ul className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                    <li>{t('containedList.usage.do1')}</li>
                    <li>{t('containedList.usage.do2')}</li>
                    <li>{t('containedList.usage.do3')}</li>
                  </ul>
                </div>
                <div className="border border-[var(--medo-border-subtle)] border-t-[3px] border-t-[var(--medo-error-solid)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-error-text)] mb-[var(--medo-space-sm)]">
                    {t('containedList.usage.dontTitle')}
                  </p>
                  <ul className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                    <li>{t('containedList.usage.dont1')}</li>
                    <li>{t('containedList.usage.dont2')}</li>
                    <li>{t('containedList.usage.dont3')}</li>
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
        <Section title={t('containedList.code.title')}>
          <Content>
            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)]">
              {t('containedList.code.navTitle')}
            </p>
            <CodeBlock language="jsx">{NAV_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('containedList.code.selectTitle')}
            </p>
            <CodeBlock language="jsx">{SELECT_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('containedList.code.groupsTitle')}
            </p>
            <CodeBlock language="jsx">{GROUPS_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('containedList.code.actionTitle')}
            </p>
            <CodeBlock language="jsx">{ACTION_CODE}</CodeBlock>
          </Content>
        </Section>
      ),
    },
    {
      id: 'accessibility',
      label: t('tabs.accessibility'),
      content: (
        <>
          <Section title={t('containedList.a11y.rolesTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('containedList.a11y.rolesBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('containedList.a11y.keyboardTitle')}>
            <Content>
              <ul className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                <li>{t('containedList.a11y.key1')}</li>
                <li>{t('containedList.a11y.key2')}</li>
                <li>{t('containedList.a11y.key3')}</li>
                <li>{t('containedList.a11y.key4')}</li>
              </ul>
            </Content>
          </Section>
          <Section title={t('containedList.a11y.actionTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('containedList.a11y.actionBody')}
              </p>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title={t('containedList.page.title')}
      description={t('containedList.page.description')}
      tabs={tabs}
    />
  )
}
