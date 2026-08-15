import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Textarea } from './Textarea'

describe('Textarea', () => {
  it('is labelled and carries the given row count', () => {
    render(<Textarea label="Notiz" rows={5} />)
    const field = screen.getByRole('textbox', { name: 'Notiz' })
    expect(field).toHaveAttribute('rows', '5')
  })

  it('keeps its own value when uncontrolled', async () => {
    const user = userEvent.setup()
    render(<Textarea label="Notiz" />)
    const field = screen.getByRole('textbox', { name: 'Notiz' })

    await user.type(field, 'Befund')

    expect(field).toHaveValue('Befund')
  })

  it('does not move on its own when controlled', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<Textarea label="Notiz" value="fest" onChange={onChange} />)
    const field = screen.getByRole('textbox', { name: 'Notiz' })

    await user.type(field, 'x')

    expect(onChange).toHaveBeenCalled()
    expect(field).toHaveValue('fest')
  })

  it('marks the error state and points the field at the message', () => {
    render(<Textarea label="Notiz" error="Bitte einen Befund eintragen" />)
    const field = screen.getByRole('textbox', { name: 'Notiz' })

    expect(field).toHaveAttribute('aria-invalid', 'true')
    expect(field.getAttribute('aria-describedby')).toBeTruthy()
    expect(screen.getByText('Bitte einen Befund eintragen')).toBeInTheDocument()
  })

  it('counts against maxLength only when asked to', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<Textarea label="Notiz" maxLength={10} />)
    expect(screen.queryByText('0/10')).not.toBeInTheDocument()

    rerender(<Textarea label="Notiz" maxLength={10} showCounter />)
    expect(screen.getByText('0/10')).toBeInTheDocument()

    await user.type(screen.getByRole('textbox', { name: 'Notiz' }), 'abc')
    expect(screen.getByText('3/10')).toBeInTheDocument()
  })

  it('passes disabled and readOnly through to the control', () => {
    const { rerender } = render(<Textarea label="Notiz" disabled />)
    expect(screen.getByRole('textbox', { name: 'Notiz' })).toBeDisabled()

    rerender(<Textarea label="Notiz" readOnly />)
    expect(screen.getByRole('textbox', { name: 'Notiz' })).toHaveAttribute('readonly')
  })
})
