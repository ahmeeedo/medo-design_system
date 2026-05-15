import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content } from '../docs/PageLayout'
import { TokensTable } from '../docs/TokensTable'
import { CodeBlock } from '../docs/CodeBlock'

const DURATION_TOKENS = [
  { token: '--duration-instant', value: '50ms' },
  { token: '--duration-fast',    value: '100ms' },
  { token: '--duration-normal',  value: '150ms' },
  { token: '--duration-slow',    value: '250ms' },
  { token: '--duration-slower',  value: '400ms' },
]

const EASING_TOKENS = [
  { token: '--ease-out',    value: 'cubic-bezier(0, 0, 0.2, 1)' },
  { token: '--ease-in-out', value: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  { token: '--ease-spring', value: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
]

const DO_DONT = [
  { do: 'do1', dont: 'dont1' },
  { do: 'do2', dont: 'dont2' },
  { do: 'do3', dont: 'dont3' },
]

const CSS_CODE = `/* Button-Zustandswechsel */
.btn {
  transition:
    background-color var(--duration-fast) var(--ease-out),
    color            var(--duration-fast) var(--ease-out),
    box-shadow       var(--duration-fast) var(--ease-out);
}

/* Dropdown erscheint */
.dropdown {
  transition:
    opacity   var(--duration-slow) var(--ease-out),
    transform var(--duration-slow) var(--ease-out);
}

/* Barrierefreiheit: reduzierte Bewegung */
@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0.01ms !important;
    animation-duration:  0.01ms !important;
  }
}`

const ANIM_CODE = `/* Keyframe-Animation mit Motion-Tokens */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(var(--space-2));
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal {
  animation: fadeInUp var(--duration-slower) var(--ease-out);
}

@keyframes shimmer {
  from { transform: translateX(-100%); }
  to   { transform: translateX(100%); }
}

.skeleton::after {
  animation: shimmer var(--duration-slower) var(--ease-in-out) infinite;
}`

const JSX_CODE = `function AnimatedPanel({ visible }) {
  return (
    <div
      style={{
        transition: [
          \`opacity var(--duration-slow) var(--ease-out)\`,
          \`transform var(--duration-slow) var(--ease-out)\`,
        ].join(', '),
        opacity:   visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(var(--space-2))',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      {/* Panel-Inhalt */}
    </div>
  )
}

// Toggle mit ease-spring für bouncy Effekt
function Toggle({ checked }) {
  return (
    <div
      style={{
        transition: \`transform var(--duration-normal) var(--ease-spring)\`,
        transform: checked ? 'translateX(20px)' : 'translateX(0)',
      }}
    />
  )
}`

export default function MotionPage() {
  const { t } = useTranslation()

  const durationTokens = DURATION_TOKENS.map((tok, i) => {
    const descKeys = ['dInstant', 'dFast', 'dNormal', 'dSlow', 'dSlower']
    return { ...tok, description: t(`motion.tokens.${descKeys[i]}`) }
  })

  const easingTokens = EASING_TOKENS.map((tok, i) => {
    const descKeys = ['eOut', 'eInOut', 'eSpring']
    return { ...tok, description: t(`motion.tokens.${descKeys[i]}`) }
  })

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <Section title={t('motion.overview.principlesTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('motion.overview.principlesBody')}
              </p>
            </Content>
          </Section>

          <Section title={t('motion.overview.durationTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('motion.overview.durationBody')}
              </p>
            </Content>
            {/* Duration scale visualization */}
            <div className="flex flex-col gap-[var(--space-3)] mb-[var(--space-6)]">
              {DURATION_TOKENS.map(({ token, value }) => {
                const ms = parseInt(value)
                return (
                  <div key={token} className="flex items-center gap-[var(--space-4)]">
                    <code className="text-xs [font-family:var(--font-mono)] text-[var(--color-text-secondary)] w-[160px] shrink-0">
                      {token}
                    </code>
                    <div
                      className="h-[8px] rounded-[var(--radius-full)] bg-[var(--color-brand-secondary-700)]"
                      style={{ width: Math.max(ms * 0.6, 20) }}
                    />
                    <span className="text-xs [font-family:var(--font-mono)] text-[var(--color-text-secondary)]">
                      {value}
                    </span>
                  </div>
                )
              })}
            </div>
          </Section>

          <Section title={t('motion.overview.easingTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)] mb-[var(--space-6)]">
                {t('motion.overview.easingBody')}
              </p>
            </Content>
            {/* Easing curve visual overview */}
            <div className="grid grid-cols-3 max-[640px]:grid-cols-1 gap-[var(--space-4)] mb-[var(--space-4)]">
              {[
                { token: '--ease-out',    label: 'ease-out',    desc: 'Elemente erscheinen (deceleriert)' },
                { token: '--ease-in-out', label: 'ease-in-out', desc: 'Positionswechsel (symmetrisch)' },
                { token: '--ease-spring', label: 'ease-spring', desc: 'Bouncy Toggle / Chip' },
              ].map(({ token, desc }) => (
                <div key={token} className="bg-[var(--surface-container_100)] rounded-[var(--radius-lg)] p-[var(--space-5)] border border-[var(--border-subtle-100)]">
                  <code className="text-xs [font-family:var(--font-mono)] [font-weight:var(--weight-semibold)] text-[var(--color-text-tertiary)] block mb-[var(--space-2)]">
                    {token}
                  </code>
                  <div className="text-sm text-[var(--color-text-secondary)]">{desc}</div>
                </div>
              ))}
            </div>
          </Section>

          <Section>
            <div className="grid grid-cols-3 max-[640px]:grid-cols-1 gap-[var(--space-6)]">
              {[
                { title: t('motion.overview.p1Title'), body: t('motion.overview.p1Body') },
                { title: t('motion.overview.p2Title'), body: t('motion.overview.p2Body') },
                { title: t('motion.overview.p3Title'), body: t('motion.overview.p3Body') },
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
          <Section title={t('motion.usage.title')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('motion.usage.intro')}
              </p>
            </Content>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)] mb-[var(--space-6)]">
              <div className="bg-[var(--color-success-container-100)] border border-[var(--color-success)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">
                  {t('motion.usage.whenTitle')}
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                  {t('motion.usage.whenBody')}
                </p>
              </div>
              <div className="bg-[var(--color-error-container-100)] border border-[var(--color-error)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">
                  {t('motion.usage.whenNotTitle')}
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                  {t('motion.usage.whenNotBody')}
                </p>
              </div>
            </div>
          </Section>

          <Section title={t('motion.usage.reducedTitle')}>
            <Content>
              <p className="text-md text-[var(--color-text-secondary)] leading-[var(--leading-relaxed)]">
                {t('motion.usage.reducedBody')}
              </p>
            </Content>
          </Section>

          <Section>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--space-4)]">
              <div className="bg-[var(--color-success-container-100)] border border-[var(--color-success)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('motion.usage.doTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {DO_DONT.map(({ do: doKey }) => (
                    <li key={doKey} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-success)] shrink-0">✓</span>
                      <code className="[font-family:var(--font-mono)] text-xs">{t(`motion.usage.${doKey}`)}</code>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('motion.usage.doNote')}
                </div>
              </div>
              <div className="bg-[var(--color-error-container-100)] border border-[var(--color-error)] rounded-[var(--radius-lg)] p-[var(--space-5)]">
                <div className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-3)]">
                  {t('motion.usage.dontTitle')}
                </div>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {DO_DONT.map(({ dont: dontKey }) => (
                    <li key={dontKey} className="text-sm text-[var(--color-text-secondary)] flex gap-[var(--space-2)]">
                      <span className="text-[var(--color-error)] shrink-0">✗</span>
                      <code className="[font-family:var(--font-mono)] text-xs">{t(`motion.usage.${dontKey}`)}</code>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-[var(--color-text-secondary)] mt-[var(--space-3)] pt-[var(--space-3)] border-t border-[var(--border-subtle-100)]">
                  {t('motion.usage.dontNote')}
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
          <Section title={t('motion.tokens.title')}>
            <h3 className="text-md [font-weight:var(--weight-semibold)] text-[var(--color-text-secondary)] mb-[var(--space-3)]">
              {t('motion.tokens.durationTitle')}
            </h3>
            <TokensTable tokens={durationTokens} />

            <h3 className="text-md [font-weight:var(--weight-semibold)] text-[var(--color-text-secondary)] mb-[var(--space-3)] mt-[var(--space-6)]">
              {t('motion.tokens.easingTitle')}
            </h3>
            <TokensTable tokens={easingTokens} />
          </Section>
        </>
      ),
    },
    {
      id: 'code',
      label: t('tabs.code'),
      content: (
        <>
          <Section title={t('motion.code.title')}>
            <Content>
              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)]">
                {t('motion.code.cssTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('motion.code.cssDesc')}
              </p>
              <CodeBlock language="css">{CSS_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('motion.code.animTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('motion.code.animDesc')}
              </p>
              <CodeBlock language="css">{ANIM_CODE}</CodeBlock>

              <p className="text-sm [font-weight:var(--weight-semibold)] text-[var(--color-text-primary)] mb-[var(--space-2)] mt-[var(--space-6)]">
                {t('motion.code.jsxTitle')}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                {t('motion.code.jsxDesc')}
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
      title="Motion"
      description={t('motion.page.description')}
      tabs={tabs}
    />
  )
}
