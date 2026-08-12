import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Menu } from '../components'

const PROSE = 'text-[var(--medo-text-muted)] [font-family:var(--medo-font-sans)] [font-size:var(--medo-text-base)] [line-height:var(--medo-leading-relaxed)]'
const CAPTION = '[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-xs)] text-[var(--medo-text-muted)]'
const LIST = `${PROSE} list-disc pl-[var(--medo-space-lg)] space-y-[var(--medo-space-3xs)]`
const AREA = 'mt-[var(--medo-space-md)] rounded-[var(--medo-radius-lg)] border border-dashed border-[var(--medo-border)] bg-[var(--medo-surface-container)] p-[var(--medo-space-xl)] [font-family:var(--medo-font-sans)] [font-size:var(--medo-text-sm)] text-[var(--medo-text-subtle)] select-none'

const BASIC_CODE = `import { Menu } from '@/components'

<Menu
  ariaLabel="Termin-Aktionen"
  items={[
    { value: 'open',   label: 'Termin öffnen', icon: 'open_in_new' },
    { value: 'move',   label: 'Termin verschieben', icon: 'event_repeat' },
    { type: 'divider' },
    { value: 'delete', label: 'Termin absagen', icon: 'delete', danger: true },
  ]}
  onSelect={value => handle(value)}
>
  <TerminZeile />
</Menu>`

const DISABLED_CODE = `{/* disabled laesst das Browser-Kontextmenue wieder zu */}
<Menu disabled items={items}>
  <p>Hier gilt das Menü des Browsers.</p>
</Menu>`

const menuItems = t => [
  { value: 'open', label: t('menu.demo.items.open'), icon: 'open_in_new' },
  { value: 'move', label: t('menu.demo.items.move'), icon: 'event_repeat', shortcut: 'Strg+M' },
  { value: 'copy', label: t('menu.demo.items.copy'), icon: 'content_copy', shortcut: 'Strg+C' },
  { type: 'divider' },
  { value: 'delete', label: t('menu.demo.items.delete'), icon: 'delete', danger: true },
]

function SelectionDemo() {
  const { t } = useTranslation()
  const [last, setLast] = useState(null)

  return (
    <div>
      <Menu ariaLabel={t('menu.demo.ariaLabel')} items={menuItems(t)} onSelect={value => setLast(value)}>
        <div className={AREA}>{t('menu.demo.areaHint')}</div>
      </Menu>
      <p className={`${CAPTION} mt-[var(--medo-space-sm)]`}>
        {last ? t('menu.demo.lastAction', { value: t(`menu.demo.items.${last}`) }) : t('menu.demo.noAction')}
      </p>
    </div>
  )
}

export default function MenuPage() {
  const { t } = useTranslation()

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={values => (
              <Menu
                disabled={values.disabled}
                ariaLabel={t('menu.demo.ariaLabel')}
                items={
                  values.submenu
                    ? [
                        ...menuItems(t).slice(0, 3),
                        {
                          value: 'export',
                          label: t('menu.demo.items.export'),
                          icon: 'download',
                          items: [
                            { value: 'pdf', label: t('menu.demo.items.pdf') },
                            { value: 'csv', label: t('menu.demo.items.csv') },
                          ],
                        },
                      ]
                    : menuItems(t)
                }
              >
                <div className={`${AREA} w-full max-w-[420px] text-center`}>
                  {values.disabled ? t('menu.demo.areaDisabled') : t('menu.demo.areaHint')}
                </div>
              </Menu>
            )}
            controls={[
              { id: 'submenu', type: 'toggle', label: t('menu.controls.submenu'), default: false },
              { id: 'disabled', type: 'toggle', label: t('menu.controls.disabled'), default: false },
            ]}
          />

          <Section title={t('menu.overview.basicTitle')}>
            <Content>
              <p className={PROSE}>{t('menu.overview.basicBody')}</p>
              <SelectionDemo />
            </Content>
          </Section>

          <Section title={t('menu.overview.flipTitle')}>
            <Content>
              <p className={PROSE}>{t('menu.overview.flipBody')}</p>
              <div className="mt-[var(--medo-space-md)] flex justify-end">
                <Menu ariaLabel={t('menu.demo.ariaLabel')} items={menuItems(t)}>
                  <div className={`${AREA} w-[240px] text-center`}>{t('menu.demo.areaEdge')}</div>
                </Menu>
              </div>
            </Content>
          </Section>

          <Section title={t('menu.overview.entriesTitle')}>
            <Content>
              <p className={PROSE}>{t('menu.overview.entriesBody')}</p>
              <Menu
                ariaLabel={t('menu.demo.ariaLabel')}
                items={[
                  { type: 'heading', label: t('menu.demo.headingFile') },
                  ...menuItems(t).slice(0, 3),
                  {
                    value: 'export',
                    label: t('menu.demo.items.export'),
                    icon: 'download',
                    items: [
                      { value: 'pdf', label: t('menu.demo.items.pdf') },
                      { value: 'csv', label: t('menu.demo.items.csv') },
                    ],
                  },
                  { type: 'divider' },
                  { value: 'delete', label: t('menu.demo.items.delete'), icon: 'delete', danger: true },
                ]}
              >
                <div className={AREA}>{t('menu.demo.areaRich')}</div>
              </Menu>
            </Content>
          </Section>

          <Section title={t('menu.overview.disabledTitle')}>
            <Content>
              <p className={PROSE}>{t('menu.overview.disabledBody')}</p>
              <Menu disabled items={menuItems(t)}>
                <div className={AREA}>{t('menu.demo.areaDisabled')}</div>
              </Menu>
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
          <Section title={t('menu.usage.whenTitle')}>
            <Content>
              <p className={PROSE}>{t('menu.usage.whenBody')}</p>
            </Content>
          </Section>

          <Section title={t('menu.usage.discoverTitle')}>
            <Content>
              <p className={PROSE}>{t('menu.usage.discoverBody')}</p>
            </Content>
          </Section>

          <Section title={t('menu.usage.contentTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('menu.usage.c1')}</li>
                <li>{t('menu.usage.c2')}</li>
                <li>{t('menu.usage.c3')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('menu.usage.dontTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('menu.usage.dont1')}</li>
                <li>{t('menu.usage.dont2')}</li>
                <li>{t('menu.usage.dont3')}</li>
              </ul>
            </Content>
          </Section>
        </>
      ),
    },
    {
      id: 'code',
      label: t('tabs.code'),
      content: (
        <Section title={t('menu.code.title')}>
          <Content>
            <p className={PROSE}>{t('menu.code.basicDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{BASIC_CODE}</CodeBlock>
            </div>

            <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('menu.code.disabledDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{DISABLED_CODE}</CodeBlock>
            </div>
          </Content>
        </Section>
      ),
    },
    {
      id: 'accessibility',
      label: t('tabs.accessibility'),
      content: (
        <>
          <Section title={t('menu.a11y.keyboardTitle')}>
            <Content>
              <p className={PROSE}>{t('menu.a11y.keyboardBody')}</p>
              <ul className={`${LIST} mt-[var(--medo-space-sm)]`}>
                <li>{t('menu.a11y.k1')}</li>
                <li>{t('menu.a11y.k2')}</li>
                <li>{t('menu.a11y.k3')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('menu.a11y.parallelTitle')}>
            <Content>
              <p className={PROSE}>{t('menu.a11y.parallelBody')}</p>
            </Content>
          </Section>

          <Section title={t('menu.a11y.rolesTitle')}>
            <Content>
              <p className={PROSE}>{t('menu.a11y.rolesBody')}</p>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title={t('menu.page.title')}
      description={t('menu.page.description')}
      tabs={tabs}
    />
  )
}
