import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContentSwitcher } from './ContentSwitcher'

/* Template: die eingebaute Tastaturbedienung ueberlebt einen uebergebenen Handler.
   Am onKeyDown der Segmentleiste haengt der gesamte Tastaturweg. Stand er vor
   {...rest}, ersetzte ihn ein eigenes onKeyDown des Aufrufers — stumm, ohne dass
   etwas bricht. Geprueft wird deshalb die Bedienung selbst, nicht nur die Verkettung. */

const ITEMS = [
  { value: 'liste', label: 'Liste' },
  { value: 'raster', label: 'Raster' },
  { value: 'kanban', label: 'Kanban' },
]

describe('ContentSwitcher · uebergebenes onKeyDown ersetzt die Bedienung nicht', () => {
  it('wechselt mit den Pfeiltasten und ruft den uebergebenen Handler', async () => {
    const user = userEvent.setup()
    const onKeyDown = vi.fn()
    const onChange = vi.fn()
    render(<ContentSwitcher items={ITEMS} onChange={onChange} onKeyDown={onKeyDown} />)

    screen.getByRole('tab', { name: 'Liste' }).focus()
    await user.keyboard('{ArrowRight}')

    expect(onChange).toHaveBeenCalledWith('raster')
    expect(screen.getByRole('tab', { name: 'Raster' })).toHaveAttribute('aria-selected', 'true')
    expect(onKeyDown).toHaveBeenCalled()
  })

  it('springt mit Home und End an die Raender, auch mit uebergebenem Handler', async () => {
    const user = userEvent.setup()
    const onKeyDown = vi.fn()
    render(<ContentSwitcher items={ITEMS} defaultValue="raster" onKeyDown={onKeyDown} />)

    screen.getByRole('tab', { name: 'Raster' }).focus()
    await user.keyboard('{End}')
    expect(screen.getByRole('tab', { name: 'Kanban' })).toHaveAttribute('aria-selected', 'true')

    await user.keyboard('{Home}')
    expect(screen.getByRole('tab', { name: 'Liste' })).toHaveAttribute('aria-selected', 'true')

    expect(onKeyDown).toHaveBeenCalled()
  })

  it('laeuft ueber den Rand hinaus zum anderen Ende, auch mit uebergebenem Handler', async () => {
    const user = userEvent.setup()
    const onKeyDown = vi.fn()
    render(<ContentSwitcher items={ITEMS} defaultValue="liste" onKeyDown={onKeyDown} />)

    screen.getByRole('tab', { name: 'Liste' }).focus()
    await user.keyboard('{ArrowLeft}')

    expect(screen.getByRole('tab', { name: 'Kanban' })).toHaveAttribute('aria-selected', 'true')
    expect(onKeyDown).toHaveBeenCalled()
  })

  /* Der eingebaute Handler ruft preventDefault. Laeuft er nicht, bliebe das aus. */
  it('haelt das Standardverhalten der Taste auf, auch mit uebergebenem Handler', async () => {
    const user = userEvent.setup()
    let verhindert = null
    const onKeyDown = vi.fn((e) => {
      verhindert = e.defaultPrevented
    })
    render(<ContentSwitcher items={ITEMS} onKeyDown={onKeyDown} />)

    screen.getByRole('tab', { name: 'Liste' }).focus()
    await user.keyboard('{ArrowRight}')

    expect(verhindert).toBe(true)
  })
})
