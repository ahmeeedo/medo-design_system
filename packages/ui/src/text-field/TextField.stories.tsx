import type React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Eye, EyeOff, Mail, Search } from 'lucide-react';
import { InputAction, TextField } from './TextField';
import { LightDark, slot, stack } from '../story-helpers';

const meta = {
  title: 'Components/Text Field',
  component: TextField,
  tags: ['autodocs'],
  args: {
    label: 'Email',
    placeholder: 'name@example.com',
    description: 'We only use it for the login.',
    size: 'md',
    isRequired: false,
    isDisabled: false,
    isReadOnly: false,
    isInvalid: false,
    errorMessage: 'Enter a valid email address.',
    leadingIcon: 'none',
    trailing: 'none',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
    description: { control: 'text' },
    errorMessage: { control: 'text', if: { arg: 'isInvalid', truthy: true } },
    leadingIcon: slot({ none: undefined, search: <Search />, mail: <Mail /> }),
    trailing: slot({ none: undefined, 'show password': <InputAction aria-label="Show password" icon={<Eye />} /> }),
  },
  parameters: {
    medo: { code: 'C03 + C04', subtitle: 'Label, input and helper or error text as one unit.', figma: '81:9' },
    docs: {
      description: {
        component:
          'Label, input and helper or error text. Figma: **C04 Field + C03 Input / C13 Textarea**. ' +
          'Always a visible label (a placeholder is no label). On mobile and touch use size **lg** (16 px text prevents iOS zoom). ' +
          'Built on React Aria `TextField`: label, description and error are connected for screen readers automatically.',
      },
    },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Fields fill their container: keep the demos at a realistic form width. */
const narrow = [(Story: () => React.ReactElement) => <div style={{ maxInlineSize: '24rem' }}><Story /></div>];

export const Playground: Story = { decorators: narrow };

export const Sizes: Story = {
  decorators: narrow,
  render: (args) => (
    <div style={stack}>
      <TextField {...args} size="sm" label="Small (32)" />
      <TextField {...args} size="md" label="Medium (40)" />
      <TextField {...args} size="lg" label="Large (48, mobile)" />
    </div>
  ),
};

export const States: Story = {
  decorators: narrow,
  render: (args) => (
    <div style={stack}>
      <TextField {...args} label="Default" />
      <TextField {...args} label="Required" isRequired />
      <TextField {...args} label="Invalid" defaultValue="name@" isInvalid />
      <TextField {...args} label="Read-only" defaultValue="anna@example.com" isReadOnly />
      <TextField {...args} label="Disabled" defaultValue="anna@example.com" isDisabled />
    </div>
  ),
};

function PasswordField() {
  const [visible, setVisible] = useState(false);
  return (
    <TextField
      label="Password"
      type={visible ? 'text' : 'password'}
      description="At least 12 characters."
      trailing={
        <InputAction
          aria-label={visible ? 'Hide password' : 'Show password'}
          icon={visible ? <EyeOff /> : <Eye />}
          onPress={() => setVisible((v) => !v)}
        />
      }
    />
  );
}

export const IconsAndActions: Story = {
  decorators: narrow,
  name: 'Icons and actions',
  render: () => (
    <div style={stack}>
      <TextField label="Search" placeholder="Search projects" leadingIcon={<Search />} type="search" />
      <TextField label="Email" placeholder="name@example.com" leadingIcon={<Mail />} type="email" />
      <PasswordField />
    </div>
  ),
};

export const Textarea: Story = {
  decorators: narrow,
  render: () => (
    <div style={stack}>
      <TextField
        label="Message"
        multiline
        placeholder="e.g. goals, timeline, budget"
        description="Grows with the text up to 8 lines."
        characterLimit={200}
      />
    </div>
  ),
};

export const LightAndDark: Story = {
  name: 'Light and Dark',
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <LightDark>
      <TextField {...args} label="Default" />
      <TextField {...args} label="Invalid" defaultValue="name@" isInvalid />
      <TextField {...args} label="Disabled" defaultValue="anna@example.com" isDisabled />
    </LightDark>
  ),
};
