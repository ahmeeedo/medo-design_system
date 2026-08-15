import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import { MemoryRouter } from 'react-router-dom'
import { ROUTES } from '../src/App'
import i18n from '../src/i18n/index.js'
import { generateId } from '../src/docs/anchors'
import { TAB_BAR_MARKER } from '../src/docs/PageLayout'

export const LANGS = ['de', 'en']

/* jsdom lacks the layout and pointer APIs the pages touch on mount. */
export function installDomStubs() {
  class Observer {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver ??= Observer
  globalThis.IntersectionObserver ??= Observer
  Element.prototype.scrollIntoView ??= function scrollIntoView() {}
  Element.prototype.scrollBy ??= function scrollBy() {}
  Element.prototype.hasPointerCapture ??= function hasPointerCapture() { return false }
  Element.prototype.setPointerCapture ??= function setPointerCapture() {}
  Element.prototype.releasePointerCapture ??= function releasePointerCapture() {}
  globalThis.matchMedia ??= (query) => ({
    matches: false,
    media: query,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent() { return false },
  })
}

function renderAt(container, path, element) {
  const root = createRoot(container)
  flushSync(() => {
    root.render(<MemoryRouter initialEntries={[path]}>{element}</MemoryRouter>)
  })
  return root
}

/* Mirrors the two-step lookup PageLayout performs: the anchor lives on the
   Section wrapper, and an h2 without one falls back to its own generated id. */
function readSections(container) {
  return Array.from(container.querySelectorAll('h2')).map((el) => {
    const text = el.textContent.trim()
    return { anchor: el.closest('[id]')?.id || generateId(text), title: text }
  })
}

/* Scoped to the docs tab bar: page content demoes the Tabs component too, and
   those tabs must not be mistaken for page tabs. Icons render their ligature
   name as text, so they are dropped before the label is read. */
function readTabs(container) {
  return Array.from(
    container.querySelectorAll(`[${TAB_BAR_MARKER}] [role="tab"]`),
  ).map((el) => {
    const label = el.cloneNode(true)
    label.querySelectorAll('.medo-icon').forEach((icon) => icon.remove())
    return { id: el.dataset.val, label: label.textContent.trim() }
  })
}

export async function buildSearchIndex() {
  const container = document.createElement('div')
  document.body.appendChild(container)

  const pageEntries = []
  const sectionEntries = []
  const pages = ROUTES.filter((route) => !route.redirect)

  for (const lang of LANGS) {
    await i18n.changeLanguage(lang)

    for (const { path, element } of pages) {
      const slug = path.slice(1)

      let root = renderAt(container, path, element)
      const pageTitle = container.querySelector('h1')?.textContent.trim() ?? ''
      const tabs = readTabs(container)
      root.unmount()

      if (tabs.length === 0) {
        // Info pages render without PageLayout: no tabs, no section anchors.
        pageEntries.push({
          id: slug,
          lang,
          type: 'page',
          pageTitle,
          section: pageTitle,
          route: path,
        })
        continue
      }

      for (const tab of tabs) {
        pageEntries.push({
          id: `${slug}-${tab.id}`,
          lang,
          type: 'tab',
          pageTitle,
          section: tab.label,
          route: path,
          tab: tab.id,
        })

        root = renderAt(container, `${path}?tab=${tab.id}`, element)
        const sections = readSections(container)
        root.unmount()

        const seen = new Map()
        for (const { anchor, title } of sections) {
          const count = (seen.get(anchor) ?? 0) + 1
          seen.set(anchor, count)
          sectionEntries.push({
            id: count === 1 ? `${slug}-${tab.id}-${anchor}` : `${slug}-${tab.id}-${anchor}-${count}`,
            lang,
            type: 'section',
            pageTitle,
            section: title,
            route: path,
            anchor,
            tab: tab.id,
          })
        }
      }
    }
  }

  container.remove()
  await i18n.changeLanguage('de')

  return { pageEntries, sectionEntries }
}
