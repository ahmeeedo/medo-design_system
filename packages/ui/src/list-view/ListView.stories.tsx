import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { Archive, Bell, CreditCard, Mail, Trash2 } from 'lucide-react';
import { ListCard, ListRow, ListRowIcon, ListView } from './ListView';
import { Avatar } from '../avatar/Avatar';
import { Badge } from '../badge/Badge';
import { Button } from '../button/Button';
import { Menu, MenuButton, MenuItem, MenuTrigger } from '../menu/Menu';
import { Switch } from '../switch/Switch';
import { EmptyState } from '../empty-state/EmptyState';
import { ToastRegion, toast } from '../toast/Toast';
import { interactionTest, row, semantic } from '../story-helpers';

const box: React.CSSProperties = { maxInlineSize: '35rem' };

const inbox = [
  { id: 'lea', name: 'Lea M.', text: 'Approved the budget for Q4', meta: '09:41', unread: true },
  { id: 'sam', name: 'Sam K.', text: 'Shared “Roadmap 2027” with you', meta: 'Yesterday' },
  { id: 'jonas', name: 'Jonas B.', text: 'Mentioned you in Website relaunch', meta: 'Mon' },
  { id: 'ahmet', name: 'Ahmet D.', text: 'Updated the Q3 report', meta: 'Sep 28' },
];

/** “…” menu of a row – every action of the row lives here (also the swipe actions). */
function RowMenu({ name, onAction }: { name: string; onAction?: (key: 'archive' | 'delete') => void }) {
  return (
    <MenuTrigger>
      <MenuButton aria-label={`More actions for ${name}`} size="sm" />
      <Menu overlay="popover" onAction={(key) => onAction?.(key as 'archive' | 'delete')}>
        <MenuItem id="archive" icon={<Archive />}>
          Archive
        </MenuItem>
        <MenuItem id="delete" icon={<Trash2 />} variant="danger">
          Delete
        </MenuItem>
      </Menu>
    </MenuTrigger>
  );
}

const meta = {
  title: 'Components/Data display/List View',
  component: ListView,
  tags: ['autodocs'],
  args: { 'aria-label': 'Inbox', variant: 'plain', selectionMode: 'none', isLoading: false, onAction: fn(), onSelectionChange: fn(), children: null },
  argTypes: {
    variant: { control: 'inline-radio', options: ['plain', 'card'], description: 'plain: full-page lists · card: inside settings or dashboards.' },
    selectionMode: { control: 'inline-radio', options: ['none', 'multiple'], description: 'multiple: a checkbox per row; a click toggles the row.' },
    isLoading: { control: 'boolean' },
    'aria-label': semantic,
    emptyState: { control: false },
    onAction: { control: false },
    onSelectionChange: { control: false },
    children: { control: false },
    items: { control: false },
  },
  parameters: {
    medo: {
      subtitle: 'Interactive lists of objects in apps: inbox, people, files, notifications, settings.',
      usage: {
        when: ['Interactive lists of objects in apps: inbox, people, files, settings.', 'The mobile form of a Table (`variant="cards"`).'],
        whenNot: ['Content lists in text: use a List.', 'Data to compare in columns: use a Table.'],
        do: ['Use one trailing type per list.', 'Name each row by its title.', 'Offer the same actions in the “…” menu as in swipe actions.'],
        dont: ['Put more than 2 buttons in a row.', 'Make swiping the only way to an action.'],
      },
      a11y: {
        keyboard: [
          ['↑ / ↓', 'Moves between rows.'],
          ['Enter', 'Opens the row.'],
          ['Tab', 'Reaches the controls inside the row.'],
          ['Space', 'Selects the row (with selection).'],
        ],
        notes: [
          'A React Aria GridList; each row is named by its title.',
          'Unread rows have strong text, a dot and a hidden “Unread”.',
          '`isLoading` shows skeleton rows.',
          'Swipe actions work on touch only; the menu holds the same actions.',
        ],
      },
      styling: {
        classes: [
          ['medo-list-view', 'The list; `--plain` or `--card`, `--cards`.'],
          ['medo-list-row', 'One row; `--lines-{1|2|3}`, `--unread`.'],
          ['medo-list-row__leading, __content, __title, __description', 'Parts of a row.'],
          ['medo-list-row__meta, __trailing, __chevron', 'End of the row.'],
          ['medo-list-card', 'A record as a card.'],
        ],
        states: ['data-hovered', 'data-pressed', 'data-selected', 'data-focus-visible', 'data-disabled'],
      },
    },
    docs: {
      description: {
        component:
          'Built on React Aria GridList: ↑ ↓ move between rows, Enter opens a row (`onAction` or `href`), Tab reaches the controls inside a row. Each row is named by its title. ' +
          '`ListRow`: leading (Avatar – sized automatically –, `ListRowIcon` or thumbnail), title and description (48 · 64 · 88), meta, one trailing type per list (Menu, Badge, Switch, chevron or max 2 Button sm – then the row has no action). ' +
          '`unread`: strong text, meta in brand, a dot and “Unread” for screen readers. Plain or card; inset dividers start at the text. `isLoading` shows 3 skeleton rows. ' +
          '`variant="cards"` with `ListCard` shows records as cards – the mobile form of a Table row. Selection works with the Bulk action bar. ' +
          'Swipe on touch (`swipeActions`): left reveals Delete, right Archive – the “…” menu holds the same actions. Styles: `medo-list-view`, `medo-list-view--card`, `medo-list-row`, `medo-list-row--unread`.',
      },
    },
  },
  render: (args) => (
    <div style={box}>
      {/* In selection mode a click toggles the row – no row action then. */}
      <ListView {...args} onAction={args.selectionMode === 'multiple' ? undefined : args.onAction} items={inbox}>
        {(item) => (
          <ListRow
            id={item.id}
            title={item.name}
            description={item.text}
            meta={item.meta}
            unread={item.unread}
            leading={<Avatar name={item.name} decorative />}
            trailing={<RowMenu name={item.name} />}
          />
        )}
      </ListView>
    </div>
  ),
} satisfies Meta<typeof ListView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: { docs: { description: { story: 'Inbox example: Enter or a click opens a row (Actions panel), Tab reaches the “…” menu.' } } },
};

export const Trailing: Story = {
  name: 'Trailing types',
  parameters: {
    docs: {
      description: {
        story: 'One trailing type per list. Meta + menu, chevron (the row navigates), switch (a setting), buttons (a decision – the row itself is not clickable).',
      },
    },
  },
  render: () => (
    <div style={box}>
      <ListView aria-label="Examples" variant="card">
        <ListRow id="meta" title="Lea M." description="Meta + menu" meta="09:41" leading={<Avatar name="Lea M." decorative />} trailing={<RowMenu name="Lea M." />} />
        <ListRow
          id="billing"
          title="Billing"
          description="Chevron – the whole row navigates"
          leading={
            <ListRowIcon>
              <CreditCard />
            </ListRowIcon>
          }
          href="#billing"
          chevron
        />
        <ListRow
          id="email"
          title="Email notifications"
          description="Switch – changes a setting"
          leading={
            <ListRowIcon>
              <Mail />
            </ListRowIcon>
          }
          trailing={
            <Switch defaultSelected>
              <span className="medo-visually-hidden">Email notifications</span>
            </Switch>
          }
        />
        <ListRow
          id="invite"
          title="med.o GmbH invited you"
          description="Buttons – row not clickable"
          leading={<Avatar name="med.o GmbH" shape="square" decorative />}
          trailing={
            <>
              <Button variant="ghost" size="sm">
                Decline
              </Button>
              <Button variant="secondary" size="sm">
                Accept
              </Button>
            </>
          }
        />
      </ListView>
    </div>
  ),
};

export const Lines: Story = {
  name: 'Rows',
  parameters: {
    docs: { description: { story: 'Height follows the lines: 48, 64, 88. The title truncates after one line, the description after one or two (`lines={3}`).' } },
  },
  render: () => (
    <div style={box}>
      <ListView aria-label="Lines" variant="card">
        <ListRow
          id="one"
          title="Notifications"
          leading={
            <ListRowIcon>
              <Bell />
            </ListRowIcon>
          }
          meta="3"
        />
        <ListRow id="two" title="Lea M." description="Approved the budget for Q4" leading={<Avatar name="Lea M." decorative />} meta="09:41" />
        <ListRow
          id="three"
          lines={3}
          title="Sam K."
          description="Shared “Roadmap 2027” with you and asked for feedback on the second milestone before Friday, when the board meets."
          leading={<Avatar name="Sam K." decorative />}
          meta="Yesterday"
          trailing={
            <Badge tone="info" size="sm">
              Review
            </Badge>
          }
        />
      </ListView>
    </div>
  ),
};

export const Selection: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'In selection mode every row shows a checkbox before the leading element; a click toggles it. Selected rows use action/selected; disabled rows are at 50 %.',
      },
    },
  },
  render: () => (
    <div style={box}>
      <ListView aria-label="Inbox" selectionMode="multiple" defaultSelectedKeys={['lea', 'jonas']} disabledKeys={['ahmet']} items={inbox}>
        {(item) => <ListRow id={item.id} title={item.name} description={item.text} meta={item.meta} leading={<Avatar name={item.name} decorative />} />}
      </ListView>
    </div>
  ),
};

export const LoadingAndEmpty: Story = {
  name: 'Loading and empty',
  parameters: { docs: { description: { story: '3 skeleton rows while loading (aria-busy). An empty list shows an inline Empty state with a next step.' } } },
  render: () => (
    <div style={{ ...row, alignItems: 'start' }}>
      <div style={{ flex: '1 1 18rem' }}>
        <ListView aria-label="Inbox" variant="card" isLoading>
          {[]}
        </ListView>
      </div>
      <div style={{ flex: '1 1 18rem' }}>
        <ListView
          aria-label="Inbox"
          variant="card"
          items={[] as typeof inbox}
          emptyState={
            <EmptyState
              size="inline"
              icon={<Mail />}
              title="No messages yet"
              description="Invite your team to start a conversation."
              action={{ label: 'Invite people', onPress: fn() }}
            />
          }
        >
          {(item) => <ListRow id={item.id} title={item.name} />}
        </ListView>
      </div>
    </div>
  ),
};

const invoices = [
  { id: 'INV-2026-0142', customer: 'Lea Marquardt', amount: '€1,240.00', date: 'Oct 12, 2026', status: 'Paid', tone: 'success' as const },
  { id: 'INV-2026-0141', customer: 'Sam Kowalski', amount: '€860.50', date: 'Oct 11, 2026', status: 'Open', tone: 'info' as const },
  { id: 'INV-2026-0140', customer: 'Jonas Bauer', amount: '€2,315.00', date: 'Oct 9, 2026', status: 'Overdue', tone: 'danger' as const },
];

export const Cards: Story = {
  name: 'Cards',
  parameters: {
    docs: {
      description: {
        story:
          '`variant="cards"` with ListCard: title and key number, owner (Avatar xs automatically), date and status. The whole card opens the record. In selection mode a checkbox lg shows; selected cards use action/selected with an action/primary border.',
      },
    },
  },
  render: () => (
    <div style={{ ...row, alignItems: 'start' }}>
      {(['none', 'multiple'] as const).map((mode) => (
        <div key={mode} style={{ flex: '1 1 18rem', maxInlineSize: '21.4375rem' }}>
          <ListView
            aria-label={mode === 'none' ? 'Invoices' : 'Invoices, selecting'}
            variant="cards"
            items={invoices}
            selectionMode={mode}
            defaultSelectedKeys={mode === 'multiple' ? ['INV-2026-0140'] : undefined}
            onAction={mode === 'none' ? fn() : undefined}
          >
            {(r) => (
              <ListCard
                id={r.id}
                title={r.id}
                amount={r.amount}
                description={
                  <>
                    <Avatar name={r.customer} decorative />
                    {r.customer}
                  </>
                }
                meta={r.date}
                status={
                  <Badge tone={r.tone} size="sm" dot>
                    {r.status}
                  </Badge>
                }
              />
            )}
          </ListView>
        </div>
      ))}
      <div style={{ flex: '1 1 18rem', maxInlineSize: '21.4375rem' }}>
        <ListView aria-label="Invoices loading" variant="cards" isLoading>
          {[]}
        </ListView>
      </div>
    </div>
  ),
};

/** Inbox with swipe actions: delete and archive remove the row at once and offer “Undo” (8 s). */
function SwipeInbox({ onOpen }: { onOpen?: (key: unknown) => void }) {
  const [items, setItems] = useState(inbox);
  const remove = (id: string, verb: 'deleted' | 'archived') => {
    const index = items.findIndex((i) => i.id === id);
    const item = items[index];
    setItems((all) => all.filter((i) => i.id !== id));
    toast(`Conversation ${verb}`, {
      action: { label: 'Undo', onAction: () => setItems((all) => [...all.slice(0, index), item, ...all.slice(index)]) },
    });
  };
  return (
    <div style={box}>
      <ListView aria-label="Inbox" items={items} onAction={onOpen} emptyState={<EmptyState size="inline" type="all-done" title="Inbox zero" />}>
        {(item) => (
          <ListRow
            id={item.id}
            title={item.name}
            description={item.text}
            meta={item.meta}
            unread={item.unread}
            leading={<Avatar name={item.name} decorative />}
            trailing={<RowMenu name={item.name} onAction={(key) => remove(item.id, key === 'delete' ? 'deleted' : 'archived')} />}
            swipeActions={{
              start: { label: 'Archive', icon: <Archive />, onAction: () => remove(item.id, 'archived') },
              end: { label: 'Delete', icon: <Trash2 />, tone: 'danger', onAction: () => remove(item.id, 'deleted') },
            }}
          />
        )}
      </ListView>
      <ToastRegion />
    </div>
  );
}

export const Swipe: Story = {
  name: 'Swipe actions',
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    docs: {
      description: {
        story:
          'Touch only (use device mode in the browser): swipe left reveals Delete, right Archive. From 88 px the action snaps open – tap it; a full swipe (≥ 50 % or a flick) triggers it at once. Only one row is open; a tap elsewhere, scrolling or Esc closes it. ' +
          'Delete and archive remove the row at once and a Toast offers “Undo” for 8 s – no confirmation dialog. Mouse, keyboard and screen readers use the “…” menu with the same actions.',
      },
    },
  },
  render: (args) => <SwipeInbox onOpen={args.onAction} />,
};

export const InteractionTest: Story = {
  ...interactionTest,
  play: async ({ canvas, userEvent, args }) => {
    // ↑ ↓ move between rows, Enter opens the row. findBy: wait until React Aria has rendered the collection.
    const lea = await canvas.findByRole('row', { name: /Lea M\./ });
    await userEvent.tab();
    await expect(lea).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('row', { name: /Sam K\./ })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onAction).toHaveBeenLastCalledWith('sam');
    // A click opens it as well.
    await userEvent.click(canvas.getByText('Jonas B.'));
    await expect(args.onAction).toHaveBeenLastCalledWith('jonas');
  },
};
