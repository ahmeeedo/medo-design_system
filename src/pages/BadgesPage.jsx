import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Badge, Tag } from '../components'

const VARIANTS = ['neutral', 'accent', 'success', 'warning', 'error']

const VARIANTS_CODE = `import { Badge } from '@/components'

<Badge variant="neutral">Neutral</Badge>
<Badge variant="accent">Accent</Badge>
<Badge variant="success">Aktiv</Badge>
<Badge variant="warning">Ausstehend</Badge>
<Badge variant="error">Abgelaufen</Badge>`

const SIZES_CODE = `{/* sm — Standard (h-5) */}
<Badge variant="success" size="sm">Aktiv</Badge>

{/* md — für prominentere Platzierung (h-6) */}
<Badge variant="success" size="md">Aktiv</Badge>`

const DOT_CODE = `{/* dot={true} fügt Statusindikator links vom Label ein */}
<Badge variant="success" dot>Online</Badge>
<Badge variant="warning" dot>Ausstehend</Badge>
<Badge variant="error"   dot>Offline</Badge>`

const TAG_CODE = `import { Tag } from '@/components'

function FilterList() {
  const [tags, setTags] = useState(['Design', 'React', 'Tokens'])

  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {tags.map(tag => (
        <Tag
          key={tag}
          onRemove={() => setTags(tags.filter(t => t !== tag))}
        >
          {tag}
        </Tag>
      ))}
    </div>
  )
}`

const INITIAL_TAGS = ['Design System', 'React', 'Tokens']

export default function BadgesPage() {
  const { t } = useTranslation()

  const [tags, setTags] = useState(INITIAL_TAGS)
  const doDont = ['1', '2', '3'].map(n => ({ do: `do${n}`, dont: `dont${n}` }))

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <Section title={t('badges.overview.anatomyTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-3)]">
                {t('badges.overview.anatomyBody')}
              </p>
              <ol className="flex flex-col gap-[var(--space-2)] pl-[var(--space-5)]">
                {['an1', 'an2', 'an3'].map(k => (
                  <li key={k} className="text-sm text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                    {t(`badges.overview.${k}`)}
                  </li>
                ))}
              </ol>
            </Content>
          </Section>

          <Section title={t('badges.overview.variantsTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('badges.overview.variantsBody')}
              </p>
            </Content>
            <div className="flex flex-wrap gap-[var(--space-3)] mb-[var(--space-4)]">
              {VARIANTS.map(v => (
                <Badge key={v} variant={v}>
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </Badge>
              ))}
            </div>
          </Section>

          <Section title={t('badges.overview.sizesTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('badges.overview.sizesBody')}
              </p>
            </Content>
            <div className="flex items-center gap-[var(--space-4)] flex-wrap mb-[var(--space-4)]">
              {[
                { size: 'sm', label: 'sm (Standard)' },
                { size: 'md', label: 'md' },
              ].map(({ size, label }) => (
                <div key={size} className="flex flex-col items-start gap-[var(--space-2)]">
                  <Badge variant="accent" size={size}>Kategorie</Badge>
                  <code className="text-xs [font-family:var(--font-mono)] text-[var(--color-text-secondary)]">
                    size="{size}" — {label}
                  </code>
                </div>
              ))}
            </div>
          </Section>

          <Section title={t('badges.overview.dotTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('badges.overview.dotBody')}
              </p>
            </Content>
            <div className="flex flex-wrap gap-[var(--space-3)] mb-[var(--space-4)]">
              <Badge variant="success" dot>Online</Badge>
              <Badge variant="warning" dot>Ausstehend</Badge>
              <Badge variant="error"   dot>Offline</Badge>
              <Badge variant="neutral" dot>Inaktiv</Badge>
            </div>
          </Section>

          <Section title={t('badges.overview.tagTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('badges.overview.tagBody')}
              </p>
            </Content>
            <div className="flex flex-wrap gap-[var(--space-2)]">
              {tags.map(tag => (
                <Tag key={tag} onRemove={() => setTags(tags.filter(t => t !== tag))}>
                  {tag}
                </Tag>
              ))}
              {tags.length === 0 && (
                <span className="text-sm text-[var(--color-text-secondary)]">Alle Tags entfernt.</span>
              )}
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
          <Section title={t('badges.usage.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('badges.usage.intro')}
              </p>
            </Content>
          </Section>

          <Section title={t('badges.usage.whenTitle')}>
            <div className="flex flex-col gap-[var(--space-1)] border border-[var(--border-subtle-100)] rounded-[var(--radius-lg)] overflow-hidden mb-[var(--space-6)]">
              {['when1', 'when2', 'when3', 'when4'].map((k, i) => (
                <div key={k} className={`flex items-center gap-[var(--space-4)] px-[var(--space-4)] py-[var(--space-3)] ${i % 2 === 0 ? 'bg-[var(--surface_100)]' : 'bg-[var(--surface_200)]'}`}>
                  <span className="text-sm text-[var(--color-text-secondary)]">{t(`badges.usage.${k}`)}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)]">
              <div className="bg-[var(--color-success-container-100)] border border-[var(--color-success)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('badges.usage.doTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ do: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-success)] shrink-0">✓</span>
                      <span>{t(`badges.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('badges.usage.doNote')}
                </div>
              </div>
              <div className="bg-[var(--color-error-container-100)] border border-[var(--color-error)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('badges.usage.dontTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ dont: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-error)] shrink-0">✗</span>
                      <span>{t(`badges.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('badges.usage.dontNote')}
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
          <Section title={t('badges.code.title')}>
            <Content>
              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">
                {t('badges.code.variantsTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('badges.code.variantsDesc')}
              </p>
              <CodeBlock language="jsx">{VARIANTS_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('badges.code.sizesTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('badges.code.sizesDesc')}
              </p>
              <CodeBlock language="jsx">{SIZES_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('badges.code.dotTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('badges.code.dotDesc')}
              </p>
              <CodeBlock language="jsx">{DOT_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('badges.code.tagTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('badges.code.tagDesc')}
              </p>
              <CodeBlock language="jsx">{TAG_CODE}</CodeBlock>
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
          <Section title={t('badges.a11y.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('badges.a11y.intro')}
              </p>
            </Content>
          </Section>

          <Section>
            <div className="grid grid-cols-1 gap-[var(--space-4)]">
              {[
                { title: t('badges.a11y.colorTitle'),   body: t('badges.a11y.colorBody') },
                { title: t('badges.a11y.ariaTitle'),    body: t('badges.a11y.ariaBody') },
                { title: t('badges.a11y.contextTitle'), body: t('badges.a11y.contextBody') },
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
      title="Badges & Tags"
      description={t('badges.page.description')}
      tabs={tabs}
    />
  )
}
