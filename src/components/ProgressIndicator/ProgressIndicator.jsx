import { Icon } from '../Icon/Icon'
import './ProgressIndicator.css'

/* medo Design System · ProgressIndicator
   Schritte einer Abfolge: erledigt, aktiv, offen — oder fehlgeschlagen.
   Die Linie zwischen zwei Schritten ist gefüllt, solange der Fortschritt sie überschritten hat. */

export function ProgressIndicator({
  steps = [],
  current = 0,
  orientation = 'horizontal',
  onStepClick,
  clickableDone = true,
  ariaLabel = 'Fortschritt',
  className,
  style,
  ...rest
}) {
  return (
    <div
      role="list"
      aria-label={ariaLabel}
      className={['medo-pi', 'medo-pi--' + orientation, className].filter(Boolean).join(' ')}
      style={style}
      {...rest}
    >
      {steps.map((s, i) => {
        const state = s.status || (i < current ? 'done' : i === current ? 'active' : 'pending')
        const done = state === 'done'
        const clickable = !!onStepClick && done && clickableDone
        const lineFilled = i < current
        const Step = clickable ? 'button' : 'div'

        return (
          <div key={i} role="listitem" className="medo-pi__li">
            <Step
              type={clickable ? 'button' : undefined}
              aria-current={state === 'active' ? 'step' : undefined}
              onClick={clickable ? () => onStepClick(i, s) : undefined}
              className={[
                'medo-pi__step',
                'medo-pi__step--' + state,
                clickable ? 'medo-pi__step--clickable' : null,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className="medo-pi__head">
                <span className="medo-pi__dot">
                  {state === 'done' ? (
                    <Icon name="check" size={18} />
                  ) : state === 'error' ? (
                    <Icon name="close" size={18} />
                  ) : (
                    i + 1
                  )}
                </span>
                {i < steps.length - 1 ? (
                  <span
                    className={['medo-pi__line', lineFilled ? 'medo-pi__line--filled' : null]
                      .filter(Boolean)
                      .join(' ')}
                    aria-hidden="true"
                  />
                ) : null}
              </div>
              <div className="medo-pi__body">
                <div className="medo-pi__title">
                  {s.title}
                  {s.optional ? <span className="medo-pi__opt">optional</span> : null}
                </div>
                {s.subtitle ? <div className="medo-pi__sub">{s.subtitle}</div> : null}
              </div>
            </Step>
          </div>
        )
      })}
    </div>
  )
}
