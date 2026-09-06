import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Search } from './Search'

/* Template: uebergebene Angaben treten hinzu, sie ersetzen nicht.
   Bei Search haengt an onKeyDown die Tastaturbedienung des Vorschlagsfelds — ein
   ersetzendes onKeyDown des Aufrufers nimmt sie stumm weg. */

describe('Search · uebergebene Angaben treten hinzu', () => {
  it('laesst ein uebergebenes onFocus zusaetzlich laufen und behaelt den Fokusrahmen', async () => {
    const user = userEvent.setup()
    const onFocus = vi.fn()
    const { container } = render(<Search label="Suche" onFocus={onFocus} />)

    await user.click(screen.getByRole('combobox', { name: 'Suche' }))

    expect(onFocus).toHaveBeenCalledTimes(1)
    expect(container.querySelector('.medo-field__box--focus')).not.toBeNull()
  })

  it('laesst ein uebergebenes onBlur zusaetzlich laufen', async () => {
    const user = userEvent.setup()
    const onBlur = vi.fn()
    render(<Search label="Suche" onBlur={onBlur} />)

    await user.click(screen.getByRole('combobox', { name: 'Suche' }))
    await user.tab()

    expect(onBlur).toHaveBeenCalledTimes(1)
  })

  /* Die eingebaute Bedienung oeffnet das Panel mit der Pfeiltaste. Beides muss laufen. */
  it('laesst ein uebergebenes onKeyDown laufen, ohne die eingebaute Bedienung zu ersetzen', async () => {
    const user = userEvent.setup()
    const onKeyDown = vi.fn()
    render(<Search label="Suche" suggestions={['Krankenversicherung']} onKeyDown={onKeyDown} />)

    const feld = screen.getByRole('combobox', { name: 'Suche' })
    await user.click(feld)
    await user.keyboard('{ArrowDown}')

    expect(onKeyDown).toHaveBeenCalled()
    expect(feld).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('option', { name: /Krankenversicherung/ })).toHaveAttribute(
      'aria-selected',
      'true'
    )
  })

  it('laesst den eigenen Fehlerzustand vor einem uebergebenen aria-invalid stehen', () => {
    render(<Search label="Suche" error="Bitte einen Begriff eingeben" aria-invalid="false" />)

    expect(screen.getByRole('combobox', { name: 'Suche' })).toHaveAttribute('aria-invalid', 'true')
  })

  it('reicht ein uebergebenes aria-invalid durch, solange kein Fehler gesetzt ist', () => {
    render(<Search label="Suche" aria-invalid="true" />)

    expect(screen.getByRole('combobox', { name: 'Suche' })).toHaveAttribute('aria-invalid', 'true')
  })
})
