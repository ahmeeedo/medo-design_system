import type { ReactNode } from 'react';
import { GridList, GridListItem, type GridListItemProps, type GridListProps } from 'react-aria-components';
import { ChevronRight } from 'lucide-react';
import { AvatarSizeContext } from '../avatar/Avatar';
import { Checkbox } from '../checkbox/Checkbox';
import { Skeleton } from '../progress/Progress';
import { cx } from '../utils/cx';
import './list-view.css';

export interface ListViewProps<T> extends Omit<GridListProps<T>, 'className' | 'style' | 'layout' | 'keyboardNavigationBehavior'> {
  /** Required: names the list („Inbox“). */
  'aria-label'?: string;
  /** plain: full-page lists (inbox) · card: inside settings or dashboards (border, radius/lg). */
  variant?: 'plain' | 'card';
  /** Shows 3 skeleton rows instead of the items (aria-busy). */
  isLoading?: boolean;
  /** Shown when there are no rows (until the Empty state component exists: text and a next step). */
  emptyState?: ReactNode;
  className?: string;
}

/**
 * List view – an interactive list of objects in apps: inbox, people, files, notifications, settings
 * (Figma: C29 List view). Built on React Aria GridList: ↑ ↓ move between rows, Enter opens a row, Tab reaches
 * the controls inside a row (menu, switch, buttons). `selectionMode="multiple"` shows a checkbox per row and a click
 * toggles the row – use it without `onAction` (React Aria would run the action on click instead).
 * Swipe actions are a draft in Figma – the same actions belong in the row's „…“ menu.
 */
export function ListView<T extends object>({ variant = 'plain', isLoading = false, emptyState, className, children, items, ...props }: ListViewProps<T>) {
  if (isLoading) {
    return (
      <div role="list" aria-busy="true" aria-label={props['aria-label']} className={cx('medo-list-view', `medo-list-view--${variant}`, className)}>
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} role="listitem" className="medo-list-row medo-list-row--loading">
            <span className="medo-list-row__leading">
              <Skeleton shape="circle" width={40} height={40} />
            </span>
            <span className="medo-list-row__main">
              <span className="medo-list-row__content">
                <Skeleton width="40%" />
                <Skeleton width="70%" />
              </span>
            </span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <GridList<T>
      {...props}
      items={items}
      // Tab reaches the controls inside a row (Figma: accessibility).
      keyboardNavigationBehavior="tab"
      renderEmptyState={emptyState ? () => <div className="medo-list-view__empty">{emptyState}</div> : undefined}
      className={cx('medo-list-view', `medo-list-view--${variant}`, className)}
    >
      {children}
    </GridList>
  );
}

export interface ListRowProps extends Omit<GridListItemProps, 'children' | 'className' | 'style' | 'textValue'> {
  /** Required. One line, most important word first. Also the row's accessible name. */
  title: string;
  /** One line (2-line row) or two lines (`lines={3}`). */
  description?: ReactNode;
  /** 3: description up to two lines (row 88). Default: 1 without, 2 with a description. */
  lines?: 2 | 3;
  /** Avatar (sized automatically: sm in 1-line rows, lg otherwise), an icon tile (ListRowIcon) or a 40 px thumbnail. */
  leading?: ReactNode;
  /** Meta text (time, size) in caption. */
  meta?: ReactNode;
  /** One trailing type per list: Badge, Menu („…“), Switch or max 2 Button sm. With buttons the row has no action. */
  trailing?: ReactNode;
  /** The row navigates (href) – shows a chevron. */
  chevron?: boolean;
  /** New or unread: title and excerpt strong, meta in brand, dot below the meta, „Unread“ for screen readers. */
  unread?: boolean;
  /** Screen-reader word for unread rows. */
  unreadLabel?: string;
}

/** One row of a List view: leading – content – trailing. Height 48, 64 or 88 by lines. */
export function ListRow({ title, description, lines, leading, meta, trailing, chevron, unread, unreadLabel = 'Unread', ...props }: ListRowProps) {
  const rowLines = description ? (lines ?? 2) : 1;
  return (
    <GridListItem {...props} textValue={title} className={cx('medo-list-row', `medo-list-row--lines-${rowLines}`, unread && 'medo-list-row--unread')}>
      {({ selectionMode }) => (
        <>
          {selectionMode !== 'none' && (
            <span className="medo-list-row__check">
              <Checkbox slot="selection" />
            </span>
          )}
          {leading && (
            // Avatars size themselves: sm in 1-line rows, lg in 2–3 lines.
            <AvatarSizeContext.Provider value={rowLines === 1 ? 'sm' : 'lg'}>
              <span className="medo-list-row__leading">{leading}</span>
            </AvatarSizeContext.Provider>
          )}
          <span className="medo-list-row__main">
            <span className="medo-list-row__content">
              <span className="medo-list-row__title">
                {unread && <span className="medo-visually-hidden">{unreadLabel}: </span>}
                {title}
              </span>
              {description && <span className="medo-list-row__description">{description}</span>}
            </span>
            {(meta || unread) && (
              <span className="medo-list-row__meta">
                {meta && <span className="medo-list-row__meta-text">{meta}</span>}
                {unread && <span className="medo-list-row__dot" aria-hidden="true" />}
              </span>
            )}
            {trailing && <span className="medo-list-row__trailing">{trailing}</span>}
            {chevron && (
              <span className="medo-list-row__chevron" aria-hidden="true">
                <ChevronRight />
              </span>
            )}
          </span>
        </>
      )}
    </GridListItem>
  );
}

/** Leading icon in a 40 px tile (settings rows). Decorative – the title carries the meaning. */
export function ListRowIcon({ children }: { children: ReactNode }) {
  return (
    <span className="medo-list-row__icon" aria-hidden="true">
      {children}
    </span>
  );
}
