import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content } from '../docs/PageLayout'
import { TokensTable } from '../docs/TokensTable'
import { CodeBlock } from '../docs/CodeBlock'
import { SpacingRow } from '../docs/helpers'

const SCALE = [
  ['0','0px'],['1','4px'],['2','8px'],['3','12px'],['4','16px'],['5','20px'],['6','24px'],
  ['7','28px'],['8','32px'],['9','36px'],['10','40px'],['12','48px'],['14','56px'],
  ['16','64px'],['20','80px'],['24','96px'],['32','128px'],
]

const DO_DONT = [
  { do: 'do1', dont: 'dont1' },
  { do: 'do2', dont: 'dont2' },
  { do: 'do3', dont: 'dont3' },
]

const CSS_CODE = `/* Innenabstände einer Karte */
.card {
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
}

/* Enge Abstände: Icon + Label */
.label-group {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

/* Abschnittstrennungen */
.page-section {
  padding-top: var(--space-16);
  padding-bottom: var(--space-16);
}`

const TAILWIND_CODE = `{/* Spacing-Tokens als Tailwind arbitrary values */}
<div className="p-[var(--space-6)] mb-[var(--space-8)] flex flex-col gap-[var(--space-4)]">
  <div className="flex items-center gap-[var(--space-2)]">
    <svg className="shrink-0" width="16" height="16" />
    <span>Label</span>
  </div>
  <p>Karteninhalt mit space-4-Gap zwischen Elementen.</p>
</div>`

const JSX_CODE = `function Card({ children }) {
  return (
    <div
      style={{
        padding: 'var(--space-6)',
        marginBottom: 'var(--space-8)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
      }}
    >
      {children}
    </div>
  )
}

function IconLabel({ icon: Icon, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
      <Icon size={16} />
      <span>{label}</span>
    </div>
  )
}`

export default function SpacingPage() {
  const { t } = useTranslation()

  const spacingTokens = [
    { token: '--space-0',  value: '0px',   description: t('spacing.tokens.sp0') },
    { token: '--space-1',  value: '4px',   description: t('spacing.tokens.sp1') },
    { token: '--space-2',  value: '8px',   description: t('spacing.tokens.sp2') },
    { token: '--space-3',  value: '12px',  description: t('spacing.tokens.sp3') },
    { token: '--space-4',  value: '16px',  description: t('spacing.tokens.sp4') },
    { token: '--space-5',  value: '20px',  description: t('spacing.tokens.sp5') },
    { token: '--space-6',  value: '24px',  description: t('spacing.tokens.sp6') },
    { token: '--space-7',  value: '28px',  description: t('spacing.tokens.sp7') },
    { token: '--space-8',  value: '32px',  description: t('spacing.tokens.sp8') },
    { token: '--space-9',  value: '36px',  description: t('spacing.tokens.sp9') },
    { token: '--space-10', value: '40px',  description: t('spacing.tokens.sp10') },
    { token: '--space-12', value: '48px',  description: t('spacing.tokens.sp12') },
    { token: '--space-14', value: '56px',  description: t('spacing.tokens.sp14') },
    { token: '--space-16', value: '64px',  description: t('spacing.tokens.sp16') },
    { token: '--space-20', value: '80px',  description: t('spacing.tokens.sp20') },
    { token: '--space-24', value: '96px',  description: t('spacing.tokens.sp24') },
    { token: '--space-32', value: '128px', description: t('spacing.tokens.sp32') },
  ]

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <Section title={t('spacing.overview.gridTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('spacing.overview.gridBody')}
              </p>
            </Content>

            {/* 4px grid visualization */}
            <div className="flex items-end gap-[var(--space-2)] flex-wrap mb-[var(--space-6)]">
              {[1,2,3,4,6,8,10,12].map(n => (
                <div key={n} className="flex flex-col items-center gap-[var(--space-1)]">
                  <div
                    className="bg-[var(--color-brand-secondary-700)] rounded-[var(--radius-xs)] w-[20px]"
                    style={{ height: Math.min(n * 6, 80) }}
                  />
                  <span className="text-xs [font-family:var(--font-mono)] text-[var(--color-text-secondary)]">
                    {n * 4}px
                  </span>
                </div>
              ))}
            </div>
          </Section>

          <Section title={t('spacing.overview.whyTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('spacing.overview.whyBody')}
              </p>
            </Content>
          </Section>

          <Section title={t('spacing.overview.scaleTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-4)]">
                {t('spacing.overview.scaleBody')}
              </p>
            </Content>
          </Section>

          <Section title={t('spacing.overview.anatomyTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('spacing.overview.anatomyBody')}
              </p>
            </Content>
            {/* Card anatomy demo */}
            <div className="bg-[var(--surface-container_100)] rounded-[var(--radius-lg)] p-[var(--space-6)] flex flex-col gap-[var(--space-4)] max-w-[400px] border border-[var(--border-subtle-100)]">
              <div className="flex items-center justify-between">
                <div className="text-xs [font-weight:var(--weight-semibold)] text-[var(--color-text-secondary)] tracking-[var(--tracking-wider)] uppercase">
                  padding: space-6 (24px)
                </div>
              </div>
              <div className="h-px bg-[var(--border-subtle-100)]" />
              <div className="flex flex-col gap-[var(--space-4)]">
                <div className="bg-[var(--surface_100)] rounded-[var(--radius-md)] p-[var(--space-3)] border border-[var(--border-subtle-100)]">
                  <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)]">Titel</div>
                </div>
                <div className="flex items-center">
                  <div className="text-xs [font-family:var(--font-mono)] text-[var(--color-brand-secondary-800)]">↕ gap: space-4 (16px)</div>
                </div>
                <div className="bg-[var(--surface_100)] rounded-[var(--radius-md)] p-[var(--space-3)] border border-[var(--border-subtle-100)]">
                  <div className="text-sm text-[var(--color-text-secondary)]">Beschreibungstext</div>
                </div>
                <div className="flex items-center gap-[var(--space-2)]">
                  <div className="w-4 h-4 rounded-[var(--radius-sm)] bg-[var(--accent-surface_100)]" />
                  <div className="text-xs [font-family:var(--font-mono)] text-[var(--color-brand-secondary-800)]">gap: space-2 (8px)</div>
                </div>
              </div>
            </div>
          </Section>

          <Section>
            <div className="grid grid-cols-3 max-[640px]:grid-cols-1 gap-[var(--space-6)]">
              {[
                { title: t('spacing.overview.p1Title'), body: t('spacing.overview.p1Body') },
                { title: t('spacing.overview.p2Title'), body: t('spacing.overview.p2Body') },
                { title: t('spacing.overview.p3Title'), body: t('spacing.overview.p3Body') },
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
          <Section title={t('spacing.usage.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('spacing.usage.intro')}
              </p>
            </Content>
          </Section>

          <Section title={t('spacing.usage.densityTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-4)]">
                {t('spacing.usage.densityBody')}
              </p>
            </Content>
            <div className="grid grid-cols-3 max-[640px]:grid-cols-1 gap-[var(--space-4)] mb-[var(--space-6)]">
              {[
                { label: t('spacing.usage.compactLabel'), desc: t('spacing.usage.compactDesc'), steps: [1,2,3], color: 'var(--color-success-container-100)', border: 'var(--color-success)' },
                { label: t('spacing.usage.defaultLabel'), desc: t('spacing.usage.defaultDesc'), steps: [4,6,8], color: 'var(--color-info-container-100)', border: 'var(--color-info)' },
                { label: t('spacing.usage.spaciousLabel'), desc: t('spacing.usage.spaciousDesc'), steps: [10,16,20], color: 'var(--color-warning-container-100)', border: 'var(--color-warning)' },
              ].map(({ label, desc, steps, color, border }) => (
                <div
                  key={label}
                  className="rounded-[var(--radius-lg)] p-[var(--space-5)] border"
                  style={{ background: color, borderColor: border }}
                >
                  <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">{label}</div>
                  <div className="flex gap-[var(--space-1)] mb-[var(--space-3)]">
                    {steps.map(s => (
                      <code key={s} className="text-xs [font-family:var(--font-mono)] bg-[var(--surface_100)] px-[6px] py-[2px] rounded-[var(--radius-sm)] text-[var(--color-text-secondary)]">
                        space-{s}
                      </code>
                    ))}
                  </div>
                  <div className="text-xs text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">{desc}</div>
                </div>
              ))}
            </div>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)]">
              <div className="bg-[var(--color-success-container-100)] border border-[var(--color-success)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('spacing.usage.doTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {DO_DONT.map(({ do: doKey }) => (
                    <li key={doKey} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-success)] shrink-0">✓</span>
                      <code className="[font-family:var(--font-mono)] text-xs">{t(`spacing.usage.${doKey}`)}</code>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('spacing.usage.doNote')}
                </div>
              </div>
              <div className="bg-[var(--color-error-container-100)] border border-[var(--color-error)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('spacing.usage.dontTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {DO_DONT.map(({ dont: dontKey }) => (
                    <li key={dontKey} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-error)] shrink-0">✗</span>
                      <code className="[font-family:var(--font-mono)] text-xs">{t(`spacing.usage.${dontKey}`)}</code>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('spacing.usage.dontNote')}
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
          <Section title={t('spacing.tokens.title')}>
            <div className="mb-[var(--space-6)]">
              {SCALE.map(([n, px]) => (
                <SpacingRow key={n} token={n} px={px} />
              ))}
            </div>
            <TokensTable tokens={spacingTokens} />
          </Section>
        </>
      ),
    },
    {
      id: 'code',
      label: t('tabs.code'),
      content: (
        <>
          <Section title={t('spacing.code.title')}>
            <Content>
              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">
                {t('spacing.code.cssTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('spacing.code.cssDesc')}
              </p>
              <CodeBlock language="css">{CSS_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('spacing.code.tailwindTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('spacing.code.tailwindDesc')}
              </p>
              <CodeBlock language="jsx">{TAILWIND_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('spacing.code.jsxTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('spacing.code.jsxDesc')}
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
      title="Spacing"
      description={t('spacing.page.description')}
      tabs={tabs}
    />
  )
}
