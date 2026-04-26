import { DocSection } from '../docs/DocSection'
import { Table } from '../components'
import { TABLE_COLS, TABLE_ROWS } from '../docs/helpers'

export default function TablesPage() {
  return (
    <DocSection title="Tables" description="Spalten mit optionaler render-Funktion für benutzerdefinierte Zellen.">
      <Table columns={TABLE_COLS} rows={TABLE_ROWS} />
    </DocSection>
  )
}