import { useState } from 'react'
import { DocSection, SubSection, Grid2 } from '../docs/DocSection'
import { Select, Toggle, Checkbox, Radio } from '../components'

export default function SelectsPage() {
  const [radio, setRadio] = useState('a')

  return (
    <DocSection title="Select, Checkbox, Radio, Toggle">
      <Grid2>
        <Select label="Select" options={['Option A', 'Option B', 'Option C']} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Checkbox label="Checkbox ausgewählt" defaultChecked />
          <Checkbox label="Checkbox nicht ausgewählt" />
          <Toggle label="Toggle aktiv" defaultChecked />
          <Toggle label="Toggle inaktiv" />
        </div>
      </Grid2>

      <SubSection title="Radio Group">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {['a','b','c'].map(v => (
            <Radio
              key={v}
              name="demo"
              label={`Option ${v.toUpperCase()}`}
              value={v}
              checked={radio === v}
              onChange={() => setRadio(v)}
            />
          ))}
        </div>
      </SubSection>
    </DocSection>
  )
}