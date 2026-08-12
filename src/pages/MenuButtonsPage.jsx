import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { MenuButton, SplitButton, IconMenuButton } from '../components'

const PROSE = 'text-[var(--medo-text-muted)] [font-family:var(--medo-font-sans)] [font-size:var(--medo-text-base)] [line-height:var(--medo-leading-relaxed)]'
const CAPTION = '[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-xs)] text-[var(--medo-text-muted)]'
const ROW = 'flex flex-wrap items-start gap-[var(--medo-space-lg)] mt-[var(--medo-space-md)]'
const LIST = `${PROSE} list-disc pl-[var(--medo-space-lg)] space-y-[var(--medo-space-3xs)]`

const MENUBUTTON_CODE = `import { MenuButton } from '@/components'

<MenuButton
  label="Termin anlegen"
  icon="add"
  items={[
    { value: 'praxis', label: 'In der Praxis' },
    { value: 'video',  label: 'Videosprechstunde' },
  ]}
  onSelect={value => anlegen(value)}
/>`

const SPLIT_CODE = `import { SplitButton } from '@/components'

{/* Die Hauptaktion laeuft direkt, das Menue traegt die Varianten */}
<SplitButton
  label="Termin anlegen"
  onClick={() => anlegen('praxis')}
  menuLabel="Weitere Terminarten"
  items={[
    { value: 'video',   label: 'Videosprechstunde' },
    { value: 'telefon', label: 'Telefonisch' },
  ]}
  onSelect={value => anlegen(value)}
/>`

const ICON_CODE = `import { IconMenuButton } from '@/components'

{/* Ohne ariaLabel waere die Schaltflaeche unbenannt */}
<IconMenuButton
  ariaLabel="Weitere Aktionen"
  items={[
    { value: 'edit',   label: 'Termin bearbeiten', icon: 'edit' },
    { value: 'delete', label: 'Termin absagen', icon: 'delete', danger: true },
  ]}
  onSelect={value => handle(value)}
/>`

const appointmentItems = t => [
  { value: 'video', label: t('menuButtons.demo.items.video'), icon: 'videocam' },
  { value: 'phone', label: t('menuButtons.demo.items.phone'), icon: 'call' },
  { type: 'divider' },
  { value: 'series', label: t('menuButtons.demo.items.series'), icon: 'event_repeat' },
]

const actionItems = t => [
  { value: 'edit', label: t('menuButtons.demo.items.edit'), icon: 'edit' },
  { value: 'copy', label: t('menuButtons.demo.items.copy'), icon: 'content_copy', shortcut: 'Strg+C' },
  { type: 'divider' },
  { value: 'delete', label: t('menuButtons.demo.items.delete'), icon: 'delete', danger: true },
]

function SplitDemo() {
  const { t } = useTranslation()
  const [last, setLast] = useState(null)

  return (
    <div>
      <div className={ROW}>
        <SplitButton
          label={t('menuButtons.demo.createLabel')}
          icon="add"
          onClick={() => setLast('praxis')}
          menuLabel={t('menuButtons.demo.menuLabel')}
          items={appointmentItems(t)}
          onSelect={value => setLast(value)}
        />
        <SplitButton
          variant="neutral"
          label={t('menuButtons.demo.createLabel')}
          onClick={() => setLast('praxis')}
          menuLabel={t('menuButtons.demo.menuLabel')}
          items={appointmentItems(t)}
          onSelect={value => setLast(value)}
        />
      </div>
      <p className={`${CAPTION} mt-[var(--medo-space-sm)]`}>
        {last ? t('menuButtons.demo.lastAction', { value: t(`menuButtons.demo.kinds.${last}`) }) : t('menuButtons.demo.noAction')}
      </p>
    </div>
  )
}

export default function MenuButtonsPage() {
  const { t } = useTranslation()

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={values => {
              const shared = {
                items: appointmentItems(t),
                variant: values.variant,
                align: values.align,
                disabled: values.disabled,
              }
              if (values.form === 'splitButton')
                return (
                  <SplitButton
                    {...shared}
                    label={t('menuButtons.demo.createLabel')}
                    icon={values.icon ? 'add' : undefined}
                    menuLabel={t('menuButtons.demo.menuLabel')}
                  />
                )
              if (values.form === 'iconMenuButton')
                return <IconMenuButton {...shared} ariaLabel={t('menuButtons.demo.moreLabel')} />
              return (
                <MenuButton
                  {...shared}
                  label={t('menuButtons.demo.createLabel')}
                  icon={values.icon ? 'add' : undefined}
                />
              )
            }}
            controls={[
              { id: 'form', type: 'dropdown', label: t('menuButtons.controls.form'), options: ['menuButton', 'splitButton', 'iconMenuButton'], default: 'menuButton' },
              { id: 'variant', type: 'dropdown', label: t('menuButtons.controls.variant'), options: ['primary', 'neutral'], default: 'primary' },
              { id: 'align', type: 'dropdown', label: t('menuButtons.controls.align'), options: ['start', 'end'], default: 'start' },
              { id: 'icon', type: 'toggle', label: t('menuButtons.controls.icon'), default: false },
              { id: 'disabled', type: 'toggle', label: t('menuButtons.controls.disabled'), default: false },
            ]}
          />

          <Section title={t('menuButtons.overview.formsTitle')}>
            <Content>
              <p className={PROSE}>{t('menuButtons.overview.formsBody')}</p>
              <ul className={`${LIST} mt-[var(--medo-space-sm)]`}>
                <li>{t('menuButtons.overview.f1')}</li>
                <li>{t('menuButtons.overview.f2')}</li>
                <li>{t('menuButtons.overview.f3')}</li>
              </ul>
              <div className={ROW}>
                <div className="flex flex-col items-start gap-[var(--medo-space-xs)]">
                  <MenuButton label={t('menuButtons.demo.createLabel')} items={appointmentItems(t)} />
                  <span className={CAPTION}>MenuButton</span>
                </div>
                <div className="flex flex-col items-start gap-[var(--medo-space-xs)]">
                  <SplitButton
                    label={t('menuButtons.demo.createLabel')}
                    menuLabel={t('menuButtons.demo.menuLabel')}
                    items={appointmentItems(t)}
                  />
                  <span className={CAPTION}>SplitButton</span>
                </div>
                <div className="flex flex-col items-start gap-[var(--medo-space-xs)]">
                  <IconMenuButton ariaLabel={t('menuButtons.demo.moreLabel')} items={actionItems(t)} />
                  <span className={CAPTION}>IconMenuButton</span>
                </div>
              </div>
            </Content>
          </Section>

          <Section title={t('menuButtons.overview.variantsTitle')}>
            <Content>
              <p className={PROSE}>{t('menuButtons.overview.variantsBody')}</p>
              <div className={ROW}>
                <div className="flex flex-col items-start gap-[var(--medo-space-xs)]">
                  <MenuButton label={t('menuButtons.demo.createLabel')} icon="add" items={appointmentItems(t)} />
                  <span className={CAPTION}>variant="primary"</span>
                </div>
                <div className="flex flex-col items-start gap-[var(--medo-space-xs)]">
                  <MenuButton variant="neutral" label={t('menuButtons.demo.createLabel')} icon="add" items={appointmentItems(t)} />
                  <span className={CAPTION}>variant="neutral"</span>
                </div>
              </div>
            </Content>
          </Section>

          <Section title={t('menuButtons.overview.splitTitle')}>
            <Content>
              <p className={PROSE}>{t('menuButtons.overview.splitBody')}</p>
              <SplitDemo />
            </Content>
          </Section>

          <Section title={t('menuButtons.overview.iconTitle')}>
            <Content>
              <p className={PROSE}>{t('menuButtons.overview.iconBody')}</p>
              <div className={ROW}>
                <IconMenuButton ariaLabel={t('menuButtons.demo.moreLabel')} items={actionItems(t)} />
                <IconMenuButton variant="primary" icon="add" ariaLabel={t('menuButtons.demo.createLabel')} items={appointmentItems(t)} />
              </div>
            </Content>
          </Section>

          <Section title={t('menuButtons.overview.alignTitle')}>
            <Content>
              <p className={PROSE}>{t('menuButtons.overview.alignBody')}</p>
              <div className="flex justify-between mt-[var(--medo-space-md)]">
                <div className="flex flex-col items-start gap-[var(--medo-space-xs)]">
                  <MenuButton align="start" label={t('menuButtons.demo.createLabel')} items={appointmentItems(t)} />
                  <span className={CAPTION}>align="start"</span>
                </div>
                <div className="flex flex-col items-end gap-[var(--medo-space-xs)]">
                  <MenuButton align="end" label={t('menuButtons.demo.createLabel')} items={appointmentItems(t)} />
                  <span className={CAPTION}>align="end"</span>
                </div>
              </div>
            </Content>
          </Section>

          <Section title={t('menuButtons.overview.disabledTitle')}>
            <Content>
              <p className={PROSE}>{t('menuButtons.overview.disabledBody')}</p>
              <div className={ROW}>
                <MenuButton disabled label={t('menuButtons.demo.createLabel')} items={appointmentItems(t)} />
                <SplitButton disabled label={t('menuButtons.demo.createLabel')} menuLabel={t('menuButtons.demo.menuLabel')} items={appointmentItems(t)} />
                <IconMenuButton disabled ariaLabel={t('menuButtons.demo.moreLabel')} items={actionItems(t)} />
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
          <Section title={t('menuButtons.usage.whichTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('menuButtons.usage.w1')}</li>
                <li>{t('menuButtons.usage.w2')}</li>
                <li>{t('menuButtons.usage.w3')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('menuButtons.usage.splitTitle')}>
            <Content>
              <p className={PROSE}>{t('menuButtons.usage.splitBody')}</p>
            </Content>
          </Section>

          <Section title={t('menuButtons.usage.variantTitle')}>
            <Content>
              <p className={PROSE}>{t('menuButtons.usage.variantBody')}</p>
            </Content>
          </Section>

          <Section title={t('menuButtons.usage.dontTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('menuButtons.usage.dont1')}</li>
                <li>{t('menuButtons.usage.dont2')}</li>
                <li>{t('menuButtons.usage.dont3')}</li>
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
        <Section title={t('menuButtons.code.title')}>
          <Content>
            <p className={PROSE}>{t('menuButtons.code.menuButtonDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{MENUBUTTON_CODE}</CodeBlock>
            </div>

            <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('menuButtons.code.splitDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{SPLIT_CODE}</CodeBlock>
            </div>

            <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('menuButtons.code.iconDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{ICON_CODE}</CodeBlock>
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
          <Section title={t('menuButtons.a11y.labelTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('menuButtons.a11y.l1')}</li>
                <li>{t('menuButtons.a11y.l2')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('menuButtons.a11y.keyboardTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('menuButtons.a11y.k1')}</li>
                <li>{t('menuButtons.a11y.k2')}</li>
                <li>{t('menuButtons.a11y.k3')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('menuButtons.a11y.stateTitle')}>
            <Content>
              <p className={PROSE}>{t('menuButtons.a11y.stateBody')}</p>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title={t('menuButtons.page.title')}
      description={t('menuButtons.page.description')}
      tabs={tabs}
    />
  )
}
