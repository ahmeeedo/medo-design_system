import { DocSection } from '../docs/DocSection'
import { RadiusBox } from '../docs/helpers'
import styles from '../App.module.css'

const SCALE = [
  ['none','0px'],['xs','2px'],['sm','4px'],['md','6px'],['lg','8px'],
  ['xl','12px'],['2xl','16px'],['3xl','24px'],['full','9999px'],
]

export default function RadiusPage() {
  return (
    <DocSection title="Border Radius" description="Token: --radius-{name}">
      <div className={styles.radiusGrid}>
        {SCALE.map(([label, px]) => <RadiusBox key={label} label={label} px={px} />)}
      </div>
    </DocSection>
  )
}