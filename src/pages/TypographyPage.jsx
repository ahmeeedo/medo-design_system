import { useTranslation } from 'react-i18next'
import { PageLayout, Section, Content, GridWrapper, Grid } from '../docs/PageLayout'
import { TokensTable } from '../docs/TokensTable'
import { CodeBlock } from '../docs/CodeBlock'
import { TypeRow } from '../docs/helpers'
import styles from '../App.module.css'

export default function TypographyPage() {
  const { t } = useTranslation()

  const familyTokens = [
    { token: '--font-sans', value: 'DM Sans', description: t('typography.tokens.sansDesc') },
    { token: '--font-mono', value: 'DM Mono', description: t('typography.tokens.monoDesc') },
  ]

  const sizeTokens = [
    { token: '--text-xs',  value: '12px', description: t('typography.tokens.xsDesc') },
    { token: '--text-sm',  value: '14px', description: t('typography.tokens.smDesc') },
    { token: '--text-md',  value: '16px', description: t('typography.tokens.mdDesc') },
    { token: '--text-lg',  value: '18px', description: t('typography.tokens.lgDesc') },
    { token: '--text-xl',  value: '20px', description: t('typography.tokens.xlDesc') },
    { token: '--text-2xl', value: '24px', description: t('typography.tokens.2xlDesc') },
    { token: '--text-3xl', value: '30px', description: t('typography.tokens.3xlDesc') },
    { token: '--text-4xl', value: '36px', description: t('typography.tokens.4xlDesc') },
    { token: '--text-5xl', value: '48px', description: t('typography.tokens.5xlDesc') },
    { token: '--text-6xl', value: '60px', description: t('typography.tokens.6xlDesc') },
  ]

  const weightTokens = [
    { token: '--weight-light',     value: '300', description: t('typography.tokens.lightDesc') },
    { token: '--weight-regular',   value: '400', description: t('typography.tokens.regularDesc') },
    { token: '--weight-medium',    value: '500', description: t('typography.tokens.mediumDesc') },
    { token: '--weight-semibold',  value: '600', description: t('typography.tokens.semiboldDesc') },
    { token: '--weight-bold',      value: '700', description: t('typography.tokens.boldDesc') },
    { token: '--weight-extrabold', value: '800', description: t('typography.tokens.extraboldDesc') },
  ]

  const lineHeightTokens = [
    { token: '--leading-tight',   value: '1.2',  description: t('typography.tokens.tightDesc') },
    { token: '--leading-snug',    value: '1.35', description: t('typography.tokens.snugDesc') },
    { token: '--leading-normal',  value: '1.5',  description: t('typography.tokens.normalDesc') },
    { token: '--leading-relaxed', value: '1.65', description: t('typography.tokens.relaxedDesc') },
  ]

  const spacingTokens = [
    { token: '--tracking-tight',   value: '-0.03em',  description: t('typography.tokens.tkTightDesc') },
    { token: '--tracking-snug',    value: '-0.015em', description: t('typography.tokens.tkSnugDesc') },
    { token: '--tracking-normal',  value: '0em',      description: t('typography.tokens.tkNormalDesc') },
    { token: '--tracking-wide',    value: '0.04em',   description: t('typography.tokens.tkWideDesc') },
    { token: '--tracking-wider',   value: '0.08em',   description: t('typography.tokens.tkWiderDesc') },
    { token: '--tracking-widest',  value: '0.12em',   description: t('typography.tokens.tkWidestDesc') },
  ]

  return (
    <PageLayout
      title={t('nav.items.typography')}
      description={t('typography.page.description')}
      tabs={[
        {
          id: 'overview',
          label: t('tabs.overview'),
          content: (
            <>
              <Section title={t('typography.overview.scaleTitle')}>
                <Content>
                  <p>{t('typography.overview.scaleBody')}</p>
                </Content>
                <TypeRow name="Display 2XL" detail="60px / 600 / −0.03em"  style={{ fontSize: 'var(--text-6xl)', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.2 }} />
                <TypeRow name="Display XL"  detail="48px / 600 / −0.03em"  style={{ fontSize: 'var(--text-5xl)', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.2 }} />
                <TypeRow name="Heading XL"  detail="36px / 600 / −0.015em" style={{ fontSize: 'var(--text-4xl)', fontWeight: 600, letterSpacing: '-0.015em', lineHeight: 1.35 }} />
                <TypeRow name="Heading LG"  detail="30px / 600 / −0.015em" style={{ fontSize: 'var(--text-3xl)', fontWeight: 600, letterSpacing: '-0.015em', lineHeight: 1.35 }} />
                <TypeRow name="Heading MD"  detail="24px / 600 / −0.015em" style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, letterSpacing: '-0.015em' }} />
                <TypeRow name="Heading SM"  detail="20px / 500"            style={{ fontSize: 'var(--text-xl)',  fontWeight: 500 }} />
                <TypeRow name="Body LG"     detail="18px / 400 / 1.65"     style={{ fontSize: 'var(--text-lg)',  lineHeight: 1.65 }} />
                <TypeRow name="Body MD"     detail="16px / 400 / 1.5"      style={{ fontSize: 'var(--text-md)',  lineHeight: 1.5 }} />
                <TypeRow name="Body SM"     detail="14px / 400"            style={{ fontSize: 'var(--text-sm)',  color: 'var(--color-text-secondary)' }} />
                <TypeRow name="Label MD"    detail="14px / 500"            style={{ fontSize: 'var(--text-sm)',  fontWeight: 500 }} />
                <TypeRow name="Label SM"    detail="12px / 600 / +0.12em"  style={{ fontSize: 'var(--text-xs)',  fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }} />
                <TypeRow name="Code"        detail="14px mono"             style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }} />
              </Section>

              <Section title={t('typography.overview.fontsTitle')}>
                <h3 className={styles.groupTitle}>DM Sans</h3>
                <Content>
                  <p>{t('typography.overview.sansBody')}</p>
                </Content>
                <h3 className={styles.groupTitle}>DM Mono</h3>
                <Content>
                  <p>{t('typography.overview.monoBody')}</p>
                </Content>
              </Section>

              <Section title={t('typography.overview.contextTitle')}>
                <Content>
                  <p>{t('typography.overview.contextBody')}</p>
                </Content>
                <div style={{ border: '1px solid var(--border-subtle-100)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)', background: 'var(--surface_100)', marginBottom: 'var(--space-8)' }}>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>
                    Label SM — Kategorie / Sektion
                  </span>
                  <div style={{ fontSize: 'var(--text-4xl)', fontWeight: 600, letterSpacing: '-0.015em', lineHeight: 1.35, marginTop: 'var(--space-3)', color: 'var(--color-text-primary)' }}>
                    Heading XL als Seitentitel
                  </div>
                  <div style={{ fontSize: 'var(--text-lg)', lineHeight: 1.65, color: 'var(--color-text-secondary)', marginTop: 'var(--space-4)' }}>
                    Body LG für die beschreibende Einleitung – schafft Kontext und bereitet den Nutzer auf den folgenden Inhalt vor. Mehr Zeilenabstand für bessere Lesbarkeit.
                  </div>
                  <div style={{ fontSize: 'var(--text-md)', lineHeight: 1.5, color: 'var(--color-text-primary)', marginTop: 'var(--space-5)' }}>
                    Body MD als Standard-Fließtext für den Hauptinhalt. Dieser Text wird für Karten, Beschreibungen und allgemeine UI-Inhalte verwendet.
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-6)', paddingTop: 'var(--space-5)', borderTop: '1px solid var(--border-subtle-100)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Body SM — Metadaten</span>
                    <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)', background: 'var(--surface-container_100)', padding: '1px 6px', borderRadius: 'var(--radius-sm)' }}>code</span>
                  </div>
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
              <Section title={t('typography.usage.title')}>
                <Content>
                  <p>{t('typography.usage.intro')}</p>
                </Content>

                <h3 className={styles.groupTitle}>{t('typography.usage.headingTitle')}</h3>
                <Content>
                  <p>{t('typography.usage.headingBody')}</p>
                </Content>

                <h3 className={styles.groupTitle}>{t('typography.usage.headingContextTitle')}</h3>
                <Content>
                  <ul>
                    <li>{t('typography.usage.headingH1')}</li>
                    <li>{t('typography.usage.headingH2')}</li>
                    <li>{t('typography.usage.headingH3')}</li>
                    <li>{t('typography.usage.headingH4')}</li>
                  </ul>
                </Content>

                <h3 className={styles.groupTitle}>{t('typography.usage.bodyTitle')}</h3>
                <Content>
                  <p>{t('typography.usage.bodyBody')}</p>
                </Content>

                <h3 className={styles.groupTitle}>{t('typography.usage.labelTitle')}</h3>
                <Content>
                  <p>{t('typography.usage.labelBody')}</p>
                </Content>

                <h3 className={styles.groupTitle}>{t('typography.usage.codeTitle')}</h3>
                <Content>
                  <p>{t('typography.usage.codeBody')}</p>
                </Content>

                <h3 className={styles.groupTitle}>{t('typography.usage.lineLengthTitle')}</h3>
                <Content>
                  <p>{t('typography.usage.lineLengthBody')}</p>
                </Content>

                <h3 className={styles.groupTitle}>{t('typography.usage.formattingTitle')}</h3>
                <Content>
                  <p>{t('typography.usage.formattingBody')}</p>
                </Content>

                <GridWrapper>
                  <Grid>
                    <Grid.Header className="text-[var(--color-text-success)] [font-weight:var(--weight-semibold)] text-[var(--text-md)] pb-[var(--space-2)] mb-[var(--space-3)] border-b-2 border-[var(--color-success)]">
                      {t('typography.usage.doTitle')}
                    </Grid.Header>
                    <Grid.Body>
                      <ul className="flex flex-col gap-[var(--space-2)] text-[var(--text-sm)] text-[var(--color-text-primary)] list-none p-0 m-0">
                        {['do1','do2','do3','do4'].map(k => (
                          <li key={k} className="p-[var(--space-2)] rounded-[var(--radius-md)] bg-[var(--color-success-container-100)]">
                            <code className="[font-family:var(--font-mono)]">{t(`typography.usage.${k}`)}</code>
                          </li>
                        ))}
                      </ul>
                    </Grid.Body>
                  </Grid>
                  <Grid>
                    <Grid.Header className="text-[var(--color-text-error)] [font-weight:var(--weight-semibold)] text-[var(--text-md)] pb-[var(--space-2)] mb-[var(--space-3)] border-b-2 border-[var(--color-error)]">
                      {t('typography.usage.dontTitle')}
                    </Grid.Header>
                    <Grid.Body>
                      <ul className="flex flex-col gap-[var(--space-2)] text-[var(--text-sm)] text-[var(--color-text-primary)] list-none p-0 m-0">
                        {['dont1','dont2','dont3','dont4'].map(k => (
                          <li key={k} className="p-[var(--space-2)] rounded-[var(--radius-md)] bg-[var(--color-error-container-100)]">
                            <code className="[font-family:var(--font-mono)]">{t(`typography.usage.${k}`)}</code>
                          </li>
                        ))}
                      </ul>
                    </Grid.Body>
                  </Grid>
                </GridWrapper>
              </Section>
            </>
          ),
        },

        {
          id: 'tokens',
          label: t('tabs.tokens'),
          content: (
            <>
              <Section title={t('typography.tokens.familyTitle')}>
                <TokensTable tokens={familyTokens} />
              </Section>
              <Section title={t('typography.tokens.sizeTitle')}>
                <TokensTable tokens={sizeTokens} />
              </Section>
              <Section title={t('typography.tokens.weightTitle')}>
                <TokensTable tokens={weightTokens} />
              </Section>
              <Section title={t('typography.tokens.lineHeightTitle')}>
                <TokensTable tokens={lineHeightTokens} />
              </Section>
              <Section title={t('typography.tokens.spacingTitle')}>
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
              <Section title={t('typography.code.title')}>
                <h3 className={styles.groupTitle}>{t('typography.code.cssTitle')}</h3>
                <Content>
                  <p>{t('typography.code.cssDesc')}</p>
                </Content>
                <CodeBlock language="css">{`/* Heading XL — primärer Seitenabschnitt */
.page-title {
  font-size:      var(--text-4xl);
  font-weight:    var(--weight-semibold);
  letter-spacing: var(--tracking-snug);
  line-height:    var(--leading-snug);
  color:          var(--color-text-primary);
}

/* Body MD — Standard Fließtext */
.body-text {
  font-size:   var(--text-md);
  font-weight: var(--weight-regular);
  line-height: var(--leading-normal);
  color:       var(--color-text-secondary);
  max-width:   65ch;
}

/* Label SM — Caps-Style für Kategorien */
.section-label {
  font-size:      var(--text-xs);
  font-weight:    var(--weight-semibold);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color:          var(--color-text-secondary);
}

/* Inline Code */
code {
  font-family:   var(--font-mono);
  font-size:     var(--text-sm);
  line-height:   var(--leading-relaxed);
  background:    var(--surface-container_100);
  padding:       1px 6px;
  border-radius: var(--radius-sm);
}`}</CodeBlock>

                <h3 className={styles.groupTitle}>{t('typography.code.tailwindTitle')}</h3>
                <Content>
                  <p>{t('typography.code.tailwindDesc')}</p>
                </Content>
                <CodeBlock language="jsx">{`{/* Display 2XL — Hero-Überschrift */}
<h1 className="text-[var(--text-6xl)] [font-weight:var(--weight-semibold)] tracking-[var(--tracking-tight)] leading-[var(--leading-tight)] text-[var(--color-text-primary)]">
  Willkommen
</h1>

{/* Heading MD — Karten-Titel */}
<h3 className="text-[var(--text-2xl)] [font-weight:var(--weight-semibold)] tracking-[var(--tracking-snug)] text-[var(--color-text-primary)]">
  Abschnittstitel
</h3>

{/* Body LG — Einleitungstext */}
<p className="text-[var(--text-lg)] leading-[var(--leading-relaxed)] text-[var(--color-text-secondary)] max-w-[65ch]">
  Beschreibungstext mit optimaler Lesbarkeit und Zeilenlänge.
</p>

{/* Label SM — Caps-Label */}
<span className="text-[var(--text-xs)] [font-weight:var(--weight-semibold)] tracking-[var(--tracking-widest)] uppercase text-[var(--color-text-secondary)]">
  Kategorie
</span>

{/* Inline Code */}
<code className="[font-family:var(--font-mono)] text-[var(--text-sm)] bg-[var(--surface-container_100)] px-[6px] py-[1px] rounded-[var(--radius-sm)]">
  npm install
</code>`}</CodeBlock>

                <h3 className={styles.groupTitle}>{t('typography.code.jsxTitle')}</h3>
                <Content>
                  <p>{t('typography.code.jsxDesc')}</p>
                </Content>
                <CodeBlock language="jsx">{`const typeStyles = {
  display2xl: {
    fontSize:      'var(--text-6xl)',
    fontWeight:    600,
    letterSpacing: 'var(--tracking-tight)',
    lineHeight:    'var(--leading-tight)',
  },
  headingXL: {
    fontSize:      'var(--text-4xl)',
    fontWeight:    600,
    letterSpacing: 'var(--tracking-snug)',
    lineHeight:    'var(--leading-snug)',
  },
  headingMD: {
    fontSize:      'var(--text-2xl)',
    fontWeight:    600,
    letterSpacing: 'var(--tracking-snug)',
  },
  bodyLG: {
    fontSize:    'var(--text-lg)',
    fontWeight:  400,
    lineHeight:  'var(--leading-relaxed)',
  },
  labelSM: {
    fontSize:      'var(--text-xs)',
    fontWeight:    600,
    letterSpacing: 'var(--tracking-widest)',
    textTransform: 'uppercase',
  },
}

function Heading({ level = 'h2', variant = 'headingXL', children }) {
  const Tag = level
  return <Tag style={typeStyles[variant]}>{children}</Tag>
}`}</CodeBlock>
              </Section>
            </>
          ),
        },
      ]}
    />
  )
}
