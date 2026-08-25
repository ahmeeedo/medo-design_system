/* The DOM the standalone search index generator renders into. Under vitest a
   jsdom environment is already in place, so this runs outside the test runner
   — and in the assertions covering the generator, which pass a scope of their
   own instead of overwriting the runner's globals. */
import { JSDOM } from 'jsdom'

export function installDomEnvironment(scope = globalThis) {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://localhost/',
    pretendToBeVisual: true,
  })

  scope.window = dom.window
  scope.document = dom.window.document
  for (const key of Object.getOwnPropertyNames(dom.window)) {
    if (!key.startsWith('_') && !(key in scope)) {
      scope[key] = dom.window[key]
    }
  }
  scope.navigator = dom.window.navigator

  return scope
}
