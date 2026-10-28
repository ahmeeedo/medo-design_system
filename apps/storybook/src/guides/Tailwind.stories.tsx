import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@med-o/ui';

/**
 * Tailwind v4 with the med.o theme. Only system values exist:
 * colors are semantic (bg-surface-raised, text-text-secondary …), text styles are text-body-md etc.
 *
 * ```css
 * @import "tailwindcss";
 * @import "@med-o/design-tokens/css";
 * @import "@med-o/design-tokens/tailwind";
 * ```
 */
const meta = {
  title: 'Guides/Tailwind',
  // Keeps the URL of the former “Usage” group (…/usage-tailwind--docs).
  id: 'usage-tailwind',
  tags: ['autodocs'],
  parameters: { layout: 'centered', medo: { subtitle: 'Utility classes on top of the tokens. Only system values exist.' } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Card: Story = {
  render: () => (
    <article className="w-full max-w-[22rem] rounded-lg bg-surface-raised p-6 shadow-elevation-2 text-text-primary">
      <p className="text-overline uppercase text-text-secondary">Project</p>
      <h2 className="mt-1 text-heading-md">Website relaunch</h2>
      <p className="mt-2 text-body-sm text-text-secondary">
        All classes come from the design tokens. Switch the theme in the toolbar – nothing in this markup changes.
      </p>
      <div className="mt-6 flex gap-2">
        <Button>Open</Button>
        <Button variant="ghost">Share</Button>
      </div>
    </article>
  ),
};

// Tailwind only finds complete class names in the code – never build them from variables.
const tones = {
  success: 'bg-feedback-success-surface border-feedback-success-border text-feedback-success-text',
  warning: 'bg-feedback-warning-surface border-feedback-warning-border text-feedback-warning-text',
  danger: 'bg-feedback-danger-surface border-feedback-danger-border text-feedback-danger-text',
  info: 'bg-feedback-info-surface border-feedback-info-border text-feedback-info-text',
} as const;

export const Feedback: Story = {
  render: () => (
    <div className="grid w-full max-w-[26rem] gap-3">
      {(Object.keys(tones) as (keyof typeof tones)[]).map((tone) => (
        <div key={tone} className={`rounded-md border p-4 text-body-sm ${tones[tone]}`}>
          <strong className="text-label-md">{tone[0].toUpperCase() + tone.slice(1)}</strong> – feedback tokens via Tailwind.
        </div>
      ))}
    </div>
  ),
};
