import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel, GridWrapper } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Search } from '../components'

const BASIC_CODE = `import { Search } from '@/components'

<Search
  label="Patientensuche"
  placeholder="Name oder Versichertennummer"
  onSearch={(query) => ladeTreffer(query)}
/>`

const SUGGEST_CODE = `{/* Vorschläge heben den Treffer hervor, letzte Suchen erscheinen nur im leeren Feld */}
<Search
  label="Patientensuche"
  suggestions={['Berg, Anna', 'Bergmann, Tom']}
  recent={['Laborbefunde', 'Offene Rechnungen']}
  onRemoveRecent={(item) => entferneAusVerlauf(item)}
  onSelect={(item) => oeffne(item)}
/>`

const COMPACT_CODE = `{/* Flache Variante für Werkzeugleisten, 34px hoch */}
<Search compact placeholder="Liste filtern" showPanel={false} />`

const STATE_CODE = `<Search label="Patientensuche" loading />
<Search label="Patientensuche" disabled />
<Search label="Patientensuche" defaultValue="xyz" suggestions={[]} defaultOpen
        emptyText="Prüfen Sie die Schreibweise oder suchen Sie nach der Versichertennummer." />`

const RECENT = ['Laborbefunde', 'Offene Rechnungen', 'Terminübersicht']
const SUGGESTIONS = ['Berg, Anna', 'Bergmann, Tom', 'Berger, Lena']

export default function SearchPage() {
  const { t } = useTranslation()

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={(values) => (
              <div className="w-full max-w-[380px]">
                <Search
                  label={values.compact ? undefined : t('searchField.demo.label')}
                  placeholder={t('searchField.demo.placeholder')}
                  size={values.size}
                  compact={values.compact}
                  loading={values.loading}
                  disabled={values.disabled}
                  showPanel={values.showPanel}
                  defaultOpen={values.defaultOpen}
                  suggestions={values.suggestions ? SUGGESTIONS : []}
                  recent={values.recent ? RECENT : []}
                  onRemoveRecent={values.removable ? () => {} : undefined}
                  hint={values.message === 'hint' ? t('searchField.demo.hint') : undefined}
                  error={values.message === 'error' ? t('searchField.demo.error') : undefined}
                  fullWidth={values.fullWidth}
                  defaultValue={values.filled ? 'Berg' : ''}
                />
              </div>
            )}
            controls={[
              { id: 'size', type: 'dropdown', label: 'Size', options: ['sm', 'md', 'lg'], default: 'md' },
              { id: 'message', type: 'dropdown', label: 'Message', options: ['keine', 'hint', 'error'], default: 'hint' },
              { id: 'compact', type: 'toggle', label: 'Compact', default: false },
              { id: 'filled', type: 'toggle', label: 'Gefüllt', default: false },
              { id: 'suggestions', type: 'toggle', label: 'Suggestions', default: true },
              { id: 'recent', type: 'toggle', label: 'Recent', default: true },
              { id: 'removable', type: 'toggle', label: 'Verlauf entfernbar', default: false },
              { id: 'showPanel', type: 'toggle', label: 'Show Panel', default: true },
              { id: 'defaultOpen', type: 'toggle', label: 'Default Open', default: false },
              { id: 'loading', type: 'toggle', label: 'Loading', default: false },
              { id: 'disabled', type: 'toggle', label: 'Disabled', default: false },
              { id: 'fullWidth', type: 'toggle', label: 'Full Width', default: false },
            ]}
          />

          <Section title={t('searchField.overview.anatomyTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-md)]">
                {t('searchField.overview.anatomyBody')}
              </p>
              <ul className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                <li>{t('searchField.overview.an1')}</li>
                <li>{t('searchField.overview.an2')}</li>
                <li>{t('searchField.overview.an3')}</li>
                <li>{t('searchField.overview.an4')}</li>
              </ul>
              <div className="max-w-[380px]">
                <Search
                  label={t('searchField.anatomy.label')}
                  defaultValue="Berg"
                  suggestions={SUGGESTIONS}
                  hint={t('searchField.anatomy.hint')}
                  showPanel={false}
                />
              </div>
            </Content>
          </Section>

          <Section title={t('searchField.overview.panelTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('searchField.overview.panelBody')}
              </p>
              <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--medo-space-lg)] pb-[240px]">
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    {t('searchField.panel.recent')}
                  </p>
                  <Search label={t('searchField.anatomy.label')} recent={RECENT} onRemoveRecent={() => {}} defaultOpen />
                </div>
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    {t('searchField.panel.suggestions')}
                  </p>
                  <Search label={t('searchField.anatomy.label')} defaultValue="Berg" suggestions={SUGGESTIONS} defaultOpen />
                </div>
              </div>
            </Content>
          </Section>

          <Section title={t('searchField.overview.emptyTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('searchField.overview.emptyBody')}
              </p>
              <div className="max-w-[380px] pb-[200px]">
                <Search
                  label={t('searchField.anatomy.label')}
                  defaultValue="Bergg"
                  suggestions={[]}
                  emptyText={t('searchField.empty.text')}
                  defaultOpen
                />
              </div>
            </Content>
          </Section>

          <Section title={t('searchField.overview.sizesTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('searchField.overview.sizesBody')}
              </p>
              <div className="flex flex-col gap-[var(--medo-space-md)] max-w-[380px]">
                <Search size="sm" label="sm · 36 px" showPanel={false} />
                <Search size="md" label="md · 40 px" showPanel={false} />
                <Search size="lg" label="lg · 48 px" showPanel={false} />
              </div>
            </Content>
          </Section>

          <Section title={t('searchField.overview.compactTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('searchField.overview.compactBody')}
              </p>
              <div className="max-w-[280px]">
                <Search compact placeholder={t('searchField.compact.placeholder')} showPanel={false} />
              </div>
            </Content>
          </Section>

          <Section title={t('searchField.overview.statesTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('searchField.overview.statesBody')}
              </p>
              <GridWrapper>
                <Search label={t('searchField.states.default')} showPanel={false} />
                <Search label={t('searchField.states.filled')} defaultValue="Berg, Anna" showPanel={false} />
                <Search label={t('searchField.states.loading')} defaultValue="Berg" loading showPanel={false} />
                <Search label={t('searchField.states.disabled')} defaultValue="Berg" disabled showPanel={false} />
                <Search label={t('searchField.states.error')} defaultValue="?" error={t('searchField.demo.error')} showPanel={false} />
                <Search label={t('searchField.states.hint')} hint={t('searchField.demo.hint')} showPanel={false} />
              </GridWrapper>
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
          <Section title={t('searchField.usage.whenTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('searchField.usage.whenBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('searchField.usage.debounceTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('searchField.usage.debounceBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('searchField.usage.panelTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('searchField.usage.panelBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('searchField.usage.emptyTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('searchField.usage.emptyBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('searchField.usage.doDontTitle')}>
            <Content>
              <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--medo-space-lg)]">
                <div className="border border-[var(--medo-border-subtle)] border-t-[3px] border-t-[var(--medo-success-solid)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-success-text)] mb-[var(--medo-space-sm)]">
                    {t('searchField.usage.doTitle')}
                  </p>
                  <ul className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                    <li>{t('searchField.usage.do1')}</li>
                    <li>{t('searchField.usage.do2')}</li>
                    <li>{t('searchField.usage.do3')}</li>
                  </ul>
                </div>
                <div className="border border-[var(--medo-border-subtle)] border-t-[3px] border-t-[var(--medo-error-solid)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-error-text)] mb-[var(--medo-space-sm)]">
                    {t('searchField.usage.dontTitle')}
                  </p>
                  <ul className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                    <li>{t('searchField.usage.dont1')}</li>
                    <li>{t('searchField.usage.dont2')}</li>
                    <li>{t('searchField.usage.dont3')}</li>
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
        <Section title={t('searchField.code.title')}>
          <Content>
            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)]">
              {t('searchField.code.basicTitle')}
            </p>
            <CodeBlock language="jsx">{BASIC_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('searchField.code.suggestTitle')}
            </p>
            <CodeBlock language="jsx">{SUGGEST_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('searchField.code.compactTitle')}
            </p>
            <CodeBlock language="jsx">{COMPACT_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('searchField.code.stateTitle')}
            </p>
            <CodeBlock language="jsx">{STATE_CODE}</CodeBlock>
          </Content>
        </Section>
      ),
    },
    {
      id: 'accessibility',
      label: t('tabs.accessibility'),
      content: (
        <>
          <Section title={t('searchField.a11y.roleTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('searchField.a11y.roleBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('searchField.a11y.keyboardTitle')}>
            <Content>
              <ul className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                <li>{t('searchField.a11y.key1')}</li>
                <li>{t('searchField.a11y.key2')}</li>
                <li>{t('searchField.a11y.key3')}</li>
              </ul>
            </Content>
          </Section>
          <Section title={t('searchField.a11y.iconTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('searchField.a11y.iconBody')}
              </p>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title={t('searchField.page.title')}
      description={t('searchField.page.description')}
      tabs={tabs}
    />
  )
}
