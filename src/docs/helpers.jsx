import { Avatar } from '../components/Avatar/Avatar'
import { Badge }  from '../components/Badge/Badge'
import { LegacyButton as Button } from '../components/Button/LegacyButton'
import { TokenChip } from './DocSection'
import styles from '../App.module.css'

export function Swatch({ bg, label, border = false }) {
  return (
    <div className={styles.swatch}>
      <div className={styles.swatchBox} style={{ background: bg, border: border ? '1px solid var(--border-subtle-100)' : undefined }} />
      {/* {<div className={styles.swatchLabel}>{label}</div>} */}
    </div>
  )
}

export function TypeRow({ name, detail, style }) {
  return (
    <div className={styles.typeRow}>
      <div className={styles.typeMeta}>
        <div className={styles.typeName}>{name}</div>
        <div className={styles.typeDetail}>{detail}</div>
      </div>
      <div style={style}>The quick brown fox</div>
    </div>
  )
}

export function SpacingRow({ token, px }) {
  const pxNum = parseInt(px)
  return (
    <div className={styles.spacingRow}>
      <div className={styles.spacingBar} style={{ width: Math.min(pxNum * 1.5, 220) }} />
      <div className={styles.spacingMeta}>
        <TokenChip>--space-{token}</TokenChip>
        <span className={styles.spacingPx}>{px}</span>
        <span className={styles.spacingBase}>{pxNum / 4}×</span>
      </div>
    </div>
  )
}

export function ShadowBox({ label, shadow, border }) {
  return (
    <div className={styles.shadowItem}>
      <div className={styles.shadowBox} style={{ boxShadow: shadow, border: border ? '1px solid var(--color-border)' : undefined }} />
      <span className={styles.shadowLabel}>{label}</span>
    </div>
  )
}

export function RadiusBox({ label, px }) {
  return (
    <div className={styles.radiusItem}>
      <div className={styles.radiusBox} style={{ borderRadius: px }} />
      <span className={styles.radiusLabel}>{label}<br />{px}</span>
    </div>
  )
}

export const TABLE_COLS = [
  { key: 'name', label: 'Name', render: (r) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Avatar size="sm" initials={r.initials} color={r.color} textColor={r.textColor} />
      <div>
        <div style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{r.fullName}</div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{r.email}</div>
      </div>
    </div>
  )},
  { key: 'status', label: 'Status', render: (r) => <Badge variant={r.badgeVariant} dot>{r.status}</Badge> },
  { key: 'role',   label: 'Rolle' },
  { key: 'date',   label: 'Erstellt', render: (r) => <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{r.date}</span> },
  { key: 'action', label: '', render: () => <Button variant="ghost" size="sm">Bearbeiten</Button> },
]

export const TABLE_ROWS = [
  { id: 1, fullName: 'Anna Klein',  email: 'a.klein@example.com',   initials: 'AK', color: '#E5E5E5', textColor: '#171717', status: 'Aktiv',      badgeVariant: 'success', role: 'Admin',  date: '12. Apr 2025' },
  { id: 2, fullName: 'Max Bauer',   email: 'm.bauer@example.com',   initials: 'MB', color: '#DBEAFE', textColor: '#1D4ED8', status: 'Ausstehend', badgeVariant: 'warning', role: 'Editor', date: '3. Mai 2025' },
  { id: 3, fullName: 'Lena Müller', email: 'l.mueller@example.com', initials: 'LM', color: '#FCE7F3', textColor: '#BE185D', status: 'Inaktiv',    badgeVariant: 'neutral', role: 'Viewer', date: '20. Jan 2025' },
]

export const ACCORDION_ITEMS = [
  { id: 'a1', title: 'Was ist ein Design Token?',             content: 'Design Tokens sind benannte Variablen, die Design-Entscheidungen systemweit speichern. Sie bilden die Brücke zwischen Design und Code.' },
  { id: 'a2', title: 'Wie importiere ich tokens.json in Figma?', content: 'Installiere das Plugin „Tokens Studio for Figma". Öffne es, wähle Import und lade die tokens.json Datei. Alle Tokens werden automatisch als Variablen angelegt.' },
  { id: 'a3', title: 'Wie ändere ich die Akzentfarbe?',       content: 'Passe den Wert von color.brand.accent in der tokens.json an. Alle Komponenten, die auf diesen Token referenzieren, aktualisieren sich automatisch.' },
]