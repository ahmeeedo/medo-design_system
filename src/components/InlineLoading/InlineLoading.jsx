import { Icon } from '../Icon/Icon'
import './InlineLoading.css'

/* medo Design System · InlineLoading
   Kleiner Wartezustand im Textfluss: drei pulsierende Punkte, danach Häkchen oder Kreuz.
   Für Schaltflächen, Zeilen und neben Feldern — nie für ganze Seitenbereiche. */

export function InlineLoading({
  status = 'loading',
  label,
  size = 'md',
  inherit = false,
  className,
  style,
  ...rest
}) {
  const glyph = size === 'sm' ? 16 : 20
  const dot = size === 'sm' ? 5 : 6

  const mark =
    status === 'loading' ? (
      <span className="medo-il__dots" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="medo-il__dot"
            style={{ width: dot + 'px', height: dot + 'px' }}
          />
        ))}
      </span>
    ) : status === 'success' ? (
      <Icon name="check_circle" size={glyph} />
    ) : status === 'error' ? (
      <Icon name="error" size={glyph} />
    ) : null

  return (
    <span
      className={[
        'medo-il',
        'medo-il--' + status,
        'medo-il--' + size,
        inherit ? 'medo-il--inherit' : null,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role="status"
      aria-live="polite"
      aria-busy={status === 'loading' ? 'true' : undefined}
      style={style}
      {...rest}
    >
      {mark}
      {label ? <span className="medo-il__txt">{label}</span> : null}
    </span>
  )
}
