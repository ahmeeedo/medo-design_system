import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Key } from 'react-aria-components';
import { expect, fn, waitFor, within } from 'storybook/test';
import { Archive, Copy, Download, FileText, Folder, FolderInput, Link2, Pencil, Share2, Trash2 } from 'lucide-react';
import { Menu, MenuButton, MenuItem, MenuSection, MenuTrigger, Submenu } from './Menu';
import { Button } from '../button/Button';
import { AlertDialog } from '../dialog/Dialog';
import { interactionTest } from '../story-helpers';

const file: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--medo-space-3)',
  maxInlineSize: '28rem',
  padding: 'var(--medo-space-3) var(--medo-space-4)',
  border: 'var(--medo-border-width-thin) solid var(--medo-color-border-default)',
  borderRadius: 'var(--medo-radius-md)',
  background: 'var(--medo-color-surface-default)',
};

/** File actions as an example. */
function FileActions({ overlay, onAction }: { overlay?: 'auto' | 'popover' | 'sheet'; onAction?: (key: Key) => void }) {
  return (
    <Menu title="Q3-Report.pdf" overlay={overlay} onAction={onAction}>
      <MenuSection aria-label="Edit">
        <MenuItem id="rename" icon={<Pencil />} shortcut="F2">
          Rename
        </MenuItem>
        <MenuItem id="duplicate" icon={<Copy />} shortcut="Mod+D">
          Duplicate
        </MenuItem>
        <Submenu label="Move to…" icon={<FolderInput />}>
          <MenuItem id="move-reports" icon={<Folder />}>
            Reports
          </MenuItem>
          <MenuItem id="move-finance" icon={<Folder />}>
            Finance
          </MenuItem>
          <MenuItem id="move-archive" icon={<Folder />}>
            Archive
          </MenuItem>
        </Submenu>
      </MenuSection>
      <MenuSection aria-label="Share">
        <MenuItem id="share" icon={<Share2 />}>
          Share…
        </MenuItem>
        <MenuItem id="link" icon={<Link2 />} shortcut="Mod+Shift+C">
          Copy link
        </MenuItem>
        <MenuItem id="download" icon={<Download />}>
          Download
        </MenuItem>
        <MenuItem id="archive" icon={<Archive />} isDisabled>
          Archive
        </MenuItem>
      </MenuSection>
      <MenuSection aria-label="Danger">
        <MenuItem id="delete" icon={<Trash2 />} variant="danger">
          Delete…
        </MenuItem>
      </MenuSection>
    </Menu>
  );
}

const meta = {
  title: 'Components/Actions/Menu',
  component: Menu,
  tags: ['autodocs'],
  args: { overlay: 'popover', onAction: fn() },
  argTypes: {
    overlay: { control: 'inline-radio', options: ['auto', 'popover', 'sheet'], description: 'auto: popover on desktop, Bottom Sheet below 640 px.' },
    title: { control: false },
    onAction: { control: false },
    children: { control: false },
    items: { control: false },
  },
  parameters: {
    medo: {
      subtitle: 'A list of actions that opens from a trigger. Popover on desktop, bottom sheet on mobile.',
      usage: {
        when: ['Several actions for one object behind a “…” or a button.', 'Actions that are needed now and then, not all the time.'],
        whenNot: [
          'Choosing a value: use a Select.',
          'Switching views: use a Toggle Button group or Tabs.',
          'Navigation between pages: use Navigation or Links.',
          'One or two actions: show them as buttons.',
        ],
        do: [
          'Give every item an icon and a verb label.',
          'Group related items; put destructive items last in their own group.',
          'Confirm destructive items or offer Undo.',
        ],
        dont: [
          'Use checkmarks for a selected state.',
          'Nest more than one submenu level.',
          'Hide the only way to do an important task in a menu.',
        ],
      },
      a11y: {
        keyboard: [
          ['Enter / Space / ↓', 'Opens the menu on the trigger.'],
          ['↑ / ↓', 'Moves through the items.'],
          ['Letters', 'Jumps to the matching item.'],
          ['→ / ←', 'Opens or closes a submenu.'],
          ['Enter', 'Runs the item and closes the menu.'],
          ['Esc', 'Closes the menu; focus returns to the trigger.'],
        ],
        notes: [
          'The trigger is announced as a menu button and shows whether it is open.',
          'Shortcuts are shown on desktop only (`Mod` = ⌘ on Apple, Ctrl elsewhere).',
          'Below 640 px the menu opens as a Bottom Sheet; a submenu becomes a second view with a back button.',
        ],
      },
      styling: {
        classes: [
          ['medo-menu-popover', 'Surface around the menu.'],
          ['medo-menu', 'The list of items; `--lg` on mobile.'],
          ['medo-menu__section', 'A group with an optional header.'],
          ['medo-menu-item', 'One item; `--danger` for destructive actions.'],
          ['medo-menu-item__icon, __label, __shortcut, __chevron', 'Parts of an item.'],
        ],
        states: ['data-focused', 'data-hovered', 'data-pressed', 'data-disabled', 'data-has-submenu', 'data-open'],
      },
    },
    docs: {
      description: {
        component:
          'Built on React Aria Menu: arrow keys move, Enter runs the item, Esc closes and focus returns to the trigger, letters jump. ' +
          'Every item has an icon and a verb label; shortcuts on desktop (`Mod` = ⌘ on Apple, Ctrl elsewhere); danger items last in their own group. ' +
          'One submenu level: to the side on desktop, a second view with a back button on mobile. No checkmarks – values belong in Select, views in Toggle Button. ' +
          'Styles: `medo-menu-popover`, `medo-menu`, `medo-menu-item`, `medo-menu-item--danger`.',
      },
    },
  },
  render: function Render(args) {
    const [confirm, setConfirm] = useState(false);
    return (
      <div style={file}>
        <FileText aria-hidden="true" style={{ inlineSize: 20, blockSize: 20, color: 'var(--medo-color-text-secondary)' }} />
        <div style={{ flex: 1, display: 'grid' }}>
          <span style={{ font: 'var(--medo-typography-label-md)' }}>Q3-Report.pdf</span>
          <span style={{ font: 'var(--medo-typography-caption)', color: 'var(--medo-color-text-secondary)' }}>PDF · 2.4 MB · edited 2 h ago</span>
        </div>
        <MenuTrigger>
          <MenuButton aria-label="More actions for Q3-Report.pdf" />
          <FileActions
            overlay={args.overlay}
            onAction={(key) => {
              args.onAction?.(key, {});
              if (key === 'delete') setConfirm(true);
            }}
          />
        </MenuTrigger>
        {/* “Delete…” – the ellipsis means a second step: an Alert dialog confirms. */}
        <AlertDialog isOpen={confirm} onOpenChange={setConfirm} title="Delete Q3-Report.pdf?" actionLabel="Delete">
          The file will be deleted for everyone in this workspace. This cannot be undone.
        </AlertDialog>
      </div>
    );
  },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: { docs: { description: { story: 'Open the menu with the ••• button. The Actions panel shows the chosen item; “Delete…” opens an Alert dialog.' } } },
};

export const TextTrigger: Story = {
  name: 'Button as trigger',
  parameters: { docs: { description: { story: 'Any button can open a menu, e.g. a split or “More” button.' } } },
  render: () => (
    <MenuTrigger>
      <Button variant="secondary">Export</Button>
      <Menu overlay="popover">
        <MenuItem id="pdf" icon={<FileText />}>
          Export as PDF
        </MenuItem>
        <MenuItem id="csv" icon={<Download />}>
          Export as CSV
        </MenuItem>
      </Menu>
    </MenuTrigger>
  ),
};

export const Mobile: Story = {
  name: 'On mobile',
  args: { overlay: 'sheet' },
  parameters: {
    docs: {
      description: {
        story:
          'Below 640 px (`overlay="auto"`) the menu opens as a Bottom Sheet: lg items (48 px), no shortcuts, the title names the object. ' +
          'Tapping an item runs it and closes the sheet; a submenu replaces the list with a back button. Forced here with `overlay="sheet"`.',
      },
    },
  },
};

export const InteractionTest: Story = {
  ...interactionTest,
  play: async ({ canvas, userEvent, args }) => {
    const trigger = canvas.getByRole('button', { name: 'More actions for Q3-Report.pdf' });
    trigger.focus();
    // Enter opens the menu with focus on the first item; arrow keys move, Enter runs.
    await userEvent.keyboard('{Enter}');
    const body = within(document.body);
    const menu = await body.findByRole('menu');
    await waitFor(() => expect(within(menu).getByRole('menuitem', { name: /Rename/ })).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(args.onAction).toHaveBeenCalledWith('duplicate', {});
    await waitFor(() => expect(body.queryByRole('menu')).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};
