/* Guards the dark theme against contrast regressions.

   Every value read here comes out of medo-theme.css — the stylesheet the
   browser actually applies. Nothing is compared against a second copy of the
   palette, so the run cannot stay green while the stylesheet says something
   else. */

import { describe, it, expect } from 'vitest'

import { loadTokens, stepOf } from '../../scripts/contrast/tokens.mjs'
import { analyse, assertCoverage, assertNoLightDrift } from '../../scripts/contrast/analysis.mjs'
import { makeTheme, evaluate, matrixPairs, CONTEXT_PAIRS } from '../../scripts/contrast/pairs.mjs'
import { runVerification } from '../../scripts/contrast/verify.mjs'
import { JUSTIFICATIONS } from '../../scripts/contrast/shortfalls.mjs'

/* Approved in Task 1.1 and argued in docs/dark-palette-vorschlag.md. Both
   inherit a shortfall the light theme already has; neither may turn the run
   red, and neither may quietly disappear either. */
const APPROVED_SHORTFALLS = [
  'medo-text-link|medo-state-pressed',
  'medo-input-border|medo-input-bg',
]

describe('Kontrastwerkzeug', () => {
  it('bewertet die helle Palette korrekt, bevor es der dunklen vertraut', () => {
    const failed = runVerification().filter((check) => !check.ok)
    expect(failed.map((check) => `${check.name}: ${check.detail}`)).toEqual([])
  })
})

describe('medo-theme.css', () => {
  const tokens = loadTokens()

  it('deckt jedes Token der Semantic-Ebene und jeden Schatten ab', () => {
    expect(() => assertCoverage(tokens)).not.toThrow()
  })

  it('wiederholt im hellen Zweig genau das, was der Spiegel deklariert', () => {
    expect(() => assertNoLightDrift(tokens)).not.toThrow()
  })

  it('liefert für jedes Token zwei verschiedene Zweige oder eine bewusste Gleichheit', () => {
    const light = makeTheme(tokens, 'light')
    const dark = makeTheme(tokens, 'dark')
    /* stone-500 steht in beiden Themes — die einzige gewollte Gleichheit. */
    const sameInBoth = tokens.semantic
      .map(([name]) => name)
      .filter((name) => light(name) === dark(name))
    expect(sameInBoth).toEqual([
      'medo-text-disabled',
      'medo-icon-disabled',
      'medo-border-strong',
      'medo-action-text-disabled',
    ])
  })

  it('setzt die Primaerflaeche im Dunkeln auf eine hellere Stufe als im Hellen', () => {
    expect(stepOf(tokens, 'medo-action', 'light')).toBe('teal-600')
    expect(stepOf(tokens, 'medo-action', 'dark')).toBe('teal-500')
  })
})

describe('Kontrast der dunklen Palette', () => {
  const tokens = loadTokens()
  const dark = makeTheme(tokens, 'dark')
  const pairs = [...matrixPairs(), ...CONTEXT_PAIRS].filter((pair) => pair.kind !== 'none')

  it('haelt jede Text- und Icon-Kombination auf ihrer WCAG-2.2-Schwelle', () => {
    const failing = pairs
      .map((pair) => evaluate(dark, pair))
      .filter((result) => !result.passes)
      .filter((result) => !APPROVED_SHORTFALLS.includes(`${result.fg}|${result.bg}`))
      .map((result) => `--${result.fg} auf --${result.bg}: ${result.ratio}:1 (Schwelle ${result.threshold})`)
    expect(failing).toEqual([])
  })

  it('haelt die beiden freigegebenen Unterschreitungen weiterhin fuer begruendet', () => {
    for (const key of APPROVED_SHORTFALLS) {
      expect(JUSTIFICATIONS[key], `Begruendung fehlt fuer ${key}`).toBeTruthy()
    }
    /* Verschwindet eine Unterschreitung, gehoert ihre Ausnahme entfernt —
       sonst deckt die Liste spaeter eine echte Regression zu. */
    const stillShort = pairs
      .map((pair) => evaluate(dark, pair))
      .filter((result) => !result.passes)
      .map((result) => `${result.fg}|${result.bg}`)
    expect(stillShort.sort()).toEqual([...APPROVED_SHORTFALLS].sort())
  })

  it('erzeugt die Auswertung vollstaendig und ohne unbegruendete Unterschreitung', () => {
    const data = analyse()
    expect(data.rows).toHaveLength(77)
    expect(data.shadows).toHaveLength(4)
    expect(data.shortfalls.every((row) => row.justification)).toBe(true)
  })
})
