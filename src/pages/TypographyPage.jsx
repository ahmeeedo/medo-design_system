import { DocSection } from '../docs/DocSection'
import { TypeRow } from '../docs/helpers'
import { PageLayout, Section, GridWrapper, Grid } from '../docs/PageLayout'
import { TokensTable } from '../docs/TokensTable'
import { CodeBlock } from '../docs/CodeBlock'
import styles from '../App.module.css'

export default function TypographyPage() {
  return (
    <PageLayout
    title="Typography"
    description="Guidelines for color usage in med.o products and applications"
    tabs={[
        { 
            id: 'overview', 
            label: 'Overview', 
            content: 
            <>
                <Section title="Typography" description="Schrift-Scale von Display bis Label. Fonts: DM Sans (Sans) + DM Mono (Mono).">
                  <TypeRow name="Display 2XL" detail="60px / 600 / −0.03em"  style={{ fontSize: 'var(--text-6xl)', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.2 }} />
                  <TypeRow name="Display XL"  detail="48px / 600 / −0.03em"  style={{ fontSize: 'var(--text-5xl)', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.2 }} />
                  <TypeRow name="Heading XL"  detail="36px / 600 / −0.015em" style={{ fontSize: 'var(--text-4xl)', fontWeight: 600, letterSpacing: '-0.015em', lineHeight: 1.35 }} />
                  <TypeRow name="Heading LG"  detail="30px / 600"            style={{ fontSize: 'var(--text-3xl)', fontWeight: 600, letterSpacing: '-0.015em', lineHeight: 1.35 }} />
                  <TypeRow name="Heading MD"  detail="24px / 600"            style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, letterSpacing: '-0.015em' }} />
                  <TypeRow name="Heading SM"  detail="20px / 500"            style={{ fontSize: 'var(--text-xl)',  fontWeight: 500 }} />
                  <TypeRow name="Body LG"     detail="17px / 400 / 1.65"     style={{ fontSize: 'var(--text-lg)',  lineHeight: 1.65 }} />
                  <TypeRow name="Body MD"     detail="15px / 400 / 1.5"      style={{ fontSize: 'var(--text-md)',  lineHeight: 1.5 }} />
                  <TypeRow name="Body SM"     detail="13px / 400"            style={{ fontSize: 'var(--text-sm)',  color: 'var(--color-text-secondary)' }} />
                  <TypeRow name="Label MD"    detail="13px / 500"            style={{ fontSize: 'var(--text-sm)',  fontWeight: 500 }} />
                  <TypeRow name="Label SM"    detail="11px / 600 / +0.12em"  style={{ fontSize: 'var(--text-xs)',  fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }} />
                  <TypeRow name="Code"        detail="13px mono"             style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }} />
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