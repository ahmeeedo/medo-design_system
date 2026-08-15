/* Builds the full comparison between the light palette and the dark proposal.
   Nothing here writes to src/styles/medo/ — the token files are read only. */

import { loadTokens } from './tokens.mjs'
import { contrastRatio, flatten, round2, parseColor } from './color.mjs'
import { DARK, DARK_SHADOWS, darkValue, THRESHOLDS } from './dark-palette.mjs'
import { matrixPairs, CONTEXT_PAIRS, makeTheme, evaluate, resolveSurface, GENERAL_SURFACES,
  TEXT_FOREGROUNDS, ICON_FOREGROUNDS, DISABLED_FOREGROUNDS, coverageGaps } from './pairs.mjs'
import { JUSTIFICATIONS } from './shortfalls.mjs'

function assertCoverage(tokens) {
  const declared = tokens.semantic.map(([name]) => name)
  const missing = declared.filter((name) => !DARK.has(name))
  if (missing.length) {
    throw new Error(`Kein dunkler Wert vorgeschlagen für: ${missing.join(', ')}`)
  }
  const surplus = [...DARK.keys()].filter((name) => !declared.includes(name))
  if (surplus.length) {
    throw new Error(`Vorschlag kennt Token, die die Semantic-Ebene nicht deklariert: ${surplus.join(', ')}`)
  }
  const shadowsMissing = tokens.shadows.map(([name]) => name).filter((name) => !DARK_SHADOWS.has(name))
  if (shadowsMissing.length) {
    throw new Error(`Kein dunkler Schatten vorgeschlagen für: ${shadowsMissing.join(', ')}`)
  }
  const gaps = coverageGaps()
  if (gaps.length) {
    throw new Error(`Token ohne jede berechnete Kombination: ${gaps.join(', ')}`)
  }
}

export function analyse() {
  const tokens = loadTokens()
  assertCoverage(tokens)

  const light = makeTheme(tokens, 'light')
  const dark = makeTheme(tokens, 'dark')

  const rows = tokens.semantic.map(([name]) => {
    const entry = DARK.get(name)
    const ref = entry.ref
    return {
      name,
      lightValue: light(name),
      darkValue: dark(name),
      step: entry.step ?? null,
      lightStep: describeLightStep(tokens, name),
      ref,
      kind: entry.kind,
      special: entry.special ?? null,
      note: entry.note,
      lightRatio: round2(pairRatio(light, name, ref)),
      darkRatio: round2(pairRatio(dark, name, ref)),
    }
  })

  const matrix = buildMatrix(light, dark)
  const context = groupContext(light, dark)
  const shortfalls = collectShortfalls(light, dark)
  const shadows = tokens.shadows.map(([name, value]) => ({
    name, lightValue: value, darkValue: DARK_SHADOWS.get(name),
  }))

  return {
    tokens, light, dark, rows, matrix, context, shortfalls, shadows,
    lightShortfalls: collectLightShortfalls(light, dark),
    scrimCurve: buildScrimCurve(light, dark),
    shadowDerivation: buildShadowDerivation(light, dark),
    actionAlternative: buildActionAlternative(light, dark),
    focusAlternative: buildFocusAlternative(dark),
  }
}

function describeLightStep(tokens, name) {
  const declared = tokens.raw.get(name)
  const match = declared.match(/var\(\s*--medo-color-([\w-]+)\s*\)/)
  if (match) return match[1]
  const alias = declared.match(/var\(\s*--medo-([\w-]+)\s*\)/)
  return alias ? alias[1] : null
}

function pairRatio(theme, name, ref) {
  const surface = resolveSurface(theme, ref)
  const value = theme(name)
  return contrastRatio(value, surface, surface)
}

function buildMatrix(light, dark) {
  const rows = [
    ...TEXT_FOREGROUNDS.map((fg) => ({ fg, kind: 'text' })),
    ...ICON_FOREGROUNDS.map((fg) => ({ fg, kind: 'ui' })),
    ...DISABLED_FOREGROUNDS.map((fg) => ({ fg, kind: 'none' })),
  ]
  return {
    surfaces: GENERAL_SURFACES,
    rows: rows.map(({ fg, kind }) => ({
      fg,
      kind,
      cells: GENERAL_SURFACES.map((bg) => ({
        bg,
        light: evaluate(light, { fg, bg, kind }),
        dark: evaluate(dark, { fg, bg, kind }),
      })),
    })),
  }
}

function groupContext(light, dark) {
  const groups = new Map()
  for (const pair of CONTEXT_PAIRS) {
    if (!groups.has(pair.group)) groups.set(pair.group, [])
    groups.get(pair.group).push({
      ...pair,
      light: evaluate(light, pair),
      dark: evaluate(dark, pair),
    })
  }
  return groups
}

function collectShortfalls(light, dark) {
  const all = [...matrixPairs(), ...CONTEXT_PAIRS]
  const out = []
  for (const pair of all) {
    if (pair.kind === 'none') continue
    const d = evaluate(dark, pair)
    const l = evaluate(light, pair)
    if (d.passes) continue
    const key = `${pair.fg}|${pair.bg}`
    out.push({
      key,
      ...d,
      lightRatio: l.ratio,
      lightPasses: l.passes,
      justification: JUSTIFICATIONS[key] ?? null,
    })
  }
  const unexplained = out.filter((row) => !row.justification)
  if (unexplained.length) {
    throw new Error(
      `Unterschreitung ohne Begründung:\n${unexplained.map((r) => `  ${r.key} — ${r.ratio}:1 (Schwelle ${r.threshold})`).join('\n')}`,
    )
  }
  return out
}

/* The same run against the existing light palette. Not part of this task's
   scope to fix — recorded so the two themes can be compared honestly. */
function collectLightShortfalls(light, dark) {
  return [...matrixPairs(), ...CONTEXT_PAIRS]
    .filter((pair) => pair.kind !== 'none')
    .map((pair) => ({ pair, light: evaluate(light, pair), dark: evaluate(dark, pair) }))
    .filter(({ light: l }) => !l.passes)
    .map(({ pair, light: l, dark: d }) => ({
      key: `${pair.fg}|${pair.bg}`,
      fg: pair.fg,
      bg: pair.bg,
      threshold: l.threshold,
      lightRatio: l.ratio,
      darkRatio: d.ratio,
      darkPasses: d.passes,
    }))
}

/**
 * Two things a scrim does: separate the modal from the page, and push the page
 * content back. On a dark ground only the second one is still available.
 */
function buildScrimCurve(light, dark) {
  const alphas = [0.4, 0.5, 0.6, 0.66, 0.8, 1]
  const build = (theme, base) => {
    const { r, g, b } = parseColor(base)
    return alphas.map((alpha) => {
      const veil = `rgba(${r},${g},${b},${alpha})`
      const scrimmedSurface = flatten(veil, theme('medo-surface'))
      const scrimmedText = flatten(veil, theme('medo-text'))
      return {
        alpha,
        scrimmed: scrimmedSurface,
        separation: round2(contrastRatio(theme('medo-overlay'), scrimmedSurface)),
        backdrop: round2(contrastRatio(scrimmedText, scrimmedSurface)),
      }
    })
  }
  return {
    light: build(light, light('medo-scrim')),
    dark: build(dark, dark('medo-scrim')),
    // What the light base colour would achieve if carried over unchanged.
    darkWithStone: build(dark, '#171513').find((row) => row.alpha === 0.5),
  }
}

/**
 * What a dark shadow would have to cost to darken its ground by the same step
 * the light shadow achieves on white. The answer is the reason the dark theme
 * cannot lean on shadows at all.
 */
function buildShadowDerivation(light, dark) {
  const lightBase = '31,29,26'
  const lightSurface = light('medo-surface')
  const darkSurface = dark('medo-surface')
  const ceiling = contrastRatio(flatten('rgba(0,0,0,1)', darkSurface), darkSurface)

  const alphas = [0.04, 0.06, 0.07, 0.08, 0.1, 0.16]
  const rows = alphas.map((alpha) => {
    const target = contrastRatio(flatten(`rgba(${lightBase},${alpha})`, lightSurface), lightSurface)
    if (target > ceiling) {
      return { alpha, target: round3(target), needed: null, factor: null, reachable: false }
    }
    let needed = null
    for (let candidate = 0.005; candidate <= 1; candidate += 0.005) {
      const value = contrastRatio(flatten(`rgba(0,0,0,${candidate})`, darkSurface), darkSurface)
      if (needed === null || Math.abs(value - target) < Math.abs(needed.value - target)) {
        needed = { candidate, value }
      }
    }
    return {
      alpha,
      target: round3(target),
      needed: Math.round(needed.candidate * 1000) / 1000,
      factor: Math.round((needed.candidate / alpha) * 100) / 100,
      reachable: true,
    }
  })

  return { rows, ceiling: round3(ceiling), factor: 4 }
}

function round3(value) {
  return Math.round(value * 1000) / 1000
}

/** The rejected alternative for the primary action: keep teal-600, keep white text. */
function buildActionAlternative(light, dark) {
  const tealSix = light('medo-action')
  return {
    fill: tealSix,
    onSurface: round2(contrastRatio(tealSix, dark('medo-surface'))),
    whiteLabel: round2(contrastRatio('#ffffff', tealSix)),
    chosenOnSurface: round2(contrastRatio(dark('medo-action'), dark('medo-surface'))),
    chosenLabel: round2(contrastRatio(dark('medo-action-text'), dark('medo-action'))),
  }
}

/** The focus ring at the locked 35 % against the proposed 55 %, per carrier surface. */
const RING_SURFACES = ['medo-surface', 'medo-surface-container', 'medo-surface-container-high', 'medo-overlay']

function buildFocusAlternative(dark) {
  const measure = (hex) => RING_SURFACES.map((name) => {
    const surface = resolveSurface(dark, name)
    return { surface: name, ratio: round2(contrastRatio(hex, surface, surface)) }
  })
  const options = [
    { label: 'teal-300 @35 % (Deckkraft wie hell)', value: '#adccc859', role: 'focus-ring' },
    { label: 'teal-300 @55 % (Vorschlag)', value: '#adccc88c', role: 'focus-ring' },
    { label: 'red-300 @35 % (Deckkraft wie hell)', value: '#e1bab559', role: 'focus-ring-danger' },
    { label: 'red-300 @55 % (Vorschlag)', value: '#e1bab58c', role: 'focus-ring-danger' },
  ]
  return options.map((option) => ({ ...option, per: measure(option.value) }))
}

export { THRESHOLDS }
