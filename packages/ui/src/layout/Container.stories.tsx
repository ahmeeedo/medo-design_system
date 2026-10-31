import type { Meta, StoryObj } from '@storybook/react-vite';
import { Container, Grid, Stack } from './Layout';
import { Button } from '../button/Button';
import { Card } from '../card/Card';

const band = (label: string) => (
  <div
    style={{
      padding: 'var(--medo-space-4)',
      border: 'var(--medo-border-width-thin) dashed var(--medo-color-border-strong)',
      borderRadius: 'var(--medo-radius-md)',
      background: 'var(--medo-color-surface-subtle)',
      font: 'var(--medo-typography-label-md)',
    }}
  >
    {label}
  </div>
);

const meta = {
  title: 'Components/Layout/Container',
  component: Container,
  tags: ['autodocs'],
  args: { size: 'xl' },
  argTypes: {
    size: { control: 'inline-radio', options: ['prose', 'md', 'lg', 'xl', 'full'] },
    as: { control: false, table: { category: 'Semantics (no visual change)' } },
  },
  render: (args) => <Container {...args}>{band(`Content · ${args.size}`)}</Container>,
  parameters: {
    layout: 'fullscreen',
    medo: {
      subtitle: 'Centres the content, limits its width and adds the page margin.',
      usage: {
        when: ['The content area of every page (`xl`, the default).', 'Running text: articles, help pages, legal texts (`prose`, about 70 characters per line).'],
        whenNot: ['Inside cards, dialogs or sidebars – they have their own padding.'],
        do: ['Use one container per page area and put sections inside it.', 'Let full-width bands (hero, footer) use `full` or sit outside, with a container inside.'],
        dont: ['Nest containers.', 'Add your own side padding: the margin comes from the layout mode (16 · 24 · 32 px).'],
      },
      a11y: {
        notes: ['Use `as="main"` for the main content of the page, once per page – it is the target of the skip link.'],
      },
      styling: {
        classes: [
          ['medo-container', 'Width xl (1280) plus the page margin.'],
          ['medo-container--{size}', '`prose` 680 · `md` 768 · `lg` 1024 · `full`.'],
        ],
      },
    },
    docs: {
      description: {
        component:
          'Use a container for the content area of a page. It limits the width and adds the page margin of the layout mode, so content lines up on every page. Styles: `medo-container`.',
      },
    },
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  parameters: { docs: { description: { story: 'Content widths. The page margin is added outside the width, so text keeps its measure.' } } },
  render: () => (
    <Stack gap="content">
      {(['prose', 'md', 'lg', 'xl', 'full'] as const).map((s) => (
        <Container key={s} size={s}>
          {band(s)}
        </Container>
      ))}
    </Stack>
  ),
};

export const Page: Story = {
  name: 'A page with the rules',
  parameters: {
    docs: {
      description: {
        story: 'Container → sections (`section`) → content of a section (`content`) → cards (`items`). No spacing value is chosen by hand.',
      },
    },
  },
  render: () => (
    <Container>
      <Stack gap="section" style={{ paddingBlock: 'var(--medo-layout-gap-section)' }}>
        <Stack as="section" aria-labelledby="page-intro">
          <h3 id="page-intro" style={{ margin: 0, font: 'var(--medo-typography-heading-lg)' }}>
            Projects
          </h3>
          <p style={{ margin: 0, font: 'var(--medo-typography-body-md)', color: 'var(--medo-color-text-secondary)' }}>
            Everything your team is working on.
          </p>
          <Stack direction="horizontal">
            <Button variant="primary">New project</Button>
            <Button variant="secondary">Import</Button>
          </Stack>
        </Stack>
        <Stack as="section" aria-labelledby="page-active">
          <h3 id="page-active" style={{ margin: 0, font: 'var(--medo-typography-heading-md)' }}>
            Active
          </h3>
          <Grid>
            {['Roadmap 2027', 'Design review', 'Q4 budget'].map((t) => (
              <Card key={t} title={t} headingLevel={4} subtitle="Updated today">
                Shared with 4 people.
              </Card>
            ))}
          </Grid>
        </Stack>
      </Stack>
    </Container>
  ),
};
