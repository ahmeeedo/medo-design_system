import type { Meta, StoryObj } from '@storybook/react-vite';
import { composeStories } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import { overflowsHorizontally, resizeViewport } from '../../../../packages/ui/src/story-helpers';
import * as FormStories from '../patterns/Form.stories';
import * as ComboboxStories from '../../../../packages/ui/src/combobox/Combobox.stories';
import * as TableStories from '../../../../packages/ui/src/table/Table.stories';
import { Button, Dialog as MedoDialog, DialogTrigger, TextField } from '@med-o/ui';
import { AccountApp } from '../patterns/account/AccountApp';

/**
 * Responsive test group: a few reference components at the widths that matter – the smallest phone (320), a common
 * phone (390), just below and above the breakpoints 640 and 1024, and desktop (1280). Plus what users do: rotate
 * or resize while something is open or filtered. Tests only – hidden from the sidebar (`!dev`).
 */
const meta = {
  title: 'Tests/Responsive',
  tags: ['!dev', '!autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const WIDTHS = [320, 390, 639, 641, 1023, 1025, 1280];
// Stories of other files as components (args, decorators and render of their meta included).
const compose = (stories: unknown) => composeStories(stories as Parameters<typeof composeStories>[0]) as Record<string, () => React.JSX.Element>;
const { ContactForm } = compose(FormStories);
const { Playground: ComboboxPlayground } = compose(ComboboxStories);
const { Sortable } = compose(TableStories);

/** Every width: no sideways scrolling of the page. */
async function noOverflowAtEveryWidth() {
  for (const width of WIDTHS) {
    if (!(await resizeViewport(width))) return; // in Storybook: nothing to resize
    await waitFor(() => expect(overflowsHorizontally(), `page scrolls sideways at ${width} px`).toBe(false));
  }
}

export const Form: Story = {
  render: () => <ContactForm />,
  play: noOverflowAtEveryWidth,
};

export const Table: Story = {
  // A wide table scrolls inside its own frame, never the page.
  render: () => <Sortable />,
  play: noOverflowAtEveryWidth,
};

export const Account: Story = {
  render: () => <AccountApp start="orders" />,
  play: async ({ canvas, userEvent }) => {
    await noOverflowAtEveryWidth();
    if (!(await resizeViewport(1280))) return;
    // Desktop: side navigation (its “Dashboard” link; the phone tab bar says “Home”). A filter is set …
    await expect(canvas.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
    await userEvent.type(canvas.getByRole('searchbox', { name: 'Search orders' }), 'desk');
    const count = () => canvas.getAllByRole('status').find((el) => /orders?$/.test(el.textContent ?? ''))?.textContent;
    await waitFor(() => expect(count()).not.toBe('28 orders'));
    const filtered = count();
    // … and survives the switch to the phone layout and back: same search, same result count.
    await resizeViewport(390);
    await waitFor(() => expect(canvas.queryByRole('link', { name: 'Dashboard' })).toBeNull());
    await expect(canvas.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    await expect(canvas.getByRole('searchbox', { name: 'Search orders' })).toHaveValue('desk');
    await waitFor(() => expect(count()).toBe(filtered));
    await resizeViewport(1280);
    await expect(canvas.getByRole('searchbox', { name: 'Search orders' })).toHaveValue('desk');
    await waitFor(() => expect(count()).toBe(filtered));
  },
};

export const Combobox: Story = {
  render: () => (
    <div style={{ padding: 'var(--medo-layout-margin)' }}>
      <ComboboxPlayground />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    await noOverflowAtEveryWidth();
    const body = within(document.body);
    // Just below 640: Bottom Sheet (a dialog with its own search).
    if (!(await resizeViewport(639))) return;
    await userEvent.click(canvas.getByRole('button', { name: /Assignee/ }));
    await expect(await body.findByRole('dialog')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
    // Just above 640: popover list under the field.
    await resizeViewport(641);
    const input = await canvas.findByRole('combobox', { name: /Assignee/ });
    await userEvent.clear(input);
    await userEvent.type(input, 'fisch');
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(input).toHaveValue('Fiona Fischer');
    // The chosen value survives the switch to the phone layout and back.
    await resizeViewport(390);
    await expect(await canvas.findByRole('button', { name: /Fiona Fischer/ })).toBeInTheDocument();
    await resizeViewport(1280);
    await expect(await canvas.findByRole('combobox', { name: /Assignee/ })).toHaveValue('Fiona Fischer');
  },
};

export const Dialog: Story = {
  render: () => (
    <div style={{ padding: 'var(--medo-layout-margin)' }}>
      <DialogTrigger>
        <Button>Invite member</Button>
        <MedoDialog title="Invite member" primaryAction={{ label: 'Send invite', form: 'responsive-invite' }}>
          <form id="responsive-invite" onSubmit={(e) => e.preventDefault()}>
            <TextField label="Email" type="email" isRequired />
          </form>
        </MedoDialog>
      </DialogTrigger>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    if (!(await resizeViewport(1280))) return;
    await userEvent.click(canvas.getByRole('button', { name: 'Invite member' }));
    const body = within(document.body);
    const dialog = await body.findByRole('dialog', { name: 'Invite member' });
    const field = await within(dialog).findByRole('textbox', { name: /Email/ });
    await userEvent.type(field, 'anna@example.com');
    await expect(field).toHaveValue('anna@example.com');
    // Rotate to a phone and back: the dialog stays open, keeps the input and the focus, never scrolls sideways.
    for (const width of [390, 320, 1280]) {
      await resizeViewport(width);
      const current = await body.findByRole('dialog', { name: 'Invite member' });
      await expect(await within(current).findByRole('textbox', { name: /Email/ })).toHaveValue('anna@example.com');
      await waitFor(() => expect(current).toContainElement(document.activeElement as HTMLElement));
      await waitFor(() => expect(overflowsHorizontally(), `page scrolls sideways at ${width} px`).toBe(false));
    }
  },
};
