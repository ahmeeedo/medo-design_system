import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { MenuList } from '../Dropdown/Dropdown'
import './Menu.css'

/* medo Design System · Menu (Kontextmenü)
   Öffnet auf Rechtsklick an der Cursorposition und kippt an den Rändern nach innen.
   Benutzt die gemeinsame Menüfläche MenuList aus Dropdown.
   Esc, Klick außerhalb und Auswahl schließen; Pfeile/Enter/Home/End und Tippen wie im Dropdown. */

export function Menu({
  items = [],
  onSelect,
  children,
  ariaLabel = 'Kontextmenü',
  disabled = false,
  className,
  style,
  ...rest
}) {
  const [pos, setPos] = useState(null)
  const popRef = useRef(null)

  const close = () => setPos(null)

  useEffect(() => {
    if (!pos) return
    const scroll = () => close()
    window.addEventListener('scroll', scroll, true)
    window.addEventListener('resize', scroll)
    return () => {
      window.removeEventListener('scroll', scroll, true)
      window.removeEventListener('resize', scroll)
    }
  }, [pos])

  /* Nach dem Einhängen messen und bei Platzmangel nach innen kippen. */
  useLayoutEffect(() => {
    if (!pos || pos.fixed || !popRef.current) return
    const r = popRef.current.getBoundingClientRect()
    const pad = 8
    let x = pos.x
    let y = pos.y
    if (x + r.width > window.innerWidth - pad) x = Math.max(pad, x - r.width)
    if (y + r.height > window.innerHeight - pad) y = Math.max(pad, y - r.height)
    setPos({ x, y, fixed: true })
  }, [pos])

  const onContextMenu = e => {
    if (disabled) return
    e.preventDefault()
    setPos({ x: e.clientX, y: e.clientY })
  }

  return (
    <div
      className={['medo-ctx', className].filter(Boolean).join(' ')}
      onContextMenu={onContextMenu}
      style={style}
      {...rest}
    >
      {children}
      {pos ? (
        <>
          <div className="medo-ctx__layer" onMouseDown={close} />
          <div ref={popRef} className="medo-ctx__pop" style={{ top: pos.y + 'px', left: pos.x + 'px' }}>
            <MenuList items={items} ariaLabel={ariaLabel} onSelect={onSelect} onClose={close} />
          </div>
        </>
      ) : null}
    </div>
  )
}
