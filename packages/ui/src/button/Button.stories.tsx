import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRight, Download, Plus, Trash2 } from 'lucide-react';
import { expect, fn } from 'storybook/test';
import { Button, ButtonGroup } from './Button';
import { interactionTest, slot } from '../story-helpers';

const meta = {
  title: 'Components/Actions/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Button', variant: 'primary', size: 'md', isDisabled: false, isPending: false, startIcon: 'none', endIcon: 'none', onPress: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost', 'danger', 'text', 'ghost-danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    startIcon: slot({ none: undefined, plus: <Plus />, download: <Download />, trash: <Trash2 /> }),
    endIcon: slot({ none: undefined, arrow: <ArrowRight />, download: <Download /> }),
    children: { control: 'text' },
    isPending: { control: 'boolean', description: 'Shows a spinner and blocks presses while an action runs.' },
    onPress: { control: false },
  },
  parameters: {
    medo: {
      subtitle: 'Triggers an action.',
      usage: {
        when: ['Start an action on the current page: save, send, delete, open a dialog.', 'Submit a form (`type="submit"`).'],
        whenNot: [
          'Go to another page: use a Link.',
          'Turn a setting on or off: use a Switch or a Toggle Button.',
          'An action shown only as an icon: use an Icon Button.',
        ],
        do: [
          'One primary button per area.',
          'Name the action with a verb: “Save changes”, not “OK”.',
          'Show `isPending` while the action runs.',
          'Put related buttons into a `ButtonGroup`.',
        ],
        dont: ['Several primary buttons side by side.', '`danger` for actions that are not destructive.', 'Disable a button without telling why.'],
      },
      a11y: {
        keyboard: [
          ['Tab', 'Moves the focus to the button.'],
          ['Enter / Space', 'Runs the action.'],
        ],
        notes: [
          'The label names the button. Icons are decorative and hidden from screen readers.',
          'While pending, the button keeps its size and focus; the label says what happens (“Saving…”).',
          'Disabled buttons are skipped by the keyboard.',
          'Heights: sm 32 px, md 40 px, lg 48 px for touch.',
        ],
      },
      styling: {
        classes: [
          ['medo-button', 'Base class.'],
          ['medo-button--{variant}', '`primary`, `secondary`, `ghost`, `danger`, `text`, `ghost-danger`.'],
          ['medo-button--{size}', '`sm` or `lg`. Without it: md.'],
          ['medo-button__icon', 'Icon before or after the label.'],
          ['medo-button-group', 'Spacing and order of related buttons; `--footer`, `--header`.'],
        ],
        states: ['data-hovered', 'data-pressed', 'data-focus-visible', 'data-disabled', 'data-pending'],
      },
    },
    docs: {
      description: {
        component:
          'Use a button to start an action, like saving or sending. Built on React Aria: use `onPress` instead of `onClick` and `isDisabled` instead of `disabled`. ' +
          'The CSS also works on a plain HTML `<button>`.',
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const row = { display: 'flex', gap: 'var(--medo-space-4)', alignItems: 'center', flexWrap: 'wrap' } as const;
const col = { display: 'grid', gap: 'var(--medo-space-6)' } as const;

export const Variants: Story = {
  render: (args) => (
    <div style={row}>
      <Button {...args} variant="primary">Primary</Button>
      <Button {...args} variant="secondary">Secondary</Button>
      <Button {...args} variant="ghost">Ghost</Button>
      <Button {...args} variant="danger">Danger</Button>
      <Button {...args} variant="ghost-danger">Ghost danger</Button>
      <Button {...args} variant="text">Text</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={row}>
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  name: 'With icons',
  render: (args) => (
    <div style={row}>
      <Button {...args} startIcon={<Plus />}>New project</Button>
      <Button {...args} variant="secondary" startIcon={<Download />}>Export</Button>
      <Button {...args} variant="text" endIcon={<ArrowRight />}>Learn more</Button>
      <Button {...args} variant="danger" startIcon={<Trash2 />}>Delete</Button>
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <div style={row}>
      {(['primary', 'secondary', 'ghost', 'danger', 'text'] as const).map((v) => (
        <Button key={v} {...args} variant={v} isDisabled>
          {v[0].toUpperCase() + v.slice(1)}
        </Button>
      ))}
    </div>
  ),
};

/** All variants in Light and Dark side by side – uses data-theme on a wrapper. */
export const Pending: Story = {
  parameters: {
    docs: {
      description: {
        story: 'While saving: `isPending` keeps the look, size and focus; a spinner replaces the icon and the label says what happens.',
      },
    },
  },
  render: (args) => (
    <div style={row}>
      <Button {...args} isPending>
        Saving…
      </Button>
      <Button {...args} variant="secondary" isPending startIcon={<Download />}>
        Exporting…
      </Button>
    </div>
  ),
};

export const Group: Story = {
  name: 'Button group',
  parameters: {
    docs: {
      description: {
        story:
          'Spacing, order and mobile stacking for related buttons. **footer**: right, primary last, a destructive action far left. ' +
          '**content**: left, primary first. Below 640 px the buttons stack, the primary on top.',
      },
    },
  },
  render: () => (
    <div style={{ ...col, maxInlineSize: '36rem' }}>
      <ButtonGroup destructive={<Button variant="ghost-danger">Delete</Button>}>
        <Button variant="secondary">Cancel</Button>
        <Button>Save</Button>
      </ButtonGroup>
      <ButtonGroup context="content">
        <Button>Get started</Button>
        <Button variant="secondary">Learn more</Button>
      </ButtonGroup>
    </div>
  ),
};

export const InteractionTest: Story = {
  ...interactionTest,
  play: async ({ canvas, userEvent, args }) => {
    const button = canvas.getByRole('button', { name: 'Button' });
    await userEvent.click(button);
    await expect(args.onPress).toHaveBeenCalledTimes(1);
    // Keyboard: Enter and Space press it too.
    button.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(args.onPress).toHaveBeenCalledTimes(3);
  },
};
