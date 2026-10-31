import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, AvatarGroup, type AvatarSize } from './Avatar';
import { row, semantic, slot } from '../story-helpers';

// Local sample "photo" (no external request): a soft gradient with a silhouette.
const photo =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9fc5bd"/><stop offset="1" stop-color="#3f6f8f"/></linearGradient></defs><rect width="80" height="80" fill="url(#g)"/><circle cx="40" cy="31" r="14" fill="#f1e3d3"/><path d="M14 80c2-16 13-25 26-25s24 9 26 25z" fill="#2c4a5e"/></svg>`,
  );

const sizes: AvatarSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
const people = ['Anna Dietrich', 'Lea Meyer', 'Sven Kraus', 'Jonas Bauer', 'Mia Schulz', 'Tom Wagner'];

const meta = {
  title: 'Components/Data display/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: { name: 'Lea Meyer', size: 'lg', shape: 'circle', src: 'photo' },
  argTypes: {
    size: { control: 'inline-radio', options: sizes },
    shape: { control: 'inline-radio', options: ['circle', 'square'] },
    status: { control: 'select', options: [undefined, 'online', 'away', 'busy', 'offline'] },
    src: { ...slot({ none: undefined, photo }), description: 'Image URL. Without it the initials (or an icon) show.' },
    colorKey: { control: 'text', description: 'Stable id (e.g. user id) that picks the initials colour. Remove the photo to see it.' },
    statusLabels: semantic,
    decorative: semantic,
    unknownLabel: semantic,
  },
  parameters: {
    medo: {
      subtitle: 'A picture of a person or an organization – with a reliable fallback.',
      usage: {
        when: ['Show who did something: comments, assignees, accounts.', 'Show an organization (square).'],
        whenNot: ['Decorative pictures: use an Image.', 'Status without a person: use a Badge.'],
        do: [
          'Pass `colorKey` (the user id), so the colour stays the same.',
          'Set `decorative` when the name is visible next to it.',
          'Use an `AvatarGroup` with max 4 and “+N”.',
        ],
        dont: ['Rely on the colour to tell people apart.', 'Use the status dot alone without a text for important states.'],
      },
      a11y: {
        notes: [
          'The avatar is an image named by the person (`role="img"`); `decorative` hides it.',
          'Fallback: image → initials → icon; a broken image never shows.',
          'The status is part of the name, e.g. “Lea M., online”.',
        ],
      },
      styling: {
        classes: [
          ['medo-avatar', 'The avatar.'],
          ['medo-avatar--{size}', '`xs` to `2xl`.'],
          ['medo-avatar--square', 'Organization.'],
          ['medo-avatar--{colour}', '`blue`, `violet`, `pink`, `amber`, `green`, `teal`.'],
          ['medo-avatar__image, __initials, __icon, __status', 'Parts.'],
          ['medo-avatar-group', 'Group with “+N”.'],
        ],
      },
    },
    docs: {
      description: {
        component:
          'Fallback: image → initials → icon. Circle = person, square = organization. The initials colour comes from ' +
          '`colorKey` (user id), so it stays the same. Next to a visible name set `decorative`. ' +
          'Styles: `medo-avatar medo-avatar--md medo-avatar--circle medo-avatar--teal`.',
      },
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Fallback: Story = {
  parameters: { docs: { description: { story: 'Photo; broken photo → initials; no name → icon (person / organization).' } } },
  render: () => (
    <div style={row}>
      <Avatar name="Lea Meyer" src={photo} size="lg" />
      <Avatar name="Lea Meyer" src="/does-not-exist.png" size="lg" />
      <Avatar size="lg" />
      <Avatar name="med.o GmbH" shape="square" size="lg" />
      <Avatar shape="square" size="lg" />
    </div>
  ),
};

export const ShapesAndSizes: Story = {
  name: 'Shapes and sizes',
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--medo-layout-gap-group)' }}>
      <div style={row}>
        {sizes.map((s) => (
          <Avatar key={s} name="Anna Dietrich" size={s} />
        ))}
      </div>
      <div style={row}>
        {sizes.map((s) => (
          <Avatar key={s} name="med.o GmbH" shape="square" size={s} />
        ))}
      </div>
    </div>
  ),
};

export const Colors: Story = {
  parameters: { docs: { description: { story: 'Six tones, picked from the id. No red: it would read as an error.' } } },
  render: () => (
    <div style={row}>
      {people.map((p) => (
        <Avatar key={p} name={p} size="lg" />
      ))}
    </div>
  ),
};

export const Status: Story = {
  render: () => (
    <div style={row}>
      <Avatar name="Lea Meyer" src={photo} status="online" size="lg" />
      <Avatar name="Sven Kraus" status="away" size="lg" />
      <Avatar name="Jonas Bauer" status="busy" size="lg" />
      <Avatar name="Mia Schulz" status="offline" size="lg" />
      <Avatar name="Tom Wagner" status="online" size="2xl" />
    </div>
  ),
};

export const Group: Story = {
  parameters: { docs: { description: { story: 'Max 4, then “+N”. With `onMorePress`, “+N” is a button that opens the full list.' } } },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--medo-layout-gap-group)' }}>
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <AvatarGroup key={s} aria-label="Assignees" size={s} onMorePress={() => {}}>
          {people.map((p, i) => (
            <Avatar key={p} name={p} src={i === 0 ? photo : undefined} />
          ))}
        </AvatarGroup>
      ))}
    </div>
  ),
};
