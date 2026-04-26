import { DocSection } from '../docs/DocSection'
import { Menu } from '../components'

export default function MenusPage() {
  return (
    <DocSection title="Menus & Dropdowns" description="Composable via Menu.Item, Menu.Label, Menu.Separator.">
      <div style={{ maxWidth: 240 }}>
        <Menu>
          <Menu.Label>Account</Menu.Label>
          <Menu.Item icon="👤" shortcut="⌘P">Profil anzeigen</Menu.Item>
          <Menu.Item icon="⚙"  shortcut="⌘,">Einstellungen</Menu.Item>
          <Menu.Separator />
          <Menu.Label>Workspace</Menu.Label>
          <Menu.Item icon="📁" shortcut="⌘N">Neues Projekt</Menu.Item>
          <Menu.Item icon="📋">Duplizieren</Menu.Item>
          <Menu.Separator />
          <Menu.Item icon="🗑" danger shortcut="⌫">Löschen</Menu.Item>
        </Menu>
      </div>
    </DocSection>
  )
}