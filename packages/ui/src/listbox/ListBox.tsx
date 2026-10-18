import { createContext, useContext, type ReactNode } from 'react';
import {
  Collection,
  Header,
  ListBox as AriaListBox,
  ListBoxItem,
  ListBoxSection as AriaListBoxSection,
  Text,
  type ListBoxItemProps,
  type ListBoxProps as AriaListBoxProps,
} from 'react-aria-components';
import { Check } from 'lucide-react';
import { cx } from '../utils/cx';
import '../checkbox/choice.css';
import './listbox.css';

export type ListBoxSize = 'md' | 'lg';

const ListBoxSizeContext = createContext<ListBoxSize>('md');

export interface ListBoxProps<T> extends Omit<AriaListBoxProps<T>, 'className' | 'style'> {
  /** md on desktop · lg on mobile and in the Bottom Sheet. */
  size?: ListBoxSize;
  className?: string;
}

/**
 * Listbox – the list behind Select, Combobox and Bottom Sheet (Figma: C07 Option & Listbox).
 * Built on React Aria ListBox: arrow keys, type-ahead, Home/End; sections and separators.
 */
export function ListBox<T extends object>({ size = 'md', className, ...props }: ListBoxProps<T>) {
  return (
    <ListBoxSizeContext.Provider value={size}>
      <AriaListBox
        {...props}
        className={cx('medo-listbox', `medo-listbox--${size}`, className)}
      />
    </ListBoxSizeContext.Provider>
  );
}

export interface OptionProps extends Omit<ListBoxItemProps, 'children' | 'className' | 'style'> {
  /** Label. Long labels wrap; keep them short and put details into the description. */
  children: ReactNode;
  /** Second line in text/secondary. */
  description?: ReactNode;
  /** Decorative leading icon. */
  icon?: ReactNode;
}

/** Option – one row in a Listbox. Single: check on the right. Multi: checkbox on the left. */
export function Option({ children, description, icon, textValue, ...props }: OptionProps) {
  const size = useContext(ListBoxSizeContext);
  return (
    <ListBoxItem {...props} textValue={textValue ?? (typeof children === 'string' ? children : undefined)} className="medo-option">
      {({ isSelected, selectionMode }) => (
        <>
          {selectionMode === 'multiple' && (
            <span className={cx('medo-choice', 'medo-checkbox', `medo-choice--${size}`, 'medo-option__checkbox')} data-selected={isSelected || undefined} aria-hidden="true">
              <span className="medo-choice__control">{isSelected && <Check />}</span>
            </span>
          )}
          {icon && (
            <span className="medo-option__icon" aria-hidden="true">
              {icon}
            </span>
          )}
          <span className="medo-option__content">
            <Text slot="label" className="medo-option__label">
              {children}
            </Text>
            {description && (
              <Text slot="description" className="medo-option__description">
                {description}
              </Text>
            )}
          </span>
          {selectionMode !== 'multiple' && isSelected && (
            <span className="medo-option__check" aria-hidden="true">
              <Check />
            </span>
          )}
        </>
      )}
    </ListBoxItem>
  );
}

export interface ListBoxSectionProps<T> {
  /** Group heading (overline). Use headings only with two or more groups. */
  title: ReactNode;
  children: ReactNode | ((item: T) => ReactNode);
  items?: Iterable<T>;
  id?: string;
}

/**
 * A group of options with a heading (announced as the name of the group).
 * Groups are divided by a line automatically (a separator element is not allowed inside a listbox).
 */
export function ListBoxSection<T extends object>({ title, children, items, id }: ListBoxSectionProps<T>) {
  return (
    <AriaListBoxSection id={id} className="medo-listbox__section">
      <Header className="medo-listbox__header">{title}</Header>
      {typeof children === 'function' ? <Collection items={items}>{children}</Collection> : children}
    </AriaListBoxSection>
  );
}

/** Message row for empty and loading states – never an empty popup. */
export function ListBoxMessage({ children }: { children: ReactNode }) {
  return <div className="medo-listbox__message">{children}</div>;
}
