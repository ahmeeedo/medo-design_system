/* Reads the token layers and resolves them for a given theme.

   Two sources, with different jobs:
   - src/styles/medo/ is the untouched mirror of design-reference/tokens/ and
     holds the brand scales plus the light semantic values. Read only.
   - src/styles/medo-theme.css restates every semantic token as a light/dark
     pair and is the single source of truth for the dark values. The contrast
     check reads this file, so it cannot drift from what the browser renders. */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const here = path.dirname(fileURLToPath(import.meta.url))
export const REPO_ROOT = path.resolve(here, '..', '..')
const TOKEN_DIR = path.join(REPO_ROOT, 'src', 'styles', 'medo')
export const THEME_FILE = path.join(REPO_ROOT, 'src', 'styles', 'medo-theme.css')

const DECLARATION = /--([\w-]+)\s*:\s*([^;]+);/g
const VAR_REFERENCE = /var\(\s*--([\w-]+)\s*\)/

function parseDeclarations(filePath) {
  const css = readFileSync(filePath, 'utf8')
  const entries = []
  for (const [, name, value] of css.matchAll(DECLARATION)) {
    entries.push([name, value.replace(/\s+/g, ' ').trim()])
  }
  return entries
}

/** Split on commas that are not inside parentheses. */
export function splitTopLevel(value) {
  const parts = []
  let depth = 0
  let current = ''
  for (const char of value) {
    if (char === '(') depth += 1
    else if (char === ')') depth -= 1
    else if (char === ',' && depth === 0) {
      parts.push(current.trim())
      current = ''
      continue
    }
    current += char
  }
  parts.push(current.trim())
  return parts
}

/** Replace every light-dark(a, b) with the branch this theme uses. */
function pickBranch(value, mode) {
  const marker = 'light-dark('
  let result = value
  let start = result.indexOf(marker)
  while (start !== -1) {
    let depth = 0
    let end = -1
    for (let i = start + marker.length - 1; i < result.length; i += 1) {
      if (result[i] === '(') depth += 1
      else if (result[i] === ')') {
        depth -= 1
        if (depth === 0) {
          end = i
          break
        }
      }
    }
    if (end === -1) throw new Error(`Unclosed light-dark() in: ${value}`)
    const args = splitTopLevel(result.slice(start + marker.length, end))
    if (args.length !== 2) {
      throw new Error(`light-dark() needs exactly two arguments, got ${args.length} in: ${value}`)
    }
    result = result.slice(0, start) + args[mode === 'dark' ? 1 : 0] + result.slice(end + 1)
    start = result.indexOf(marker)
  }
  return result
}

function buildResolver(map) {
  return function resolve(value, mode = 'light') {
    let current = value
    for (let pass = 0; pass < 32; pass += 1) {
      const next = pickBranch(current, mode)
      const match = next.match(VAR_REFERENCE)
      if (!match) return next.replace(/\s+/g, ' ').trim()
      const replacement = map.get(match[1])
      if (replacement === undefined) throw new Error(`Unknown token --${match[1]}`)
      current = next.replace(match[0], replacement)
    }
    throw new Error(`Token reference does not settle: ${value}`)
  }
}

/**
 * @returns {{
 *   raw: Map<string,string>,           brand/alias/semantic/elevation as written
 *   theme: Map<string,string>,         medo-theme.css as written
 *   themeOrder: Array<[string,string]> medo-theme.css in file order
 *   semantic: Array<[string,string]>,  semantic-colors.css in file order
 *   shadows: Array<[string,string]>,   elevation.css in file order
 *   resolve: (value: string, mode?: string) => string,
 *   light: (name: string) => string,   from medo-theme.css, light branch
 *   dark: (name: string) => string,    from medo-theme.css, dark branch
 *   mirrorLight: (name: string) => string, from src/styles/medo/, for drift checks
 * }}
 */
export function loadTokens() {
  const raw = new Map()
  for (const file of ['brand-colors.css', 'alias-colors.css', 'semantic-colors.css', 'elevation.css']) {
    for (const [name, value] of parseDeclarations(path.join(TOKEN_DIR, file))) raw.set(name, value)
  }

  const themeOrder = parseDeclarations(THEME_FILE)
  const theme = new Map(themeOrder)
  const resolve = buildResolver(new Map([...raw, ...theme]))

  const fromTheme = (name, mode) => {
    const declared = theme.get(name)
    if (declared === undefined) throw new Error(`--${name} is missing from medo-theme.css`)
    return resolve(declared, mode)
  }

  return {
    raw,
    theme,
    themeOrder,
    semantic: parseDeclarations(path.join(TOKEN_DIR, 'semantic-colors.css')),
    shadows: parseDeclarations(path.join(TOKEN_DIR, 'elevation.css')),
    resolve,
    light: (name) => fromTheme(name, 'light'),
    dark: (name) => fromTheme(name, 'dark'),
    mirrorLight: (name) => resolve(raw.get(name), 'light'),
  }
}

/** Resolve a brand step name like "stone-700" to its hex value. */
export function brand(tokens, step) {
  const value = tokens.raw.get(`medo-color-${step}`)
  if (value === undefined) throw new Error(`Unknown brand step ${step}`)
  return value
}

/** The brand step a theme declaration points at, or null for a literal value. */
export function stepOf(tokens, name, mode) {
  const declared = tokens.theme.get(name)
  if (declared === undefined) return null
  const branch = pickBranch(declared, mode)
  const match = branch.match(/var\(\s*--medo-color-([\w-]+)\s*\)/)
  return match ? match[1] : null
}
