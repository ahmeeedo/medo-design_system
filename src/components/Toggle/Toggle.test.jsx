/* Der Griff des Schalters ist in beiden Themes weiß. Das Symbol darauf muss
   deshalb in beiden Themes dunkel bleiben — jede andere Icon-Rolle kippt im
   dunklen Theme ins Helle und wäre auf dem weißen Griff unsichtbar. Genau
   dafür trägt --medo-icon-on-light in beiden Zweigen denselben Wert. */
import { render } from '@testing-library/react'

import { Toggle } from './Toggle'
import { themePair } from '../../docs/themeTokens'

const iconStyle = (container) => container.querySelector('.medo-icon').getAttribute('style')

describe('Toggle · Symbolfarbe', () => {
  it('nimmt im Aus-Zustand das Token fuer den hellen Grund', () => {
    const { container } = render(<Toggle label="Benachrichtigungen" />)

    expect(iconStyle(container)).toContain('var(--medo-icon-on-light)')
    expect(iconStyle(container)).not.toMatch(/--medo-color-/)
  })

  it('nimmt im An-Zustand die Aktionsfarbe', () => {
    const { container } = render(<Toggle label="Benachrichtigungen" defaultChecked />)

    expect(iconStyle(container)).toContain('var(--medo-action)')
  })

  /* Der Beleg, dass die Korrektur trägt: der Grund wechselt nicht mit, also
     darf es die Farbe auch nicht. Ein gespaltenes Paar hiesse, das Symbol
     folgte einem Theme, dem sein Untergrund nicht folgt. */
  it('haelt das Token in beiden Themes auf einem Wert', () => {
    const pair = themePair('--medo-icon-on-light')

    expect(pair).toBeTruthy()
    expect(pair.light.value).toBe(pair.dark.value)
  })

  /* Kurzformen mit var()-Werten kommen unvollstaendig an. Die Kante des
     Laderings steht deshalb in Laengsformen; border-top-color bleibt durch das
     !important im Stylesheet transparent. */
  it('setzt die Kante des Laderings in Laengsformen', () => {
    const { container } = render(<Toggle label="Standort" loading />)
    const style = container.querySelector('.medo-tg__spin').getAttribute('style')

    expect(style).toMatch(/border-top-color:/)
    expect(style).toMatch(/border-right-color:/)
    expect(style).toMatch(/border-bottom-color:/)
    expect(style).toMatch(/border-left-color:/)
    expect(style).not.toMatch(/(^|;)\s*border-color:/)
  })
})
