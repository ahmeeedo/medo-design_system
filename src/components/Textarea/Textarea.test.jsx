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

  it('keeps a default of the number zero', () => {
    render(<Textarea label="Notiz" defaultValue={0} />)
    expect(screen.getByRole('textbox', { name: 'Notiz' })).toHaveValue('0')
  })

  it('runs the caller onFocus and onBlur without losing the focus state', async () => {
    const onFocus = vi.fn()
    const onBlur = vi.fn()
    const user = userEvent.setup()
    const { container } = render(<Textarea label="Notiz" onFocus={onFocus} onBlur={onBlur} />)
    const field = screen.getByRole('textbox', { name: 'Notiz' })
    const box = container.querySelector('.medo-field__box')

    await user.click(field)
    expect(onFocus).toHaveBeenCalled()
    expect(box).toHaveClass('medo-field__box--focus')

    await user.tab()
    expect(onBlur).toHaveBeenCalled()
    expect(box).not.toHaveClass('medo-field__box--focus')
  })

  it('joins a caller description with the one pointing at the message', () => {
    render(<Textarea label="Notiz" hint="Hilfe" aria-describedby="extern" />)
    const described = screen.getByRole('textbox', { name: 'Notiz' }).getAttribute('aria-describedby')

    expect(described.split(' ')).toContain('extern')
    expect(described.split(' ').length).toBe(2)
  })

  it('leaves aria-invalid to the caller until an error displaces it', () => {
    const { rerender } = render(<Textarea label="Notiz" aria-invalid="true" />)
    expect(screen.getByRole('textbox', { name: 'Notiz' })).toHaveAttribute('aria-invalid', 'true')

    rerender(<Textarea label="Notiz" aria-invalid="false" error="Bitte einen Befund eintragen" />)
    expect(screen.getByRole('textbox', { name: 'Notiz' })).toHaveAttribute('aria-invalid', 'true')
  })

  it('does not let a passed-through attribute displace the field id', () => {
    render(<Textarea label="Notiz" id="fest" data-testid="ta" />)
    const field = screen.getByRole('textbox', { name: 'Notiz' })

    expect(field).toHaveAttribute('id', 'fest')
    expect(field).toHaveAttribute('data-testid', 'ta')
  })
})
