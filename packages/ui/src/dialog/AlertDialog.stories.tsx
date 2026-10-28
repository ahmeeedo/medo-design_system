import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor, within } from 'storybook/test';
import { AlertDialog, DialogTrigger, type AlertDialogTone } from './Dialog';
import { Button } from '../button/Button';
import { interactionTest, row, semantic } from '../story-helpers';

/** Examples per tone. */
const examples: Record<AlertDialogTone, { trigger: string; title: string; text: string; action: string; cancel: string }> = {
  danger: {
    trigger: 'Delete file',
    title: 'Delete Q3-Report.pdf?',
    text: 'The file will be deleted for everyone in this workspace. This cannot be undone.',
    action: 'Delete',
    cancel: 'Cancel',
  },
  warning: {
    trigger: 'Leave form',
    title: 'Discard changes?',
    text: 'Your changes to “Invite member” will be lost.',
    action: 'Discard',
    cancel: 'Keep editing',
  },
  info: {
    trigger: 'Session timeout',
    title: 'Stay signed in?',
    text: 'You will be signed out in 2 minutes because you have been inactive.',
    action: 'Stay signed in',
    cancel: 'Sign out',
  },
};

const meta = {
  title: 'Components/Overlays/Alert Dialog',
  component: AlertDialog,
  tags: ['autodocs'],
  args: {
    tone: 'danger',
    title: examples.danger.title,
    children: examples.danger.text,
    actionLabel: examples.danger.action,
    cancelLabel: examples.danger.cancel,
    onAction: fn(),
    onOpenChange: fn(),
  },
  argTypes: {
    tone: { control: 'inline-radio', options: ['danger', 'warning', 'info'] },
    title: { control: 'text' },
    children: { control: 'text', description: 'The consequence.' },
    actionLabel: { control: 'text' },
    cancelLabel: { control: 'text' },
    onAction: { control: false },
    isOpen: { control: false },
    onOpenChange: { control: false },
    className: semantic,
  },
  parameters: {
    medo: {
      subtitle: 'A decision that needs an answer before the user can go on.',
      usage: {
        when: [
          'Confirm a destructive or irreversible action: delete, leave without saving.',
          'A warning that needs a decision before the user can go on.',
        ],
        whenNot: [
          'A task with fields: use a Dialog.',
          'Information without a decision: use an Alert or a Toast.',
          'An action that can be undone: do it and offer Undo in a Toast.',
        ],
        do: [
          'Ask a question in the title: “Delete Q3-Report.pdf?”.',
          'Name the consequence in the description.',
          'Name the action button with the verb: “Delete”, not “OK”.',
          'Use `tone="danger"` only for destructive actions.',
        ],
        dont: ['Use it for routine confirmations; people stop reading them.', 'Add a close button: the user decides with the buttons.'],
      },
      a11y: {
        keyboard: [
          ['Tab / Shift + Tab', 'Moves between the buttons. The focus stays inside.'],
          ['Esc', 'Cancels.'],
          ['Enter / Space', 'Runs the focused button.'],
        ],
        notes: [
          'Role `alertdialog`: title and description are read when it opens.',
          'Focus starts on Cancel, so an accidental Enter never deletes, and returns to the trigger.',
          'A click on the scrim never closes it.',
          'The icon shows the tone and is hidden from screen readers.',
        ],
      },
      styling: {
        classes: [
          ['medo-dialog medo-alert-dialog', 'The window.'],
          ['medo-alert-dialog--{tone}', '`danger`, `warning` or `info`.'],
          ['medo-alert-dialog__icon', 'Tone icon.'],
          ['medo-alert-dialog__title, __description', 'Question and consequence.'],
          ['medo-dialog__footer', 'Cancel and action.'],
        ],
        states: ['data-entering', 'data-exiting'],
      },
    },
    docs: {
      description: {
        component:
          'Built on React Aria Modal + Dialog with role `alertdialog`. The icon shows the tone (decorative), the title asks a question, the description names the consequence, the action button names the verb. ' +
          'No X: the user decides with the buttons. A click on the scrim never closes, Esc = Cancel. Focus starts on Cancel, so an accidental Enter never deletes, and returns to the trigger. ' +
          'Danger uses a danger button, Warning and Info a primary one. Below 640 px the icon moves on top and the buttons stack (main action on top). ' +
          'The only dialog allowed on top of a Dialog (e.g. “Discard changes?”). Styles: `medo-alert-dialog`, `medo-alert-dialog--{danger|warning|info}`.',
      },
    },
  },
  render: (args) => (
    <DialogTrigger>
      <Button variant={args.tone === 'danger' ? 'danger' : 'secondary'}>{examples[args.tone ?? 'danger'].trigger}</Button>
      <AlertDialog {...args} />
    </DialogTrigger>
  ),
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: { docs: { description: { story: 'Open the Alert dialog to see the changes from the controls. The Actions panel shows the action.' } } },
};

export const Tones: Story = {
  parameters: { docs: { description: { story: 'Danger: irreversible or destructive. Warning: risk of data loss. Info: must be acknowledged.' } } },
  render: () => (
    <div style={row}>
      {(Object.keys(examples) as AlertDialogTone[]).map((tone) => {
        const e = examples[tone];
        return (
          <DialogTrigger key={tone}>
            <Button variant="secondary">{e.trigger}</Button>
            <AlertDialog tone={tone} title={e.title} actionLabel={e.action} cancelLabel={e.cancel}>
              {e.text}
            </AlertDialog>
          </DialogTrigger>
        );
      })}
    </div>
  ),
};

export const Pending: Story = {
  name: 'Pending',
  parameters: { docs: { description: { story: 'When `onAction` returns a promise, the action shows the pending state; the dialog closes when it resolves.' } } },
  render: () => (
    <DialogTrigger>
      <Button variant="danger">Delete file</Button>
      <AlertDialog title={examples.danger.title} actionLabel="Delete" onAction={() => new Promise((resolve) => setTimeout(resolve, 1500))}>
        {examples.danger.text}
      </AlertDialog>
    </DialogTrigger>
  ),
};

export const InteractionTest: Story = {
  ...interactionTest,
  play: async ({ canvas, userEvent, args }) => {
    const trigger = canvas.getByRole('button', { name: 'Delete file' });
    await userEvent.click(trigger);
    const dialog = await within(document.body).findByRole('alertdialog');
    // Focus starts on Cancel, so an accidental Enter never deletes.
    await waitFor(() => expect(within(dialog).getByRole('button', { name: 'Cancel' })).toHaveFocus());
    // Esc = Cancel: closes without the action, focus returns to the trigger.
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(within(document.body).queryByRole('alertdialog')).toBeNull());
    await expect(args.onAction).not.toHaveBeenCalled();
    await expect(trigger).toHaveFocus();
    // The action button runs the action and closes.
    await userEvent.click(trigger);
    await userEvent.click(await within(document.body).findByRole('button', { name: 'Delete' }));
    await expect(args.onAction).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(within(document.body).queryByRole('alertdialog')).toBeNull());
  },
};
