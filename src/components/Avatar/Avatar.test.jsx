import { fireEvent, render, screen } from '@testing-library/react'
import { Avatar, medoAvatarInitials } from './Avatar'

/** The avatar is aria-hidden without a label, so it cannot be reached by role. */
const circle = (container) => container.firstChild

describe('medoAvatarInitials', () => {
  /* The eight cases the specification page tabulates, plus the empty inputs. */
  it.each([
    ['Andreas Müller', 'AM'],
    ['PeterZeider', 'PZ'],
    ['renatosanches', 'RE'],
    ['Dr. Marie Hoffmann', 'DM'],
    ['anna.mueller', 'AM'],
    ['anna@medo.de', 'AN'],
    ['Anna-Lena Schmidt', 'AS'],
    ['Müller', 'MÜ'],
  ])('turns %s into %s', (input, expected) => {
    expect(medoAvatarInitials(input)).toBe(expected)
  })

  it('yields nothing for a missing or empty name', () => {
    expect(medoAvatarInitials()).toBe('')
    expect(medoAvatarInitials('')).toBe('')
    expect(medoAvatarInitials('   ')).toBe('')
    expect(medoAvatarInitials('@medo.de')).toBe('')
  })

  it('lets a space beat a hyphen so double first names stay together', () => {
    expect(medoAvatarInitials('Anna-Lena Schmidt')).toBe('AS')
    expect(medoAvatarInitials('Anna-Lena')).toBe('AL')
  })

  it('lets a full stop beat an underscore', () => {
    expect(medoAvatarInitials('anna.lena_schmidt')).toBe('AL')
  })
})

describe('Avatar', () => {
  it('derives the letters from the name', () => {
    const { container } = render(<Avatar name="Andreas Müller" />)
    expect(circle(container)).toHaveTextContent('AM')
  })

  it('lets initials override the derivation', () => {
    const { container } = render(<Avatar name="Andreas Müller" initials="XY" />)
    expect(circle(container)).toHaveTextContent('XY')
  })

  it('shows the image while it loads', () => {
    const { container } = render(<Avatar name="Andreas Müller" src="/bild.png" />)
    const img = container.querySelector('img')

    expect(img).toHaveAttribute('src', '/bild.png')
    /* Decorative: the circle carries the meaning, not the image. */
    expect(img).toHaveAttribute('alt', '')
    expect(circle(container)).not.toHaveTextContent('AM')
  })

  it('falls back to the letters when the image does not load', () => {
    const { container } = render(<Avatar name="Andreas Müller" src="/weg.png" />)

    fireEvent.error(container.querySelector('img'))

    expect(container.querySelector('img')).toBeNull()
    expect(circle(container)).toHaveTextContent('AM')
  })

  it('tries again when the address changes', () => {
    const { container, rerender } = render(<Avatar name="Andreas Müller" src="/weg.png" />)
    fireEvent.error(container.querySelector('img'))
    expect(container.querySelector('img')).toBeNull()

    rerender(<Avatar name="Andreas Müller" src="/neu.png" />)

    expect(container.querySelector('img')).toHaveAttribute('src', '/neu.png')
  })

  it('shows the person symbol when there is no name at all', () => {
    const { container } = render(<Avatar />)

    expect(circle(container)).toHaveClass('medo-av--symbol')
    expect(circle(container)).toHaveTextContent('person')
  })

  it('shows an empty circle while the data is on its way', () => {
    const { container } = render(<Avatar name="Andreas Müller" loading />)

    expect(circle(container)).toHaveClass('medo-av--loading')
    expect(circle(container)).toHaveTextContent('')
    expect(container.querySelector('img')).toBeNull()
  })

  it('lets loading win over an image that would otherwise show', () => {
    const { container } = render(<Avatar name="Andreas Müller" src="/bild.png" loading />)

    expect(circle(container)).toHaveClass('medo-av--loading')
    expect(container.querySelector('img')).toBeNull()
  })

  it.each([
    'red', 'crimson', 'rose', 'orange', 'amber', 'yellow', 'green', 'teal',
    'cyan', 'blue', 'indigo', 'violet', 'purple', 'grey', 'stone',
  ])('carries the %s scheme as its own class', (scheme) => {
    const { container } = render(<Avatar name="Andreas Müller" color={scheme} />)
    expect(circle(container)).toHaveClass('medo-av--' + scheme)
  })

  it('falls back to teal for an unknown scheme', () => {
    const { container } = render(<Avatar name="Andreas Müller" color="fuchsia" />)
    expect(circle(container)).toHaveClass('medo-av--teal')
  })

  it('defaults to teal', () => {
    const { container } = render(<Avatar name="Andreas Müller" />)
    expect(circle(container)).toHaveClass('medo-av--teal')
  })

  it.each([['sm', 15], ['md', 19], ['lg', 32]])(
    'sizes the circle and its symbol for %s',
    (size, glyph) => {
      const { container } = render(<Avatar size={size} />)

      expect(circle(container)).toHaveClass('medo-av--' + size)
      expect(container.querySelector('.medo-icon')).toHaveStyle({ fontSize: glyph + 'px' })
    }
  )

  it('defaults to md', () => {
    const { container } = render(<Avatar name="Andreas Müller" />)
    expect(circle(container)).toHaveClass('medo-av--md')
  })

  it('stays silent for screen readers while the name stands alongside', () => {
    const { container } = render(<Avatar name="Andreas Müller" />)

    expect(circle(container)).toHaveAttribute('aria-hidden', 'true')
    expect(circle(container)).not.toHaveAttribute('role')
  })

  it('announces itself as a labelled image when it stands alone', () => {
    render(<Avatar label="Gelöschtes Konto" />)
    const marked = screen.getByRole('img', { name: 'Gelöschtes Konto' })

    expect(marked).toBeInTheDocument()
    expect(marked).not.toHaveAttribute('aria-hidden')
  })

  it('takes className alongside its own classes and style on the circle', () => {
    const { container } = render(
      <Avatar name="Andreas Müller" className="eigene" style={{ marginTop: '4px' }} />
    )

    expect(circle(container)).toHaveClass('medo-av', 'medo-av--md', 'medo-av--teal', 'eigene')
    expect(circle(container)).toHaveStyle({ marginTop: '4px' })
  })
})
