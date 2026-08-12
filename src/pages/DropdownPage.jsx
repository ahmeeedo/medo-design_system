import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Dropdown, MenuList } from '../components'

const PROSE = 'text-[var(--medo-text-muted)] [font-family:var(--medo-font-sans)] [font-size:var(--medo-text-base)] [line-height:var(--medo-leading-relaxed)]'
const CAPTION = '[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-xs)] text-[var(--medo-text-muted)]'
const ROW = 'flex flex-wrap items-start gap-[var(--medo-space-lg)] mt-[var(--medo-space-md)]'
const LIST = `${PROSE} list-disc pl-[var(--medo-space-lg)] space-y-[var(--medo-space-3xs)]`

const BASIC_CODE = `import { Dropdown } from '@/components'

<Dropdown
  label="Aktionen"
  items={[
    { value: 'edit',   label: 'Termin bearbeiten', icon: 'edit' },
    { value: 'move',   label: 'Termin verschieben', icon: 'event_repeat', shortcut: 'Strg+M' },
    { type: 'divider' },
    { value: 'delete', label: 'Termin absagen', icon: 'delete', danger: true },
  ]}
  onSelect={value => handle(value)}
/>`

const ENTRIES_CODE = `{/* Struktur und Zustand je Eintrag */}
[
  { type: 'heading', label: 'Bearbeiten' },
  { value: 'edit',    label: 'Termin bearbeiten', icon: 'edit' },
  { value: 'copy',    label: 'Termin kopieren',   shortcut: 'Strg+C' },
  { value: 'lock',    label: 'Termin sperren',    disabled: true },
  { type: 'divider' },
  { value: 'export',  label: 'Als PDF öffnen', href: '/export' },
  { value: 'delete',  label: 'Termin absagen', icon: 'delete', danger: true },
]`

const SUB_CODE = `{/* Untermenü — eine Ebene, mehr nicht */}
{
  value: 'export',
  label: 'Exportieren',
  icon: 'download',
  items: [
    { value: 'pdf', label: 'Als PDF' },
    { value: 'csv', label: 'Als CSV' },
  ],
}`

const SELECTION_CODE = `{/* keepOpen laesst das Menue bei Mehrfachauswahl offen */}
<Dropdown
  label="Spalten"
  selectionMode="multiple"
  items={spalten.map(s => ({
    value: s.id,
    label: s.label,
    checked: sichtbar.includes(s.id),
    keepOpen: true,
  }))}
  onSelect={id => umschalten(id)}
/>`

const MENULIST_CODE = `import { MenuList } from '@/components'

{/* Die Menuefläche laesst sich auch ohne Ausloeser einsetzen */}
<MenuList
  ariaLabel="Aktionen"
  items={items}
  onSelect={value => handle(value)}
  onClose={() => setOffen(false)}
/>`

const actionItems = t => [
  { type: 'heading', label: t('dropdown.demo.headingEdit') },
  { value: 'edit', label: t('dropdown.demo.items.edit'), icon: 'edit' },
  { value: 'move', label: t('dropdown.demo.items.move'), icon: 'event_repeat', shortcut: 'Strg+M' },
  { value: 'lock', label: t('dropdown.demo.items.lock'), icon: 'lock', disabled: true },
  { type: 'divider' },
  { value: 'delete', label: t('dropdown.demo.items.delete'), icon: 'delete', danger: true },
]

const COLUMNS = ['patient', 'date', 'doctor']

function SelectionDemo({ mode }) {
  const { t } = useTranslation()
  const [single, setSingle] = useState('patient')
  const [multiple, setMultiple] = useState(['patient', 'date'])

  const items = COLUMNS.map(id => ({
    value: id,
    label: t(`dropdown.demo.columns.${id}`),
    checked: mode === 'single' ? single === id : multiple.includes(id),
    keepOpen: mode === 'multiple',
  }))

  const select = value => {
    if (mode === 'single') setSingle(value)
    else setMultiple(current => (current.includes(value) ? current.filter(e => e !== value) : [...current, value]))
  }

  return (
    <div>
      <Dropdown
        label={t('dropdown.demo.columnsLabel')}
        selectionMode={mode}
        items={items}
        onSelect={select}
        menuMinWidth={220}
      />
      <p className={`${CAPTION} mt-[var(--medo-space-sm)]`}>
        {mode === 'single'
          ? t('dropdown.demo.selectedSingle', { value: t(`dropdown.demo.columns.${single}`) })
          : t('dropdown.demo.selectedMultiple', { count: multiple.length })}
      </p>
    </div>
  )
}

export default function DropdownPage() {
  const { t } = useTranslation()

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={values => (
              <Dropdown
                key={values.selectionMode}
                label={t('dropdown.demo.actionsLabel')}
                icon={values.icon ? 'bolt' : undefined}
                trigger={values.trigger}
                size={values.size}
                align={values.align}
                disabled={values.disabled}
                ariaLabel={t('dropdown.demo.actionsLabel')}
                items={
                  values.selectionMode === 'ohne'
                    ? actionItems(t)
                    : COLUMNS.map((id, i) => ({
                        value: id,
                        label: t(`dropdown.demo.columns.${id}`),
                        checked: i === 0,
                        keepOpen: values.selectionMode === 'multiple',
                      }))
                }
                selectionMode={values.selectionMode === 'ohne' ? undefined : values.selectionMode}
              />
            )}
            controls={[
              { id: 'trigger', type: 'dropdown', label: t('dropdown.controls.trigger'), options: ['button', 'kebab'], default: 'button' },
              { id: 'size', type: 'dropdown', label: t('dropdown.controls.size'), options: ['sm', 'md'], default: 'md' },
              { id: 'align', type: 'dropdown', label: t('dropdown.controls.align'), options: ['start', 'end'], default: 'start' },
              { id: 'selectionMode', type: 'dropdown', label: t('dropdown.controls.selectionMode'), options: ['ohne', 'single', 'multiple'], default: 'ohne' },
              { id: 'icon', type: 'toggle', label: t('dropdown.controls.icon'), default: false },
              { id: 'disabled', type: 'toggle', label: t('dropdown.controls.disabled'), default: false },
            ]}
          />

          <Section title={t('dropdown.overview.triggerTitle')}>
            <Content>
              <p className={PROSE}>{t('dropdown.overview.triggerBody')}</p>
              <div className={ROW}>
                <div className="flex flex-col items-start gap-[var(--medo-space-xs)]">
                  <Dropdown label={t('dropdown.demo.actionsLabel')} items={actionItems(t)} />
                  <span className={CAPTION}>trigger="button"</span>
                </div>
                <div className="flex flex-col items-start gap-[var(--medo-space-xs)]">
                  <Dropdown trigger="kebab" ariaLabel={t('dropdown.demo.moreLabel')} items={actionItems(t)} align="end" />
                  <span className={CAPTION}>trigger="kebab"</span>
                </div>
              </div>
            </Content>
          </Section>

          <Section title={t('dropdown.overview.sizesTitle')}>
            <Content>
              <p className={PROSE}>{t('dropdown.overview.sizesBody')}</p>
              <div className={ROW}>
                <div className="flex flex-col items-start gap-[var(--medo-space-xs)]">
                  <Dropdown size="sm" label={t('dropdown.demo.actionsLabel')} items={actionItems(t)} />
                  <span className={CAPTION}>sm · 32px</span>
                </div>
                <div className="flex flex-col items-start gap-[var(--medo-space-xs)]">
                  <Dropdown size="md" label={t('dropdown.demo.actionsLabel')} items={actionItems(t)} />
                  <span className={CAPTION}>md · 40px</span>
                </div>
              </div>
            </Content>
          </Section>

          <Section title={t('dropdown.overview.alignTitle')}>
            <Content>
              <p className={PROSE}>{t('dropdown.overview.alignBody')}</p>
              <div className="flex justify-between mt-[var(--medo-space-md)]">
                <div className="flex flex-col items-start gap-[var(--medo-space-xs)]">
                  <Dropdown align="start" label={t('dropdown.demo.actionsLabel')} items={actionItems(t)} />
                  <span className={CAPTION}>align="start"</span>
                </div>
                <div className="flex flex-col items-end gap-[var(--medo-space-xs)]">
                  <Dropdown align="end" label={t('dropdown.demo.actionsLabel')} items={actionItems(t)} />
                  <span className={CAPTION}>align="end"</span>
                </div>
              </div>
            </Content>
          </Section>

          <Section title={t('dropdown.overview.entriesTitle')}>
            <Content>
              <p className={PROSE}>{t('dropdown.overview.entriesBody')}</p>
              <ul className={`${LIST} mt-[var(--medo-space-sm)]`}>
                <li>{t('dropdown.overview.e1')}</li>
                <li>{t('dropdown.overview.e2')}</li>
                <li>{t('dropdown.overview.e3')}</li>
                <li>{t('dropdown.overview.e4')}</li>
                <li>{t('dropdown.overview.e5')}</li>
              </ul>
              <div className={ROW}>
                <MenuList
                  autoFocus={false}
                  ariaLabel={t('dropdown.demo.actionsLabel')}
                  items={[
                    ...actionItems(t),
                    { type: 'divider' },
                    { value: 'export', label: t('dropdown.demo.items.export'), href: '#', icon: 'open_in_new' },
                  ]}
                />
              </div>
            </Content>
          </Section>

          <Section title={t('dropdown.overview.subTitle')}>
            <Content>
              <p className={PROSE}>{t('dropdown.overview.subBody')}</p>
              <div className={ROW}>
                <Dropdown
                  label={t('dropdown.demo.exportLabel')}
                  items={[
                    { value: 'print', label: t('dropdown.demo.items.print'), icon: 'print' },
                    {
                      value: 'export',
                      label: t('dropdown.demo.items.export'),
                      icon: 'download',
                      items: [
                        { value: 'pdf', label: t('dropdown.demo.items.pdf') },
                        { value: 'csv', label: t('dropdown.demo.items.csv') },
                      ],
                    },
                  ]}
                />
              </div>
            </Content>
          </Section>

          <Section title={t('dropdown.overview.selectionTitle')}>
            <Content>
              <p className={PROSE}>{t('dropdown.overview.selectionBody')}</p>
              <div className={ROW}>
                <div className="flex flex-col items-start gap-[var(--medo-space-xs)]">
                  <SelectionDemo mode="single" />
                  <span className={CAPTION}>selectionMode="single"</span>
                </div>
                <div className="flex flex-col items-start gap-[var(--medo-space-xs)]">
                  <SelectionDemo mode="multiple" />
                  <span className={CAPTION}>selectionMode="multiple" · keepOpen</span>
                </div>
              </div>
            </Content>
          </Section>

          <Section title={t('dropdown.overview.menuListTitle')}>
            <Content>
              <p className={PROSE}>{t('dropdown.overview.menuListBody')}</p>
              <div className={ROW}>
                <MenuList
                  autoFocus={false}
                  ariaLabel={t('dropdown.demo.actionsLabel')}
                  minWidth={240}
                  items={actionItems(t)}
                />
              </div>
            </Content>
          </Section>

          <Section title={t('dropdown.overview.disabledTitle')}>
            <Content>
              <p className={PROSE}>{t('dropdown.overview.disabledBody')}</p>
              <div className={ROW}>
                <Dropdown disabled label={t('dropdown.demo.actionsLabel')} items={actionItems(t)} />
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
          <Section title={t('dropdown.usage.whenTitle')}>
            <Content>
              <p className={PROSE}>{t('dropdown.usage.whenBody')}</p>
            </Content>
          </Section>

          <Section title={t('dropdown.usage.orderTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('dropdown.usage.o1')}</li>
                <li>{t('dropdown.usage.o2')}</li>
                <li>{t('dropdown.usage.o3')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('dropdown.usage.labelTitle')}>
            <Content>
              <p className={PROSE}>{t('dropdown.usage.labelBody')}</p>
            </Content>
          </Section>

          <Section title={t('dropdown.usage.dontTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('dropdown.usage.dont1')}</li>
                <li>{t('dropdown.usage.dont2')}</li>
                <li>{t('dropdown.usage.dont3')}</li>
                <li>{t('dropdown.usage.dont4')}</li>
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
        <Section title={t('dropdown.code.title')}>
          <Content>
            <p className={PROSE}>{t('dropdown.code.basicDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{BASIC_CODE}</CodeBlock>
            </div>

            <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('dropdown.code.entriesDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{ENTRIES_CODE}</CodeBlock>
            </div>

            <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('dropdown.code.subDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{SUB_CODE}</CodeBlock>
            </div>

            <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('dropdown.code.selectionDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{SELECTION_CODE}</CodeBlock>
            </div>

            <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('dropdown.code.menuListDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{MENULIST_CODE}</CodeBlock>
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
          <Section title={t('dropdown.a11y.keyboardTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('dropdown.a11y.k1')}</li>
                <li>{t('dropdown.a11y.k2')}</li>
                <li>{t('dropdown.a11y.k3')}</li>
                <li>{t('dropdown.a11y.k4')}</li>
                <li>{t('dropdown.a11y.k5')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('dropdown.a11y.rolesTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('dropdown.a11y.r1')}</li>
                <li>{t('dropdown.a11y.r2')}</li>
                <li>{t('dropdown.a11y.r3')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('dropdown.a11y.focusTitle')}>
            <Content>
              <p className={PROSE}>{t('dropdown.a11y.focusBody')}</p>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title={t('dropdown.page.title')}
      description={t('dropdown.page.description')}
      tabs={tabs}
    />
  )
}
