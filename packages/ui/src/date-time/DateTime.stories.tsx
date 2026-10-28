import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor, within } from 'storybook/test';
import { I18nProvider } from 'react-aria-components';
import { isWeekend, parseDate, parseDateTime, parseTime, Time } from '@internationalized/date';
import { Calendar, RangeCalendar } from './Calendar';
import { DateField, TimeField } from './DateField';
import { DatePicker, DateRangePicker } from './DatePicker';
import { interactionTest, Examples, semantic } from '../story-helpers';

const stack: React.CSSProperties = { display: 'grid', gap: 'var(--medo-space-6)', alignContent: 'start' };
const columns: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 'var(--medo-space-8)', alignItems: 'start' };
const card: React.CSSProperties = {
  border: 'var(--medo-border-width-thin) solid var(--medo-color-border-default)',
  borderRadius: 'var(--medo-radius-md)',
  background: 'var(--medo-color-surface-raised)',
};

const day = parseDate('2026-10-12');
const slots = ['09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45'].map((t) => ({
  value: parseTime(t),
  isDisabled: t === '09:45',
  reason: t === '09:45' ? 'Booked' : undefined,
}));

const meta = {
  title: 'Components/Forms/Date & Time',
  component: DatePicker,
  tags: ['autodocs'],
  args: {
    label: 'Appointment date',
    description: '',
    size: 'md',
    granularity: 'day',
    showWeekNumbers: false,
    isRequired: false,
    isDisabled: false,
    overlay: 'auto',
    onChange: fn(),
  },
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    size: { control: 'inline-radio', options: ['md', 'lg'], description: 'md 40 (desktop) · lg 48 (touch).' },
    granularity: { control: 'inline-radio', options: ['day', 'minute'], description: 'minute: date + time – a time field in the panel.' },
    showWeekNumbers: { control: 'boolean', description: 'ISO week numbers in the calendar (open it).' },
    overlay: { control: 'inline-radio', options: ['auto', 'popover', 'sheet'], description: 'auto: Bottom Sheet below 640 px (open the calendar).' },
    isRequired: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    errorMessage: semantic,
    texts: semantic,
    'aria-label': semantic,
    value: { control: false },
    defaultValue: { control: false },
    minValue: { control: false },
    maxValue: { control: false },
    placeholderValue: { control: false },
    isDateUnavailable: { control: false },
    onChange: { control: false },
  },
  parameters: {
    medo: {
      subtitle: 'Type a date or pick it – date, range, time and date + time, formatted by locale.',
      usage: {
        when: [
          'A known date like a birthday: DateField (typing only).',
          'An appointment or deadline: DatePicker.',
          'A period for reports or filters: DateRangePicker.',
          'A time or date + time.',
        ],
        whenNot: [
          'A relative period (“last 7 days”) only: use a Select.',
          'Very far dates without context: a DateField is faster than a calendar.',
        ],
        do: [
          'Use `@internationalized/date` values; send `toString()` to the API.',
          'Set `minValue`, `maxValue` and unavailable days; the message names the rule.',
          'Offer `presets` for ranges in dashboards and filters.',
        ],
        dont: ['Format dates yourself; the locale decides order and separators.', 'Use a clock face for times.'],
      },
      a11y: {
        keyboard: [
          ['Digits', 'Fill the segment; a complete segment jumps to the next.'],
          ['↑ / ↓', 'Change the segment.'],
          ['← / →', 'Move between segments.'],
          ['Backspace', 'Clears the segment.'],
          ['Alt + ↓', 'Opens the calendar.'],
          ['Arrow keys / Page Up / Page Down', 'In the calendar: day, week, month; with Shift: year.'],
        ],
        notes: [
          'Each segment is a spinbutton with its own name (day, month, year).',
          'Order, separators, week start and 12/24 h come from the locale.',
          'Today has a ring; the selected day is filled.',
          'Below 640 px the calendar opens in a Bottom Sheet.',
        ],
      },
      styling: {
        classes: [
          ['medo-input medo-date-box', 'The field (Input look).'],
          ['medo-date-input, medo-date-segment', 'Segments of the date or time.'],
          ['medo-calendar, medo-calendar--range', 'Calendar and range calendar; `--lg` for touch.'],
          ['medo-calendar__day', 'One day.'],
          ['medo-date-panel, __presets, __time', 'Popover content with presets and time.'],
          ['medo-time-slots', 'List of time slots.'],
        ],
        states: [
          'data-selected',
          'data-selection-start',
          'data-selection-end',
          'data-today',
          'data-unavailable',
          'data-outside-month',
          'data-invalid',
          'data-placeholder',
          'data-focus-visible',
          'data-disabled',
        ],
      },
    },
    docs: {
      description: {
        component:
          'React Aria DateField · TimeField · DatePicker · DateRangePicker · Calendar · RangeCalendar with `@internationalized/date` values (`parseDate("2026-10-12")`, `toString()` for the API – no time-zone shifts). ' +
          'Typing first: every segment is a spinbutton, digits only, complete segments jump to the next; ↑ ↓ change, Backspace clears, a pasted date fills all. Order, separators, week start and 12/24 h come from the locale; always with leading zeros (09:30, 01.05.2026). ' +
          'The calendar is a helper: “Open calendar” or Alt + ↓; the month-and-year button switches to months and years (far dates in three clicks). Ranges: two months, optional presets. Time: typed, optional slot list behind a clock button – no clock faces. ' +
          'Below 640 px the calendar opens in a Bottom Sheet (lg, “Done”). Validation names the rule (min, max, unavailable days, reversed range). Styles: `medo-date-box`, `medo-calendar`.',
      },
    },
  },
  render: (args) => (
    <I18nProvider locale="en-GB">
      <DatePicker key={args.granularity} {...args} defaultValue={args.granularity === 'minute' ? parseDateTime('2026-10-12T09:30') : day} description={args.description || undefined} />
    </I18nProvider>
  ),
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Fields: Story = {
  name: 'Fields',
  parameters: {
    docs: {
      description: {
        story: 'One field per value – never three selects. The placeholder shows the format until filled (de: TT.MM.JJJJ). Error and disabled like the Input.',
      },
    },
  },
  render: () => (
    <Examples>
      <I18nProvider locale="de-DE">
        <div style={stack}>
          <DatePicker label="Date" defaultValue={day} />
          <DateRangePicker label="Period" defaultValue={{ start: day, end: parseDate('2026-10-21') }} />
          <TimeField label="Time" defaultValue={parseTime('09:30')} />
          <DatePicker label="Start" granularity="minute" defaultValue={parseDateTime('2026-10-12T09:30')} />
          <DatePicker label="Empty" />
          <DatePicker label="Error" defaultValue={day} isInvalid errorMessage="Choose a date from 13.10.2026 on." />
          <DatePicker label="Disabled" defaultValue={day} isDisabled />
        </div>
      </I18nProvider>
    </Examples>
  ),
};

export const CalendarStory: Story = {
  name: 'Calendar',
  parameters: {
    docs: {
      description: {
        story:
          'Click the month and year to switch to the month grid, the year for the year grid. Today has a ring, the selected day is filled. Arrow keys day/week, Page Up/Down month, Shift + Page Up/Down year. md 40 for popovers, lg 48 for touch. Optional ISO week numbers.',
      },
    },
  },
  render: () => (
    <Examples>
      <I18nProvider locale="en-GB">
        <div style={stack}>
          <div style={card}>
            <Calendar aria-label="Appointment date" defaultValue={day} onChange={fn()} />
          </div>
          <div style={card}>
            <Calendar aria-label="Appointment date" defaultValue={day} showWeekNumbers onChange={fn()} />
          </div>
        </div>
      </I18nProvider>
    </Examples>
  ),
};

export const Range: Story = {
  name: 'Date range',
  parameters: {
    docs: {
      description: {
        story:
          'Two months side by side on desktop, one on mobile. The first click sets the start, the second the end; hovering previews the range. `presets` adds the default list (Today … Last month) or your own – for dashboards and filters.',
      },
    },
  },
  render: () => (
    <I18nProvider locale="en-GB">
      <div style={stack}>
        <div style={{ ...card, inlineSize: 'max-content', maxInlineSize: '100%' }}>
          <RangeCalendar aria-label="Period" defaultValue={{ start: parseDate('2026-09-29'), end: parseDate('2026-10-12') }} onChange={fn()} />
        </div>
        <DateRangePicker label="Period" presets defaultValue={{ start: parseDate('2026-09-29'), end: parseDate('2026-10-12') }} onChange={fn()} />
      </div>
    </I18nProvider>
  ),
};

export const DateAndTime: Story = {
  name: 'Date and time',
  parameters: {
    docs: {
      description: {
        story:
          'Date + time in one field (`granularity="minute"`, the panel adds a time field) or a separate time field. Time is typed (HH:MM, 24 h in de). For bookings `slots` adds a clock button with fixed times; booked slots stay visible, disabled, with the reason.',
      },
    },
  },
  render: () => (
    <I18nProvider locale="de-DE">
      <div style={columns}>
        <DatePicker label="Start" granularity="minute" defaultValue={parseDateTime('2026-10-16T09:30')} onChange={fn()} />
        <TimeField label="Time" slots={slots} defaultValue={new Time(9, 30)} onChange={fn()} />
        <TimeField label="Time (typing only)" onChange={fn()} />
      </div>
    </I18nProvider>
  ),
};

export const Validation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Unavailable days are disabled in the calendar and checked again when typed. The message names the rule – never just “invalid date”. Here: from 12 October 2026 on, no weekends, until 31 December 2026. A fixed date, so the example looks the same every day.',
      },
    },
  },
  render: () => {
    return (
      <I18nProvider locale="en-GB">
        <div style={stack}>
          <DatePicker
            label="Delivery date"
            minValue={parseDate('2026-10-12')}
            maxValue={parseDate('2026-12-31')}
            isDateUnavailable={(d) => isWeekend(d, 'en-GB')}
            texts={{ unavailable: 'We don’t deliver on weekends. Choose a weekday.' }}
            defaultValue={parseDate('2026-10-01')}
            validationBehavior="aria"
          />
          <DateRangePicker label="Period" defaultValue={{ start: parseDate('2026-10-21'), end: parseDate('2026-10-14') }} validationBehavior="aria" />
        </div>
      </I18nProvider>
    );
  },
};

export const Mobile: Story = {
  name: 'On mobile',
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    docs: {
      description: {
        story:
          'Below 640 px everything grows: field lg 48, calendar lg with 48 px days in the Bottom Sheet (handle, close, “Done”). Typing still works with the numeric keyboard. Here forced with `overlay="sheet"` – open the calendar.',
      },
    },
  },
  render: () => (
    <I18nProvider locale="en-GB">
      <div style={{ maxInlineSize: '22rem' }}>
        <DatePicker label="Date of birth" size="lg" overlay="sheet" defaultValue={parseDate('1990-05-17')} onChange={fn()} />
      </div>
    </I18nProvider>
  ),
};

export const Locales: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Order, separators, placeholders and 12/24 h come from the locale – never hard-coded: de TT.MM.JJJJ · en-GB DD/MM/YYYY · en-US MM/DD/YYYY.',
      },
    },
  },
  render: () => (
    <div style={columns}>
      {(['de-DE', 'en-GB', 'en-US'] as const).map((locale) => (
        <I18nProvider key={locale} locale={locale}>
          <div style={stack}>
            <DateField label={`Date (${locale})`} />
            <DatePicker label={`Start (${locale})`} granularity="minute" defaultValue={parseDateTime('2026-10-12T15:30')} />
          </div>
        </I18nProvider>
      ))}
    </div>
  ),
};

export const InteractionTest: Story = {
  ...interactionTest,
  play: async ({ canvas, userEvent, args }) => {
    // Typing first: digits fill the segments, each segment jumps to the next.
    const day = canvas.getAllByRole('spinbutton')[0];
    await userEvent.click(day);
    await userEvent.keyboard('03');
    await expect(day).toHaveAttribute('aria-valuenow', '3');
    await expect(canvas.getAllByRole('spinbutton')[1]).toHaveFocus();
    // The calendar is a helper: open it, move one day with →, Enter picks it and closes.
    await userEvent.click(canvas.getByRole('button', { name: /Open calendar/ }));
    const dialog = await within(document.body).findByRole('dialog');
    await waitFor(() => expect(within(dialog).getByRole('grid')).toContainElement(document.activeElement as HTMLElement));
    await userEvent.keyboard('{ArrowRight}{Enter}');
    await waitFor(() => expect(within(document.body).queryByRole('dialog')).toBeNull());
    await expect(day).toHaveAttribute('aria-valuenow', '4');
    await expect(args.onChange).toHaveBeenCalled();
  },
};
