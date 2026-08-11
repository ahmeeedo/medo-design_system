import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content } from '../docs/PageLayout'
import { TokensTable } from '../docs/TokensTable'
import { ColorScaleGrid } from '../docs/ColorScale'
import { ALIAS_ROLES, SCALE_STEPS, aliasToken, brandToken } from '../docs/tokens'
import { PROSE, LIST, CARD, SUBHEAD } from '../docs/pageStyles'

const ROLE_SCALES = ALIAS_ROLES.map((entry) => ({
  name: entry.role,
  sublabel: `→ ${entry.brand}`,
  tokenFor: (step) => aliasToken(entry.role, step),
}))

export default function AliasColorsPage() {
  const { t } = useTranslation()

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <Section title={t('aliasColors.scales.title')}>
            <Content>
              <p className={PROSE}>{t('aliasColors.scales.body')}</p>
            </Content>
            <ColorScaleGrid scales={ROLE_SCALES} />
          </Section>

          <Section title={t('aliasColors.mapping.title')}>
            <Content>
              <p className={PROSE}>{t('aliasColors.mapping.body')}</p>
            </Content>
            <div className={CARD}>
              {ALIAS_ROLES.map((entry) => (
                <div
                  key={entry.role}
                  className="flex items-center gap-[var(--medo-space-sm)] py-[var(--medo-space-xs)] border-b border-[var(--medo-border-subtle)] last:border-b-0"
                >
                  <span
                    className="w-[var(--medo-space-md)] h-[var(--medo-space-md)] rounded-[var(--medo-radius-sm)] border border-[var(--medo-border)] shrink-0"
                    style={{ background: `var(${aliasToken(entry.role, 600)})` }}
                  />
                  <code className="[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-sm)] text-[var(--medo-text)] w-[var(--docs-scale-label)] flex-none">
                    {entry.role}
                  </code>
                  <code className="[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-sm)] text-[var(--medo-text-muted)] w-[var(--docs-scale-label)] flex-none max-[640px]:hidden">
                    → {entry.brand}
                  </code>
                  <span className={PROSE}>{t(`aliasColors.roles.${entry.role}`)}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title={t('aliasColors.noSecondary.title')}>
            <Content>
              <p className={PROSE}>{t('aliasColors.noSecondary.body')}</p>
            </Content>
          </Section>
        </>
      ),
    },
    {
      id: 'usage',
      label: t('tabs.usage'),
      content: (
        <>
          <Section title={t('aliasColors.usage.whyTitle')}>
            <Content>
              <p className={PROSE}>{t('aliasColors.usage.whyBody')}</p>
              <ul className={`${LIST} mt-[var(--medo-space-sm)]`}>
                <li>{t('aliasColors.usage.why1')}</li>
                <li>{t('aliasColors.usage.why2')}</li>
                <li>{t('aliasColors.usage.why3')}</li>
              </ul>
            </Content>

            <h3 className={SUBHEAD}>{t('aliasColors.usage.neutralTitle')}</h3>
            <Content>
              <p className={PROSE}>{t('aliasColors.usage.neutralBody')}</p>
            </Content>
          </Section>

          <Section title={t('aliasColors.usage.layerTitle')}>
            <Content>
              <p className={PROSE}>{t('aliasColors.usage.layerBody')}</p>
            </Content>
          </Section>
        </>
      ),
    },
    {
      id: 'tokens',
      label: t('tabs.tokens'),
      content: (
        <Section title={t('aliasColors.tokens.title')}>
          <Content>
            <p className={PROSE}>{t('aliasColors.tokens.body')}</p>
          </Content>
          {ALIAS_ROLES.map((entry) => (
            <div key={entry.role}>
              <h3 className={SUBHEAD}>{entry.role}</h3>
              <TokensTable
                tokens={SCALE_STEPS.map((step) => ({
                  token: aliasToken(entry.role, step),
                  ref: brandToken(entry.brand, step),
                }))}
              />
            </div>
          ))}
        </Section>
      ),
    },
    {
      id: 'accessibility',
      label: t('tabs.accessibility'),
      content: (
        <Section title={t('aliasColors.a11y.title')}>
          <Content>
            <ul className={LIST}>
              <li>{t('aliasColors.a11y.1')}</li>
              <li>{t('aliasColors.a11y.2')}</li>
              <li>{t('aliasColors.a11y.3')}</li>
            </ul>
          </Content>
        </Section>
      ),
    },
  ]

  return <PageLayout title={t('aliasColors.title')} description={t('aliasColors.description')} tabs={tabs} />
}
