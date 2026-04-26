import { useState } from 'react'
import { DocSection, SubSection, Row } from '../docs/DocSection'
import { Badge, Tag } from '../components'

const INITIAL_TAGS = ['Design System', 'Figma', 'Tokens', 'Carbon']

export default function BadgesPage() {
  const [tags, setTags] = useState(INITIAL_TAGS)

  return (
    <DocSection title="Badges & Tags">
      <SubSection title="Badges — Small">
        <Row align="center">
          {['neutral','accent','success','warning','error'].map(v => (
            <Badge key={v} variant={v} dot>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Badge>
          ))}
        </Row>
      </SubSection>

      <SubSection title="Badges — Large">
        <Row align="center">
          {['neutral','success','error'].map(v => (
            <Badge key={v} variant={v} size="lg">
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Badge>
          ))}
        </Row>
      </SubSection>

      <SubSection title="Tags (entfernbar)">
        <Row align="center">
          {tags.map(t => (
            <Tag key={t} onRemove={() => setTags(tags.filter(x => x !== t))}>{t}</Tag>
          ))}
        </Row>
      </SubSection>
    </DocSection>
  )
}