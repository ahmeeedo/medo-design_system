import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bell, CircleCheck, CircleAlert, Clock, Info, Sparkles, FileText } from 'lucide-react';
import { Badge, BadgeCount, BadgeDot, type BadgeTone } from './Badge';
import { IconButton } from '../icon-button/IconButton';
import { row, slot } from '../story-helpers';

const tones: { tone: BadgeTone; label: string; icon: React.ReactNode }[] = [
  { tone: 'neutral', label: 'Draft', icon: <FileText /> },
  { tone: 'brand', label: 'New', icon: <Sparkles /> },
  { tone: 'success', label: 'Active', icon: <CircleCheck /> },
  { tone: 'warning', label: 'Pending', icon: <Clock /> },
  { tone: 'danger', label: 'Failed', icon: <CircleAlert /> },
  { tone: 'info', label: 'Beta', icon: <Info /> },
];

const meta = {
  title: 'Components/Feedback/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: 'Active', tone: 'success', size: 'md', dot: true, icon: 'none' },
  argTypes: {
    tone: { control: 'inline-radio', options: ['neutral', 'brand', 'success', 'warning', 'danger', 'info'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    /* The dot wins over the icon: the icon control appears when dot is off. */
    icon: { ...slot({ none: undefined, check: <CircleCheck />, clock: <Clock />, info: <Info /> }), if: { arg: 'dot', truthy: false } },
    children: { control: 'text' },
  },
  parameters: {
    medo: {
      subtitle: 'A short, non-interactive status label. Plus count and dot indicators.',
      usage: {
        when: [
          'A short status next to an object: Active, Draft, Overdue.',
          'A count on a tab or nav item (`BadgeCount`).',
          'Unread or presence indicators (`BadgeDot`).',
        ],
        whenNot: ['Something clickable: use a Button or a Tag.', 'A removable value or a filter: use a Tag.', 'A longer message: use an Alert.'],
        do: [
          'Use 1–2 words in sentence case.',
          'Add a dot or an icon, so the status does not rely on colour alone.',
          'Use neutral for everything without a meaning.',
        ],
        dont: ['Make a badge clickable.', 'Put several badges with the same tone side by side.'],
      },
      a11y: {
        notes: [
          'Badges are plain text; screen readers read the label.',
          'Counts above `max` show “99+”. Give a count a `label` like “3 unread messages”, or let the parent name it.',
          'A dot alone needs a hidden text that says what it means.',
        ],
      },
      styling: {
        classes: [
          ['medo-badge', 'The label; neutral by default.'],
          ['medo-badge--{tone}', '`brand`, `success`, `warning`, `danger`, `info`.'],
          ['medo-badge--{size}', '`sm` 20 or `md` 24.'],
          ['medo-badge__dot, __icon', 'Leading dot or icon.'],
          ['medo-badge-count', 'Number in a pill.'],
          ['medo-badge-dot', 'Dot indicator.'],
        ],
      },
    },
    docs: {
      description: {
        component:
          'Status label, never clickable. Use a dot or icon so the status does not rely on colour alone. ' +
          'Styles: `medo-badge medo-badge--success medo-badge--md`, `medo-badge-count`, `medo-badge-dot`.',
      },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--medo-space-4)' }}>
      <div style={row}>
        {tones.map((t) => (
          <Badge key={t.tone} tone={t.tone}>
            {t.label}
          </Badge>
        ))}
      </div>
      <div style={row}>
        {tones.map((t) => (
          <Badge key={t.tone} tone={t.tone} dot>
            {t.label}
          </Badge>
        ))}
      </div>
      <div style={row}>
        {tones.map((t) => (
          <Badge key={t.tone} tone={t.tone} icon={t.icon}>
            {t.label}
          </Badge>
        ))}
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={row}>
      <Badge size="sm" tone="success" dot>
        Active
      </Badge>
      <Badge size="md" tone="success" dot>
        Active
      </Badge>
    </div>
  ),
};

export const CountAndDot: Story = {
  name: 'Count and dot',
  parameters: {
    docs: {
      description: {
        story:
          'The count sits on the top-right corner of an icon button. Its number is hidden; the button name says it. ' +
          'From 100 it shows “99+”, at 0 it disappears. A dot always comes with text.',
      },
    },
  },
  render: () => (
    <div style={{ ...row, gap: 'var(--medo-space-8)' }}>
      <span style={{ position: 'relative', display: 'inline-flex' }}>
        <IconButton aria-label="Notifications, 3 unread" tooltip="Notifications" icon={<Bell />} variant="ghost" />
        <BadgeCount count={3} size="sm" style={{ position: 'absolute', insetBlockStart: 2, insetInlineEnd: 2 }} />
      </span>
      <div style={row}>
        <BadgeCount count={3} label="3 unread" />
        <BadgeCount count={128} tone="brand" label="128 new" />
        <BadgeCount count={7} tone="neutral" label="7 drafts" />
      </div>
      <span style={{ ...row, gap: 'var(--medo-space-2)', font: 'var(--medo-typography-body-sm)' }}>
        <BadgeDot tone="success" />
        Anna is online
      </span>
    </div>
  ),
};
