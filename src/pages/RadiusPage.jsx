import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content } from '../docs/PageLayout'
import { TokensTable } from '../docs/TokensTable'
import { CodeBlock } from '../docs/CodeBlock'
import { RadiusBox } from '../docs/helpers'
import styles from '../App.module.css'

const SCALE = [
  ['none', '0px'],
  ['xs',   '2px'],
  ['sm',   '4px'],
  ['md',   '6px'],
  ['lg',   '8px'],
  ['xl',   '12px'],
  ['2xl',  '16px'],
  ['3xl',  '24px'],
  ['full', '9999px'],
]

const DO_DONT = [
  { do: 'do1', dont: 'dont1' },
  { do: 'do2', dont: 'dont2' },
  { do: 'do3', dont: 'dont3' },
]

const MAPPING = [
  { labelKey: 'noneLabel', descKey: 'noneDesc' },
  { labelKey: 'xsLabel',   descKey: 'xsDesc' },
  { labelKey: 'smLabel',   descKey: 'smDesc' },
  { labelKey: 'mdLabel',   descKey: 'mdDesc' },
  { labelKey: 'lgLabel',   descKey: 'lgDesc' },
  { labelKey: 'xlLabel',   descKey: 'xlDesc' },
  { labelKey: '2xlLabel',  descKey: '2xlDesc' },
  { labelKey: '3xlLabel',  descKey: '3xlDesc' },
  { labelKey: 'fullLabel', descKey: 'fullDesc' },
]

const CSS_CODE = `/* Buttons */
.btn {
  border-radius: var(--radius-lg);
}

/* Text-Inputs */
.input {
  border-radius: var(--radius-md);
}

/* Karten */
.card {
  border-radius: var(--radius-xl);
}

/* Pill-Elemente */
.badge,
.pill-btn {
  border-radius: var(--radius-full);
}

/* Modals */
.modal {
  border-radius: var(--radius-3xl);
}`

const TAILWIND_CODE = `{/* Tailwind: Radius-Tokens als arbitrary values */}
<button className="rounded-[var(--radius-lg)] px-[var(--space-4)] py-[var(--space-2)]">
  Speichern
</button>

<input className="rounded-[var(--radius-md)] border border-[var(--border-subtle-100)] px-[var(--space-3)]" />

<span className="rounded-[var(--radius-full)] px-[var(--space-3)] py-[var(--space-1)] bg-[var(--accent-surface_100)]">
  Badge
</span>

<div className="rounded-[var(--radius-xl)] p-[var(--space-6)] bg-[var(--surface_100)] shadow-[var(--shadow-sm)]">
  Card
</div>`

const JSX_CODE = `const radiusMap = {
  button:  'var(--radius-lg)',
  input:   'var(--radius-md)',
  card:    'var(--radius-xl)',
  badge:   'var(--radius-full)',
  modal:   'var(--radius-3xl)',
  divider: 'var(--radius-none)',
}

function Surface({ variant = 'card', children }) {
  return (
    <div style={{ borderRadius: radiusMap[variant] }}>
      {children}
    </div>
  )
}`

export default function RadiusPage() {
  const { t } = useTranslation()

  const radiusTokens = [
    { token: '--radius-none', value: '0px',    description: t('radius.tokens.rNone') },
    { token: '--radius-xs',   value: '2px',    description: t('radius.tokens.rXs') },
    { token: '--radius-sm',   value: '4px',    description: t('radius.tokens.rSm') },
    { token: '--radius-md',   value: '6px',    description: t('radius.tokens.rMd') },
    { token: '--radius-lg',   value: '8px',    description: t('radius.tokens.rLg') },
    { token: '--radius-xl',   value: '12px',   description: t('radius.tokens.rXl') },
    { token: '--radius-2xl',  value: '16px',   description: t('radius.tokens.r2xl') },
    { token: '--radius-3xl',  value: '24px',   description: t('radius.tokens.r3xl') },
    { token: '--radius-full', value: '9999px', description: t('radius.tokens.rFull') },
  ]

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <Section title={t('radius.overview.principlesTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('radius.overview.principlesBody')}
              </p>
            </Content>
          </Section>

          <Section title={t('radius.overview.scaleTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('radius.overview.scaleBody')}
              </p>
            </Content>
            {/* Visual radius scale preview */}
            <div className="flex items-end gap-[var(--space-4)] flex-wrap mb-[var(--space-4)]">
              {SCALE.map(([label, px]) => (
                <div key={label} className="flex flex-col items-center gap-[var(--space-3)]">
                  <div
                    className="w-[56px] h-[56px] bg-[var(--color-neutral-900)]"
                    style={{ borderRadius: px === '9999px' ? '9999px' : px }}
                  />
                  <div className="text-center">
                    <div className="text-xs [font-family:var(--font-mono)] text-[var(--color-text-secondary)]">{label}</div>
                    <div className="text-xs text-[var(--color-text-secondary)]">{px === '9999px' ? '∞' : px}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section>
            <div className="grid grid-cols-3 max-[640px]:grid-cols-1 gap-[var(--space-6)]">
              {[
                { title: t('radius.overview.p1Title'), body: t('radius.overview.p1Body') },
                { title: t('radius.overview.p2Title'), body: t('radius.overview.p2Body') },
                { title: t('radius.overview.p3Title'), body: t('radius.overview.p3Body') },
              ].map(({ title, body }) => (
                <div key={title} className="bg-[var(--surface-container_100)] rounded-[var(--radius-lg)] p-[var(--space-5)] border border-[var(--border-subtle-100)]">
                  <div className="text-md [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">{title}</div>
                  <div className="text-sm text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">{body}</div>
                </div>
              ))}
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
          <Section title={t('radius.usage.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('radius.usage.intro')}
              </p>
            </Content>
          </Section>

          <Section title={t('radius.usage.mappingTitle')}>
            <div className="grid grid-cols-1 gap-[var(--space-1)] mb-[var(--space-6)] border border-[var(--border-subtle-100)] rounded-[var(--radius-lg)] overflow-hidden">
              {MAPPING.map(({ labelKey, descKey }, i) => (
                <div
                  key={labelKey}
                  className={`flex items-center gap-[var(--space-4)] px-[var(--space-4)] py-[var(--space-3)] ${i % 2 === 0 ? 'bg-[var(--surface_100)]' : 'bg-[var(--surface_200)]'}`}
                >
                  <code className="text-xs [font-family:var(--font-mono)] [font-weight:var(--weight-semibold)] text-[var(--color-text-tertiary)] whitespace-nowrap w-[80px] shrink-0">
                    {t(`radius.usage.${labelKey}`)}
                  </code>
                  <span className="text-sm text-[var(--color-text-secondary)]">{t(`radius.usage.${descKey}`)}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)]">
              <div className="bg-[var(--color-success-container-100)] border border-[var(--color-success)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('radius.usage.doTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {DO_DONT.map(({ do: doKey }) => (
                    <li key={doKey} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-success)] shrink-0">✓</span>
                      <code className="[font-family:var(--font-mono)] text-xs">{t(`radius.usage.${doKey}`)}</code>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('radius.usage.doNote')}
                </div>
              </div>
              <div className="bg-[var(--color-error-container-100)] border border-[var(--color-error)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('radius.usage.dontTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {DO_DONT.map(({ dont: dontKey }) => (
                    <li key={dontKey} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-error)] shrink-0">✗</span>
                      <code className="[font-family:var(--font-mono)] text-xs">{t(`radius.usage.${dontKey}`)}</code>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('radius.usage.dontNote')}
                </div>
              </div>
            </div>
          </Section>
        </>
      ),
    },
    {
      id: 'tokens',
      label: t('tabs.tokens'),
      content: (
        <>
          <Section title={t('radius.tokens.title')}>
            <div className={styles.radiusGrid}>
              {SCALE.map(([label, px]) => (
                <RadiusBox key={label} label={label} px={px} />
              ))}
            </div>
            <TokensTable tokens={radiusTokens} />
          </Section>
        </>
      ),
    },
    {
      id: 'code',
      label: t('tabs.code'),
      content: (
        <>
          <Section title={t('radius.code.title')}>
            <Content>
              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">
                {t('radius.code.cssTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('radius.code.cssDesc')}
              </p>
              <CodeBlock language="css">{CSS_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('radius.code.tailwindTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('radius.code.tailwindDesc')}
              </p>
              <CodeBlock language="jsx">{TAILWIND_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('radius.code.jsxTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('radius.code.jsxDesc')}
              </p>
              <CodeBlock language="jsx">{JSX_CODE}</CodeBlock>
            </Content>
          </Section>
        </>
      ),
    },
  ]

  return (
    <PageLayout
      title="Border Radius"
      description={t('radius.page.description')}
      tabs={tabs}
    />
  )
}
