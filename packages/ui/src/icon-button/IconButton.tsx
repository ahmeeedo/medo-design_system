'use client';

import type { CSSProperties, ReactNode, Ref } from 'react';
import { Button as AriaButton, Link as AriaLink, type ButtonProps as AriaButtonProps, type LinkProps as AriaLinkProps } from 'react-aria-components';
import { Spinner } from '../progress/Progress';
import { Tooltip, TooltipTrigger, formatShortcut, resolveShortcut } from '../tooltip/Tooltip';
import { cx } from '../utils/cx';
import { useKeyShortcuts } from '../utils/useKeyShortcuts';
import { useMessages } from '../i18n/I18n';

export interface IconButtonProps extends Omit<AriaButtonProps, 'children' | 'className' | 'style'> {
  /** Required: describes the action (“Delete file”), because there is no visible label. */
  'aria-label': string;
  /** The icon (lucide-react). Decorative – the name comes from `aria-label`. */
  icon: ReactNode;
  /**
   * ghost (default for toolbars) · secondary · primary · danger.
   * On images and video: media – round overlay/media fill for busy images ·
   * media-ghost – no fill, on a gradient bar (video controls).
   */
  variant?: 'ghost' | 'secondary' | 'primary' | 'danger' | 'media' | 'media-ghost';
  /** sm 32 · md 40 · lg 48 px with 16 / 20 / 24 px icons. Media variants: sm 28 with a 44 px hit area. */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Tooltip text. Default: the aria-label, so sighted users see the same name.
   * Pass false to turn it off (e.g. when a visible label is next to the button).
   */
  tooltip?: ReactNode | false;
  /** Keyboard shortcut in aria-keyshortcuts syntax (e.g. “Control+C”). Exposed to screen readers and shown in the tooltip. */
  shortcut?: string;
  /** Visible form of the shortcut. Default: “Control+C” → “Ctrl C”, “Meta+C” → “⌘ C”. */
  shortcutLabel?: string;
  /** Navigates instead of acting: renders a link (`<a href>`) in the icon button look, like Button with `href`. */
  href?: string;
  /** With href: “_blank” opens a new tab, adds rel="noopener noreferrer" and the hidden new-tab text to the name. */
  target?: AriaLinkProps['target'];
  /** With href: the link relation. Default with target="_blank": “noopener noreferrer”. */
  rel?: string;
  /** With target="_blank": hidden text for screen readers. Default: built-in text (“(opens in a new tab)”). */
  newTabLabel?: string;
  className?: string;
  style?: CSSProperties;
}

/** Square icon-only action. Shares the Button styles. Shows its label as a tooltip. */
export function IconButton({ icon, variant = 'ghost', size = 'md', tooltip, shortcut, shortcutLabel, href, target, rel, newTabLabel, className, ...props }: IconButtonProps) {
  const m = useMessages();
  // React Aria drops aria-keyshortcuts; the ref sets it on the button.
  const keyRef = useKeyShortcuts<HTMLElement>(shortcut && resolveShortcut(shortcut), (props as { ref?: Ref<HTMLElement> }).ref);
  const classes = cx('medo-button', 'medo-button--icon-only', `medo-button--${variant}`, `medo-button--${size}`, className);
  const newTab = target === '_blank';
  let button: ReactNode;
  if (href !== undefined) {
    // A link in the icon button look: navigation keeps link semantics. The name is aria-label, so the new-tab text
    // joins it there (hidden text inside would not be read).
    const { isPending: _pending, type: _type, form: _form, 'aria-label': label, ...linkProps } = props as typeof props & { form?: string };
    button = (
      <AriaLink
        {...(linkProps as Omit<AriaLinkProps, 'children'>)}
        ref={keyRef}
        href={href}
        target={target}
        rel={newTab ? (rel ?? 'noopener noreferrer') : rel}
        aria-label={newTab ? `${label} ${newTabLabel ?? m.common.newTab}` : label}
        className={classes}
      >
        <span className="medo-button__icon" aria-hidden="true">
          {icon}
        </span>
      </AriaLink>
    );
  } else {
    button = (
      <AriaButton {...props} ref={keyRef as Ref<HTMLButtonElement>} className={classes}>
        <span className="medo-button__icon" aria-hidden="true">
          {props.isPending ? <Spinner decorative /> : icon}
        </span>
      </AriaButton>
    );
  }

  if (tooltip === false) return button;
  return (
    <TooltipTrigger>
      {button}
      <Tooltip shortcut={shortcutLabel ?? (shortcut && formatShortcut(shortcut, m.keys.control))}>{tooltip ?? props['aria-label']}</Tooltip>
    </TooltipTrigger>
  );
}
