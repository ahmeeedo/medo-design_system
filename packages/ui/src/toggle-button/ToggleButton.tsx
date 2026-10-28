import { createContext, useContext, useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import {
  SelectionIndicator,
  Separator,
  ToggleButton as AriaToggleButton,
  ToggleButtonGroup as AriaToggleButtonGroup,
  Toolbar as AriaToolbar,
  type ToggleButtonGroupProps as AriaToggleButtonGroupProps,
  type ToggleButtonProps as AriaToggleButtonProps,
  type ToolbarProps as AriaToolbarProps,
} from 'react-aria-components';
import { Tooltip, TooltipTrigger, formatShortcut, resolveShortcut } from '../tooltip/Tooltip';
import { cx } from '../utils/cx';

type ToggleSize = 'sm' | 'md' | 'lg';

/** Item size set by a group (segmented items are one size smaller than the group). */
const ToggleSizeContext = createContext<ToggleSize | null>(null);
/** Segmented groups show a sliding indicator (iOS segmented control). */
const SegmentedContext = createContext(false);

export interface ToggleButtonProps extends Omit<AriaToggleButtonProps, 'children' | 'className' | 'style'> {
  /** Visible label. It never changes with the state (“Bold” stays “Bold”). Leave out for icon only. */
  children?: ReactNode;
  /** Leading icon; alone it makes an icon-only toggle (then aria-label is required). */
  icon?: ReactNode;
  /** sm 32 · md 40 · lg 48 px, like Button. Inside a group the group sets it. */
  size?: ToggleSize;
  /** Icon only: tooltip text. Default: the aria-label. false turns it off. */
  tooltip?: ReactNode | false;
  /** Keyboard shortcut in aria-keyshortcuts syntax (e.g. “Control+B”), shown in the tooltip. */
  shortcut?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Toggle Button – a button that stays pressed.
 * Built on React Aria ToggleButton: announced as pressed / not pressed (aria-pressed).
 * For an immediate, local effect (bold, mute, favourite). Saved settings use Switch, navigation uses Tabs.
 */
export function ToggleButton({ children, icon, size, tooltip, shortcut, className, ...props }: ToggleButtonProps) {
  const groupSize = useContext(ToggleSizeContext);
  const segmented = useContext(SegmentedContext);
  const s = groupSize ?? size ?? 'md';
  const iconOnly = !children;
  const button = (
    <AriaToggleButton
      {...props}
      aria-keyshortcuts={shortcut && resolveShortcut(shortcut)}
      className={cx('medo-button', `medo-button--${s}`, iconOnly && 'medo-button--icon-only', 'medo-toggle', className)}
    >
      {/* Segmented: the selected fill is an indicator that slides from the previous item (React Aria SelectionIndicator). */}
      {segmented && <SelectionIndicator className="medo-toggle__indicator" />}
      {icon && (
        <span className="medo-button__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </AriaToggleButton>
  );

  if (!iconOnly || tooltip === false) return button;
  return (
    <TooltipTrigger>
      {button}
      <Tooltip shortcut={shortcut && formatShortcut(shortcut)}>{tooltip ?? props['aria-label']}</Tooltip>
    </TooltipTrigger>
  );
}

export interface ToggleButtonGroupProps extends Omit<AriaToggleButtonGroupProps, 'children' | 'className' | 'style'> {
  /**
   * segmented: switch between 2–5 views, exactly one on, shared container.
   * toolbar: formatting options, any combination (or selectionMode="single", e.g. text alignment), no container.
   */
  variant?: 'segmented' | 'toolbar';
  /** Height of the group: md 40 · lg 48 (segmented items are one size smaller). */
  size?: 'md' | 'lg';
  /** Segmented only: full width, items share the space (mobile). */
  fullWidth?: boolean;
  /** Required when there is no visible label: names the group (“View”). */
  'aria-label'?: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * Toggle button group. Built on React Aria ToggleButtonGroup:
 * Tab enters once on the selected item, arrow keys move between items.
 */
export function ToggleButtonGroup({
  variant = 'segmented',
  size = 'md',
  fullWidth,
  selectionMode,
  disallowEmptySelection,
  children,
  className,
  ...props
}: ToggleButtonGroupProps) {
  const segmented = variant === 'segmented';
  /*
   * Workaround for React Aria: inside a Toolbar a multi-select group switches to role="group" after
   * mounting but keeps aria-orientation, which ARIA does not allow on a group (axe: aria-allowed-attr).
   * React re-sets the attribute only when its value changes, so removing it once per change is enough.
   */
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fix = () => {
      if (el.getAttribute('role') === 'group' && el.hasAttribute('aria-orientation')) el.removeAttribute('aria-orientation');
    };
    fix();
    const observer = new MutationObserver(fix);
    observer.observe(el, { attributes: true, attributeFilter: ['role', 'aria-orientation'] });
    return () => observer.disconnect();
  }, []);
  const itemSize: ToggleSize = segmented ? (size === 'lg' ? 'md' : 'sm') : size;
  return (
    <AriaToggleButtonGroup
      {...props}
      ref={ref}
      selectionMode={segmented ? 'single' : (selectionMode ?? 'multiple')}
      disallowEmptySelection={segmented || disallowEmptySelection}
      className={cx('medo-toggle-group', `medo-toggle-group--${variant}`, `medo-toggle-group--${size}`, segmented && fullWidth && 'medo-toggle-group--full', className)}
    >
      <SegmentedContext.Provider value={segmented}>
        <ToggleSizeContext.Provider value={itemSize}>{children}</ToggleSizeContext.Provider>
      </SegmentedContext.Provider>
    </AriaToggleButtonGroup>
  );
}

export interface ToolbarProps extends Omit<AriaToolbarProps, 'className' | 'style'> {
  /** Required: names the toolbar (“Text formatting”). */
  'aria-label': string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Toolbar – several toggle groups (and buttons) in one row.
 * Built on React Aria Toolbar: one Tab stop for the whole toolbar, arrow keys move across all groups.
 */
export function Toolbar({ className, ...props }: ToolbarProps) {
  return <AriaToolbar {...props} className={cx('medo-toolbar', className)} />;
}

/** Divider between groups in a Toolbar (1 px border/default, 24 px high). */
export function ToolbarSeparator() {
  return <Separator orientation="vertical" className="medo-toolbar__separator" />;
}
