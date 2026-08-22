import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useState } from 'react'
import { DocsSearch } from './DocsSearch'
import '../i18n'

/* The overlay owns the trap, Escape and focus return; these cover the parts
   DocsSearch adds on top: where focus sits and that it stays visible. */
function Harness() {
  const [open, setOpen] = useState(false)
  return (
    <MemoryRouter>
      <button onClick={() => setOpen(true)}>Suche öffnen</button>
      <DocsSearch isOpen={open} onClose={() => setOpen(false)} />
    </MemoryRouter>
  )
}

const trigger = () => screen.getByRole('button', { name: 'Suche öffnen' })
const field = () => screen.getByRole('textbox')

/* The result rows are the only buttons in the dialog that stay in the tab
   order; the clear button carries tabindex="-1". */
const rows = () =>
  screen
    .getAllByRole('button')
    .filter((el) => el !== trigger() && el.getAttribute('tabindex') !== '-1')

function open() {
  render(<Harness />)
  // jsdom does not move focus on click the way a browser does.
  trigger().focus()
  fireEvent.click(trigger())
}

function search(term) {
  fireEvent.change(field(), { target: { value: term } })
}

describe('DocsSearch', () => {
  it('puts focus in the field when it opens', () => {
    open()
    expect(field()).toHaveFocus()
  })

  it('marks the field so focus stays visible', () => {
    open()
    // outline-none alone left the field with no focus indication at all.
    expect(field().className).toMatch(/focus-visible:ring-\[3px\]/)
    expect(field().className).toMatch(/focus-visible:ring-\[var\(--medo-focus-ring\)\]/)
  })

  it('walks the results with the arrow keys and comes back to the field', () => {
    open()
    search('Button')

    const found = rows()
    expect(found.length).toBeGreaterThan(0)

    fireEvent.keyDown(field(), { key: 'ArrowDown' })
    expect(found[0]).toHaveFocus()

    fireEvent.keyDown(found[0], { key: 'ArrowUp' })
    expect(field()).toHaveFocus()
  })

  it('stops at the last result instead of wrapping past it', () => {
    open()
    search('Button')

    const found = rows()
    for (let i = 0; i < found.length + 3; i += 1) {
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' })
    }

    expect(found[found.length - 1]).toHaveFocus()
  })

  it('closes on Escape and hands focus back to the trigger', () => {
    open()
    expect(field()).toHaveFocus()

    fireEvent.keyDown(document.activeElement, { key: 'Escape' })

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(trigger()).toHaveFocus()
  })
})
