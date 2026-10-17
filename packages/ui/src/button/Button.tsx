import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import './button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'text' | 'ghost-danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual weight. One primary button per area. */
  variant?: ButtonVariant;
  /** sm 32 px · md 40 px · lg 48 px (touch). */
  size?: ButtonSize;
  /** Icon before the label (decorative, hidden from screen readers). */
  startIcon?: ReactNode;
  /** Icon after the label (decorative, hidden from screen readers). */
  endIcon?: ReactNode;
  ref?: Ref<HTMLButtonElement>;
}

/**
 * Button – triggers an action. For navigation use a link styled with the same classes.
 * Icon-only buttons are a separate component (Icon Button) because they need an accessible name.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  startIcon,
  endIcon,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  const classes = ['medo-button', `medo-button--${variant}`, `medo-button--${size}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} {...rest}>
      {startIcon && (
        <span className="medo-button__icon" aria-hidden="true">
          {startIcon}
        </span>
      )}
      <span className="medo-button__label">{children}</span>
      {endIcon && (
        <span className="medo-button__icon" aria-hidden="true">
          {endIcon}
        </span>
      )}
    </button>
  );
}
