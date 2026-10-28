import { useEffect, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { Button as AriaButton, Toolbar } from 'react-aria-components';
import { Ellipsis, X } from 'lucide-react';
import { Button } from '../button/Button';
import { IconButton } from '../icon-button/IconButton';
import { Menu, MenuButton, MenuItem, MenuTrigger } from '../menu/Menu';
import { cx } from '../utils/cx';
import { MOBILE_QUERY, useMediaQuery } from '../utils/useMediaQuery';
import { useMessages } from '../i18n/I18n';

export interface BulkAction {
  /** Verb (“Export”, “Archive”, “Delete”). */
  label: string;
  onAction: () => void;
  /** danger: destructive – confirm it (Alert dialog) or offer Undo (Toast). Mobile: ghost danger. */
  variant?: 'default' | 'danger';
  /** Icon for the “…” menu (actions after the third). */
  icon?: ReactNode;
}

export interface BulkActionBarProps {
  /** Number of selected items. 0 hides the bar. */
  count: number;
  /** Max 3 are shown; more go into the “…” menu. Destructive last. */
  actions: BulkAction[];
  /** Clears the selection (× and Esc). */
  onClear: () => void;
  /** auto: floating dark bar on desktop, full-width bar at the bottom below 640 px · desktop · mobile. */
  variant?: 'auto' | 'desktop' | 'mobile';
  /** Texts (localize). */
  countLabel?: (count: number) => string;
  clearLabel?: string;
  moreLabel?: string;
  'aria-label'?: string;
  className?: string;
}

/**
 * Bulk action bar – actions for the selected rows of a Table or List view.
 * Appears with ≥ 1 selected item and floats, so selecting never shifts the layout. A toolbar: the count is
 * announced, Esc or × clears the selection. Render it right after the list, so Tab reaches it next.
 */
export function BulkActionBar({
  count,
  actions,
  onClear,
  variant = 'auto',
  countLabel: countLabelProp,
  clearLabel: clearLabelProp,
  moreLabel: moreLabelProp,
  'aria-label': ariaLabelProp,
  className,
}: BulkActionBarProps) {
  const m = useMessages();
  const countLabel = countLabelProp ?? m.bulkActionBar.count;
  const clearLabel = clearLabelProp ?? m.bulkActionBar.clear;
  const moreLabel = moreLabelProp ?? m.bulkActionBar.more;
  const ariaLabel = ariaLabelProp ?? m.bulkActionBar.label;
  const mobile = useMediaQuery(MOBILE_QUERY);
  const isMobile = variant === 'mobile' || (variant === 'auto' && mobile);
  const visible = count > 0;
  // Where focus came from (a row checkbox): it goes back there when the bar disappears under it.
  const returnTo = useRef<HTMLElement | null>(null);
  const focusInside = useRef(false);

  useEffect(() => {
    if (visible || !focusInside.current) return;
    focusInside.current = false;
    if (returnTo.current?.isConnected) returnTo.current.focus();
  }, [visible]);

  const shown = actions.slice(0, 3);
  const more = actions.slice(3);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && !e.defaultPrevented) {
      e.preventDefault();
      onClear();
    }
  };

  const overflow =
    more.length > 0 &&
    (isMobile ? (
      <MenuTrigger>
        <MenuButton aria-label={moreLabel} size="lg" />
        <OverflowMenu actions={more} />
      </MenuTrigger>
    ) : (
      <MenuTrigger>
        <AriaButton aria-label={moreLabel} className="medo-toast__button medo-toast__close">
          <Ellipsis aria-hidden="true" />
        </AriaButton>
        <OverflowMenu actions={more} />
      </MenuTrigger>
    ));

  return (
    <>
      {/* Always mounted, so the count is announced reliably (a new live region is often missed). */}
      <span role="status" className="medo-visually-hidden">
        {visible ? countLabel(count) : ''}
      </span>
      {visible && (
        // The wrapper handles Esc and remembers where focus came from (events bubble from the toolbar).
        <div
          className="medo-bulk-bar-host"
          onKeyDown={onKeyDown}
          onFocus={(e) => {
            focusInside.current = true;
            const from = e.relatedTarget as HTMLElement | null;
            if (from && !e.currentTarget.contains(from)) returnTo.current = from;
          }}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) focusInside.current = false;
          }}
        >
          <Toolbar aria-label={ariaLabel} className={cx('medo-bulk-bar', isMobile ? 'medo-bulk-bar--mobile' : 'medo-bulk-bar--desktop', className)}>
            {isMobile ? (
              <>
                <span className="medo-bulk-bar__start">
                  <IconButton variant="ghost" size="lg" icon={<X />} aria-label={clearLabel} tooltip={false} onPress={onClear} />
                  <span className="medo-bulk-bar__count">{countLabel(count)}</span>
                </span>
                <span className="medo-bulk-bar__actions">
                  {shown.map((a) => (
                    <Button key={a.label} variant={a.variant === 'danger' ? 'ghost-danger' : 'ghost'} size="lg" onPress={a.onAction}>
                      {a.label}
                    </Button>
                  ))}
                  {overflow}
                </span>
              </>
            ) : (
              <>
                <span className="medo-bulk-bar__count">{countLabel(count)}</span>
                <span className="medo-bulk-bar__divider" aria-hidden="true" />
                {shown.map((a) => (
                  <AriaButton key={a.label} className="medo-toast__button medo-toast__action" onPress={a.onAction}>
                    {a.label}
                  </AriaButton>
                ))}
                {overflow}
                <span className="medo-bulk-bar__divider" aria-hidden="true" />
                <AriaButton aria-label={clearLabel} className="medo-toast__button medo-toast__close" onPress={onClear}>
                  <X aria-hidden="true" />
                </AriaButton>
              </>
            )}
          </Toolbar>
        </div>
      )}
    </>
  );
}

function OverflowMenu({ actions }: { actions: BulkAction[] }) {
  return (
    <Menu onAction={(key) => actions[Number(key)]?.onAction()}>
      {actions.map((a, i) => (
        <MenuItem key={i} id={i} icon={a.icon} variant={a.variant === 'danger' ? 'danger' : 'default'}>
          {a.label}
        </MenuItem>
      ))}
    </Menu>
  );
}
