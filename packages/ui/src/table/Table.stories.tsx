import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Selection, SortDescriptor } from 'react-aria-components';
import { expect, fn } from 'storybook/test';
import { Archive, Download, Funnel, Mail, Plus, Trash2 } from 'lucide-react';
import { Cell, Column, Row, StaticTable, Table, TableBody, TableHeader } from './Table';
import { ColumnsMenu } from './ColumnsMenu';
import { Badge, type BadgeTone } from '../badge/Badge';
import { Skeleton } from '../progress/Progress';
import { EmptyState } from '../empty-state/EmptyState';
import { BulkActionBar } from '../bulk-action-bar/BulkActionBar';
import { Pagination } from '../pagination/Pagination';
import { Button } from '../button/Button';
import { SearchField } from '../search/SearchField';
import { Avatar } from '../avatar/Avatar';
import { Menu, MenuButton, MenuItem, MenuTrigger } from '../menu/Menu';
import { ListCard, ListView } from '../list-view/ListView';
import { MOBILE_QUERY, useMediaQuery } from '../utils/useMediaQuery';
import { interactionTest, LightDark } from '../story-helpers';

/** Stories only: a transformed box is the containing block for the fixed bulk bar, so it stays inside the preview. */
const stage: React.CSSProperties = { transform: 'translateZ(0)', paddingBlockEnd: 'var(--medo-space-20)' };

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
    <div style={selectable ? stage : undefined}>
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
      {selectable && (
        <BulkActionBar
          variant="desktop"
          count={count}
          onClear={() => setSelected(new Set())}
          actions={[
            { label: 'Export', onAction: fn() },
            { label: 'Archive', onAction: fn() },
            { label: 'Delete', onAction: fn(), variant: 'danger' },
          ]}
        />
      )}
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
          '`toolbar` and `footer` put search, ColumnsMenu, actions and Pagination into the same bordered surface; selection shows the Bulk action bar; below 640 px records become List view cards. ' +
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
    toolbar: { control: false, description: 'Bar above the header – see „Toolbar, columns, bulk actions, pagination“.' },
    footer: { control: false, description: 'Bar below the rows, usually Pagination.' },
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
  parameters: {
    docs: {
      description: {
        story:
          'Checkbox column first; the header checkbox selects the page (indeterminate when some are selected). With ≥ 1 selected the Bulk action bar floats in – the layout never shifts. The count is announced; Esc or × clears the selection.',
      },
    },
  },
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
              <span className="medo-visually-hidden">Loading</span>
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

/* ---------- Full example: toolbar, columns, selection, bulk bar, pagination – cards on mobile ---------- */

type InvoiceRecord = { id: string; customer: string; status: Invoice['status']; date: string; amount: number };
const people = ['Lea Marquardt', 'Sam Kowalski', 'Jonas Bauer', 'Aylin Demir', 'Mia Hoffmann', 'Noah Weber'];
const statuses: Invoice['status'][] = ['Paid', 'Open', 'Overdue', 'Paid', 'Open', 'Paid'];
const records: InvoiceRecord[] = Array.from({ length: 46 }, (_, i) => ({
  id: `INV-2026-${String(142 - i).padStart(4, '0')}`,
  customer: people[i % 6],
  status: statuses[(i * 5) % 6],
  date: new Date(Date.UTC(2026, 9, 12) - i * 86400000 * 1.5).toISOString().slice(0, 10),
  amount: 120 + ((i * 731) % 3200) + (i % 2) * 0.5,
}));

const columnOptions = [
  { id: 'id', label: 'Invoice', isLocked: true },
  { id: 'customer', label: 'Customer' },
  { id: 'date', label: 'Date' },
  { id: 'status', label: 'Status' },
  { id: 'amount', label: 'Amount' },
  { id: 'actions', label: 'Actions', isLocked: true },
];

function RowMenu({ id }: { id: string }) {
  return (
    <MenuTrigger>
      <MenuButton aria-label={`More actions for ${id}`} size="sm" />
      <Menu>
        <MenuItem id="send" icon={<Mail />}>
          Send reminder
        </MenuItem>
        <MenuItem id="download" icon={<Download />}>
          Download PDF
        </MenuItem>
        <MenuItem id="delete" icon={<Trash2 />} variant="danger">
          Delete
        </MenuItem>
      </Menu>
    </MenuTrigger>
  );
}

function InvoiceWorkspace({ forceMobile = false }: { forceMobile?: boolean }) {
  const isMobile = useMediaQuery(MOBILE_QUERY) || forceMobile;
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortDescriptor>({ column: 'date', direction: 'descending' });
  const [selected, setSelected] = useState<Selection>(new Set());
  const [selecting, setSelecting] = useState(false);
  const [visible, setVisible] = useState(['id', 'customer', 'date', 'status', 'amount', 'actions']);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = records.filter((r) => !q || r.id.toLowerCase().includes(q) || r.customer.toLowerCase().includes(q));
    const key = sort.column as keyof InvoiceRecord;
    const sorted = [...list].sort((a, b) => (a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0));
    return sort.direction === 'descending' ? sorted.reverse() : sorted;
  }, [query, sort]);
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const count = selected === 'all' ? filtered.length : selected.size;
  const clear = () => setSelected(new Set());
  const columns = columnOptions.filter((c) => visible.includes(c.id));

  const empty = (
    <EmptyState
      type="no-results"
      size="inline"
      title={`No results for “${query}”`}
      description="Check the spelling or search for a customer."
      action={{ label: 'Clear search', onPress: () => setQuery('') }}
    />
  );
  const bar = (
    <BulkActionBar
      variant={isMobile ? 'mobile' : 'desktop'}
      count={count}
      onClear={clear}
      actions={[
        ...(isMobile ? [] : [{ label: 'Export', onAction: fn(), icon: <Download /> }]),
        { label: 'Archive', onAction: fn(), icon: <Archive /> },
        { label: 'Delete', onAction: fn(), variant: 'danger' as const, icon: <Trash2 /> },
      ]}
    />
  );
  const search = (
    <div style={{ inlineSize: isMobile ? '100%' : '15rem' }}>
      <SearchField
        aria-label="Search invoices"
        placeholder="Search invoices"
        size={isMobile ? 'lg' : 'sm'}
        value={query}
        onChange={(v) => {
          setQuery(v);
          setPage(1);
        }}
      />
    </div>
  );

  if (isMobile) {
    return (
      <div style={{ ...stage, display: 'grid', gap: 'var(--medo-space-3)', maxInlineSize: '23.4375rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 className="medo-text-heading-sm" style={{ margin: 0 }}>
            Invoices
          </h2>
          <Button
            variant="ghost"
            onPress={() => {
              setSelecting((s) => !s);
              clear();
            }}
          >
            {selecting ? 'Done' : 'Select'}
          </Button>
        </div>
        {search}
        <ListView
          aria-label="Invoices"
          variant="cards"
          items={rows}
          selectionMode={selecting ? 'multiple' : 'none'}
          selectedKeys={selected}
          onSelectionChange={setSelected}
          onAction={selecting ? undefined : fn()}
          emptyState={empty}
        >
          {(r) => (
            <ListCard
              id={r.id}
              title={r.id}
              amount={money.format(r.amount)}
              description={
                <>
                  <Avatar name={r.customer} decorative />
                  {r.customer}
                </>
              }
              meta={day.format(new Date(r.date))}
              status={
                <Badge tone={TONE[r.status]} size="sm" dot>
                  {r.status}
                </Badge>
              }
            />
          )}
        </ListView>
        <Pagination variant="compact" aria-label="Invoice pages" page={page} onChange={setPage} totalItems={filtered.length} pageSize={pageSize} />
        {bar}
      </div>
    );
  }

  return (
    <div style={stage}>
      <Table
        aria-label="Invoices"
        sortDescriptor={sort}
        onSortChange={setSort}
        selectionMode="multiple"
        selectedKeys={selected}
        onSelectionChange={setSelected}
        toolbar={
          <>
            {search}
            <Button variant="secondary" size="sm" startIcon={<Funnel />}>
              Filter
            </Button>
            <ColumnsMenu columns={columnOptions} visibleColumns={visible} onVisibleColumnsChange={setVisible} />
            <span style={{ flex: 1 }} />
            <Button size="sm" startIcon={<Plus />}>
              New invoice
            </Button>
          </>
        }
        footer={
          <Pagination
            aria-label="Invoice pages"
            page={page}
            onChange={setPage}
            totalItems={filtered.length}
            pageSize={pageSize}
            onPageSizeChange={(n) => {
              setPageSize(n);
              setPage(1);
            }}
          />
        }
      >
        <TableHeader columns={columns}>
          {(c) =>
            c.id === 'actions' ? (
              <Column id="actions">
                <span className="medo-visually-hidden">Actions</span>
              </Column>
            ) : (
              <Column id={c.id} isRowHeader={c.id === 'id'} allowsSorting={c.id !== 'status'} align={c.id === 'amount' ? 'end' : 'start'}>
                {c.label}
              </Column>
            )
          }
        </TableHeader>
        <TableBody items={rows} dependencies={[visible]} renderEmptyState={() => empty}>
          {(r) => (
            <Row id={r.id} columns={columns}>
              {(c) => {
                switch (c.id) {
                  case 'customer':
                    return (
                      <Cell>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--medo-space-2)' }}>
                          <Avatar name={r.customer} size="sm" decorative />
                          {r.customer}
                        </span>
                      </Cell>
                    );
                  case 'date':
                    return <Cell>{day.format(new Date(r.date))}</Cell>;
                  case 'status':
                    return (
                      <Cell>
                        <Badge tone={TONE[r.status]} size="sm" dot>
                          {r.status}
                        </Badge>
                      </Cell>
                    );
                  case 'amount':
                    return <Cell align="end">{money.format(r.amount)}</Cell>;
                  case 'actions':
                    return (
                      <Cell>
                        <RowMenu id={r.id} />
                      </Cell>
                    );
                  default:
                    return <Cell>{r.id}</Cell>;
                }
              }}
            </Row>
          )}
        </TableBody>
      </Table>
      {bar}
    </div>
  );
}

export const FullExample: Story = {
  name: 'Toolbar, columns, bulk actions, pagination',
  parameters: {
    docs: {
      description: {
        story:
          'Toolbar (search Input sm 240, Filter, ColumnsMenu, primary action), sortable header, selection with the Bulk action bar, Pagination in the footer – one bordered surface. ' +
          '„Columns“ shows or hides columns; Invoice and Actions are locked. Search for „xyz“ for the empty state. Below 640 px the same data becomes Table cards (next story).',
      },
    },
  },
  render: () => <InvoiceWorkspace />,
};

export const MobileCards: Story = {
  name: 'Mobile: cards',
  parameters: {
    docs: {
      description: {
        story:
          'Below 640 px records become a List view with `variant="cards"` (ListCard: title + amount, customer, date + status). The whole card opens the record. „Select“ shows checkboxes lg and the bar at the bottom incl. safe area. Comparison data (prices, specs) scrolls horizontally instead.',
      },
    },
  },
  render: () => <InvoiceWorkspace forceMobile />,
};

export const InteractionTest: Story = {
  ...interactionTest,
  render: () => <InvoiceTable selectable />,
  play: async ({ canvas, userEvent }) => {
    // findBy: wait until React Aria has rendered the collection.
    const invoice = await canvas.findByRole('columnheader', { name: /Invoice/ });
    // A click on a sortable header sorts; a second click reverses.
    await userEvent.click(invoice);
    const first = invoice.getAttribute('aria-sort');
    await userEvent.click(invoice);
    await expect(invoice.getAttribute('aria-sort')).not.toBe(first);
    await expect(['ascending', 'descending']).toContain(invoice.getAttribute('aria-sort'));
    // Selecting rows with their checkbox.
    const boxes = canvas.getAllByRole('checkbox');
    await userEvent.click(boxes[1]);
    await expect(canvas.getAllByRole('row').filter((r) => r.getAttribute('aria-selected') === 'true')).toHaveLength(1);
    await userEvent.click(boxes[0]);
    await expect(canvas.getAllByRole('row').filter((r) => r.getAttribute('aria-selected') === 'true').length).toBeGreaterThan(1);
  },
};
