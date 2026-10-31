import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor, within } from 'storybook/test';
import {
  Bell,
  Calendar,
  CircleHelp,
  CreditCard,
  FolderClosed,
  LayoutDashboard,
  ListChecks,
  LogOut,
  MessageSquare,
  Settings,
  SlidersHorizontal,
  User,
  Users,
} from 'lucide-react';
import { Drawer } from './Drawer';
import { DialogTrigger } from '../dialog/Dialog';
import { Avatar } from '../avatar/Avatar';
import { Button, ButtonGroup } from '../button/Button';
import { Checkbox, CheckboxGroup } from '../checkbox/Checkbox';
import { NavItem, NavList } from '../navigation/Navigation';
import { Switch } from '../switch/Switch';
import { TextField } from '../text-field/TextField';
import { interactionTest, row, semantic, slot } from '../story-helpers';

const divider: React.CSSProperties = {
  border: 0,
  borderBlockStart: 'var(--medo-border-width-thin) solid var(--medo-color-border-default)',
  margin: 'var(--medo-space-2) 0',
};
const profile: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--medo-space-3)',
  padding: 'var(--medo-space-2) var(--medo-space-2) var(--medo-space-3)',
};

/** Example “Account” – links act immediately, so no footer. */
function AccountBody() {
  return (
    <>
      <div style={profile}>
        <Avatar name="Ahmet D." size="lg" decorative />
        <span style={{ display: 'grid' }}>
          <span style={{ font: 'var(--medo-typography-label-md)' }}>Ahmet D.</span>
          <span style={{ font: 'var(--medo-typography-caption)', color: 'var(--medo-color-text-secondary)' }}>ahmet@med-o.de</span>
        </span>
      </div>
      <hr style={divider} />
      <NavList variant="sheet" aria-label="Account">
        <NavItem href="#profile" icon={<User />}>
          Profile
        </NavItem>
        <NavItem href="#account" icon={<Settings />}>
          Account settings
        </NavItem>
        <NavItem href="#notifications" icon={<Bell />}>
          Notifications
        </NavItem>
        <NavItem href="#billing" icon={<CreditCard />}>
          Billing
        </NavItem>
        <NavItem href="#help" icon={<CircleHelp />}>
          Help
        </NavItem>
      </NavList>
      <hr style={divider} />
      <div style={{ padding: 'var(--medo-space-2) var(--medo-space-3)' }}>
        <Switch size="lg" labelPosition="start">
          Dark mode
        </Switch>
      </div>
      <hr style={divider} />
      <NavList variant="sheet" aria-label="Session">
        <NavItem href="#logout" icon={<LogOut />}>
          Log out
        </NavItem>
      </NavList>
    </>
  );
}

function FilterBody() {
  return (
    <div style={{ padding: 'var(--medo-space-2)' }}>
      <CheckboxGroup label="Status" defaultValue={['open', 'progress']}>
        <Checkbox value="open">Open</Checkbox>
        <Checkbox value="progress">In progress</Checkbox>
        <Checkbox value="done">Done</Checkbox>
      </CheckboxGroup>
    </div>
  );
}

const filterFooter = (close: () => void) => (
  <ButtonGroup>
    <Button variant="secondary">Reset</Button>
    <Button onPress={close}>Apply</Button>
  </ButtonGroup>
);

const meta = {
  title: 'Components/Overlays/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  args: { title: 'Account', side: 'right', size: 'sm', footer: 'none' as never, isDirty: false, children: null, onOpenChange: fn() },
  argTypes: {
    title: { control: 'text' },
    side: { control: 'inline-radio', options: ['right', 'left'], description: 'right: account, filters, details · left: navigation only.' },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    footer: slot({ none: undefined, 'Reset and Apply': filterFooter }),
    isDirty: { control: 'boolean', description: 'Unsaved input: the scrim no longer closes, X and Esc ask “Discard changes?”.' },
    'aria-label': semantic,
    closeLabel: semantic,
    discardText: semantic,
    children: { control: false },
    isOpen: { control: false },
    onOpenChange: { control: false },
  },
  parameters: {
    medo: {
      subtitle: 'A modal panel that slides in from the side – for account settings, filters, details or navigation.',
      usage: {
        when: ['Account settings, filters or details next to a list.', 'Navigation on tablets (left).'],
        whenNot: [
          'A short focused task: use a Dialog.',
          'A decision: use an Alert Dialog.',
          'Content that should stay open while working: use a side panel in the layout.',
        ],
        do: [
          'Open from the right for account, filters and details; left only for navigation.',
          'Add a footer only for decisions like Apply or Save.',
          'Set `isDirty` when the user changed something.',
        ],
        dont: ['Open two drawers at once.', 'Put a long multi-step flow into a drawer.'],
      },
      a11y: {
        keyboard: [
          ['Tab / Shift + Tab', 'Moves through the drawer. The focus stays inside.'],
          ['Esc', 'Closes the drawer. With `isDirty` it asks first.'],
        ],
        notes: [
          'Same behaviour as the Dialog: the title names it, the page behind is blocked.',
          'Focus returns to the trigger when it closes.',
          'Below 640 px it is the viewport − 56 px wide; a swipe towards the edge closes it.',
          'Only the body scrolls; header and footer stay visible.',
        ],
      },
      styling: {
        classes: [
          ['medo-drawer-overlay', 'Scrim; `--left` or `--right`.'],
          ['medo-drawer', 'The panel.'],
          ['medo-drawer--{side}', '`left` or `right`.'],
          ['medo-drawer--{size}', '`sm` 320, `md` 400, `lg` 560.'],
          ['medo-drawer__header, __title, __body, __footer', 'Parts of the panel.'],
        ],
        states: ['data-entering', 'data-exiting', 'data-dragging'],
      },
    },
    docs: {
      description: {
        component: 'Use a drawer for a panel that slides in from the side: account, filters, details or navigation. Same building blocks and behaviour as the Dialog.',
      },
    },
  },
  render: (args) => (
    <DialogTrigger>
      <Button variant="secondary">Open drawer</Button>
      <Drawer {...args}>{args.footer ? <FilterBody /> : <AccountBody />}</Drawer>
    </DialogTrigger>
  ),
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: { docs: { description: { story: 'Open the drawer to see the changes from the controls. With a footer the content becomes the filter example.' } } },
};

export const UseCases: Story = {
  name: 'Use cases',
  parameters: {
    docs: {
      description: {
        story:
          'Account: right sm, no footer. Filters: right md, footer Reset · Apply (Reset does not close). Details: right lg, the list stays visible. Navigation: left sm.',
      },
    },
  },
  render: () => (
    <div style={row}>
      <DialogTrigger>
        <Button variant="secondary" startIcon={<User />}>
          Account
        </Button>
        <Drawer title="Account">
          <AccountBody />
        </Drawer>
      </DialogTrigger>
      <DialogTrigger>
        <Button variant="secondary" startIcon={<SlidersHorizontal />}>
          Filter
        </Button>
        <Drawer title="Filter" size="md" footer={filterFooter}>
          <FilterBody />
        </Drawer>
      </DialogTrigger>
      <DialogTrigger>
        <Button variant="secondary">Invoice #1042</Button>
        <Drawer title="Invoice #1042" size="lg">
          <p style={{ margin: 'var(--medo-space-2)', color: 'var(--medo-color-text-secondary)' }}>Details of the selected record – the list behind stays visible.</p>
        </Drawer>
      </DialogTrigger>
      <DialogTrigger>
        <Button variant="secondary">Navigation</Button>
        <Drawer title="med.o" aria-label="App" side="left">
          <NavList variant="sidebar" aria-label="App">
            <NavItem href="#dashboard" icon={<LayoutDashboard />} isCurrent>
              Dashboard
            </NavItem>
            <NavItem href="#projects" icon={<FolderClosed />}>
              Projects
            </NavItem>
            <NavItem href="#tasks" icon={<ListChecks />}>
              Tasks
            </NavItem>
            <NavItem href="#calendar" icon={<Calendar />}>
              Calendar
            </NavItem>
            <NavItem href="#inbox" icon={<MessageSquare />}>
              Inbox
            </NavItem>
            <NavItem href="#members" icon={<Users />}>
              Members
            </NavItem>
          </NavList>
        </Drawer>
      </DialogTrigger>
    </div>
  ),
};

export const UnsavedChanges: Story = {
  name: 'Unsaved changes',
  parameters: {
    docs: {
      description: {
        story:
          'Type a name, then press Cancel, X or Esc: “Discard changes?” asks first. While there is input, a click on the scrim does nothing. Save closes without asking (`close` from the render function).',
      },
    },
  },
  render: function Render() {
    const [dirty, setDirty] = useState(false);
    return (
      <DialogTrigger onOpenChange={(open) => !open && setDirty(false)}>
        <Button variant="secondary">Edit profile</Button>
        <Drawer
          title="Profile"
          size="lg"
          isDirty={dirty}
          footer={(_close, cancel) => (
            <ButtonGroup>
              <Button variant="secondary" onPress={cancel}>
                Cancel
              </Button>
              <Button type="submit" form="profile-form">
                Save
              </Button>
            </ButtonGroup>
          )}
        >
          {(close) => (
            <form
              id="profile-form"
              style={{ display: 'grid', gap: 'var(--medo-layout-gap-fields)', padding: 'var(--medo-space-2)' }}
              onSubmit={(e) => {
                e.preventDefault();
                close(); // after saving: closes without asking
              }}
            >
              <TextField label="Name" defaultValue="Ahmet D." onChange={() => setDirty(true)} />
              <TextField label="Job title" onChange={() => setDirty(true)} />
            </form>
          )}
        </Drawer>
      </DialogTrigger>
    );
  },
};

export const InteractionTest: Story = {
  ...interactionTest,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Open drawer' });
    await userEvent.click(trigger);
    const body = within(document.body);
    const drawer = await body.findByRole('dialog', { name: 'Account' });
    await waitFor(() => expect(drawer).toContainElement(document.activeElement as HTMLElement));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
    // React Aria returns the focus one frame after the overlay is gone: wait for it.
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};
