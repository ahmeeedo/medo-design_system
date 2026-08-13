import { Icon } from '../Icon/Icon'
import './ProgressBar.css'

/* medo Design System · ProgressBar
   Zeigt den Fortschritt eines Vorgangs. Ohne `value` läuft die Bahn unbestimmt weiter —
   für Vorgänge, deren Dauer nicht bekannt ist. */

export function ProgressBar({
  value,
  max = 100,
  label,
  helper,
  showValue = false,
  status = 'normal',
  size = 'standard',
  statusText,
  ariaLabel,
  className,
  style,
  ...rest
}) {
  const indeterminate = value === undefined || value === null
  const pct = indeterminate ? 0 : Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div
      className={['medo-pb', 'medo-pb--' + size, 'medo-pb--' + status, className]
        .filter(Boolean)
        .join(' ')}
      style={style}
      {...rest}
    >
      {label || showValue || helper ? (
        <div className="medo-pb__top">
          <div>
            {label ? <span className="medo-pb__label">{label}</span> : null}
            {helper ? (
              <span className="medo-pb__helper" style={{ marginLeft: '8px' }}>
                {helper}
              </span>
            ) : null}
          </div>
          {showValue && !indeterminate ? (
            <span className="medo-pb__val">{Math.round(pct) + ' %'}</span>
          ) : null}
        </div>
      ) : null}
      <div
        className="medo-pb__track"
        role="progressbar"
        aria-label={ariaLabel || (typeof label === 'string' ? label : undefined)}
        aria-valuemin={indeterminate ? undefined : 0}
        aria-valuemax={indeterminate ? undefined : max}
        aria-valuenow={indeterminate ? undefined : Math.round(value)}
      >
        <div
          className={['medo-pb__fill', indeterminate ? 'medo-pb__fill--indeterminate' : null]
            .filter(Boolean)
            .join(' ')}
          style={indeterminate ? undefined : { width: pct + '%' }}
        />
      </div>
      {statusText ? (
        <div className="medo-pb__status">
          {status === 'success' || status === 'error' ? (
            <Icon name={status === 'success' ? 'check_circle' : 'error'} size={18} />
          ) : null}
          <span>{statusText}</span>
        </div>
      ) : null}
    </div>
  )
}
