import type { Meta, StoryObj } from '@storybook/react-vite';
import { Maximize2, Pause, Pencil, Plus, Trash2, Volume2, X } from 'lucide-react';
import { IconButton } from './IconButton';
import { expect, fn, waitFor, within } from 'storybook/test';
import { interactionTest, row, semantic, slot } from '../story-helpers';

const meta = {
  title: 'Components/Actions/Icon Button',
  component: IconButton,
  tags: ['autodocs'],
  args: { 'aria-label': 'Add item', icon: 'plus', variant: 'ghost', size: 'md', isDisabled: false, onPress: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: ['ghost', 'secondary', 'primary', 'danger'], description: 'media · media-ghost: on images and video – see “On media”.' },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    icon: slot({ plus: <Plus />, edit: <Pencil />, delete: <Trash2 />, close: <X /> }),
    'aria-label': { control: 'text', description: 'Accessible name. Also shown as the tooltip (hover or focus).' },
    shortcut: { control: 'text', description: 'Shown in the tooltip (hover or focus), e.g. “Control+C”.' },
    tooltip: { control: 'text', description: 'Own tooltip text instead of the label. false hides it.' },
    shortcutLabel: semantic,
    onPress: { control: false },
  },
  parameters: {
    medo: {
      subtitle: 'A square button with an icon instead of a label.',
      usage: {
        when: ['An action that is clear from its icon alone: close, more, edit, copy.', 'Toolbars, table rows and headers with little space.'],
        whenNot: [
          'The icon is not obvious: use a Button with a label.',
          'The main action of an area: use a Button.',
          'Going to another page: use a Link.',
        ],
        do: [
          'Always set `aria-label` with a verb: “Close dialog”, “Copy link”. It is shown as the tooltip.',
          'Use common icons only (Lucide), the same icon for the same action everywhere.',
          'Use `media` or `media-ghost` on images and video.',
        ],
        dont: [
          'Rely on the tooltip for important information.',
          'Put two different actions behind similar icons side by side.',
          'Use `tooltip={false}` unless a visible text already names the button.',
        ],
      },
      a11y: {
        keyboard: [
          ['Tab', 'Moves the focus to the button and shows the tooltip.'],
          ['Enter / Space', 'Runs the action.'],
          ['Esc', 'Hides the tooltip.'],
        ],
        notes: [
          'The `aria-label` names the button; the icon is hidden from screen readers.',
          '`shortcut` adds `aria-keyshortcuts` and shows the keys in the tooltip.',
          'Sizes: sm 32, md 40, lg 48 px. Media variants: sm 28 with a 44 px hit area.',
        ],
      },
      styling: {
        classes: [
          ['medo-button medo-button--icon-only', 'Base: the Button styles, square.'],
          ['medo-button--{variant}', '`ghost`, `secondary`, `primary`, `danger`, `media`, `media-ghost`.'],
          ['medo-button--{size}', '`sm`, `md` or `lg`.'],
        ],
        states: ['data-hovered', 'data-pressed', 'data-focus-visible', 'data-disabled'],
      },
    },
    docs: {
      description: {
        component: 'Use an icon button for an action shown only as an icon. `aria-label` is required; it also appears as a tooltip. Shares the Button styles.',
      },
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={row}>
      <IconButton {...args} variant="ghost" aria-label="Edit" icon={<Pencil />} />
      <IconButton {...args} variant="secondary" aria-label="Close" icon={<X />} />
      <IconButton {...args} variant="primary" aria-label="Add item" icon={<Plus />} />
      <IconButton {...args} variant="danger" aria-label="Delete" icon={<Trash2 />} />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={row}>
      <IconButton {...args} size="sm" variant="secondary" />
      <IconButton {...args} size="md" variant="secondary" />
      <IconButton {...args} size="lg" variant="secondary" />
    </div>
  ),
};

const media: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--medo-space-4)',
  padding: 'var(--medo-space-4)',
  borderRadius: 'var(--medo-radius-md)',
  background: 'linear-gradient(135deg, #6f8f9c, #2d4550 55%, #0f1a1f)',
};

export const OnMedia: Story = {
  name: 'On media',
  parameters: {
    docs: {
      description: {
        story:
          'Media icon button: remove, cancel, close and player controls on images and video. `media` – overlay/media circle on busy images (ring outside on focus). `media-ghost` – no fill, on a gradient bar (ring inside). Hover and pressed tint with state/hover-on-media · state/pressed-on-media, the same in both themes. sm 28 · md 40 · lg 48.',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--medo-layout-gap-content)', justifyItems: 'start' }}>
      <div style={media}>
        {(['sm', 'md', 'lg'] as const).map((size) => (
          <IconButton key={size} {...args} variant="media" size={size} aria-label="Remove photo" icon={<X />} />
        ))}
      </div>
      <div style={{ ...media, background: 'linear-gradient(transparent, rgb(0 0 0 / 0.7)), #2d4550' }}>
        <IconButton {...args} variant="media-ghost" size="sm" aria-label="Pause" icon={<Pause />} />
        <IconButton {...args} variant="media-ghost" size="md" aria-label="Mute" icon={<Volume2 />} />
        <IconButton {...args} variant="media-ghost" size="lg" aria-label="Full screen" icon={<Maximize2 />} />
      </div>
    </div>
  ),
};

export const InteractionTest: Story = {
  ...interactionTest,
  play: async ({ canvas, userEvent, args }) => {
    // Keyboard focus shows the name as a tooltip at once; Enter presses.
    await userEvent.tab();
    const body = within(document.body);
    await waitFor(() => expect(body.getByRole('tooltip')).toHaveTextContent('Add item'));
    await userEvent.keyboard('{Enter}');
    await expect(args.onPress).toHaveBeenCalledTimes(1);
    await expect(canvas.getByRole('button', { name: 'Add item' })).toBeInTheDocument();
  },
};
