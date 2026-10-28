import { createContext, useContext, type HTMLAttributes, type ReactNode } from 'react';
import { Check, X } from 'lucide-react';
import { cx } from '../utils/cx';
import { useMessages } from '../i18n/I18n';

export type ListType = 'bullet' | 'number' | 'check';

const ListTypeContext = createContext<ListType>('bullet');

export interface ListProps extends Omit<HTMLAttributes<HTMLUListElement | HTMLOListElement>, 'children'> {
  /** bullet: unordered points (ul) · number: order matters (ol) · check: features, included first (ul). */
  type?: ListType;
  /** Without it the list takes the size of the surrounding text. sm body/sm · md body/md · lg body/lg. */
  size?: 'sm' | 'md' | 'lg';
  /** Number list: first number (e.g. a list that continues after a paragraph). */
  start?: number;
  /** 2–7 ListItems. A nested List inside an item is level 2 (max 2 levels). */
  children: ReactNode;
}

/**
 * List – a real list in running text: bullets, numbers or a feature list.
 * Plain markup, no library needed. Markers are neutral (text/secondary) in their own column; long items
 * wrap flush with their first line. Level 2 (a List inside a ListItem) switches the marker: ring, “a.”.
 */
export function List({ type = 'bullet', size, start, className, style, children, ...props }: ListProps) {
  const Tag = type === 'number' ? 'ol' : 'ul';
  // The markers are CSS counters: start them where the native `start` attribute says.
  const counter = type === 'number' && start !== undefined ? { counterReset: `medo-list ${start - 1}` } : undefined;
  return (
    <ListTypeContext.Provider value={type}>
      <Tag
        {...props}
        start={type === 'number' ? start : undefined}
        style={{ ...counter, ...style }}
        // The markers are drawn in CSS (list-style: none) – some browser and screen reader combinations then drop the list semantics, so set the role.
        role="list"
        className={cx('medo-list', `medo-list--${type}`, size && `medo-list--${size}`, className)}
      >
        {children}
      </Tag>
    </ListTypeContext.Provider>
  );
}

export interface ListItemProps extends Omit<HTMLAttributes<HTMLLIElement>, 'children'> {
  children: ReactNode;
  /** Feature list: not included – cross, muted text and a hidden “Not included:” for screen readers. */
  excluded?: boolean;
  /** Hidden prefix of excluded items. */
  excludedLabel?: string;
}

/** One item of a List. */
export function ListItem({ children, excluded, excludedLabel, className, ...props }: ListItemProps) {
  const m = useMessages();
  const type = useContext(ListTypeContext);
  const check = type === 'check';
  return (
    <li {...props} className={cx('medo-list__item', check && excluded && 'medo-list__item--excluded', className)}>
      {check && (
        <span className="medo-list__icon" aria-hidden="true">
          {excluded ? <X /> : <Check />}
        </span>
      )}
      {check && excluded && <span className="medo-visually-hidden">{excludedLabel ?? m.list.notIncluded} </span>}
      {children}
    </li>
  );
}

export interface DescriptionListProps extends HTMLAttributes<HTMLDListElement> {
  /** auto: stacked as soon as the list itself is narrower than 22.5 rem (360 px) (phone, Drawer, narrow column) · horizontal · stacked. */
  layout?: 'auto' | 'horizontal' | 'stacked';
  /** DescriptionItems. */
  children: ReactNode;
}

/** Description list – term–value pairs for details of a record, an order or a profile. */
export function DescriptionList({ layout = 'auto', className, children, ...props }: DescriptionListProps) {
  return (
    <dl {...props} className={cx('medo-dl', `medo-dl--${layout}`, className)}>
      {children}
    </dl>
  );
}

export interface DescriptionItemProps {
  /** The term (“Status”). */
  term: ReactNode;
  /** The value (“Active”). */
  children: ReactNode;
}

/** One term–value pair (a div grouping dt and dd – valid inside dl). */
export function DescriptionItem({ term, children }: DescriptionItemProps) {
  return (
    <div className="medo-dl__row">
      <dt className="medo-dl__term">{term}</dt>
      <dd className="medo-dl__value">{children}</dd>
    </div>
  );
}
