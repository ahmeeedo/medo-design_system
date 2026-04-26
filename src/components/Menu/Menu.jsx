import styles from './Menu.module.css'

/**
 * Menu — dropdown menu panel
 *
 * Usage:
 * <Menu>
 *   <Menu.Label>Account</Menu.Label>
 *   <Menu.Item icon="👤" shortcut="⌘P">Profile</Menu.Item>
 *   <Menu.Separator />
 *   <Menu.Item danger>Delete</Menu.Item>
 * </Menu>
 */
export function Menu({ children, className = '' }) {
  return (
    <div className={[styles.menu, className].filter(Boolean).join(' ')} role="menu">
      {children}
    </div>
  )
}

Menu.Item = function MenuItem({ children, icon, shortcut, danger = false, onClick, disabled = false }) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      disabled={disabled}
      className={[styles.item, danger ? styles.danger : '', disabled ? styles.itemDisabled : ''].filter(Boolean).join(' ')}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.itemLabel}>{children}</span>
      {shortcut && <span className={styles.shortcut}>{shortcut}</span>}
    </button>
  )
}

Menu.Label = function MenuLabel({ children }) {
  return <div className={styles.label}>{children}</div>
}

Menu.Separator = function MenuSeparator() {
  return <div className={styles.sep} role="separator" />
}
