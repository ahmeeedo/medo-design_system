import type { CSSProperties, Ref } from 'react';
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from 'react-aria-components';
import { Search } from 'lucide-react';
import { Badge } from '../badge/Badge';
import { formatShortcut, resolveShortcut } from '../tooltip/Tooltip';
import { cx } from '../utils/cx';
import { useKeyShortcuts } from '../utils/useKeyShortcuts';
import { useMessages } from '../i18n/I18n';

export interface QuickSearchTriggerProps extends Omit<AriaButtonProps, 'children' | 'className' | 'style'> {
  /** The placeholder text, which is also the button's name. Default: built-in text (“Search …”). */
  children?: string;
  /**
   * The shortcut that opens Quick search, in aria-keyshortcuts syntax. “Mod” = ⌘ on Apple, Ctrl elsewhere.
   * Shown as a hint and exposed to screen readers; Quick search itself listens for it. false hides it.
   */
  shortcut?: string | false;
  className?: string;
  style?: CSSProperties;
}

/**
 * Quick search trigger – a button in the look of an Input (md) that opens Quick search: search icon, placeholder and
 * the shortcut hint. It is a button, not a field: it only opens the dialog. On narrow screens use an IconButton.
 */
export function QuickSearchTrigger({ children, shortcut = 'Mod+K', className, style, ...props }: QuickSearchTriggerProps) {
  const m = useMessages();
  // React Aria drops aria-keyshortcuts; the ref sets it on the button.
  const keyRef = useKeyShortcuts<HTMLButtonElement>(shortcut ? resolveShortcut(shortcut) : undefined, (props as { ref?: Ref<HTMLButtonElement> }).ref);
  return (
    <AriaButton {...props} ref={keyRef} className={cx('medo-input', 'medo-input--md', 'medo-quick-search-trigger', className)} style={style}>
      <span className="medo-input__icon" aria-hidden="true">
        <Search />
      </span>
      <span className="medo-quick-search-trigger__label">{children ?? m.quickSearch.trigger}</span>
      {shortcut && (
        <span className="medo-quick-search-trigger__shortcut" aria-hidden="true">
          <Badge size="sm">{formatShortcut(shortcut, m.keys.control)}</Badge>
        </span>
      )}
    </AriaButton>
  );
}
