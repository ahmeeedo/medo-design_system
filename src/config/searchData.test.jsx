import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import { MemoryRouter } from 'react-router-dom'
import { searchData } from './searchData'
import { sectionData } from './sectionData'
import { ROUTES } from '../App'
import { NAV } from '../docs/DocsLayout'
import i18n from '../i18n'
import { buildSearchIndex, installDomStubs, LANGS } from '../../scripts/buildSearchIndex'

/* Routes that are deliberately absent from the sidebar: the root redirect and
   the two legal pages, which are reachable from the footer. */
const NAV_EXEMPT = ['/', '/impressum', '/datenschutz']

const pages = ROUTES.filter((route) => !route.redirect)
const routePaths = pages.map((route) => route.path)

beforeAll(() => {
  installDomStubs()
})

afterAll(async () => {
  await i18n.changeLanguage('de')
})

describe('search index', () => {
  it('matches what the pages actually render', async () => {
    const { pageEntries, sectionEntries } = await buildSearchIndex()

    // Fails whenever a page gains, loses or renames a section without the
    // index being regenerated via `npm run search-index`.
    expect(sectionData).toEqual(sectionEntries)
    expect(searchData).toEqual([...pageEntries, ...sectionEntries])
  }, 120_000)

  it('finds every page in both languages', () => {
    for (const lang of LANGS) {
      const covered = new Set(
        searchData.filter((entry) => entry.lang === lang).map((entry) => entry.route),
      )
      expect([...routePaths].filter((path) => !covered.has(path))).toEqual([])
    }
  })

  it('references only routes that exist', () => {
    const known = new Set(routePaths)
    const unknown = [...new Set(searchData.map((entry) => entry.route))].filter(
      (route) => !known.has(route),
    )
    expect(unknown).toEqual([])
  })

  it('gives section hits a scroll target and page hits none', () => {
    for (const entry of searchData) {
      if (entry.type === 'section') {
        expect(entry.anchor).toBeTruthy()
        expect(entry.tab).toBeTruthy()
      } else {
        expect(entry.anchor).toBeUndefined()
      }
    }
  })
})

describe('sidebar navigation', () => {
  const navIds = NAV.flatMap((group) => group.items.map((item) => item.id))

  it('links only to routes that exist', () => {
    const known = new Set(routePaths)
    expect(navIds.filter((id) => !known.has(`/${id}`))).toEqual([])
  })

  it('lists every route except the redirect and the legal pages', () => {
    const listed = new Set(navIds.map((id) => `/${id}`))
    const missing = ROUTES.map((route) => route.path)
      .filter((path) => !NAV_EXEMPT.includes(path))
      .filter((path) => !listed.has(path))
    expect(missing).toEqual([])
  })
})

/* Independent of the generator: renders the pages again and looks the stored
   anchors up in the DOM. Umlauts and punctuation are where the slug algorithm
   in src/docs/anchors.js breaks, so those pages are checked explicitly. */
describe('stored anchors resolve on the rendered page', () => {
  const SAMPLE = ['/button', '/text-input', '/data-table', '/date-picker', '/typography']

  for (const lang of LANGS) {
    it(`resolves anchors in ${lang}`, async () => {
      await i18n.changeLanguage(lang)
      const container = document.createElement('div')
      document.body.appendChild(container)

      for (const path of SAMPLE) {
        const { element } = pages.find((route) => route.path === path)
        const entries = sectionData.filter((e) => e.route === path && e.lang === lang)
        expect(entries.length).toBeGreaterThan(0)

        for (const tab of [...new Set(entries.map((e) => e.tab))]) {
          const root = createRoot(container)
          flushSync(() => {
            root.render(
              <MemoryRouter initialEntries={[`${path}?tab=${tab}`]}>{element}</MemoryRouter>,
            )
          })

          const rendered = new Set(
            Array.from(container.querySelectorAll('[id]')).map((el) => el.id),
          )
          const unresolved = entries
            .filter((e) => e.tab === tab)
            .map((e) => e.anchor)
            .filter((anchor) => !rendered.has(anchor))

          expect(unresolved).toEqual([])
          root.unmount()
        }
      }

      container.remove()
    }, 60_000)
  }
})
