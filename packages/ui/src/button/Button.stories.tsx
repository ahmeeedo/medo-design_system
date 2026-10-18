import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRight, Download, Plus, Trash2 } from 'lucide-react';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Button', variant: 'primary', size: 'md', isDisabled: false },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost', 'danger', 'text', 'ghost-danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    startIcon: { control: false },
    endIcon: { control: false },
  },
  parameters: {
    medo: { code: 'C01', subtitle: 'Triggers an action.', figma: '58:2' },
    docs: {
      description: {
        component:
          'Triggers an action. Figma: **C01 Button**. One Primary per area, Danger only for destructive actions. ' +
          'Styles are plain CSS (`medo-button`, `medo-button--primary`, `medo-button--md`) and can be used without React. Built on React Aria: use `onPress` and `isDisabled`.',
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
export const LightAndDark: Story = {
  name: 'Light and Dark',
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      {(['light', 'dark'] as const).map((theme) => (
        <div
          key={theme}
          data-theme={theme}
          style={{ ...col, padding: 'var(--medo-space-8)', background: 'var(--medo-color-surface-default)' }}
        >
          <span className="medo-text-overline" style={{ color: 'var(--medo-color-text-secondary)' }}>
            {theme}
          </span>
          <div style={row}>
            {(['primary', 'secondary', 'ghost', 'danger', 'text'] as const).map((v) => (
              <Button key={v} {...args} variant={v}>
                {v[0].toUpperCase() + v.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};
