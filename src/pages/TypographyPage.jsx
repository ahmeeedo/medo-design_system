import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content } from '../docs/PageLayout'
import { TokensTable } from '../docs/TokensTable'
import { useTokenValues, TYPE_SIZES, FONT_WEIGHTS, LEADINGS, TRACKINGS } from '../docs/tokens'
import { PROSE, LIST, CAPTION, CARD, SUBHEAD } from '../docs/pageStyles'

/* Weight and role per step come from the type specification; the sizes
   themselves are read from the loaded tokens. Tracking tightens from text-xl
   (25px) upwards — the rule the specification states for headings. */
const SCALE_ROWS = [
  { size: 'xs', weight: 'regular', tight: false },
  { size: 'sm', weight: 'regular', tight: false },
  { size: 'base', weight: 'regular', tight: false },
  { size: 'lg', weight: 'regular', tight: false },
  { size: 'xl', weight: 'medium', tight: true },
  { size: '2xl', weight: 'semibold', tight: true },
  { size: '3xl', weight: 'bold', tight: true },
  { size: '4xl', weight: 'bold', tight: true },
]

const SIZE_TOKENS = TYPE_SIZES.flatMap((size) => [`--medo-text-${size}`, `--medo-text-${size}-line`])
const WEIGHT_TOKENS = FONT_WEIGHTS.map((weight) => `--medo-weight-${weight}`)
const LEADING_TOKENS = LEADINGS.map((leading) => `--medo-leading-${leading}`)
const TRACKING_TOKENS = TRACKINGS.map((tracking) => `--medo-tracking-${tracking}`)

const FAMILY_TOKENS = [
  { token: '--medo-font-sans' },
  { token: '--medo-font-mono' },
]

export default function TypographyPage() {
  const { t } = useTranslation()
  const sizeValues = useTokenValues(SIZE_TOKENS)
  const weightValues = useTokenValues(WEIGHT_TOKENS)
  const leadingValues = useTokenValues(LEADING_TOKENS)
  const trackingValues = useTokenValues(TRACKING_TOKENS)

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <Section title={t('typography.families.title')}>
            <Content>
              <p className={PROSE}>{t('typography.families.body')}</p>
            </Content>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-[var(--medo-space-md)]">
              <div className={CARD}>
                <div className={`${CAPTION} uppercase tracking-[var(--medo-tracking-wide)] mb-[var(--medo-space-sm)]`}>
                  font-sans · DM Sans
                </div>
                <div className="[font-family:var(--medo-font-sans)] [font-size:var(--medo-text-3xl)] [font-weight:var(--medo-weight-medium)] tracking-[var(--medo-tracking-tight)] [line-height:var(--medo-leading-tight)] mb-[var(--medo-space-sm)] text-[var(--medo-text)]">
                  Aa Bb Cc
                </div>
                <div className="[font-family:var(--medo-font-sans)] [font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-normal)]">
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />abcdefghijklmnopqrstuvwxyz 0123456789
                </div>
              </div>
              <div className={CARD}>
                <div className={`${CAPTION} uppercase tracking-[var(--medo-tracking-wide)] mb-[var(--medo-space-sm)]`}>
                  font-mono · DM Mono
                </div>
                <div className="[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-3xl)] [font-weight:var(--medo-weight-medium)] [line-height:var(--medo-leading-tight)] mb-[var(--medo-space-sm)] text-[var(--medo-text)]">
                  Aa Bb Cc
                </div>
                <div className="[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] [line-height:var(--medo-leading-normal)]">
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />abcdefghijklmnopqrstuvwxyz 0123456789
                </div>
              </div>
            </div>
          </Section>

          <Section title={t('typography.scale.title')}>
            <Content>
              <p className={PROSE}>{t('typography.scale.body')}</p>
            </Content>
            <div className="flex flex-col">
              {SCALE_ROWS.map((row) => (
                <div
                  key={row.size}
                  className="flex items-baseline gap-[var(--medo-space-lg)] py-[var(--medo-space-sm)] border-b border-[var(--medo-border-subtle)] max-[640px]:flex-col max-[640px]:items-start max-[640px]:gap-[var(--medo-space-2xs)]"
                >
                  <div
                    className="flex-1 min-w-0 truncate text-[var(--medo-text)] [font-family:var(--medo-font-sans)]"
                    style={{
                      fontSize: `var(--medo-text-${row.size})`,
                      fontWeight: `var(--medo-weight-${row.weight})`,
                      letterSpacing: row.tight ? 'var(--medo-tracking-tight)' : 'var(--medo-tracking-normal)',
                      lineHeight: 'var(--medo-leading-snug)',
                    }}
                  >
                    {t(`typography.samples.${row.size}`)}
                  </div>
                  <div className="flex-none w-[var(--docs-scale-label)] flex flex-col gap-[var(--medo-space-3xs)] text-right max-[640px]:text-left max-[640px]:w-auto">
                    <span className="[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)]">
                      text-{row.size}
                    </span>
                    <span className={CAPTION}>
                      {sizeValues[`--medo-text-${row.size}`]} · {sizeValues[`--medo-text-${row.size}-line`]} · {t(`typography.roles.${row.size}`)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title={t('typography.weights.title')}>
            <Content>
              <p className={PROSE}>{t('typography.weights.body')}</p>
            </Content>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-x-[var(--medo-space-xl)]">
              {FONT_WEIGHTS.map((weight) => (
                <div
                  key={weight}
                  className="flex items-baseline justify-between py-[var(--medo-space-sm)] border-b border-[var(--medo-border-subtle)]"
                >
                  <span
                    className="[font-family:var(--medo-font-sans)] [font-size:var(--medo-text-xl)] text-[var(--medo-text)] tracking-[var(--medo-tracking-tight)]"
                    style={{ fontWeight: `var(--medo-weight-${weight})` }}
                  >
                    {t(`typography.weightNames.${weight}`)}
                  </span>
                  <span className={CAPTION}>weight-{weight} · {weightValues[`--medo-weight-${weight}`]}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title={t('typography.rhythm.title')}>
            <div className="grid grid-cols-2 max-[900px]:grid-cols-1 gap-[var(--medo-space-xl)]">
              <div>
                <h3 className={SUBHEAD}>{t('typography.rhythm.leadingTitle')}</h3>
                {LEADINGS.map((leading) => (
                  <div key={leading} className="py-[var(--medo-space-xs)] border-b border-[var(--medo-border-subtle)]">
                    <div className={`${CAPTION} mb-[var(--medo-space-3xs)]`}>
                      leading-{leading} · {leadingValues[`--medo-leading-${leading}`]}
                    </div>
                    <div
                      className="[font-family:var(--medo-font-sans)] [font-size:var(--medo-text-sm)] text-[var(--medo-text-subtle)]"
                      style={{ lineHeight: `var(--medo-leading-${leading})` }}
                    >
                      {t('typography.rhythm.leadingSample')}
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <h3 className={SUBHEAD}>{t('typography.rhythm.trackingTitle')}</h3>
                {TRACKINGS.map((tracking) => (
                  <div key={tracking} className="py-[var(--medo-space-xs)] border-b border-[var(--medo-border-subtle)]">
                    <div className={`${CAPTION} mb-[var(--medo-space-3xs)]`}>
                      tracking-{tracking} · {trackingValues[`--medo-tracking-${tracking}`]}
                    </div>
                    <div
                      className="[font-family:var(--medo-font-sans)] [font-size:var(--medo-text-lg)] text-[var(--medo-text-subtle)]"
                      style={{ letterSpacing: `var(--medo-tracking-${tracking})` }}
                    >
                      {t(`typography.rhythm.trackingSample.${tracking}`)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          <Section title={t('typography.applied.title')}>
            <div className={`${CARD} [padding:var(--medo-space-xl)]`}>
              <div className="[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-xs)] [font-weight:var(--medo-weight-medium)] uppercase tracking-[var(--medo-tracking-wide)] text-[var(--medo-action)] mb-[var(--medo-space-sm)]">
                {t('typography.applied.eyebrow')}
              </div>
              <h3 className="[font-family:var(--medo-font-sans)] [font-size:var(--medo-text-3xl)] [font-weight:var(--medo-weight-bold)] [line-height:var(--medo-leading-tight)] tracking-[var(--medo-tracking-tight)] text-[var(--medo-text)] mb-[var(--medo-space-md)] max-w-[24ch]">
                {t('typography.applied.heading')}
              </h3>
              <p className="[font-family:var(--medo-font-sans)] [font-size:var(--medo-text-lg)] [line-height:var(--medo-leading-normal)] text-[var(--medo-text-muted)] mb-[var(--medo-space-md)] max-w-[60ch]">
                {t('typography.applied.lead')}
              </p>
              <p className="[font-family:var(--medo-font-sans)] [font-size:var(--medo-text-base)] [line-height:var(--medo-leading-relaxed)] text-[var(--medo-text-subtle)] mb-[var(--medo-space-sm)] max-w-[60ch]">
                {t('typography.applied.body')}
              </p>
              <p className="[font-family:var(--medo-font-sans)] [font-size:var(--medo-text-sm)] [line-height:var(--medo-leading-normal)] text-[var(--medo-text-muted)] max-w-[60ch]">
                {t('typography.applied.caption')}
              </p>
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
          <Section title={t('typography.usage.hierarchyTitle')}>
            <Content>
              <p className={PROSE}>{t('typography.usage.hierarchyBody')}</p>
              <ul className={`${LIST} mt-[var(--medo-space-sm)]`}>
                <li>{t('typography.usage.hierarchy1')}</li>
                <li>{t('typography.usage.hierarchy2')}</li>
                <li>{t('typography.usage.hierarchy3')}</li>
                <li>{t('typography.usage.hierarchy4')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('typography.usage.monoTitle')}>
            <Content>
              <p className={PROSE}>{t('typography.usage.monoBody')}</p>
            </Content>
            <div className={`${CARD} flex flex-col gap-[var(--medo-space-xs)]`}>
              <span className="[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-base)] text-[var(--medo-text)]">1.234,56 €</span>
              <span className="[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-base)] text-[var(--medo-text)]">04.08.2026 · 14:30</span>
              <span className="[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-base)] text-[var(--medo-text)]">RE-2026-004812</span>
            </div>
          </Section>

          <Section title={t('typography.usage.rulesTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('typography.usage.rules1')}</li>
                <li>{t('typography.usage.rules2')}</li>
                <li>{t('typography.usage.rules3')}</li>
                <li>{t('typography.usage.rules4')}</li>
              </ul>
            </Content>
          </Section>
        </>
      ),
    },
    {
      id: 'tokens',
      label: t('tabs.tokens'),
      content: (
        <Section title={t('typography.tokens.title')}>
          <Content>
            <p className={PROSE}>{t('typography.tokens.body')}</p>
          </Content>

          <h3 className={SUBHEAD}>{t('typography.tokens.familiesTitle')}</h3>
          <TokensTable tokens={FAMILY_TOKENS} />

          <h3 className={SUBHEAD}>{t('typography.tokens.sizesTitle')}</h3>
          <TokensTable
            tokens={TYPE_SIZES.flatMap((size) => [
              { token: `--medo-text-${size}` },
              { token: `--medo-text-${size}-line` },
            ])}
          />

          <h3 className={SUBHEAD}>{t('typography.tokens.weightsTitle')}</h3>
          <TokensTable tokens={FONT_WEIGHTS.map((weight) => ({ token: `--medo-weight-${weight}` }))} />

          <h3 className={SUBHEAD}>{t('typography.tokens.rhythmTitle')}</h3>
          <TokensTable
            tokens={[
              ...LEADINGS.map((leading) => ({ token: `--medo-leading-${leading}` })),
              ...TRACKINGS.map((tracking) => ({ token: `--medo-tracking-${tracking}` })),
            ]}
          />
        </Section>
      ),
    },
    {
      id: 'accessibility',
      label: t('tabs.accessibility'),
      content: (
        <Section title={t('typography.a11y.title')}>
          <Content>
            <ul className={LIST}>
              <li>{t('typography.a11y.1')}</li>
              <li>{t('typography.a11y.2')}</li>
              <li>{t('typography.a11y.3')}</li>
              <li>{t('typography.a11y.4')}</li>
            </ul>
          </Content>
        </Section>
      ),
    },
  ]

  return <PageLayout title={t('typography.title')} description={t('typography.description')} tabs={tabs} />
}
