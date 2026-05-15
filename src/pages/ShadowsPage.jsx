import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content } from '../docs/PageLayout'
import { TokensTable } from '../docs/TokensTable'
import { CodeBlock } from '../docs/CodeBlock'
import { ShadowBox } from '../docs/helpers'
import styles from '../App.module.css'

const SHADOW_SCALE = [
  { label: 'xs',    shadow: 'var(--shadow-xs)',    border: true },
  { label: 'sm',    shadow: 'var(--shadow-sm)',    border: false },
  { label: 'md',    shadow: 'var(--shadow-md)',    border: false },
  { label: 'lg',    shadow: 'var(--shadow-lg)',    border: false },
  { label: 'xl',    shadow: 'var(--shadow-xl)',    border: false },
  { label: '2xl',   shadow: 'var(--shadow-2xl)',   border: false },
  { label: 'inner', shadow: 'var(--shadow-inner)', border: true },
]

const ELEVATION_GUIDE = [
  { key: 'xsGuide',    token: '--shadow-xs' },
  { key: 'smGuide',    token: '--shadow-sm' },
  { key: 'mdGuide',    token: '--shadow-md' },
  { key: 'lgGuide',    token: '--shadow-lg' },
  { key: 'xlGuide',    token: '--shadow-xl' },
  { key: '2xlGuide',   token: '--shadow-2xl' },
  { key: 'innerGuide', token: '--shadow-inner' },
]

const DO_DONT = [
  { do: 'do1', dont: 'dont1' },
  { do: 'do2', dont: 'dont2' },
  { do: 'do3', dont: 'dont3' },
]

const CSS_CODE = `/* Standard-Card */
.card {
  box-shadow: var(--shadow-sm);
  border-radius: var(--radius-xl);
}

/* Card im Hover-Zustand */
.card:hover {
  box-shadow: var(--shadow-md);
}

/* Dropdown-Menü */
.dropdown {
  box-shadow: var(--shadow-lg);
  border-radius: var(--radius-lg);
}

/* Modal */
.modal {
  box-shadow: var(--shadow-2xl);
  border-radius: var(--radius-3xl);
}

/* Pressed-Zustand (Input, Button) */
.input:focus,
.btn:active {
  box-shadow: var(--shadow-inner);
}`

const TAILWIND_CODE = `{/* Tailwind: Shadow-Tokens als arbitrary values */}
<div className="shadow-[var(--shadow-sm)] rounded-[var(--radius-xl)] p-[var(--space-6)]">
  Standard-Card
</div>

<div className="shadow-[var(--shadow-lg)] rounded-[var(--radius-lg)] p-[var(--space-4)]">
  Dropdown
</div>

<div className="shadow-[var(--shadow-2xl)] rounded-[var(--radius-3xl)] p-[var(--space-8)]">
  Modal
</div>`

const JSX_CODE = `const elevationMap = {
  flat:    'none',
  card:    'var(--shadow-sm)',
  raised:  'var(--shadow-md)',
  overlay: 'var(--shadow-lg)',
  modal:   'var(--shadow-2xl)',
  pressed: 'var(--shadow-inner)',
}

function Surface({ elevation = 'card', children }) {
  return (
    <div
      style={{
        boxShadow: elevationMap[elevation],
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)',
      }}
    >
      {children}
    </div>
  )
}

// Verwendung:
// <Surface elevation="card">Inhalt</Surface>
// <Surface elevation="modal">Modal-Inhalt</Surface>`

export default function ShadowsPage() {
  const { t } = useTranslation()

  const shadowTokens = [
    { token: '--shadow-xs',    value: '0 1px 2px 0 rgba(0,0,0,0.05)',                                                description: t('shadows.tokens.sXs') },
    { token: '--shadow-sm',    value: '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.06)',              description: t('shadows.tokens.sSm') },
    { token: '--shadow-md',    value: '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)',           description: t('shadows.tokens.sMd') },
    { token: '--shadow-lg',    value: '0 10px 15px -3px rgba(0,0,0,0.07), 0 4px 6px -4px rgba(0,0,0,0.05)',         description: t('shadows.tokens.sLg') },
    { token: '--shadow-xl',    value: '0 20px 25px -5px rgba(0,0,0,0.07), 0 8px 10px -6px rgba(0,0,0,0.04)',        description: t('shadows.tokens.sXl') },
    { token: '--shadow-2xl',   value: '0 25px 50px -12px rgba(0,0,0,0.12)',                                          description: t('shadows.tokens.s2xl') },
    { token: '--shadow-inner', value: 'inset 0 2px 4px 0 rgba(0,0,0,0.05)',                                          description: t('shadows.tokens.sInner') },
  ]

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <Section title={t('shadows.overview.principlesTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('shadows.overview.principlesBody')}
              </p>
            </Content>
          </Section>

          <Section title={t('shadows.overview.elevationTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('shadows.overview.elevationBody')}
              </p>
            </Content>
            {/* Visual elevation demo */}
            <div className="flex items-end gap-[var(--space-8)] flex-wrap bg-[var(--surface_200)] rounded-[var(--radius-xl)] p-[var(--space-8)] mb-[var(--space-4)]">
              {SHADOW_SCALE.map(({ label, shadow, border }) => (
                <div key={label} className="flex flex-col items-center gap-[var(--space-4)]">
                  <div
                    className="w-[72px] h-[72px] rounded-[var(--radius-lg)] bg-[var(--surface_100)]"
                    style={{
                      boxShadow: shadow,
                      border: border ? '1px solid var(--border-subtle-100)' : undefined,
                    }}
                  />
                  <code className="text-xs [font-family:var(--font-mono)] text-[var(--color-text-secondary)]">
                    {label}
                  </code>
                </div>
              ))}
            </div>
          </Section>

          <Section>
            <div className="grid grid-cols-3 max-[640px]:grid-cols-1 gap-[var(--space-6)]">
              {[
                { title: t('shadows.overview.p1Title'), body: t('shadows.overview.p1Body') },
                { title: t('shadows.overview.p2Title'), body: t('shadows.overview.p2Body') },
                { title: t('shadows.overview.p3Title'), body: t('shadows.overview.p3Body') },
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
          <Section title={t('shadows.usage.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('shadows.usage.intro')}
              </p>
            </Content>
          </Section>

          <Section title={t('shadows.usage.guideTitle')}>
            <div className="grid grid-cols-1 gap-[var(--space-1)] mb-[var(--space-6)] border border-[var(--border-subtle-100)] rounded-[var(--radius-lg)] overflow-hidden">
              {ELEVATION_GUIDE.map(({ key, token }, i) => (
                <div
                  key={key}
                  className={`flex items-center gap-[var(--space-4)] px-[var(--space-4)] py-[var(--space-3)] ${i % 2 === 0 ? 'bg-[var(--surface_100)]' : 'bg-[var(--surface_200)]'}`}
                >
                  <code className="text-xs [font-family:var(--font-mono)] [font-weight:var(--weight-semibold)] text-[var(--color-text-tertiary)] whitespace-nowrap w-[120px] shrink-0">
                    {token}
                  </code>
                  <span className="text-sm text-[var(--color-text-secondary)]">{t(`shadows.usage.${key}`)}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)]">
              <div className="bg-[var(--color-success-container-100)] border border-[var(--color-success)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('shadows.usage.doTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {DO_DONT.map(({ do: doKey }) => (
                    <li key={doKey} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-success)] shrink-0">✓</span>
                      <span className="text-xs">{t(`shadows.usage.${doKey}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('shadows.usage.doNote')}
                </div>
              </div>
              <div className="bg-[var(--color-error-container-100)] border border-[var(--color-error)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('shadows.usage.dontTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {DO_DONT.map(({ dont: dontKey }) => (
                    <li key={dontKey} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-error)] shrink-0">✗</span>
                      <span className="text-xs">{t(`shadows.usage.${dontKey}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('shadows.usage.dontNote')}
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
          <Section title={t('shadows.tokens.title')}>
            <div className={styles.shadowGrid}>
              {SHADOW_SCALE.map(({ label, shadow, border }) => (
                <ShadowBox key={label} label={label} shadow={shadow} border={border} />
              ))}
            </div>
            <TokensTable tokens={shadowTokens} />
          </Section>
        </>
      ),
    },
    {
      id: 'code',
      label: t('tabs.code'),
      content: (
        <>
          <Section title={t('shadows.code.title')}>
            <Content>
              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">
                {t('shadows.code.cssTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('shadows.code.cssDesc')}
              </p>
              <CodeBlock language="css">{CSS_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('shadows.code.tailwindTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('shadows.code.tailwindDesc')}
              </p>
              <CodeBlock language="jsx">{TAILWIND_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('shadows.code.jsxTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('shadows.code.jsxDesc')}
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
      title="Shadows"
      description={t('shadows.page.description')}
      tabs={tabs}
    />
  )
}
