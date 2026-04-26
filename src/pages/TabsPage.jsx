import { DocSection, SubSection } from '../docs/DocSection'
import { Tabs } from '../components'

export default function TabsPage() {
  return (
    <DocSection title="Tabs" description="Zwei Varianten: Underline und Pill.">
      <SubSection title="Underline">
        <Tabs variant="underline" tabs={[
          { id: 'overview',  label: 'Übersicht',     content: <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Inhalt der Übersicht.</p> },
          { id: 'details',   label: 'Details',       content: <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Detailansicht.</p> },
          { id: 'activity',  label: 'Aktivität',     content: <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Aktivitäts-Log.</p> },
          { id: 'settings',  label: 'Einstellungen', content: <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Einstellungen.</p> },
        ]} />
      </SubSection>

      <SubSection title="Pill">
        <Tabs variant="pill" tabs={[
          { id: 'all',      label: 'Alle' },
          { id: 'active',   label: 'Aktiv' },
          { id: 'archived', label: 'Archiviert' },
        ]} />
      </SubSection>
    </DocSection>
  )
}