import { useState, useRef, useEffect } from 'react'
import { Input as ShadcnInput } from '@/components/ui/input'
import { Textarea as ShadcnTextarea } from '@/components/ui/textarea'
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Icon } from '@/components/Icon/Icon'
import { cn } from '@/lib/utils'

const sizeClasses = {
  sm: 'h-8 text-sm',
  md: 'h-10 text-sm',
  lg: 'h-12 text-base',
}

const labelClass = "block text-sm font-medium text-foreground mb-1.5"
const hintClass  = "mt-1.5 text-sm text-muted-foreground"
const errorClass = "mt-1.5 text-sm text-destructive"

export function Input({
  label,
  hint,
  error,
  size = 'md',
  className = '',
  leadingIcon,
  trailingIcon,
  type,
  ...props
}) {
  const [showPwd, setShowPwd] = useState(false)
  const isPassword = type === 'password'
  const hasLeading = !!leadingIcon
  const hasTrailing = !!trailingIcon || isPassword

  return (
    <div className="flex flex-col">
      {label && <label className={labelClass}>{label}</label>}
      <div className="relative flex items-center">
        {hasLeading && (
          <span className="absolute left-3 flex items-center text-muted-foreground pointer-events-none">
            <Icon name={leadingIcon} size="18px" />
          </span>
        )}
        <ShadcnInput
          type={isPassword ? (showPwd ? 'text' : 'password') : type}
          aria-invalid={!!error}
          className={cn(
            sizeClasses[size],
            hasLeading && 'pl-9',
            hasTrailing && 'pr-9',
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPwd(v => !v)}
            tabIndex={-1}
            aria-label={showPwd ? 'Passwort verbergen' : 'Passwort anzeigen'}
            className="absolute right-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name={showPwd ? 'visibility_off' : 'visibility'} size="18px" />
          </button>
        )}
        {!isPassword && trailingIcon && (
          <span className="absolute right-3 flex items-center text-muted-foreground pointer-events-none">
            <Icon name={trailingIcon} size="18px" />
          </span>
        )}
      </div>
      {error && <span className={errorClass}>{error}</span>}
      {hint && !error && <span className={hintClass}>{hint}</span>}
    </div>
  )
}

export function Textarea({
  label,
  hint,
  error,
  rows = 3,
  className = '',
  ...props
}) {
  return (
    <div className="flex flex-col">
      {label && <label className={labelClass}>{label}</label>}
      <ShadcnTextarea
        rows={rows}
        aria-invalid={!!error}
        className={cn(className)}
        {...props}
      />
      {error && <span className={errorClass}>{error}</span>}
      {hint && !error && <span className={hintClass}>{hint}</span>}
    </div>
  )
}

export function Select({
  label,
  hint,
  options = [],
  className = '',
  onChange,
  ...props
}) {
  return (
    <div className="flex flex-col">
      {label && <label className={labelClass}>{label}</label>}
      <ShadcnSelect onValueChange={onChange} {...props}>
        <SelectTrigger className={cn('w-full', className)}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) =>
            typeof opt === 'string'
              ? <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              : <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          )}
        </SelectContent>
      </ShadcnSelect>
      {hint && <span className={hintClass}>{hint}</span>}
    </div>
  )
}

export function InputWithAddon({ addon, className = '', ...props }) {
  return (
    <div className="flex items-center rounded-lg border border-input focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 overflow-hidden">
      <ShadcnInput
        className={cn(
          'h-10 flex-1 rounded-none border-none focus-visible:ring-0 focus-visible:border-transparent',
          className
        )}
        {...props}
      />
      <div className="flex h-10 items-center bg-muted px-3 text-sm text-muted-foreground border-l border-input shrink-0">
        {addon}
      </div>
    </div>
  )
}

const getOptVal = (opt) => (typeof opt === 'string' ? opt : opt.value)
const getOptLbl = (opt) => (typeof opt === 'string' ? opt : opt.label)

export function MultiSelect({
  label,
  hint,
  options = [],
  value = [],
  onChange,
  placeholder = 'Auswählen…',
  className = '',
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const handleOut = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOut)
    return () => document.removeEventListener('mousedown', handleOut)
  }, [])

  const toggle = (v) => {
    const next = value.includes(v) ? value.filter(x => x !== v) : [...value, v]
    onChange?.(next)
  }

  return (
    <div className="flex flex-col">
      {label && <label className={labelClass}>{label}</label>}
      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className={cn(
            'flex min-h-10 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-1.5 text-sm',
            'ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            className
          )}
        >
          <div className="flex flex-wrap gap-1 flex-1 min-w-0">
            {value.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              value.map(v => (
                <span
                  key={v}
                  className="inline-flex items-center gap-1 rounded-full bg-[var(--color-brand-primary-500)]/10 text-[var(--color-brand-primary-500)] px-2 py-0.5 text-xs font-medium"
                >
                  {v}
                  <button
                    type="button"
                    onMouseDown={(e) => { e.stopPropagation(); toggle(v) }}
                    aria-label={`${v} entfernen`}
                    className="hover:text-destructive leading-none ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>
          <Icon
            name="expand_more"
            size="18px"
            className={cn('shrink-0 text-muted-foreground transition-transform duration-150', open && 'rotate-180')}
          />
        </button>

        {open && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-md border border-input bg-popover shadow-md">
            {options.map(opt => {
              const v = getOptVal(opt)
              const l = getOptLbl(opt)
              const checked = value.includes(v)
              return (
                <button
                  key={v}
                  type="button"
                  onMouseDown={() => toggle(v)}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                >
                  <span className={cn(
                    'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
                    checked
                      ? 'bg-[var(--color-brand-primary-500)] border-[var(--color-brand-primary-500)]'
                      : 'border-input'
                  )}>
                    {checked && <Icon name="check" size="12px" className="text-white" />}
                  </span>
                  {l}
                </button>
              )
            })}
          </div>
        )}
      </div>
      {hint && <span className={hintClass}>{hint}</span>}
    </div>
  )
}

export function SearchSelect({
  label,
  hint,
  options = [],
  value = '',
  onChange,
  placeholder = 'Suchen…',
  className = '',
}) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(value)
  const containerRef = useRef(null)

  useEffect(() => {
    const handleOut = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleOut)
    return () => document.removeEventListener('mousedown', handleOut)
  }, [])

  const displayLabel = selected
    ? getOptLbl(options.find(o => getOptVal(o) === selected) ?? selected)
    : ''

  const filtered = options.filter(opt =>
    getOptLbl(opt).toLowerCase().includes(query.toLowerCase())
  )

  const select = (opt) => {
    const v = getOptVal(opt)
    setSelected(v)
    setQuery('')
    setOpen(false)
    onChange?.(v)
  }

  return (
    <div className="flex flex-col">
      {label && <label className={labelClass}>{label}</label>}
      <div ref={containerRef} className="relative">
        <div className="relative flex items-center">
          <ShadcnInput
            value={open ? query : displayLabel}
            onChange={e => { setQuery(e.target.value); setOpen(true) }}
            onFocus={() => { setQuery(''); setOpen(true) }}
            placeholder={placeholder}
            className={cn('pr-9', className)}
          />
          <span className="absolute right-3 flex items-center text-muted-foreground pointer-events-none">
            <Icon name={selected && !open ? 'expand_more' : 'search'} size="18px" />
          </span>
        </div>

        {open && filtered.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-md border border-input bg-popover shadow-md">
            {filtered.map(opt => {
              const v = getOptVal(opt)
              const l = getOptLbl(opt)
              return (
                <button
                  key={v}
                  type="button"
                  onMouseDown={() => select(opt)}
                  className={cn(
                    'flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground',
                    selected === v && 'bg-accent/40'
                  )}
                >
                  {l}
                  {selected === v && (
                    <Icon name="check" size="16px" className="text-[var(--color-brand-primary-500)]" />
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>
      {hint && <span className={hintClass}>{hint}</span>}
    </div>
  )
}
