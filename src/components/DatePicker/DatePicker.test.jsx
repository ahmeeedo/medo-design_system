import { fireEvent, render, screen } from '@testing-library/react'
import { DatePicker, TimeSlots } from './DatePicker'

/* Der Kalender ankert ohne Wert auf „heute", deshalb steht die Systemzeit fest —
   sonst wandert das gezeigte Monatsraster mit dem Testlauf.
   Tage werden über ihr aria-label angesprochen („4. August 2026"). */

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(2026, 7, 4, 10, 0, 0))
})
afterEach(() => {
  vi.useRealTimers()
})

const openField = () => fireEvent.click(screen.getByRole('button', { name: /Datum wählen|\d{2}\.\d{2}\.\d{4}/ }))

describe('DatePicker · Einzeldatum', () => {
  it('öffnet den Kalender über das Feld', () => {
    render(<DatePicker label="Vertragsbeginn" />)
    const field = screen.getByLabelText('Vertragsbeginn')
    expect(field).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('dialog', { name: 'Kalender' })).not.toBeInTheDocument()

    fireEvent.click(field)
    expect(field).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('dialog', { name: 'Kalender' })).toBeInTheDocument()
  })

  it('wählt ein Datum, meldet es und schließt den Kalender', () => {
    const onChange = vi.fn()
    render(<DatePicker onChange={onChange} />)

    openField()
    fireEvent.click(screen.getByRole('button', { name: '12. August 2026' }))

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0].getTime()).toBe(new Date(2026, 7, 12).getTime())
    expect(screen.queryByRole('dialog', { name: 'Kalender' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /12\.08\.2026/ })).toBeInTheDocument()
  })

  it('setzt das Feld über das Kreuz zurück', () => {
    const onChange = vi.fn()
    render(<DatePicker defaultValue={new Date(2026, 7, 4)} onChange={onChange} />)

    fireEvent.click(screen.getByRole('button', { name: 'Datum zurücksetzen' }))
    expect(onChange).toHaveBeenCalledWith(null)
    expect(screen.getByText('Datum wählen')).toBeInTheDocument()
  })

  it('bietet ohne clearable kein Zurücksetzen an', () => {
    render(<DatePicker defaultValue={new Date(2026, 7, 4)} clearable={false} />)
    expect(screen.queryByRole('button', { name: 'Datum zurücksetzen' })).not.toBeInTheDocument()
  })

  it('verbindet Beschriftung und Feld über eine stabile ID', () => {
    const { rerender } = render(<DatePicker label="Vertragsbeginn" />)
    const field = screen.getByLabelText(/Vertragsbeginn/)
    const first = field.id

    expect(first).toBeTruthy()
    rerender(<DatePicker label="Vertragsbeginn" helper="TT.MM.JJJJ" />)
    expect(screen.getByLabelText(/Vertragsbeginn/).id).toBe(first)
  })

  it('deaktiviert Tage außerhalb von min und max', () => {
    render(<DatePicker min={new Date(2026, 7, 10)} max={new Date(2026, 7, 20)} />)

    openField()
    expect(screen.getByRole('button', { name: '9. August 2026' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '10. August 2026' })).toBeEnabled()
    expect(screen.getByRole('button', { name: '21. August 2026' })).toBeDisabled()
  })
})

describe('DatePicker · Zeitraum', () => {
  const renderRange = (props = {}) => render(<DatePicker mode="range" inline {...props} />)

  it('setzt beim ersten Klick den Start und beim zweiten das Ende', () => {
    const onChange = vi.fn()
    renderRange({ onChange })

    fireEvent.click(screen.getByRole('button', { name: '4. August 2026' }))
    expect(onChange.mock.calls[0][0].start.getTime()).toBe(new Date(2026, 7, 4).getTime())
    expect(onChange.mock.calls[0][0].end).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: '8. August 2026' }))
    expect(onChange.mock.calls[1][0].end.getTime()).toBe(new Date(2026, 7, 8).getTime())

    expect(screen.getByText('04.08.2026 – 08.08.2026')).toBeInTheDocument()
    expect(screen.getByText('5 Tage')).toBeInTheDocument()
  })

  it('dreht den Zeitraum um, wenn der zweite Klick davor liegt', () => {
    renderRange()

    fireEvent.click(screen.getByRole('button', { name: '20. August 2026' }))
    fireEvent.click(screen.getByRole('button', { name: '11. August 2026' }))

    expect(screen.getByText('11.08.2026 – 20.08.2026')).toBeInTheDocument()
  })

  it('beginnt nach einem vollständigen Zeitraum von vorn', () => {
    renderRange()

    fireEvent.click(screen.getByRole('button', { name: '4. August 2026' }))
    fireEvent.click(screen.getByRole('button', { name: '8. August 2026' }))
    fireEvent.click(screen.getByRole('button', { name: '18. August 2026' }))

    expect(screen.getByText('18.08.2026 – …')).toBeInTheDocument()
  })

  it('zeigt ohne Auswahl den leeren Zusammenfassungstext', () => {
    renderRange()
    expect(screen.getByText('Kein Zeitraum')).toBeInTheDocument()
  })
})

describe('DatePicker · Schnellauswahl und Zurücksetzen', () => {
  const presets = [
    { label: 'Diese Woche', value: () => ({ start: new Date(2026, 7, 3), end: new Date(2026, 7, 9) }) },
    { label: 'Letzte 30 Tage', value: () => ({ start: new Date(2026, 6, 6), end: new Date(2026, 7, 4) }) },
  ]

  it('übernimmt einen Zeitraum über die Schnellauswahl', () => {
    const onChange = vi.fn()
    render(<DatePicker mode="range" inline presets={presets} onChange={onChange} />)

    fireEvent.click(screen.getByRole('button', { name: 'Diese Woche' }))

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(screen.getByText('03.08.2026 – 09.08.2026')).toBeInTheDocument()
    expect(screen.getByText('7 Tage')).toBeInTheDocument()
  })

  it('zeigt Zurücksetzen erst nach einer Auswahl und leert sie', () => {
    render(<DatePicker mode="range" inline presets={presets} />)
    expect(screen.queryByRole('button', { name: 'Zurücksetzen' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Letzte 30 Tage' }))
    fireEvent.click(screen.getByRole('button', { name: 'Zurücksetzen' }))

    expect(screen.getByText('Kein Zeitraum')).toBeInTheDocument()
  })
})

describe('DatePicker · Schließen und Navigation', () => {
  it('schließt über Escape', () => {
    render(<DatePicker />)
    openField()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog', { name: 'Kalender' })).not.toBeInTheDocument()
  })

  it('schließt beim Klick außerhalb', () => {
    render(<DatePicker />)
    openField()

    fireEvent.mouseDown(document.body)
    expect(screen.queryByRole('dialog', { name: 'Kalender' })).not.toBeInTheDocument()
  })

  it('bleibt beim Klick im Kalender offen', () => {
    render(<DatePicker mode="range" />)
    openField()

    fireEvent.mouseDown(screen.getByRole('dialog', { name: 'Kalender' }))
    expect(screen.getByRole('dialog', { name: 'Kalender' })).toBeInTheDocument()
  })

  it('blättert den Monat vor und zurück', () => {
    render(<DatePicker inline />)
    expect(screen.getByRole('button', { name: 'Monat und Jahr wählen' })).toHaveTextContent('August 2026')

    fireEvent.click(screen.getByRole('button', { name: 'Nächster Monat' }))
    expect(screen.getByRole('button', { name: 'Monat und Jahr wählen' })).toHaveTextContent('September 2026')

    fireEvent.click(screen.getByRole('button', { name: 'Vorheriger Monat' }))
    fireEvent.click(screen.getByRole('button', { name: 'Vorheriger Monat' }))
    expect(screen.getByRole('button', { name: 'Monat und Jahr wählen' })).toHaveTextContent('Juli 2026')
  })

  it('springt über die Monats- und Jahreswahl in ein anderes Jahr', () => {
    render(<DatePicker inline />)

    fireEvent.click(screen.getByRole('button', { name: 'Monat und Jahr wählen' }))
    fireEvent.click(screen.getByRole('button', { name: 'Nächstes Jahr' }))
    fireEvent.click(screen.getByRole('button', { name: 'Mär' }))

    expect(screen.getByRole('button', { name: 'Monat und Jahr wählen' })).toHaveTextContent('März 2027')
  })
})

describe('TimeSlots', () => {
  const slots = ['09:00', '09:30', { time: '10:00', disabled: true }, '10:30']

  it('meldet die gewählte Uhrzeit', () => {
    const onChange = vi.fn()
    render(<TimeSlots slots={slots} onChange={onChange} />)

    fireEvent.click(screen.getByRole('button', { name: '09:30' }))
    expect(onChange).toHaveBeenCalledWith('09:30')
  })

  it('zeigt belegte Zeiten deaktiviert statt ausgeblendet', () => {
    render(<TimeSlots slots={slots} />)
    expect(screen.getByRole('button', { name: '10:00' })).toBeDisabled()
  })

  it('markiert die aktive Zeit über aria-pressed', () => {
    render(<TimeSlots slots={slots} value="10:30" />)
    expect(screen.getByRole('button', { name: '10:30' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: '09:00' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('setzt Spaltenzahl und Benennung der Gruppe', () => {
    render(<TimeSlots slots={slots} columns={4} ariaLabel="Termin am 04.08.2026" />)
    const group = screen.getByRole('group', { name: 'Termin am 04.08.2026' })
    expect(group).toHaveStyle({ gridTemplateColumns: 'repeat(4, 1fr)' })
  })
})

/* Nachweis der übrigen in DatePicker.d.ts deklarierten Props. */
describe('DatePicker · Props', () => {
  it('bleibt gesteuert am Wert des Aufrufers', () => {
    const onChange = vi.fn()
    const { rerender } = render(<DatePicker value={new Date(2026, 7, 4)} onChange={onChange} />)
    expect(screen.getByText('04.08.2026')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /04\.08\.2026/ }))
    fireEvent.click(screen.getByRole('button', { name: '12. August 2026' }))

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(screen.getByText('04.08.2026')).toBeInTheDocument()

    rerender(<DatePicker value={new Date(2026, 7, 12)} onChange={onChange} />)
    expect(screen.getByText('12.08.2026')).toBeInTheDocument()
  })

  it('verbindet den Hinweis über aria-describedby', () => {
    render(<DatePicker label="Vertragsbeginn" helper="Format TT.MM.JJJJ." />)
    const field = screen.getByLabelText('Vertragsbeginn')

    expect(field).toHaveAccessibleDescription('Format TT.MM.JJJJ.')
    expect(field).not.toHaveAttribute('aria-invalid')
  })

  it('ersetzt den Hinweis im Fehlerfall und meldet aria-invalid', () => {
    render(<DatePicker label="Vertragsbeginn" helper="Format TT.MM.JJJJ." error="Das Datum liegt zu früh." />)
    const field = screen.getByLabelText('Vertragsbeginn')

    expect(field).toHaveAttribute('aria-invalid', 'true')
    expect(field).toHaveAccessibleDescription('Das Datum liegt zu früh.')
    expect(screen.queryByText('Format TT.MM.JJJJ.')).not.toBeInTheDocument()
  })

  it('zeigt den eigenen Platzhalter', () => {
    render(<DatePicker placeholder="Zeitraum wählen" />)
    expect(screen.getByText('Zeitraum wählen')).toBeInTheDocument()
  })

  it('kennzeichnet ein Pflichtfeld', () => {
    render(<DatePicker label="Vertragsbeginn" required />)
    expect(screen.getByText('Vertragsbeginn').textContent).toContain('*')
  })

  it('sperrt das Feld, wenn es deaktiviert ist', () => {
    render(<DatePicker label="Vertragsbeginn" defaultValue={new Date(2026, 7, 4)} disabled />)

    const field = screen.getByLabelText('Vertragsbeginn')
    expect(field).toBeDisabled()
    expect(screen.queryByRole('button', { name: 'Datum zurücksetzen' })).not.toBeInTheDocument()

    fireEvent.click(field)
    expect(screen.queryByRole('dialog', { name: 'Kalender' })).not.toBeInTheDocument()
  })

  it('nimmt über fullWidth die ganze Breite ein', () => {
    const { container } = render(<DatePicker fullWidth />)
    expect(container.querySelector('[class~="medo-dp"]')).toHaveClass('medo-dp--full')
  })

  it('übernimmt eine eigene Überschrift der Zusammenfassung', () => {
    render(<DatePicker mode="range" inline summaryLabel="Abrechnungszeitraum" />)
    expect(screen.getByText('Abrechnungszeitraum')).toBeInTheDocument()
  })

  it('nimmt eine vorgegebene ID vor der erzeugten', () => {
    render(<DatePicker label="Vertragsbeginn" id="vertragsbeginn" />)
    expect(screen.getByLabelText('Vertragsbeginn')).toHaveAttribute('id', 'vertragsbeginn')
  })

  it('reicht className und style an die Hülle durch', () => {
    const { container } = render(<DatePicker className="eigen" style={{ maxWidth: '320px' }} />)
    const root = container.querySelector('[class~="medo-dp"]')
    expect(root).toHaveClass('eigen')
    expect(root).toHaveStyle({ maxWidth: '320px' })
  })
})
