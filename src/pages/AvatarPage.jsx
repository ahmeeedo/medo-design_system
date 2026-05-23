import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, DemoPanel } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Avatar, AvatarGroup } from '../components'

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl']

const GROUP_AVATARS = [
  { initials: 'AJ', color: '#DBEAFE', textColor: '#1D4ED8' },
  { initials: 'MK', color: '#FCE7F3', textColor: '#BE185D' },
  { initials: 'LP', color: '#F0FDF4', textColor: '#16A34A' },
  { initials: 'RS', color: '#FFF7ED', textColor: '#C2410C' },
  { initials: 'TN', color: '#F5F3FF', textColor: '#7C3AED' },
  { initials: 'BW', color: '#FEF3C7', textColor: '#B45309' },
]

const SIZES_CODE = `import { Avatar } from '@/components'

<Avatar size="xs" initials="AJ" />
<Avatar size="sm" initials="AJ" />
<Avatar size="md" initials="AJ" />
<Avatar size="lg" initials="AJ" />
<Avatar size="xl" initials="AJ" />`

const IMAGE_CODE = `{/* Avatar mit Bild — alt-Text ist Pflicht */}
<Avatar
  size="md"
  src="/user-photo.jpg"
  alt="Alice Jones"
/>`

const GROUP_CODE = `import { AvatarGroup } from '@/components'

{/* 6 Avatare, max=4 — zeigt 4 + "+2" */}
<AvatarGroup
  size="md"
  max={4}
  avatars={[
    { initials: 'AJ', color: '#DBEAFE', textColor: '#1D4ED8' },
    { initials: 'MK', color: '#FCE7F3', textColor: '#BE185D' },
    { initials: 'LP', color: '#F0FDF4', textColor: '#16A34A' },
    { initials: 'RS', color: '#FFF7ED', textColor: '#C2410C' },
    { initials: 'TN', color: '#F5F3FF', textColor: '#7C3AED' },
    { initials: 'BW', color: '#FEF3C7', textColor: '#B45309' },
  ]}
/>`

const NO_COLOR_CODE = `{/* Ohne color-Prop — System-Fallback-Farbe */}
<Avatar size="md" initials="AJ" />

{/* Mit expliziter Farbe */}
<Avatar size="md" initials="AJ" color="#DBEAFE" textColor="#1D4ED8" />`

export default function AvatarPage() {
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
              <Avatar size={values.size} initials="AB" color="#DBEAFE" textColor="#1D4ED8" />
            )}
            controls={[
              { id: 'size', type: 'dropdown', label: 'Size', options: ['xs', 'sm', 'md', 'lg', 'xl'], default: 'md' },
            ]}
          />
          <Section title={t('avatar.overview.anatomyTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-3)]">
                {t('avatar.overview.anatomyBody')}
              </p>
              <ol className="flex flex-col gap-[var(--space-2)] pl-[var(--space-5)]">
                {['an1', 'an2', 'an3'].map(k => (
                  <li key={k} className="text-sm text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                    {t(`avatar.overview.${k}`)}
                  </li>
                ))}
              </ol>
            </Content>
          </Section>

          <Section title={t('avatar.overview.sizesTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('avatar.overview.sizesBody')}
              </p>
            </Content>
            <div className="flex items-end gap-[var(--space-4)] flex-wrap">
              {SIZES.map((s, i) => (
                <div key={s} className="flex flex-col items-center gap-[var(--space-2)]">
                  <Avatar
                    size={s}
                    initials={['AJ', 'MK', 'LP', 'RS', 'TN'][i]}
                    color={['#DBEAFE', '#FCE7F3', '#F0FDF4', '#FFF7ED', '#F5F3FF'][i]}
                    textColor={['#1D4ED8', '#BE185D', '#16A34A', '#C2410C', '#7C3AED'][i]}
                  />
                  <span className="text-xs text-[var(--color-text-secondary)]">{s}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title={t('avatar.overview.fallbackTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('avatar.overview.fallbackBody')}
              </p>
            </Content>
            <div className="flex items-center gap-[var(--space-4)] flex-wrap">
              <div className="flex flex-col items-center gap-[var(--space-2)]">
                <Avatar size="md" initials="AJ" color="#DBEAFE" textColor="#1D4ED8" />
                <span className="text-xs text-[var(--color-text-secondary)]">{t('avatar.overview.fallbackWithColor')}</span>
              </div>
              <div className="flex flex-col items-center gap-[var(--space-2)]">
                <Avatar size="md" initials="MK" />
                <span className="text-xs text-[var(--color-text-secondary)]">{t('avatar.overview.fallbackNoColor')}</span>
              </div>
            </div>
          </Section>

          <Section title={t('avatar.overview.groupTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('avatar.overview.groupBody')}
              </p>
            </Content>
            <AvatarGroup size="md" max={4} avatars={GROUP_AVATARS} />
          </Section>
        </>
      ),
    },
    {
      id: 'usage',
      label: t('tabs.usage'),
      content: (
        <>
          <Section title={t('avatar.usage.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('avatar.usage.intro')}
              </p>
            </Content>
          </Section>

          <Section title={t('avatar.usage.groupMaxTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('avatar.usage.groupMaxBody')}
              </p>
            </Content>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)]">
              <div className="bg-[var(--color-success-container-100)] border border-[var(--color-success)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('avatar.usage.doTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ do: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-success)] shrink-0">✓</span>
                      <span>{t(`avatar.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('avatar.usage.doNote')}
                </div>
              </div>
              <div className="bg-[var(--color-error-container-100)] border border-[var(--color-error)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('avatar.usage.dontTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ dont: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-error)] shrink-0">✗</span>
                      <span>{t(`avatar.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('avatar.usage.dontNote')}
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
          <Section title={t('avatar.code.title')}>
            <Content>
              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">
                {t('avatar.code.sizesTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('avatar.code.sizesDesc')}
              </p>
              <CodeBlock language="jsx">{SIZES_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('avatar.code.imageTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('avatar.code.imageDesc')}
              </p>
              <CodeBlock language="jsx">{IMAGE_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('avatar.code.groupTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('avatar.code.groupDesc')}
              </p>
              <CodeBlock language="jsx">{GROUP_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('avatar.code.noColorTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('avatar.code.noColorDesc')}
              </p>
              <CodeBlock language="jsx">{NO_COLOR_CODE}</CodeBlock>
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
          <Section title={t('avatar.a11y.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('avatar.a11y.intro')}
              </p>
            </Content>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)]">
              {[
                { title: t('avatar.a11y.altTitle'),      body: t('avatar.a11y.altBody') },
                { title: t('avatar.a11y.ariaTitle'),     body: t('avatar.a11y.ariaBody') },
                { title: t('avatar.a11y.overflowTitle'), body: t('avatar.a11y.overflowBody') },
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
      title="Avatar"
      description={t('avatar.page.description')}
      tabs={tabs}
    />
  )
}
