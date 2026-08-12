import { Fragment, useEffect, useRef, useState } from 'react'
import { Icon } from '../Icon/Icon'
import './Breadcrumb.css'

/* medo Design System · Breadcrumb
   Zeigt den Weg von der Wurzel bis zur aktuellen Seite. Die letzte Stufe ist die aktuelle Seite
   und trägt aria-current="page" — sie ist kein Link. Zu viele Ebenen kollabieren in ein …-Menü:
   erste Stufe, Menü mit der Mitte, letzte zwei Stufen. */

export function Breadcrumb({
  items = [],
  size = 'sm',
  maxItems = 0,
  homeIcon = false,
  ariaLabel = 'Brotkrumen',
  className,
  style,
  ...rest
}) {
  const [open, setOpen] = useState(false)
  const moreRef = useRef(null)
  const glyph = size === 'md' ? 20 : 18

  useEffect(() => {
    if (!open) return
    const away = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) setOpen(false)
    }
    const esc = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', away)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', away)
      document.removeEventListener('keydown', esc)
    }
  }, [open])

  const sep = () => (
    <span className="medo-bc__sep" aria-hidden="true">
      /
    </span>
  )

  const linkFor = (it, i) => {
    const Tag = it.href ? 'a' : 'button'
    const glyphName = i === 0 && homeIcon ? 'home' : it.icon
    return (
      <Tag
        className="medo-bc__link"
        href={it.href}
        type={it.href ? undefined : 'button'}
        onClick={it.onClick}
      >
        {glyphName ? <Icon name={glyphName} size={glyph} /> : null}
        <span>{it.label}</span>
      </Tag>
    )
  }

  /* Kollabieren: erste Stufe, …-Menü mit der Mitte, letzte zwei Stufen. */
  let head = items
  let hidden = []
  if (maxItems > 0 && items.length > maxItems && items.length > 3) {
    head = [items[0]]
    hidden = items.slice(1, items.length - 2)
    head = head.concat(items.slice(items.length - 2))
  }

  return (
    <nav
      aria-label={ariaLabel}
      className={['medo-bc', 'medo-bc--' + size, className].filter(Boolean).join(' ')}
      style={style}
      {...rest}
    >
      <ol className="medo-bc__list">
        {head.map((it, idx) => {
          const isFirst = idx === 0
          const isLast = idx === head.length - 1
          const lead = idx > 0 ? (
            <li className="medo-bc__li" aria-hidden="true">
              {sep()}
            </li>
          ) : null

          if (isFirst && hidden.length) {
            return (
              <Fragment key="first">
                <li className="medo-bc__li">{linkFor(it, 0)}</li>
                <li className="medo-bc__li" aria-hidden="true">
                  {sep()}
                </li>
                <li className="medo-bc__li">
                  <span className="medo-bc__more" ref={moreRef}>
                    <button
                      type="button"
                      className="medo-bc__dots"
                      aria-label="Weitere Ebenen anzeigen"
                      aria-expanded={open ? 'true' : 'false'}
                      onClick={() => setOpen(!open)}
                    >
                      …
                    </button>
                    {open ? (
                      <div className="medo-bc__menu" role="menu">
                        {hidden.map((hit, hi) => {
                          const Tag = hit.href ? 'a' : 'button'
                          return (
                            <Tag
                              key={hi}
                              role="menuitem"
                              className="medo-bc__mitem"
                              href={hit.href}
                              type={hit.href ? undefined : 'button'}
                              onClick={(e) => {
                                setOpen(false)
                                if (hit.onClick) hit.onClick(e)
                              }}
                            >
                              {hit.label}
                            </Tag>
                          )
                        })}
                      </div>
                    ) : null}
                  </span>
                </li>
              </Fragment>
            )
          }

          return (
            <Fragment key={idx}>
              {lead}
              <li className="medo-bc__li">
                {isLast ? (
                  <span className="medo-bc__current" aria-current="page">
                    {it.icon ? <Icon name={it.icon} size={glyph} /> : null}
                    {it.label}
                  </span>
                ) : (
                  linkFor(it, idx)
                )}
              </li>
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
