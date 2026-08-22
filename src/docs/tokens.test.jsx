import { render, screen, act } from '@testing-library/react'
import { useTokenValues } from './tokens'

/* The token values are read out of the DOM once and memoised. A themed token
   resolves differently per theme, so the read has to happen again when the
   theme changes — jsdom resolves nothing on its own, so the changed value is
   written in alongside the switch to stand in for what the browser does. */
function Probe({ names }) {
  const values = useTokenValues(names)
  return (
    <ul>
      {names.map((name) => (
        <li key={name} data-testid={name}>
          {values[name]}
        </li>
      ))}
    </ul>
  )
}

const root = () => document.documentElement
const shown = (name) => screen.getByTestId(name).textContent
const setToken = (name, value) => root().style.setProperty(name, value)

let systemDark = false
let listeners = new Set()

beforeAll(() => {
  window.matchMedia = (query) => ({
    get matches() {
      return systemDark
    },
    media: query,
    addEventListener: (_event, fn) => listeners.add(fn),
    removeEventListener: (_event, fn) => listeners.delete(fn),
  })
})

beforeEach(() => {
  systemDark = false
  listeners = new Set()
  root().removeAttribute('data-theme')
  root().style.cssText = ''
})

function setSystemDark(next) {
  systemDark = next
  listeners.forEach((fn) => fn({ matches: next }))
}

describe('useTokenValues', () => {
  it('reads the value of every requested token', () => {
    setToken('--medo-surface', '#ffffff')
    setToken('--medo-space-md', '16px')

    render(<Probe names={['--medo-surface', '--medo-space-md']} />)

    expect(shown('--medo-surface')).toBe('#ffffff')
    expect(shown('--medo-space-md')).toBe('16px')
  })

  it('reads again when the theme is switched by hand', async () => {
    setToken('--medo-surface', '#ffffff')
    root().dataset.theme = 'light'

    render(<Probe names={['--medo-surface']} />)
    expect(shown('--medo-surface')).toBe('#ffffff')

    // The attribute observer reports in a microtask, so the flush is awaited.
    await act(async () => {
      setToken('--medo-surface', '#24221e')
      root().dataset.theme = 'dark'
    })

    expect(shown('--medo-surface')).toBe('#24221e')
  })

  it('reads again when the system setting changes and no theme is forced', () => {
    setToken('--medo-surface', '#ffffff')

    render(<Probe names={['--medo-surface']} />)
    expect(shown('--medo-surface')).toBe('#ffffff')

    act(() => {
      setToken('--medo-surface', '#24221e')
      setSystemDark(true)
    })

    expect(shown('--medo-surface')).toBe('#24221e')
  })

  it('ignores the system setting once a theme is forced', () => {
    setToken('--medo-surface', '#ffffff')
    root().dataset.theme = 'light'

    render(<Probe names={['--medo-surface']} />)

    act(() => {
      setToken('--medo-surface', '#24221e')
      setSystemDark(true)
    })

    expect(shown('--medo-surface')).toBe('#ffffff')
  })
})
