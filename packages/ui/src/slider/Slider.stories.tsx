import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { Slider, SliderField } from './Slider';
import { NumberField } from '../number-field/NumberField';
import { interactionTest, Examples, semantic } from '../story-helpers';

const box: React.CSSProperties = { maxInlineSize: '20rem' };
const percent = { style: 'percent', maximumFractionDigits: 0 } as const;
const euro = { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 } as const;

const meta = {
  title: 'Components/Forms/Slider',
  component: Slider,
  tags: ['autodocs'],
  args: {
    label: 'Volume',
    showValue: true,
    defaultValue: 0.4,
    minValue: 0,
    maxValue: 1,
    step: 0.01,
    formatOptions: percent,
    showTicks: false,
    showMinMax: false,
    isDisabled: false,
    onChange: fn(),
    onChangeEnd: fn(),
  },
  argTypes: {
    label: { control: 'text' },
    showTicks: { control: 'boolean', description: 'Only for ≤ 10 steps – here with step 0.2.' },
    showMinMax: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    showValue: { control: 'boolean' },
    defaultValue: { control: false },
    minValue: { control: false },
    maxValue: { control: false },
    step: { control: false },
    formatOptions: { control: false },
    thumbLabels: semantic,
    'aria-label': semantic,
    onChange: { control: false },
    onChangeEnd: { control: false },
  },
  parameters: {
    medo: { subtitle: 'Pick an approximate value or range by dragging – volume, radius, price filters.' },
    docs: {
      description: {
        component:
          'React Aria Slider. Single or range (`defaultValue={[120, 480]}`). The value is always shown next to the label and read out in the same format (`formatOptions`, Intl). ' +
          'Track 4 px, fill action/primary, thumb 20 px with a 44 px hit area; hover and pressed show a halo, while dragging a tooltip repeats the value. Arrow keys one step, Page Up/Down 10 %, Home/End; a click on the track moves the nearest thumb; range thumbs never cross and get their own names (“Minimum price”). ' +
          'Ticks only for ≤ 10 steps. **SliderField** adds number inputs for exact values; **NumberField** is the number input on its own (Input look, Intl format, clamps on blur). Update the value while dragging, apply expensive filters on `onChangeEnd`. Styles: `medo-slider`, `medo-slider-field`.',
      },
    },
  },
  render: (args) => (
    <div style={box}>
      <Slider {...args} step={args.showTicks ? 0.2 : args.step} />
    </div>
  ),
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const SingleAndRange: Story = {
  name: 'Single and range',
  parameters: { docs: { description: { story: 'Single for one value, range for from–to. Drag a thumb: the tooltip repeats the value above it.' } } },
  render: () => (
    <Examples>
      <div style={box}>
        <Slider label="Volume" defaultValue={0.4} maxValue={1} step={0.01} formatOptions={percent} />
      </div>
      <div style={box}>
        <Slider label="Price" defaultValue={[120, 480]} maxValue={1000} step={10} formatOptions={euro} thumbLabels={['Minimum price', 'Maximum price']} />
      </div>
      <div style={box}>
        <Slider label="Volume" defaultValue={0.4} maxValue={1} step={0.01} formatOptions={percent} isDisabled />
      </div>
    </Examples>
  ),
};

export const TicksAndLimits: Story = {
  name: 'Ticks and limits',
  parameters: {
    docs: { description: { story: 'Ticks only for few fixed steps (≤ 10) – the thumb snaps to them. Min/max labels when the range is not obvious from the label.' } },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--medo-space-8)', ...box }}>
      <Slider label="Rating" defaultValue={2} minValue={0} maxValue={5} showTicks formatOptions={{ style: 'decimal' }} />
      <Slider label="Price" defaultValue={[120, 480]} maxValue={1000} step={10} formatOptions={euro} showMinMax thumbLabels={['Minimum price', 'Maximum price']} />
      <Slider label="Radius" defaultValue={40} maxValue={100} step={5} formatOptions={{ style: 'unit', unit: 'kilometer' }} showMinMax />
    </div>
  ),
};

function Fields() {
  const [volume, setVolume] = useState(40);
  const [price, setPrice] = useState([120, 480]);
  return (
    <div style={{ display: 'grid', gap: 'var(--medo-space-8)', maxInlineSize: '25rem' }}>
      <SliderField label="Volume" value={volume} onChange={setVolume} maxValue={100} />
      <SliderField label="Price" value={price} onChange={setPrice} maxValue={1000} step={10} formatOptions={euro} thumbLabels={['Minimum price', 'Maximum price']} />
    </div>
  );
}

export const Field: Story = {
  name: 'Slider field',
  parameters: {
    docs: {
      description: {
        story:
          'Slider plus number input when users may need an exact value (price filters, settings). Both stay in sync; the inputs validate on blur and clamp to min/max (and to each other in a range).',
      },
    },
  },
  render: () => <Fields />,
};

export const Number: Story = {
  name: 'Number field',
  parameters: {
    docs: {
      description: {
        story:
          'The number input on its own: the Input look, formatted with Intl, clamps to min/max and rounds to the step on blur; ↑ ↓ change by one step. Tabular figures.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--medo-space-6)', maxInlineSize: '15rem' }}>
      <NumberField label="Quantity" defaultValue={2} minValue={1} maxValue={99} description="1 to 99" />
      <NumberField label="Budget" defaultValue={2400} minValue={0} step={100} formatOptions={euro} />
      <NumberField label="Discount" defaultValue={0.15} minValue={0} maxValue={1} step={0.05} formatOptions={percent} />
    </div>
  ),
};

export const InteractionTest: Story = {
  ...interactionTest,
  play: async ({ canvas, userEvent, args }) => {
    const thumb = canvas.getByRole('slider', { name: 'Volume' });
    await expect(thumb).toHaveAttribute('aria-valuetext', '40%');
    thumb.focus();
    // Arrow keys move one step, Page Up 10 %, End to the maximum.
    await userEvent.keyboard('{ArrowRight}');
    await expect(thumb).toHaveAttribute('aria-valuetext', '41%');
    await userEvent.keyboard('{PageUp}');
    await expect(thumb).toHaveAttribute('aria-valuetext', '51%');
    await userEvent.keyboard('{End}');
    await expect(thumb).toHaveAttribute('aria-valuetext', '100%');
    await expect(args.onChange).toHaveBeenLastCalledWith(1);
  },
};

export const NumberFieldTest: Story = {
  ...interactionTest,
  name: 'Interaction test: number field',
  render: () => <NumberField label="Quantity" defaultValue={2} minValue={1} maxValue={99} />,
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('textbox', { name: 'Quantity' });
    // Clamped to the maximum when the field is left.
    await userEvent.clear(input);
    await userEvent.type(input, '150');
    await userEvent.tab();
    await expect(input).toHaveValue('99');
    // ↓ changes it by one step.
    input.focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(input).toHaveValue('98');
  },
};
