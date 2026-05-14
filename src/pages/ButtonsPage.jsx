import { DocSection, SubSection, Row } from '../docs/DocSection'
import { Button } from '../components'

function AddIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" width="100%" height="100%">
      <path d="M460-460H260q-8.5 0-14.25-5.76T240-480.03q0-8.51 5.75-14.24T260-500h200v-200q0-8.5 5.76-14.25t14.27-5.75q8.51 0 14.24 5.75T500-700v200h200q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T700-460H500v200q0 8.5-5.76 14.25T479.97-240q-8.51 0-14.24-5.75T460-260v-200Z"/>
    </svg>
  )
}

function ArrowForwardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" width="100%" height="100%">
      <path d="M686-450H190q-12.75 0-21.37-8.63-8.63-8.63-8.63-21.43 0-12.81 8.63-21.37Q177.25-510 190-510h496L522-674q-9-9-8.5-21.5T523-717q9-9 21.5-9t21.5 9l199 199q5 5 7 10t2 11q0 6-2 11t-7 10L566-277q-9 9-21 8.5t-21-9.5q-9-9-9-21.5t9-21.5l162-129Z"/>
    </svg>
  )
}

export default function ButtonsPage() {
  return (
    <DocSection title="Buttons" description="6 Varianten × 5 Größen + Disabled State + Icon-Support.">
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

      <SubSection title="Leading Icon">
        <Row align="center">
          {['primary','accent','secondary','ghost'].map(v => (
            <Button key={v} variant={v} size="md" leadingIcon={<AddIcon />}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Button>
          ))}
        </Row>
      </SubSection>

      <SubSection title="Trailing Icon">
        <Row align="center">
          {['primary','accent','secondary','ghost'].map(v => (
            <Button key={v} variant={v} size="md" trailingIcon={<ArrowForwardIcon />}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Button>
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
