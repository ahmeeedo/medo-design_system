import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export function DemoPanel({ component, controls }) {
  const { t } = useTranslation()
  const [values, setValues] = useState(
    () => Object.fromEntries(controls.map(c => [c.id, c.default]))
  )

  const update = (id, value) => setValues(prev => ({ ...prev, [id]: value }))

  return (
    <div className="mb-[var(--space-8)] px-[var(--space-8)] max-w-[980px]">
      <h2 className="text-3xl [font-weight:var(--weight-semibold)] text-[var(--color-text-tertiary)] mb-[var(--space-4)] pb-[var(--space-2)] border-b border-[var(--border-subtle-100)]">
        {t('demoPanel.title')}
      </h2>
      <div className="border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden">
        <div className="flex gap-[var(--space-4)] flex-wrap px-[var(--space-5)] py-[var(--space-3)] border-b border-[var(--color-border)] bg-[var(--surface_100)]">
          {controls.map(control => (
            <div key={control.id} className="flex items-center gap-[var(--space-2)]">
              <span className="text-sm text-[var(--color-text-secondary)] [font-weight:var(--weight-medium)]">
                {control.label}
              </span>
              {control.type === 'dropdown' ? (
                <select
                  value={values[control.id]}
                  onChange={e => update(control.id, e.target.value)}
                  className="border border-[var(--color-border)] rounded-[var(--radius-md)] px-[var(--space-3)] py-[var(--space-1)] text-sm bg-[var(--surface_100)] text-[var(--color-text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-500)] cursor-pointer"
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
                  <div className="relative w-9 h-5 bg-[var(--color-neutral-300)] peer-checked:bg-[var(--color-brand-primary-500)] rounded-full transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]">
                    <span className={`absolute top-[2px] left-[2px] w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-[var(--duration-fast)] ease-[var(--ease-out)] ${values[control.id] ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                </label>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white flex items-center justify-center min-h-[200px] p-[var(--space-8)]">
          {component(values)}
        </div>
      </div>
      <p className="mt-[var(--space-3)] text-sm text-[var(--color-text-secondary)]">
        {t('demoPanel.hint')}
      </p>
    </div>
  )
}
