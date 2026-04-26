import { DocSection } from '../docs/DocSection'
import { StatCard } from '../components'
import styles from '../App.module.css'

export default function StatsPage() {
  return (
    <DocSection title="Stats / KPI Cards" description="Kennzahlen-Karten mit Label, Wert und Delta.">
      <div className={styles.statGrid}>
        <StatCard label="Umsatz"     value="€84.2k" delta="12.4% vs. Vormonat" deltaDir="up" />
        <StatCard label="Nutzer"     value="12,841" delta="8.1%"               deltaDir="up" />
        <StatCard label="Conversion" value="3.6%"   delta="0.4%"               deltaDir="down" />
        <StatCard label="Offen"      value="47"     delta="5 Tickets"          deltaDir="down" />
      </div>
    </DocSection>
  )
}