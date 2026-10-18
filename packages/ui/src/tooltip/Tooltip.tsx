import type { ReactNode } from 'react';
import {
  Tooltip as AriaTooltip,
  TooltipTrigger as AriaTooltipTrigger,
  type TooltipProps as AriaTooltipProps,
  type TooltipTriggerComponentProps,
} from 'react-aria-components';
import { cx } from '../utils/cx';
import './tooltip.css';

/**
 * Wraps a focusable trigger (e.g. Button, IconButton) and its Tooltip.
 * Timing from Figma: 500 ms delay on hover, 100 ms close delay, instant on keyboard focus.
 * React Aria handles warm-up between neighbours, Escape and touch (no tooltip on touch).
 */
export function TooltipTrigger({ delay = 500, closeDelay = 100, ...props }: TooltipTriggerComponentProps) {
  return <AriaTooltipTrigger delay={delay} closeDelay={closeDelay} {...props} />;
}

export interface TooltipProps extends Omit<AriaTooltipProps, 'children' | 'className'> {
  /** A few words, at most one sentence. No links or buttons. */
  children: ReactNode;
  /** Keyboard shortcut, shown dimmed after the text (e.g. „⌘C“). */
  shortcut?: string;
  className?: string;
}

/** Tooltip – short label on hover or focus (Figma: C14 Tooltip). Top, 8 px offset, flips if needed. */
export function Tooltip({ children, shortcut, placement = 'top', offset = 8, className, ...props }: TooltipProps) {
  return (
    <AriaTooltip {...props} placement={placement} offset={offset} className={cx('medo-tooltip', className)}>
      <span>{children}</span>
      {shortcut && <kbd className="medo-tooltip__shortcut">{shortcut}</kbd>}
    </AriaTooltip>
  );
}
