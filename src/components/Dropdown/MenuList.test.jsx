import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MenuList } from './Dropdown'

/* Template: keyboard navigation, focus management and selection callbacks.
   MenuList reads the active row out of the DOM on every keystroke instead of
   holding it in state — that is what keeps the handler free of a stale
   closure. These assertions protect the behaviour, not the mechanism. */

const ITEMS = [
  { value: 'open', label: 'Öffnen' },
  { value: 'rename', label: 'Umbenennen' },
  { value: 'archive', label: 'Archivieren' },
]

describe('MenuList · Tastatur und Fokus', () => {
  it('legt den Fokus beim Öffnen auf den ersten Eintrag', () => {
    render(<MenuList items={ITEMS} ariaLabel="Aktionen" />)
    expect(screen.getByRole('menuitem', { name: 'Öffnen' })).toHaveFocus()
  })

  it('bewegt den Fokus mit Pfeilen, Pos1 und Ende und läuft um', async () => {
    const user = userEvent.setup()
    render(<MenuList items={ITEMS} ariaLabel="Aktionen" />)
    const rows = screen.getAllByRole('menuitem')

    await user.keyboard('{ArrowDown}')
    expect(rows[1]).toHaveFocus()

    await user.keyboard('{End}')
    expect(rows[2]).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    expect(rows[0]).toHaveFocus()

    await user.keyboard('{ArrowUp}')
    expect(rows[2]).toHaveFocus()

    await user.keyboard('{Home}')
    expect(rows[0]).toHaveFocus()
  })

  it('überspringt deaktivierte Einträge', async () => {
    const user = userEvent.setup()
    render(
      <MenuList
        items={[ITEMS[0], { ...ITEMS[1], disabled: true }, ITEMS[2]]}
        ariaLabel="Aktionen"
      />
    )

    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('menuitem', { name: 'Archivieren' })).toHaveFocus()
  })

  it('springt beim Tippen zum passenden Eintrag', async () => {
    const user = userEvent.setup()
    render(<MenuList items={ITEMS} ariaLabel="Aktionen" />)

    await user.keyboard('a')
    expect(screen.getByRole('menuitem', { name: 'Archivieren' })).toHaveFocus()
  })

  /* Keystrokes within 800 ms accumulate into one search term, so a second
     letter refines the search instead of starting a new one. */
  it('verfeinert die Suche mit dem zweiten Buchstaben', async () => {
    const user = userEvent.setup()
    render(
      <MenuList
        items={[...ITEMS, { value: 'ausblenden', label: 'Ausblenden' }]}
        ariaLabel="Aktionen"
      />
    )

    await user.keyboard('a')
    expect(screen.getByRole('menuitem', { name: 'Archivieren' })).toHaveFocus()

    await user.keyboard('u')
    expect(screen.getByRole('menuitem', { name: 'Ausblenden' })).toHaveFocus()
  })

  it('sucht nur im Labeltext, nicht im Kürzel', async () => {
    const user = userEvent.setup()
    render(
      <MenuList
        items={[
          { value: 'open', label: 'Öffnen', shortcut: 'Strg+O' },
          { value: 'save', label: 'Sichern', shortcut: 'Strg+S' },
        ]}
        ariaLabel="Aktionen"
      />
    )

    await user.keyboard('s')
    expect(screen.getByRole('menuitem', { name: /Sichern/ })).toHaveFocus()
  })

  it('schließt mit Escape', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<MenuList items={ITEMS} onClose={onClose} ariaLabel="Aktionen" />)

    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})

describe('MenuList · Auswahl', () => {
  it('meldet Wert und Eintrag an onSelect und schließt danach', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    const onClose = vi.fn()
    render(<MenuList items={ITEMS} onSelect={onSelect} onClose={onClose} ariaLabel="Aktionen" />)

    await user.keyboard('{ArrowDown}{Enter}')

    expect(onSelect).toHaveBeenCalledWith('rename', expect.objectContaining({ value: 'rename' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('bleibt bei keepOpen offen', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <MenuList
        items={[{ value: 'grid', label: 'Raster zeigen', keepOpen: true }]}
        onSelect={vi.fn()}
        onClose={onClose}
        ariaLabel="Ansicht"
      />
    )

    await user.keyboard('{Enter}')
    expect(onClose).not.toHaveBeenCalled()
  })

  it('meldet nichts bei einem deaktivierten Eintrag', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <MenuList
        items={[{ value: 'archive', label: 'Archivieren', disabled: true }]}
        onSelect={onSelect}
        autoFocus={false}
        ariaLabel="Aktionen"
      />
    )

    await user.click(screen.getByRole('menuitem', { name: 'Archivieren' }))
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('trägt im Einfachmodus die Radio-Rolle und den Auswahlzustand', () => {
    render(
      <MenuList
        selectionMode="single"
        items={[
          { value: 'de', label: 'Deutsch', checked: true },
          { value: 'en', label: 'Englisch' },
        ]}
        ariaLabel="Sprache"
      />
    )

    expect(screen.getByRole('menuitemradio', { name: 'Deutsch' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('menuitemradio', { name: 'Englisch' })).toHaveAttribute('aria-checked', 'false')
  })

  it('trägt im Mehrfachmodus die Checkbox-Rolle', () => {
    render(
      <MenuList
        selectionMode="multiple"
        items={[
          { value: 'nord', label: 'Praxis Nord', checked: true },
          { value: 'sued', label: 'Praxis Süd' },
        ]}
        ariaLabel="Standorte"
      />
    )

    expect(screen.getAllByRole('menuitemcheckbox')).toHaveLength(2)
    expect(screen.getByRole('menuitemcheckbox', { name: 'Praxis Nord' })).toHaveAttribute('aria-checked', 'true')
  })
})
