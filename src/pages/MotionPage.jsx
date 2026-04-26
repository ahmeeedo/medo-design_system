import { DocSection } from '../docs/DocSection'
import { Table } from '../components'
import { TokenChip } from '../docs/DocSection'

const ROWS = [
  { id: 1, token: '--duration-instant', value: '50ms',  usage: 'Hover-Highlights, Icon-Swaps' },
  { id: 2, token: '--duration-fast',    value: '100ms', usage: 'Button States, Border' },
  { id: 3, token: '--duration-normal',  value: '150ms', usage: 'Toggle, Checkbox, Focus Ring' },
  { id: 4, token: '--duration-slow',    value: '250ms', usage: 'Dropdown, Tooltip Fade' },
  { id: 5, token: '--duration-slower',  value: '400ms', usage: 'Modal, Drawer, Slide-in' },
  { id: 6, token: '--ease-out',    value: 'cubic-bezier(0,0,0.2,1)',      usage: 'Elemente erscheinen' },
  { id: 7, token: '--ease-in-out', value: 'cubic-bezier(0.4,0,0.2,1)',    usage: 'Positionswechsel' },
  { id: 8, token: '--ease-spring', value: 'cubic-bezier(0.34,1.56,0.64,1)', usage: 'Bouncy Toggle, Chip' },
]

export default function MotionPage() {
  return (
    <DocSection title="Motion" description="Dauern und Easing-Kurven. Token: --duration-{name}, --ease-{name}">
      <Table
        columns={[
          { key: 'token', label: 'Token', render: (r) => <TokenChip>{r.token}</TokenChip> },
          { key: 'value', label: 'Wert' },
          { key: 'usage', label: 'Einsatz' },
        ]}
        rows={ROWS}
      />
    </DocSection>
  )
}