/* Die Teilstriche werden als Inline-Stil gesetzt, nicht über eine Klasse.
   Inline-Stile schlagen jedes Stylesheet, deshalb erreichte sie keine
   nachgelagerte Theme-Datei — die Farbe musste ins Token wandern.

   Geprüft wird das gerenderte Attribut, weil jsdom var() nicht auflöst. */
import { render } from '@testing-library/react'

import { Slider } from './Slider'

function tickStyles(container) {
  return [...container.querySelectorAll('.medo-sl__tick')].map((el) => el.getAttribute('style'))
}

describe('Slider · Teilstriche', () => {
  it('faerbt gefuellte und ungefuellte Striche ueber die Marken-Token', () => {
    const { container } = render(
      <Slider showTicks min={0} max={4} step={1} defaultValue={2} ariaLabel="Wert" />,
    )
    const styles = tickStyles(container)

    expect(styles).toHaveLength(5)
    /* Bis einschliesslich des Werts liegen die Striche auf der Fuellung, danach
       auf der leeren Bahn. */
    expect(styles.slice(0, 3).every((s) => s.includes('var(--medo-control-mark-on-primary)'))).toBe(true)
    expect(styles.slice(3).every((s) => s.includes('var(--medo-control-mark)'))).toBe(true)
  })

  it('setzt keine Brand-Stufe und keinen festen Farbwert mehr inline', () => {
    const { container } = render(
      <Slider showTicks min={0} max={4} step={1} defaultValue={2} ariaLabel="Wert" />,
    )

    for (const style of tickStyles(container)) {
      expect(style).not.toMatch(/--medo-color-/)
      expect(style).not.toMatch(/rgba?\(/)
    }
  })

  /* Kurzformen mit var()-Werten kommen unvollstaendig an, und der Fehler ist
     stumm — deshalb steht die Farbe in der Laengsform. */
  it('setzt die Farbe als background-color, nicht als background-Kurzform', () => {
    const { container } = render(
      <Slider showTicks min={0} max={4} step={1} defaultValue={2} ariaLabel="Wert" />,
    )

    for (const style of tickStyles(container)) {
      expect(style).toMatch(/background-color:/)
      expect(style).not.toMatch(/(^|;)\s*background:/)
    }
  })

  it('faerbt bei senkrechter Ausrichtung nach derselben Regel', () => {
    const { container } = render(
      <Slider
        showTicks
        orientation="vertical"
        min={0}
        max={2}
        step={1}
        defaultValue={0}
        ariaLabel="Wert"
      />,
    )
    const styles = tickStyles(container)

    expect(styles).toHaveLength(3)
    expect(styles[0]).toContain('var(--medo-control-mark-on-primary)')
    expect(styles[1]).toContain('var(--medo-control-mark)')
    expect(styles.every((s) => s.includes('background-color:'))).toBe(true)
  })
})
