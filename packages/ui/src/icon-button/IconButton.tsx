import type { CSSProperties, ReactNode } from 'react';
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from 'react-aria-components';
import { cx } from '../utils/cx';
import '../button/button.css';

export interface IconButtonProps extends Omit<AriaButtonProps, 'children' | 'className' | 'style'> {
  /** Required: describes the action („Delete file“), because there is no visible label. */
  'aria-label': string;
  icon: ReactNode;
  /** ghost (default for toolbars) · secondary · primary · danger */
  variant?: 'ghost' | 'secondary' | 'primary' | 'danger';
  /** sm 32 · md 40 · lg 48 px with 16 / 20 / 24 px icons. */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: CSSProperties;
}

/** Square icon-only action (Figma: C02 Icon Button). Shares the Button styles. A tooltip is recommended. */
export function IconButton({ icon, variant = 'ghost', size = 'md', className, ...props }: IconButtonProps) {
  return (
    <AriaButton
      {...props}
      className={cx('medo-button', 'medo-button--icon-only', `medo-button--${variant}`, `medo-button--${size}`, className)}
    >
      <span className="medo-button__icon" aria-hidden="true">
        {icon}
      </span>
    </AriaButton>
  );
}
