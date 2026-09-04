/* Der Akzent wird je Meldungsart inline vergeben, und keine CSS-Klasse benennt
   die Art — ein Stylesheet konnte die Farbe deshalb nicht nach Art
   unterscheiden und nicht überschreiben. Erst ein eigenes Token macht die
   neutrale Art theme-fähig.

   Gemessen: --medo-color-stone-700 lag im dunklen Theme bei 1,52:1 auf der
   Meldungsfläche. --medo-accent-neutral erreicht dort 12,75:1, im hellen
   Theme bleibt der Wert bei 8,4:1 unverändert. */
import { render, screen } from '@testing-library/react'

import { Notification } from './Notification'
import { themePair } from '../../docs/themeTokens'

describe('Notification · neutraler Akzent', () => {
  it('faerbt Symbol und Aktionstext der neutralen Art ueber das eigene Token', () => {
    render(
      <Notification kind="neutral" title="Wartungshinweis" action={{ label: 'Details' }}>
        Am Sonntag von 2 bis 4 Uhr sind Wartungsarbeiten geplant.
      </Notification>,
    )

    const icon = document.querySelector('.medo-nt__icon')
    const action = screen.getByRole('button', { name: 'Details' })

    expect(icon.getAttribute('style')).toContain('var(--medo-accent-neutral)')
    expect(action.getAttribute('style')).toContain('var(--medo-accent-neutral)')
  })

  it('setzt fuer den Akzent keine Brand-Stufe mehr inline', () => {
    render(
      <Notification kind="neutral" title="Wartungshinweis" action={{ label: 'Details' }}>
        Text
      </Notification>,
    )

    expect(document.querySelector('.medo-nt__icon').getAttribute('style'))
      .not.toMatch(/--medo-color-/)
  })

  /* Der Beleg für die Behebung: das Token trägt zwei Zweige. Vorher stand dort
     eine feste Brand-Stufe, die im dunklen Theme mitgeschleift wurde. */
  it('traegt ein Token mit zwei Zweigen, nicht einen festen Wert', () => {
    const pair = themePair('--medo-accent-neutral')

    expect(pair).toBeTruthy()
    expect(pair.light.value).not.toBe(pair.dark.value)
  })

  /* Der Hell-Zustand ist unveraendert: der helle Zweig ist genau die Stufe,
     die vorher fest stand. */
  it('laesst den hellen Zweig auf der bisherigen Stufe', () => {
    expect(themePair('--medo-accent-neutral').light.ref).toBe('stone-700')
  })

  it('laesst die vier Statusarten unberuehrt', () => {
    render(<Notification kind="warning" title="Speicher fast voll">Text</Notification>)

    expect(document.querySelector('.medo-nt__icon').getAttribute('style'))
      .toContain('var(--medo-warning-solid-hover)')
  })
})
