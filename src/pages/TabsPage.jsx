import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Tabs } from '../components'

const BASIC_CODE = `import { Tabs } from '@/components'

<Tabs
  ariaLabel="Profilbereiche"
  defaultValue="profil"
  items={[
    { value: 'profil', label: 'Profil', icon: 'person' },
    { value: 'netz', label: 'Netzwerk', icon: 'group', badge: 12 },
    { value: 'anfragen', label: 'Anfragen', icon: 'mail', badge: 3 },
    { value: 'archiv', label: 'Archiv', disabled: true },
  ]}
>
  <div style={{ marginTop: 22 }}>Inhalt des aktiven Tabs</div>
</Tabs>`

const CONTAINED_CODE = `{/* contained für Tabs innerhalb einer Karte oder neben einer Toolbar */}
<Tabs
  variant="contained"
  size="sm"
  items={[{ value: 'm', label: 'Monat' }, { value: 'j', label: 'Jahr' }]}
  value={zeitraum}
  onChange={setZeitraum}
/>`

const VERTICAL_CODE = `{/* Bei vielen Bereichen ist die vertikale Form die ruhigere Lösung */}
<Tabs orientation="vertical" ariaLabel="Einstellungen" items={items}>
  <div>Inhalt</div>
</Tabs>`

const SCROLL_CODE = `{/* Ab etwa sieben Tabs scrollable statt Umbruch */}
<Tabs scrollable items={vieleTabs} />

{/* fullWidth nur, wenn die Tabs eine Karte vollständig überspannen */}
<Tabs fullWidth items={[{ value: 'a', label: 'Übersicht' }, { value: 'b', label: 'Verlauf' }]} />`

export default function TabsPage() {
  const { t } = useTranslation()

  const items = [
    { value: 'profil', label: t('tabsPage.demo.profil'), icon: 'person' },
    { value: 'netz', label: t('tabsPage.demo.netz'), icon: 'group', badge: 12 },
    { value: 'anfragen', label: t('tabsPage.demo.anfragen'), icon: 'mail', badge: 3 },
    { value: 'archiv', label: t('tabsPage.demo.archiv'), disabled: true },
  ]

  const plain = items.map(({ icon, badge, ...rest }) => rest)

  const many = [
    { value: 'a', label: t('tabsPage.many.a') },
    { value: 'b', label: t('tabsPage.many.b') },
    { value: 'c', label: t('tabsPage.many.c') },
    { value: 'd', label: t('tabsPage.many.d') },
    { value: 'e', label: t('tabsPage.many.e') },
    { value: 'f', label: t('tabsPage.many.f') },
    { value: 'g', label: t('tabsPage.many.g') },
  ]

  const panelBox = (text) => (
    <div className="mt-[var(--medo-space-md)] p-[var(--medo-space-md)] rounded-[var(--medo-radius-md)] bg-[var(--medo-surface-container)] [font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)]">
      {text}
    </div>
  )

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={(values) => (
              <div className="w-full max-w-[620px]">
                <Tabs
                  items={
                    values.icons
                      ? values.badges
                        ? items
                        : items.map(({ badge, ...rest }) => rest)
                      : values.badges
                        ? items.map(({ icon, ...rest }) => rest)
                        : plain
                  }
                  variant={values.variant}
                  size={values.size}
                  orientation={values.orientation}
                  fullWidth={values.fullWidth}
                  scrollable={values.scrollable}
                  defaultValue="profil"
                  ariaLabel={t('tabsPage.demo.ariaLabel')}
                >
                  {values.panel ? panelBox(t('tabsPage.demo.panel')) : null}
                </Tabs>
              </div>
            )}
            controls={[
              { id: 'variant', type: 'dropdown', label: 'Variant', options: ['underline', 'contained'], default: 'underline' },
              { id: 'size', type: 'dropdown', label: 'Size', options: ['sm', 'md'], default: 'md' },
              { id: 'orientation', type: 'dropdown', label: 'Orientation', options: ['horizontal', 'vertical'], default: 'horizontal' },
              { id: 'icons', type: 'toggle', label: 'Icons', default: true },
              { id: 'badges', type: 'toggle', label: 'Badges', default: true },
              { id: 'panel', type: 'toggle', label: 'Panel', default: true },
              { id: 'fullWidth', type: 'toggle', label: 'Full Width', default: false },
              { id: 'scrollable', type: 'toggle', label: 'Scrollable', default: false },
            ]}
          />

          <Section title={t('tabsPage.overview.variantsTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('tabsPage.overview.variantsBody')}
              </p>
              <div className="flex flex-col gap-[var(--medo-space-xl)]">
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    underline
                  </p>
                  <Tabs items={items} defaultValue="profil" ariaLabel={t('tabsPage.demo.ariaLabel')} />
                </div>
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    contained
                  </p>
                  <Tabs variant="contained" items={plain} defaultValue="profil" ariaLabel={t('tabsPage.demo.ariaLabel')} />
                </div>
              </div>
            </Content>
          </Section>

          <Section title={t('tabsPage.overview.panelTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('tabsPage.overview.panelBody')}
              </p>
              <div className="max-w-[620px]">
                <Tabs items={items} defaultValue="profil" ariaLabel={t('tabsPage.demo.ariaLabel')}>
                  {panelBox(t('tabsPage.demo.panel'))}
                </Tabs>
              </div>
            </Content>
          </Section>

          <Section title={t('tabsPage.overview.verticalTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('tabsPage.overview.verticalBody')}
              </p>
              <div className="max-w-[620px]">
                <Tabs orientation="vertical" items={items} defaultValue="profil" ariaLabel={t('tabsPage.demo.ariaLabel')}>
                  <div className="p-[var(--medo-space-md)] rounded-[var(--medo-radius-md)] bg-[var(--medo-surface-container)] [font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)]">
                    {t('tabsPage.demo.panel')}
                  </div>
                </Tabs>
              </div>
            </Content>
          </Section>

          <Section title={t('tabsPage.overview.scrollTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('tabsPage.overview.scrollBody')}
              </p>
              <div className="max-w-[420px] border border-[var(--medo-border-subtle)] rounded-[var(--medo-radius-md)] px-[var(--medo-space-md)]">
                <Tabs scrollable items={many} defaultValue="a" ariaLabel={t('tabsPage.demo.ariaLabel')} />
              </div>
            </Content>
          </Section>

          <Section title={t('tabsPage.overview.fullWidthTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('tabsPage.overview.fullWidthBody')}
              </p>
              <div className="max-w-[420px] border border-[var(--medo-border)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-md)] bg-[var(--medo-surface)]">
                <Tabs
                  fullWidth
                  variant="contained"
                  items={[
                    { value: 'a', label: t('tabsPage.full.a') },
                    { value: 'b', label: t('tabsPage.full.b') },
                  ]}
                  defaultValue="a"
                  ariaLabel={t('tabsPage.demo.ariaLabel')}
                />
              </div>
            </Content>
          </Section>

          <Section title={t('tabsPage.overview.sizesTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('tabsPage.overview.sizesBody')}
              </p>
              <div className="flex flex-col gap-[var(--medo-space-lg)]">
                <Tabs size="sm" items={plain} defaultValue="profil" ariaLabel={t('tabsPage.demo.ariaLabel')} />
                <Tabs size="md" items={plain} defaultValue="profil" ariaLabel={t('tabsPage.demo.ariaLabel')} />
                <Tabs size="sm" variant="contained" items={plain} defaultValue="profil" ariaLabel={t('tabsPage.demo.ariaLabel')} />
                <Tabs size="md" variant="contained" items={plain} defaultValue="profil" ariaLabel={t('tabsPage.demo.ariaLabel')} />
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
          <Section title={t('tabsPage.usage.whenTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('tabsPage.usage.whenBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('tabsPage.usage.styleTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('tabsPage.usage.styleBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('tabsPage.usage.labelTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('tabsPage.usage.labelBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('tabsPage.usage.stateTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('tabsPage.usage.stateBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('tabsPage.usage.doDontTitle')}>
            <Content>
              <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--medo-space-lg)]">
                <div className="border border-[var(--medo-border-subtle)] border-t-[3px] border-t-[var(--medo-success-solid)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-success-text)] mb-[var(--medo-space-sm)]">
                    {t('tabsPage.usage.doTitle')}
                  </p>
                  <ul className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                    <li>{t('tabsPage.usage.do1')}</li>
                    <li>{t('tabsPage.usage.do2')}</li>
                    <li>{t('tabsPage.usage.do3')}</li>
                  </ul>
                </div>
                <div className="border border-[var(--medo-border-subtle)] border-t-[3px] border-t-[var(--medo-error-solid)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-error-text)] mb-[var(--medo-space-sm)]">
                    {t('tabsPage.usage.dontTitle')}
                  </p>
                  <ul className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                    <li>{t('tabsPage.usage.dont1')}</li>
                    <li>{t('tabsPage.usage.dont2')}</li>
                    <li>{t('tabsPage.usage.dont3')}</li>
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
        <Section title={t('tabsPage.code.title')}>
          <Content>
            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)]">
              {t('tabsPage.code.basicTitle')}
            </p>
            <CodeBlock language="jsx">{BASIC_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('tabsPage.code.containedTitle')}
            </p>
            <CodeBlock language="jsx">{CONTAINED_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('tabsPage.code.verticalTitle')}
            </p>
            <CodeBlock language="jsx">{VERTICAL_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('tabsPage.code.scrollTitle')}
            </p>
            <CodeBlock language="jsx">{SCROLL_CODE}</CodeBlock>
          </Content>
        </Section>
      ),
    },
    {
      id: 'accessibility',
      label: t('tabs.accessibility'),
      content: (
        <>
          <Section title={t('tabsPage.a11y.rolesTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('tabsPage.a11y.rolesBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('tabsPage.a11y.keyboardTitle')}>
            <Content>
              <ul className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                <li>{t('tabsPage.a11y.key1')}</li>
                <li>{t('tabsPage.a11y.key2')}</li>
                <li>{t('tabsPage.a11y.key3')}</li>
                <li>{t('tabsPage.a11y.key4')}</li>
              </ul>
            </Content>
          </Section>
          <Section title={t('tabsPage.a11y.badgeTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('tabsPage.a11y.badgeBody')}
              </p>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title={t('tabsPage.page.title')}
      description={t('tabsPage.page.description')}
      tabs={tabs}
    />
  )
}
