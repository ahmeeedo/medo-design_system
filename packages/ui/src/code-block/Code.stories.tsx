import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Code } from './Code';
import { Example, Examples, interactionTest } from '../story-helpers';

const text = { margin: 0, color: 'var(--medo-color-text-primary)' };

const meta = {
  title: 'Components/Data display/Inline code',
  component: Code,
  tags: ['autodocs', 'status:experimental'],
  args: { children: 'variant="primary"' },
  argTypes: {
    children: { control: 'text', description: 'A short piece of code: a prop, a value, a token, a file name.' },
  },
  parameters: {
    medo: {
      subtitle: 'Marks a short piece of code inside running text.',
      usage: {
        when: ['Props, values, tokens, file names and commands inside a sentence.'],
        whenNot: ['Code with more than one line, or code to copy: use a CodeBlock.', 'Emphasis: use bold text.', 'Keyboard keys.'],
        do: ['Write the code exactly as it is typed.', 'Keep it short – a word or a value.'],
        dont: ['Put a whole sentence in code.', 'Link inline code. Put the link on the words around it.'],
      },
      a11y: {
        notes: [
          'A `<code>` element. Screen readers read the text as it is.',
          '`translate="no"`: browser translation leaves the code alone.',
          'Long values break anywhere, so they never widen the page on phones.',
          'In forced colors mode the background is replaced by an outline.',
        ],
      },
      styling: {
        classes: [['medo-code', 'Inline code on a `<code>` element. Size: 0.875em of the text around it.']],
        states: [],
      },
    },
    docs: {
      description: {
        component:
          'Use inline code for a short piece of code inside running text. The size follows the text around it. Without React: `<code class="medo-code" translate="no">`.',
      },
    },
  },
} satisfies Meta<typeof Code>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <p className="medo-text-body-md" style={text}>
      Set <Code {...args} /> to show the main action.
    </p>
  ),
};

export const InText: Story = {
  name: 'In text',
  parameters: { docs: { description: { story: 'The same class in every text size: code/md next to body/md, code/sm next to body/sm. Long values break.' } } },
  render: () => (
    <Examples>
      <Example label="body/lg">
        <p className="medo-text-body-lg" style={text}>
          Import <Code>@med-o/ui/styles.css</Code> once in your app.
        </p>
      </Example>
      <Example label="body/md">
        <p className="medo-text-body-md" style={text}>
          Set <Code>variant="primary"</Code> to show the main action.
        </p>
      </Example>
      <Example label="body/sm">
        <p className="medo-text-body-sm" style={text}>
          The token <Code>--medo-color-surface-subtle</Code> sets the background.
        </p>
      </Example>
      <Example label="Long value, narrow column">
        <p className="medo-text-body-md" style={{ ...text, maxInlineSize: 'var(--medo-size-width-2xs)' }}>
          Use <Code>--medo-color-interactive-primary-default-hover</Code> for the hover state.
        </p>
      </Example>
    </Examples>
  ),
};

export const InteractionTest: Story = {
  ...interactionTest,
  tags: ['!autodocs'],
  play: async ({ canvas }) => {
    const code = canvas.getByText('variant="primary"');
    await expect(code.tagName).toBe('CODE');
    await expect(code).toHaveAttribute('translate', 'no');
    await expect(code).toHaveClass('medo-code');
  },
};
