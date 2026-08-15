import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tabs } from './Tabs'

const items = [
  { value: 'overview', label: 'Overview' },
  { value: 'usage', label: 'Usage' },
  { value: 'code', label: 'Code', disabled: true },
  { value: 'accessibility', label: 'Accessibility' },
]

describe('Tabs', () => {
  it('marks the active tab and leaves the others unselected', () => {
    render(<Tabs items={items} value="usage" onChange={() => {}} />)
    expect(screen.getByRole('tab', { name: 'Usage' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'false')
  })

  it('reports the picked value without moving on its own when controlled', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<Tabs items={items} value="overview" onChange={onChange} />)

    await user.click(screen.getByRole('tab', { name: 'Usage' }))

    expect(onChange).toHaveBeenCalledWith('usage')
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true')
  })

  it('does not report disabled tabs', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<Tabs items={items} value="overview" onChange={onChange} />)

    await user.click(screen.getByRole('tab', { name: 'Code' }))

    expect(onChange).not.toHaveBeenCalled()
  })

  it('skips disabled tabs with the arrow keys and wraps around', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<Tabs items={items} value="usage" onChange={onChange} />)

    screen.getByRole('tab', { name: 'Usage' }).focus()
    await user.keyboard('{ArrowRight}')
    expect(onChange).toHaveBeenLastCalledWith('accessibility')

    onChange.mockClear()
    await user.keyboard('{ArrowLeft}')
    expect(onChange).toHaveBeenLastCalledWith('overview')
  })

  it('jumps to the edges with Home and End', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<Tabs items={items} value="usage" onChange={onChange} />)

    screen.getByRole('tab', { name: 'Usage' }).focus()
    await user.keyboard('{End}')
    expect(onChange).toHaveBeenLastCalledWith('accessibility')

    await user.keyboard('{Home}')
    expect(onChange).toHaveBeenLastCalledWith('overview')
  })

  it('renders a panel for its children and links it to the active tab', () => {
    render(
      <Tabs items={items} value="usage" onChange={() => {}}>
        <p>Panel body</p>
      </Tabs>,
    )
    const panel = screen.getByRole('tabpanel')
    const tab = screen.getByRole('tab', { name: 'Usage' })

    expect(panel).toHaveAttribute('aria-labelledby', tab.id)
    expect(tab).toHaveAttribute('aria-controls', panel.id)
  })

  /* idPrefix lets the docs chrome place the panel elsewhere in the DOM and
     still wire it to the tab bar. */
  it('wires an externally rendered panel through idPrefix', () => {
    render(<Tabs items={items} value="usage" onChange={() => {}} idPrefix="docs-tabs" />)

    expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Usage' })).toHaveAttribute('id', 'docs-tabs-tab-usage')
    expect(screen.getByRole('tab', { name: 'Usage' })).toHaveAttribute(
      'aria-controls',
      'docs-tabs-panel',
    )
  })

  it('leaves aria-controls off when there is neither a panel nor a prefix', () => {
    render(<Tabs items={items} value="usage" onChange={() => {}} />)
    expect(screen.getByRole('tab', { name: 'Usage' })).not.toHaveAttribute('aria-controls')
  })
})
