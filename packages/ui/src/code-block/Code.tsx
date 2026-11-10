import type { HTMLAttributes } from 'react';
import { cx } from '../utils/cx';

export interface CodeProps extends HTMLAttributes<HTMLElement> {
  /** A short piece of code: a prop, a value, a token, a file name. Longer code goes in a CodeBlock. */
  children: string;
}

/**
 * Inline code – a short piece of code inside running text. A `<code>` with the class `medo-code`.
 * Sets translate="no", so browser translation leaves the code alone. The size follows the surrounding text.
 * Without React: `<code class="medo-code" translate="no">`.
 */
export function Code({ className, children, ...props }: CodeProps) {
  return (
    <code translate="no" {...props} className={cx('medo-code', className)}>
      {children}
    </code>
  );
}
