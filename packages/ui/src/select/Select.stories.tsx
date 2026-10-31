import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Key } from 'react-aria-components';
import { expect, fn, waitFor, within } from 'storybook/test';
import { ArrowUpDown, Globe, MapPin } from 'lucide-react';
import { Select } from './Select';
import { ListBoxSection, Option } from '../listbox/ListBox';
import { interactionTest, slot, stack } from '../story-helpers';

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
  title: 'Components/Forms/Select',
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
    clearable: {
      control: 'boolean',
      if: { arg: 'selectionMode', eq: 'single' },
      description: 'Single only: clear button for optional fields. Multi always has clear-all.',
    },
    children: { control: false },
    items: { control: false },
    onChange: { control: false },
    overlay: {
      control: 'inline-radio',
      options: ['auto', 'popover', 'sheet', 'native'],
      description: 'auto: popover on desktop; below 640 px native picker (single) or Bottom Sheet (multi).',
    },
    commit: { control: 'inline-radio', options: ['live', 'onClose'], if: { arg: 'selectionMode', eq: 'multiple' } },
    onApply: { control: false },
    resultLabel: { control: false },
  },
  parameters: {
    a11y: {
      // label-content-name-mismatch is an experimental axe rule: options read their label as the name and the
      // second line as description (aria-describedby) – correct, but the rule counts all visible text.
      config: { rules: [{ id: 'landmark-unique', enabled: false }, { id: 'label-content-name-mismatch', enabled: false }] },
    },
    medo: {
      subtitle: 'Choose one or several values from a list.',
      usage: {
        when: ['Choose one value from about 5–10 options.', 'Choose several values in a compact field (`selectionMode="multiple"`).'],
        whenNot: [
          '2–4 options: use Radio, so all choices are visible at once.',
          'More than 10 options or a search: use a Combobox.',
          'A list of actions: use a Menu.',
        ],
        do: [
          'Always show a label. Use `aria-label` only in filter bars where the context names the field.',
          'Order the options in a way users expect: alphabetical, by size or by frequency.',
          'Use `clearable` when a single value is optional.',
        ],
        dont: ['Put information into the placeholder that users still need after choosing.', 'Use a Select to navigate between pages.'],
      },
      a11y: {
        keyboard: [
          ['Enter / Space / ↓', 'Opens the list.'],
          ['↑ / ↓', 'Moves through the options.'],
          ['Home / End', 'First or last option.'],
          ['Letters', 'Jumps to the matching option.'],
          ['Enter', 'Picks the option. Single closes the list, multiple stays open.'],
          ['Esc', 'Closes the list.'],
        ],
        notes: [
          'A hidden native select carries the value: it is submitted with the form, and autofill and validation keep working.',
          'Below 640 px a single Select opens the system picker, a multiple Select a Bottom Sheet.',
          'Help and error texts are linked to the field and read with it.',
          'Multiple: the values show as tags in one line (“+N” when they do not fit). Tags are display only; uncheck an option to remove it.',
        ],
      },
      styling: {
        classes: [
          ['medo-select', 'Wrapper with label, field and help text.'],
          ['medo-input medo-select__field', 'The field. Same look and sizes as a Text Field.'],
          ['medo-select__value', 'Selected value or placeholder.'],
          ['medo-select__tags', 'Tags of a multiple Select.'],
          ['medo-select__clear', 'Clear button.'],
          ['medo-listbox, medo-option', 'The list (see Listbox).'],
        ],
        states: ['data-open', 'data-placeholder', 'data-focus-visible', 'data-invalid', 'data-disabled', 'data-readonly'],
      },
    },
    docs: {
      description: {
        component:
          'A field that opens a list of options. Built on React Aria Select. Same anatomy and sizes as a Text Field, plus a chevron.',
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
        story: 'Tags in one line, overflow as “+N”; the field height stays the same. The list stays open, checkboxes on the left. Clear-all is always there.',
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

/** Fake result count for the filter demo: 37 people per team. */
function TeamFilter() {
  const [applied, setApplied] = useState<Key[]>([]);
  return (
    <div style={stack}>
      <Select
        label="Team"
        selectionMode="multiple"
        overlay="sheet"
        commit="onClose"
        items={topics}
        onApply={setApplied}
        resultLabel={(value) => (value.length ? `Show ${value.length * 37} results` : 'Show all results')}
      >
        {(item) => <Option id={item.id}>{item.name}</Option>}
      </Select>
      <p role="status" style={{ margin: 0, font: 'var(--medo-typography-body-sm)', color: 'var(--medo-color-text-secondary)' }}>
        Applied filter: {applied.length ? applied.join(', ') : 'none'}
      </p>
    </div>
  );
}

export const Mobile: Story = {
  name: 'On mobile',
  parameters: {
    docs: {
      description: {
        story:
          'Below 640 px (`overlay="auto"`) a simple Select uses the system picker, multi opens a Bottom Sheet. Forced here with `overlay`. ' +
          '**Live** (forms): “3 selected” + Done. **On close** (filters): `onApply` runs once when the sheet closes – any way – if the selection changed; ' +
          'the primary button shows the result count, Reset sits below.',
      },
    },
  },
  render: () => (
    <div style={stack}>
      <Select label="Country (native picker)" overlay="native" defaultValue="de" items={countries}>
        {(item) => <Option id={item.id}>{item.name}</Option>}
      </Select>
      <Select label="Topics (sheet, live)" selectionMode="multiple" overlay="sheet" defaultValue={['design', 'code']} items={topics}>
        {(item) => <Option id={item.id}>{item.name}</Option>}
      </Select>
      <TeamFilter />
    </div>
  ),
};

export const WithoutVisibleLabel: Story = {
  name: 'Without visible label',
  parameters: {
    docs: {
      description: {
        story:
          'In filter bars and toolbars the context names the field: no visible label, `aria-label` instead and a placeholder that says what it filters (“Type”). Everywhere else keep the visible label.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--medo-layout-gap-inline)' }}>
      <Select aria-label="Type" placeholder="Type" size="sm" selectionMode="multiple">
        <Option id="pdf">PDF</Option>
        <Option id="word">Word</Option>
        <Option id="video">Video</Option>
      </Select>
      <Select aria-label="Sort by" size="sm" leadingIcon={<ArrowUpDown />} defaultValue="relevance">
        <Option id="relevance">Relevance</Option>
        <Option id="newest">Newest</Option>
      </Select>
    </div>
  ),
};

export const InteractionTest: Story = {
  ...interactionTest,
  play: async ({ canvas, userEvent, args }) => {
    const trigger = canvas.getByRole('button', { name: /Country/ });
    await expect(trigger).toHaveTextContent('Germany');
    trigger.focus();
    // ↓ opens the list; typing jumps; Enter picks and closes.
    await userEvent.keyboard('{ArrowDown}');
    const body = within(document.body);
    const list = await body.findByRole('listbox');
    await waitFor(() => expect(list).toContainElement(document.activeElement as HTMLElement));
    await userEvent.keyboard('Fra');
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(body.queryByRole('listbox')).toBeNull());
    await expect(trigger).toHaveTextContent('France');
    await expect(args.onChange).toHaveBeenLastCalledWith('fr');
  },
};
