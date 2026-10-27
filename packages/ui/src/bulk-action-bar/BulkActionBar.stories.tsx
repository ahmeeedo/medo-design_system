import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Selection } from 'react-aria-components';
import { expect, fn } from 'storybook/test';
import { Archive, Download, FolderInput, Tag, Trash2 } from 'lucide-react';
import { BulkActionBar } from './BulkActionBar';
import { ListRow, ListView } from '../list-view/ListView';
import { Avatar } from '../avatar/Avatar';
import { interactionTest, semantic, slot } from '../story-helpers';

/** Stories only: a transformed box is the containing block for the fixed bar, so it stays inside the preview. */
const stage = (height: string): React.CSSProperties => ({ transform: 'translateZ(0)', minBlockSize: height });

const three = [
  { label: 'Export', onAction: fn(), icon: <Download /> },
  { label: 'Archive', onAction: fn(), icon: <Archive /> },
  { label: 'Delete', onAction: fn(), variant: 'danger' as const, icon: <Trash2 /> },
];
const five = [
  { label: 'Export', onAction: fn(), icon: <Download /> },
  { label: 'Archive', onAction: fn(), icon: <Archive /> },
  { label: 'Move', onAction: fn(), icon: <FolderInput /> },
  { label: 'Add label', onAction: fn(), icon: <Tag /> },
  { label: 'Delete', onAction: fn(), variant: 'danger' as const, icon: <Trash2 /> },
];

const meta = {
  title: 'Components/Data display/Bulk Action Bar',
  component: BulkActionBar,
  tags: ['autodocs'],
  args: { count: 3, variant: 'desktop', actions: three, onClear: fn() },
  argTypes: {
    count: { control: { type: 'number', min: 0 }, description: 'Selected items. 0 hides the bar.' },
    variant: { control: 'inline-radio', options: ['auto', 'desktop', 'mobile'], description: 'auto: mobile below 640 px.' },
    actions: { ...slot({ three, 'five - overflow': five }), description: 'Max 3 shown, more in “…”. Destructive last.' },
    onClear: { control: false },
    countLabel: semantic,
    clearLabel: semantic,
    moreLabel: semantic,
    'aria-label': semantic,
  },
  parameters: {
    medo: { subtitle: 'Actions for the selected rows of a Table or List view.' },
    docs: {
      description: {
        component:
          'Appears with ≥ 1 selected item and floats, so selecting never shifts the layout (slides up with a smooth spring; a fade with reduced motion). A toolbar named “Bulk actions”: the count is announced, Esc or × clears the selection. ' +
          'Desktop: bottom centre, 24 px above the viewport edge, surface/inverse with the Toast buttons. Mobile: full width at the bottom, Button ghost lg (Delete as ghost danger), safe area. ' +
          'Actions are structured: max 3, more go into the “…” menu; destructive actions confirm (Alert dialog) or offer Undo (Toast). Render it right after the list so Tab reaches it next. Styles: `medo-bulk-bar`.',
      },
    },
  },
  render: (args) => (
    <div style={stage(args.variant === 'mobile' ? '7rem' : '6rem')}>
      <BulkActionBar {...args} />
    </div>
  ),
} satisfies Meta<typeof BulkActionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Mobile: Story = {
  name: 'On mobile',
  parameters: {
    docs: {
      description: {
        story: 'Full width at the bottom on surface/raised: × and the count on the left, Button ghost lg on the right. Fewer actions fit – more go into “…”.',
      },
    },
  },
  render: () => (
    <div style={{ ...stage('7rem'), maxInlineSize: '23.4375rem' }}>
      <BulkActionBar
        variant="mobile"
        count={3}
        onClear={fn()}
        actions={[
          { label: 'Archive', onAction: fn(), icon: <Archive /> },
          { label: 'Delete', onAction: fn(), variant: 'danger', icon: <Trash2 /> },
        ]}
      />
    </div>
  ),
};

const inbox = [
  { id: 'lea', name: 'Lea M.', text: 'Approved the budget for Q4' },
  { id: 'sam', name: 'Sam K.', text: 'Shared “Roadmap 2027” with you' },
  { id: 'jonas', name: 'Jonas B.', text: 'Mentioned you in Website relaunch' },
  { id: 'ahmet', name: 'Ahmet D.', text: 'Updated the Q3 report' },
];

function ListExample() {
  const [selected, setSelected] = useState<Selection>(new Set(['sam']));
  const count = selected === 'all' ? inbox.length : selected.size;
  return (
    <div style={{ ...stage('22rem'), maxInlineSize: '35rem' }}>
      <ListView aria-label="Inbox" variant="card" selectionMode="multiple" selectedKeys={selected} onSelectionChange={setSelected} items={inbox}>
        {(m) => <ListRow id={m.id} title={m.name} description={m.text} leading={<Avatar name={m.name} decorative />} />}
      </ListView>
      <BulkActionBar variant="desktop" count={count} onClear={() => setSelected(new Set())} actions={three} />
    </div>
  );
}

export const WithListView: Story = {
  name: 'With a List view',
  parameters: {
    docs: {
      description: { story: 'The same bar for List view selection. Select rows; Esc or × clears the selection and focus goes back to the list.' },
    },
  },
  render: () => <ListExample />,
};

export const InteractionTest: Story = {
  ...interactionTest,
  play: async ({ canvas, userEvent, args }) => {
    const bar = canvas.getByRole('toolbar', { name: 'Bulk actions' });
    await expect(bar).toHaveTextContent('3 selected');
    await userEvent.click(canvas.getByRole('button', { name: 'Export' }));
    await expect(three[0].onAction).toHaveBeenCalled();
    // Esc clears the selection.
    canvas.getByRole('button', { name: 'Archive' }).focus();
    await userEvent.keyboard('{Escape}');
    await expect(args.onClear).toHaveBeenCalled();
  },
};
