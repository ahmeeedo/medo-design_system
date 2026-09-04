/* Die Wortmarke ist kein Icon und läuft nicht über die Icon-Komponente. Sie
   trägt ihre Füllungen als SVG-Attribute, damit sie den Themes folgen — als
   <img> eingebunden erreichte sie weder currentColor noch die Tokens.

   Geprüft wird das gerenderte Markup, nicht die Absicht: welche Tokens an den
   fünf Pfaden stehen, und dass diese Tokens überhaupt ein Hell/Dunkel-Paar
   führen. Ohne die zweite Hälfte wäre die erste kein Beleg. */
import { render } from '@testing-library/react'

import { MedoLogo } from './MedoLogo'
import { themePair } from './themeTokens'

function fills(container) {
  return [...container.querySelectorAll('path')].map((p) => p.getAttribute('fill'))
}

describe('MedoLogo', () => {
  it('faerbt Schriftzug und Punkt ueber Tokens, nicht ueber feste Werte', () => {
    const { container } = render(<MedoLogo />)
    const values = fills(container)

    expect(values).toHaveLength(5)
    expect(values.filter((v) => v === 'var(--medo-text)')).toHaveLength(4)
    expect(values.filter((v) => v === 'var(--medo-logo-dot)')).toHaveLength(1)
    expect(values.some((v) => /#[0-9a-f]{3,8}/i.test(v))).toBe(false)
  })

  it('traegt auf dauerhaft dunklem Grund die Stufen, die dort gelten', () => {
    const { container } = render(<MedoLogo inverted />)
    const values = fills(container)

    expect(values.filter((v) => v === 'var(--medo-color-stone-50)')).toHaveLength(4)
    expect(values.filter((v) => v === 'var(--medo-color-teal-500)')).toHaveLength(1)
  })

  /* Der eigentliche Beleg für „rendert in beiden Themes richtig": die beiden
     Tokens des Normalfalls sind Paare, deren Zweige auseinanderliegen. Stünden
     sie auf einem Wert, wäre die Marke in einem der Themes unsichtbar. */
  it('benutzt Tokens, die in beiden Themes verschiedene Werte tragen', () => {
    for (const token of ['--medo-text', '--medo-logo-dot']) {
      const pair = themePair(token)
      expect(pair, `${token} ist kein Theme-Paar`).toBeTruthy()
      expect(pair.light.value).not.toBe(pair.dark.value)
    }
  })
})
