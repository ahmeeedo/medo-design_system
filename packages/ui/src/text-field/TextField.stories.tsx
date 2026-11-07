import type React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { useState } from 'react';
import { Eye, EyeOff, Mail, Search } from 'lucide-react';
import { InputAction, TextField } from './TextField';
import { interactionTest, slot, spokenPhrases, stack, StateGrid } from '../story-helpers';

/**
 * What a screen reader says for the fields in the screen reader test (Virtual Screen Reader). The password field has
 * no role here – there is no ARIA role for it; real screen readers say “password” or “secure text field”. So its label
 * and its help text (after the button) are read on their own as well.
 */
const TEXT_FIELD_PHRASES = [
  'textbox, Email, We only use it for the login.',
  'textbox, Name, required',
  'textbox, Postcode, 1234, Enter a postcode with 5 digits, e.g. 12345., invalid',
  'textbox, Customer number, K-1042, read only',
  'textbox, Company, med.o, disabled',
  'Password',
  'Password, At least 12 characters.',
  'button, Show password',
  'At least 12 characters.',
];

const meta = {
  title: 'Components/Forms/Text Field',
  component: TextField,
  // locale-de: also tested in German (Vitest project “storybook-de”).
  tags: ['autodocs', 'locale-de', 'status:beta'],
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
        whenNot: ['Choosing from known values: use Select or Combobox.', 'Numbers with steps: use a NumberField.', 'Dates and times: use Date & Time.'],
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
          'Size lg uses 16 px text, which prevents the automatic zoom of mobile browsers when the field gets the focus.',
        ],
        // Steps for the manual test; simple components are also tested automatically (Guides / Screen reader testing).
        screenReader: {
          steps: [
            ['Go to the heading “Playground”, then to the field.', '“Email, edit text” (or text field), then “We only use it for the login.”'],
            ['Type “anna@example.com”, then move to the previous and next element.', 'The typed text is read back; nothing is announced twice.'],
            ['Go to the heading “States”, then to the field “Required”.', 'Its name and that it is required.'],
            ['Next field: “Invalid”.', 'That it is invalid, then “Enter a valid email address, e.g. name@example.com.”'],
            ['Next fields: “Read-only” and “Disabled”.', 'The value “anna@example.com”; read only for the first, dimmed or disabled for the second.'],
            [
              'Go to the heading “Icons and actions”, then to the password field and the button after it.',
              '“Password, secure text field” (or password), then “Show password, button”. Activate it: the button is now “Hide password”.',
            ],
          ],
          // Checked on every change by the test ScreenReaderTest (Virtual Screen Reader).
          automated: TEXT_FIELD_PHRASES,
        },
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
          'Always a visible label (a placeholder is no label). On mobile and touch use size **lg** (16 px text prevents the automatic zoom of mobile browsers). ' +
          'Built on React Aria `TextField`: label, description and error are connected for screen readers automatically.',
      },
    },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Fields fill their container: keep the demos at a realistic form width. */
const narrow = [
  (Story: () => React.ReactElement) => (
    <div style={{ maxInlineSize: '24rem' }}>
      <Story />
    </div>
  ),
];

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
      <TextField {...args} label="Invalid" defaultValue="name@" isInvalid errorMessage="Enter a valid email address, e.g. name@example.com." />
      <TextField {...args} label="Read-only" defaultValue="anna@example.com" isReadOnly />
      <TextField {...args} label="Disabled" defaultValue="anna@example.com" isDisabled />
    </div>
  ),
};

/** A plain HTML field with the classes and state attributes – the same CSS as the component. */
const plainField = (state: string, input: object = {}, attrs: object = {}) => (
  <div className="medo-field" style={{ inlineSize: '16rem' }}>
    <label className="medo-field__label">Email</label>
    <div className="medo-input medo-input--md" {...attrs}>
      <input className="medo-input__control" defaultValue="anna@example.com" aria-label={state} {...input} />
    </div>
  </div>
);

export const InteractiveStates: Story = {
  name: 'Interactive states',
  parameters: {
    docs: {
      description: {
        story:
          'Every state at a glance – a picture, rendered as plain HTML. Hover and focus follow the pointer and the focus; a preview or another framework sets `data-hovered` and `data-focused` on `medo-input`. To try the field, use the Playground.',
      },
    },
  },
  render: () => (
    <StateGrid
      states={[
        ['Default', plainField('Default')],
        ['Hover', plainField('Hover', {}, { 'data-hovered': '' })],
        ['Focus', plainField('Focus', {}, { 'data-focused': '' })],
        ['Invalid', plainField('Invalid', { 'aria-invalid': 'true' })],
        ['Read-only', plainField('Read-only', { readOnly: true })],
        ['Disabled', plainField('Disabled', { disabled: true })],
      ]}
    />
  ),
};

function PasswordField() {
  const [visible, setVisible] = useState(false);
  return (
    <TextField
      label="Password"
      type={visible ? 'text' : 'password'}
      description="At least 12 characters."
      trailing={<InputAction aria-label={visible ? 'Hide password' : 'Show password'} icon={visible ? <EyeOff /> : <Eye />} onPress={() => setVisible((v) => !v)} />}
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
      <TextField label="Message" multiline placeholder="e.g. goals, timeline, budget" description="Grows with the text up to 8 lines." characterLimit={200} />
    </div>
  ),
};

export const InteractionTest: Story = {
  ...interactionTest,
  // Literal, so the story index (and the tag filters of the test projects) see it too.
  tags: ['!autodocs'],
  decorators: narrow,
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('textbox', { name: 'Email' });
    // Label and helper text are wired up for screen readers.
    await expect(input).toHaveAccessibleDescription('We only use it for the login.');
    await userEvent.type(input, 'name@example.com');
    await expect(input).toHaveValue('name@example.com');
  },
};


export const ScreenReaderTest: Story = {
  ...interactionTest,
  tags: ['!autodocs', '!locale-de'],
  render: () => (
    <div style={stack}>
      <TextField label="Email" description="We only use it for the login." />
      <TextField label="Name" isRequired />
      <TextField label="Postcode" defaultValue="1234" isInvalid errorMessage="Enter a postcode with 5 digits, e.g. 12345." />
      <TextField label="Customer number" defaultValue="K-1042" isReadOnly />
      <TextField label="Company" defaultValue="med.o" isDisabled />
      <PasswordField />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(await spokenPhrases(canvasElement)).toEqual(TEXT_FIELD_PHRASES);
  },
};
