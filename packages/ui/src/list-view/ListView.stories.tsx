import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Archive, Bell, CreditCard, Mail, Trash2 } from 'lucide-react';
import { ListRow, ListRowIcon, ListView } from './ListView';
import { Avatar } from '../avatar/Avatar';
import { Badge } from '../badge/Badge';
import { Button } from '../button/Button';
import { Menu, MenuButton, MenuItem, MenuTrigger } from '../menu/Menu';
import { Switch } from '../switch/Switch';
import { row, semantic } from '../story-helpers';

const box: React.CSSProperties = { maxInlineSize: '35rem' };

const inbox = [
  { id: 'lea', name: 'Lea M.', text: 'Approved the budget for Q4', meta: '09:41', unread: true },
  { id: 'sam', name: 'Sam K.', text: 'Shared „Roadmap 2027“ with you', meta: 'Yesterday' },
  { id: 'jonas', name: 'Jonas B.', text: 'Mentioned you in Website relaunch', meta: 'Mon' },
  { id: 'ahmet', name: 'Ahmet D.', text: 'Updated the Q3 report', meta: 'Sep 28' },
];

/** „…“ menu of a row – every action of the row lives here (also the future swipe actions). */
function RowMenu({ name }: { name: string }) {
  return (
    <MenuTrigger>
      <MenuButton aria-label={`More actions for ${name}`} size="sm" />
      <Menu overlay="popover">
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
  title: 'Components/List View',
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
    medo: { code: 'C29', subtitle: 'Interactive lists of objects in apps: inbox, people, files, notifications, settings.', figma: '266:248' },
    docs: {
      description: {
        component:
          'Built on React Aria GridList: ↑ ↓ move between rows, Enter opens a row (`onAction` or `href`), Tab reaches the controls inside a row. Each row is named by its title. ' +
          '`ListRow`: leading (Avatar – sized automatically –, `ListRowIcon` or thumbnail), title and description (48 · 64 · 88), meta, one trailing type per list (Menu, Badge, Switch, chevron or max 2 Button sm – then the row has no action). ' +
          '`unread`: strong text, meta in brand, a dot and „Unread“ for screen readers. Plain or card; inset dividers start at the text. `isLoading` shows 3 skeleton rows. ' +
          'Swipe actions are a draft in Figma – the „…“ menu holds every action. Styles: `medo-list-view`, `medo-list-view--card`, `medo-list-row`, `medo-list-row--unread`.',
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
  parameters: { docs: { description: { story: 'Inbox example: Enter or a click opens a row (Actions panel), Tab reaches the „…“ menu.' } } },
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
  name: 'Rows: 1 · 2 · 3 lines',
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
          description="Shared „Roadmap 2027“ with you and asked for feedback on the second milestone before Friday, when the board meets."
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
  parameters: { docs: { description: { story: '3 skeleton rows while loading (aria-busy). An empty list shows a short text with a next step.' } } },
  render: () => (
    <div style={{ ...row, alignItems: 'start' }}>
      <div style={{ flex: '1 1 18rem' }}>
        <ListView aria-label="Inbox" variant="card" isLoading>
          {[]}
        </ListView>
      </div>
      <div style={{ flex: '1 1 18rem' }}>
        <ListView aria-label="Inbox" variant="card" items={[] as typeof inbox} emptyState="No messages yet. Invite your team to start a conversation.">
          {(item) => <ListRow id={item.id} title={item.name} />}
        </ListView>
      </div>
    </div>
  ),
};
