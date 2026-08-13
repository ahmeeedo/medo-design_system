import { useCallback, useEffect, useRef, useState } from 'react'
import { Icon } from '../Icon/Icon'
import './Notification.css'

/* medo Design System · Notification
   Rückmeldungen an die Person. Zwei Formen:
   - Notification: eingebettetes Inline-Banner, bleibt stehen.
   - ToastHost + toast(): schwebender Stapel oben rechts, blendet nach ~5 s aus.
   Fünf Statustypen, zwei Betonungsstufen. */

/* Farbrollen. neutral nutzt die warme Neutralskala, die vier übrigen ihre Statustokens. */
const MEDO_NT_KINDS = {
  info:    { icon: 'info',          surface: '--medo-info-surface',    border: '--medo-info-border',    text: '--medo-info-text',    accent: '--medo-info-solid-hover',    solid: '--medo-info-solid',    onSolid: '--medo-info-on-solid' },
  success: { icon: 'check_circle',  surface: '--medo-success-surface', border: '--medo-success-border', text: '--medo-success-text', accent: '--medo-success-solid-hover', solid: '--medo-success-solid', onSolid: '--medo-success-on-solid' },
  warning: { icon: 'warning',       surface: '--medo-warning-surface', border: '--medo-warning-border', text: '--medo-warning-text', accent: '--medo-warning-solid-hover', solid: '--medo-warning-solid', onSolid: '--medo-warning-on-solid' },
  error:   { icon: 'error',         surface: '--medo-error-surface',   border: '--medo-error-border',   text: '--medo-error-text',   accent: '--medo-error-solid-hover',   solid: '--medo-error-solid',   onSolid: '--medo-error-on-solid' },
  neutral: { icon: 'notifications', surface: '--medo-surface-container', border: '--medo-border', text: '--medo-text', accent: '--medo-color-stone-700', solid: '--medo-color-stone-700', onSolid: '--medo-color-white' },
}

export function Notification({
  kind = 'info',
  emphasis = 'soft',
  title,
  children,
  icon,
  action,
  onClose,
  closeLabel = 'Schließen',
  role,
  className,
  style,
  ...rest
}) {
  const set = MEDO_NT_KINDS[kind] || MEDO_NT_KINDS.info
  const solid = emphasis === 'solid'
  const singleLine = !children

  const skin = solid
    ? { background: 'var(' + set.solid + ')', color: 'var(' + set.onSolid + ')' }
    : {
        background: 'var(' + set.surface + ')',
        borderColor: 'var(' + set.border + ')',
        color: 'var(' + set.text + ')',
      }

  const actionButton = action ? (
    <button
      type="button"
      className="medo-nt__action"
      style={solid ? null : { color: 'var(' + set.accent + ')' }}
      onClick={action.onClick}
    >
      {action.label}
    </button>
  ) : null

  return (
    <div
      className={[
        'medo-nt',
        solid ? 'medo-nt--solid' : null,
        singleLine ? 'medo-nt--singleline' : null,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role={role || (kind === 'error' ? 'alert' : 'status')}
      style={{ ...skin, ...style }}
      {...rest}
    >
      <Icon
        name={icon || set.icon}
        size={22}
        className="medo-nt__icon"
        color={solid ? 'currentColor' : 'var(' + set.accent + ')'}
      />
      <div className="medo-nt__body">
        {title ? (
          <div className={singleLine && !solid ? 'medo-nt__text' : 'medo-nt__title'}>{title}</div>
        ) : null}
        {children ? <div className="medo-nt__text">{children}</div> : null}
        {action && !singleLine ? <div className="medo-nt__actions">{actionButton}</div> : null}
      </div>
      {action && singleLine ? actionButton : null}
      {onClose ? (
        <button type="button" className="medo-nt__x" aria-label={closeLabel} onClick={onClose}>
          <Icon name="close" size={20} />
        </button>
      ) : null}
    </div>
  )
}

/* ---------- Toast ---------- */

const medoToastBus = { listeners: [], seq: 0 }

/** Zeigt einen Toast. Gibt die id zurück, mit der er vorzeitig geschlossen werden kann. */
export function toast(opts) {
  const o = typeof opts === 'string' ? { title: opts } : opts || {}
  const id = ++medoToastBus.seq
  medoToastBus.listeners.forEach(fn => fn({ type: 'add', item: { id, duration: 5000, kind: 'info', ...o } }))
  return id
}
toast.dismiss = function (id) {
  medoToastBus.listeners.forEach(fn => fn({ type: 'remove', id }))
}

export function ToastHost({ label = 'Benachrichtigungen' }) {
  const [items, setItems] = useState([])
  const timers = useRef({})

  const remove = useCallback(id => {
    clearTimeout(timers.current[id])
    delete timers.current[id]
    setItems(list => list.filter(t => t.id !== id))
  }, [])

  useEffect(() => {
    const onEvent = e => {
      if (e.type === 'remove') return remove(e.id)
      const item = e.item
      setItems(list => list.concat(item))
      /* Fehler bleiben stehen, bis sie gelöst sind — sie blenden nicht aus. */
      if (item.duration && item.kind !== 'error') {
        timers.current[item.id] = setTimeout(() => remove(item.id), item.duration)
      }
    }
    medoToastBus.listeners.push(onEvent)
    const running = timers.current
    return () => {
      medoToastBus.listeners = medoToastBus.listeners.filter(f => f !== onEvent)
      Object.values(running).forEach(clearTimeout)
    }
  }, [remove])

  return (
    <div className="medo-toast-host" role="region" aria-label={label} aria-live="polite">
      {items.map(t => {
        const set = MEDO_NT_KINDS[t.kind] || MEDO_NT_KINDS.info
        return (
          <div
            key={t.id}
            className="medo-toast"
            role={t.kind === 'error' ? 'alert' : 'status'}
            style={{ borderLeftColor: 'var(' + set.accent + ')' }}
          >
            <Icon
              name={t.icon || set.icon}
              size={21}
              className="medo-nt__icon"
              color={'var(' + set.accent + ')'}
            />
            <div className="medo-nt__body">
              {t.title ? <div className="medo-toast__title">{t.title}</div> : null}
              {t.description ? <div className="medo-toast__text">{t.description}</div> : null}
            </div>
            <button
              type="button"
              className="medo-nt__x"
              aria-label="Schließen"
              style={{ color: 'var(--medo-icon-muted)' }}
              onClick={() => remove(t.id)}
            >
              <Icon name="close" size={20} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
