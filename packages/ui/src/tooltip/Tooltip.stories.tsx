import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bell, Copy, Download, Link2, Settings } from 'lucide-react';
import { Tooltip, TooltipTrigger } from './Tooltip';
import { IconButton } from '../icon-button/IconButton';
import { Button } from '../button/Button';
import { LightDark, row } from '../story-helpers';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  args: { children: 'Copy link' },
  parameters: {
    medo: { code: 'C14', subtitle: 'A short text label on hover or keyboard focus. Mainly names icon-only buttons.', figma: '155:26' },
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

export const LightAndDark: Story = {
  name: 'Light and Dark',
  parameters: { layout: 'fullscreen' },
  decorators: [],
  render: () => (
    <LightDark>
      <div style={{ paddingBlock: 'var(--medo-space-10)' }}>
        <TooltipTrigger defaultOpen>
          <IconButton aria-label="Copy link" tooltip={false} icon={<Link2 />} variant="secondary" />
          <Tooltip shortcut="Ctrl L">Copy link</Tooltip>
        </TooltipTrigger>
      </div>
    </LightDark>
  ),
};
