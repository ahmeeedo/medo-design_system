import { DocSection, Grid2 } from '../docs/DocSection'
import { Card, Button } from '../components'

export default function CardsPage() {
  return (
    <DocSection title="Cards" description="Composable via Card.Header, Card.Body, Card.Footer.">
      <Grid2>
        <Card variant="flat">
          <Card.Header title="Flat Card" subtitle="Subtitel oder Metadaten" />
          <Card.Body>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>
              Karteninhalt. Kann Text, Daten, Formulare oder andere Komponenten enthalten.
            </p>
          </Card.Body>
          <Card.Footer>
            <Button variant="ghost"   size="sm">Abbrechen</Button>
            <Button variant="primary" size="sm">Bestätigen</Button>
          </Card.Footer>
        </Card>

        <Card variant="raised">
          <Card.Header title="Raised Card" subtitle="Mit Elevation" />
          <Card.Body>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>
              Raised Cards heben sich durch Schatten vom Hintergrund ab. Ideal für Overlays.
            </p>
          </Card.Body>
          <Card.Footer>
            <Button variant="ghost"  size="sm">Abbrechen</Button>
            <Button variant="accent" size="sm">Speichern</Button>
          </Card.Footer>
        </Card>
      </Grid2>
    </DocSection>
  )
}