import type { Meta, StoryObj } from '@storybook/react-vite';
import { DescriptionItem, DescriptionList, List, ListItem } from './List';
import { Card } from '../card/Card';
import { LightDark } from '../story-helpers';

const caption: React.CSSProperties = { font: 'var(--medo-typography-code-sm)', color: 'var(--medo-color-text-secondary)' };
const cols: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))', gap: 'var(--medo-space-8)' };

const meta = {
  title: 'Components/List',
  component: List,
  tags: ['autodocs'],
  args: { type: 'bullet', size: 'md', children: null },
  argTypes: {
    type: { control: 'inline-radio', options: ['bullet', 'number', 'check'], description: 'bullet: ul · number: ol (order matters) · check: feature list.' },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'], description: 'Without it the list takes the size of the surrounding text.' },
    start: { control: 'number', if: { arg: 'type', eq: 'number' } },
    children: { control: false },
  },
  parameters: {
    medo: { subtitle: 'Content lists in running text: bullets, numbers, feature lists and term–value pairs.' },
    docs: {
      description: {
        component:
          'Real lists – `ul`, `ol` and `dl`; the markers are drawn in CSS, so the lists set `role="list"` (Safari/VoiceOver drops it otherwise). Plain markup, no library. ' +
          'Markers are neutral (text/secondary) in their own column (24 px, numbers 28 px with tabular figures, right aligned); long items wrap flush with their first line. ' +
          'A List inside a ListItem is level 2 (ring, „a.“) – max 2 levels. Without `size` the list follows the surrounding text. ' +
          'Feature list: check in text/brand; `excluded` items are muted with a cross and a hidden „Not included:“. ' +
          '`DescriptionList` for term–value pairs: horizontal, stacked automatically when it is narrower than 22.5 rem (360 px) (container query). ' +
          'Styles: `medo-list`, `medo-list--{bullet|number|check}`, `medo-list--{sm|md|lg}`, `medo-list__item--excluded`, `medo-dl`.',
      },
    },
  },
  render: (args) => (
    <List {...args}>
      <ListItem>Design tokens</ListItem>
      <ListItem>Components built on React Aria</ListItem>
      <ListItem excluded={args.type === 'check'}>Documentation for every state and a rule set for usage</ListItem>
    </List>
  ),
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Types: Story = {
  parameters: { docs: { description: { story: 'Bullets for unordered points, numbers when order matters, check and cross for features.' } } },
  render: () => (
    <LightDark>
      <div style={cols}>
        <List size="md">
          <ListItem>Design tokens</ListItem>
          <ListItem>Components</ListItem>
          <ListItem>Documentation</ListItem>
        </List>
        <List type="number" size="md">
          <ListItem>Install the package</ListItem>
          <ListItem>Import the styles</ListItem>
          <ListItem>Use the first component</ListItem>
        </List>
        <List type="check" size="md">
          <ListItem>Unlimited projects</ListItem>
          <ListItem>Daily backups</ListItem>
          <ListItem excluded>Single sign-on (SSO)</ListItem>
        </List>
      </div>
    </LightDark>
  ),
};

export const Nesting: Story = {
  name: 'Nesting and wrapping',
  parameters: {
    docs: {
      description: {
        story: 'Level 2 is indented 24 px: ring instead of dot, „a.“ instead of „1.“. Long items wrap flush with their first line. Numbers line up: „9.“ and „10.“.',
      },
    },
  },
  render: () => (
    <div style={{ ...cols, maxInlineSize: '48rem' }}>
      <List size="md">
        <ListItem>
          Design tokens
          <List>
            <ListItem>Foundation, alias and semantic layers</ListItem>
            <ListItem>Light and dark modes</ListItem>
          </List>
        </ListItem>
        <ListItem>Components built on React Aria, with documentation for every state and a rule set for usage</ListItem>
      </List>
      <List type="number" size="md" start={9}>
        <ListItem>
          Install the package
          <List type="number">
            <ListItem>Add the theme file</ListItem>
            <ListItem>Import the CSS variables</ListItem>
          </List>
        </ListItem>
        <ListItem>Wrap the app in the provider</ListItem>
        <ListItem>Use the first component</ListItem>
      </List>
    </div>
  ),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: { story: 'body/sm in dense UI, body/md in content, body/lg on marketing pages. Without `size` the list inherits the text size, e.g. inside a Card.' },
    },
  },
  render: () => (
    <div style={cols}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} style={{ display: 'grid', gap: 'var(--medo-space-2)' }}>
          <span style={caption}>{size}</span>
          <List size={size}>
            <ListItem>Design tokens</ListItem>
            <ListItem>Components</ListItem>
            <ListItem>Documentation</ListItem>
          </List>
          <List type="check" size={size}>
            <ListItem>Daily backups</ListItem>
            <ListItem excluded>Audit log</ListItem>
          </List>
        </div>
      ))}
    </div>
  ),
};

export const FeatureList: Story = {
  name: 'Feature list',
  parameters: {
    docs: { description: { story: 'Check for included, cross for not included – muted, with „Not included:“ as hidden text. All items in one list, included first.' } },
  },
  render: () => (
    <div style={{ maxInlineSize: '22.5rem' }}>
      <Card title="Team" subtitle="€ 12 per user / month">
        <List type="check">
          <ListItem>Unlimited projects</ListItem>
          <ListItem>Up to 50 members</ListItem>
          <ListItem>Daily backups</ListItem>
          <ListItem excluded>Single sign-on (SSO)</ListItem>
          <ListItem excluded>Audit log</ListItem>
        </List>
      </Card>
    </div>
  ),
};

function Details() {
  return (
    <>
      <DescriptionItem term="Status">Active</DescriptionItem>
      <DescriptionItem term="Owner">Ahmet D.</DescriptionItem>
      <DescriptionItem term="Created">10 Oct 2026</DescriptionItem>
      <DescriptionItem term="Budget">€ 24,000</DescriptionItem>
    </>
  );
}

export const Description: Story = {
  name: 'Description list',
  parameters: {
    docs: {
      description: {
        story:
          'Term–value pairs for details. `layout="auto"` (default) stacks as soon as the list is narrower than 22.5 rem (360 px) – on phones and in narrow panels like the Drawer.',
      },
    },
  },
  render: () => (
    <LightDark>
      <span style={caption}>auto · wide</span>
      <DescriptionList>
        <Details />
      </DescriptionList>
      <span style={caption}>auto · narrow (240 px)</span>
      <div style={{ maxInlineSize: '15rem' }}>
        <DescriptionList>
          <Details />
        </DescriptionList>
      </div>
    </LightDark>
  ),
};
