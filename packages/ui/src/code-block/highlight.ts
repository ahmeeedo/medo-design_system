/**
 * @med-o/ui/highlight – syntax colors for CodeBlock, made with Shiki.
 *
 * Runs at build time or in a server component, not in the browser: Shiki and its grammars are large.
 * Needs `shiki` as a dependency of your app (optional peer dependency of @med-o/ui).
 *
 *   import { highlight } from '@med-o/ui/highlight';
 *   <CodeBlock code={code} language="tsx" tokens={await highlight(code, 'tsx')} />
 *
 * The result is plain data (no HTML, no colors): each piece has a role, and the role's color comes from the
 * code/* tokens – so Light, Dark and your own brand apply without highlighting again.
 */
import { codeToTokens, createCssVariablesTheme, type BundledLanguage, type SpecialLanguage } from 'shiki';
import type { CodeTokenRole, CodeTokens } from './CodeBlock';

export type { CodeToken, CodeTokenRole, CodeTokens } from './CodeBlock';

/** Shiki's CSS variables theme: every color is `var(--shiki-token-<name>)`, so the name tells the role. */
const theme = createCssVariablesTheme({ name: 'medo-code', fontStyle: false });

/** Shiki's token names → roles. Parameters, links and diff markers stay plain. */
const roles: Record<string, CodeTokenRole> = {
  keyword: 'keyword',
  string: 'string',
  'string-expression': 'string',
  function: 'function',
  constant: 'constant',
  comment: 'comment',
  punctuation: 'punctuation',
};

/**
 * Highlights code for CodeBlock. `language`: any language Shiki knows (“tsx”, “bash”, “css”, “json” …)
 * or “text” for plain text. Unknown languages throw – a typo should not ship silently.
 */
export async function highlight(code: string, language: BundledLanguage | SpecialLanguage): Promise<CodeTokens> {
  const { tokens } = await codeToTokens(code.replace(/\r\n?/g, '\n').replace(/\n$/, ''), { lang: language, theme });
  return tokens.map((line) => {
    const out: CodeTokens[number] = [];
    for (const { content, color } of line) {
      const role = roles[color?.match(/--shiki-token-([a-z-]+)/)?.[1] ?? ''];
      const last = out.at(-1);
      // Neighbors with the same role become one piece – less markup.
      if (last && last.role === role) last.content += content;
      else out.push(role ? { content, role } : { content });
    }
    return out;
  });
}
