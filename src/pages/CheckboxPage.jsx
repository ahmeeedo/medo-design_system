import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Checkbox, CheckboxGroup } from '../components'

const CHECKBOX_CODE = `import { Checkbox, CheckboxGroup } from '@/components'

{/* Single */}
<Checkbox label="Zustimmung" text="AGB akzeptieren" />
<Checkbox label="Zustimmung" text="AGB akzeptieren" helperText="Pflichtfeld." />
<Checkbox label="Zustimmung" text="AGB akzeptieren" error="Bitte zustimmen." />

{/* Gruppe */}
function PermissionsForm() {
  return (
    <CheckboxGroup label="Berechtigungen" helperText="Wähle mindestens eine Option.">
      <Checkbox text="Lesen"           defaultChecked />
      <Checkbox text="Schreiben" />
      <Checkbox text="Administrieren"  disabled />
    </CheckboxGroup>
  )
}`

export default function CheckboxPage() {
  const { t } = useTranslation()

  const doDont = ['1', '2', '3', '4'].map(n => ({ do: `do${n}`, dont: `dont${n}` }))

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={(values) => {
              const helper = values.helper && !values.error ? 'Helper text' : undefined
              const err = values.error ? 'Error text' : undefined
              return values.variant === 'Group' ? (
                <CheckboxGroup label="Label" helperText={helper} error={err}>
                  <Checkbox text="Option 1" />
                  <Checkbox text="Option 2" defaultChecked />
                  <Checkbox text="Option 3" />
                </CheckboxGroup>
              ) : (
                <Checkbox label="Label" text="Checkbox text" helperText={helper} error={err} />
              )
            }}
            controls={[
              { id: 'variant', type: 'dropdown', label: 'Variant',     options: ['Single', 'Group'], default: 'Single' },
              { id: 'helper',  type: 'toggle',   label: 'Helper Text', default: false },
              { id: 'error',   type: 'toggle',   label: 'Error',       default: false },
            ]}
          />
          <Section title={t('checkbox.overview.anatomyTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-3)]">
                {t('checkbox.overview.anatomyBody')}
              </p>
              <ol className="flex flex-col gap-[var(--space-2)] pl-[var(--space-5)]">
                {['an1', 'an2', 'an3'].map(k => (
                  <li key={k} className="text-sm text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                    {t(`checkbox.overview.${k}`)}
                  </li>
                ))}
              </ol>
            </Content>
          </Section>

          <Section title={t('checkbox.overview.statesTitle')}>
            <div className="flex flex-col gap-[var(--space-3)]">
              <Checkbox text={t('checkbox.overview.stateDefault')} />
              <Checkbox text={t('checkbox.overview.stateChecked')} defaultChecked />
              <Checkbox text={t('checkbox.overview.stateDisabled')} disabled />
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
          <Section title={t('checkbox.usage.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('checkbox.usage.intro')}
              </p>
            </Content>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)]">
              <div className="bg-[var(--color-success-container-100)] border border-[var(--color-success)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('checkbox.usage.doTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ do: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-success)] shrink-0">✓</span>
                      <span>{t(`checkbox.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('checkbox.usage.doNote')}
                </div>
              </div>
              <div className="bg-[var(--color-error-container-100)] border border-[var(--color-error)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('checkbox.usage.dontTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ dont: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-error)] shrink-0">✗</span>
                      <span>{t(`checkbox.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('checkbox.usage.dontNote')}
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
          <Section title={t('checkbox.code.title')}>
            <Content>
              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">
                {t('checkbox.code.checkboxTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('checkbox.code.checkboxDesc')}
              </p>
              <CodeBlock language="jsx">{CHECKBOX_CODE}</CodeBlock>
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
          <Section title={t('checkbox.a11y.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('checkbox.a11y.intro')}
              </p>
            </Content>
          </Section>

          <Section title={t('checkbox.a11y.keyboardTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-4)]">
                {t('checkbox.a11y.keyboardBody')}
              </p>
            </Content>
            <div className="border border-[var(--border-subtle-100)] rounded-[var(--radius-lg)] overflow-hidden mb-[var(--space-6)]">
              {['k1', 'k2', 'k3', 'k4'].map((k, i) => (
                <div key={k} className={`flex items-center gap-[var(--space-4)] px-[var(--space-4)] py-[var(--space-3)] ${i % 2 === 0 ? 'bg-[var(--surface_100)]' : 'bg-[var(--surface_200)]'}`}>
                  <span className="text-sm text-[var(--color-text-secondary)]">{t(`checkbox.a11y.${k}`)}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-6)]">
              {[
                { title: t('checkbox.a11y.ariaTitle'),  body: t('checkbox.a11y.ariaBody') },
                { title: t('checkbox.a11y.labelTitle'), body: t('checkbox.a11y.labelBody') },
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
      title={t('checkbox.page.title')}
      description={t('checkbox.page.description')}
      tabs={tabs}
    />
  )
}
