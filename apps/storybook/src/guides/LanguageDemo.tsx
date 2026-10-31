/** Docs examples: the same components with English and German built-in texts, side by side. */
import type { ReactNode } from 'react';
import { I18nProvider } from 'react-aria-components';
import { DatePicker, NumberField, Option, Pagination, Select, TextField, parseDate } from '@med-o/ui';

const column = { display: 'grid', gap: 'var(--medo-layout-gap-content)', alignContent: 'start', minInlineSize: 0 } as const;

function Column({ locale, children }: { locale: string; children: ReactNode }) {
  return (
    <I18nProvider locale={locale}>
      <div style={column}>
        <span className="medo-text-overline doc-muted">{locale}</span>
        {children}
      </div>
    </I18nProvider>
  );
}

function Side({ render }: { render: (locale: string) => ReactNode }) {
  return (
    <div className="doc-stage" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 16rem), 1fr))' }}>
      {['en-US', 'de-DE'].map((locale) => (
        <Column key={locale} locale={locale}>
          {render(locale)}
        </Column>
      ))}
    </div>
  );
}

/** Buttons, counters and screen-reader names. */
export function LanguageDemo() {
  return (
    <Side
      render={(locale) => (
        <>
          <Select aria-label={`Status (${locale})`} clearable>
            <Option id="open">Open</Option>
            <Option id="done">Done</Option>
          </Select>
          <TextField aria-label={`Message (${locale})`} defaultValue="Short note" characterLimit={140} />
          <Pagination totalItems={380} defaultPage={5} variant="compact" />
        </>
      )}
    />
  );
}

/** Dates, numbers and validation messages: order, separators and the built-in message follow the language. */
export function FormatDemo() {
  return (
    <Side
      render={(locale) => (
        <>
          <DatePicker label="Start date" defaultValue={parseDate('2026-10-31')} />
          <NumberField label="Budget" defaultValue={12500.5} formatOptions={{ style: 'currency', currency: 'EUR' }} />
          <DatePicker
            label="Delivery"
            defaultValue={parseDate('2026-01-05')}
            minValue={parseDate('2026-10-12')}
            validationBehavior="aria"
            key={locale}
          />
        </>
      )}
    />
  );
}
