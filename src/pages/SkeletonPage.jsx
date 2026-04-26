import { DocSection } from '../docs/DocSection'
import { SkeletonCard } from '../components'

export default function SkeletonPage() {
  return (
    <DocSection title="Skeleton / Loading" description="Platzhalter während Inhalte geladen werden.">
      <SkeletonCard />
    </DocSection>
  )
}