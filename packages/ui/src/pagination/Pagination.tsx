import { useId, useRef, useState, type ReactNode } from 'react';
import { Button as AriaButton, Link as AriaLink } from 'react-aria-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Select } from '../select/Select';
import { Option } from '../listbox/ListBox';
import { cx } from '../utils/cx';
import { MOBILE_QUERY, useMediaQuery } from '../utils/useMediaQuery';
import '../button/button.css';
import './pagination.css';

export interface PaginationProps {
  /** Current page (1-based, controlled). */
  page?: number;
  /** Start page when uncontrolled. */
  defaultPage?: number;
  /** Called with the new page (apps). Not needed with `getPageHref`. */
  onChange?: (page: number) => void;
  /** Websites: every page becomes a real link (“?page=5”) – shareable, back button works. Works with RouterProvider. */
  getPageHref?: (page: number) => string;
  /** Number of pages. Default: totalItems / pageSize. With 1 page nothing is shown. */
  totalPages?: number;
  /** Total count: shows the summary (“81–100 of 380”). */
  totalItems?: number;
  /** Rows per page. */
  pageSize?: number;
  /** Shows “Rows per page” (Select sm). */
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  /** auto: compact below 640 px · full: summary, rows per page and pages · compact: ‹ Page 5 of 19 › (narrow panels). */
  variant?: 'auto' | 'full' | 'compact';
  /** Full only: md 40 · lg 48 (touch). Compact is always lg. */
  size?: 'md' | 'lg';
  /** Name of the navigation region. */
  'aria-label'?: string;
  /** Texts (localize). */
  summary?: (from: number, to: number, total: number) => string;
  pageSizeLabel?: string;
  previousLabel?: string;
  nextLabel?: string;
  /** Accessible name of a page item and the compact text. */
  pageLabel?: (page: number) => string;
  compactLabel?: (page: number, totalPages: number) => string;
  className?: string;
}

/** Page numbers with ellipsis: max 7 items, first and last always, the current page with one neighbour each side. */
export function getPageItems(page: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  // Near the start or the end five pages in a row, so an ellipsis never hides a single page.
  if (page <= 4) return [1, 2, 3, 4, 5, 'ellipsis', totalPages];
  if (page >= totalPages - 3) return [1, 'ellipsis', ...Array.from({ length: 5 }, (_, i) => totalPages - 4 + i)];
  return [1, 'ellipsis', page - 1, page, page + 1, 'ellipsis', totalPages];
}

/**
 * Pagination – move through long lists page by page. A navigation region:
 * buttons for apps (`onChange`) or real links for websites (`getPageHref`). Full on desktop, compact below 640 px.
 * After a change the app scrolls to the top of the list and focuses its heading. “Load more” is a Button, not a variant.
 */
export function Pagination({
  page: pageProp,
  defaultPage = 1,
  onChange,
  getPageHref,
  totalPages: totalPagesProp,
  totalItems,
  pageSize = 20,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  variant = 'auto',
  size = 'md',
  'aria-label': ariaLabel = 'Pagination',
  summary = (from, to, total) => `${from}–${to} of ${total}`,
  pageSizeLabel = 'Rows per page',
  previousLabel = 'Previous page',
  nextLabel = 'Next page',
  pageLabel = (p) => `Page ${p}`,
  compactLabel = (p, total) => `Page ${p} of ${total}`,
  className,
}: PaginationProps) {
  const [innerPage, setInnerPage] = useState(defaultPage);
  const mobile = useMediaQuery(MOBILE_QUERY);
  const totalPages = totalPagesProp ?? (totalItems !== undefined ? Math.ceil(totalItems / pageSize) : 1);
  const page = Math.min(Math.max(pageProp ?? innerPage, 1), Math.max(totalPages, 1));
  const compact = variant === 'compact' || (variant === 'auto' && mobile);
  const itemSize = compact ? 'lg' : size;
  const statusId = useId();
  const navRef = useRef<HTMLElement>(null);

  // One page: nothing to navigate.
  if (totalPages <= 1) return null;

  const go = (p: number) => {
    if (pageProp === undefined) setInnerPage(p);
    onChange?.(p);
    // “Next” on the second-last page becomes disabled and drops focus. If the app did not move focus
    // (to the list heading), keep it in the pagination: on the current page, or on the other arrow.
    requestAnimationFrame(() => {
      const nav = navRef.current;
      if (!nav || (document.activeElement && document.activeElement !== document.body)) return;
      (nav.querySelector<HTMLElement>('[aria-current="page"]') ?? nav.querySelector<HTMLElement>('.medo-button:not([data-disabled])'))?.focus();
    });
  };

  /** A page item, previous or next: a link on websites, a button in apps. */
  const item = (target: number, props: { className: string; 'aria-label': string; 'aria-current'?: 'page'; isDisabled?: boolean; children: ReactNode }) =>
    getPageHref ? (
      <AriaLink {...props} href={props.isDisabled ? undefined : getPageHref(target)} onPress={() => go(target)} />
    ) : (
      <AriaButton {...props} onPress={() => go(target)} />
    );

  const step = (target: number, label: string, icon: ReactNode) =>
    item(target, {
      className: cx('medo-button', 'medo-button--icon-only', 'medo-button--ghost', `medo-button--${itemSize}`),
      'aria-label': label,
      isDisabled: target < 1 || target > totalPages,
      children: (
        <span className="medo-button__icon" aria-hidden="true">
          {icon}
        </span>
      ),
    });

  const from = (page - 1) * pageSize + 1;
  const to = totalItems !== undefined ? Math.min(page * pageSize, totalItems) : page * pageSize;

  return (
    <nav ref={navRef} aria-label={ariaLabel} className={cx('medo-pagination', compact ? 'medo-pagination--compact' : 'medo-pagination--full', className)}>
      {compact ? (
        <>
          {step(page - 1, previousLabel, <ChevronLeft />)}
          {/* Polite live region: the new page is announced after a change. */}
          <p role="status" className="medo-pagination__compact-label">
            {compactLabel(page, totalPages)}
          </p>
          {step(page + 1, nextLabel, <ChevronRight />)}
        </>
      ) : (
        <>
          {(totalItems !== undefined || onPageSizeChange) && (
            <div className="medo-pagination__info">
              {totalItems !== undefined && (
                <p id={statusId} role="status" className="medo-pagination__summary">
                  {summary(from, to, totalItems)}
                </p>
              )}
              {onPageSizeChange && (
                <Select
                  label={pageSizeLabel}
                  size="sm"
                  selectedKey={pageSize}
                  onSelectionChange={(key) => key != null && onPageSizeChange(Number(key))}
                  className="medo-pagination__size"
                >
                  {pageSizeOptions.map((n) => (
                    <Option key={n} id={n}>
                      {String(n)}
                    </Option>
                  ))}
                </Select>
              )}
            </div>
          )}
          <ul className="medo-pagination__pages" role="list">
            <li>{step(page - 1, previousLabel, <ChevronLeft />)}</li>
            {getPageItems(page, totalPages).map((p, i) =>
              p === 'ellipsis' ? (
                // Text, not a button – hidden from screen readers (the page names say where they jump).
                <li key={`e${i}`} className={cx('medo-page-item', 'medo-page-item--ellipsis', `medo-page-item--${itemSize}`)} aria-hidden="true">
                  …
                </li>
              ) : (
                <li key={p}>
                  {item(p, {
                    className: cx('medo-button', 'medo-button--ghost', `medo-button--${itemSize}`, 'medo-page-item', `medo-page-item--${itemSize}`),
                    'aria-label': pageLabel(p),
                    'aria-current': p === page ? 'page' : undefined,
                    children: p,
                  })}
                </li>
              ),
            )}
            <li>{step(page + 1, nextLabel, <ChevronRight />)}</li>
          </ul>
        </>
      )}
    </nav>
  );
}
