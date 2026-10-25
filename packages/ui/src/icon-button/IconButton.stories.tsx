import type { Meta, StoryObj } from '@storybook/react-vite';
import { Maximize2, Pause, Pencil, Plus, Trash2, Volume2, X } from 'lucide-react';
import { IconButton } from './IconButton';
import { fn } from 'storybook/test';
import { LightDark, row, semantic, slot } from '../story-helpers';

const meta = {
  title: 'Components/Icon Button',
  component: IconButton,
  tags: ['autodocs'],
  args: { 'aria-label': 'Add item', icon: 'plus', variant: 'ghost', size: 'md', isDisabled: false, onPress: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: ['ghost', 'secondary', 'primary', 'danger'], description: 'media · media-ghost: on images and video – see „On media“.' },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    icon: slot({ plus: <Plus />, edit: <Pencil />, delete: <Trash2 />, close: <X /> }),
    'aria-label': { control: 'text', description: 'Accessible name. Also shown as the tooltip (hover or focus).' },
    shortcut: { control: 'text', description: 'Shown in the tooltip (hover or focus), e.g. „Control+C“.' },
    tooltip: { control: 'text', description: 'Own tooltip text instead of the label. false hides it.' },
    shortcutLabel: semantic,
    onPress: { control: false },
  },
  parameters: {
    medo: { code: 'C02', subtitle: 'A square button with an icon instead of a label.', figma: '68:122' },
    docs: {
      description: {
        component:
          'Square icon-only action. Figma: **C02 Icon Button**. `aria-label` is required because there is no visible label; ' +
          'it is shown as a tooltip automatically (`tooltip={false}` turns it off, `shortcut` adds a key hint). ' +
          'Shares the Button styles (`medo-button medo-button--icon-only`). On images and video (Figma: **Media icon button**): `media` (overlay/media circle) and `media-ghost` (no fill, on a gradient bar), sm 28 with a 44 px hit area.',
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

export const LightAndDark: Story = {
  name: 'Light and Dark',
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <LightDark>
      <div style={row}>
        {(['ghost', 'secondary', 'primary', 'danger'] as const).map((v) => (
          <IconButton key={v} {...args} variant={v} />
        ))}
        <IconButton {...args} variant="primary" isDisabled />
      </div>
    </LightDark>
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
    <div style={{ display: 'grid', gap: 'var(--medo-space-4)', justifyItems: 'start' }}>
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
