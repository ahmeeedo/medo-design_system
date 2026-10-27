import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert, type AlertTone } from './Alert';
import { Button } from '../button/Button';
import { expect, fn, waitFor } from 'storybook/test';
import { interactionTest, semantic, slot } from '../story-helpers';

const examples: { tone: AlertTone; title: string; text: string }[] = [
  { tone: 'info', title: 'New export format', text: 'You can now export reports as CSV.' },
  { tone: 'success', title: 'Profile updated', text: 'Your changes are visible to your team.' },
  { tone: 'warning', title: 'Your trial ends in 3 days', text: 'Choose a plan to keep your projects.' },
  { tone: 'danger', title: 'Payment failed', text: 'Check your card details and try again.' },
];

const stack: React.CSSProperties = { display: 'grid', gap: 'var(--medo-space-4)', maxInlineSize: '36rem' };

function DismissDemo() {
  const [open, setOpen] = useState(true);
  return open ? (
    <Alert tone="info" title="New export format" onDismiss={() => setOpen(false)}>
      You can now export reports as CSV.
    </Alert>
  ) : (
    <Button variant="secondary" size="sm" onPress={() => setOpen(true)}>
      Show alert again
    </Button>
  );
}

const meta = {
  title: 'Components/Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: { tone: 'info', variant: 'inline', actions: 'none', title: 'New export format', children: 'You can now export reports as CSV.' },
  argTypes: {
    title: { control: 'text' },
    children: { control: 'text' },
    tone: { control: 'inline-radio', options: ['info', 'success', 'warning', 'danger'] },
    variant: { control: 'inline-radio', options: ['inline', 'banner'] },
    actions: slot({
      none: undefined,
      one: <Button variant="text" size="sm">Learn more</Button>,
      two: (
        <>
          <Button variant="text" size="sm">Choose a plan</Button>
          <Button variant="text" size="sm">Remind me later</Button>
        </>
      ),
    }),
    onDismiss: { ...slot({ none: undefined, 'close button': fn() }), description: 'Shows the close button. Called when it is pressed.' },
    dismissLabel: semantic,
    announce: semantic,
  },
  parameters: {
    medo: { subtitle: 'A persistent message inside the page. Stays until the cause is gone or it is dismissed.' },
    docs: {
      description: {
        component:
          'Every alert has a title, an icon and a tone; colour is never the only signal. Short-lived feedback after an action is a Toast. ' +
          'Set `announce` when the alert appears after the page has loaded. Styles: `medo-alert medo-alert--info`, `medo-alert--banner`.',
      },
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  render: () => (
    <div style={stack}>
      {examples.map((e) => (
        <Alert key={e.tone} tone={e.tone} title={e.title}>
          {e.text}
        </Alert>
      ))}
    </div>
  ),
};

export const WithActions: Story = {
  name: 'With actions',
  parameters: { docs: { description: { story: 'At most two text buttons, the main one first.' } } },
  render: () => (
    <div style={stack}>
      <Alert
        tone="warning"
        title="Your trial ends in 3 days"
        actions={
          <>
            <Button variant="text" size="sm">
              Choose a plan
            </Button>
            <Button variant="text" size="sm">
              Remind me later
            </Button>
          </>
        }
      >
        Choose a plan to keep your projects.
      </Alert>
      <Alert tone="info" title="A new version is available" />
    </div>
  ),
};

export const Dismissible: Story = {
  parameters: { docs: { description: { story: 'Only when it is safe to hide the message. Danger alerts usually stay until the problem is solved.' } } },
  render: () => <DismissDemo />,
};

export const Banner: Story = {
  parameters: {
    layout: 'fullscreen',
    docs: { description: { story: 'Full width above the app header, for states that affect the whole app (maintenance, offline). One at a time.' } },
  },
  render: () => (
    <div style={{ display: 'grid' }}>
      <Alert variant="banner" tone="warning" title="Scheduled maintenance on Sunday, 2–4 am." actions={<Button variant="text" size="sm">Details</Button>} />
      <Alert variant="banner" tone="danger" title="You are offline. Changes are saved when you reconnect." />
    </div>
  ),
};

export const InteractionTest: Story = {
  ...interactionTest,
  render: () => <DismissDemo />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Dismiss' }));
    await expect(canvas.queryByText('New export format')).toBeNull();
    await userEvent.click(canvas.getByRole('button', { name: 'Show alert again' }));
    // It fades in (motion) – wait until it is fully visible.
    await waitFor(() => expect(canvas.getByText('New export format')).toBeVisible());
  },
};
