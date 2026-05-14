import { DocSection } from '../docs/DocSection'
import { Select } from '../components'

export default function SelectsPage() {
  return (
    <DocSection title="Select">
      <Select label="Select" options={['Option A', 'Option B', 'Option C']} />
    </DocSection>
  )
}
