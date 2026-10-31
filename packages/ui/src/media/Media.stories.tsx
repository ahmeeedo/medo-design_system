import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor } from 'storybook/test';
import { Image, Figure, MediaPlayButton, type ImageRatio } from './Image';
import { EmbedConsent } from './EmbedConsent';
import { Badge } from '../badge/Badge';
import { interactionTest, Examples, samplePhoto, sampleScreenshot, semantic, slot } from '../story-helpers';

const ratios: ImageRatio[] = ['1:1', '3:4', '4:3', '3:2', '16:9', '21:9', 'original'];
const grid: React.CSSProperties = { display: 'grid', gap: 'var(--medo-layout-gap-items)', gridTemplateColumns: 'repeat(auto-fill, minmax(12rem, 1fr))', alignItems: 'start' };
const label: React.CSSProperties = { margin: 'var(--medo-space-2) 0 0', font: 'var(--medo-typography-caption)', color: 'var(--medo-color-text-secondary)' };
const photo = samplePhoto(0);
const preview = samplePhoto(0, { tiny: true });
/** Embed demo: a local page instead of a real provider, so the story sends nothing anywhere. */
const demoEmbed = `data:text/html,${encodeURIComponent('<body style="margin:0;display:grid;place-items:center;height:100vh;font:16px sans-serif;background:#0f1a1f;color:#fff">Embedded content loads here</body>')}`;

const meta = {
  title: 'Components/Data display/Image & Media',
  component: Image,
  tags: ['autodocs'],
  args: {
    src: samplePhoto(0, { width: 1200, height: 900 }),
    alt: 'Evening light over the foothills',
    ratio: '16:9',
    fit: 'cover',
    radius: 'md',
    bordered: false,
    overlay: 'none' as never,
    badge: 'none',
    play: 'none' as never,
  },
  argTypes: {
    ratio: { control: 'select', options: ratios },
    fit: { control: 'inline-radio', options: ['cover', 'contain'] },
    radius: { control: 'inline-radio', options: ['none', 'sm', 'md', 'lg'] },
    bordered: { control: 'boolean' },
    overlay: slot({
      none: undefined,
      bottom: { title: 'Evening light in the valley', meta: 'Photo · 3 min read' },
      top: { title: 'Evening light in the valley', meta: 'Photo · 3 min read', position: 'top' },
    }),
    badge: slot({ none: undefined, featured: <Badge size="sm">Featured</Badge> }),
    play: slot({ none: undefined, md: 'md', lg: 'lg' }),
    alt: semantic,
    src: { control: false },
    placeholder: { control: false },
    priority: semantic,
    sizes: semantic,
    srcSet: semantic,
  },
  parameters: {
    medo: {
      subtitle: 'Images, figures and third-party embeds – with reserved space, calm loading states and consent before anything loads.',
      usage: {
        when: [
          'Images in content and cards (`Image`).',
          'An image with caption and credit (`Figure`).',
          'Videos and maps from other providers (`EmbedConsent`).',
        ],
        whenNot: ['Icons: use Lucide icons.', 'People: use an Avatar.'],
        do: [
          'Always set `alt`; `alt=""` only for decorative images.',
          'Set a ratio, so nothing jumps while loading.',
          'Use `priority` only for the hero image.',
        ],
        dont: ['Put text into images.', 'Load embeds before the user agrees.'],
      },
      a11y: {
        keyboard: [
          ['Tab', 'Moves to links, play and consent buttons.'],
          ['Enter / Space', 'Loads the embed after consent.'],
        ],
        notes: [
          '`alt` is required; decorative images use `alt=""` on purpose.',
          'Nothing loads from the provider before the click (GDPR).',
          'After consent the iframe takes the focus.',
          'Reduced motion: a shorter fade-in.',
        ],
      },
      styling: {
        classes: [
          ['medo-image', 'Image frame; `--cover` or `--contain`.'],
          ['medo-image--radius-{size}', '`none`, `sm`, `md`, `lg`.'],
          ['medo-image__img, __overlay, __badge, __play', 'Image and overlays.'],
          ['medo-figure, __caption, __credit', 'Figure.'],
          ['medo-embed', 'Consent placeholder; `--compact`.'],
        ],
        states: ['data-state', 'data-hovered', 'data-focus-visible'],
      },
    },
    docs: {
      description: {
        component:
          'Use `Image` for images with reserved space and calm loading states, `Figure` for a caption and credit, and `EmbedConsent` for third-party embeds that load only after a click. `alt` is required.',
      },
    },
  },
  render: (args) => (
    <div style={{ maxInlineSize: '30rem' }}>
      <Image {...args} />
    </div>
  ),
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Ratios: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Fixed ratios reserve the space. “original” keeps the file’s ratio – pass width and height so the space is reserved too. 3:4 for portrait tiles.',
      },
    },
  },
  render: () => (
    <div style={grid}>
      {ratios.map((r) => (
        <div key={r}>
          <Image src={photo} alt="" ratio={r} width={r === 'original' ? 1600 : undefined} height={r === 'original' ? 900 : undefined} />
          <p style={label}>{r}</p>
        </div>
      ))}
    </div>
  ),
};

export const States: Story = {
  name: 'Loading states',
  parameters: {
    docs: {
      description: {
        story:
          'Blur-up when the server delivers a tiny preview, otherwise Skeleton. The image fades in and never slides. Error keeps the space; the alt text stays available to screen readers.',
      },
    },
  },
  render: () => (
    <Examples>
      <div style={{ ...grid, gridTemplateColumns: 'repeat(2, 1fr)' }}>
        {[
          { name: 'Loaded', props: { src: photo } },
          { name: 'Blur-up preview', props: { placeholder: preview } },
          { name: 'Skeleton · no preview', props: {} },
          { name: 'Error', props: { src: 'missing-image.jpg' } },
        ].map(({ name, props }) => (
          <div key={name}>
            <Image alt="Evening light over the foothills" ratio="4:3" {...props} />
            <p style={label}>{name}</p>
          </div>
        ))}
      </div>
    </Examples>
  ),
};

export const Fit: Story = {
  name: 'Fit',
  parameters: {
    docs: {
      description: {
        story:
          'Cover fills the frame and crops – right for photos. Contain shows everything – right for logos, screenshots, product shots and charts; surface/subtle fills the free space.',
      },
    },
  },
  render: () => (
    <div style={grid}>
      <div>
        <Image src={photo} alt="Evening light over the foothills" ratio="16:9" />
        <p style={label}>Cover · photo ✓</p>
      </div>
      <div>
        <Image src={sampleScreenshot()} alt="Dashboard with two tiles" ratio="16:9" />
        <p style={label}>Cover · screenshot cropped ✕</p>
      </div>
      <div>
        <Image src={sampleScreenshot()} alt="Dashboard with two tiles" ratio="16:9" fit="contain" />
        <p style={label}>Contain · screenshot ✓</p>
      </div>
    </div>
  ),
};

export const Overlays: Story = {
  name: 'Overlays',
  parameters: {
    docs: {
      description: {
        story:
          'Text sits only on a gradient, at the bottom (default) or at the top. One badge at most, top left. Play marks video – the whole thumbnail is the click target (here a link); hover, pressed and focus show on the play button.',
      },
    },
  },
  render: () => (
    <div style={grid}>
      <Image src={photo} alt="" ratio="4:3" overlay={{ title: 'Evening light in the valley', meta: 'Photo · 3 min read' }} />
      <Image src={photo} alt="" ratio="4:3" overlay={{ title: 'Evening light in the valley', meta: 'Photo · 3 min read', position: 'top' }} />
      <Image src={photo} alt="Evening light over the foothills" ratio="4:3" badge={<Badge size="sm">Featured</Badge>} />
      <a href="#video" aria-label="Play video: Evening light in the valley, 2:14" style={{ display: 'block', borderRadius: 'var(--medo-radius-md)' }}>
        <Image src={samplePhoto(1)} alt="" ratio="4:3" play="md" />
      </a>
      <div
        style={{
          display: 'flex',
          gap: 'var(--medo-space-4)',
          alignItems: 'center',
          padding: 'var(--medo-space-4)',
          background: 'var(--medo-color-surface-inverse)',
          borderRadius: 'var(--medo-radius-md)',
        }}
      >
        <MediaPlayButton size="md" />
        <MediaPlayButton size="lg" />
      </div>
    </div>
  ),
};

export const FigureStory: Story = {
  name: 'Figure',
  parameters: {
    docs: {
      description: {
        story:
          'The caption describes what matters, the credit names the source. The alt text replaces the image, the caption adds to it – never repeat one in the other.',
      },
    },
  },
  render: () => (
    <div style={{ maxInlineSize: '30rem' }}>
      <Figure caption="Evening light over the foothills, seen from the eastern ridge." credit="© Sample image · med.o Design System">
        <Image src={photo} alt="Sun low above a mountain ridge, valley in shadow" ratio="3:2" />
      </Figure>
    </div>
  ),
};

export const Embed: Story = {
  name: 'Embed consent',
  parameters: {
    docs: {
      description: {
        story:
          'Nothing loads from the provider – not even its thumbnail – until the click (GDPR, TTDSG § 25); even “privacy-enhanced” embed URLs still send the IP address. Default from 480 px width, Compact below (measured on the component). After the click the iframe replaces the placeholder and takes the focus; “Always load …” goes to `onConsent(true)` – store it in the consent manager. Here the iframe shows a local demo page.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--medo-layout-gap-group)', maxInlineSize: '40rem' }}>
      <EmbedConsent type="video" provider="Example Video" company="Example Inc." src={demoEmbed} title="Video: Product tour" privacyHref="#privacy" onConsent={fn()} />
      <div style={{ maxInlineSize: '20rem' }}>
        <EmbedConsent type="video" provider="Example Video" company="Example Inc." src={demoEmbed} title="Video: Product tour" privacyHref="#privacy" onConsent={fn()} />
      </div>
      <EmbedConsent type="map" provider="Example Maps" company="Example Inc." src={demoEmbed} title="Map: Our office" privacyHref="#privacy" onConsent={fn()} />
      <EmbedConsent type="generic" src={demoEmbed} title="Booking widget" privacyHref="#privacy" onConsent={fn()} />
    </div>
  ),
};

export const InteractionTest: Story = {
  ...interactionTest,
  render: () => (
    <div style={{ maxInlineSize: '40rem' }}>
      <EmbedConsent type="video" provider="Example Video" company="Example Inc." src={demoEmbed} title="Video: Product tour" privacyHref="#privacy" onConsent={fn()} />
    </div>
  ),
  play: async ({ canvas, userEvent, canvasElement }) => {
    // Nothing loads before the click.
    await expect(canvasElement.querySelector('iframe')).toBeNull();
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Always load Example Video videos' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Load video' }));
    // The iframe replaces the placeholder in place and takes the focus.
    const frame = await canvas.findByTitle('Video: Product tour');
    await waitFor(() => expect(frame).toHaveFocus());
  },
};
