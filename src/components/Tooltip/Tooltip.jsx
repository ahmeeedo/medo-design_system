import { Children, cloneElement, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './Tooltip.css'

/* medo Design System · Tooltip
   Kurze Erklärung bei Hover oder Fokus. Rein informativ, nicht interaktiv.
   Dunkler Stil mit Pfeil, vier Positionen, kippt bei Platzmangel auf die Gegenseite.
   Wird über createPortal an <body> gehängt, damit kein Container ihn abschneidet. */

export function Tooltip({
  children,
  content,
  title,
  placement = 'top',
  delay = 400,
  offset = 10,
  disabled = false,
  className,
}) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState(null)
  const triggerRef = useRef(null)
  const tipRef = useRef(null)
  const timerRef = useRef(null)

  const generatedId = useId()

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const show = immediate => {
    if (disabled || (!content && !title)) return
    clearTimeout(timerRef.current)
    if (immediate) setOpen(true)
    else timerRef.current = setTimeout(() => setOpen(true), delay)
  }
  /* Öffnen verzögert, Schließen sofort. */
  const hide = () => {
    clearTimeout(timerRef.current)
    setOpen(false)
  }

  /* Position nach dem Einhängen messen, damit die echte Größe bekannt ist. */
  useLayoutEffect(() => {
    if (!open || !triggerRef.current || !tipRef.current) return
    const t = triggerRef.current.getBoundingClientRect()
    const p = tipRef.current.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    const pad = 8

    let side = placement
    /* Auto-Flip: reicht der Platz auf der gewünschten Seite nicht, auf die Gegenseite kippen. */
    if (side === 'top' && t.top - p.height - offset < pad) side = 'bottom'
    else if (side === 'bottom' && t.bottom + p.height + offset > vh - pad) side = 'top'
    else if (side === 'left' && t.left - p.width - offset < pad) side = 'right'
    else if (side === 'right' && t.right + p.width + offset > vw - pad) side = 'left'

    let top, left
    if (side === 'top') { top = t.top - p.height - offset; left = t.left + t.width / 2 - p.width / 2 }
    else if (side === 'bottom') { top = t.bottom + offset; left = t.left + t.width / 2 - p.width / 2 }
    else if (side === 'left') { top = t.top + t.height / 2 - p.height / 2; left = t.left - p.width - offset }
    else { top = t.top + t.height / 2 - p.height / 2; left = t.right + offset }

    /* Innerhalb des Sichtfensters halten */
    left = Math.min(Math.max(pad, left), vw - p.width - pad)
    top = Math.min(Math.max(pad, top), vh - p.height - pad)

    /* Pfeil auf die Mitte des Auslösers ausrichten, nicht auf die Mitte des Tooltips */
    const arrow = {}
    if (side === 'top' || side === 'bottom') {
      const cx = t.left + t.width / 2 - left
      arrow.left = Math.min(Math.max(10, cx - 4), p.width - 18) + 'px'
      arrow[side === 'top' ? 'bottom' : 'top'] = '-4px'
    } else {
      const cy = t.top + t.height / 2 - top
      arrow.top = Math.min(Math.max(10, cy - 4), p.height - 18) + 'px'
      arrow[side === 'left' ? 'right' : 'left'] = '-4px'
    }
    setPos({ top, left, arrow })
  }, [open, placement, offset, content, title])

  const child = Children.only(children)
  const trigger = cloneElement(child, {
    ref: triggerRef,
    'aria-describedby': open ? generatedId : undefined,
    onMouseEnter: e => { show(false); if (child.props.onMouseEnter) child.props.onMouseEnter(e) },
    onMouseLeave: e => { hide(); if (child.props.onMouseLeave) child.props.onMouseLeave(e) },
    /* Bei Tastaturfokus sofort, ohne Verzögerung. */
    onFocus: e => { show(true); if (child.props.onFocus) child.props.onFocus(e) },
    onBlur: e => { hide(); if (child.props.onBlur) child.props.onBlur(e) },
  })

  const tip =
    open && typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={tipRef}
            id={generatedId}
            role="tooltip"
            className={['medo-tt', title ? 'medo-tt--rich' : null, className]
              .filter(Boolean)
              .join(' ')}
            style={pos ? { top: pos.top + 'px', left: pos.left + 'px' } : { top: 0, left: 0, visibility: 'hidden' }}
          >
            {title ? <div className="medo-tt__title">{title}</div> : null}
            {content ? (title ? <div className="medo-tt__text">{content}</div> : content) : null}
            <span className="medo-tt__arrow" style={pos ? pos.arrow : { display: 'none' }} />
          </div>,
          document.body
        )
      : null

  return (
    <>
      {trigger}
      {tip}
    </>
  )
}
