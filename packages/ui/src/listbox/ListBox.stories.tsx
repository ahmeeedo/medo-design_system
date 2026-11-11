import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Building2, Globe, User, Users } from 'lucide-react';
import { ListBox, ListBoxMessage, ListBoxSection, Option } from './ListBox';
import { interactionTest, row } from '../story-helpers';

/* Stories show the list inline. In Select and Combobox it sits in a popover. */
const frame: React.CSSProperties = {
  inlineSize: 'var(--medo-size-width-lg)',
  border: 'var(--medo-border-width-thin) solid var(--medo-color-border-default)',
  borderRadius: 'var(--medo-radius-md)',
  background: 'var(--medo-color-surface-raised)',
  boxShadow: 'var(--medo-shadow-elevation-2)',
};

const meta = {
  title: 'Components/Forms/Listbox',
  component: ListBox,
  tags: ['autodocs', 'status:beta'],
  args: { size: 'md', selectionMode: 'single' },
  argTypes: {
    size: { control: 'inline-radio', options: ['md', 'lg'] },
    selectionMode: { control: 'inline-radio', options: ['single', 'multiple'] },
    children: { control: false },
    items: { control: false },
    renderEmptyState: { control: false },
  },
  parameters: {
    medo: {
      subtitle: 'The list behind Select, Combobox and the Bottom Sheet. Option is one row, Listbox the container.',
      usage: {
        when: ['A list of options inside Select, Combobox or a Bottom Sheet.', 'A visible list to pick from, e.g. in a side panel.'],
        whenNot: ['Actions: use a Menu.', 'Objects with controls in each row: use a List view.'],
        do: [
          'Use groups with a header for more than about 8 options.',
          'Add a short description when options are similar.',
          'Let labels wrap.',
          'Give each `ListBoxSection` and `Option` a `key` equal to its `id`. Sections that replace each other (suggestions and results) need different ids – React Aria cannot change the id of an item it already knows.',
        ],
        dont: ['Truncate labels.', 'Put buttons or links inside an option.'],
      },
      a11y: {
        screenReader: {
          steps: [
            ['Go to the heading “Playground”, then to the list.', '“Assignee, list” (or “listbox”), then “Anna Weber, selected, 1 of 4”.'],
            ['Arrow down to “Design team”.', '“Ben Lorenz”, then “Design team” with “Everyone in the design team”.'],
            ['Activate it.', '“Design team, selected”. Anna Weber is no longer selected – one choice only.'],
            ['Arrow down once more.', '“External agency” is skipped or read as “unavailable” – it cannot be selected.'],
            ['Go to the heading “Single and multi”, then to the second list.', '“Topics, multiple” with “multi-select” (or “multiselectable”), “Design, selected” and “Code, selected”.'],
            ['Go to the heading “Content”, then through the list.', 'The groups “Europe” and “Other”; “Austria” with “Prices incl. 20 % VAT”.'],
            ['Go to the heading “Empty”, then to the list.', '“Results, list” and “No results”.'],
          ],
        },
        keyboard: [
          ['↑ / ↓', 'Moves through the options.'],
          ['Home / End', 'First or last option.'],
          ['Letters', 'Jumps to the matching option.'],
          ['Enter / Space', 'Selects the option.'],
        ],
        notes: [
          'Highlight and selection look different: grey highlight, check or checkbox for the selection.',
          'Group headers are read before their first option.',
          'Label and description are read together as the name (“Team, Everyone in the design team”), so the name holds all visible text (WCAG 2.5.3). Typeahead uses the label alone.',
          'Empty and loading messages are shown inside the list.',
        ],
      },
      styling: {
        classes: [
          ['medo-listbox medo-listbox--{size}', 'The list; `md` or `lg`.'],
          ['medo-listbox__section, __header', 'Group and its title.'],
          ['medo-option', 'One option.'],
          ['medo-option__icon, __content, __label, __description', 'Parts of an option.'],
          ['medo-option__check, __checkbox', 'Single or multiple selection mark.'],
        ],
        states: ['data-focused', 'data-hovered', 'data-selected', 'data-disabled', 'data-selection-mode'],
      },
    },
    docs: {
      description: {
        component: 'The list behind Select, Combobox and the Bottom Sheet. Built on React Aria ListBox; usually used through those components.',
      },
    },
  },
  render: (args) => (
    <div style={frame}>
      <ListBox {...args} aria-label="Assignee" defaultSelectedKeys={['anna']}>
        <Option id="anna" icon={<User />}>
          Anna Weber
        </Option>
        <Option id="ben" icon={<User />}>
          Ben Lorenz
        </Option>
        <Option id="team" icon={<Users />} description="Everyone in the design team">
          Design team
        </Option>
        <Option id="extern" icon={<Building2 />} isDisabled>
          External agency
        </Option>
      </ListBox>
    </div>
  ),
} satisfies Meta<typeof ListBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Types: Story = {
  name: 'Single and multi',
  parameters: { docs: { description: { story: 'Single: check on the right, closes on select (in Select). Multi: checkbox on the left, stays open.' } } },
  render: () => (
    <div style={{ ...row, alignItems: 'flex-start' }}>
      {(['single', 'multiple'] as const).map((mode) => (
        <div key={mode} style={frame}>
          <ListBox aria-label={`Topics, ${mode}`} selectionMode={mode} defaultSelectedKeys={mode === 'single' ? ['design'] : ['design', 'code']}>
            <Option id="design">Design</Option>
            <Option id="code">Code</Option>
            <Option id="research">Research</Option>
            <Option id="marketing" isDisabled>
              Marketing
            </Option>
          </ListBox>
        </div>
      ))}
    </div>
  ),
};

export const Content: Story = {
  name: 'Content',
  parameters: {
    docs: {
      description: { story: 'Headings only with two or more groups; a line divides the groups automatically. Long labels wrap; icon and check stay on the first line.' },
    },
  },
  render: () => (
    <div style={frame}>
      <ListBox aria-label="Region" selectionMode="single" defaultSelectedKeys={['de']}>
        <ListBoxSection title="Europe">
          <Option id="de" icon={<Globe />}>
            Germany
          </Option>
          <Option id="at" icon={<Globe />} description="Prices incl. 20 % VAT">
            Austria
          </Option>
        </ListBoxSection>
        <ListBoxSection title="Other">
          <Option id="row" icon={<Globe />}>
            Rest of the world, shipped from our warehouse in the Netherlands
          </Option>
        </ListBoxSection>
      </ListBox>
    </div>
  ),
};

export const Sizes: Story = {
  parameters: { docs: { description: { story: 'md on desktop, lg on mobile and in the Bottom Sheet.' } } },
  render: () => (
    <div style={{ ...row, alignItems: 'flex-start' }}>
      {(['md', 'lg'] as const).map((size) => (
        <div key={size} style={frame}>
          <ListBox aria-label={`Size ${size}`} size={size} selectionMode="multiple" defaultSelectedKeys={['a']}>
            <Option id="a" description="Description">
              Option
            </Option>
            <Option id="b">Option</Option>
          </ListBox>
        </div>
      ))}
    </div>
  ),
};

export const Empty: Story = {
  parameters: { docs: { description: { story: 'Never an empty popup: a message row says why.' } } },
  render: () => (
    <div style={frame}>
      <ListBox aria-label="Results" renderEmptyState={() => <ListBoxMessage>No results</ListBoxMessage>}>
        {[]}
      </ListBox>
    </div>
  ),
};

export const InteractionTest: Story = {
  ...interactionTest,
  // Literal, so the story index (and the tag filters of the test projects) see it too.
  tags: ['!autodocs'],
  play: async ({ canvas, userEvent }) => {
    // findBy: React Aria builds the collection before the options appear.
    const ben = await canvas.findByRole('option', { name: 'Ben Lorenz' });
    await userEvent.click(ben);
    await expect(ben).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('option', { name: 'Anna Weber' })).toHaveAttribute('aria-selected', 'false');
    // Disabled options are skipped by the keyboard.
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    await expect(canvas.getByRole('option', { name: /Design team/ })).toHaveFocus();
    await expect(canvas.getByRole('option', { name: 'External agency' })).toHaveAttribute('aria-disabled', 'true');
  },
};
