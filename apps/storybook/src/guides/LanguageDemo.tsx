/** Docs example: the same components with English and German built-in texts, side by side. */
import { I18nProvider } from 'react-aria-components';
import { Option, Pagination, Select, TextField } from '@med-o/ui';

const column = { display: 'grid', gap: 'var(--medo-space-5)', alignContent: 'start', minInlineSize: 0 } as const;

function Example({ locale, title }: { locale: string; title: string }) {
  return (
    <I18nProvider locale={locale}>
      <div style={column}>
        <span className="medo-text-overline doc-muted">{title}</span>
        <Select aria-label={`Status (${title})`} clearable>
          <Option id="open">Open</Option>
          <Option id="done">Done</Option>
        </Select>
        <TextField aria-label={`Message (${title})`} defaultValue="Short note" characterLimit={140} />
        <Pagination totalItems={380} defaultPage={5} variant="compact" />
      </div>
    </I18nProvider>
  );
}

export function LanguageDemo() {
  return (
    <div className="doc-stage" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 16rem), 1fr))' }}>
      <Example locale="en-US" title="en-US" />
      <Example locale="de-DE" title="de-DE" />
    </div>
  );
}
