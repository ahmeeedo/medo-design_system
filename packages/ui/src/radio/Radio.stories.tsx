import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio, RadioGroup } from './Radio';
import { fn } from 'storybook/test';
import { LightDark } from '../story-helpers';

const meta = {
  title: 'Components/Radio',
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
    medo: { code: 'C11', subtitle: 'Pick exactly one of 2–4 visible options. From 5 options use Select.', figma: '143:58' },
    docs: {
      description: {
        component:
          'Pick exactly one of 2–4 visible options (5 or more: Select). Figma: **C11 Radio**. ' +
          'Arrow keys move and select. Built on React Aria `RadioGroup` + `RadioField`.',
      },
    },
  },
  /* key: defaultValue only applies on mount, so remount when it changes. */
  render: (args) => (
    <RadioGroup key={String(args.defaultValue)} {...args}>
      <Radio value="standard" description="3–5 working days">Standard</Radio>
      <Radio value="express" description="Next working day">Express</Radio>
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

export const LightAndDark: Story = {
  name: 'Light and Dark',
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <LightDark>
      <RadioGroup {...args}>
        <Radio value="standard">Standard</Radio>
        <Radio value="express">Express</Radio>
        <Radio value="pickup" isDisabled>Pick-up (unavailable)</Radio>
      </RadioGroup>
    </LightDark>
  ),
};
