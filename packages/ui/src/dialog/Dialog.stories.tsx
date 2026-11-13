import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor, within } from 'storybook/test';
import { Dialog, DialogTrigger } from './Dialog';
import { Button } from '../button/Button';
import { TextField } from '../text-field/TextField';
import { Select } from '../select/Select';
import { Option } from '../listbox/ListBox';
import { interactionTest, overlaysSettled, row, semantic, slot } from '../story-helpers';
import { ToastRegion } from '../toast/Toast';
import { FieldErrors } from '../form/Form';

const roles = [
  { id: 'viewer', name: 'Viewer' },
  { id: 'editor', name: 'Editor' },
  { id: 'admin', name: 'Admin' },
];

const form: React.CSSProperties = { display: 'grid', gap: 'var(--medo-layout-gap-fields)' };

/** Example “Invite member”: the form submits through the main action (form id). */
function InviteForm({ close, onChange }: { close: () => void; onChange?: (dirty: boolean) => void }) {
  return (
    <form
      id="invite-form"
      style={form}
      onSubmit={(e) => {
        e.preventDefault();
        close();
      }}
    >
      <TextField
        label="Email"
        type="email"
        isRequired
        placeholder="name@company.com"
        description="We send an invite link to this address."
        onChange={(v) => onChange?.(v !== '')}
      />
      <Select label="Role" items={roles} defaultValue="viewer">
        {(item) => <Option id={item.id}>{item.name}</Option>}
      </Select>
    </form>
  );
}

const paragraph: React.CSSProperties = { margin: '0 0 var(--medo-space-3)', color: 'var(--medo-color-text-primary)' };

const meta = {
  title: 'Components/Overlays/Dialog',
  component: Dialog,
  tags: ['autodocs', 'status:beta'],
  args: {
    title: 'Invite member',
    description: 'New members get access to all projects in this workspace.',
    size: 'md',
    overlay: 'dialog',
    showClose: true,
    isDirty: false,
    primaryAction: 'Send invite' as never,
    cancelLabel: 'Cancel',
    onOpenChange: fn(),
  },
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    overlay: {
      control: 'inline-radio',
      options: ['auto', 'dialog', 'fullscreen', 'sheet'],
      description: 'auto: dialog on desktop, `mobile` below 640 px. Here forced to show each pattern.',
    },
    showClose: { control: 'boolean' },
    isDirty: { control: 'boolean', description: 'Unsaved input: X, Esc and Cancel ask “Discard changes?”, the scrim no longer closes.' },
    primaryAction: slot({
      none: undefined,
      'Send invite': { label: 'Send invite', form: 'invite-form' },
      'Delete project': { label: 'Delete project', variant: 'danger' },
    }),
    cancelLabel: { control: 'text' },
    mobile: { control: false, description: 'Pattern below 640 px: fullscreen (forms) or sheet (short content).' },
    closeLabel: semantic,
    discardText: semantic,
    children: { control: false },
    isOpen: { control: false },
    onOpenChange: { control: false },
  },
  parameters: {
    medo: {
      figma: '201:26',
      subtitle: 'A modal window for a focused task. The page behind is blocked until it closes.',
      usage: {
        when: ['A short task that needs full attention: a small form, settings for one item.', 'Details the user must check before an action.'],
        whenNot: [
          'A yes or no about a consequence: use an Alert Dialog.',
          'Long or multi-step content: use a page or a Drawer.',
          'Feedback that should not interrupt: use a Toast or an Alert.',
          'A hint next to a control: use a Popover.',
        ],
        do: [
          'One task per dialog, with a title that names it.',
          'Put the main action at the end of the footer and name it with a verb.',
          'Set `isDirty` once the user has typed something, so closing asks “Discard changes?”.',
          'Submit a form with `primaryAction.form`; return a promise from `onAction` to show the pending state.',
          'Let people close the dialog while it saves – the saving goes on. Set `backgroundToast` with texts that name the object (“Invite sent to anna@example.com”); a failure then shows a Toast with Retry.',
          'When saving fails while the dialog is open, keep it open and show the error inside it, with the input kept.',
          'Reject with `FieldErrors` when the server finds a problem in the input: the message shows at the field – also after the dialog was closed, through “Open again” in the Toast. Keep the values in the app (controlled fields) for that.',
          'Set `primaryAction.blocking` only for actions whose result people must see before they go on (a payment, deleting many records): the dialog cannot be closed while it runs.',
          'Saving in the background: warn before the page is left while requests run (`beforeunload`, in the app).',
        ],
        dont: [
          'Open a dialog on top of a dialog. Only an Alert Dialog may open on top.',
          'Open a dialog without a user action.',
          'Put navigation or tabs into a dialog.',
        ],
      },
      a11y: {
        keyboard: [
          ['Tab / Shift + Tab', 'Moves through the dialog. The focus stays inside.'],
          ['Esc', 'Closes the dialog. With `isDirty` it asks first.'],
          ['Enter', 'In a field: submits the form.'],
        ],
        notes: [
          'The title names the dialog; the description is linked to it.',
          'Focus starts in the first field, else on the first button, and returns to the trigger when the dialog closes.',
          'The page behind does not scroll and is hidden from screen readers.',
          'Only the body scrolls; header and footer stay visible.',
          'Below 640 px forms open fullscreen, short content as a Bottom Sheet (`mobile="sheet"`).',
        ],
        // Manual test with NVDA, VoiceOver and TalkBack (Guides / Screen reader testing).
        screenReader: {
          steps: [
            ['Go to the heading “Playground”, then to the button “Invite member” and activate it.', '“Invite member, dialog”, then “New members get access to all projects in this workspace.”'],
            ['Where is the focus?', 'In the field: “Email, edit text, required”, then “We send an invite link to this address.”'],
            ['Move to the previous and next element until you leave the dialog.', 'You never leave it: only the title, the fields, Send invite, Cancel and Close. The page behind is not read.'],
            ['Activate “Send invite” with the email empty.', 'That the email is required or invalid; the focus is on the field.'],
            ['Close the dialog (Cancel, or Esc / scrub / Back).', 'The focus is back on “Invite member, button”.'],
          ],
        },
      },
      styling: {
        classes: [
          ['medo-dialog-overlay', 'Scrim behind the dialog.'],
          ['medo-dialog', 'The window.'],
          ['medo-dialog--{size}', '`sm`, `lg` or `fullscreen`. Without it: md.'],
          ['medo-dialog__header, __title, __description', 'Header with title and description.'],
          ['medo-dialog__body', 'Content; the only part that scrolls.'],
          ['medo-dialog__footer', 'Actions (a Button group).'],
        ],
        states: ['data-entering', 'data-exiting', 'data-scrolled'],
      },
    },
    docs: {
      description: {
        component: 'Use a dialog for a short, focused task like a small form. Built on React Aria Modal and Dialog.',
      },
    },
  },
  render: (args) => (
    <DialogTrigger>
      <Button>Invite member</Button>
      <Dialog {...args}>
        {(close) =>
          args.primaryAction?.form ? (
            <InviteForm close={close} />
          ) : (
            <p style={{ margin: 0 }}>All files, members and settings of “Website relaunch” will be removed. This cannot be undone.</p>
          )
        }
      </Dialog>
    </DialogTrigger>
  ),
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: { docs: { description: { story: 'Open the dialog to see the changes from the controls. Send invite submits the form (the email is required).' } } },
};

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: 'md is the default. sm for one or two fields, lg for tables or two-column forms. Never wider than the viewport minus 2 × 32 px.' } },
  },
  render: () => (
    <div style={row}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <DialogTrigger key={size}>
          <Button variant="secondary">Size {size}</Button>
          <Dialog size={size} title="Rename project" primaryAction={{ label: 'Rename', form: `rename-${size}` }}>
            {(close) => (
              <form
                id={`rename-${size}`}
                onSubmit={(e) => {
                  e.preventDefault();
                  close();
                }}
              >
                <TextField label="Name" defaultValue="Website relaunch" isRequired />
              </form>
            )}
          </Dialog>
        </DialogTrigger>
      ))}
    </div>
  ),
};

export const Scrolling: Story = {
  name: 'Long content',
  parameters: {
    docs: {
      description: {
        story: 'Max height is the viewport minus 2 × 32 px. Only the body scrolls (and is focusable for the keyboard); header and footer stay with dividers.',
      },
    },
  },
  render: () => (
    <DialogTrigger>
      <Button variant="secondary">Terms of use</Button>
      <Dialog title="Terms of use" description="Version 3 · valid from 1 November 2026" primaryAction={{ label: 'Accept terms' }}>
        {Array.from({ length: 12 }, (_, i) => (
          <p key={i} style={paragraph}>
            {i + 1}. The workspace owner decides who gets access to projects. Members can invite others only with the Admin role. Files stay in the workspace until an
            admin deletes them; deleted files can be restored for 30 days.
          </p>
        ))}
      </Dialog>
    </DialogTrigger>
  ),
};

export const UnsavedChanges: Story = {
  name: 'Unsaved changes',
  parameters: {
    docs: {
      description: {
        story:
          'Type an email, then press Cancel, X or Esc: “Discard changes?” asks first. Keep editing returns to the form, Discard closes. ' +
          'While the form has input, a click on the scrim does nothing.',
      },
    },
  },
  render: function Render() {
    const [dirty, setDirty] = useState(false);
    return (
      <DialogTrigger onOpenChange={(open) => !open && setDirty(false)}>
        <Button>Invite member</Button>
        <Dialog
          title="Invite member"
          description="New members get access to all projects in this workspace."
          isDirty={dirty}
          primaryAction={{ label: 'Send invite', form: 'invite-form' }}
        >
          {(close) => <InviteForm close={close} onChange={setDirty} />}
        </Dialog>
      </DialogTrigger>
    );
  },
};

export const AsyncAction: Story = {
  name: 'Pending',
  parameters: {
    docs: {
      description: {
        story: 'When `onAction` returns a promise, the button shows the pending state and the dialog closes when it resolves. If it rejects, the dialog stays open.',
      },
    },
  },
  render: () => (
    <DialogTrigger>
      <Button variant="secondary">Archive project</Button>
      <Dialog
        size="sm"
        title="Archive project"
        description="Archived projects are read-only. You can restore them at any time."
        primaryAction={{ label: 'Archive', onAction: () => new Promise((resolve) => setTimeout(resolve, 1500)) }}
      />
    </DialogTrigger>
  ),
};

/** The app keeps the value, so the dialog can open again with it. “taken@example.com” is already a member. */
function InviteWithServerCheck() {
  const [email, setEmail] = useState('');
  const invite = async (address: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    if (address === 'taken@example.com') throw new FieldErrors({ email: `${address} is already a member. Enter another address.` });
    setEmail('');
  };
  return (
    <>
      <DialogTrigger>
        <Button>Invite member</Button>
        <Dialog
          size="sm"
          title="Invite member"
          primaryAction={{
            label: 'Send invite',
            onAction: () => invite(email),
            backgroundToast: { success: `Invite sent to ${email}`, error: `Invite to ${email} not sent` },
          }}
        >
          <TextField label="Email" name="email" type="email" value={email} onChange={setEmail} />
        </Dialog>
      </DialogTrigger>
      <ToastRegion />
    </>
  );
}

export const ServerErrors: Story = {
  name: 'Errors from the server',
  parameters: {
    docs: {
      description: {
        story:
          'Enter “taken@example.com” and send. Stay: the message shows at the field. Or close the dialog while it saves: the Toast offers “Open again”, and the dialog opens with the address and the message. The app keeps the value (controlled field).',
      },
    },
  },
  render: () => <InviteWithServerCheck />,
};

export const Blocking: Story = {
  name: 'Blocking action',
  parameters: {
    docs: {
      description: {
        story:
          '`primaryAction.blocking`: while the action runs, Cancel and × are disabled and Esc does nothing. Only for results people must see before they go on – everything else can save in the background.',
      },
    },
  },
  render: () => (
    <DialogTrigger>
      <Button variant="secondary">Delete 240 records</Button>
      <Dialog
        size="sm"
        title="Delete 240 records"
        description="The records are removed for everyone. This takes a moment."
        primaryAction={{ label: 'Delete', variant: 'danger', blocking: true, onAction: () => new Promise((resolve) => setTimeout(resolve, 2000)) }}
      />
    </DialogTrigger>
  ),
};

export const Mobile: Story = {
  name: 'On mobile',
  parameters: {
    docs: {
      description: {
        story:
          'Below 640 px (`overlay="auto"`) a form opens fullscreen: Cancel left, title centered, main action right – the keyboard never covers the action. ' +
          'Short content uses `mobile="sheet"` and opens as a Bottom Sheet. Forced here with `overlay`.',
      },
    },
  },
  render: () => (
    <div style={row}>
      <DialogTrigger>
        <Button variant="secondary">Fullscreen (form)</Button>
        <Dialog
          overlay="fullscreen"
          title="Invite member"
          description="New members get access to all projects in this workspace."
          primaryAction={{ label: 'Send', form: 'invite-form' }}
        >
          {(close) => <InviteForm close={close} />}
        </Dialog>
      </DialogTrigger>
      <DialogTrigger>
        <Button variant="secondary">Bottom Sheet (short)</Button>
        <Dialog overlay="sheet" title="Share project" description="Everyone with the link can view the project." primaryAction={{ label: 'Copy link' }} />
      </DialogTrigger>
    </div>
  ),
};

export const InteractionTest: Story = {
  ...interactionTest,
  // Literal, so the story index (and the tag filters of the test projects) see it too.
  tags: ['!autodocs'],
  play: async ({ canvas, userEvent, args }) => {
    const trigger = canvas.getByRole('button', { name: 'Invite member' });
    await userEvent.click(trigger);
    const body = within(document.body);
    const dialog = await body.findByRole('dialog', { name: 'Invite member' });
    // Focus moves into the dialog and stays there.
    await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement));
    await overlaysSettled();
    // Esc closes it and focus returns to the trigger.
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
    // React Aria returns the focus one frame after the overlay is gone: wait for it.
    await waitFor(() => expect(trigger).toHaveFocus());
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
  },
};

export const UnsavedChangesTest: Story = {
  ...interactionTest,
  // Literal, so the story index (and the tag filters of the test projects) see it too.
  tags: ['!autodocs'],
  name: 'Interaction test: unsaved changes',
  // Same dialog as “Unsaved changes”. The whole flow: type → try to cancel → keep editing → save.
  render: UnsavedChanges.render,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Invite member' });
    await userEvent.click(trigger);
    const body = within(document.body);
    const dialog = await body.findByRole('dialog', { name: 'Invite member' });
    const email = within(dialog).getByRole('textbox', { name: /Email/ });
    await overlaysSettled();
    await userEvent.type(email, 'anna@example.com');
    // Esc does not close: it asks first.
    await userEvent.keyboard('{Escape}');
    const ask = await body.findByRole('alertdialog', { name: 'Discard changes?' });
    await overlaysSettled();
    // Keep editing: back in the form, with the input and the focus in the dialog.
    await userEvent.click(within(ask).getByRole('button', { name: 'Keep editing' }));
    await waitFor(() => expect(body.queryByRole('alertdialog')).toBeNull());
    await expect(email).toHaveValue('anna@example.com');
    await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement));
    // Save: the main action submits the form, the dialog closes without asking, the focus returns to the trigger.
    await userEvent.click(within(dialog).getByRole('button', { name: 'Send invite' }));
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
    await expect(body.queryByRole('alertdialog')).toBeNull();
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

/* ---------- Contract for a main action that saves asynchronously ---------- */

/** A fake server: every send waits until the test answers it. */
const server = {
  calls: [] as { resolve: () => void; reject: () => void }[],
  send() {
    return new Promise<void>((resolve, reject) => server.calls.push({ resolve, reject }));
  },
  answer(index: number, ok: boolean) {
    const call = server.calls[index];
    if (ok) call.resolve();
    else call.reject();
  },
};

function SavingDialog() {
  const [dirty, setDirty] = useState(false);
  return (
    <>
      <DialogTrigger onOpenChange={(open) => !open && setDirty(false)}>
        <Button>Invite member</Button>
        <Dialog
          title="Invite member"
          isDirty={dirty}
          primaryAction={{
            label: 'Send invite',
            onAction: () => server.send(),
            backgroundToast: { success: 'Invite sent to anna@example.com', error: 'Invite to anna@example.com not sent' },
          }}
        >
          <TextField label="Email" type="email" onChange={(v) => setDirty(v !== '')} />
        </Dialog>
      </DialogTrigger>
      <ToastRegion />
    </>
  );
}

export const AsyncActionTest: Story = {
  ...interactionTest,
  // Literal, so the story index (and the tag filters of the test projects) see it too.
  tags: ['!autodocs'],
  name: 'Interaction test: saving in the background',
  render: () => <SavingDialog />,
  parameters: {
    // React Aria announces the end of a pending state with a node in its live region that points to the button by
    // aria-labelledby. The dialog was closed meanwhile, so the node points nowhere for a few seconds – an artefact of
    // the announcer outside the component, not of the dialog.
    a11y: {
      config: {
        rules: [
          { id: 'landmark-unique', enabled: false },
          { id: 'role-img-alt', enabled: false },
        ],
      },
    },
  },
  play: async ({ canvas, userEvent }) => {
    server.calls = [];
    const body = within(document.body);
    const open = async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Invite member' }));
      const dialog = await body.findByRole('dialog', { name: 'Invite member' });
      await userEvent.type(within(dialog).getByRole('textbox', { name: /Email/ }), 'anna@example.com');
      return dialog;
    };
    const send = (dialog: HTMLElement) => userEvent.click(within(dialog).getByRole('button', { name: 'Send invite' }));

    // 1. Rejects while open: the dialog stays open with the input; a second press while pending is ignored.
    let dialog = await open();
    await send(dialog);
    await send(dialog);
    await expect(server.calls).toHaveLength(1);
    server.answer(0, false);
    await waitFor(() => expect(within(dialog).getByRole('button', { name: 'Send invite' })).not.toHaveAttribute('aria-disabled'));
    await expect(within(dialog).getByRole('textbox', { name: /Email/ })).toHaveValue('anna@example.com');

    // 2. Closed while saving: closes without “Discard changes?”, then the result arrives as a Toast.
    await send(dialog);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
    await expect(body.queryByRole('alertdialog')).toBeNull();
    server.answer(1, true);
    await expect(await body.findByText('Invite sent to anna@example.com')).toBeInTheDocument();

    // 3. A late result never closes a dialog opened again in the meantime.
    dialog = await open();
    await send(dialog);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
    dialog = await open();
    server.answer(2, true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    await expect(body.getByRole('dialog', { name: 'Invite member' })).toBeInTheDocument();

    // 4. Fails after closing: an error Toast that stays, with Retry – which sends again.
    await send(dialog);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
    server.answer(3, false);
    await expect(await body.findByText('Invite to anna@example.com not sent')).toBeInTheDocument();
    await userEvent.click(body.getByRole('button', { name: 'Retry' }));
    await waitFor(() => expect(server.calls).toHaveLength(5));
    server.answer(4, true);
    await expect(await body.findByText('Invite sent to anna@example.com')).toBeInTheDocument();
  },
};

/** Like “Errors from the server”, but the test answers each send. */
const checks = {
  calls: [] as { resolve: () => void; reject: (error: unknown) => void }[],
  send() {
    return new Promise<void>((resolve, reject) => checks.calls.push({ resolve, reject }));
  },
};

function CheckedInvite({ blocking = false }: { blocking?: boolean }) {
  const [email, setEmail] = useState('');
  return (
    <>
      <DialogTrigger>
        <Button>Invite member</Button>
        <Dialog
          title="Invite member"
          primaryAction={{
            label: 'Send invite',
            blocking,
            onAction: () => checks.send(),
            backgroundToast: { success: `Invite sent to ${email}`, error: `Invite to ${email} not sent` },
          }}
        >
          <TextField label="Email" name="email" type="email" value={email} onChange={setEmail} />
        </Dialog>
      </DialogTrigger>
      <ToastRegion />
    </>
  );
}

const taken = (address: string) => new FieldErrors({ email: `${address} is already a member. Enter another address.` });

export const ServerErrorsTest: Story = {
  ...interactionTest,
  // Literal, so the story index (and the tag filters of the test projects) see it too.
  tags: ['!autodocs'],
  name: 'Interaction test: errors from the server',
  render: () => <CheckedInvite />,
  parameters: AsyncActionTest.parameters,
  play: async ({ canvas, userEvent }) => {
    checks.calls = [];
    const body = within(document.body);
    const field = () => body.getByRole('textbox', { name: /Email/ });
    const send = () => userEvent.click(body.getByRole('button', { name: 'Send invite' }));

    // 1. Closed while saving, the server refuses the address: the Toast offers “Open again”, not Retry.
    await userEvent.click(canvas.getByRole('button', { name: 'Invite member' }));
    await userEvent.type(await body.findByRole('textbox', { name: /Email/ }), 'taken@example.com');
    await send();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
    checks.calls[0].reject(taken('taken@example.com'));
    await expect(await body.findByText('Invite to taken@example.com not sent')).toBeInTheDocument();
    await expect(body.queryByRole('button', { name: 'Retry' })).toBeNull();

    // 2. Open again: the dialog with the address, the message at the field, the focus there.
    await userEvent.click(body.getByRole('button', { name: 'Open again' }));
    await body.findByRole('dialog', { name: 'Invite member' });
    await expect(field()).toHaveValue('taken@example.com');
    await expect(body.getByText('taken@example.com is already a member. Enter another address.')).toBeInTheDocument();
    await waitFor(() => expect(field()).toHaveFocus());

    // 3. Refused while open: the dialog stays, the new message at the field.
    await userEvent.clear(field());
    await userEvent.type(field(), 'anna@example.com');
    await userEvent.tab();
    await expect(body.queryByText(/is already a member/)).toBeNull();
    await send();
    checks.calls[1].reject(taken('anna@example.com'));
    await expect(await body.findByText('anna@example.com is already a member. Enter another address.')).toBeInTheDocument();
    await waitFor(() => expect(field()).toHaveFocus());

    // 4. Closed and opened normally: no old message.
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
    await userEvent.click(canvas.getByRole('button', { name: 'Invite member' }));
    await body.findByRole('dialog', { name: 'Invite member' });
    await expect(body.queryByText(/is already a member/)).toBeNull();
  },
};

export const BlockingTest: Story = {
  ...interactionTest,
  // Literal, so the story index (and the tag filters of the test projects) see it too.
  tags: ['!autodocs'],
  name: 'Interaction test: blocking action',
  render: () => <CheckedInvite blocking />,
  parameters: AsyncActionTest.parameters,
  play: async ({ canvas, userEvent }) => {
    checks.calls = [];
    const body = within(document.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Invite member' }));
    const dialog = await body.findByRole('dialog', { name: 'Invite member' });
    await userEvent.type(within(dialog).getByRole('textbox', { name: /Email/ }), 'anna@example.com');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Send invite' }));
    // While it runs: Esc does nothing, Cancel and × are disabled.
    await userEvent.keyboard('{Escape}');
    await expect(body.getByRole('dialog', { name: 'Invite member' })).toBeInTheDocument();
    await expect(within(dialog).getByRole('button', { name: 'Cancel' })).toBeDisabled();
    await expect(within(dialog).getByRole('button', { name: 'Close' })).toBeDisabled();
    // Done: it closes.
    checks.calls[0].resolve();
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
  },
};
