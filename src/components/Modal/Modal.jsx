import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '../Icon/Icon'
import './Modal.css'

/* medo Design System · Modal
   Sperrt die Seite für eine Entscheidung. Drei Formen über `size`: md (Standard mit Formular),
   sm (Bestätigung) und sm + tone="danger" (zerstörend).
   Scrim rgba(23,21,19,0.5), Fokusfalle, Esc und Kreuz schließen — der Scrim NICHT. */

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  size = 'md',
  tone = 'neutral',
  icon,
  confirmLabel,
  onConfirm,
  cancelLabel = 'Abbrechen',
  secondary,
  footer,
  closeLabel = 'Schließen',
  className,
  style,
  ...rest
}) {
  const boxRef = useRef(null)
  const returnRef = useRef(null)

  useEffect(() => {
    if (!open) return
    returnRef.current = document.activeElement
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = e => {
      if (e.key === 'Escape') {
        e.preventDefault()
        if (onClose) onClose()
        return
      }
      /* Fokusfalle: Tab bleibt im Dialog. */
      if (e.key !== 'Tab' || !boxRef.current) return
      const f = boxRef.current.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )
      if (!f.length) return
      const first = f[0]
      const last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)

    const t = setTimeout(() => {
      if (!boxRef.current) return
      const target =
        boxRef.current.querySelector('[data-autofocus]') ||
        boxRef.current.querySelector('input:not(:disabled), button:not(:disabled)')
      if (target) target.focus()
    }, 40)

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
      clearTimeout(t)
      if (returnRef.current && returnRef.current.focus) returnRef.current.focus()
    }
  }, [open])

  if (!open || typeof document === 'undefined') return null

  const uid = 'medo-mod-title'

  return createPortal(
    <div className="medo-mod__scrim">
      <div
        ref={boxRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={uid}
        className={['medo-mod', 'medo-mod--' + size, className].filter(Boolean).join(' ')}
        style={style}
        {...rest}
      >
        <div className="medo-mod__head">
          {icon ? (
            <span
              className={['medo-mod__ic', tone !== 'neutral' ? 'medo-mod__ic--' + tone : null]
                .filter(Boolean)
                .join(' ')}
              aria-hidden="true"
            >
              <Icon name={icon} size={22} />
            </span>
          ) : null}
          <div className="medo-mod__htext">
            <div id={uid} className="medo-mod__title">{title}</div>
            {subtitle ? <div className="medo-mod__sub">{subtitle}</div> : null}
          </div>
          <button type="button" className="medo-mod__x" aria-label={closeLabel} onClick={onClose}>
            <Icon name="close" size={22} />
          </button>
        </div>
        {children ? <div className="medo-mod__body">{children}</div> : null}
        {footer !== undefined ? (
          footer ? <div className="medo-mod__foot">{footer}</div> : null
        ) : (
          <div
            className={['medo-mod__foot', secondary ? 'medo-mod__foot--between' : null]
              .filter(Boolean)
              .join(' ')}
          >
            {secondary || null}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button type="button" className="medo-mod__btn medo-mod__btn--ghost" onClick={onClose}>
                {cancelLabel}
              </button>
              {confirmLabel ? (
                <button
                  type="button"
                  data-autofocus={tone === 'danger' ? undefined : 'true'}
                  className={
                    'medo-mod__btn ' + (tone === 'danger' ? 'medo-mod__btn--danger' : 'medo-mod__btn--primary')
                  }
                  onClick={onConfirm}
                >
                  {confirmLabel}
                </button>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
