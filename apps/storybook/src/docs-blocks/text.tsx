import type { ReactNode } from 'react';

/** Inline code token, e.g. <Tok>space/4</Tok> */
export const Tok = ({ children }: { children: ReactNode }) => <code className="doc-code">{children}</code>;

/** Text with `code` in backticks and **bold**, as in the story descriptions and the changelog. */
export function Rich({ children }: { children: string }) {
  return (
    <>
      {children.split(/(`[^`]+`|\*\*[^*]+\*\*)/).map((part, i) =>
        part.startsWith('`') ? <Tok key={i}>{part.slice(1, -1)}</Tok> : part.startsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part,
      )}
    </>
  );
}
