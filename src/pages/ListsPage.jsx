import { DocSection } from '../docs/DocSection'
import { Avatar, Badge } from '../components'
import styles from '../App.module.css'

const ITEMS = [
  { id: 1, name: 'Anna Klein',  sub: 'Zuletzt aktiv vor 2 Minuten', initials: 'AK', color: '#E5E5E5', textColor: '#171717', badge: { variant: 'success', label: 'Online'  } },
  { id: 2, name: 'Max Bauer',   sub: 'Zuletzt aktiv vor 1 Stunde',  initials: 'MB', color: '#DBEAFE', textColor: '#1D4ED8', badge: { variant: 'neutral', label: 'Away'    } },
  { id: 3, name: 'Lena Müller', sub: 'Zuletzt aktiv gestern',       initials: 'LM', color: '#FCE7F3', textColor: '#BE185D', badge: { variant: 'error',   label: 'Offline' } },
]

export default function ListsPage() {
  return (
    <DocSection title="Lists" description="Listenelemente mit Avatar, Inhalt und Badge.">
      <div className={styles.list}>
        {ITEMS.map(item => (
          <div key={item.id} className={styles.listItem}>
            <Avatar size="sm" initials={item.initials} color={item.color} textColor={item.textColor} />
            <div className={styles.listContent}>
              <div className={styles.listTitle}>{item.name}</div>
              <div className={styles.listSub}>{item.sub}</div>
            </div>
            <Badge variant={item.badge.variant}>{item.badge.label}</Badge>
          </div>
        ))}
      </div>
    </DocSection>
  )
}