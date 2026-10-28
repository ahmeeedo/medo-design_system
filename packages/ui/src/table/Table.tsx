import type { CSSProperties, ReactNode } from 'react';
import {
  Cell as AriaCell,
  Checkbox as AriaCheckbox,
  Collection,
  Column as AriaColumn,
  Row as AriaRow,
  Table as AriaTable,
  TableBody as AriaTableBody,
  TableHeader as AriaTableHeader,
  useTableOptions,
  type CellProps as AriaCellProps,
  type ColumnProps as AriaColumnProps,
  type RowProps as AriaRowProps,
  type TableBodyProps as AriaTableBodyProps,
  type TableHeaderProps as AriaTableHeaderProps,
  type TableProps as AriaTableProps,
} from 'react-aria-components';
import { ArrowDown, ArrowUp, ArrowUpDown, Check, Minus } from 'lucide-react';
import { cx } from '../utils/cx';

type Density = 'standard' | 'compact';

/* ---------- Static table: a native <table> ---------- */

export interface StaticTableProps {
  /** thead / tbody / tr / th / td as usual. Use <th scope="row"> for row headers. */
  children: ReactNode;
  /** Visible caption or, with captionHidden, a name for screen readers. */
  caption?: ReactNode;
  captionHidden?: boolean;
  density?: Density;
  striped?: boolean;
  /** Without the border and radius, e.g. inside a card or documentation. */
  plain?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * Static table – a native, non-interactive table with the Table look.
 * For content and simple data. Numbers: add className="medo-table__cell--number".
 */
export function StaticTable({ children, caption, captionHidden, density = 'standard', striped, plain, className, style }: StaticTableProps) {
  return (
    <div className={cx('medo-table-container', plain && 'medo-table-container--plain', className)} style={style}>
      <table className={cx('medo-table', density === 'compact' && 'medo-table--compact', striped && 'medo-table--striped')}>
        {caption && <caption className={captionHidden ? 'medo-visually-hidden' : undefined}>{caption}</caption>}
        {children}
      </table>
    </div>
  );
}

/* ---------- Interactive table: React Aria Table (grid) ---------- */

export interface TableProps extends Omit<AriaTableProps, 'className' | 'style'> {
  density?: Density;
  /** Bar above the header: search (Input sm 240), filter, ColumnsMenu, primary action on the right (Buttons sm). */
  toolbar?: ReactNode;
  /** Bar below the rows, usually Pagination. */
  footer?: ReactNode;
  striped?: boolean;
  plain?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * Table – interactive data table. Built on React Aria Table:
 * arrow keys move between cells, Space selects, Enter opens, sortable headers announce the order.
 * Data logic (sorting, filtering, paging) stays in your code or a headless table library.
 */
export function Table({ density = 'standard', striped, plain, toolbar, footer, className, style, ...props }: TableProps) {
  const table = <AriaTable {...props} className={cx('medo-table', density === 'compact' && 'medo-table--compact', striped && 'medo-table--striped')} />;
  if (!toolbar && !footer) {
    return (
      <div className={cx('medo-table-container', plain && 'medo-table-container--plain', className)} style={style}>
        {table}
      </div>
    );
  }
  // Toolbar – rows – footer in one bordered surface; only the table scrolls.
  return (
    <div className={cx('medo-table-frame', plain && 'medo-table-frame--plain', className)} style={style}>
      {toolbar && <div className="medo-table__toolbar">{toolbar}</div>}
      <div className="medo-table-container medo-table-container--plain">{table}</div>
      {footer && <div className="medo-table__footer">{footer}</div>}
    </div>
  );
}

/** Checkbox for row selection (slot="selection"), styled like Checkbox md. */
function SelectionCheckbox() {
  return (
    <AriaCheckbox slot="selection" className="medo-choice medo-checkbox medo-choice--md medo-choice__button">
      {({ isSelected, isIndeterminate }) => (
        <span className="medo-choice__control" aria-hidden="true">
          {isIndeterminate ? <Minus /> : isSelected ? <Check /> : null}
        </span>
      )}
    </AriaCheckbox>
  );
}

export function TableHeader<T extends object>({ columns, children, ...props }: Omit<AriaTableHeaderProps<T>, 'className'>) {
  const { selectionBehavior, selectionMode, allowsDragging } = useTableOptions();
  return (
    <AriaTableHeader {...props} className="medo-table__header">
      {allowsDragging && <AriaColumn className="medo-table__column medo-table__column--utility" />}
      {selectionBehavior === 'toggle' && selectionMode !== 'none' && (
        <AriaColumn className="medo-table__column medo-table__column--utility">{selectionMode === 'multiple' && <SelectionCheckbox />}</AriaColumn>
      )}
      <Collection items={columns}>{children}</Collection>
    </AriaTableHeader>
  );
}

export interface ColumnProps extends Omit<AriaColumnProps, 'className' | 'children'> {
  children: ReactNode;
  /** end: numbers, amounts, dates – right-aligned with tabular figures. */
  align?: 'start' | 'end';
}

/** Header cell. With allowsSorting it is a button: ascending → descending → ascending. */
export function Column({ children, align = 'start', ...props }: ColumnProps) {
  return (
    <AriaColumn {...props} data-align={align} className="medo-table__column">
      {({ allowsSorting, sortDirection }) => (
        <span className="medo-table__column-inner">
          {children}
          {allowsSorting &&
            (sortDirection === 'ascending' ? (
              <ArrowUp className="medo-table__sort" aria-hidden="true" />
            ) : sortDirection === 'descending' ? (
              <ArrowDown className="medo-table__sort" aria-hidden="true" />
            ) : (
              <ArrowUpDown className="medo-table__sort" aria-hidden="true" />
            ))}
        </span>
      )}
    </AriaColumn>
  );
}

export function TableBody<T extends object>(props: Omit<AriaTableBodyProps<T>, 'className'>) {
  return <AriaTableBody {...props} className="medo-table__body" />;
}

export function Row<T extends object>({ id, columns, children, ...props }: Omit<AriaRowProps<T>, 'className'>) {
  const { selectionBehavior, selectionMode, allowsDragging } = useTableOptions();
  return (
    <AriaRow id={id} {...props} className="medo-table__row">
      {allowsDragging && <AriaCell className="medo-table__cell medo-table__cell--utility" />}
      {selectionBehavior === 'toggle' && selectionMode !== 'none' && (
        <AriaCell className="medo-table__cell medo-table__cell--utility">
          <SelectionCheckbox />
        </AriaCell>
      )}
      <Collection items={columns}>{children}</Collection>
    </AriaRow>
  );
}

export interface CellProps extends Omit<AriaCellProps, 'className'> {
  align?: 'start' | 'end';
}

export function Cell({ align = 'start', ...props }: CellProps) {
  return <AriaCell {...props} data-align={align} className="medo-table__cell" />;
}
