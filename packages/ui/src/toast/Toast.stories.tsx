import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor, within } from 'storybook/test';
import { ToastRegion, toast, type ToastAction } from './Toast';
import { Button } from '../button/Button';
import { interactionTest, row, slot } from '../story-helpers';

interface ToastArgs {
  /** The result in one line, max about 50 characters („Q3-Report.pdf deleted“). */
  message: string;
  /** Max one action: „Undo“, „View“ or „Retry“. With an action the toast stays 8 s instead of 5 s. */
  action?: ToastAction;
  /** Errors: stays until closed. */
  persistent: boolean;
  onClose: () => void;
}

const onAction = fn();

const meta = {
  title: 'Components/Toast',
  tags: ['autodocs'],
  args: { message: 'Q3-Report.pdf deleted', action: 'Undo' as never, persistent: false, onClose: fn() },
  argTypes: {
    message: { control: 'text' },
    action: slot({
      none: undefined,
      Undo: { label: 'Undo', onAction },
      View: { label: 'View', onAction },
      Retry: { label: 'Retry', onAction },
    }),
    persistent: { control: 'boolean' },
    onClose: { control: false },
  },
  parameters: {
    medo: { subtitle: 'Short, temporary feedback after an action. It floats above the page and disappears on its own.' },
    docs: {
      description: {
        component:
          'Render `<ToastRegion />` once at the root of the app, then call `toast(message, { action, persistent })` from anywhere – also outside components, e.g. after an API call. ' +
          'Built on React Aria Toast: the region is a landmark (F6 moves focus into it), new toasts are announced, Esc closes the focused toast. ' +
          'Timing: 5 s, with an action 8 s, `persistent` (errors) until closed. Hover, focus and a hidden window pause the timers (WCAG 2.2.1). ' +
          'Max 3, newest at the edge; the same message is not shown twice. Desktop bottom right, mobile full width (`--medo-toast-offset` for a bottom navigation). ' +
          'Inverted surface, no icon, no tone – messages with a tone belong in an Alert. Never put information only in a toast. ' +
          'Styles: `medo-toast-region`, `medo-toast`, `medo-toast__action`, `medo-toast__close`.',
      },
    },
  },
  render: (args) => (
    <>
      <Button onPress={() => toast(args.message, { action: args.action, persistent: args.persistent, onClose: args.onClose })}>Show toast</Button>
      <ToastRegion />
    </>
  ),
} satisfies Meta<ToastArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: { docs: { description: { story: 'Press the button to show the toast from the controls. The Actions panel shows the action and when the toast closes.' } } },
};

export const Examples: Story = {
  name: 'Typical messages',
  parameters: {
    docs: {
      description: {
        story:
          'Write the result, not the process. Result + Undo for reversible actions (prefer it to asking first), a short confirmation, a link to the result. ' +
          'Press several: max 3 are visible, older ones move up.',
      },
    },
  },
  render: () => (
    <>
      <div style={row}>
        <Button variant="secondary" onPress={() => toast('Q3-Report.pdf deleted', { action: { label: 'Undo', onAction } })}>
          Delete file
        </Button>
        <Button variant="secondary" onPress={() => toast('Changes saved')}>
          Save
        </Button>
        <Button variant="secondary" onPress={() => toast('3 members invited', { action: { label: 'View', onAction } })}>
          Invite members
        </Button>
        <Button variant="secondary" onPress={() => toast('Link copied')}>
          Copy link
        </Button>
      </div>
      <ToastRegion />
    </>
  ),
};

export const Error: Story = {
  name: 'Error (until closed)',
  parameters: {
    docs: {
      description: { story: 'An error stays until the user closes it and offers „Retry“. If the user must read it to continue, use an Alert or Alert dialog instead.' },
    },
  },
  render: () => (
    <>
      <Button variant="secondary" onPress={() => toast('Could not save changes', { persistent: true, action: { label: 'Retry', onAction } })}>
        Save (fails)
      </Button>
      <ToastRegion />
    </>
  ),
};

export const InteractionTest: Story = {
  ...interactionTest,
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Show toast' }));
    const body = within(document.body);
    await body.findByText('Q3-Report.pdf deleted');
    // The action closes the toast.
    await userEvent.click(body.getByRole('button', { name: 'Undo' }));
    await waitFor(() => expect(body.queryByText('Q3-Report.pdf deleted')).toBeNull());
    await expect(args.onClose).toHaveBeenCalled();
  },
};
