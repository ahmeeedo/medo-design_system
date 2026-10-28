import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio, RadioGroup } from './Radio';
import { expect, fn } from 'storybook/test';
import { interactionTest } from '../story-helpers';

const meta = {
  title: 'Components/Forms/Radio',
  component: RadioGroup,
  tags: ['autodocs'],
  args: {
    label: 'Delivery',
    description: 'Choose one option.',
    defaultValue: 'standard',
    size: 'md',
    orientation: 'vertical',
    isDisabled: false,
    isInvalid: false,
    errorMessage: 'Choose a delivery option.',
    children: null,
    onChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['md', 'lg'] },
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    children: { control: false },
    label: { control: 'text' },
    description: { control: 'text' },
    errorMessage: { control: 'text', if: { arg: 'isInvalid', truthy: true } },
    defaultValue: { control: 'inline-radio', options: ['standard', 'express', 'pickup'] },
    onChange: { control: false },
  },
  parameters: {
    medo: {
      subtitle: 'Pick exactly one of 2–4 visible options. From 5 options use Select.',
      usage: {
        when: ['Pick exactly one of 2–4 options that should all be visible.', 'The difference between the options needs a short description.'],
        whenNot: [
          '5 or more options: use a Select.',
          'A single on / off option: use a Checkbox or a Switch.',
          'Switching views: use a Toggle Button group.',
        ],
        do: [
          'Preselect a sensible default when there is one.',
          'Order the options logically: by size, frequency or time.',
          'Use horizontal layout only for 2–3 short options.',
        ],
        dont: ['Use radios for actions.', 'Leave a group without a label.'],
      },
      a11y: {
        keyboard: [
          ['Tab', 'Moves into the group, to the selected option.'],
          ['↑ ↓ / ← →', 'Moves to the next option and selects it.'],
        ],
        notes: [
          'The group is announced with its label, the number of options and the selected one.',
          'A selection cannot be removed again – add a “None” option if needed.',
          'Real radio inputs: forms and validation keep working.',
        ],
      },
      styling: {
        classes: [
          ['medo-field medo-field--group', 'Group with label and options.'],
          ['medo-choice medo-radio', 'One option; `medo-choice--lg` for touch.'],
          ['medo-choice__button, __control, __description', 'Row, circle and helper text.'],
        ],
        states: ['data-selected', 'data-hovered', 'data-pressed', 'data-focus-visible', 'data-invalid', 'data-disabled', 'data-readonly'],
      },
    },
    docs: {
      description: {
        component:
          'Pick exactly one of 2–4 visible options (5 or more: Select). ' +
          'Arrow keys move and select. Built on React Aria `RadioGroup` + `RadioField`.',
      },
    },
  },
  /* key: defaultValue only applies on mount, so remount when it changes. */
  render: (args) => (
    <RadioGroup key={String(args.defaultValue)} {...args}>
      <Radio value="standard" description="3–5 working days">
        Standard
      </Radio>
      <Radio value="express" description="Next working day">
        Express
      </Radio>
      <Radio value="pickup">Pick-up</Radio>
    </RadioGroup>
  ),
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Horizontal: Story = { args: { orientation: 'horizontal', description: undefined } };

export const Invalid: Story = { args: { isInvalid: true, defaultValue: undefined } };

export const Large: Story = { args: { size: 'lg' } };

export const InteractionTest: Story = {
  ...interactionTest,
  play: async ({ canvas, userEvent, args }) => {
    const standard = canvas.getByRole('radio', { name: /Standard/ });
    await expect(standard).toBeChecked();
    // Tab enters on the selected option, arrow keys move and select.
    await userEvent.tab();
    await expect(standard).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('radio', { name: /Express/ })).toBeChecked();
    await expect(args.onChange).toHaveBeenLastCalledWith('express');
  },
};
