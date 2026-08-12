import { useEffect, useRef, useState } from 'react'
import { Icon } from '../Icon/Icon'
import './Dropdown.css'

/* medo Design System · Dropdown (+ MenuList)
   Auslöser mit Menü: Schaltfläche mit Chevron oder Kebab-Icon.
   `MenuList` ist die gemeinsame Menüfläche des Systems — Menu und MenuButtons importieren sie
   von hier. Tastatur: Pfeile bewegen, Enter wählt, Esc schließt, Home/End an die Ränder,
   Tippen springt. */

/* Gemeinsame Menüfläche. Items: {value,label,icon,shortcut,danger,disabled,checked,items}
   sowie {type:"divider"} und {type:"heading",label}. */
export function MenuList({
  items = [],
  onSelect,
  onClose,
  autoFocus = true,
  ariaLabel,
  minWidth,
  selectionMode,
  className,
  style,
  ...rest
}) {
  const ref = useRef(null)
  const [openSub, setOpenSub] = useState(null)
  const typed = useRef({ text: '', t: 0 })

  const rows = () =>
    Array.prototype.slice.call(
      ref.current.querySelectorAll(
        ':scope > .medo-menu__item:not(:disabled), :scope > .medo-menu__sub > .medo-menu__item:not(:disabled)'
      )
    )

  useEffect(() => {
    if (!autoFocus || !ref.current) return
    const r = rows()
    if (r.length) r[0].focus()
    else ref.current.focus()
  }, [])

  const move = dir => {
    const r = rows()
    if (!r.length) return
    const i = r.indexOf(document.activeElement)
    const next = dir === 'first' ? r[0] : dir === 'last' ? r[r.length - 1] : r[(i + dir + r.length) % r.length]
    next.focus()
  }

  const onKeyDown = e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); move(1) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1) }
    else if (e.key === 'Home') { e.preventDefault(); move('first') }
    else if (e.key === 'End') { e.preventDefault(); move('last') }
    else if (e.key === 'Escape') { e.preventDefault(); if (onClose) onClose() }
    else if (e.key.length === 1 && /\S/.test(e.key)) {
      /* Tippen springt zum passenden Eintrag. */
      const now = Date.now()
      typed.current.text = now - typed.current.t < 800 ? typed.current.text + e.key : e.key
      typed.current.t = now
      const q = typed.current.text.toLowerCase()
      /* Nur der Labeltext zählt — Icon-Ligatur und Kürzel bleiben außen vor. */
      const hit = rows().find(el => {
        const lbl = el.querySelector('.medo-menu__lbl') || el
        return (lbl.textContent || '').trim().toLowerCase().indexOf(q) === 0
      })
      if (hit) hit.focus()
    }
  }

  const pick = it => {
    if (it.disabled) return
    if (onSelect) onSelect(it.value, it)
    if (onClose && !it.keepOpen) onClose()
  }

  const renderItem = (it, i) => {
    if (it.type === 'divider')
      return <div key={'d' + i} className="medo-menu__div" role="separator" />
    if (it.type === 'heading')
      return <div key={'h' + i} className="medo-menu__heading" role="presentation">{it.label}</div>

    const hasSub = it.items && it.items.length
    const checkable = selectionMode === 'single' || selectionMode === 'multiple' || it.checked !== undefined

    const Tag = it.href ? 'a' : 'button'
    const button = (
      <Tag
        key={i}
        type={it.href ? undefined : 'button'}
        href={it.href}
        role={
          hasSub
            ? 'menuitem'
            : selectionMode === 'single'
              ? 'menuitemradio'
              : selectionMode === 'multiple'
                ? 'menuitemcheckbox'
                : 'menuitem'
        }
        aria-checked={checkable ? (it.checked ? 'true' : 'false') : undefined}
        aria-haspopup={hasSub ? 'menu' : undefined}
        aria-expanded={hasSub ? (openSub === i ? 'true' : 'false') : undefined}
        tabIndex={-1}
        disabled={it.disabled ? true : undefined}
        className={['medo-menu__item', it.danger ? 'medo-menu__item--danger' : null].filter(Boolean).join(' ')}
        onClick={e => {
          if (hasSub) { e.preventDefault(); setOpenSub(openSub === i ? null : i); return }
          pick(it)
        }}
        onMouseEnter={() => hasSub && setOpenSub(i)}
        onKeyDown={e => {
          if (hasSub && e.key === 'ArrowRight') { e.preventDefault(); setOpenSub(i) }
          else if (!hasSub && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); pick(it) }
          else if (e.key === 'ArrowLeft' && onClose) { e.preventDefault(); onClose() }
        }}
      >
        {checkable ? (
          <span className="medo-menu__ic" style={{ width: '20px', display: 'inline-flex' }} aria-hidden="true">
            {it.checked ? <Icon name="check" size={20} /> : null}
          </span>
        ) : it.icon ? (
          <Icon name={it.icon} size={20} className="medo-menu__ic" />
        ) : null}
        <span className="medo-menu__lbl">{it.label}</span>
        {it.shortcut ? <span className="medo-menu__sc">{it.shortcut}</span> : null}
        {hasSub ? <Icon name="chevron_right" size={20} className="medo-menu__ic" /> : null}
      </Tag>
    )

    if (!hasSub) return button

    return (
      <div key={i} className="medo-menu__sub" onMouseLeave={() => setOpenSub(null)}>
        {button}
        {openSub === i ? (
          <div className="medo-menu__subwrap">
            <MenuList items={it.items} onSelect={onSelect} onClose={onClose} autoFocus={false} />
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <div
      ref={ref}
      role="menu"
      aria-label={ariaLabel}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      className={['medo-menu', className].filter(Boolean).join(' ')}
      style={minWidth ? { minWidth, ...style } : style}
      {...rest}
    >
      {items.map(renderItem)}
    </div>
  )
}

export function Dropdown({
  label,
  icon,
  trigger = 'button',
  items = [],
  onSelect,
  size = 'md',
  align = 'start',
  selectionMode,
  disabled = false,
  menuMinWidth,
  ariaLabel,
  className,
  style,
  ...rest
}) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)
  const btnRef = useRef(null)
  const kebab = trigger === 'kebab'

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

  return (
    <div ref={wrapRef} className={['medo-dd', className].filter(Boolean).join(' ')} style={style} {...rest}>
      <button
        ref={btnRef}
        type="button"
        className={[
          'medo-dd__btn',
          size === 'sm' ? 'medo-dd__btn--sm' : null,
          kebab ? 'medo-dd__btn--kebab' : null,
        ]
          .filter(Boolean)
          .join(' ')}
        aria-haspopup="menu"
        aria-expanded={open ? 'true' : 'false'}
        aria-label={kebab ? ariaLabel || 'Weitere Aktionen' : undefined}
        disabled={disabled}
        onClick={() => setOpen(!open)}
        onKeyDown={e => {
          if (e.key === 'ArrowDown' || (e.key === 'Enter' && !open)) {
            e.preventDefault()
            setOpen(true)
          }
        }}
      >
        {kebab ? (
          <Icon name={icon || 'more_vert'} size={size === 'sm' ? 20 : 22} />
        ) : (
          <>
            {icon ? <Icon name={icon} size={size === 'sm' ? 20 : 22} /> : null}
            <span>{label}</span>
            <Icon name="expand_more" size={size === 'sm' ? 20 : 22} className="medo-dd__chev" />
          </>
        )}
      </button>
      {open ? (
        <div
          className="medo-dd__pop"
          style={{
            top: 'calc(100% + 6px)',
            left: align === 'start' ? 0 : 'auto',
            right: align === 'end' ? 0 : 'auto',
          }}
        >
          <MenuList
            items={items}
            onSelect={onSelect}
            onClose={close}
            selectionMode={selectionMode}
            minWidth={menuMinWidth}
            ariaLabel={ariaLabel || label}
          />
        </div>
      ) : null}
    </div>
  )
}
