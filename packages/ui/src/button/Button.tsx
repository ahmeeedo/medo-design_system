import type { CSSProperties, ReactNode } from 'react';
import { Button as AriaButton, Link as AriaLink, type ButtonProps as AriaButtonProps, type LinkProps as AriaLinkProps } from 'react-aria-components';
import { Spinner } from '../progress/Progress';
import { cx } from '../utils/cx';
import { useMessages } from '../i18n/I18n';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'text' | 'ghost-danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<AriaButtonProps, 'children' | 'className' | 'style'> {
  /** Visual weight. One primary button per area. */
  variant?: ButtonVariant;
  /** sm 32 px · md 40 px · lg 48 px (touch). */
  size?: ButtonSize;
  /** Icon before the label (decorative, hidden from screen readers). */
  startIcon?: ReactNode;
  /** Icon after the label (decorative, hidden from screen readers). */
  endIcon?: ReactNode;
  /** The label: a verb that says what happens (“Save changes”). While pending, what is happening (“Saving…”). */
  children?: ReactNode;
  /** Extra class on the root element – for layout (margin, width), not to restyle the component. */
  className?: string;
  /** Inline style on the button – for layout only (e.g. width), like className. */
  style?: CSSProperties;
  /**
   * Navigates instead of acting: renders a link (`<a href>`) with the button look – “Get started”, “Give feedback”.
   * Works with client-side routers through RouterProvider. isPending has no effect on a link.
   */
  href?: string;
  /** With href: “_blank” opens a new tab, adds rel="noopener noreferrer" and the hidden new-tab text. */
  target?: AriaLinkProps['target'];
  rel?: string;
  /** With target="_blank": hidden text for screen readers. Default: built-in text (“(opens in a new tab)”). */
  newTabLabel?: string;
}

/**
 * Button – triggers an action. Built on React Aria: consistent press,
 * hover and focus behaviour on mouse, touch, keyboard and screen readers.
 * Use onPress instead of onClick and isDisabled instead of disabled.
 * While saving, set isPending and change the label (“Saving…”): the button keeps its look and size.
 */
export function Button({ variant = 'primary', size = 'md', startIcon, endIcon, className, children, href, target, rel, newTabLabel, ...props }: ButtonProps) {
  const m = useMessages();
  // isPending: React Aria keeps focus and announces the pending state; a spinner replaces the start icon.
  const icon = props.isPending && !href ? <Spinner decorative /> : startIcon;
  const classes = cx('medo-button', `medo-button--${variant}`, `medo-button--${size}`, className);
  const newTab = target === '_blank';
  const content = (
    <>
      {icon && (
        <span className="medo-button__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="medo-button__label">{children}</span>
      {endIcon && (
        <span className="medo-button__icon" aria-hidden="true">
          {endIcon}
        </span>
      )}
      {newTab && <span className="medo-visually-hidden"> {newTabLabel ?? m.common.newTab}</span>}
    </>
  );
  if (href !== undefined) {
    // A link in the button look: navigation keeps link semantics (WCAG 4.1.2), the look stays the same.
    const { isPending: _pending, type: _type, form: _form, ...linkProps } = props as typeof props & { form?: string };
    return (
      <AriaLink {...(linkProps as Omit<AriaLinkProps, 'children'>)} href={href} target={target} rel={newTab ? (rel ?? 'noopener noreferrer') : rel} className={classes}>
        {content}
      </AriaLink>
    );
  }
  return (
    <AriaButton {...props} className={classes}>
      {content}
    </AriaButton>
  );
}

export interface ButtonGroupProps {
  /** footer: right, primary last · header: right, next to a title · content: left, primary first. */
  context?: 'footer' | 'header' | 'content';
  /** Buttons in reading order (footer: Cancel, Save · content: Get started, Learn more). */
  children: ReactNode;
  /** Footer only: a destructive action, placed on the far left and separated. */
  destructive?: ReactNode;
  /** Name of the group for screen readers, when it is not obvious from the context. */
  'aria-label'?: string;
  /** Extra class on the root element – for layout (margin, width), not to restyle the component. */
  className?: string;
}

/** Button group – spacing, alignment and mobile stacking for related buttons. */
export function ButtonGroup({ context = 'footer', children, destructive, className, ...props }: ButtonGroupProps) {
  return (
    <div
      role={props['aria-label'] ? 'group' : undefined}
      aria-label={props['aria-label']}
      className={cx('medo-button-group', `medo-button-group--${context}`, className)}
    >
      {destructive && context === 'footer' && <div className="medo-button-group__destructive">{destructive}</div>}
      {children}
    </div>
  );
}
