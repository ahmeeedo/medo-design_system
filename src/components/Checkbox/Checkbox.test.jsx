import { render, screen } from '@testing-library/react'
import { Checkbox } from './Checkbox'

/* Template: der Fehlerzustand der Komponente gewinnt, ein eigenes aria-invalid ohne
   error aber schon. Bei Checkbox und Radio ist `error` ein boolean, sonst eine
   Zeichenkette — die Schreibweise bleibt in beiden Faellen dieselbe. */

describe('Checkbox · uebergebenes aria-invalid', () => {
  it('laesst den eigenen Fehlerzustand vor einem uebergebenen aria-invalid stehen', () => {
    render(<Checkbox label="Einverstanden" error aria-invalid="false" />)

    expect(screen.getByRole('checkbox', { name: 'Einverstanden' })).toHaveAttribute(
      'aria-invalid',
      'true'
    )
  })

  it('reicht ein uebergebenes aria-invalid durch, solange kein Fehler gesetzt ist', () => {
    render(<Checkbox label="Einverstanden" aria-invalid="true" />)

    expect(screen.getByRole('checkbox', { name: 'Einverstanden' })).toHaveAttribute(
      'aria-invalid',
      'true'
    )
  })

  it('setzt ohne beides gar kein aria-invalid', () => {
    render(<Checkbox label="Einverstanden" />)

    expect(screen.getByRole('checkbox', { name: 'Einverstanden' })).not.toHaveAttribute(
      'aria-invalid'
    )
  })
})
