import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import { ChevronDown, Filter } from 'lucide-react';
import { Popover, PopoverTrigger, Toggletip } from './Popover';
import { Button } from '../button/Button';
import { Checkbox, CheckboxGroup } from '../checkbox/Checkbox';
import { TextField } from '../text-field/TextField';
import { interactionTest, row, semantic, slot } from '../story-helpers';

const text: React.CSSProperties = { margin: 0, color: 'var(--medo-color-text-secondary)' };
const form: React.CSSProperties = { display: 'grid', gap: 'var(--medo-space-3)' };
const fieldRow: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 'var(--medo-space-1)', font: 'var(--medo-typography-label-md)' };

/** Filter example: applies live, no footer. */
function StatusFilter() {
  const [status, setStatus] = useState(['open', 'progress']);
  return (
    <CheckboxGroup label="Status" value={status} onChange={setStatus}>
      <Checkbox value="open">Open</Checkbox>
      <Checkbox value="progress">In progress</Checkbox>
      <Checkbox value="done">Done</Checkbox>
    </CheckboxGroup>
  );
}

/** Link form: changes must be confirmed – header + footer. */
function LinkForm({ close }: { close: () => void }) {
  return (
    <form
      id="link-form"
      style={form}
      onSubmit={(e) => {
        e.preventDefault();
        close();
      }}
    >
      <TextField label="URL" type="url" placeholder="https://" isRequired />
      <TextField label="Text to display" placeholder="Link text" />
    </form>
  );
}

const meta = {
  title: 'Components/Overlays/Popover',
  component: Popover,
  tags: ['autodocs'],
  args: { title: 'Filter', size: 'md', overlay: 'popover', primaryAction: 'none' as never, children: null, 'aria-label': 'Filter' },
  argTypes: {
    title: { control: 'text' },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'auto'] },
    overlay: { control: 'inline-radio', options: ['auto', 'popover', 'sheet'], description: 'auto: popover on desktop, Bottom Sheet below 640 px.' },
    primaryAction: slot({ none: undefined, Apply: { label: 'Apply' } }),
    placement: { control: 'select', options: ['bottom start', 'bottom end', 'top start', 'top end', 'end', 'start'] },
    cancelLabel: { control: 'text', if: { arg: 'primaryAction', truthy: true } },
    'aria-label': semantic,
    closeLabel: semantic,
    children: { control: false },
  },
  parameters: {
    medo: { subtitle: 'A small floating panel with interactive content, anchored to its trigger. The page stays usable.' },
    docs: {
      description: {
        component:
          'Built on React Aria DialogTrigger + Popover + Dialog: opens on click (never on hover), the trigger is pressed and expanded while open, focus moves in, Esc or a click outside closes it and focus returns. ' +
          'Bottom start, 8 px from the trigger, flips when there is no space, no arrow. Same surface as Menu. sm 240 · md 320 · lg 400 · auto (hugs, no padding). ' +
          'Header (`title`) with close button for titled content or forms; a footer (`primaryAction`) only when changes must be confirmed – otherwise apply live. Below 640 px it opens as Bottom Sheet. ' +
          'One topic per popover, one at a time, no popover in a popover; if it needs scrolling or many fields, use a Dialog. ' +
          'Styles: `medo-popover`, `medo-popover--{sm|md|lg|auto}`, `medo-popover__header`, `medo-popover__body`, `medo-popover__footer`, `medo-toggletip`.',
      },
    },
  },
  render: (args) => (
    <PopoverTrigger>
      <Button variant="secondary" startIcon={<Filter />} endIcon={<ChevronDown />}>
        Filter
      </Button>
      <Popover {...args}>{args.primaryAction ? (close) => <LinkForm close={close} /> : <StatusFilter />}</Popover>
    </PopoverTrigger>
  ),
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: { docs: { description: { story: 'Open the popover to see the changes from the controls. With a main action the content becomes the link form.' } } },
};

export const Options: Story = {
  name: 'Header and footer',
  parameters: {
    docs: {
      description: { story: 'Body only: applies live. Header: content with a title. Header + footer: changes must be confirmed; the footer button submits the form.' },
    },
  },
  render: () => (
    <div style={row}>
      <PopoverTrigger>
        <Button variant="secondary" endIcon={<ChevronDown />}>
          Body only
        </Button>
        <Popover aria-label="Status filter">
          <StatusFilter />
        </Popover>
      </PopoverTrigger>
      <PopoverTrigger>
        <Button variant="secondary" endIcon={<ChevronDown />}>
          Header + body
        </Button>
        <Popover title="Filter">
          <StatusFilter />
        </Popover>
      </PopoverTrigger>
      <PopoverTrigger>
        <Button variant="secondary">Add link</Button>
        <Popover title="Add link" primaryAction={{ label: 'Insert', form: 'link-form' }}>
          {(close) => <LinkForm close={close} />}
        </Popover>
      </PopoverTrigger>
    </div>
  ),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'md is the default. sm for a short note or a single field, lg for a richer card. The height follows the content up to the space available; then the body scrolls.',
      },
    },
  },
  render: () => (
    <div style={row}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <PopoverTrigger key={size}>
          <Button variant="secondary">Size {size}</Button>
          <Popover size={size} title={`Popover ${size}`}>
            <p style={text}>Content of a popover: text, a short form or a rich card such as a user profile.</p>
          </Popover>
        </PopoverTrigger>
      ))}
    </div>
  ),
};

export const ToggletipStory: Story = {
  name: 'Toggletip',
  parameters: {
    docs: {
      description: {
        story:
          'For a short explanation next to a label or value. The info button opens it on click, so it works with touch, keyboard and screen readers – unlike a tooltip. ' +
          'Its name names the topic (“About billing email”). Text plus an optional link. On mobile it stays a popover.',
      },
    },
  },
  render: () => (
    <span style={fieldRow}>
      Billing email
      <Toggletip aria-label="About billing email" link={{ label: 'Learn more', href: '#billing' }}>
        Invoices and payment reminders are sent to this address.
      </Toggletip>
    </span>
  ),
};

export const Mobile: Story = {
  name: 'On mobile',
  parameters: {
    docs: {
      description: {
        story:
          'Below 640 px (`overlay="auto"`) popovers open as Bottom Sheet – easier to reach with the thumb and with room for the keyboard. Forced here with `overlay="sheet"`.',
      },
    },
  },
  render: () => (
    <PopoverTrigger>
      <Button variant="secondary" startIcon={<Filter />}>
        Filter
      </Button>
      <Popover title="Filter" overlay="sheet">
        <StatusFilter />
      </Popover>
    </PopoverTrigger>
  ),
};

export const InteractionTest: Story = {
  ...interactionTest,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Filter' });
    await userEvent.click(trigger);
    const body = within(document.body);
    const dialog = await body.findByRole('dialog', { name: 'Filter' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(within(dialog).getByRole('checkbox', { name: 'Done' }));
    await expect(within(dialog).getByRole('checkbox', { name: 'Done' })).toBeChecked();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};
