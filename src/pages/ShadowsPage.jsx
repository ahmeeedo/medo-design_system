import { DocSection } from '../docs/DocSection'
import { ShadowBox } from '../docs/helpers'
import styles from '../App.module.css'

export default function ShadowsPage() {
  return (
    <DocSection title="Shadows" description="Token: --shadow-{name}">
      <div className={styles.shadowGrid}>
        <ShadowBox label="xs"    shadow="0 1px 2px 0 rgba(0,0,0,0.05)" border />
        <ShadowBox label="sm"    shadow="0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.06)" />
        <ShadowBox label="md"    shadow="0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)" />
        <ShadowBox label="lg"    shadow="0 10px 15px -3px rgba(0,0,0,0.07), 0 4px 6px -4px rgba(0,0,0,0.05)" />
        <ShadowBox label="xl"    shadow="0 20px 25px -5px rgba(0,0,0,0.07), 0 8px 10px -6px rgba(0,0,0,0.04)" />
        <ShadowBox label="2xl"   shadow="0 25px 50px -12px rgba(0,0,0,0.12)" />
        <ShadowBox label="inner" shadow="inset 0 2px 4px 0 rgba(0,0,0,0.05)" border />
      </div>
    </DocSection>
  )
}