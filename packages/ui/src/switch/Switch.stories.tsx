import type React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Switch } from './Switch';
import { expect, fn } from 'storybook/test';
import { interactionTest, stack } from '../story-helpers';

const meta = {
  title: 'Components/Forms/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: { children: 'Email notifications', size: 'md', labelPosition: 'end', isDisabled: false, isLoading: false, onChange: fn() },
  argTypes: {
    onChange: { control: false },
    children: { control: 'text' },
    description: { control: 'text' },
    size: { control: 'inline-radio', options: ['md', 'lg'] },
    labelPosition: { control: 'inline-radio', options: ['start', 'end'] },
  },
  parameters: {
    medo: { subtitle: 'Turns a single setting on or off. The change takes effect immediately.' },
    docs: {
      description: {
        component:
          'On / off with immediate effect – no save button. ' +
          'The label names the setting and never changes with the state. For choices that are submitted with a form, use a Checkbox. ' +
          'Built on React Aria `SwitchField` (role switch).',
      },
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Fields fill their container: keep the demos at a realistic form width. */
const narrow = [(Story: () => React.ReactElement) => <div style={{ maxInlineSize: '24rem' }}><Story /></div>];

export const Playground: Story = { decorators: narrow };

export const States: Story = {
  decorators: narrow,
  render: (args) => (
    <div style={stack}>
      <Switch {...args}>Off</Switch>
      <Switch {...args} defaultSelected>On</Switch>
      <Switch {...args} description="Weekly summary every Monday.">With description</Switch>
      <Switch {...args} isDisabled>Disabled</Switch>
      <Switch {...args} isDisabled defaultSelected>Disabled and on</Switch>
      <Switch {...args} isLoading defaultSelected>Saving …</Switch>
      <Switch {...args} size="lg" defaultSelected>Large (mobile)</Switch>
    </div>
  ),
};

export const SettingsList: Story = {
  decorators: narrow,
  name: 'Settings list',
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--medo-space-4)' }}>
      <Switch labelPosition="start" defaultSelected description="Get an email for new comments.">Email</Switch>
      <Switch labelPosition="start">Push notifications</Switch>
      <Switch labelPosition="start" defaultSelected>Weekly summary</Switch>
    </div>
  ),
};

function SavingDemo() {
  const [on, setOn] = useState(false);
  const [saving, setSaving] = useState(false);
  return (
    <Switch
      isSelected={on}
      isLoading={saving}
      onChange={(value) => {
        setSaving(true);
        setTimeout(() => {
          setOn(value);
          setSaving(false);
        }, 1200);
      }}
      description="Simulates a request to the server (1.2 s)."
    >
      Auto-save
    </Switch>
  );
}

export const WhileSaving: Story = { decorators: narrow, name: 'While saving', render: () => <SavingDemo /> };

export const InteractionTest: Story = {
  ...interactionTest,
  decorators: narrow,
  play: async ({ canvas, userEvent, args }) => {
    const sw = canvas.getByRole('switch', { name: 'Email notifications' });
    await userEvent.click(canvas.getByText('Email notifications'));
    await expect(sw).toBeChecked();
    await userEvent.keyboard(' ');
    await expect(sw).not.toBeChecked();
    await expect(args.onChange).toHaveBeenCalledTimes(2);
  },
};
