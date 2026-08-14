import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { ProgressIndicator } from '../components'

const BASIC_CODE = `import { ProgressIndicator } from '@/components'

{/* current ist 0-basiert: alles davor gilt als erledigt */}
<ProgressIndicator
  current={1}
  ariaLabel="Antrag"
  steps={[
    { title: 'Angaben', subtitle: 'Name und Anschrift' },
    { title: 'Nachweise', subtitle: 'Zulassung und Haftpflicht' },
    { title: 'Prüfung', optional: true },
    { title: 'Abschluss' },
  ]}
/>`

const VERTICAL_CODE = `{/* Vertikal bei langen Titeln oder in schmalen Spalten */}
<ProgressIndicator orientation="vertical" current={2} steps={steps} />`

const ERROR_CODE = `{/* status setzt den Zustand fest, statt ihn aus current abzuleiten —
    für Fehler ist das nötig */}
<ProgressIndicator
  current={2}
  steps={[
    { title: 'Angaben' },
    { title: 'Nachweise', status: 'error', subtitle: 'Die Haftpflicht fehlt' },
    { title: 'Prüfung' },
  ]}
/>`

const CLICK_CODE = `{/* Mit onStepClick werden erledigte Schritte anklickbar.
    clickableDone={false} schaltet das ab, ohne den Rückruf zu entfernen. */}
<ProgressIndicator
  current={2}
  onStepClick={(index) => setSchritt(index)}
  steps={steps}
/>`

export default function ProgressIndicatorPage() {
  const { t } = useTranslation()
  const [schritt, setSchritt] = useState(2)

  const steps = [
    { title: t('progressIndicator.demo.s1'), subtitle: t('progressIndicator.demo.s1Sub') },
    { title: t('progressIndicator.demo.s2'), subtitle: t('progressIndicator.demo.s2Sub') },
    { title: t('progressIndicator.demo.s3'), subtitle: t('progressIndicator.demo.s3Sub'), optional: true },
    { title: t('progressIndicator.demo.s4') },
  ]

  const errorSteps = [
    { title: t('progressIndicator.demo.s1') },
    { title: t('progressIndicator.demo.s2'), status: 'error', subtitle: t('progressIndicator.demo.errorSub') },
    { title: t('progressIndicator.demo.s3') },
    { title: t('progressIndicator.demo.s4') },
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
                <ProgressIndicator
                  steps={
                    values.fehler
                      ? errorSteps
                      : values.subtitles
                        ? steps
                        : steps.map(({ subtitle, ...rest }) => rest)
                  }
                  current={Number(values.current)}
                  orientation={values.orientation}
                  onStepClick={values.clickable ? () => {} : undefined}
                  clickableDone={values.clickableDone}
                  ariaLabel={t('progressIndicator.demo.ariaLabel')}
                />
              </div>
            )}
            controls={[
              { id: 'orientation', type: 'dropdown', label: 'Orientation', options: ['horizontal', 'vertical'], default: 'horizontal' },
              { id: 'current', type: 'dropdown', label: 'Current', options: ['0', '1', '2', '3'], default: '1' },
              { id: 'subtitles', type: 'toggle', label: 'Subtitles', default: true },
              { id: 'fehler', type: 'toggle', label: 'Fehler-Schritt', default: false },
              { id: 'clickable', type: 'toggle', label: 'On Step Click', default: false },
              { id: 'clickableDone', type: 'toggle', label: 'Clickable Done', default: true },
            ]}
          />

          <Section title={t('progressIndicator.overview.statesTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-md)]">
                {t('progressIndicator.overview.statesBody')}
              </p>
              <ul className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                <li>{t('progressIndicator.overview.st1')}</li>
                <li>{t('progressIndicator.overview.st2')}</li>
                <li>{t('progressIndicator.overview.st3')}</li>
                <li>{t('progressIndicator.overview.st4')}</li>
              </ul>
              <ProgressIndicator current={1} steps={steps} ariaLabel={t('progressIndicator.demo.ariaLabel')} />
            </Content>
          </Section>

          <Section title={t('progressIndicator.overview.orientationTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('progressIndicator.overview.orientationBody')}
              </p>
              <div className="grid grid-cols-2 max-[1024px]:grid-cols-1 gap-[var(--medo-space-xl)]">
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-md)]">
                    horizontal
                  </p>
                  <ProgressIndicator current={2} steps={steps} ariaLabel={t('progressIndicator.demo.ariaLabel')} />
                </div>
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-md)]">
                    vertical
                  </p>
                  <ProgressIndicator orientation="vertical" current={2} steps={steps} ariaLabel={t('progressIndicator.demo.ariaLabel')} />
                </div>
              </div>
            </Content>
          </Section>

          <Section title={t('progressIndicator.overview.errorTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('progressIndicator.overview.errorBody')}
              </p>
              <ProgressIndicator current={2} steps={errorSteps} ariaLabel={t('progressIndicator.demo.ariaLabel')} />
            </Content>
          </Section>

          <Section title={t('progressIndicator.overview.clickTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('progressIndicator.overview.clickBody')}
              </p>
              <ProgressIndicator
                current={schritt}
                onStepClick={(index) => setSchritt(index)}
                steps={steps}
                ariaLabel={t('progressIndicator.demo.ariaLabel')}
              />
              <p className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] mt-[var(--medo-space-md)]">
                {t('progressIndicator.demo.clickHint')}
              </p>
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
          <Section title={t('progressIndicator.usage.whenTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('progressIndicator.usage.whenBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('progressIndicator.usage.countTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('progressIndicator.usage.countBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('progressIndicator.usage.errorTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('progressIndicator.usage.errorBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('progressIndicator.usage.backTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('progressIndicator.usage.backBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('progressIndicator.usage.doDontTitle')}>
            <Content>
              <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--medo-space-lg)]">
                <div className="border border-[var(--medo-border-subtle)] border-t-[3px] border-t-[var(--medo-success-solid)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-success-text)] mb-[var(--medo-space-sm)]">
                    {t('progressIndicator.usage.doTitle')}
                  </p>
                  <ul className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                    <li>{t('progressIndicator.usage.do1')}</li>
                    <li>{t('progressIndicator.usage.do2')}</li>
                    <li>{t('progressIndicator.usage.do3')}</li>
                  </ul>
                </div>
                <div className="border border-[var(--medo-border-subtle)] border-t-[3px] border-t-[var(--medo-error-solid)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-error-text)] mb-[var(--medo-space-sm)]">
                    {t('progressIndicator.usage.dontTitle')}
                  </p>
                  <ul className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                    <li>{t('progressIndicator.usage.dont1')}</li>
                    <li>{t('progressIndicator.usage.dont2')}</li>
                    <li>{t('progressIndicator.usage.dont3')}</li>
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
        <Section title={t('progressIndicator.code.title')}>
          <Content>
            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)]">
              {t('progressIndicator.code.basicTitle')}
            </p>
            <CodeBlock language="jsx">{BASIC_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('progressIndicator.code.verticalTitle')}
            </p>
            <CodeBlock language="jsx">{VERTICAL_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('progressIndicator.code.errorTitle')}
            </p>
            <CodeBlock language="jsx">{ERROR_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('progressIndicator.code.clickTitle')}
            </p>
            <CodeBlock language="jsx">{CLICK_CODE}</CodeBlock>
          </Content>
        </Section>
      ),
    },
    {
      id: 'accessibility',
      label: t('tabs.accessibility'),
      content: (
        <>
          <Section title={t('progressIndicator.a11y.rolesTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('progressIndicator.a11y.rolesBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('progressIndicator.a11y.currentTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('progressIndicator.a11y.currentBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('progressIndicator.a11y.colorTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('progressIndicator.a11y.colorBody')}
              </p>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title={t('progressIndicator.page.title')}
      description={t('progressIndicator.page.description')}
      tabs={tabs}
    />
  )
}
