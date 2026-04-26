import { DocSection, SubSection, Grid2 } from '../docs/DocSection'
import { Input, Textarea, InputWithAddon } from '../components'

export default function InputsPage() {
  return (
    <DocSection title="Inputs" description="Textfelder in verschiedenen States, Größen und Varianten.">
      <Grid2>
        <Input label="Default"  placeholder="Platzhalter…" hint="Hilfstext für das Feld." />
        <Input label="Error"    defaultValue="Ungültiger Wert" error="Dieses Feld ist erforderlich." />
        <Input label="Small"    size="sm" placeholder="Small input…" />
        <Input label="Large"    size="lg" placeholder="Large input…" />
        <Input label="Disabled" defaultValue="Nicht editierbar" disabled />
        <div>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, marginBottom: 8 }}>Mit Addon</div>
          <InputWithAddon addon=".de" placeholder="meinedomain" />
        </div>
      </Grid2>

      <SubSection title="Textarea">
        <div style={{ maxWidth: 480 }}>
          <Textarea label="Beschreibung" rows={3} placeholder="Text eingeben…" />
        </div>
      </SubSection>
    </DocSection>
  )
}