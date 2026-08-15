import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Notification, toast, Button } from '../components'

const PROSE = 'text-[var(--medo-text-muted)] [font-family:var(--medo-font-sans)] [font-size:var(--medo-text-base)] [line-height:var(--medo-leading-relaxed)]'
const CAPTION = '[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-xs)] text-[var(--medo-text-muted)]'
const STACK = 'flex flex-col gap-[var(--medo-space-sm)] mt-[var(--medo-space-md)] max-w-[640px]'
const LIST = `${PROSE} list-disc pl-[var(--medo-space-lg)] space-y-[var(--medo-space-3xs)]`

const KINDS = ['info', 'success', 'warning', 'error', 'neutral']

const INLINE_CODE = `import { Notification } from '@/components'

<Notification kind="success" title="Termin gespeichert" />

<Notification kind="error" title="Termin konnte nicht gespeichert werden">
  Die Verbindung wurde unterbrochen. Prüfen Sie das Netzwerk und speichern Sie erneut.
</Notification>`

const ACTION_CODE = `<Notification
  kind="warning"
  title="Abrechnung unvollständig"
  action={{ label: 'Jetzt ergänzen', onClick: () => oeffneAbrechnung() }}
  onClose={() => setSichtbar(false)}
>
  Für drei Termine fehlt die Ziffer. Ergänzen Sie sie vor dem Quartalsende.
</Notification>`

const TOAST_CODE = `import { ToastHost, toast } from '@/components'

{/* Einmal pro Anwendung einhängen, ganz oben */}
<ToastHost />

{/* Von überall auslösen */}
toast({ kind: 'success', title: 'Termin gespeichert' })
toast({ kind: 'error', title: 'Speichern fehlgeschlagen', description: 'Die Verbindung wurde unterbrochen.' })

{/* Vorzeitig schließen */}
const id = toast('Wird verarbeitet')
toast.dismiss(id)`

export default function NotificationPage() {
  const { t } = useTranslation()

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={values => (
              <div className="w-full max-w-[520px]">
                <Notification
                  kind={values.kind}
                  emphasis={values.emphasis}
                  title={t('notification.demo.title')}
                  action={values.action ? { label: t('notification.demo.actionLabel'), onClick: () => {} } : undefined}
                  onClose={values.closable ? () => {} : undefined}
                >
                  {values.description ? t('notification.demo.description') : undefined}
                </Notification>
              </div>
            )}
            controls={[
              { id: 'kind', type: 'dropdown', label: t('notification.controls.kind'), options: KINDS, default: 'info' },
              { id: 'emphasis', type: 'dropdown', label: t('notification.controls.emphasis'), options: ['soft', 'solid'], default: 'soft' },
              { id: 'description', type: 'toggle', label: t('notification.controls.description'), default: true },
              { id: 'action', type: 'toggle', label: t('notification.controls.action'), default: false },
              { id: 'closable', type: 'toggle', label: t('notification.controls.closable'), default: false },
            ]}
          />

          <Section title={t('notification.overview.kindsTitle')}>
            <Content>
              <p className={PROSE}>{t('notification.overview.kindsBody')}</p>
              <div className={STACK}>
                {KINDS.map(kind => (
                  <Notification key={kind} kind={kind} title={t(`notification.demo.kinds.${kind}`)} />
                ))}
              </div>
            </Content>
          </Section>

          <Section title={t('notification.overview.emphasisTitle')}>
            <Content>
              <p className={PROSE}>{t('notification.overview.emphasisBody')}</p>
              <div className={STACK}>
                <Notification kind="error" title={t('notification.demo.errorTitle')}>
                  {t('notification.demo.errorBody')}
                </Notification>
                <span className={CAPTION}>emphasis="soft"</span>
                <Notification kind="error" emphasis="solid" title={t('notification.demo.errorTitle')}>
                  {t('notification.demo.errorBody')}
                </Notification>
                <span className={CAPTION}>emphasis="solid"</span>
              </div>
            </Content>
          </Section>

          <Section title={t('notification.overview.singleTitle')}>
            <Content>
              <p className={PROSE}>{t('notification.overview.singleBody')}</p>
              <div className={STACK}>
                <Notification kind="success" title={t('notification.demo.savedTitle')} />
                <Notification
                  kind="info"
                  title={t('notification.demo.singleWithAction')}
                  action={{ label: t('notification.demo.actionLabel'), onClick: () => {} }}
                />
              </div>
            </Content>
          </Section>

          <Section title={t('notification.overview.actionTitle')}>
            <Content>
              <p className={PROSE}>{t('notification.overview.actionBody')}</p>
              <div className={STACK}>
                <Notification
                  kind="warning"
                  title={t('notification.demo.billingTitle')}
                  action={{ label: t('notification.demo.billingAction'), onClick: () => {} }}
                  onClose={() => {}}
                >
                  {t('notification.demo.billingBody')}
                </Notification>
              </div>
            </Content>
          </Section>

          <Section title={t('notification.overview.iconTitle')}>
            <Content>
              <p className={PROSE}>{t('notification.overview.iconBody')}</p>
              <div className={STACK}>
                <Notification kind="info" icon="event_upcoming" title={t('notification.demo.iconTitle')}>
                  {t('notification.demo.iconBody')}
                </Notification>
              </div>
            </Content>
          </Section>

          <Section title={t('notification.overview.toastTitle')}>
            <Content>
              <p className={PROSE}>{t('notification.overview.toastBody')}</p>
              <div className="flex flex-wrap gap-[var(--medo-space-sm)] mt-[var(--medo-space-md)]">
                <Button
                  variant="secondary"
                  onClick={() => toast({ kind: 'success', title: t('notification.demo.toastSaved') })}
                >
                  {t('notification.demo.toastSuccessBtn')}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() =>
                    toast({
                      kind: 'error',
                      title: t('notification.demo.toastErrorTitle'),
                      description: t('notification.demo.toastErrorBody'),
                    })
                  }
                >
                  {t('notification.demo.toastErrorBtn')}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    toast({ kind: 'info', title: t('notification.demo.toastQueued', { n: 1 }) })
                    toast({ kind: 'warning', title: t('notification.demo.toastQueued', { n: 2 }) })
                    toast({ kind: 'neutral', title: t('notification.demo.toastQueued', { n: 3 }) })
                  }}
                >
                  {t('notification.demo.toastStackBtn')}
                </Button>
              </div>
              <p className={`${CAPTION} mt-[var(--medo-space-sm)]`}>{t('notification.demo.toastHint')}</p>
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
          <Section title={t('notification.usage.whichTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('notification.usage.w1')}</li>
                <li>{t('notification.usage.w2')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('notification.usage.kindTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('notification.usage.kInfo')}</li>
                <li>{t('notification.usage.kSuccess')}</li>
                <li>{t('notification.usage.kWarning')}</li>
                <li>{t('notification.usage.kError')}</li>
                <li>{t('notification.usage.kNeutral')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('notification.usage.textTitle')}>
            <Content>
              <p className={PROSE}>{t('notification.usage.textBody')}</p>
            </Content>
          </Section>

          <Section title={t('notification.usage.dontTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('notification.usage.dont1')}</li>
                <li>{t('notification.usage.dont2')}</li>
                <li>{t('notification.usage.dont3')}</li>
                <li>{t('notification.usage.dont4')}</li>
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
        <Section title={t('notification.code.title')}>
          <Content>
            <p className={PROSE}>{t('notification.code.inlineDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{INLINE_CODE}</CodeBlock>
            </div>

            <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('notification.code.actionDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{ACTION_CODE}</CodeBlock>
            </div>

            <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('notification.code.toastDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{TOAST_CODE}</CodeBlock>
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
          <Section title={t('notification.a11y.rolesTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('notification.a11y.r1')}</li>
                <li>{t('notification.a11y.r2')}</li>
                <li>{t('notification.a11y.r3')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('notification.a11y.colorTitle')}>
            <Content>
              <p className={PROSE}>{t('notification.a11y.colorBody')}</p>
            </Content>
          </Section>

          <Section title={t('notification.a11y.timeTitle')}>
            <Content>
              <p className={PROSE}>{t('notification.a11y.timeBody')}</p>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title={t('notification.page.title')}
      description={t('notification.page.description')}
      tabs={tabs}
    />
  )
}
