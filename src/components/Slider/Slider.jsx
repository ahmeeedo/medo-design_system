import { useRef, useState } from 'react'
import { Icon } from '../Icon/Icon'
import './Slider.css'

/* medo Design System · Slider
   Wert stufenlos oder in Schritten. Weißer Griff mit Rahmen, Wert-Bubble beim Ziehen und bei
   Fokus, sichtbare Ticks im diskreten Modus. Ziehen (Pointer) und Tastatur. */

export function Slider({
  value,
  defaultValue = 0,
  onChange,
  onChangeEnd,
  min = 0,
  max = 100,
  step = 1,
  size = 'md',
  orientation = 'horizontal',
  label,
  showValue = false,
  showMinMax = false,
  showTicks = false,
  stepLabels,
  formatValue,
  startIcon,
  endIcon,
  disabled = false,
  ariaLabel,
  className,
  style,
  ...rest
}) {
  const vertical = orientation === 'vertical'
  const controlled = value !== undefined
  const [inner, setInner] = useState(defaultValue)
  const val = controlled ? value : inner
  const [active, setActive] = useState(false)
  const areaRef = useRef(null)
  /* Der Drag-Handler lebt über mehrere Renders — der aktuelle Wert muss über ein Ref kommen. */
  const latest = useRef(val)
  latest.current = val

  const clamp = v => {
    const snapped = Math.round((v - min) / step) * step + min
    return Math.min(max, Math.max(min, Number(snapped.toFixed(6))))
  }
  const pct = ((val - min) / (max - min)) * 100
  const text = formatValue ? formatValue(val) : stepLabels ? stepLabels[Math.round((val - min) / step)] : val

  const emit = v => {
    const next = clamp(v)
    // Compare against the ref, not the render value: the pointermove handler is created once per
    // drag and would otherwise keep comparing against the value from pointer-down.
    if (next === latest.current) return
    latest.current = next
    if (!controlled) setInner(next)
    if (onChange) onChange(next)
  }

  const fromPoint = e => {
    const track = areaRef.current && areaRef.current.querySelector('[data-track]')
    if (!track) return
    const r = track.getBoundingClientRect()
    const ratio = vertical ? (r.bottom - e.clientY) / r.height : (e.clientX - r.left) / r.width
    emit(min + ratio * (max - min))
  }

  const onDown = e => {
    if (disabled) return
    e.preventDefault()
    setActive(true)
    fromPoint(e)
    const move = ev => fromPoint(ev)
    const up = () => {
      setActive(false)
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerup', up)
      if (onChangeEnd) onChangeEnd(latest.current)
    }
    document.addEventListener('pointermove', move)
    document.addEventListener('pointerup', up)
    const handle = areaRef.current.querySelector('[role=slider]')
    if (handle) handle.focus()
  }

  const onKey = e => {
    if (disabled) return
    const big = Math.max(step, (max - min) / 10)
    const map = {
      ArrowRight: step, ArrowUp: step,
      ArrowLeft: -step, ArrowDown: -step,
      PageUp: big, PageDown: -big,
    }
    if (e.key === 'Home') { e.preventDefault(); return emit(min) }
    if (e.key === 'End') { e.preventDefault(); return emit(max) }
    if (map[e.key] === undefined) return
    e.preventDefault()
    // Same reason as in emit: held-down keys repeat faster than renders commit.
    emit(latest.current + map[e.key])
  }

  const ticks = showTicks
    ? Array.from({ length: Math.floor((max - min) / step) + 1 }, (_, i) => min + i * step)
    : []

  const area = (
    <div ref={areaRef} className="medo-sl__area" onPointerDown={onDown}>
      <div data-track="true" className="medo-sl__track">
        <div className="medo-sl__fill" style={vertical ? { height: pct + '%' } : { width: pct + '%' }} />
        {ticks.map(t => {
          const p = ((t - min) / (max - min)) * 100
          return (
            <div
              key={t}
              className="medo-sl__tick"
              style={
                vertical
                  ? {
                      bottom: p + '%', left: '50%', top: 'auto', transform: 'translate(-50%, 50%)',
                      background: t <= val ? 'rgba(255,255,255,0.75)' : 'var(--medo-color-stone-400)',
                    }
                  : { left: p + '%', background: t <= val ? 'rgba(255,255,255,0.75)' : 'var(--medo-color-stone-400)' }
              }
            />
          )
        })}
        <div
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label={ariaLabel || (typeof label === 'string' ? label : undefined)}
          aria-orientation={vertical ? 'vertical' : undefined}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={val}
          aria-valuetext={stepLabels || formatValue ? String(text) : undefined}
          aria-disabled={disabled ? 'true' : undefined}
          className="medo-sl__handle"
          style={vertical ? { bottom: pct + '%' } : { left: pct + '%' }}
          onKeyDown={onKey}
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
        >
          <div
            className={['medo-sl__bubble', active && !disabled ? 'medo-sl__bubble--on' : null]
              .filter(Boolean)
              .join(' ')}
          >
            {text}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div
      className={[
        'medo-sl',
        'medo-sl--' + size,
        vertical ? 'medo-sl--vertical' : null,
        disabled ? 'medo-sl--disabled' : null,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
      {...rest}
    >
      {label || showValue ? (
        <div className="medo-sl__top">
          {label ? <span className="medo-sl__label">{label}</span> : null}
          {showValue ? <span className="medo-sl__num">{text}</span> : null}
        </div>
      ) : null}
      {startIcon && vertical ? <Icon name={startIcon} size={22} className="medo-sl__ic" /> : null}
      {vertical ? (
        area
      ) : (
        <div className="medo-sl__row">
          {startIcon ? <Icon name={startIcon} size={22} className="medo-sl__ic" /> : null}
          {area}
          {endIcon ? <Icon name={endIcon} size={22} className="medo-sl__ic" /> : null}
        </div>
      )}
      {endIcon && vertical ? <Icon name={endIcon} size={20} className="medo-sl__ic" /> : null}
      {showMinMax && !vertical ? (
        <div className="medo-sl__ends" style={{ padding: startIcon || endIcon ? '0 38px' : 0 }}>
          <span>{min}</span>
          <span>{max}</span>
        </div>
      ) : null}
      {stepLabels && !vertical ? (
        <div className="medo-sl__steps">
          {stepLabels.map((l, i) => (
            <span
              key={i}
              style={{ color: i === Math.round((val - min) / step) ? 'var(--medo-text)' : 'var(--medo-text-muted)' }}
            >
              {l}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  )
}
