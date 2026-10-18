import type { Meta, StoryObj } from '@storybook/react-vite';
import { Ellipsis } from 'lucide-react';
import { Card } from './Card';
import { Button, ButtonGroup } from '../button/Button';
import { IconButton } from '../icon-button/IconButton';
import { Badge } from '../badge/Badge';
import { LightDark, semantic, slot } from '../story-helpers';

/** Neutral placeholder media: a token-coloured gradient, no external image. */
const media = (
  <div
    role="presentation"
    style={{
      inlineSize: '100%',
      blockSize: '100%',
      background: 'linear-gradient(135deg, var(--medo-color-surface-brand-subtle), var(--medo-color-surface-subtle))',
    }}
  />
);

const grid: React.CSSProperties = { display: 'grid', gap: 'var(--medo-space-6)', gridTemplateColumns: 'repeat(auto-fill, minmax(16rem, 1fr))', alignItems: 'stretch' };

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  args: { title: 'Quarterly report', subtitle: 'Updated 2 hours ago', children: 'Revenue, costs and forecasts for Q3 in one place.', variant: 'outlined', density: 'standard', layout: 'vertical', media: 'none', headerActions: 'none', footer: 'none', href: 'none' },
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    children: { control: 'text' },
    variant: { control: 'inline-radio', options: ['outlined', 'elevated', 'filled', 'brand', 'plain'] },
    density: { control: 'inline-radio', options: ['standard', 'compact'] },
    media: slot({ none: undefined, image: media }),
    /* Layout only matters with media. */
    layout: { control: 'inline-radio', options: ['vertical', 'horizontal'], if: { arg: 'media', truthy: true } },
    headerActions: slot({ none: undefined, 'more menu': <IconButton variant="ghost" size="sm" icon={<Ellipsis />} aria-label="More actions" /> }),
    footer: slot({
      none: undefined,
      buttons: (
        <ButtonGroup>
          <Button variant="secondary" size="sm">Later</Button>
          <Button size="sm">Invite</Button>
        </ButtonGroup>
      ),
    }),
    href: { ...slot({ none: undefined, link: '#' }), description: 'Makes the whole card a link. Hover or focus it to see the state.' },
    headingLevel: semantic,
    linkProps: semantic,
  },
  /* Single cards get a realistic width; stories with parameters.width set their own. */
  decorators: [(Story, { parameters }) => <div style={{ maxInlineSize: parameters.width ?? '22rem' }}>{Story()}</div>],
  parameters: {
    medo: { code: 'C16', subtitle: 'A container for one topic: title, optional media, content and actions.', figma: '178:736' },
    docs: {
      description: {
        component:
          'Rendered as an `<article>` with a real heading. A card is either **interactive** (`href`: the title link covers the card) ' +
          'or holds **actions** (buttons in the footer) – buttons stay clickable above the link. ' +
          'Styles: `medo-card medo-card--outlined`, `medo-card--compact`, `medo-card--horizontal`.',
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  parameters: { width: 'none', docs: { description: { story: 'Outlined is the default. Elevated for attention or drag, filled inside white areas, brand once per view, plain for editorial lists.' } } },
  render: () => (
    <div style={grid}>
      {(['outlined', 'elevated', 'filled', 'brand', 'plain'] as const).map((v) => (
        <Card key={v} variant={v} title={v[0].toUpperCase() + v.slice(1)} subtitle="Supporting text">
          One topic per card, with a short summary.
        </Card>
      ))}
    </div>
  ),
};

export const WithActions: Story = {
  name: 'With actions',
  parameters: { docs: { description: { story: 'Footer buttons finish a task in the card (ButtonGroup context="footer"). Card-wide actions sit next to the title.' } } },
  render: () => (
    <Card
      title="Invite your team"
      subtitle="3 seats left"
      headerActions={<IconButton variant="ghost" size="sm" icon={<Ellipsis />} aria-label="More actions" />}
      footer={
        <ButtonGroup>
          <Button variant="secondary" size="sm">
            Later
          </Button>
          <Button size="sm">Invite</Button>
        </ButtonGroup>
      }
    >
      Projects are easier with others. Invite people by e-mail.
    </Card>
  ),
};

export const Interactive: Story = {
  parameters: { docs: { description: { story: 'The whole card opens the item. One link, one tab stop, read once by screen readers.' } } },
  render: () => (
    <Card href="#" media={media} title="Design tokens 2.0" subtitle="Article · 5 min read">
      What changed in colours, spacing and typography.
    </Card>
  ),
};

export const Horizontal: Story = {
  parameters: { width: '36rem', docs: { description: { story: 'Media on the left, for lists. Compact density for dense layouts and mobile.' } } },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--medo-space-4)' }}>
      <Card layout="horizontal" href="#" media={media} title="Design tokens 2.0" subtitle="Article · 5 min read">
        What changed in colours, spacing and typography.
      </Card>
      <Card layout="horizontal" density="compact" media={media} title="Onboarding flow" subtitle={<Badge tone="success" size="sm" dot>Live</Badge>}>
        Three steps instead of five.
      </Card>
    </div>
  ),
};

export const LightAndDark: Story = {
  name: 'Light and Dark',
  parameters: { layout: 'fullscreen', width: 'none' },
  render: () => (
    <LightDark>
      <Card href="#" title="Design tokens 2.0" subtitle="Article · 5 min read">
        What changed in colours, spacing and typography.
      </Card>
      <Card variant="brand" title="Upgrade to Pro" footer={<ButtonGroup><Button size="sm">Upgrade</Button></ButtonGroup>}>
        Unlimited projects and version history.
      </Card>
    </LightDark>
  ),
};
