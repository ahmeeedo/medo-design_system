import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Button } from '../components'

const PROSE = 'text-[var(--medo-text-muted)] [font-family:var(--medo-font-sans)] [font-size:var(--medo-text-base)] [line-height:var(--medo-leading-relaxed)]'
const CAPTION = '[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-xs)] text-[var(--medo-text-muted)]'
const ROW = 'flex flex-wrap items-center gap-[var(--medo-space-md)] mt-[var(--medo-space-md)]'
const LIST = `${PROSE} list-disc pl-[var(--medo-space-lg)] space-y-[var(--medo-space-3xs)]`

const VARIANTS_CODE = `import { Button } from '@/components'

<Button>Termin anlegen</Button>
<Button variant="secondary">Abbrechen</Button>
<Button variant="ghost">Details anzeigen</Button>
<Button variant="danger">Konto löschen</Button>`

const SIZES_CODE = `<Button size="sm">Zeile bearbeiten</Button>
<Button size="md">Profil speichern</Button>
<Button size="lg">Anmeldung abschließen</Button>`

const ICON_CODE = `<Button icon="add">Termin anlegen</Button>
<Button icon="arrow_forward" iconPosition="trailing">Weiter</Button>
<Button variant="ghost" iconOnly icon="more_vert" aria-label="Weitere Aktionen" />`

const STATE_CODE = `<Button loading>Wird gespeichert</Button>
<Button disabled>Nicht verfügbar</Button>
<Button fullWidth size="lg">Rechnung freigeben</Button>`

const LINK_CODE = `{/* Navigiert statt zu handeln: rendert ein <a role="button"> */}
<Button href="/rechnungen" variant="secondary" icon="arrow_forward" iconPosition="trailing">
  Zu den Rechnungen
</Button>`

export default function ButtonPage() {
  const { t } = useTranslation()

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={values => (
              <Button
                variant={values.variant}
                size={values.size}
                icon={values.icon ? 'add' : undefined}
                iconPosition={values.iconPosition}
                iconOnly={values.iconOnly}
                loading={values.loading}
                disabled={values.disabled}
                fullWidth={values.fullWidth}
                aria-label={values.iconOnly ? t('button.demo.createLabel') : undefined}
              >
                {values.iconOnly ? null : t('button.demo.create')}
              </Button>
            )}
            controls={[
              { id: 'variant', type: 'dropdown', label: t('button.controls.variant'), options: ['primary', 'secondary', 'ghost', 'danger'], default: 'primary' },
              { id: 'size', type: 'dropdown', label: t('button.controls.size'), options: ['sm', 'md', 'lg'], default: 'md' },
              { id: 'iconPosition', type: 'dropdown', label: t('button.controls.iconPosition'), options: ['leading', 'trailing'], default: 'leading' },
              { id: 'icon', type: 'toggle', label: t('button.controls.icon'), default: true },
              { id: 'iconOnly', type: 'toggle', label: t('button.controls.iconOnly'), default: false },
              { id: 'loading', type: 'toggle', label: t('button.controls.loading'), default: false },
              { id: 'disabled', type: 'toggle', label: t('button.controls.disabled'), default: false },
              { id: 'fullWidth', type: 'toggle', label: t('button.controls.fullWidth'), default: false },
            ]}
          />

          <Section title={t('button.overview.variantsTitle')}>
            <Content>
              <p className={PROSE}>{t('button.overview.variantsBody')}</p>
              <ul className={`${LIST} mt-[var(--medo-space-sm)]`}>
                <li>{t('button.overview.vPrimary')}</li>
                <li>{t('button.overview.vSecondary')}</li>
                <li>{t('button.overview.vGhost')}</li>
                <li>{t('button.overview.vDanger')}</li>
              </ul>
              <div className={ROW}>
                <Button>{t('button.demo.create')}</Button>
                <Button variant="secondary">{t('button.demo.cancel')}</Button>
                <Button variant="ghost">{t('button.demo.details')}</Button>
                <Button variant="danger">{t('button.demo.delete')}</Button>
              </div>
            </Content>
          </Section>

          <Section title={t('button.overview.sizesTitle')}>
            <Content>
              <p className={PROSE}>{t('button.overview.sizesBody')}</p>
              <div className={ROW}>
                {[
                  { size: 'sm', meta: 'sm · H 32 · Text 12' },
                  { size: 'md', meta: 'md · H 40 · Text 14' },
                  { size: 'lg', meta: 'lg · H 48 · Text 16' },
                ].map(item => (
                  <div key={item.size} className="flex flex-col items-start gap-[var(--medo-space-xs)]">
                    <Button size={item.size}>{t('button.demo.save')}</Button>
                    <span className={CAPTION}>{item.meta}</span>
                  </div>
                ))}
              </div>
            </Content>
          </Section>

          <Section title={t('button.overview.iconsTitle')}>
            <Content>
              <p className={PROSE}>{t('button.overview.iconsBody')}</p>
              <div className={ROW}>
                <Button icon="add">{t('button.demo.create')}</Button>
                <Button variant="secondary" icon="arrow_forward" iconPosition="trailing">
                  {t('button.demo.next')}
                </Button>
                <Button variant="ghost" iconOnly icon="more_vert" aria-label={t('button.demo.moreLabel')} />
                <span className={CAPTION}>{t('button.overview.iconsCaption')}</span>
              </div>
            </Content>
          </Section>

          <Section title={t('button.overview.statesTitle')}>
            <Content>
              <p className={PROSE}>{t('button.overview.statesBody')}</p>
              <div className={ROW}>
                <Button loading>{t('button.demo.saving')}</Button>
                <Button disabled>{t('button.demo.unavailable')}</Button>
                <Button variant="secondary" disabled>{t('button.demo.unavailable')}</Button>
                <Button variant="ghost" disabled>{t('button.demo.unavailable')}</Button>
                <Button variant="danger" disabled>{t('button.demo.unavailable')}</Button>
              </div>
            </Content>
          </Section>

          <Section title={t('button.overview.fullWidthTitle')}>
            <Content>
              <p className={PROSE}>{t('button.overview.fullWidthBody')}</p>
              <div className="mt-[var(--medo-space-md)] max-w-[420px]">
                <Button size="lg" fullWidth>{t('button.demo.finish')}</Button>
              </div>
            </Content>
          </Section>

          <Section title={t('button.overview.hrefTitle')}>
            <Content>
              <p className={PROSE}>{t('button.overview.hrefBody')}</p>
              <div className={ROW}>
                <Button href="/link" variant="secondary" icon="arrow_forward" iconPosition="trailing">
                  {t('button.demo.toLink')}
                </Button>
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
          <Section title={t('button.usage.whenTitle')}>
            <Content>
              <p className={PROSE}>{t('button.usage.whenBody')}</p>
            </Content>
          </Section>

          <Section title={t('button.usage.guideTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('button.usage.gPrimary')}</li>
                <li>{t('button.usage.gSecondary')}</li>
                <li>{t('button.usage.gGhost')}</li>
                <li>{t('button.usage.gDanger')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('button.usage.labelTitle')}>
            <Content>
              <p className={PROSE}>{t('button.usage.labelBody')}</p>
            </Content>
          </Section>

          <Section title={t('button.usage.sizeChoiceTitle')}>
            <Content>
              <p className={PROSE}>{t('button.usage.sizeChoiceBody')}</p>
            </Content>
          </Section>

          <Section title={t('button.usage.doDontTitle')}>
            <Content>
              <div className="grid gap-[var(--medo-space-md)] md:grid-cols-2">
                <div className="rounded-[var(--medo-radius-lg)] border border-[var(--medo-border)] border-t-[3px] border-t-[var(--medo-success-solid)] p-[var(--medo-space-lg)]">
                  <p className="[font-family:var(--medo-font-sans)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-success-text)] mb-[var(--medo-space-xs)]">
                    {t('button.usage.doTitle')}
                  </p>
                  <ul className={LIST}>
                    <li>{t('button.usage.do1')}</li>
                    <li>{t('button.usage.do2')}</li>
                    <li>{t('button.usage.do3')}</li>
                  </ul>
                </div>
                <div className="rounded-[var(--medo-radius-lg)] border border-[var(--medo-border)] border-t-[3px] border-t-[var(--medo-error-solid)] p-[var(--medo-space-lg)]">
                  <p className="[font-family:var(--medo-font-sans)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-error-text)] mb-[var(--medo-space-xs)]">
                    {t('button.usage.dontTitle')}
                  </p>
                  <ul className={LIST}>
                    <li>{t('button.usage.dont1')}</li>
                    <li>{t('button.usage.dont2')}</li>
                    <li>{t('button.usage.dont3')}</li>
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
        <Section title={t('button.code.title')}>
          <Content>
            <p className={PROSE}>{t('button.code.variantsDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{VARIANTS_CODE}</CodeBlock>
            </div>

            <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('button.code.sizesDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{SIZES_CODE}</CodeBlock>
            </div>

            <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('button.code.iconDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{ICON_CODE}</CodeBlock>
            </div>

            <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('button.code.stateDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{STATE_CODE}</CodeBlock>
            </div>

            <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('button.code.hrefDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{LINK_CODE}</CodeBlock>
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
          <Section title={t('button.a11y.focusTitle')}>
            <Content>
              <p className={PROSE}>{t('button.a11y.focusBody')}</p>
            </Content>
          </Section>

          <Section title={t('button.a11y.keyboardTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('button.a11y.k1')}</li>
                <li>{t('button.a11y.k2')}</li>
                <li>{t('button.a11y.k3')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('button.a11y.ariaTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('button.a11y.aria1')}</li>
                <li>{t('button.a11y.aria2')}</li>
                <li>{t('button.a11y.aria3')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('button.a11y.targetTitle')}>
            <Content>
              <p className={PROSE}>{t('button.a11y.targetBody')}</p>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title={t('button.page.title')}
      description={t('button.page.description')}
      tabs={tabs}
    />
  )
}
