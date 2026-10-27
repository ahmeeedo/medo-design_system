import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Inbox } from 'lucide-react';
import { EmptyState, type EmptyStateProps } from './EmptyState';
import { Card } from '../card/Card';
import { ListRow, ListView } from '../list-view/ListView';
import { Avatar } from '../avatar/Avatar';
import { Column, Table, TableBody, TableHeader } from '../table/Table';
import { TextField } from '../text-field/TextField';
import { Examples, semantic, slot } from '../story-helpers';

const caption: React.CSSProperties = { font: 'var(--medo-typography-code-sm)', color: 'var(--medo-color-text-secondary)' };
const grid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(20rem, 1fr))', gap: 'var(--medo-space-6)', alignItems: 'start' };
const frame: React.CSSProperties = { border: 'var(--medo-border-width-thin) dashed var(--medo-color-border-default)', borderRadius: 'var(--medo-radius-lg)' };

/** Copy per type – the component ships no text, the app writes it. */
const examples: Record<NonNullable<EmptyStateProps['type']>, Omit<EmptyStateProps, 'type'>> = {
  'first-use': {
    title: 'No projects yet',
    description: 'Projects keep files, tasks and people together. Create your first one to get started.',
    action: { label: 'Create project', onPress: fn() },
    secondaryAction: { label: 'Learn more', href: '#learn-more' },
  },
  'no-results': {
    title: 'No results for “invoice 2025”',
    description: 'Check the spelling or remove some filters.',
    action: { label: 'Clear filters', onPress: fn() },
  },
  error: {
    title: 'Couldn’t load projects',
    description: 'Something went wrong on our side. Your data is safe – try again in a moment.',
    action: { label: 'Try again', onPress: fn() },
  },
  'no-access': {
    title: 'You don’t have access',
    description: 'Ask a workspace admin to add you to this project.',
    action: { label: 'Request access', onPress: fn() },
  },
  'all-done': {
    title: 'You’re all caught up',
    description: 'New notifications will show up here.',
    secondaryAction: { label: 'View archive', href: '#archive' },
  },
};

/** Placeholder until a shared illustration style exists. */
const illustration = (
  <svg viewBox="0 0 240 160" role="presentation">
    <rect width="240" height="160" fill="var(--medo-color-surface-subtle)" />
    <rect x="70" y="40" width="100" height="80" rx="8" fill="var(--medo-color-surface-default)" stroke="var(--medo-color-border-default)" />
    <rect x="86" y="60" width="68" height="8" rx="4" fill="var(--medo-color-border-default)" />
    <rect x="86" y="78" width="44" height="8" rx="4" fill="var(--medo-color-border-default)" />
  </svg>
);

const meta = {
  title: 'Components/Feedback/Empty State',
  component: EmptyState,
  tags: ['autodocs'],
  args: { type: 'first-use', size: 'page', ...examples['first-use'] },
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['first-use', 'no-results', 'error', 'no-access', 'all-done'],
      description: 'Sets the default icon, its tone and the look of the main action.',
    },
    size: { control: 'inline-radio', options: ['page', 'section', 'inline'], description: 'page: a whole view · section: a card or panel · inline: a list or table.' },
    title: { control: 'text' },
    description: { control: 'text' },
    action: {
      ...slot({
        none: undefined,
        'Create project': { label: 'Create project', onPress: fn() },
        'Clear filters': { label: 'Clear filters', onPress: fn() },
        'Try again': { label: 'Try again', onPress: fn() },
      }),
      description: 'Main action `{ label, onPress }`: primary for first use, secondary otherwise.',
    },
    secondaryAction: {
      ...slot({ none: undefined, 'Learn more - link': { label: 'Learn more', href: '#learn-more' }, 'Import - button': { label: 'Import', onPress: fn() } }),
      description: 'Second action: a Link with `href`, otherwise a text button.',
    },
    icon: { ...slot({ default: undefined, inbox: <Inbox /> }), description: 'Replaces the type’s default icon.' },
    illustration: { ...slot({ none: undefined, placeholder: illustration }), description: 'Instead of the icon – only from the shared illustration style.' },
    headingLevel: semantic,
  },
  parameters: {
    medo: { subtitle: 'What users see when there is nothing to show – and what they can do next.' },
    docs: {
      description: {
        component:
          'Five types with their own icon and tone: first use (folder), no results (search), error (danger), no access (lock), all done (success). The text comes from the app – never “No data”. ' +
          'Sizes: page (a whole view, 480), section (a card or panel, 400), inline (a list or table, 320 – the header stays). ' +
          'Actions are structured: `action` is primary for first use and secondary otherwise (at most one primary); `secondaryAction` is a text button or, with `href`, a Link. “All done” needs no action. ' +
          'Page and section are a `<section>` named by their heading (`headingLevel`); inline adds no landmark. “No results” is announced politely (`role="status"`), focus stays in the search field. Icon and illustration are hidden from screen readers. ' +
          'Styles: `medo-empty-state`, `medo-empty-state--{page|section|inline}`, `medo-icon-tile`.',
      },
    },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Types: Story = {
  parameters: { docs: { description: { story: 'Each type with its default icon and tone, and example copy. Section size.' } } },
  render: () => (
    <Examples>
      {(Object.keys(examples) as (keyof typeof examples)[]).map((type) => (
        <div key={type} style={frame}>
          <EmptyState type={type} size="section" {...examples[type]} />
        </div>
      ))}
    </Examples>
  ),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Match the size to the place: page for a whole view, section inside a card, inline inside a list or table – the card title and table header stay visible.',
      },
    },
  },
  render: () => (
    <div style={grid}>
      <div style={{ display: 'grid', gap: 'var(--medo-space-2)' }}>
        <span style={caption}>page</span>
        <div style={frame}>
          <EmptyState type="first-use" {...examples['first-use']} />
        </div>
      </div>
      <div style={{ display: 'grid', gap: 'var(--medo-space-2)' }}>
        <span style={caption}>section · in a card</span>
        <Card title="Recent activity">
          <EmptyState type="all-done" size="section" headingLevel={4} title="No activity yet" description="Changes to your projects will show up here." />
        </Card>
      </div>
      <div style={{ display: 'grid', gap: 'var(--medo-space-2)' }}>
        <span style={caption}>inline · in a table</span>
        <Table aria-label="Invoices">
          <TableHeader>
            <Column isRowHeader>Invoice</Column>
            <Column>Customer</Column>
            <Column align="end">Amount</Column>
          </TableHeader>
          <TableBody renderEmptyState={() => <EmptyState type="no-results" size="inline" {...examples['no-results']} />}>{[]}</TableBody>
        </Table>
      </div>
    </div>
  ),
};

export const Illustration: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The illustration slot replaces the icon (240 × 160 · 160 × 120 · 120 × 88, radius/lg). Only from the shared style – a placeholder here. Decorative.',
      },
    },
  },
  render: () => (
    <div style={grid}>
      {(['page', 'section', 'inline'] as const).map((size) => (
        <div key={size} style={frame}>
          <EmptyState size={size} illustration={illustration} {...examples['first-use']} />
        </div>
      ))}
    </div>
  ),
};

const people = [
  { id: 'lea', name: 'Lea M.', role: 'Design' },
  { id: 'sam', name: 'Sam K.', role: 'Engineering' },
  { id: 'jonas', name: 'Jonas B.', role: 'Product' },
];

function SearchExample() {
  const [query, setQuery] = useState('xyz');
  const field = useRef<HTMLDivElement>(null);
  const items = people.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <div ref={field} style={{ display: 'grid', gap: 'var(--medo-space-3)', maxInlineSize: '30rem' }}>
      <TextField label="Search people" type="search" value={query} onChange={setQuery} />
      <ListView
        aria-label="People"
        variant="card"
        items={items}
        emptyState={
          <EmptyState
            type="no-results"
            size="inline"
            title={`No results for “${query}”`}
            description="Check the spelling or try another name."
            action={{
              label: 'Show all people',
              onPress: () => {
                setQuery('');
                // The button disappears with the empty state – put focus back into the search field.
                field.current?.querySelector('input')?.focus();
              },
            }}
          />
        }
      >
        {(p) => <ListRow id={p.id} title={p.name} description={p.role} leading={<Avatar name={p.name} decorative />} />}
      </ListView>
    </div>
  );
}

export const NoResults: Story = {
  name: 'No results in a list',
  parameters: {
    docs: {
      description: {
        story:
          'Type to filter. The list keeps its frame; “No results” is announced politely while focus stays in the search field. “Show all people” clears the search and returns focus to the field.',
      },
    },
  },
  render: () => <SearchExample />,
};
