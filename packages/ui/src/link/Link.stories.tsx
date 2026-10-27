import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from './Link';
import { row, semantic } from '../story-helpers';

const text: React.CSSProperties = { font: 'var(--medo-typography-body-md)', color: 'var(--medo-color-text-primary)', margin: 0, maxInlineSize: '36rem' };

const meta = {
  title: 'Components/Actions/Link',
  component: Link,
  tags: ['autodocs'],
  args: { children: 'View all projects', href: '#', variant: 'standalone', size: 'md', arrow: true },
  argTypes: {
    variant: { control: 'inline-radio', options: ['inline', 'standalone'] },
    /* Size and arrow only apply to standalone links; inline links take the size of the text. */
    size: { control: 'inline-radio', options: ['sm', 'md'], if: { arg: 'variant', eq: 'standalone' } },
    arrow: { control: 'boolean', if: { arg: 'variant', eq: 'standalone' } },
    newTabLabel: semantic,
    href: semantic,
    children: { control: 'text' },
  },
  parameters: {
    medo: { subtitle: 'Navigates to a page, a place on the page or a file. Actions are buttons.' },
    docs: {
      description: {
        component:
          'A real `<a href>` on React Aria Link. **Inline** links sit in running text and are always underlined, so they do not rely on colour. ' +
          '**Standalone** links stand on their own line and show the underline on hover. ' +
          'Styles: `medo-link`, `medo-link--standalone medo-link--md`.',
      },
    },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Inline: Story = {
  parameters: { docs: { description: { story: 'Takes the size of the surrounding text. The link text says where it goes.' } } },
  render: () => (
    <p style={text}>
      By continuing you accept our <Link href="#">terms of use</Link> and the <Link href="#">privacy policy</Link>. Questions? Read the{' '}
      <Link href="https://example.com" target="_blank" external>
        help centre
      </Link>
      .
    </p>
  ),
};

export const Standalone: Story = {
  parameters: { docs: { description: { story: 'For “View all”, “Back to overview” or links in lists. Arrow for moving forward, external icon for other websites.' } } },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--medo-space-3)', justifyItems: 'start' }}>
      <div style={row}>
        <Link variant="standalone" href="#" arrow>
          View all projects
        </Link>
        <Link variant="standalone" size="sm" href="#" arrow>
          View all projects
        </Link>
      </div>
      <div style={row}>
        <Link variant="standalone" href="https://example.com" target="_blank" external>
          Documentation
        </Link>
        <Link variant="standalone" size="sm" href="https://example.com" target="_blank" external>
          Documentation
        </Link>
      </div>
    </div>
  ),
};
