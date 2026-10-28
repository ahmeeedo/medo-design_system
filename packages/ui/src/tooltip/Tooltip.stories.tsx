import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import { Bell, Copy, Download, Link2, Settings } from 'lucide-react';
import { Tooltip, TooltipTrigger } from './Tooltip';
import { IconButton } from '../icon-button/IconButton';
import { Button } from '../button/Button';
import { interactionTest, row } from '../story-helpers';

const meta = {
  title: 'Components/Overlays/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  args: { children: 'Copy link', placement: 'top', offset: 8 },
  argTypes: {
    children: { control: 'text' },
    placement: { control: 'inline-radio', options: ['top', 'bottom', 'start', 'end'] },
    offset: { control: { type: 'number', min: 0, max: 24, step: 4 } },
  },
  parameters: {
    medo: {
      subtitle: 'A short text label on hover or keyboard focus. Mainly names icon-only buttons.',
      usage: {
        when: [
          'Name an icon-only button (automatic for Icon Buttons).',
          'Show a keyboard shortcut.',
          'Show the full text of a truncated label.',
        ],
        whenNot: [
          'Information users need: put it on the page.',
          'Interactive content: use a Popover or a Toggletip.',
          'On touch devices: there is no hover.',
        ],
        do: ['Keep it to a few words.', 'Use it on focusable elements only.'],
        dont: ['Put links or buttons inside.', 'Repeat the visible label in a tooltip.'],
      },
      a11y: {
        keyboard: [
          ['Tab', 'Focus shows the tooltip at once.'],
          ['Esc', 'Hides the tooltip.'],
        ],
        notes: [
          'Opens after 500 ms on hover and instantly on keyboard focus.',
          'Icon Buttons show their `aria-label` as the tooltip, so sighted users see the same name.',
          'Esc hides it without moving the focus (WCAG 1.4.13).',
        ],
      },
      styling: {
        classes: [
          ['medo-tooltip', 'The tooltip.'],
          ['medo-tooltip__shortcut', 'Keyboard shortcut inside.'],
        ],
        states: ['data-entering', 'data-exiting', 'data-placement'],
      },
    },
    docs: {
      description: {
        component:
          'Built on React Aria TooltipTrigger: 500 ms delay on hover, instant on keyboard focus, Esc closes, no tooltip on touch. ' +
          'Icon Buttons show their label as a tooltip automatically. Never put links or buttons inside – use a Popover.',
      },
    },
  },
  decorators: [(Story) => <div style={{ paddingBlock: 'var(--medo-space-12)' }}>{Story()}</div>],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <TooltipTrigger defaultOpen>
      <IconButton aria-label="Copy link" tooltip={false} icon={<Link2 />} variant="secondary" />
      <Tooltip {...args} />
    </TooltipTrigger>
  ),
};

export const Variants: Story = {
  parameters: { docs: { description: { story: 'Label, label with shortcut, long text wraps at 240 px.' } } },
  render: () => (
    <div style={{ ...row, gap: 'var(--medo-space-24)', alignItems: 'flex-end' }}>
      <TooltipTrigger defaultOpen>
        <IconButton aria-label="Copy" tooltip={false} icon={<Copy />} variant="secondary" />
        <Tooltip>Copy</Tooltip>
      </TooltipTrigger>
      <TooltipTrigger defaultOpen>
        <IconButton aria-label="Copy link" tooltip={false} shortcut="Control+L" icon={<Link2 />} variant="secondary" />
        <Tooltip shortcut="Ctrl L">Copy link</Tooltip>
      </TooltipTrigger>
      <TooltipTrigger defaultOpen>
        <Button variant="secondary" startIcon={<Download />}>
          Download
        </Button>
        <Tooltip>Download all selected files as a ZIP archive</Tooltip>
      </TooltipTrigger>
    </div>
  ),
};

export const OnIconButtons: Story = {
  name: 'On icon buttons',
  parameters: {
    docs: { description: { story: 'Hover or tab through the toolbar: each Icon Button shows its label. Moving to a neighbour shows its tooltip at once.' } },
  },
  render: () => (
    <div role="toolbar" aria-label="Actions" style={row}>
      <IconButton aria-label="Copy" icon={<Copy />} />
      <IconButton aria-label="Notifications" icon={<Bell />} />
      <IconButton aria-label="Settings" shortcut="Control+," icon={<Settings />} />
    </div>
  ),
};

export const InteractionTest: Story = {
  ...interactionTest,
  render: () => <IconButton aria-label="Copy link" icon={<Link2 />} variant="secondary" />,
  play: async ({ userEvent }) => {
    const body = within(document.body);
    // Keyboard focus opens it at once, Esc closes it, focus stays.
    await userEvent.tab();
    await waitFor(() => expect(body.getByRole('tooltip')).toHaveTextContent('Copy link'));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('tooltip')).toBeNull());
    await expect(body.getByRole('button', { name: 'Copy link' })).toHaveFocus();
  },
};
