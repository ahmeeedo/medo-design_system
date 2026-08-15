/* Reads the token layers from src/styles/medo/ and resolves var() chains.
   These files are read-only mirrors of design-reference/tokens/ — nothing here
   ever writes to them. */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const here = path.dirname(fileURLToPath(import.meta.url))
export const REPO_ROOT = path.resolve(here, '..', '..')
const TOKEN_DIR = path.join(REPO_ROOT, 'src', 'styles', 'medo')

const DECLARATION = /--([\w-]+)\s*:\s*([^;]+);/g
const VAR_REFERENCE = /var\(\s*--([\w-]+)\s*\)/

function parseDeclarations(fileName) {
  const css = readFileSync(path.join(TOKEN_DIR, fileName), 'utf8')
  const entries = []
  for (const [, name, value] of css.matchAll(DECLARATION)) {
    entries.push([name, value.trim()])
  }
  return entries
}

function buildResolver(map) {
  return function resolve(value, seen = new Set()) {
    let current = value
    let match = current.match(VAR_REFERENCE)
    while (match) {
      const name = match[1]
      if (seen.has(name)) throw new Error(`Circular token reference at --${name}`)
      seen.add(name)
      const replacement = map.get(name)
      if (replacement === undefined) throw new Error(`Unknown token --${name}`)
      current = current.replace(match[0], replacement)
      match = current.match(VAR_REFERENCE)
    }
    return current.trim()
  }
}

/**
 * @returns {{
 *   raw: Map<string,string>,          every declaration as written
 *   resolve: (value: string) => string,
 *   semantic: Array<[string,string]>, semantic layer in file order
 *   shadows: Array<[string,string]>,  elevation layer in file order
 *   light: (name: string) => string,  resolved value of a semantic token
 * }}
 */
export function loadTokens() {
  const raw = new Map()
  for (const file of ['brand-colors.css', 'alias-colors.css', 'semantic-colors.css', 'elevation.css']) {
    for (const [name, value] of parseDeclarations(file)) raw.set(name, value)
  }

  const resolve = buildResolver(raw)
  const semantic = parseDeclarations('semantic-colors.css')
  const shadows = parseDeclarations('elevation.css')

  return {
    raw,
    resolve,
    semantic,
    shadows,
    light: (name) => resolve(raw.get(name)),
  }
}

/** Resolve a brand step name like "stone-700" to its hex value. */
export function brand(tokens, step) {
  const value = tokens.raw.get(`medo-color-${step}`)
  if (value === undefined) throw new Error(`Unknown brand step ${step}`)
  return value
}
