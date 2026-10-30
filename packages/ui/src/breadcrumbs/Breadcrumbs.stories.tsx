import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import { Breadcrumbs } from './Breadcrumbs';
import { interactionTest, Examples, semantic, slot } from '../story-helpers';

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
  title: 'Components/Navigation/Breadcrumbs',
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
    medo: {
      subtitle: 'Shows where a page sits in the hierarchy and links to the levels above.',
      usage: {
        when: ['Deep hierarchies with 3 or more levels: docs, shops, file trees.', 'Users arrive from search and need to see where they are.'],
        whenNot: ['On the start page.', 'Flat sites with 1–2 levels.', 'Steps of a process: show the current step on the page, with Back and Next.'],
        do: [
          'Put it above the page title.',
          'Start with Home and end with the current page.',
          'Use the page names users see in the navigation.',
        ],
        dont: ['Link the current page.', 'Use breadcrumbs as the only navigation.'],
      },
      a11y: {
        keyboard: [
          ['Tab', 'Moves through the links.'],
          ['Enter', 'Follows the link or opens the “…” menu.'],
        ],
        notes: [
          'A navigation region “Breadcrumb” with an ordered list.',
          'The current page is last, not a link, with `aria-current="page"`.',
          'Separators are hidden from screen readers; the Home icon is named “Home”.',
          'Below 640 px (`layout="auto"`) only a back link to the parent page.',
        ],
      },
      styling: {
        classes: [
          ['medo-breadcrumbs', 'Navigation; `--sm` or `--md`.'],
          ['medo-breadcrumbs__list, __item', 'Ordered list and its items.'],
          ['medo-breadcrumbs__link, __label', 'Link and label (max 200 px).'],
          ['medo-breadcrumbs__icon-part', 'Home icon and “…” button.'],
          ['medo-breadcrumbs__current', 'Current page.'],
          ['medo-breadcrumbs__separator', 'Chevron.'],
        ],
        states: ['data-hovered', 'data-pressed', 'data-focus-visible', 'data-current'],
      },
    },
    docs: {
      description: {
        component:
          'Use breadcrumbs to show where a page sits in the hierarchy and to go up a level. Built on React Aria Breadcrumbs; the current page comes last and is not a link.',
      },
    },
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Layouts: Story = {
  name: 'Layouts',
  parameters: { docs: { description: { story: 'md for websites, sm for dense apps. From 5 levels: Home, “…”, the last two levels and the current page.' } } },
  render: () => (
    <Examples>
      {(['md', 'sm'] as const).map((size) => (
        <div key={size} style={{ display: 'grid', gap: 'var(--medo-space-3)' }}>
          <span style={caption}>full · {size}</span>
          <Breadcrumbs layout="full" size={size} items={four} aria-label={`Breadcrumb, full ${size}`} />
          <span style={caption}>collapsed · {size}</span>
          <Breadcrumbs layout="full" size={size} items={six} aria-label={`Breadcrumb, collapsed ${size}`} />
        </div>
      ))}
    </Examples>
  ),
};

export const LongLabel: Story = {
  name: 'Long label',
  parameters: {
    docs: { description: { story: 'Labels over 200 px end with “…”; the full name appears in a Tooltip on hover and focus and stays the accessible name.' } },
  },
  args: { items: long },
};

export const MobileBack: Story = {
  name: 'On mobile',
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
      {/* The page title is an h1 in an app; inside the docs page it is one level below the section. */}
      <h3 className="medo-text-heading-xl" style={{ margin: 0 }}>
        Design review
      </h3>
      <p style={{ margin: 0, font: 'var(--medo-typography-body-md)', color: 'var(--medo-color-text-secondary)' }}>Feedback round for the new start page.</p>
    </header>
  ),
};

export const InteractionTest: Story = {
  ...interactionTest,
  args: { items: six },
  play: async ({ canvas, userEvent }) => {
    // Current page is not a link; hidden levels sit in the “…” menu.
    // findBy: the collapsed trail renders after its first measurement.
    await expect((await canvas.findByText('Button states')).closest('[aria-current="page"]')).not.toBeNull();
    await userEvent.click(canvas.getByRole('button', { name: 'Show 2 more levels' }));
    const menu = await within(document.body).findByRole('menu');
    await expect(within(menu).getAllByRole('menuitem').map((i) => i.textContent)).toEqual(['Products', 'Design system']);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(within(document.body).queryByRole('menu')).toBeNull());
  },
};
