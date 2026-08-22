import themeCss from '../styles/medo-theme.css?raw'
import brandCss from '../styles/medo/brand-colors.css?raw'

/* Both themes of a semantic token, read out of the stylesheets themselves.

   The browser only ever resolves the theme it is painting, so the other half
   cannot be read back from the DOM. The pairs are therefore parsed from
   medo-theme.css — the same file the theme layer loads, so the page cannot
   drift from what is rendered. The brand scales are theme-invariant, which is
   what lets a branch be traced back to the step it points at instead of the
   step being written down a second time.

   scripts/contrast/tokens.mjs does the same parsing for the contrast check,
   but is bound to node:fs and read by a test file outside this task's reach,
   so the browser-side twin lives here. */

const DECLARATION = /--([\w-]+)\s*:\s*([^;]+);/g
const VAR_ONLY = /^var\(\s*--([\w-]+)\s*\)$/
const BRAND_PREFIX = 'medo-color-'

function declarations(css) {
  return [...css.matchAll(DECLARATION)].map(([, name, value]) => [
    name,
    value.replace(/\s+/g, ' ').trim(),
  ])
}

/** Split on commas that are not inside parentheses, so rgba() survives. */
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

/* Only a declaration that is entirely one light-dark() pair, which is every
   colour of the semantic layer. The elevation tokens carry light-dark() nested
   inside the shadow value instead and are deliberately left out: they are
   documented on the foundations page, not here. */
function branchesOf(declared) {
  if (!declared.startsWith('light-dark(')) return null
  const inner = declared.slice('light-dark('.length, declared.lastIndexOf(')'))
  const parts = splitTopLevel(inner)
  return parts.length === 2 ? parts : null
}

/* Kept separate from the imports above so a test can feed it the same two
   files read from disk: under vitest a ?raw import of CSS yields an empty
   string, and the parsing is the part worth proving. */
export function buildThemeTokens(themeSource, brandSource) {
  const brand = new Map(declarations(brandSource))

  const stepByColor = new Map()
  for (const [name, value] of brand) {
    if (!name.startsWith(BRAND_PREFIX)) continue
    const key = value.toLowerCase()
    if (!stepByColor.has(key)) stepByColor.set(key, name.slice(BRAND_PREFIX.length))
  }

  const pairs = new Map()
  for (const [name, declared] of declarations(themeSource)) {
    const branches = branchesOf(declared)
    if (branches) pairs.set(name, branches)
  }

  return { brand, stepByColor, pairs }
}

const TOKENS = buildThemeTokens(themeCss, brandCss)

/** A colour split into its rgb part and its alpha, or null if it is neither. */
function colorParts(value) {
  const hex = value.match(/^#([0-9a-f]{6})([0-9a-f]{2})?$/i)
  if (hex) {
    return {
      rgb: `#${hex[1].toLowerCase()}`,
      alpha: hex[2] ? parseInt(hex[2], 16) / 255 : 1,
    }
  }
  const fn = value.match(/^rgba?\(([^)]+)\)$/i)
  if (!fn) return null
  const parts = splitTopLevel(fn[1])
  if (parts.length < 3) return null
  const channel = (part) => Number(part).toString(16).padStart(2, '0')
  return {
    rgb: `#${channel(parts[0])}${channel(parts[1])}${channel(parts[2])}`,
    alpha: parts[3] === undefined ? 1 : Number(parts[3]),
  }
}

function valueOf(tokens, branch) {
  const named = branch.match(VAR_ONLY)
  if (!named) return branch
  return tokens.brand.get(named[1]) ?? branch
}

/* The step a branch points at. A var() names it outright; a literal is traced
   back through the theme-invariant scales, which is what carries the five
   tokens written as a colour with alpha. */
function refOf(tokens, branch) {
  const named = branch.match(VAR_ONLY)
  if (named) return named[1].replace(BRAND_PREFIX, '')

  const parts = colorParts(branch)
  if (!parts) return null
  const step = tokens.stepByColor.get(parts.rgb)
  if (!step) return null
  return parts.alpha === 1 ? step : `${step} @ ${Math.round(parts.alpha * 100)} %`
}

/** Both themes of a token, or null when it is not themed. */
export function pairFrom(tokens, token) {
  const branches = tokens.pairs.get(token.replace(/^--/, ''))
  if (!branches) return null
  return {
    light: { value: valueOf(tokens, branches[0]), ref: refOf(tokens, branches[0]) },
    dark: { value: valueOf(tokens, branches[1]), ref: refOf(tokens, branches[1]) },
  }
}

export const themePair = (token) => pairFrom(TOKENS, token)

export const isThemed = (token) => TOKENS.pairs.has(token.replace(/^--/, ''))
