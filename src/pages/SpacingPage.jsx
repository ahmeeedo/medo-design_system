import { DocSection } from '../docs/DocSection'
import { SpacingRow } from '../docs/helpers'

const SCALE = [
  ['1','4px'],['2','8px'],['3','12px'],['4','16px'],['5','20px'],['6','24px'],
  ['7','28px'],['8','32px'],['9','36px'],['10','40px'],['12','48px'],['14','56px'],
  ['16','64px'],['20','80px'],['24','96px'],['32','128px'],
]

export default function SpacingPage() {
  return (
    <DocSection title="Spacing" description="4px-Basisgrid. Token: --space-{n}">
      {SCALE.map(([n, px]) => <SpacingRow key={n} token={n} px={px} />)}
    </DocSection>
  )
}