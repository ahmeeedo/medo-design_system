import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { InlineLoading, Button } from '../components'

const BASIC_CODE = `import { InlineLoading } from '@/components'

<InlineLoading label="Wird gespeichert …" />
<InlineLoading status="success" label="Gespeichert" />
<InlineLoading status="error" label="Nicht gespeichert — Verbindung prüfen" />
<InlineLoading status="inactive" label="Noch nicht geprüft" />`

const BUTTON_CODE = `{/* In einer gefüllten Schaltfläche ist inherit Pflicht —
    sonst stünde teal auf teal und die Punkte wären unsichtbar */}
<Button variant="primary" disabled>
  Anfrage senden <InlineLoading size="sm" inherit />
</Button>`

const FLOW_CODE = `{/* Der Erfolgszustand bleibt etwa zwei Sekunden stehen und verschwindet dann.
    Ein Fehler bleibt, bis die Person etwas tut. */}
const [status, setStatus] = useState('inactive')

async function speichern() {
  setStatus('loading')
  try {
    await sichern()
    setStatus('success')
    setTimeout(() => setStatus('inactive'), 2000)
  } catch {
    setStatus('error')
  }
}

<InlineLoading status={status} label={LABELS[status]} />`

const SIZE_CODE = `{/* sm neben text-sm und in Schaltflächen, md daneben im Fließtext */}
<InlineLoading size="sm" label="Wird geprüft …" />
<InlineLoading size="md" label="Wird geprüft …" />`

export default function InlineLoadingPage() {
  const { t } = useTranslation()

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={(values) =>
              values.inButton ? (
                <Button variant="primary" disabled>
                  {t('inlineLoading.demo.buttonLabel')}{' '}
                  <InlineLoading
                    status={values.status}
                    size={values.size}
                    inherit={values.inherit}
                    label={values.label ? t('inlineLoading.demo.' + values.status) : undefined}
                  />
                </Button>
              ) : (
                <InlineLoading
                  status={values.status}
                  size={values.size}
                  inherit={values.inherit}
                  label={values.label ? t('inlineLoading.demo.' + values.status) : undefined}
                />
              )
            }
            controls={[
              { id: 'status', type: 'dropdown', label: 'Status', options: ['loading', 'success', 'error', 'inactive'], default: 'loading' },
              { id: 'size', type: 'dropdown', label: 'Size', options: ['sm', 'md'], default: 'md' },
              { id: 'label', type: 'toggle', label: 'Label', default: true },
              { id: 'inButton', type: 'toggle', label: 'In Schaltfläche', default: false },
              { id: 'inherit', type: 'toggle', label: 'Inherit', default: false },
            ]}
          />

          <Section title={t('inlineLoading.overview.statesTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('inlineLoading.overview.statesBody')}
              </p>
              <div className="flex flex-col gap-[var(--medo-space-md)]">
                <InlineLoading status="loading" label={t('inlineLoading.demo.loading')} />
                <InlineLoading status="success" label={t('inlineLoading.demo.success')} />
                <InlineLoading status="error" label={t('inlineLoading.demo.error')} />
                <InlineLoading status="inactive" label={t('inlineLoading.demo.inactive')} />
              </div>
            </Content>
          </Section>

          <Section title={t('inlineLoading.overview.buttonTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('inlineLoading.overview.buttonBody')}
              </p>
              <div className="flex flex-wrap gap-[var(--medo-space-lg)] items-center">
                <div className="flex flex-col gap-[var(--medo-space-xs)]">
                  <span className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)]">
                    {t('inlineLoading.button.withInherit')}
                  </span>
                  <Button variant="primary" disabled>
                    {t('inlineLoading.demo.buttonLabel')} <InlineLoading size="sm" inherit />
                  </Button>
                </div>
                <div className="flex flex-col gap-[var(--medo-space-xs)]">
                  <span className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)]">
                    {t('inlineLoading.button.withoutInherit')}
                  </span>
                  <Button variant="primary" disabled>
                    {t('inlineLoading.demo.buttonLabel')} <InlineLoading size="sm" />
                  </Button>
                </div>
              </div>
            </Content>
          </Section>

          <Section title={t('inlineLoading.overview.sizesTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('inlineLoading.overview.sizesBody')}
              </p>
              <div className="flex flex-col gap-[var(--medo-space-md)]">
                <InlineLoading size="sm" label={t('inlineLoading.demo.loading')} />
                <InlineLoading size="md" label={t('inlineLoading.demo.loading')} />
              </div>
            </Content>
          </Section>

          <Section title={t('inlineLoading.overview.rowTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('inlineLoading.overview.rowBody')}
              </p>
              <div className="max-w-[520px] border border-[var(--medo-border)] rounded-[var(--medo-radius-lg)] bg-[var(--medo-surface)] divide-y divide-[var(--medo-divider)]">
                <div className="flex items-center justify-between gap-[var(--medo-space-md)] p-[var(--medo-space-md)]">
                  <span className="[font-size:var(--medo-text-sm)] text-[var(--medo-text)]">
                    {t('inlineLoading.row.r1')}
                  </span>
                  <InlineLoading size="sm" label={t('inlineLoading.demo.loading')} />
                </div>
                <div className="flex items-center justify-between gap-[var(--medo-space-md)] p-[var(--medo-space-md)]">
                  <span className="[font-size:var(--medo-text-sm)] text-[var(--medo-text)]">
                    {t('inlineLoading.row.r2')}
                  </span>
                  <InlineLoading size="sm" status="success" label={t('inlineLoading.demo.success')} />
                </div>
                <div className="flex items-center justify-between gap-[var(--medo-space-md)] p-[var(--medo-space-md)]">
                  <span className="[font-size:var(--medo-text-sm)] text-[var(--medo-text)]">
                    {t('inlineLoading.row.r3')}
                  </span>
                  <InlineLoading size="sm" status="error" label={t('inlineLoading.demo.error')} />
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
          <Section title={t('inlineLoading.usage.whenTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('inlineLoading.usage.whenBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('inlineLoading.usage.flowTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('inlineLoading.usage.flowBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('inlineLoading.usage.labelTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('inlineLoading.usage.labelBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('inlineLoading.usage.inheritTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('inlineLoading.usage.inheritBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('inlineLoading.usage.doDontTitle')}>
            <Content>
              <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--medo-space-lg)]">
                <div className="border border-[var(--medo-border-subtle)] border-t-[3px] border-t-[var(--medo-success-solid)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-success-text)] mb-[var(--medo-space-sm)]">
                    {t('inlineLoading.usage.doTitle')}
                  </p>
                  <ul className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                    <li>{t('inlineLoading.usage.do1')}</li>
                    <li>{t('inlineLoading.usage.do2')}</li>
                    <li>{t('inlineLoading.usage.do3')}</li>
                  </ul>
                </div>
                <div className="border border-[var(--medo-border-subtle)] border-t-[3px] border-t-[var(--medo-error-solid)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-error-text)] mb-[var(--medo-space-sm)]">
                    {t('inlineLoading.usage.dontTitle')}
                  </p>
                  <ul className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                    <li>{t('inlineLoading.usage.dont1')}</li>
                    <li>{t('inlineLoading.usage.dont2')}</li>
                    <li>{t('inlineLoading.usage.dont3')}</li>
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
        <Section title={t('inlineLoading.code.title')}>
          <Content>
            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)]">
              {t('inlineLoading.code.basicTitle')}
            </p>
            <CodeBlock language="jsx">{BASIC_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('inlineLoading.code.buttonTitle')}
            </p>
            <CodeBlock language="jsx">{BUTTON_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('inlineLoading.code.flowTitle')}
            </p>
            <CodeBlock language="jsx">{FLOW_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('inlineLoading.code.sizeTitle')}
            </p>
            <CodeBlock language="jsx">{SIZE_CODE}</CodeBlock>
          </Content>
        </Section>
      ),
    },
    {
      id: 'accessibility',
      label: t('tabs.accessibility'),
      content: (
        <>
          <Section title={t('inlineLoading.a11y.liveTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('inlineLoading.a11y.liveBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('inlineLoading.a11y.dotsTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('inlineLoading.a11y.dotsBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('inlineLoading.a11y.colorTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('inlineLoading.a11y.colorBody')}
              </p>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title={t('inlineLoading.page.title')}
      description={t('inlineLoading.page.description')}
      tabs={tabs}
    />
  )
}
