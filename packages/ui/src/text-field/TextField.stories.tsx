import type React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { useState } from 'react';
import { Eye, EyeOff, Mail, Search } from 'lucide-react';
import { InputAction, TextField } from './TextField';
import { interactionTest, slot, stack } from '../story-helpers';

const meta = {
  title: 'Components/Forms/Text Field',
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
    medo: {
      subtitle: 'Label, input and helper or error text as one unit.',
      usage: {
        when: ['Short free text: names, emails, search terms.', 'Longer text with `multiline` (Textarea).'],
        whenNot: [
          'Choosing from known values: use Select or Combobox.',
          'Numbers with steps: use a NumberField.',
          'Dates and times: use Date & Time.',
        ],
        do: [
          'Always show a label; use the placeholder only for an example.',
          'Set the right `type` and `autoComplete`, so keyboards and autofill help.',
          'Validate on blur or submit and say how to fix the error.',
          'Use size lg on mobile and touch.',
        ],
        dont: ['Use the placeholder as the label.', 'Show errors while the user is still typing.', 'Disable copy and paste.'],
      },
      a11y: {
        keyboard: [
          ['Tab', 'Moves the focus to the field.'],
          ['Enter', 'Submits the surrounding form (single line).'],
        ],
        notes: [
          'Label, description and error text are linked to the input.',
          'An error disappears as soon as the input is valid; new errors show on blur or submit.',
          '`characterLimit` shows a counter and announces the remaining characters after a pause.',
          'Size lg uses 16 px text, which prevents the zoom on iOS.',
        ],
      },
      styling: {
        classes: [
          ['medo-field', 'Wrapper with label, input and footer.'],
          ['medo-field__label, __footer, __description, __error', 'Label and helper texts.'],
          ['medo-input medo-input--{size}', 'The input frame; `sm`, `md`, `lg`.'],
          ['medo-input__control, __icon, __action', 'Input, leading icon, trailing action.'],
          ['medo-textarea', 'Multi-line field.'],
        ],
        states: ['data-hovered', 'data-focus-visible', 'data-invalid', 'data-disabled'],
      },
    },
    docs: {
      description: {
        component:
          'Label, input and helper or error text. ' +
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

export const InteractionTest: Story = {
  ...interactionTest,
  decorators: narrow,
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('textbox', { name: 'Email' });
    // Label and helper text are wired up for screen readers.
    await expect(input).toHaveAccessibleDescription('We only use it for the login.');
    await userEvent.type(input, 'name@example.com');
    await expect(input).toHaveValue('name@example.com');
  },
};
