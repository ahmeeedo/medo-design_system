/**
 * Account pattern: an app page built only from system components and the spacing rules.
 * Three pages in the side navigation – Settings, Orders, Invoices – each with its own title, search and filters.
 * Filters and data logic live in the page (in an app: in the URL and on the server).
 */
import { useId, useMemo, useState, type ReactNode } from 'react';
import { DialogTrigger, RouterProvider, type Key, type Selection, type SortDescriptor } from 'react-aria-components';
import { Bell, Download, FileText, FolderClosed, LayoutDashboard, Package, Settings, SlidersHorizontal, User } from 'lucide-react';
import {
  Alert,
  AlertDialog,
  AppHeader,
  Avatar,
  Badge,
  BottomSheet,
  BottomTabBar,
  BulkActionBar,
  Button,
  ButtonGroup,
  Cell,
  Column,
  Container,
  DescriptionItem,
  DescriptionList,
  Drawer,
  EmptyState,
  IconButton,
  ListCard,
  ListView,
  NavGroup,
  NavItem,
  Option,
  Pagination,
  Row,
  SearchField,
  Select,
  SideNav,
  Skeleton,
  SkipLink,
  Stack,
  Switch,
  TabBarItem,
  TabBarMore,
  Table,
  TableBody,
  TableHeader,
  Tag,
  TagGroup,
  TextField,
  toast,
} from '@med-o/ui';
import { day, INVOICE_TONE, invoices, money, ORDER_TONE, orders, type Invoice, type InvoiceStatus, type Order, type OrderStatus } from './data';

export type AccountPage = 'settings' | 'orders' | 'invoices';

/** Heading levels: in an app the page title is the h1. On the docs page it sits below the docs headings. */
type Level = 1 | 2 | 3;
const sub = (level: Level) => (level + 1) as 2 | 3 | 4;

const TITLES: Record<AccountPage, string> = {
  settings: 'Settings',
  orders: 'Orders',
  invoices: 'Invoices',
};

/* ---------- Shell: side navigation, app header, content ---------- */

function Logo({ full = true }: { full?: boolean }) {
  return (
    <a
      href="#home"
      aria-label="med.o home"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--medo-space-2)',
        color: 'var(--medo-color-text-primary)',
        textDecoration: 'none',
        font: 'var(--medo-typography-heading-sm)',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          inlineSize: 32,
          blockSize: 32,
          borderRadius: 'var(--medo-radius-md)',
          background: 'var(--medo-color-action-primary)',
        }}
      />
      {full && <span aria-hidden="true">med.o</span>}
    </a>
  );
}

function HeaderActions() {
  return (
    <>
      <IconButton variant="ghost" icon={<Bell />} aria-label="Notifications" />
      <Avatar name="Ahmet D." size="md" />
    </>
  );
}

export interface AccountShellProps {
  page: AccountPage;
  onNavigate: (page: AccountPage) => void;
  /** Phone frame: app header with logo, bottom tab bar, no side navigation. */
  mobile?: boolean;
  level?: Level;
  /** Id of the content: target of the skip link and of the focus after a page change. */
  mainId: string;
  children: ReactNode;
}

/**
 * The page frame. Links navigate client-side through RouterProvider – any router (Next.js, React Router) plugs in
 * the same way. In an app the content is a <main id="main"> – here a div, because the docs page has its own landmarks.
 */
export function AccountShell({ page, onNavigate, mobile = false, level = 1, mainId, children }: AccountShellProps) {
  const navigate = (href: string) => {
    const target = href.slice(1);
    if (target in TITLES) onNavigate(target as AccountPage);
  };
  const item = (p: AccountPage, icon: ReactNode, count?: number) => (
    <NavItem href={`#${p}`} icon={icon} isCurrent={page === p} count={count} countLabel={count ? `${count} open` : undefined}>
      {TITLES[p]}
    </NavItem>
  );
  const openInvoices = invoices.filter((i) => i.status !== 'Paid').length;

  const header = <AppHeader headingLevel={level} title={TITLES[page]} logo={mobile ? <Logo full={false} /> : undefined} actions={<HeaderActions />} />;
  const content = (
    <div id={mainId} tabIndex={-1} style={{ outline: 'none' }}>
      <Container>
        <div style={{ paddingBlock: 'var(--medo-layout-gap-group)' }}>{children}</div>
      </Container>
    </div>
  );

  if (mobile) {
    return (
      <RouterProvider navigate={navigate}>
        <SkipLink href={`#${mainId}`} />
        {/* transform: the fixed tab bar and bulk bar stay inside the phone frame. */}
        <div
          style={{
            position: 'relative',
            transform: 'translateZ(0)',
            inlineSize: 375,
            maxInlineSize: '100%',
            blockSize: 760,
            overflow: 'auto',
            border: 'var(--medo-border-width-thin) solid var(--medo-color-border-default)',
            borderRadius: 'var(--medo-radius-xl)',
            background: 'var(--medo-color-surface-canvas)',
            paddingBlockEnd: 'var(--medo-space-20)',
          }}
        >
          {header}
          {content}
          <BottomTabBar display="always">
            <TabBarItem href="#dashboard" icon={<LayoutDashboard />}>
              Home
            </TabBarItem>
            <TabBarItem href="#orders" icon={<Package />} isCurrent={page === 'orders'}>
              Orders
            </TabBarItem>
            <TabBarItem href="#invoices" icon={<FileText />} isCurrent={page === 'invoices'}>
              Invoices
            </TabBarItem>
            <TabBarItem href="#settings" icon={<User />} isCurrent={page === 'settings'}>
              Account
            </TabBarItem>
            <TabBarMore>
              <NavItem href="#projects" icon={<FolderClosed />}>
                Projects
              </NavItem>
            </TabBarMore>
          </BottomTabBar>
        </div>
      </RouterProvider>
    );
  }

  return (
    <RouterProvider navigate={navigate}>
      {/* First focusable element of the page: jumps over the navigation to the content. */}
      <SkipLink href={`#${mainId}`} />
      <div
        style={{
          display: 'flex',
          blockSize: 820,
          transform: 'translateZ(0)',
          overflow: 'hidden',
          background: 'var(--medo-color-surface-canvas)',
        }}
      >
        <SideNav logo={<Logo />} logoMark={<Logo full={false} />} user={{ name: 'Ahmet D.', email: 'ahmet@med-o.de' }}>
          <NavItem href="#dashboard" icon={<LayoutDashboard />}>
            Dashboard
          </NavItem>
          <NavItem href="#projects" icon={<FolderClosed />}>
            Projects
          </NavItem>
          <NavGroup label="Account" icon={<User />} defaultOpen>
            {item('settings', <Settings />)}
            {item('orders', <Package />)}
            {item('invoices', <FileText />, openInvoices)}
          </NavGroup>
        </SideNav>
        <div style={{ flex: 1, minInlineSize: 0, overflow: 'auto' }}>
          {header}
          {content}
        </div>
      </div>
    </RouterProvider>
  );
}

/* ---------- Building blocks of a page ---------- */

/** A page section: heading, short description, content – the rule content inside. */
function Section({ id, title, description, level, children }: { id: string; title: string; description?: string; level: Level; children: ReactNode }) {
  const H = `h${sub(level)}` as 'h2';
  return (
    <Stack as="section" aria-labelledby={id}>
      <Stack gap="inline">
        <H id={id} className="medo-text-heading-sm" style={{ margin: 0 }}>
          {title}
        </H>
        {description && (
          <p className="medo-text-body-sm" style={{ margin: 0, color: 'var(--medo-color-text-secondary)' }}>
            {description}
          </p>
        )}
      </Stack>
      {children}
    </Stack>
  );
}

/** Active filters as removable tags plus “Clear all”. Removing is announced by the TagGroup. */
function ActiveFilters({ filters, onRemove, onClear }: { filters: { id: string; label: string }[]; onRemove: (id: string) => void; onClear: () => void }) {
  if (!filters.length) return null;
  return (
    <Stack direction="horizontal" align="center" wrap>
      <TagGroup aria-label="Active filters" onRemove={(keys) => keys.forEach((k) => onRemove(String(k)))}>
        {filters.map((f) => (
          <Tag key={f.id} id={f.id}>
            {f.label}
          </Tag>
        ))}
      </TagGroup>
      <Button variant="text" size="sm" onPress={onClear}>
        Clear all
      </Button>
    </Stack>
  );
}

const sortBy = <T,>(list: T[], sort: SortDescriptor) => {
  const key = sort.column as keyof T;
  const sorted = [...list].sort((a, b) => (a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0));
  return sort.direction === 'descending' ? sorted.reverse() : sorted;
};

const PERIODS: Record<string, { label: string; days: number }> = {
  '30': { label: 'Last 30 days', days: 30 },
  '90': { label: 'Last 3 months', days: 90 },
  '365': { label: 'Last 12 months', days: 365 },
};
const TODAY = Date.UTC(2026, 9, 15);
const inPeriod = (date: string, period: string | null) => !period || TODAY - Date.parse(date) <= PERIODS[period].days * 86400000;

/* ---------- Settings ---------- */

export function SettingsPage({ level = 1 }: { level?: Level }) {
  return (
    <Stack gap="section">
      <Section id="profile" title="Profile" description="Your name and email appear on orders and invoices." level={level}>
        <Stack
          as="form"
          gap="fields"
          style={{ maxInlineSize: '30rem' }}
          onSubmit={(e) => {
            e.preventDefault();
            toast('Profile saved');
          }}
        >
          <TextField label="Name" name="name" defaultValue="Ahmet Daglar" isRequired autoComplete="name" />
          <TextField
            label="Email"
            name="email"
            type="email"
            defaultValue="ahmet@med-o.de"
            isRequired
            autoComplete="email"
            description="Receipts and invoices go to this address."
          />
          <Select label="Language" defaultValue="en" name="language">
            <Option id="en">English</Option>
            <Option id="de">Deutsch</Option>
          </Select>
          <ButtonGroup context="content">
            <Button type="submit">Save changes</Button>
          </ButtonGroup>
        </Stack>
      </Section>

      <Section id="notifications" title="Notifications" description="Changes apply at once." level={level}>
        <Stack gap="fields" style={{ maxInlineSize: '30rem' }}>
          <Switch labelPosition="start" defaultSelected description="Shipping and delivery of your orders.">
            Order updates
          </Switch>
          <Switch labelPosition="start" defaultSelected description="A reminder 3 days before an invoice is due.">
            Invoice reminders
          </Switch>
          <Switch labelPosition="start" description="New products, at most once a month.">
            Product news
          </Switch>
        </Stack>
      </Section>

      <Section
        id="delete"
        title="Delete account"
        description="Removes your profile and saved addresses. Invoices are kept for 10 years, as required by law."
        level={level}
      >
        <ButtonGroup context="content">
          <DialogTrigger>
            <Button variant="danger">Delete account</Button>
            <AlertDialog title="Delete your account?" actionLabel="Delete account" onAction={() => void toast('Account deleted')}>
              You will be signed out. This cannot be undone.
            </AlertDialog>
          </DialogTrigger>
        </ButtonGroup>
      </Section>
    </Stack>
  );
}

/* ---------- Orders ---------- */

function OrderDetails({ order, onClose }: { order: Order | null; onClose: () => void }) {
  return (
    <Drawer
      isOpen={!!order}
      onOpenChange={(open) => !open && onClose()}
      title={order ? `Order ${order.id}` : ''}
      size="lg"
      footer={
        <ButtonGroup context="footer">
          <Button variant="secondary" startIcon={<Download />}>
            Invoice
          </Button>
          <Button onPress={onClose}>Done</Button>
        </ButtonGroup>
      }
    >
      {order && (
        <DescriptionList>
          <DescriptionItem term="Status">
            <Badge tone={ORDER_TONE[order.status]} size="sm" dot>
              {order.status}
            </Badge>
          </DescriptionItem>
          <DescriptionItem term="Date">{day.format(new Date(order.date))}</DescriptionItem>
          <DescriptionItem term="Product">{`${order.product} · ${order.items} ${order.items === 1 ? 'item' : 'items'}`}</DescriptionItem>
          <DescriptionItem term="Total">{money.format(order.total)}</DescriptionItem>
          <DescriptionItem term="Delivery to">Ahmet Daglar, Hauptstraße 12, 76646 Bruchsal</DescriptionItem>
        </DescriptionList>
      )}
    </Drawer>
  );
}

export function OrdersPage({ level = 1, mobile = false, state }: { level?: Level; mobile?: boolean; state?: 'loading' | 'empty' }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<Key | null>(null);
  const [period, setPeriod] = useState<Key | null>(null);
  const [sort, setSort] = useState<SortDescriptor>({
    column: 'date',
    direction: 'descending',
  });
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<Order | null>(null);
  const pageSize = 8;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = orders.filter(
      (o) =>
        (!q || o.id.toLowerCase().includes(q) || o.product.toLowerCase().includes(q)) && (!status || o.status === status) && inPeriod(o.date, period as string | null),
    );
    return sortBy(list, sort);
  }, [query, status, period, sort]);
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const reset = () => {
    setQuery('');
    setStatus(null);
    setPeriod(null);
    setPage(1);
  };
  const active = [
    ...(status ? [{ id: 'status', label: `Status: ${String(status)}` }] : []),
    ...(period ? [{ id: 'period', label: PERIODS[period as string].label }] : []),
  ];

  if (state === 'empty') {
    return (
      <EmptyState
        type="first-use"
        size="page"
        headingLevel={sub(level)}
        title="No orders yet"
        description="Your orders and their delivery status will show here."
        action={{ label: 'Browse products' }}
      />
    );
  }

  const noResults = (
    <EmptyState
      type="no-results"
      size="inline"
      headingLevel={sub(level)}
      title="No orders match your filters"
      description="Change the search or remove a filter."
      action={{ label: 'Clear filters', onPress: reset }}
    />
  );
  const statusSelect = (size: 'sm' | 'lg') => (
    <Select
      aria-label="Status"
      placeholder="All statuses"
      size={size}
      clearable
      value={status}
      onChange={(v) => {
        setStatus(v as Key | null);
        setPage(1);
      }}
    >
      {(['Processing', 'Shipped', 'Delivered', 'Cancelled'] as OrderStatus[]).map((s) => (
        <Option key={s} id={s}>
          {s}
        </Option>
      ))}
    </Select>
  );
  const periodSelect = (size: 'sm' | 'lg') => (
    <Select
      aria-label="Period"
      placeholder="Any time"
      size={size}
      clearable
      value={period}
      onChange={(v) => {
        setPeriod(v as Key | null);
        setPage(1);
      }}
    >
      {Object.entries(PERIODS).map(([id, p]) => (
        <Option key={id} id={id}>
          {p.label}
        </Option>
      ))}
    </Select>
  );
  const search = (
    <SearchField
      aria-label="Search orders"
      placeholder="Order number or product"
      size={mobile ? 'lg' : 'sm'}
      value={query}
      onChange={(v) => {
        setQuery(v);
        setPage(1);
      }}
    />
  );
  // Polite live region: the number of results is announced after every change.
  const count = (
    <p role="status" className="medo-text-body-sm" style={{ margin: 0, color: 'var(--medo-color-text-secondary)' }}>
      {state === 'loading' ? 'Loading orders …' : `${filtered.length} ${filtered.length === 1 ? 'order' : 'orders'}`}
    </p>
  );

  if (mobile) {
    return (
      <Stack>
        {search}
        <Stack direction="horizontal" align="center" justify="between">
          {count}
          <DialogTrigger>
            <Button variant="secondary" startIcon={<SlidersHorizontal />}>
              {active.length ? `Filters (${active.length})` : 'Filters'}
            </Button>
            <BottomSheet title="Filters" footer={(close) => <Button onPress={close}>{`Show ${filtered.length} orders`}</Button>}>
              <Stack gap="fields">
                {statusSelect('lg')}
                {periodSelect('lg')}
              </Stack>
            </BottomSheet>
          </DialogTrigger>
        </Stack>
        <ActiveFilters filters={active} onRemove={(id) => (id === 'status' ? setStatus(null) : setPeriod(null))} onClear={reset} />
        <ListView
          aria-label="Orders"
          variant="cards"
          items={state === 'loading' ? [] : rows}
          isLoading={state === 'loading'}
          emptyState={noResults}
          onAction={(key) => setOpen(orders.find((o) => o.id === key) ?? null)}
        >
          {(o) => (
            <ListCard
              id={o.id}
              title={o.id}
              amount={money.format(o.total)}
              description={`${o.product} · ${o.items} ${o.items === 1 ? 'item' : 'items'}`}
              meta={day.format(new Date(o.date))}
              status={
                <Badge tone={ORDER_TONE[o.status]} size="sm" dot>
                  {o.status}
                </Badge>
              }
            />
          )}
        </ListView>
        {filtered.length > pageSize && (
          <Pagination variant="compact" aria-label="Order pages" page={page} onChange={setPage} totalItems={filtered.length} pageSize={pageSize} />
        )}
        <OrderDetails order={open} onClose={() => setOpen(null)} />
      </Stack>
    );
  }

  return (
    <Stack>
      {count}
      <ActiveFilters filters={active} onRemove={(id) => (id === 'status' ? setStatus(null) : setPeriod(null))} onClear={reset} />
      <Table
        aria-label="Orders"
        aria-busy={state === 'loading' || undefined}
        sortDescriptor={sort}
        onSortChange={setSort}
        onRowAction={(key) => setOpen(orders.find((o) => o.id === key) ?? null)}
        toolbar={
          <>
            <div style={{ inlineSize: '16rem' }}>{search}</div>
            {statusSelect('sm')}
            {periodSelect('sm')}
          </>
        }
        footer={
          filtered.length > pageSize ? <Pagination aria-label="Order pages" page={page} onChange={setPage} totalItems={filtered.length} pageSize={pageSize} /> : undefined
        }
      >
        <TableHeader>
          <Column id="id" isRowHeader allowsSorting>
            Order
          </Column>
          <Column id="date" allowsSorting>
            Date
          </Column>
          <Column id="product" allowsSorting>
            Product
          </Column>
          <Column id="status">Status</Column>
          <Column id="total" allowsSorting align="end">
            Total
          </Column>
        </TableHeader>
        {state === 'loading' ? (
          <TableBody items={[1, 2, 3, 4].map((id) => ({ id }))}>
            {(r) => (
              <Row id={r.id}>
                <Cell textValue="Loading">
                  <span className="medo-visually-hidden">Loading</span>
                  <Skeleton width="5rem" />
                </Cell>
                <Cell textValue="Loading">
                  <Skeleton width="6rem" />
                </Cell>
                <Cell textValue="Loading">
                  <Skeleton width="60%" />
                </Cell>
                <Cell textValue="Loading">
                  <Skeleton width="5rem" />
                </Cell>
                <Cell align="end" textValue="Loading">
                  <Skeleton width="4rem" />
                </Cell>
              </Row>
            )}
          </TableBody>
        ) : (
          <TableBody items={rows} renderEmptyState={() => noResults}>
            {(o) => (
              <Row id={o.id}>
                <Cell>{o.id}</Cell>
                <Cell>{day.format(new Date(o.date))}</Cell>
                <Cell>{`${o.product} · ${o.items} ${o.items === 1 ? 'item' : 'items'}`}</Cell>
                <Cell>
                  <Badge tone={ORDER_TONE[o.status]} size="sm" dot>
                    {o.status}
                  </Badge>
                </Cell>
                <Cell align="end">{money.format(o.total)}</Cell>
              </Row>
            )}
          </TableBody>
        )}
      </Table>
      <OrderDetails order={open} onClose={() => setOpen(null)} />
    </Stack>
  );
}

/* ---------- Invoices ---------- */

export function InvoicesPage({ level = 1, mobile = false, state }: { level?: Level; mobile?: boolean; state?: 'error' }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<Key | null>(null);
  const [period, setPeriod] = useState<Key | null>(null);
  const [sort, setSort] = useState<SortDescriptor>({
    column: 'date',
    direction: 'descending',
  });
  const [selected, setSelected] = useState<Selection>(new Set());
  const [selecting, setSelecting] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = invoices.filter(
      (i) => (!q || i.id.toLowerCase().includes(q) || i.order.toLowerCase().includes(q)) && (!status || i.status === status) && inPeriod(i.date, period as string | null),
    );
    return sortBy(list, sort);
  }, [query, status, period, sort]);
  const overdue = invoices.filter((i) => i.status === 'Overdue');
  const count = selected === 'all' ? filtered.length : selected.size;
  const reset = () => {
    setQuery('');
    setStatus(null);
    setPeriod(null);
  };
  const active = [
    ...(status ? [{ id: 'status', label: `Status: ${String(status)}` }] : []),
    ...(period ? [{ id: 'period', label: PERIODS[period as string].label }] : []),
  ];
  const download = (n: number) => {
    toast(n === 1 ? 'Invoice downloaded' : `${n} invoices downloaded`);
  };

  if (state === 'error') {
    return (
      <EmptyState
        type="error"
        size="page"
        headingLevel={sub(level)}
        title="Invoices could not be loaded"
        description="The connection to the server was lost. Your invoices are safe."
        action={{ label: 'Try again' }}
      />
    );
  }

  const noResults = (
    <EmptyState
      type="no-results"
      size="inline"
      headingLevel={sub(level)}
      title="No invoices match your filters"
      description="Change the search or remove a filter."
      action={{ label: 'Clear filters', onPress: reset }}
    />
  );
  const statusSelect = (size: 'sm' | 'lg') => (
    <Select aria-label="Status" placeholder="All statuses" size={size} clearable value={status} onChange={(v) => setStatus(v as Key | null)}>
      {(['Paid', 'Open', 'Overdue'] as InvoiceStatus[]).map((s) => (
        <Option key={s} id={s}>
          {s}
        </Option>
      ))}
    </Select>
  );
  const periodSelect = (size: 'sm' | 'lg') => (
    <Select aria-label="Period" placeholder="Any time" size={size} clearable value={period} onChange={(v) => setPeriod(v as Key | null)}>
      {Object.entries(PERIODS).map(([id, p]) => (
        <Option key={id} id={id}>
          {p.label}
        </Option>
      ))}
    </Select>
  );
  const search = <SearchField aria-label="Search invoices" placeholder="Invoice or order number" size={mobile ? 'lg' : 'sm'} value={query} onChange={setQuery} />;
  const summary = (
    <p role="status" className="medo-text-body-sm" style={{ margin: 0, color: 'var(--medo-color-text-secondary)' }}>
      {`${filtered.length} ${filtered.length === 1 ? 'invoice' : 'invoices'}`}
    </p>
  );
  const alert =
    overdue.length > 0 ? (
      <Alert
        tone="warning"
        title={`${overdue.length} invoices are overdue`}
        actions={
          <Button variant="text" size="sm" onPress={() => setStatus('Overdue')}>
            Show overdue
          </Button>
        }
      >
        Please pay them within 7 days to avoid a reminder fee.
      </Alert>
    ) : null;
  const bar = (
    <BulkActionBar
      variant={mobile ? 'mobile' : 'desktop'}
      count={count}
      onClear={() => setSelected(new Set())}
      actions={[
        {
          label: 'Download',
          onAction: () => download(count),
          icon: <Download />,
        },
      ]}
    />
  );

  if (mobile) {
    return (
      <Stack>
        {alert}
        {search}
        <Stack direction="horizontal" align="center" justify="between">
          {summary}
          <Stack direction="horizontal">
            <DialogTrigger>
              <Button variant="secondary" startIcon={<SlidersHorizontal />}>
                {active.length ? `Filters (${active.length})` : 'Filters'}
              </Button>
              <BottomSheet title="Filters" footer={(close) => <Button onPress={close}>{`Show ${filtered.length} invoices`}</Button>}>
                <Stack gap="fields">
                  {statusSelect('lg')}
                  {periodSelect('lg')}
                </Stack>
              </BottomSheet>
            </DialogTrigger>
            <Button
              variant="ghost"
              onPress={() => {
                setSelecting((s) => !s);
                setSelected(new Set());
              }}
            >
              {selecting ? 'Done' : 'Select'}
            </Button>
          </Stack>
        </Stack>
        <ActiveFilters filters={active} onRemove={(id) => (id === 'status' ? setStatus(null) : setPeriod(null))} onClear={reset} />
        <ListView
          aria-label="Invoices"
          variant="cards"
          items={filtered}
          selectionMode={selecting ? 'multiple' : 'none'}
          selectedKeys={selected}
          onSelectionChange={setSelected}
          emptyState={noResults}
        >
          {(i) => (
            <ListCard
              id={i.id}
              title={i.id}
              amount={money.format(i.amount)}
              description={`Order ${i.order}`}
              meta={`Due ${day.format(new Date(i.due))}`}
              status={
                <Badge tone={INVOICE_TONE[i.status]} size="sm" dot>
                  {i.status}
                </Badge>
              }
            />
          )}
        </ListView>
        {bar}
      </Stack>
    );
  }

  return (
    <Stack>
      {alert}
      {summary}
      <ActiveFilters filters={active} onRemove={(id) => (id === 'status' ? setStatus(null) : setPeriod(null))} onClear={reset} />
      <Table
        aria-label="Invoices"
        sortDescriptor={sort}
        onSortChange={setSort}
        selectionMode="multiple"
        selectedKeys={selected}
        onSelectionChange={setSelected}
        toolbar={
          <>
            <div style={{ inlineSize: '16rem' }}>{search}</div>
            {statusSelect('sm')}
            {periodSelect('sm')}
          </>
        }
      >
        <TableHeader>
          <Column id="id" isRowHeader allowsSorting>
            Invoice
          </Column>
          <Column id="order">Order</Column>
          <Column id="date" allowsSorting>
            Date
          </Column>
          <Column id="due" allowsSorting>
            Due
          </Column>
          <Column id="status">Status</Column>
          <Column id="amount" allowsSorting align="end">
            Amount
          </Column>
          <Column id="actions">
            <span className="medo-visually-hidden">Download</span>
          </Column>
        </TableHeader>
        <TableBody items={filtered} renderEmptyState={() => noResults}>
          {(i: Invoice) => (
            <Row id={i.id}>
              <Cell>{i.id}</Cell>
              <Cell>{i.order}</Cell>
              <Cell>{day.format(new Date(i.date))}</Cell>
              <Cell>{day.format(new Date(i.due))}</Cell>
              <Cell>
                <Badge tone={INVOICE_TONE[i.status]} size="sm" dot>
                  {i.status}
                </Badge>
              </Cell>
              <Cell align="end">{money.format(i.amount)}</Cell>
              <Cell>
                <IconButton variant="ghost" size="sm" icon={<Download />} aria-label={`Download ${i.id}`} onPress={() => download(1)} />
              </Cell>
            </Row>
          )}
        </TableBody>
      </Table>
      {bar}
    </Stack>
  );
}

/* ---------- The whole app: navigation between the three pages ---------- */

export function AccountApp({
  start = 'settings',
  mobile = false,
  level = 1,
  state,
}: {
  start?: AccountPage;
  mobile?: boolean;
  level?: Level;
  state?: 'loading' | 'empty' | 'error';
}) {
  const [page, setPage] = useState<AccountPage>(start);
  const mainId = useId();
  const navigate = (p: AccountPage) => {
    setPage(p);
    // After a page change the focus goes to the content, so keyboard and screen reader users start there.
    requestAnimationFrame(() => document.getElementById(mainId)?.focus());
  };
  return (
    <AccountShell page={page} onNavigate={navigate} mobile={mobile} level={level} mainId={mainId}>
      {page === 'settings' && <SettingsPage level={level} />}
      {page === 'orders' && <OrdersPage level={level} mobile={mobile} state={state === 'error' ? undefined : (state as 'loading' | 'empty' | undefined)} />}
      {page === 'invoices' && <InvoicesPage level={level} mobile={mobile} state={state === 'error' ? 'error' : undefined} />}
    </AccountShell>
  );
}
