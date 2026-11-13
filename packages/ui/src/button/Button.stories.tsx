import type React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRight, Download, ExternalLink, Plus, Trash2 } from 'lucide-react';
import { expect, fn } from 'storybook/test';
import { Button, ButtonGroup } from './Button';
import { interactionTest, StateGrid, STATE_ATTRIBUTES } from '../story-helpers';
import { Spinner } from '../progress/Progress';

const meta = {
  title: 'Components/Actions/Button',
  component: Button,
  tags: ['autodocs', 'status:stable'],
  args: { children: 'Button', variant: 'primary', size: 'md', isDisabled: false, isPending: false, onPress: fn() },
  // The Playground has the controls of the docs site: Variant, Size, Pending, Disabled and Icon (story Playground).
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost', 'danger', 'text', 'ghost-danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    startIcon: { control: false },
    endIcon: { control: false },
    children: { control: false },
    href: { control: false },
    target: { control: false },
    rel: { control: false },
    newTabLabel: { control: false },
    isPending: { control: 'boolean', description: 'Shows a spinner and blocks presses while an action runs.' },
    isDisabled: { control: 'boolean' },
    onPress: { control: false },
  },
  parameters: {
    medo: {
      figma: '66:177',
      subtitle: 'Triggers an action.',
      usage: {
        when: ['Start an action on the current page: save, send, delete, open a dialog.', 'Submit a form (`type="submit"`).'],
        whenNot: [
          'Go to another page: use a Link.',
          'Turn a setting on or off: use a Switch or a Toggle Button.',
          'An action shown only as an icon: use an Icon Button.',
        ],
        do: [
          'One primary button per area.',
          'Name the action with a verb: “Save changes”, not “OK”.',
          'Show `isPending` while the action runs.',
          'Put related buttons into a `ButtonGroup`.',
        ],
        dont: ['Several primary buttons side by side.', '`danger` for actions that are not destructive.', 'Disable a button without telling why.'],
      },
      a11y: {
        keyboard: [
          ['Tab', 'Moves the focus to the button.'],
          ['Enter / Space', 'Runs the action.'],
        ],
        notes: [
          'The label names the button. Icons are decorative and hidden from screen readers.',
          'While pending, the button keeps its size and focus; the label says what happens (“Saving…”).',
          'Disabled buttons are skipped by the keyboard.',
          'With `href` it is a link in the button look: announced as a link, because it navigates. With `target="_blank"` screen readers also hear “opens in a new tab”.',
          'Heights: sm 32 px, md 40 px, lg 48 px for touch.',
        ],
        // Manual test with NVDA, VoiceOver and TalkBack (Guides / Screen reader testing).
        screenReader: {
          // Through the Playground only, so the same steps work in Storybook and on the docs site.
          steps: [
            ['Go to the heading “Playground”, then to the button with the next element.', '“Button, button”. (With the mouse over it, NVDA reads only the text – that is fine.)'],
            ['Activate it.', 'Nothing new – the focus stays on the button.'],
            ['In the Playground, set Icon to “start”, then go back to the button.', 'Still “Button, button” – the icon is not read.'],
            ['Set Icon to “none” and turn on Disabled (`isDisabled`). Go back to the button with the next element (not Tab).', '“Button, button” with “unavailable”, “dimmed” or “disabled”. Tab skips it – that is right.'],
            ['Turn off Disabled and turn on Pending (`isPending`). Go back to the button and activate it.', '“Button, button” with “unavailable” or “dimmed”. Nothing happens and the focus stays on the button.'],
          ],
          tested: [
            { reader: 'nvda', versions: 'NVDA 2026.3 · Chrome 156 · Windows 11', date: '2026-11-07', result: 'passed', issue: 17 },
            { reader: 'voiceover', versions: 'iOS 27.0.1 · Safari', date: '2026-11-07', result: 'passed', issue: 18 },
            { reader: 'talkback', versions: 'Android 13 · Chrome 156', date: '2026-11-07', result: 'passed', issue: 19 },
          ],
        },
      },
      styling: {
        classes: [
          ['medo-button', 'Base class.'],
          ['medo-button--{variant}', '`primary`, `secondary`, `ghost`, `danger`, `text`, `ghost-danger`.'],
          ['medo-button--{size}', '`sm` or `lg`. Without it: md.'],
          ['medo-button__icon', 'Icon before or after the label.'],
          ['medo-button-group', 'Spacing and order of related buttons; `--footer`, `--header`.'],
        ],
        states: ['data-hovered', 'data-pressed', 'data-focus-visible', 'data-disabled', 'data-pending'],
      },
    },
    docs: {
      description: {
        component:
          'Use a button to start an action, like saving or sending. Built on React Aria: use `onPress` instead of `onClick` and `isDisabled` instead of `disabled`. ' +
          'The CSS also works on a plain HTML `<button>`.',
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Playground only: which prop gets an icon. Storybook maps the option to the prop name. */
type PlaygroundArgs = React.ComponentProps<typeof Button> & { icon?: 'startIcon' | 'endIcon' };

export const Playground: StoryObj<PlaygroundArgs> = {
  args: { icon: 'none' as never },
  argTypes: {
    icon: {
      control: 'inline-radio',
      options: ['none', 'start', 'end'],
      mapping: { none: undefined, start: 'startIcon', end: 'endIcon' },
      description: 'An icon before the label (`startIcon`) or after it (`endIcon`).',
      table: { category: 'Playground' },
    },
  },
  render: ({ icon, ...args }) => (
    <Button {...args} {...(icon === 'startIcon' ? { startIcon: <Plus /> } : icon === 'endIcon' ? { endIcon: <ArrowRight /> } : {})} />
  ),
};

const row = { display: 'flex', gap: 'var(--medo-layout-gap-inline)', alignItems: 'center', flexWrap: 'wrap' } as const;
const col = { display: 'grid', gap: 'var(--medo-layout-gap-group)' } as const;

export const Variants: Story = {
  render: (args) => (
    <div style={row}>
      <Button {...args} variant="primary">
        Primary
      </Button>
      <Button {...args} variant="secondary">
        Secondary
      </Button>
      <Button {...args} variant="ghost">
        Ghost
      </Button>
      <Button {...args} variant="danger">
        Danger
      </Button>
      <Button {...args} variant="ghost-danger">
        Ghost danger
      </Button>
      <Button {...args} variant="text">
        Text
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={row}>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
};

export const WithIcons: Story = {
  name: 'With icons',
  render: (args) => (
    <div style={row}>
      <Button {...args} startIcon={<Plus />}>
        New project
      </Button>
      <Button {...args} variant="secondary" startIcon={<Download />}>
        Export
      </Button>
      <Button {...args} variant="text" endIcon={<ArrowRight />}>
        Learn more
      </Button>
      <Button {...args} variant="danger" startIcon={<Trash2 />}>
        Delete
      </Button>
    </div>
  ),
};

export const AsLink: Story = {
  name: 'As a link',
  parameters: {
    docs: {
      description: {
        story:
          'For navigation in button form (“Get started”, “Give feedback”) pass `href`: it renders an `<a>` with the same look. With `target="_blank"` it adds `rel="noopener noreferrer"` and a hidden “(opens in a new tab)”; show the external icon so sighted users know it too.',
      },
    },
  },
  render: () => (
    <ButtonGroup context="content">
      <Button href="#start" endIcon={<ArrowRight />}>
        Get started
      </Button>
      <Button href="#feedback" target="_blank" variant="secondary" endIcon={<ExternalLink />}>
        Give feedback
      </Button>
    </ButtonGroup>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <div style={row}>
      {(['primary', 'secondary', 'ghost', 'danger', 'text'] as const).map((v) => (
        <Button key={v} {...args} variant={v} isDisabled>
          {v[0].toUpperCase() + v.slice(1)}
        </Button>
      ))}
    </div>
  ),
};

/** All variants in Light and Dark side by side – uses data-theme on a wrapper. */
export const Pending: Story = {
  parameters: {
    docs: {
      description: {
        story: 'While saving: `isPending` keeps the look, size and focus; a spinner replaces the icon and the label says what happens.',
      },
    },
  },
  render: (args) => (
    <div style={row}>
      <Button {...args} isPending>
        Saving…
      </Button>
      <Button {...args} variant="secondary" isPending startIcon={<Download />}>
        Exporting…
      </Button>
    </div>
  ),
};

const VARIANTS = ['primary', 'secondary', 'ghost', 'danger', 'text', 'ghost-danger'] as const;
const label = (v: string) => v[0].toUpperCase() + v.slice(1).replace('-', ' ');
/** A plain HTML button with the classes and state attributes – the same CSS as the component. */
const plain = (v: string, attrs: object, content: React.ReactNode = label(v)) => (
  <button key={v} type="button" className={`medo-button medo-button--${v} medo-button--md`} {...attrs}>
    {content}
  </button>
);

export const InteractiveStates: Story = {
  name: 'Interactive states',
  parameters: {
    docs: {
      description: {
        story:
          'Every state of every variant at a glance – a picture, rendered as plain HTML with the state attributes (`data-hovered`, `data-pressed`, `data-focus-visible`, `data-pending`). To try the button, use the Playground.',
      },
    },
  },
  render: () => (
    <StateGrid
      states={[
        ...Object.entries(STATE_ATTRIBUTES).map(([state, attrs]) => [state, VARIANTS.map((v) => plain(v, attrs))] as [string, React.ReactNode]),
        ['Disabled', VARIANTS.map((v) => plain(v, { disabled: true }))],
        [
          'Pending',
          VARIANTS.map((v) =>
            plain(
              v,
              { 'data-pending': '', 'aria-disabled': 'true' },
              <>
                <span className="medo-button__icon" aria-hidden="true">
                  <Spinner decorative />
                </span>
                <span className="medo-button__label">Saving…</span>
              </>,
            ),
          ),
        ],
      ]}
    />
  ),
};

export const Group: Story = {
  name: 'Button group',
  parameters: {
    docs: {
      description: {
        story:
          'Spacing, order and mobile stacking for related buttons. **footer**: right, primary last, a destructive action far left. ' +
          '**content**: left, primary first. Below 640 px the buttons stack, the primary on top.',
      },
    },
  },
  render: () => (
    <div style={col}>
      <ButtonGroup destructive={<Button variant="ghost-danger">Delete</Button>}>
        <Button variant="secondary">Cancel</Button>
        <Button>Save</Button>
      </ButtonGroup>
      <ButtonGroup context="content">
        <Button>Get started</Button>
        <Button variant="secondary">Learn more</Button>
      </ButtonGroup>
    </div>
  ),
};

export const InteractionTest: Story = {
  ...interactionTest,
  // Literal, so the story index (and the tag filters of the test projects) see it too.
  tags: ['!autodocs'],
  play: async ({ canvas, userEvent, args }) => {
    const button = canvas.getByRole('button', { name: 'Button' });
    await userEvent.click(button);
    await expect(args.onPress).toHaveBeenCalledTimes(1);
    // Keyboard: Enter and Space press it too.
    button.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(args.onPress).toHaveBeenCalledTimes(3);
  },
};
