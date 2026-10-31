import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid, GridItem, Stack } from './Layout';
import { Card } from '../card/Card';

const cards = ['Roadmap 2027', 'Design review', 'Q4 budget', 'Website relaunch', 'Hiring plan', 'Customer survey'];

const area = (label: string, height = '6rem') => (
  <div
    style={{
      display: 'grid',
      placeItems: 'center',
      minBlockSize: height,
      border: 'var(--medo-border-width-thin) dashed var(--medo-color-border-strong)',
      borderRadius: 'var(--medo-radius-md)',
      background: 'var(--medo-color-surface-subtle)',
      font: 'var(--medo-typography-label-md)',
    }}
  >
    {label}
  </div>
);

const meta = {
  title: 'Components/Layout/Grid',
  component: Grid,
  tags: ['autodocs'],
  args: { minItemSize: '16rem' },
  argTypes: {
    columns: { control: 'select', options: [undefined, 2, 3, 4, 'layout'], description: 'Without: as many as fit. A number: equal columns. `layout`: 4 · 8 · 12.' },
    minItemSize: { control: 'text' },
    gap: { control: 'select', options: [undefined, 'inline', 'content', 'fields', 'items', 'group', 'section'], description: 'Spacing rule. Default: `items`.' },
    as: { control: false, table: { category: 'Semantics (no visual change)' } },
  },
  render: (args) => (
    <Grid {...args} as="ul" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {cards.map((t) => (
        <li key={t} style={{ display: 'grid' }}>
          <Card title={t} subtitle="Updated today">
            Shared with 4 people.
          </Card>
        </li>
      ))}
    </Grid>
  ),
  parameters: {
    medo: {
      subtitle: 'Cards, tiles and page areas in columns – with the spacing rule items between them.',
      usage: {
        when: ['Cards or tiles of equal weight (the default: as many columns as fit).', 'Page areas on the layout grid, e.g. content and sidebar (`columns="layout"`).'],
        whenNot: ['A list where order and scanning matter more than overview: use List view.', 'Elements of one block: use Stack.'],
        do: [
          'Keep the default gap: cards are always `items` (16 px on phones, 24 px from tablet) apart.',
          'Let columns come from `minItemSize` – the grid adapts without breakpoints.',
          'Render a list of cards as `ul` with `li` children.',
        ],
        dont: ['Set different gaps for cards on different pages.', 'Squeeze cards below their `minItemSize` with a fixed column count on phones.'],
      },
      a11y: {
        notes: [
          'A grid has no role. With `as="ul"` screen readers announce the number of cards.',
          'Reading and Tab order follow the DOM; a span never moves an item.',
        ],
      },
      styling: {
        classes: [
          ['medo-grid', 'As many columns as fit (`--medo-grid-min`, default 16rem), rule `items`.'],
          ['medo-grid--columns', 'Equal columns: `--medo-grid-columns`.'],
          ['medo-grid--layout', 'Layout grid: 4 · 8 · 12 columns.'],
          ['medo-grid__item', 'Spans `--medo-grid-span` columns; `--full` the whole row.'],
          ['medo-gap-{rule}', 'Another rule.'],
        ],
      },
    },
    docs: {
      description: {
        component:
          'Use a grid for cards, tiles and page areas. Cards always sit `items` apart – the same distance as the columns of the layout grid. Styles: `medo-grid`.',
      },
    },
  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const FixedColumns: Story = {
  name: 'Fixed columns',
  args: { columns: 3 },
  parameters: { docs: { description: { story: 'A fixed number of equal columns – for content that always has the same count, like three key figures.' } } },
  render: (args) => <Grid columns={args.columns}>{['Revenue', 'Customers', 'Churn'].map((l) => area(l))}</Grid>,
};

export const LayoutGrid: Story = {
  name: 'Layout grid',
  parameters: {
    docs: {
      description: {
        story:
          'Page areas on the 4 · 8 · 12 column grid. A span never exceeds the columns there are: content (8) and sidebar (4) sit side by side on a desktop and below each other on a phone.',
      },
    },
  },
  render: () => (
    <Stack gap="items">
      <Grid columns="layout">
        <GridItem span="full">{area('Header · full', '4rem')}</GridItem>
        <GridItem span={8}>{area('Content · 8', '12rem')}</GridItem>
        <GridItem span={4}>{area('Sidebar · 4', '12rem')}</GridItem>
      </Grid>
      <Grid columns="layout">
        {Array.from({ length: 12 }, (_, i) => (
          <GridItem key={i}>{area(String(i + 1), '3rem')}</GridItem>
        ))}
      </Grid>
    </Stack>
  ),
};
