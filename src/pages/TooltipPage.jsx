import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Tooltip, Button, Icon } from '../components'

const PROSE = 'text-[var(--medo-text-muted)] [font-family:var(--medo-font-sans)] [font-size:var(--medo-text-base)] [line-height:var(--medo-leading-relaxed)]'
const CAPTION = '[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-xs)] text-[var(--medo-text-muted)]'
const ROW = 'flex flex-wrap items-center gap-[var(--medo-space-lg)] mt-[var(--medo-space-md)]'
const LIST = `${PROSE} list-disc pl-[var(--medo-space-lg)] space-y-[var(--medo-space-3xs)]`

const BASIC_CODE = `import { Tooltip, Button } from '@/components'

<Tooltip content="In die Zwischenablage kopieren">
  <Button variant="ghost" iconOnly icon="content_copy" aria-label="Kopieren" />
</Tooltip>`

const RICH_CODE = `<Tooltip
  placement="bottom"
  title="Tastenkürzel"
  content="Öffnet die Suche von überall — auch aus Untermenüs."
>
  <Button variant="ghost" iconOnly icon="search" aria-label="Suche" />
</Tooltip>`

const SPAN_CODE = `{/* Ein span als Auslöser braucht tabIndex={0}, sonst ist der Tooltip
    für Tastaturnutzer unerreichbar. */}
<Tooltip content="Nach § 19 UStG wird keine Umsatzsteuer ausgewiesen.">
  <span tabIndex={0}><Icon name="help" size={18} /></span>
</Tooltip>`

export default function TooltipPage() {
  const { t } = useTranslation()

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={values => (
              <Tooltip
                placement={values.placement}
                content={t('tooltip.demo.content')}
                title={values.title ? t('tooltip.demo.title') : undefined}
                delay={values.instant ? 0 : 400}
                disabled={values.disabled}
              >
                <Button variant="ghost" iconOnly icon="content_copy" aria-label={t('tooltip.demo.copyLabel')} />
              </Tooltip>
            )}
            controls={[
              { id: 'placement', type: 'dropdown', label: t('tooltip.controls.placement'), options: ['top', 'bottom', 'left', 'right'], default: 'top' },
              { id: 'title', type: 'toggle', label: t('tooltip.controls.title'), default: false },
              { id: 'instant', type: 'toggle', label: t('tooltip.controls.instant'), default: false },
              { id: 'disabled', type: 'toggle', label: t('tooltip.controls.disabled'), default: false },
            ]}
          />

          <Section title={t('tooltip.overview.placementTitle')}>
            <Content>
              <p className={PROSE}>{t('tooltip.overview.placementBody')}</p>
              <div className={ROW}>
                {['top', 'bottom', 'left', 'right'].map(placement => (
                  <div key={placement} className="flex flex-col items-start gap-[var(--medo-space-xs)]">
                    <Tooltip placement={placement} content={t('tooltip.demo.content')}>
                      <Button variant="secondary" size="sm">{t(`tooltip.demo.placements.${placement}`)}</Button>
                    </Tooltip>
                    <span className={CAPTION}>{placement}</span>
                  </div>
                ))}
              </div>
            </Content>
          </Section>

          <Section title={t('tooltip.overview.variantsTitle')}>
            <Content>
              <p className={PROSE}>{t('tooltip.overview.variantsBody')}</p>
              <div className={ROW}>
                <div className="flex flex-col items-start gap-[var(--medo-space-xs)]">
                  <Tooltip content={t('tooltip.demo.content')}>
                    <Button variant="ghost" iconOnly icon="content_copy" aria-label={t('tooltip.demo.copyLabel')} />
                  </Tooltip>
                  <span className={CAPTION}>{t('tooltip.overview.captionText')}</span>
                </div>
                <div className="flex flex-col items-start gap-[var(--medo-space-xs)]">
                  <Tooltip title={t('tooltip.demo.title')} content={t('tooltip.demo.richContent')} placement="bottom">
                    <Button variant="ghost" iconOnly icon="search" aria-label={t('tooltip.demo.searchLabel')} />
                  </Tooltip>
                  <span className={CAPTION}>{t('tooltip.overview.captionRich')}</span>
                </div>
              </div>
            </Content>
          </Section>

          <Section title={t('tooltip.overview.triggerTitle')}>
            <Content>
              <p className={PROSE}>{t('tooltip.overview.triggerBody')}</p>
              <div className={ROW}>
                <Tooltip content={t('tooltip.demo.taxContent')}>
                  <span
                    tabIndex={0}
                    className="inline-flex rounded-[var(--medo-radius-sm)] text-[var(--medo-icon-muted)] outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--medo-focus-ring)]"
                  >
                    <Icon name="help" size={18} />
                  </span>
                </Tooltip>
                <span className={CAPTION}>{t('tooltip.overview.triggerCaption')}</span>
              </div>
            </Content>
          </Section>

          <Section title={t('tooltip.overview.behaviourTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('tooltip.overview.b1')}</li>
                <li>{t('tooltip.overview.b2')}</li>
                <li>{t('tooltip.overview.b3')}</li>
                <li>{t('tooltip.overview.b4')}</li>
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
          <Section title={t('tooltip.usage.whenTitle')}>
            <Content>
              <p className={PROSE}>{t('tooltip.usage.whenBody')}</p>
            </Content>
          </Section>

          <Section title={t('tooltip.usage.contentTitle')}>
            <Content>
              <p className={PROSE}>{t('tooltip.usage.contentBody')}</p>
            </Content>
          </Section>

          <Section title={t('tooltip.usage.touchTitle')}>
            <Content>
              <p className={PROSE}>{t('tooltip.usage.touchBody')}</p>
            </Content>
          </Section>

          <Section title={t('tooltip.usage.dontTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('tooltip.usage.dont1')}</li>
                <li>{t('tooltip.usage.dont2')}</li>
                <li>{t('tooltip.usage.dont3')}</li>
                <li>{t('tooltip.usage.dont4')}</li>
                <li>{t('tooltip.usage.dont5')}</li>
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
        <Section title={t('tooltip.code.title')}>
          <Content>
            <p className={PROSE}>{t('tooltip.code.basicDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{BASIC_CODE}</CodeBlock>
            </div>

            <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('tooltip.code.richDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{RICH_CODE}</CodeBlock>
            </div>

            <p className={`${PROSE} mt-[var(--medo-space-lg)]`}>{t('tooltip.code.spanDesc')}</p>
            <div className="mt-[var(--medo-space-sm)]">
              <CodeBlock language="jsx">{SPAN_CODE}</CodeBlock>
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
          <Section title={t('tooltip.a11y.focusTitle')}>
            <Content>
              <p className={PROSE}>{t('tooltip.a11y.focusBody')}</p>
            </Content>
          </Section>

          <Section title={t('tooltip.a11y.ariaTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('tooltip.a11y.a1')}</li>
                <li>{t('tooltip.a11y.a2')}</li>
                <li>{t('tooltip.a11y.a3')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('tooltip.a11y.limitsTitle')}>
            <Content>
              <p className={PROSE}>{t('tooltip.a11y.limitsBody')}</p>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title={t('tooltip.page.title')}
      description={t('tooltip.page.description')}
      tabs={tabs}
    />
  )
}
