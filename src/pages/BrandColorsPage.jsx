import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content } from '../docs/PageLayout'
import { TokensTable } from '../docs/TokensTable'
import { ColorScaleGrid } from '../docs/ColorScale'
import { useTokenValues, CHROMATIC_SCALES, NEUTRAL_SCALES, ALL_BRAND_SCALES, ABSOLUTE_COLORS, SCALE_STEPS, brandToken } from '../docs/tokens'
import { PROSE, LIST, CAPTION, CARD, SUBHEAD } from '../docs/pageStyles'

const withTokens = (scales) => scales.map((scale) => ({
  ...scale,
  tokenFor: (step) => brandToken(scale.name, step),
}))

const CHROMATIC = withTokens(CHROMATIC_SCALES)
const NEUTRAL = withTokens(NEUTRAL_SCALES)
const ABSOLUTE_TOKENS = ABSOLUTE_COLORS.map((name) => `--medo-color-${name}`)

const STEP_LEGEND = SCALE_STEPS.map((step) => ({ step, key: `brandColors.legend.s${step}` }))

export default function BrandColorsPage() {
  const { t } = useTranslation()
  const absoluteValues = useTokenValues(ABSOLUTE_TOKENS)

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <Section title={t('brandColors.chromatic.title')}>
            <Content>
              <p className={PROSE}>{t('brandColors.chromatic.body')}</p>
            </Content>
            <ColorScaleGrid scales={CHROMATIC} roleLabel={t('brandColors.roleLabel')} />
          </Section>

          <Section title={t('brandColors.neutral.title')}>
            <Content>
              <p className={PROSE}>{t('brandColors.neutral.body')}</p>
            </Content>
            <ColorScaleGrid scales={NEUTRAL} roleLabel={t('brandColors.roleLabel')} />
          </Section>

          <Section title={t('brandColors.absolute.title')}>
            <Content>
              <p className={PROSE}>{t('brandColors.absolute.body')}</p>
            </Content>
            <div className="flex flex-wrap gap-[var(--medo-space-md)]">
              {ABSOLUTE_COLORS.map((name) => (
                <div key={name} className="flex flex-col gap-[var(--medo-space-2xs)]">
                  <div
                    className="w-[var(--medo-space-4xl)] h-[var(--medo-space-2xl)] rounded-[var(--medo-radius-md)] border border-[var(--medo-border)]"
                    style={{ background: `var(--medo-color-${name})` }}
                  />
                  <span className="[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-sm)] text-[var(--medo-text)]">{name}</span>
                  <span className={`${CAPTION} uppercase`}>{absoluteValues[`--medo-color-${name}`]}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title={t('brandColors.steps.title')}>
            <Content>
              <p className={PROSE}>{t('brandColors.steps.body')}</p>
            </Content>
            <div className={`${CARD} grid grid-cols-2 max-[900px]:grid-cols-1 gap-x-[var(--medo-space-xl)]`}>
              {STEP_LEGEND.map(({ step, key }) => (
                <div
                  key={step}
                  className="flex items-baseline gap-[var(--medo-space-sm)] py-[var(--medo-space-2xs)] border-b border-[var(--medo-border-subtle)]"
                >
                  <span className="[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-sm)] text-[var(--medo-text)] w-[var(--medo-space-2xl)] flex-none">
                    {step}
                  </span>
                  <span className={PROSE}>{t(key)}</span>
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
          <Section title={t('brandColors.usage.whenTitle')}>
            <Content>
              <p className={PROSE}>{t('brandColors.usage.whenBody')}</p>
              <ul className={`${LIST} mt-[var(--medo-space-sm)]`}>
                <li>{t('brandColors.usage.when1')}</li>
                <li>{t('brandColors.usage.when2')}</li>
                <li>{t('brandColors.usage.when3')}</li>
              </ul>
            </Content>

            <h3 className={SUBHEAD}>{t('brandColors.usage.namingTitle')}</h3>
            <Content>
              <p className={PROSE}>{t('brandColors.usage.namingBody')}</p>
            </Content>
          </Section>

          <Section title={t('brandColors.usage.rolesTitle')}>
            <Content>
              <p className={PROSE}>{t('brandColors.usage.rolesBody')}</p>
              <ul className={`${LIST} mt-[var(--medo-space-sm)]`}>
                {ALL_BRAND_SCALES.filter((scale) => scale.role).map((scale) => (
                  <li key={scale.name}>
                    <code className="[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-sm)]">{scale.name}</code>
                    {' → '}
                    <code className="[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-sm)]">{scale.role}</code>
                  </li>
                ))}
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
        <Section title={t('brandColors.tokens.title')}>
          <Content>
            <p className={PROSE}>{t('brandColors.tokens.body')}</p>
          </Content>
          {ALL_BRAND_SCALES.map((scale) => (
            <div key={scale.name}>
              <h3 className={SUBHEAD}>{scale.name}</h3>
              <TokensTable tokens={SCALE_STEPS.map((step) => ({ token: brandToken(scale.name, step) }))} />
            </div>
          ))}
          <h3 className={SUBHEAD}>{t('brandColors.absolute.title')}</h3>
          <TokensTable tokens={ABSOLUTE_TOKENS.map((token) => ({ token }))} />
        </Section>
      ),
    },
    {
      id: 'accessibility',
      label: t('tabs.accessibility'),
      content: (
        <Section title={t('brandColors.a11y.title')}>
          <Content>
            <ul className={LIST}>
              <li>{t('brandColors.a11y.1')}</li>
              <li>{t('brandColors.a11y.2')}</li>
              <li>{t('brandColors.a11y.3')}</li>
              <li>{t('brandColors.a11y.4')}</li>
            </ul>
          </Content>
        </Section>
      ),
    },
  ]

  return <PageLayout title={t('brandColors.title')} description={t('brandColors.description')} tabs={tabs} />
}
