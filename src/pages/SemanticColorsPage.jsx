import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content } from '../docs/PageLayout'
import { TokensTable } from '../docs/TokensTable'
import { SwatchList } from '../docs/ColorScale'
import { Icon } from '../components/Icon/Icon'
import { SEMANTIC_GROUPS } from '../docs/tokens'
import { PROSE, LIST, CAPTION, SUBHEAD } from '../docs/pageStyles'

const MONO_DATA = '[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-sm)] text-[var(--medo-text)]'

function AppliedExample({ t }) {
  return (
    <div className="bg-[var(--medo-surface-container)] border border-[var(--medo-border-subtle)] rounded-[var(--medo-radius-xl)] p-[var(--medo-space-xl)]">
      <div className="max-w-[var(--docs-demo-card)] mx-auto bg-[var(--medo-surface)] border border-[var(--medo-border-subtle)] rounded-[var(--medo-radius-lg)] p-[var(--medo-space-lg)] shadow-[var(--medo-shadow-sm)]">
        <div className="flex items-center gap-[var(--medo-space-xs)] mb-[var(--medo-space-sm)]">
          <Icon name="receipt_long" size={24} className="text-[var(--medo-icon)]" />
          <h3 className="[font-family:var(--medo-font-sans)] [font-size:var(--medo-text-lg)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)]">
            {t('semanticColors.example.heading')}
          </h3>
        </div>

        <p className="[font-family:var(--medo-font-sans)] [font-size:var(--medo-text-sm)] [line-height:var(--medo-leading-relaxed)] text-[var(--medo-text-muted)] mb-[var(--medo-space-md)]">
          {t('semanticColors.example.body')}
        </p>

        <div className="h-[var(--medo-border-thin)] bg-[var(--medo-divider)] mb-[var(--medo-space-md)]" />

        <div className="flex items-center justify-between py-[var(--medo-space-2xs)]">
          <span className="[font-family:var(--medo-font-sans)] [font-size:var(--medo-text-sm)] text-[var(--medo-text-subtle)]">
            {t('semanticColors.example.amountLabel')}
          </span>
          <span className={MONO_DATA}>1.234,56 €</span>
        </div>
        <div className="flex items-center justify-between py-[var(--medo-space-2xs)] mb-[var(--medo-space-md)]">
          <span className="[font-family:var(--medo-font-sans)] [font-size:var(--medo-text-sm)] text-[var(--medo-text-subtle)]">
            {t('semanticColors.example.dueLabel')}
          </span>
          <span className={MONO_DATA}>04.08.2026</span>
        </div>

        <div className="flex gap-[var(--medo-space-xs)] mb-[var(--medo-space-md)]">
          <span className="[font-family:var(--medo-font-sans)] [font-size:var(--medo-text-sm)] bg-[var(--medo-action)] text-[var(--medo-action-text)] px-[var(--medo-space-md)] py-[var(--medo-space-xs)] rounded-[var(--medo-radius-md)]">
            {t('semanticColors.example.primaryAction')}
          </span>
          <span className="[font-family:var(--medo-font-sans)] [font-size:var(--medo-text-sm)] bg-[var(--medo-action-neutral)] text-[var(--medo-action-neutral-text)] px-[var(--medo-space-md)] py-[var(--medo-space-xs)] rounded-[var(--medo-radius-md)]">
            {t('semanticColors.example.secondaryAction')}
          </span>
        </div>

        <div className="flex items-center gap-[var(--medo-space-xs)] bg-[var(--medo-success-surface)] border border-[var(--medo-success-border)] rounded-[var(--medo-radius-md)] px-[var(--medo-space-sm)] py-[var(--medo-space-xs)]">
          <Icon name="check_circle" size={18} className="text-[var(--medo-success-solid)]" />
          <span className="[font-family:var(--medo-font-sans)] [font-size:var(--medo-text-sm)] text-[var(--medo-success-text)]">
            {t('semanticColors.example.status')}
          </span>
        </div>
      </div>

      <p className={`${CAPTION} text-center mt-[var(--medo-space-md)]`}>{t('semanticColors.example.caption')}</p>
    </div>
  )
}

export default function SemanticColorsPage() {
  const { t } = useTranslation()

  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: (
        <>
          <Section title={t('semanticColors.applied.title')}>
            <Content>
              <p className={PROSE}>{t('semanticColors.applied.body')}</p>
            </Content>
            <AppliedExample t={t} />
          </Section>

          <Section title={t('semanticColors.groups.title')}>
            <Content>
              <p className={PROSE}>{t('semanticColors.groups.body')}</p>
            </Content>
            {SEMANTIC_GROUPS.map((group) => (
              <div key={group.id} className="mb-[var(--medo-space-lg)]">
                <h3 className={SUBHEAD}>{t(`semanticColors.groupTitles.${group.id}`)}</h3>
                <SwatchList tokens={group.tokens} />
              </div>
            ))}
          </Section>
        </>
      ),
    },
    {
      id: 'usage',
      label: t('tabs.usage'),
      content: (
        <>
          <Section title={t('semanticColors.usage.ruleTitle')}>
            <Content>
              <p className={PROSE}>{t('semanticColors.usage.ruleBody')}</p>
              <ul className={`${LIST} mt-[var(--medo-space-sm)]`}>
                <li>{t('semanticColors.usage.rule1')}</li>
                <li>{t('semanticColors.usage.rule2')}</li>
                <li>{t('semanticColors.usage.rule3')}</li>
                <li>{t('semanticColors.usage.rule4')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('semanticColors.usage.statesTitle')}>
            <Content>
              <ul className={LIST}>
                <li>{t('semanticColors.usage.states1')}</li>
                <li>{t('semanticColors.usage.states2')}</li>
                <li>{t('semanticColors.usage.states3')}</li>
                <li>{t('semanticColors.usage.states4')}</li>
              </ul>
            </Content>
          </Section>

          <Section title={t('semanticColors.usage.statusTitle')}>
            <Content>
              <p className={PROSE}>{t('semanticColors.usage.statusBody')}</p>
              <ul className={`${LIST} mt-[var(--medo-space-sm)]`}>
                <li>{t('semanticColors.usage.status1')}</li>
                <li>{t('semanticColors.usage.status2')}</li>
                <li>{t('semanticColors.usage.status3')}</li>
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
        <Section title={t('semanticColors.tokens.title')}>
          <Content>
            <p className={PROSE}>{t('semanticColors.tokens.body')}</p>
          </Content>
          {SEMANTIC_GROUPS.map((group) => (
            <div key={group.id}>
              <h3 className={SUBHEAD}>{t(`semanticColors.groupTitles.${group.id}`)}</h3>
              <TokensTable
                tokens={group.tokens.map((entry) => ({ token: `--medo-${entry.name}` }))}
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
        <Section title={t('semanticColors.a11y.title')}>
          <Content>
            <ul className={LIST}>
              <li>{t('semanticColors.a11y.1')}</li>
              <li>{t('semanticColors.a11y.2')}</li>
              <li>{t('semanticColors.a11y.3')}</li>
              <li>{t('semanticColors.a11y.4')}</li>
              <li>{t('semanticColors.a11y.5')}</li>
            </ul>
          </Content>
        </Section>
      ),
    },
  ]

  return <PageLayout title={t('semanticColors.title')} description={t('semanticColors.description')} tabs={tabs} />
}
