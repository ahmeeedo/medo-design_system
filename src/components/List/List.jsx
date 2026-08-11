import { Icon } from '../Icon/Icon'
import './List.css'

/* medo Design System · List
   Statische Anzeige-Liste: aufgezählt, nummeriert, verschachtelt, als Inhalts-Zeilen
   oder als Schlüssel-Wert-Paare. Nichts hier ist anklickbar — dafür ContainedList. */

export function List({
  items = [],
  variant = 'unordered',
  size = 'md',
  flush = false,
  emptyText,
  className,
  style,
  ...rest
}) {
  const glyph = size === 'sm' ? 18 : 20

  if (!items.length && emptyText) {
    return (
      <p className="medo-list__empty" style={style}>
        {emptyText}
      </p>
    )
  }

  const cls = [
    'medo-list',
    'medo-list--' + variant,
    'medo-list--' + size,
    flush ? 'medo-list--flush' : null,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const Tag = variant === 'ordered' ? 'ol' : 'ul'

  return (
    <Tag className={cls} style={style} {...rest}>
      {items.map((it, i) => {
        const item = typeof it === 'string' ? { text: it } : it

        if (variant === 'content') {
          return (
            <li key={i} className="medo-list__row">
              {item.icon ? (
                <Icon name={item.icon} size={glyph} className="medo-list__ic" />
              ) : null}
              <div style={{ minWidth: 0 }}>
                <div className="medo-list__t">{item.title || item.text}</div>
                {item.description ? (
                  <div className="medo-list__d">{item.description}</div>
                ) : null}
              </div>
            </li>
          )
        }

        return (
          <li key={i}>
            {item.text || item.title}
            {item.items && item.items.length ? (
              <ul className={['medo-list', 'medo-list--' + size, 'medo-list__nested'].join(' ')}>
                {item.items.map((sub, si) => (
                  <li key={si}>{typeof sub === 'string' ? sub : sub.text}</li>
                ))}
              </ul>
            ) : null}
          </li>
        )
      })}
    </Tag>
  )
}

export function KeyValueList({
  items = [],
  layout = 'columns',
  monoValues = true,
  className,
  style,
  ...rest
}) {
  return (
    <dl
      className={['medo-kv', layout === 'stacked' ? 'medo-kv--stacked' : null, className]
        .filter(Boolean)
        .join(' ')}
      style={style}
      {...rest}
    >
      {items.map((it, i) => (
        <div key={i} className="medo-kv__row">
          <dt className="medo-kv__k">{it.key}</dt>
          <dd
            className={[
              'medo-kv__v',
              (it.mono !== undefined ? it.mono : monoValues && it.numeric)
                ? 'medo-kv__v--mono'
                : null,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {it.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
