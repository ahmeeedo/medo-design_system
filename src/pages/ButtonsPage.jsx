import { DocSection, SubSection, Row } from '../docs/DocSection'
import { Button } from '../components'

export default function ButtonsPage() {
  return (
    <DocSection title="Buttons" description="6 Varianten × 5 Größen + Disabled State.">
      <SubSection title="Varianten">
        <Row align="center">
          {['primary','accent','secondary','ghost','danger','link'].map(v => (
            <Button key={v} variant={v} size="md">
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Button>
          ))}
        </Row>
      </SubSection>

      <SubSection title="Größen (Primary)">
        <Row align="center">
          {['xs','sm','md','lg','xl'].map(s => (
            <Button key={s} variant="primary" size={s}>{s.toUpperCase()}</Button>
          ))}
        </Row>
      </SubSection>

      <SubSection title="Disabled">
        <Row align="center">
          {['primary','accent','secondary'].map(v => (
            <Button key={v} variant={v} size="md" disabled>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Button>
          ))}
        </Row>
      </SubSection>
    </DocSection>
  )
}