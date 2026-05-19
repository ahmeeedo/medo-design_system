import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Checkbox as ShadcnCheckbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

export function Toggle({
  label,
  text,
  size = 'default',
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  helperText,
  error,
  disabled,
}) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked)
  const isControlled = controlledChecked !== undefined
  const checked = isControlled ? controlledChecked : internalChecked

  const handleChange = (val) => {
    if (!isControlled) setInternalChecked(val)
    onChange?.(val)
  }

  return (
    <div className="flex flex-col gap-[var(--space-1)]">
      {label && (
        <span className="text-sm [font-weight:var(--weight-medium)] text-[var(--color-text-primary)]">
          {label}
        </span>
      )}
      <label className={cn(
        'inline-flex items-center gap-2 cursor-pointer select-none',
        disabled && 'opacity-50 cursor-not-allowed',
      )}>
        <Switch
          checked={checked}
          onCheckedChange={handleChange}
          disabled={disabled}
          size={size === 'sm' ? 'sm' : 'default'}
        />
        {text && (
          <span className="text-sm text-[var(--color-text-primary)]">{text}</span>
        )}
      </label>
      {error && (
        <span className="text-xs text-[var(--color-error)]">{error}</span>
      )}
      {!error && helperText && (
        <span className="text-xs text-[var(--color-text-secondary)]">{helperText}</span>
      )}
    </div>
  )
}

export function Checkbox({
  label,
  text,
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  disabled,
  helperText,
  error,
}) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked)
  const isControlled = controlledChecked !== undefined
  const checked = isControlled ? controlledChecked : internalChecked

  const handleChange = (val) => {
    if (!isControlled) setInternalChecked(val)
    onChange?.(val)
  }

  return (
    <div className="flex flex-col gap-[var(--space-1)]">
      {label && (
        <span className="text-sm [font-weight:var(--weight-medium)] text-[var(--color-text-primary)]">
          {label}
        </span>
      )}
      <label className={cn(
        'inline-flex items-center gap-2 cursor-pointer select-none',
        disabled && 'opacity-50 cursor-not-allowed',
      )}>
        <ShadcnCheckbox checked={checked} onCheckedChange={handleChange} disabled={disabled} />
        {text && (
          <span className="text-sm text-[var(--color-text-primary)]">{text}</span>
        )}
      </label>
      {error && (
        <span className="text-xs text-[var(--color-error)]">{error}</span>
      )}
      {!error && helperText && (
        <span className="text-xs text-[var(--color-text-secondary)]">{helperText}</span>
      )}
    </div>
  )
}

export function CheckboxGroup({ label, helperText, error, children }) {
  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      {label && (
        <span className="text-sm [font-weight:var(--weight-medium)] text-[var(--color-text-primary)]">
          {label}
        </span>
      )}
      <div className="flex flex-col gap-[var(--space-2)]">
        {children}
      </div>
      {error && (
        <span className="text-xs text-[var(--color-error)]">{error}</span>
      )}
      {!error && helperText && (
        <span className="text-xs text-[var(--color-text-secondary)]">{helperText}</span>
      )}
    </div>
  )
}

export function Radio({
  label,
  text,
  checked,
  onChange,
  name,
  value,
  disabled,
  helperText,
  error,
}) {
  return (
    <div className="flex flex-col gap-[var(--space-1)]">
      {label && (
        <span className="text-sm [font-weight:var(--weight-medium)] text-[var(--color-text-primary)]">
          {label}
        </span>
      )}
      <label className={cn(
        'inline-flex items-center gap-2 cursor-pointer select-none',
        disabled && 'opacity-50 cursor-not-allowed',
      )}>
        <span className="relative flex size-4 shrink-0">
          <input
            type="radio"
            name={name}
            value={value}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="peer absolute opacity-0 size-4 cursor-pointer"
          />
          <span className={cn(
            'flex size-4 rounded-full border border-input transition-colors',
            'peer-focus-visible:border-ring peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50',
            'peer-disabled:opacity-50',
            checked ? 'border-primary bg-primary' : 'bg-background',
          )}>
            {checked && (
              <span className="m-auto size-2 rounded-full bg-primary-foreground" />
            )}
          </span>
        </span>
        {text && (
          <span className="text-sm text-[var(--color-text-primary)]">{text}</span>
        )}
      </label>
      {error && (
        <span className="text-xs text-[var(--color-error)]">{error}</span>
      )}
      {!error && helperText && (
        <span className="text-xs text-[var(--color-text-secondary)]">{helperText}</span>
      )}
    </div>
  )
}

export function RadioGroup({ label, helperText, error, children }) {
  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      {label && (
        <span className="text-sm [font-weight:var(--weight-medium)] text-[var(--color-text-primary)]">
          {label}
        </span>
      )}
      <div className="flex flex-col gap-[var(--space-2)]">
        {children}
      </div>
      {error && (
        <span className="text-xs text-[var(--color-error)]">{error}</span>
      )}
      {!error && helperText && (
        <span className="text-xs text-[var(--color-text-secondary)]">{helperText}</span>
      )}
    </div>
  )
}
