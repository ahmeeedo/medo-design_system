import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { GridList, GridListItem, useLocale, type GridListItemProps, type GridListProps } from 'react-aria-components';
import { ChevronRight } from 'lucide-react';
import { AvatarSizeContext } from '../avatar/Avatar';
import { Checkbox } from '../checkbox/Checkbox';
import { Skeleton } from '../progress/Progress';
import { cx } from '../utils/cx';
import './list-view.css';

export interface ListViewProps<T> extends Omit<GridListProps<T>, 'className' | 'style' | 'layout' | 'keyboardNavigationBehavior'> {
  /** Required: names the list (“Inbox”). */
  'aria-label'?: string;
  /** plain: full-page lists (inbox) · card: inside settings or dashboards (border, radius/lg) · cards: records on mobile (Table cards, use ListCard). */
  variant?: 'plain' | 'card' | 'cards';
  /** Shows 3 skeleton rows instead of the items (aria-busy). */
  isLoading?: boolean;
  /** Shown when there are no rows: an EmptyState with `size="inline"`. */
  emptyState?: ReactNode;
  className?: string;
}

/**
 * List view – an interactive list of objects in apps: inbox, people, files, notifications, settings
 *. Built on React Aria GridList: ↑ ↓ move between rows, Enter opens a row, Tab reaches
 * the controls inside a row (menu, switch, buttons). `selectionMode="multiple"` shows a checkbox per row and a click
 * toggles the row – use it without `onAction` (React Aria would run the action on click instead).
 * Rows can have swipe actions on touch (`swipeActions`) – the same actions always sit in the row's “…” menu.
 */
export function ListView<T extends object>({ variant = 'plain', isLoading = false, emptyState, className, children, items, ...props }: ListViewProps<T>) {
  if (isLoading) {
    return (
      <div role="list" aria-busy="true" aria-label={props['aria-label']} className={cx('medo-list-view', `medo-list-view--${variant}`, className)}>
        {Array.from({ length: 3 }, (_, i) =>
          variant === 'cards' ? (
            <div key={i} role="listitem" className="medo-list-card medo-list-card--loading">
              <span className="medo-list-card__content">
                <Skeleton width="50%" />
                <Skeleton width="35%" />
                <Skeleton width="70%" />
              </span>
            </div>
          ) : (
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
          ),
        )}
      </div>
    );
  }
  return (
    <GridList<T>
      {...props}
      items={items}
      // Tab reaches the controls inside a row.
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
  /** One trailing type per list: Badge, Menu (“…”), Switch or max 2 Button sm. With buttons the row has no action. */
  trailing?: ReactNode;
  /** The row navigates (href) – shows a chevron. */
  chevron?: boolean;
  /** New or unread: title and excerpt strong, meta in brand, dot below the meta, “Unread” for screen readers. */
  unread?: boolean;
  /** Screen-reader word for unread rows. */
  unreadLabel?: string;
  /**
   * Touch only: end = swipe toward the start (left in LTR, e.g. Delete) · start = swipe toward the end (a safe action,
   * e.g. Archive). Always put the same actions into the row's “…” menu – swipe is a shortcut, never the only way.
   */
  swipeActions?: { start?: SwipeAction; end?: SwipeAction };
}

export interface SwipeAction {
  /** Short verb (“Delete”, “Archive”). */
  label: string;
  icon: ReactNode;
  /** Runs on a full swipe or a tap on the revealed action. Delete: remove at once and offer “Undo” in a Toast. */
  onAction: () => void;
  /** danger: feedback/danger/solid (Delete) · primary: action/primary (Archive). */
  tone?: 'danger' | 'primary';
}

/** One row of a List view: leading – content – trailing. Height 48, 64 or 88 by lines. */
export function ListRow({ title, description, lines, leading, meta, trailing, chevron, unread, unreadLabel = 'Unread', swipeActions, ...props }: ListRowProps) {
  const rowLines = description ? (lines ?? 2) : 1;
  const swipe = swipeActions?.start || swipeActions?.end;
  return (
    <GridListItem
      {...props}
      textValue={title}
      className={cx('medo-list-row', `medo-list-row--lines-${rowLines}`, unread && 'medo-list-row--unread', swipe && 'medo-list-row--swipe')}
    >
      {({ selectionMode }) => {
        const content = (
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
        );
        return swipe ? <Swipeable actions={swipeActions!}>{content}</Swipeable> : content;
      }}
    </GridListItem>
  );
}

/* ---------- Swipe ---------- */

const SWIPE = {
  action: 88, // revealed action width – snaps open from here
  lock: 8, // px before the direction is decided
  full: 0.5, // share of the row width that triggers at once
  flick: 0.5, // px per ms
};

/** Only one row is open at a time. */
let closeOpenRow: (() => void) | null = null;

function Swipeable({ actions, children }: { actions: { start?: SwipeAction; end?: SwipeAction }; children: ReactNode }) {
  const { direction } = useLocale();
  const rtl = direction === 'rtl';
  const surface = useRef<HTMLSpanElement>(null);
  const drag = useRef<{ x: number; y: number; t: number; base: number; lock: 'x' | 'y' | null; id: number; buzzed: boolean } | null>(null);
  const [offset, setOffset] = useState(0); // logical: < 0 reveals the end action, > 0 the start action
  const [dragging, setDragging] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const open = offset !== 0 && !dragging;

  const close = () => setOffset(0);

  // An open row closes on a tap elsewhere, on scroll and on Esc.
  useEffect(() => {
    if (!open) return;
    closeOpenRow?.();
    closeOpenRow = close;
    const row = surface.current?.closest('.medo-list-row');
    const onDown = (e: Event) => !row?.contains(e.target as Node) && close();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('pointerdown', onDown, true);
    window.addEventListener('scroll', close, true);
    document.addEventListener('keydown', onKey);
    return () => {
      if (closeOpenRow === close) closeOpenRow = null;
      document.removeEventListener('pointerdown', onDown, true);
      window.removeEventListener('scroll', close, true);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const width = () => surface.current?.getBoundingClientRect().width ?? 0;
  const actionFor = (value: number) => (value < 0 ? actions.end : value > 0 ? actions.start : undefined);

  const trigger = (action: SwipeAction, side: number) => {
    // The row slides out (250 ms, accelerating), then the action runs – the app removes the row and shows “Undo”.
    setLeaving(true);
    setOffset(side * width());
    window.setTimeout(() => {
      action.onAction();
      setLeaving(false);
      setOffset(0);
    }, 250);
  };

  const onPointerDown = (e: ReactPointerEvent) => {
    if (e.pointerType === 'mouse') return; // touch and pen only – mouse and keyboard use the “…” menu
    drag.current = { x: e.clientX, y: e.clientY, t: e.timeStamp, base: offset, lock: null, id: e.pointerId, buzzed: false };
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    const d = drag.current;
    if (!d || e.pointerId !== d.id) return;
    const dx = (e.clientX - d.x) * (rtl ? -1 : 1);
    const dy = e.clientY - d.y;
    if (!d.lock) {
      if (Math.abs(dy) > SWIPE.lock && Math.abs(dy) > Math.abs(dx)) d.lock = 'y';
      else if (Math.abs(dx) > SWIPE.lock) {
        d.lock = 'x';
        setDragging(true);
        surface.current?.setPointerCapture(e.pointerId);
        // A swipe is not a press: cancel the row's press so it does not open.
        e.currentTarget.dispatchEvent(new PointerEvent('pointercancel', { bubbles: true, pointerId: e.pointerId, pointerType: e.pointerType }));
      }
    }
    if (d.lock !== 'x') return;
    let next = d.base + dx;
    // No action on that side: resist (rubber band) instead of revealing an empty area.
    if (!actionFor(next)) next = next / 4;
    // A short haptic tick when the full-swipe threshold is crossed (where supported).
    const past = Math.abs(next) >= width() * SWIPE.full && !!actionFor(next);
    if (past && !d.buzzed) navigator.vibrate?.(10);
    d.buzzed = past;
    setOffset(next);
  };

  const onPointerEnd = (e: ReactPointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d || d.lock !== 'x') return;
    setDragging(false);
    const action = actionFor(offset);
    const velocity = ((e.clientX - d.x) * (rtl ? -1 : 1)) / Math.max(1, e.timeStamp - d.t);
    const side = Math.sign(offset);
    if (!action) return close();
    if (Math.abs(offset) >= width() * SWIPE.full || (Math.abs(velocity) > SWIPE.flick && Math.sign(velocity) === side && Math.abs(offset) > SWIPE.action / 2))
      return trigger(action, side);
    setOffset(Math.abs(offset) >= SWIPE.action ? side * SWIPE.action : 0);
  };

  const revealed = actionFor(offset);
  return (
    <>
      {revealed && (
        // Visual shortcut for touch; keyboard and screen readers use the “…” menu, so it is hidden from them.
        <span
          className={cx(
            'medo-list-row__swipe-action',
            `medo-list-row__swipe-action--${offset < 0 ? 'end' : 'start'}`,
            `medo-list-row__swipe-action--${revealed.tone ?? 'primary'}`,
          )}
          style={{ inlineSize: Math.abs(offset) }}
          aria-hidden="true"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            trigger(revealed, Math.sign(offset));
          }}
        >
          <span className="medo-list-row__swipe-label">
            {revealed.icon}
            {revealed.label}
          </span>
        </span>
      )}
      <span
        ref={surface}
        className={cx('medo-list-row__surface', dragging && 'medo-list-row__surface--dragging', leaving && 'medo-list-row__surface--leaving')}
        style={{ transform: offset ? `translateX(${rtl ? -offset : offset}px)` : undefined }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={(e) => {
          // Our own cancel (to stop the press) must not end the swipe.
          if (!e.isTrusted) return;
          onPointerEnd(e);
        }}
      >
        {children}
        {/* While open, a tap on the row closes it instead of opening the row. */}
        {open && (
          <span
            className="medo-list-row__swipe-shield"
            aria-hidden="true"
            onPointerDown={(e) => {
              e.stopPropagation();
              close();
            }}
          />
        )}
      </span>
    </>
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

export interface ListCardProps extends Omit<GridListItemProps, 'children' | 'className' | 'style' | 'textValue'> {
  /** Required. The record (“INV-2026-0140”). Also the card's accessible name. */
  title: string;
  /** Key number on the right of the title (amount, count) – strong, never truncated. */
  amount?: ReactNode;
  /** Second line, e.g. the owner with an Avatar (sized xs automatically). */
  description?: ReactNode;
  /** Bottom left: date or other meta in caption. */
  meta?: ReactNode;
  /** Bottom right: status as Badge sm with dot. */
  status?: ReactNode;
}

/**
 * List card – a record as a card, the mobile form of a table row. Use inside
 * `<ListView variant="cards">`: the whole card opens the record (`href` or `onAction`); in selection mode
 * a checkbox lg shows and a tap toggles the card.
 */
export function ListCard({ title, amount, description, meta, status, ...props }: ListCardProps) {
  return (
    <GridListItem {...props} textValue={title} className="medo-list-card">
      {({ selectionMode }) => (
        <>
          {selectionMode !== 'none' && (
            <span className="medo-list-card__check">
              <Checkbox slot="selection" size="lg" />
            </span>
          )}
          <span className="medo-list-card__content">
            <span className="medo-list-card__top">
              <span className="medo-list-card__title">{title}</span>
              {amount && <span className="medo-list-card__amount">{amount}</span>}
            </span>
            {description && (
              <AvatarSizeContext.Provider value="xs">
                <span className="medo-list-card__description">{description}</span>
              </AvatarSizeContext.Provider>
            )}
            {(meta || status) && (
              <span className="medo-list-card__bottom">
                <span className="medo-list-card__meta">{meta}</span>
                {status}
              </span>
            )}
          </span>
        </>
      )}
    </GridListItem>
  );
}
