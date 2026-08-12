import { useState } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from './Modal'

/* Template: focus management in an overlay.
   The focus trap comes from the Radix dialog underneath, so these assertions
   are a contract check on the wrapper, not a re-test of Radix: the dialog is
   labelled, focus moves inside on open, Tab stays within, and Escape reports
   back through onClose. The upcoming Popover work can copy this shape. */

const renderModal = (props = {}) =>
  render(
    <Modal open title="Termin absagen" onClose={vi.fn()} {...props}>
      <p>Der Termin wird unwiderruflich entfernt.</p>
      <button type="button">Termin absagen</button>
      <button type="button">Zurück</button>
    </Modal>
  )

describe('Modal · Fokusverwaltung', () => {
  it('rendert nichts, solange es geschlossen ist', () => {
    renderModal({ open: false })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('ist über seinen Titel benannt', () => {
    renderModal()
    expect(screen.getByRole('dialog', { name: 'Termin absagen' })).toBeInTheDocument()
  })

  it('zieht den Fokus beim Öffnen in den Dialog', () => {
    renderModal()
    expect(screen.getByRole('dialog')).toContainElement(document.activeElement)
  })

  it('hält den Fokus beim Blättern im Dialog', async () => {
    const user = userEvent.setup()
    renderModal()
    const dialog = screen.getByRole('dialog')

    for (let step = 0; step < 6; step++) {
      await user.tab()
      expect(dialog).toContainElement(document.activeElement)
    }
  })

  it('meldet Escape über onClose', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    renderModal({ onClose })

    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  /* Focus return to the trigger is deliberately NOT asserted here. The wrapper
     drives the dialog through the `open` prop and renders no Radix trigger, so
     on close the whole subtree unmounts and the focus lands on <body>. Pinning
     that down would cement a shortcoming rather than a contract — see the task
     log. A component that owns its trigger should assert the return. */
  it('gibt den geöffneten Dialog wieder frei', async () => {
    const user = userEvent.setup()

    function Host() {
      const [open, setOpen] = useState(false)
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>Termin öffnen</button>
          <Modal open={open} title="Termin absagen" onClose={() => setOpen(false)}>
            <button type="button">Zurück</button>
          </Modal>
        </>
      )
    }

    render(<Host />)

    await user.click(screen.getByRole('button', { name: 'Termin öffnen' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })
})
