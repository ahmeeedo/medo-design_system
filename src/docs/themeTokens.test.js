import { readFileSync } from 'node:fs'
import { buildThemeTokens, pairFrom, splitTopLevel, themePair } from './themeTokens'
import { SEMANTIC_GROUPS } from './tokens'

/* Fed from disk so the parsing is checked against the files themselves,
   independent of how the bundler hands them over. */
const tokens = buildThemeTokens(
  readFileSync('src/styles/medo-theme.css', 'utf8'),
  readFileSync('src/styles/medo/brand-colors.css', 'utf8'),
)

const pair = (name) => pairFrom(tokens, `--medo-${name}`)

describe('splitTopLevel', () => {
  it('leaves commas inside brackets alone', () => {
    expect(splitTopLevel('rgba(23, 21, 19, 0.5), rgba(0, 0, 0, 0.5)')).toEqual([
      'rgba(23, 21, 19, 0.5)',
      'rgba(0, 0, 0, 0.5)',
    ])
  })
})

describe('themeTokens', () => {
  it('covers every token the semantic page lists', () => {
    const missing = SEMANTIC_GROUPS.flatMap((group) =>
      group.tokens.filter((entry) => !pair(entry.name)).map((entry) => entry.name),
    )

    expect(missing).toEqual([])
  })

  it('reads both branches of a token that points at brand steps', () => {
    expect(pair('surface')).toEqual({
      light: { value: '#ffffff', ref: 'white' },
      dark: { value: '#24221e', ref: 'stone-1000' },
    })
  })

  it('separates overlay from surface, which only the dark theme does', () => {
    expect(pair('overlay').light.value).toBe(pair('surface').light.value)
    expect(pair('overlay').dark.ref).toBe('stone-900')
    expect(pair('surface').dark.ref).toBe('stone-1000')
  })

  it('traces a colour written with alpha back to its step', () => {
    expect(pair('text-muted')).toEqual({
      light: { value: '#24221ead', ref: 'stone-1000 @ 68 %' },
      dark: { value: '#f7f7f6ad', ref: 'stone-50 @ 68 %' },
    })
  })

  it('traces the rgba-notated scrim as well', () => {
    expect(pair('scrim').light.ref).toBe('stone-1100 @ 50 %')
  })

  it('leaves the elevation tokens out, which nest light-dark inside the value', () => {
    expect(pair('shadow-md')).toBeNull()
  })

  /* The module wires itself from ?raw imports. Those come back empty when the
     test run has CSS processing switched off, which takes the semantic page
     down with it — so the wiring is asserted, not just the parsing. */
  it('is wired to the stylesheets it imports', () => {
    expect(themePair('--medo-surface')).toEqual({
      light: { value: '#ffffff', ref: 'white' },
      dark: { value: '#24221e', ref: 'stone-1000' },
    })
  })
})
