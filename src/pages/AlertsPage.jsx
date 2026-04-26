import { DocSection, SubSection } from '../docs/DocSection'
import { Alert, Toast } from '../components'

export default function AlertsPage() {
  return (
    <DocSection title="Alerts & Notifications">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
        <Alert variant="info"    title="Hinweis">Diese Aktion erfordert zusätzliche Bestätigung.</Alert>
        <Alert variant="success" title="Erfolgreich gespeichert">Deine Änderungen wurden übernommen.</Alert>
        <Alert variant="warning" title="Achtung">Diese Aktion kann nicht rückgängig gemacht werden.</Alert>
        <Alert variant="error"   title="Fehler aufgetreten">Die Verbindung zum Server konnte nicht hergestellt werden.</Alert>
      </div>

      <SubSection title="Toast">
        <Toast action="Rückgängig" onAction={() => {}}>Änderungen gespeichert</Toast>
      </SubSection>
    </DocSection>
  )
}