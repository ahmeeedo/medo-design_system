import type { ReactNode } from 'react';

/** Inline code token, e.g. <Tok>space/4</Tok> */
export const Tok = ({ children }: { children: ReactNode }) => <code className="doc-code">{children}</code>;

/** Text with `code` in backticks, as in the story descriptions. */
export function Rich({ children }: { children: string }) {
  return <>{children.split(/(`[^`]+`)/).map((part, i) => (part.startsWith('`') ? <Tok key={i}>{part.slice(1, -1)}</Tok> : part))}</>;
}
