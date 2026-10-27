import type { ReactNode } from 'react';
import { Link as AriaLink, type LinkProps as AriaLinkProps } from 'react-aria-components';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { cx } from '../utils/cx';
import '../utils/utilities.css';
import './link.css';

export interface LinkProps extends Omit<AriaLinkProps, 'children' | 'className'> {
  /** The text says where it goes („Privacy policy“, not „click here“). */
  children: ReactNode;
  /** inline: inside running text, always underlined · standalone: own line, underline on hover. */
  variant?: 'inline' | 'standalone';
  /** Standalone only: sm (label/sm) · md (label/md). Inline links take the size of the surrounding text. */
  size?: 'sm' | 'md';
  /** Another website: shows the external icon. With target="_blank" screen readers also hear „opens in a new tab“. */
  external?: boolean;
  /** Standalone only: arrow after the text („View all →“). */
  arrow?: boolean;
  /** Hidden text for links that open a new tab. */
  newTabLabel?: string;
  className?: string;
}

/**
 * Link – navigates to a page, place or file. Built on React Aria Link:
 * a real `<a href>`, works with client-side routers through RouterProvider. For actions use Button.
 */
export function Link({
  children,
  variant = 'inline',
  size = 'md',
  external,
  arrow,
  newTabLabel = '(opens in a new tab)',
  className,
  ...props
}: LinkProps) {
  const newTab = props.target === '_blank';
  return (
    <AriaLink
      {...props}
      rel={newTab ? (props.rel ?? 'noopener noreferrer') : props.rel}
      className={cx('medo-link', variant === 'standalone' && 'medo-link--standalone', variant === 'standalone' && `medo-link--${size}`, className)}
    >
      {children}
      {external && <ExternalLink className="medo-link__icon" aria-hidden="true" />}
      {!external && arrow && variant === 'standalone' && <ArrowRight className="medo-link__icon" aria-hidden="true" />}
      {newTab && <span className="medo-visually-hidden"> {newTabLabel}</span>}
    </AriaLink>
  );
}
