import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bell, CircleCheck, CircleAlert, Clock, Info, Sparkles, FileText } from 'lucide-react';
import { Badge, BadgeCount, BadgeDot, type BadgeTone } from './Badge';
import { IconButton } from '../icon-button/IconButton';
import { LightDark, row } from '../story-helpers';

const tones: { tone: BadgeTone; label: string; icon: React.ReactNode }[] = [
  { tone: 'neutral', label: 'Draft', icon: <FileText /> },
  { tone: 'brand', label: 'New', icon: <Sparkles /> },
  { tone: 'success', label: 'Active', icon: <CircleCheck /> },
  { tone: 'warning', label: 'Pending', icon: <Clock /> },
  { tone: 'danger', label: 'Failed', icon: <CircleAlert /> },
  { tone: 'info', label: 'Beta', icon: <Info /> },
];

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: 'Active', tone: 'success', size: 'md', dot: true },
  argTypes: {
    tone: { control: 'inline-radio', options: ['neutral', 'brand', 'success', 'warning', 'danger', 'info'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    icon: { control: false },
  },
  parameters: {
    medo: { code: 'C17', subtitle: 'A short, non-interactive status label. Plus count and dot indicators.', figma: '184:38' },
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
  name: 'Count & dot',
  parameters: {
    docs: {
      description: {
        story:
          'The count sits on the top-right corner of an icon button. Its number is hidden; the button name says it. ' +
          'From 100 it shows „99+“, at 0 it disappears. A dot always comes with text.',
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

export const LightAndDark: Story = {
  name: 'Light and Dark',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <LightDark>
      <div style={row}>
        {tones.map((t) => (
          <Badge key={t.tone} tone={t.tone} dot>
            {t.label}
          </Badge>
        ))}
      </div>
      <div style={row}>
        <BadgeCount count={3} label="3 unread" />
        <BadgeCount count={12} tone="brand" label="12 new" />
        <BadgeCount count={7} tone="neutral" label="7 drafts" />
        <BadgeDot tone="success" label="Online" />
        <BadgeDot tone="danger" label="Unread" />
      </div>
    </LightDark>
  ),
};
