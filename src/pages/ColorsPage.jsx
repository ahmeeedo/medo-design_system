import { DocSection, SubSection } from '../docs/DocSection'
import { Swatch } from '../docs/helpers'
import styles from '../App.module.css'

export default function ColorsPage() {
  return (
    <DocSection title="Colors" description="Farbpalette mit Brand, Neutral und Semantic Tokens. Alle Werte in tokens.json unter color.*.">
      <SubSection title="Brand">
        <div className={styles.swatchGrid}>
          <Swatch bg="#0F0F0F" label="primary" />
          <Swatch bg="#2563EB" label="accent" />
          <Swatch bg="#1D4ED8" label="accent-hover" />
          <Swatch bg="#EFF6FF" label="accent-subtle" border />
        </div>
      </SubSection>

      <SubSection title="Neutral Scale">
        <div className={styles.swatchGrid}>
          {[['#FFFFFF','0',true],['#F9F9F9','50',true],['#F3F3F3','100'],['#E5E5E5','200'],
            ['#D4D4D4','300'],['#A3A3A3','400'],['#737373','500'],['#525252','600'],
            ['#404040','700'],['#262626','800'],['#171717','900'],['#0A0A0A','1000']
          ].map(([bg, label, border]) => (
            <Swatch key={label} bg={bg} label={label} border={!!border} />
          ))}
        </div>
      </SubSection>

      <SubSection title="Semantic">
        <div className={styles.swatchGrid}>
          <Swatch bg="#16A34A" label="success" />
          <Swatch bg="#F0FDF4" label="success-subtle" border />
          <Swatch bg="#D97706" label="warning" />
          <Swatch bg="#FFFBEB" label="warning-subtle" border />
          <Swatch bg="#DC2626" label="error" />
          <Swatch bg="#FEF2F2" label="error-subtle" border />
          <Swatch bg="#0284C7" label="info" />
          <Swatch bg="#F0F9FF" label="info-subtle" border />
        </div>
      </SubSection>
    </DocSection>
  )
}