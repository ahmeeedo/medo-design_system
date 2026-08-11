import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Toggle } from '../components'

const PROSE = 'text-[var(--medo-text-muted)] [font-family:var(--medo-font-sans)] [font-size:var(--medo-text-base)] [line-height:var(--medo-leading-relaxed)]'
const CAPTION = '[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-xs)] text-[var(--medo-text-muted)]'
const COL = 'flex flex-col gap-[var(--medo-space-md)] mt-[var(--medo-space-md)]'
const LIST = `${PROSE} list-disc pl-[var(--medo-space-lg)] space-y-[var(--medo-space-3xs)]`

const BASIC_CODE = `import { Toggle } from '@/components'

<Toggle label="Terminerinnerung senden" defaultChecked />
<Toggle
  label="Videosprechstunde anbieten"
  description="Patientinnen und Patienten können online buchen."
/>`

const CONTROLLED_CODE = `const [aktiv, setAktiv] = useState(false)

<Toggle checked={aktiv} onChange={setAktiv} label="Automatische Abrechnung" />`

const LOADING_CODE = `{/* Gesperrt, solange gespeichert wird — sieht aber nicht deaktiviert aus */}
<Toggle checked={aktiv} loading={speichert} onChange={speichern} label="Automatische Abrechnung" />`

const SETTINGS_CODE = `{/* Einstellungsliste: Label links, Schalter rechts am Zeilenende */}
<Toggle labelPosition="left" label="Terminerinnerung senden" description="24 Stunden vorher." />`

function LoadingDemo() {
  const { t } = useTranslation()
  const [on, setOn] = useState(false)
  const [saving, setSaving] = useState(false)

  const change = next => {
    setSaving(true)
    setTimeout(() => {
      setOn(next)
      setSaving(false)
    }, 1200)
  }

  return (
    <div className="mt-[var(--medo-space-md)]">
      <Toggle
        checked={on}
        loading={saving}
        onChange={change}
        label={t('toggle.demo.billing')}
        description={t('toggle.demo.billingDesc')}
      />
      <p className={`${CAPTION} mt-[var(--medo-space-sm)]`}>
        {saving ? t('toggle.demo.saving') : t('toggle.demo.saved')}
      </p>
    </div>
  )
}

export default function TogglePage() {
  const { t } = useTranslation()

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={values => (
              <div className={values.labelPosition === 'left' ? 'w-full max-w-[360px]' : undefined}>
                <Toggle
                  label={t('toggle.demo.reminder')}
                  description={values.description ? t('toggle.demo.reminderDesc') : undefined}
                  size={values.size}
                  labelPosition={values.labelPosition}
                  icons={values.icons}
                  loading={values.loading}
                  disabled={values.disabled}
                  defaultChecked
                />
              </div>
            )}
            controls={[
              { id: 'size', type: 'dropdown', label: t('toggle.controls.size'), options: ['sm', 'md', 'lg'], default: 'md' },
              { id: 'labelPosition', type: 'dropdown', label: t('toggle.controls.labelPosition'), options: ['right', 'left'], default: 'right' },
              { id: 'description', type: 'toggle', label: t('toggle.controls.description'), default: false },
              { id: 'icons', type: 'toggle', label: t('toggle.controls.icons'), default: true },
              { id: 'loading', type: 'toggle', label: t('toggle.controls.loading'), default: false },
              { id: 'disabled', type: 'toggle', label: t('toggle.controls.disabled'), default: false },
            ]}
          />

          <Section title={t('toggle.overview.statesTitle')}>
            <Content>
              <p className={PROSE}>{t('toggle.overview.statesBody')}</p>
              <div className={COL}>
                <Toggle label={t('toggle.demo.states.off')} />
                <Toggle label={t('toggle.demo.states.on')} defaultChecked />
                <Toggle label={t('toggle.demo.states.disabledOff')} disabled />
                <Toggle label={t('toggle.demo.states.disabledOn')} disabled defaultChecked />
                <Toggle label={t('toggle.demo.states.loading')} loading defaultChecked />
              </div>
            </Content>
          </Section>

          <Section title={t('toggle.overview.sizesTitle')}>
            <Content>
              <p className={PROSE}>{t('toggle.overview.sizesBody')}</p>
              <div className={COL}>
                {[
                  { size: 'sm', meta: 'sm · 36 × 20' },
                  { size: 'md', meta: 'md · 44 × 24' },
                  { size: 'lg', meta: 'lg · 52 × 30' },
                ].map(item => (
                  <div key={item.size} className="flex items-center gap-[var(--medo-space-md)]">
                    <Toggle size={item.size} label={t('toggle.demo.reminder')} defaultChecked />
                    <span className={CAPTION}>{item.meta}</span>
                  </div>
                ))}
              </div>
            </Content>
          </Section>

          <Section title={t('toggle.overview.descriptionTitle')}>
            <Content>
              <p className={PROSE}>{t('toggle.overview.descriptionBody')}</p>
              <div className={COL}>
                <Toggle
                  label={t('toggle.demo.video')}
                  description={t('toggle.demo.videoDesc')}
                  defaultChecked
                />
              </div>
            </Content>
          </Section>

          <Section title={t('toggle.overview.labelLeftTitle')}>
            <Content>
              <p className={PROSE}>{t('toggle.overview.labelLeftBody')}</p>
              <div className="mt-[var(--medo-space-md)] max-w-[420px] flex flex-col gap-[var(--medo-space-md)] rounded-[var(--medo-radius-lg)] border border-[var(--medo-border)] p-[var(--medo-space-lg)]">
                <Toggle labelPosition="left" label={t('toggle.demo.reminder')} description={t('toggle.demo.reminderDesc')} defaultChecked />
                <Toggle labelPosition="left" label={t('toggle.demo.video')} />
              </div>
            </Content>
          </Section>

          <Section title={t('toggle.overview.iconsTitle')}>
            <Content>
              <p className={PROSE}>{t('toggle.overview.iconsBody')}</p>
              <div className={COL}>
                <Toggle label={t('toggle.demo.withIcons')} defaultChecked />
                <Toggle label={t('toggle.demo.withoutIcons')} icons={false} defaultChecked />
              </div>
            </Content>
          </Section>

          <Section title={t('toggle.overview.loadingTitle')}>
            <Content>
              <p className={PROSE}>{t('toggle.overview.loadingBody')}</p>
              <LoadingDemo />
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
          <Section title={t('toggle.usage.whenTitle')}>
            <Content>
              <p className={PROSE}>{t('toggle.usage.whenBody')}</p>
            </Content>
          </Section>

          <Section title={t('toggle.usage.labelTitle')}>
            <Content>
              <p className={PROSE}>{t('toggle.usage.labelBody')}</p>
            </Content>
          </Section>

          <Section title={t('toggle.usage.loadingTitle')}>
            <Content>
              <p className={PROSE}>{t('toggle.usage.loadingBody')}</p>
            </Content>
          </Section>

          <Section title={t('toggle.usage.dontTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('toggle.usage.dont1')}</li>
                <li>{t('toggle.usage.dont2')}</li>
                <li>{t('toggle.usage.dont3')}</li>
                <li>{t('toggle.usage.dont4')}</li>
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
        <Section title={t('toggle.code.title')}>
          <Content>
            <p className={PROSE}>{t('toggle.code.basicDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{BASIC_CODE}</CodeBlock>
            </div>

            <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('toggle.code.controlledDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{CONTROLLED_CODE}</CodeBlock>
            </div>

            <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('toggle.code.loadingDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{LOADING_CODE}</CodeBlock>
            </div>

            <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('toggle.code.settingsDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{SETTINGS_CODE}</CodeBlock>
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
          <Section title={t('toggle.a11y.roleTitle')}>
            <Content>
              <p className={PROSE}>{t('toggle.a11y.roleBody')}</p>
            </Content>
          </Section>

          <Section title={t('toggle.a11y.keyboardTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('toggle.a11y.k1')}</li>
                <li>{t('toggle.a11y.k2')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('toggle.a11y.stateTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('toggle.a11y.s1')}</li>
                <li>{t('toggle.a11y.s2')}</li>
                <li>{t('toggle.a11y.s3')}</li>
              </ul>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title={t('toggle.page.title')}
      description={t('toggle.page.description')}
      tabs={tabs}
    />
  )
}
