import type { Meta, StoryObj } from '@storybook/react-vite';
import { Building2, Globe, User, Users } from 'lucide-react';
import { ListBox, ListBoxMessage, ListBoxSection, Option } from './ListBox';
import { LightDark, row } from '../story-helpers';

/* Stories show the list inline. In Select and Combobox it sits in a popover. */
const frame: React.CSSProperties = {
  inlineSize: '17.5rem',
  border: 'var(--medo-border-width-thin) solid var(--medo-color-border-default)',
  borderRadius: 'var(--medo-radius-md)',
  background: 'var(--medo-color-surface-raised)',
  boxShadow: 'var(--medo-shadow-elevation-2)',
};

const meta = {
  title: 'Components/Option & Listbox',
  component: ListBox,
  tags: ['autodocs'],
  args: { size: 'md', selectionMode: 'single' },
  argTypes: {
    size: { control: 'inline-radio', options: ['md', 'lg'] },
    selectionMode: { control: 'inline-radio', options: ['single', 'multiple'] },
    children: { control: false },
    items: { control: false },
    renderEmptyState: { control: false },
  },
  parameters: {
    medo: { code: 'C07', subtitle: 'The list behind Select, Combobox and the Bottom Sheet. Option is one row, Listbox the container.', figma: '115:252' },
    docs: {
      description: {
        component:
          'Built on React Aria ListBox: arrow keys, type-ahead, Home/End. Highlighted = neutral grey; selected has no fill – a check (single, right) ' +
          'or a checkbox (multi, left) shows it. Labels wrap, never truncate. Usually used through Select or Combobox. ' +
          'Styles: `medo-listbox medo-listbox--md`, `medo-option`, `medo-listbox__header`, `medo-listbox__section`.',
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
          <ListBox aria-label={`Topics, ${mode}`} selectionMode={mode} defaultSelectedKeys={['design', 'code']}>
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
  name: 'Groups, descriptions, wrapping',
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

export const LightAndDark: Story = {
  name: 'Light and Dark',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <LightDark>
      <div style={frame}>
        <ListBox aria-label="Topics" selectionMode="multiple" defaultSelectedKeys={['design']}>
          <ListBoxSection title="Topics">
            <Option id="design" description="UI and UX">
              Design
            </Option>
            <Option id="code">Code</Option>
            <Option id="marketing" isDisabled>
              Marketing
            </Option>
          </ListBoxSection>
        </ListBox>
      </div>
    </LightDark>
  ),
};
