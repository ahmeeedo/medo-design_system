import { useState } from 'react'
import styles from './Tabs.module.css'

/**
 * Tabs — controlled or uncontrolled
 *
 * @param {'underline'|'pill'} variant
 * @param {Array<{id: string, label: string, content?: ReactNode}>} tabs
 * @param {string} defaultTab — id of initially active tab (uncontrolled)
 * @param {string} activeTab  — controlled active tab id
 * @param {function} onTabChange
 */
export function Tabs({
  variant = 'underline',
  tabs = [],
  defaultTab,
  activeTab: controlledTab,
  onTabChange,
}) {
  const [internalActive, setInternalActive] = useState(defaultTab ?? tabs[0]?.id)
  const isControlled = controlledTab !== undefined
  const active = isControlled ? controlledTab : internalActive

  const handleSelect = (id) => {
    if (!isControlled) setInternalActive(id)
    onTabChange?.(id)
  }

  const activeContent = tabs.find((t) => t.id === active)?.content

  return (
    <div>
      <div className={[styles.tabList, styles[variant]].join(' ')}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={tab.id === active}
            className={[styles.tab, styles[`tab_${variant}`], tab.id === active ? styles.active : ''].join(' ')}
            onClick={() => handleSelect(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activeContent && (
        <div className={styles.panel} role="tabpanel">
          {activeContent}
        </div>
      )}
    </div>
  )
}
