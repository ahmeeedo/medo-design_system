import { render, screen, fireEvent, act, within } from '@testing-library/react'
import App from './App'
import { toast } from './components'
import { installDomStubs } from '../scripts/buildSearchIndex'
import './i18n'

/* The toast host is mounted once in App, so toast() has to work from every
   route. Two unrelated routes stand in for "anywhere". */
const ROUTES = ['/button', '/notification']

function renderAt(path) {
  window.history.pushState({}, '', path)
  return render(<App />)
}

const toastRegion = () => screen.getByRole('region', { name: 'Benachrichtigungen' })

beforeAll(() => {
  installDomStubs()
  // jsdom has no scroll implementation; App scrolls to top on every route change.
  window.scrollTo = () => {}
})

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('global toast host', () => {
  it.each(ROUTES)('shows a toast raised from %s', (path) => {
    renderAt(path)

    act(() => {
      toast({ kind: 'success', title: 'Termin gespeichert' })
    })

    expect(within(toastRegion()).getByText('Termin gespeichert')).toBeInTheDocument()
  })

  it.each(ROUTES)('hides the toast again once the duration is up on %s', (path) => {
    renderAt(path)

    act(() => {
      toast({ kind: 'success', title: 'Termin gespeichert', duration: 5000 })
    })
    expect(within(toastRegion()).getByText('Termin gespeichert')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(within(toastRegion()).queryByText('Termin gespeichert')).not.toBeInTheDocument()
  })

  it.each(ROUTES)('closes a toast on demand on %s', (path) => {
    renderAt(path)

    act(() => {
      toast({ kind: 'error', title: 'Speichern fehlgeschlagen' })
    })
    const region = toastRegion()
    expect(within(region).getByText('Speichern fehlgeschlagen')).toBeInTheDocument()

    fireEvent.click(within(region).getByRole('button', { name: 'Schließen' }))

    expect(within(region).queryByText('Speichern fehlgeschlagen')).not.toBeInTheDocument()
  })

  it('mounts exactly one host, so a toast is never rendered twice', () => {
    // The notification page used to carry a second host of its own.
    renderAt('/notification')

    expect(screen.getAllByRole('region', { name: 'Benachrichtigungen' })).toHaveLength(1)

    act(() => {
      toast({ kind: 'success', title: 'Termin gespeichert' })
    })

    // Scoped to the region: the page shows the same wording in its own demos.
    expect(within(toastRegion()).getAllByText('Termin gespeichert')).toHaveLength(1)
  })

  it('keeps an error toast standing until it is closed', () => {
    renderAt('/button')

    act(() => {
      toast({ kind: 'error', title: 'Speichern fehlgeschlagen' })
    })

    act(() => {
      vi.advanceTimersByTime(30_000)
    })
    expect(within(toastRegion()).getByText('Speichern fehlgeschlagen')).toBeInTheDocument()
  })
})
