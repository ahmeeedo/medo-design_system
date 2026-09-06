import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContainedList } from './ContainedList'

/* Template: roving focus and keyboard navigation.
   The point of this component is that arrows move the focus WITHOUT selecting —
   that separation is what these assertions protect. */

const ITEMS = [
  { value: 'a', label: 'Praxis Nord' },
  { value: 'b', label: 'Praxis Mitte' },
  { value: 'c', label: 'Praxis Süd' },
]

describe('ContainedList · Tastatur', () => {
  it('bewegt den Fokus mit den Pfeiltasten, ohne auszuwählen', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ContainedList mode="single" items={ITEMS} onChange={onChange} />)

    const rows = screen.getAllByRole('option')
    rows[0].focus()

    await user.keyboard('{ArrowDown}')
    expect(rows[1]).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    expect(rows[2]).toHaveFocus()

    await user.keyboard('{ArrowUp}')
    expect(rows[1]).toHaveFocus()

    expect(onChange).not.toHaveBeenCalled()
    rows.forEach((row) => expect(row).toHaveAttribute('aria-selected', 'false'))
  })

  it('springt mit Pos1 und Ende an die Ränder und läuft am Ende um', async () => {
    const user = userEvent.setup()
    render(<ContainedList mode="single" items={ITEMS} />)

    const rows = screen.getAllByRole('option')
    rows[1].focus()

    await user.keyboard('{End}')
    expect(rows[2]).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    expect(rows[0]).toHaveFocus()

    await user.keyboard('{Home}')
    expect(rows[0]).toHaveFocus()
  })

  it('überspringt deaktivierte Zeilen', async () => {
    const user = userEvent.setup()
    render(
      <ContainedList
        mode="single"
        items={[ITEMS[0], { ...ITEMS[1], disabled: true }, ITEMS[2]]}
      />
    )

    const rows = screen.getAllByRole('option')
    rows[0].focus()

    await user.keyboard('{ArrowDown}')
    expect(rows[2]).toHaveFocus()
  })

  it('wählt erst mit Enter aus und meldet den Wert', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ContainedList mode="single" items={ITEMS} onChange={onChange} />)

    const rows = screen.getAllByRole('option')
    rows[0].focus()
    await user.keyboard('{ArrowDown}')
    await user.keyboard('{Enter}')

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith('b')
    expect(rows[1]).toHaveAttribute('aria-selected', 'true')
  })

  it('sammelt im Mehrfachmodus statt zu ersetzen', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ContainedList mode="multiple" items={ITEMS} onChange={onChange} />)

    const rows = screen.getAllByRole('option')
    await user.click(rows[0])
    await user.click(rows[2])

    expect(onChange).toHaveBeenLastCalledWith(['a', 'c'])

    await user.click(rows[0])
    expect(onChange).toHaveBeenLastCalledWith(['c'])
  })
})

/* Beschriftung der Zeilenaktion. Die Zeile schlaegt die Liste, die Liste schlaegt den
   Vorgabewert — wer zwanzig Zeilen in einer anderen Sprache zeigt, setzt die Angabe
   einmal an der Liste statt zwanzigmal an der Zeile. */
describe('ContainedList · Beschriftung der Zeilenaktion', () => {
  const MIT_AKTION = [
    { value: 'a', label: 'Praxis Nord', action: 'more_vert' },
    { value: 'b', label: 'Praxis Süd', action: 'more_vert', actionLabel: 'Termin absagen' },
  ]

  it('traegt ohne gesetzte Angabe weiterhin den deutschen Vorgabewert', () => {
    render(<ContainedList items={MIT_AKTION} ariaLabel="Praxen" onAction={() => {}} />)

    expect(screen.getByRole('button', { name: 'Weitere Aktionen' })).toBeInTheDocument()
  })

  it('nimmt eine an der Liste gesetzte Beschriftung als Rueckfallwert', () => {
    render(
      <ContainedList
        items={MIT_AKTION}
        ariaLabel="Praxen"
        actionLabel="More actions"
        onAction={() => {}}
      />
    )

    expect(screen.getByRole('button', { name: 'More actions' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Weitere Aktionen' })).not.toBeInTheDocument()
  })

  it('laesst die Beschriftung der Zeile die der Liste schlagen', () => {
    render(
      <ContainedList
        items={MIT_AKTION}
        ariaLabel="Praxen"
        actionLabel="More actions"
        onAction={() => {}}
      />
    )

    expect(screen.getByRole('button', { name: 'Termin absagen' })).toBeInTheDocument()
  })
})

/* Der Kreis kommt seit der Umstellung aus der Avatar-Komponente. Die Liste bleibt
   dabei einfarbig — die fuenfzehn Schemata sind Tabellen vorbehalten. */

const MIT_AVATAR = [
  { value: 'mh', avatar: 'MH', label: 'Dr. Marie Hoffmann' },
  { value: 'ts', avatar: 'TS', label: 'Tobias Schuster' },
  { value: 'ak', avatar: 'AK', label: 'Anja Keller' },
]

describe('ContainedList · Avatar', () => {
  it('rendert den Kreis ueber die Avatar-Komponente statt selbst', () => {
    const { container } = render(<ContainedList items={MIT_AVATAR} ariaLabel="Mitglieder" />)

    expect(container.querySelector('.medo-clist__avatar')).toBeNull()
    expect(container.querySelectorAll('.medo-av')).toHaveLength(3)
  })

  it('traegt die Kuerzel und bleibt in der Groesse md', () => {
    const { container } = render(<ContainedList items={MIT_AVATAR} ariaLabel="Mitglieder" />)
    const kreise = [...container.querySelectorAll('.medo-av')]

    expect(kreise.map((k) => k.textContent)).toEqual(['MH', 'TS', 'AK'])
    kreise.forEach((k) => expect(k).toHaveClass('medo-av--md'))
  })

  it('bleibt einfarbig — alle Kreise tragen teal', () => {
    const { container } = render(<ContainedList items={MIT_AVATAR} ariaLabel="Mitglieder" />)

    const kreise = [...container.querySelectorAll('.medo-av')]
    kreise.forEach((k) => expect(k).toHaveClass('medo-av--teal'))
  })

  it('bleibt fuer Vorleseprogramme stumm, weil der Name danebensteht', () => {
    const { container } = render(<ContainedList items={MIT_AVATAR} ariaLabel="Mitglieder" />)

    const kreis = container.querySelector('.medo-av')
    expect(kreis).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('laesst den Avatar das Icon schlagen', () => {
    const { container } = render(
      <ContainedList
        ariaLabel="Mitglieder"
        items={[{ value: 'mh', avatar: 'MH', icon: 'badge', label: 'Dr. Marie Hoffmann' }]}
      />
    )

    expect(container.querySelector('.medo-av')).toBeInTheDocument()
    expect(container.querySelector('.medo-clist__iconbox')).toBeNull()
  })
})
