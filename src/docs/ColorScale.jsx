import { SCALE_STEPS, useTokenValues } from './tokens'

const TRACK = 'grid gap-[var(--medo-space-2xs)] items-end'
const TRACK_COLS = { gridTemplateColumns: 'var(--docs-scale-label) repeat(12, var(--docs-scale-step))' }
const MICRO = '[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-xs)] text-[var(--medo-text-muted)]'

/* One horizontally scrollable region for the whole table so the 12 step
   columns stay aligned across every scale. */
export function ColorScaleGrid({ scales, roleLabel }) {
  const names = scales.flatMap((scale) => SCALE_STEPS.map(scale.tokenFor))
  const values = useTokenValues(names)

  return (
    <div className="overflow-x-auto [-webkit-overflow-scrolling:touch] pb-[var(--medo-space-xs)]">
      <div className="min-w-max flex flex-col gap-[var(--medo-space-sm)]">
        <div className={TRACK} style={TRACK_COLS}>
          <div />
          {SCALE_STEPS.map((step) => (
            <div key={step} className={`${MICRO} text-center`}>{step}</div>
          ))}
        </div>

        {scales.map((scale) => (
          <div key={scale.name} className={TRACK} style={TRACK_COLS}>
            <div className="flex flex-col gap-[var(--medo-space-3xs)] pr-[var(--medo-space-xs)]">
              <span className="[font-family:var(--medo-font-sans)] [font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)]">
                {scale.name}
              </span>
              <span className={MICRO}>{scale.role ? `${roleLabel} ${scale.role}` : scale.sublabel}</span>
            </div>
            {SCALE_STEPS.map((step) => {
              const token = scale.tokenFor(step)
              return (
                <div key={step} className="flex flex-col gap-[var(--medo-space-3xs)]">
                  <div
                    className="h-[var(--medo-space-2xl)] rounded-[var(--medo-radius-sm)] border border-[var(--medo-border-subtle)]"
                    style={{ background: `var(${token})` }}
                  />
                  <span className={`${MICRO} text-center uppercase`}>{values[token]}</span>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

/* Single swatches with their token name, the alias step they point at and the
   value the browser resolved. */
export function SwatchList({ tokens }) {
  const names = tokens.map((entry) => `--medo-${entry.name}`)
  const values = useTokenValues(names)

  return (
    <div className="grid grid-cols-2 max-[900px]:grid-cols-1 gap-x-[var(--medo-space-xl)]">
      {tokens.map((entry) => {
        const token = `--medo-${entry.name}`
        return (
          <div
            key={entry.name}
            className="flex items-center gap-[var(--medo-space-sm)] py-[var(--medo-space-xs)] border-b border-[var(--medo-border-subtle)]"
          >
            <span
              className="w-[var(--medo-space-xl)] h-[var(--medo-space-xl)] rounded-[var(--medo-radius-md)] border border-[var(--medo-border)] shrink-0"
              style={{ background: `var(${token})` }}
            />
            <div className="flex flex-col gap-[var(--medo-space-3xs)] min-w-0">
              <span className="[font-family:var(--medo-font-mono)] [font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text)] truncate">
                {entry.name}
              </span>
              <span className={`${MICRO} truncate uppercase`}>{entry.ref} · {values[token]}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
