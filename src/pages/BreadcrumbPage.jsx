import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Breadcrumb } from '../components'

const BASIC_CODE = `import { Breadcrumb } from '@/components'

{/* Die letzte Stufe ist die aktuelle Seite — kein Link, mit aria-current="page" */}
<Breadcrumb
  items={[
    { label: 'Start', href: '/' },
    { label: 'Verträge', href: '/vertraege' },
    { label: 'VN-2026-0184' },
  ]}
/>`

const COLLAPSE_CODE = `{/* Ab maxItems klappt die Mitte in ein …-Menü:
    erste Stufe, „…", die letzten zwei Stufen */}
<Breadcrumb
  homeIcon
  maxItems={4}
  items={[
    { label: 'Start', href: '/' },
    { label: 'Netzwerk', href: '/netzwerk' },
    { label: 'Spezialisten', href: '/netzwerk/spezialisten' },
    { label: 'Baden-Württemberg', href: '/netzwerk/spezialisten/bw' },
    { label: 'Dr. Marie Hoffmann' },
  ]}
/>`

const CLICK_CODE = `{/* Ohne href wird ein Button gerendert — für Router ohne echte Adressen */}
<Breadcrumb
  size="md"
  items={[
    { label: 'Start', onClick: () => go('/') },
    { label: 'Verträge', onClick: () => go('/vertraege') },
    { label: 'VN-2026-0184' },
  ]}
/>`

const ICON_CODE = `{/* homeIcon ersetzt das Label der ersten Stufe durch das Haus-Icon.
    Einzelne Stufen können ein eigenes Icon tragen. */}
<Breadcrumb
  homeIcon
  ariaLabel="Pfad zur aktuellen Seite"
  items={[
    { label: 'Start', href: '/' },
    { label: 'Praxis', href: '/praxis', icon: 'local_hospital' },
    { label: 'Team' },
  ]}
/>`

export default function BreadcrumbPage() {
  const { t } = useTranslation()

  const short = [
    { label: t('breadcrumb.demo.start'), href: '#' },
    { label: t('breadcrumb.demo.vertraege'), href: '#' },
    { label: 'VN-2026-0184' },
  ]

  const deep = [
    { label: t('breadcrumb.demo.start'), href: '#' },
    { label: t('breadcrumb.demo.netzwerk'), href: '#' },
    { label: t('breadcrumb.demo.spezialisten'), href: '#' },
    { label: t('breadcrumb.demo.bw'), href: '#' },
    { label: 'Dr. Marie Hoffmann' },
  ]

  const withIcons = [
    { label: t('breadcrumb.demo.start'), href: '#' },
    { label: t('breadcrumb.demo.praxis'), href: '#', icon: 'local_hospital' },
    { label: t('breadcrumb.demo.team') },
  ]

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={(values) => (
              <div className="w-full max-w-[620px]">
                <Breadcrumb
                  items={values.tief ? deep : values.icons ? withIcons : short}
                  size={values.size}
                  maxItems={values.kollabieren ? Number(values.maxItems) : 0}
                  homeIcon={values.homeIcon}
                  ariaLabel={t('breadcrumb.demo.ariaLabel')}
                />
              </div>
            )}
            controls={[
              { id: 'size', type: 'dropdown', label: 'Size', options: ['sm', 'md'], default: 'sm' },
              { id: 'maxItems', type: 'dropdown', label: 'Max Items', options: ['3', '4', '5'], default: '4' },
              { id: 'tief', type: 'toggle', label: 'Fünf Ebenen', default: true },
              { id: 'kollabieren', type: 'toggle', label: 'Kollabieren', default: true },
              { id: 'homeIcon', type: 'toggle', label: 'Home Icon', default: false },
              { id: 'icons', type: 'toggle', label: 'Stufen-Icons', default: false },
            ]}
          />

          <Section title={t('breadcrumb.overview.anatomyTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-md)]">
                {t('breadcrumb.overview.anatomyBody')}
              </p>
              <ul className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                <li>{t('breadcrumb.overview.an1')}</li>
                <li>{t('breadcrumb.overview.an2')}</li>
                <li>{t('breadcrumb.overview.an3')}</li>
              </ul>
              <Breadcrumb items={short} ariaLabel={t('breadcrumb.demo.ariaLabel')} />
            </Content>
          </Section>

          <Section title={t('breadcrumb.overview.collapseTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('breadcrumb.overview.collapseBody')}
              </p>
              <div className="flex flex-col gap-[var(--medo-space-lg)] pb-[var(--medo-space-3xl)]">
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    {t('breadcrumb.collapse.off')}
                  </p>
                  <Breadcrumb items={deep} ariaLabel={t('breadcrumb.demo.ariaLabel')} />
                </div>
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    {t('breadcrumb.collapse.on')}
                  </p>
                  <Breadcrumb items={deep} maxItems={4} ariaLabel={t('breadcrumb.demo.ariaLabel')} />
                </div>
              </div>
            </Content>
          </Section>

          <Section title={t('breadcrumb.overview.iconTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('breadcrumb.overview.iconBody')}
              </p>
              <div className="flex flex-col gap-[var(--medo-space-md)]">
                <Breadcrumb homeIcon items={short} ariaLabel={t('breadcrumb.demo.ariaLabel')} />
                <Breadcrumb items={withIcons} ariaLabel={t('breadcrumb.demo.ariaLabel')} />
              </div>
            </Content>
          </Section>

          <Section title={t('breadcrumb.overview.sizesTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('breadcrumb.overview.sizesBody')}
              </p>
              <div className="flex flex-col gap-[var(--medo-space-md)]">
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    sm · 14 px
                  </p>
                  <Breadcrumb size="sm" items={short} ariaLabel={t('breadcrumb.demo.ariaLabel')} />
                </div>
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    md · 16 px
                  </p>
                  <Breadcrumb size="md" items={short} ariaLabel={t('breadcrumb.demo.ariaLabel')} />
                </div>
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
          <Section title={t('breadcrumb.usage.whenTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('breadcrumb.usage.whenBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('breadcrumb.usage.labelTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('breadcrumb.usage.labelBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('breadcrumb.usage.collapseTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('breadcrumb.usage.collapseBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('breadcrumb.usage.currentTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('breadcrumb.usage.currentBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('breadcrumb.usage.doDontTitle')}>
            <Content>
              <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--medo-space-lg)]">
                <div className="border border-[var(--medo-border-subtle)] border-t-[3px] border-t-[var(--medo-success-solid)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-success-text)] mb-[var(--medo-space-sm)]">
                    {t('breadcrumb.usage.doTitle')}
                  </p>
                  <ul className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                    <li>{t('breadcrumb.usage.do1')}</li>
                    <li>{t('breadcrumb.usage.do2')}</li>
                    <li>{t('breadcrumb.usage.do3')}</li>
                  </ul>
                </div>
                <div className="border border-[var(--medo-border-subtle)] border-t-[3px] border-t-[var(--medo-error-solid)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-error-text)] mb-[var(--medo-space-sm)]">
                    {t('breadcrumb.usage.dontTitle')}
                  </p>
                  <ul className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                    <li>{t('breadcrumb.usage.dont1')}</li>
                    <li>{t('breadcrumb.usage.dont2')}</li>
                    <li>{t('breadcrumb.usage.dont3')}</li>
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
        <Section title={t('breadcrumb.code.title')}>
          <Content>
            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)]">
              {t('breadcrumb.code.basicTitle')}
            </p>
            <CodeBlock language="jsx">{BASIC_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('breadcrumb.code.collapseTitle')}
            </p>
            <CodeBlock language="jsx">{COLLAPSE_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('breadcrumb.code.clickTitle')}
            </p>
            <CodeBlock language="jsx">{CLICK_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('breadcrumb.code.iconTitle')}
            </p>
            <CodeBlock language="jsx">{ICON_CODE}</CodeBlock>
          </Content>
        </Section>
      ),
    },
    {
      id: 'accessibility',
      label: t('tabs.accessibility'),
      content: (
        <>
          <Section title={t('breadcrumb.a11y.structureTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('breadcrumb.a11y.structureBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('breadcrumb.a11y.currentTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('breadcrumb.a11y.currentBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('breadcrumb.a11y.menuTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('breadcrumb.a11y.menuBody')}
              </p>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title={t('breadcrumb.page.title')}
      description={t('breadcrumb.page.description')}
      tabs={tabs}
    />
  )
}
