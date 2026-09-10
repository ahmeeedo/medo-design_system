import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Textarea } from '../components'

const PROSE = 'text-[var(--medo-text-muted)] [font-family:var(--medo-font-sans)] [font-size:var(--medo-text-base)] [line-height:var(--medo-leading-relaxed)]'
const CAPTION = '[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-xs)] text-[var(--medo-text-muted)]'
const LIST = `${PROSE} list-disc pl-[var(--medo-space-lg)] space-y-[var(--medo-space-3xs)]`
const GRID = 'grid grid-cols-2 max-[768px]:grid-cols-1 gap-[var(--medo-space-lg)] mt-[var(--medo-space-md)]'

/* The demo text of the specification page, unchanged. */
const SAMPLE = 'Patient klagt über Beschwerden seit drei Tagen.'
const SAMPLE_LONG =
  'Ausführlicher Befund über mehrere Sätze. Setze so viele Zeilen, wie die erwartete Antwort ungefähr braucht.'

/* The three row counts the specification page shows side by side. */
const ROWS = ['2', '3', '6']

const BASIC_CODE = `import { Textarea } from '@/components'

<Textarea label="Befund" rows={5} hint="Wird in den Bericht uebernommen" />

{/* Pflichtfeld mit Grenze und Zaehler */}
<Textarea
  label="Begruendung"
  required
  maxLength={500}
  showCounter
  error="Bitte einen Befund eintragen"
/>

{/* Volle Breite des Elternelements */}
<Textarea label="Notiz" rows={2} fullWidth />`

const CONTROLLED_CODE = `const [befund, setBefund] = useState('')

<Textarea
  label="Befund"
  value={befund}
  onChange={e => setBefund(e.target.value)}
  maxLength={500}
  showCounter
/>`

const MESSAGE_CODE = `{/* Es erscheint immer nur eine Meldung:
    error verdraengt success, success verdraengt hint */}
<Textarea label="Befund" hint="Wird in den Bericht uebernommen" />
<Textarea label="Befund" success="Gespeichert" />
<Textarea label="Befund" error="Bitte einen Befund eintragen" />`

export default function TextareaPage() {
  const { t } = useTranslation()

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={values => (
              <div className="w-full max-w-[420px]">
                <Textarea
                  label={t('textarea.demo.label')}
                  placeholder={values.placeholder ? t('textarea.demo.placeholder') : undefined}
                  rows={Number(values.rows)}
                  required={values.required}
                  optional={values.optional}
                  hint={values.hint ? t('textarea.demo.hint') : undefined}
                  error={values.error ? t('textarea.demo.error') : undefined}
                  success={values.success ? t('textarea.demo.success') : undefined}
                  maxLength={500}
                  showCounter={values.counter}
                  fullWidth={values.fullWidth}
                  disabled={values.disabled}
                  readOnly={values.readOnly}
                />
              </div>
            )}
            controls={[
              {
                id: 'rows',
                type: 'dropdown',
                label: t('textarea.controls.rows'),
                options: ROWS,
                default: '3',
              },
              { id: 'placeholder', type: 'toggle', label: t('textarea.controls.placeholder'), default: true },
              { id: 'required', type: 'toggle', label: t('textarea.controls.required'), default: false },
              {
                id: 'optional',
                type: 'toggle',
                label: t('textarea.controls.optional'),
                default: false,
                /* Field renders `optional && !required`. */
                visibleWhen: v => !v.required,
              },
              {
                id: 'hint',
                type: 'toggle',
                label: t('textarea.controls.hint'),
                default: false,
                /* Field shows `error || success || hint` — one message only. */
                visibleWhen: v => !v.error && !v.success,
              },
              { id: 'error', type: 'toggle', label: t('textarea.controls.error'), default: false },
              {
                id: 'success',
                type: 'toggle',
                label: t('textarea.controls.success'),
                default: false,
                visibleWhen: v => !v.error,
              },
              { id: 'counter', type: 'toggle', label: t('textarea.controls.counter'), default: false },
              { id: 'fullWidth', type: 'toggle', label: t('textarea.controls.fullWidth'), default: false },
              { id: 'disabled', type: 'toggle', label: t('textarea.controls.disabled'), default: false },
              {
                id: 'readOnly',
                type: 'toggle',
                label: t('textarea.controls.readOnly'),
                default: false,
                /* The read-only look only lands while the field is not disabled:
                   the box class is `readOnly && !disabled`. */
                visibleWhen: v => !v.disabled,
              },
            ]}
            presets={[
              { id: 'standard', label: t('textarea.presets.standard'), values: {} },
              { id: 'hint', label: t('textarea.presets.hint'), values: { hint: true } },
              { id: 'error', label: t('textarea.presets.error'), values: { error: true } },
              { id: 'success', label: t('textarea.presets.success'), values: { success: true } },
              { id: 'disabled', label: t('textarea.presets.disabled'), values: { disabled: true } },
              { id: 'readOnly', label: t('textarea.presets.readOnly'), values: { readOnly: true } },
              { id: 'counter', label: t('textarea.presets.counter'), values: { counter: true } },
              { id: 'sixRows', label: t('textarea.presets.sixRows'), values: { rows: '6' } },
              { id: 'fullWidth', label: t('textarea.presets.fullWidth'), values: { fullWidth: true } },
            ]}
          />

          <Section title={t('textarea.overview.statesTitle')}>
            <Content>
              <p className={PROSE}>{t('textarea.overview.statesBody')}</p>
              <div className={GRID}>
                <Textarea label={t('textarea.states.rest')} rows={2} defaultValue={SAMPLE} />
                <Textarea
                  label={t('textarea.states.placeholder')}
                  rows={2}
                  placeholder={t('textarea.demo.placeholder')}
                />
                <Textarea
                  label={t('textarea.states.hint')}
                  rows={2}
                  placeholder={t('textarea.demo.placeholder')}
                  hint={t('textarea.demo.hint')}
                />
                <Textarea
                  label={t('textarea.states.error')}
                  rows={2}
                  placeholder={t('textarea.demo.placeholder')}
                  error={t('textarea.demo.error')}
                />
                <Textarea
                  label={t('textarea.states.success')}
                  rows={2}
                  defaultValue={t('textarea.demo.successValue')}
                  success={t('textarea.demo.success')}
                />
                <Textarea
                  label={t('textarea.states.disabled')}
                  rows={2}
                  defaultValue={t('textarea.demo.disabledValue')}
                  disabled
                />
                <Textarea
                  label={t('textarea.states.readOnly')}
                  rows={2}
                  defaultValue={SAMPLE}
                  readOnly
                />
              </div>
              <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('textarea.overview.statesNote')}</p>
            </Content>
          </Section>

          <Section title={t('textarea.overview.sizeTitle')}>
            <Content>
              <p className={PROSE}>{t('textarea.overview.sizeBody')}</p>
              <div className={GRID}>
                <div>
                  <Textarea label={t('textarea.size.lookLabel')} rows={3} defaultValue={SAMPLE} />
                  <p className={`${CAPTION} mt-[var(--medo-space-xs)]`}>{t('textarea.size.lookCaption')}</p>
                </div>
                <div>
                  <Textarea
                    label={t('textarea.size.dragLabel')}
                    rows={3}
                    defaultValue={t('textarea.size.dragValue')}
                  />
                  <p className={`${CAPTION} mt-[var(--medo-space-xs)]`}>{t('textarea.size.dragCaption')}</p>
                </div>
              </div>
              <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('textarea.overview.sizeNote')}</p>
            </Content>
          </Section>

          <Section title={t('textarea.overview.rowsTitle')}>
            <Content>
              <p className={PROSE}>{t('textarea.overview.rowsBody')}</p>
              <div className="grid grid-cols-3 max-[768px]:grid-cols-1 gap-[var(--medo-space-lg)] mt-[var(--medo-space-md)]">
                <Textarea label="rows={2}" rows={2} defaultValue={t('textarea.rows.short')} />
                <Textarea label="rows={3}" rows={3} defaultValue={SAMPLE} />
                <Textarea label="rows={6}" rows={6} defaultValue={SAMPLE_LONG} />
              </div>
            </Content>
          </Section>

          <Section title={t('textarea.overview.counterTitle')}>
            <Content>
              <p className={PROSE}>{t('textarea.overview.counterBody')}</p>
              <div className={GRID}>
                <Textarea
                  label={t('textarea.counter.with')}
                  rows={3}
                  defaultValue={SAMPLE}
                  maxLength={500}
                  showCounter
                />
                <Textarea
                  label={t('textarea.counter.without')}
                  rows={3}
                  defaultValue={SAMPLE}
                  showCounter
                />
              </div>
              <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('textarea.overview.counterNote')}</p>
            </Content>
          </Section>

          <Section title={t('textarea.overview.fullWidthTitle')}>
            <Content>
              <p className={PROSE}>{t('textarea.overview.fullWidthBody')}</p>
              <div className="mt-[var(--medo-space-md)]">
                <Textarea
                  label={t('textarea.demo.label')}
                  rows={2}
                  placeholder={t('textarea.demo.placeholder')}
                  fullWidth
                />
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
          <Section title={t('textarea.usage.whenTitle')}>
            <Content>
              <p className={PROSE}>{t('textarea.usage.whenBody')}</p>
            </Content>
          </Section>

          <Section title={t('textarea.usage.rowsTitle')}>
            <Content>
              <p className={PROSE}>{t('textarea.usage.rowsBody')}</p>
            </Content>
          </Section>

          <Section title={t('textarea.usage.messageTitle')}>
            <Content>
              <p className={PROSE}>{t('textarea.usage.messageBody')}</p>
            </Content>
          </Section>

          <Section title={t('textarea.usage.doTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('textarea.usage.do1')}</li>
                <li>{t('textarea.usage.do2')}</li>
                <li>{t('textarea.usage.do3')}</li>
                <li>{t('textarea.usage.do4')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('textarea.usage.dontTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('textarea.usage.dont1')}</li>
                <li>{t('textarea.usage.dont2')}</li>
                <li>{t('textarea.usage.dont3')}</li>
                <li>{t('textarea.usage.dont4')}</li>
                <li>{t('textarea.usage.dont5')}</li>
                <li>{t('textarea.usage.dont6')}</li>
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
        <Section title={t('textarea.code.title')}>
          <Content>
            <p className={PROSE}>{t('textarea.code.basicDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{BASIC_CODE}</CodeBlock>
            </div>

            <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('textarea.code.controlledDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{CONTROLLED_CODE}</CodeBlock>
            </div>

            <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('textarea.code.messageDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{MESSAGE_CODE}</CodeBlock>
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
          <Section title={t('textarea.a11y.labelTitle')}>
            <Content>
              <p className={PROSE}>{t('textarea.a11y.labelBody')}</p>
            </Content>
          </Section>

          <Section title={t('textarea.a11y.messageTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('textarea.a11y.m1')}</li>
                <li>{t('textarea.a11y.m2')}</li>
                <li>{t('textarea.a11y.m3')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('textarea.a11y.keyboardTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('textarea.a11y.k1')}</li>
                <li>{t('textarea.a11y.k2')}</li>
              </ul>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title={t('textarea.page.title')}
      description={t('textarea.page.description')}
      tabs={tabs}
    />
  )
}
