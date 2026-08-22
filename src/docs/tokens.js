import { useMemo } from 'react'
import { useTheme } from './useTheme'

/* The docs never transcribe token values. Everything shown as a value is read
   back from the loaded token chain (src/styles/medo/) at runtime, so a change
   in the design tokens shows up here without touching the pages. The joined
   name list and the active theme are the cache key: callers may pass a fresh
   array every render, and a themed token resolves differently per theme. */
export function useTokenValues(names) {
  const key = names.join(',')
  const theme = useTheme()

  return useMemo(() => {
    const style = getComputedStyle(document.documentElement)
    const values = {}
    key.split(',').filter(Boolean).forEach((name) => {
      values[name] = style.getPropertyValue(name).trim()
    })
    return values
  }, [key, theme])
}

export const SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100]

export const brandToken = (scale, step) => `--medo-color-${scale}-${step}`
export const aliasToken = (role, step) => `--medo-${role}-${step}`

/* Ebene 1 — the raw scales. Role column marks which alias role points here. */
export const CHROMATIC_SCALES = [
  { name: 'red', role: 'error' },
  { name: 'crimson' },
  { name: 'rose' },
  { name: 'orange' },
  { name: 'amber', role: 'warning' },
  { name: 'yellow' },
  { name: 'green', role: 'success' },
  { name: 'teal', role: 'primary' },
  { name: 'cyan' },
  { name: 'blue', role: 'info' },
  { name: 'indigo' },
  { name: 'violet' },
  { name: 'purple' },
]

export const NEUTRAL_SCALES = [
  { name: 'grey', role: 'neutral' },
  { name: 'stone', role: 'neutral-alt' },
]

export const ALL_BRAND_SCALES = [...CHROMATIC_SCALES, ...NEUTRAL_SCALES]

export const ABSOLUTE_COLORS = ['white', 'black']

/* Ebene 2 — role → brand scale. No secondary role exists in this system. */
export const ALIAS_ROLES = [
  { role: 'primary', brand: 'teal' },
  { role: 'neutral', brand: 'grey' },
  { role: 'neutral-alt', brand: 'stone' },
  { role: 'error', brand: 'red' },
  { role: 'warning', brand: 'amber' },
  { role: 'success', brand: 'green' },
  { role: 'info', brand: 'blue' },
]

/* Ebene 3 — Material-style names. `ref` is the alias step each token points at
   and is part of the token architecture, not a value. */
export const SEMANTIC_GROUPS = [
  {
    id: 'surfaces',
    tokens: [
      { name: 'surface', ref: 'white' },
      { name: 'surface-container', ref: 'stone-50' },
      { name: 'surface-container-high', ref: 'stone-100' },
      { name: 'surface-sunken', ref: 'stone-100' },
      { name: 'surface-hover', ref: 'stone-100' },
      { name: 'surface-selected', ref: 'teal-100' },
      { name: 'overlay', ref: 'white' },
    ],
  },
  {
    id: 'text',
    tokens: [
      { name: 'text', ref: 'stone-1000' },
      { name: 'text-muted', ref: 'stone-1000 @ 68 %' },
      { name: 'text-subtle', ref: 'stone-800' },
      { name: 'text-on-primary', ref: 'white' },
      { name: 'text-disabled', ref: 'stone-500' },
      { name: 'text-link', ref: 'teal-600' },
      { name: 'text-link-hover', ref: 'teal-800' },
    ],
  },
  {
    id: 'icons',
    tokens: [
      { name: 'icon', ref: 'stone-900' },
      { name: 'icon-muted', ref: 'stone-1000 @ 55 %' },
      { name: 'icon-on-primary', ref: 'white' },
      { name: 'icon-disabled', ref: 'stone-500' },
    ],
  },
  {
    id: 'borders',
    tokens: [
      { name: 'border', ref: 'stone-300' },
      { name: 'border-strong', ref: 'stone-500' },
      { name: 'border-subtle', ref: 'stone-200' },
      { name: 'border-disabled', ref: 'stone-200' },
      { name: 'divider', ref: 'stone-200' },
    ],
  },
  {
    id: 'inputs',
    tokens: [
      { name: 'input-bg', ref: 'white' },
      { name: 'input-bg-disabled', ref: 'stone-100' },
      { name: 'input-text', ref: 'stone-1000' },
      { name: 'input-placeholder', ref: 'stone-600' },
      { name: 'input-border', ref: 'stone-400' },
      { name: 'input-border-hover', ref: 'stone-600' },
      { name: 'input-border-focus', ref: 'teal-600' },
      { name: 'input-border-error', ref: 'red-600' },
      { name: 'input-border-disabled', ref: 'stone-200' },
    ],
  },
  {
    id: 'actionPrimary',
    tokens: [
      { name: 'action', ref: 'teal-600' },
      { name: 'action-hover', ref: 'teal-700' },
      { name: 'action-active', ref: 'teal-800' },
      { name: 'action-disabled', ref: 'stone-200' },
      { name: 'action-text', ref: 'white' },
      { name: 'action-text-disabled', ref: 'stone-500' },
    ],
  },
  {
    id: 'actionNeutral',
    tokens: [
      { name: 'action-neutral', ref: 'stone-100' },
      { name: 'action-neutral-hover', ref: 'stone-200' },
      { name: 'action-neutral-active', ref: 'stone-300' },
      { name: 'action-neutral-text', ref: 'stone-1000' },
    ],
  },
  {
    id: 'states',
    tokens: [
      { name: 'state-hover', ref: 'stone-100' },
      { name: 'state-pressed', ref: 'stone-200' },
      { name: 'state-selected', ref: 'teal-100' },
      { name: 'selection', ref: 'teal-200' },
      { name: 'focus-ring', ref: 'teal-600 @ 35 %' },
      { name: 'focus-ring-danger', ref: 'red-600 @ 35 %' },
      { name: 'scrim', ref: 'stone-1100 @ 50 %' },
    ],
  },
  {
    id: 'statusSuccess',
    tokens: [
      { name: 'success-surface', ref: 'green-50' },
      { name: 'success-text', ref: 'green-1000' },
      { name: 'success-border', ref: 'green-300' },
      { name: 'success-solid', ref: 'green-600' },
      { name: 'success-solid-hover', ref: 'green-700' },
      { name: 'success-solid-active', ref: 'green-800' },
      { name: 'success-on-solid', ref: 'white' },
    ],
  },
  {
    id: 'statusWarning',
    tokens: [
      { name: 'warning-surface', ref: 'amber-50' },
      { name: 'warning-text', ref: 'amber-1000' },
      { name: 'warning-border', ref: 'amber-300' },
      { name: 'warning-solid', ref: 'amber-600' },
      { name: 'warning-solid-hover', ref: 'amber-700' },
      { name: 'warning-solid-active', ref: 'amber-800' },
      { name: 'warning-on-solid', ref: 'stone-1000' },
    ],
  },
  {
    id: 'statusError',
    tokens: [
      { name: 'error-surface', ref: 'red-50' },
      { name: 'error-text', ref: 'red-1000' },
      { name: 'error-border', ref: 'red-300' },
      { name: 'error-solid', ref: 'red-600' },
      { name: 'error-solid-hover', ref: 'red-700' },
      { name: 'error-solid-active', ref: 'red-800' },
      { name: 'error-on-solid', ref: 'white' },
    ],
  },
  {
    id: 'statusInfo',
    tokens: [
      { name: 'info-surface', ref: 'blue-50' },
      { name: 'info-text', ref: 'blue-1000' },
      { name: 'info-border', ref: 'blue-300' },
      { name: 'info-solid', ref: 'blue-600' },
      { name: 'info-solid-hover', ref: 'blue-700' },
      { name: 'info-solid-active', ref: 'blue-800' },
      { name: 'info-on-solid', ref: 'white' },
    ],
  },
]

export const TYPE_SIZES = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl']

export const FONT_WEIGHTS = ['regular', 'medium', 'semibold', 'bold']

export const LEADINGS = ['tight', 'snug', 'normal', 'relaxed']

export const TRACKINGS = ['tight', 'normal', 'wide']

export const SPACE_STEPS = ['none', '3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl']

export const RADIUS_STEPS = ['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']

export const SHADOW_STEPS = ['sm', 'md', 'lg', 'xl']

export const BORDER_WIDTHS = ['thin', 'thick']

export const BREAKPOINTS = ['sm', 'md', 'lg', 'xl', '2xl']
