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

/* Beschriftungen. Der Vertrag sagt fuer jede Angabe einen Vorgabewert zu; das Paket
   ist ausgeliefert, eine Angabe ohne Vorgabewert liesse bestehende Einbindungen mit
   leeren Beschriftungen zurueck. Beide Richtungen werden geprueft. */
describe('Pagination · Beschriftungen', () => {
  it('traegt ohne gesetzte Angaben weiterhin die deutschen Texte', () => {
    render(
      <Pagination
        variant="bar"
        page={3}
        pageCount={12}
        totalItems={312}
        pageSize={20}
        showFirstLast
        showJump
        onPageSizeChange={() => {}}
        onPageChange={() => {}}
      />
    )

    expect(screen.getByRole('button', { name: 'Seite 3' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Erste Seite' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Vorherige Seite' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Nächste Seite' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Letzte Seite' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Einträge pro Seite' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Zu Seite springen' })).toBeInTheDocument()
    expect(screen.getByText('Einträge pro Seite')).toBeInTheDocument()
    expect(screen.getByText('41–60 von 312')).toBeInTheDocument()
    expect(screen.getByText('Gehe zu')).toBeInTheDocument()
  })

  it('traegt in der kompakten Form ohne gesetzte Angaben die deutschen Texte', () => {
    const { container } = render(
      <Pagination variant="compact" page={3} pageCount={12} onPageChange={() => {}} />
    )

    expect(screen.getByRole('button', { name: /Zurück/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Weiter/ })).toBeInTheDocument()
    /* Der Vorgabewert setzt die Zahl in ein <b>, der Text liegt also ueber mehrere Knoten. */
    expect(container.querySelector('.medo-pag__info')).toHaveTextContent('Seite 3 von 12')
  })

  it('nimmt uebergebene Beschriftungen an — auch die drei mit eingesetztem Wert', () => {
    render(
      <Pagination
        variant="bar"
        page={3}
        pageCount={12}
        totalItems={312}
        pageSize={20}
        showFirstLast
        showJump
        onPageSizeChange={() => {}}
        onPageChange={() => {}}
        pageLabel={(page) => `Page ${page}`}
        firstLabel="First page"
        previousLabel="Previous page"
        nextLabel="Next page"
        lastLabel="Last page"
        pageSizeLabel="Rows per page"
        rangeLabel={(from, to, total) => `${from}-${to} of ${total}`}
        jumpLabel="Go to"
        jumpAriaLabel="Jump to page"
      />
    )

    expect(screen.getByRole('button', { name: 'Page 3' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'First page' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next page' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Last page' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Rows per page' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Jump to page' })).toBeInTheDocument()
    expect(screen.getByText('41-60 of 312')).toBeInTheDocument()
    expect(screen.getByText('Go to')).toBeInTheDocument()
    expect(screen.queryByText('Einträge pro Seite')).not.toBeInTheDocument()
  })

  it('nimmt die sichtbaren Beschriftungen der kompakten Form an', () => {
    render(
      <Pagination
        variant="compact"
        page={3}
        pageCount={12}
        onPageChange={() => {}}
        backLabel="Back"
        forwardLabel="Forward"
        pageOfLabel={(page, count) => `Page ${page} of ${count}`}
      />
    )

    expect(screen.getByRole('button', { name: /Back/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Forward/ })).toBeInTheDocument()
    expect(screen.getByText('Page 3 of 12')).toBeInTheDocument()
    expect(screen.queryByText(/Zurück/)).not.toBeInTheDocument()
  })

  /* Der Schluessel je Schaltflaeche haengt nicht mehr an der Beschriftung: zwei gleiche
     Beschriftungen wuerden sonst denselben React-Schluessel tragen. */
  it('rendert beide Randschaltflaechen auch bei gleicher Beschriftung', () => {
    render(
      <Pagination
        page={3}
        pageCount={12}
        showFirstLast
        onPageChange={() => {}}
        firstLabel="Rand"
        lastLabel="Rand"
      />
    )

    expect(screen.getAllByRole('button', { name: 'Rand' })).toHaveLength(2)
  })
})
