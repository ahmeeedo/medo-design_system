import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, GridWrapper, Grid } from '../docs/PageLayout'
import { TokensTable } from '../docs/TokensTable'
import { CodeBlock } from '../docs/CodeBlock'
import { Swatch } from '../docs/helpers'
import styles from '../App.module.css'

export default function ColorsPage() {
  const { t } = useTranslation()

  const surfaceTokens = [
    { token: '--surface_100',            value: '#FFFFFF',  description: t('colors.tokens.s100') },
    { token: '--surface_200',            value: '#F8F9FA',  description: t('colors.tokens.s200') },
    { token: '--surface_active',         value: '#E9ECEF',  description: t('colors.tokens.sActive') },
    { token: '--surface_selected',       value: '#CED4DA',  description: t('colors.tokens.sSelected') },
    { token: '--surface_selected-hover', value: '#ADB5BD',  description: t('colors.tokens.sSelectedHover') },
    { token: '--surface_inverse',        value: '#212529',  description: t('colors.tokens.sInverse') },
    { token: '--surface_inverse-hover',  value: '#343A40',  description: t('colors.tokens.sInverseHover') },
    { token: '--surface_brand',          value: '#1C2855',  description: t('colors.tokens.sBrand') },
  ]

  const surfaceContTokens = [
    { token: '--surface-container_100',                value: '#F8F9FA', description: t('colors.tokens.sc100') },
    { token: '--surface-container_200',                value: '#F1F3F5', description: t('colors.tokens.sc200') },
    { token: '--surface-container_hover-100',          value: '#F1F3F5', description: t('colors.tokens.scHover100') },
    { token: '--surface-container_hover-200',          value: '#E9ECEF', description: t('colors.tokens.scHover200') },
    { token: '--surface-container_active-100',         value: '#DEE2E6', description: t('colors.tokens.scActive100') },
    { token: '--surface-container_selected-100',       value: '#CED4DA', description: t('colors.tokens.scSelected100') },
    { token: '--surface-container_selected-hover-100', value: '#ADB5BD', description: t('colors.tokens.scSelectedHover100') },
  ]

  const accentSurfTokens = [
    { token: '--accent-surface_100',        value: '#DCE0EB', description: t('colors.tokens.as100') },
    { token: '--accent-surface_hover-100',  value: '#BDC6D9', description: t('colors.tokens.asHover100') },
    { token: '--accent-surface_active-100', value: '#9DAAC7', description: t('colors.tokens.asActive100') },
  ]

  const textTokens = [
    { token: '--color-text-primary',   value: '#212529', description: t('colors.tokens.tPrimary') },
    { token: '--color-text-secondary', value: '#343A40', description: t('colors.tokens.tSecondary') },
    { token: '--color-text-tertiary',  value: '#030711', description: t('colors.tokens.tTertiary') },
    { token: '--color-text-disabled',  value: '#DEE2E6', description: t('colors.tokens.tDisabled') },
    { token: '--color-text-inverse',   value: '#FFFFFF', description: t('colors.tokens.tInverse') },
    { token: '--color-text-on-color',  value: '#FFFFFF', description: t('colors.tokens.tOnColor') },
    { token: '--color-text-success',   value: '#4CAF50', description: t('colors.tokens.tSuccess') },
    { token: '--color-text-warning',   value: '#FAB005', description: t('colors.tokens.tWarning') },
    { token: '--color-text-error',     value: '#B71C1C', description: t('colors.tokens.tError') },
    { token: '--color-text-info',      value: '#3A4A76', description: t('colors.tokens.tInfo') },
    { token: '--color-text-helper',    value: '#495057', description: t('colors.tokens.tHelper') },
  ]

  const borderTokens = [
    { token: '--border-subtle-100',      value: '#DEE2E6', description: t('colors.tokens.bSubtle100') },
    { token: '--border-subtle-200',      value: '#CED4DA', description: t('colors.tokens.bSubtle200') },
    { token: '--border-strong-100',      value: '#343A40', description: t('colors.tokens.bStrong100') },
    { token: '--border-strong-200',      value: '#212529', description: t('colors.tokens.bStrong200') },
    { token: '--border-brand-primary',   value: '#1C2855', description: t('colors.tokens.bBrandPrimary') },
    { token: '--border-brand-secondary', value: '#BF5226', description: t('colors.tokens.bBrandSecondary') },
  ]

  const buttonTokens = [
    { token: '--btn-primary',         value: '#0A1E46', description: t('colors.tokens.btnPrimary') },
    { token: '--btn-primary-hover',   value: '#1C2855', description: t('colors.tokens.btnPrimaryHover') },
    { token: '--btn-primary-active',  value: '#38548C', description: t('colors.tokens.btnPrimaryActive') },
    { token: '--btn-secondary',       value: '#212529', description: t('colors.tokens.btnSecondary') },
    { token: '--btn-secondary-hover', value: '#343A40', description: t('colors.tokens.btnSecHover') },
    { token: '--btn-secondary-active',value: '#495057', description: t('colors.tokens.btnSecActive') },
    { token: '--btn-ghost',           value: 'transparent', description: t('colors.tokens.btnGhost') },
    { token: '--btn-ghost-hover',     value: '#E9ECEF', description: t('colors.tokens.btnGhostHover') },
    { token: '--btn-accent',          value: '#DE6F43', description: t('colors.tokens.btnAccent') },
    { token: '--btn-accent-hover',    value: '#CC663D', description: t('colors.tokens.btnAccentHover') },
    { token: '--btn-danger',          value: '#D32F2F', description: t('colors.tokens.btnDanger') },
    { token: '--btn-danger-hover',    value: '#B71C1C', description: t('colors.tokens.btnDangerHover') },
    { token: '--btn-disabled',        value: '#49505725', description: t('colors.tokens.btnDisabled') },
  ]

  const statusTokens = [
    { token: '--color-success',               value: '#388E3C', description: t('colors.tokens.success') },
    { token: '--color-success-container-100', value: '#E8F5E9', description: t('colors.tokens.successContainer') },
    { token: '--color-warning',               value: '#FAB005', description: t('colors.tokens.warning') },
    { token: '--color-warning-container-100', value: '#FFF9DB', description: t('colors.tokens.warningContainer') },
    { token: '--color-error',                 value: '#D32F2F', description: t('colors.tokens.error') },
    { token: '--color-error-container-100',   value: '#FFEBEE', description: t('colors.tokens.errorContainer') },
    { token: '--color-info',                  value: '#2A3A66', description: t('colors.tokens.info') },
    { token: '--color-info-container-100',    value: '#EBEFF7', description: t('colors.tokens.infoContainer') },
  ]

  const iconTokens = [
    { token: '--icon_primary',          value: '#212529', description: t('colors.tokens.iconPrimary') },
    { token: '--icon_secondary',        value: '#343A40', description: t('colors.tokens.iconSecondary') },
    { token: '--icon_on-color',         value: '#FFFFFF', description: t('colors.tokens.iconOnColor') },
    { token: '--icon_brand-primary',    value: '#1C2855', description: t('colors.tokens.iconBrandPrimary') },
    { token: '--icon_brand-secondary',  value: '#CC663D', description: t('colors.tokens.iconBrandSec') },
  ]

  const linkTokens = [
    { token: '--color-link-primary',       value: '#1C2855', description: t('colors.tokens.linkPrimary') },
    { token: '--color-link-primary-hover', value: '#050F23', description: t('colors.tokens.linkHover') },
  ]

  const focusTokens = [
    { token: '--color-focus',         value: '#2B5AD9', description: t('colors.tokens.focusRing') },
    { token: '--color-focus-inset',   value: '#FFFFFF', description: t('colors.tokens.focusInset') },
    { token: '--color-disabled',      value: '#49505725', description: t('colors.tokens.disabled') },
    { token: '--color-overlay',       value: '#00000060', description: t('colors.tokens.overlay') },
  ]

  const btnStateStyle = {
    padding: 'var(--space-2) var(--space-4)',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    border: 'none',
    cursor: 'default',
    color: 'var(--color-text-on-color)',
  }

  return (
    <PageLayout
      title={t('nav.items.colors')}
      description={t('colors.page.description')}
      tabs={[
        {
          id: 'overview',
          label: t('tabs.overview'),
          content: (
            <>
              <Section title={t('colors.overview.aboutTitle')}>
                <Content>
                  <p>{t('colors.overview.aboutBody')}</p>
                </Content>
                <h3 className={styles.groupTitle}>{t('colors.overview.principlesTitle')}</h3>
                <Content>
                  <p><strong>{t('colors.overview.p1Title')}</strong></p>
                  <p>{t('colors.overview.p1Body')}</p>
                </Content>
                <Content>
                  <p><strong>{t('colors.overview.p2Title')}</strong></p>
                  <p>{t('colors.overview.p2Body')}</p>
                </Content>
                <Content>
                  <p><strong>{t('colors.overview.p3Title')}</strong></p>
                  <p>{t('colors.overview.p3Body')}</p>
                </Content>
              </Section>

              <Section title={t('colors.overview.theoryTitle')}>
                <h3 className={styles.groupTitle}>{t('colors.overview.t1Title')}</h3>
                <Content><p>{t('colors.overview.t1Body')}</p></Content>
                <h3 className={styles.groupTitle}>{t('colors.overview.t2Title')}</h3>
                <Content><p>{t('colors.overview.t2Body')}</p></Content>
                <h3 className={styles.groupTitle}>{t('colors.overview.t3Title')}</h3>
                <Content><p>{t('colors.overview.t3Body')}</p></Content>
                <h3 className={styles.groupTitle}>{t('colors.overview.t4Title')}</h3>
                <Content><p>{t('colors.overview.t4Body')}</p></Content>
              </Section>

              <Section title={t('colors.overview.foundationalTitle')}>
                <Content>
                  <p>{t('colors.overview.foundationalBody')}</p>
                  <p>{t('colors.overview.foundationalNote')}</p>
                  <ul>
                    <li><strong>{t('colors.overview.fl1Title')}</strong> {t('colors.overview.fl1Body')}</li>
                    <li><strong>{t('colors.overview.fl2Title')}</strong> {t('colors.overview.fl2Body')}</li>
                    <li><strong>{t('colors.overview.fl3Title')}</strong> {t('colors.overview.fl3Body')}</li>
                  </ul>
                </Content>
              </Section>

              <Section title={t('colors.overview.brandColorsTitle')}>
                <h3 className={styles.groupTitle}>Red</h3>
                <div className={styles.swatchGrid}>
                  {[100,200,300,400,500,600,700,800,900,1000].map(n => (
                    <Swatch key={n} bg={`var(--color-brand-red-${n})`} label={`Red ${n}`} />
                  ))}
                </div>
                <h3 className={styles.groupTitle}>Yellow</h3>
                <div className={styles.swatchGrid}>
                  {[100,200,300,400,500,600,700,800,900,1000].map(n => (
                    <Swatch key={n} bg={`var(--color-brand-yellow-${n})`} label={`Yellow ${n}`} />
                  ))}
                </div>
                <h3 className={styles.groupTitle}>Green</h3>
                <div className={styles.swatchGrid}>
                  {[100,200,300,400,500,600,700,800,900,1000].map(n => (
                    <Swatch key={n} bg={`var(--color-brand-green-${n})`} label={`Green ${n}`} />
                  ))}
                </div>
                <h3 className={styles.groupTitle}>Blue</h3>
                <div className={styles.swatchGrid}>
                  {[100,200,300,400,500,600,700,800,900,1000].map(n => (
                    <Swatch key={n} bg={`var(--color-brand-blue-${n})`} label={`Blue ${n}`} />
                  ))}
                </div>
                <h3 className={styles.groupTitle}>Grey</h3>
                <div className={styles.swatchGrid}>
                  {[100,200,300,400,500,600,700,800,900,1000].map(n => (
                    <Swatch key={n} bg={`var(--color-brand-grey-${n})`} label={`Grey ${n}`} />
                  ))}
                </div>
                <h3 className={styles.groupTitle}>Navy</h3>
                <div className={styles.swatchGrid}>
                  {[100,200,300,400,500,600,700,800,900,1000].map(n => (
                    <Swatch key={n} bg={`var(--color-brand-navy-${n})`} label={`Navy ${n}`} />
                  ))}
                </div>
                <h3 className={styles.groupTitle}>Orange</h3>
                <div className={styles.swatchGrid}>
                  {[100,200,300,400,500,600,700,800,900,1000].map(n => (
                    <Swatch key={n} bg={`var(--color-brand-orange-${n})`} label={`Orange ${n}`} />
                  ))}
                </div>
                <h3 className={styles.groupTitle}>Cobalt</h3>
                <div className={styles.swatchGrid}>
                  {[100,200,300,400,500,600,700,800,900,1000].map(n => (
                    <Swatch key={n} bg={`var(--color-brand-cobalt-${n})`} label={`Cobalt ${n}`} />
                  ))}
                </div>
              </Section>

              <Section title={t('colors.overview.aliasColorsTitle')}>
                <h3 className={styles.groupTitle}>{t('colors.overview.neutralTitle')}</h3>
                <div className={styles.swatchGrid}>
                  {[
                    ['var(--color-neutral-0)',    '0',    true],
                    ['var(--color-neutral-50)',   '50',   true],
                    ['var(--color-neutral-100)',  '100'],
                    ['var(--color-neutral-200)',  '200'],
                    ['var(--color-neutral-300)',  '300'],
                    ['var(--color-neutral-400)',  '400'],
                    ['var(--color-neutral-500)',  '500'],
                    ['var(--color-neutral-600)',  '600'],
                    ['var(--color-neutral-700)',  '700'],
                    ['var(--color-neutral-800)',  '800'],
                    ['var(--color-neutral-900)',  '900'],
                    ['var(--color-neutral-1000)', '1000'],
                  ].map(([bg, label, border]) => (
                    <Swatch key={label} bg={bg} label={label} border={!!border} />
                  ))}
                </div>
                <h3 className={styles.groupTitle}>{t('colors.overview.primaryTitle')}</h3>
                <div className={styles.swatchGrid}>
                  {[100,200,300,400,500,600,700,800,900,1000].map(n => (
                    <Swatch key={n} bg={`var(--color-brand-primary-${n})`} label={String(n)} />
                  ))}
                </div>
                <h3 className={styles.groupTitle}>{t('colors.overview.secondaryTitle')}</h3>
                <div className={styles.swatchGrid}>
                  {[100,200,300,400,500,600,700,800,900,1000].map(n => (
                    <Swatch key={n} bg={`var(--color-brand-secondary-${n})`} label={String(n)} />
                  ))}
                </div>
                <h3 className={styles.groupTitle}>{t('colors.overview.successTitle')}</h3>
                <div className={styles.swatchGrid}>
                  {[100,200,300,400,500,600,700,800,900,1000].map(n => (
                    <Swatch key={n} bg={`var(--color-success-${n})`} label={String(n)} />
                  ))}
                </div>
                <h3 className={styles.groupTitle}>{t('colors.overview.warningTitle')}</h3>
                <div className={styles.swatchGrid}>
                  {[100,200,300,400,500,600,700,800,900,1000].map(n => (
                    <Swatch key={n} bg={`var(--color-warning-${n})`} label={String(n)} />
                  ))}
                </div>
                <h3 className={styles.groupTitle}>{t('colors.overview.errorTitle')}</h3>
                <div className={styles.swatchGrid}>
                  {[100,200,300,400,500,600,700,800,900,1000].map(n => (
                    <Swatch key={n} bg={`var(--color-error-${n})`} label={String(n)} />
                  ))}
                </div>
                <h3 className={styles.groupTitle}>{t('colors.overview.infoTitle')}</h3>
                <div className={styles.swatchGrid}>
                  {[100,200,300,400,500,600,700,800,900,1000].map(n => (
                    <Swatch key={n} bg={`var(--color-info-${n})`} label={String(n)} />
                  ))}
                </div>
                <h3 className={styles.groupTitle}>{t('colors.overview.focusTitle')}</h3>
                <div className={styles.swatchGrid}>
                  {[100,200,300,400,500,600,700,800,900,1000].map(n => (
                    <Swatch key={n} bg={`var(--color-focus-${n})`} label={String(n)} />
                  ))}
                </div>
              </Section>

              <Section title={t('colors.overview.mappedColorsTitle')}>
                <Content>
                  <p>
                    <a href="/colors?tab=tokens">{t('colors.overview.mappedColorsLink')}</a>
                  </p>
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
              <Section title={t('colors.usage.title')}>
                <Content>
                  <p>{t('colors.usage.intro')}</p>
                </Content>

                <h3 className={styles.groupTitle}>{t('colors.usage.semanticTitle')}</h3>
                <Content>
                  <p>{t('colors.usage.semanticBody')}</p>
                </Content>

                <h3 className={styles.groupTitle}>{t('colors.usage.rawTitle')}</h3>
                <Content>
                  <p>{t('colors.usage.rawBody')}</p>
                </Content>

                <GridWrapper>
                  <Grid>
                    <Grid.Header className="text-[var(--color-text-success)] [font-weight:var(--weight-semibold)] text-[var(--text-md)] pb-[var(--space-2)] mb-[var(--space-3)] border-b-2 border-[var(--color-success)]">
                      {t('colors.usage.doTitle')}
                    </Grid.Header>
                    <Grid.Body>
                      <ul className="flex flex-col gap-[var(--space-2)] text-[var(--text-sm)] text-[var(--color-text-primary)] list-none p-0 m-0">
                        {['do1','do2','do3','do4','do5'].map(k => (
                          <li key={k} className="p-[var(--space-2)] rounded-[var(--radius-md)] bg-[var(--color-success-container-100)]">
                            <code className="[font-family:var(--font-mono)]">{t(`colors.usage.${k}`)}</code>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-[var(--space-3)] text-[var(--text-xs)] text-[var(--color-text-secondary)]">{t('colors.usage.doNote')}</p>
                    </Grid.Body>
                  </Grid>
                  <Grid>
                    <Grid.Header className="text-[var(--color-text-error)] [font-weight:var(--weight-semibold)] text-[var(--text-md)] pb-[var(--space-2)] mb-[var(--space-3)] border-b-2 border-[var(--color-error)]">
                      {t('colors.usage.dontTitle')}
                    </Grid.Header>
                    <Grid.Body>
                      <ul className="flex flex-col gap-[var(--space-2)] text-[var(--text-sm)] text-[var(--color-text-primary)] list-none p-0 m-0">
                        {['dont1','dont2','dont3','dont4','dont5'].map(k => (
                          <li key={k} className="p-[var(--space-2)] rounded-[var(--radius-md)] bg-[var(--color-error-container-100)]">
                            <code className="[font-family:var(--font-mono)]">{t(`colors.usage.${k}`)}</code>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-[var(--space-3)] text-[var(--text-xs)] text-[var(--color-text-secondary)]">{t('colors.usage.dontNote')}</p>
                    </Grid.Body>
                  </Grid>
                </GridWrapper>
              </Section>

              <Section title={t('colors.usage.statesTitle')}>
                <Content>
                  <p>{t('colors.usage.statesBody')}</p>
                </Content>

                <div className="mb-[var(--space-6)]">
                  <p className="text-[var(--text-xs)] [font-weight:var(--weight-semibold)] tracking-[var(--tracking-wide)] uppercase text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                    {t('colors.usage.statesBtnNote')}
                  </p>
                  <div className="flex gap-[var(--space-3)] flex-wrap items-center p-[var(--space-5)] bg-[var(--surface_200)] rounded-[var(--radius-lg)] border border-[var(--border-subtle-100)]">
                    <span style={{ ...btnStateStyle, background: 'var(--btn-primary)' }}>
                      {t('colors.usage.statesDefault')}
                    </span>
                    <span style={{ ...btnStateStyle, background: 'var(--btn-primary-hover)' }}>
                      {t('colors.usage.statesHover')}
                    </span>
                    <span style={{ ...btnStateStyle, background: 'var(--btn-primary-active)' }}>
                      {t('colors.usage.statesActive')}
                    </span>
                    <span style={{ ...btnStateStyle, background: 'var(--btn-disabled)', color: 'var(--color-text-primary)', opacity: 0.6 }}>
                      {t('colors.usage.statesDisabled')}
                    </span>
                  </div>
                </div>

                <div className="mb-[var(--space-6)]">
                  <p className="text-[var(--text-xs)] [font-weight:var(--weight-semibold)] tracking-[var(--tracking-wide)] uppercase text-[var(--color-text-secondary)] mb-[var(--space-3)]">
                    {t('colors.usage.statesGhostNote')}
                  </p>
                  <div className="flex gap-[var(--space-3)] flex-wrap items-center p-[var(--space-5)] bg-[var(--surface_200)] rounded-[var(--radius-lg)] border border-[var(--border-subtle-100)]">
                    <span style={{ ...btnStateStyle, background: 'transparent', color: 'var(--color-text-primary)', border: '1px solid var(--border-subtle-200)' }}>
                      {t('colors.usage.statesDefault')}
                    </span>
                    <span style={{ ...btnStateStyle, background: 'var(--btn-ghost-hover)', color: 'var(--color-text-primary)', border: '1px solid var(--border-subtle-200)' }}>
                      {t('colors.usage.statesHover')}
                    </span>
                    <span style={{ ...btnStateStyle, background: 'var(--btn-ghost-active)', color: 'var(--color-text-primary)', border: '1px solid var(--border-subtle-200)' }}>
                      {t('colors.usage.statesActive')}
                    </span>
                    <span style={{ ...btnStateStyle, background: 'transparent', color: 'var(--color-text-disabled)', border: '1px solid var(--border-subtle-100)', opacity: 0.6 }}>
                      {t('colors.usage.statesDisabled')}
                    </span>
                  </div>
                </div>
              </Section>

              <Section title={t('colors.usage.surfaceTitle2')}>
                <Content>
                  <p>{t('colors.usage.surfaceBody')}</p>
                </Content>
                <div className="mb-[var(--space-8)]">
                  <div style={{ background: 'var(--surface_100)', border: '1px solid var(--border-subtle-100)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)' }}>
                    <span className="text-[var(--text-xs)] [font-weight:var(--weight-semibold)] tracking-[var(--tracking-wide)] uppercase text-[var(--color-text-secondary)]">
                      surface_100 — {t('colors.usage.surfaceL1')}
                    </span>
                    <div style={{ background: 'var(--surface_200)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', marginTop: 'var(--space-4)' }}>
                      <span className="text-[var(--text-xs)] [font-weight:var(--weight-semibold)] tracking-[var(--tracking-wide)] uppercase text-[var(--color-text-secondary)]">
                        surface_200 — {t('colors.usage.surfaceL2')}
                      </span>
                      <div style={{ background: 'var(--surface-container_100)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-4)', marginTop: 'var(--space-3)', border: '1px solid var(--border-subtle-100)' }}>
                        <span className="text-[var(--text-xs)] [font-weight:var(--weight-semibold)] tracking-[var(--tracking-wide)] uppercase text-[var(--color-text-secondary)]">
                          surface-container_100 — {t('colors.usage.surfaceCont')}
                        </span>
                      </div>
                    </div>
                    <div style={{ background: 'var(--surface_brand)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', marginTop: 'var(--space-4)' }}>
                      <span className="text-[var(--text-xs)] [font-weight:var(--weight-semibold)] tracking-[var(--tracking-wide)] uppercase text-[var(--color-text-on-color)]">
                        surface_brand — {t('colors.usage.surfaceBrand')}
                      </span>
                    </div>
                  </div>
                </div>
              </Section>

              <Section title={t('colors.usage.a11yTitle')}>
                <Content>
                  <p>{t('colors.usage.a11yBody')}</p>
                </Content>
              </Section>

              <Section title={t('colors.usage.themeTitle')}>
                <Content>
                  <p>{t('colors.usage.themeBody')}</p>
                </Content>
              </Section>
            </>
          ),
        },

        {
          id: 'tokens',
          label: t('tabs.tokens'),
          content: (
            <>
              <Section title={t('colors.tokens.surfaceTitle')}>
                <TokensTable tokens={surfaceTokens} />
              </Section>
              <Section title={t('colors.tokens.surfaceContTitle')}>
                <TokensTable tokens={surfaceContTokens} />
              </Section>
              <Section title={t('colors.tokens.accentSurfTitle')}>
                <TokensTable tokens={accentSurfTokens} />
              </Section>
              <Section title={t('colors.tokens.textTitle')}>
                <TokensTable tokens={textTokens} />
              </Section>
              <Section title={t('colors.tokens.borderTitle')}>
                <TokensTable tokens={borderTokens} />
              </Section>
              <Section title={t('colors.tokens.buttonTitle')}>
                <TokensTable tokens={buttonTokens} />
              </Section>
              <Section title={t('colors.tokens.statusTitle')}>
                <TokensTable tokens={statusTokens} />
              </Section>
              <Section title={t('colors.tokens.iconTitle')}>
                <TokensTable tokens={iconTokens} />
              </Section>
              <Section title={t('colors.tokens.linkTitle')}>
                <TokensTable tokens={linkTokens} />
              </Section>
              <Section title={t('colors.tokens.focusTitle')}>
                <TokensTable tokens={focusTokens} />
              </Section>
            </>
          ),
        },

        {
          id: 'code',
          label: t('tabs.code'),
          content: (
            <>
              <Section title={t('colors.code.title')}>
                <h3 className={styles.groupTitle}>{t('colors.code.cssTitle')}</h3>
                <Content>
                  <p>{t('colors.code.cssDesc')}</p>
                </Content>
                <CodeBlock language="css">{`/* Texte und Hintergründe */
.card {
  color:       var(--color-text-primary);
  background:  var(--surface_100);
  border:      1px solid var(--border-subtle-100);
  border-radius: var(--radius-lg);
}

/* Zustands-Farben */
.alert-success {
  background:   var(--color-success-container-100);
  color:        var(--color-text-success);
  border-left:  3px solid var(--color-success);
}

.alert-error {
  background:   var(--color-error-container-100);
  color:        var(--color-text-error);
  border-left:  3px solid var(--color-error);
}

/* Inverse Fläche (dunkel) */
.hero-dark {
  background: var(--surface_inverse);
  color:      var(--color-text-on-color);
}

/* Fokus-Ring */
.interactive:focus-visible {
  outline:        2px solid var(--color-focus);
  outline-offset: 2px;
}`}</CodeBlock>

                <h3 className={styles.groupTitle}>{t('colors.code.tailwindTitle')}</h3>
                <Content>
                  <p>{t('colors.code.tailwindDesc')}</p>
                </Content>
                <CodeBlock language="jsx">{`{/* Karte mit Hintergrund, Text und Rahmen */}
<div className="bg-[var(--surface_200)] text-[var(--color-text-primary)] border border-[var(--border-subtle-100)] rounded-[var(--radius-lg)] p-[var(--space-4)]">
  Karteninhalt
</div>

{/* Primär-Button mit Hover-Übergang */}
<button className="bg-[var(--btn-primary)] text-[var(--color-text-on-color)] hover:bg-[var(--btn-primary-hover)] active:bg-[var(--btn-primary-active)] px-[var(--space-4)] py-[var(--space-2)] rounded-[var(--radius-md)] transition-colors duration-[var(--duration-fast)]">
  Primär-Button
</button>

{/* Semantische Text-Farben */}
<span className="text-[var(--color-text-secondary)]">Sekundärer Text</span>
<span className="text-[var(--color-success)]">Erfolgsstatus</span>
<span className="text-[var(--color-error)]">Fehlerstatus</span>
<span className="text-[var(--color-text-helper)]">Hilfstext</span>`}</CodeBlock>

                <h3 className={styles.groupTitle}>{t('colors.code.jsxTitle')}</h3>
                <Content>
                  <p>{t('colors.code.jsxDesc')}</p>
                </Content>
                <CodeBlock language="jsx">{`function StatusBadge({ variant }) {
  const colorMap = {
    success: {
      background: 'var(--color-success-container-100)',
      color:      'var(--color-text-success)',
      border:     '1px solid var(--color-success)',
    },
    warning: {
      background: 'var(--color-warning-container-100)',
      color:      'var(--color-text-warning)',
      border:     '1px solid var(--color-warning)',
    },
    error: {
      background: 'var(--color-error-container-100)',
      color:      'var(--color-text-error)',
      border:     '1px solid var(--color-error)',
    },
    info: {
      background: 'var(--color-info-container-100)',
      color:      'var(--color-text-info)',
      border:     '1px solid var(--color-info)',
    },
  }

  return (
    <span
      style={{
        ...colorMap[variant],
        padding:      '2px 8px',
        borderRadius: 'var(--radius-full)',
        fontSize:     'var(--text-xs)',
        fontWeight:   500,
      }}
    >
      {variant}
    </span>
  )
}`}</CodeBlock>
              </Section>
            </>
          ),
        },
      ]}
    />
  )
}
