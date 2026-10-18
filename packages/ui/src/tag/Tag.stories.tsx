import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { User } from 'lucide-react';
import { Tag, TagGroup } from './Tag';
import { Button } from '../button/Button';
import { LightDark } from '../story-helpers';

const topics = [
  { id: 'design', name: 'Design' },
  { id: 'code', name: 'Code' },
  { id: 'research', name: 'Research' },
  { id: 'marketing', name: 'Marketing' },
];

function RemovableDemo({ size = 'md' as 'sm' | 'md' }) {
  const [items, setItems] = useState(topics);
  return (
    <TagGroup
      label="Selected topics"
      size={size}
      items={items}
      onRemove={(keys) => setItems((list) => list.filter((t) => !keys.has(t.id)))}
      renderEmptyState={() => <span style={{ font: 'var(--medo-typography-body-sm)', color: 'var(--medo-color-text-secondary)' }}>No topics</span>}
    >
      {(item) => <Tag>{item.name}</Tag>}
    </TagGroup>
  );
}

function FilterDemo({ size = 'md' as 'sm' | 'md' }) {
  const [selected, setSelected] = useState<Set<string | number>>(new Set(['design']));
  return (
    <div style={{ display: 'grid', gap: 'var(--medo-space-3)', justifyItems: 'start' }}>
      <TagGroup
        label="Filter by topic"
        size={size}
        selectionMode="multiple"
        selectedKeys={selected}
        onSelectionChange={(keys) => setSelected(new Set(keys === 'all' ? topics.map((t) => t.id) : keys))}
        items={topics}
      >
        {(item) => <Tag>{item.name}</Tag>}
      </TagGroup>
      {selected.size > 1 && (
        <Button variant="text" size="sm" onPress={() => setSelected(new Set())}>
          Clear filters
        </Button>
      )}
    </div>
  );
}

const meta = {
  title: 'Components/Tag',
  component: TagGroup,
  tags: ['autodocs'],
  parameters: {
    medo: { code: 'C06', subtitle: 'Compact pill for a value. Removable in multi-select, selectable as a filter.', figma: '108:48' },
    docs: {
      description: {
        component:
          'Two roles, never mixed: **removable** values (pass `onRemove`) and **filters** (pass `selectionMode`). ' +
          'Built on React Aria TagGroup: arrow keys move between tags, Backspace/Delete removes, Space toggles a filter. ' +
          'Removals are announced to screen readers. Styles: `medo-tag medo-tag--md`, `medo-tag--selectable`.',
      },
    },
  },
} satisfies Meta<typeof TagGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { label: 'Selected topics', children: null },
  render: () => <RemovableDemo />,
};

export const Removable: Story = {
  args: { children: null },
  parameters: { docs: { description: { story: 'Chosen values, e.g. in a multi-select. The x removes; a disabled tag cannot be removed.' } } },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--medo-space-6)' }}>
      <RemovableDemo size="sm" />
      <TagGroup label="Assignees" onRemove={() => {}} disabledKeys={['ben']}>
        <Tag id="anna" icon={<User />}>
          Anna Weber
        </Tag>
        <Tag id="ben" icon={<User />}>
          Ben Lorenz
        </Tag>
      </TagGroup>
    </div>
  ),
};

export const Filters: Story = {
  args: { children: null },
  parameters: {
    docs: {
      description: {
        story: 'The whole tag toggles. Selected shows a check and the brand tint. Click again to deselect; with several filters active, offer „Clear filters“.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--medo-space-6)' }}>
      <FilterDemo />
      <FilterDemo size="sm" />
    </div>
  ),
};

export const LightAndDark: Story = {
  name: 'Light and Dark',
  args: { children: null },
  parameters: { layout: 'fullscreen' },
  render: () => (
    <LightDark>
      <RemovableDemo />
      <FilterDemo />
    </LightDark>
  ),
};
