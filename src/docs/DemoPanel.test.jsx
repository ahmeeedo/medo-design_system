import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { DemoPanel } from './PageLayout'
import TextInputPage from '../pages/TextInputPage'
import '../i18n'

const state = values => <p>{`clearable=${String(values.clearable)}`}</p>

/* Pickers before switches, alphabetical inside each block — the page declares
   them in none of that order on purpose, so a pass proves the panel sorts. */
const mixed = [
  { id: 'zebra', type: 'toggle', label: 'Zebra', default: false },
  { id: 'alpha', type: 'toggle', label: 'Alpha', default: false },
  { id: 'size', type: 'dropdown', label: 'Size', options: ['sm', 'md'], default: 'md' },
  { id: 'mode', type: 'dropdown', label: 'Mode', options: ['a', 'b'], default: 'a' },
]

const gated = [
  { id: 'disabled', type: 'toggle', label: 'Disabled', default: false },
  { id: 'clearable', type: 'toggle', label: 'Clearable', default: false, visibleWhen: v => !v.disabled },
]

const examples = [
  { id: 'plain', label: 'Schlicht', values: {} },
  { id: 'loud', label: 'Laut', values: { zebra: true, mode: 'b' } },
]

const cells = () => Array.from(screen.getByRole('group', { name: 'Steuerung' }).children)

const picker = () => screen.getByRole('combobox', { name: 'Beispiel' })
const details = () => screen.getByRole('button', { name: 'Alle Einstellungen' })

const pick = async (user, label) => {
  await user.click(picker())
  await user.click(screen.getByRole('option', { name: label }))
}

describe('DemoPanel controls', () => {
  it('puts pickers before switches and orders each block by label', () => {
    render(<DemoPanel component={state} controls={mixed} />)

    const labels = cells().map(cell => cell.textContent)
    expect(labels[0]).toMatch(/^Mode/)
    expect(labels[1]).toMatch(/^Size/)
    expect(labels[2]).toMatch(/^Alpha/)
    expect(labels[3]).toMatch(/^Zebra/)
  })

  it('renders the pickers and switches of the design system, not raw form elements', () => {
    const { container } = render(<DemoPanel component={state} controls={mixed} />)

    expect(screen.getByRole('combobox', { name: 'Size' })).toBeInTheDocument()
    expect(screen.getByRole('switch', { name: 'Alpha' })).toBeInTheDocument()
    expect(container.querySelector('select')).toBeNull()
    expect(container.querySelector('input[type="checkbox"]')).toBeNull()
  })

  it('shows a control only while it has an effect, and brings it back when it has one again', async () => {
    const user = userEvent.setup()
    render(<DemoPanel component={state} controls={gated} />)

    expect(screen.getByRole('switch', { name: 'Clearable' })).toBeInTheDocument()

    await user.click(screen.getByRole('switch', { name: 'Disabled' }))
    expect(screen.queryByRole('switch', { name: 'Clearable' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('switch', { name: 'Disabled' }))
    expect(screen.getByRole('switch', { name: 'Clearable' })).toBeInTheDocument()
  })

  it('keeps the value of a hidden control and keeps handing it to the preview', async () => {
    const user = userEvent.setup()
    render(<DemoPanel component={state} controls={gated} />)

    await user.click(screen.getByRole('switch', { name: 'Clearable' }))
    expect(screen.getByText('clearable=true')).toBeInTheDocument()

    await user.click(screen.getByRole('switch', { name: 'Disabled' }))
    expect(screen.queryByRole('switch', { name: 'Clearable' })).not.toBeInTheDocument()
    expect(screen.getByText('clearable=true')).toBeInTheDocument()

    await user.click(screen.getByRole('switch', { name: 'Disabled' }))
    expect(screen.getByRole('switch', { name: 'Clearable' })).toHaveAttribute('aria-checked', 'true')
  })

  it('always shows controls that declare no condition', () => {
    render(<DemoPanel component={state} controls={mixed} />)

    expect(cells()).toHaveLength(mixed.length)
  })

  it('leaves the controls in the open on a panel that declares no examples', () => {
    render(<DemoPanel component={state} controls={mixed} />)

    expect(cells()).toHaveLength(mixed.length)
    expect(screen.queryByRole('combobox', { name: 'Beispiel' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Alle Einstellungen' })).not.toBeInTheDocument()
  })
})

describe('DemoPanel examples', () => {
  const panel = () => render(<DemoPanel component={state} controls={mixed} presets={examples} />)

  it('leaves the example picker as the only control at rest', () => {
    panel()

    expect(picker()).toBeInTheDocument()
    expect(screen.getAllByRole('combobox')).toHaveLength(1)
    expect(screen.queryAllByRole('switch')).toHaveLength(0)
    expect(details()).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens the detail area and reaches every individual control', async () => {
    const user = userEvent.setup()
    panel()

    await user.click(details())

    expect(details()).toHaveAttribute('aria-expanded', 'true')
    expect(cells()).toHaveLength(mixed.length)
    expect(screen.getByRole('switch', { name: 'Zebra' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Mode' })).toBeInTheDocument()
  })

  it('sets the values of the individual controls from the chosen example', async () => {
    const user = userEvent.setup()
    panel()

    await pick(user, 'Laut')
    await user.click(details())

    expect(screen.getByRole('switch', { name: 'Zebra' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('combobox', { name: 'Mode' })).toHaveTextContent('b')
    expect(screen.getByRole('switch', { name: 'Alpha' })).toHaveAttribute('aria-checked', 'false')
  })

  it('stops claiming the example once an individual control is moved, and claims it again on the way back', async () => {
    const user = userEvent.setup()
    panel()

    await pick(user, 'Laut')
    expect(picker()).toHaveTextContent('Laut')

    await user.click(details())
    await user.click(screen.getByRole('switch', { name: 'Alpha' }))
    expect(picker()).toHaveTextContent('Angepasst')
    expect(picker()).not.toHaveTextContent('Laut')

    await user.click(screen.getByRole('switch', { name: 'Alpha' }))
    expect(picker()).toHaveTextContent('Laut')
  })
})

/* The mechanism above is generic; this pins the wiring on the page that ships it. */
describe('TextInput page controls', () => {
  /* jsdom implements neither observer; PageLayout measures the tab bar with one
     and drives the table of contents with the other. */
  beforeAll(() => {
    class NoopObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    vi.stubGlobal('ResizeObserver', NoopObserver)
    vi.stubGlobal('IntersectionObserver', NoopObserver)
  })
  afterAll(() => vi.unstubAllGlobals())

  const page = () => render(<MemoryRouter><TextInputPage /></MemoryRouter>)

  it('opens with the example picker alone and the detail area shut', () => {
    page()

    expect(picker()).toHaveTextContent('Standard')
    expect(screen.getAllByRole('combobox')).toHaveLength(1)
    expect(screen.queryAllByRole('switch')).toHaveLength(0)
    expect(details()).toHaveAttribute('aria-expanded', 'false')
  })

  it('reaches all fourteen controls through the detail area', async () => {
    const user = userEvent.setup()
    page()

    await user.click(details())

    expect(cells()).toHaveLength(14)
  })

  it('carries a chosen example into the individual controls', async () => {
    const user = userEvent.setup()
    page()

    await pick(user, 'Schreibgeschützt')
    await user.click(details())
    expect(screen.getByRole('switch', { name: 'Readonly' })).toHaveAttribute('aria-checked', 'true')

    await pick(user, 'Passwort')
    expect(screen.getByRole('combobox', { name: 'Type' })).toHaveTextContent('password')
    expect(screen.getByRole('switch', { name: 'Readonly' })).toHaveAttribute('aria-checked', 'false')
  })

  it('drops the example name once a control is moved by hand', async () => {
    const user = userEvent.setup()
    page()

    await pick(user, 'Passwort')
    expect(picker()).toHaveTextContent('Passwort')

    await user.click(details())
    await user.click(screen.getByRole('switch', { name: 'Icon' }))
    expect(picker()).toHaveTextContent('Angepasst')
    expect(picker()).not.toHaveTextContent('Passwort')
  })

  it('drops Optional while Required is on', async () => {
    const user = userEvent.setup()
    page()
    await user.click(details())

    expect(screen.getByRole('switch', { name: 'Optional' })).toBeInTheDocument()

    await user.click(screen.getByRole('switch', { name: 'Required' }))
    expect(screen.queryByRole('switch', { name: 'Optional' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('switch', { name: 'Required' }))
    expect(screen.getByRole('switch', { name: 'Optional' })).toBeInTheDocument()
  })

  it('drops Clearable and Readonly while Disabled is on', async () => {
    const user = userEvent.setup()
    page()
    await user.click(details())

    await user.click(screen.getByRole('switch', { name: 'Disabled' }))

    expect(screen.queryByRole('switch', { name: 'Clearable' })).not.toBeInTheDocument()
    expect(screen.queryByRole('switch', { name: 'Readonly' })).not.toBeInTheDocument()
    expect(screen.getByRole('switch', { name: 'Disabled' })).toBeInTheDocument()
  })
})
