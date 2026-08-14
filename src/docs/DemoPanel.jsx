import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { generateId } from './anchors'

export function DemoPanel({ component, controls }) {
  const { t } = useTranslation()
  const [values, setValues] = useState(
    () => Object.fromEntries(controls.map(c => [c.id, c.default]))
  )

  const update = (id, value) => setValues(prev => ({ ...prev, [id]: value }))

  return (
    <div id={generateId(t('demoPanel.title'))} className="mb-[var(--medo-space-xl)] px-[var(--medo-space-xl)] max-w-[980px]">
      <h2 className="[font-size:var(--medo-text-2xl)] [font-family:var(--medo-font-sans)] [font-weight:var(--medo-weight-semibold)] tracking-[var(--medo-tracking-tight)] text-[var(--medo-text)] mb-[var(--medo-space-md)] pb-[var(--medo-space-xs)] border-b border-[var(--medo-divider)]">
        {t('demoPanel.title')}
      </h2>
      <div className="border border-[var(--medo-border)] rounded-[var(--medo-radius-lg)] overflow-hidden">
        {controls.length > 0 && (
          <div className="flex gap-[var(--medo-space-md)] flex-wrap px-[var(--medo-space-lg)] py-[var(--medo-space-sm)] border-b border-[var(--medo-border-subtle)] bg-[var(--medo-surface-container)]">
            {controls.map(control => (
              <div key={control.id} className="flex items-center gap-[var(--medo-space-xs)]">
                <span className="text-sm [font-family:var(--medo-font-sans)] text-[var(--medo-text-subtle)] [font-weight:var(--medo-weight-medium)]">
                  {control.label}
                </span>
                {control.type === 'dropdown' ? (
                  <select
                    value={values[control.id]}
                    onChange={e => update(control.id, e.target.value)}
                    className="h-[calc(var(--medo-space-xl)+var(--medo-space-xs))] border border-[var(--medo-input-border)] rounded-[var(--medo-radius-md)] px-[var(--medo-space-sm)] text-sm [font-family:var(--medo-font-sans)] bg-[var(--medo-input-bg)] text-[var(--medo-input-text)] cursor-pointer transition-colors duration-150 ease-out hover:border-[var(--medo-input-border-hover)] outline-none focus-visible:border-[var(--medo-input-border-focus)] focus-visible:ring-[3px] focus-visible:ring-[var(--medo-focus-ring)]"
                  >
                    {control.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={values[control.id]}
                      onChange={e => update(control.id, e.target.checked)}
                    />
                    <div className="relative w-[calc(var(--medo-space-xl)+var(--medo-space-2xs))] h-[calc(var(--medo-space-md)+var(--medo-space-2xs))] bg-[var(--medo-action-neutral-active)] peer-checked:bg-[var(--medo-action)] rounded-[var(--medo-radius-full)] transition-colors duration-150 ease-out peer-focus-visible:ring-[3px] peer-focus-visible:ring-[var(--medo-focus-ring)]">
                      <span className={`absolute top-[var(--medo-space-3xs)] left-[var(--medo-space-3xs)] w-[var(--medo-space-md)] h-[var(--medo-space-md)] bg-[var(--medo-surface)] rounded-[var(--medo-radius-full)] transition-transform duration-150 ease-out ${values[control.id] ? 'translate-x-[var(--medo-space-md)]' : 'translate-x-0'}`} />
                    </div>
                  </label>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="bg-[var(--medo-surface)] flex items-center justify-center min-h-[200px] p-[var(--medo-space-xl)]">
          {component(values)}
        </div>
      </div>
      <p className="mt-[var(--medo-space-sm)] text-sm [font-family:var(--medo-font-sans)] text-[var(--medo-text-muted)]">
        {t('demoPanel.hint')}
      </p>
    </div>
  )
}
