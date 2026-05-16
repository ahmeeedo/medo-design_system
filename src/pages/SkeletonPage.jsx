import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Skeleton, SkeletonCard } from '../components'

const TEXT_CODE = `import { Skeleton } from '@/components'

{/* Text-Zeilen absteigend — simuliert einen Absatz */}
<Skeleton variant="text" width="90%" height={14} />
<Skeleton variant="text" width="75%" height={14} />
<Skeleton variant="text" width="55%" height={14} />`

const CIRCLE_CODE = `{/* Circle — für Avatar-Platzhalter */}
<Skeleton variant="circle" width={24}  height={24} />
<Skeleton variant="circle" width={40}  height={40} />
<Skeleton variant="circle" width={56}  height={56} />`

const RECT_CODE = `{/* Rect — für Bilder, Cards, Blöcke */}
<Skeleton variant="rect" height={120} />
<Skeleton variant="rect" width={200} height={80} />`

const CARD_CODE = `import { SkeletonCard } from '@/components'

{/* Feste Struktur: Avatar + 2 Text-Lines | Rect-Block | 3 Text-Lines */}
<SkeletonCard />`

const COMPOSITE_CODE = `{/* Listenzeile als Skeleton-Komposition */}
<div className="flex items-center gap-3">
  <Skeleton variant="circle" width={40} height={40} />
  <div className="flex-1 flex flex-col gap-2">
    <Skeleton variant="text" width="60%" height={14} />
    <Skeleton variant="text" width="40%" height={11} />
  </div>
</div>`

export default function SkeletonPage() {
  const { t } = useTranslation()

  const doDont = ['1', '2', '3'].map(n => ({ do: `do${n}`, dont: `dont${n}` }))

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <Section title={t('skeleton.overview.anatomyTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-3)]">
                {t('skeleton.overview.anatomyBody')}
              </p>
              <ol className="flex flex-col gap-[var(--space-2)] pl-[var(--space-5)]">
                {['an1', 'an2', 'an3', 'an4'].map(k => (
                  <li key={k} className="text-sm text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                    {t(`skeleton.overview.${k}`)}
                  </li>
                ))}
              </ol>
            </Content>
          </Section>

          <Section title={t('skeleton.overview.variantsTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('skeleton.overview.variantsBody')}
              </p>
            </Content>
            <div className="grid grid-cols-3 max-[640px]:grid-cols-1 gap-[var(--space-6)]">
              <div>
                <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('skeleton.overview.variantText')}
                </p>
                <div className="flex flex-col gap-[var(--space-2)]">
                  <Skeleton variant="text" width="90%" height={14} />
                  <Skeleton variant="text" width="75%" height={14} />
                  <Skeleton variant="text" width="55%" height={14} />
                </div>
              </div>
              <div>
                <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('skeleton.overview.variantCircle')}
                </p>
                <div className="flex items-end gap-[var(--space-3)]">
                  <Skeleton variant="circle" width={24} height={24} />
                  <Skeleton variant="circle" width={40} height={40} />
                  <Skeleton variant="circle" width={56} height={56} />
                </div>
              </div>
              <div>
                <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('skeleton.overview.variantRect')}
                </p>
                <div className="flex flex-col gap-[var(--space-2)]">
                  <Skeleton variant="rect" height={60} />
                  <Skeleton variant="rect" width={120} height={40} />
                </div>
              </div>
            </div>
          </Section>

          <Section title={t('skeleton.overview.cardTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('skeleton.overview.cardBody')}
              </p>
            </Content>
            <SkeletonCard />
          </Section>
        </>
      ),
    },
    {
      id: 'usage',
      label: t('tabs.usage'),
      content: (
        <>
          <Section title={t('skeleton.usage.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('skeleton.usage.intro')}
              </p>
            </Content>
          </Section>

          <Section title={t('skeleton.usage.whenNotTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('skeleton.usage.whenNotBody')}
              </p>
            </Content>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)]">
              <div className="bg-[var(--color-success-container-100)] border border-[var(--color-success)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('skeleton.usage.doTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ do: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-success)] shrink-0">✓</span>
                      <span>{t(`skeleton.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('skeleton.usage.doNote')}
                </div>
              </div>
              <div className="bg-[var(--color-error-container-100)] border border-[var(--color-error)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('skeleton.usage.dontTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ dont: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-error)] shrink-0">✗</span>
                      <span>{t(`skeleton.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('skeleton.usage.dontNote')}
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
          <Section title={t('skeleton.code.title')}>
            <Content>
              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">
                {t('skeleton.code.textTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('skeleton.code.textDesc')}
              </p>
              <CodeBlock language="jsx">{TEXT_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('skeleton.code.circleTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('skeleton.code.circleDesc')}
              </p>
              <CodeBlock language="jsx">{CIRCLE_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('skeleton.code.rectTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('skeleton.code.rectDesc')}
              </p>
              <CodeBlock language="jsx">{RECT_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('skeleton.code.cardTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('skeleton.code.cardDesc')}
              </p>
              <CodeBlock language="jsx">{CARD_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('skeleton.code.compositeTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('skeleton.code.compositeDesc')}
              </p>
              <CodeBlock language="jsx">{COMPOSITE_CODE}</CodeBlock>
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
          <Section title={t('skeleton.a11y.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('skeleton.a11y.intro')}
              </p>
            </Content>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)]">
              {[
                { title: t('skeleton.a11y.hiddenTitle'),  body: t('skeleton.a11y.hiddenBody') },
                { title: t('skeleton.a11y.liveTitle'),    body: t('skeleton.a11y.liveBody') },
                { title: t('skeleton.a11y.motionTitle'),  body: t('skeleton.a11y.motionBody') },
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
      title="Skeleton"
      description={t('skeleton.page.description')}
      tabs={tabs}
    />
  )
}
