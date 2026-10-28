import { useContext, useMemo, type ReactNode } from 'react';
import {
  DateInput,
  DatePicker as AriaDatePicker,
  DatePickerStateContext,
  DateRangePicker as AriaDateRangePicker,
  DateRangePickerStateContext,
  DateSegment,
  Dialog as AriaDialog,
  Group,
  Popover as AriaPopover,
  useLocale,
  type DatePickerProps as AriaDatePickerProps,
  type DateRangePickerProps as AriaDateRangePickerProps,
  type DateValue,
  type ValidationResult,
} from 'react-aria-components';
import { DateFormatter, endOfMonth, getLocalTimeZone, startOfMonth, today, type CalendarDate } from '@internationalized/date';
import { Calendar as CalendarIcon } from 'lucide-react';
import { BottomSheet } from '../bottom-sheet/BottomSheet';
import { Button } from '../button/Button';
import { FieldFooter, FieldLabel } from '../field/Field';
import { ListBox, Option } from '../listbox/ListBox';
import { InputAction } from '../text-field/TextField';
import { cx } from '../utils/cx';
import { MOBILE_QUERY, useMediaQuery } from '../utils/useMediaQuery';
import { Calendar, RangeCalendar, type CalendarTexts } from './Calendar';
import { en, useMessages, type Messages } from '../i18n/I18n';
import { TimeField } from './DateField';

export interface DatePickerTexts extends CalendarTexts {
  openCalendar: string;
  done: string;
  time: string;
  presets: string;
  /** Validation – name the rule, never just “invalid date”. */
  beforeMin: (date: string) => string;
  afterMax: (date: string) => string;
  unavailable: string;
  reversed: string;
}

/** Picker texts of one language (without the calendar texts). */
function pickerTexts(m: Messages): Omit<DatePickerTexts, keyof CalendarTexts> {
  const d = m.datePicker;
  return {
    openCalendar: d.openCalendar,
    done: m.common.done,
    time: d.time,
    presets: d.presets,
    beforeMin: d.beforeMin,
    afterMax: d.afterMax,
    unavailable: d.unavailable,
    reversed: d.reversed,
  };
}

/** English defaults. The components use the texts of the current language (see i18n). */
export const defaultDatePickerTexts: Omit<DatePickerTexts, keyof CalendarTexts> = pickerTexts(en);

interface PickerBase {
  label?: ReactNode;
  description?: ReactNode;
  /** Own message or a function of the validation details. Default: the built-in messages (min, max, unavailable, reversed). */
  errorMessage?: ReactNode | ((validation: ValidationResult) => ReactNode);
  /** md 40 (desktop) · lg 48 (touch). */
  size?: 'md' | 'lg';
  /** auto: popover on desktop, Bottom Sheet with a lg calendar below 640 px · popover · sheet. */
  overlay?: 'auto' | 'popover' | 'sheet';
  /** ISO week numbers in the calendar. */
  showWeekNumbers?: boolean;
  texts?: Partial<DatePickerTexts>;
  className?: string;
}

/** Messages that name the rule. Unavailable days: pass `texts.unavailable` with the reason (“We don’t deliver on weekends.”). */
function useValidationMessages(t: DatePickerTexts, minValue?: DateValue | null, maxValue?: DateValue | null) {
  const { locale } = useLocale();
  const format = useMemo(() => new DateFormatter(locale, { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: getLocalTimeZone() }), [locale]);
  const show = (d: DateValue) => format.format(d.toDate(getLocalTimeZone()));
  return ({ validationDetails: v, validationErrors }: ValidationResult) => {
    if (v.rangeUnderflow && v.rangeOverflow) return t.reversed;
    if (v.rangeUnderflow && minValue) return t.beforeMin(show(minValue));
    if (v.rangeOverflow && maxValue) return t.afterMax(show(maxValue));
    if (v.badInput) return t.unavailable;
    return validationErrors.join(' ');
  };
}

/** Popover on desktop (Popover Size Auto), Bottom Sheet with “Done” on mobile. */
function PickerOverlay({ title, sheet, t, children }: { title: string; sheet: boolean; t: DatePickerTexts; children: ReactNode }) {
  if (sheet) {
    return (
      <BottomSheet
        title={title}
        className="medo-date-sheet"
        footer={(close) => (
          <Button variant="primary" size="lg" onPress={close}>
            {t.done}
          </Button>
        )}
      >
        <div className="medo-date-panel">{children}</div>
      </BottomSheet>
    );
  }
  return (
    <AriaPopover placement="bottom start" offset={8} containerPadding={16} className="medo-popover medo-popover--auto medo-date-popover">
      <AriaDialog aria-label={title} className="medo-popover__dialog">
        <div className="medo-popover__body medo-date-panel">{children}</div>
      </AriaDialog>
    </AriaPopover>
  );
}

/** Date + time picker: the time of the picker's value, typed (no clock faces). */
function PanelTime({ label, size }: { label: string; size: 'md' | 'lg' }) {
  const state = useContext(DatePickerStateContext);
  if (!state) return null;
  return (
    <div className="medo-date-panel__time">
      <TimeField label={label} size={size} value={state.timeValue} onChange={(v) => v && state.setTimeValue(v)} />
    </div>
  );
}

const textOf = (label: ReactNode, ariaLabel?: string) => (typeof label === 'string' ? label : (ariaLabel ?? ''));

/* ---------- Date picker ---------- */

export interface DatePickerProps<T extends DateValue> extends Omit<AriaDatePickerProps<T>, 'children' | 'className' | 'style'>, PickerBase {}

/**
 * Date picker – type a date or pick it. The field is the main input, the calendar is a
 * helper: the button “Open calendar” (or Alt + ↓) opens it, picking a day closes it and focus returns to the
 * field. `granularity="minute"` makes it a date + time picker with a time field in the panel.
 */
export function DatePicker<T extends DateValue>({
  label,
  description,
  errorMessage,
  size = 'md',
  overlay = 'auto',
  showWeekNumbers,
  texts,
  className,
  ...props
}: DatePickerProps<T>) {
  const m = useMessages();
  const t: DatePickerTexts = { ...m.calendar, ...pickerTexts(m), ...texts };
  const mobile = useMediaQuery(MOBILE_QUERY);
  const sheet = overlay === 'sheet' || (overlay === 'auto' && mobile);
  const messages = useValidationMessages(t, props.minValue, props.maxValue);
  const hasTime = !!props.granularity && props.granularity !== 'day';

  return (
    <AriaDatePicker<T>
      shouldForceLeadingZeros
      {...props}
      className={cx('medo-field', 'medo-date-field', 'medo-date-picker', hasTime && 'medo-date-picker--time', className)}
    >
      {label && <FieldLabel isRequired={props.isRequired}>{label}</FieldLabel>}
      <Group className={cx('medo-input', `medo-input--${size}`, 'medo-date-box')}>
        <DateInput className="medo-date-input">{(segment) => <DateSegment segment={segment} className="medo-date-segment" />}</DateInput>
        <InputAction icon={<CalendarIcon />} aria-label={t.openCalendar} />
      </Group>
      <FieldFooter description={description} errorMessage={errorMessage ?? messages} />
      <PickerOverlay title={textOf(label, props['aria-label'])} sheet={sheet} t={t}>
        <Calendar size={sheet ? 'lg' : 'md'} showWeekNumbers={showWeekNumbers} texts={t} />
        {hasTime && <PanelTime label={t.time} size={sheet ? 'lg' : 'md'} />}
      </PickerOverlay>
    </AriaDatePicker>
  );
}

/* ---------- Date range picker ---------- */

export interface DateRangePreset {
  label: string;
  value: { start: DateValue; end: DateValue };
}

/**
 * The default presets (Today … Last month), relative to today in the local time zone.
 * Labels: own ones win, else those of `messages` (default English; the DateRangePicker passes the current language).
 */
export function defaultDatePresets(
  labels: Partial<Record<'today' | 'yesterday' | 'last7' | 'last14' | 'last30' | 'thisMonth' | 'lastMonth', string>> = {},
  messages: Messages = en,
): DateRangePreset[] {
  const d = messages.datePicker;
  const now: CalendarDate = today(getLocalTimeZone());
  const lastMonth = now.subtract({ months: 1 });
  return [
    { label: labels.today ?? d.today, value: { start: now, end: now } },
    { label: labels.yesterday ?? d.yesterday, value: { start: now.subtract({ days: 1 }), end: now.subtract({ days: 1 }) } },
    { label: labels.last7 ?? d.last7Days, value: { start: now.subtract({ days: 6 }), end: now } },
    { label: labels.last14 ?? d.last14Days, value: { start: now.subtract({ days: 13 }), end: now } },
    { label: labels.last30 ?? d.last30Days, value: { start: now.subtract({ days: 29 }), end: now } },
    { label: labels.thisMonth ?? d.thisMonth, value: { start: startOfMonth(now), end: now } },
    { label: labels.lastMonth ?? d.lastMonth, value: { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) } },
  ];
}

function Presets({ presets, label, size }: { presets: DateRangePreset[]; label: string; size: 'md' | 'lg' }) {
  const state = useContext(DateRangePickerStateContext);
  if (!state) return null;
  const same = (a?: DateValue | null, b?: DateValue | null) => !!a && !!b && a.compare(b) === 0;
  const active = presets.findIndex((p) => same(state.value?.start, p.value.start) && same(state.value?.end, p.value.end));
  return (
    <ListBox
      aria-label={label}
      size={size}
      selectionMode="single"
      selectedKeys={active >= 0 ? [String(active)] : []}
      disallowEmptySelection={false}
      onAction={(key) => {
        const preset = presets[Number(key)];
        state.setValue(preset.value);
        state.close();
      }}
      className="medo-date-panel__presets"
    >
      {presets.map((p, i) => (
        <Option key={i} id={String(i)}>
          {p.label}
        </Option>
      ))}
    </ListBox>
  );
}

export interface DateRangePickerProps<T extends DateValue> extends Omit<AriaDateRangePickerProps<T>, 'children' | 'className' | 'style'>, PickerBase {
  /** true: the default presets (Today … Last month) · own list · none. Fits dashboards and filters. */
  presets?: boolean | DateRangePreset[];
}

/**
 * Date range picker – start and end in one field. Two months side by side on desktop,
 * one on mobile; the first click sets the start, the second the end, hovering previews the range. Optional presets.
 */
export function DateRangePicker<T extends DateValue>({
  label,
  description,
  errorMessage,
  size = 'md',
  overlay = 'auto',
  showWeekNumbers,
  presets,
  texts,
  className,
  ...props
}: DateRangePickerProps<T>) {
  const m = useMessages();
  const t: DatePickerTexts = { ...m.calendar, ...pickerTexts(m), ...texts };
  const mobile = useMediaQuery(MOBILE_QUERY);
  const sheet = overlay === 'sheet' || (overlay === 'auto' && mobile);
  const messages = useValidationMessages(t, props.minValue, props.maxValue);
  const list = presets === true ? defaultDatePresets({}, m) : presets || undefined;

  return (
    <AriaDateRangePicker<T> shouldForceLeadingZeros {...props} className={cx('medo-field', 'medo-date-field', 'medo-date-picker', 'medo-date-picker--range', className)}>
      {label && <FieldLabel isRequired={props.isRequired}>{label}</FieldLabel>}
      <Group className={cx('medo-input', `medo-input--${size}`, 'medo-date-box')}>
        <DateInput slot="start" className="medo-date-input">
          {(segment) => <DateSegment segment={segment} className="medo-date-segment" />}
        </DateInput>
        <span className="medo-date-box__dash" aria-hidden="true">
          –
        </span>
        <DateInput slot="end" className="medo-date-input">
          {(segment) => <DateSegment segment={segment} className="medo-date-segment" />}
        </DateInput>
        <InputAction icon={<CalendarIcon />} aria-label={t.openCalendar} />
      </Group>
      <FieldFooter description={description} errorMessage={errorMessage ?? messages} />
      <PickerOverlay title={textOf(label, props['aria-label'])} sheet={sheet} t={t}>
        <div className={cx('medo-date-panel__range', !!list && 'medo-date-panel__range--presets')}>
          {list && <Presets presets={list} label={t.presets} size={sheet ? 'lg' : 'md'} />}
          <RangeCalendar size={sheet ? 'lg' : 'md'} visibleMonths={sheet ? 1 : 2} showWeekNumbers={showWeekNumbers} texts={t} />
        </div>
      </PickerOverlay>
    </AriaDateRangePicker>
  );
}
