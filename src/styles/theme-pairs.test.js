/* Records the light/dark pair relation of every semantic token.

   medo-theme.css states each semantic token as a light-dark() pair. Most roles
   carry a different value per theme; a few carry the same one on purpose. That
   distinction is design intent, and nothing in the build enforces it: equalise
   a pair that was meant to differ, or spread one that was meant to match, and
   the app still compiles, still renders, still passes every other test.

   This test holds the relation, not the values. A role moving from teal-600 to
   teal-700 to clear a contrast threshold keeps the relation "different" and
   stays green here — that kind of change is expected and must not be blocked.
   Only a flipped relation fails, and it fails naming the role.

   Deliberate flips are legitimate. When one happens, move the role in or out of
   ALIKE below and say why in the comment. The test is a tripwire, not a lock. */

import { describe, it, expect } from 'vitest'

import { loadTokens } from '../../scripts/contrast/tokens.mjs'

/* The roles that carry one value in both themes.

   The first four are the disabled and strong-border greys: stone-500 sits far
   enough from both extremes to read as "switched off" on white and on
   stone-1000 alike, so splitting the pair would buy nothing and cost the
   shared meaning.

   The last two are alike for a different reason — they sit on a ground that
   does not flip. The toggle knob is white in every theme and the slider fill
   is a teal in every theme, so a mark on either keeps one value. Splitting
   them would make the mark follow a theme its background never follows. */
const ALIKE = [
  'medo-text-disabled',
  'medo-icon-disabled',
  'medo-border-strong',
  'medo-action-text-disabled',
  'medo-icon-on-light',
  'medo-control-mark-on-primary',
]

describe('Hell/Dunkel-Paare der Semantic-Ebene', () => {
  const tokens = loadTokens()

  /* Expected names come from the mirror under src/styles/medo/, not from a list
     kept here — a token added or dropped there surfaces by name instead of as a
     count that no longer adds up. */
  const expectedNames = [
    ...tokens.semantic.map(([name]) => name),
    ...tokens.shadows.map(([name]) => name),
  ]
  const declaredNames = tokens.themeOrder.map(([name]) => name)

  it('deklariert genau die Rollen, die der Spiegel kennt', () => {
    const missing = expectedNames.filter((name) => !declaredNames.includes(name))
    const extra = declaredNames.filter((name) => !expectedNames.includes(name))
    expect(missing, 'im Spiegel deklariert, in medo-theme.css nicht').toEqual([])
    expect(extra, 'in medo-theme.css deklariert, im Spiegel nicht').toEqual([])
  })

  it('haelt jede Rolle auf ihrer Paarbeziehung', () => {
    const flipped = declaredNames
      .map((name) => {
        const alike = tokens.light(name) === tokens.dark(name)
        const shouldBeAlike = ALIKE.includes(name)
        if (alike === shouldBeAlike) return null
        return shouldBeAlike
          ? `--${name}: erwartet in beiden Themes gleich, ist verschieden (hell ${tokens.light(name)}, dunkel ${tokens.dark(name)})`
          : `--${name}: erwartet in beiden Themes verschieden, ist gleich (${tokens.light(name)})`
      })
      .filter(Boolean)
    expect(flipped).toEqual([])
  })

  it('fuehrt jede Rolle aus ALIKE auch wirklich in der Datei', () => {
    const unknown = ALIKE.filter((name) => !declaredNames.includes(name))
    expect(unknown, 'in ALIKE gefuehrt, aber nicht deklariert').toEqual([])
  })

  /* The tally the pattern was recorded at. Counts come from the parsed token
     list, never from splitting the stylesheet text: token names of one block are
     prefixes of each other, so a text count reads quietly high. */
  it('zaehlt die Paare wie bei der Aufnahme des Musters', () => {
    const alike = declaredNames.filter((name) => tokens.light(name) === tokens.dark(name))
    expect(alike).toHaveLength(6)
    expect(declaredNames.filter((name) => !alike.includes(name))).toHaveLength(84)
  })
})
