/* Guards the production bundle against silent tree-shaking.

   package.json declares a "sideEffects" list covering CSS only, for the
   library build. As a consequence Rollup drops every module whose exports
   nobody uses: a module imported purely for its side effects leaves no
   trace in the output. Nothing else catches this — the build stays green,
   and the Vitest suite renders source modules rather than the bundle, so
   it stays green too. Only the browser shows it, as missing content.

   The locale files are imported by src/i18n/index.js and nowhere else, so
   their content in the bundle is an exact proof that the i18n module — and
   with it the init call — survived the build. */

import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const ASSET_DIR = join('dist', 'assets')
const LOCALE_DIR = join('src', 'i18n', 'locales')
const LOCALES = ['de', 'en']
const SENTINELS_PER_LOCALE = 3
const MIN_LENGTH = 40

/* Characters the minifier escapes inside a string literal, which would make
   a plain includes() against the bundle miss. Kept as a list rather than a
   character class: the backslash and newline escapes are easy to get wrong
   in a regular expression and fail silently by matching the letter n. */
const ESCAPED_BY_MINIFIER = ['"', "'", '\\', '\n', '\r']

function readBundle() {
  const files = readdirSync(ASSET_DIR).filter((name) => name.endsWith('.js'))
  if (files.length === 0) {
    console.error(`Kein JavaScript-Bundle in ${ASSET_DIR} gefunden. Zuerst "npm run build" ausfuehren.`)
    process.exit(1)
  }
  return files.map((name) => readFileSync(join(ASSET_DIR, name), 'utf8')).join('\n')
}

function leafValues(node, collected = []) {
  for (const value of Object.values(node)) {
    if (typeof value === 'string') collected.push(value)
    else if (value && typeof value === 'object') leafValues(value, collected)
  }
  return collected
}

/* Alphabetical order keeps the pick stable across runs; the length floor
   keeps it from matching unrelated code that happens to share a word. */
function sentinels(locale) {
  const json = JSON.parse(readFileSync(join(LOCALE_DIR, `${locale}.json`), 'utf8'))
  return [...new Set(leafValues(json))]
    .filter((value) => value.length >= MIN_LENGTH)
    .filter((value) => !ESCAPED_BY_MINIFIER.some((char) => value.includes(char)))
    .sort()
    .slice(0, SENTINELS_PER_LOCALE)
}

const bundle = readBundle()
const missing = []

for (const locale of LOCALES) {
  const picked = sentinels(locale)
  if (picked.length < SENTINELS_PER_LOCALE) {
    console.error(`Zu wenige pruefbare Texte in ${locale}.json — Pruefung nicht aussagekraeftig.`)
    process.exit(1)
  }
  for (const value of picked) {
    if (!bundle.includes(value)) missing.push(`${locale}.json: "${value}"`)
  }
}

if (missing.length > 0) {
  console.error('')
  console.error('Build-Pruefung fehlgeschlagen: die Uebersetzungen fehlen im Bundle.')
  console.error('Die Oberflaeche wuerde im Browser Schluessel statt Text zeigen, etwa')
  console.error('"button.page.title" anstelle von "Button".')
  console.error('')
  console.error('Zu tun:')
  console.error('  1. In src/main.jsx sicherstellen, dass die i18n-Instanz importiert UND')
  console.error('     benutzt wird (Uebergabe an I18nextProvider). Ein blosses')
  console.error("     import './i18n/index.js' genuegt nicht — es wird wegoptimiert.")
  console.error('  2. "npm run build" erneut ausfuehren.')
  console.error('')
  console.error('Nicht im Bundle gefunden:')
  for (const entry of missing) console.error(`  - ${entry}`)
  console.error('')
  process.exit(1)
}

console.log(`Build-Pruefung: Uebersetzungen (${LOCALES.join(', ')}) im Bundle vorhanden.`)
