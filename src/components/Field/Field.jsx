import { Icon } from '../Icon/Icon'
import './Field.css'

/* medo Design System · Field
   Gemeinsames Gerüst aller Formularfelder: Label, Feldrahmen, Hilfetext, Fehler- und Erfolgsmeldung.
   Wird von TextInput und Select benutzt und ist auch einzeln verwendbar, um eigene
   Eingabeelemente in dieselbe Hülle zu setzen. */

export function Field({
  label,
  htmlFor,
  required = false,
  optional = false,
  hint,
  error,
  success,
  fullWidth = false,
  children,
  className,
  style,
}) {
  const msgText = error || success || hint
  const msgKind = error ? 'error' : success ? 'success' : null
  const msgIcon = error ? 'error' : success ? 'check_circle' : null

  return (
    <div
      className={['medo-field', fullWidth ? 'medo-field--fullWidth' : null, className]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      {label ? (
        <label className="medo-field__label" htmlFor={htmlFor}>
          {label}
          {required ? (
            <span className="medo-field__req" aria-hidden="true">
              *
            </span>
          ) : null}
          {optional && !required ? <span className="medo-field__optional">(optional)</span> : null}
        </label>
      ) : null}
      {children}
      {msgText ? (
        <div
          id={htmlFor ? htmlFor + '-msg' : undefined}
          className={['medo-field__msg', msgKind ? 'medo-field__msg--' + msgKind : null]
            .filter(Boolean)
            .join(' ')}
          role={error ? 'alert' : undefined}
        >
          {msgIcon ? <Icon name={msgIcon} size={16} style={{ marginTop: '1px' }} /> : null}
          <span>{msgText}</span>
        </div>
      ) : null}
    </div>
  )
}
