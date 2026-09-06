import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TextInput } from './TextInput'

/* Template: uebergebene Angaben verdraengen das eingebaute Verhalten nicht.
   Die Folge waere stumm: ein eigenes onFocus loeschte den Fokusrahmen, ein eigenes
   aria-describedby machte die Fehlermeldung fuer Vorleseprogramme unauffindbar.
   Nichts bricht, nichts faerbt sich rot — deshalb diese Zusicherungen. */

describe('TextInput · uebergebene Angaben treten hinzu', () => {
  it('laesst ein uebergebenes onFocus zusaetzlich laufen und behaelt den Fokusrahmen', async () => {
    const user = userEvent.setup()
    const onFocus = vi.fn()
    const { container } = render(<TextInput label="Name" onFocus={onFocus} />)

    await user.click(screen.getByRole('textbox', { name: 'Name' }))

    expect(onFocus).toHaveBeenCalledTimes(1)
    expect(container.querySelector('.medo-field__box--focus')).not.toBeNull()
  })

  it('laesst ein uebergebenes onBlur zusaetzlich laufen und nimmt den Fokusrahmen zurueck', async () => {
    const user = userEvent.setup()
    const onBlur = vi.fn()
    const { container } = render(<TextInput label="Name" onBlur={onBlur} />)

    await user.click(screen.getByRole('textbox', { name: 'Name' }))
    await user.tab()

    expect(onBlur).toHaveBeenCalledTimes(1)
    expect(container.querySelector('.medo-field__box--focus')).toBeNull()
  })

  it('haengt ein uebergebenes aria-describedby an die eingebaute Meldung an, statt sie zu kappen', () => {
    render(<TextInput label="Name" error="Bitte einen Namen eintragen" aria-describedby="extern" />)

    const feld = screen.getByRole('textbox', { name: 'Name' })
    const ids = feld.getAttribute('aria-describedby').split(' ')

    expect(ids).toContain('extern')
    expect(ids.some((id) => id.endsWith('-msg'))).toBe(true)
  })

  it('laesst die eingebaute Verknuepfung allein stehen, wenn der Aufrufer nichts uebergibt', () => {
    render(<TextInput label="Name" error="Bitte einen Namen eintragen" />)

    const feld = screen.getByRole('textbox', { name: 'Name' })
    expect(feld.getAttribute('aria-describedby')).toMatch(/-msg$/)
  })

  /* Der Fehlerzustand der Komponente gewinnt; ein eigenes aria-invalid ohne error nicht. */
  it('laesst den eigenen Fehlerzustand vor einem uebergebenen aria-invalid stehen', () => {
    render(<TextInput label="Name" error="Bitte einen Namen eintragen" aria-invalid="false" />)

    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveAttribute('aria-invalid', 'true')
  })

  it('reicht ein uebergebenes aria-invalid durch, solange kein Fehler gesetzt ist', () => {
    render(<TextInput label="Name" aria-invalid="true" />)

    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveAttribute('aria-invalid', 'true')
  })
})
