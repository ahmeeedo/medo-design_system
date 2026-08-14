import { fireEvent, render, screen, within } from '@testing-library/react'
import { DataTable } from './DataTable'

/* Sortierung, Auswahl und Bulk-Leiste sind Eigenlogik der Komponente — ungesteuert
   sortiert und wählt sie selbst, gesteuert meldet sie nur. Beide Wege sind hier belegt. */

const columns = [
  { key: 'nr', label: 'Nummer', numeric: true, sortable: true },
  { key: 'kunde', label: 'Kunde', sortable: true },
]

const rows = [
  { nr: 3, kunde: 'Meier' },
  { nr: 1, kunde: 'Zimmermann' },
  { nr: 2, kunde: 'Albrecht' },
]

/* Erste Datenspalte je Zeile, Kopfzeile ausgenommen. Bei selectable steht die
   Auswahlzelle davor, deshalb wird über den Spaltenindex gelesen. */
const order = (offset = 0) =>
  screen
    .getAllByRole('row')
    .slice(1)
    .map((r) => within(r).getAllByRole('cell')[offset].textContent)

describe('DataTable · Sortierung', () => {
  it('sortiert ungesteuert beim Klick auf den Spaltenkopf', () => {
    render(<DataTable columns={columns} rows={rows} rowKey="nr" />)
    expect(order()).toEqual(['3', '1', '2'])

    fireEvent.click(screen.getByRole('button', { name: 'Nummer' }))
    expect(order()).toEqual(['1', '2', '3'])
  })

  it('dreht die Richtung beim zweiten Klick um', () => {
    render(<DataTable columns={columns} rows={rows} rowKey="nr" />)
    const head = screen.getByRole('button', { name: 'Nummer' })

    fireEvent.click(head)
    fireEvent.click(head)
    expect(order()).toEqual(['3', '2', '1'])
  })

  it('sortiert Text nach deutscher Locale', () => {
    render(<DataTable columns={columns} rows={rows} rowKey="nr" />)

    fireEvent.click(screen.getByRole('button', { name: 'Kunde' }))
    expect(order(1)).toEqual(['Albrecht', 'Meier', 'Zimmermann'])
  })

  it('meldet den Spaltenkopf über aria-sort', () => {
    render(<DataTable columns={columns} rows={rows} rowKey="nr" />)
    const head = screen.getByRole('columnheader', { name: 'Nummer' })
    expect(head).toHaveAttribute('aria-sort', 'none')

    fireEvent.click(screen.getByRole('button', { name: 'Nummer' }))
    expect(head).toHaveAttribute('aria-sort', 'ascending')
  })

  /* Gesteuert: der Aufrufer sortiert (z.B. serverseitig), die Komponente rührt
     die Reihenfolge nicht an und meldet nur den Wunsch. */
  it('sortiert gesteuert nicht selbst, sondern meldet nur', () => {
    const onSortChange = vi.fn()
    render(
      <DataTable columns={columns} rows={rows} rowKey="nr" sort={null} onSortChange={onSortChange} />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Nummer' }))
    expect(onSortChange).toHaveBeenCalledWith({ key: 'nr', direction: 'asc' })
    expect(order()).toEqual(['3', '1', '2'])
  })
})

describe('DataTable · Auswahl', () => {
  it('wählt eine einzelne Zeile', () => {
    const onSelectionChange = vi.fn()
    render(<DataTable columns={columns} rows={rows} rowKey="nr" selectable onSelectionChange={onSelectionChange} />)

    fireEvent.click(screen.getAllByRole('button', { name: 'Zeile auswählen' })[0])
    expect(onSelectionChange).toHaveBeenCalledWith([3])
    expect(screen.getAllByRole('row')[1]).toHaveAttribute('aria-selected', 'true')
  })

  it('wählt alle Zeilen über den Kopf und hebt sie wieder auf', () => {
    render(<DataTable columns={columns} rows={rows} rowKey="nr" selectable />)

    fireEvent.click(screen.getByRole('button', { name: 'Alle auswählen' }))
    expect(screen.getAllByRole('row').slice(1).every((r) => r.getAttribute('aria-selected') === 'true')).toBe(true)

    const head = screen.getAllByRole('row')[0]
    fireEvent.click(within(head).getByRole('button', { name: 'Auswahl aufheben' }))
    expect(screen.getAllByRole('row').slice(1).every((r) => r.getAttribute('aria-selected') === 'false')).toBe(true)
  })

  it('schaltet die Kopfleiste auf die Bulk-Leiste um', () => {
    render(
      <DataTable
        columns={columns}
        rows={rows}
        rowKey="nr"
        selectable
        title="Verträge"
        toolbar={<button type="button">Filtern</button>}
        bulkActions={<button type="button">Exportieren</button>}
      />
    )

    expect(screen.getByText('Verträge')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Filtern' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Exportieren' })).not.toBeInTheDocument()

    fireEvent.click(screen.getAllByRole('button', { name: 'Zeile auswählen' })[0])

    expect(screen.getByText('1 ausgewählt')).toBeInTheDocument()
    expect(screen.queryByText('Verträge')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Exportieren' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Filtern' })).not.toBeInTheDocument()
  })
})

describe('DataTable · Zeilen und Zustände', () => {
  it('meldet den Klick auf eine Zeile mit Datensatz und Position', () => {
    const onRowClick = vi.fn()
    render(<DataTable columns={columns} rows={rows} rowKey="nr" onRowClick={onRowClick} />)

    fireEvent.click(screen.getAllByRole('row')[2])
    expect(onRowClick).toHaveBeenCalledWith({ nr: 1, kunde: 'Zimmermann' }, 1)
  })

  /* Die Auswahlzelle stoppt das Ereignis — Anhaken darf die Zeile nicht öffnen. */
  it('löst beim Anhaken keinen Zeilenklick aus', () => {
    const onRowClick = vi.fn()
    render(<DataTable columns={columns} rows={rows} rowKey="nr" selectable onRowClick={onRowClick} />)

    fireEvent.click(screen.getAllByRole('button', { name: 'Zeile auswählen' })[0])
    expect(onRowClick).not.toHaveBeenCalled()
  })

  it('zeigt den Leerzustand statt einer leeren Tabelle', () => {
    render(<DataTable columns={columns} rows={[]} emptyText="Keine Verträge gefunden." />)
    expect(screen.getByText('Keine Verträge gefunden.')).toBeInTheDocument()
  })

  it('zeigt bei loading die angeforderte Zahl Skeleton-Zeilen', () => {
    const { container } = render(<DataTable columns={columns} rows={rows} rowKey="nr" loading loadingRows={3} />)

    expect(screen.getAllByRole('row')).toHaveLength(4)
    expect(container.querySelectorAll('[class~="medo-dt__sk"]')).toHaveLength(6)
    expect(screen.queryByText('Meier')).not.toBeInTheDocument()
  })
})

/* Nachweis der übrigen in DataTable.d.ts deklarierten Props. */
describe('DataTable · Props', () => {
  it('trägt die Größe als Klasse', () => {
    const { container } = render(<DataTable columns={columns} rows={rows} rowKey="nr" size="sm" />)
    expect(container.querySelector('table')).toHaveClass('medo-dt--sm')
  })

  it('nimmt rowKey auch als Funktion', () => {
    const onSelectionChange = vi.fn()
    render(
      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(r) => 'v-' + r.nr}
        selectable
        onSelectionChange={onSelectionChange}
      />
    )

    fireEvent.click(screen.getAllByRole('button', { name: 'Zeile auswählen' })[0])
    expect(onSelectionChange).toHaveBeenCalledWith(['v-3'])
  })

  it('lässt die Auswahl gesteuert beim Aufrufer', () => {
    const onSelectionChange = vi.fn()
    render(
      <DataTable
        columns={columns}
        rows={rows}
        rowKey="nr"
        selectable
        selected={[1]}
        onSelectionChange={onSelectionChange}
      />
    )

    expect(screen.getAllByRole('row')[2]).toHaveAttribute('aria-selected', 'true')

    fireEvent.click(screen.getAllByRole('button', { name: 'Zeile auswählen' })[0])
    expect(onSelectionChange).toHaveBeenCalledWith([1, 3])
    expect(screen.getAllByRole('row')[1]).toHaveAttribute('aria-selected', 'false')
  })

  it('übernimmt defaultSort als Anfangszustand', () => {
    render(<DataTable columns={columns} rows={rows} rowKey="nr" defaultSort={{ key: 'nr', direction: 'desc' }} />)
    expect(order()).toEqual(['3', '2', '1'])
  })

  it('begrenzt die Höhe und lässt den Kopf haften', () => {
    const { container } = render(<DataTable columns={columns} rows={rows} rowKey="nr" maxHeight={220} />)
    expect(container.querySelector('[class~="medo-dt__scroll"]')).toHaveStyle({
      maxHeight: '220px',
      overflowY: 'auto',
    })
  })

  it('rendert den Fuß und benennt die Tabelle', () => {
    render(
      <DataTable
        columns={columns}
        rows={rows}
        rowKey="nr"
        ariaLabel="Verträge"
        footer={<span>1–3 von 312</span>}
      />
    )

    expect(screen.getByRole('table', { name: 'Verträge' })).toBeInTheDocument()
    expect(screen.getByText('1–3 von 312')).toBeInTheDocument()
  })

  it('setzt Ausrichtung, Mono-Spalte, Nebenangabe und Breite je Spalte', () => {
    const spalten = [
      { key: 'nr', label: 'Nummer', numeric: true, width: 130 },
      { key: 'kunde', label: 'Kunde', muted: true },
      { key: 'status', label: 'Status', align: 'center' },
      { key: 'beitrag', label: 'Beitrag', align: 'right' },
    ]
    render(<DataTable columns={spalten} rows={[{ nr: 1, kunde: 'Meier', status: 'Aktiv', beitrag: '10,00 €' }]} rowKey="nr" />)

    const cells = within(screen.getAllByRole('row')[1]).getAllByRole('cell')
    expect(cells[0]).toHaveClass('medo-dt__cell--num')
    expect(cells[1]).toHaveClass('medo-dt__cell--muted')
    expect(cells[2]).toHaveClass('medo-dt__cell--center')
    expect(cells[3]).toHaveClass('medo-dt__cell--num')
    expect(screen.getByRole('columnheader', { name: 'Nummer' })).toHaveStyle({ width: '130px' })
  })

  it('übergibt Wert, Datensatz und Position an render', () => {
    const render_ = vi.fn((v) => <em>{v}</em>)
    render(
      <DataTable
        columns={[{ key: 'kunde', label: 'Kunde', render: render_ }]}
        rows={[{ kunde: 'Meier' }]}
      />
    )

    expect(render_).toHaveBeenCalledWith('Meier', { kunde: 'Meier' }, 0)
    expect(screen.getByText('Meier').tagName).toBe('EM')
  })

  it('reicht className und style an die Hülle durch', () => {
    const { container } = render(
      <DataTable columns={columns} rows={rows} rowKey="nr" className="eigen" style={{ maxWidth: '640px' }} />
    )
    const wrap = container.querySelector('[class~="medo-dt__wrap"]')
    expect(wrap).toHaveClass('eigen')
    expect(wrap).toHaveStyle({ maxWidth: '640px' })
  })
})
