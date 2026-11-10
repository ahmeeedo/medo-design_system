import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';
import { OnThisPage, type OnThisPageItem } from './OnThisPage';
import { interactionTest } from '../story-helpers';

const sections = (prefix: string): OnThisPageItem[] =>
  ['Overview', 'Anatomy', 'Usage', 'Content', 'Accessibility'].map((label) => ({ id: `${prefix}-${label.toLowerCase()}`, label }));

/** A long page with the sections the component links to. */
function Page({ prefix, children }: { prefix: string; children: ReactNode }) {
  return (
    <div style={{ display: 'grid', gap: 'var(--medo-layout-gap-section)' }}>
      {children}
      {sections(prefix).map((s) => (
        <section key={s.id} style={{ display: 'grid', gap: 'var(--medo-layout-gap-content)' }}>
          <h3 id={s.id} className="medo-text-heading-md" style={{ margin: 0 }}>
            {s.label}
          </h3>
          <p style={{ margin: 0, font: 'var(--medo-typography-body-md)', color: 'var(--medo-color-text-secondary)' }}>
            Section text. On a real page this is several paragraphs, so the list has something to follow while you scroll.
          </p>
        </section>
      ))}
    </div>
  );
}

const meta = {
  title: 'Components/Navigation/On this page',
  component: OnThisPage,
  tags: ['autodocs', 'status:experimental'],
  args: { items: sections('playground'), variant: 'rail' },
  argTypes: {
    items: { control: false, description: 'Sections in page order: `{ id, label }`. The id is the target element on the page.' },
    variant: { control: 'inline-radio', options: ['rail', 'disclosure'], description: 'rail: desktop, next to the content. disclosure: mobile, below the page header.' },
    label: { control: 'text', description: 'Title and name of the navigation region. Default: “On this page”.' },
  },
  parameters: {
    medo: {
      subtitle: 'Links to the sections of a long page and shows where you are.',
      usage: {
        when: ['Long pages with 3 or more sections: docs, guides, policies.'],
        whenNot: ['Short pages that fit on one or two screens.', 'Moving between pages: use the side navigation.'],
        do: [
          'Use the same words as the section headings.',
          'Show the rail next to the content on wide screens and the disclosure below the page header on small ones.',
          'List one heading level only, usually h2.',
        ],
        dont: ['Nest a second level.', 'Show the rail and the disclosure at the same time.'],
      },
      a11y: {
        keyboard: [
          ['Tab', 'Moves through the links (and the disclosure button).'],
          ['Enter', 'Jumps to the section and moves focus there. In the disclosure, also closes it.'],
          ['Space', 'Opens and closes the disclosure.'],
        ],
        notes: [
          'A navigation region named “On this page” with an ordered list of links.',
          'The rail marks the section in view with `aria-current="location"`.',
          'Links are plain `#id` anchors, so they work without JavaScript and open in a new tab.',
          'After a jump, focus moves to the target, so the next Tab continues in that section.',
          'The jump is smooth unless the user prefers reduced motion.',
        ],
      },
      styling: {
        classes: [
          ['medo-on-this-page', 'Navigation; `--rail` or `--disclosure`.'],
          ['medo-on-this-page__title', 'Rail title.'],
          ['medo-on-this-page__list, __link', 'Ordered list and its links.'],
          ['medo-on-this-page__disclosure, __trigger, __panel', 'Disclosure box, its button and the panel.'],
          ['medo-on-this-page__chevron', 'Chevron of the disclosure button.'],
        ],
        states: ['data-current', 'data-expanded', 'data-hovered', 'data-pressed', 'data-focus-visible'],
      },
    },
    docs: {
      description: {
        component:
          'Use “On this page” to jump between the sections of a long page. The rail stays next to the content and follows the scroll position; the disclosure is the same list behind a button for small screens.',
      },
    },
  },
} satisfies Meta<typeof OnThisPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) var(--medo-size-width-2xs)', gap: 'var(--medo-space-8)', alignItems: 'start' }}>
      <Page prefix="playground">{null}</Page>
      <div style={{ position: 'sticky', insetBlockStart: 0 }}>
        <OnThisPage {...args} />
      </div>
    </div>
  ),
};

export const Disclosure: Story = {
  name: 'Disclosure',
  args: { items: sections('disclosure'), variant: 'disclosure' },
  parameters: { docs: { description: { story: 'Below 640 px: the same links behind a button under the page header. It closes after a jump.' } } },
  render: (args) => (
    <Page prefix="disclosure">
      <OnThisPage {...args} />
    </Page>
  ),
};

export const InteractionTest: Story = {
  ...interactionTest,
  tags: ['!autodocs'],
  args: { items: sections('test'), variant: 'disclosure' },
  render: (args) => (
    <Page prefix="test">
      <OnThisPage {...args} />
      <OnThisPage items={args.items} variant="rail" label="Sections" />
    </Page>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'On this page' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    // A jump closes the disclosure and moves focus to the section heading.
    const nav = canvas.getByRole('navigation', { name: 'On this page' });
    await userEvent.click(nav.querySelector('a[href="#test-usage"]') as HTMLElement);
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
    await waitFor(() => expect(document.activeElement?.id).toBe('test-usage'));

    // The rail marks exactly one section as the current one; the disclosure marks none.
    const rail = canvas.getByRole('navigation', { name: 'Sections' });
    await userEvent.click(rail.querySelector('a[href="#test-content"]') as HTMLElement);
    await waitFor(() => expect(rail.querySelectorAll('[aria-current="location"]')).toHaveLength(1));
    await expect(nav.querySelectorAll('[aria-current]')).toHaveLength(0);
  },
};
