import { PageLayout, Section, GridWrapper, Grid, Content } from '../docs/PageLayout'
import { TokensTable } from '../docs/TokensTable'
import { CodeBlock } from '../docs/CodeBlock'
import { Swatch } from '../docs/helpers'
import styles from '../App.module.css'

export default function ColorsPage() {
  return (
    <PageLayout
    title="Colors"
    description="Guidelines for color usage in med.o products and applications"
    tabs={[
        { 
            id: 'overview', 
            label: 'Overview', 
            content: 
            <>
                <Section title="About colors">
                    <Content>
                        <p>Color is a fundamental element of design that communicates meaning, enhances usability, and helps establish a consistent brand identity. In the med.o design system, colors are thoughtfully chosen to support accessibility, ensure consistency, and align with Salesforce’s visual language.</p>
                    </Content>
                    <h3 className={styles.groupTitle}>Principles of Color Usage in med.o products</h3>
                    <Content>                       
                        <p><strong>Accessibility first</strong></p>
                        <p>Colors in med.o design system meet or exceed Web Content Accessibility Guidelines (WCAG) 2.1 AA contrast standards. This ensures content remains readable for all users, including those with visual impairments. Always verify color combinations—especially text against backgrounds—to ensure they meet contrast requirements.</p>
                    </Content>
                    <Content>                       
                        <p><strong>Consistency across experiences</strong></p>
                        <p>Use styling hooks consistently when applying custom styles. These hooks help maintain a cohesive look across med.o products and custom implementations. Avoid hardcoding colors so your design can adapt to different themes.</p>
                    </Content>
                    <Content>                       
                        <p><strong>Communicating status and meaning</strong></p>
                        <p>med.o design system assigns specific colors to represent different states, such as success, error, or warning. These styling hooks use semantic naming, making their purpose clear. To stay aligned with med.o standards, use these predefined hooks instead of custom color values.</p>
                    </Content>              
                </Section>

                <Section title="Color theory">
                    <h3 className={styles.groupTitle}>Color is intentional</h3>
                    <Content>
                        <p>Our color palette is built on clean white surfaces, accented with intentional bursts of vibrant color. These highlights draw attention to key information without overwhelming the interface.</p>
                    </Content>
                    <h3 className={styles.groupTitle}>Color conveys meaning</h3>
                    <Content>                       
                        <p>Consistent use of styling hooks allows users to quickly associate specific colors with their intended meanings.</p>
                    </Content>
                    <h3 className={styles.groupTitle}>Color guides the user</h3>
                    <Content>                       
                        <p>Thoughtful color choices help direct attention, support navigation, and make it easier for users to complete tasks efficiently.</p>
                    </Content>
                    <h3 className={styles.groupTitle}>Color adds delight</h3>
                    <Content>                       
                        <p>Vibrant color combinations are used sparingly to create moments of visual interest, while keeping information-dense interfaces clear and easy to understand.</p>
                    </Content>              
                </Section>

                <Section title="Foundational color">
                    <Content>
                        <p>Foundational colors give meaning to specific UI elements.</p>
                        <br></br>
                        <p>Use foundational colors only for their intended purpose. Customers can use a product more easily if a specific color is associated with a consistent meaning throughout the product.</p>
                        <br></br>
                        <p>Foundational colors consist of: </p>
                        <br></br>
                        <p>
                            <ul>
                                <li><strong>Brand color pallette: </strong>Full spectrum of colors that aren't assigned to specific elements, and can be used for undefined situations.</li>
                                <li><strong>Alias color pallette: </strong>Colors with no semantic assignment, but are commonly used by semantic hooks for elements throughout the UI.</li>
                                <li><strong>Mapped color pallette: </strong>Used for building components and UI page elements such as backgrounds, borders, and fills. Use these colors only for their respective locations.</li>
                            </ul>
                        </p>
                    </Content>             
                </Section>

                <Section title="Brand colors">
                    <h3 className={styles.groupTitle}>Red</h3>
                    <div className={styles.swatchGrid}>
                        <Swatch bg="var(--color-brand-red-100)" label="Red 100" />
                        <Swatch bg="var(--color-brand-red-200)" label="Red 200" />
                        <Swatch bg="var(--color-brand-red-300)" label="Red 300" />
                        <Swatch bg="var(--color-brand-red-400)" label="Red 400" />
                        <Swatch bg="var(--color-brand-red-500)" label="Red 500" />
                        <Swatch bg="var(--color-brand-red-600)" label="Red 600" />
                        <Swatch bg="var(--color-brand-red-700)" label="Red 700" />
                        <Swatch bg="var(--color-brand-red-800)" label="Red 800" />
                        <Swatch bg="var(--color-brand-red-900)" label="Red 900" />
                        <Swatch bg="var(--color-brand-red-1000)" label="Red 1000" />
                    </div> 

                    <h3 className={styles.groupTitle}>Yellow</h3>
                    <div className={styles.swatchGrid}>
                        <Swatch bg="var(--color-brand-yellow-100)" label="Yellow 100" />
                        <Swatch bg="var(--color-brand-yellow-200)" label="Yellow 200" />
                        <Swatch bg="var(--color-brand-yellow-300)" label="Yellow 300" />
                        <Swatch bg="var(--color-brand-yellow-400)" label="Yellow 400" />
                        <Swatch bg="var(--color-brand-yellow-500)" label="Yellow 500" />
                        <Swatch bg="var(--color-brand-yellow-600)" label="Yellow 600" />
                        <Swatch bg="var(--color-brand-yellow-700)" label="Yellow 700" />
                        <Swatch bg="var(--color-brand-yellow-800)" label="Yellow 800" />
                        <Swatch bg="var(--color-brand-yellow-900)" label="Yellow 900" />
                        <Swatch bg="var(--color-brand-yellow-1000)" label="Yellow 1000" />
                    </div>

                    <h3 className={styles.groupTitle}>Green</h3>
                    <div className={styles.swatchGrid}>
                        <Swatch bg="var(--color-brand-green-100)" label="Green 100" />
                        <Swatch bg="var(--color-brand-green-200)" label="Green 200" />
                        <Swatch bg="var(--color-brand-green-300)" label="Green 300" />
                        <Swatch bg="var(--color-brand-green-400)" label="Green 400" />
                        <Swatch bg="var(--color-brand-green-500)" label="Green 500" />
                        <Swatch bg="var(--color-brand-green-600)" label="Green 600" />
                        <Swatch bg="var(--color-brand-green-700)" label="Green 700" />
                        <Swatch bg="var(--color-brand-green-800)" label="Green 800" />
                        <Swatch bg="var(--color-brand-green-900)" label="Green 900" />
                        <Swatch bg="var(--color-brand-green-1000)" label="Green 1000" />
                    </div>

                    <h3 className={styles.groupTitle}>Blue</h3>
                    <div className={styles.swatchGrid}>
                        <Swatch bg="var(--color-brand-blue-100)" label="Blue 100" />
                        <Swatch bg="var(--color-brand-blue-200)" label="Blue 200" />
                        <Swatch bg="var(--color-brand-blue-300)" label="Blue 300" />
                        <Swatch bg="var(--color-brand-blue-400)" label="Blue 400" />
                        <Swatch bg="var(--color-brand-blue-500)" label="Blue 500" />
                        <Swatch bg="var(--color-brand-blue-600)" label="Blue 600" />
                        <Swatch bg="var(--color-brand-blue-700)" label="Blue 700" />
                        <Swatch bg="var(--color-brand-blue-800)" label="Blue 800" />
                        <Swatch bg="var(--color-brand-blue-900)" label="Blue 900" />
                        <Swatch bg="var(--color-brand-blue-1000)" label="Blue 1000" />
                    </div>

                    <h3 className={styles.groupTitle}>Grey</h3>
                    <div className={styles.swatchGrid}>
                        <Swatch bg="var(--color-brand-grey-100)" label="Grey 100" />
                        <Swatch bg="var(--color-brand-grey-200)" label="Grey 200" />
                        <Swatch bg="var(--color-brand-grey-300)" label="Grey 300" />
                        <Swatch bg="var(--color-brand-grey-400)" label="Grey 400" />
                        <Swatch bg="var(--color-brand-grey-500)" label="Grey 500" />
                        <Swatch bg="var(--color-brand-grey-600)" label="Grey 600" />
                        <Swatch bg="var(--color-brand-grey-700)" label="Grey 700" />
                        <Swatch bg="var(--color-brand-grey-800)" label="Grey 800" />
                        <Swatch bg="var(--color-brand-grey-900)" label="Grey 900" />
                        <Swatch bg="var(--color-brand-grey-1000)" label="Grey 1000" />
                    </div>

                    <h3 className={styles.groupTitle}>Navy</h3>
                    <div className={styles.swatchGrid}>
                        <Swatch bg="var(--color-brand-navy-100)" label="Navy 100" />
                        <Swatch bg="var(--color-brand-navy-200)" label="Navy 200" />
                        <Swatch bg="var(--color-brand-navy-300)" label="Navy 300" />
                        <Swatch bg="var(--color-brand-navy-400)" label="Navy 400" />
                        <Swatch bg="var(--color-brand-navy-500)" label="Navy 500" />
                        <Swatch bg="var(--color-brand-navy-600)" label="Navy 600" />
                        <Swatch bg="var(--color-brand-navy-700)" label="Navy 700" />
                        <Swatch bg="var(--color-brand-navy-800)" label="Navy 800" />
                        <Swatch bg="var(--color-brand-navy-900)" label="Navy 900" />
                        <Swatch bg="var(--color-brand-navy-1000)" label="Navy 1000" />
                    </div>

                    <h3 className={styles.groupTitle}>Orange</h3>
                    <div className={styles.swatchGrid}>
                        <Swatch bg="var(--color-brand-orange-100)" label="Orange 100" />
                        <Swatch bg="var(--color-brand-orange-200)" label="Orange 200" />
                        <Swatch bg="var(--color-brand-orange-300)" label="Orange 300" />
                        <Swatch bg="var(--color-brand-orange-400)" label="Orange 400" />
                        <Swatch bg="var(--color-brand-orange-500)" label="Orange 500" />
                        <Swatch bg="var(--color-brand-orange-600)" label="Orange 600" />
                        <Swatch bg="var(--color-brand-orange-700)" label="Orange 700" />
                        <Swatch bg="var(--color-brand-orange-800)" label="Orange 800" />
                        <Swatch bg="var(--color-brand-orange-900)" label="Orange 900" />
                        <Swatch bg="var(--color-brand-orange-1000)" label="Orange 1000" />
                    </div>

                    <h3 className={styles.groupTitle}>Cobalt</h3>
                    <div className={styles.swatchGrid}>
                        <Swatch bg="var(--color-brand-cobalt-100)" label="Cobalt 100" />
                        <Swatch bg="var(--color-brand-cobalt-200)" label="Cobalt 200" />
                        <Swatch bg="var(--color-brand-cobalt-300)" label="Cobalt 300" />
                        <Swatch bg="var(--color-brand-cobalt-400)" label="Cobalt 400" />
                        <Swatch bg="var(--color-brand-cobalt-500)" label="Cobalt 500" />
                        <Swatch bg="var(--color-brand-cobalt-600)" label="Cobalt 600" />
                        <Swatch bg="var(--color-brand-cobalt-700)" label="Cobalt 700" />
                        <Swatch bg="var(--color-brand-cobalt-800)" label="Cobalt 800" />
                        <Swatch bg="var(--color-brand-cobalt-900)" label="Cobalt 900" />
                        <Swatch bg="var(--color-brand-cobalt-1000)" label="Cobalt 1000" />
                    </div>                    
                </Section>
                
                
                <Section title="Alias colors">
                    <h3 className={styles.groupTitle}>Neutral</h3>
                    <div className={styles.swatchGrid}>
                    {[
                        ['var(--color-neutral-0)','0',true],
                        ['var(--color-neutral-50)','50',true],
                        ['var(--color-neutral-100)','100'],
                        ['var(--color-neutral-200)','200'],
                        ['var(--color-neutral-300)','300'],
                        ['var(--color-neutral-400)','400'],
                        ['var(--color-neutral-500)','500'],
                        ['var(--color-neutral-600)','600'],
                        ['var(--color-neutral-700)','700'],
                        ['var(--color-neutral-800)','800'],
                        ['var(--color-neutral-900)','900'],
                        ['var(--color-neutral-1000)','1000']
                    ].map(([bg, label, border]) => (
                        <Swatch key={label} bg={bg} label={label} border={!!border} />
                    ))}
                    </div>

                    <h3 className={styles.groupTitle}>Primary</h3>
                    <div className={styles.swatchGrid}>
                    {[
                        ['var(--color-brand-primary-100)','100'],
                        ['var(--color-brand-primary-200)','200'],
                        ['var(--color-brand-primary-300)','300'],
                        ['var(--color-brand-primary-400)','400'],
                        ['var(--color-brand-primary-500)','500'],
                        ['var(--color-brand-primary-600)','600'],
                        ['var(--color-brand-primary-700)','700'],
                        ['var(--color-brand-primary-800)','800'],
                        ['var(--color-brand-primary-900)','900'],
                        ['var(--color-brand-primary-1000)','1000']
                    ].map(([bg, label, border]) => (
                        <Swatch key={label} bg={bg} label={label} border={!!border} />
                    ))}
                    </div>

                    <h3 className={styles.groupTitle}>Secondary</h3>
                    <div className={styles.swatchGrid}>
                    {[
                        ['var(--color-brand-secondary-100)','100'],
                        ['var(--color-brand-secondary-200)','200'],
                        ['var(--color-brand-secondary-300)','300'],
                        ['var(--color-brand-secondary-400)','400'],
                        ['var(--color-brand-secondary-500)','500'],
                        ['var(--color-brand-secondary-600)','600'],
                        ['var(--color-brand-secondary-700)','700'],
                        ['var(--color-brand-secondary-800)','800'],
                        ['var(--color-brand-secondary-900)','900'],
                        ['var(--color-brand-secondary-1000)','1000']
                    ].map(([bg, label, border]) => (
                        <Swatch key={label} bg={bg} label={label} border={!!border} />
                    ))}
                    </div>

                    <h3 className={styles.groupTitle}>Success</h3>
                    <div className={styles.swatchGrid}>
                    {[
                        ['var(--color-success-100)','100'],
                        ['var(--color-success-200)','200'],
                        ['var(--color-success-300)','300'],
                        ['var(--color-success-400)','400'],
                        ['var(--color-success-500)','500'],
                        ['var(--color-success-600)','600'],
                        ['var(--color-success-700)','700'],
                        ['var(--color-success-800)','800'],
                        ['var(--color-success-900)','900'],
                        ['var(--color-success-1000)','1000']
                    ].map(([bg, label, border]) => (
                        <Swatch key={label} bg={bg} label={label} border={!!border} />
                    ))}
                    </div>

                    <h3 className={styles.groupTitle}>Warning</h3>
                    <div className={styles.swatchGrid}>
                    {[
                        ['var(--color-warning-100)','100'],
                        ['var(--color-warning-200)','200'],
                        ['var(--color-warning-300)','300'],
                        ['var(--color-warning-400)','400'],
                        ['var(--color-warning-500)','500'],
                        ['var(--color-warning-600)','600'],
                        ['var(--color-warning-700)','700'],
                        ['var(--color-warning-800)','800'],
                        ['var(--color-warning-900)','900'],
                        ['var(--color-warning-1000)','1000']
                    ].map(([bg, label, border]) => (
                        <Swatch key={label} bg={bg} label={label} border={!!border} />
                    ))}
                    </div>

                    <h3 className={styles.groupTitle}>Error</h3>
                    <div className={styles.swatchGrid}>
                    {[
                        ['var(--color-error-100)','100'],
                        ['var(--color-error-200)','200'],
                        ['var(--color-error-300)','300'],
                        ['var(--color-error-400)','400'],
                        ['var(--color-error-500)','500'],
                        ['var(--color-error-600)','600'],
                        ['var(--color-error-700)','700'],
                        ['var(--color-error-800)','800'],
                        ['var(--color-error-900)','900'],
                        ['var(--color-error-1000)','1000']
                    ].map(([bg, label, border]) => (
                        <Swatch key={label} bg={bg} label={label} border={!!border} />
                    ))}
                    </div>

                    <h3 className={styles.groupTitle}>Info</h3>
                    <div className={styles.swatchGrid}>
                    {[
                        ['var(--color-info-100)','100'],
                        ['var(--color-info-200)','200'],
                        ['var(--color-info-300)','300'],
                        ['var(--color-info-400)','400'],
                        ['var(--color-info-500)','500'],
                        ['var(--color-info-600)','600'],
                        ['var(--color-info-700)','700'],
                        ['var(--color-info-800)','800'],
                        ['var(--color-info-900)','900'],
                        ['var(--color-info-1000)','1000']
                    ].map(([bg, label, border]) => (
                        <Swatch key={label} bg={bg} label={label} border={!!border} />
                    ))}
                    </div>

                    <h3 className={styles.groupTitle}>Focus</h3>
                    <div className={styles.swatchGrid}>
                    {[
                        ['var(--color-focus-100)','100'],
                        ['var(--color-focus-200)','200'],
                        ['var(--color-focus-300)','300'],
                        ['var(--color-focus-400)','400'],
                        ['var(--color-focus-500)','500'],
                        ['var(--color-focus-600)','600'],
                        ['var(--color-focus-700)','700'],
                        ['var(--color-focus-800)','800'],
                        ['var(--color-focus-900)','900'],
                        ['var(--color-focus-1000)','1000']
                    ].map(([bg, label, border]) => (
                        <Swatch key={label} bg={bg} label={label} border={!!border} />
                    ))}
                    </div>
                </Section>

                <Section title="Mapped colors">
                    <Content>
                        <p>More about mapped colors in <a href="/colors?tab=tokens">Tokens tab</a>.</p>
                    </Content>
                </Section>
            </> 
        },

        { 
            id: 'usage',    
            label: 'Usage',    
            content: 
            <>
                <Section title="Farbhierarchie">
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.65, marginBottom: 'var(--space-4)' }}>
                    Verwende immer die semantischen UI-Tokens (<code>--color-text-primary</code>, <code>--color-border</code> etc.) statt der rohen Neutralwerte. So funktionieren zukünftige Theme-Wechsel automatisch.
                    </p>
                    <GridWrapper>
                        <Grid>
                            <Grid.Header>Brand</Grid.Header>
                            <Grid.Body>Semantische Tokens verwenden: <code>var(--color-text-secondary)</code></Grid.Body>
                        </Grid>
                        <Grid>
                            <Grid.Header>Brand</Grid.Header>
                            <Grid.Body>Semantische Tokens verwenden: <code>var(--color-text-secondary)</code></Grid.Body>
                        </Grid>                    
                    </GridWrapper>
                </Section>
            </>
 
        },

        { 
            id: 'tokens',   
            label: 'Tokens',   
            content: 
            <Section title="Color tokens">
            <h3 className={styles.groupTitle}>Surface</h3>
            <TokensTable tokens={[
                { token: '--color-brand-primary-500',       value: '#0F0F0F', description: 'Primäre Markenfarbe' },
                { token: '--color-brand-accent',         value: '#2563EB', description: 'Interaktiver Akzent' },
                { token: '--color-brand-accent-hover',   value: '#1D4ED8', description: 'Akzent Hover-State' },
                { token: '--color-brand-accent-subtle',  value: '#EFF6FF', description: 'Akzent Hintergrundton' },
                { token: '--surface_100',           value: '#FFFFFF', description: 'Seitenhintergrund' },
                { token: '--surface_200',    value: '#F9F9F9', description: 'Subtiler Hintergrund' },
                { token: '--surface_100',              value: '#FFFFFF', description: 'Komponentenfläche' },
                { token: '--color-border',               value: '#E5E5E5', description: 'Standard-Rahmen' },
                { token: '--color-border-strong',        value: '#A3A3A3', description: 'Betonter Rahmen' },
                { token: '--color-text-primary',         value: '#171717', description: 'Primärtext' },
                { token: '--color-text-secondary',       value: '#737373', description: 'Sekundärtext' },
                { token: '--color-text-disabled',        value: '#D4D4D4', description: 'Deaktivierter Text' },
                { token: '--color-success',              value: '#16A34A', description: 'Erfolg' },
                { token: '--color-warning',              value: '#D97706', description: 'Warnung' },
                { token: '--color-error',                value: '#DC2626', description: 'Fehler' },
                { token: '--color-info',                 value: '#0284C7', description: 'Information' },
            ]} /> 
            
            <h3 className={styles.groupTitle}>Surface</h3>
            <TokensTable tokens={[
                { token: '--color-brand-primary-500',       value: '#0F0F0F', description: 'Primäre Markenfarbe' },
                { token: '--color-brand-accent',         value: '#2563EB', description: 'Interaktiver Akzent' },
                { token: '--color-brand-accent-hover',   value: '#1D4ED8', description: 'Akzent Hover-State' },
                { token: '--color-brand-accent-subtle',  value: '#EFF6FF', description: 'Akzent Hintergrundton' },
                { token: '--surface_100',           value: '#FFFFFF', description: 'Seitenhintergrund' },
                { token: '--surface_200',    value: '#F9F9F9', description: 'Subtiler Hintergrund' },
                { token: '--surface_100',              value: '#FFFFFF', description: 'Komponentenfläche' },
                { token: '--color-border',               value: '#E5E5E5', description: 'Standard-Rahmen' },
                { token: '--color-border-strong',        value: '#A3A3A3', description: 'Betonter Rahmen' },
                { token: '--color-text-primary',         value: '#171717', description: 'Primärtext' },
                { token: '--color-text-secondary',       value: '#737373', description: 'Sekundärtext' },
                { token: '--color-text-disabled',        value: '#D4D4D4', description: 'Deaktivierter Text' },
                { token: '--color-success',              value: '#16A34A', description: 'Erfolg' },
                { token: '--color-warning',              value: '#D97706', description: 'Warnung' },
                { token: '--color-error',                value: '#DC2626', description: 'Fehler' },
                { token: '--color-info',                 value: '#0284C7', description: 'Information' },
            ]} /> 
        </Section>
        },

        { 
            id: 'code',     
            label: 'Code',     
            content: 
            <Section title="Color codes">
            <CodeBlock language="css">{`
/* Farben in CSS verwenden */
.meinElement {
  color: var(--color-text-primary);
  background: var(--surface_200);
  border: 1px solid var(--color-border);
}

/* Akzentfarbe für interaktive Elemente */
.meinLink {
  color: var(--color-brand-accent);
}
.meinLink:hover {
  color: var(--color-brand-accent-hover);
}

/* Semantic Colors für Feedback */
.erfolgsMeldung {
  background: var(--color-success-container-100);
  color: var(--color-success);
}
        `}</CodeBlock>
        </Section>
 
        },
    ]}
    />
    
  )
}