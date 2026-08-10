import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel, GridWrapper } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { TextInput } from '../components'

const BASIC_CODE = `import { TextInput } from '@/components'

<TextInput
  label="E-Mail-Adresse"
  type="email"
  icon="mail"
  placeholder="name@praxis.de"
  hint="Wir verwenden die Adresse nur für Terminbestätigungen."
/>`

const STATES_CODE = `{/* Fehler nennt Ursache und nächsten Schritt */}
<TextInput label="E-Mail-Adresse" defaultValue="anna@"
           error="Die Adresse ist unvollständig. Ergänzen Sie den Teil nach dem @." />

<TextInput label="E-Mail-Adresse" defaultValue="anna.berg@praxis.de"
           success="Adresse bestätigt." />

<TextInput label="Kundennummer" value="K-0002" readOnly />
<TextInput label="Abrechnungskonto" value="Nicht bearbeitbar" disabled />`

const FLOAT_CODE = `{/* Ausnahme für dichte Formulare — nie mit festen Labels mischen */}
<TextInput label="Vollständiger Name" floatingLabel />`

const FEATURES_CODE = `<TextInput label="Suchbegriff" clearable defaultValue="Befundbericht" />
<TextInput label="Passwort" type="password" defaultValue="geheim123" />
<TextInput label="Kurzprofil" optional maxLength={100} showCounter />
<TextInput label="Website" prefix="https://" suffix=".de" defaultValue="meine-praxis" />`

export default function TextInputPage() {
  const { t } = useTranslation()

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={(values) => (
              <TextInput
                label={t('textInput.demo.label')}
                floatingLabel={values.floatingLabel}
                type={values.type}
                size={values.size}
                icon={values.icon ? 'mail' : undefined}
                placeholder={values.placeholder ? t('textInput.demo.placeholder') : undefined}
                prefix={values.affixes ? 'https://' : undefined}
                suffix={values.affixes ? '.de' : undefined}
                maxLength={values.counter ? 100 : undefined}
                showCounter={values.counter}
                clearable={values.clearable}
                required={values.required}
                optional={values.optional}
                disabled={values.disabled}
                readOnly={values.readOnly}
                hint={values.message === 'hint' ? t('textInput.demo.hint') : undefined}
                error={values.message === 'error' ? t('textInput.demo.error') : undefined}
                success={values.message === 'success' ? t('textInput.demo.success') : undefined}
                fullWidth={values.fullWidth}
                defaultValue={t('textInput.demo.value')}
                style={{ minWidth: '320px' }}
              />
            )}
            controls={[
              { id: 'size', type: 'dropdown', label: 'Size', options: ['sm', 'md', 'lg'], default: 'md' },
              { id: 'type', type: 'dropdown', label: 'Type', options: ['text', 'email', 'password', 'tel', 'url'], default: 'text' },
              { id: 'message', type: 'dropdown', label: 'Message', options: ['keine', 'hint', 'error', 'success'], default: 'hint' },
              { id: 'floatingLabel', type: 'toggle', label: 'Floating Label', default: false },
              { id: 'icon', type: 'toggle', label: 'Icon', default: false },
              { id: 'clearable', type: 'toggle', label: 'Clearable', default: false },
              { id: 'counter', type: 'toggle', label: 'Counter', default: false },
              { id: 'affixes', type: 'toggle', label: 'Prefix/Suffix', default: false },
              { id: 'placeholder', type: 'toggle', label: 'Placeholder', default: false },
              { id: 'required', type: 'toggle', label: 'Required', default: false },
              { id: 'optional', type: 'toggle', label: 'Optional', default: false },
              { id: 'readOnly', type: 'toggle', label: 'Readonly', default: false },
              { id: 'disabled', type: 'toggle', label: 'Disabled', default: false },
              { id: 'fullWidth', type: 'toggle', label: 'Full Width', default: false },
            ]}
          />

          <Section title={t('textInput.overview.anatomyTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-md)]">
                {t('textInput.overview.anatomyBody')}
              </p>
              <ul className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                <li>{t('textInput.overview.an1')}</li>
                <li>{t('textInput.overview.an2')}</li>
                <li>{t('textInput.overview.an3')}</li>
                <li>{t('textInput.overview.an4')}</li>
                <li>{t('textInput.overview.an5')}</li>
              </ul>
              <div className="max-w-[420px]">
                <TextInput
                  label={t('textInput.anatomy.label')}
                  required
                  icon="mail"
                  placeholder={t('textInput.anatomy.placeholder')}
                  success={t('textInput.anatomy.hint')}
                  defaultValue="anna.berg@praxis.de"
                />
              </div>
            </Content>
          </Section>

          <Section title={t('textInput.overview.statesTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('textInput.overview.statesBody')}
              </p>
              <GridWrapper>
                <TextInput label={t('textInput.states.default')} placeholder={t('textInput.demo.placeholder')} />
                <TextInput label={t('textInput.states.filled')} defaultValue="Anna Berg" />
                <TextInput label={t('textInput.states.error')} defaultValue="anna@" error={t('textInput.demo.error')} />
                <TextInput label={t('textInput.states.success')} defaultValue="anna.berg@praxis.de" success={t('textInput.demo.success')} />
                <TextInput label={t('textInput.states.readonly')} value="K-0002" readOnly />
                <TextInput label={t('textInput.states.disabled')} value={t('textInput.states.disabledValue')} disabled />
              </GridWrapper>
              <p className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] mt-[var(--medo-space-md)]">
                {t('textInput.overview.statesNote')}
              </p>
            </Content>
          </Section>

          <Section title={t('textInput.overview.sizesTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('textInput.overview.sizesBody')}
              </p>
              <div className="flex flex-col gap-[var(--medo-space-md)] max-w-[420px]">
                <TextInput size="sm" label="sm · 36 px" icon="person" placeholder="Name" />
                <TextInput size="md" label="md · 40 px" icon="person" placeholder="Name" />
                <TextInput size="lg" label="lg · 48 px" icon="person" placeholder="Name" />
              </div>
            </Content>
          </Section>

          <Section title={t('textInput.overview.floatTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('textInput.overview.floatBody')}
              </p>
              <GridWrapper>
                <TextInput floatingLabel label={t('textInput.float.empty')} />
                <TextInput floatingLabel label={t('textInput.float.filled')} defaultValue="Anna Berg" />
              </GridWrapper>
            </Content>
          </Section>

          <Section title={t('textInput.overview.featuresTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('textInput.overview.featuresBody')}
              </p>
              <GridWrapper>
                <TextInput label={t('textInput.features.clear')} clearable defaultValue="Befundbericht" />
                <TextInput label={t('textInput.features.password')} type="password" defaultValue="geheim123" />
                <TextInput label={t('textInput.features.counter')} optional maxLength={100} showCounter defaultValue="Kurzprofil der Praxis" />
                <TextInput label={t('textInput.features.affix')} prefix="https://" suffix=".de" defaultValue="meine-praxis" />
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
          <Section title={t('textInput.usage.labelTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('textInput.usage.labelBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('textInput.usage.messageTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('textInput.usage.messageBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('textInput.usage.sizeTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('textInput.usage.sizeBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('textInput.usage.widthTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('textInput.usage.widthBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('textInput.usage.iconTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('textInput.usage.iconBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('textInput.usage.readonlyTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('textInput.usage.readonlyBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('textInput.usage.doDontTitle')}>
            <Content>
              <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--medo-space-lg)]">
                <div className="border border-[var(--medo-border-subtle)] border-t-[3px] border-t-[var(--medo-success-solid)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-success-text)] mb-[var(--medo-space-sm)]">
                    {t('textInput.usage.doTitle')}
                  </p>
                  <ul className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                    <li>{t('textInput.usage.do1')}</li>
                    <li>{t('textInput.usage.do2')}</li>
                    <li>{t('textInput.usage.do3')}</li>
                  </ul>
                </div>
                <div className="border border-[var(--medo-border-subtle)] border-t-[3px] border-t-[var(--medo-error-solid)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-error-text)] mb-[var(--medo-space-sm)]">
                    {t('textInput.usage.dontTitle')}
                  </p>
                  <ul className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                    <li>{t('textInput.usage.dont1')}</li>
                    <li>{t('textInput.usage.dont2')}</li>
                    <li>{t('textInput.usage.dont3')}</li>
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
        <Section title={t('textInput.code.title')}>
          <Content>
            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)]">
              {t('textInput.code.basicTitle')}
            </p>
            <CodeBlock language="jsx">{BASIC_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('textInput.code.statesTitle')}
            </p>
            <CodeBlock language="jsx">{STATES_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('textInput.code.floatTitle')}
            </p>
            <CodeBlock language="jsx">{FLOAT_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('textInput.code.featuresTitle')}
            </p>
            <CodeBlock language="jsx">{FEATURES_CODE}</CodeBlock>
          </Content>
        </Section>
      ),
    },
    {
      id: 'accessibility',
      label: t('tabs.accessibility'),
      content: (
        <>
          <Section title={t('textInput.a11y.labelTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('textInput.a11y.labelBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('textInput.a11y.errorTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('textInput.a11y.errorBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('textInput.a11y.iconTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('textInput.a11y.iconBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('textInput.a11y.focusTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('textInput.a11y.focusBody')}
              </p>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title={t('textInput.page.title')}
      description={t('textInput.page.description')}
      tabs={tabs}
    />
  )
}
