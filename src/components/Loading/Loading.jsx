import './Loading.css'

/* medo Design System · Loading (+ Skeleton)
   Teilring-Spinner (conic-gradient mit mask, 270°) — die einzige Dauerbewegung im System.
   Dazu die Overlay- und Vollseiten-Form und Skeletons für Inhalte, deren Form schon bekannt ist. */

const MEDO_SPIN_SIZES = { sm: [20, 2], md: [32, 3], lg: [48, 4] }

export function Loading({
  size = 'md',
  label,
  variant = 'inline',
  color,
  className,
  style,
  ...rest
}) {
  const [px, w] = MEDO_SPIN_SIZES[size] || MEDO_SPIN_SIZES.md

  const block = (
    <div
      className={['medo-load', className].filter(Boolean).join(' ')}
      role="status"
      aria-busy="true"
      aria-label={label ? undefined : 'Wird geladen'}
      style={color ? { color, ...style } : style}
      {...rest}
    >
      <span
        className="medo-spin"
        style={{ width: px + 'px', height: px + 'px', '--medo-spin-w': w + 'px' }}
      />
      {label ? <span className="medo-load__txt">{label}</span> : null}
    </div>
  )

  if (variant === 'overlay') return <div className="medo-load__overlay">{block}</div>
  if (variant === 'fullpage') return <div className="medo-load__full">{block}</div>
  return block
}

export function Skeleton({
  variant = 'lines',
  lines = 3,
  rows = 4,
  height,
  width,
  className,
  style,
  ...rest
}) {
  const bar = (key, h, w) => <div key={key} className="medo-sk__b" style={{ height: h, width: w }} />

  if (variant === 'block')
    return (
      <div
        className={['medo-sk__b', className].filter(Boolean).join(' ')}
        style={{ height: height || '120px', width: width || '100%', ...style }}
        aria-hidden="true"
        {...rest}
      />
    )

  if (variant === 'card')
    return (
      <div
        className={['medo-sk__card', className].filter(Boolean).join(' ')}
        style={style}
        aria-hidden="true"
        {...rest}
      >
        <div className="medo-sk__row">
          <div
            className="medo-sk__b"
            style={{ width: '38px', height: '38px', borderRadius: '9999px', flex: 'none' }}
          />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {bar('t', '13px', '55%')}
            {bar('s', '11px', '35%')}
          </div>
        </div>
        {bar('l1', '12px', '100%')}
        {bar('l2', '12px', '88%')}
      </div>
    )

  if (variant === 'table')
    return (
      <div
        className={['medo-sk', className].filter(Boolean).join(' ')}
        style={style}
        aria-hidden="true"
        {...rest}
      >
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="medo-sk__row" style={{ gap: '16px' }}>
            {bar('a', '12px', '22%')}
            {bar('b', '12px', '34%')}
            {bar('c', '12px', '16%')}
            {bar('d', '12px', '12%')}
          </div>
        ))}
      </div>
    )

  return (
    <div
      className={['medo-sk', className].filter(Boolean).join(' ')}
      style={style}
      aria-hidden="true"
      {...rest}
    >
      {Array.from({ length: lines }).map((_, i) =>
        bar(i, height || '12px', i === lines - 1 ? '62%' : '100%')
      )}
    </div>
  )
}
