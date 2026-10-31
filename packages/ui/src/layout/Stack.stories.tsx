import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from './Layout';
import { Button } from '../button/Button';
import { TextField } from '../text-field/TextField';
import { Badge } from '../badge/Badge';
import { slot } from '../story-helpers';

const box = (label: string) => (
  <div
    key={label}
    style={{
      padding: 'var(--medo-space-3) var(--medo-space-4)',
      border: 'var(--medo-border-width-thin) dashed var(--medo-color-border-strong)',
      borderRadius: 'var(--medo-radius-md)',
      background: 'var(--medo-color-surface-subtle)',
      font: 'var(--medo-typography-label-md)',
    }}
  >
    {label}
  </div>
);

const rules = ['inline', 'content', 'fields', 'items', 'group', 'section'] as const;

const meta = {
  title: 'Components/Layout/Stack',
  component: Stack,
  tags: ['autodocs'],
  args: { direction: 'vertical', children: 'three' },
  argTypes: {
    direction: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    gap: { control: 'select', options: [undefined, ...rules], description: 'Spacing rule. Default: `content` (vertical), `inline` (horizontal).' },
    align: { control: 'select', options: [undefined, 'start', 'center', 'end', 'stretch', 'baseline'] },
    justify: { control: 'select', options: [undefined, 'start', 'center', 'end', 'between'] },
    wrap: { control: 'boolean' },
    children: slot({ three: [box('First'), box('Second'), box('Third')], six: ['One', 'Two', 'Three', 'Four', 'Five', 'Six'].map(box) }),
    as: { control: false, table: { category: 'Semantics (no visual change)' } },
  },
  parameters: {
    medo: {
      subtitle: 'Elements below or next to each other – always with one of the six spacing rules.',
      usage: {
        when: [
          'Content of one block below each other: heading, text, actions (`content`, the default).',
          'Buttons, tags or filters next to each other (`direction="horizontal"`, rule `inline`).',
          'Form fields (`gap="fields"`) and page sections (`gap="section"`).',
        ],
        whenNot: ['Cards and tiles in columns: use Grid.', 'Buttons that finish a task: use ButtonGroup – it orders and spaces them.'],
        do: ['Pick the rule by meaning: how closely do the elements belong together?', 'Nest stacks: sections → groups → content.'],
        dont: ['Add margins to children to change the spacing.', 'Use `section` inside a card or `inline` between sections.'],
      },
      a11y: {
        notes: [
          'A Stack has no role. Use `as` for meaning: `ul` for a list, `section` for a page section, `form` for a form.',
          'The visual order is the DOM order: never reverse it with CSS, keyboard and screen readers follow the DOM.',
        ],
      },
      styling: {
        classes: [
          ['medo-stack', 'Vertical, rule `content`.'],
          ['medo-stack--horizontal', 'Horizontal, rule `inline`.'],
          ['medo-stack--wrap', 'Wraps to the next line.'],
          ['medo-stack--align-{value}, --justify-{value}', 'Alignment.'],
          ['medo-gap-{rule}', 'Another rule – works on any flex or grid container.'],
        ],
      },
    },
    docs: {
      description: {
        component:
          'Use a stack to place elements below or next to each other. The gap is always a spacing rule, never a free number: `content` vertical, `inline` horizontal, others with `gap`. Styles: `medo-stack`.',
      },
    },
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Content: Story = {
  name: 'Content of a block',
  parameters: { docs: { description: { story: 'The default: heading, text and actions of one block with the rule `content` (16 px).' } } },
  render: () => (
    <Stack style={{ maxInlineSize: '28rem' }}>
      <h3 style={{ margin: 0, font: 'var(--medo-typography-heading-sm)' }}>Invite your team</h3>
      <p style={{ margin: 0, font: 'var(--medo-typography-body-md)', color: 'var(--medo-color-text-secondary)' }}>
        Everyone you invite can view and edit the projects of this workspace.
      </p>
      <Stack direction="horizontal">
        <Button variant="primary">Invite</Button>
        <Button variant="secondary">Copy link</Button>
      </Stack>
    </Stack>
  ),
};

export const Horizontal: Story = {
  name: 'Side by side',
  parameters: { docs: { description: { story: 'Horizontal uses the rule `inline` (8 px). `wrap` moves items to the next line when space runs out.' } } },
  render: () => (
    <Stack direction="horizontal" wrap align="center">
      {['Design', 'Research', 'Accessibility', 'Content', 'Engineering', 'Marketing'].map((t) => (
        <Badge key={t} tone="neutral">
          {t}
        </Badge>
      ))}
    </Stack>
  ),
};

export const Fields: Story = {
  name: 'Form fields',
  parameters: { docs: { description: { story: 'Fields below each other use the rule `fields` (16 px on phones, 24 px from tablet).' } } },
  render: () => (
    <Stack as="form" gap="fields" style={{ maxInlineSize: '24rem' }} onSubmit={(e) => e.preventDefault()}>
      <TextField label="Name" />
      <TextField label="Email" type="email" />
      <TextField label="Company" />
    </Stack>
  ),
};

export const Rules: Story = {
  name: 'All rules',
  parameters: { docs: { description: { story: 'The six rules from close to far. Resize the window: the values follow the layout mode.' } } },
  render: () => (
    <Stack gap="group">
      {rules.map((r) => (
        <Stack key={r} gap="inline">
          <code style={{ font: 'var(--medo-typography-label-sm)' }}>gap=&quot;{r}&quot;</code>
          <Stack direction="horizontal" gap={r}>
            {box('A')}
            {box('B')}
          </Stack>
        </Stack>
      ))}
    </Stack>
  ),
};
