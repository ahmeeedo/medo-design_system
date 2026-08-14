import { useRef, useState } from 'react'
import { Icon } from '../Icon/Icon'
import './FileUploader.css'

/* medo Design System · FileUploader
   Dateien wählen oder in die Ablagefläche ziehen. Zeigt je Datei Name, Größe und Status.
   Prüft Typ und Größe vor dem Übernehmen; abgelehnte Dateien erscheinen mit Grund. */

const bytes = (n) => {
  if (n === undefined || n === null) return ''
  if (n < 1024) return n + ' B'
  if (n < 1024 * 1024) return (n / 1024).toFixed(0) + ' KB'
  return (n / 1024 / 1024).toFixed(1).replace('.', ',') + ' MB'
}

export function FileUploader({
  files = [],
  onFilesAdded,
  onRemove,
  label,
  helper,
  accept,
  multiple = true,
  maxSize,
  disabled = false,
  buttonText = 'Datei auswählen',
  dropText = 'oder hierher ziehen',
  compact = false,
  removeLabel = 'Entfernen',
  className,
  style,
  ...rest
}) {
  const inputRef = useRef(null)
  const [over, setOver] = useState(false)

  const check = (f) => {
    if (maxSize && f.size > maxSize) return 'Datei ist größer als ' + bytes(maxSize) + '.'
    if (accept) {
      const ok = accept
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .some((a) => {
          if (a.endsWith('/*')) return (f.type || '').startsWith(a.slice(0, -1))
          if (a.startsWith('.')) return f.name.toLowerCase().endsWith(a)
          return (f.type || '').toLowerCase() === a
        })
      if (!ok) return 'Dateityp wird nicht akzeptiert.'
    }
    return null
  }

  const take = (list) => {
    const arr = Array.prototype.slice.call(list || [])
    if (!arr.length || !onFilesAdded) return
    onFilesAdded(
      arr.map((f) => {
        const err = check(f)
        return {
          name: f.name,
          size: f.size,
          file: f,
          status: err ? 'error' : 'done',
          error: err || undefined,
        }
      })
    )
  }

  const hint = [
    accept ? accept.toUpperCase().replace(/\./g, '').replace(/,/g, ', ') : null,
    maxSize ? 'bis ' + bytes(maxSize) : null,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className={['medo-fu', className].filter(Boolean).join(' ')} style={style} {...rest}>
      {label ? <span className="medo-fu__label">{label}</span> : null}
      {helper ? <div className="medo-fu__helper">{helper}</div> : null}

      <input
        ref={inputRef}
        aria-hidden="true"
        tabIndex={-1}
        type="file"
        className="medo-fu__sr"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(e) => {
          take(e.target.files)
          e.target.value = ''
        }}
      />

      {compact ? (
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}
          onDragOver={(e) => {
            e.preventDefault()
            if (!disabled) setOver(true)
          }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setOver(false)
            if (!disabled) take(e.dataTransfer.files)
          }}
        >
          <button
            type="button"
            className="medo-fu__btn"
            style={{ pointerEvents: 'auto', cursor: disabled ? 'not-allowed' : 'pointer' }}
            disabled={disabled}
            onClick={() => inputRef.current && inputRef.current.click()}
          >
            <Icon name="attach_file" size={18} />
            {buttonText}
          </button>
          <span className="medo-fu__hint" style={{ color: 'var(--medo-text-muted)' }}>
            {hint}
          </span>
        </div>
      ) : (
        <button
          type="button"
          className={['medo-fu__zone', over ? 'medo-fu__zone--over' : null].filter(Boolean).join(' ')}
          disabled={disabled}
          onClick={() => inputRef.current && inputRef.current.click()}
          onDragOver={(e) => {
            e.preventDefault()
            if (!disabled) setOver(true)
          }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setOver(false)
            if (!disabled) take(e.dataTransfer.files)
          }}
        >
          <div className="medo-fu__inner">
            <Icon name="cloud_upload" size={30} className="medo-fu__ic" />
            <span className="medo-fu__btn">
              <Icon name="attach_file" size={18} />
              {buttonText}
            </span>
            <span>{dropText}</span>
            {accept || maxSize ? <span className="medo-fu__hint">{hint}</span> : null}
          </div>
        </button>
      )}

      {files.length ? (
        <ul className="medo-fu__list">
          {files.map((f, i) => (
            <li
              key={f.id !== undefined ? f.id : i}
              className={['medo-fu__item', f.status === 'error' ? 'medo-fu__item--error' : null]
                .filter(Boolean)
                .join(' ')}
            >
              <span className="medo-fu__thumb">
                {f.preview ? (
                  <img src={f.preview} alt="" />
                ) : (
                  <Icon name={f.status === 'error' ? 'error' : 'description'} size={22} />
                )}
              </span>

              <div className="medo-fu__body">
                <div className="medo-fu__name">{f.name}</div>
                <div className="medo-fu__meta">{f.status === 'error' ? f.error : bytes(f.size)}</div>
                {f.status === 'uploading' ? (
                  <div className="medo-fu__bar">
                    <div className="medo-fu__fill" style={{ width: (f.progress || 0) + '%' }} />
                  </div>
                ) : null}
              </div>

              {f.status === 'done' ? <Icon name="check_circle" size={20} className="medo-fu__ok" /> : null}

              {onRemove ? (
                <button
                  type="button"
                  className="medo-fu__x"
                  aria-label={removeLabel + ' — ' + f.name}
                  onClick={() => onRemove(f, i)}
                >
                  <Icon name="close" size={19} />
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
