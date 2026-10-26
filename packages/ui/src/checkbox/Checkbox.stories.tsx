import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox, CheckboxGroup } from './Checkbox';
import { expect, fn } from 'storybook/test';
import { interactionTest, LightDark, stack } from '../story-helpers';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: { children: 'Accept the terms', size: 'md', isDisabled: false, isInvalid: false, isIndeterminate: false, onChange: fn() },
  argTypes: { size: { control: 'inline-radio', options: ['md', 'lg'] }, onChange: { control: false }, children: { control: 'text' }, description: { control: 'text' } },
  parameters: {
    medo: { code: 'C05', subtitle: 'Select one or several independent options.', figma: '102:79' },
    docs: {
      description: {
        component:
          'Select one or more options. Figma: **C05 Checkbox**. The whole row incl. label is clickable. ' +
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

export const LightAndDark: Story = {
  name: 'Light and Dark',
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <LightDark>
      <Checkbox {...args}>Unchecked</Checkbox>
      <Checkbox {...args} defaultSelected>
        Checked
      </Checkbox>
      <Checkbox {...args} isIndeterminate>
        Indeterminate
      </Checkbox>
      <Checkbox {...args} isInvalid>
        Invalid
      </Checkbox>
      <Checkbox {...args} isDisabled defaultSelected>
        Disabled
      </Checkbox>
    </LightDark>
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
