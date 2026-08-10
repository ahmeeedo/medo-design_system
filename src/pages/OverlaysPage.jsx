import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { LegacyButton as Button, Modal } from '../components'

const BASE_CODE = `import { useState } from 'react'
import { Modal, Button } from '@/components'

function Example() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Modal öffnen</Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Titel des Dialogs"
      >
        <p>Modalinhalt — Text, Formulare oder andere Komponenten.</p>
      </Modal>
    </>
  )
}`

const CONFIRM_CODE = `function DeleteConfirm({ itemName, onDelete }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Löschen
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Eintrag löschen?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Abbrechen
            </Button>
            <Button variant="danger" onClick={() => { onDelete(); setOpen(false) }}>
              Endgültig löschen
            </Button>
          </>
        }
      >
        <p>
          <strong>{itemName}</strong> wird dauerhaft gelöscht.
          Diese Aktion kann nicht rückgängig gemacht werden.
        </p>
      </Modal>
    </>
  )
}`

const SIZE_CODE = `{/* size="sm" — 384px max-width */}
<Modal open={open} onClose={onClose} title="Kurze Bestätigung" size="sm">
  Bist du sicher?
</Modal>

{/* size="md" — 512px max-width (Standard) */}
<Modal open={open} onClose={onClose} title="Formular" size="md">
  <form>...</form>
</Modal>

{/* size="lg" — 672px max-width */}
<Modal open={open} onClose={onClose} title="Detailansicht" size="lg">
  <DetailView />
</Modal>`

function ModalDemo({ size }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Modal öffnen</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Beispiel-Dialog" size={size}>
        <p className="text-sm text-[var(--color-text-secondary)]">Modalinhalt — Text, Formulare oder andere Komponenten.</p>
      </Modal>
    </>
  )
}

export default function OverlaysPage() {
  const { t } = useTranslation()

  const [openSm, setOpenSm] = useState(false)
  const [openMd, setOpenMd] = useState(false)
  const [openLg, setOpenLg] = useState(false)

  const doDont = ['1', '2', '3'].map(n => ({ do: `do${n}`, dont: `dont${n}` }))

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={(values) => <ModalDemo size={values.size} />}
            controls={[
              { id: 'size', type: 'dropdown', label: 'Size', options: ['sm', 'md', 'lg'], default: 'md' },
            ]}
          />
          <Section title={t('overlays.overview.anatomyTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-3)]">
                {t('overlays.overview.anatomyBody')}
              </p>
              <ol className="flex flex-col gap-[var(--space-2)] pl-[var(--space-5)]">
                {['an1', 'an2', 'an3', 'an4', 'an5'].map(k => (
                  <li key={k} className="text-sm text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                    {t(`overlays.overview.${k}`)}
                  </li>
                ))}
              </ol>
            </Content>
          </Section>

          <Section title={t('overlays.overview.demoTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('overlays.overview.demoBody')}
              </p>
            </Content>
            <div className="flex flex-wrap gap-[var(--space-3)]">
              <Button variant="secondary" size="sm" onClick={() => setOpenSm(true)}>
                {t('overlays.overview.demoSm')}
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setOpenMd(true)}>
                {t('overlays.overview.demoMd')}
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setOpenLg(true)}>
                {t('overlays.overview.demoLg')}
              </Button>
            </div>

            <Modal
              open={openSm}
              onClose={() => setOpenSm(false)}
              title={t('overlays.overview.demoSmTitle')}
              size="sm"
              footer={<Button variant="primary" size="sm" onClick={() => setOpenSm(false)}>{t('overlays.overview.close')}</Button>}
            >
              <p className="text-sm text-[var(--color-text-secondary)]">{t('overlays.overview.demoSmBody')}</p>
            </Modal>

            <Modal
              open={openMd}
              onClose={() => setOpenMd(false)}
              title={t('overlays.overview.demoMdTitle')}
              size="md"
              footer={
                <>
                  <Button variant="secondary" size="sm" onClick={() => setOpenMd(false)}>{t('overlays.overview.cancel')}</Button>
                  <Button variant="primary" size="sm" onClick={() => setOpenMd(false)}>{t('overlays.overview.confirm')}</Button>
                </>
              }
            >
              <p className="text-sm text-[var(--color-text-secondary)]">{t('overlays.overview.demoMdBody')}</p>
            </Modal>

            <Modal
              open={openLg}
              onClose={() => setOpenLg(false)}
              title={t('overlays.overview.demoLgTitle')}
              size="lg"
              footer={<Button variant="secondary" size="sm" onClick={() => setOpenLg(false)}>{t('overlays.overview.close')}</Button>}
            >
              <p className="text-sm text-[var(--color-text-secondary)]">{t('overlays.overview.demoLgBody')}</p>
            </Modal>
          </Section>
        </>
      ),
    },
    {
      id: 'usage',
      label: t('tabs.usage'),
      content: (
        <>
          <Section title={t('overlays.usage.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('overlays.usage.intro')}
              </p>
            </Content>
          </Section>

          <Section title={t('overlays.usage.whenTitle')}>
            <div className="flex flex-col gap-[var(--space-1)] border border-[var(--border-subtle-100)] rounded-[var(--radius-lg)] overflow-hidden mb-[var(--space-6)]">
              {['when1', 'when2', 'when3'].map((k, i) => (
                <div key={k} className={`flex items-start gap-[var(--space-4)] px-[var(--space-4)] py-[var(--space-3)] ${i % 2 === 0 ? 'bg-[var(--surface_100)]' : 'bg-[var(--surface_200)]'}`}>
                  <span className="text-sm text-[var(--color-text-secondary)]">{t(`overlays.usage.${k}`)}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title={t('overlays.usage.whenNotTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('overlays.usage.whenNotBody')}
              </p>
            </Content>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)]">
              <div className="bg-[var(--color-success-container-100)] border border-[var(--color-success)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('overlays.usage.doTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ do: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-success)] shrink-0">✓</span>
                      <span>{t(`overlays.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('overlays.usage.doNote')}
                </div>
              </div>
              <div className="bg-[var(--color-error-container-100)] border border-[var(--color-error)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('overlays.usage.dontTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ dont: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-error)] shrink-0">✗</span>
                      <span>{t(`overlays.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('overlays.usage.dontNote')}
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
          <Section title={t('overlays.code.title')}>
            <Content>
              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">
                {t('overlays.code.baseTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('overlays.code.baseDesc')}
              </p>
              <CodeBlock language="jsx">{BASE_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('overlays.code.confirmTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('overlays.code.confirmDesc')}
              </p>
              <CodeBlock language="jsx">{CONFIRM_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('overlays.code.sizeTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('overlays.code.sizeDesc')}
              </p>
              <CodeBlock language="jsx">{SIZE_CODE}</CodeBlock>
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
          <Section title={t('overlays.a11y.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('overlays.a11y.intro')}
              </p>
            </Content>
          </Section>

          <Section title={t('overlays.a11y.keyboardTitle')}>
            <div className="border border-[var(--border-subtle-100)] rounded-[var(--radius-lg)] overflow-hidden mb-[var(--space-6)]">
              {['k1', 'k2', 'k3'].map((k, i) => (
                <div key={k} className={`flex items-center gap-[var(--space-4)] px-[var(--space-4)] py-[var(--space-3)] ${i % 2 === 0 ? 'bg-[var(--surface_100)]' : 'bg-[var(--surface_200)]'}`}>
                  <span className="text-sm text-[var(--color-text-secondary)]">{t(`overlays.a11y.${k}`)}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)]">
              {[
                { title: t('overlays.a11y.focusTitle'),   body: t('overlays.a11y.focusBody') },
                { title: t('overlays.a11y.roleTitle'),    body: t('overlays.a11y.roleBody') },
                { title: t('overlays.a11y.overlayTitle'), body: t('overlays.a11y.overlayBody') },
                { title: t('overlays.a11y.wcagTitle'),    body: t('overlays.a11y.wcagBody') },
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
      title="Modal"
      description={t('overlays.page.description')}
      tabs={tabs}
    />
  )
}
