import styles from './DocsLayout.module.css'

const NAV = [
  {
    section: 'Foundations',
    items: [
      { id: 'colors',     label: 'Colors' },
      { id: 'typography', label: 'Typography' },
      { id: 'spacing',    label: 'Spacing' },
      { id: 'radius',     label: 'Border Radius' },
      { id: 'shadows',    label: 'Shadows' },
      { id: 'motion',     label: 'Motion' },
    ],
  },
  {
    section: 'Components',
    items: [
      { id: 'buttons',    label: 'Buttons' },
      { id: 'inputs',     label: 'Inputs' },
      { id: 'selects',    label: 'Select & Toggle' },
      { id: 'badges',     label: 'Badges & Tags' },
      { id: 'alerts',     label: 'Alerts' },
      { id: 'cards',      label: 'Cards' },
      { id: 'tables',     label: 'Tables' },
      { id: 'tabs',       label: 'Tabs' },
      { id: 'navigation', label: 'Navigation' },
      { id: 'overlays',   label: 'Modal' },
      { id: 'accordion',  label: 'Accordion' },
      { id: 'menus',      label: 'Menus' },
      { id: 'lists',      label: 'Lists' },
      { id: 'stats',      label: 'Stats / KPI' },
      { id: 'feedback',   label: 'Feedback' },
      { id: 'avatar',     label: 'Avatar' },
      { id: 'skeleton',   label: 'Skeleton' },
    ],
  },
]

export function DocsLayout({ children }) {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className={styles.layout}>
      <nav className={styles.nav}>
        <div className={styles.navLogo}>Design System</div>
        {NAV.map((group) => (
          <div key={group.section}>
            <div className={styles.navSection}>{group.section}</div>
            {group.items.map((item) => (
              <button
                key={item.id}
                className={styles.navLink}
                onClick={() => scrollTo(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </nav>
      <main className={styles.main}>{children}</main>
    </div>
  )
}
