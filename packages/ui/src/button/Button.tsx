import type { CSSProperties, ReactNode } from 'react';
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from 'react-aria-components';
import { Spinner } from '../progress/Progress';
import { cx } from '../utils/cx';
import './button.css';

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
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * Button – triggers an action. Built on React Aria: consistent press,
 * hover and focus behaviour on mouse, touch, keyboard and screen readers.
 * Use onPress instead of onClick and isDisabled instead of disabled.
 * While saving, set isPending and change the label („Saving…“): the button keeps its look and size.
 */
export function Button({ variant = 'primary', size = 'md', startIcon, endIcon, className, children, ...props }: ButtonProps) {
  // isPending: React Aria keeps focus and announces the pending state; a spinner replaces the start icon.
  const icon = props.isPending ? <Spinner decorative /> : startIcon;
  return (
    <AriaButton {...props} className={cx('medo-button', `medo-button--${variant}`, `medo-button--${size}`, className)}>
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
