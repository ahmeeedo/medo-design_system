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
