import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Alert, Toast } from '../components'

const VARIANTS_CODE = `import { Alert } from '@/components'

<Alert variant="info" title="Hinweis">
  Diese Aktion erfordert zusätzliche Bestätigung deiner E-Mail-Adresse.
</Alert>

<Alert variant="success" title="Erfolgreich gespeichert">
  Deine Profileinstellungen wurden übernommen.
</Alert>

<Alert variant="warning" title="Achtung">
  Diese Aktion kann nicht rückgängig gemacht werden.
</Alert>

<Alert variant="error" title="Fehler aufgetreten">
  Die Verbindung zum Server konnte nicht hergestellt werden. Bitte erneut versuchen.
</Alert>`

const NO_TITLE_CODE = `{/* title-Prop ist optional — nur children wird angezeigt */}
<Alert variant="info">
  Du wirst in 15 Minuten automatisch abgemeldet.
</Alert>

<Alert variant="warning">
  Deine Sitzung läuft in Kürze ab.
</Alert>`

const INLINE_CODE = `function ContactForm() {
  const [status, setStatus] = useState(null)

  const handleSubmit = async () => {
    try {
      await submitForm()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {status === 'success' && (
        <Alert variant="success" title="Nachricht gesendet">
          Wir melden uns innerhalb von 24 Stunden.
        </Alert>
      )}
      {status === 'error' && (
        <Alert variant="error" title="Senden fehlgeschlagen">
          Bitte überprüfe deine Internetverbindung und versuche es erneut.
        </Alert>
      )}
      {/* Formularfelder ... */}
      <button type="submit">Absenden</button>
    </form>
  )
}`

const TOAST_CODE = `import { Toast } from '@/components'

{/* Toast für flüchtige Erfolgsmeldungen */}
<Toast action="Rückgängig" onAction={() => undoLastAction()}>
  Änderungen gespeichert
</Toast>

{/* Toast ohne Aktion */}
<Toast>Datei hochgeladen</Toast>`

const ALERT_VARIANTS = [
  { variant: 'info',    title: 'Hinweis',                 body: 'Diese Aktion erfordert zusätzliche Bestätigung.' },
  { variant: 'success', title: 'Erfolgreich gespeichert', body: 'Deine Änderungen wurden übernommen.' },
  { variant: 'warning', title: 'Achtung',                 body: 'Diese Aktion kann nicht rückgängig gemacht werden.' },
  { variant: 'error',   title: 'Fehler aufgetreten',      body: 'Die Verbindung zum Server konnte nicht hergestellt werden.' },
]

export default function AlertsPage() {
  const { t } = useTranslation()

  const doDont = ['1', '2', '3'].map(n => ({ do: `do${n}`, dont: `dont${n}` }))

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={(values) => (
              <Alert variant={values.variant}>Alert message</Alert>
            )}
            controls={[
              { id: 'variant', type: 'dropdown', label: 'Variant', options: ['info', 'success', 'warning', 'error'], default: 'info' },
            ]}
          />
          <Section title={t('alerts.overview.anatomyTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-3)]">
                {t('alerts.overview.anatomyBody')}
              </p>
              <ol className="flex flex-col gap-[var(--space-2)] pl-[var(--space-5)]">
                {['an1', 'an2', 'an3', 'an4'].map(k => (
                  <li key={k} className="text-sm text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                    {t(`alerts.overview.${k}`)}
                  </li>
                ))}
              </ol>
            </Content>
          </Section>

          <Section title={t('alerts.overview.variantsTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('alerts.overview.variantsBody')}
              </p>
            </Content>
            <div className="flex flex-col gap-[var(--space-3)] max-w-[640px]">
              {ALERT_VARIANTS.map(({ variant, title, body }) => (
                <Alert key={variant} variant={variant} title={title}>
                  {body}
                </Alert>
              ))}
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
          <Section title={t('alerts.usage.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('alerts.usage.intro')}
              </p>
            </Content>
          </Section>

          <Section title={t('alerts.usage.variantTitle')}>
            <div className="flex flex-col gap-[var(--space-1)] border border-[var(--border-subtle-100)] rounded-[var(--radius-lg)] overflow-hidden mb-[var(--space-6)]">
              {[
                { key: 'infoWhen',    label: 'info' },
                { key: 'successWhen', label: 'success' },
                { key: 'warningWhen', label: 'warning' },
                { key: 'errorWhen',   label: 'error' },
              ].map(({ key, label }, i) => (
                <div key={key} className={`flex items-start gap-[var(--space-4)] px-[var(--space-4)] py-[var(--space-3)] ${i % 2 === 0 ? 'bg-[var(--surface_100)]' : 'bg-[var(--surface_200)]'}`}>
                  <span className="text-xs [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] shrink-0 min-w-[64px] pt-[2px]">{label}</span>
                  <span className="text-sm text-[var(--color-text-secondary)]">{t(`alerts.usage.${key}`)}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title={t('alerts.usage.placementTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('alerts.usage.placementBody')}
              </p>
            </Content>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)]">
              <div className="bg-[var(--color-success-container-100)] border border-[var(--color-success)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('alerts.usage.doTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ do: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-success)] shrink-0">✓</span>
                      <span>{t(`alerts.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('alerts.usage.doNote')}
                </div>
              </div>
              <div className="bg-[var(--color-error-container-100)] border border-[var(--color-error)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('alerts.usage.dontTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ dont: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-error)] shrink-0">✗</span>
                      <span>{t(`alerts.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('alerts.usage.dontNote')}
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
          <Section title={t('alerts.code.title')}>
            <Content>
              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">
                {t('alerts.code.variantsTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('alerts.code.variantsDesc')}
              </p>
              <CodeBlock language="jsx">{VARIANTS_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('alerts.code.noTitleTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('alerts.code.noTitleDesc')}
              </p>
              <CodeBlock language="jsx">{NO_TITLE_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('alerts.code.inlineTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('alerts.code.inlineDesc')}
              </p>
              <CodeBlock language="jsx">{INLINE_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('alerts.code.toastTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('alerts.code.toastDesc')}
              </p>
              <div className="mb-[var(--space-4)]">
                <Toast action="Rückgängig" onAction={() => {}}>Änderungen gespeichert</Toast>
              </div>
              <CodeBlock language="jsx">{TOAST_CODE}</CodeBlock>
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
          <Section title={t('alerts.a11y.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('alerts.a11y.intro')}
              </p>
            </Content>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)]">
              {[
                { title: t('alerts.a11y.roleTitle'),  body: t('alerts.a11y.roleBody') },
                { title: t('alerts.a11y.colorTitle'), body: t('alerts.a11y.colorBody') },
                { title: t('alerts.a11y.focusTitle'), body: t('alerts.a11y.focusBody') },
              ].map(({ title, body }) => (
                <div key={title} className="bg-[var(--surface-container_100)] rounded-[var(--radius-lg)] p-[var(--space-5)] border border-[var(--border-subtle-100)]">
                  <div className="text-md [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">{title}</div>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">{body}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Keyboard & Screen Reader">
            <div className="border border-[var(--border-subtle-100)] rounded-[var(--radius-lg)] overflow-hidden">
              {['k1', 'k2'].map((k, i) => (
                <div key={k} className={`flex items-center gap-[var(--space-4)] px-[var(--space-4)] py-[var(--space-3)] ${i % 2 === 0 ? 'bg-[var(--surface_100)]' : 'bg-[var(--surface_200)]'}`}>
                  <span className="text-sm text-[var(--color-text-secondary)]">{t(`alerts.a11y.${k}`)}</span>
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
      title="Alerts"
      description={t('alerts.page.description')}
      tabs={tabs}
    />
  )
}
