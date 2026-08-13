import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Popover, Button, TextInput } from '../components'

const PROSE = 'text-[var(--medo-text-muted)] [font-family:var(--medo-font-sans)] [font-size:var(--medo-text-base)] [line-height:var(--medo-leading-relaxed)]'
const CAPTION = '[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-xs)] text-[var(--medo-text-muted)]'
const ROW = 'flex flex-wrap items-center gap-[var(--medo-space-lg)] mt-[var(--medo-space-md)]'
const LIST = `${PROSE} list-disc pl-[var(--medo-space-lg)] space-y-[var(--medo-space-3xs)]`

const BASIC_CODE = `import { Popover } from '@/components'

<Popover
  title="Abrechnungsweg"
  content="Der Weg bestimmt, an wen die Rechnung geht. Er lässt sich später ändern."
>
  <Button variant="secondary" icon="help">Erklärung</Button>
</Popover>`

const FORM_CODE = `{/* content als Funktion bekommt close — damit schließen Aktionen darin */}
<Popover
  title="Termin verschieben"
  width={340}
  content={({ close }) => (
    <form onSubmit={e => { e.preventDefault(); verschieben(); close() }}>
      <TextInput label="Neues Datum" />
      <Button type="submit">Übernehmen</Button>
    </form>
  )}
>
  <Button variant="secondary">Verschieben</Button>
</Popover>`

const CONTROLLED_CODE = `const [offen, setOffen] = useState(false)

<Popover open={offen} onOpenChange={setOffen} content="…">
  <Button variant="secondary">Auslöser</Button>
</Popover>`

function ControlledDemo() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <div>
      <div className={ROW}>
        <Popover
          open={open}
          onOpenChange={setOpen}
          title={t('popover.demo.controlledTitle')}
          content={t('popover.demo.controlledBody')}
        >
          <Button variant="secondary">{t('popover.demo.triggerLabel')}</Button>
        </Popover>
        <Button variant="ghost" onClick={() => setOpen(!open)}>
          {open ? t('popover.demo.closeExternal') : t('popover.demo.openExternal')}
        </Button>
      </div>
      <p className={`${CAPTION} mt-[var(--medo-space-sm)]`}>
        {open ? t('popover.demo.stateOpen') : t('popover.demo.stateClosed')}
      </p>
    </div>
  )
}

function FormDemo() {
  const { t } = useTranslation()
  const [note, setNote] = useState('')

  return (
    <div>
      <div className={ROW}>
        <Popover
          title={t('popover.demo.formTitle')}
          width={340}
          content={({ close }) => (
            <div className="flex flex-col gap-[var(--medo-space-sm)]">
              <TextInput
                label={t('popover.demo.formField')}
                placeholder={t('popover.demo.formPlaceholder')}
                onChange={e => setNote(e.target.value)}
              />
              <div className="flex justify-end gap-[var(--medo-space-xs)]">
                <Button variant="ghost" size="sm" onClick={close}>{t('popover.demo.formCancel')}</Button>
                <Button size="sm" onClick={close}>{t('popover.demo.formSave')}</Button>
              </div>
            </div>
          )}
        >
          <Button variant="secondary" icon="edit_note">{t('popover.demo.formTrigger')}</Button>
        </Popover>
      </div>
      <p className={`${CAPTION} mt-[var(--medo-space-sm)]`}>
        {note ? t('popover.demo.formNote', { value: note }) : t('popover.demo.formEmpty')}
      </p>
    </div>
  )
}

export default function PopoverPage() {
  const { t } = useTranslation()

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={values => (
              <Popover
                placement={values.placement}
                title={values.title ? t('popover.demo.title') : undefined}
                width={values.wide ? 380 : undefined}
                content={t('popover.demo.body')}
              >
                <Button variant="secondary">{t('popover.demo.triggerLabel')}</Button>
              </Popover>
            )}
            controls={[
              { id: 'placement', type: 'dropdown', label: t('popover.controls.placement'), options: ['bottom', 'top', 'left', 'right'], default: 'bottom' },
              { id: 'title', type: 'toggle', label: t('popover.controls.title'), default: true },
              { id: 'wide', type: 'toggle', label: t('popover.controls.wide'), default: false },
            ]}
          />

          <Section title={t('popover.overview.placementTitle')}>
            <Content>
              <p className={PROSE}>{t('popover.overview.placementBody')}</p>
              <div className={ROW}>
                {['bottom', 'top', 'left', 'right'].map(placement => (
                  <div key={placement} className="flex flex-col items-start gap-[var(--medo-space-xs)]">
                    <Popover
                      placement={placement}
                      title={t('popover.demo.title')}
                      content={t('popover.demo.body')}
                    >
                      <Button variant="secondary" size="sm">{t(`popover.demo.placements.${placement}`)}</Button>
                    </Popover>
                    <span className={CAPTION}>{placement}</span>
                  </div>
                ))}
              </div>
            </Content>
          </Section>

          <Section title={t('popover.overview.titleTitle')}>
            <Content>
              <p className={PROSE}>{t('popover.overview.titleBody')}</p>
              <div className={ROW}>
                <div className="flex flex-col items-start gap-[var(--medo-space-xs)]">
                  <Popover title={t('popover.demo.title')} content={t('popover.demo.body')}>
                    <Button variant="secondary" size="sm">{t('popover.demo.withTitle')}</Button>
                  </Popover>
                  <span className={CAPTION}>{t('popover.overview.captionTitle')}</span>
                </div>
                <div className="flex flex-col items-start gap-[var(--medo-space-xs)]">
                  <Popover content={t('popover.demo.body')}>
                    <Button variant="secondary" size="sm">{t('popover.demo.withoutTitle')}</Button>
                  </Popover>
                  <span className={CAPTION}>{t('popover.overview.captionNoTitle')}</span>
                </div>
              </div>
            </Content>
          </Section>

          <Section title={t('popover.overview.formTitle')}>
            <Content>
              <p className={PROSE}>{t('popover.overview.formBody')}</p>
              <FormDemo />
            </Content>
          </Section>

          <Section title={t('popover.overview.controlledTitle')}>
            <Content>
              <p className={PROSE}>{t('popover.overview.controlledBody')}</p>
              <ControlledDemo />
            </Content>
          </Section>

          <Section title={t('popover.overview.flipTitle')}>
            <Content>
              <p className={PROSE}>{t('popover.overview.flipBody')}</p>
              <div className="flex justify-end mt-[var(--medo-space-md)]">
                <Popover placement="right" title={t('popover.demo.title')} content={t('popover.demo.body')}>
                  <Button variant="secondary" size="sm">{t('popover.demo.edgeTrigger')}</Button>
                </Popover>
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
          <Section title={t('popover.usage.vsTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('popover.usage.v1')}</li>
                <li>{t('popover.usage.v2')}</li>
                <li>{t('popover.usage.v3')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('popover.usage.contentTitle')}>
            <Content>
              <p className={PROSE}>{t('popover.usage.contentBody')}</p>
            </Content>
          </Section>

          <Section title={t('popover.usage.triggerTitle')}>
            <Content>
              <p className={PROSE}>{t('popover.usage.triggerBody')}</p>
            </Content>
          </Section>

          <Section title={t('popover.usage.dontTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('popover.usage.dont1')}</li>
                <li>{t('popover.usage.dont2')}</li>
                <li>{t('popover.usage.dont3')}</li>
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
        <Section title={t('popover.code.title')}>
          <Content>
            <p className={PROSE}>{t('popover.code.basicDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{BASIC_CODE}</CodeBlock>
            </div>

            <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('popover.code.formDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{FORM_CODE}</CodeBlock>
            </div>

            <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('popover.code.controlledDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{CONTROLLED_CODE}</CodeBlock>
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
          <Section title={t('popover.a11y.focusTitle')}>
            <Content>
              <p className={PROSE}>{t('popover.a11y.focusBody')}</p>
            </Content>
          </Section>

          <Section title={t('popover.a11y.rolesTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('popover.a11y.r1')}</li>
                <li>{t('popover.a11y.r2')}</li>
                <li>{t('popover.a11y.r3')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('popover.a11y.triggerTitle')}>
            <Content>
              <p className={PROSE}>{t('popover.a11y.triggerBody')}</p>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title={t('popover.page.title')}
      description={t('popover.page.description')}
      tabs={tabs}
    />
  )
}
