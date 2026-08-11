import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content } from '../docs/PageLayout'
import { TokensTable } from '../docs/TokensTable'
import { Icon } from '../components/Icon/Icon'
import { useTokenValues, SPACE_STEPS, RADIUS_STEPS, SHADOW_STEPS, BORDER_WIDTHS, BREAKPOINTS } from '../docs/tokens'
import { PROSE, LIST, CAPTION, CARD, SUBHEAD } from '../docs/pageStyles'

const SPACE_TOKENS = SPACE_STEPS.map((step) => `--medo-space-${step}`)
const RADIUS_TOKENS = RADIUS_STEPS.map((step) => `--medo-radius-${step}`)
const BORDER_TOKENS = BORDER_WIDTHS.map((width) => `--medo-border-${width}`)
const BREAKPOINT_TOKENS = BREAKPOINTS.map((name) => `--medo-breakpoint-${name}`)

const GRID_COLUMNS = Array.from({ length: 12 }, (_, index) => index + 1)

export default function FoundationsPage() {
  const { t } = useTranslation()
  const spaceValues = useTokenValues(SPACE_TOKENS)
  const radiusValues = useTokenValues(RADIUS_TOKENS)
  const borderValues = useTokenValues(BORDER_TOKENS)
  const breakpointValues = useTokenValues(BREAKPOINT_TOKENS)

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <Section title={t('foundations.spacing.title')}>
            <Content>
              <p className={PROSE}>{t('foundations.spacing.body')}</p>
            </Content>
            <div className="flex flex-col">
              {SPACE_STEPS.map((step) => (
                <div
                  key={step}
                  className="flex items-center gap-[var(--medo-space-md)] py-[var(--medo-space-xs)] border-b border-[var(--medo-border-subtle)]"
                >
                  <span className="[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] w-[var(--docs-scale-label)] flex-none">
                    space-{step}
                  </span>
                  <span className={`${CAPTION} w-[var(--medo-space-2xl)] flex-none text-right`}>
                    {spaceValues[`--medo-space-${step}`]}
                  </span>
                  <span
                    className="h-[var(--medo-space-md)] bg-[var(--medo-action)] rounded-[var(--medo-radius-sm)] flex-none"
                    style={{ width: `var(--medo-space-${step})` }}
                  />
                </div>
              ))}
            </div>

            <h3 className={SUBHEAD}>{t('foundations.spacing.appliedTitle')}</h3>
            <Content>
              <p className={PROSE}>{t('foundations.spacing.appliedBody')}</p>
            </Content>
            <div className="bg-[var(--medo-surface-container)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-xl)]">
              <div className="max-w-[var(--docs-demo-card)] bg-[var(--medo-surface)] border border-[var(--medo-border-subtle)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)] flex flex-col gap-[var(--medo-space-sm)]">
                <div className="flex items-center justify-between">
                  <span className="[font-family:var(--medo-font-sans)] [font-size:var(--medo-text-lg)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)]">
                    {t('foundations.spacing.demoHeading')}
                  </span>
                  <span className="[font-family:var(--medo-font-sans)] [font-size:var(--medo-text-xs)] bg-[var(--medo-success-surface)] text-[var(--medo-success-text)] border border-[var(--medo-success-border)] px-[var(--medo-space-xs)] py-[var(--medo-space-3xs)] rounded-[var(--medo-radius-full)]">
                    {t('foundations.spacing.demoBadge')}
                  </span>
                </div>
                <p className="[font-family:var(--medo-font-sans)] [font-size:var(--medo-text-sm)] [line-height:var(--medo-leading-relaxed)] text-[var(--medo-text-muted)]">
                  {t('foundations.spacing.demoBody')}
                </p>
                <div className="flex gap-[var(--medo-space-xs)]">
                  <span className="[font-family:var(--medo-font-sans)] [font-size:var(--medo-text-sm)] bg-[var(--medo-action)] text-[var(--medo-action-text)] px-[var(--medo-space-md)] py-[var(--medo-space-xs)] rounded-[var(--medo-radius-md)]">
                    {t('foundations.spacing.demoPrimary')}
                  </span>
                  <span className="[font-family:var(--medo-font-sans)] [font-size:var(--medo-text-sm)] bg-[var(--medo-action-neutral)] text-[var(--medo-action-neutral-text)] px-[var(--medo-space-md)] py-[var(--medo-space-xs)] rounded-[var(--medo-radius-md)]">
                    {t('foundations.spacing.demoSecondary')}
                  </span>
                </div>
              </div>
              <p className={`${CAPTION} mt-[var(--medo-space-sm)]`}>{t('foundations.spacing.demoCaption')}</p>
            </div>
          </Section>

          <Section title={t('foundations.radii.title')}>
            <Content>
              <p className={PROSE}>{t('foundations.radii.body')}</p>
            </Content>
            <div className="grid grid-cols-7 max-[900px]:grid-cols-4 max-[640px]:grid-cols-2 gap-[var(--medo-space-sm)]">
              {RADIUS_STEPS.map((step) => (
                <div key={step} className="flex flex-col gap-[var(--medo-space-2xs)]">
                  <div
                    className="h-[var(--medo-space-3xl)] bg-[var(--medo-surface)] border border-[var(--medo-border-subtle)]"
                    style={{
                      borderRadius: `var(--medo-radius-${step})`,
                      borderBottomWidth: 'var(--medo-border-thick)',
                      borderBottomColor: 'var(--medo-action)',
                    }}
                  />
                  <span className="[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-xs)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)]">
                    radius-{step}
                  </span>
                  <span className={CAPTION}>{radiusValues[`--medo-radius-${step}`]}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title={t('foundations.elevation.title')}>
            <Content>
              <p className={PROSE}>{t('foundations.elevation.body')}</p>
            </Content>
            <div className="grid grid-cols-4 max-[900px]:grid-cols-2 gap-[var(--medo-space-lg)] p-[var(--medo-space-xs)]">
              {SHADOW_STEPS.map((step) => (
                <div key={step} className="flex flex-col gap-[var(--medo-space-xs)]">
                  <div
                    className="h-[var(--medo-space-4xl)] bg-[var(--medo-surface)] rounded-[var(--medo-radius-lg)]"
                    style={{ boxShadow: `var(--medo-shadow-${step})` }}
                  />
                  <span className="[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-xs)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)]">
                    shadow-{step}
                  </span>
                  <span className={CAPTION}>{t(`foundations.elevation.use.${step}`)}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title={t('foundations.borders.title')}>
            <Content>
              <p className={PROSE}>{t('foundations.borders.body')}</p>
            </Content>
            <div className="flex gap-[var(--medo-space-md)] max-[640px]:flex-col">
              {BORDER_WIDTHS.map((width) => (
                <div
                  key={width}
                  className="flex-1 bg-[var(--medo-surface)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)] border-solid border-[var(--medo-action)]"
                  style={{ borderWidth: `var(--medo-border-${width})` }}
                >
                  <div className="[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)]">
                    border-{width}
                  </div>
                  <div className={CAPTION}>
                    {borderValues[`--medo-border-${width}`]} · {t(`foundations.borders.use.${width}`)}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title={t('foundations.grid.title')}>
            <Content>
              <p className={PROSE}>{t('foundations.grid.body')}</p>
            </Content>
            <div className={`${CARD} overflow-x-auto [-webkit-overflow-scrolling:touch]`}>
              <div className="grid grid-cols-12 gap-[var(--medo-space-lg)] min-w-[var(--medo-breakpoint-sm)]">
                {GRID_COLUMNS.map((column) => (
                  <div
                    key={column}
                    className="h-[var(--medo-space-3xl)] bg-[var(--medo-surface-selected)] rounded-[var(--medo-radius-sm)] flex items-center justify-center [font-family:var(--medo-font-mono)] [font-size:var(--medo-text-xs)] text-[var(--medo-action)]"
                  >
                    {column}
                  </div>
                ))}
              </div>
            </div>
            <Content className="mt-[var(--medo-space-md)]">
              <ul className={LIST}>
                <li>{t('foundations.grid.rule1')}</li>
                <li>{t('foundations.grid.rule2')}</li>
                <li>{t('foundations.grid.rule3')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('foundations.breakpoints.title')}>
            <Content>
              <p className={PROSE}>{t('foundations.breakpoints.body')}</p>
            </Content>
            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-x-[var(--medo-space-xl)]">
              {BREAKPOINTS.map((name) => (
                <div
                  key={name}
                  className="flex items-baseline justify-between py-[var(--medo-space-xs)] border-b border-[var(--medo-border-subtle)]"
                >
                  <span className="[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)]">
                    breakpoint-{name}
                  </span>
                  <span className={`${PROSE} [font-size:var(--medo-text-sm)]`}>
                    {breakpointValues[`--medo-breakpoint-${name}`]} · {t(`foundations.breakpoints.use.${name}`)}
                  </span>
                </div>
              ))}
            </div>
          </Section>

          <Section title={t('foundations.motion.title')}>
            <Content>
              <p className={PROSE}>{t('foundations.motion.body')}</p>
              <ul className={`${LIST} mt-[var(--medo-space-sm)]`}>
                <li>{t('foundations.motion.rule1')}</li>
                <li>{t('foundations.motion.rule2')}</li>
                <li>{t('foundations.motion.rule3')}</li>
                <li>{t('foundations.motion.rule4')}</li>
              </ul>
            </Content>
            <div className={`${CARD} flex items-start gap-[var(--medo-space-xs)]`}>
              <Icon name="info" size={18} className="text-[var(--medo-icon-muted)] mt-[var(--medo-space-3xs)]" />
              <p className={`${PROSE} [font-size:var(--medo-text-sm)]`}>{t('foundations.motion.note')}</p>
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
          <Section title={t('foundations.usage.spacingTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('foundations.usage.spacing1')}</li>
                <li>{t('foundations.usage.spacing2')}</li>
                <li>{t('foundations.usage.spacing3')}</li>
                <li>{t('foundations.usage.spacing4')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('foundations.usage.radiiTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('foundations.usage.radii1')}</li>
                <li>{t('foundations.usage.radii2')}</li>
                <li>{t('foundations.usage.radii3')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('foundations.usage.elevationTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('foundations.usage.elevation1')}</li>
                <li>{t('foundations.usage.elevation2')}</li>
                <li>{t('foundations.usage.elevation3')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('foundations.usage.layoutTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('foundations.usage.layout1')}</li>
                <li>{t('foundations.usage.layout2')}</li>
                <li>{t('foundations.usage.layout3')}</li>
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
        <Section title={t('foundations.tokens.title')}>
          <Content>
            <p className={PROSE}>{t('foundations.tokens.body')}</p>
          </Content>

          <h3 className={SUBHEAD}>{t('foundations.tokens.spacingTitle')}</h3>
          <TokensTable tokens={SPACE_TOKENS.map((token) => ({ token }))} />

          <h3 className={SUBHEAD}>{t('foundations.tokens.radiiTitle')}</h3>
          <TokensTable tokens={RADIUS_TOKENS.map((token) => ({ token }))} />

          <h3 className={SUBHEAD}>{t('foundations.tokens.elevationTitle')}</h3>
          <TokensTable
            tokens={SHADOW_STEPS.map((step) => ({
              token: `--medo-shadow-${step}`,
              description: t(`foundations.elevation.use.${step}`),
            }))}
          />

          <h3 className={SUBHEAD}>{t('foundations.tokens.layoutTitle')}</h3>
          <TokensTable
            tokens={[
              ...BORDER_TOKENS.map((token) => ({ token })),
              ...BREAKPOINT_TOKENS.map((token) => ({ token })),
            ]}
          />
        </Section>
      ),
    },
    {
      id: 'accessibility',
      label: t('tabs.accessibility'),
      content: (
        <Section title={t('foundations.a11y.title')}>
          <Content>
            <ul className={LIST}>
              <li>{t('foundations.a11y.1')}</li>
              <li>{t('foundations.a11y.2')}</li>
              <li>{t('foundations.a11y.3')}</li>
              <li>{t('foundations.a11y.4')}</li>
            </ul>
          </Content>
        </Section>
      ),
    },
  ]

  return <PageLayout title={t('foundations.title')} description={t('foundations.description')} tabs={tabs} />
}
