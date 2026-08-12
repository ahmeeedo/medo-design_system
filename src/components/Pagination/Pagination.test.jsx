import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Pagination } from './Pagination'

/* Template: callbacks.
   Covers all three things a callback test should pin down — that it fires, with
   which argument, and that it stays silent where the component must not act. */

describe('Pagination · Rückrufe', () => {
  it('meldet die Zielseite an onPageChange', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination pageCount={5} defaultPage={2} onPageChange={onPageChange} />)

    await user.click(screen.getByRole('button', { name: 'Nächste Seite' }))
    expect(onPageChange).toHaveBeenCalledWith(3)

    await user.click(screen.getByRole('button', { name: 'Seite 5' }))
    expect(onPageChange).toHaveBeenLastCalledWith(5)
    expect(onPageChange).toHaveBeenCalledTimes(2)
  })

  it('feuert nicht, wenn die Zielseite die aktuelle ist', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination pageCount={5} defaultPage={3} onPageChange={onPageChange} />)

    await user.click(screen.getByRole('button', { name: 'Seite 3' }))
    expect(onPageChange).not.toHaveBeenCalled()
  })

  it('lässt an den Rändern nicht über die Grenze blättern', () => {
    render(<Pagination pageCount={5} defaultPage={1} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Vorherige Seite' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Nächste Seite' })).toBeEnabled()
  })

  /* Controlled mode: the component must not move on its own — the parent owns
     the page. Without this assertion an internal setState would go unnoticed. */
  it('bleibt im gesteuerten Betrieb auf der übergebenen Seite', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination pageCount={5} page={2} onPageChange={onPageChange} />)

    await user.click(screen.getByRole('button', { name: 'Nächste Seite' }))

    expect(onPageChange).toHaveBeenCalledWith(3)
    expect(screen.getByRole('button', { name: 'Seite 2' })).toHaveAttribute('aria-current', 'page')
  })

  it('meldet die neue Seitengröße als Zahl', async () => {
    const user = userEvent.setup()
    const onPageSizeChange = vi.fn()
    render(
      <Pagination
        variant="bar"
        pageCount={5}
        totalItems={120}
        pageSize={20}
        onPageSizeChange={onPageSizeChange}
      />
    )

    await user.selectOptions(screen.getByRole('combobox', { name: 'Einträge pro Seite' }), '50')

    expect(onPageSizeChange).toHaveBeenCalledWith(50)
    expect(onPageSizeChange.mock.calls[0][0]).toBeTypeOf('number')
  })
})
