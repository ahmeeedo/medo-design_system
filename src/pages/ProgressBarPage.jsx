import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { ProgressBar } from '../components'

const BASIC_CODE = `import { ProgressBar } from '@/components'

<ProgressBar
  value={42}
  label="Unterlagen werden übertragen"
  helper="2 von 6 Dateien"
  showValue
/>`

const INDETERMINATE_CODE = `{/* Ohne value läuft die Bahn unbestimmt weiter —
    für Vorgänge, deren Dauer nicht bekannt ist */}
<ProgressBar label="Verbindung wird geprüft" ariaLabel="Verbindung wird geprüft" />`

const STATUS_CODE = `<ProgressBar value={100} status="success" label="Übertragung"
             statusText="Alle Unterlagen wurden übertragen." />

<ProgressBar value={64} status="error" label="Übertragung"
             statusText="Die Verbindung wurde unterbrochen. Starten Sie die Übertragung erneut." />

<ProgressBar value={88} status="warning" label="Speicherplatz" showValue />`

const SIZE_CODE = `{/* thin misst 4px — z. B. am Kopf einer Karte, ohne Beschriftung */}
<ProgressBar value={30} size="thin" ariaLabel="Fortschritt" />

{/* max verschiebt den Bezug: 3 von 6 sind 50 % */}
<ProgressBar value={3} max={6} showValue label="Schritte" />`

export default function ProgressBarPage() {
  const { t } = useTranslation()

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={(values) => (
              <div className="w-full max-w-[440px]">
                <ProgressBar
                  value={values.unbestimmt ? undefined : Number(values.value)}
                  max={100}
                  label={values.label ? t('progressBar.demo.label') : undefined}
                  helper={values.helper ? t('progressBar.demo.helper') : undefined}
                  showValue={values.showValue}
                  status={values.status}
                  size={values.size}
                  statusText={values.statusText ? t('progressBar.demo.status.' + values.status) : undefined}
                  ariaLabel={t('progressBar.demo.label')}
                />
              </div>
            )}
            controls={[
              { id: 'value', type: 'dropdown', label: 'Value', options: ['0', '42', '88', '100'], default: '42' },
              { id: 'status', type: 'dropdown', label: 'Status', options: ['normal', 'success', 'warning', 'error'], default: 'normal' },
              { id: 'size', type: 'dropdown', label: 'Size', options: ['standard', 'thin'], default: 'standard' },
              { id: 'unbestimmt', type: 'toggle', label: 'Unbestimmt', default: false },
              { id: 'label', type: 'toggle', label: 'Label', default: true },
              { id: 'helper', type: 'toggle', label: 'Helper', default: true },
              { id: 'showValue', type: 'toggle', label: 'Show Value', default: true },
              { id: 'statusText', type: 'toggle', label: 'Status Text', default: false },
            ]}
          />

          <Section title={t('progressBar.overview.anatomyTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-md)]">
                {t('progressBar.overview.anatomyBody')}
              </p>
              <ul className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                <li>{t('progressBar.overview.an1')}</li>
                <li>{t('progressBar.overview.an2')}</li>
                <li>{t('progressBar.overview.an3')}</li>
              </ul>
              <div className="max-w-[440px]">
                <ProgressBar
                  value={42}
                  label={t('progressBar.demo.label')}
                  helper={t('progressBar.demo.helper')}
                  showValue
                />
              </div>
            </Content>
          </Section>

          <Section title={t('progressBar.overview.indeterminateTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('progressBar.overview.indeterminateBody')}
              </p>
              <div className="max-w-[440px]">
                <ProgressBar label={t('progressBar.demo.checking')} ariaLabel={t('progressBar.demo.checking')} />
              </div>
            </Content>
          </Section>

          <Section title={t('progressBar.overview.statusTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('progressBar.overview.statusBody')}
              </p>
              <div className="flex flex-col gap-[var(--medo-space-lg)] max-w-[440px]">
                <ProgressBar value={42} label={t('progressBar.demo.label')} showValue />
                <ProgressBar
                  value={100}
                  status="success"
                  label={t('progressBar.demo.label')}
                  statusText={t('progressBar.demo.status.success')}
                />
                <ProgressBar
                  value={88}
                  status="warning"
                  label={t('progressBar.demo.storage')}
                  showValue
                  statusText={t('progressBar.demo.status.warning')}
                />
                <ProgressBar
                  value={64}
                  status="error"
                  label={t('progressBar.demo.label')}
                  statusText={t('progressBar.demo.status.error')}
                />
              </div>
            </Content>
          </Section>

          <Section title={t('progressBar.overview.sizesTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('progressBar.overview.sizesBody')}
              </p>
              <div className="flex flex-col gap-[var(--medo-space-lg)] max-w-[440px]">
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    standard · 8 px
                  </p>
                  <ProgressBar value={42} ariaLabel={t('progressBar.demo.label')} />
                </div>
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                    thin · 4 px
                  </p>
                  <ProgressBar value={42} size="thin" ariaLabel={t('progressBar.demo.label')} />
                </div>
              </div>
            </Content>
          </Section>

          <Section title={t('progressBar.overview.maxTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('progressBar.overview.maxBody')}
              </p>
              <div className="max-w-[440px]">
                <ProgressBar
                  value={3}
                  max={6}
                  showValue
                  label={t('progressBar.demo.steps')}
                  helper={t('progressBar.demo.stepsHelper')}
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
          <Section title={t('progressBar.usage.whenTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('progressBar.usage.whenBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('progressBar.usage.indeterminateTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('progressBar.usage.indeterminateBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('progressBar.usage.labelTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('progressBar.usage.labelBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('progressBar.usage.statusTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('progressBar.usage.statusBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('progressBar.usage.doDontTitle')}>
            <Content>
              <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--medo-space-lg)]">
                <div className="border border-[var(--medo-border-subtle)] border-t-[3px] border-t-[var(--medo-success-solid)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-success-text)] mb-[var(--medo-space-sm)]">
                    {t('progressBar.usage.doTitle')}
                  </p>
                  <ul className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                    <li>{t('progressBar.usage.do1')}</li>
                    <li>{t('progressBar.usage.do2')}</li>
                    <li>{t('progressBar.usage.do3')}</li>
                  </ul>
                </div>
                <div className="border border-[var(--medo-border-subtle)] border-t-[3px] border-t-[var(--medo-error-solid)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-error-text)] mb-[var(--medo-space-sm)]">
                    {t('progressBar.usage.dontTitle')}
                  </p>
                  <ul className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                    <li>{t('progressBar.usage.dont1')}</li>
                    <li>{t('progressBar.usage.dont2')}</li>
                    <li>{t('progressBar.usage.dont3')}</li>
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
        <Section title={t('progressBar.code.title')}>
          <Content>
            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)]">
              {t('progressBar.code.basicTitle')}
            </p>
            <CodeBlock language="jsx">{BASIC_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('progressBar.code.indeterminateTitle')}
            </p>
            <CodeBlock language="jsx">{INDETERMINATE_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('progressBar.code.statusTitle')}
            </p>
            <CodeBlock language="jsx">{STATUS_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('progressBar.code.sizeTitle')}
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
          <Section title={t('progressBar.a11y.roleTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('progressBar.a11y.roleBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('progressBar.a11y.labelTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('progressBar.a11y.labelBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('progressBar.a11y.colorTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('progressBar.a11y.colorBody')}
              </p>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title={t('progressBar.page.title')}
      description={t('progressBar.page.description')}
      tabs={tabs}
    />
  )
}
