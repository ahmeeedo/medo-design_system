import { act, fireEvent, render, screen } from '@testing-library/react'
import { NumberInput } from './NumberInput'

/* Template: timers and repeat-on-hold.
   Timer tests use fireEvent, not userEvent: userEvent awaits its own promises
   against the clock, and with fake timers installed that clock never moves on
   its own — the test would hang instead of failing. fireEvent is synchronous
   and leaves the clock entirely to the test.

   The regression this pins down: `bump` runs repeatedly out of one timer
   without a render in between. Reading the render value instead of the ref
   would make every repetition compute the same result — holding the button
   would count exactly once. */

const lastValue = (onChange) => onChange.mock.lastCall[0].target.value

/* Timers fire inside act() so React flushes the resulting state updates. */
const advance = (ms) => act(() => { vi.advanceTimersByTime(ms) })

describe('NumberInput · Zeitgeber', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('zählt beim Gedrückt-Halten fortlaufend weiter', () => {
    const onChange = vi.fn()
    render(<NumberInput label="Menge" defaultValue={0} onChange={onChange} />)
    const up = screen.getByRole('button', { name: 'Erhöhen' })

    fireEvent.mouseDown(up)
    expect(lastValue(onChange)).toBe('1')

    /* 400 ms until the repeat starts, then every 80 ms. */
    advance(400)
    expect(lastValue(onChange)).toBe('2')

    advance(80 * 3)
    expect(lastValue(onChange)).toBe('5')

    fireEvent.mouseUp(up)
    const callsAfterRelease = onChange.mock.calls.length
    advance(800)
    expect(onChange).toHaveBeenCalledTimes(callsAfterRelease)
  })

  it('hört am Grenzwert auf zu feuern, während gehalten wird', () => {
    const onChange = vi.fn()
    render(<NumberInput label="Menge" defaultValue={2} max={3} onChange={onChange} />)
    const up = screen.getByRole('button', { name: 'Erhöhen' })

    fireEvent.mouseDown(up)
    advance(400 + 80 * 5)
    fireEvent.mouseUp(up)

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(lastValue(onChange)).toBe('3')
  })

  it('bricht das Wiederholen ab, wenn der Zeiger die Schaltfläche verlässt', () => {
    const onChange = vi.fn()
    render(<NumberInput label="Menge" defaultValue={0} onChange={onChange} />)
    const up = screen.getByRole('button', { name: 'Erhöhen' })

    fireEvent.mouseDown(up)
    fireEvent.mouseLeave(up)
    advance(1000)

    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('rechnet mit den Pfeiltasten in Schrittweiten', () => {
    const onChange = vi.fn()
    render(<NumberInput label="Dosis" defaultValue={1} step={0.5} onChange={onChange} />)
    const field = screen.getByLabelText('Dosis')

    fireEvent.keyDown(field, { key: 'ArrowUp' })
    expect(lastValue(onChange)).toBe('1.5')

    fireEvent.keyDown(field, { key: 'ArrowDown' })
    fireEvent.keyDown(field, { key: 'ArrowDown' })
    expect(lastValue(onChange)).toBe('0.5')
  })
})
