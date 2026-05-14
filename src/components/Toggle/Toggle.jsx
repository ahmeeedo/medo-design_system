import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Checkbox as ShadcnCheckbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

export function Toggle({ label, checked: controlledChecked, defaultChecked = false, onChange }) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked)
  const isControlled = controlledChecked !== undefined
  const checked = isControlled ? controlledChecked : internalChecked

  const handleChange = (val) => {
    if (!isControlled) setInternalChecked(val)
    onChange?.(val)
  }

  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <Switch checked={checked} onCheckedChange={handleChange} />
      {label && <span className="text-sm text-foreground">{label}</span>}
    </label>
  )
}

export function Checkbox({ label, checked: controlledChecked, defaultChecked = false, onChange, disabled }) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked)
  const isControlled = controlledChecked !== undefined
  const checked = isControlled ? controlledChecked : internalChecked

  const handleChange = (val) => {
    if (!isControlled) setInternalChecked(val)
    onChange?.(val)
  }

  return (
    <label className={cn(
      "inline-flex items-center gap-2 cursor-pointer select-none",
      disabled && "opacity-50 cursor-not-allowed"
    )}>
      <ShadcnCheckbox checked={checked} onCheckedChange={handleChange} disabled={disabled} />
      {label && <span className="text-sm text-foreground">{label}</span>}
    </label>
  )
}

export function Radio({ label, checked, onChange, name, value, disabled }) {
  return (
    <label className={cn(
      "inline-flex items-center gap-2 cursor-pointer select-none",
      disabled && "opacity-50 cursor-not-allowed"
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
          "flex size-4 rounded-full border border-input transition-colors",
          "peer-focus-visible:border-ring peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50",
          "peer-disabled:opacity-50",
          checked ? "border-primary bg-primary" : "bg-background"
        )}>
          {checked && (
            <span className="m-auto size-2 rounded-full bg-primary-foreground" />
          )}
        </span>
      </span>
      {label && <span className="text-sm text-foreground">{label}</span>}
    </label>
  )
}
