/* Validates the contrast tool against the existing light palette before it is
   trusted with the dark one.

   Three kinds of check:
   1. Fixed points of the WCAG 2.2 formula itself.
   2. The alpha derivations design-reference/CLAUDE.md states for the five
      translucent literals — the tool has to read them back out of the hex.
   3. A behavioural claim the reference makes about the light palette:
      warning-on-solid is stone-1000 "because amber is too light for white
      text". A tool that cannot reproduce that verdict cannot be trusted. */

import { pathToFileURL } from 'node:url'
import { loadTokens } from './tokens.mjs'
import { parseColor, contrastRatio, flatten, relativeLuminance, round2 } from './color.mjs'

function expect(condition, message) {
  if (!condition) throw new Error(message)
}

function near(actual, expected, tolerance, label) {
  expect(Math.abs(actual - expected) <= tolerance,
    `${label}: ${actual} weicht von ${expected} ab (Toleranz ${tolerance})`)
}

export function runVerification() {
  const checks = []
  const check = (name, fn) => {
    try {
      checks.push({ name, ok: true, detail: fn() })
    } catch (error) {
      checks.push({ name, ok: false, detail: error.message })
    }
  }

  const tokens = loadTokens()
  /* Deliberately the mirror, not the theme file: these checks validate the tool
     against the values design-reference ships, independent of the theme layer.
     analysis.mjs separately proves the theme file's light branch matches. */
  const light = (name) => tokens.mirrorLight(name)
  const brand = (step) => tokens.raw.get(`medo-color-${step}`)

  // --- 1. formula fixed points -------------------------------------------
  check('Schwarz auf Weiß ergibt 21:1', () => {
    const ratio = contrastRatio('#ffffff', '#000000')
    near(ratio, 21, 0.001, 'Kontrast')
    return '21.00'
  })

  check('Eine Farbe gegen sich selbst ergibt 1:1', () => {
    near(contrastRatio(light('medo-surface'), light('medo-surface')), 1, 1e-9, 'Kontrast')
    near(contrastRatio(brand('teal-600'), brand('teal-600')), 1, 1e-9, 'Kontrast')
    return '1.00'
  })

  check('Der Kontrast ist symmetrisch', () => {
    const a = contrastRatio(light('medo-text'), light('medo-surface'))
    const b = contrastRatio(light('medo-surface'), light('medo-text'))
    near(a, b, 1e-12, 'Symmetrie')
    return `${round2(a)}:1 in beiden Richtungen`
  })

  check('Deckkraft 100 % und 0 % liefern die Randfälle', () => {
    expect(flatten('#24221eff', '#ffffff') === '#24221e', 'Deckkraft ff muss die Vordergrundfarbe liefern')
    expect(flatten('#24221e00', '#ffffff') === '#ffffff', 'Deckkraft 00 muss die Hintergrundfarbe liefern')
    return 'ff → Vordergrund, 00 → Hintergrund'
  })

  check('Kurzschreibweise und rgba() werden gelesen', () => {
    const short = parseColor('#fff')
    expect(short.r === 255 && short.g === 255 && short.b === 255 && short.a === 1, '#fff falsch gelesen')
    const fn = parseColor('rgba(23,21,19,0.5)')
    expect(fn.r === 23 && fn.g === 21 && fn.b === 19 && fn.a === 0.5, 'rgba() falsch gelesen')
    return '#fff und rgba() korrekt'
  })

  check('Die Leuchtdichte steigt entlang der stone-Skala monoton', () => {
    const steps = ['1100', '1000', '900', '800', '700', '600', '500', '400', '300', '200', '100', '50']
    const values = steps.map((step) => relativeLuminance(brand(`stone-${step}`)))
    for (let i = 1; i < values.length; i += 1) {
      expect(values[i] > values[i - 1], `stone-${steps[i]} ist nicht heller als stone-${steps[i - 1]}`)
    }
    return `${round2(values[0] * 100) / 100} … ${round2(values.at(-1) * 100) / 100}`
  })

  // --- 2. the documented alpha derivations --------------------------------
  const derivations = [
    ['medo-text-muted', 'stone-1000', 0.68, 'stone-1000 @68 %'],
    ['medo-icon-muted', 'stone-1000', 0.55, 'stone-1000 @55 %'],
    ['medo-focus-ring', 'teal-600', 0.35, 'primary-600 @35 %'],
    ['medo-focus-ring-danger', 'red-600', 0.35, 'error-600 @35 %'],
    ['medo-scrim', 'stone-1100', 0.5, 'stone-1100 @50 %'],
  ]

  for (const [token, step, alpha, label] of derivations) {
    check(`--${token} ist ${label}`, () => {
      const parsed = parseColor(light(token))
      const base = parseColor(brand(step))
      expect(parsed.r === base.r && parsed.g === base.g && parsed.b === base.b,
        `Grundfarbe ist nicht ${step}`)
      near(parsed.a, alpha, 0.006, 'Deckkraft')
      return `${light(token)} = ${step} @ ${Math.round(parsed.a * 1000) / 10} %`
    })
  }

  // --- 3. behavioural claims about the light palette ----------------------
  check('Weiß auf warning-solid verfehlt AA — der Grund für die Sonderregel', () => {
    const ratio = contrastRatio('#ffffff', light('medo-warning-solid'))
    expect(ratio < 4.5, `Weiß auf Amber erreicht ${round2(ratio)}:1 und müsste damit zulässig sein`)
    return `${round2(ratio)}:1 — unter 4,5`
  })

  check('warning-on-solid löst die Sonderregel ein', () => {
    const ratio = contrastRatio(light('medo-warning-on-solid'), light('medo-warning-solid'))
    expect(ratio >= 4.5, `stone-1000 auf Amber erreicht nur ${round2(ratio)}:1`)
    return `${round2(ratio)}:1 — über 4,5`
  })

  check('Fließtext erreicht AA auf allen Grundflächen', () => {
    const surfaces = ['medo-surface', 'medo-surface-container', 'medo-surface-container-high', 'medo-overlay']
    const results = surfaces.map((surface) => {
      const ratio = contrastRatio(light('medo-text'), light(surface))
      expect(ratio >= 4.5, `text auf ${surface} erreicht nur ${round2(ratio)}:1`)
      return round2(ratio)
    })
    return `${Math.min(...results)}:1 … ${Math.max(...results)}:1`
  })

  check('Statustext erreicht AA auf der eigenen Statusfläche', () => {
    const ratios = ['success', 'warning', 'error', 'info'].map((role) => {
      const ratio = contrastRatio(light(`medo-${role}-text`), light(`medo-${role}-surface`))
      expect(ratio >= 4.5, `${role}-text erreicht nur ${round2(ratio)}:1`)
      return round2(ratio)
    })
    return `${Math.min(...ratios)}:1 … ${Math.max(...ratios)}:1`
  })

  check('Beschriftung auf gefüllten Statusflächen erreicht AA', () => {
    const ratios = ['success', 'warning', 'error', 'info'].map((role) => {
      const ratio = contrastRatio(light(`medo-${role}-on-solid`), light(`medo-${role}-solid`))
      expect(ratio >= 4.5, `${role}-on-solid erreicht nur ${round2(ratio)}:1`)
      return round2(ratio)
    })
    return `${Math.min(...ratios)}:1 … ${Math.max(...ratios)}:1`
  })

  check('Der Textlink erreicht AA auf der Grundfläche', () => {
    const ratio = contrastRatio(light('medo-text-link'), light('medo-surface'))
    expect(ratio >= 4.5, `text-link erreicht nur ${round2(ratio)}:1`)
    return `${round2(ratio)}:1`
  })

  return checks
}

function report(results) {
  const width = Math.max(...results.map((r) => r.name.length))
  for (const result of results) {
    const mark = result.ok ? 'ok  ' : 'FEHL'
    console.log(`${mark}  ${result.name.padEnd(width)}  ${result.detail}`)
  }
  const failed = results.filter((r) => !r.ok)
  console.log('')
  console.log(`${results.length - failed.length} von ${results.length} Prüfungen bestanden.`)
  return failed.length === 0
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const ok = report(runVerification())
  process.exit(ok ? 0 : 1)
}

export { report }
