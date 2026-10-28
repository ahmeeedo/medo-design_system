import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Button as AriaButton,
  Calendar as AriaCalendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  RangeCalendar as AriaRangeCalendar,
  useLocale,
  type CalendarProps as AriaCalendarProps,
  type DateValue,
  type RangeCalendarProps as AriaRangeCalendarProps,
} from 'react-aria-components';
import { DateFormatter, getDayOfWeek, getLocalTimeZone, today, type CalendarDate } from '@internationalized/date';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../button/Button';
import { IconButton } from '../icon-button/IconButton';
import { cx } from '../utils/cx';
import { MOBILE_QUERY, useMediaQuery } from '../utils/useMediaQuery';

type View = 'days' | 'months' | 'years';

/** The part of the React Aria calendar state the header and period grids need. */
interface ViewState {
  focusedDate: CalendarDate;
  setFocusedDate: (date: CalendarDate) => void;
  minValue?: DateValue | null;
  maxValue?: DateValue | null;
  value?: DateValue | null;
  isDisabled: boolean;
}

export interface CalendarTexts {
  previousMonth: string;
  nextMonth: string;
  previousYear: string;
  nextYear: string;
  previousYears: string;
  nextYears: string;
  /** Name of the month-and-year button: “October 2026 – choose month and year”. */
  chooseMonth: (title: string) => string;
  chooseYear: (year: string) => string;
  weekNumber: string;
}

export const defaultCalendarTexts: CalendarTexts = {
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  previousYear: 'Previous year',
  nextYear: 'Next year',
  previousYears: 'Previous years',
  nextYears: 'Next years',
  chooseMonth: (title) => `${title} – choose month and year`,
  chooseYear: (year) => `${year} – choose year`,
  weekNumber: 'Wk',
};

interface SharedProps {
  /** md: 40 px days for desktop popovers · lg: 48 px for touch (Bottom Sheet). */
  size?: 'md' | 'lg';
  /** ISO week numbers (KW) before each row. */
  showWeekNumbers?: boolean;
  texts?: Partial<CalendarTexts>;
  className?: string;
}

/** ISO 8601 week of the row: the week of its 4th day, so it fits Monday- and Sunday-first locales. */
function isoWeek(date: CalendarDate) {
  const d = new Date(Date.UTC(date.year, date.month - 1, date.day));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = Date.UTC(d.getUTCFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - yearStart) / 86400000 + 1) / 7);
}

/* ---------- Header ---------- */

function Header({
  view,
  setView,
  state,
  size,
  months,
  t,
}: {
  view: View;
  setView: (v: View) => void;
  state: ViewState;
  size: 'md' | 'lg';
  months: number;
  t: CalendarTexts;
}) {
  const { locale } = useLocale();
  const monthTitle = useMemo(() => new DateFormatter(locale, { month: 'long', year: 'numeric', timeZone: getLocalTimeZone() }), [locale]);
  const yearTitle = useMemo(() => new DateFormatter(locale, { year: 'numeric', timeZone: getLocalTimeZone() }), [locale]);
  const tz = getLocalTimeZone();
  const focused = state.focusedDate;
  const buttonSize = size === 'lg' ? 'lg' : 'sm';
  const yearStart = focused.year - 5;

  const shift = (step: 1 | -1) => state.setFocusedDate(focused.add(view === 'months' ? { years: step } : { years: 12 * step }));

  if (view !== 'days') {
    const title = view === 'months' ? yearTitle.format(focused.toDate(tz)) : `${yearStart} – ${yearStart + 11}`;
    return (
      <div className="medo-calendar__header">
        {view === 'months' ? (
          <Button
            slot={null}
            variant="ghost"
            size={buttonSize}
            endIcon={<ChevronDown />}
            onPress={() => setView('years')}
            aria-label={t.chooseYear(title)}
            className="medo-calendar__title"
          >
            {title}
          </Button>
        ) : (
          <span className="medo-calendar__title medo-calendar__title--static" aria-live="polite">
            {title}
          </span>
        )}
        <div className="medo-calendar__nav">
          <IconButton slot={null} size={buttonSize} icon={<ChevronLeft />} aria-label={view === 'months' ? t.previousYear : t.previousYears} onPress={() => shift(-1)} />
          <IconButton slot={null} size={buttonSize} icon={<ChevronRight />} aria-label={view === 'months' ? t.nextYear : t.nextYears} onPress={() => shift(1)} />
        </div>
      </div>
    );
  }

  // Days: one header per month; with two months the arrows sit at the outer edges.
  return (
    <div className="medo-calendar__headers" style={{ gridTemplateColumns: `repeat(${months}, 1fr)` }}>
      {Array.from({ length: months }, (_, i) => {
        const title = monthTitle.format(focused.add({ months: i }).toDate(tz));
        return (
          <div key={i} className="medo-calendar__header">
            <Button
              slot={null}
              variant="ghost"
              size={buttonSize}
              endIcon={<ChevronDown />}
              onPress={() => setView('months')}
              aria-label={t.chooseMonth(title)}
              className="medo-calendar__title"
            >
              {title}
            </Button>
            <div className="medo-calendar__nav">
              {i === 0 && <IconButton slot="previous" size={buttonSize} icon={<ChevronLeft />} aria-label={t.previousMonth} />}
              {i === months - 1 && <IconButton slot="next" size={buttonSize} icon={<ChevronRight />} aria-label={t.nextMonth} />}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Months · Years ---------- */

function PeriodGrid({ view, setView, state }: { view: 'months' | 'years'; setView: (v: View) => void; state: ViewState }) {
  const { locale } = useLocale();
  const tz = getLocalTimeZone();
  const format = useMemo(() => new DateFormatter(locale, { month: 'short', timeZone: tz }), [locale, tz]);
  const focused = state.focusedDate;
  const now = today(tz);
  const ref = useRef<HTMLDivElement>(null);
  const yearStart = focused.year - 5;

  const items = Array.from({ length: 12 }, (_, i) => {
    const date = view === 'months' ? focused.set({ month: i + 1, day: 1 }) : focused.set({ year: yearStart + i, month: 1, day: 1 });
    const last = view === 'months' ? date.add({ months: 1 }).subtract({ days: 1 }) : date.add({ years: 1 }).subtract({ days: 1 });
    const outside = (!!state.minValue && last.compare(state.minValue) < 0) || (!!state.maxValue && date.compare(state.maxValue) > 0);
    const same = (d?: DateValue | null) => !!d && d.year === date.year && (view === 'years' || d.month === date.month);
    return {
      key: `${date.year}-${date.month}`,
      label: view === 'months' ? format.format(date.toDate(tz)) : String(date.year),
      isCurrent: same(now),
      isSelected: same(state.value),
      isFocused: view === 'months' ? date.month === focused.month : date.year === focused.year,
      isDisabled: state.isDisabled || outside,
      pick: () => {
        // set() keeps the day where possible and constrains it (31 → 28 in February).
        state.setFocusedDate(view === 'months' ? focused.set({ month: i + 1 }) : focused.set({ year: yearStart + i }));
        setView(view === 'months' ? 'days' : 'months');
      },
    };
  });

  // Keep the keyboard where it was: focus the month/year that matches the focused date.
  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('[data-focus-target]')?.focus();
  }, [view]);

  return (
    <div ref={ref} className="medo-calendar__periods" role="group">
      {items.map((item) => (
        <AriaButton
          key={item.key}
          slot={null}
          className="medo-calendar__period"
          isDisabled={item.isDisabled}
          onPress={item.pick}
          aria-pressed={item.isSelected}
          aria-current={item.isCurrent ? 'date' : undefined}
          data-current={item.isCurrent || undefined}
          data-selected={item.isSelected || undefined}
          data-focus-target={item.isFocused || undefined}
        >
          {item.label}
        </AriaButton>
      ))}
    </div>
  );
}

/* ---------- Day grid ---------- */

function DayGrid({ offset, showWeekNumbers, t }: { offset: number; showWeekNumbers?: boolean; t: CalendarTexts }) {
  const { locale } = useLocale();
  return (
    <div className={cx('medo-calendar__month', showWeekNumbers && 'medo-calendar__month--weeks')}>
      {showWeekNumbers && (
        <span className="medo-calendar__weeks-label" aria-hidden="true">
          {t.weekNumber}
        </span>
      )}
      <CalendarGrid offset={offset ? { months: offset } : undefined} weekdayStyle="short" className="medo-calendar__grid">
        <CalendarGridHeader>
          {(day) => <CalendarHeaderCell className="medo-calendar__weekday">{day.replace(/\.$/, '').slice(0, 2)}</CalendarHeaderCell>}
        </CalendarGridHeader>
        <CalendarGridBody>
          {(date) => (
            <CalendarCell date={date} className="medo-calendar__cell">
              {({ formattedDate }) => (
                // The week number is drawn by CSS (data-week), so it is not part of the day's visible name (WCAG 2.5.3).
                <span className="medo-calendar__day" data-week={showWeekNumbers && getDayOfWeek(date, locale) === 0 ? isoWeek(date.add({ days: 3 })) : undefined}>
                  {formattedDate}
                </span>
              )}
            </CalendarCell>
          )}
        </CalendarGridBody>
      </CalendarGrid>
    </div>
  );
}

/* ---------- Body shared by Calendar and RangeCalendar ---------- */

function CalendarBody({ state, size, months, showWeekNumbers, t }: { state: ViewState; size: 'md' | 'lg'; months: number; showWeekNumbers?: boolean; t: CalendarTexts }) {
  const [view, setView] = useState<View>('days');
  const ref = useRef<HTMLDivElement>(null);
  const back = useRef(false);

  // Back from the month grid: the focused day takes the focus again.
  useEffect(() => {
    if (view !== 'days' || !back.current) return;
    back.current = false;
    ref.current?.querySelector<HTMLElement>('.medo-calendar__cell[tabindex="0"]')?.focus();
  }, [view]);

  const changeView = (v: View) => {
    back.current = v === 'days';
    setView(v);
  };

  return (
    <div ref={ref} className="medo-calendar__body">
      <Header view={view} setView={changeView} state={state} size={size} months={view === 'days' ? months : 1} t={t} />
      {view === 'days' ? (
        <div className="medo-calendar__months" style={{ gridTemplateColumns: `repeat(${months}, auto)` }}>
          {Array.from({ length: months }, (_, i) => (
            <DayGrid key={i} offset={i} showWeekNumbers={showWeekNumbers} t={t} />
          ))}
        </div>
      ) : (
        <PeriodGrid view={view} setView={changeView} state={state} />
      )}
    </div>
  );
}

/* ---------- Calendar ---------- */

export interface CalendarProps<T extends DateValue> extends Omit<AriaCalendarProps<T>, 'children' | 'className' | 'style' | 'visibleDuration'>, SharedProps {}

/**
 * Calendar – pick a day. React Aria Calendar: a grid with arrow keys (day/week),
 * Page Up/Down (month), Shift + Page Up/Down (year), Home/End. The month-and-year button switches to a month
 * grid, then a year grid – far dates in three clicks. Weekdays and the first day of the week from the locale.
 */
export function Calendar<T extends DateValue>({ size = 'md', showWeekNumbers, texts, className, ...props }: CalendarProps<T>) {
  const t = { ...defaultCalendarTexts, ...texts };
  return (
    <AriaCalendar<T> {...props} className={cx('medo-calendar', `medo-calendar--${size}`, className)}>
      {({ state }) => <CalendarBody state={state} size={size} months={1} showWeekNumbers={showWeekNumbers} t={t} />}
    </AriaCalendar>
  );
}

/* ---------- Range calendar ---------- */

export interface RangeCalendarProps<T extends DateValue> extends Omit<AriaRangeCalendarProps<T>, 'children' | 'className' | 'style' | 'visibleDuration'>, SharedProps {
  /** auto: two months on desktop, one below 640 px. */
  visibleMonths?: 'auto' | 1 | 2;
}

/**
 * Range calendar – pick a start and an end day. The first click sets the
 * start, the second the end; hovering previews the range. Two months side by side on desktop, one on mobile.
 */
export function RangeCalendar<T extends DateValue>({ size = 'md', showWeekNumbers, visibleMonths = 'auto', texts, className, ...props }: RangeCalendarProps<T>) {
  const t = { ...defaultCalendarTexts, ...texts };
  const mobile = useMediaQuery(MOBILE_QUERY);
  const months = visibleMonths === 'auto' ? (mobile ? 1 : 2) : visibleMonths;
  return (
    <AriaRangeCalendar<T> {...props} visibleDuration={{ months }} className={cx('medo-calendar', 'medo-calendar--range', `medo-calendar--${size}`, className)}>
      {({ state }) => (
        <CalendarBody
          state={{
            focusedDate: state.focusedDate,
            setFocusedDate: state.setFocusedDate,
            minValue: state.minValue,
            maxValue: state.maxValue,
            value: state.value?.start ?? null,
            isDisabled: state.isDisabled,
          }}
          size={size}
          months={months}
          showWeekNumbers={showWeekNumbers}
          t={t}
        />
      )}
    </AriaRangeCalendar>
  );
}
