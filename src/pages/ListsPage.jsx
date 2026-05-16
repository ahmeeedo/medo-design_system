import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content } from '../docs/PageLayout'
import { CodeBlock } from '../docs/CodeBlock'
import { Avatar, Badge, Button } from '../components'

const USER_LIST_CODE = `import { Avatar, Badge, Button } from '@/components'

const users = [
  { id: 1, name: 'Anna Klein',  email: 'anna@example.com',  initials: 'AK', status: 'Online',  statusVariant: 'success' },
  { id: 2, name: 'Max Bauer',   email: 'max@example.com',   initials: 'MB', status: 'Away',    statusVariant: 'warning' },
  { id: 3, name: 'Lena Müller', email: 'lena@example.com',  initials: 'LM', status: 'Offline', statusVariant: 'neutral' },
]

<div className="flex flex-col divide-y divide-border-subtle">
  {users.map(user => (
    <div key={user.id} className="flex items-center gap-3 py-3 px-4">
      <Avatar size="sm" initials={user.initials} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-content-primary truncate">{user.name}</div>
        <div className="text-xs text-content-secondary truncate">{user.email}</div>
      </div>
      <Badge variant={user.statusVariant}>{user.status}</Badge>
      <Button variant="ghost" size="xs" aria-label={\`Bearbeiten: \${user.name}\`}>
        Bearbeiten
      </Button>
    </div>
  ))}
</div>`

const CARD_LIST_CODE = `import { Card, Avatar, Badge } from '@/components'

<Card variant="flat">
  <Card.Header title="Team-Mitglieder" subtitle="4 aktive Nutzer" />
  <Card.Body className="p-0">
    <div className="flex flex-col divide-y divide-border-subtle">
      {users.map(user => (
        <div key={user.id} className="flex items-center gap-3 py-3 px-6">
          <Avatar size="sm" initials={user.initials} />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-content-primary">{user.name}</div>
            <div className="text-xs text-content-secondary">{user.role}</div>
          </div>
          <Badge variant={user.statusVariant}>{user.status}</Badge>
        </div>
      ))}
    </div>
  </Card.Body>
</Card>`

const ICON_LIST_CODE = `{/* Einfache Textliste mit Icon-Präfix */}
<ul className="flex flex-col gap-2">
  {features.map(item => (
    <li key={item.id} className="flex items-start gap-2 text-sm text-content-secondary">
      <span className="text-success shrink-0 mt-0.5">✓</span>
      <span>{item.label}</span>
    </li>
  ))}
</ul>`

const USERS = [
  { id: 1, name: 'Anna Klein',  email: 'anna@example.com',  initials: 'AK', color: '#E5E5E5', textColor: '#171717', statusVariant: 'success', statusKey: 'statusOnline' },
  { id: 2, name: 'Max Bauer',   email: 'max@example.com',   initials: 'MB', color: '#DBEAFE', textColor: '#1D4ED8', statusVariant: 'warning', statusKey: 'statusAway' },
  { id: 3, name: 'Lena Müller', email: 'lena@example.com',  initials: 'LM', color: '#FCE7F3', textColor: '#BE185D', statusVariant: 'neutral', statusKey: 'statusOffline' },
  { id: 4, name: 'Tom Fischer',  email: 'tom@example.com',   initials: 'TF', color: '#F0FDF4', textColor: '#166534', statusVariant: 'success', statusKey: 'statusOnline' },
]

const FEATURES = ['featureTokens', 'featureA11y', 'featureI18n', 'featureComponents']

export default function ListsPage() {
  const { t } = useTranslation()

  const doDont = ['1', '2', '3'].map(n => ({ do: `do${n}`, dont: `dont${n}` }))

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <Section title={t('lists.overview.patternTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('lists.overview.patternBody')}
              </p>
            </Content>
          </Section>

          <Section title={t('lists.overview.userListTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('lists.overview.userListBody')}
              </p>
            </Content>
            <div className="border border-[var(--border-subtle-100)] rounded-[var(--radius-lg)] overflow-hidden max-w-[560px]">
              {USERS.map((user, i) => (
                <div
                  key={user.id}
                  className={`flex items-center gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] ${i < USERS.length - 1 ? 'border-b border-[var(--border-subtle-100)]' : ''}`}
                >
                  <Avatar size="sm" initials={user.initials} color={user.color} textColor={user.textColor} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] truncate">{user.name}</div>
                    <div className="text-xs text-[var(--color-text-secondary)] truncate">{user.email}</div>
                  </div>
                  <Badge variant={user.statusVariant}>{t(`lists.overview.${user.statusKey}`)}</Badge>
                  <Button variant="ghost" size="xs" aria-label={`${t('lists.overview.editAction')}: ${user.name}`}>
                    {t('lists.overview.editAction')}
                  </Button>
                </div>
              ))}
            </div>
          </Section>

          <Section title={t('lists.overview.iconListTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('lists.overview.iconListBody')}
              </p>
            </Content>
            <ul className="flex flex-col gap-[var(--space-2)] max-w-[400px]">
              {FEATURES.map(k => (
                <li key={k} className="flex items-start gap-[var(--space-2)] text-sm text-[var(--color-text-secondary)]">
                  <span className="text-[var(--color-success)] shrink-0 mt-[1px]">✓</span>
                  <span>{t(`lists.overview.${k}`)}</span>
                </li>
              ))}
            </ul>
          </Section>
        </>
      ),
    },
    {
      id: 'usage',
      label: t('tabs.usage'),
      content: (
        <>
          <Section title={t('lists.usage.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('lists.usage.intro')}
              </p>
            </Content>
          </Section>

          <Section title={t('lists.usage.whenTitle')}>
            <div className="flex flex-col gap-[var(--space-1)] border border-[var(--border-subtle-100)] rounded-[var(--radius-lg)] overflow-hidden mb-[var(--space-6)]">
              {['when1', 'when2', 'when3'].map((k, i) => (
                <div key={k} className={`flex items-start gap-[var(--space-4)] px-[var(--space-4)] py-[var(--space-3)] ${i % 2 === 0 ? 'bg-[var(--surface_100)]' : 'bg-[var(--surface_200)]'}`}>
                  <span className="text-sm text-[var(--color-text-secondary)]">{t(`lists.usage.${k}`)}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title={t('lists.usage.structureTitle')}>
            <div className="flex flex-col gap-[var(--space-1)] border border-[var(--border-subtle-100)] rounded-[var(--radius-lg)] overflow-hidden mb-[var(--space-6)]">
              {[
                { key: 'partAvatar',  label: 'Avatar' },
                { key: 'partText',    label: 'Text-Block' },
                { key: 'partBadge',   label: 'Badge' },
                { key: 'partAction',  label: 'Action-Button' },
              ].map(({ key, label }, i) => (
                <div key={key} className={`flex items-start gap-[var(--space-4)] px-[var(--space-4)] py-[var(--space-3)] ${i % 2 === 0 ? 'bg-[var(--surface_100)]' : 'bg-[var(--surface_200)]'}`}>
                  <code className="text-xs [font-family:var(--font-mono)] text-[var(--color-text-primary)] shrink-0 min-w-[96px] pt-[2px]">{label}</code>
                  <span className="text-sm text-[var(--color-text-secondary)]">{t(`lists.usage.${key}`)}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)]">
              <div className="bg-[var(--color-success-container-100)] border border-[var(--color-success)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('lists.usage.doTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ do: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-success)] shrink-0">✓</span>
                      <span>{t(`lists.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('lists.usage.doNote')}
                </div>
              </div>
              <div className="bg-[var(--color-error-container-100)] border border-[var(--color-error)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('lists.usage.dontTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {doDont.map(({ dont: k }) => (
                    <li key={k} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-error)] shrink-0">✗</span>
                      <span>{t(`lists.usage.${k}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('lists.usage.dontNote')}
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
          <Section title={t('lists.code.title')}>
            <Content>
              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">
                {t('lists.code.userListTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('lists.code.userListDesc')}
              </p>
              <CodeBlock language="jsx">{USER_LIST_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('lists.code.cardListTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('lists.code.cardListDesc')}
              </p>
              <CodeBlock language="jsx">{CARD_LIST_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('lists.code.iconListTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('lists.code.iconListDesc')}
              </p>
              <CodeBlock language="jsx">{ICON_LIST_CODE}</CodeBlock>
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
          <Section title={t('lists.a11y.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('lists.a11y.intro')}
              </p>
            </Content>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)]">
              {[
                { title: t('lists.a11y.semanticTitle'), body: t('lists.a11y.semanticBody') },
                { title: t('lists.a11y.tabTitle'),      body: t('lists.a11y.tabBody') },
                { title: t('lists.a11y.ariaTitle'),     body: t('lists.a11y.ariaBody') },
                { title: t('lists.a11y.srTitle'),       body: t('lists.a11y.srBody') },
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
      title="Lists"
      description={t('lists.page.description')}
      tabs={tabs}
    />
  )
}
