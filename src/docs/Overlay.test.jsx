import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { Overlay } from './Overlay'

function Harness({ autoFocus }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)}>Öffnen</button>
      <Overlay open={open} onClose={() => setOpen(false)} label="Dialog" autoFocus={autoFocus}>
        <button>Erster</button>
        <button>Zweiter</button>
      </Overlay>
    </>
  )
}

describe('Overlay', () => {
  it('renders nothing while closed', () => {
    render(<Harness />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('is a modal dialog carrying its label', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByRole('button', { name: 'Öffnen' }))

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAccessibleName('Dialog')
  })

  it('closes on Escape and hands focus back to the trigger', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    const trigger = screen.getByRole('button', { name: 'Öffnen' })
    await user.click(trigger)

    await user.keyboard('{Escape}')

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(trigger).toHaveFocus()
  })

  it('keeps Tab inside the dialog', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByRole('button', { name: 'Öffnen' }))

    const first = screen.getByRole('button', { name: 'Erster' })
    const last = screen.getByRole('button', { name: 'Zweiter' })

    last.focus()
    await user.keyboard('{Tab}')
    expect(first).toHaveFocus()

    await user.keyboard('{Shift>}{Tab}{/Shift}')
    expect(last).toHaveFocus()
  })

  it('moves focus into the panel on open unless the caller opts out', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<Harness />)
    await user.click(screen.getByRole('button', { name: 'Öffnen' }))
    expect(screen.getByRole('dialog')).toHaveFocus()
    unmount()

    render(<Harness autoFocus={false} />)
    const trigger = screen.getByRole('button', { name: 'Öffnen' })
    await user.click(trigger)
    expect(screen.getByRole('dialog')).not.toHaveFocus()
  })
})
