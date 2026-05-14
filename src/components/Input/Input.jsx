import { Input as ShadcnInput } from '@/components/ui/input'
import { Textarea as ShadcnTextarea } from '@/components/ui/textarea'
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  ...props
}) {
  return (
    <div className="flex flex-col">
      {label && <label className={labelClass}>{label}</label>}
      <ShadcnInput
        aria-invalid={!!error}
        className={cn(sizeClasses[size], className)}
        {...props}
      />
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
