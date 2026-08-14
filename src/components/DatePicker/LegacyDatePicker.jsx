import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover'
import { Calendar } from '../ui/calendar'

const fmtDate = (date) => {
  if (!date) return ''
  const d = String(date.getDate()).padStart(2, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  return `${d}/${m}/${date.getFullYear()}`
}

const parseDate = (str) => {
  if (str.length !== 10) return null
  const [d, m, y] = str.split('/').map(Number)
  if (!d || !m || !y || y < 1000 || y > 9999) return null
  const date = new Date(y, m - 1, d)
  if (date.getDate() !== d || date.getMonth() !== m - 1 || date.getFullYear() !== y) return null
  return date
}

const TRIGGER = 'flex items-center gap-[var(--space-2)] px-[var(--space-4)] py-[var(--space-2)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm text-[var(--color-text-primary)] bg-[var(--surface_100)] hover:bg-[var(--surface_200)] transition-colors duration-[var(--duration-fast)]'

export function LegacyDatePicker({ variant = 'default', value, onChange, disabledDates = [] }) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [inputStr, setInputStr] = useState(value ? fmtDate(value) : '')
  const [inputValid, setInputValid] = useState(true)

  const isDisabled = disabledDates.length > 0
    ? (date) => disabledDates.some(d => d.toDateString() === date.toDateString())
    : undefined

  // --- INLINE ---
  if (variant === 'inline') {
    return (
      <Calendar
        mode="single"
        selected={value ?? undefined}
        onSelect={onChange}
        disabled={isDisabled}
        captionLayout="dropdown"
      />
    )
  }

  // --- INPUT ---
  if (variant === 'input') {
    const handleInputChange = (e) => {
      const digits = e.target.value.replace(/[^\d]/g, '').slice(0, 8)
      let str = ''
      for (let i = 0; i < digits.length; i++) {
        if (i === 2 || i === 4) str += '/'
        str += digits[i]
      }
      setInputStr(str)
      if (str.length === 10) {
        const date = parseDate(str)
        if (date) { setInputValid(true); onChange(date) }
        else setInputValid(false)
      } else {
        setInputValid(true)
      }
    }

    const handleBlur = () => {
      if (!inputValid || (inputStr.length > 0 && inputStr.length < 10)) {
        setInputStr('')
        setInputValid(true)
      }
    }

    const handleCalendarSelect = (date) => {
      if (!date) return
      onChange(date)
      setInputStr(fmtDate(date))
      setInputValid(true)
      setOpen(false)
    }

    return (
      <div className="flex items-center gap-[var(--space-2)]">
        <input
          type="text"
          placeholder="DD/MM/YYYY"
          value={inputStr}
          onChange={handleInputChange}
          onBlur={handleBlur}
          maxLength={10}
          className={`px-[var(--space-3)] py-[var(--space-2)] border rounded-[var(--radius-md)] text-sm text-[var(--color-text-primary)] bg-[var(--surface_100)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-500)] w-[140px] transition-colors duration-[var(--duration-fast)] ${
            inputValid ? 'border-[var(--color-border)]' : 'border-[var(--color-error)]'
          }`}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button className="flex items-center justify-center w-9 h-9 border border-[var(--color-border)] rounded-[var(--radius-md)] bg-[var(--surface_100)] hover:bg-[var(--surface_200)] transition-colors duration-[var(--duration-fast)]">
              <span className="material-symbols-rounded text-[var(--color-text-secondary)]" style={{ fontSize: '1.25rem' }}>calendar_today</span>
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              mode="single"
              selected={value ?? undefined}
              onSelect={handleCalendarSelect}
              disabled={isDisabled}
              captionLayout="dropdown"
            />
          </PopoverContent>
        </Popover>
      </div>
    )
  }

  // --- RANGE ---
  if (variant === 'range') {
    const from = value?.from
    const to = value?.to
    const label = from && to
      ? `${fmtDate(from)} – ${fmtDate(to)}`
      : from ? `${fmtDate(from)} – ...`
      : t('datePicker.range.placeholder')

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className={`${TRIGGER} min-w-[240px]`}>
            <span className="material-symbols-rounded text-[var(--color-text-secondary)]" style={{ fontSize: '1rem' }}>date_range</span>
            {label}
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="range"
            selected={{ from: from ?? undefined, to: to ?? undefined }}
            onSelect={(range) => onChange({ from: range?.from ?? null, to: range?.to ?? null })}
            disabled={isDisabled}
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>
    )
  }

  // --- WITH TIME ---
  if (variant === 'withTime') {
    const hours = value ? String(value.getHours()).padStart(2, '0') : '00'
    const mins = value ? String(value.getMinutes()).padStart(2, '0') : '00'
    const timeStr = `${hours}:${mins}`
    const label = value ? `${fmtDate(value)}, ${timeStr}` : t('datePicker.placeholder')

    const handleDateSelect = (date) => {
      if (!date) return
      const prev = value ?? new Date()
      date.setHours(prev.getHours(), prev.getMinutes())
      onChange(date)
    }

    const handleTimeChange = (e) => {
      const [h, m] = e.target.value.split(':').map(Number)
      const base = value ? new Date(value) : new Date()
      base.setHours(h, m)
      onChange(base)
    }

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className={`${TRIGGER} min-w-[220px]`}>
            <span className="material-symbols-rounded text-[var(--color-text-secondary)]" style={{ fontSize: '1rem' }}>schedule</span>
            {label}
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value ?? undefined}
            onSelect={handleDateSelect}
            disabled={isDisabled}
            captionLayout="dropdown"
          />
          <div className="border-t border-[var(--color-border)] px-[var(--space-4)] py-[var(--space-3)] flex items-center gap-[var(--space-3)]">
            <span className="material-symbols-rounded text-[var(--color-text-secondary)]" style={{ fontSize: '1rem' }}>schedule</span>
            <span className="text-sm text-[var(--color-text-secondary)]">{t('datePicker.withTime.timeLabel')}</span>
            <input
              type="time"
              value={timeStr}
              onChange={handleTimeChange}
              className="border border-[var(--color-border)] rounded-[var(--radius-md)] px-[var(--space-2)] py-[var(--space-1)] text-sm text-[var(--color-text-primary)] bg-[var(--surface_100)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-500)]"
            />
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  // --- DEFAULT ---
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className={`${TRIGGER} min-w-[180px]`}>
          <span className="material-symbols-rounded text-[var(--color-text-secondary)]" style={{ fontSize: '1rem' }}>calendar_today</span>
          {value ? fmtDate(value) : t('datePicker.placeholder')}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value ?? undefined}
          onSelect={(date) => { onChange(date); setOpen(false) }}
          disabled={isDisabled}
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  )
}
