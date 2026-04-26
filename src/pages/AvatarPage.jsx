import { DocSection, SubSection, Row } from '../docs/DocSection'
import { Avatar, AvatarGroup } from '../components'

export default function AvatarPage() {
  return (
    <DocSection title="Avatar" description="Einzeln oder als Gruppe mit automatischem Overflow.">
      <SubSection title="Größen">
        <Row align="center">
          <Avatar size="xs" initials="AK" />
          <Avatar size="sm" initials="MB" color="#DBEAFE" textColor="#1D4ED8" />
          <Avatar size="md" initials="LM" color="#FCE7F3" textColor="#BE185D" />
          <Avatar size="lg" initials="JP" color="#F0FDF4" textColor="#16A34A" />
          <Avatar size="xl" initials="KS" color="#FFF7ED" textColor="#C2410C" />
        </Row>
      </SubSection>

      <SubSection title="Avatar Group">
        <AvatarGroup size="md" max={4} avatars={[
          { initials: 'AK' },
          { initials: 'MB', color: '#DBEAFE', textColor: '#1D4ED8' },
          { initials: 'LM', color: '#FCE7F3', textColor: '#BE185D' },
          { initials: 'JP', color: '#F0FDF4', textColor: '#16A34A' },
          { initials: 'KS', color: '#FFF7ED', textColor: '#C2410C' },
          { initials: 'RS', color: '#F5F3FF', textColor: '#7C3AED' },
        ]} />
      </SubSection>
    </DocSection>
  )
}