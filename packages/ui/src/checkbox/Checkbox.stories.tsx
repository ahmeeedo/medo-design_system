import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox, CheckboxGroup } from './Checkbox';
import { expect, fn } from 'storybook/test';
import { interactionTest, stack } from '../story-helpers';

const meta = {
  title: 'Components/Forms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: { children: 'Accept the terms', size: 'md', isDisabled: false, isInvalid: false, isIndeterminate: false, onChange: fn() },
  argTypes: { size: { control: 'inline-radio', options: ['md', 'lg'] }, onChange: { control: false }, children: { control: 'text' }, description: { control: 'text' } },
  parameters: {
    medo: {
      subtitle: 'Select one or several independent options.',
      usage: {
        when: ['Agree to something, e.g. terms.', 'Pick several independent options from a short list (`CheckboxGroup`).'],
        whenNot: [
          'Exactly one of several options: use Radio.',
          'A setting with immediate effect: use a Switch.',
          'Many options: use a Select with `selectionMode="multiple"`.',
        ],
        do: [
          'Write labels as positive statements: “Send me updates”.',
          'Use the indeterminate state for “select all” when only some items are selected.',
          'Give a group a label, or `aria-label` where the context names it.',
        ],
        dont: ['Use a checkbox to start an action.', 'Disable options without saying why.'],
      },
      a11y: {
        keyboard: [
          ['Tab', 'Moves to the next checkbox.'],
          ['Space', 'Checks or unchecks it.'],
        ],
        notes: [
          'The whole row incl. label is clickable.',
          'A real checkbox input: forms and validation keep working.',
          'Description and error texts are linked to the checkbox.',
        ],
      },
      styling: {
        classes: [
          ['medo-choice medo-checkbox', 'One checkbox row; `medo-choice--lg` for touch.'],
          ['medo-choice__button', 'Clickable row: box and label.'],
          ['medo-choice__control', 'The box with check or dash.'],
          ['medo-choice__description', 'Helper text below the label.'],
          ['medo-field medo-field--group', 'Group with label and options.'],
        ],
        states: [
          'data-selected',
          'data-indeterminate',
          'data-hovered',
          'data-pressed',
          'data-focus-visible',
          'data-invalid',
          'data-disabled',
          'data-readonly',
        ],
      },
    },
    docs: {
      description: {
        component:
          'Select one or more options. The whole row incl. label is clickable. ' +
          'Use a CheckboxGroup for several options with one label. Built on React Aria `CheckboxField`.',
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: (args) => (
    <div style={stack}>
      <Checkbox {...args}>Unchecked</Checkbox>
      <Checkbox {...args} defaultSelected>
        Checked
      </Checkbox>
      <Checkbox {...args} isIndeterminate>
        Indeterminate (some children selected)
      </Checkbox>
      <Checkbox {...args} description="A second line explains the option.">
        With description
      </Checkbox>
      <Checkbox {...args} isInvalid>
        Invalid
      </Checkbox>
      <Checkbox {...args} isDisabled>
        Disabled
      </Checkbox>
      <Checkbox {...args} isDisabled defaultSelected>
        Disabled and checked
      </Checkbox>
      <Checkbox {...args} size="lg" defaultSelected>
        Large (mobile)
      </Checkbox>
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <CheckboxGroup label="Notifications" description="Select all that apply." defaultValue={['email']} isRequired>
      <Checkbox value="email">Email</Checkbox>
      <Checkbox value="push">Push notification</Checkbox>
      <Checkbox value="sms" description="Costs may apply.">
        SMS
      </Checkbox>
    </CheckboxGroup>
  ),
};

export const GroupInvalid: Story = {
  name: 'Group invalid',
  render: () => (
    <CheckboxGroup label="Topics" isInvalid errorMessage="Select at least one topic." description="Select all that apply.">
      <Checkbox value="design">Design</Checkbox>
      <Checkbox value="code">Code</Checkbox>
    </CheckboxGroup>
  ),
};

export const InteractionTest: Story = {
  ...interactionTest,
  play: async ({ canvas, userEvent, args }) => {
    const box = canvas.getByRole('checkbox', { name: 'Accept the terms' });
    await userEvent.click(canvas.getByText('Accept the terms'));
    await expect(box).toBeChecked();
    await userEvent.keyboard(' ');
    await expect(box).not.toBeChecked();
    await expect(args.onChange).toHaveBeenLastCalledWith(false);
  },
};
