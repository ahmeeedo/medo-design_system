import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Globe, MapPin } from 'lucide-react';
import { Select } from './Select';
import { ListBoxSection, Option } from '../listbox/ListBox';
import { LightDark, slot, stack } from '../story-helpers';

const countries = [
  { id: 'de', name: 'Germany' },
  { id: 'at', name: 'Austria' },
  { id: 'ch', name: 'Switzerland' },
  { id: 'nl', name: 'Netherlands' },
  { id: 'fr', name: 'France' },
  { id: 'it', name: 'Italy' },
  { id: 'es', name: 'Spain' },
  { id: 'pl', name: 'Poland' },
];

const topics = ['Design', 'Code', 'Research', 'Marketing', 'Sales', 'Support'].map((name) => ({ id: name.toLowerCase(), name }));


const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  args: {
    label: 'Country',
    description: 'Used for shipping and taxes.',
    placeholder: 'Select…',
    size: 'md',
    selectionMode: 'single',
    leadingIcon: 'none',
    clearable: false,
    isRequired: false,
    isDisabled: false,
    isReadOnly: false,
    isInvalid: false,
    errorMessage: 'Choose a country.',
    onChange: fn(),
    children: null,
  },
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    placeholder: { control: 'text', description: 'Hint while empty. Clear the value to see it.' },
    errorMessage: { control: 'text', if: { arg: 'isInvalid', truthy: true } },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    selectionMode: { control: 'inline-radio', options: ['single', 'multiple'] },
    leadingIcon: slot({ none: undefined, globe: <Globe />, pin: <MapPin /> }),
    clearable: { control: 'boolean', if: { arg: 'selectionMode', eq: 'single' }, description: 'Single only: clear button for optional fields. Multi always has clear-all.' },
    children: { control: false },
    items: { control: false },
    onChange: { control: false },
  },
  parameters: {
    medo: { code: 'C08', subtitle: 'Choose one or several values from a list. Same anatomy as Input, plus a chevron.', figma: '122:1109' },
    docs: {
      description: {
        component:
          'Built on React Aria Select with a hidden native select, so the value is submitted and autofill and validation keep working. ' +
          'Always with a visible label. 2–4 options: Radio · 5–10: Select · more: Combobox. ' +
          'Multi shows the values as tags in one line (overflow „+N“) and always offers clear-all; tags are display only – remove by unchecking. ' +
          'Styles: `medo-select`, `medo-input medo-select__field`, list: `medo-listbox`.',
      },
    },
  },
  render: (args) => (
    /* key: switching single ↔ multiple needs a fresh component (different value type). */
    <Select
      key={args.selectionMode}
      /* A value from the start, so clear button and tags are visible. */
      defaultValue={args.selectionMode === 'multiple' ? ['de', 'at', 'ch'] : 'de'}
      {...args}
      items={countries}
    >
      {(item) => <Option id={item.id}>{item.name}</Option>}
    </Select>
  ),
  /* Fields fill their container: realistic form width; stories with parameters.width set their own. */
  decorators: [(Story, { parameters }) => <div style={{ maxInlineSize: parameters.width ?? '20rem' }}>{Story()}</div>],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  parameters: { docs: { description: { story: 'Placeholder, value, error, disabled and read-only. Read-only can be read and focused, but not changed.' } } },
  render: () => (
    <div style={stack}>
      <Select label="Empty" items={countries}>
        {(item) => <Option id={item.id}>{item.name}</Option>}
      </Select>
      <Select label="With value" defaultValue="de" clearable items={countries}>
        {(item) => <Option id={item.id}>{item.name}</Option>}
      </Select>
      <Select label="Error" isInvalid errorMessage="Choose a country." items={countries}>
        {(item) => <Option id={item.id}>{item.name}</Option>}
      </Select>
      <Select label="Disabled" isDisabled defaultValue="de" items={countries}>
        {(item) => <Option id={item.id}>{item.name}</Option>}
      </Select>
      <Select label="Read-only" isReadOnly defaultValue="de" items={countries}>
        {(item) => <Option id={item.id}>{item.name}</Option>}
      </Select>
    </div>
  ),
};

export const Sizes: Story = {
  parameters: { docs: { description: { story: 'Same sizes as Input: sm 32, md 40, lg 48. On mobile only lg (it opens the lg list).' } } },
  render: () => (
    <div style={stack}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Select key={size} label={`Size ${size}`} size={size} defaultValue="de" items={countries}>
          {(item) => <Option id={item.id}>{item.name}</Option>}
        </Select>
      ))}
    </div>
  ),
};

export const Multiple: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Tags in one line, overflow as „+N“; the field height stays the same. The list stays open, checkboxes on the left. Clear-all is always there.',
      },
    },
  },
  render: () => (
    <div style={stack}>
      <Select label="Topics" selectionMode="multiple" defaultValue={['design', 'code', 'research', 'marketing']} items={topics}>
        {(item) => <Option id={item.id}>{item.name}</Option>}
      </Select>
      <Select label="Topics" size="lg" selectionMode="multiple" defaultValue={['design', 'code']} items={topics}>
        {(item) => <Option id={item.id}>{item.name}</Option>}
      </Select>
    </div>
  ),
};

export const Groups: Story = {
  name: 'Groups and icons',
  parameters: { docs: { description: { story: 'Options with icon, description, group headings (divided by a line). Open it to see the list.' } } },
  render: () => (
    <Select label="Shipping region" leadingIcon={<Globe />} defaultValue="de">
      <ListBoxSection title="Europe">
        <Option id="de">Germany</Option>
        <Option id="at" description="Prices incl. 20 % VAT">
          Austria
        </Option>
      </ListBoxSection>
      <ListBoxSection title="Other">
        <Option id="row" description="Shipped from the Netherlands">
          Rest of the world
        </Option>
      </ListBoxSection>
    </Select>
  ),
};

export const LightAndDark: Story = {
  name: 'Light and Dark',
  parameters: { layout: 'fullscreen', width: 'none' },
  render: () => (
    <LightDark>
      <Select label="Country" defaultValue="de" clearable items={countries}>
        {(item) => <Option id={item.id}>{item.name}</Option>}
      </Select>
      <Select label="Topics" selectionMode="multiple" defaultValue={['design', 'code', 'research']} items={topics}>
        {(item) => <Option id={item.id}>{item.name}</Option>}
      </Select>
      <Select label="Country" isInvalid errorMessage="Choose a country." items={countries}>
        {(item) => <Option id={item.id}>{item.name}</Option>}
      </Select>
    </LightDark>
  ),
};
