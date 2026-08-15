/* The combination matrix. Token names only — the same list is evaluated
   against the light palette and against the dark proposal. */

import { contrastRatio, parseColor, flatten, round2 } from './color.mjs'
import { darkValue, DARK, THRESHOLDS } from './dark-palette.mjs'

export const TEXT_FOREGROUNDS = [
  'medo-text',
  'medo-text-muted',
  'medo-text-subtle',
  'medo-text-link',
  'medo-text-link-hover',
]

export const ICON_FOREGROUNDS = ['medo-icon', 'medo-icon-muted']

/** Exempt from 1.4.3 / 1.4.11 — inactive controls. Reported, never failed. */
export const DISABLED_FOREGROUNDS = ['medo-text-disabled', 'medo-icon-disabled']

/** Surfaces that arbitrary body text and icons can land on. */
export const GENERAL_SURFACES = [
  'medo-surface',
  'medo-surface-container',
  'medo-surface-container-high',
  'medo-surface-sunken',
  'medo-surface-hover',
  'medo-surface-selected',
  'medo-overlay',
  'medo-state-hover',
  'medo-state-pressed',
  'medo-state-selected',
  'medo-selection',
]

const STATUS_ROLES = ['success', 'warning', 'error', 'info']

/** Pairings bound to one specific background by the component that uses them. */
export const CONTEXT_PAIRS = [
  ...['medo-action', 'medo-action-hover', 'medo-action-active'].flatMap((bg) => [
    { fg: 'medo-text-on-primary', bg, kind: 'text', group: 'Primäraktion' },
    { fg: 'medo-icon-on-primary', bg, kind: 'ui', group: 'Primäraktion' },
    { fg: 'medo-action-text', bg, kind: 'text', group: 'Primäraktion' },
  ]),
  { fg: 'medo-action-text-disabled', bg: 'medo-action-disabled', kind: 'none', group: 'Primäraktion' },

  ...['medo-action-neutral', 'medo-action-neutral-hover', 'medo-action-neutral-active'].map((bg) => ({
    fg: 'medo-action-neutral-text', bg, kind: 'text', group: 'Neutrale Aktion',
  })),

  { fg: 'medo-input-text', bg: 'medo-input-bg', kind: 'text', group: 'Eingabefeld' },
  { fg: 'medo-input-placeholder', bg: 'medo-input-bg', kind: 'text', group: 'Eingabefeld' },
  { fg: 'medo-input-text', bg: 'medo-input-bg-disabled', kind: 'none', group: 'Eingabefeld' },
  ...['medo-input-border', 'medo-input-border-hover', 'medo-input-border-focus', 'medo-input-border-error']
    .map((fg) => ({ fg, bg: 'medo-input-bg', kind: 'ui', group: 'Eingabefeld' })),
  { fg: 'medo-input-border-disabled', bg: 'medo-input-bg-disabled', kind: 'none', group: 'Eingabefeld' },

  ...STATUS_ROLES.flatMap((role) => [
    { fg: `medo-${role}-text`, bg: `medo-${role}-surface`, kind: 'text', group: 'Statusfarben' },
    { fg: `medo-${role}-text`, bg: 'medo-surface', kind: 'text', group: 'Statusfarben' },
    { fg: `medo-${role}-text`, bg: 'medo-surface-container', kind: 'text', group: 'Statusfarben' },
    ...['solid', 'solid-hover', 'solid-active'].map((variant) => ({
      fg: `medo-${role}-on-solid`, bg: `medo-${role}-${variant}`, kind: 'text', group: 'Statusfarben',
    })),
    { fg: `medo-${role}-solid`, bg: 'medo-surface', kind: 'ui', group: 'Statusfarben' },
    { fg: `medo-${role}-border`, bg: `medo-${role}-surface`, kind: 'none', group: 'Statusfarben' },
    { fg: `medo-${role}-border`, bg: 'medo-surface', kind: 'none', group: 'Statusfarben' },
  ]),

  ...['medo-border', 'medo-border-strong', 'medo-border-subtle', 'medo-border-disabled', 'medo-divider']
    .flatMap((fg) => ['medo-surface', 'medo-surface-container'].map((bg) => ({
      fg, bg, kind: fg === 'medo-border-strong' ? 'ui' : 'none', group: 'Rahmen und Linien',
    }))),

  // The ring is painted on the surface carrying the control, never on the control.
  ...['medo-focus-ring', 'medo-focus-ring-danger'].flatMap((fg) =>
    ['medo-surface', 'medo-surface-container', 'medo-surface-container-high', 'medo-overlay']
      .map((bg) => ({ fg, bg, kind: 'ui', group: 'Fokusring' }))),

  ...['medo-action', 'medo-action-hover', 'medo-action-active'].map((fg) => ({
    fg, bg: 'medo-surface', kind: 'ui', group: 'Flächenabsetzung',
  })),
  { fg: 'medo-action-disabled', bg: 'medo-surface', kind: 'none', group: 'Flächenabsetzung' },
  { fg: 'medo-surface-container', bg: 'medo-surface', kind: 'none', group: 'Flächenabsetzung' },
  { fg: 'medo-surface-container-high', bg: 'medo-surface-container', kind: 'none', group: 'Flächenabsetzung' },
  { fg: 'medo-surface-sunken', bg: 'medo-surface', kind: 'none', group: 'Flächenabsetzung' },
  { fg: 'medo-overlay', bg: 'medo-surface', kind: 'none', group: 'Flächenabsetzung' },
  { fg: 'medo-overlay', bg: 'medo-scrim', kind: 'none', group: 'Flächenabsetzung' },
  { fg: 'medo-input-bg', bg: 'medo-surface-container', kind: 'none', group: 'Flächenabsetzung' },
]

/** Full text/icon-on-surface matrix, generated so nothing can be forgotten. */
export function matrixPairs() {
  const rows = [
    ...TEXT_FOREGROUNDS.map((fg) => ({ fg, kind: 'text' })),
    ...ICON_FOREGROUNDS.map((fg) => ({ fg, kind: 'ui' })),
    ...DISABLED_FOREGROUNDS.map((fg) => ({ fg, kind: 'none' })),
  ]
  return rows.flatMap(({ fg, kind }) =>
    GENERAL_SURFACES.map((bg) => ({ fg, bg, kind, group: 'Text und Icon auf Fläche' })))
}

export function allPairs() {
  return [...matrixPairs(), ...CONTEXT_PAIRS]
}

export function makeTheme(tokens, mode) {
  return (name) => (mode === 'light' ? tokens.light(name) : darkValue(tokens, name))
}

/** Backgrounds must be opaque before they can carry a foreground. */
export function resolveSurface(theme, name) {
  const value = theme(name)
  return parseColor(value).a === 1 ? value : flatten(value, theme('medo-surface'))
}

export function evaluate(theme, pair) {
  const bg = resolveSurface(theme, pair.bg)
  const fg = theme(pair.fg)
  const ratio = contrastRatio(fg, bg, bg)
  const threshold = THRESHOLDS[pair.kind]
  return {
    ...pair,
    fgValue: fg,
    bgValue: bg,
    ratio: round2(ratio),
    threshold,
    passes: ratio + 1e-9 >= threshold,
  }
}

/** Every semantic token must appear somewhere in the evaluated set. */
export function coverageGaps() {
  const seen = new Set()
  for (const pair of allPairs()) {
    seen.add(pair.fg)
    seen.add(pair.bg)
  }
  return [...DARK.keys()].filter((name) => !seen.has(name))
}
