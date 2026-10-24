import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Selection, SortDescriptor } from 'react-aria-components';
import { Cell, Column, Row, StaticTable, Table, TableBody, TableHeader } from './Table';
import { Badge, type BadgeTone } from '../badge/Badge';
import { Skeleton } from '../progress/Progress';
import { EmptyState } from '../empty-state/EmptyState';
import { LightDark } from '../story-helpers';

type Invoice = { id: string; customer: string; status: 'Paid' | 'Open' | 'Overdue'; date: string; amount: number };

const invoices: Invoice[] = [
  { id: 'INV-1042', customer: 'Northwind Labs', status: 'Paid', date: '2026-09-02', amount: 1240 },
  { id: 'INV-1043', customer: 'Blue Harbor', status: 'Open', date: '2026-09-11', amount: 860.5 },
  { id: 'INV-1044', customer: 'Kestrel & Co', status: 'Overdue', date: '2026-08-28', amount: 3120 },
  { id: 'INV-1045', customer: 'Atlas Studio', status: 'Paid', date: '2026-09-19', amount: 415 },
  { id: 'INV-1046', customer: 'Fernweh GmbH', status: 'Open', date: '2026-09-24', amount: 2075.9 },
];

const TONE: Record<Invoice['status'], BadgeTone> = { Paid: 'success', Open: 'info', Overdue: 'danger' };
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' });
const day = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' });

function InvoiceTable({ density = 'standard' as 'standard' | 'compact', selectable = false, striped = false, plain = false }) {
  const [sort, setSort] = useState<SortDescriptor>({ column: 'date', direction: 'descending' });
  const [selected, setSelected] = useState<Selection>(new Set());
  const rows = useMemo(() => {
    const key = sort.column as keyof Invoice;
    const sorted = [...invoices].sort((a, b) => (a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0));
    return sort.direction === 'descending' ? sorted.reverse() : sorted;
  }, [sort]);
  const count = selected === 'all' ? invoices.length : selected.size;

  return (
    <div style={{ display: 'grid', gap: 'var(--medo-space-3)' }}>
      {selectable && (
        <p aria-live="polite" style={{ margin: 0, font: 'var(--medo-typography-body-sm)', color: 'var(--medo-color-text-secondary)' }}>
          {count} of {invoices.length} selected
        </p>
      )}
      <Table
        aria-label="Invoices"
        density={density}
        striped={striped}
        plain={plain}
        sortDescriptor={sort}
        onSortChange={setSort}
        selectionMode={selectable ? 'multiple' : 'none'}
        selectedKeys={selected}
        onSelectionChange={setSelected}
      >
        <TableHeader>
          <Column id="id" isRowHeader allowsSorting>
            Invoice
          </Column>
          <Column id="customer" allowsSorting>
            Customer
          </Column>
          <Column id="status">Status</Column>
          <Column id="date" allowsSorting>
            Date
          </Column>
          <Column id="amount" allowsSorting align="end">
            Amount
          </Column>
        </TableHeader>
        <TableBody items={rows}>
          {(item) => (
            <Row id={item.id}>
              <Cell>{item.id}</Cell>
              <Cell>{item.customer}</Cell>
              <Cell>
                <Badge tone={TONE[item.status]} size="sm" dot>
                  {item.status}
                </Badge>
              </Cell>
              <Cell>{day.format(new Date(item.date))}</Cell>
              <Cell align="end">{money.format(item.amount)}</Cell>
            </Row>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

const meta = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    medo: { code: 'C37', subtitle: 'Shows records in rows and columns to compare, sort and act on them.', figma: '351:896' },
    docs: {
      description: {
        component:
          'Two components, one look. **StaticTable** is a native `<table>` for content and simple data. ' +
          '**Table** is interactive (React Aria Table): arrow keys move between cells, sortable headers set `aria-sort`, Space selects a row. ' +
          'Text left, numbers right with tabular figures. Data logic (sort, filter, paging) stays in your code. ' +
          'Styles: `medo-table-container`, `medo-table`, `medo-table--compact`.',
      },
    },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { density: 'standard', striped: false, plain: false },
  argTypes: {
    density: { control: 'inline-radio', options: ['standard', 'compact'] },
    striped: { control: 'boolean' },
    plain: { control: 'boolean', description: 'Without border and radius, e.g. inside a card.' },
    className: { control: false },
    style: { control: false },
  },
  render: (args) => <InvoiceTable density={args.density} striped={args.striped} plain={args.plain} />,
};

export const Static: Story = {
  parameters: { docs: { description: { story: 'For reading, not for navigating: no grid keyboard model. Row headers use `<th scope="row">`.' } } },
  render: () => (
    <StaticTable caption="Plans" captionHidden>
      <thead>
        <tr>
          <th scope="col">Plan</th>
          <th scope="col">Projects</th>
          <th scope="col" className="medo-table__cell--number">
            Price per month
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Free</th>
          <td>3</td>
          <td className="medo-table__cell--number">€0.00</td>
        </tr>
        <tr>
          <th scope="row">Pro</th>
          <td>Unlimited</td>
          <td className="medo-table__cell--number">€12.00</td>
        </tr>
        <tr>
          <th scope="row">Team</th>
          <td>Unlimited, shared</td>
          <td className="medo-table__cell--number">€29.00</td>
        </tr>
      </tbody>
    </StaticTable>
  ),
};

export const Sortable: Story = {
  parameters: {
    docs: { description: { story: 'Click a header or press Enter on it: ascending, then descending. Unsorted sortable columns show the arrow on hover and focus.' } },
  },
  render: () => <InvoiceTable />,
};

export const Selectable: Story = {
  parameters: { docs: { description: { story: 'Checkbox column first. The header checkbox selects all; the count above the table is announced.' } } },
  render: () => <InvoiceTable selectable />,
};

export const Compact: Story = {
  parameters: { docs: { description: { story: 'Rows 40 px, header 36 px. For dense data and power users; standard is the default.' } } },
  render: () => <InvoiceTable density="compact" />,
};

export const Loading: Story = {
  parameters: { docs: { description: { story: 'Skeleton rows in the shape of the data while loading. The header stays.' } } },
  render: () => (
    <Table aria-label="Invoices" aria-busy="true">
      <TableHeader>
        <Column isRowHeader>Invoice</Column>
        <Column>Customer</Column>
        <Column align="end">Amount</Column>
      </TableHeader>
      <TableBody items={[1, 2, 3].map((id) => ({ id }))}>
        {(item) => (
          <Row id={item.id}>
            <Cell textValue="Loading">
              <Skeleton width="5rem" />
            </Cell>
            <Cell textValue="Loading">
              <Skeleton width="60%" />
            </Cell>
            <Cell align="end" textValue="Loading">
              <Skeleton width="4rem" />
            </Cell>
          </Row>
        )}
      </TableBody>
    </Table>
  ),
};

export const Empty: Story = {
  parameters: { docs: { description: { story: 'The header stays; the body shows an inline Empty state that says why it is empty and what to do.' } } },
  render: () => (
    <Table aria-label="Invoices">
      <TableHeader>
        <Column isRowHeader>Invoice</Column>
        <Column>Customer</Column>
        <Column align="end">Amount</Column>
      </TableHeader>
      <TableBody
        renderEmptyState={() => (
          <EmptyState
            type="no-results"
            size="inline"
            title="No invoices match your filters"
            description="Remove some filters or change the date range."
            action={{ label: 'Clear filters' }}
          />
        )}
      >
        {[]}
      </TableBody>
    </Table>
  ),
};

export const LightAndDark: Story = {
  name: 'Light and Dark',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <LightDark>
      <InvoiceTable selectable />
    </LightDark>
  ),
};
