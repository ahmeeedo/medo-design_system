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

/* Ebene 3 — Material-style names. The step a token points at differs per theme
   and is derived from the stylesheets in themeTokens.js, so it is not written
   down here a second time. */
export const SEMANTIC_GROUPS = [
  {
    id: 'surfaces',
    tokens: [
      { name: 'surface' },
      { name: 'surface-container' },
      { name: 'surface-container-high' },
      { name: 'surface-sunken' },
      { name: 'surface-hover' },
      { name: 'surface-selected' },
      { name: 'overlay' },
    ],
  },
  {
    id: 'text',
    tokens: [
      { name: 'text' },
      { name: 'text-muted' },
      { name: 'text-subtle' },
      { name: 'text-on-primary' },
      { name: 'text-disabled' },
      { name: 'text-link' },
      { name: 'text-link-hover' },
    ],
  },
  {
    id: 'icons',
    tokens: [
      { name: 'icon' },
      { name: 'icon-muted' },
      { name: 'icon-on-primary' },
      { name: 'icon-disabled' },
    ],
  },
  {
    id: 'borders',
    tokens: [
      { name: 'border' },
      { name: 'border-strong' },
      { name: 'border-subtle' },
      { name: 'border-disabled' },
      { name: 'divider' },
    ],
  },
  {
    id: 'inputs',
    tokens: [
      { name: 'input-bg' },
      { name: 'input-bg-disabled' },
      { name: 'input-text' },
      { name: 'input-placeholder' },
      { name: 'input-border' },
      { name: 'input-border-hover' },
      { name: 'input-border-focus' },
      { name: 'input-border-error' },
      { name: 'input-border-disabled' },
    ],
  },
  {
    id: 'actionPrimary',
    tokens: [
      { name: 'action' },
      { name: 'action-hover' },
      { name: 'action-active' },
      { name: 'action-disabled' },
      { name: 'action-text' },
      { name: 'action-text-disabled' },
    ],
  },
  {
    id: 'actionNeutral',
    tokens: [
      { name: 'action-neutral' },
      { name: 'action-neutral-hover' },
      { name: 'action-neutral-active' },
      { name: 'action-neutral-text' },
    ],
  },
  {
    id: 'states',
    tokens: [
      { name: 'state-hover' },
      { name: 'state-pressed' },
      { name: 'state-selected' },
      { name: 'selection' },
      { name: 'focus-ring' },
      { name: 'focus-ring-danger' },
      { name: 'scrim' },
    ],
  },
  {
    id: 'statusSuccess',
    tokens: [
      { name: 'success-surface' },
      { name: 'success-text' },
      { name: 'success-border' },
      { name: 'success-solid' },
      { name: 'success-solid-hover' },
      { name: 'success-solid-active' },
      { name: 'success-on-solid' },
    ],
  },
  {
    id: 'statusWarning',
    tokens: [
      { name: 'warning-surface' },
      { name: 'warning-text' },
      { name: 'warning-border' },
      { name: 'warning-solid' },
      { name: 'warning-solid-hover' },
      { name: 'warning-solid-active' },
      { name: 'warning-on-solid' },
    ],
  },
  {
    id: 'statusError',
    tokens: [
      { name: 'error-surface' },
      { name: 'error-text' },
      { name: 'error-border' },
      { name: 'error-solid' },
      { name: 'error-solid-hover' },
      { name: 'error-solid-active' },
      { name: 'error-on-solid' },
    ],
  },
  {
    id: 'statusInfo',
    tokens: [
      { name: 'info-surface' },
      { name: 'info-text' },
      { name: 'info-border' },
      { name: 'info-solid' },
      { name: 'info-solid-hover' },
      { name: 'info-solid-active' },
      { name: 'info-on-solid' },
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
