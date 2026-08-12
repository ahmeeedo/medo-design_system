import { act, fireEvent, render, screen } from '@testing-library/react'
import { CodeSnippet } from './CodeSnippet'

/* Template: a timer that resets a transient state.
   jsdom has no navigator.clipboard, so the component takes its synchronous
   fallback path — which is exactly what makes the timing deterministic here. */

const advance = (ms) => act(() => { vi.advanceTimersByTime(ms) })

describe('CodeSnippet · Kopier-Zustand', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('meldet den Text an onCopy und zeigt den Kopiert-Zustand', () => {
    const onCopy = vi.fn()
    render(<CodeSnippet code="npm install medo" onCopy={onCopy} />)

    fireEvent.click(screen.getByRole('button', { name: /Kopieren/ }))

    expect(onCopy).toHaveBeenCalledWith('npm install medo')
    expect(screen.getByRole('button', { name: /Kopiert!/ })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Kopiert!')
  })

  it('springt nach 1,5 Sekunden zurück', () => {
    render(<CodeSnippet code="npm install medo" />)

    fireEvent.click(screen.getByRole('button', { name: /Kopieren/ }))

    advance(1499)
    expect(screen.getByRole('button', { name: /Kopiert!/ })).toBeInTheDocument()

    advance(1)
    expect(screen.getByRole('button', { name: /Kopieren/ })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('')
  })

  it('setzt den Zeitgeber bei erneutem Kopieren neu auf', () => {
    render(<CodeSnippet code="npm install medo" />)
    const button = () => screen.getByRole('button', { name: /Kopie/ })

    fireEvent.click(button())
    advance(1000)
    fireEvent.click(button())

    /* Without the reset the state would fall back 500 ms from here. */
    advance(1000)
    expect(screen.getByRole('button', { name: /Kopiert!/ })).toBeInTheDocument()

    advance(500)
    expect(screen.getByRole('button', { name: /Kopieren/ })).toBeInTheDocument()
  })
})
