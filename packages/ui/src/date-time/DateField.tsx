import { useMemo, useState, type ReactNode } from 'react';
import {
  DateField as AriaDateField,
  DateInput,
  DateSegment,
  TimeField as AriaTimeField,
  type DateFieldProps as AriaDateFieldProps,
  type DateValue,
  type TimeFieldProps as AriaTimeFieldProps,
  type TimeValue,
  type ValidationResult,
  useLocale,
} from 'react-aria-components';
import { DateFormatter } from '@internationalized/date';
import { Clock } from 'lucide-react';
import { FieldFooter, FieldLabel } from '../field/Field';
import { ListBox, Option } from '../listbox/ListBox';
import { Popover, PopoverTrigger } from '../popover/Popover';
import { InputAction } from '../text-field/TextField';
import { cx } from '../utils/cx';
import '../text-field/input.css';
import './date-time.css';

/**
 * The segments inside the Input look. Digits only; a complete segment jumps to the next one. Separators come
 * from the locale (de: TT.MM.JJJJ, 24 h) and are never typed. Styles: `medo-date-box`, `medo-date-segment`.
 */
export function DateSegments({ size = 'md', children }: { size?: 'md' | 'lg'; children?: ReactNode }) {
  return (
    <div className={cx('medo-input', `medo-input--${size}`, 'medo-date-box')}>
      <DateInput className="medo-date-input">{(segment) => <DateSegment segment={segment} className="medo-date-segment" />}</DateInput>
      {children}
    </div>
  );
}

interface FieldBase {
  /** Visible label. Without it set `aria-label`. */
  label?: ReactNode;
  description?: ReactNode;
  /** A function gets the validation details (rangeUnderflow, rangeOverflow, badInput) – name the rule. */
  errorMessage?: ReactNode | ((validation: ValidationResult) => ReactNode);
  /** md 40 (desktop) · lg 48 (touch, below 640 px). */
  size?: 'md' | 'lg';
  className?: string;
}

/* ---------- Date field ---------- */

export interface DateFieldProps<T extends DateValue> extends Omit<AriaDateFieldProps<T>, 'children' | 'className' | 'style'>, FieldBase {}

/**
 * Date field – type a date without a calendar. React Aria DateField: every segment is a
 * spinbutton (“day”, “month”, “year”), ↑ ↓ change it, ← → move, Backspace clears, a pasted date fills all.
 * `granularity="minute"` adds the time. For a calendar use DatePicker.
 */
export function DateField<T extends DateValue>({ label, description, errorMessage, size = 'md', className, ...props }: DateFieldProps<T>) {
  return (
    <AriaDateField<T> shouldForceLeadingZeros {...props} className={cx('medo-field', 'medo-date-field', className)}>
      {label && <FieldLabel isRequired={props.isRequired}>{label}</FieldLabel>}
      <DateSegments size={size} />
      <FieldFooter description={description} errorMessage={errorMessage} />
    </AriaDateField>
  );
}

/* ---------- Time field ---------- */

export interface TimeSlot {
  value: TimeValue;
  /** Booked slots stay visible, disabled, with the reason (“Booked”). */
  isDisabled?: boolean;
  reason?: string;
}

export interface TimeFieldProps extends Omit<AriaTimeFieldProps<TimeValue>, 'children' | 'className' | 'style'>, FieldBase {
  /** Optional fixed times (e.g. every 15 min). Adds a clock button that opens them. No clock faces. */
  slots?: TimeSlot[];
  /** Name of the clock button and the list. */
  slotsLabel?: string;
}

/**
 * Time field – type a time. HH:MM, 24 h in de – from the locale. Typing only;
 * with `slots` a clock button opens a list of fixed times (bookings), booked ones disabled with a reason.
 */
export function TimeField({
  label,
  description,
  errorMessage,
  size = 'md',
  slots,
  slotsLabel = 'Available times',
  className,
  defaultValue,
  onChange,
  ...props
}: TimeFieldProps) {
  // Controlled inside, so a picked slot shows also when the app passes only defaultValue.
  const [inner, setInner] = useState<TimeValue | null>(defaultValue ?? null);
  const value = props.value !== undefined ? props.value : inner;
  const change = (v: TimeValue | null) => {
    setInner(v);
    onChange?.(v);
  };
  const { locale } = useLocale();
  const format = useMemo(
    () => new DateFormatter(locale, { hour: '2-digit', minute: '2-digit', hourCycle: props.hourCycle === 12 ? 'h12' : props.hourCycle === 24 ? 'h23' : undefined }),
    [locale, props.hourCycle],
  );
  const key = (v?: TimeValue | null) => (v ? `${v.hour}:${v.minute}` : '');
  const text = (v: TimeValue) => format.format(new Date(2000, 0, 1, v.hour, v.minute));
  return (
    <AriaTimeField shouldForceLeadingZeros {...props} value={value} onChange={change} className={cx('medo-field', 'medo-date-field', 'medo-time-field', className)}>
      {label && <FieldLabel isRequired={props.isRequired}>{label}</FieldLabel>}
      <DateSegments size={size}>
        {slots && (
          <PopoverTrigger>
            <InputAction icon={<Clock />} aria-label={slotsLabel} isDisabled={props.isDisabled || props.isReadOnly} />
            <Popover size="auto" aria-label={slotsLabel} placement="bottom end" className="medo-time-slots">
              {(close) => (
                <ListBox
                  aria-label={slotsLabel}
                  size={size}
                  autoFocus
                  selectionMode="single"
                  selectedKeys={value ? [key(value)] : []}
                  disabledKeys={slots.filter((s) => s.isDisabled).map((s) => key(s.value))}
                  onSelectionChange={(keys) => {
                    const slot = slots.find((s) => keys !== 'all' && keys.has(key(s.value)));
                    if (slot) change(slot.value);
                    close();
                  }}
                >
                  {slots.map((s) => (
                    <Option key={key(s.value)} id={key(s.value)} textValue={text(s.value)} description={s.isDisabled ? s.reason : undefined}>
                      {text(s.value)}
                    </Option>
                  ))}
                </ListBox>
              )}
            </Popover>
          </PopoverTrigger>
        )}
      </DateSegments>
      <FieldFooter description={description} errorMessage={errorMessage} />
    </AriaTimeField>
  );
}
