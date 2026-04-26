import { DocSection, SubSection } from '../docs/DocSection'
import { Progress } from '../components'

export default function FeedbackPage() {
  return (
    <DocSection title="Feedback — Progress" description="5 Varianten, 3 Größen.">
      <SubSection title="Varianten">
        <div style={{ maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Progress value={72} variant="neutral" label="Neutral"  showValue />
          <Progress value={45} variant="accent"  label="Accent"   showValue />
          <Progress value={90} variant="success" label="Success"  size="lg" showValue />
          <Progress value={30} variant="warning" label="Warning"  size="sm" showValue />
          <Progress value={15} variant="error"   label="Error"    showValue />
        </div>
      </SubSection>
    </DocSection>
  )
}