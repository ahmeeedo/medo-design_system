import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileText } from 'lucide-react';
import { ProgressBar, Skeleton, Spinner } from './Progress';
import { Button } from '../button/Button';
import { row } from '../story-helpers';

const meta = {
  title: 'Components/Feedback/Progress',
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
    medo: {
      subtitle: 'Show that something is happening – and, when possible, how long it will take.',
      usage: {
        when: [
          'Spinner: a short wait inside a button or a small area.',
          'Skeleton: while content loads, in its final shape.',
          'Progress bar: long or measurable work like uploads and exports.',
        ],
        whenNot: ['Waits under 300 ms: show nothing.', 'A whole page that blocks: show the Skeleton of the page instead of a full-screen spinner.'],
        do: [
          'Name what is loading: `aria-label="Loading invoices"`.',
          'Show the percentage when it is known.',
          'Set `aria-busy="true"` on the region that loads.',
        ],
        dont: ['Show several spinners at once.', 'Animate a progress bar that never moves.'],
      },
      a11y: {
        notes: [
          'Spinner and progress bar are a `progressbar` with a name; the bar also has its value.',
          'Skeletons are hidden from screen readers.',
          'Reduced motion: a slower spinner, a static skeleton and segment.',
        ],
      },
      styling: {
        classes: [
          ['medo-spinner medo-spinner--{size}', 'Spinner; `sm` to `xl`.'],
          ['medo-spinner--{tone}', '`brand`, `neutral`, `on-brand`.'],
          ['medo-progress', 'Progress bar; `--sm`.'],
          ['medo-progress--{state}', '`success`, `error`, `indeterminate`.'],
          ['medo-progress__header, __track, __fill, __description', 'Parts of the bar.'],
          ['medo-skeleton', 'Placeholder; `--circle`, `--rect`.'],
        ],
      },
    },
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
    docs: { description: { story: 'Uses the text colour of its parent. In a button use `isPending`: the spinner replaces the icon, the label says what happens (“Saving…”).' } },
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
