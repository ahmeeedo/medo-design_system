/* Proves that the component overrides in medo-theme-components.css change
   nothing in the light theme.

   The ported stylesheets under src/components/ hold the reference's literal
   colour values and must stay untouched — git diff proves the files are
   unchanged, but not that the rendering is. This test closes that gap: every
   declaration in the override file is resolved for the light theme and compared
   against what the component stylesheet declares for the same selector and
   property. A drifting light branch fails here instead of on screen. */

import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { splitTopLevel } from '../../scripts/contrast/tokens.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(here, '..', '..')
const OVERRIDES = path.join(REPO_ROOT, 'src', 'styles', 'medo-theme-components.css')

const COMPONENTS = ['CodeSnippet', 'ContainedList', 'DatePicker', 'FileUploader', 'Loading', 'Pagination']

const DECLARATION = /--([\w-]+)\s*:\s*([^;]+);/g
const VAR_REFERENCE = /var\(\s*--([\w-]+)\s*\)/

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '')
}

/** Every --medo-* declaration from the mirror and the theme file. */
function loadTokenMap() {
  const map = new Map()
  const dir = path.join(REPO_ROOT, 'src', 'styles', 'medo')
  for (const file of readdirSync(dir).filter((name) => name.endsWith('.css'))) {
    const css = readFileSync(path.join(dir, file), 'utf8')
    for (const [, name, value] of css.matchAll(DECLARATION)) map.set(name, value.replace(/\s+/g, ' ').trim())
  }
  const theme = readFileSync(path.join(REPO_ROOT, 'src', 'styles', 'medo-theme.css'), 'utf8')
  for (const [, name, value] of theme.matchAll(DECLARATION)) map.set(name, value.replace(/\s+/g, ' ').trim())
  return map
}

/** The span of the call starting at `start`, from the opening to its closing paren. */
function callEnd(value, start, marker) {
  let depth = 0
  for (let i = start + marker.length - 1; i < value.length; i += 1) {
    if (value[i] === '(') depth += 1
    else if (value[i] === ')') {
      depth -= 1
      if (depth === 0) return i
    }
  }
  throw new Error(`Unclosed ${marker} in: ${value}`)
}

function lightDarkArgs(value, start) {
  const end = callEnd(value, start, 'light-dark(')
  const args = splitTopLevel(value.slice(start + 'light-dark('.length, end))
  if (args.length !== 2) throw new Error(`light-dark() needs two arguments in: ${value}`)
  return { args, end }
}

/** Replace every light-dark(a, b) with its light branch. */
function pickLight(value) {
  let result = value
  let start = result.indexOf('light-dark(')
  while (start !== -1) {
    const { args, end } = lightDarkArgs(result, start)
    result = result.slice(0, start) + args[0] + result.slice(end + 1)
    start = result.indexOf('light-dark(')
  }
  return result
}

/** Resolve light-dark() and every known token; unknown var() is left alone. */
function resolveLight(value, tokens) {
  let current = value
  for (let pass = 0; pass < 64; pass += 1) {
    const next = pickLight(current)
    const match = next.match(VAR_REFERENCE)
    if (!match || !tokens.has(match[1])) return next.replace(/\s+/g, ' ').trim()
    current = next.replace(match[0], tokens.get(match[1]))
  }
  throw new Error(`Token reference does not settle: ${value}`)
}

function toRgba(colour) {
  const text = colour.trim().toLowerCase()
  if (text.startsWith('#')) {
    const body = text.slice(1)
    if (!/^[0-9a-f]{3,8}$/.test(body)) return null
    const wide = body.length <= 4 ? body.split('').map((char) => char + char).join('') : body
    return [
      Number.parseInt(wide.slice(0, 2), 16),
      Number.parseInt(wide.slice(2, 4), 16),
      Number.parseInt(wide.slice(4, 6), 16),
      wide.length === 8 ? Number.parseInt(wide.slice(6, 8), 16) / 255 : 1,
    ]
  }
  const match = text.match(/^rgba?\(([^)]+)\)$/)
  if (!match) return null
  const parts = match[1].split(',').map((part) => Number.parseFloat(part.trim()))
  if (parts.length < 3 || parts.some(Number.isNaN)) return null
  return [parts[0], parts[1], parts[2], parts.length > 3 ? parts[3] : 1]
}

/** color-mix(in srgb, C P%, transparent) is C carried at alpha P/100. */
function flattenColorMix(value) {
  let result = value
  let start = result.indexOf('color-mix(')
  while (start !== -1) {
    const end = callEnd(result, start, 'color-mix(')
    const args = splitTopLevel(result.slice(start + 'color-mix('.length, end)).map((arg) => arg.trim())
    const [space, first, second] = args
    if (space !== 'in srgb' || second !== 'transparent') return result
    const [colour, percent] = first.split(/\s+/)
    const rgba = toRgba(colour)
    if (!rgba) return result
    const alpha = Number.parseFloat(percent) / 100
    result = `${result.slice(0, start)}rgba(${rgba[0]},${rgba[1]},${rgba[2]},${alpha})${result.slice(end + 1)}`
    start = result.indexOf('color-mix(')
  }
  return result
}

/** Canonical form so #fff, #ffffff and rgba(255,255,255,1) compare equal. */
function normalise(value) {
  const flat = flattenColorMix(value.trim().toLowerCase()).replace(/\s+/g, ' ').trim()
  return flat
    .split(' ')
    .map((part) => {
      const rgba = toRgba(part)
      return rgba ? `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${rgba[3]})` : part
    })
    .join(' ')
}

/** Flat list of { selector, property, value } in source order. */
function parseRules(css) {
  const rules = []
  for (const [, selectors, body] of stripComments(css).matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const targets = selectors.split(',').map((one) => one.replace(/\s+/g, ' ').trim()).filter(Boolean)
    for (const selector of targets) {
      for (const declaration of body.split(';')) {
        const colon = declaration.indexOf(':')
        if (colon === -1) continue
        const property = declaration.slice(0, colon).trim()
        const value = declaration.slice(colon + 1).replace(/\s+/g, ' ').trim()
        if (!property || property.startsWith('--') || !value) continue
        rules.push({ selector, property, value })
      }
    }
  }
  return rules
}

/** selector -> property -> value, last declaration winning, as the cascade does. */
function declarationIndex(rules) {
  const index = new Map()
  for (const { selector, property, value } of rules) {
    if (!index.has(selector)) index.set(selector, new Map())
    index.get(selector).set(property, value)
  }
  return index
}

function componentIndex() {
  const rules = []
  for (const name of COMPONENTS) {
    rules.push(...parseRules(readFileSync(path.join(REPO_ROOT, 'src', 'components', name, `${name}.css`), 'utf8')))
  }
  return declarationIndex(rules)
}

/** The colour a component declares, reaching into the border shorthand when needed. */
function componentValue(declarations, property) {
  if (declarations.has(property)) return declarations.get(property)
  if (property === 'border-color' && declarations.has('border')) {
    const parts = declarations.get('border').split(' ')
    return parts[parts.length - 1]
  }
  return undefined
}

/** The dark branch of every light-dark() in a value. */
function darkBranches(value) {
  const branches = []
  let rest = value
  let start = rest.indexOf('light-dark(')
  while (start !== -1) {
    const { args, end } = lightDarkArgs(rest, start)
    branches.push(args[1])
    rest = rest.slice(end + 1)
    start = rest.indexOf('light-dark(')
  }
  return branches
}

describe('component theme overrides', () => {
  const tokens = loadTokenMap()
  const overrides = parseRules(readFileSync(OVERRIDES, 'utf8'))
  const components = componentIndex()

  it('declares overrides at all', () => {
    expect(overrides.length).toBeGreaterThan(0)
  })

  it('scopes every selector to :root so bundle order cannot decide the cascade', () => {
    expect(overrides.filter((rule) => !rule.selector.startsWith(':root ')).map((rule) => rule.selector)).toEqual([])
  })

  it('targets only selectors the six component stylesheets declare', () => {
    const unknown = overrides
      .map((rule) => rule.selector.replace(/^:root /, ''))
      .filter((selector) => !components.has(selector))
    expect([...new Set(unknown)]).toEqual([])
  })

  it('leaves the light theme exactly as the components declare it', () => {
    const drift = []
    for (const rule of overrides) {
      const selector = rule.selector.replace(/^:root /, '')
      const declared = componentValue(components.get(selector) ?? new Map(), rule.property)
      if (declared === undefined) {
        drift.push(`${selector} { ${rule.property} } is not declared by the component`)
        continue
      }
      const ours = normalise(resolveLight(rule.value, tokens))
      const theirs = normalise(resolveLight(declared, tokens))
      if (ours !== theirs) drift.push(`${selector} { ${rule.property} }: component ${theirs}, override ${ours}`)
    }
    expect(drift).toEqual([])
  })

  it('takes every dark value from a token rather than a literal', () => {
    const literals = []
    for (const rule of overrides) {
      for (const branch of darkBranches(rule.value)) {
        if (!branch.includes('var(--medo-')) literals.push(`${rule.selector} { ${rule.property} }: ${branch}`)
      }
    }
    expect(literals).toEqual([])
  })

  it('resolves every dark value to a colour from the brand palette', () => {
    const palette = new Set(
      [...tokens.entries()]
        .filter(([name]) => name.startsWith('medo-color-'))
        .map(([, value]) => normalise(value)),
    )
    const foreign = []
    for (const rule of overrides) {
      for (const branch of darkBranches(rule.value)) {
        const resolved = normalise(resolveDark(branch, tokens))
        if (!palette.has(resolved)) foreign.push(`${rule.selector} { ${rule.property} }: ${branch} -> ${resolved}`)
      }
    }
    expect(foreign).toEqual([])
  })
})

/** Replace every light-dark(a, b) with its dark branch, then resolve tokens. */
function resolveDark(value, tokens) {
  let current = value
  for (let pass = 0; pass < 64; pass += 1) {
    let next = current
    let start = next.indexOf('light-dark(')
    while (start !== -1) {
      const { args, end } = lightDarkArgs(next, start)
      next = next.slice(0, start) + args[1] + next.slice(end + 1)
      start = next.indexOf('light-dark(')
    }
    const match = next.match(VAR_REFERENCE)
    if (!match || !tokens.has(match[1])) return next.replace(/\s+/g, ' ').trim()
    current = next.replace(match[0], tokens.get(match[1]))
  }
  throw new Error(`Token reference does not settle: ${value}`)
}
