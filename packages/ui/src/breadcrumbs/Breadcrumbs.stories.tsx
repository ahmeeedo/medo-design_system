import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import { Breadcrumbs } from './Breadcrumbs';
import { interactionTest, LightDark, semantic, slot } from '../story-helpers';

const caption: React.CSSProperties = { font: 'var(--medo-typography-code-sm)', color: 'var(--medo-color-text-secondary)' };

const four = [{ label: 'Home', href: '#home' }, { label: 'Projects', href: '#projects' }, { label: 'Website relaunch', href: '#relaunch' }, { label: 'Design review' }];
const six = [
  { label: 'Home', href: '#home' },
  { label: 'Products', href: '#products' },
  { label: 'Design system', href: '#design-system' },
  { label: 'Components', href: '#components' },
  { label: 'Buttons', href: '#buttons' },
  { label: 'Button states' },
];
const long = [
  { label: 'Home', href: '#home' },
  { label: 'Projects', href: '#projects' },
  { label: 'Annual report 2026 – marketing and communication', href: '#report' },
  { label: 'Design review' },
];

const meta = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  args: { items: four, size: 'md', homeIcon: true, layout: 'full' },
  argTypes: {
    items: { ...slot({ '4 levels': four, '6 levels - collapsed': six, 'long label': long }), description: 'The path from the top; the last item is the current page.' },
    size: { control: 'inline-radio', options: ['sm', 'md'], description: 'sm: dense apps · md: websites.' },
    homeIcon: { control: 'boolean', description: 'The first item as a house icon (its label stays the accessible name).' },
    layout: { control: 'inline-radio', options: ['auto', 'full', 'back'], description: 'auto: below 640 px only a link to the parent page.' },
    'aria-label': semantic,
    moreLabel: semantic,
  },
  parameters: {
    medo: { code: 'C44', subtitle: 'Shows where a page sits in the hierarchy and links to the levels above.', figma: '431:30' },
    docs: {
      description: {
        component:
          'React Aria Breadcrumbs: a navigation region „Breadcrumb“ with an ordered list. Starts with the house icon (named „Home“), chevron separators are not read, the current page comes last – not a link, `aria-current="page"`. ' +
          'Links in text/secondary, on hover text/primary and underlined; icon parts get a soft surface. From 5 levels the middle collapses into „…“ – a Menu with the hidden levels (sheet on mobile), named „Show 2 more levels“. Labels over 200 px end with „…“ and show the full name in a Tooltip. ' +
          'Below 640 px (`layout="auto"`) only a link to the parent page. Not on the start page; above the page title. Styles: `medo-breadcrumbs`, `medo-breadcrumbs--{sm|md}`.',
      },
    },
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Layouts: Story = {
  name: 'Full, collapsed, sm and md',
  parameters: { docs: { description: { story: 'md for websites, sm for dense apps. From 5 levels: Home, „…“, the last two levels and the current page.' } } },
  render: () => (
    <LightDark>
      {(['md', 'sm'] as const).map((size) => (
        <div key={size} style={{ display: 'grid', gap: 'var(--medo-space-3)' }}>
          <span style={caption}>full · {size}</span>
          <Breadcrumbs layout="full" size={size} items={four} aria-label={`Breadcrumb, full ${size}`} />
          <span style={caption}>collapsed · {size}</span>
          <Breadcrumbs layout="full" size={size} items={six} aria-label={`Breadcrumb, collapsed ${size}`} />
        </div>
      ))}
    </LightDark>
  ),
};

export const LongLabel: Story = {
  name: 'Long label',
  parameters: {
    docs: { description: { story: 'Labels over 200 px end with „…“; the full name appears in a Tooltip on hover and focus and stays the accessible name.' } },
  },
  args: { items: long },
};

export const MobileBack: Story = {
  name: 'Mobile: back link',
  parameters: {
    docs: {
      description: {
        story: 'Below 640 px only one link to the parent page, with a left chevron. The full path takes too much space and is rarely used on small screens.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--medo-space-3)' }}>
      <Breadcrumbs layout="back" items={four} aria-label="Breadcrumb, back md" />
      <Breadcrumbs layout="back" size="sm" items={four} aria-label="Breadcrumb, back sm" />
    </div>
  ),
};

export const InPageHeader: Story = {
  name: 'In a page header',
  parameters: { docs: { description: { story: 'Below the main navigation, directly above the page title (gap 12), aligned with the content.' } } },
  render: () => (
    <header style={{ display: 'grid', gap: 'var(--medo-space-3)' }}>
      <Breadcrumbs items={four} aria-label="Breadcrumb, page header" />
      <h1 className="medo-text-heading-xl" style={{ margin: 0 }}>
        Design review
      </h1>
      <p style={{ margin: 0, font: 'var(--medo-typography-body-md)', color: 'var(--medo-color-text-secondary)' }}>Feedback round for the new start page.</p>
    </header>
  ),
};

export const InteractionTest: Story = {
  ...interactionTest,
  args: { items: six },
  play: async ({ canvas, userEvent }) => {
    // Current page is not a link; hidden levels sit in the „…“ menu.
    // findBy: the collapsed trail renders after its first measurement.
    await expect((await canvas.findByText('Button states')).closest('[aria-current="page"]')).not.toBeNull();
    await userEvent.click(canvas.getByRole('button', { name: 'Show 2 more levels' }));
    const menu = await within(document.body).findByRole('menu');
    await expect(within(menu).getAllByRole('menuitem').map((i) => i.textContent)).toEqual(['Products', 'Design system']);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(within(document.body).queryByRole('menu')).toBeNull());
  },
};
