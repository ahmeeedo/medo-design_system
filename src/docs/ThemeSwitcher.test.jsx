import { render, screen, fireEvent, act } from '@testing-library/react'
import { ThemeSwitcher } from './ThemeSwitcher'
import '../i18n'

/* jsdom has no matchMedia. This stub reads `matches` through a getter so a
   runtime change reaches components that already hold the query object. */
function stubSystem(dark) {
  let matches = dark
  const listeners = new Set()
  window.matchMedia = (query) => ({
    get matches() {
      return matches
    },
    media: query,
    addEventListener: (_event, fn) => listeners.add(fn),
    removeEventListener: (_event, fn) => listeners.delete(fn),
  })
  return (next) => {
    matches = next
    listeners.forEach((fn) => fn({ matches: next }))
  }
}

const button = () => screen.getByRole('button', { name: 'Dunkles Theme' })
const attribute = () => document.documentElement.getAttribute('data-theme')

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
})

describe('ThemeSwitcher', () => {
  it('reports the system theme while no choice is remembered', () => {
    stubSystem(true)
    render(<ThemeSwitcher />)

    expect(button()).toHaveAttribute('aria-pressed', 'true')
    expect(attribute()).toBeNull()
  })

  it('takes a remembered choice over the system setting', () => {
    stubSystem(true)
    localStorage.setItem('medo-theme', 'light')
    render(<ThemeSwitcher />)

    expect(button()).toHaveAttribute('aria-pressed', 'false')
  })

  it('ignores a stored value that is not a theme', () => {
    stubSystem(true)
    localStorage.setItem('medo-theme', 'sepia')
    render(<ThemeSwitcher />)

    expect(button()).toHaveAttribute('aria-pressed', 'true')
  })

  it('writes the choice to the document and to storage', () => {
    stubSystem(false)
    render(<ThemeSwitcher />)

    fireEvent.click(button())

    expect(attribute()).toBe('dark')
    expect(localStorage.getItem('medo-theme')).toBe('dark')
    expect(button()).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(button())

    expect(attribute()).toBe('light')
    expect(localStorage.getItem('medo-theme')).toBe('light')
    expect(button()).toHaveAttribute('aria-pressed', 'false')
  })

  it('follows a system change at runtime while no choice is remembered', () => {
    const setSystem = stubSystem(false)
    render(<ThemeSwitcher />)
    expect(button()).toHaveAttribute('aria-pressed', 'false')

    act(() => setSystem(true))

    expect(button()).toHaveAttribute('aria-pressed', 'true')
    expect(attribute()).toBeNull()
  })

  it('stops following the system once a choice is made', () => {
    const setSystem = stubSystem(false)
    render(<ThemeSwitcher />)

    fireEvent.click(button())
    expect(button()).toHaveAttribute('aria-pressed', 'true')

    act(() => setSystem(false))

    expect(button()).toHaveAttribute('aria-pressed', 'true')
    expect(attribute()).toBe('dark')
  })

  it('is a native button that can take focus', () => {
    stubSystem(false)
    render(<ThemeSwitcher />)

    const el = button()
    expect(el.tagName).toBe('BUTTON')
    expect(el).not.toHaveAttribute('tabindex')

    el.focus()
    expect(el).toHaveFocus()
  })
})
