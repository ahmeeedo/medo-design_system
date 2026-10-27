import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { Pagination } from './Pagination';
import { Cell, Column, Row, Table, TableBody, TableHeader } from '../table/Table';
import { ListRow, ListView } from '../list-view/ListView';
import { Avatar } from '../avatar/Avatar';
import { Button } from '../button/Button';
import { interactionTest, LightDark, semantic, slot } from '../story-helpers';

const caption: React.CSSProperties = { font: 'var(--medo-typography-code-sm)', color: 'var(--medo-color-text-secondary)' };
const stack: React.CSSProperties = { display: 'grid', gap: 'var(--medo-space-6)' };

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: { totalItems: 380, pageSize: 20, defaultPage: 5, variant: 'full', size: 'md', onChange: fn() },
  argTypes: {
    totalItems: { control: { type: 'number', min: 0 }, description: 'Total count: the summary and the number of pages.' },
    pageSize: { control: 'inline-radio', options: [10, 20, 50, 100] },
    defaultPage: { control: { type: 'number', min: 1 } },
    variant: { control: 'inline-radio', options: ['auto', 'full', 'compact'], description: 'auto: compact below 640 px.' },
    size: { control: 'inline-radio', options: ['md', 'lg'], if: { arg: 'variant', neq: 'compact' }, description: 'Full only: md 40 · lg 48 (touch).' },
    onPageSizeChange: { ...slot({ none: undefined, shown: fn() }), description: 'Shows „Rows per page“ (Select sm).' },
    getPageHref: { ...semantic, description: 'Websites: every page becomes a real link (same look).' },
    page: { control: false },
    totalPages: { control: false },
    onChange: { control: false },
    pageSizeOptions: { control: false },
    'aria-label': semantic,
    summary: semantic,
    pageSizeLabel: semantic,
    previousLabel: semantic,
    nextLabel: semantic,
    pageLabel: semantic,
    compactLabel: semantic,
  },
  parameters: {
    medo: { subtitle: 'Move through long lists page by page – or load more with a simple button.' },
    docs: {
      description: {
        component:
          'A navigation region („Pagination“). Full on desktop: summary („81–100 of 380“, a polite live region), rows per page (Select sm) and ‹ 1 … 4 5 6 … 19 ›. Compact below 640 px: ‹ Page 5 of 19 › with 48 px buttons (`variant="auto"`). ' +
          'Max 7 items: first and last always, the current page with one neighbour each side; an ellipsis never hides a single page; one page shows nothing. ' +
          'Apps: buttons with `onChange`. Websites: `getPageHref` makes every page a real link (works with RouterProvider). The current page has `aria-current="page"` and action/selected – calm, never the primary colour. ' +
          'After a change the app scrolls to the top of the list and focuses its heading. „Load more“ is not a variant – a Button below the list. Styles: `medo-pagination`, `medo-page-item`.',
      },
    },
  },
  // Uncontrolled from `defaultPage`; a new default restarts it.
  render: (args) => <Pagination key={`${args.defaultPage}-${args.pageSize}-${args.totalItems}`} {...args} />,
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Truncation: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Up to 7 pages all show. Near the start or end five pages in a row, in the middle the current page with one neighbour – first and last always.',
      },
    },
  },
  render: () => (
    <div style={stack}>
      {[
        [4, 7, '≤ 7 pages'],
        [3, 19, 'current near start (3)'],
        [10, 19, 'current in the middle (10)'],
        [17, 19, 'current near end (17)'],
      ].map(([page, total, label]) => (
        <div key={label} style={{ display: 'grid', gap: 'var(--medo-space-2)' }}>
          <span style={caption}>{label}</span>
          <Pagination variant="full" defaultPage={page as number} totalPages={total as number} aria-label={`Pagination, ${label}`} />
        </div>
      ))}
    </div>
  ),
};

export const Links: Story = {
  name: 'Links (websites)',
  parameters: {
    docs: {
      description: {
        story:
          'With `getPageHref` every page, previous and next are real links („?page=5“): shareable, crawlable, the back button works. Same look as the buttons. With RouterProvider the app router handles them.',
      },
    },
  },
  render: () => <Pagination totalItems={380} defaultPage={5} getPageHref={(p) => `#page-${p}`} />,
};

export const Compact: Story = {
  name: 'Compact (mobile)',
  parameters: {
    docs: {
      description: { story: 'Below 640 px: ‹ Page 5 of 19 › with 48 px buttons, full width. No summary, no rows per page. Previous is disabled on the first page.' },
    },
  },
  render: () => (
    <LightDark>
      <div style={{ maxInlineSize: '21.4375rem' }}>
        <Pagination variant="compact" defaultPage={5} totalPages={19} aria-label="Pagination, page 5" />
      </div>
      <div style={{ maxInlineSize: '21.4375rem' }}>
        <Pagination variant="compact" defaultPage={1} totalPages={19} aria-label="Pagination, first page" />
      </div>
    </LightDark>
  ),
};

export const LightAndDark: Story = {
  name: 'Light and Dark',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <LightDark>
      <Pagination variant="full" totalItems={380} defaultPage={5} onPageSizeChange={fn()} />
    </LightDark>
  ),
};

type Invoice = { id: string; customer: string; amount: number };
const customers = ['Northwind Labs', 'Blue Harbor', 'Kestrel & Co', 'Atlas Studio', 'Fernweh GmbH'];
const invoices: Invoice[] = Array.from({ length: 87 }, (_, i) => ({ id: `INV-${1001 + i}`, customer: customers[i % 5], amount: 200 + ((i * 137) % 3000) }));
const euro = new Intl.NumberFormat('en', { style: 'currency', currency: 'EUR' });

function TableExample() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const heading = useRef<HTMLHeadingElement>(null);
  const rows = invoices.slice((page - 1) * pageSize, page * pageSize);
  const change = (p: number) => {
    setPage(p);
    // Keep context: back to the top of the list, focus on its heading.
    heading.current?.scrollIntoView({ block: 'start' });
    heading.current?.focus();
  };
  return (
    <div style={{ display: 'grid', gap: 'var(--medo-space-4)' }}>
      <h2 ref={heading} tabIndex={-1} className="medo-text-heading-sm" style={{ margin: 0, outline: 'none' }}>
        Invoices
      </h2>
      <Table aria-label="Invoices">
        <TableHeader>
          <Column isRowHeader>Invoice</Column>
          <Column>Customer</Column>
          <Column align="end">Amount</Column>
        </TableHeader>
        <TableBody items={rows}>
          {(r) => (
            <Row id={r.id}>
              <Cell>{r.id}</Cell>
              <Cell>{r.customer}</Cell>
              <Cell align="end">{euro.format(r.amount)}</Cell>
            </Row>
          )}
        </TableBody>
      </Table>
      <Pagination
        aria-label="Invoices pages"
        page={page}
        onChange={change}
        totalItems={invoices.length}
        pageSize={pageSize}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
    </div>
  );
}

export const WithTable: Story = {
  name: 'With a table',
  parameters: {
    docs: {
      description: {
        story:
          'Pages for known totals. After a change the list scrolls to its top and the heading gets focus; the summary is announced. A new page size starts at page 1.',
      },
    },
  },
  render: () => <TableExample />,
};

const people = Array.from({ length: 47 }, (_, i) => ({ id: `p${i + 1}`, name: `Person ${i + 1}`, role: ['Design', 'Engineering', 'Product'][i % 3] }));

function LoadMoreExample() {
  const [count, setCount] = useState(10);
  const list = useRef<HTMLDivElement>(null);
  const more = () => {
    const firstNew = people[count].id;
    setCount((c) => Math.min(c + 10, people.length));
    // New items appear below; focus moves to the first new item.
    requestAnimationFrame(() => list.current?.querySelector<HTMLElement>(`[data-key="${firstNew}"]`)?.focus());
  };
  return (
    <div ref={list} style={{ display: 'grid', gap: 'var(--medo-space-4)', justifyItems: 'center', maxInlineSize: '30rem' }}>
      <div style={{ justifySelf: 'stretch' }}>
        <ListView aria-label="People" variant="card" items={people.slice(0, count)}>
          {(p) => <ListRow id={p.id} title={p.name} description={p.role} leading={<Avatar name={p.name} decorative />} />}
        </ListView>
      </div>
      <p role="status" style={{ margin: 0, font: 'var(--medo-typography-body-sm)', color: 'var(--medo-color-text-secondary)' }}>
        Showing {count} of {people.length}
      </p>
      {count < people.length && (
        <Button variant="secondary" onPress={more}>
          Load more
        </Button>
      )}
    </div>
  );
}

export const LoadMore: Story = {
  name: 'Load more (pattern)',
  parameters: {
    docs: {
      description: {
        story:
          'For feeds and search results – no own component: the count and a Button secondary (ghost in quiet places) below the list. New items appear below; focus moves to the first new item.',
      },
    },
  },
  render: () => <LoadMoreExample />,
};

export const InteractionTest: Story = {
  ...interactionTest,
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByRole('button', { name: 'Page 5' })).toHaveAttribute('aria-current', 'page');
    await userEvent.click(canvas.getByRole('button', { name: 'Next page' }));
    await expect(canvas.getByRole('button', { name: 'Page 6' })).toHaveAttribute('aria-current', 'page');
    await expect(args.onChange).toHaveBeenLastCalledWith(6);
    // The last page disables „Next“ – focus stays inside the pagination.
    await userEvent.click(canvas.getByRole('button', { name: 'Page 19' }));
    await expect(canvas.getByRole('button', { name: 'Next page' })).toBeDisabled();
  },
};
