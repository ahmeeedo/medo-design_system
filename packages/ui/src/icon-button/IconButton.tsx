import type { CSSProperties, ReactNode } from 'react';
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from 'react-aria-components';
import { Spinner } from '../progress/Progress';
import { Tooltip, TooltipTrigger } from '../tooltip/Tooltip';
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
  /**
   * Tooltip text. Default: the aria-label, so sighted users see the same name.
   * Pass false to turn it off (e.g. when a visible label is next to the button).
   */
  tooltip?: ReactNode | false;
  /** Keyboard shortcut in aria-keyshortcuts syntax (e.g. „Control+C“). Exposed to screen readers and shown in the tooltip. */
  shortcut?: string;
  /** Visible form of the shortcut. Default: „Control+C“ → „Ctrl C“, „Meta+C“ → „⌘ C“. */
  shortcutLabel?: string;
  className?: string;
  style?: CSSProperties;
}

/** Square icon-only action (Figma: C02 Icon Button). Shares the Button styles. Shows its label as a tooltip. */
const KEY_LABELS: Record<string, string> = { Control: 'Ctrl', Meta: '⌘', Shift: '⇧' };
const formatShortcut = (keys: string) =>
  keys
    .split('+')
    .map((k) => KEY_LABELS[k] ?? k)
    .join(' ');

export function IconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  tooltip,
  shortcut,
  shortcutLabel,
  className,
  ...props
}: IconButtonProps) {
  const button = (
    <AriaButton
      {...props}
      aria-keyshortcuts={shortcut}
      className={cx('medo-button', 'medo-button--icon-only', `medo-button--${variant}`, `medo-button--${size}`, className)}
    >
      <span className="medo-button__icon" aria-hidden="true">
        {props.isPending ? <Spinner decorative /> : icon}
      </span>
    </AriaButton>
  );

  if (tooltip === false) return button;
  return (
    <TooltipTrigger>
      {button}
      <Tooltip shortcut={shortcutLabel ?? (shortcut && formatShortcut(shortcut))}>{tooltip ?? props['aria-label']}</Tooltip>
    </TooltipTrigger>
  );
}
