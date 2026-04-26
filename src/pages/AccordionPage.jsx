import { DocSection } from '../docs/DocSection'
import { Accordion } from '../components'
import { ACCORDION_ITEMS } from '../docs/helpers'

export default function AccordionPage() {
  return (
    <DocSection title="Accordion" description="Einzeln oder mehrere gleichzeitig öffenbar (allowMultiple).">
      <Accordion items={ACCORDION_ITEMS} />
    </DocSection>
  )
}