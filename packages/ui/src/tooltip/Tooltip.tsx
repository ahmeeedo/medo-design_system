import { useContext, type ReactNode } from 'react';
import {
  Link as AriaLink,
  Tooltip as AriaTooltip,
  TooltipTrigger as AriaTooltipTrigger,
  TooltipTriggerStateContext,
  type LinkProps as AriaLinkProps,
  type TooltipProps as AriaTooltipProps,
  type TooltipTriggerComponentProps,
} from 'react-aria-components';
import { cx } from '../utils/cx';

/**
 * Wraps a focusable trigger (e.g. Button, IconButton) and its Tooltip.
 * Timing: 500 ms delay on hover, 100 ms close delay, instant on keyboard focus.
 * React Aria handles warm-up between neighbours, Escape and touch (no tooltip on touch).
 */
export function TooltipTrigger({ delay = 500, closeDelay = 100, ...props }: TooltipTriggerComponentProps) {
  return <AriaTooltipTrigger delay={delay} closeDelay={closeDelay} {...props} />;
}

export interface TooltipProps extends Omit<AriaTooltipProps, 'children' | 'className'> {
  /** A few words, at most one sentence. No links or buttons. */
  children: ReactNode;
  /** Keyboard shortcut, shown dimmed after the text (e.g. “⌘C”). */
  shortcut?: string;
  className?: string;
}

const KEY_LABELS: Record<string, string> = { Control: 'Ctrl', Meta: '⌘', Shift: '⇧', Alt: 'Alt' };

/** True on macOS and iOS: “Mod” means ⌘ there, Ctrl everywhere else. */
const isApple = () => typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

/** “Mod+D” → “Meta+D” on Apple devices, “Control+D” elsewhere (aria-keyshortcuts syntax). */
export const resolveShortcut = (keys: string) => keys.replace(/\bMod\b/g, isApple() ? 'Meta' : 'Control');

/** Visible form of an aria-keyshortcuts value: “Control+C” → “Ctrl C”, “Meta+C” → “⌘ C”, “Mod+C” → per platform. */
export const formatShortcut = (keys: string) =>
  resolveShortcut(keys)
    .split('+')
    .map((k) => KEY_LABELS[k] ?? k)
    .join(' ');

/** Tooltip – short label on hover or focus. Top, 8 px offset, flips if needed. */
export function Tooltip({ children, shortcut, placement = 'top', offset = 8, className, ...props }: TooltipProps) {
  return (
    <AriaTooltip {...props} placement={placement} offset={offset} className={cx('medo-tooltip', className)}>
      <span>{children}</span>
      {shortcut && <kbd className="medo-tooltip__shortcut">{shortcut}</kbd>}
    </AriaTooltip>
  );
}

/**
 * Link as a tooltip trigger. React Aria's Link takes focus but not hover from a TooltipTrigger –
 * this opens the tooltip on hover too. Internal (Navigation rail, Breadcrumbs), not exported from the package.
 */
export function TooltipLink(props: AriaLinkProps) {
  const tooltip = useContext(TooltipTriggerStateContext);
  return <AriaLink {...props} onHoverStart={() => tooltip?.open()} onHoverEnd={() => tooltip?.close()} />;
}
