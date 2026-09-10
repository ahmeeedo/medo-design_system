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

  /* children is optional in the contract, so the component doubles as a bare
     tab bar — that is how the docs chrome uses it. */
  it('renders no panel and no dangling aria-controls without children', () => {
    render(<Tabs items={items} value="usage" onChange={() => {}} />)

    expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Usage' })).not.toHaveAttribute('aria-controls')
  })
})

/* Die mitlaufende Leiste. jsdom rechnet kein Layout, deshalb wird die Geometrie
   gestellt: Sichtfeld 0–300, der gewaehlte Tab liegt bei 320–400 also rechts daneben. */
describe('Tabs — die Leiste laeuft mit', () => {
  const rahmen = { left: 0, right: 300, top: 0, bottom: 44, width: 300, height: 44 }
  const lagen = {
    overview: { left: 0, right: 80 },
    usage: { left: 240, right: 320 },
    code: { left: 320, right: 400 },
    accessibility: { left: 420, right: 500 },
  }

  let zurueck
  let gerollt

  beforeEach(() => {
    gerollt = vi.fn()
    const origRect = Element.prototype.getBoundingClientRect
    const origScroll = Element.prototype.scrollBy
    Element.prototype.getBoundingClientRect = function () {
      if (this.classList.contains('medo-tabs__scroller')) return rahmen
      const v = this.getAttribute && this.getAttribute('data-val')
      if (v && lagen[v]) return lagen[v]
      return origRect.call(this)
    }
    Element.prototype.scrollBy = gerollt
    zurueck = () => {
      Element.prototype.getBoundingClientRect = origRect
      Element.prototype.scrollBy = origScroll
    }
  })

  afterEach(() => zurueck())

  it('holt den gewaehlten Tab ins Bild, wenn er rechts daneben liegt', () => {
    render(<Tabs items={items} value="code" onChange={() => {}} />)

    expect(gerollt).toHaveBeenCalledWith({ left: 100, behavior: 'smooth' })
  })

  it('laesst die Leiste stehen, solange der gewaehlte Tab vollstaendig sichtbar ist', () => {
    render(<Tabs items={items} value="overview" onChange={() => {}} />)

    expect(gerollt).not.toHaveBeenCalled()
  })

  /* Messung zur Abhaengigkeitsliste: faellt `fullWidth` weg, wird die Huelle neu
     eingehaengt und steht auf Rollposition 0. Ohne `fullWidth` in der Liste liefe der
     Effekt hier nicht — der gewaehlte Tab bliebe ausserhalb des Bildes. */
  it('holt den Tab auch dann ins Bild, wenn die Huelle erst durch fullWidth-Wegfall entsteht', () => {
    const { rerender } = render(<Tabs items={items} value="code" fullWidth onChange={() => {}} />)
    expect(gerollt).not.toHaveBeenCalled()

    rerender(<Tabs items={items} value="code" onChange={() => {}} />)

    expect(gerollt).toHaveBeenCalledWith({ left: 100, behavior: 'smooth' })
  })

  /* Die Gegenrichtung: die Huelle verschwindet. Der Effekt laeuft, findet aber nichts
     und bricht folgenlos ab. */
  it('bricht folgenlos ab, wenn die Huelle durch fullWidth verschwindet', () => {
    const { rerender } = render(<Tabs items={items} value="overview" onChange={() => {}} />)
    rerender(<Tabs items={items} value="overview" fullWidth onChange={() => {}} />)

    expect(gerollt).not.toHaveBeenCalled()
  })

  it('legt bei orientation=vertical keine Huelle an', () => {
    const { container } = render(
      <Tabs items={items} value="code" orientation="vertical" onChange={() => {}} />
    )

    expect(container.querySelector('.medo-tabs__scroller')).toBeNull()
    expect(gerollt).not.toHaveBeenCalled()
  })

  /* scrollable ist seit der Aenderung wirkungslos: die Huelle entsteht ohnehin. */
  it('legt die Huelle auch ohne scrollable an', () => {
    const { container } = render(<Tabs items={items} value="overview" onChange={() => {}} />)

    expect(container.querySelector('.medo-tabs__scroller')).not.toBeNull()
  })

  /* Die Nachmessung hinter der Aussage der Doku-Seite: die Angabe erreicht
     nichts mehr. Die von useId erzeugten Kennungen laufen je Durchgang weiter
     und werden vor dem Vergleich eingeebnet. */
  it('rendert mit und ohne scrollable dasselbe Markup', () => {
    const eingeebnet = (markup) => markup.replace(/:r[0-9a-z]+:/g, ':id:')

    const ohne = render(<Tabs items={items} value="overview" onChange={() => {}} />)
    const erwartet = eingeebnet(ohne.container.innerHTML)
    ohne.unmount()

    const mit = render(<Tabs items={items} value="overview" scrollable onChange={() => {}} />)

    expect(eingeebnet(mit.container.innerHTML)).toBe(erwartet)
  })
})
