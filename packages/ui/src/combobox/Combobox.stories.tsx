import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useAsyncList, type Key } from 'react-aria-components';
import { expect, fn, waitFor, within } from 'storybook/test';
import { Search, User } from 'lucide-react';
import { Combobox } from './Combobox';
import { Option } from '../listbox/ListBox';
import { interactionTest, slot, stack } from '../story-helpers';

type Person = { id: string; name: string; role: string };

const people: Person[] = [
  { id: 'mueller', name: 'Anna Müller', role: 'Design' },
  { id: 'lorenz', name: 'Ben Lorenz', role: 'Engineering' },
  { id: 'cetin', name: 'Can Çetin', role: 'Engineering' },
  { id: 'dietrich', name: 'Dana Dietrich', role: 'Research' },
  { id: 'eriksson', name: 'Erik Eriksson', role: 'Product' },
  { id: 'fischer', name: 'Fiona Fischer', role: 'Design' },
  { id: 'garcia', name: 'Gabriel García', role: 'Marketing' },
  { id: 'hansen', name: 'Hanna Hansen', role: 'Support' },
  { id: 'ilic', name: 'Ivan Ilić', role: 'Engineering' },
  { id: 'jensen', name: 'Julia Jensen', role: 'Sales' },
  { id: 'kaya', name: 'Kemal Kaya', role: 'Product' },
  { id: 'lehmann', name: 'Lea Lehmann', role: 'Design' },
];

const initialTags = ['Design', 'Code', 'Research', 'Marketing', 'Sales', 'Support'].map((name) => ({ id: name.toLowerCase(), name }));

const meta = {
  title: 'Components/Forms/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  args: {
    label: 'Assignee',
    description: 'Type a name, e.g. “mul”.',
    placeholder: 'Search…',
    size: 'md',
    selectionMode: 'single',
    leadingIcon: 'none',
    isRequired: false,
    isDisabled: false,
    isReadOnly: false,
    isInvalid: false,
    errorMessage: 'Choose a person.',
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
    leadingIcon: slot({ none: undefined, search: <Search />, user: <User /> }),
    children: { control: false },
    items: { control: false },
    defaultItems: { control: false },
    onChange: { control: false },
    isLoading: { control: false },
    noResultsMessage: { control: false },
    onCreate: { control: false },
    overlay: { control: 'inline-radio', options: ['auto', 'popover', 'sheet'], description: 'auto: popover on desktop, Bottom Sheet with search below 640 px.' },
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
      subtitle: 'A Select you can type into. Typing filters the list – for long lists, people, places or tags.',
      usage: {
        when: ['More than about 10 options: countries, people, places.', 'Users know what to type.', 'Tags with “Add …” for new values.'],
        whenNot: ['Fewer than about 10 options: use a Select.', 'Free text without suggestions: use a Text Field.', 'A site search: use Search.'],
        do: [
          'Show a label and, if helpful, a description of what can be searched.',
          'Use `isLoading` while results load from the server.',
          'Keep the list short; show the best matches first.',
        ],
        dont: ['Open the list on focus.', 'Allow values that are not in the list unless “Add …” is wanted.'],
      },
      a11y: {
        keyboard: [
          ['Letters', 'Filter the list.'],
          ['↓ / Alt + ↓', 'Opens the list.'],
          ['↑ / ↓', 'Moves through the options while the focus stays in the field.'],
          ['Enter', 'Picks the highlighted option.'],
          ['Esc', 'Closes the list.'],
          ['Backspace', 'Multiple: removes the last tag when the field is empty.'],
        ],
        notes: [
          'Screen readers hear how many options are available while typing.',
          'Leaving without a selection restores the last valid value.',
          'Matches are bold for sighted users only; the option name is read as usual.',
          'Below 640 px the list opens in a Bottom Sheet with its own search field.',
        ],
      },
      styling: {
        classes: [
          ['medo-field medo-combobox', 'Wrapper with label and field.'],
          ['medo-input medo-combobox__field', 'The field (Input look).'],
          ['medo-combobox__input', 'The text input.'],
          ['medo-combobox__tags-row, __more', 'Tags of a multiple Combobox and “+N”.'],
          ['medo-combobox__toggle', 'Chevron button.'],
          ['medo-listbox, medo-option', 'The list (see Listbox).'],
        ],
        states: ['data-open', 'data-hovered', 'data-invalid', 'data-disabled'],
      },
    },
    docs: {
      description: {
        component: 'Use a combobox when users choose from a long list by typing. Built on React Aria ComboBox; typing filters the list, the match is bold.',
      },
    },
  },
  render: (args) => (
    <Combobox
      key={args.selectionMode}
      /* A value from the start, so clear button and tags are visible. */
      defaultValue={args.selectionMode === 'multiple' ? ['mueller', 'lorenz', 'cetin', 'dietrich'] : 'mueller'}
      {...args}
      defaultItems={people}
    >
      {(item) => {
        const person = item as Person;
        return (
          <Option id={person.id} description={person.role}>
            {person.name}
          </Option>
        );
      }}
    </Combobox>
  ),
  /* Fields fill their container: realistic form width; stories with parameters.width set their own. */
  decorators: [(Story, { parameters }) => <div style={{ maxInlineSize: parameters.width ?? '22rem' }}>{Story()}</div>],
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  parameters: { docs: { description: { story: 'Same states as Select. Read-only shows the value without chevron and clear.' } } },
  render: () => (
    <div style={stack}>
      <Combobox label="Empty" defaultItems={people}>
        {(item) => <Option id={item.id}>{item.name}</Option>}
      </Combobox>
      <Combobox label="With value" defaultValue="fischer" defaultItems={people}>
        {(item) => <Option id={item.id}>{item.name}</Option>}
      </Combobox>
      <Combobox label="Error" isInvalid errorMessage="Choose a person." defaultItems={people}>
        {(item) => <Option id={item.id}>{item.name}</Option>}
      </Combobox>
      <Combobox label="Disabled" isDisabled defaultValue="fischer" defaultItems={people}>
        {(item) => <Option id={item.id}>{item.name}</Option>}
      </Combobox>
      <Combobox label="Read-only" isReadOnly defaultValue="fischer" defaultItems={people}>
        {(item) => <Option id={item.id}>{item.name}</Option>}
      </Combobox>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={stack}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Combobox key={size} label={`Size ${size}`} size={size} leadingIcon={<Search />} defaultItems={people}>
          {(item) => <Option id={item.id}>{item.name}</Option>}
        </Combobox>
      ))}
    </div>
  ),
};

export const Multiple: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Chosen values become tags, the caret sits after them; overflow as “+N”. The list stays open and uses checkboxes. ' +
          'Backspace in the empty input removes the last tag; Shift+Tab reaches the tags, Delete removes one.',
      },
    },
  },
  render: () => (
    <div style={stack}>
      <Combobox label="Reviewers" selectionMode="multiple" defaultValue={['mueller', 'lorenz']} defaultItems={people}>
        {(item) => <Option id={item.id}>{item.name}</Option>}
      </Combobox>
      <Combobox label="Reviewers" size="lg" selectionMode="multiple" defaultValue={['mueller', 'lorenz', 'cetin', 'dietrich']} defaultItems={people}>
        {(item) => <Option id={item.id}>{item.name}</Option>}
      </Combobox>
    </div>
  ),
};

function CreatableDemo() {
  const [tags, setTags] = useState(initialTags);
  const [value, setValue] = useState<Key[]>(['design']);
  return (
    <Combobox
      label="Tags"
      description="Type a new tag and choose “Add …”."
      selectionMode="multiple"
      value={value}
      onChange={setValue}
      defaultItems={tags}
      onCreate={(text) => {
        const id = text.toLowerCase().replace(/\s+/g, '-');
        setTags((list) => (list.some((t) => t.id === id) ? list : [...list, { id, name: text }]));
        return id;
      }}
    >
      {(item) => <Option id={item.id}>{item.name}</Option>}
    </Combobox>
  );
}

export const Creatable: Story = {
  name: 'Create new values',
  parameters: {
    docs: { description: { story: 'Multi only, off by default: an “Add …” row appears for text without an exact match. Use it where new values make sense (tags).' } },
  },
  render: () => <CreatableDemo />,
};

/** Fake server: filters after 600 ms. */
const search = (text: string, signal: AbortSignal) =>
  new Promise<Person[]>((resolve, reject) => {
    const id = setTimeout(() => {
      const q = text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
      resolve(people.filter((p) => p.name.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().includes(q)));
    }, 600);
    signal.addEventListener('abort', () => {
      clearTimeout(id);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });

function ServerDemo() {
  const list = useAsyncList<Person>({
    async load({ signal, filterText = '' }) {
      // Search from 2 characters, 300 ms debounce.
      if (filterText.trim().length < 2) return { items: [] };
      await new Promise((r) => setTimeout(r, 300));
      if (signal.aborted) return { items: [] };
      return { items: await search(filterText, signal) };
    },
  });
  return (
    <Combobox
      label="Assignee"
      description="Server search from 2 characters."
      leadingIcon={<Search />}
      items={list.items}
      inputValue={list.filterText}
      onInputChange={list.setFilterText}
      isLoading={list.isLoading}
      noResultsMessage={(text) => (text.length < 2 ? 'Type at least 2 characters' : `No results for “${text}”`)}
    >
      {(item) => (
        <Option id={item.id} description={item.role}>
          {item.name}
        </Option>
      )}
    </Combobox>
  );
}

export const Server: Story = {
  name: 'Server search',
  parameters: {
    docs: {
      description: {
        story:
          'Data from a server: pass `items`, `inputValue`, `onInputChange` and `isLoading` (e.g. from React Aria useAsyncList). ' +
          'Start at 2 characters, 300 ms debounce, previous results stay while loading.',
      },
    },
  },
  render: () => <ServerDemo />,
};

export const Mobile: Story = {
  name: 'On mobile',
  parameters: {
    docs: {
      description: {
        story:
          'Below 640 px (`overlay="auto"`) the field opens a Bottom Sheet: search on top, fixed 90 % height so it does not jump with the keyboard, options lg. ' +
          'Single closes on tap; multi has “Done” (or a result button with `commit="onClose"`). Forced here with `overlay="sheet"`.',
      },
    },
  },
  render: () => (
    <div style={stack}>
      <Combobox label="Assignee" overlay="sheet" defaultValue="mueller" defaultItems={people}>
        {(item) => (
          <Option id={item.id} description={item.role}>
            {item.name}
          </Option>
        )}
      </Combobox>
      <Combobox label="Reviewers" overlay="sheet" selectionMode="multiple" defaultValue={['mueller', 'lorenz', 'cetin']} defaultItems={people}>
        {(item) => <Option id={item.id}>{item.name}</Option>}
      </Combobox>
    </div>
  ),
};

export const InteractionTest: Story = {
  ...interactionTest,
  args: { defaultValue: null },
  play: async ({ canvas, userEvent, args }) => {
    const input = canvas.getByRole('combobox', { name: /Assignee/ });
    await userEvent.clear(input);
    // Typing filters the list (match anywhere); ↓ + Enter picks.
    await userEvent.type(input, 'fisch');
    const body = within(document.body);
    const list = await body.findByRole('listbox');
    await waitFor(() => expect(within(list).getAllByRole('option')).toHaveLength(1));
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(input).toHaveValue('Fiona Fischer');
    await expect(args.onChange).toHaveBeenLastCalledWith('fischer');
  },
};
