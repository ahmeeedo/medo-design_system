import { PageLayout, SubSection, GridContainer, Do, Dont } from '../docs/PageLayout'
import { TokensTable } from '../docs/TokensTable'
import { CodeBlock } from '../docs/CodeBlock'
import { Swatch } from '../docs/helpers'
import styles from '../App.module.css'

export default function ColorsPage() {
  return (
    <PageLayout
    title="Buttons"
    tabs={[
        { 
            id: 'overview', 
            label: 'Overview', 
            content: 
            <>
                <SubSection title="Brand">
                    <div className={styles.swatchGrid}>
                    <Swatch bg="#0F0F0F" label="primary" />
                    <Swatch bg="#2563EB" label="accent" />
                    <Swatch bg="#1D4ED8" label="accent-hover" />
                    <Swatch bg="#EFF6FF" label="accent-subtle" border />
                    </div>
                </SubSection>
                <SubSection title="Neutral Scale">
                    <div className={styles.swatchGrid}>
                    {[['#FFFFFF','0',true],['#F9F9F9','50',true],['#F3F3F3','100'],['#E5E5E5','200'],
                        ['#D4D4D4','300'],['#A3A3A3','400'],['#737373','500'],['#525252','600'],
                        ['#404040','700'],['#262626','800'],['#171717','900'],['#0A0A0A','1000']
                    ].map(([bg, label, border]) => (
                        <Swatch key={label} bg={bg} label={label} border={!!border} />
                    ))}
                    </div>
                </SubSection>
                <SubSection title="Semantic">
                    <div className={styles.swatchGrid}>
                    <Swatch bg="#16A34A" label="success" />
                    <Swatch bg="#F0FDF4" label="success-subtle" border />
                    <Swatch bg="#D97706" label="warning" />
                    <Swatch bg="#FFFBEB" label="warning-subtle" border />
                    <Swatch bg="#DC2626" label="error" />
                    <Swatch bg="#FEF2F2" label="error-subtle" border />
                    <Swatch bg="#0284C7" label="info" />
                    <Swatch bg="#F0F9FF" label="info-subtle" border />
                    </div>
                </SubSection>
            </> 
        },

        { 
            id: 'usage',    
            label: 'Usage',    
            content: 
            <>
                <SubSection title="Farbhierarchie">
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.65, marginBottom: 'var(--space-4)' }}>
                    Verwende immer die semantischen UI-Tokens (<code>--color-text-primary</code>, <code>--color-border</code> etc.) statt der rohen Neutralwerte. So funktionieren zukünftige Theme-Wechsel automatisch.
                    </p>
                    <GridContainer>
                    <Do>Semantische Tokens verwenden: <code>var(--color-text-secondary)</code></Do>
                    <Dont>Rohe Neutralwerte direkt verwenden: <code>var(--color-neutral-500)</code></Dont>
                    </GridContainer>
                </SubSection>
                <SubSection title="Akzentfarbe">
                    <GridContainer>
                    <Do>Akzentfarbe sparsam für primäre Aktionen und Links einsetzen.</Do>
                    <Dont>Akzentfarbe für dekorative Flächen oder Hintergründe nutzen.</Dont>
                    </GridContainer>
                </SubSection>
                <SubSection title="Semantic Colors">
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>
                    Success, Warning, Error und Info nur in ihrem jeweiligen Kontext verwenden. Die <code>-subtle</code>-Varianten eignen sich für Hintergründe, die vollen Farben für Icons und Text.
                    </p>
                </SubSection>
            </>
 
        },

        { 
            id: 'tokens',   
            label: 'Tokens',   
            content: 
            <TokensTable tokens={[
                { token: '--color-brand-primary',       value: '#0F0F0F', description: 'Primäre Markenfarbe' },
                { token: '--color-brand-accent',         value: '#2563EB', description: 'Interaktiver Akzent' },
                { token: '--color-brand-accent-hover',   value: '#1D4ED8', description: 'Akzent Hover-State' },
                { token: '--color-brand-accent-subtle',  value: '#EFF6FF', description: 'Akzent Hintergrundton' },
                { token: '--color-background',           value: '#FFFFFF', description: 'Seitenhintergrund' },
                { token: '--color-background-subtle',    value: '#F9F9F9', description: 'Subtiler Hintergrund' },
                { token: '--color-surface',              value: '#FFFFFF', description: 'Komponentenfläche' },
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
        },

        { 
            id: 'code',     
            label: 'Code',     
            content: 
            <CodeBlock language="css">{`
/* Farben in CSS verwenden */
.meinElement {
  color: var(--color-text-primary);
  background: var(--color-background-subtle);
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
  background: var(--color-success-subtle);
  color: var(--color-success);
}
        `}</CodeBlock>
 
        },
    ]}
    />
  )
}