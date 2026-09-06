import { render, screen } from '@testing-library/react'
import { Radio } from './Radio'

/* Template: wie bei Checkbox — `error` ist hier ein boolean, die Schreibweise der
   Zusammenfuehrung bleibt dieselbe. */

describe('Radio · uebergebenes aria-invalid', () => {
  it('laesst den eigenen Fehlerzustand vor einem uebergebenen aria-invalid stehen', () => {
    render(<Radio label="Monatlich" error aria-invalid="false" />)

    expect(screen.getByRole('radio', { name: 'Monatlich' })).toHaveAttribute('aria-invalid', 'true')
  })

  it('reicht ein uebergebenes aria-invalid durch, solange kein Fehler gesetzt ist', () => {
    render(<Radio label="Monatlich" aria-invalid="true" />)

    expect(screen.getByRole('radio', { name: 'Monatlich' })).toHaveAttribute('aria-invalid', 'true')
  })

  it('setzt ohne beides gar kein aria-invalid', () => {
    render(<Radio label="Monatlich" />)

    expect(screen.getByRole('radio', { name: 'Monatlich' })).not.toHaveAttribute('aria-invalid')
  })
})
