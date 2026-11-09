import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, spyOn, waitFor } from 'storybook/test';
import { CodeBlock, CodeBlockTabs, type CodeBlockProps, type CodeBlockTabsProps, type CodeTokens } from './CodeBlock';
import { highlight } from './highlight';
import { interactionTest, semantic } from '../story-helpers';

const column: React.CSSProperties = { display: 'grid', gap: 'var(--medo-layout-gap-content)' };

const tsx = `import { Button } from '@med-o/ui';

export function Save() {
  // One primary action per area
  return <Button variant="primary">Save</Button>;
}`;

const css = `.card {
  background: var(--medo-color-surface-raised);
  padding: var(--medo-space-6);
}`;

const install = [
  { id: 'npm', label: 'npm', code: 'npm install @med-o/ui @med-o/design-tokens', language: 'bash' },
  { id: 'pnpm', label: 'pnpm', code: 'pnpm add @med-o/ui @med-o/design-tokens', language: 'bash' },
  { id: 'yarn', label: 'yarn', code: 'yarn add @med-o/ui @med-o/design-tokens', language: 'bash' },
];

type Language = Parameters<typeof highlight>[1];

/** Highlights like an app would at build time – here in the browser, so the controls stay live. */
function Highlighted(props: CodeBlockProps) {
  const [tokens, setTokens] = useState<CodeTokens>();
  useEffect(() => {
    let live = true;
    setTokens(undefined);
    if (props.language) void highlight(props.code, props.language as Language).then((result) => live && setTokens(result));
    return () => {
      live = false;
    };
  }, [props.code, props.language]);
  return <CodeBlock {...props} tokens={tokens} />;
}

/** The same for every tab. */
function HighlightedTabs(props: CodeBlockTabsProps) {
  const [items, setItems] = useState(props.items);
  useEffect(() => {
    let live = true;
    void Promise.all(props.items.map(async (item) => ({ ...item, tokens: await highlight(item.code, item.language as Language) }))).then(
      (result) => live && setItems(result),
    );
    return () => {
      live = false;
    };
  }, [props.items]);
  return <CodeBlockTabs {...props} items={items} />;
}

/** Screenshots and tests wait until the colors are there. */
const colored = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  await waitFor(() => expect(canvasElement.querySelector('[class*="medo-code-block__token--"]')).not.toBeNull());
};

const meta = {
  title: 'Components/Data display/Code block',
  component: CodeBlock,
  subcomponents: { CodeBlockTabs: CodeBlockTabs as React.ComponentType<unknown> },
  tags: ['autodocs', 'status:experimental'],
  args: { code: tsx, language: 'tsx', title: 'app/save.tsx', lineNumbers: true, highlightLines: [5], copyable: true },
  argTypes: {
    code: { control: 'text' },
    language: { control: 'select', options: ['tsx', 'css', 'bash', 'json', 'text'] },
    title: { control: 'text' },
    highlightLines: { control: 'object' },
    tokens: { control: false, description: 'Syntax colors: `await highlight(code, language)` from `@med-o/ui/highlight`. Here the story highlights the code itself.' },
    'aria-label': semantic,
  },
  render: (args) => <Highlighted {...args} />,
  play: colored,
  parameters: {
    medo: {
      subtitle: 'Code to read and copy – plain, with a file name or with tabs for variants.',
      usage: {
        when: ['Examples and commands people copy: install, setup, usage of a component.', 'Short code that the text around it explains.'],
        whenNot: [
          'A name or value inside a sentence (`gap-items`): use inline code.',
          'Logs, long files or code people edit: use an editor or a download.',
        ],
        do: [
          'Keep examples short and complete – they must work when copied.',
          'Name the file with `title` when the file matters.',
          'Use `CodeBlockTabs` for the same code in variants: npm / pnpm / yarn, Vite / Next.js.',
          'Mark one or two lines the text talks about with `highlightLines`.',
        ],
        dont: [
          'Put real keys, tokens or personal data in examples – use example.com and placeholders.',
          'Highlight in the browser in production: call `highlight()` at build time or in a server component.',
          'Use tabs for unrelated examples.',
        ],
      },
      a11y: {
        keyboard: [
          ['Tab', 'Moves to the copy button; to the code when it is wider than the block, then ← → scroll it.'],
          ['Enter / Space', 'Copies the code.'],
          ['← →', 'Tabs: switch between the variants.'],
        ],
        notes: [
          'Real text in `<pre><code>`: selectable, zoomable and read as it is. Line numbers are CSS – not copied, not read.',
          'Every syntax color reaches 4.5 : 1 on surface/subtle and surface/default in Light and Dark; the code reads the same without color.',
          'The copy button has a visible label. “Copied” is announced by a polite live region; if the browser blocks the clipboard, the message says how to copy by hand.',
          'Code wider than the block becomes a focusable region named by the title (WCAG 2.1.1).',
          'The title is a `<figcaption>` of the `<figure>`.',
        ],
      },
      styling: {
        classes: [
          ['medo-code-block', 'Root: surface/subtle, border, radius/lg.'],
          ['medo-code-block--bare', 'Without a title: the copy button sits in the corner.'],
          ['medo-code-block--tabs', 'With tabs in the header.'],
          ['medo-code-block__header', 'Title or tabs, and the copy button.'],
          ['medo-code-block__title', 'File name or language, label/sm.'],
          ['medo-code-block__code', 'The scroll area (`<pre>`), code/sm.'],
          ['medo-code-block__code--numbers', 'Shows line numbers.'],
          ['medo-code-block__line', 'One line; `data-highlighted` marks it.'],
          ['medo-code-block__token--{role}', 'keyword, string, function, constant, comment, punctuation – colors code/*.'],
        ],
        states: ['data-highlighted', 'data-language'],
      },
    },
    docs: {
      description: {
        component:
          'A `<figure>` with `<pre><code>` and a copy button with a visible label. Long lines scroll, they never wrap. ' +
          'Syntax colors come from `highlight()` in `@med-o/ui/highlight` (Shiki, optional peer dependency): call it at build time or in a server component and pass the result as `tokens`. ' +
          'Each piece gets a role, and the role takes its color from the code/* tokens – Light, Dark and your brand apply without highlighting again.',
      },
    },
  },
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Header: Story = {
  parameters: { docs: { description: { story: 'Title for a file name or language. Without it the copy button sits in the corner – for short snippets.' } } },
  render: () => (
    <div style={column}>
      <Highlighted code={css} language="css" title="styles/card.css" lineNumbers />
      <Highlighted code="npm install @med-o/ui @med-o/design-tokens" language="bash" aria-label="Install command" />
    </div>
  ),
};

export const Tabs: Story = {
  parameters: { docs: { description: { story: '`CodeBlockTabs`: the same code in variants. The copy button copies the selected tab.' } } },
  render: () => <HighlightedTabs aria-label="Package manager" items={install} />,
};

export const LongLines: Story = {
  name: 'Long lines',
  parameters: { docs: { description: { story: 'Long lines scroll instead of wrapping. The code area is then reachable with Tab and scrolls with ← →.' } } },
  args: {
    title: 'app/layout.tsx',
    highlightLines: undefined,
    code: `import '@med-o/design-tokens/css/tokens.css'; // the variables, Light and Dark – once, at the root of the app, before every other style`,
  },
};

export const InteractionTest: Story = {
  ...interactionTest,
  // Literal, so the story index (and the tag filters of the test projects) see it too.
  tags: ['!autodocs'],
  render: () => (
    <div style={column}>
      <CodeBlock code={css} language="css" title="styles/card.css" lineNumbers />
      <CodeBlockTabs aria-label="Package manager" items={install} />
      <div style={{ maxInlineSize: 'var(--medo-size-width-3xl)' }}>
        <CodeBlock code={`const value = 'a line that is far too long for the block, so the code area scrolls and can be reached with the keyboard';`} title="long.ts" />
      </div>
    </div>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const write = spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    const [cardCopy, tabsCopy, longCopy] = canvas.getAllByRole('button', { name: 'Copy' });

    // Copies the code as it is – line numbers are CSS, not text.
    await userEvent.click(cardCopy);
    await expect(write).toHaveBeenLastCalledWith(css);
    // The label changes after the clipboard answers – later in WebKit than in Chromium.
    await waitFor(() => expect(cardCopy).toHaveTextContent('Copied'));
    await waitFor(() => expect(canvas.getAllByRole('status')[0]).toHaveTextContent('Copied'));
    await expect(canvasElement.querySelector('figure code')?.textContent).toBe(css.replace(/\n/g, ''));

    // Tabs: ← → switch, the copy button copies the selected variant.
    await userEvent.click(canvas.getByRole('tab', { name: 'npm' }));
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('tab', { name: 'pnpm' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(tabsCopy);
    await expect(write).toHaveBeenLastCalledWith(install[1].code);

    // Blocked clipboard: say how to copy by hand.
    write.mockRejectedValueOnce(new Error('blocked'));
    await userEvent.click(longCopy);
    await waitFor(() => expect(canvas.getAllByRole('status')[2]).toHaveTextContent('Could not copy. Select the code and copy it.'));

    // Wider than the block: a named, focusable region.
    const region = await canvas.findByRole('region', { name: 'long.ts' });
    await expect(region).toHaveAttribute('tabindex', '0');
    write.mockRestore();
  },
};
