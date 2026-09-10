import { cleanup, fireEvent, render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import i18n from '../i18n'
import { DocsLayout, NAV } from './DocsLayout'

const KEY = 'medo-sidebar-state'

const draw = () =>
  render(
    <MemoryRouter>
      <DocsLayout><div /></DocsLayout>
    </MemoryRouter>,
  ).container

/* The three group headings, in the order NAV declares them. */
const groups = (container) =>
  Array.from(container.querySelectorAll('nav button[aria-expanded]'))
const expanded = (container) =>
  groups(container).map((button) => button.getAttribute('aria-expanded') === 'true')

/* The route ids of the entries the sidebar actually shows, in screen order. */
const shownIds = (container) =>
  Array.from(container.querySelectorAll('nav a[href]')).map((link) =>
    link.getAttribute('href').replace(/^\//, ''),
  )

/* Counted through the entries on screen, not through aria-expanded: a single
   open-group id cannot report two open groups even when the markup shows two,
   so an assertion on the attribute could never fail. */
const groupsShowingEntries = (container) =>
  Array.from(container.querySelectorAll('nav > div')).filter((group) =>
    group.querySelector('a[href]'),
  ).length

/* The sort key of the task: the English component name, which the route id
   already carries once its hyphens are dropped. */
const sortKey = (id) => id.split('-').join('').toLowerCase()

const components = NAV.find((group) => group.id === 'components')
const openComponents = () => localStorage.setItem(KEY, JSON.stringify('components'))

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  cleanup()
  localStorage.clear()
})

afterAll(async () => {
  await i18n.changeLanguage('de')
})

describe('sidebar order', () => {
  it('sorts the components by their English component name', () => {
    const ids = components.items.map((item) => item.id)
    const sorted = [...ids].sort((a, b) => sortKey(a).localeCompare(sortKey(b), 'en'))

    expect(ids).toEqual(sorted)
  })

  /* The order must not depend on the label on screen. Rendering it in both
     languages is what proves that — the data alone could not. */
  it.each(['de', 'en'])('shows that same order on screen in %s', async (lang) => {
    await i18n.changeLanguage(lang)
    openComponents()

    const componentIds = shownIds(draw())
    const sorted = [...componentIds].sort((a, b) => sortKey(a).localeCompare(sortKey(b), 'en'))

    expect(componentIds).toHaveLength(components.items.length)
    expect(componentIds).toEqual(sorted)
  })

  /* Both languages have to render the very same sequence, not merely a sorted
     one each. */
  it('renders the identical sequence in both languages', async () => {
    await i18n.changeLanguage('de')
    openComponents()
    const german = shownIds(draw())
    cleanup()

    await i18n.changeLanguage('en')
    const english = shownIds(draw())

    expect(english).toEqual(german)
  })
})

describe('sidebar groups', () => {
  it('opens only About for a visitor without a stored state', () => {
    expect(expanded(draw())).toEqual([true, false, false])
  })

  it('reopens the group a returning visitor left open', () => {
    openComponents()

    expect(expanded(draw())).toEqual([false, false, true])
  })

  /* The stored value used to be a map with several groups open at once. Such a
     visitor keeps the first group they had open instead of being reset. */
  it('carries an older stored state over to a single open group', () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ about: false, foundations: true, components: true }),
    )

    expect(expanded(draw())).toEqual([false, true, false])
  })

  it('leaves every group shut when the visitor folded the last one away', () => {
    localStorage.setItem(KEY, JSON.stringify(null))

    expect(expanded(draw())).toEqual([false, false, false])
  })

  it('folds the open group when another one is opened', () => {
    const container = draw()

    fireEvent.click(groups(container)[2])

    expect(expanded(container)).toEqual([false, false, true])
    expect(JSON.parse(localStorage.getItem(KEY))).toBe('components')
  })

  it('never shows the entries of two groups at once', () => {
    const container = draw()

    expect(groupsShowingEntries(container)).toBe(1)
    for (const index of [1, 2, 0, 1]) {
      fireEvent.click(groups(container)[index])
      expect(groupsShowingEntries(container)).toBe(1)
    }
  })

  /* The open heading once carried its surface next to a `bg-transparent` in the
     shared base. Both are plain utilities, so the sheet order decided — and
     Tailwind emits bg-transparent later. The surface was in the markup and
     never on screen. */
  it('gives the open heading a surface that nothing overrides', () => {
    const container = draw()
    const [about, foundations] = groups(container)

    expect(about.className).toContain('bg-[var(--medo-state-pressed)]')
    expect(about.className).not.toContain('bg-transparent')
    expect(foundations.className).not.toContain('bg-[var(--medo-state-pressed)]')
  })

  it('folds the open group when its own heading is clicked', () => {
    const container = draw()

    fireEvent.click(groups(container)[0])

    expect(expanded(container)).toEqual([false, false, false])
    expect(JSON.parse(localStorage.getItem(KEY))).toBeNull()
  })
})
