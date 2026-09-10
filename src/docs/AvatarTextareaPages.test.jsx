import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import '../i18n'

import AvatarPage from '../pages/AvatarPage'
import TextareaPage from '../pages/TextareaPage'
import DataTablePage from '../pages/DataTablePage'

const draw = (Page) => render(<MemoryRouter><Page /></MemoryRouter>).container

/* Read through the DOM rather than through roles: the avatar is aria-hidden
   wherever a name stands beside it, which is the normal case on these pages. */
const avatars = (root) => Array.from(root.querySelectorAll('.medo-av'))
const scheme = (el) =>
  Array.from(el.classList)
    .filter((name) => name.startsWith('medo-av--'))
    .map((name) => name.replace('medo-av--', ''))
    .find((name) => name !== 'sm' && name !== 'md' && name !== 'lg')

/* The name sits two levels below the row, next to the address. Walking up to
   the first ancestor that holds an avatar lands on the row itself. */
const rowOf = (el) => {
  let node = el
  while (node && !node.querySelector('.medo-av')) node = node.parentElement
  return node
}
const leaves = (root, text) =>
  Array.from(root.querySelectorAll('div')).filter(
    (el) => el.children.length === 0 && el.textContent === text,
  )

describe('Avatar page', () => {
  /* The decisive property of the component: the colour is a stored value of the
     person, handed in by the caller. The page shows the same four people twice
     — in the table with their own scheme, in the list all in teal. A colour
     derived from the name could not differ between the two. */
  it('gives the same person different schemes in the table and in the list', () => {
    const container = draw(AvatarPage)

    const schemes = leaves(container, 'Peter Zeider')
      .map((leaf) => rowOf(leaf))
      .filter(Boolean)
      .map((row) => scheme(row.querySelector('.medo-av')))

    expect(schemes).toContain('amber')
    expect(schemes).toContain('teal')
  })

  /* The fifteen schemes of the contract, each shown once in the overview. */
  it('shows all fifteen colour schemes', () => {
    const container = draw(AvatarPage)
    const shown = new Set(avatars(container).map(scheme))

    for (const name of [
      'red', 'crimson', 'rose', 'orange', 'amber', 'yellow', 'green', 'teal',
      'cyan', 'blue', 'indigo', 'violet', 'purple', 'grey', 'stone',
    ]) {
      expect(shown).toContain(name)
    }
  })

  /* The accepted shortfall is named on the page, with the figure, rather than
     left out. */
  it('names the dark-mode shortfall with its figure', () => {
    const container = draw(AvatarPage)

    /* Only the open tab is rendered, so the accessibility tab is opened first. */
    fireEvent.click(screen.getByRole('tab', { name: /Accessibility/ }))

    expect(container.textContent).toContain('2,72:1')
  })
})

describe('Textarea page', () => {
  /* The contract carries neither a size nor a resize prop; the panel must not
     offer one. Scoped to the control bar — the overview carries a section
     called "Eine Größe", and that heading is not a control. */
  it('offers neither a size nor a resize control', () => {
    const container = draw(TextareaPage)
    const controls = container.querySelector('[role="group"][aria-label="Steuerung"]')

    expect(controls).not.toBeNull()
    expect(controls.textContent).not.toMatch(/größe|resize|ziehen/i)
  })

  it('renders textareas without a size attribute', () => {
    const container = draw(TextareaPage)

    expect(container.querySelectorAll('textarea').length).toBeGreaterThan(0)
    expect(container.querySelectorAll('textarea[size]')).toHaveLength(0)
  })
})

describe('Data table page', () => {
  /* The person table of the specification page, with the avatar in the name
     cell. Six people, six schemes taken from their own data. */
  it('carries one avatar per person row in the person table', () => {
    const container = draw(DataTablePage)
    const table = container.querySelector('table[aria-label="Team"]')

    expect(table).not.toBeNull()

    const rows = within(table).getAllByRole('row').slice(1)
    expect(rows).toHaveLength(6)
    expect(rows.every((row) => row.querySelectorAll('.medo-av').length === 1)).toBe(true)

    const schemes = rows.map((row) => scheme(row.querySelector('.medo-av')))
    expect(new Set(schemes).size).toBe(6)
  })
})
