import { Children, cloneElement, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '../Icon/Icon'
import './Popover.css'

/* medo Design System · Popover
   Klick-ausgelöste Fläche mit interaktivem Inhalt: Erklärung, kleines Formular, Kennzahlen.
   Anders als der Tooltip nimmt er die Maus an und bleibt offen, bis man ihn schließt.
   Wird per Portal an <body> gehängt, misst sich selbst und kippt bei Platzmangel. */

export function Popover({
  children,
  content,
  title,
  placement = 'bottom',
  offset = 10,
  width,
  open: openProp,
  onOpenChange,
  closeLabel = 'Schließen',
  className,
  ...rest
}) {
  const controlled = openProp !== undefined
  const [inner, setInner] = useState(false)
  const open = controlled ? openProp : inner
  const [pos, setPos] = useState(null)
  const triggerRef = useRef(null)
  const popRef = useRef(null)
  const uid = useId()

  const set = next => {
    if (!controlled) setInner(next)
    if (onOpenChange) onOpenChange(next)
  }
  const close = () => {
    set(false)
    if (triggerRef.current && triggerRef.current.focus) triggerRef.current.focus()
  }

  useEffect(() => {
    if (!open) return
    const away = e => {
      if (
        popRef.current && !popRef.current.contains(e.target) &&
        triggerRef.current && !triggerRef.current.contains(e.target)
      ) set(false)
    }
    const esc = e => e.key === 'Escape' && close()
    const reflow = () => setPos(null)
    document.addEventListener('mousedown', away)
    document.addEventListener('keydown', esc)
    window.addEventListener('scroll', reflow, true)
    window.addEventListener('resize', reflow)
    return () => {
      document.removeEventListener('mousedown', away)
      document.removeEventListener('keydown', esc)
      window.removeEventListener('scroll', reflow, true)
      window.removeEventListener('resize', reflow)
    }
  }, [open])

  /* Position nach dem Einhängen messen; reicht der Platz nicht, auf die Gegenseite kippen. */
  useLayoutEffect(() => {
    if (!open || !triggerRef.current || !popRef.current) return
    const t = triggerRef.current.getBoundingClientRect()
    const p = popRef.current.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    const pad = 10

    let side = placement
    if (side === 'bottom' && t.bottom + p.height + offset > vh - pad) side = 'top'
    else if (side === 'top' && t.top - p.height - offset < pad) side = 'bottom'
    else if (side === 'right' && t.right + p.width + offset > vw - pad) side = 'left'
    else if (side === 'left' && t.left - p.width - offset < pad) side = 'right'

    let top
    let left
    if (side === 'bottom') { top = t.bottom + offset; left = t.left + t.width / 2 - p.width / 2 }
    else if (side === 'top') { top = t.top - p.height - offset; left = t.left + t.width / 2 - p.width / 2 }
    else if (side === 'right') { top = t.top + t.height / 2 - p.height / 2; left = t.right + offset }
    else { top = t.top + t.height / 2 - p.height / 2; left = t.left - p.width - offset }

    left = Math.min(Math.max(pad, left), vw - p.width - pad)
    top = Math.min(Math.max(pad, top), vh - p.height - pad)

    const arrow = { transform: 'rotate(45deg)' }
    if (side === 'bottom' || side === 'top') {
      const cx = t.left + t.width / 2 - left
      arrow.left = Math.min(Math.max(14, cx - 5), p.width - 24) + 'px'
      if (side === 'bottom') { arrow.top = '-6px' }
      else { arrow.bottom = '-6px'; arrow.transform = 'rotate(225deg)' }
    } else {
      const cy = t.top + t.height / 2 - top
      arrow.top = Math.min(Math.max(14, cy - 5), p.height - 24) + 'px'
      if (side === 'right') { arrow.left = '-6px'; arrow.transform = 'rotate(315deg)' }
      else { arrow.right = '-6px'; arrow.transform = 'rotate(135deg)' }
    }
    setPos({ top, left, arrow })
  }, [open, placement, offset, title, content, width])

  const child = Children.only(children)
  const trigger = cloneElement(child, {
    ref: triggerRef,
    'aria-haspopup': 'dialog',
    'aria-expanded': open ? 'true' : 'false',
    'aria-controls': open ? uid : undefined,
    onClick: e => {
      set(!open)
      if (child.props.onClick) child.props.onClick(e)
    },
  })

  const pop =
    open && typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={popRef}
            id={uid}
            role="dialog"
            aria-label={typeof title === 'string' ? title : undefined}
            className={['medo-pop', className].filter(Boolean).join(' ')}
            style={{
              width: width ? (typeof width === 'number' ? width + 'px' : width) : undefined,
              ...(pos
                ? { top: pos.top + 'px', left: pos.left + 'px' }
                : { top: 0, left: 0, visibility: 'hidden' }),
            }}
            {...rest}
          >
            {title ? (
              <div className="medo-pop__head">
                <div className="medo-pop__title">{title}</div>
                <button type="button" className="medo-pop__x" aria-label={closeLabel} onClick={close}>
                  <Icon name="close" size={20} />
                </button>
              </div>
            ) : null}
            <div className="medo-pop__body">
              {typeof content === 'function' ? content({ close }) : content}
            </div>
            <span
              className="medo-pop__arrow"
              aria-hidden="true"
              style={pos ? pos.arrow : { display: 'none' }}
            />
          </div>,
          document.body
        )
      : null

  return (
    <>
      {trigger}
      {pop}
    </>
  )
}
