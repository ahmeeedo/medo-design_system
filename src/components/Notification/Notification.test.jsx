/* Der Akzent wird je Meldungsart inline vergeben, und keine CSS-Klasse benennt
   die Art — ein Stylesheet konnte die Farbe deshalb nicht nach Art
   unterscheiden und nicht überschreiben. Erst ein eigenes Token macht die
   neutrale Art theme-fähig.

   Gemessen: --medo-color-stone-700 lag im dunklen Theme bei 1,52:1 auf der
   Meldungsfläche. --medo-accent-neutral erreicht dort 12,75:1, im hellen
   Theme bleibt der Wert bei 8,4:1 unverändert. */
import { act, render, screen } from '@testing-library/react'

import { Notification, ToastHost, toast } from './Notification'
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

})

/* Fall B: die Bedienzustandsfarbe hatte zwei entgegengesetzte Aufgaben — als
   Fuellflaeche unter dunkler Schrift und als Akzentschrift auf der hellen
   Meldungsflaeche. Die Leuchtdichte-Fenster ueberschneiden sich nicht, kein
   Farbwert erfuellt beides. Deshalb ein eigenes Akzent-Token.

   Gemessen im hellen Theme, auf der Meldungsflaeche der Warnung: der
   Aktionstext lag bei 2,18:1 und erreicht jetzt 5,71:1; im Toast auf der
   Overlay-Flaeche 2,35:1 auf 6,14:1. Die Werte davor waren schlechter als
   urspruenglich erhoben, weil Fall B die Bedienzustandsfarbe aufgehellt hat
   und die Komponente sie noch als Vordergrund benutzte. */
describe('Notification · Akzente der vier Statusfarben', () => {
  const arten = [
    ['info', '--medo-info-accent'],
    ['success', '--medo-success-accent'],
    ['warning', '--medo-warning-accent'],
    ['error', '--medo-error-accent'],
  ]

  it.each(arten)('faerbt %s ueber sein Akzent-Token', (kind, token) => {
    render(
      <Notification kind={kind} title="Titel" action={{ label: 'Aktion' }}>
        Text
      </Notification>,
    )

    expect(document.querySelector('.medo-nt__icon').getAttribute('style')).toContain(`var(${token})`)
    expect(screen.getByRole('button', { name: 'Aktion' }).getAttribute('style')).toContain(`var(${token})`)
  })

  it.each(arten)('benutzt fuer %s nicht mehr die Bedienzustandsfarbe', (kind) => {
    render(<Notification kind={kind} title="Titel">Text</Notification>)

    expect(document.querySelector('.medo-nt__icon').getAttribute('style'))
      .not.toMatch(/-solid-hover\)/)
  })

  /* Der Randstreifen der Kurzmeldung traegt denselben Akzent — und in einer
     Laengsform, weil Kurzformen mit var()-Werten stumm unvollstaendig
     ankommen. */
  it.each(arten)('faerbt den Randstreifen der Kurzmeldung fuer %s mit', (kind, token) => {
    render(<ToastHost />)
    act(() => { toast({ kind, title: 'Titel' }) })

    const streifen = document.querySelector('.medo-toast').getAttribute('style')
    expect(streifen).toContain(`var(${token})`)
    expect(streifen).toMatch(/border-left-color:/)
  })

  /* Keine der vier darf ein Sonderfall sein: alle vier Rollen sind nach
     demselben Muster gebaut und tragen ein Paar. */
  it('haelt alle vier Akzente auf demselben Muster', () => {
    for (const [, token] of arten) {
      const pair = themePair(token)
      expect(pair, `${token} fehlt in medo-theme.css`).toBeTruthy()
      expect(pair.light.value).not.toBe(pair.dark.value)
    }
  })
})
