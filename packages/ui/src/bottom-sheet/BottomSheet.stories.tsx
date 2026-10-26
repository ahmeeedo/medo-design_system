import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialogTrigger } from 'react-aria-components';
import { expect, fn, waitFor, within } from 'storybook/test';
import { BottomSheet } from './BottomSheet';
import { Button } from '../button/Button';
import { Checkbox, CheckboxGroup } from '../checkbox/Checkbox';
import { interactionTest, semantic } from '../story-helpers';

const text: React.CSSProperties = { margin: 0, padding: '0 var(--medo-space-4) var(--medo-space-4)', font: 'var(--medo-typography-body-md)', color: 'var(--medo-color-text-secondary)' };

const meta = {
  title: 'Components/Bottom Sheet',
  component: BottomSheet,
  tags: ['autodocs'],
  args: { title: 'Share project', height: 'content', children: null, onOpenChange: fn() },
  argTypes: {
    title: { control: 'text' },
    height: { control: 'inline-radio', options: ['content', 'full'] },
    children: { control: false },
    footer: { control: false },
    onOpenChange: { control: false },
    isDismissable: { control: 'boolean', description: 'A tap on the scrim closes the sheet (default true).' },
    closeLabel: semantic,
    isOpen: { control: false },
    defaultOpen: { control: false },
    isKeyboardDismissDisabled: { control: false },
  },
  parameters: {
    medo: { code: 'C10', subtitle: 'A modal layer that slides up from the bottom on small screens.', figma: '134:436' },
    docs: {
      description: {
        component:
          'Built on React Aria ModalOverlay + Modal + Dialog: focus stays inside and returns to the trigger, the page does not scroll, the title names the dialog. ' +
          'Closes by swiping down on the handle or header, a tap on the scrim, Esc or the close button (the non-drag alternative, WCAG 2.5.7). ' +
          'Height = content, max 90 %; `full` keeps 90 % (with search). One task per sheet, never a sheet from a sheet. ' +
          'Select and Combobox use it automatically below 640 px. Styles: `medo-sheet-overlay`, `medo-sheet`, `medo-sheet__footer`.',
      },
    },
  },
  render: (args) => (
    <DialogTrigger>
      <Button>Open sheet</Button>
      <BottomSheet
        {...args}
        footer={(close) => (
          <Button size="lg" onPress={close}>
            Copy link
          </Button>
        )}
      >
        <p style={text}>Everyone with the link can view the project. You can turn this off at any time in the settings.</p>
      </BottomSheet>
    </DialogTrigger>
  ),
} satisfies Meta<typeof BottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: { docs: { description: { story: 'Open the sheet to see the changes from the controls.' } } },
};

export const WithContent: Story = {
  name: 'Form content',
  parameters: { docs: { description: { story: 'The content scrolls when it is taller than the sheet; header and footer stay.' } } },
  render: () => (
    <DialogTrigger>
      <Button variant="secondary">Notifications</Button>
      <BottomSheet
        title="Notifications"
        footer={(close) => (
          <Button size="lg" onPress={close}>
            Save
          </Button>
        )}
      >
        <div style={{ padding: '0 var(--medo-space-4) var(--medo-space-4)' }}>
          <CheckboxGroup label="Send me" size="lg" defaultValue={['mentions']}>
            <Checkbox value="mentions">Mentions</Checkbox>
            <Checkbox value="comments">Comments on my projects</Checkbox>
            <Checkbox value="weekly" description="Every Monday at 9 am">
              Weekly summary
            </Checkbox>
          </CheckboxGroup>
        </div>
      </BottomSheet>
    </DialogTrigger>
  ),
};

export const InteractionTest: Story = {
  ...interactionTest,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Open sheet' });
    await userEvent.click(trigger);
    const body = within(document.body);
    const sheet = await body.findByRole('dialog', { name: 'Share project' });
    await waitFor(() => expect(sheet).toContainElement(document.activeElement as HTMLElement));
    // The close button and Esc close it; focus returns.
    await userEvent.click(within(sheet).getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(body.queryByRole('dialog')).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};
