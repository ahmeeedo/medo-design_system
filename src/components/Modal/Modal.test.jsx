import { useState } from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { Modal } from './Modal'

/* Template: focus management in an overlay that owns its own trap.
   The ported Modal traps Tab itself, remembers the trigger and restores it on
   close, so all four are contract assertions here — unlike a wrapper around a
   third-party dialog, where only the wiring is ours to test. Autofocus runs on
   a 40 ms timer, hence fake timers throughout. */

const advance = (ms) => act(() => { vi.advanceTimersByTime(ms) })

const renderModal = (props = {}) =>
  render(
    <Modal open title="Termin absagen" confirmLabel="Termin absagen" onClose={vi.fn()} {...props}>
      <p>Der Termin wird unwiderruflich entfernt.</p>
    </Modal>
  )

describe('Modal · Fokusverwaltung', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('rendert nichts, solange es geschlossen ist', () => {
    renderModal({ open: false })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('ist über seinen Titel benannt', () => {
    renderModal()
    expect(screen.getByRole('dialog', { name: 'Termin absagen' })).toBeInTheDocument()
  })

  it('legt den Fokus auf die bestätigende Schaltfläche', () => {
    renderModal()
    advance(40)
    expect(screen.getByRole('button', { name: 'Termin absagen' })).toHaveFocus()
  })

  /* tone="danger" drops the data-autofocus marker, so the fallback picks the
     first focusable element instead — the close button. The destructive action
     stays unfocused, which is the point of the marker being conditional. */
  it('lässt die zerstörende Aktion ungefokussiert', () => {
    renderModal({ tone: 'danger' })
    advance(40)
    expect(screen.getByRole('button', { name: 'Termin absagen' })).not.toHaveFocus()
    expect(screen.getByRole('button', { name: 'Schließen' })).toHaveFocus()
  })

  it('hält den Fokus beim Blättern im Dialog', () => {
    renderModal({ cancelLabel: 'Zurück' })
    const dialog = screen.getByRole('dialog')
    const close = screen.getByRole('button', { name: 'Schließen' })
    const confirm = screen.getByRole('button', { name: 'Termin absagen' })

    confirm.focus()
    fireEvent.keyDown(document, { key: 'Tab' })
    expect(close).toHaveFocus()

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
    expect(confirm).toHaveFocus()

    expect(dialog).toContainElement(document.activeElement)
  })

  it('meldet Escape über onClose', () => {
    const onClose = vi.fn()
    renderModal({ onClose })

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('schließt nicht über den Scrim', () => {
    const onClose = vi.fn()
    const { baseElement } = renderModal({ onClose })

    fireEvent.click(baseElement.querySelector('.medo-mod__scrim'))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('sperrt die Seite und gibt sie beim Schließen wieder frei', () => {
    const { rerender } = renderModal()
    expect(document.body).toHaveStyle({ overflow: 'hidden' })

    rerender(<Modal open={false} title="Termin absagen" onClose={vi.fn()} />)
    expect(document.body).not.toHaveStyle({ overflow: 'hidden' })
  })

  it('gibt den Fokus beim Schließen an den Auslöser zurück', () => {
    function Host() {
      const [open, setOpen] = useState(false)
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>Termin öffnen</button>
          <Modal open={open} title="Termin absagen" confirmLabel="Termin absagen" onClose={() => setOpen(false)}>
            <p>Der Termin wird unwiderruflich entfernt.</p>
          </Modal>
        </>
      )
    }

    render(<Host />)
    const trigger = screen.getByRole('button', { name: 'Termin öffnen' })

    trigger.focus()
    fireEvent.click(trigger)
    advance(40)
    expect(trigger).not.toHaveFocus()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })
})

/* Fall B: der Symbolkreis liegt auf der hellen Meldungsflaeche und ist damit
   ein Akzent, keine Fuellflaeche. Gemessen im hellen Theme auf der eigenen
   Statusflaeche: Warnung 2,98:1 -> 5,71:1 (Schwelle 3), Fehler 7,03 -> 8,79,
   Erfolg 5,68 -> 7,46, Info 6,18 -> 8,24. Nur die Warnung verfehlte eine
   Schwelle; die uebrigen drei aendern sich sichtbar, damit keine der vier im
   Komponentencode ein Sonderfall bleibt. */
describe('Modal · Symbolkreis', () => {
  const css = readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'Modal.css'), 'utf8')

  it.each([
    ['danger', 'error'],
    ['warning', 'warning'],
    ['success', 'success'],
  ])('faerbt den Kreis fuer %s ueber das Akzent-Token', (tone, rolle) => {
    const zeile = css
      .split('\n')
      .find((l) => l.includes(`.medo-mod__ic--${tone}{`))

    expect(zeile, `keine Regel fuer ${tone}`).toBeTruthy()
    expect(zeile).toContain(`color: var(--medo-${rolle}-accent)`)
    expect(zeile).not.toContain(`var(--medo-${rolle}-solid)`)
  })

  /* Die Fuellflaeche der zerstoerenden Schaltflaeche bleibt die
     Bedienzustandsfarbe — dort ist sie Flaeche, nicht Vordergrund. */
  it('laesst die Fuellflaeche der Schaltflaeche unberuehrt', () => {
    expect(css).toContain('.medo-mod__btn--danger{ background: var(--medo-error-solid);')
  })

  /* Ueber echtes Client-Rendering gelesen: das Modal rendert in ein Portal,
     serverseitig kaeme leeres Markup zurueck. */
  it('traegt die Tonart als Klasse am gerenderten Kreis', () => {
    render(
      <Modal open title="Datei loeschen?" tone="danger" icon="delete" onClose={vi.fn()}>
        Text
      </Modal>,
    )

    expect(document.body.querySelector('.medo-mod__ic--danger')).toBeInTheDocument()
  })
})
