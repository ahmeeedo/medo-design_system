import { useEffect, useRef, useState } from 'react'
import { Icon } from '../Icon/Icon'
import { MenuList } from '../Dropdown/Dropdown'
import './MenuButtons.css'

/* medo Design System · MenuButtons
   Drei Formen: MenuButton (eine Schaltfläche, die ein Menü öffnet), SplitButton (Hauptaktion
   links, Menü rechts hinter einer Trennlinie) und IconMenuButton (40px, nur Icon).
   Menüfläche ist MenuList aus Dropdown. Nur eine Größe: md, 40px hoch. */

/* In der Referenz heißt dieser Hook `medoMbUseMenu` — ohne `use`-Präfix greifen die
   Hook-Regeln nicht, deshalb hier umbenannt. Verhalten unverändert. */
function useMenuState() {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)
  const btnRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const away = e => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', away)
    return () => document.removeEventListener('mousedown', away)
  }, [open])

  const close = () => {
    setOpen(false)
    if (btnRef.current) btnRef.current.focus()
  }

  return { open, setOpen, close, wrapRef, btnRef }
}

function MenuPop({ items, onSelect, onClose, align, ariaLabel }) {
  return (
    <div
      className="medo-mb__pop"
      style={{ left: align === 'start' ? 0 : 'auto', right: align === 'end' ? 0 : 'auto' }}
    >
      <MenuList items={items} onSelect={onSelect} onClose={onClose} ariaLabel={ariaLabel} />
    </div>
  )
}

export function MenuButton({
  label,
  icon,
  items = [],
  onSelect,
  variant = 'primary',
  align = 'start',
  disabled = false,
  ariaLabel,
  className,
  style,
  ...rest
}) {
  const m = useMenuState()

  return (
    <div ref={m.wrapRef} className={['medo-mb', className].filter(Boolean).join(' ')} style={style} {...rest}>
      <button
        ref={m.btnRef}
        type="button"
        className={['medo-mb__btn', 'medo-mb__btn--' + variant].join(' ')}
        aria-haspopup="menu"
        aria-expanded={m.open ? 'true' : 'false'}
        disabled={disabled}
        onClick={() => m.setOpen(!m.open)}
        onKeyDown={e => {
          if (e.key === 'ArrowDown') { e.preventDefault(); m.setOpen(true) }
        }}
      >
        {icon ? <Icon name={icon} size={22} /> : null}
        <span>{label}</span>
        <Icon name="expand_more" size={22} className="medo-mb__chev" />
      </button>
      {m.open ? (
        <MenuPop items={items} onSelect={onSelect} onClose={m.close} align={align} ariaLabel={ariaLabel || label} />
      ) : null}
    </div>
  )
}

export function SplitButton({
  label,
  icon,
  onClick,
  items = [],
  onSelect,
  variant = 'primary',
  align = 'end',
  disabled = false,
  menuLabel = 'Weitere Varianten',
  className,
  style,
  ...rest
}) {
  const m = useMenuState()

  return (
    <div ref={m.wrapRef} className={['medo-mb', className].filter(Boolean).join(' ')} style={style} {...rest}>
      <div className={['medo-mb__split', 'medo-mb__split--' + variant].join(' ')}>
        <button
          type="button"
          className={['medo-mb__btn', 'medo-mb__btn--' + variant].join(' ')}
          disabled={disabled}
          onClick={onClick}
        >
          {icon ? <Icon name={icon} size={22} /> : null}
          <span>{label}</span>
        </button>
        <button
          ref={m.btnRef}
          type="button"
          className={['medo-mb__btn', 'medo-mb__btn--' + variant].join(' ')}
          aria-haspopup="menu"
          aria-expanded={m.open ? 'true' : 'false'}
          aria-label={menuLabel}
          disabled={disabled}
          onClick={() => m.setOpen(!m.open)}
          onKeyDown={e => {
            if (e.key === 'ArrowDown') { e.preventDefault(); m.setOpen(true) }
          }}
        >
          <Icon name="expand_more" size={22} className="medo-mb__chev" />
        </button>
      </div>
      {m.open ? (
        <MenuPop items={items} onSelect={onSelect} onClose={m.close} align={align} ariaLabel={menuLabel} />
      ) : null}
    </div>
  )
}

export function IconMenuButton({
  icon = 'more_vert',
  items = [],
  onSelect,
  variant = 'neutral',
  align = 'end',
  disabled = false,
  ariaLabel = 'Weitere Aktionen',
  className,
  style,
  ...rest
}) {
  const m = useMenuState()

  return (
    <div ref={m.wrapRef} className={['medo-mb', className].filter(Boolean).join(' ')} style={style} {...rest}>
      <button
        ref={m.btnRef}
        type="button"
        className={['medo-mb__btn', 'medo-mb__btn--' + variant, 'medo-mb__btn--icon'].join(' ')}
        aria-haspopup="menu"
        aria-expanded={m.open ? 'true' : 'false'}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => m.setOpen(!m.open)}
        onKeyDown={e => {
          if (e.key === 'ArrowDown') { e.preventDefault(); m.setOpen(true) }
        }}
      >
        <Icon name={icon} size={22} />
      </button>
      {m.open ? (
        <MenuPop items={items} onSelect={onSelect} onClose={m.close} align={align} ariaLabel={ariaLabel} />
      ) : null}
    </div>
  )
}
