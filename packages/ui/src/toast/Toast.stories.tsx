import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor, within } from 'storybook/test';
import { ToastRegion, toast, type ToastAction } from './Toast';
import { Button } from '../button/Button';
import { interactionTest, row, slot } from '../story-helpers';

interface ToastArgs {
  /** The result in one line, max about 50 characters (“Q3-Report.pdf deleted”). */
  message: string;
  /** Max one action: “Undo”, “View” or “Retry”. With an action the toast stays 8 s instead of 5 s. */
  action?: ToastAction;
  /** Errors: stays until closed. */
  persistent: boolean;
  onClose: () => void;
}

const onAction = fn();

const meta = {
  title: 'Components/Feedback/Toast',
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
    medo: {
      subtitle: 'Short, temporary feedback after an action. It floats above the page and disappears on its own.',
      usage: {
        when: ['Short feedback after an action: saved, sent, deleted.', 'An Undo for an action that was done right away.'],
        whenNot: [
          'Information users must read or keep: use an Alert.',
          'Errors of a form: show them at the fields.',
          'A decision: use an Alert Dialog.',
        ],
        do: [
          'Render `<ToastRegion />` once at the root and call `toast()` from anywhere.',
          'Write one short sentence; one action at most.',
          'Use `persistent` for errors that need attention.',
        ],
        dont: [
          'Put the only copy of important information into a toast.',
          'Show a toast on page load.',
          'Add icons or tones; that is what Alerts are for.',
        ],
      },
      a11y: {
        keyboard: [
          ['F6', 'Moves the focus into the toast region.'],
          ['Tab', 'Moves to the action and the close button.'],
          ['Esc', 'Closes the focused toast.'],
        ],
        notes: [
          'The region is a landmark; new toasts are announced.',
          'Timers pause on hover, on focus and while the window is hidden (WCAG 2.2.1).',
          '5 s, with an action 8 s; `persistent` stays until closed.',
          'Max 3 at a time; the same message is not shown twice.',
        ],
      },
      styling: {
        classes: [
          ['medo-toast-region', 'Region; bottom right on desktop, full width on mobile.'],
          ['medo-toast', 'One toast.'],
          ['medo-toast__content, __message', 'Message.'],
          ['medo-toast__button, __action, __close', 'Action and close button.'],
        ],
        states: ['data-hovered', 'data-pressed', 'data-focus-visible'],
      },
    },
    docs: {
      description: {
        component:
          'Use a toast for short, temporary feedback after an action. Render `<ToastRegion />` once at the root of your app, then call `toast(message, { action, persistent })` from anywhere.',
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
  name: 'Errors',
  parameters: {
    docs: {
      description: { story: 'An error stays until the user closes it and offers “Retry”. If the user must read it to continue, use an Alert or Alert dialog instead.' },
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
