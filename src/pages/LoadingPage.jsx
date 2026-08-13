import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Loading, Skeleton } from '../components'

const SPINNER_CODE = `import { Loading } from '@/components'

<Loading size="sm" />
<Loading label="Profile werden geprüft …" />`

const OVERLAY_CODE = `{/* overlay legt sich über den bereits sichtbaren Bereich —
    der Vorfahre braucht position: relative, der alte Inhalt bleibt stehen */}
<div style={{ position: 'relative' }}>
  <Tabelle />
  {laedt && <Loading variant="overlay" />}
</div>

{/* fullpage nur beim ersten Laden der Anwendung */}
{startet && <Loading variant="fullpage" label="Anwendung wird geladen …" />}`

const SKELETON_CODE = `import { Skeleton } from '@/components'

<Skeleton lines={3} />
<Skeleton variant="block" height={160} />
<Skeleton variant="card" />
<Skeleton variant="table" rows={5} />`

const COLOR_CODE = `{/* Der Spinner erbt currentColor — color setzt ihn abweichend */}
<Loading color="var(--medo-text-muted)" />

{/* Der wartende Bereich trägt aria-busy, die Skeletons selbst sind aria-hidden */}
<div aria-busy="true">
  <Skeleton variant="card" />
</div>`

export default function LoadingPage() {
  const { t } = useTranslation()

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <DemoPanel
            component={(values) => (
              <div className="w-full max-w-[520px] flex justify-center">
                {values.komponente === 'Skeleton' ? (
                  <div className="w-full">
                    <Skeleton
                      variant={values.skeletonVariant}
                      lines={Number(values.lines)}
                      rows={Number(values.lines)}
                    />
                  </div>
                ) : values.variant === 'overlay' ? (
                  <div className="relative w-full rounded-[var(--medo-radius-lg)] border border-[var(--medo-border)] bg-[var(--medo-surface)] p-[var(--medo-space-lg)]">
                    <p className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                      {t('loading.demo.overlayContent')}
                    </p>
                    <Loading
                      variant="overlay"
                      size={values.size}
                      label={values.label ? t('loading.demo.label') : undefined}
                    />
                  </div>
                ) : (
                  <Loading
                    size={values.size}
                    label={values.label ? t('loading.demo.label') : undefined}
                  />
                )}
              </div>
            )}
            controls={[
              { id: 'komponente', type: 'dropdown', label: 'Komponente', options: ['Loading', 'Skeleton'], default: 'Loading' },
              { id: 'size', type: 'dropdown', label: 'Size', options: ['sm', 'md', 'lg'], default: 'md' },
              { id: 'variant', type: 'dropdown', label: 'Variant', options: ['inline', 'overlay'], default: 'inline' },
              { id: 'skeletonVariant', type: 'dropdown', label: 'Skeleton', options: ['lines', 'block', 'card', 'table'], default: 'lines' },
              { id: 'lines', type: 'dropdown', label: 'Lines / Rows', options: ['2', '3', '5'], default: '3' },
              { id: 'label', type: 'toggle', label: 'Label', default: true },
            ]}
          />

          <Section title={t('loading.overview.whichTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('loading.overview.whichBody')}
              </p>
              <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--medo-space-lg)]">
                <div className="border border-[var(--medo-border-subtle)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-sm)]">
                    {t('loading.which.skeleton')}
                  </p>
                  <Skeleton variant="card" />
                </div>
                <div className="border border-[var(--medo-border-subtle)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)] flex flex-col items-center justify-center gap-[var(--medo-space-sm)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] self-start">
                    {t('loading.which.spinner')}
                  </p>
                  <Loading label={t('loading.demo.label')} />
                </div>
              </div>
            </Content>
          </Section>

          <Section title={t('loading.overview.sizesTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('loading.overview.sizesBody')}
              </p>
              <div className="flex flex-wrap gap-[var(--medo-space-2xl)] items-end">
                <div className="flex flex-col items-center gap-[var(--medo-space-xs)]">
                  <Loading size="sm" />
                  <span className="[font-size:var(--medo-text-xs)] [font-family:var(--medo-font-mono)] text-[var(--medo-text-muted)]">sm · 20 px</span>
                </div>
                <div className="flex flex-col items-center gap-[var(--medo-space-xs)]">
                  <Loading size="md" />
                  <span className="[font-size:var(--medo-text-xs)] [font-family:var(--medo-font-mono)] text-[var(--medo-text-muted)]">md · 32 px</span>
                </div>
                <div className="flex flex-col items-center gap-[var(--medo-space-xs)]">
                  <Loading size="lg" />
                  <span className="[font-size:var(--medo-text-xs)] [font-family:var(--medo-font-mono)] text-[var(--medo-text-muted)]">lg · 48 px</span>
                </div>
                <div className="flex flex-col items-center gap-[var(--medo-space-xs)]">
                  <Loading color="var(--medo-text-muted)" />
                  <span className="[font-size:var(--medo-text-xs)] [font-family:var(--medo-font-mono)] text-[var(--medo-text-muted)]">color</span>
                </div>
              </div>
            </Content>
          </Section>

          <Section title={t('loading.overview.overlayTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('loading.overview.overlayBody')}
              </p>
              <div className="relative max-w-[520px] rounded-[var(--medo-radius-lg)] border border-[var(--medo-border)] bg-[var(--medo-surface)] p-[var(--medo-space-lg)]">
                <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">
                  {t('loading.demo.overlayTitle')}
                </p>
                <p className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                  {t('loading.demo.overlayContent')}
                </p>
                <Loading variant="overlay" label={t('loading.demo.label')} />
              </div>
            </Content>
          </Section>

          <Section title={t('loading.overview.skeletonTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)] mb-[var(--medo-space-lg)]">
                {t('loading.overview.skeletonBody')}
              </p>
              <div className="grid grid-cols-2 max-[1024px]:grid-cols-1 gap-[var(--medo-space-lg)]">
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">lines</p>
                  <Skeleton lines={3} />
                </div>
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">block</p>
                  <Skeleton variant="block" height="96px" />
                </div>
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">card</p>
                  <Skeleton variant="card" />
                </div>
                <div>
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] mb-[var(--medo-space-xs)]">table</p>
                  <Skeleton variant="table" rows={4} />
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
          <Section title={t('loading.usage.whichTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('loading.usage.whichBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('loading.usage.timingTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('loading.usage.timingBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('loading.usage.oneTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('loading.usage.oneBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('loading.usage.scopeTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('loading.usage.scopeBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('loading.usage.doDontTitle')}>
            <Content>
              <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--medo-space-lg)]">
                <div className="border border-[var(--medo-border-subtle)] border-t-[3px] border-t-[var(--medo-success-solid)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-success-text)] mb-[var(--medo-space-sm)]">
                    {t('loading.usage.doTitle')}
                  </p>
                  <ul className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                    <li>{t('loading.usage.do1')}</li>
                    <li>{t('loading.usage.do2')}</li>
                    <li>{t('loading.usage.do3')}</li>
                  </ul>
                </div>
                <div className="border border-[var(--medo-border-subtle)] border-t-[3px] border-t-[var(--medo-error-solid)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
                  <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-error-text)] mb-[var(--medo-space-sm)]">
                    {t('loading.usage.dontTitle')}
                  </p>
                  <ul className="[font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                    <li>{t('loading.usage.dont1')}</li>
                    <li>{t('loading.usage.dont2')}</li>
                    <li>{t('loading.usage.dont3')}</li>
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
        <Section title={t('loading.code.title')}>
          <Content>
            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)]">
              {t('loading.code.spinnerTitle')}
            </p>
            <CodeBlock language="jsx">{SPINNER_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('loading.code.overlayTitle')}
            </p>
            <CodeBlock language="jsx">{OVERLAY_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('loading.code.skeletonTitle')}
            </p>
            <CodeBlock language="jsx">{SKELETON_CODE}</CodeBlock>

            <p className="[font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-2xs)] mt-[var(--medo-space-lg)]">
              {t('loading.code.colorTitle')}
            </p>
            <CodeBlock language="jsx">{COLOR_CODE}</CodeBlock>
          </Content>
        </Section>
      ),
    },
    {
      id: 'accessibility',
      label: t('tabs.accessibility'),
      content: (
        <>
          <Section title={t('loading.a11y.statusTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('loading.a11y.statusBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('loading.a11y.skeletonTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('loading.a11y.skeletonBody')}
              </p>
            </Content>
          </Section>
          <Section title={t('loading.a11y.motionTitle')}>
            <Content>
              <p className="[font-size:var(--medo-text-base)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-relaxed)]">
                {t('loading.a11y.motionBody')}
              </p>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title={t('loading.page.title')}
      description={t('loading.page.description')}
      tabs={tabs}
    />
  )
}
