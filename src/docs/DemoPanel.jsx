import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { generateId } from './anchors'
import { Select, Toggle } from '../components'

/* Sort rule, identical on every documentation page: pickers before switches,
   inside each block by label, ties broken by the order the page declares them.
   Pages do not order their controls — the panel does, so a control sits in the
   same place everywhere. The pickers land on top because they choose the
   variant, the switches below because they refine it. */
const rank = control => (control.type === 'dropdown' ? 0 : 1)

function sortControls(controls) {
  return controls
    .map((control, index) => ({ control, index }))
    .sort((a, b) => {
      const byType = rank(a.control) - rank(b.control)
      if (byType !== 0) return byType
      const byLabel = String(a.control.label).localeCompare(String(b.control.label), 'de')
      if (byLabel !== 0) return byLabel
      return a.index - b.index
    })
    .map(entry => entry.control)
}

/* A control is shown only while it changes something. `visibleWhen` reads the
   current values and returns whether the control still bites; without it the
   control is always shown, which is what the pages that declare none rely on.
   Hidden controls keep their value: it stays in `values`, the preview keeps
   receiving it, and the control returns with it once it has an effect again. */
const isVisible = (control, values) => !control.visibleWhen || control.visibleWhen(values)

export function DemoPanel({ component, controls }) {
  const { t } = useTranslation()
  const [values, setValues] = useState(
    () => Object.fromEntries(controls.map(c => [c.id, c.default]))
  )

  const update = (id, value) => setValues(prev => ({ ...prev, [id]: value }))

  const shown = sortControls(controls).filter(control => isVisible(control, values))
  const hasControls = shown.length > 0

  return (
    <div id={generateId(t('demoPanel.title'))} className="mb-[var(--medo-space-xl)] px-[var(--medo-space-xl)] max-w-[980px]">
      <h2 className="[font-size:var(--medo-text-2xl)] [font-family:var(--medo-font-sans)] [font-weight:var(--medo-weight-semibold)] tracking-[var(--medo-tracking-tight)] text-[var(--medo-text)] mb-[var(--medo-space-md)] pb-[var(--medo-space-xs)] border-b border-[var(--medo-divider)]">
        {t('demoPanel.title')}
      </h2>
      {/* No overflow-hidden: it clipped every popup that opens inside the preview.
          The children carry the corners instead. */}
      <div className="border border-[var(--medo-border)] rounded-[var(--medo-radius-lg)] flex max-[768px]:flex-col">
        {/* The preview leads. On a narrow screen the settings drop below it, so the
            component is on screen before any of them. */}
        <div
          className={`bg-[var(--medo-surface)] flex-1 min-w-0 flex items-center justify-center min-h-[200px] p-[var(--medo-space-xl)] ${
            hasControls
              ? 'rounded-l-[var(--medo-radius-lg)] max-[768px]:rounded-l-none max-[768px]:rounded-t-[var(--medo-radius-lg)]'
              : 'rounded-[var(--medo-radius-lg)]'
          }`}
        >
          {component(values)}
        </div>

        {hasControls && (
          <div className="w-[280px] shrink-0 max-[768px]:w-auto bg-[var(--medo-surface-container)] border-l border-[var(--medo-border-subtle)] max-[768px]:border-l-0 max-[768px]:border-t rounded-r-[var(--medo-radius-lg)] max-[768px]:rounded-r-none max-[768px]:rounded-b-[var(--medo-radius-lg)] p-[var(--medo-space-lg)]">
            <h3 className="[font-size:var(--medo-text-sm)] [font-family:var(--medo-font-sans)] [font-weight:var(--medo-weight-semibold)] text-[var(--medo-text)] mb-[var(--medo-space-md)]">
              {t('demoPanel.settings')}
            </h3>
            <div
              role="group"
              aria-label={t('demoPanel.settings')}
              className="grid grid-cols-1 gap-[var(--medo-space-sm)]"
            >
              {shown.map(control =>
                control.type === 'dropdown' ? (
                  <Select
                    key={control.id}
                    size="sm"
                    fullWidth
                    label={control.label}
                    value={values[control.id]}
                    onChange={e => update(control.id, e.target.value)}
                    options={control.options.map(opt => ({ value: opt, label: opt }))}
                  />
                ) : (
                  <Toggle
                    key={control.id}
                    size="sm"
                    labelPosition="left"
                    label={control.label}
                    checked={values[control.id]}
                    onChange={next => update(control.id, next)}
                  />
                )
              )}
            </div>
          </div>
        )}
      </div>
      <p className="mt-[var(--medo-space-sm)] text-sm [font-family:var(--medo-font-sans)] text-[var(--medo-text-muted)]">
        {t('demoPanel.hint')}
      </p>
    </div>
  )
}
