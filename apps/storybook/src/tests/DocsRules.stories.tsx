import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { unparsedBreaking } from '../docs-blocks/Changelog';

/**
 * Docs rules (Guides / Component status, “Docs”): every component page has Usage, a Playground, Accessibility and
 * Styling, and every interactive component has an interaction test. That every prop in the Playground has a
 * description is checked on the built pages (scripts/check-docs.mjs) – Vitest runs without Storybook's docgen.
 * Every breaking change in the CHANGELOGs follows the format, so What's new lists it under “Before you update”.
 * Tests only – hidden from the sidebar (`!dev`).
 */
const meta = {
  title: 'Tests/Docs rules',
  tags: ['!dev', '!autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Pages without a Playground – with the reason. */
const noPlayground: Record<string, string> = {
  'Components/Forms/Form': 'A form without fields shows nothing; the examples show it with fields.',
};

/** Pages without an interaction test – static components, nothing to operate. */
const noInteraction: Record<string, string> = {
  'Components/Layout/Container': 'Layout only.',
  'Components/Layout/Grid': 'Layout only.',
  'Components/Layout/Stack': 'Layout only.',
  'Components/Feedback/Badge': 'Static label.',
  'Components/Feedback/Empty State': 'Static content; its actions are Buttons with their own tests.',
  'Components/Feedback/Progress': 'Shows a value; nothing to operate.',
  'Components/Data display/Avatar': 'Static image or initials.',
  'Components/Data display/List': 'Static list; links in it are Links with their own tests.',
};

type StoryModule = Record<string, unknown> & {
  default: { title?: string; parameters?: { medo?: { usage?: unknown; a11y?: unknown; styling?: unknown } } };
};

const modules = import.meta.glob<StoryModule>('../../../../packages/ui/src/*/*.stories.tsx', { eager: true });

/** Component pages with the names of their stories (`name`, else the export name). */
function pages() {
  return Object.values(modules)
    .filter((module) => module.default.title?.startsWith('Components/'))
    .map((module) => ({
      title: module.default.title!,
      medo: module.default.parameters?.medo ?? {},
      stories: Object.entries(module)
        .filter(([key]) => key !== 'default' && key !== '__namedExportsOrder')
        .map(([key, story]) => (story as { name?: string } | undefined)?.name ?? key),
    }));
}

export const Sections: Story = {
  render: () => <div />,
  play: async () => {
    const all = pages();
    await expect(all.length).toBeGreaterThan(40);
    for (const { title, medo, stories } of all) {
      await expect(medo.usage, `${title}: Usage (parameters.medo.usage)`).toBeTruthy();
      await expect(medo.a11y, `${title}: Accessibility (parameters.medo.a11y)`).toBeTruthy();
      await expect(medo.styling, `${title}: Styling (parameters.medo.styling)`).toBeTruthy();
      const reason = noPlayground[title];
      await expect(stories.includes('Playground'), `${title}: ${reason ? 'has a Playground now – remove it from noPlayground' : 'story “Playground”'}`).toBe(!reason);
    }
  },
};

/** Every breaking change in the CHANGELOGs is recognised – else “Before you update” and “Only breaking” miss it. */
export const BreakingChanges: Story = {
  name: 'Breaking changes in the changelog',
  render: () => <div />,
  play: async () => {
    await expect(unparsedBreaking, 'Write “**Breaking:**” or “**Breaking (note):**” (README, Contributing)').toEqual([]);
  },
};

export const InteractionTests: Story = {
  name: 'Interaction tests',
  render: () => <div />,
  play: async () => {
    for (const { title, stories } of pages()) {
      const reason = noInteraction[title];
      const tested = stories.some((name) => name.startsWith('Interaction test'));
      await expect(tested, `${title}: ${reason ? 'has an interaction test now – remove it from noInteraction' : 'story “Interaction test”'}`).toBe(!reason);
    }
  },
};
