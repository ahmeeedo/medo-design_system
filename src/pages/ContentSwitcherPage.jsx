import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { ContentSwitcher } from '../components'

const BASIC_CODE = `import { ContentSwitcher } from '@/components'

{/* Schaltet sofort und speichert nichts */}
<ContentSwitcher
  ariaLabel="Ansicht"
  value={ansicht}
  onChange={setAnsicht}
  items={[
    { value: 'liste', label: 'Liste' },
    { value: 'raster', label: 'Raster' },
    { value: 'kanban', label: 'Kanban' },
  ]}
/>`

const ICON_CODE = `{/* iconOnly nur für allgemein bekannte Darstellungen.
    Das label wird zum aria-label und erscheint bei Hover oder Fokus als Hinweis —
    ein zusätzlicher Tooltip würde doppelt erscheinen. */}
<ContentSwitcher
  ariaLabel="Ansicht"
  iconOnly
  items={[
    { value: 'liste', label: 'Liste', icon: 'view_list' },
    { value: 'raster', label: 'Raster', icon: 'grid_view' },
    { value: 'kanban', label: 'Kanban', icon: 'view_kanban' },
  ]}
  value={ansicht}
  onChange={setAnsicht}
/>`

const OUTLINE_CODE = `{/* outline, wenn die Leiste auf einer bereits getönten Fläche liegt */}
<ContentSwitcher
  variant="outline"
  size="sm"
  defaultValue="monat"
  items={[
    { value: 'monat', label: 'Monat' },
    { value: 'quartal', label: 'Quartal' },
    { value: 'jahr', label: 'Jahr', disabled: true },
  ]}
/>`

const WIDTH_CODE = `{/* equalWidth ist Standard — ohne springt die Leiste beim Wechsel */}
<ContentSwitcher equalWidth={false} items={items} />

{/* fullWidth spannt die Leiste über die verfügbare Breite */}
<ContentSwitcher fullWidth items={items} />`

export default function ContentSwitcherPage() {
  const { t } = useTranslation()
  const [ansicht, setAnsicht] = useState('liste')

  const viewItems = [
    { value: 'liste', label: t('contentSwitcher.demo.liste'), icon: 'view_list' },
    { value: 'raster', label: t('contentSwitcher.demo.raster'), icon: 'grid_view' },
    { value: 'kanban', label: t('contentSwitcher.demo.kanban'), icon: 'view_kanban' },
  ]

  const periodItems = [
    { value: 'monat', label: t('contentSwitcher.demo.monat') },
    { value: 'quartal', label: t('contentSwitcher.demo.quartal') },
    { value: 'jahr', label: t('contentSwitcher.demo.jahr'), disabled: true },
  ]

  const unevenItems = [
    { value: 'a', label: t('contentSwitcher.uneven.a') },
    { value: 'b', label: t('contentSwitcher.uneven.b') },
    { value: 'c', label: t('contentSwitcher.uneven.c') },
  ]

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={(values) => (
              <div className="w-full max-w-[520px] flex justify-center">
                <ContentSwitcher
                  items={values.icons || values.iconOnly ? viewItems : periodItems}
                  variant={values.variant}
                  size={values.size}
                  iconOnly={values.iconOnly}
                  equalWidth={values.equalWidth}
                  fullWidth={values.fullWidth}
                  defaultValue={values.icons || values.iconOnly ? 'liste' : 'monat'}
                  ariaLabel={t('contentSwitcher.demo.ariaLabel')}
                />
              </div>
            )}
            controls={[
              { id: 'variant', type: 'dropdown', label: 'Variant', options: ['neutral', 'outline'], default: 'neutral' },
              { id: 'size', type: 'dropdown', label: 'Size', options: ['sm', 'md'], default: 'md' },
              { id: 'icons', type: 'toggle', label: 'Icons', default: true },
              { id: 'iconOnly', type: 'toggle', label: 'Icon Only', default: false },
              { id: 'equalWidth', type: 'toggle', label: 'Equal Width', default: true },
              { id: 'fullWidth', type: 'toggle', label: 'Full Width', default: false },
            ]}
          />

          <Section title={t('contentSwitcher.overview.variantsTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('contentSwitcher.overview.variantsBody')}
              </p>
              <div className="flex flex-col gap-[var(--medo-space-lg)]">
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    neutral
                  </p>
                  <ContentSwitcher items={periodItems} defaultValue="monat" ariaLabel={t('contentSwitcher.demo.periodLabel')} />
                </div>
                <div className="p-[var(--medo-space-md)] rounded-[var(--medo-radius-lg)] bg-[var(--medo-surface-container-high)] inline-block">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    outline
                  </p>
                  <ContentSwitcher variant="outline" items={periodItems} defaultValue="monat" ariaLabel={t('contentSwitcher.demo.periodLabel')} />
                </div>
              </div>
            </Content>
          </Section>

          <Section title={t('contentSwitcher.overview.iconTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('contentSwitcher.overview.iconBody')}
              </p>
              <div className="flex flex-wrap gap-[var(--medo-space-xl)] items-end">
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    {t('contentSwitcher.icon.withLabel')}
                  </p>
                  <ContentSwitcher items={viewItems} value={ansicht} onChange={setAnsicht} ariaLabel={t('contentSwitcher.demo.ariaLabel')} />
                </div>
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    {t('contentSwitcher.icon.iconOnly')}
                  </p>
                  <ContentSwitcher iconOnly items={viewItems} value={ansicht} onChange={setAnsicht} ariaLabel={t('contentSwitcher.demo.ariaLabel')} />
                </div>
              </div>
              <p className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] mt-[var(--medo-space-md)]">
                {t('contentSwitcher.icon.sharedState')}
              </p>
            </Content>
          </Section>

          <Section title={t('contentSwitcher.overview.widthTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('contentSwitcher.overview.widthBody')}
              </p>
              <div className="flex flex-col gap-[var(--medo-space-lg)] max-w-[520px]">
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    {t('contentSwitcher.width.equal')}
                  </p>
                  <ContentSwitcher items={unevenItems} defaultValue="a" ariaLabel={t('contentSwitcher.demo.ariaLabel')} />
                </div>
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    {t('contentSwitcher.width.uneven')}
                  </p>
                  <ContentSwitcher equalWidth={false} items={unevenItems} defaultValue="a" ariaLabel={t('contentSwitcher.demo.ariaLabel')} />
                </div>
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    {t('contentSwitcher.width.full')}
                  </p>
                  <ContentSwitcher fullWidth items={unevenItems} defaultValue="a" ariaLabel={t('contentSwitcher.demo.ariaLabel')} />
                </div>
              </div>
            </Content>
          </Section>

          <Section title={t('contentSwitcher.overview.sizesTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('contentSwitcher.overview.sizesBody')}
              </p>
              <div className="flex flex-wrap gap-[var(--medo-space-lg)] items-center">
                <ContentSwitcher size="sm" items={periodItems} defaultValue="monat" ariaLabel={t('contentSwitcher.demo.periodLabel')} />
                <ContentSwitcher size="md" items={periodItems} defaultValue="monat" ariaLabel={t('contentSwitcher.demo.periodLabel')} />
              </div>
            </Content>
          </Section>

          <Section title={t('contentSwitcher.overview.statesTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('contentSwitcher.overview.statesBody')}
              </p>
              <div className="flex flex-wrap gap-[var(--medo-space-lg)] items-center">
                <ContentSwitcher items={periodItems} defaultValue="monat" ariaLabel={t('contentSwitcher.demo.periodLabel')} />
                <ContentSwitcher variant="outline" items={periodItems} defaultValue="monat" ariaLabel={t('contentSwitcher.demo.periodLabel')} />
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
          <Section title={t('contentSwitcher.usage.whenTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('contentSwitcher.usage.whenBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('contentSwitcher.usage.countTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('contentSwitcher.usage.countBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('contentSwitcher.usage.labelTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('contentSwitcher.usage.labelBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('contentSwitcher.usage.widthTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('contentSwitcher.usage.widthBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('contentSwitcher.usage.doDontTitle')}>
            <Content>
              <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--medo-space-lg)]">
                <div className="border border-[var(--medo-border-subtle)] border-t-[3px] border-t-[var(--medo-success-solid)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-success-text)] mb-[var(--medo-space-sm)]">
                    {t('contentSwitcher.usage.doTitle')}
                  </p>
                  <ul className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                    <li>{t('contentSwitcher.usage.do1')}</li>
                    <li>{t('contentSwitcher.usage.do2')}</li>
                    <li>{t('contentSwitcher.usage.do3')}</li>
                  </ul>
                </div>
                <div className="border border-[var(--medo-border-subtle)] border-t-[3px] border-t-[var(--medo-error-solid)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-error-text)] mb-[var(--medo-space-sm)]">
                    {t('contentSwitcher.usage.dontTitle')}
                  </p>
                  <ul className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                    <li>{t('contentSwitcher.usage.dont1')}</li>
                    <li>{t('contentSwitcher.usage.dont2')}</li>
                    <li>{t('contentSwitcher.usage.dont3')}</li>
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
        <Section title={t('contentSwitcher.code.title')}>
          <Content>
            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)]">
              {t('contentSwitcher.code.basicTitle')}
            </p>
            <CodeBlock language="jsx">{BASIC_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('contentSwitcher.code.iconTitle')}
            </p>
            <CodeBlock language="jsx">{ICON_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('contentSwitcher.code.outlineTitle')}
            </p>
            <CodeBlock language="jsx">{OUTLINE_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('contentSwitcher.code.widthTitle')}
            </p>
            <CodeBlock language="jsx">{WIDTH_CODE}</CodeBlock>
          </Content>
        </Section>
      ),
    },
    {
      id: 'accessibility',
      label: t('tabs.accessibility'),
      content: (
        <>
          <Section title={t('contentSwitcher.a11y.rolesTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('contentSwitcher.a11y.rolesBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('contentSwitcher.a11y.keyboardTitle')}>
            <Content>
              <ul className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                <li>{t('contentSwitcher.a11y.key1')}</li>
                <li>{t('contentSwitcher.a11y.key2')}</li>
                <li>{t('contentSwitcher.a11y.key3')}</li>
              </ul>
            </Content>
          </Section>
          <Section title={t('contentSwitcher.a11y.iconOnlyTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('contentSwitcher.a11y.iconOnlyBody')}
              </p>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title={t('contentSwitcher.page.title')}
      description={t('contentSwitcher.page.description')}
      tabs={tabs}
    />
  )
}
