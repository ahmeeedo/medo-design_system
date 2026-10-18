import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { IconButton } from './IconButton';
import { LightDark, row } from '../story-helpers';

const meta = {
  title: 'Components/Icon Button',
  component: IconButton,
  tags: ['autodocs'],
  args: { 'aria-label': 'Add item', icon: <Plus />, variant: 'ghost', size: 'md', isDisabled: false },
  argTypes: {
    variant: { control: 'inline-radio', options: ['ghost', 'secondary', 'primary', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    icon: { control: false },
  },
  parameters: {
    medo: { code: 'C02', subtitle: 'A square button with an icon instead of a label.', figma: '68:122' },
    docs: {
      description: {
        component:
          'Square icon-only action. Figma: **C02 Icon Button**. `aria-label` is required because there is no visible label; ' +
          'it is shown as a tooltip automatically (`tooltip={false}` turns it off, `shortcut` adds a key hint). ' +
          'Shares the Button styles (`medo-button medo-button--icon-only`).',
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
