import { useLayoutEffect, useRef, type ReactNode } from 'react';
import {
  SelectionIndicator,
  Tab as AriaTab,
  TabList as AriaTabList,
  TabPanel as AriaTabPanel,
  Tabs as AriaTabs,
  type TabListProps as AriaTabListProps,
  type TabPanelProps as AriaTabPanelProps,
  type TabProps as AriaTabProps,
  type TabsProps as AriaTabsProps,
} from 'react-aria-components';
import { BadgeCount } from '../badge/Badge';
import { cx } from '../utils/cx';
import './tabs.css';

export interface TabsProps extends Omit<AriaTabsProps, 'className' | 'style' | 'orientation'> {
  /** md: tab 32 / track 40 · lg: 40 / 48. Below 640 px tabs are always lg. */
  size?: 'md' | 'lg';
  /** The tabs share the full width. Below 640 px automatic: up to 3 tabs fill, more scroll. */
  fullWidth?: boolean;
  className?: string;
}

/**
 * Tabs – switch between views of the same context, one panel visible at a time.
 * Built on React Aria Tabs: tablist / tab / tabpanel, only the selected tab is in the Tab order,
 * ← → move and select, Home / End. `keyboardActivation="manual"` for slow panels (select with Enter).
 * Keep the selected tab in the URL with `selectedKey` + `onSelectionChange`.
 */
export function Tabs({ size = 'md', fullWidth = false, className, ...props }: TabsProps) {
  return <AriaTabs {...props} className={cx('medo-tabs', `medo-tabs--${size}`, fullWidth && 'medo-tabs--full', className)} />;
}

export interface TabListProps<T> extends Omit<AriaTabListProps<T>, 'className' | 'style'> {
  /** Names the tabs when there is no visible heading („Project“). */
  'aria-label'?: string;
  className?: string;
}

/**
 * The track with the tabs. 2 to 6 tabs. Scrolls horizontally when it does not fit
 * (with a fade at the edge that still has tabs) – tabs never wrap.
 */
export function TabList<T extends object>({ className, ...props }: TabListProps<T>) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollEdges(ref);
  return <AriaTabList {...props} ref={ref} className={cx('medo-tabs__list', className)} />;
}

export interface TabProps extends Omit<AriaTabProps, 'className' | 'style' | 'children'> {
  /** Required. 1–2 words, a noun („Activity“). */
  children: string;
  /** Optional, then on all tabs. Decorative – the label carries the meaning. */
  icon?: ReactNode;
  /** Items waiting in the tab (Badge count, neutral). Hidden at 0. */
  count?: number;
  /** Screen-reader text of the count („3 new“). Without it the number is read as part of the name. */
  countLabel?: string;
}

/** One tab. The selected tab is a raised thumb that slides to the new tab with a snappy spring (no slide with reduced motion). */
export function Tab({ children, icon, count, countLabel, ...props }: TabProps) {
  return (
    <AriaTab {...props} className="medo-tab">
      <SelectionIndicator className="medo-tab__thumb" ref={revealInList} />
      {icon && (
        <span className="medo-tab__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="medo-tab__label">{children}</span>
      {count !== undefined && <BadgeCount count={count} tone="neutral" size="sm" label={countLabel ?? String(count)} />}
    </AriaTab>
  );
}

export interface TabPanelProps extends Omit<AriaTabPanelProps, 'className' | 'style' | 'shouldForceMount'> {
  /**
   * Keeps the panel (hidden) while another tab is selected, so input is never lost.
   * Set false for heavy panels (large tables, charts) to unmount them.
   */
  keepMounted?: boolean;
  className?: string;
}

/** The content of one tab, directly below the tab list. It is focusable when nothing inside is. */
export function TabPanel({ keepMounted = true, className, ...props }: TabPanelProps) {
  return <AriaTabPanel {...props} shouldForceMount={keepMounted} className={cx('medo-tabs__panel', className)} />;
}

/** The thumb mounts in the selected tab: scroll that tab fully into the track (without moving the page). */
function revealInList(thumb: HTMLDivElement | null) {
  const tab = thumb?.parentElement;
  const list = tab?.parentElement;
  if (!tab || !list || list.scrollWidth <= list.clientWidth) return;
  const start = tab.offsetLeft - list.offsetLeft;
  const end = start + tab.offsetWidth;
  if (start < list.scrollLeft) list.scrollTo({ left: start - 32 });
  else if (end > list.scrollLeft + list.clientWidth) list.scrollTo({ left: end - list.clientWidth + 32 });
}

/** Marks the edges that still have hidden tabs (data-scroll-start / data-scroll-end) for the fade. */
function useScrollEdges(ref: React.RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    const list = ref.current;
    if (!list) return;
    const update = () => {
      const max = list.scrollWidth - list.clientWidth;
      const start = Math.abs(list.scrollLeft); // RTL scrolls negative
      list.toggleAttribute('data-scroll-start', max > 1 && start > 1);
      list.toggleAttribute('data-scroll-end', max > 1 && start < max - 1);
    };
    update();
    list.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(list);
    return () => {
      list.removeEventListener('scroll', update);
      observer.disconnect();
    };
  }, [ref]);
}
