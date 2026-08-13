import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Modal, Button, TextInput } from '../components'

const PROSE = 'text-[var(--medo-text-muted)] [font-family:var(--medo-font-sans)] [font-size:var(--medo-text-base)] [line-height:var(--medo-leading-relaxed)]'
const CAPTION = '[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-xs)] text-[var(--medo-text-muted)]'
const ROW = 'flex flex-wrap items-center gap-[var(--medo-space-sm)] mt-[var(--medo-space-md)]'
const LIST = `${PROSE} list-disc pl-[var(--medo-space-lg)] space-y-[var(--medo-space-3xs)]`

const BASIC_CODE = `import { Modal } from '@/components'

const [offen, setOffen] = useState(false)

<Modal
  open={offen}
  onClose={() => setOffen(false)}
  title="Termin verschieben"
  subtitle="Die Patientin wird über die neue Zeit informiert."
  confirmLabel="Termin verschieben"
  onConfirm={verschieben}
>
  <TerminFormular />
</Modal>`

const DANGER_CODE = `{/* Zerstörend: sm, tone="danger", Icon im Kopf.
    Der Fokus liegt bewusst NICHT auf der roten Bestätigung. */}
<Modal
  open={offen}
  onClose={() => setOffen(false)}
  size="sm"
  tone="danger"
  icon="delete"
  title="Termin absagen"
  confirmLabel="Termin absagen"
  onConfirm={absagen}
>
  Die Absage geht sofort an die Patientin. Das lässt sich nicht rückgängig machen.
</Modal>`

const FOOTER_CODE = `{/* secondary steht links im Fuß */}
<Modal secondary={<a href="/hilfe">Hilfe</a>} … />

{/* footer ersetzt den Fuß vollständig, null lässt ihn weg */}
<Modal footer={<EigenerFuss />} … />
<Modal footer={null} … />`

function ModalDemo({ label, variant = 'secondary', ...modalProps }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant={variant} onClick={() => setOpen(true)}>{label}</Button>
      <Modal open={open} onClose={() => setOpen(false)} onConfirm={() => setOpen(false)} {...modalProps} />
    </>
  )
}

export default function ModalPage() {
  const { t } = useTranslation()

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={values => (
              <ModalDemo
                label={t('modal.demo.openLabel')}
                variant="primary"
                size={values.size}
                tone={values.tone}
                icon={values.icon ? 'event_repeat' : undefined}
                title={t('modal.demo.moveTitle')}
                subtitle={values.subtitle ? t('modal.demo.moveSubtitle') : undefined}
                confirmLabel={t('modal.demo.moveConfirm')}
                secondary={values.secondary ? <span className={CAPTION}>{t('modal.demo.secondary')}</span> : undefined}
              >
                {values.body ? t('modal.demo.moveBody') : undefined}
              </ModalDemo>
            )}
            controls={[
              { id: 'size', type: 'dropdown', label: t('modal.controls.size'), options: ['sm', 'md', 'lg'], default: 'md' },
              { id: 'tone', type: 'dropdown', label: t('modal.controls.tone'), options: ['neutral', 'danger', 'warning', 'success'], default: 'neutral' },
              { id: 'icon', type: 'toggle', label: t('modal.controls.icon'), default: true },
              { id: 'subtitle', type: 'toggle', label: t('modal.controls.subtitle'), default: true },
              { id: 'body', type: 'toggle', label: t('modal.controls.body'), default: true },
              { id: 'secondary', type: 'toggle', label: t('modal.controls.secondary'), default: false },
            ]}
          />

          <Section title={t('modal.overview.sizesTitle')}>
            <Content>
              <p className={PROSE}>{t('modal.overview.sizesBody')}</p>
              <div className={ROW}>
                <ModalDemo
                  label="sm · 420px"
                  size="sm"
                  title={t('modal.demo.confirmTitle')}
                  confirmLabel={t('modal.demo.confirmConfirm')}
                >
                  {t('modal.demo.confirmBody')}
                </ModalDemo>
                <ModalDemo
                  label="md · 560px"
                  size="md"
                  title={t('modal.demo.moveTitle')}
                  subtitle={t('modal.demo.moveSubtitle')}
                  confirmLabel={t('modal.demo.moveConfirm')}
                >
                  {t('modal.demo.moveBody')}
                </ModalDemo>
                <ModalDemo
                  label="lg · 760px"
                  size="lg"
                  title={t('modal.demo.detailsTitle')}
                  confirmLabel={t('modal.demo.detailsConfirm')}
                >
                  {t('modal.demo.detailsBody')}
                </ModalDemo>
              </div>
            </Content>
          </Section>

          <Section title={t('modal.overview.toneTitle')}>
            <Content>
              <p className={PROSE}>{t('modal.overview.toneBody')}</p>
              <div className={ROW}>
                {[
                  { tone: 'danger', icon: 'delete' },
                  { tone: 'warning', icon: 'warning' },
                  { tone: 'success', icon: 'check_circle' },
                  { tone: 'neutral', icon: 'info' },
                ].map(item => (
                  <ModalDemo
                    key={item.tone}
                    label={`tone="${item.tone}"`}
                    size="sm"
                    tone={item.tone}
                    icon={item.icon}
                    title={t(`modal.demo.tones.${item.tone}Title`)}
                    confirmLabel={t(`modal.demo.tones.${item.tone}Confirm`)}
                  >
                    {t(`modal.demo.tones.${item.tone}Body`)}
                  </ModalDemo>
                ))}
              </div>
            </Content>
          </Section>

          <Section title={t('modal.overview.formTitle')}>
            <Content>
              <p className={PROSE}>{t('modal.overview.formBody')}</p>
              <div className={ROW}>
                <ModalDemo
                  label={t('modal.demo.formLabel')}
                  size="md"
                  title={t('modal.demo.formTitle')}
                  subtitle={t('modal.demo.formSubtitle')}
                  confirmLabel={t('modal.demo.formConfirm')}
                >
                  <div className="flex flex-col gap-[var(--medo-space-md)]">
                    <TextInput label={t('modal.demo.fieldName')} placeholder={t('modal.demo.fieldNamePlaceholder')} />
                    <TextInput label={t('modal.demo.fieldReason')} placeholder={t('modal.demo.fieldReasonPlaceholder')} />
                  </div>
                </ModalDemo>
              </div>
            </Content>
          </Section>

          <Section title={t('modal.overview.footerTitle')}>
            <Content>
              <p className={PROSE}>{t('modal.overview.footerBody')}</p>
              <div className={ROW}>
                <ModalDemo
                  label={t('modal.demo.secondaryLabel')}
                  size="md"
                  title={t('modal.demo.moveTitle')}
                  confirmLabel={t('modal.demo.moveConfirm')}
                  secondary={<span className={CAPTION}>{t('modal.demo.secondary')}</span>}
                >
                  {t('modal.demo.moveBody')}
                </ModalDemo>
                <ModalDemo
                  label={t('modal.demo.noFooterLabel')}
                  size="sm"
                  title={t('modal.demo.noFooterTitle')}
                  footer={null}
                >
                  {t('modal.demo.noFooterBody')}
                </ModalDemo>
              </div>
            </Content>
          </Section>

          <Section title={t('modal.overview.behaviourTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('modal.overview.b1')}</li>
                <li>{t('modal.overview.b2')}</li>
                <li>{t('modal.overview.b3')}</li>
                <li>{t('modal.overview.b4')}</li>
              </ul>
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
          <Section title={t('modal.usage.whenTitle')}>
            <Content>
              <p className={PROSE}>{t('modal.usage.whenBody')}</p>
            </Content>
          </Section>

          <Section title={t('modal.usage.labelTitle')}>
            <Content>
              <p className={PROSE}>{t('modal.usage.labelBody')}</p>
            </Content>
          </Section>

          <Section title={t('modal.usage.dangerTitle')}>
            <Content>
              <p className={PROSE}>{t('modal.usage.dangerBody')}</p>
            </Content>
          </Section>

          <Section title={t('modal.usage.dontTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('modal.usage.dont1')}</li>
                <li>{t('modal.usage.dont2')}</li>
                <li>{t('modal.usage.dont3')}</li>
                <li>{t('modal.usage.dont4')}</li>
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
        <Section title={t('modal.code.title')}>
          <Content>
            <p className={PROSE}>{t('modal.code.basicDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{BASIC_CODE}</CodeBlock>
            </div>

            <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('modal.code.dangerDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{DANGER_CODE}</CodeBlock>
            </div>

            <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('modal.code.footerDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{FOOTER_CODE}</CodeBlock>
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
          <Section title={t('modal.a11y.focusTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('modal.a11y.f1')}</li>
                <li>{t('modal.a11y.f2')}</li>
                <li>{t('modal.a11y.f3')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('modal.a11y.rolesTitle')}>
            <Content>
              <p className={PROSE}>{t('modal.a11y.rolesBody')}</p>
            </Content>
          </Section>

          <Section title={t('modal.a11y.scrimTitle')}>
            <Content>
              <p className={PROSE}>{t('modal.a11y.scrimBody')}</p>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title={t('modal.page.title')}
      description={t('modal.page.description')}
      tabs={tabs}
    />
  )
}
