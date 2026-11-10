import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type Key } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '../button/Button';
import { Tab, TabList, TabPanel, Tabs } from '../tabs/Tabs';
import { useMessages } from '../i18n/I18n';
import { cx } from '../utils/cx';

/** Role of a piece of code. Each role has its color token: code/keyword, code/string … Plain code has no role. */
export type CodeTokenRole = 'keyword' | 'string' | 'function' | 'constant' | 'comment' | 'punctuation';

/** One piece of a line. */
export interface CodeToken {
  content: string;
  role?: CodeTokenRole;
}

/** Highlighted code: one array of tokens per line. Made by `highlight()` from `@med-o/ui/highlight`. */
export type CodeTokens = CodeToken[][];

interface CodeContentProps {
  /** The code as plain text. The copy button copies exactly this. */
  code: string;
  /** Language of the code (“tsx”, “bash”). Set as `data-language`; highlight() needs it as well. */
  language?: string;
  /** Syntax colors: the result of `await highlight(code, language)`. Without it the code is shown in one color. */
  tokens?: CodeTokens;
  /** Numbers before the lines. They are not copied and not read by screen readers. */
  lineNumbers?: boolean;
  /** Lines to mark, counted from 1 (`[5]`). For the one or two lines the text talks about. */
  highlightLines?: number[];
}

export interface CodeBlockProps extends CodeContentProps {
  /** File name or language above the code (“app/layout.tsx”). Also names the scroll area for screen readers. */
  title?: string;
  /** Shows the copy button. */
  copyable?: boolean;
  /** Name of the code for screen readers when there is no title (“Install command”). */
  'aria-label'?: string;
  /** Extra class on the root element – for layout (margin, width), not to restyle the component. */
  className?: string;
}

/**
 * Code block – code to read and copy. A `<figure>` with an optional title (`<figcaption>`), `<pre><code>`
 * and a copy button with a visible label. Long lines scroll, they never wrap.
 * Syntax colors come from `highlight()` in `@med-o/ui/highlight` (Shiki) – call it at build time or in a
 * server component and pass the result as `tokens`, so no highlighting code reaches the browser.
 */
export function CodeBlock({ title, copyable = true, className, 'aria-label': ariaLabel, ...content }: CodeBlockProps) {
  const copy = copyable && <CopyButton code={content.code} />;
  return (
    <figure className={cx('medo-code-block', !title && 'medo-code-block--bare', className)} data-language={content.language}>
      {title && (
        <div className="medo-code-block__header">
          <figcaption className="medo-code-block__title">{title}</figcaption>
          {copy}
        </div>
      )}
      <div className="medo-code-block__body">
        <CodeContent {...content} label={title ?? ariaLabel} />
        {!title && copy}
      </div>
    </figure>
  );
}

export interface CodeBlockTab extends CodeContentProps {
  /** Unique key of the tab. */
  id: string;
  /** Tab label, 1–2 words (“npm”, “Next.js”). */
  label: string;
}

export interface CodeBlockTabsProps {
  /** Variants of the same code, one tab each (npm / pnpm / yarn, Vite / Next.js). 2–4 tabs. */
  items: CodeBlockTab[];
  /** Names the tabs (“Package manager”). Required – the tabs have no visible heading. */
  'aria-label': string;
  /** Numbers before the lines of every tab. */
  lineNumbers?: boolean;
  /** Shows the copy button. It copies the code of the selected tab. */
  copyable?: boolean;
  /** Selected tab (controlled), e.g. remembered across the page. */
  selectedKey?: string;
  /** Tab selected at first (uncontrolled). Default: the first tab. */
  defaultSelectedKey?: string;
  /** Called with the id of the newly selected tab. */
  onSelectionChange?: (key: string) => void;
  /** Extra class on the root element – for layout (margin, width), not to restyle the component. */
  className?: string;
}

/**
 * Code block with tabs – the same code in variants. Built on Tabs (React Aria): ← → switch the tab,
 * the copy button copies the code of the selected tab.
 */
export function CodeBlockTabs({
  items,
  lineNumbers,
  copyable = true,
  selectedKey,
  defaultSelectedKey,
  onSelectionChange,
  className,
  'aria-label': ariaLabel,
}: CodeBlockTabsProps) {
  const [own, setOwn] = useState(defaultSelectedKey ?? items[0]?.id);
  const current = selectedKey ?? own;
  const selected = items.find((item) => item.id === current) ?? items[0];
  const change = (key: Key) => {
    setOwn(String(key));
    onSelectionChange?.(String(key));
  };
  return (
    <div className={cx('medo-code-block', 'medo-code-block--tabs', className)} data-language={selected?.language}>
      <Tabs selectedKey={current} onSelectionChange={change}>
        <div className="medo-code-block__header">
          <TabList aria-label={ariaLabel}>
            {items.map((item) => (
              <Tab key={item.id} id={item.id}>
                {item.label}
              </Tab>
            ))}
          </TabList>
          {copyable && selected && <CopyButton code={selected.code} />}
        </div>
        {items.map(({ id, label, ...item }) => (
          <TabPanel key={id} id={id} keepMounted={false} className="medo-code-block__body">
            <CodeContent lineNumbers={lineNumbers} {...item} label={label} />
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
}

/** The code: pre > code > one block per line. Line numbers and the highlight are CSS, not text. */
function CodeContent({ code, language, tokens, lineNumbers, highlightLines, label }: CodeContentProps & { label?: string }) {
  const m = useMessages();
  const ref = useRef<HTMLPreElement>(null);
  const scrolls = useScrolls(ref);
  const lines: CodeTokens = tokens ?? splitLines(code).map((line) => (line ? [{ content: line }] : []));
  const marked = new Set(highlightLines);
  return (
    <pre
      ref={ref}
      className={cx('medo-code-block__code', lineNumbers && 'medo-code-block__code--numbers')}
      style={{ '--_digits': String(lines.length).length } as CSSProperties}
      // Wider than the block: reachable with the keyboard to scroll (WCAG 2.1.1), named as a region.
      tabIndex={scrolls ? 0 : undefined}
      role={scrolls ? 'region' : undefined}
      aria-label={scrolls ? (label ?? m.codeBlock.label) : undefined}
      // Browser translation would change the code.
      translate="no"
    >
      <code data-language={language}>
        {lines.map((line, index) => (
          <span key={index} className="medo-code-block__line" data-highlighted={marked.has(index + 1) || undefined}>
            {line.map((token, i) =>
              token.role ? (
                <span key={i} className={`medo-code-block__token--${token.role}`}>
                  {token.content}
                </span>
              ) : (
                token.content
              ),
            )}
          </span>
        ))}
      </code>
    </pre>
  );
}

/** Copy with a visible label. After copying: check and “Copied” for 2 s, announced by a polite live region. */
function CopyButton({ code }: { code: string }) {
  const m = useMessages();
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const [announcement, setAnnouncement] = useState('');
  useEffect(() => {
    if (state !== 'copied') return;
    const timer = setTimeout(() => setState('idle'), 2000);
    return () => clearTimeout(timer);
  }, [state]);
  const press = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setState('copied');
      // The same text again must be announced again: alternate a trailing no-break space.
      setAnnouncement((before) => m.codeBlock.copied + (before.endsWith(' ') ? '' : ' '));
    } catch {
      setState('failed');
      setAnnouncement(m.codeBlock.copyFailed);
    }
  };
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="medo-code-block__copy"
        startIcon={state === 'copied' ? <Check /> : <Copy />}
        onPress={press}
      >
        {state === 'copied' ? m.codeBlock.copied : m.codeBlock.copy}
      </Button>
      <span role="status" className="medo-visually-hidden">
        {announcement}
      </span>
    </>
  );
}

/** Lines of the code; one line break at the end is not an extra line. */
function splitLines(code: string) {
  return code.replace(/\r\n?/g, '\n').replace(/\n$/, '').split('\n');
}

/** True while the code is wider than its block. */
function useScrolls(ref: React.RefObject<HTMLPreElement | null>) {
  const [scrolls, setScrolls] = useState(false);
  useLayoutEffect(() => {
    const pre = ref.current;
    if (!pre) return;
    const update = () => setScrolls(pre.scrollWidth > pre.clientWidth + 1);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(pre);
    return () => observer.disconnect();
  }, [ref]);
  return scrolls;
}
