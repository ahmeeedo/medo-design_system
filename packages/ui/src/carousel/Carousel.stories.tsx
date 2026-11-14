import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import { Carousel } from './Carousel';
import { Card } from '../card/Card';
import { Image } from '../media/Image';
import { interactionTest, samplePhoto } from '../story-helpers';

const FEATURES = ['Getting started', 'Team workspace', 'Reports & insights', 'Integrations', 'Security', 'Mobile apps'];
const EDITORIAL = [
  ['Design that adapts', 'Light and dark themes from one set of tokens.'],
  ['Built for teams', 'Share components and keep every product in sync.'],
  ['Accessible by default', 'WCAG AA contrast, focus and touch targets.'],
  ['Fast to ship', 'React, Tailwind v4 and Storybook out of the box.'],
  ['Open source', 'Free to use, fork and extend.'],
];
const PHOTOS = [
  ['Evening light', 'Landscapes · 12 photos'],
  ['Green hills', 'Nature · 8 photos'],
  ['Blue hour', 'City · 15 photos'],
  ['Morning mist', 'Landscapes · 6 photos'],
  ['Coastline', 'Travel · 10 photos'],
  ['Mountains', 'Nature · 9 photos'],
];

/** Cards: Card with an image, a title link and one line of text. */
const featureCards = (variant: 'outlined' | 'filled' = 'outlined') =>
  FEATURES.map((title, i) => (
    <Card key={title} title={title} variant={variant} href={`#${i}`} media={<Image src={samplePhoto(i)} alt="" ratio="16:9" />}>
      Learn how it works
    </Card>
  ));

/** Media: one 16:9 image per slide. */
const slides = (count: number) =>
  Array.from({ length: count }, (_, i) => <Image key={i} src={samplePhoto(i)} alt={`Landscape ${i + 1}`} ratio="16:9" />);

const meta = {
  title: 'Components/Data display/Carousel',
  component: Carousel,
  tags: ['autodocs', 'status:experimental'],
  args: { title: 'Explore features', layout: 'row', variant: 'base', autoplay: false, children: featureCards() },
  argTypes: {
    title: { control: 'text' },
    layout: { control: 'inline-radio', options: ['single', 'row'] },
    variant: { control: 'inline-radio', options: ['base', 'aesthetic'] },
    itemSize: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    autoplay: { control: 'boolean' },
    children: { control: false },
    viewAll: { control: false },
    headingLevel: { control: false },
  },
  parameters: {
    medo: {
      figma: '370:161',
      subtitle: 'Shows a set of slides or cards in one row – browse by swipe, arrows or dots.',
      usage: {
        when: ['A few equal items to browse: features, photos, highlights.', 'Space for one row, where a grid would push the rest down.'],
        whenNot: [
          'Key actions or information: nothing important may hide on slide 2 and later. Use a grid or a list.',
          'Items users must find again or compare: use a grid, a list or a table.',
        ],
        do: [
          'Give it a title, or an aria-label.',
          'Keep the items the same kind: all cards or all images.',
          'Use one style per page: base or aesthetic.',
          'Autoplay only for marketing heroes, with at least 5 s per slide.',
        ],
        dont: ['Put controls or text on the images.', 'Loop, or use it for infinite content.', 'Use autoplay for content to read or act on.'],
      },
      a11y: {
        keyboard: [
          ['Tab', 'Moves through the controls and the items in view; items out of view are skipped.'],
          ['Enter / Space', 'Previous, Next, a dot or Pause.'],
          ['Arrow keys', 'Scroll the slides when they hold no links or buttons (the slide area takes the focus).'],
        ],
        notes: [
          'A region announced as “carousel” with its title; each item as “slide, 3 of 5”.',
          'Previous and Next are buttons, disabled at the ends – there is no loop.',
          'A change by Previous, Next or a dot is announced; slides that move on by themselves are not.',
          'Autoplay pauses on hover, on focus and in a hidden tab, stops on the last slide and is off with reduced motion.',
          'Touch screens get no arrows: swipe; dots stay with a 24 px hit area.',
        ],
      },
      styling: {
        classes: [
          ['medo-carousel', 'The region; `--base` or `--aesthetic`, `--single` or `--row`, `--sm`, `--md`, `--lg` (item width).'],
          ['medo-carousel__header, __title', 'Title, View all and – for base rows – the arrows.'],
          ['medo-carousel__viewport', 'The scrolling row with scroll snapping.'],
          ['medo-carousel__item', 'One slide or card.'],
          ['medo-carousel__footer, __controls', 'Indicator and arrows below the items; `__footer--center` for aesthetic single slides.'],
          ['medo-carousel__dots, __dot, __counter', 'The indicator: dots up to 7, a counter “3 / 12” above.'],
        ],
        states: ['aria-current (active dot)', 'inert (items out of view)'],
      },
    },
    docs: {
      description: {
        component:
          'One carousel for every type in Figma: `layout="single"` shows one slide at a time (Media), `layout="row"` a row of items with the next one peeking in (Cards, Editorial, Portrait). Native scroll snapping, so touch and trackpads scroll as usual. Pass the items as children.',
      },
    },
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Media: Story = {
  parameters: {
    docs: {
      description: {
        story: 'One slide at a time, 16:9. Dots up to 7 slides, a counter above. The controls sit below the content, never on it.',
      },
    },
  },
  args: { title: undefined, 'aria-label': 'Landscapes', layout: 'single', children: slides(5) },
};

export const MediaAesthetic: Story = {
  name: 'Media aesthetic',
  parameters: {
    docs: { description: { story: '`variant="aesthetic"`: larger radius, the indicator as a centered pill between md controls.' } },
  },
  args: { title: undefined, 'aria-label': 'Landscapes', layout: 'single', variant: 'aesthetic', children: slides(5) },
};

export const Counter: Story = {
  parameters: { docs: { description: { story: 'More than 7 slides: a counter “1 / 12” instead of dots.' } } },
  args: { title: undefined, 'aria-label': 'Landscapes', layout: 'single', children: slides(12) },
};

export const Cards: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A row of Cards. Base: title, View all and the arrows in the header. Each card is one link; cards out of view are skipped by Tab.',
      },
    },
  },
  args: { viewAll: { href: '#all' } },
};

export const CardsAesthetic: Story = {
  name: 'Cards aesthetic',
  parameters: {
    docs: { description: { story: 'Large title, Filled cards with radius/xl, the arrows below on the right.' } },
  },
  args: { variant: 'aesthetic', children: featureCards('filled') },
};

export const Editorial: Story = {
  parameters: {
    docs: { description: { story: 'Card `variant="plain"`: image, title and text without a frame.' } },
  },
  args: {
    variant: 'aesthetic',
    itemSize: 'md',
    children: EDITORIAL.map(([title, text], i) => (
      <Card key={title} title={title} variant="plain" media={<Image src={samplePhoto(i)} alt="" ratio="16:9" />}>
        {text}
      </Card>
    )),
  },
};

export const Portrait: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Image 3:4 with the text on a gradient (`overlay`), at the bottom or at the top. For navigation, wrap each tile in one link – no extra buttons inside.',
      },
    },
  },
  args: {
    title: 'Collections',
    variant: 'aesthetic',
    itemSize: 'sm',
    children: PHOTOS.map(([title, meta], i) => (
      <Image key={title} src={samplePhoto(i, { width: 900, height: 1200 })} alt="" ratio="3:4" overlay={{ title, meta, position: i % 2 ? 'top' : 'bottom' }} />
    )),
  },
};

export const Autoplay: Story = {
  // Moves on by itself: no screenshot.
  tags: ['!visual'],
  parameters: {
    docs: {
      description: {
        story:
          'Only for marketing heroes: `autoplay` (6 s, or a number of ms ≥ 5000) adds Pause. It pauses on hover and focus, stops on the last slide and stays off with reduced motion.',
      },
    },
  },
  args: { title: undefined, 'aria-label': 'Highlights', layout: 'single', variant: 'aesthetic', autoplay: true, children: slides(4) },
};

export const InteractionTest: Story = {
  ...interactionTest,
  tags: ['!autodocs'],
  args: { title: undefined, 'aria-label': 'Landscapes', layout: 'single', children: slides(4) },
  play: async ({ canvas, userEvent }) => {
    const region = canvas.getByRole('region', { name: 'Landscapes' });
    await expect(region).toHaveAttribute('aria-roledescription', 'carousel');
    const previous = canvas.getByRole('button', { name: 'Previous slide' });
    const next = canvas.getByRole('button', { name: 'Next slide' });
    // No loop: Previous is disabled on the first slide.
    await expect(previous).toBeDisabled();
    const slidesInView = () => within(region).getAllByRole('group').filter((g) => g.getAttribute('aria-roledescription') === 'slide' && !g.inert);
    await expect(slidesInView().map((s) => s.getAttribute('aria-label'))).toEqual(['1 of 4']);
    await userEvent.click(next);
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Slide 2 of 4' })).toHaveAttribute('aria-current', 'true'));
    await expect(previous).toBeEnabled();
    // A dot jumps to its slide; the last one disables Next.
    await userEvent.click(canvas.getByRole('button', { name: 'Slide 4 of 4' }));
    await waitFor(() => expect(next).toBeDisabled());
    await expect(slidesInView().map((s) => s.getAttribute('aria-label'))).toEqual(['4 of 4']);
  },
};
