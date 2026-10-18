import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileText } from 'lucide-react';
import { ProgressBar, Skeleton, Spinner } from './Progress';
import { Button } from '../button/Button';
import { LightDark, row } from '../story-helpers';

const meta = {
  title: 'Components/Loading & Progress',
  component: ProgressBar,
  tags: ['autodocs'],
  args: { label: 'Uploading 3 files', value: 64, description: '2 of 3 files · about 12 s left', size: 'md', status: 'default', showValue: true },
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    status: { control: 'inline-radio', options: ['default', 'success', 'error'] },
  },
  parameters: {
    medo: { code: 'C26', subtitle: 'Show that something is happening – and, when possible, how long it will take.', figma: '245:26' },
    docs: {
      description: {
        component:
          'Nothing under 300 ms · Spinner for short waits · Skeleton while content loads · Progress bar for long or measurable work. ' +
          'Spinner and Progress bar are built on React Aria ProgressBar (role progressbar). Reduced motion: slower spinner, static skeleton and segment.',
      },
    },
  },
  decorators: [(Story) => <div style={{ maxInlineSize: '28rem' }}>{Story()}</div>],
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Spinners: Story = {
  parameters: {
    docs: { description: { story: 'Uses the text colour of its parent. In a button use `isPending`: the spinner replaces the icon, the label says what happens („Saving…“).' } },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--medo-space-6)' }}>
      <div style={row}>
        <Spinner size="sm" tone="brand" />
        <Spinner size="md" tone="brand" />
        <Spinner size="lg" tone="brand" />
        <Spinner size="xl" tone="brand" />
        <Spinner size="lg" tone="neutral" />
      </div>
      <div style={row}>
        <Button isPending>Saving…</Button>
        <Button variant="secondary" isPending>
          Loading…
        </Button>
      </div>
    </div>
  ),
};

export const ProgressBars: Story = {
  name: 'Progress bars',
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--medo-space-8)' }}>
      <ProgressBar label="Uploading 3 files" value={64} description="2 of 3 files · about 12 s left" />
      <ProgressBar label="Upload complete" value={100} status="success" description="3 of 3 files" />
      <ProgressBar label="Upload failed" value={64} status="error" description="Connection lost. Try again." />
      <ProgressBar label="Preparing export" isIndeterminate description="This can take a minute" />
      <div style={{ ...row, flexWrap: 'nowrap', gap: 'var(--medo-space-3)' }}>
        <FileText aria-hidden="true" style={{ color: 'var(--medo-color-text-secondary)', flexShrink: 0 }} />
        <ProgressBar aria-label="Q3-Report.pdf" size="sm" value={64} showValue={false} style={{ flex: 1 }} />
        <span style={{ font: 'var(--medo-typography-body-sm)', color: 'var(--medo-color-text-secondary)' }}>64%</span>
      </div>
    </div>
  ),
};

export const Skeletons: Story = {
  parameters: {
    docs: { description: { story: 'Same shape and spacing as the loaded content. Hidden from screen readers; the region is aria-busy.' } },
  },
  render: () => (
    <div aria-busy="true" style={{ display: 'flex', gap: 'var(--medo-space-4)', alignItems: 'flex-start' }}>
      <Skeleton shape="circle" />
      <div style={{ display: 'grid', gap: 'var(--medo-space-4)', flex: 1 }}>
        <Skeleton width="40%" />
        <Skeleton lines={3} />
        <Skeleton shape="rect" />
      </div>
    </div>
  ),
};

export const LightAndDark: Story = {
  name: 'Light and Dark',
  parameters: { layout: 'fullscreen' },
  decorators: [],
  render: () => (
    <LightDark>
      <div style={row}>
        <Spinner tone="brand" />
        <Spinner tone="neutral" />
      </div>
      <ProgressBar label="Uploading 3 files" value={64} description="2 of 3 files · about 12 s left" />
      <ProgressBar label="Upload failed" value={64} status="error" description="Connection lost. Try again." />
      <div aria-busy="true" style={{ display: 'grid', gap: 'var(--medo-space-2)' }}>
        <Skeleton lines={2} />
      </div>
    </LightDark>
  ),
};
