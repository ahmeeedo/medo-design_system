import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Menu } from './Menu'

/* Template: das eingebaute onContextMenu ueberlebt einen uebergebenen Handler.
   Es ruft preventDefault und oeffnet das eigene Menue an der Cursorposition.
   Ersetzte ein Aufrufer es, erschiene stattdessen das Menue des Browsers — stumm. */

const ITEMS = [
  { value: 'open', label: 'Öffnen' },
  { value: 'rename', label: 'Umbenennen' },
  { value: 'archive', label: 'Archivieren' },
]

describe('Menu · uebergebenes onContextMenu ersetzt die Bedienung nicht', () => {
  it('oeffnet das Kontextmenue und ruft den uebergebenen Handler', async () => {
    const user = userEvent.setup()
    const onContextMenu = vi.fn()
    render(
      <Menu items={ITEMS} ariaLabel="Dateiaktionen" onContextMenu={onContextMenu}>
        <div>Datei</div>
      </Menu>
    )

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()

    await user.pointer({ keys: '[MouseRight]', target: screen.getByText('Datei') })

    expect(screen.getByRole('menu', { name: 'Dateiaktionen' })).toBeInTheDocument()
    expect(onContextMenu).toHaveBeenCalledTimes(1)
  })

  /* Ohne preventDefault des eingebauten Handlers erschiene das Browsermenue. */
  it('haelt das Kontextmenue des Browsers auf, auch mit uebergebenem Handler', async () => {
    const user = userEvent.setup()
    let verhindert = null
    const onContextMenu = vi.fn((e) => {
      verhindert = e.defaultPrevented
    })
    render(
      <Menu items={ITEMS} ariaLabel="Dateiaktionen" onContextMenu={onContextMenu}>
        <div>Datei</div>
      </Menu>
    )

    await user.pointer({ keys: '[MouseRight]', target: screen.getByText('Datei') })

    expect(verhindert).toBe(true)
  })

  it('oeffnet nichts, wenn die Komponente gesperrt ist — der uebergebene Handler laeuft trotzdem', async () => {
    const user = userEvent.setup()
    const onContextMenu = vi.fn()
    render(
      <Menu items={ITEMS} ariaLabel="Dateiaktionen" disabled onContextMenu={onContextMenu}>
        <div>Datei</div>
      </Menu>
    )

    await user.pointer({ keys: '[MouseRight]', target: screen.getByText('Datei') })

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(onContextMenu).toHaveBeenCalledTimes(1)
  })

  /* Im geoeffneten Menue liegt die Tastaturbedienung bei MenuList. */
  it('bedient das geoeffnete Menue weiterhin mit der Tastatur', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <Menu items={ITEMS} ariaLabel="Dateiaktionen" onSelect={onSelect} onContextMenu={() => {}}>
        <div>Datei</div>
      </Menu>
    )

    await user.pointer({ keys: '[MouseRight]', target: screen.getByText('Datei') })
    await user.keyboard('{ArrowDown}')
    await user.keyboard('{Enter}')

    expect(onSelect).toHaveBeenCalledWith('rename', expect.objectContaining({ value: 'rename' }))
  })
})
