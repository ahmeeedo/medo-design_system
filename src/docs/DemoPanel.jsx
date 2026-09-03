import { useId, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { generateId } from './anchors'
import { Icon, Select, Toggle } from '../components'

/* Sort rule, identical on every documentation page: pickers before switches,
   inside each block by label, ties broken by the order the page declares them.
   Pages do not order their controls — the panel does, so a control sits in the
   same place everywhere. */
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

/* Stands for "none of the named examples". It is offered in the picker only
   while it applies, so the picker never claims a state that no longer holds. */
const CUSTOM = '__custom__'

export function DemoPanel({ component, controls, presets }) {
  const { t } = useTranslation()
  const defaults = useMemo(
    () => Object.fromEntries(controls.map(c => [c.id, c.default])),
    [controls]
  )
  const [values, setValues] = useState(defaults)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const detailsId = useId()

  const update = (id, value) => setValues(prev => ({ ...prev, [id]: value }))

  /* A named example lists only what it deviates in; everything else falls back
     to the declared default, so picking one always yields a full, known state. */
  const named = presets || []
  const resolve = preset => ({ ...defaults, ...preset.values })
  const active = named.find(preset => {
    const target = resolve(preset)
    return Object.keys(defaults).every(id => target[id] === values[id])
  })

  const shown = sortControls(controls).filter(control => isVisible(control, values))
  const hasPresets = named.length > 0
  const hasBar = hasPresets || controls.length > 0
  /* Without named examples the picker is absent, so a collapsed detail area
     would leave the panel with no controls at all and nothing to open it for.
     Those pages keep the bar they have today. */
  const collapsible = hasPresets && controls.length > 0
  const controlsHidden = collapsible && !detailsOpen

  return (
    <div id={generateId(t('demoPanel.title'))} className="mb-[var(--medo-space-xl)] px-[var(--medo-space-xl)] max-w-[980px]">
      <h2 className="[font-size:var(--medo-text-2xl)] [font-family:var(--medo-font-sans)] [font-weight:var(--medo-weight-semibold)] tracking-[var(--medo-tracking-tight)] text-[var(--medo-text)] mb-[var(--medo-space-md)] pb-[var(--medo-space-xs)] border-b border-[var(--medo-divider)]">
        {t('demoPanel.title')}
      </h2>
      {/* No overflow-hidden: it clipped every popup that opens inside the preview.
          The children carry the corners instead. */}
      <div className="border border-[var(--medo-border)] rounded-[var(--medo-radius-lg)]">
        {hasBar && (
          <div className="bg-[var(--medo-surface-container)] border-b border-[var(--medo-border-subtle)] rounded-t-[var(--medo-radius-lg)]">
            {hasPresets && (
              <div className="flex items-end gap-[var(--medo-space-lg)] max-[768px]:flex-col max-[768px]:items-stretch px-[var(--medo-space-lg)] py-[var(--medo-space-md)]">
                <div className="w-[240px] max-[768px]:w-full">
                  <Select
                    size="sm"
                    fullWidth
                    label={t('demoPanel.example')}
                    value={active ? active.id : CUSTOM}
                    onChange={e => {
                      const picked = named.find(preset => preset.id === e.target.value)
                      if (picked) setValues(resolve(picked))
                    }}
                    options={[
                      ...named.map(preset => ({ value: preset.id, label: preset.label })),
                      ...(active ? [] : [{ value: CUSTOM, label: t('demoPanel.custom') }]),
                    ]}
                  />
                </div>
                {collapsible && (
                  <button
                    type="button"
                    aria-expanded={detailsOpen}
                    aria-controls={detailsId}
                    onClick={() => setDetailsOpen(open => !open)}
                    className="inline-flex items-center gap-[var(--medo-space-2xs)] h-[36px] px-[var(--medo-space-sm)] bg-transparent border-0 rounded-[var(--medo-radius-md)] [font-family:var(--medo-font-sans)] [font-size:var(--medo-text-sm)] [font-weight:var(--medo-weight-medium)] text-[var(--medo-text-muted)] cursor-pointer transition-colors duration-150 ease-out hover:text-[var(--medo-text)] hover:bg-[var(--medo-state-hover)] outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--medo-focus-ring)]"
                  >
                    {t('demoPanel.settings')}
                    <Icon name={detailsOpen ? 'expand_less' : 'expand_more'} size={20} />
                  </button>
                )}
              </div>
            )}

            {shown.length > 0 && (
              <div
                id={detailsId}
                hidden={controlsHidden}
                role="group"
                aria-label={t('demoPanel.controls')}
                className={`grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] max-[768px]:grid-cols-1 items-end gap-x-[var(--medo-space-lg)] gap-y-[var(--medo-space-sm)] px-[var(--medo-space-lg)] py-[var(--medo-space-md)] ${hasPresets ? 'border-t border-[var(--medo-border-subtle)]' : ''}`}
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
            )}
          </div>
        )}

        <div className={`bg-[var(--medo-surface)] flex items-center justify-center min-h-[200px] p-[var(--medo-space-xl)] rounded-b-[var(--medo-radius-lg)] ${hasBar ? '' : 'rounded-t-[var(--medo-radius-lg)]'}`}>
          {component(values)}
        </div>
      </div>
      <p className="mt-[var(--medo-space-sm)] text-sm [font-family:var(--medo-font-sans)] text-[var(--medo-text-muted)]">
        {t('demoPanel.hint')}
      </p>
    </div>
  )
}
