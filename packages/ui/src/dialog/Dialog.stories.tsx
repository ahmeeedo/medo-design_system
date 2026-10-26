import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor, within } from 'storybook/test';
import { Dialog, DialogTrigger } from './Dialog';
import { Button } from '../button/Button';
import { TextField } from '../text-field/TextField';
import { Select } from '../select/Select';
import { Option } from '../listbox/ListBox';
import { interactionTest, row, semantic, slot } from '../story-helpers';

const roles = [
  { id: 'viewer', name: 'Viewer' },
  { id: 'editor', name: 'Editor' },
  { id: 'admin', name: 'Admin' },
];

const form: React.CSSProperties = { display: 'grid', gap: 'var(--medo-space-4)' };

/** The Figma example „Invite member“: the form submits through the main action (form id). */
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
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
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
    isDirty: { control: 'boolean', description: 'Unsaved input: X, Esc and Cancel ask „Discard changes?“, the scrim no longer closes.' },
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
    medo: { code: 'C19', subtitle: 'A modal window for a focused task. The page behind is blocked until it closes.', figma: '203:236' },
    docs: {
      description: {
        component:
          'Built on React Aria ModalOverlay + Modal + Dialog: the title names the dialog, focus starts in the first field (else the first button), stays inside and returns to the trigger; the page does not scroll. ' +
          'Only the body scrolls – header and footer then get dividers. The main action sits at the end of the footer (Button group); `primaryAction.form` submits a form, a promise from `onAction` shows the pending state. ' +
          '`isDirty` protects input: the scrim no longer closes, X, Esc and Cancel ask „Discard changes?“. ' +
          'Below 640 px forms open fullscreen (Cancel · title · action), short content as Bottom Sheet (`mobile="sheet"`). One task per dialog, never a dialog on a dialog (only an Alert dialog). ' +
          'Styles: `medo-dialog-overlay`, `medo-dialog`, `medo-dialog--{sm|md|lg|fullscreen}`, `medo-dialog__header`, `medo-dialog__body`, `medo-dialog__footer`.',
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
            <p style={{ margin: 0 }}>All files, members and settings of „Website relaunch“ will be removed. This cannot be undone.</p>
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
          'Type an email, then press Cancel, X or Esc: „Discard changes?“ asks first. Keep editing returns to the form, Discard closes. ' +
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
  name: 'Saving (pending)',
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

export const Mobile: Story = {
  name: 'Mobile (below 640 px)',
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
  play: async ({ canvas, userEvent, args }) => {
    const trigger = canvas.getByRole('button', { name: 'Invite member' });
    await userEvent.click(trigger);
    const body = within(document.body);
    const dialog = await body.findByRole('dialog', { name: 'Invite member' });
    // Focus moves into the dialog and stays there.
    await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement));
    // Esc closes it and focus returns to the trigger.
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
    await expect(trigger).toHaveFocus();
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
  },
};
