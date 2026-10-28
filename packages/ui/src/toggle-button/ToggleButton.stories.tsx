import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { expect, fn } from 'storybook/test';
import { AlignCenter, AlignLeft, AlignRight, Bold, Heart, Italic, LayoutGrid, List, Map as MapIcon, Underline } from 'lucide-react';
import { ToggleButton, ToggleButtonGroup, Toolbar, ToolbarSeparator } from './ToggleButton';
import { interactionTest, row, slot } from '../story-helpers';

const col: React.CSSProperties = { display: 'grid', gap: 'var(--medo-space-6)', justifyItems: 'start' };
const caption: React.CSSProperties = { font: 'var(--medo-typography-code-sm)', color: 'var(--medo-color-text-secondary)' };

function ViewSwitch({ size = 'md' as 'md' | 'lg', icons = false, fullWidth = false }) {
  const [view, setView] = useState<Set<string | number>>(new Set(['week']));
  return icons ? (
    <ToggleButtonGroup aria-label="View" size={size} fullWidth={fullWidth} selectedKeys={view} onSelectionChange={setView}>
      <ToggleButton id="list" aria-label="List" icon={<List />} />
      <ToggleButton id="grid" aria-label="Grid" icon={<LayoutGrid />} />
      <ToggleButton id="map" aria-label="Map" icon={<MapIcon />} />
    </ToggleButtonGroup>
  ) : (
    <ToggleButtonGroup aria-label="Period" size={size} fullWidth={fullWidth} selectedKeys={view} onSelectionChange={setView}>
      <ToggleButton id="day">Day</ToggleButton>
      <ToggleButton id="week">Week</ToggleButton>
      <ToggleButton id="month">Month</ToggleButton>
    </ToggleButtonGroup>
  );
}

function Formatting({ size = 'md' as 'md' | 'lg' }) {
  return (
    <Toolbar aria-label="Text formatting">
      <ToggleButtonGroup variant="toolbar" aria-label="Style" size={size} defaultSelectedKeys={['bold']}>
        <ToggleButton id="bold" aria-label="Bold" shortcut="Control+B" icon={<Bold />} />
        <ToggleButton id="italic" aria-label="Italic" shortcut="Control+I" icon={<Italic />} />
        <ToggleButton id="underline" aria-label="Underline" shortcut="Control+U" icon={<Underline />} />
      </ToggleButtonGroup>
      <ToolbarSeparator />
      <ToggleButtonGroup variant="toolbar" selectionMode="single" disallowEmptySelection aria-label="Alignment" size={size} defaultSelectedKeys={['left']}>
        <ToggleButton id="left" aria-label="Align left" icon={<AlignLeft />} />
        <ToggleButton id="center" aria-label="Align centre" icon={<AlignCenter />} />
        <ToggleButton id="right" aria-label="Align right" icon={<AlignRight />} />
      </ToggleButtonGroup>
    </Toolbar>
  );
}

const meta = {
  title: 'Components/Actions/Toggle Button',
  component: ToggleButton,
  tags: ['autodocs'],
  args: { children: 'Favourite', icon: 'heart', size: 'md', isSelected: false, isDisabled: false, onChange: fn() },
  argTypes: {
    children: { control: 'text', description: 'Visible label. Empty = icon only (then aria-label and tooltip).' },
    icon: slot({ none: undefined, heart: <Heart />, bold: <Bold /> }),
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    isSelected: { control: 'boolean', description: 'On / off. Click the button or use this control.' },
    onChange: { control: false },
    /* Tooltip and shortcut only exist for icon-only toggles (visible on hover or focus). */
    tooltip: { control: 'text', if: { arg: 'children', truthy: false } },
    shortcut: { control: 'text', if: { arg: 'children', truthy: false } },
  },
  parameters: {
    medo: { subtitle: 'A button that stays pressed. Alone for one on/off action, in groups for views or formatting.' },
    docs: {
      description: {
        component:
          'Built on React Aria ToggleButton: announced as pressed or not pressed; the label never changes. ' +
          'Off looks like a ghost button, on uses `action/selected` + `text/brand` – two cues, not colour alone. ' +
          'Use it for an immediate, local effect. Saved settings: Switch. Navigation: Tabs. Form choices: Radio or Checkbox. ' +
          'Styles: `medo-button medo-button--md medo-toggle`, `medo-toggle-group--segmented`, `medo-toolbar`.',
      },
    },
  },
} satisfies Meta<typeof ToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  /* Keeps the isSelected control in sync when you click the button. */
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <ToggleButton
        {...args}
        aria-label={args.children ? undefined : 'Favourite'}
        onChange={(isSelected) => {
          args.onChange?.(isSelected);
          updateArgs({ isSelected });
        }}
      />
    );
  },
};

export const States: Story = {
  parameters: { docs: { description: { story: 'Off and on, enabled and disabled. Hover, pressed and focus come from the pointer and keyboard.' } } },
  render: () => (
    <div style={col}>
      <div style={row}>
        <ToggleButton icon={<Bold />}>Bold</ToggleButton>
        <ToggleButton icon={<Bold />} defaultSelected>
          Bold
        </ToggleButton>
        <ToggleButton icon={<Bold />} isDisabled>
          Bold
        </ToggleButton>
        <ToggleButton icon={<Bold />} defaultSelected isDisabled>
          Bold
        </ToggleButton>
      </div>
      <div style={row}>
        <ToggleButton aria-label="Bold" shortcut="Control+B" icon={<Bold />} />
        <ToggleButton aria-label="Bold" shortcut="Control+B" icon={<Bold />} defaultSelected />
        <ToggleButton aria-label="Bold" icon={<Bold />} isDisabled />
        <ToggleButton aria-label="Bold" icon={<Bold />} defaultSelected isDisabled />
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={row}>
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <ToggleButton key={s} size={s} icon={<Heart />} defaultSelected>
          Favourite
        </ToggleButton>
      ))}
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <ToggleButton key={`i-${s}`} size={s} aria-label="Favourite" icon={<Heart />} />
      ))}
    </div>
  ),
};

export const Segmented: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Switch between 2–5 views of the same content. Exactly one item is on. Items are one size smaller, so the group has the control height (md 40, lg 48). ' +
          '`fullWidth` for mobile.',
      },
    },
  },
  render: () => (
    <div style={col}>
      <div style={row}>
        <ViewSwitch />
        <ViewSwitch icons />
      </div>
      <div style={row}>
        <ViewSwitch size="lg" />
        <ViewSwitch size="lg" icons />
      </div>
      <div style={{ inlineSize: '100%', maxInlineSize: '22rem', display: 'grid', gap: 'var(--medo-space-2)' }}>
        <span style={caption}>fullWidth</span>
        <ViewSwitch fullWidth />
      </div>
    </div>
  ),
};

export const ToolbarGroups: Story = {
  name: 'Toolbar',
  parameters: {
    docs: {
      description: {
        story:
          'Formatting toggles in a toolbar: any combination in one group, single select for alignment. A divider separates the groups. ' +
          'One Tab stop for the whole toolbar, arrow keys move across all groups. Icon-only items show their name and shortcut as a tooltip.',
      },
    },
  },
  render: () => (
    <div style={col}>
      <Formatting />
      <Formatting size="lg" />
    </div>
  ),
};

export const InteractionTest: Story = {
  ...interactionTest,
  render: () => (
    <ToggleButtonGroup aria-label="View" defaultSelectedKeys={['week']}>
      <ToggleButton id="day">Day</ToggleButton>
      <ToggleButton id="week">Week</ToggleButton>
      <ToggleButton id="month">Month</ToggleButton>
    </ToggleButtonGroup>
  ),
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole('radio', { name: 'Week' })).toBeChecked();
    // Arrow keys move between the items; Space selects.
    canvas.getByRole('radio', { name: 'Week' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('radio', { name: 'Month' })).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(canvas.getByRole('radio', { name: 'Month' })).toBeChecked();
    await expect(canvas.getByRole('radio', { name: 'Week' })).not.toBeChecked();
  },
};
